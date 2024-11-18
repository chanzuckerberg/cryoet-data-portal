import sys
from contextlib import contextmanager
from importlib import import_module
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from types import ModuleType
from typing import Generator

import pytest
from graphql import GraphQLObjectType, GraphQLSchema

from cryoet_data_portal._codegen import (
    GQL_TO_MODEL_TYPE,
    SCHEMA_PATH,
    FieldInfo,
    ModelInfo,
    fetch_schema,
    get_models,
    load_schema,
    parse_fields,
    update_schema_and_models,
    write_models,
    write_schema,
)


def test_load_schema():
    schema = load_schema(SCHEMA_PATH)

    assert isinstance(schema, GraphQLSchema)
    assert all(schema.get_type(t) for t in GQL_TO_MODEL_TYPE)


def test_fetch_schema(gql_url: str):
    schema = fetch_schema(gql_url)

    assert isinstance(schema, GraphQLSchema)
    assert all(schema.get_type(t) for t in GQL_TO_MODEL_TYPE)


def test_write_schema(tmp_path: Path):
    schema = load_schema(SCHEMA_PATH)
    output_schema_path = tmp_path / "schema.graphql"

    write_schema(schema, output_schema_path)

    schema_content = _file_content(SCHEMA_PATH)
    output_schema_content = _file_content(output_schema_path)
    assert output_schema_content == schema_content


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
    assert all(isinstance(f, FieldInfo) for f in fields)


def test_write_models(tmp_path: Path):
    models = (
        ModelInfo(
            name="TestDataset",
            gql_type="test_dataset",
            root_field="query",
            plural="TestDatasets",
            plural_underscores="test_datasets",
            model_name_underscores="test_dataset",
            fields=(
                FieldInfo("id", "int", "IntField()"),
                FieldInfo("title", "str", "StringField()"),
            ),
        ),
        ModelInfo(
            name="TestRun",
            gql_type="test_runs",
            root_field="query",
            plural="TestRuns",
            plural_underscores="test_runs",
            model_name_underscores="test_run",
            fields=(
                FieldInfo("id", "int", "IntField()"),
                FieldInfo("name", "str", "StringField()"),
            ),
        ),
    )
    models_path = tmp_path / "_tmp_models.py"

    write_models(models, models_path)

    with _import_module_from_file(models_path) as module:
        module_dir = dir(module)
        assert "TestDataset" in module_dir
        assert "TestRun" in module_dir


def test_update_schema_and_models(gql_url: str, tmp_path: Path):
    schema_path = tmp_path / "schema.graphql"
    models_path = tmp_path / "models.graphql"

    update_schema_and_models(
        gql_url=gql_url,
        schema_path=schema_path,
        models_path=models_path,
    )

    assert _file_content(schema_path)
    assert _file_content(models_path)


@contextmanager
def _import_module_from_file(path: Path) -> Generator[ModuleType, None, None]:
    name = path.stem
    spec = spec_from_file_location(name, path)
    module = module_from_spec(spec)
    try:
        sys.modules[name] = module
        spec.loader.exec_module(module)
        yield import_module(name)
    finally:
        sys.modules.pop(name)


def _file_content(path: Path) -> str:
    with open(path, "r") as f:
        return f.read().rstrip()
