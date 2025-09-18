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
import { getFeatureFlag } from 'app/utils/featureFlags'

import {
  createAnnotationVsIdentifiedObjectFilters,
  createObjectNameVsObjectIdFilters,
  dedupeById,
} from './common'
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
  isIdentifiedObjectsEnabled = false,
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
    } else if (annotatedObjectsOnly || !isIdentifiedObjectsEnabled) {
      // Only search annotations when annotated-objects=Yes or feature flag is off
      where.annotations ??= {}
      where.annotations.objectName = {
        _in: objectNames,
      }
    }
    // When identifiedObjects is enabled and annotatedObjectsOnly is false,
    // we search multiple tables in getDatasetByIdV2 and merge the results
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
    } else if (annotatedObjectsOnly || !isIdentifiedObjectsEnabled) {
      // Only search annotations when annotated-objects=Yes or feature flag is off
      where.annotations ??= {}
      where.annotations.objectId = {
        _ilike: `%${filterState.annotation.objectId.replace(':', '_')}%`, // _ is wildcard
      }
    }
    // When identifiedObjects is enabled and annotatedObjectsOnly is false,
    // we search multiple tables in getDatasetByIdV2 and merge the results
  }

  return where
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

  // Check if the identifiedObjects feature flag is enabled
  const isIdentifiedObjectsEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'identifiedObjects',
    params,
  })

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
  if (hasBothObjectFilters && isIdentifiedObjectsEnabled) {
    // Create filter states for intersection query
    const { objectNameFilter, objectIdFilter } =
      createObjectNameVsObjectIdFilters(filterState)

    // Common variables for all queries - fetch all results for proper deduplication
    const commonVariables = {
      id,
      depositionId,
      runLimit: null, // No limit - fetch all matching runs
      runOffset: 0, // Start from beginning
    }

    let objectNamesResults: GetDatasetByIdV2Query['runs']
    let objectIdResults: GetDatasetByIdV2Query['runs']
    let firstQueryResult: ApolloQueryResult<GetDatasetByIdV2Query>

    if (annotatedObjectsOnly) {
      // When "Annotated Objects Only" is enabled, only search annotations table
      const [objectNamesFromAnnotations, objectIdFromAnnotations] =
        await Promise.all([
          client.query({
            query: GET_DATASET_BY_ID_QUERY_V2,
            variables: {
              ...commonVariables,
              runFilter: getRunFilter(
                objectNameFilter,
                id,
                aggregatedRunIds,
                false, // Force annotations-only
              ),
            },
          }),
          client.query({
            query: GET_DATASET_BY_ID_QUERY_V2,
            variables: {
              ...commonVariables,
              runFilter: getRunFilter(
                objectIdFilter,
                id,
                aggregatedRunIds,
                false, // Force annotations-only
              ),
            },
          }),
        ])

      objectNamesResults = objectNamesFromAnnotations.data.runs ?? []
      objectIdResults = objectIdFromAnnotations.data.runs ?? []
      firstQueryResult = objectNamesFromAnnotations // For return structure
    } else {
      // When "Annotated Objects Only" is disabled, search across both tables

      // SEARCH BOTH TABLES FOR OBJECTNAMES: annotations + identifiedObjects
      const [
        objectNamesFromAnnotations,
        objectNamesFromIdentified,
        objectIdFromAnnotations,
        objectIdFromIdentified,
      ] = await Promise.all([
        client.query({
          query: GET_DATASET_BY_ID_QUERY_V2,
          variables: {
            ...commonVariables,
            runFilter: getRunFilter(
              objectNameFilter,
              id,
              aggregatedRunIds,
              false, // Force annotations-only
            ),
          },
        }),
        client.query({
          query: GET_DATASET_BY_ID_QUERY_V2,
          variables: {
            ...commonVariables,
            runFilter: getRunFilter(
              {
                ...objectNameFilter,
                annotation: {
                  ...objectNameFilter.annotation,
                  _searchIdentifiedObjectsOnly: true,
                },
              },
              id,
              aggregatedRunIds,
              isIdentifiedObjectsEnabled,
            ),
          },
        }),
        client.query({
          query: GET_DATASET_BY_ID_QUERY_V2,
          variables: {
            ...commonVariables,
            runFilter: getRunFilter(
              objectIdFilter,
              id,
              aggregatedRunIds,
              false, // Force annotations-only
            ),
          },
        }),
        client.query({
          query: GET_DATASET_BY_ID_QUERY_V2,
          variables: {
            ...commonVariables,
            runFilter: getRunFilter(
              {
                ...objectIdFilter,
                annotation: {
                  ...objectIdFilter.annotation,
                  _searchIdentifiedObjectsOnly: true,
                },
              },
              id,
              aggregatedRunIds,
              isIdentifiedObjectsEnabled,
            ),
          },
        }),
      ])

      // Union and dedupe ObjectNames results
      objectNamesResults = dedupeById([
        ...(objectNamesFromAnnotations.data.runs ?? []),
        ...(objectNamesFromIdentified.data.runs ?? []),
      ])

      // Union and dedupe ObjectId results
      objectIdResults = dedupeById([
        ...(objectIdFromAnnotations.data.runs ?? []),
        ...(objectIdFromIdentified.data.runs ?? []),
      ])
      firstQueryResult = objectNamesFromAnnotations // For return structure
    }

    if (objectNamesResults.length === 0 || objectIdResults.length === 0) {
      // If either union returns no results, intersection is empty
      return {
        ...firstQueryResult,
        data: {
          ...firstQueryResult.data,
          runs: [],
          datasets: firstQueryResult.data.datasets?.map((dataset) => ({
            ...dataset,
            filteredRunsCount: {
              ...dataset.filteredRunsCount,
              aggregate: [{ count: 0 }],
            },
          })),
        },
      }
    }

    // Find intersection: runs that appear in BOTH deduped result sets
    const objectNamesIds = new Set(objectNamesResults.map((r) => r.id))
    const objectIdIds = new Set(objectIdResults.map((r) => r.id))
    const intersectionIds = new Set(
      [...objectNamesIds].filter((runId) => objectIdIds.has(runId)),
    )

    // Get the full run objects for the intersection
    const intersectedRuns = objectNamesResults.filter((run) =>
      intersectionIds.has(run.id),
    )

    // Sort intersection results
    const sortedIntersectedRuns = intersectedRuns.sort((a, b) =>
      a.name.localeCompare(b.name),
    )

    const totalIntersectedCount = sortedIntersectedRuns.length

    // Apply pagination after intersection
    const startIndex = (page - 1) * MAX_PER_PAGE
    const endIndex = startIndex + MAX_PER_PAGE
    const paginatedRuns = sortedIntersectedRuns.slice(startIndex, endIndex)

    // Return results using the first query's structure
    return {
      ...firstQueryResult,
      data: {
        ...firstQueryResult.data,
        runs: paginatedRuns,
        datasets: firstQueryResult.data.datasets?.map((dataset) => ({
          ...dataset,
          filteredRunsCount: {
            ...dataset.filteredRunsCount,
            aggregate: [{ count: totalIntersectedCount }],
          },
        })),
      },
    }
  }

  // SINGLE OBJECT FILTER: Multiple table search logic for single filters (OR logic)
  if (
    hasSingleObjectFilter &&
    isIdentifiedObjectsEnabled &&
    !annotatedObjectsOnly
  ) {
    // Create filter states for multiple table search
    const { annotationFilter, identifiedObjectFilter } =
      createAnnotationVsIdentifiedObjectFilters(filterState)

    // Common variables for both queries - fetch all results for proper deduplication
    const commonVariables = {
      id,
      depositionId,
      runLimit: null, // No limit - fetch all matching runs
      runOffset: 0, // Start from beginning
    }

    // Run both queries concurrently
    const [resultsWithAnnotations, resultsWithIdentifiedObjects] =
      await Promise.all([
        client.query({
          query: GET_DATASET_BY_ID_QUERY_V2,
          variables: {
            ...commonVariables,
            runFilter: getRunFilter(
              annotationFilter,
              id,
              aggregatedRunIds,
              false,
            ), // Force annotations-only
          },
        }),
        client.query({
          query: GET_DATASET_BY_ID_QUERY_V2,
          variables: {
            ...commonVariables,
            runFilter: getRunFilter(
              identifiedObjectFilter,
              id,
              aggregatedRunIds,
              isIdentifiedObjectsEnabled,
            ),
          },
        }),
      ])

    if (!resultsWithIdentifiedObjects.data.runs) {
      return resultsWithAnnotations
    }

    if (!resultsWithAnnotations.data.runs) {
      return resultsWithIdentifiedObjects
    }

    // Merge and dedupe runs
    const mergedRuns = dedupeById([
      ...resultsWithAnnotations.data.runs,
      ...resultsWithIdentifiedObjects.data.runs,
    ])

    const sortedMergedRuns = mergedRuns.sort((a, b) =>
      a.name.localeCompare(b.name),
    )

    const totalMergedCount = sortedMergedRuns.length

    // Apply pagination after merging and sorting
    const startIndex = (page - 1) * MAX_PER_PAGE
    const endIndex = startIndex + MAX_PER_PAGE
    const paginatedRuns = sortedMergedRuns.slice(startIndex, endIndex)

    resultsWithAnnotations.data.runs = paginatedRuns

    // Use the accurate merged count for filteredRunsCount
    if (resultsWithAnnotations.data.datasets?.[0]?.filteredRunsCount) {
      // Ensure the aggregate structure exists
      if (
        !resultsWithAnnotations.data.datasets[0].filteredRunsCount.aggregate
      ) {
        resultsWithAnnotations.data.datasets[0].filteredRunsCount.aggregate = []
      }

      // Ensure there's at least one aggregate object
      if (
        resultsWithAnnotations.data.datasets[0].filteredRunsCount.aggregate
          .length === 0
      ) {
        resultsWithAnnotations.data.datasets[0].filteredRunsCount.aggregate.push(
          {
            count: 0,
            __typename: 'RunAggregateFunctions',
          },
        )
      }

      resultsWithAnnotations.data.datasets[0].filteredRunsCount.aggregate[0].count =
        totalMergedCount
    }

    return resultsWithAnnotations
  }

  return client.query({
    query: GET_DATASET_BY_ID_QUERY_V2,
    variables: {
      id,
      depositionId,
      runLimit: MAX_PER_PAGE,
      runOffset: (page - 1) * MAX_PER_PAGE,
      runFilter: getRunFilter(
        filterState,
        id,
        aggregatedRunIds,
        isIdentifiedObjectsEnabled,
      ),
    },
  })
}
