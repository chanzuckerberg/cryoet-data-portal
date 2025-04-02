import {
  DatasetWhereClause,
  Deposition_Types_Enum,
  DepositionWhereClause,
  Fiducial_Alignment_Status_Enum,
  Tomogram_Reconstruction_Method_Enum,
} from 'app/__generated_v2__/graphql'
import { Tags } from 'app/constants/tags'
import {
  DEFAULT_TILT_RANGE_MAX,
  DEFAULT_TILT_RANGE_MIN,
} from 'app/constants/tiltSeries'
import { FilterState } from 'app/hooks/useFilter'

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
      case 'annotation':
        where.runs.annotationsAggregate = {
          count: {
            predicate: {
              _gt: 0,
            },
          },
        }
        break
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
        where.runs.alignmentsAggregate = {
          count: {
            predicate: {
              _gt: 0,
            },
          },
        }
        break
      case 'ctf':
        where.runs.perSectionParameters = {
          majorDefocus: {
            _is_null: false,
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
        _in: objectShapeTypes,
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

export function getDepositionsFilter({
  filterState,
}: {
  filterState: FilterState
}): DepositionWhereClause {
  const where: DepositionWhereClause = {
    depositionTypes: { type: { _eq: Deposition_Types_Enum.Annotation } },
  }

  // Competition Filter
  if (filterState.tags.competition) {
    where.tag ??= {}
    where.tag = {
      _eq: Tags.MLCompetition2024,
    }
  }

  // Deposition Author
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

  return where
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, no-param-reassign, @typescript-eslint/no-unsafe-argument */
// TODO(bchu): Delete this after migration.
export function removeTypenames(object: any): void {
  delete object?.__typename

  for (const [, value] of Object.entries(object)) {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      removeTypenames(value)
    } else if (Array.isArray(value)) {
      value.forEach(removeTypenames)
    }
  }
}
