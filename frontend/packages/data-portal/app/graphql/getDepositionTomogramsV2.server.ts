import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import type { GetDepositionTomogramsQuery } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getFilterState } from 'app/hooks/useFilter'

import { getDepositionTomogramsFilter } from './common'

const GET_DEPOSITION_TOMOGRAMS = gql(`
  query GetDepositionTomograms(
    $depositionTomogramsFilter: TomogramWhereClause!,
    $limit: Int!,
    $offset: Int!,
  ) {
    tomograms(
      where: $depositionTomogramsFilter,
      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
      orderBy: [
        {
          neuroglancerConfig: asc
        },
        {
          depositionDate: desc
        },
        {
          id: desc
        }
      ]
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
  depositionId,
  page,
  pageSize = MAX_PER_PAGE,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  page: number
  pageSize?: number
  params?: URLSearchParams
}): Promise<ApolloQueryResult<GetDepositionTomogramsQuery>> {
  const filterState = getFilterState(params)
  const datasetIds = filterState.ids.datasets
    .map((id) => parseInt(id))
    .filter((id) => Number.isInteger(id))
  const { organismNames } = filterState.sampleAndExperimentConditions

  return client.query({
    query: GET_DEPOSITION_TOMOGRAMS,
    variables: {
      depositionTomogramsFilter: getDepositionTomogramsFilter({
        depositionId,
        datasetIds: datasetIds.length > 0 ? datasetIds : undefined,
        organismNames: organismNames.length > 0 ? organismNames : undefined,
      }),
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
  })
}
