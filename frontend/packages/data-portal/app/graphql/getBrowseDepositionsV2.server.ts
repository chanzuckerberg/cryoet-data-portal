import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'
import { performance } from 'perf_hooks'

import { gql } from 'app/__generated_v2__'
import {
  GetDepositionsDataV2Query,
  OrderBy,
} from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getFilterState } from 'app/hooks/useFilter'

import { getDepositionsFilter } from './common'

const GET_DEPOSITIONS_DATA_QUERY = gql(`
  query GetDepositionsDataV2(
    $limit: Int,
    $offset: Int,
    $orderByDeposition: orderBy,
    $depositionFilter: DepositionWhereClause,
  ) {
    depositions(
      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
      orderBy: { depositionDate: $orderByDeposition, id: desc },
      where: $depositionFilter,
    ) {
      id
      title
      tag
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

    filteredDepositionCount: depositionsAggregate(where: $depositionFilter) {
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
  params,
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: OrderBy | null
  page?: number
  params: URLSearchParams
}) {
  const start = performance.now()

  const filters = getDepositionsFilter({
    filterState: getFilterState(params),
  })

  if (filters.authors) {
    // (smccanny - Feb 2025) We want to filter depositions by author name or kaggleId,
    // but the API only supports filtering by one at a time for now.

    const filtersWithKaggleId = {
      ...filters,
      authors: {
        name: filters.authors.name,
        kaggleId: filters.authors.name,
      },
    }
    delete filtersWithKaggleId?.authors?.name

    // Run both queries concurrently
    const [resultsWithName, resultsWithKaggleId]: [
      ApolloQueryResult<GetDepositionsDataV2Query>,
      ApolloQueryResult<GetDepositionsDataV2Query>,
    ] = await Promise.all([
      client.query({
        query: GET_DEPOSITIONS_DATA_QUERY,
        variables: {
          depositionFilter: filters,
          orderByDeposition: orderBy ?? OrderBy.Desc,
        },
      }),
      client.query({
        query: GET_DEPOSITIONS_DATA_QUERY,
        variables: {
          depositionFilter: filtersWithKaggleId,
          orderByDeposition: orderBy ?? OrderBy.Desc,
        },
      }),
    ])

    // Combine the results - this will be sorted later in remapV2BrowseAllDepositions function
    resultsWithName?.data.depositions.push(
      ...resultsWithKaggleId.data.depositions,
    )
    if (
      resultsWithName.data.filteredDepositionCount.aggregate &&
      resultsWithKaggleId.data.filteredDepositionCount.aggregate &&
      resultsWithName.data.filteredDepositionCount.aggregate[0].count &&
      resultsWithKaggleId.data.filteredDepositionCount.aggregate[0].count
    ) {
      resultsWithName.data.filteredDepositionCount.aggregate[0].count +=
        resultsWithKaggleId.data.filteredDepositionCount.aggregate[0].count
    }

    const end = performance.now()
    // eslint-disable-next-line no-console
    console.log(`getBrowseDepositionsV2 query perf: ${end - start}ms`)

    return resultsWithName
  }

  const results = await client.query({
    query: GET_DEPOSITIONS_DATA_QUERY,
    variables: {
      depositionFilter: filters,
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
