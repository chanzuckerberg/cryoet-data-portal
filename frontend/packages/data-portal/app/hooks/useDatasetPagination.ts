import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'

import { DEPOSITION_FILTERS } from 'app/constants/filterQueryParams'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { useDepositionGroupedData } from 'app/hooks/useDepositionGroupedData'
import { useDepositionTab } from 'app/hooks/useDepositionTab'
import { GroupByOption } from 'app/types/depositionTypes'

interface UseDatasetPaginationProps {
  depositionId: number | undefined
}

interface UseDatasetPaginationReturn {
  // Counts for TablePageLayout pagination controls
  totalDatasetCount: number
  filteredDatasetCount: number

  // Paginated data for DepositedLocationAccordionTable
  datasets: Array<{
    id: number
    title: string
    organismName: string | null
  }> // Only datasets for current page

  // Dataset counts (run and annotation counts)
  datasetCounts: Record<
    number,
    {
      runCount: number
      annotationCount: number
      tomogramRunCount: number
    }
  >

  // Loading state
  isLoading: boolean
}

/**
 * Hook that provides dataset-based pagination and filtering for deposition pages.
 *
 * This hook:
 * 1. Fetches all datasets for the deposition
 * 2. Applies current filter parameters client-side
 * 3. Calculates total and filtered dataset counts
 * 4. Returns paginated datasets for the current page
 *
 * @param props - Configuration object containing depositionId and count data
 * @returns Dataset counts, paginated datasets, and loading state
 */
export function useDatasetPagination({
  depositionId,
}: UseDatasetPaginationProps): UseDatasetPaginationReturn {
  const [searchParams] = useSearchParams()
  const [tab] = useDepositionTab()

  // Get current page from URL params
  const currentPage = +(searchParams.get(QueryParams.Page) ?? '1')

  // Get all current filter values
  const currentFilters = useMemo(() => {
    const filters: Record<string, string | null> = {}
    DEPOSITION_FILTERS.forEach((param) => {
      filters[param] = searchParams.get(param)
    })
    return filters
  }, [searchParams])

  // Fetch all datasets for the deposition with embedded counts
  const { datasets, isLoading } = useDepositionGroupedData(
    {
      depositionId,
      groupBy: GroupByOption.DepositedLocation,
      tab,
    },
    {
      fetchRunCounts: true, // Need run counts for display
    },
  )

  return useMemo(() => {
    if (isLoading || !datasets.length) {
      return {
        totalDatasetCount: 0,
        filteredDatasetCount: 0,
        datasets: [],
        datasetCounts: {},
        isLoading,
      }
    }

    // Apply client-side filtering to datasets
    const filteredDatasets = datasets.filter((dataset) => {
      // Apply organism filter
      if (
        currentFilters[QueryParams.Organism] &&
        dataset.organismName !== currentFilters[QueryParams.Organism]
      ) {
        return false
      }

      // Apply dataset ID filter
      if (
        currentFilters[QueryParams.DatasetId] &&
        dataset.id !== Number(currentFilters[QueryParams.DatasetId])
      ) {
        return false
      }

      // Add other filter logic here as needed

      return true
    })

    // Calculate pagination for datasets
    const startIndex = (currentPage - 1) * MAX_PER_PAGE
    const endIndex = startIndex + MAX_PER_PAGE
    const paginatedDatasets = filteredDatasets.slice(startIndex, endIndex)

    // Create dataset counts map from embedded counts in datasets
    const datasetCounts: Record<
      number,
      { runCount: number; annotationCount: number; tomogramRunCount: number }
    > = {}
    datasets.forEach((dataset) => {
      datasetCounts[dataset.id] = {
        runCount: dataset.runCount,
        annotationCount: dataset.annotationCount,
        tomogramRunCount: dataset.tomogramRunCount,
      }
    })

    return {
      totalDatasetCount: datasets.length,
      filteredDatasetCount: filteredDatasets.length,
      datasets: paginatedDatasets,
      datasetCounts,
      isLoading: false,
    }
  }, [datasets, currentFilters, currentPage, isLoading])
}
