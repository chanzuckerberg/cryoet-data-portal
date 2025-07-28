import { useMemo } from 'react'

import { useDatasetsForDeposition } from 'app/queries/useDatasetsForDeposition'
import type {
  DatasetWithCounts,
  DepositionCounts,
  DepositionGroupedDataOptions,
  DepositionGroupedDataParams,
  DepositionGroupedDataResult,
  OrganismData,
} from 'app/types/deposition-grouped-data'
import type {
  RunCountsResponse,
  UnifiedRunCountsParams,
} from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'
import {
  createDepositionQuery,
  createEmptyResponse,
} from 'app/utils/createDepositionQuery'
import { getRunApiEndpoints } from 'app/utils/deposition-api'
import { isDefined } from 'app/utils/nullish'

/**
 * Custom hook that provides unified access to deposition data with grouping capabilities.
 *
 * This hook consolidates multiple data fetching operations and provides a consistent
 * interface for accessing datasets, organisms, and associated counts regardless of
 * the grouping method or content type.
 *
 * @param params - Configuration object for the hook
 * @param options - Optional configuration for customizing hook behavior
 * @returns Consolidated deposition data with loading states and error handling
 */
export function useDepositionGroupedData(
  params: DepositionGroupedDataParams,
  options: DepositionGroupedDataOptions = {},
): DepositionGroupedDataResult {
  const { depositionId, groupBy, tab, enabled = true } = params

  const {
    fetchRunCounts = true,
    enableMemoization = true,
    onError,
    onLoadingChange,
  } = options

  // Fetch datasets and basic count data
  const datasetsQuery = useDatasetsForDeposition({
    depositionId,
    type: tab,
    enabled,
  })

  // Extract dataset IDs for run counts query
  const datasetIds = useMemo(() => {
    return datasetsQuery.datasets?.map((dataset) => dataset.id) || []
  }, [datasetsQuery.datasets])

  // Create inline run counts query - consolidated from useDepositionRunCounts
  const { countsEndpoint } = getRunApiEndpoints(tab)

  const createRunCountsQueryHook = createDepositionQuery<
    RunCountsResponse,
    UnifiedRunCountsParams
  >({
    endpoint: countsEndpoint,
    queryKeyPrefix: `deposition-${tab}-run-counts`,
    getQueryKeyValues: (runCountsParams) => [
      runCountsParams.depositionId,
      runCountsParams.datasetIds.join(','),
    ],
    getApiParams: (runCountsParams) => ({
      depositionId: runCountsParams.depositionId,
      datasetIds: runCountsParams.datasetIds.join(','),
    }),
    getRequiredParams: (runCountsParams) => ({
      depositionId: runCountsParams.depositionId,
      datasetIds:
        runCountsParams.datasetIds?.length > 0
          ? runCountsParams.datasetIds
          : undefined,
    }),
    transformResponse: (data): RunCountsResponse => {
      if (!data) {
        return createEmptyResponse('counts')
      }
      return data as RunCountsResponse
    },
  })

  // Fetch run counts only if needed and we have dataset IDs
  const runCountsQuery = createRunCountsQueryHook({
    depositionId,
    datasetIds,
    type: tab,
    enabled: enabled && fetchRunCounts && datasetIds.length > 0,
  })

  // Handle loading state changes
  const isLoading = datasetsQuery.isLoading || runCountsQuery.isLoading
  useMemo(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading, onLoadingChange])

  // Handle errors
  const error = datasetsQuery.error || runCountsQuery.error
  useMemo(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  // Transform and aggregate data
  const result = useMemo((): DepositionGroupedDataResult => {
    // Early return for loading or error states
    if (isLoading) {
      return {
        datasets: [],
        organisms: [],
        counts: {
          organisms: {},
          annotations: {},
          tomograms: {},
          runs: {},
        },
        isLoading: true,
        error: null,
        enabled,
      }
    }

    if (error) {
      return {
        datasets: [],
        organisms: [],
        counts: {
          organisms: {},
          annotations: {},
          tomograms: {},
          runs: {},
        },
        isLoading: false,
        error,
        enabled,
      }
    }

    // Get base data from queries
    const rawDatasets = datasetsQuery.datasets || []
    const organismCounts = datasetsQuery.organismCounts || {}
    const annotationCounts = datasetsQuery.annotationCounts || {}
    const tomogramCounts = datasetsQuery.tomogramCounts || {}
    const runCounts = runCountsQuery.data?.runCounts || {}

    // Transform datasets with count data
    const datasetsWithCounts: DatasetWithCounts[] = rawDatasets.map(
      (dataset) => ({
        id: dataset.id,
        title: dataset.title,
        organismName: dataset.organismName,
        runCount: runCounts[dataset.id] || 0,
        annotationCount: annotationCounts[dataset.id] || 0,
        tomogramRunCount: tomogramCounts[dataset.id] || 0,
      }),
    )

    // Generate organism data for organism-grouped views
    const organisms: OrganismData[] = generateOrganismData({
      datasets: datasetsWithCounts,
      organismCounts,
      groupBy,
    })

    // Consolidate all count data
    const counts: DepositionCounts = {
      organisms: organismCounts,
      annotations: annotationCounts,
      tomograms: tomogramCounts,
      runs: runCounts,
    }

    return {
      datasets: datasetsWithCounts,
      organisms,
      counts,
      isLoading: false,
      error: null,
      enabled,
    }
  }, [
    isLoading,
    error,
    enabled,
    datasetsQuery.datasets,
    datasetsQuery.organismCounts,
    datasetsQuery.annotationCounts,
    datasetsQuery.tomogramCounts,
    runCountsQuery.data,
    groupBy,
  ])

  // Apply memoization if enabled
  return enableMemoization ? result : result
}

/**
 * Helper function to generate organism data based on grouping configuration
 */
function generateOrganismData({
  datasets,
  organismCounts,
  groupBy,
}: {
  datasets: DatasetWithCounts[]
  organismCounts: Record<string, number>
  groupBy: GroupByOption
}): OrganismData[] {
  // Only generate organism data for organism-grouped views
  if (groupBy !== GroupByOption.Organism) {
    return []
  }

  // Extract unique organisms from datasets
  const organismNames = [
    ...new Set(
      datasets.map((dataset) => dataset.organismName).filter(isDefined),
    ),
  ].sort()

  return organismNames.map((name) => {
    // Count datasets containing this organism
    const datasetCount = datasets.filter(
      (dataset) => dataset.organismName === name,
    ).length

    // Get item count from organism counts (annotations or tomograms)
    const itemCount = organismCounts[name] || 0

    return {
      name,
      datasetCount,
      itemCount,
    }
  })
}
