import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import type { GetDepositionAnnotationsQuery } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getFilterState } from 'app/hooks/useFilter'

import { getDepositionAnnotationsFilter } from './common'

const GET_DEPOSITION_ANNOTATIONS = gql(`
  query GetDepositionAnnotations(
    $depositionAnnotationsFilter: AnnotationShapeWhereClause!,
    $limit: Int!,
    $offset: Int!,
  ) {
    annotationShapes(
      where: $depositionAnnotationsFilter,
      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
      orderBy: [
        {
          annotation: {
            groundTruthStatus: desc
          }
        },
        {
          annotation: {
            depositionDate: desc
          }
        },
        {
          annotation: {
            id: desc
          }
        }
      ]
    ) {
      id
      shapeType

      annotation {
        groundTruthStatus
        id
        methodType
        objectName

        run {
          id
          name

          dataset {
            id
            title
          }
        }
      }

      annotationFiles(first: 1) {
        edges {
          node {
            s3Path
          }
        }
      }
    }
  }
`)

export async function getDepositionAnnotations({
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
}): Promise<ApolloQueryResult<GetDepositionAnnotationsQuery>> {
  const filterState = getFilterState(params)
  const datasetIds = filterState.ids.datasets
    .map((id) => parseInt(id))
    .filter((id) => Number.isInteger(id))
  const { organismNames } = filterState.sampleAndExperimentConditions

  return client.query({
    query: GET_DEPOSITION_ANNOTATIONS,
    variables: {
      depositionAnnotationsFilter: getDepositionAnnotationsFilter({
        depositionId,
        datasetIds: datasetIds.length > 0 ? datasetIds : undefined,
        organismNames: organismNames.length > 0 ? organismNames : undefined,
      }),
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
  })
}
