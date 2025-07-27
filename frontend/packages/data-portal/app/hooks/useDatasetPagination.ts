import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'

import { DEPOSITION_FILTERS } from 'app/constants/filterQueryParams'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { useDatasetsForDeposition } from 'app/queries/useDatasetsForDeposition'

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
 * @param depositionId - The ID of the deposition
 * @returns Dataset counts, paginated datasets, and loading state
 */
export function useDatasetPagination(
  depositionId: number | undefined,
  annotationCounts?: Record<number, number>,
  runCounts?: Record<number, number>,
): UseDatasetPaginationReturn {
  const [searchParams] = useSearchParams()

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

  // Fetch all datasets for the deposition
  const { datasets = [], isLoading } = useDatasetsForDeposition(depositionId)

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

    // Create dataset counts map with run and annotation counts
    const datasetCounts: Record<
      number,
      { runCount: number; annotationCount: number }
    > = {}
    datasets.forEach((dataset) => {
      datasetCounts[dataset.id] = {
        runCount: runCounts?.[dataset.id] || 0,
        annotationCount: annotationCounts?.[dataset.id] || 0,
      }
    })

    return {
      totalDatasetCount: datasets.length,
      filteredDatasetCount: filteredDatasets.length,
      datasets: paginatedDatasets,
      datasetCounts,
      isLoading: false,
    }
  }, [
    datasets,
    currentFilters,
    currentPage,
    isLoading,
    annotationCounts,
    runCounts,
  ])
}
