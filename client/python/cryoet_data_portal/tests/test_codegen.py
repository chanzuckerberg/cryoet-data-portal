from graphql import GraphQLObjectType, GraphQLSchema

from cryoet_data_portal._codegen import load_schema, parse_fields


def test_load_schema():
    schema = load_schema()
    assert isinstance(schema, GraphQLSchema)


def test_parse_fields_dataset():
    schema = load_schema()
    dataset_type = schema.get_type("datasets")
    assert isinstance(dataset_type, GraphQLObjectType)
    fields = parse_fields(dataset_type)
    assert len(fields) > 0
