import { Depositions_Bool_Exp } from 'app/__generated__/graphql'
import {
  Annotation_File_Shape_Type_Enum,
  DatasetWhereClause,
  Fiducial_Alignment_Status_Enum,
  Tomogram_Reconstruction_Method_Enum,
} from 'app/__generated_v2__/graphql'
import {
  DEFAULT_TILT_RANGE_MAX,
  DEFAULT_TILT_RANGE_MIN,
} from 'app/constants/tiltSeries'
import { FilterState } from 'app/hooks/useFilter'

export const depositionWithAnnotationFilter: Depositions_Bool_Exp = {
  annotations_aggregate: {
    count: {
      predicate: {
        _gt: 0,
      },
    },
  },
}

export function convertReconstructionMethodToV2(
  v1: string,
): Tomogram_Reconstruction_Method_Enum {
  switch (v1) {
    case 'Fourier Space':
      return Tomogram_Reconstruction_Method_Enum.FourierSpace
    case 'SART':
      return Tomogram_Reconstruction_Method_Enum.Sart
    case 'SIRT':
      return Tomogram_Reconstruction_Method_Enum.Sirt
    case 'WBP':
      return Tomogram_Reconstruction_Method_Enum.Wbp
    case 'Unknown':
    default:
      return Tomogram_Reconstruction_Method_Enum.Unknown
  }
}

export interface GetDatasetsFilterParams {
  filterState: FilterState
  depositionId?: number
  searchText?: string
}

export function getDatasetsFilter({
  filterState,
  depositionId,
  searchText,
}: GetDatasetsFilterParams): DatasetWhereClause {
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
  for (const availableFile of filterState.includedContents.availableFiles) {
    where.runs ??= {}
    switch (availableFile) {
      case 'raw-frames':
        where.runs.framesAggregate = {
          count: {
            predicate: {
              _gt: 0,
            },
          },
        }
        break
      case 'tilt-series':
        where.runs.tiltseriesAggregate = {
          count: {
            predicate: {
              _gt: 0,
            },
          },
        }
        break
      case 'tilt-series-alignment':
        where.runs.tiltseries ??= {}
        where.runs.tiltseries.alignmentsAggregate = {
          count: {
            predicate: {
              _gt: 0,
            },
          },
        }
        break
      case 'tomogram':
        where.runs.tomogramsAggregate = {
          count: {
            predicate: {
              _gt: 0,
            },
          },
        }
        break
      default:
    }
  }
  // Number of Runs
  const numberOfRuns = filterState.includedContents.numberOfRuns
    ? parseInt(filterState.includedContents.numberOfRuns.replace('>', ''))
    : undefined
  if (Number.isInteger(numberOfRuns)) {
    where.runsAggregate = {
      count: {
        predicate: {
          _gte: numberOfRuns,
        },
      },
    }
  }

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
  const filterDepositionId =
    filterState.ids.deposition !== null
      ? parseInt(filterState.ids.deposition)
      : undefined
  if (depositionId !== undefined || Number.isInteger(filterDepositionId)) {
    where.runs ??= { annotations: {} }
    where.runs.annotations ??= {}
    where.runs.annotations.depositionId = {
      _eq: depositionId ?? filterDepositionId,
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
