import {
  GetAnnotationsForRunAndDepositionQuery,
  GetDepositionAnnoRunsForDatasetQuery,
  GetDepositionAnnotationsQuery,
  GetDepositionTomogramsQuery,
  GetDepositionTomoRunsForDatasetQuery,
  GetTomogramsForRunAndDepositionQuery,
} from 'app/__generated_v2__/graphql'

// Base parameter interfaces
export interface BaseDepositionQueryParams {
  depositionId: number | undefined
  enabled?: boolean
}

export interface PaginatedQueryParams extends BaseDepositionQueryParams {
  page?: number
  pageSize?: number
}

export interface OrganismFilterParams extends PaginatedQueryParams {
  organismName: string | undefined
}

export interface RunParams extends BaseDepositionQueryParams {
  runId: number | undefined
  page?: number
}

export interface DatasetParams extends BaseDepositionQueryParams {
  datasetId: number | undefined
  page: number
}

// Response type interfaces
export interface RunCountsResponse {
  runCounts: Record<number, number>
}

export interface DatasetOption {
  id: number
  title: string
  organismName: string | null
}

export interface DepositionDatasetsResponse {
  datasets: DatasetOption[]
  organismCounts: Record<string, number>
  annotationCounts: Record<number, number>
  tomogramCounts: Record<number, number>
}

export interface AnnotationsByOrganismResponse {
  annotations: GetDepositionAnnotationsQuery['annotationShapes']
}

export interface TomogramsByOrganismResponse {
  tomograms: GetDepositionTomogramsQuery['tomograms']
}

export interface ItemsByOrganismResponse {
  annotations?: GetDepositionAnnotationsQuery['annotationShapes']
  tomograms?: GetDepositionTomogramsQuery['tomograms']
}

// Generic types for unified hooks
export enum DataContentsType {
  Annotations = 'annotations',
  Tomograms = 'tomograms',
}

export interface UnifiedRunCountsParams extends BaseDepositionQueryParams {
  datasetIds: number[]
  type: DataContentsType
}

export interface UnifiedRunsParams extends DatasetParams {
  type: DataContentsType
}

export interface UnifiedItemsForRunParams extends RunParams {
  type: DataContentsType
}

export interface UnifiedItemsByOrganismParams extends OrganismFilterParams {
  type: DataContentsType
}

// Union types for responses
export type RunsQueryResponse =
  | GetDepositionAnnoRunsForDatasetQuery
  | GetDepositionTomoRunsForDatasetQuery

export type ItemsForRunResponse =
  | GetAnnotationsForRunAndDepositionQuery
  | GetTomogramsForRunAndDepositionQuery

// API endpoint mappings
export const API_ENDPOINTS = {
  annotationsForRun: '/api/annotations-for-run',
  tomogramsForRun: '/api/tomograms-for-run',
  depositionDatasets: '/api/deposition-datasets',
  depositionAnnoRuns: '/api/deposition-anno-runs',
  depositionTomoRuns: '/api/deposition-tomo-runs',
  depositionRunCounts: '/api/deposition-run-counts',
  depositionTomoRunCounts: '/api/deposition-tomo-run-counts',
  depositionAnnotationsByOrganism: '/api/deposition-annotations-by-organism',
  depositionTomogramsByOrganism: '/api/deposition-tomograms-by-organism',
  depositionItemsByOrganism: '/api/deposition-items-by-organism',
} as const

// Query key prefixes for consistent caching
export const QUERY_KEY_PREFIXES = {
  annotationsForRun: 'annotations-for-run',
  tomogramsForRun: 'tomograms-for-run',
  depositionDatasets: 'deposition-datasets',
  depositionAnnoRuns: 'deposition-anno-runs',
  depositionTomoRuns: 'deposition-tomo-runs',
  depositionRunCounts: 'deposition-run-counts',
  depositionTomoRunCounts: 'deposition-tomo-run-counts',
  depositionAnnotationsByOrganism: 'deposition-annotations-by-organism',
  depositionTomogramsByOrganism: 'deposition-tomograms-by-organism',
  depositionItemsByOrganism: 'deposition-items-by-organism',
} as const

export type DepositionQueryKey = keyof typeof QUERY_KEY_PREFIXES
export type DepositionApiEndpoint = keyof typeof API_ENDPOINTS
