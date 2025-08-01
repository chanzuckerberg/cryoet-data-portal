import type { DataContentsType } from 'app/types/deposition-queries'
import type { GroupByOption } from 'app/types/depositionTypes'

/**
 * Parameters for the useDepositionGroupedData hook
 */
export interface DepositionGroupedDataParams {
  /** The ID of the deposition to fetch data for */
  depositionId: number | undefined
  /** The type of grouping to apply to the data */
  groupBy: GroupByOption
  /** The type of data content to fetch (annotations or tomograms) */
  type: DataContentsType
  /** Whether to enable the query - useful for conditional fetching */
  enabled?: boolean
}

/**
 * Organism data structure for grouped views
 */
export interface OrganismData {
  /** The name of the organism */
  name: string
  /** Number of datasets containing this organism */
  datasetCount: number
  /** Number of annotations/tomograms for this organism */
  itemCount: number
}

/**
 * Dataset data structure with associated counts
 */
export interface DatasetWithCounts {
  /** Dataset ID */
  id: number
  /** Dataset title */
  title: string
  /** Organism name associated with the dataset */
  organismName: string | null
  /** Number of runs in this dataset */
  runCount: number
  /** Number of annotations in this dataset */
  annotationCount: number
  /** Number of tomogram runs in this dataset */
  tomogramRunCount: number
}

/**
 * Aggregated count data for different grouping types
 */
export interface DepositionCounts {
  /** Organism name to count mapping */
  organisms: Record<string, number>
  /** Dataset ID to annotation count mapping */
  annotations: Record<number, number>
  /** Dataset ID to tomogram count mapping */
  tomograms: Record<number, number>
  /** Dataset ID to run count mapping */
  runs: Record<number, number>
}

/**
 * The main result interface returned by useDepositionGroupedData
 */
export interface DepositionGroupedDataResult {
  /** Array of datasets with associated count data (filtered) */
  datasets: DatasetWithCounts[]
  /** Array of organism data for organism-grouped views (filtered) */
  organisms: OrganismData[]
  /** Aggregated count data for different data types */
  counts: DepositionCounts
  /** Total number of datasets before filtering */
  totalDatasetCount: number
  /** Number of datasets after filtering */
  filteredDatasetCount: number
  /** Total number of organisms before filtering */
  totalOrganismCount: number
  /** Number of organisms after filtering */
  filteredOrganismCount: number
  /** Combined loading state from all underlying queries */
  isLoading: boolean
  /** Any error from the underlying queries */
  error: Error | null
  /** Whether the query is enabled and should fetch data */
  enabled: boolean
}

/**
 * Internal state for managing data transformations within the hook
 */
export interface GroupedDataState {
  /** Raw datasets from the API */
  rawDatasets: Array<{
    id: number
    title: string
    organismName: string | null
  }>
  /** Organism counts from dataset query */
  organismCounts: Record<string, number>
  /** Annotation counts from dataset query */
  annotationCounts: Record<number, number>
  /** Tomogram counts from dataset query */
  tomogramCounts: Record<number, number>
  /** Run counts from separate query */
  runCounts: Record<number, number>
}

/**
 * Configuration for data aggregation based on grouping type
 */
export interface DataAggregationConfig {
  /** The grouping method to apply */
  groupBy: GroupByOption
  /** The data content type being viewed */
  contentType: DataContentsType
  /** Whether to include run count data */
  includeRunCounts: boolean
  /** Whether to include annotation count data */
  includeAnnotationCounts: boolean
  /** Whether to include tomogram count data */
  includeTomogramCounts: boolean
}

/**
 * Error types specific to deposition grouped data operations
 */
export enum DepositionGroupedDataError {
  DATASETS_FETCH_FAILED = 'DATASETS_FETCH_FAILED',
  RUN_COUNTS_FETCH_FAILED = 'RUN_COUNTS_FETCH_FAILED',
  DATA_TRANSFORMATION_FAILED = 'DATA_TRANSFORMATION_FAILED',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
}

/**
 * Hook options for customizing behavior
 */
export interface DepositionGroupedDataOptions {
  /** Whether to enable the query - useful for conditional fetching */
  enabled?: boolean
  /** Whether to fetch run counts (expensive operation) */
  fetchRunCounts?: boolean
  /** Custom error handler */
  onError?: (error: Error) => void
  /** Custom loading handler */
  onLoadingChange?: (isLoading: boolean) => void
}
