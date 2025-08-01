import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'

import { DEPOSITION_FILTERS } from 'app/constants/filterQueryParams'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { useDepositionGroupedData } from 'app/hooks/useDepositionGroupedData'
import { isDefined } from 'app/utils/nullish'

interface UseOrganismPaginationReturn {
  // Counts for TablePageLayout pagination controls
  totalOrganismCount: number
  filteredOrganismCount: number

  // Paginated data for OrganismAccordionTable
  organisms: string[] // Only organisms for current page

  // Organism annotation counts
  organismCounts: Record<string, number>

  // Loading state
  isLoading: boolean
}

/**
 * Hook that provides organism-based pagination and filtering for deposition pages.
 *
 * This hook:
 * 1. Fetches all datasets for the deposition
 * 2. Applies current filter parameters client-side
 * 3. Extracts unique organism names from both unfiltered and filtered data
 * 4. Calculates total and filtered organism counts
 * 5. Returns paginated organisms for the current page
 *
 * @returns Organism counts, paginated organisms, and loading state
 */
export function useOrganismPagination(): UseOrganismPaginationReturn {
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

  // Fetch all datasets and organism counts for the deposition
  const { datasets, counts, isLoading } = useDepositionGroupedData({
    fetchRunCounts: true, // Need run counts for display
  })

  const organismCounts = counts.organisms

  return useMemo(() => {
    if (isLoading || !datasets.length) {
      return {
        totalOrganismCount: 0,
        filteredOrganismCount: 0,
        organisms: [],
        organismCounts: {},
        isLoading,
      }
    }

    // Extract all unique organism names
    const allOrganisms = [
      ...new Set(
        datasets.map((dataset) => dataset.organismName).filter(isDefined),
      ),
    ].sort()

    // Apply client-side filtering to datasets
    const filteredDatasets = datasets.filter((dataset) => {
      // Apply organism filter
      if (
        currentFilters[QueryParams.Organism] &&
        dataset.organismName !== currentFilters[QueryParams.Organism]
      ) {
        return false
      }

      // Add other filter logic here as needed
      // For now, we're primarily filtering by organism name
      // Other filters would need access to additional dataset properties

      return true
    })

    // Extract unique organism names from filtered datasets
    const filteredOrganisms = [
      ...new Set(
        filteredDatasets
          .map((dataset) => dataset.organismName)
          .filter(isDefined),
      ),
    ].sort()

    // Calculate pagination for organisms
    const startIndex = (currentPage - 1) * MAX_PER_PAGE
    const endIndex = startIndex + MAX_PER_PAGE
    const paginatedOrganisms = filteredOrganisms.slice(startIndex, endIndex)

    return {
      totalOrganismCount: allOrganisms.length,
      filteredOrganismCount: filteredOrganisms.length,
      organisms: paginatedOrganisms,
      organismCounts,
      isLoading: false,
    }
  }, [datasets, organismCounts, currentFilters, currentPage, isLoading])
}
