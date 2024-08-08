import os
import pathlib
from typing import Optional

from gql import Client as GQLClient
from gql.dsl import DSLQuery, DSLSchema, dsl_gql
from gql.transport.requests import RequestsHTTPTransport

from cryoet_data_portal._constants import USER_AGENT

DEFAULT_URL = "https://graphql.cryoetdataportal.cziscience.com/v1/graphql"


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
        if not url:
            url = DEFAULT_URL
        transport = RequestsHTTPTransport(
            url=url,
            retries=3,
            headers={"User-agent": USER_AGENT},
        )

        with open(
            os.path.join(
                pathlib.Path(__file__).parent.resolve(),
                "data/schema.graphql",
            ),
        ) as f:
            schema_str = f.read()

        self.client = GQLClient(transport=transport, schema=schema_str)
        self.ds = DSLSchema(self.client.schema)

    def build_query(self, cls, gql_class_name: str, query_filters=None):
        ds = self.ds
        query_filters = {} if not query_filters else {"where": query_filters}
        gql_type = getattr(ds, gql_class_name)
        scalar_fields = [
            getattr(gql_type, fieldname) for fieldname in cls._get_scalar_fields()
        ]
        query = dsl_gql(
            DSLQuery(
                getattr(ds.query_root, gql_class_name)(**query_filters).select(
                    *scalar_fields,
                ),
            ),
        )
        return query

    def find(self, cls, query_filters=None):
        gql_type = cls._get_gql_type()
        response = self.client.execute(self.build_query(cls, gql_type, query_filters))
        return [cls(self, **item) for item in response[gql_type]]

    def find_one(self, *args, **kwargs):
        for result in self.find(*args, **kwargs):
            return result
