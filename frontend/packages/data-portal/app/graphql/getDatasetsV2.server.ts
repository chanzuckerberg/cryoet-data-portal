import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  type DatasetWhereClause,
  GetDatasetsV2Query,
  OrderBy,
} from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getFilterState } from 'app/hooks/useFilter'
import { getFeatureFlag } from 'app/utils/featureFlags'

import { getDatasetsFilter } from './common'
import { getAggregatedDatasetIdsByDeposition } from './datasetsByDepositionIdV2.server'

const GET_DATASETS_QUERY = gql(`
  query GetDatasetsV2(
    $limit: Int,
    $offset: Int,
    $orderBy: [DatasetOrderByClause!]!,
    $datasetsFilter: DatasetWhereClause!,
    # Unused, but must be defined because DatasetsAggregates references them:
    $datasetsByDepositionFilter: DatasetWhereClause,
    $tiltseriesByDepositionFilter: TiltseriesWhereClause,
    $tomogramsByDepositionFilter: TomogramWhereClause,
    $annotationsByDepositionFilter: AnnotationWhereClause,
    $annotationShapesByDepositionFilter: AnnotationShapeWhereClause
  ) {
    datasets(
      where: $datasetsFilter
      orderBy: $orderBy,
      limitOffset: {
        limit: $limit,
        offset: $offset
      }
    ) {
      id
      title
      organismName
      datasetPublications
      keyPhotoThumbnailUrl
      relatedDatabaseEntries
      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
            primaryAuthorStatus
            correspondingAuthorStatus
          }
        }
      }
      runsCount: runsAggregate {
        aggregate {
          count
        }
      }
      distinctObjectNames: runsAggregate {
        aggregate {
          count
          groupBy {
            annotations {
              objectName
              groundTruthStatus
            }
          }
        }
      }
    }

    ...DatasetsAggregates
  }
`)

export async function getDatasetsV2({
  page,
  titleOrderDirection,
  searchText,
  params = new URLSearchParams(),
  client,
}: {
  page: number
  titleOrderDirection?: OrderBy
  searchText?: string
  params?: URLSearchParams
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetsV2Query>> {
  const filterState = getFilterState(params)
  const depositionId = filterState.ids.deposition
    ? parseInt(filterState.ids.deposition)
    : null

  // Check if the expandDepositions feature flag is enabled
  const isExpandDepositionsEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'expandDepositions',
    params,
  })

  let datasetsFilter: DatasetWhereClause

  // If expandDepositions feature flag is enabled and we have a deposition ID,
  // use the two-pass approach to find all datasets with content from this deposition
  if (isExpandDepositionsEnabled && depositionId) {
    // Pass 1: Aggregate dataset IDs from all deposition-related queries
    const aggregatedDatasetIds = await getAggregatedDatasetIdsByDeposition({
      depositionId,
      client,
    })

    // If no datasets found with this deposition ID, return empty results
    if (aggregatedDatasetIds.length === 0) {
      datasetsFilter = { id: { _in: [0] } } // Use impossible ID to return no results
    } else {
      // Pass 2: Use aggregated dataset IDs in the filter
      datasetsFilter = getDatasetsFilter({
        filterState: {
          ...filterState,
          ids: {
            ...filterState.ids,
            deposition: null, // Clear deposition filter since we're using ID list
          },
        },
        searchText,
        aggregatedDatasetIds,
      })
    }
  } else {
    // Use original filtering logic (backward compatibility)
    datasetsFilter = getDatasetsFilter({
      filterState,
      searchText,
    })
  }

  return client.query({
    query: GET_DATASETS_QUERY,
    variables: {
      datasetsFilter,
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      // Default order primarily by release date.
      orderBy: titleOrderDirection
        ? [
            { title: titleOrderDirection },
            {
              releaseDate: OrderBy.Desc,
            },
          ]
        : [{ releaseDate: OrderBy.Desc }, { title: OrderBy.Asc }],
    },
  })
}
