import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  NormalizedCacheObject,
} from '@apollo/client'

import {
  GetWinningDepositionsDataQuery,
  OrderBy,
} from 'app/__generated_v2__/graphql'
import { sortArrayByScore } from 'app/components/MLChallenge/CompletedMLChallenge/constants'
import { Tags } from 'app/constants/tags'

const GET_WINNING_DEPOSITIONS_DATA_QUERY = gql(`
  query GetWinningDepositionsData(
    $limit: Int,
    $orderByDeposition: orderBy,
    $tag: String,
  ) {
    depositions(
      limitOffset: {
        limit: $limit,
      },
      orderBy: { depositionDate: $orderByDeposition, id: desc },
      where: {depositionTypes: {type: {_eq: annotation}}, tag: {_eq: $tag}},
    ) {
      id
      title
      keyPhotoThumbnailUrl
      description
      authors(
        orderBy: {
          authorListOrder: asc,
        },
      ) {
        edges {
          node {
            name
            primaryAuthorStatus
            correspondingAuthorStatus
            email
            orcid
            kaggleId
          }
        }
      }
    }
  }
`)

export async function getWinningDepositions({
  limit,
  client,
  orderBy,
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: OrderBy | null
  page?: number
  limit?: number
}): Promise<ApolloQueryResult<GetWinningDepositionsDataQuery>> {
  const start = performance.now()

  const results = await client.query<GetWinningDepositionsDataQuery>({
    query: GET_WINNING_DEPOSITIONS_DATA_QUERY,
    variables: {
      limit: limit ?? 10,
      orderByDeposition: orderBy ?? OrderBy.Asc,
      tags: Tags.MLCompetition2024,
    },
  })

  sortArrayByScore(results?.data?.depositions)

  const end = performance.now()
  // eslint-disable-next-line no-console
  console.log(`getWinningDepositions query perf: ${end - start}ms`)

  return results
}
