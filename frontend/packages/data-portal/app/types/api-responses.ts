/**
 * Type definitions for consistent API response structures
 * across all deposition-related endpoints
 */

import {
  GetDepositionAnnotationsQuery,
  GetDepositionTomogramsQuery,
} from 'app/__generated_v2__/graphql'

/**
 * Response format for run count endpoints
 */
export interface RunCountsResponse {
  runCounts: Record<number, number>
}

/**
 * Represents a dataset option in dropdown/selection lists
 */
export interface DatasetOption {
  id: number
  title: string
  organismName: string | null
}

/**
 * Response format for deposition datasets endpoint
 */
export interface DepositionDatasetsResponse {
  datasets: DatasetOption[]
  organismCounts: Record<string, number>
  annotationCounts: Record<number, number>
  tomogramCounts: Record<number, number>
}

/**
 * Base response structure for paginated data
 */
export interface PaginatedResponse<T> {
  data: T
  pagination?: {
    page: number
    pageSize: number
    total?: number
  }
}

/**
 * Response format for annotations endpoint
 * The actual data structure will be determined by GraphQL response
 */
export interface AnnotationsResponse {
  data: GetDepositionAnnotationsQuery['annotationShapes']
}

/**
 * Response format for tomograms endpoint
 * The actual data structure will be determined by GraphQL response
 */
export interface TomogramsResponse {
  data: GetDepositionTomogramsQuery['tomograms']
}

/**
 * Response format for unified organism endpoint
 * Returns either annotations or tomograms based on type parameter
 */
export interface ItemsByOrganismResponse {
  annotations?: GetDepositionAnnotationsQuery['annotationShapes']
  tomograms?: GetDepositionTomogramsQuery['tomograms']
}

/**
 * Generic error response structure
 */
export interface ApiErrorResponse {
  error: string
  message?: string
}
