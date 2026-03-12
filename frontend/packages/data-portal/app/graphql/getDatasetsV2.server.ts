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

import {
  createAnnotationVsIdentifiedObjectFilters,
  createObjectNameVsObjectIdFilters,
  getDatasetsFilter,
} from './common'
import { getAggregatedDatasetIdsByDeposition } from './datasetsByDepositionIdV2.server'
import {
  buildDatasetsOrderBy,
  extractIds,
  intersectIds,
  unionIds,
} from './queryUtils'

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

const GET_DATASET_IDS_QUERY = gql(`
  query GetDatasetIdsV2(
    $datasetsFilter: DatasetWhereClause!
  ) {
    datasets(where: $datasetsFilter) {
      id
    }
  }
`)

async function fetchIdsByFilter({
  client,
  filterState,
  searchText,
}: {
  client: ApolloClient<NormalizedCacheObject>
  filterState: Parameters<typeof getDatasetsFilter>[0]['filterState']
  searchText?: string
}): Promise<number[]> {
  const filter = getDatasetsFilter({ filterState, searchText })
  const result = await client.query({
    query: GET_DATASET_IDS_QUERY,
    variables: { datasetsFilter: filter },
  })
  return extractIds(result.data.datasets)
}

async function fetchPageByIds({
  ids,
  page,
  titleOrderDirection,
  client,
}: {
  ids: number[]
  page: number
  titleOrderDirection?: OrderBy
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetsV2Query>> {
  const result = await client.query({
    query: GET_DATASETS_QUERY,
    variables: {
      datasetsFilter: { id: { _in: ids } },
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      orderBy: buildDatasetsOrderBy(titleOrderDirection),
    },
  })

  if (result.data.filteredDatasetsCount?.aggregate?.[0]) {
    result.data.filteredDatasetsCount.aggregate[0].count = ids.length
  }

  return result
}

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

  const { objectNames, objectId, annotatedObjectsOnly } = filterState.annotation

  // If we have both object filters, use intersection logic to handle cross-table scenarios
  // Otherwise, use the original cross-table search logic for single filters
  const hasBothObjectFilters = objectNames.length > 0 && objectId
  const hasSingleObjectFilter =
    (objectNames.length > 0 || objectId) && !hasBothObjectFilters

  if (hasBothObjectFilters) {
    const { objectNameFilter, objectIdFilter } =
      createObjectNameVsObjectIdFilters(filterState)

    // fetch only IDs from each filter x table combination
    let objectNameIds: number[]
    let objectIdIds: number[]

    if (annotatedObjectsOnly) {
      // When "Annotated Objects Only" is enabled, only search annotations table
      ;[objectNameIds, objectIdIds] = await Promise.all([
        fetchIdsByFilter({ client, filterState: objectNameFilter, searchText }),
        fetchIdsByFilter({ client, filterState: objectIdFilter, searchText }),
      ])
    } else {
      // When "Annotated Objects Only" is disabled, search across both tables
      const [nameAnnot, nameIdent, idAnnot, idIdent] = await Promise.all([
        fetchIdsByFilter({ client, filterState: objectNameFilter, searchText }),
        fetchIdsByFilter({
          client,
          filterState: {
            ...objectNameFilter,
            annotation: {
              ...objectNameFilter.annotation,
              _searchIdentifiedObjectsOnly: true,
            },
          },
          searchText,
        }),
        fetchIdsByFilter({ client, filterState: objectIdFilter, searchText }),
        fetchIdsByFilter({
          client,
          filterState: {
            ...objectIdFilter,
            annotation: {
              ...objectIdFilter.annotation,
              _searchIdentifiedObjectsOnly: true,
            },
          },
          searchText,
        }),
      ])

      objectNameIds = unionIds(nameAnnot, nameIdent)
      objectIdIds = unionIds(idAnnot, idIdent)
    }

    const intersectedIds = intersectIds(objectNameIds, objectIdIds)

    if (intersectedIds.length === 0) {
      return client.query({
        query: GET_DATASETS_QUERY,
        variables: {
          datasetsFilter: { id: { _in: [] } },
          limit: MAX_PER_PAGE,
          offset: 0,
          orderBy: buildDatasetsOrderBy(titleOrderDirection),
        },
      })
    }

    // fetch full data for the paginated subset only
    return fetchPageByIds({
      ids: intersectedIds,
      page,
      titleOrderDirection,
      client,
    })
  }

  // Single object filter across both tables (OR logic via ID union)
  if (hasSingleObjectFilter && !annotatedObjectsOnly) {
    const { annotationFilter, identifiedObjectFilter } =
      createAnnotationVsIdentifiedObjectFilters(filterState)

    // fetch IDs from both tables concurrently
    const [annotationIds, identifiedIds] = await Promise.all([
      fetchIdsByFilter({ client, filterState: annotationFilter, searchText }),
      fetchIdsByFilter({
        client,
        filterState: identifiedObjectFilter,
        searchText,
      }),
    ])

    const mergedIds = unionIds(annotationIds, identifiedIds)

    if (mergedIds.length === 0) {
      return client.query({
        query: GET_DATASETS_QUERY,
        variables: {
          datasetsFilter: { id: { _in: [] } },
          limit: MAX_PER_PAGE,
          offset: 0,
          orderBy: buildDatasetsOrderBy(titleOrderDirection),
        },
      })
    }

    // fetch full data for the paginated subset only
    return fetchPageByIds({
      ids: mergedIds,
      page,
      titleOrderDirection,
      client,
    })
  }

  let datasetsFilter: DatasetWhereClause

  // If we have a deposition ID, use the two-pass approach to find all datasets with content from this deposition
  if (depositionId) {
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
      })
    }
  } else {
    // Use original filtering logic
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
      orderBy: buildDatasetsOrderBy(titleOrderDirection),
    },
  })
}
