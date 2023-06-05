import os
import pathlib
from typing import Optional

from gql import Client as GQLClient
from gql.dsl import DSLQuery, DSLSchema, dsl_gql
from gql.transport.requests import RequestsHTTPTransport


class Client:
    def __init__(self, url: Optional[str] = None):
        # Use our default API URL
        if not url:
            url = "https://graphql-cryoet-api.cryoet.prod.si.czi.technology/v1/graphql"
        transport = RequestsHTTPTransport(
            url=url,
            verify=False,
            retries=3,
        )

        with open(os.path.join(pathlib.Path(__file__).parent.resolve(), "data/schema.graphql")) as f:
            schema_str = f.read()

        self.client = GQLClient(transport=transport, schema=schema_str)
        self.ds = DSLSchema(self.client.schema)

    def build_query(self, cls, gql_class_name: str, query_filters=None):
        ds = self.ds
        if not query_filters:
            query_filters = {}
        gql_type = getattr(ds, gql_class_name)
        scalar_fields = [getattr(gql_type, fieldname) for fieldname in cls._get_scalar_fields()]
        query = dsl_gql(DSLQuery(getattr(ds.query_root, gql_class_name)(**query_filters).select(*scalar_fields)))
        return query

    def generate_filters(self, cls, field, value):
        filter = {"where": {field: {"_eq": value}}}
        return filter

    def find(self, cls, query_filters=None):
        gql_type = cls._get_gql_type()
        response = self.client.execute(self.build_query(cls, gql_type, query_filters))
        for item in response[gql_type]:
            yield cls(self, **item)

    def find_one(self, *args, **kwargs):
        for result in self.find(*args, **kwargs):
            return result
