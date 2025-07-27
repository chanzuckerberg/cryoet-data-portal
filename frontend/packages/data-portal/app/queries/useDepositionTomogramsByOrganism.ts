import { useQuery } from '@tanstack/react-query'

import type { GetDepositionTomogramsQuery } from 'app/__generated_v2__/graphql'
import { useFilter } from 'app/hooks/useFilter'

interface UseDepositionTomogramsByOrganismParams {
  depositionId: number | undefined
  organismName: string | undefined
  page?: number
  pageSize: number
  enabled?: boolean
}

interface TomogramsByOrganismResponse {
  tomograms: GetDepositionTomogramsQuery['tomograms']
}

/**
 * Hook to fetch deposition tomograms filtered by organism name and dataset IDs.
 * Used for populating tomogram tables within organism accordions.
 * Integrates with the useFilter() hook to apply dataset ID filtering.
 */
export function useDepositionTomogramsByOrganism({
  depositionId,
  organismName,
  page = 1,
  pageSize,
  enabled = true,
}: UseDepositionTomogramsByOrganismParams) {
  const {
    ids: { datasets: datasetIds },
  } = useFilter()

  return useQuery({
    queryKey: [
      'deposition-tomograms-by-organism',
      depositionId,
      organismName,
      page,
      pageSize,
      datasetIds,
    ],
    queryFn: async (): Promise<TomogramsByOrganismResponse> => {
      if (!depositionId || !organismName) {
        return {
          tomograms: [],
        }
      }

      const params = new URLSearchParams({
        depositionId: String(depositionId),
        organismName,
        page: String(page),
        pageSize: String(pageSize),
      })

      // Add dataset IDs if they exist
      datasetIds.forEach((datasetId) => {
        params.append('dataset_id', datasetId)
      })

      const response = await fetch(
        `/api/deposition-tomograms-by-organism?${params.toString()}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch tomograms by organism')
      }

      const data = (await response.json()) as TomogramsByOrganismResponse
      return data
    },
    enabled: enabled && !!depositionId && !!organismName,
  })
}
