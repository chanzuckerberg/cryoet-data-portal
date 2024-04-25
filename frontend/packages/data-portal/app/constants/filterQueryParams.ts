import { QueryParams } from './query'

export const DATASET_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.AvailableFiles,
  QueryParams.NumberOfRuns,
  QueryParams.PortalId,
  QueryParams.EmpiarId,
  QueryParams.EmdbId,
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

export const RUN_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.QualityScore,
  QueryParams.TiltRangeMin,
  QueryParams.TiltRangeMax,
  QueryParams.ObjectName,
  QueryParams.ObjectShapeType,
] as const
