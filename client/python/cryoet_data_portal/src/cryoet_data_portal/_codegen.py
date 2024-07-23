"""This module generates model code from the GraphQL schema."""

import inspect
import logging
import pathlib
import re
from dataclasses import dataclass
from textwrap import dedent

from graphql import GraphQLField, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLType, build_schema

from cryoet_data_portal import _model_stubs


"""Maps GraphQL field type names to model field defaults and Python types."""
GQL_TO_MODEL_FIELD = {
    "Boolean": ("BooleanField()", "bool"),
    "Float": ("IntField()", "int"),
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
    """Describes the information about a parsed model field."""
    name: str
    description: str
    annotation_type: str
    default_value: str


def load_schema() -> GraphQLSchema:
    with open(pathlib.Path(__file__).parent / "data/schema.graphql", "r") as f:
        schema_str = f.read()
    return build_schema(schema_str)


def write_models() -> None:
    schema = load_schema()
    with open(pathlib.Path(__file__).parent / "_codegen_models.py", "w") as f:
        f.write(dedent("""
            from __future__ import annotations
            import os
            from datetime import date
            from typing import List, Optional

            from cryoet_data_portal._file_tools import download_directory, download_https
            from cryoet_data_portal._gql_base import (
                BooleanField,
                DateField,
                FloatField,
                IntField,
                ItemRelationship,
                ListRelationship,
                Model,
                StringField,
            )
            """
        ))
 
        for gql, model in GQL_TO_MODEL_TYPE.items():
            logging.debug("Parsing gql type %s to model %s", gql, model)
            gql_type = schema.get_type(gql)
            assert isinstance(gql_type, GraphQLObjectType)

            fields = parse_fields(gql_type)

            # Write class name
            f.write(f"\n\nclass {model}(Model):\n")

            # Write docstring
            f.write(f"    \"\"\"{gql_type.description}\n\n")
            f.write(f"    Attributes:\n")
            for field in fields:
                f.write(f"        {field.name} ({field.annotation_type}): {field.description}\n")
            f.write(f"    \"\"\"\n\n")

            # Write _gql_type
            f.write(f"    _gql_type: str = \"{gql}\"\n\n")

            # Write model types
            for field in fields:
                f.write(f"    {field.name}: {field.annotation_type} = {field.default_value}\n")

            # Write utility methods
            model_type = GQL_TO_MODEL_TYPE[gql]
            if model_class := getattr(_model_stubs, model_type, None):
                utils = inspect.getmembers(model_class, inspect.isfunction)
                for _, util in utils:
                    source = inspect.getsource(util)
                    f.write(f"\n{source}")

        # Write model setup calls
        f.write("\n")
        for model in GQL_TO_MODEL_TYPE.values():
            f.write(f"\n{model}.setup()")


def parse_fields(gql_type: GraphQLObjectType) -> list[FieldInfo]: 
    fields = []
    for name, field in gql_type.fields.items():
        if parsed := parse_field(gql_type, name, field):
            logging.debug("Parsed %s", parsed)
            fields.append(parsed)
    return fields


def parse_field(gql_type: GraphQLObjectType, name: str, field: GraphQLField) -> FieldInfo | None:
    logging.debug("parse_field: %s, %s", name, field)
    field_type = _maybe_unwrap_non_null(field.type)
    if isinstance(field_type, GraphQLList):
        return parse_list_field(gql_type, name, field.description, field_type)
    if isinstance(field_type, GraphQLObjectType):
        return parse_object_field(name, field.description, field_type)
    if isinstance(field_type, GraphQLScalarType):
        return parse_scalar_field(name, field.description, field_type)
 

def parse_scalar_field(name: str, description: str, field_type: GraphQLScalarType) -> FieldInfo | None:
    logging.debug("parse_scalar_field: %s", field_type)
    if field_type.name in GQL_TO_MODEL_FIELD:
        default_value, annotation_type = GQL_TO_MODEL_FIELD[field_type.name]
        return FieldInfo(
            name=name,
            description=description,
            annotation_type=annotation_type,
            default_value=default_value,
        )
 

def parse_object_field(name: str, description: str, field_type: GraphQLObjectType) -> FieldInfo | None:
    logging.debug("parse_object_field: %s", field_type)
    if model := GQL_TO_MODEL_TYPE.get(field_type.name):
        model_field = _camel_to_snake_case(model)
        return FieldInfo(
            name=name,
            description=description,
            annotation_type=model,
            default_value=f"ItemRelationship({model}, \"{model_field}_id\", \"id\")",
        )


def parse_list_field(gql_type: GraphQLObjectType, name: str, description: str, field_type: GraphQLList) -> FieldInfo | None:
    logging.debug("parse_list_field: %s", field_type)
    of_type = _maybe_unwrap_non_null(field_type.of_type)
    foreign_field = _camel_to_snake_case(GQL_TO_MODEL_TYPE[gql_type.name])
    if of_model := GQL_TO_MODEL_TYPE.get(of_type.name):
        return FieldInfo(
            name=name,
            description=description,
            annotation_type=f"List[{of_model}]",
            default_value=f"ListRelationship(\"{of_model}\", \"id\", \"{foreign_field}_id\")",
        )


def _maybe_unwrap_non_null(field_type: GraphQLType) -> GraphQLType:
    if isinstance(field_type, GraphQLNonNull):
        return field_type.of_type
    return field_type


def _camel_to_snake_case(name: str) -> str:
    return re.sub("(?!^)([A-Z]+)", r"_\1", name).lower()


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    write_models()