"""This module generates model code from the GraphQL schema."""

import logging
import pathlib
import re
from dataclasses import dataclass
from typing import List, Optional

from graphql import (
    GraphQLField,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLSchema,
    GraphQLType,
    build_schema,
)
from jinja2 import Environment, FileSystemLoader

"""Maps GraphQL field type names to model field defaults and Python types."""
GQL_TO_MODEL_FIELD = {
    "Boolean": ("BooleanField()", "bool"),
    "Float": ("FloatField()", "float"),
    "Int": ("IntField()", "int"),
    "String": ("StringField()", "str"),
    "date": ("DateField()", "date"),
    "numeric": ("FloatField()", "float"),
    "_numeric": ("StringField()", "str"),
    "tomogram_type_enum": ("StringField()", "str"),
}


"""Maps GraphQL type names to model class names."""
GQL_TO_MODEL_TYPE = {
    "datasets": "Dataset",
    "dataset_authors": "DatasetAuthor",
    "dataset_funding": "DatasetFunding",
    "runs": "Run",
    "tomogram_voxel_spacings": "TomogramVoxelSpacing",
    "tomograms": "Tomogram",
    "tomogram_authors": "TomogramAuthor",
    "annotations": "Annotation",
    "annotation_files": "AnnotationFile",
    "annotation_authors": "AnnotationAuthor",
    "tiltseries": "TiltSeries",
}


@dataclass(frozen=True)
class FieldInfo:
    """The information about a parsed model field."""

    name: str
    description: str
    annotation_type: str
    default_value: str


def write_models(path: str) -> None:
    schema = load_schema()
    environment = load_environment()
    with open(path, "w") as f:
        template = environment.get_template("Header.jinja2")
        content = template.render()
        f.write(content)

        for gql, model in GQL_TO_MODEL_TYPE.items():
            logging.info("Parsing gql type %s to model %s", gql, model)
            gql_type = schema.get_type(gql)
            assert isinstance(gql_type, GraphQLObjectType)
            fields = parse_fields(gql_type)
            template = environment.select_template((f"{model}.jinja2", "Model.jinja2"))
            content = template.render(
                cls=model,
                gql_type=gql_type,
                fields=fields,
            )
            f.write(content)

        template = environment.get_template("Footer.jinja2")
        content = template.render(models=GQL_TO_MODEL_TYPE.values())
        f.write(content)


def load_schema() -> GraphQLSchema:
    with open(pathlib.Path(__file__).parent / "data" / "schema.graphql", "r") as f:
        schema_str = f.read()
    return build_schema(schema_str)


def load_environment() -> Environment:
    template_dir = pathlib.Path(__file__).parent / "templates"
    loader = FileSystemLoader(template_dir)
    return Environment(
        loader=loader,
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )


def parse_fields(gql_type: GraphQLObjectType) -> List[FieldInfo]:
    fields = []
    for name, field in gql_type.fields.items():
        parsed = _parse_field(gql_type, name, field)
        if parsed is not None:
            logging.info("Parsed field %s", parsed)
            fields.append(parsed)
    return fields


def _parse_field(
    gql_type: GraphQLObjectType,
    name: str,
    field: GraphQLField,
) -> Optional[FieldInfo]:
    logging.debug("_parse_field: %s, %s", name, field)
    field_type = _maybe_unwrap_non_null(field.type)
    if isinstance(field_type, GraphQLList):
        return _parse_model_list_field(gql_type, name, field.description, field_type)
    if isinstance(field_type, GraphQLObjectType) and (
        field_type.name in GQL_TO_MODEL_TYPE
    ):
        return _parse_model_field(name, field.description, field_type)
    return _parse_scalar_field(name, field.description, field_type)


def _parse_scalar_field(
    name: str,
    description: str,
    field_type: GraphQLScalarType,
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


def _parse_model_field(
    name: str,
    description: str,
    field_type: GraphQLObjectType,
) -> Optional[FieldInfo]:
    logging.debug("_parse_model_field: %s", field_type)
    model = GQL_TO_MODEL_TYPE.get(field_type.name)
    if model is not None:
        model_field = _camel_to_snake_case(model)
        return FieldInfo(
            name=name,
            description=description,
            annotation_type=model,
            default_value=f'ItemRelationship({model}, "{model_field}_id", "id")',
        )


def _parse_model_list_field(
    gql_type: GraphQLObjectType,
    name: str,
    description: str,
    field_type: GraphQLList,
) -> Optional[FieldInfo]:
    logging.debug("_parse_model_list_field: %s", field_type)
    of_type = _maybe_unwrap_non_null(field_type.of_type)
    foreign_field = _camel_to_snake_case(GQL_TO_MODEL_TYPE[gql_type.name])
    of_model = GQL_TO_MODEL_TYPE.get(of_type.name)
    if of_model is not None:
        return FieldInfo(
            name=name,
            description=description,
            annotation_type=f"List[{of_model}]",
            default_value=f'ListRelationship("{of_model}", "id", "{foreign_field}_id")',
        )


def _maybe_unwrap_non_null(field_type: GraphQLType) -> GraphQLType:
    if isinstance(field_type, GraphQLNonNull):
        return field_type.of_type
    return field_type


def _camel_to_snake_case(name: str) -> str:
    return re.sub("(?!^)([A-Z]+)", r"_\1", name).lower()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    path = pathlib.Path(__file__).parent / "_models.py"
    write_models(str(path))
