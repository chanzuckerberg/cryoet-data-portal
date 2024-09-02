import { QueryParams } from './query'

const COMMON_DATASET_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.AvailableFiles,
  QueryParams.NumberOfRuns,
  QueryParams.DatasetId,
  QueryParams.AuthorName,
  QueryParams.AuthorOrcid,
  QueryParams.Organism,
  QueryParams.CameraManufacturer,
  QueryParams.TiltRangeMin,
  QueryParams.TiltRangeMax,
  QueryParams.FiducialAlignmentStatus,
  QueryParams.ReconstructionMethod,
  QueryParams.ReconstructionSoftware,
  QueryParams.ObjectName,
  QueryParams.ObjectShapeType,
] as const

export const DATASET_FILTERS = [
  ...COMMON_DATASET_FILTERS,
  QueryParams.EmpiarId,
  QueryParams.EmdbId,
  QueryParams.DepositionId,
] as const

export const RUN_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.QualityScore,
  QueryParams.TiltRangeMin,
  QueryParams.TiltRangeMax,
  QueryParams.ObjectId,
  QueryParams.ObjectName,
  QueryParams.ObjectShapeType,
  QueryParams.DepositionId,
] as const

export const ANNOTATION_FILTERS = [
  QueryParams.AuthorName,
  QueryParams.AuthorOrcid,
  QueryParams.ObjectName,
  QueryParams.ObjectId,
  QueryParams.ObjectShapeType,
  QueryParams.MethodType,
  QueryParams.AnnotationSoftware,
] as const

export const DEPOSITION_FILTERS = [
  ...COMMON_DATASET_FILTERS,
  QueryParams.ObjectId,
] as const
