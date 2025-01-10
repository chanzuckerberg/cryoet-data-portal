import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  Annotation_File_Shape_Type_Enum,
  DatasetWhereClause,
  Fiducial_Alignment_Status_Enum,
  GetDatasetsV2Query,
  OrderBy,
} from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import {
  DEFAULT_TILT_RANGE_MAX,
  DEFAULT_TILT_RANGE_MIN,
} from 'app/constants/tiltSeries'
import { FilterState, getFilterState } from 'app/hooks/useFilter'

import { convertReconstructionMethodToV2 } from './common'

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
            }
          }
        }
      }
    }

    ...DatasetsAggregates
  }
`)

function getFilter(
  filterState: FilterState,
  searchText?: string,
): DatasetWhereClause {
  const where: DatasetWhereClause = {}

  // Search by Dataset Name
  if (searchText) {
    where.title = {
      _ilike: `%${searchText}%`,
    }
  }

  // INCLUDED CONTENTS SECTION
  // Ground Truth Annotation
  if (filterState.includedContents.isGroundTruthEnabled) {
    where.runs ??= { annotations: {} }
    where.runs.annotations ??= {}
    where.runs.annotations.groundTruthStatus = {
      _eq: true,
    }
  }
  // Available Files
  // TODO(bchu): Implement when available in API.
  // filterState.includedContents.availableFiles.forEach((file) =>
  //   match(file)
  //     .with('raw-frames', () =>
  //       where.push({
  //         runs: {
  //           tiltseries: {
  //             frames_count: {
  //               _gt: 0,
  //             },
  //           },
  //         },
  //       }),
  //     )
  //     .with('tilt-series', () =>
  //       where.push({
  //         runs: {
  //           tiltseries_aggregate: {
  //             count: {
  //               predicate: {
  //                 _gt: 0,
  //               },
  //             },
  //           },
  //         },
  //       }),
  //     )
  //     .with('tilt-series-alignment', () =>
  //       where.push({
  //         runs: {
  //           tiltseries: {
  //             https_alignment_file: {
  //               _is_null: false,
  //             },
  //           },
  //         },
  //       }),
  //     )
  //     .with('tomogram', () =>
  //       where.push({
  //         runs: {
  //           tomogram_voxel_spacings: {
  //             tomograms_aggregate: {
  //               count: {
  //                 predicate: {
  //                   _gt: 0,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       }),
  //     )
  //     .exhaustive(),
  // )
  // Number of Runs
  // TODO: Implement when available in API.
  // if (filterState.includedContents.numberOfRuns) {
  //   const runCount = +filterState.includedContents.numberOfRuns.slice(1)
  //   where.push({
  //     runs_aggregate: {
  //       count: {
  //         predicate: { _gte: runCount },
  //       },
  //     },
  //   })
  // }

  // NAME/ID SECTION
  // Dataset IDs
  const datasetId =
    filterState.ids.dataset !== null
      ? parseInt(filterState.ids.dataset)
      : undefined
  if (Number.isInteger(datasetId)) {
    where.id = {
      _eq: datasetId,
    }
  }
  const empiarId = filterState.ids.empiar
  const emdbId = filterState.ids.emdb
  if (empiarId && emdbId) {
    where.relatedDatabaseEntries = {
      _regex: `(EMPIAR-${empiarId}.*EMD-${emdbId})|(EMD-${emdbId}.*EMPIAR-${empiarId})`, // Ignores order
    }
  } else if (empiarId) {
    where.relatedDatabaseEntries = {
      _regex: `EMPIAR-${empiarId}`,
    }
  } else if (emdbId) {
    where.relatedDatabaseEntries = {
      _regex: `EMD-${emdbId}`,
    }
  }
  // Dataset Author
  if (filterState.author.name) {
    where.authors ??= {}
    where.authors.name = {
      _ilike: `%${filterState.author.name}%`,
    }
  }
  if (filterState.author.orcid) {
    where.authors ??= {}
    where.authors.orcid = {
      _ilike: `%${filterState.author.orcid}%`,
    }
  }
  // Deposition ID
  const depositionId =
    filterState.ids.deposition !== null
      ? parseInt(filterState.ids.deposition)
      : undefined
  if (Number.isInteger(depositionId)) {
    where.depositionId = {
      _eq: depositionId,
    }
  }

  // SAMPLE AND EXPERIMENT CONDITIONS SECTION
  const { organismNames } = filterState.sampleAndExperimentConditions
  if (organismNames.length > 0) {
    where.organismName = {
      _in: organismNames,
    }
  }

  // ANNOTATION METADATA SECTION
  const { objectNames, objectId, objectShapeTypes } = filterState.annotation
  // Object Name
  if (objectNames.length > 0) {
    where.runs ??= { annotations: {} }
    where.runs.annotations ??= {}
    where.runs.annotations.objectName = {
      _in: objectNames,
    }
  }
  // Object ID
  if (objectId) {
    where.runs ??= { annotations: {} }
    where.runs.annotations ??= {}
    where.runs.annotations.objectId = {
      _eq: objectId,
    }
  }
  // Object Shape Type
  if (objectShapeTypes.length > 0) {
    where.runs ??= { annotations: {} }
    where.runs.annotations ??= {}
    where.runs.annotations.annotationShapes = {
      shapeType: {
        _in: objectShapeTypes as Annotation_File_Shape_Type_Enum[], // TODO(bchu): Remove typecast.
      },
    }
  }

  // HARDWARE SECTION
  if (filterState.hardware.cameraManufacturer) {
    where.runs ??= { tiltseries: {} }
    where.runs.tiltseries ??= {}
    where.runs.tiltseries.cameraManufacturer = {
      _eq: filterState.hardware.cameraManufacturer,
    }
  }

  // TILT SERIES METADATA SECTION
  const tiltRangeMin = parseFloat(filterState.tiltSeries.min)
  const tiltRangeMax = parseFloat(filterState.tiltSeries.max)
  if (Number.isFinite(tiltRangeMin) || Number.isFinite(tiltRangeMax)) {
    where.runs ??= { tiltseries: {} }
    where.runs.tiltseries ??= {}
    where.runs.tiltseries.tiltRange = {
      _gte: Number.isFinite(tiltRangeMin)
        ? tiltRangeMin
        : DEFAULT_TILT_RANGE_MIN,
      _lte: Number.isFinite(tiltRangeMax)
        ? tiltRangeMax
        : DEFAULT_TILT_RANGE_MAX,
    }
  }

  // TOMOGRAM METADATA SECTION
  // Fiducial Alignment Status
  if (filterState.tomogram.fiducialAlignmentStatus) {
    where.runs ??= { tomograms: {} }
    where.runs.tomograms ??= {}
    where.runs.tomograms.fiducialAlignmentStatus = {
      _eq:
        filterState.tomogram.fiducialAlignmentStatus === 'true'
          ? Fiducial_Alignment_Status_Enum.Fiducial
          : Fiducial_Alignment_Status_Enum.NonFiducial,
    }
  }
  // Reconstruction Method
  if (filterState.tomogram.reconstructionMethod) {
    where.runs ??= { tomograms: {} }
    where.runs.tomograms ??= {}
    where.runs.tomograms.reconstructionMethod = {
      _eq: convertReconstructionMethodToV2(
        filterState.tomogram.reconstructionMethod,
      ),
    }
  }
  // Reconstruction Software
  if (filterState.tomogram.reconstructionSoftware) {
    where.runs ??= { tomograms: {} }
    where.runs.tomograms ??= {}
    where.runs.tomograms.reconstructionSoftware = {
      _eq: filterState.tomogram.reconstructionSoftware,
    }
  }

  return where
}

export async function getDatasetsV2({
  page,
  titleOrderDirection,
  searchText,
  params,
  client,
}: {
  page: number
  titleOrderDirection?: OrderBy
  searchText?: string
  params: URLSearchParams
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetsV2Query>> {
  return client.query({
    query: GET_DATASETS_QUERY,
    variables: {
      datasetsFilter: getFilter(getFilterState(params), searchText),
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
