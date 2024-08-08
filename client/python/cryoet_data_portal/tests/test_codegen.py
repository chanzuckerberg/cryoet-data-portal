from graphql import GraphQLObjectType, GraphQLSchema

from cryoet_data_portal._codegen import SCHEMA_PATH, load_schema, parse_fields


def test_load_schema():
    schema = load_schema(SCHEMA_PATH)
    assert isinstance(schema, GraphQLSchema)


def test_parse_fields_dataset():
    schema = load_schema(SCHEMA_PATH)
    dataset_type = schema.get_type("datasets")
    assert isinstance(dataset_type, GraphQLObjectType)
    fields = parse_fields(dataset_type)
    assert len(fields) > 0


def test_parse_fields_tomogram():
    schema = load_schema(SCHEMA_PATH)
    tomogram_type = schema.get_type("tomograms")
    assert isinstance(tomogram_type, GraphQLObjectType)
    fields = parse_fields(tomogram_type)
    assert len(fields) > 0
