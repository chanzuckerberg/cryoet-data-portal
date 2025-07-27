import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { isDefined } from 'app/utils/nullish'

// Type for the simplified dataset structure expected by the filter component
export interface DatasetOption {
  id: number
  title: string
  organismName: string | null
}

/**
 * Hook to fetch datasets for a deposition via annotation shapes using React Query + API route.
 *
 * This uses a server-side API route to avoid CORS issues with direct GraphQL calls,
 * leveraging React Query for caching and state management.
 *
 * @param depositionId - The ID of the deposition to fetch datasets for
 * @returns React Query result with datasets array, loading state, and error handling
 */
export function useDatasetsForDeposition(depositionId: number | undefined) {
  const query = useQuery({
    queryKey: ['deposition-datasets', depositionId],
    queryFn: async (): Promise<DatasetOption[]> => {
      if (!depositionId) {
        return []
      }

      const response = await fetch(
        `/api/deposition-datasets?depositionId=${depositionId}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch datasets')
      }

      const { datasets }: { datasets: DatasetOption[] } =
        (await response.json()) as { datasets: DatasetOption[] }
      return datasets
    },
    enabled: !!depositionId, // Only run query if depositionId is available
  })

  const organismNames = useMemo(() => {
    if (!query.data) return []

    return [
      ...new Set(
        query.data.map((dataset) => dataset.organismName).filter(isDefined),
      ),
    ].sort()
  }, [query.data])

  return {
    ...query,
    organismNames,
  }
}
