import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetDatasetByIdV2Query,
  RunWhereClause,
} from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import {
  DEFAULT_TILT_RANGE_MAX,
  DEFAULT_TILT_RANGE_MIN,
} from 'app/constants/tiltSeries'
import { FilterState, getFilterState } from 'app/hooks/useFilter'

import {
  createAnnotationVsIdentifiedObjectFilters,
  createObjectNameVsObjectIdFilters,
} from './common'
import { extractIds, intersectIds, unionIds } from './queryUtils'
import { getAggregatedRunIdsByDeposition } from './runsByDepositionIdV2.server'

const GET_DATASET_BY_ID_QUERY_V2 = gql(`
  query GetDatasetByIdV2(
    $id: Int,
    $runLimit: Int,
    $runOffset: Int,
    $runFilter: RunWhereClause,
    $depositionId: Int
  ) {
    datasets(where: { id: { _eq: $id } }) {
      s3Prefix

      # Key photo
      keyPhotoUrl

      # Dataset dates
      lastModifiedDate
      releaseDate
      depositionDate
      fileSize
      # Dataset metadata
      id
      title
      description
      deposition{
        id
        description
        title
        annotationsAggregate(where: {annotationShapes: {annotationFilesAggregate: {count: {filter: {isVisualizationDefault: {_eq: true}}}}}}) {
          aggregate {
            count
          }
        }
      }
      fundingSources(
        orderBy: {
          fundingAgencyName: asc,
          grantId: asc
        }
      ) {
        edges {
          node {
            fundingAgencyName
            grantId
          }
        }
      }

      # Sample and experiments data
      cellComponentName
      cellComponentId
      cellName
      cellStrainName
      cellStrainId
      cellTypeId
      gridPreparation
      organismName
      organismTaxid
      otherSetup
      samplePreparation
      sampleType
      tissueName
      tissueId

      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            correspondingAuthorStatus
            email
            name
            orcid
            kaggleId
            primaryAuthorStatus
          }
        }
      }

      authorsWithAffiliation: authors(where: { affiliationName: { _is_null: false } }) {
        edges {
          node {
            name
            affiliationName
          }
        }
      }

      # Publication info
      relatedDatabaseEntries
      datasetPublications

      # Tilt Series metadata (via a single run)
      runMetadata: runs(first: 1) {
        edges {
          node {
            tiltseries(first: 1) {
              edges {
                node {
                  accelerationVoltage
                  sphericalAberrationConstant
                  microscopeManufacturer
                  microscopeModel
                  microscopeEnergyFilter
                  microscopePhasePlate
                  microscopeImageCorrector
                  microscopeAdditionalInfo
                  cameraManufacturer
                  cameraModel
                }
              }
            }
          }
        }
      }

      runsAggregate {
        aggregate {
          count
        }
      }

      filteredRunsCount: runsAggregate(where: $runFilter) {
        aggregate {
          count
        }
      }
    }

    # Runs table
    runs(
      where: $runFilter,
      orderBy: {
        name: asc
      },
      limitOffset: {
        limit: $runLimit,
        offset: $runOffset
      }
    ) {
      id
      name
      tiltseriesAggregate {
        aggregate {
          avg {
            tiltSeriesQuality
          }
        }
      }
      annotationsAggregate {
        aggregate {
          count
          groupBy {
            objectName
            groundTruthStatus
          }
        }
      }
      identifiedObjectsAggregate {
        aggregate {
          count
          groupBy {
            objectName
          }
        }
      }
      tomograms(
        first: 1,
        where: { isVisualizationDefault: { _eq: true } }
      ) {
        edges {
          node {
            id
            keyPhotoThumbnailUrl
            neuroglancerConfig
          }
        }
      }
    }

    # Dataset Contents
    unFilteredRuns: runs(where: { datasetId: { _eq: $id }}) {
      ...DataContents,
    }

    # Filter selectors
    annotationsAggregate(where: { run: { datasetId: { _eq: $id }}}) {
      aggregate {
        count
        groupBy {
          objectName
        }
      }
    }
    identifiedObjectsAggregate(where: { run: { datasetId: { _eq: $id }}}) {
      aggregate {
        count
        groupBy {
          objectName
        }
      }
    }
    annotationShapesAggregate(where: { annotation: { run: { datasetId: { _eq: $id }}}}) {
      aggregate {
        count
        groupBy {
          shapeType
        }
      }
    }
    tiltseriesAggregate(where: { run: { datasetId: { _eq: $id }}}) {
      aggregate {
        count
        groupBy {
          tiltSeriesQuality
        }
      }
    }

    # Deposition banner
    # Returns empty array if $depositionId not defined
    depositions(where: { id: { _eq: $depositionId }}) {
      id
      title
    }

    depositionsWithAnnotations: depositions(where: {
      annotations: {
        run: {
          datasetId: { _eq: $id }
        }
      }
    }) {
      id
    }

    depositionsWithTomograms: depositions(where: {
      tomograms: {
        run: {
          datasetId: { _eq: $id }
        }
      }
    }) {
      id
    }

    depositionsWithDatasets: depositions(where: {
      datasets: {
        id: { _eq: $id }
      }
    }) {
      id
    }
  }
`)

function getRunFilter(
  filterState: FilterState,
  datasetId: number,
  aggregatedRunIds?: number[],
): RunWhereClause {
  const where: RunWhereClause = {
    datasetId: {
      _eq: datasetId,
    },
  }

  // Deposition filter (2-pass approach):
  if (aggregatedRunIds !== undefined) {
    where.id = { _in: aggregatedRunIds }
  }

  // Tilt series filters:
  const tiltRangeMin = parseFloat(filterState.tiltSeries.min)
  const tiltRangeMax = parseFloat(filterState.tiltSeries.max)
  if (Number.isFinite(tiltRangeMin) || Number.isFinite(tiltRangeMax)) {
    where.tiltseries ??= {}
    where.tiltseries.tiltRange = {
      _gte: Number.isFinite(tiltRangeMin)
        ? tiltRangeMin
        : DEFAULT_TILT_RANGE_MIN,
      _lte: Number.isFinite(tiltRangeMax)
        ? tiltRangeMax
        : DEFAULT_TILT_RANGE_MAX,
    }
  }
  if (filterState.tiltSeries.qualityScore.length > 0) {
    where.tiltseries ??= {}
    where.tiltseries.tiltSeriesQuality = {
      _in: filterState.tiltSeries.qualityScore
        .map((score) => parseInt(score, 10))
        .filter((val) => Number.isFinite(val)),
    }
  }

  // Annotation filters:
  if (filterState.includedContents.isGroundTruthEnabled) {
    where.annotations ??= {}
    where.annotations.groundTruthStatus = { _eq: true }
  }

  const { objectNames, annotatedObjectsOnly, _searchIdentifiedObjectsOnly } =
    filterState.annotation

  if (objectNames.length > 0) {
    if (_searchIdentifiedObjectsOnly) {
      // Special case: search only identifiedObjects for front end OR query
      where.identifiedObjects ??= {}
      where.identifiedObjects.objectName = {
        _in: objectNames,
      }
    } else if (annotatedObjectsOnly) {
      // Only search annotations when annotated-objects=Yes
      where.annotations ??= {}
      where.annotations.objectName = {
        _in: objectNames,
      }
    }
    // When annotatedObjectsOnly is false, we search multiple tables in
    // getDatasetByIdV2 and merge the results
  }
  if (filterState.annotation.objectShapeTypes.length > 0) {
    where.annotations ??= {}
    where.annotations.annotationShapes = {
      shapeType: {
        _in: filterState.annotation.objectShapeTypes,
      },
    }
  }
  if (filterState.annotation.objectId !== null) {
    if (_searchIdentifiedObjectsOnly) {
      // Special case: search only identifiedObjects for front end OR query
      where.identifiedObjects ??= {}
      where.identifiedObjects.objectId = {
        _ilike: `%${filterState.annotation.objectId.replace(':', '_')}%`, // _ is wildcard
      }
    } else if (annotatedObjectsOnly) {
      // Only search annotations when annotated-objects=Yes
      where.annotations ??= {}
      where.annotations.objectId = {
        _ilike: `%${filterState.annotation.objectId.replace(':', '_')}%`, // _ is wildcard
      }
    }
    // When annotatedObjectsOnly is false, we search multiple tables in
    // getDatasetByIdV2 and merge the results
  }

  return where
}

const GET_RUN_IDS_QUERY = gql(`
  query GetRunIdsForObjectFilterV2($runFilter: RunWhereClause!) {
    runs(where: $runFilter) {
      id
    }
  }
`)

async function fetchRunIdsByFilter({
  client,
  filterState,
  datasetId,
  aggregatedRunIds,
}: {
  client: ApolloClient<NormalizedCacheObject>
  filterState: FilterState
  datasetId: number
  aggregatedRunIds?: number[]
}): Promise<number[]> {
  const runFilter = getRunFilter(filterState, datasetId, aggregatedRunIds)
  const result = await client.query({
    query: GET_RUN_IDS_QUERY,
    variables: { runFilter },
  })
  return extractIds(result.data.runs)
}

async function fetchRunPageByIds({
  ids,
  page,
  id,
  depositionId,
  client,
}: {
  ids: number[]
  page: number
  id: number
  depositionId?: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetByIdV2Query>> {
  const result = await client.query({
    query: GET_DATASET_BY_ID_QUERY_V2,
    variables: {
      id,
      depositionId,
      runLimit: MAX_PER_PAGE,
      runOffset: (page - 1) * MAX_PER_PAGE,
      runFilter: { id: { _in: ids }, datasetId: { _eq: id } },
    },
  })

  if (result.data.datasets?.[0]?.filteredRunsCount?.aggregate?.[0]) {
    result.data.datasets[0].filteredRunsCount.aggregate[0].count = ids.length
  }

  return result
}

export async function getDatasetByIdV2({
  client,
  depositionId,
  id,
  page = 1,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId?: number
  id: number
  page?: number
  params?: URLSearchParams
}): Promise<ApolloQueryResult<GetDatasetByIdV2Query>> {
  const filterState = getFilterState(params)
  const filterDepositionId = filterState.ids.deposition
    ? parseInt(filterState.ids.deposition)
    : null

  const { objectNames, objectId, annotatedObjectsOnly } = filterState.annotation

  // Check if we have both object filters for intersection approach
  const hasBothObjectFilters = objectNames.length > 0 && objectId
  const hasSingleObjectFilter =
    (objectNames.length > 0 || objectId) && !hasBothObjectFilters

  let aggregatedRunIds: number[] | undefined

  // If we have a deposition ID filter, use 2-pass approach to find runs across all data types
  if (filterDepositionId) {
    // Pass 1: Aggregate run IDs from all deposition-related queries
    aggregatedRunIds = await getAggregatedRunIdsByDeposition({
      depositionId: filterDepositionId,
      client,
    })

    // If no runs found with this deposition ID, use empty array to indicate no results
    if (aggregatedRunIds.length === 0) {
      aggregatedRunIds = [] // Use empty array to indicate no results
    }
  }

  // Handle ObjectName + ObjectId filter combinations
  if (hasBothObjectFilters) {
    const { objectNameFilter, objectIdFilter } =
      createObjectNameVsObjectIdFilters(filterState)

    // fetch only run IDs from each filter x table combination
    let objectNameIds: number[]
    let objectIdIds: number[]

    if (annotatedObjectsOnly) {
      // When "Annotated Objects Only" is enabled, only search annotations table
      ;[objectNameIds, objectIdIds] = await Promise.all([
        fetchRunIdsByFilter({
          client,
          filterState: objectNameFilter,
          datasetId: id,
          aggregatedRunIds,
        }),
        fetchRunIdsByFilter({
          client,
          filterState: objectIdFilter,
          datasetId: id,
          aggregatedRunIds,
        }),
      ])
    } else {
      // When "Annotated Objects Only" is disabled, search across both tables
      const [nameAnnot, nameIdent, idAnnot, idIdent] = await Promise.all([
        fetchRunIdsByFilter({
          client,
          filterState: objectNameFilter,
          datasetId: id,
          aggregatedRunIds,
        }),
        fetchRunIdsByFilter({
          client,
          filterState: {
            ...objectNameFilter,
            annotation: {
              ...objectNameFilter.annotation,
              _searchIdentifiedObjectsOnly: true,
            },
          },
          datasetId: id,
          aggregatedRunIds,
        }),
        fetchRunIdsByFilter({
          client,
          filterState: objectIdFilter,
          datasetId: id,
          aggregatedRunIds,
        }),
        fetchRunIdsByFilter({
          client,
          filterState: {
            ...objectIdFilter,
            annotation: {
              ...objectIdFilter.annotation,
              _searchIdentifiedObjectsOnly: true,
            },
          },
          datasetId: id,
          aggregatedRunIds,
        }),
      ])

      objectNameIds = unionIds(nameAnnot, nameIdent)
      objectIdIds = unionIds(idAnnot, idIdent)
    }

    const intersectedIds = intersectIds(objectNameIds, objectIdIds)

    if (intersectedIds.length === 0) {
      return client.query({
        query: GET_DATASET_BY_ID_QUERY_V2,
        variables: {
          id,
          depositionId,
          runLimit: MAX_PER_PAGE,
          runOffset: 0,
          runFilter: { id: { _in: [] }, datasetId: { _eq: id } },
        },
      })
    }

    // Pass 2: fetch full data for the paginated subset only
    return fetchRunPageByIds({
      ids: intersectedIds,
      page,
      id,
      depositionId,
      client,
    })
  }

  // Single object filter across both tables (OR logic via ID union)
  if (hasSingleObjectFilter && !annotatedObjectsOnly) {
    const { annotationFilter, identifiedObjectFilter } =
      createAnnotationVsIdentifiedObjectFilters(filterState)

    // fetch run IDs from both tables concurrently
    const [annotationIds, identifiedIds] = await Promise.all([
      fetchRunIdsByFilter({
        client,
        filterState: annotationFilter,
        datasetId: id,
        aggregatedRunIds,
      }),
      fetchRunIdsByFilter({
        client,
        filterState: identifiedObjectFilter,
        datasetId: id,
        aggregatedRunIds,
      }),
    ])

    const mergedIds = unionIds(annotationIds, identifiedIds)

    if (mergedIds.length === 0) {
      return client.query({
        query: GET_DATASET_BY_ID_QUERY_V2,
        variables: {
          id,
          depositionId,
          runLimit: MAX_PER_PAGE,
          runOffset: 0,
          runFilter: { id: { _in: [] }, datasetId: { _eq: id } },
        },
      })
    }

    // fetch full data for the paginated subset only
    return fetchRunPageByIds({
      ids: mergedIds,
      page,
      id,
      depositionId,
      client,
    })
  }

  return client.query({
    query: GET_DATASET_BY_ID_QUERY_V2,
    variables: {
      id,
      depositionId,
      runLimit: MAX_PER_PAGE,
      runOffset: (page - 1) * MAX_PER_PAGE,
      runFilter: getRunFilter(filterState, id, aggregatedRunIds),
    },
  })
}
