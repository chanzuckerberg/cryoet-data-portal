import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import { OrderBy } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getFilterState } from 'app/hooks/useFilter'

import { getDatasetsFilter } from './common'

const GET_DEPOSITION_BY_ID = gql(`
  query GetDepositionByIdV2(
    $id: Int!,
    $datasetsLimit: Int!,
    $datasetsOffset: Int!,
    $datasetsOrderBy: [DatasetOrderByClause!],
    $datasetsFilter: DatasetWhereClause!,
    $datasetsByDepositionFilter: DatasetWhereClause!,
    $tiltseriesByDepositionFilter: TiltseriesWhereClause!,
    $tomogramsByDepositionFilter: TomogramWhereClause!,
    $annotationsByDepositionFilter: AnnotationWhereClause!,
    $annotationShapesByDepositionFilter: AnnotationShapeWhereClause!
  ) {
    # Deposition:
    depositions(where: { id: { _eq: $id }}) {
      depositionDate
      depositionPublications
      description
      id
      keyPhotoUrl
      lastModifiedDate
      relatedDatabaseEntries
      releaseDate
      title
      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            correspondingAuthorStatus
            email
            name
            orcid
            primaryAuthorStatus
          }
        }
      }
      annotationsAggregate {
        aggregate {
          count
        }
      }
      distinctOrganismNames: datasetsAggregate {
        aggregate {
          count
          groupBy {
            organismName
          }
        }
      }
      distinctObjectNames: annotationsAggregate {
        aggregate {
          count
          groupBy {
            objectName
          }
        }
      }
      distinctShapeTypes: annotationsAggregate {
        aggregate {
          count
          groupBy {
            annotationShapes {
              shapeType
            }
          }
        }
      }
      annotationMethodCounts: annotationsAggregate {
        aggregate {
          count
          groupBy {
            annotationMethod
            annotationSoftware
            methodType
            methodLinks {
              link
              linkType
              name
            }
          }
        }
      }
    }

    # Datasets:
    # This section is very similar to the datasets page.
    datasets(
      where: $datasetsFilter
      orderBy: $datasetsOrderBy,
      limitOffset: {
        limit: $datasetsLimit,
        offset: $datasetsOffset
      }
    ) {
      id
      title
      organismName
      datasetPublications
      keyPhotoThumbnailUrl
      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
            primaryAuthorStatus
            correspondingAuthorStatus
          }
        }
      }
      runsCount: runsAggregate(where: { annotations: $annotationsByDepositionFilter }) {
        aggregate {
          count
        }
      }
      runs {
        edges {
          node {
            annotationsAggregate(where: $annotationsByDepositionFilter) {
              aggregate {
                count
                groupBy {
                  objectName
                }
              }
            }
          }
        }
      }
    }

    ...DatasetsAggregates
  }
`)

export async function getDepositionById({
  client,
  id,
  orderBy,
  page = 1,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: OrderBy
  id: number
  page?: number
  params?: URLSearchParams
}) {
  const depositionIdFilter = {
    depositionId: {
      _eq: id,
    },
  }

  return client.query({
    query: GET_DEPOSITION_BY_ID,
    variables: {
      id,
      datasetsLimit: MAX_PER_PAGE,
      datasetsOffset: (page - 1) * MAX_PER_PAGE,
      datasetsOrderBy: orderBy !== undefined ? [{ title: orderBy }] : undefined,
      datasetsFilter: getDatasetsFilter({
        filterState: getFilterState(params),
        depositionId: id,
      }),
      datasetsByDepositionFilter: depositionIdFilter,
      tiltseriesByDepositionFilter: depositionIdFilter,
      tomogramsByDepositionFilter: depositionIdFilter,
      annotationsByDepositionFilter: depositionIdFilter,
      annotationShapesByDepositionFilter: {
        annotation: depositionIdFilter,
      },
    },
  })
}
