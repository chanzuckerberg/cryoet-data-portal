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
      tomogramsAggregate {
        aggregate {
          count
        }
      }
      framesAggregate {
        aggregate {
          count
        }
      }
      alignmentsAggregate {
        aggregate {
          count
        }
      }
      annotationsAggregate {
        aggregate {
          count
        }
      }
      tiltseriesAggregate {
        aggregate {
          count
        }
      }
      perSectionParametersAggregate(where: {majorDefocus: {_is_null: false}}) {
        aggregate {
          count
        }
      }
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
  }
`)

function getRunFilter(
  filterState: FilterState,
  datasetId: number,
): RunWhereClause {
  const where: RunWhereClause = {
    datasetId: {
      _eq: datasetId,
    },
  }

  // Deposition filter:
  const depositionId = +(filterState.ids.deposition ?? Number.NaN)
  if (!Number.isNaN(depositionId) && depositionId > 0) {
    where.annotations ??= {}
    where.annotations.depositionId = { _eq: depositionId }
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
  if (filterState.annotation.objectNames.length > 0) {
    where.annotations ??= {}
    where.annotations.objectName = {
      _in: filterState.annotation.objectNames,
    }
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
    where.annotations ??= {}
    where.annotations.objectId = {
      _ilike: `%${filterState.annotation.objectId.replace(':', '_')}`, // _ is wildcard
    }
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
  return client.query({
    query: GET_DATASET_BY_ID_QUERY_V2,
    variables: {
      id,
      depositionId,
      runLimit: MAX_PER_PAGE,
      runOffset: (page - 1) * MAX_PER_PAGE,
      runFilter: getRunFilter(getFilterState(params), id),
    },
  })
}
