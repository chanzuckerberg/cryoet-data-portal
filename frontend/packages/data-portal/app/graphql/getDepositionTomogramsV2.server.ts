import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import type { GetDepositionTomogramsQuery } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'

const GET_DEPOSITION_TOMOGRAMS = gql(`
  query GetDepositionTomograms(
    $id: Int!,
    $limit: Int!,
    $offset: Int!,
  ) {
    tomograms(
      where: {
        depositionId: { _eq: $id },
      },

      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
    ) {
      id
      keyPhotoThumbnailUrl
      name
      neuroglancerConfig
      processing
      reconstructionMethod
      sizeX
      sizeY
      sizeZ
      voxelSpacing

      run {
        id
        name

        dataset {
          id
          organismName
          title
        }
      }
    }
  }
`)

export async function getDepositionTomograms({
  client,
  id,
  page,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  page: number
}): Promise<ApolloQueryResult<GetDepositionTomogramsQuery>> {
  return client.query({
    query: GET_DEPOSITION_TOMOGRAMS,
    variables: {
      id,
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
    },
  })
}
