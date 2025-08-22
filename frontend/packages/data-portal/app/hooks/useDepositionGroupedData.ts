import { useMemo } from 'react'

import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionId } from 'app/hooks/useDepositionId'
import {
  createEmptyResponse,
  useDepositionQuery,
} from 'app/hooks/useDepositionQuery'
import { useFilter } from 'app/hooks/useFilter'
import { useGroupBy } from 'app/hooks/useGroupBy'
import { useDatasetsForDeposition } from 'app/queries/useDatasetsForDeposition'
import type {
  DatasetWithCounts,
  DepositionCounts,
  DepositionGroupedDataOptions,
  DepositionGroupedDataResult,
  OrganismData,
} from 'app/types/deposition-grouped-data'
import type {
  RunCountsResponse,
  UnifiedRunCountsParams,
} from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'
import { getRunApiEndpoints } from 'app/utils/deposition-api'
import { isDefined } from 'app/utils/nullish'

/**
 * Custom hook that provides unified access to deposition data with grouping capabilities.
 *
 * This hook consolidates multiple data fetching operations and provides a consistent
 * interface for accessing datasets, organisms, and associated counts regardless of
 * the grouping method or content type.
 *
 * @param options - Optional configuration for customizing hook behavior
 * @returns Consolidated deposition data with loading states and error handling
 */
export function useDepositionGroupedData(
  options: DepositionGroupedDataOptions = {},
): DepositionGroupedDataResult {
  const depositionId = useDepositionId()
  const [groupBy] = useGroupBy()
  const [type] = useActiveDepositionDataType()
  const { enabled = true } = options

  // Get selected dataset IDs and organism names from filter state
  const {
    ids: { datasets: selectedDatasetIds },
    sampleAndExperimentConditions: { organismNames: selectedOrganismNames },
  } = useFilter()

  const { fetchRunCounts = true, onError, onLoadingChange } = options

  // Fetch datasets and basic count data
  const datasetsQuery = useDatasetsForDeposition(enabled)

  // Extract dataset IDs for run counts query
  const datasetIds = useMemo(() => {
    return datasetsQuery.datasets?.map((dataset) => dataset.id) || []
  }, [datasetsQuery.datasets])

  // Create inline run counts query - consolidated from useDepositionRunCounts
  const { countsEndpoint } = getRunApiEndpoints(type)

  // Fetch run counts only if needed and we have dataset IDs
  const runCountsQuery = useDepositionQuery<
    RunCountsResponse,
    UnifiedRunCountsParams
  >(
    {
      endpoint: countsEndpoint,
      queryKeyPrefix: `deposition-${type}-run-counts`,
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
    },
    {
      depositionId,
      datasetIds,
      type,
      enabled: enabled && fetchRunCounts && datasetIds.length > 0,
    },
  )

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
        totalDatasetCount: 0,
        filteredDatasetCount: 0,
        totalOrganismCount: 0,
        filteredOrganismCount: 0,
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
        totalDatasetCount: 0,
        filteredDatasetCount: 0,
        totalOrganismCount: 0,
        filteredOrganismCount: 0,
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

    // Calculate total counts before filtering
    const totalDatasetCount = rawDatasets.length
    const totalOrganismCount = [
      ...new Set(
        rawDatasets.map((dataset) => dataset.organismName).filter(isDefined),
      ),
    ].length

    // Filter datasets based on current selection
    const filteredDatasets =
      selectedDatasetIds.length > 0
        ? rawDatasets.filter((dataset) =>
            selectedDatasetIds.includes(String(dataset.id)),
          )
        : rawDatasets

    // Calculate filtered counts after filtering
    const filteredDatasetCount = filteredDatasets.length

    const allFilteredOrganismNames = [
      ...new Set(
        filteredDatasets
          .map((dataset) => dataset.organismName)
          .filter(isDefined),
      ),
    ]

    const filteredOrganismCount =
      selectedOrganismNames.length > 0
        ? allFilteredOrganismNames.filter((name) =>
            selectedOrganismNames.includes(name),
          ).length
        : allFilteredOrganismNames.length

    // Transform datasets with count data
    const datasetsWithCounts: DatasetWithCounts[] = filteredDatasets.map(
      (dataset) => ({
        id: dataset.id,
        title: dataset.title,
        organismName: dataset.organismName,
        runCount: runCounts[dataset.id] || 0,
        annotationCount: annotationCounts[dataset.id] || 0,
      }),
    )

    // Generate organism data for organism-grouped views
    const organisms: OrganismData[] = generateOrganismData({
      datasets: datasetsWithCounts,
      organismCounts,
      groupBy,
      selectedOrganismNames,
    })

    // Filter organism counts based on organism filters when in organism grouping mode
    const filteredOrganismCounts =
      groupBy === GroupByOption.Organism && selectedOrganismNames.length > 0
        ? Object.fromEntries(
            Object.entries(organismCounts).filter(([organismName]) =>
              selectedOrganismNames.includes(organismName),
            ),
          )
        : organismCounts

    // Consolidate all count data
    const counts: DepositionCounts = {
      organisms: filteredOrganismCounts,
      annotations: annotationCounts,
      tomograms: tomogramCounts,
      runs: runCounts,
    }

    return {
      datasets: datasetsWithCounts,
      organisms,
      counts,
      totalDatasetCount,
      filteredDatasetCount,
      totalOrganismCount,
      filteredOrganismCount,
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
    selectedDatasetIds,
    selectedOrganismNames,
  ])

  return result
}

/**
 * Helper function to generate organism data based on grouping configuration
 */
function generateOrganismData({
  datasets,
  organismCounts,
  groupBy,
  selectedOrganismNames,
}: {
  datasets: DatasetWithCounts[]
  organismCounts: Record<string, number>
  groupBy: GroupByOption
  selectedOrganismNames: string[]
}): OrganismData[] {
  // Only generate organism data for organism-grouped views
  if (groupBy !== GroupByOption.Organism) {
    return []
  }

  // Extract unique organisms from datasets
  const allOrganismNames = [
    ...new Set(
      datasets.map((dataset) => dataset.organismName).filter(isDefined),
    ),
  ].sort()

  // Filter organisms based on selected organism names
  // If no organism filters are active, return all organisms
  const filteredOrganismNames =
    selectedOrganismNames.length > 0
      ? allOrganismNames.filter((name) => selectedOrganismNames.includes(name))
      : allOrganismNames

  return filteredOrganismNames.map((name) => {
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
