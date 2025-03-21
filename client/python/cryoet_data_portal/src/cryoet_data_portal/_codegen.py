"""This module generates model code from the GraphQL schema."""

import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Tuple, Union

import strcase
from gql import Client
from gql.transport.requests import RequestsHTTPTransport
from graphql import (
    GraphQLEnumType,
    GraphQLField,
    GraphQLList,
    GraphQLNamedType,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLSchema,
    GraphQLType,
    build_schema,
    get_named_type,
    print_schema,
)
from jinja2 import Environment, FileSystemLoader

from cryoet_data_portal._client import DEFAULT_URL

"""Maps GraphQL field type names to model field defaults and Python types."""
GQL_TO_MODEL_FIELD = {
    "Boolean": ("BooleanField()", "bool"),
    "Float": ("FloatField()", "float"),
    "Int": ("IntField()", "int"),
    "String": ("StringField()", "str"),
    "DateTime": ("DateField()", "date"),
    "numeric": ("FloatField()", "float"),
    "_numeric": ("StringField()", "str"),
    "annotation_file_source_enum": ("StringField()", "str"),
    "alignment_method_type_enum": ("StringField()", "str"),
    "annotation_method_type_enum": ("StringField()", "str"),
    "annotation_file_shape_type_enum": ("StringField()", "str"),
    "annotation_method_link_type_enum": ("StringField()", "str"),
    "deposition_types_enum": ("StringField()", "str"),
    "sample_type_enum": ("StringField()", "str"),
    "tiltseries_camera_acquire_mode_enum": ("StringField()", "str"),
    "tiltseries_microscope_manufacturer_enum": ("StringField()", "str"),
    "fiducial_alignment_status_enum": ("StringField()", "str"),
    "tomogram_processing_enum": ("StringField()", "str"),
    "tomogram_reconstruction_method_enum": ("StringField()", "str"),
    "alignment_type_enum": ("StringField()", "str"),
}


"""Maps GraphQL type names to model class names."""
GQL_TO_MODEL_TYPE = {
    "Alignment": "Alignment",
    "Annotation": "Annotation",
    "AnnotationAuthor": "AnnotationAuthor",
    "AnnotationFile": "AnnotationFile",
    "AnnotationMethodLink": "AnnotationMethodLink",
    "AnnotationShape": "AnnotationShape",
    "Dataset": "Dataset",
    "DatasetAuthor": "DatasetAuthor",
    "DatasetFunding": "DatasetFunding",
    "Deposition": "Deposition",
    "DepositionAuthor": "DepositionAuthor",
    "DepositionType": "DepositionType",
    "Frame": "Frame",
    "FrameAcquisitionFile": "FrameAcquisitionFile",
    "GainFile": "GainFile",
    "PerSectionAlignmentParameters": "PerSectionAlignmentParameters",
    "PerSectionParameters": "PerSectionParameters",
    "Run": "Run",
    "Tiltseries": "TiltSeries",
    "Tomogram": "Tomogram",
    "TomogramAuthor": "TomogramAuthor",
    "TomogramVoxelSpacing": "TomogramVoxelSpacing",
}


"""The path of directory containing this module."""
_THIS_DIR = Path(__file__).parent

"""The local schema path."""
SCHEMA_PATH = _THIS_DIR / "data" / "schema.graphql"

"""The local models module path."""
MODELS_PATH = _THIS_DIR / "_models.py"


@dataclass(frozen=True)
class FieldInfo:
    """The information about a parsed model field."""

    name: str
    annotation_type: str
    default_value: str
    description: Optional[str] = None


@dataclass(frozen=True)
class ModelInfo:
    """The information about a parsed model."""

    name: str
    gql_type: str
    root_field: str
    plural: str
    plural_underscores: str
    model_name_underscores: str
    fields: Tuple[FieldInfo, ...]
    description: Optional[str] = None


def update_schema_and_models(
    *,
    gql_url: str,
    schema_path: Path,
    models_path: Path,
) -> None:
    """Writes new schema and models files based on a GraphQL endpoint URL."""
    schema = fetch_schema(gql_url)
    if schema is None:
        raise RuntimeError(f"Could not get schema at {gql_url}")
    write_schema(schema, schema_path)
    models = get_models(schema)
    write_models(models, models_path)


def write_models(models: Tuple[ModelInfo, ...], path: Path) -> None:
    """Writes model classes to a Python module in a local file."""
    environment = _load_jinja_environment()
    with open(path, "w") as f:
        template = environment.get_template("Header.jinja2")
        f.write(template.render())
        for model in sorted(models, key=lambda x: x.name):
            template = environment.select_template(
                (f"{model.name}.jinja2", "Model.jinja2"),
            )
            f.write(template.render(model=model))
        template = environment.get_template("Footer.jinja2")
        f.write(template.render(models=(m.name for m in models)))


def get_models(schema: GraphQLSchema) -> Tuple[ModelInfo, ...]:
    """Gets the model and field information from a GraphQL schema."""
    models = []
    for gql, model in GQL_TO_MODEL_TYPE.items():
        logging.info("Parsing gql type %s to model %s", gql, model)
        gql_type = schema.get_type(gql)
        assert isinstance(gql_type, GraphQLObjectType)
        fields = parse_fields(gql_type)
        model_name_spaces = _camel_to_space_case(model)
        plural_model_name = _space_case_to_plural(model_name_spaces)
        models.append(
            ModelInfo(
                name=model,
                gql_type=gql_type.name,
                plural=plural_model_name,
                plural_underscores=plural_model_name.replace(" ", "_"),
                model_name_underscores=model_name_spaces.replace(" ", "_"),
                root_field=get_root_field_name(schema, gql_type),
                description=gql_type.description,
                fields=fields,
            ),
        )
    models = sorted(models, key=lambda x: x.name)
    return tuple(models)


def fetch_schema(url: str) -> Optional[GraphQLSchema]:
    """Gets the GraphQL schema from a URL endpoint."""
    transport = RequestsHTTPTransport(url=url, retries=3)
    with Client(transport=transport, fetch_schema_from_transport=True) as session:
        return session.client.schema


def write_schema(schema: GraphQLSchema, path: Path) -> None:
    """Writes a GraphQL schema it to a local file."""
    schema_str = print_schema(schema)
    with open(path, "w") as f:
        f.write(schema_str)


def load_schema(path: Path) -> GraphQLSchema:
    """Returns the GraphQL schema defined in a local file."""
    with open(path, "r") as f:
        schema_str = f.read()
    return build_schema(schema_str)


def get_root_field_name(schema, gql_type: GraphQLObjectType) -> str:
    """Look up the root field name that represents the given GQL Type"""
    """NOTE that this assumes all queried types are present at the query root!"""
    root = schema.get_type("Query")
    for name, field in root.fields.items():
        field_type = get_named_type(field.type)
        if field_type.name == gql_type.name:
            return name
    raise RuntimeError(f"Could not root field for {gql_type.name}")


def parse_fields(gql_type: GraphQLObjectType) -> Tuple[FieldInfo, ...]:
    """Returns the field information parsed from a GraphQL object type."""
    fields = []
    for name, field in gql_type.fields.items():
        parsed = _parse_field(gql_type, name, field)
        if parsed is not None:
            logging.info("Parsed field %s", parsed)
            fields.append(parsed)
        else:
            logging.warning(
                "Failed to parse field: %s, %s, %r",
                gql_type.name,
                name,
                field,
            )
    return tuple(fields)


def _parse_field(
    gql_type: GraphQLObjectType,
    name: str,
    field: GraphQLField,
) -> Optional[FieldInfo]:
    logging.debug("_parse_field: %s, %s", name, field)
    field_type = _maybe_unwrap_non_null(field.type)
    if isinstance(field_type, GraphQLList):
        return _parse_gql_list_field(name, field.description, field_type)
    if field_type.name.endswith("Connection"):  # TODO can we clean this up?
        return _parse_model_list_field(gql_type, name, field_type)
    if isinstance(field_type, GraphQLObjectType) and (
        field_type.name in GQL_TO_MODEL_TYPE
    ):
        return _parse_model_field(gql_type, name, field_type)
    if isinstance(field_type, (GraphQLScalarType, GraphQLEnumType)):
        return _parse_scalar_field(name, field.description, field_type)
    return None


# TODO - we only support list[list[float]] fields right now,
# so this method is overly simplistic.
def _parse_gql_list_field(
    name: str,
    description: Optional[str],
    field_type: GraphQLList,
) -> Optional[FieldInfo]:
    logging.debug("_parse_gql_list_field: %s", field_type)
    return FieldInfo(
        name=name,
        description=description,
        annotation_type="List[List[float]]",
        default_value="ListField()",
    )


def _parse_scalar_field(
    name: str,
    description: Optional[str],
    field_type: Union[GraphQLScalarType, GraphQLEnumType],
) -> Optional[FieldInfo]:
    logging.debug("_parse_scalar_field: %s", field_type)
    if field_type.name in GQL_TO_MODEL_FIELD:
        default_value, annotation_type = GQL_TO_MODEL_FIELD[field_type.name]
        return FieldInfo(
            name=name,
            description=description,
            annotation_type=annotation_type,
            default_value=default_value,
        )
    return None


def _parse_model_field(
    gql_type: GraphQLObjectType,
    name: str,
    field_type: GraphQLObjectType,
) -> Optional[FieldInfo]:
    logging.debug("_parse_model_field: %s", field_type)
    model = GQL_TO_MODEL_TYPE.get(field_type.name)
    if model is not None:
        model_field = to_snake(name)
        model_name = _camel_to_space_case(model)
        source_model = GQL_TO_MODEL_TYPE[gql_type.name]
        source_model_name = _camel_to_space_case(source_model)
        return FieldInfo(
            name=name,
            description=f"The {model_name} this {source_model_name} is a part of",
            annotation_type=model,
            default_value=f'ItemRelationship("{model}", "{model_field}_id", "id")',
        )
    return None


def _get_remote_field_name_by_type(
    model_cls: GraphQLObjectType,
    lookup_type: GraphQLObjectType,
) -> str:
    for name, field in model_cls.fields.items():
        if field.type == lookup_type:
            return name
    raise Exception(
        f"Relationship lookup for a type:{lookup_type} field on {model_cls} failed",
    )


def _parse_model_list_field(
    gql_type: GraphQLObjectType,
    name: str,
    field_type: GraphQLList[GraphQLType],
) -> Optional[FieldInfo]:
    logging.debug("_parse_model_list_field: %s", field_type)
    of_type = get_named_type(
        get_named_type(field_type.fields["edges"].type).fields["node"].type,
    )
    if not isinstance(of_type, GraphQLNamedType):
        return None
    of_model = GQL_TO_MODEL_TYPE.get(of_type.name)
    if of_model is not None:
        source_model = GQL_TO_MODEL_TYPE[gql_type.name]
        source_field = to_snake(_get_remote_field_name_by_type(of_type, gql_type))
        source_model_name = _camel_to_space_case(source_model)
        of_model_name = _space_case_to_plural(_camel_to_space_case(of_model))
        return FieldInfo(
            name=name,
            description=f"The {of_model_name} of this {source_model_name}",
            annotation_type=f"List[{of_model}]",
            default_value=f'ListRelationship("{of_model}", "id", "{source_field}_id")',
        )
    return None


def _maybe_unwrap_non_null(field_type: GraphQLType) -> GraphQLType:
    if isinstance(field_type, GraphQLNonNull):
        return field_type.of_type
    return field_type


def _camel_to_space_case(name: str) -> str:
    return strcase.to_snake(name).replace("_", " ")


def to_snake(input_str):
    res = strcase.to_snake(input_str)
    res = re.sub("^s_3_", "s3_", res)
    return res


def _space_case_to_plural(name: str) -> str:
    return name if name[-1] == "s" else f"{name}s"


def _load_jinja_environment() -> Environment:
    template_dir = _THIS_DIR / "templates"
    loader = FileSystemLoader(template_dir)
    env = Environment(
        loader=loader,
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    env.filters["to_snake"] = to_snake
    return env


if __name__ == "__main__":
    logging.basicConfig(level=logging.WARN)
    update_schema_and_models(
        gql_url=DEFAULT_URL,
        schema_path=SCHEMA_PATH,
        models_path=MODELS_PATH,
    )
