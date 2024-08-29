import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { performance } from 'perf_hooks'

import { gql } from 'app/__generated__'
import { Depositions_Bool_Exp, Order_By } from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'

const GET_DEPOSITIONS_DATA_QUERY = gql(`
  query GetDepositionsData(
    $limit: Int,
    $offset: Int,
    $order_by_deposition: order_by,
    $filter: depositions_bool_exp,
  ) {
    depositions(
      limit: $limit,
      offset: $offset,
      order_by: { deposition_date: $order_by_deposition },
      where: $filter
    ) {
      id
      title
      key_photo_thumbnail_url
      deposition_date

      authors(
        order_by: {
          author_list_order: asc,
        },
      ) {
        name
        primary_author_status
        corresponding_author_status
      }

      annotations_aggregate {
        aggregate {
          count
        }
      }

      dataset_aggregate {
        aggregate {
          count
        }
      }

      annotations(distinct_on: object_name) {
        object_name
      }

      shape_types: annotations {
        files(distinct_on: shape_type) {
          shape_type
        }
      }
    }

    depositions_aggregate {
      aggregate {
        count
      }
    }

    filtered_depositions_aggregate: depositions_aggregate(where: $filter) {
      aggregate {
        count
      }
    }

    object_names: annotations(distinct_on: object_name) {
      object_name
    }

    object_shape_types: annotation_files(distinct_on: shape_type) {
      shape_type
    }
  }
`)

function getFilter(filterState: FilterState, query: string) {
  const filters: Depositions_Bool_Exp[] = []

  // Text search by deposition title
  if (query) {
    filters.push({
      title: {
        _ilike: `%${query}%`,
      },
    })
  }

  // Author filters
  // Author name filter
  if (filterState.author.name) {
    filters.push({
      authors: {
        name: {
          _ilike: `%${filterState.author.name}%`,
        },
      },
    })
  }

  // Author Orcid filter
  if (filterState.author.orcid) {
    filters.push({
      authors: {
        orcid: {
          _ilike: `%${filterState.author.orcid}%`,
        },
      },
    })
  }

  // Annotation filters
  const { objectNames, objectShapeTypes } = filterState.annotation

  // Object names filter
  if (objectNames.length > 0) {
    filters.push({
      annotations: {
        object_name: {
          _in: objectNames,
        },
      },
    })
  }

  // Object shape type filter
  if (objectShapeTypes.length > 0) {
    filters.push({
      annotations: {
        files: {
          shape_type: {
            _in: objectShapeTypes,
          },
        },
      },
    })
  }

  return { _and: filters } as Depositions_Bool_Exp
}

export async function getBrowseDepositions({
  client,
  orderBy,
  page = 1,
  params = new URLSearchParams(),
  query = '',
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: Order_By | null
  page?: number
  params?: URLSearchParams
  query?: string
}) {
  const start = performance.now()

  const results = await client.query({
    query: GET_DEPOSITIONS_DATA_QUERY,
    variables: {
      filter: getFilter(getFilterState(params), query),
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      order_by_deposition: orderBy ?? Order_By.Desc,
    },
  })

  const end = performance.now()
  // eslint-disable-next-line no-console
  console.log(`getBrowseDepositions query perf: ${end - start}ms`)

  return results
}
