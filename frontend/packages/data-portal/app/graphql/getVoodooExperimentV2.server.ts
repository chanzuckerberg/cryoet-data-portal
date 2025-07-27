import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import { PerformVoodooQuery } from 'app/__generated_v2__/graphql'

const VOODOO = gql(`
  query PerformVoodoo(
    $id: Int!
  ) {
    depositions(where: { id: { _eq: $id }}) {
      depositionDate
    }
  }
`)

export async function getVoodoo({
  client,
  id,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
}): Promise<ApolloQueryResult<PerformVoodooQuery>> {
  return client.query({
    query: VOODOO,
    variables: {
      id,
    },
  })
}
