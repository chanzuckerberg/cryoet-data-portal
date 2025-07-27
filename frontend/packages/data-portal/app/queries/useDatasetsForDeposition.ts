import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { DepositionTab } from 'app/hooks/useDepositionTab'
import { isDefined } from 'app/utils/nullish'

// Type for the simplified dataset structure expected by the filter component
export interface DatasetOption {
  id: number
  title: string
  organismName: string | null
}

// Type for the API response that includes organism counts
interface DepositionDatasetsResponse {
  datasets: DatasetOption[]
  organismCounts: Record<string, number>
  annotationCounts: Record<number, number>
  tomogramCounts: Record<number, number>
}

/**
 * Hook to fetch datasets for a deposition using React Query + API route.
 *
 * This uses a server-side API route to avoid CORS issues with direct GraphQL calls,
 * leveraging React Query for caching and state management.
 *
 * @param params - Object containing depositionId, type, and optional enabled flag
 * @returns React Query result with datasets array, loading state, and error handling
 */
export function useDatasetsForDeposition({
  depositionId,
  type,
  enabled = true,
}: {
  depositionId: number | undefined
  type: DepositionTab
  enabled?: boolean
}) {
  const query = useQuery({
    queryKey: ['deposition-datasets', depositionId, type],
    queryFn: async (): Promise<DepositionDatasetsResponse> => {
      if (!depositionId) {
        return {
          datasets: [],
          organismCounts: {},
          annotationCounts: {},
          tomogramCounts: {},
        }
      }

      const response = await fetch(
        `/api/deposition-datasets?depositionId=${depositionId}&type=${type}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch datasets')
      }

      return response.json() as Promise<DepositionDatasetsResponse>
    },
    enabled: enabled && !!depositionId, // Only run query if enabled and depositionId is available
  })

  const organismNames = useMemo(() => {
    if (!query.data?.datasets) return []

    return [
      ...new Set(
        query.data.datasets
          .map((dataset) => dataset.organismName)
          .filter(isDefined),
      ),
    ].sort()
  }, [query.data?.datasets])

  const organismCounts = useMemo(() => {
    return query.data?.organismCounts || {}
  }, [query.data?.organismCounts])

  const annotationCounts = useMemo(() => {
    return query.data?.annotationCounts || {}
  }, [query.data?.annotationCounts])

  const tomogramCounts = useMemo(() => {
    return query.data?.tomogramCounts || {}
  }, [query.data?.tomogramCounts])

  return {
    ...query,
    datasets: query.data?.datasets || [],
    organismNames,
    organismCounts,
    annotationCounts,
    tomogramCounts,
  }
}
