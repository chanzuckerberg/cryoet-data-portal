import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'

const GET_RUN_BY_ID_QUERY_V2 = gql(`
    query GetRunByIdV2 {
        __typename
    }    
`)

export async function getRunById({
  client,
}: {
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetRunByIdV2Query>> {
  return client.query({
    query: GET_RUN_BY_ID_QUERY_V2,
  })
}
