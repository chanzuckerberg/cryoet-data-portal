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
    $annotationShapesByDepositionFilter: AnnotationShapeWhereClause,
    $identifiedObjectsByDepositionFilter: IdentifiedObjectWhereClause
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
      annotationsObjectNames: runsAggregate {
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
      identifiedObjectNames: runsAggregate {
        aggregate {
          count
          groupBy {
            identifiedObjects {
              objectName
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

  // Check if the identifiedObjects feature flag is enabled
  const isIdentifiedObjectsEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'identifiedObjects',
    params,
  })

  const { objectNames, annotatedObjectsOnly } = filterState.annotation

  // If we have an object filter and feature flag is enabled and not restricted to annotations only,
  // we need to run two queries and merge the results
  // We want to filter datasets by object names in annotations OR identifiedObjects,
  // but the API only supports filtering by one at a time atm.
  // This will need to be addressed by adding an OR operator to the GQL
  // if the database gets bigger than ~1500 datasets
  if (
    objectNames.length > 0 &&
    isIdentifiedObjectsEnabled &&
    !annotatedObjectsOnly
  ) {
    const filterStateForAnnotations = {
      ...filterState,
      annotation: {
        ...filterState.annotation,
      },
    }

    const filterStateForIdentifiedObjects = {
      ...filterState,
      annotation: {
        ...filterState.annotation,
        _searchIdentifiedObjectsOnly: true,
      },
    }

    // Dual query with deduplication
    // Fetch ALL matching results from both queries
    // then handle pagination after merging
    const commonVariables = {
      limit: null, // No limit - fetch all matching results
      offset: 0, // Start from beginning
      orderBy: titleOrderDirection
        ? [{ title: titleOrderDirection }, { releaseDate: OrderBy.Desc }]
        : [{ releaseDate: OrderBy.Desc }, { title: OrderBy.Asc }],
    }

    // Pre-compute filters
    const annotationsFilter = getDatasetsFilter({
      filterState: filterStateForAnnotations,
      searchText,
      isIdentifiedObjectsEnabled: false, // Force annotations-only filtering
    })

    const identifiedObjectsFilter = getDatasetsFilter({
      filterState: filterStateForIdentifiedObjects,
      searchText,
      isIdentifiedObjectsEnabled,
    })

    // Run both queries concurrently
    const [resultsWithAnnotations, resultsWithIdentifiedObjects] =
      await Promise.all([
        client.query({
          query: GET_DATASETS_QUERY,
          variables: {
            datasetsFilter: annotationsFilter,
            ...commonVariables,
          },
        }),
        client.query({
          query: GET_DATASETS_QUERY,
          variables: {
            datasetsFilter: identifiedObjectsFilter,
            ...commonVariables,
          },
        }),
      ])

    if (!resultsWithIdentifiedObjects.data.datasets) {
      return resultsWithAnnotations
    }

    if (!resultsWithAnnotations.data.datasets) {
      return resultsWithIdentifiedObjects
    }

    // Merge and dedupe
    const datasetsMap = new Map(
      [
        ...resultsWithAnnotations.data.datasets,
        ...resultsWithIdentifiedObjects.data.datasets,
      ].map((dataset) => [dataset.id, dataset]), // Map each dataset by its id
    )

    // Sort merged results to maintain consistent ordering
    const sortedMergedDatasets = Array.from(datasetsMap.values()).sort(
      (a, b) => {
        // Apply the same sort order as the query
        if (titleOrderDirection === 'asc') {
          return a.title.localeCompare(b.title)
        }
        if (titleOrderDirection === 'desc') {
          return b.title.localeCompare(a.title)
        }
        // Default: sort by title asc
        return a.title.localeCompare(b.title)
      },
    )

    const totalMergedCount = sortedMergedDatasets.length

    // Apply pagination after merging and sorting
    const startIndex = (page - 1) * MAX_PER_PAGE
    const endIndex = startIndex + MAX_PER_PAGE
    const mergedDatasets = sortedMergedDatasets.slice(startIndex, endIndex)

    resultsWithAnnotations.data.datasets = mergedDatasets

    // Use the merged count as the filtered count
    if (resultsWithAnnotations.data.filteredDatasetsCount?.aggregate?.[0]) {
      resultsWithAnnotations.data.filteredDatasetsCount.aggregate[0].count =
        totalMergedCount
    }

    return resultsWithAnnotations
  }

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
      datasetsFilter = { id: { _in: [] } } // Use empty array to return no results
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
        isIdentifiedObjectsEnabled,
      })
    }
  } else {
    // Use original filtering logic (backward compatibility)
    datasetsFilter = getDatasetsFilter({
      filterState,
      searchText,
      isIdentifiedObjectsEnabled,
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
