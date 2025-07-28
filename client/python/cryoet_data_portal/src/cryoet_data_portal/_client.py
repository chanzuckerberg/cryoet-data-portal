import os
import pathlib
from typing import Optional

from gql import Client as GQLClient
from gql.dsl import DSLQuery, DSLSchema, dsl_gql
from gql.transport.requests import RequestsHTTPTransport

from cryoet_data_portal._constants import USER_AGENT

DEFAULT_URL = "https://graphql.cryoetdataportal.czscience.com/graphql"


class Client:
    """A GraphQL Client library that can traverse all the metadata in the CryoET Data Portal

    Args:
        url (Optional[str]): The API URL to connect to, defaults to the latest portal endpoint.

    Returns:
        A GraphQL API Client library

    Examples:
        Generate a client that connects to the default GraphQL API:

        >>> client = cryoet_data_portal.Client()
    """

    def __init__(self, url: Optional[str] = None):
        with open(
            os.path.join(
                pathlib.Path(__file__).parent.resolve(),
                "data/schema.graphql",
            ),
        ) as f:
            schema_str = f.read()

        if not url:
            url = DEFAULT_URL

        self.url = url
        # Parsing the schema is relatively expensive, so we want to make sure it's
        # done only once per instantiation of the client.
        client = GQLClient(schema=schema_str)
        self.schema = client.schema
        if not self.schema:
            raise Exception("Could not parse schema")
        self.ds = DSLSchema(self.schema)

    # We instantiate a new GQLClient for every request to ensure thread safety.
    def get_client(self) -> GQLClient:
        transport = RequestsHTTPTransport(
            url=self.url,
            retries=3,
            headers={"User-agent": USER_AGENT},
        )
        return GQLClient(transport=transport, schema=self.schema)

    def build_query(
        self,
        cls,
        root_field: str,
        gql_class_name: str,
        query_filters=None,
    ):
        ds = self.ds
        query_filters = {} if not query_filters else {"where": query_filters}
        gql_type = getattr(ds, gql_class_name)
        scalar_fields = [
            getattr(gql_type, fieldname) for fieldname in cls._get_gql_fields()
        ]
        query = dsl_gql(
            DSLQuery(
                getattr(ds.Query, root_field)(**query_filters).select(
                    *scalar_fields,
                ),
            ),
        )
        return query

    def find(self, cls, query_filters=None):
        gql_type = cls._get_gql_type()
        gql_root = cls._get_gql_root_field()
        response = self.get_client().execute(
            self.build_query(cls, gql_root, gql_type, query_filters),
        )
        return [cls(self, **item) for item in response[gql_root]]

    def find_one(self, *args, **kwargs):
        for result in self.find(*args, **kwargs):
            return result
