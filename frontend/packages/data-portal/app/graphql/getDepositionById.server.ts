import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { gql } from 'app/__generated__'
import {
  Datasets_Bool_Exp as Depositions_Bool_Exp,
  Order_By,
} from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'

const GET_DEPOSITION_BY_ID = gql(`
  query GetDepositionById(
    $id: Int!,
    $dataset_limit: Int,
    $dataset_offset: Int,
    $dataset_order_by: order_by,
    $filter: datasets_bool_exp,
  ) {
    deposition: datasets_by_pk(id: $id) {
      s3_prefix

      # key photo
      key_photo_url

      # dates
      last_modified_date
      release_date
      deposition_date

      # metadata
      id
      title
      description

      funding_sources {
        funding_agency_name
        grant_id
      }

      related_database_entries
      deposition_citations: dataset_citations

      authors(
        order_by: {
          author_list_order: asc,
        },
      ) {
        corresponding_author_status
        email
        name
        orcid
        primary_author_status
      }

      # publication info
      related_database_entries
      deposition_publications: dataset_publications

      # runs
      run_stats: runs {
        tomogram_voxel_spacings {
          annotations {
            object_name

            files(distinct_on: shape_type) {
              shape_type
            }
          }

          annotations_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    }

    datasets(
      limit: $dataset_limit,
      offset: $dataset_offset,
      order_by: { title: $dataset_order_by },
      where: $filter
    ) {
      id
      title
      organism_name
      key_photo_thumbnail_url

      authors(
        order_by: {
          author_list_order: asc,
        },
      ) {
        name
        primary_author_status
        corresponding_author_status
      }

      runs_aggregate {
        aggregate {
          count
        }
      }

      runs {
        tomogram_voxel_spacings {
          annotations(distinct_on: object_name) {
            object_name
          }

          annotations_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    }

    datasets_aggregate {
      aggregate {
        count
      }
    }

    filtered_datasets_aggregate: datasets_aggregate(where: $filter) {
      aggregate {
        count
      }
    }
  }
`)

function getFilter(filterState: FilterState) {
  const filters: Depositions_Bool_Exp[] = []
  // TODO: implement filters
  // eslint-disable-next-line no-console
  console.log(filterState)

  return { _and: filters } as Depositions_Bool_Exp
}

export async function getDepositionById({
  client,
  id,
  orderBy,
  page = 1,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: Order_By | null
  id: number
  page?: number
  params?: URLSearchParams
}) {
  return client.query({
    query: GET_DEPOSITION_BY_ID,
    variables: {
      id,
      dataset_limit: MAX_PER_PAGE,
      dataset_offset: (page - 1) * MAX_PER_PAGE,
      dataset_order_by: orderBy,
      filter: getFilter(getFilterState(params)),
    },
  })
}
