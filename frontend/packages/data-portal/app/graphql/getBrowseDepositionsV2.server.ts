import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { performance } from 'perf_hooks'

import { gql } from 'app/__generated_v2__'
import { OrderBy } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'

const GET_DEPOSITIONS_DATA_QUERY = gql(`
  query GetDepositionsDataV2(
    $limit: Int,
    $offset: Int,
    $orderByDeposition: orderBy,
  ) {
    depositions(
      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
      orderBy: { depositionDate: $orderByDeposition, id: desc },
      where: {depositionTypes: {type: {_eq: annotation}}}
    ) {
      id
      title
      keyPhotoThumbnailUrl
      depositionDate

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
          }
        }
      }

      annotationsCount: annotationsAggregate {
        aggregate {
          count
        }
      }

      objectNames: annotationsAggregate {
        aggregate {
          groupBy {
            objectName
          }
          count
        }
      }

      ## TODO: find how to get distinct shape types – as-is increases load time by ~2000ms (3x slower compared to v1)
      # shapeTypes: annotations {
      #   edges {
      #     node {
      #       annotationShapes {
      #         edges {
      #           node {
      #             shapeType
      #           }
      #         }
      #       }
      #     }
      #   }
      # }

      annotationDatasetCount: annotationsAggregate {
        aggregate {
          groupBy {
            run {
              dataset {
                id
              }
            }
          }
          count
        }
      }
    }

    totalDepositionCount: depositionsAggregate(where: {depositionTypes: {type: {_eq: annotation}}}) {
      aggregate {
        count
      }
    }

    filteredDepositionCount: depositionsAggregate(where: {depositionTypes: {type: {_eq: annotation}}}) {
      aggregate {
        count
      }
    }

    allObjectNames: annotationsAggregate {
      aggregate {
        groupBy {
          objectName
        }
        count
      }
    }

    allObjectShapeTypes: annotationShapesAggregate {
      aggregate {
        groupBy {
          shapeType
        }
        count
      }
    }
  }
`)

export async function getBrowseDepositionsV2({
  client,
  orderBy,
  page = 1,
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: OrderBy | null
  page?: number
}) {
  const start = performance.now()

  const results = await client.query({
    query: GET_DEPOSITIONS_DATA_QUERY,
    variables: {
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      orderByDeposition: orderBy ?? OrderBy.Desc,
    },
  })

  const end = performance.now()
  // eslint-disable-next-line no-console
  console.log(`getBrowseDepositionsV2 query perf: ${end - start}ms`)

  return results
}
