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

import {
  createAnnotationVsIdentifiedObjectFilters,
  createObjectNameVsObjectIdFilters,
  dedupeById,
  getDatasetsFilter,
} from './common'
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

  const { objectNames, objectId, annotatedObjectsOnly } = filterState.annotation

  // If we have both object filters, use intersection logic to handle cross-table scenarios
  // Otherwise, use the original cross-table search logic for single filters
  const hasBothObjectFilters = objectNames.length > 0 && objectId
  const hasSingleObjectFilter =
    (objectNames.length > 0 || objectId) && !hasBothObjectFilters

  if (hasBothObjectFilters && isIdentifiedObjectsEnabled) {
    // Find datasets that match BOTH filters across any tables
    const { objectNameFilter, objectIdFilter } =
      createObjectNameVsObjectIdFilters(filterState)

    // Search across both tables with deduplication
    // Fetch ALL matching results from both tables
    // then handle pagination after merging
    const commonVariables = {
      limit: null, // No limit - fetch all matching results
      offset: 0, // Start from beginning
      orderBy: titleOrderDirection
        ? [{ title: titleOrderDirection }, { releaseDate: OrderBy.Desc }]
        : [{ releaseDate: OrderBy.Desc }, { title: OrderBy.Asc }],
    }

    // For intersection approach, we need to run multiple table searches for EACH filter separately
    // Then intersect the deduplicated results

    let objectNamesResults
    let objectIdResults
    let firstQueryResult

    if (annotatedObjectsOnly) {
      // When "Annotated Objects Only" is enabled, only search annotations table
      const objectNamesAnnotationsFilter = getDatasetsFilter({
        filterState: objectNameFilter,
        searchText,
        isIdentifiedObjectsEnabled: false, // Force annotations-only
      })

      const objectIdAnnotationsFilter = getDatasetsFilter({
        filterState: objectIdFilter,
        searchText,
        isIdentifiedObjectsEnabled: false, // Force annotations-only
      })

      // Run both queries concurrently (annotations only)
      const [objectNamesFromAnnotations, objectIdFromAnnotations] =
        await Promise.all([
          client.query({
            query: GET_DATASETS_QUERY,
            variables: {
              datasetsFilter: objectNamesAnnotationsFilter,
              ...commonVariables,
            },
          }),
          client.query({
            query: GET_DATASETS_QUERY,
            variables: {
              datasetsFilter: objectIdAnnotationsFilter,
              ...commonVariables,
            },
          }),
        ])

      objectNamesResults = objectNamesFromAnnotations.data.datasets || []
      objectIdResults = objectIdFromAnnotations.data.datasets || []
      firstQueryResult = objectNamesFromAnnotations // For return structure
    } else {
      // When "Annotated Objects Only" is disabled, search across both tables

      // SEARCH BOTH TABLES FOR ObjectNames: annotations + identifiedObjects
      const objectNamesAnnotationsFilter = getDatasetsFilter({
        filterState: objectNameFilter,
        searchText,
        isIdentifiedObjectsEnabled: false, // Force annotations-only
      })

      const objectNamesIdentifiedFilter = getDatasetsFilter({
        filterState: {
          ...objectNameFilter,
          annotation: {
            ...objectNameFilter.annotation,
            _searchIdentifiedObjectsOnly: true,
          },
        },
        searchText,
        isIdentifiedObjectsEnabled,
      })

      // SEARCH BOTH TABLES FOR ObjectId: annotations + identifiedObjects
      const objectIdAnnotationsFilter = getDatasetsFilter({
        filterState: objectIdFilter,
        searchText,
        isIdentifiedObjectsEnabled: false, // Force annotations-only
      })

      const objectIdIdentifiedFilter = getDatasetsFilter({
        filterState: {
          ...objectIdFilter,
          annotation: {
            ...objectIdFilter.annotation,
            _searchIdentifiedObjectsOnly: true,
          },
        },
        searchText,
        isIdentifiedObjectsEnabled,
      })

      // Run all four queries concurrently
      const [
        objectNamesFromAnnotations,
        objectNamesFromIdentified,
        objectIdFromAnnotations,
        objectIdFromIdentified,
      ] = await Promise.all([
        client.query({
          query: GET_DATASETS_QUERY,
          variables: {
            datasetsFilter: objectNamesAnnotationsFilter,
            ...commonVariables,
          },
        }),
        client.query({
          query: GET_DATASETS_QUERY,
          variables: {
            datasetsFilter: objectNamesIdentifiedFilter,
            ...commonVariables,
          },
        }),
        client.query({
          query: GET_DATASETS_QUERY,
          variables: {
            datasetsFilter: objectIdAnnotationsFilter,
            ...commonVariables,
          },
        }),
        client.query({
          query: GET_DATASETS_QUERY,
          variables: {
            datasetsFilter: objectIdIdentifiedFilter,
            ...commonVariables,
          },
        }),
      ])

      // Union and dedupe ObjectNames results
      objectNamesResults = dedupeById([
        ...(objectNamesFromAnnotations.data.datasets ?? []),
        ...(objectNamesFromIdentified.data.datasets ?? []),
      ])

      // Union and dedupe ObjectId results
      objectIdResults = dedupeById([
        ...(objectIdFromAnnotations.data.datasets ?? []),
        ...(objectIdFromIdentified.data.datasets ?? []),
      ])
      firstQueryResult = objectNamesFromAnnotations // For return structure
    }

    if (objectNamesResults.length === 0 || objectIdResults.length === 0) {
      // If either union returns no results, intersection is empty
      return {
        ...firstQueryResult,
        data: {
          ...firstQueryResult.data,
          datasets: [],
          filteredDatasetsCount: {
            ...firstQueryResult.data.filteredDatasetsCount,
            aggregate: [{ count: 0 }],
          },
        },
      }
    }

    // Find intersection: datasets that appear in BOTH unionized result sets
    const objectNamesIds = new Set(objectNamesResults.map((d) => d.id))
    const objectIdIds = new Set(objectIdResults.map((d) => d.id))
    const intersectionIds = new Set(
      [...objectNamesIds].filter((id) => objectIdIds.has(id)),
    )

    // Get the full dataset objects for the intersection
    const intersectedDatasets = objectNamesResults.filter((dataset) =>
      intersectionIds.has(dataset.id),
    )

    // Sort intersection results to maintain consistent ordering
    const sortedIntersectedDatasets = intersectedDatasets.sort((a, b) => {
      // Apply the same sort order as the query
      if (titleOrderDirection === OrderBy.Asc) {
        return a.title.localeCompare(b.title)
      }
      if (titleOrderDirection === OrderBy.Desc) {
        return b.title.localeCompare(a.title)
      }
      // Default: sort by title asc
      return a.title.localeCompare(b.title)
    })

    const totalIntersectedCount = sortedIntersectedDatasets.length

    // Apply pagination after sorting
    const startIndex = (page - 1) * MAX_PER_PAGE
    const endIndex = startIndex + MAX_PER_PAGE
    const paginatedDatasets = sortedIntersectedDatasets.slice(
      startIndex,
      endIndex,
    )

    // Return results using the first query's structure
    return {
      ...firstQueryResult,
      data: {
        ...firstQueryResult.data,
        datasets: paginatedDatasets,
        filteredDatasetsCount: {
          ...firstQueryResult.data.filteredDatasetsCount,
          aggregate: [{ count: totalIntersectedCount }],
        },
      },
    }
  }

  // Multiple table search logic for single object filters (OR logic)
  if (
    hasSingleObjectFilter &&
    isIdentifiedObjectsEnabled &&
    !annotatedObjectsOnly
  ) {
    const { annotationFilter, identifiedObjectFilter } =
      createAnnotationVsIdentifiedObjectFilters(filterState)

    // Search across both tables with deduplication (OR logic)
    const commonVariables = {
      limit: null, // No limit - fetch all matching results
      offset: 0, // Start from beginning
      orderBy: titleOrderDirection
        ? [{ title: titleOrderDirection }, { releaseDate: OrderBy.Desc }]
        : [{ releaseDate: OrderBy.Desc }, { title: OrderBy.Asc }],
    }

    // Pre-compute filters
    const annotationsFilter = getDatasetsFilter({
      filterState: annotationFilter,
      searchText,
      isIdentifiedObjectsEnabled: false, // Force annotations-only filtering
    })

    const identifiedObjectsFilter = getDatasetsFilter({
      filterState: identifiedObjectFilter,
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

    // Merge and dedupe (OR logic)
    const unionDatasets = dedupeById([
      ...resultsWithAnnotations.data.datasets,
      ...resultsWithIdentifiedObjects.data.datasets,
    ])

    // Sort merged results to maintain consistent ordering
    const sortedUnionDatasets = unionDatasets.sort((a, b) => {
      // Apply the same sort order as the query
      if (titleOrderDirection === OrderBy.Asc) {
        return a.title.localeCompare(b.title)
      }
      if (titleOrderDirection === OrderBy.Desc) {
        return b.title.localeCompare(a.title)
      }
      // Default: sort by title asc
      return a.title.localeCompare(b.title)
    })

    const totalUnionCount = sortedUnionDatasets.length

    // Apply pagination after merging and sorting
    const startIndex = (page - 1) * MAX_PER_PAGE
    const endIndex = startIndex + MAX_PER_PAGE
    const paginatedDatasets = sortedUnionDatasets.slice(startIndex, endIndex)

    resultsWithAnnotations.data.datasets = paginatedDatasets

    // Use the merged count as the filtered count
    if (resultsWithAnnotations.data.filteredDatasetsCount?.aggregate?.[0]) {
      resultsWithAnnotations.data.filteredDatasetsCount.aggregate[0].count =
        totalUnionCount
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
