from pathlib import Path

import pytest
from graphql import GraphQLObjectType, GraphQLSchema

from cryoet_data_portal._codegen import (
    GQL_TO_MODEL_TYPE,
    SCHEMA_PATH,
    ModelInfo,
    get_models,
    get_schema,
    load_schema,
    parse_fields,
    write_schema,
)


def test_load_schema():
    schema = load_schema(SCHEMA_PATH)
    assert isinstance(schema, GraphQLSchema)


def test_get_schema(server_url: str):
    schema = get_schema(server_url)
    assert isinstance(schema, GraphQLSchema)


def test_write_schema(tmp_path: Path):
    schema = load_schema(SCHEMA_PATH)
    output_schema_path = tmp_path / "schema.graphql"
    write_schema(schema, output_schema_path)
    with open(SCHEMA_PATH, "r") as schema_file:
        schema_contents = schema_file.read().rstrip()
    with open(output_schema_path, "r") as output_schema_file:
        output_schema_contents = output_schema_file.read().rstrip()
    assert schema_contents == output_schema_contents


def test_get_models():
    schema = load_schema(SCHEMA_PATH)
    models = get_models(schema)
    assert len(models) > 0
    assert all(isinstance(m, ModelInfo) for m in models)
    model_names = tuple(m.name for m in models)
    assert model_names == tuple(GQL_TO_MODEL_TYPE.values())


@pytest.mark.parametrize("gql_type", GQL_TO_MODEL_TYPE.keys())
def test_parse_fields_dataset(gql_type: str):
    schema = load_schema(SCHEMA_PATH)
    dataset_type = schema.get_type(gql_type)
    assert isinstance(dataset_type, GraphQLObjectType)
    fields = parse_fields(dataset_type)
    assert len(fields) > 0
