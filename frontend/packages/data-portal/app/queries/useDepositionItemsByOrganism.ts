import { useQuery } from '@tanstack/react-query'

import type {
  GetDepositionAnnotationsQuery,
  GetDepositionTomogramsQuery,
} from 'app/__generated_v2__/graphql'
import { useFilter } from 'app/hooks/useFilter'

interface UseDepositionItemsByOrganismParams {
  depositionId: number | undefined
  organismName: string | undefined
  type: 'annotation' | 'tomogram'
  page?: number
  pageSize: number
  enabled?: boolean
}

interface ItemsByOrganismResponse {
  annotations?: GetDepositionAnnotationsQuery['annotationShapes']
  tomograms?: GetDepositionTomogramsQuery['tomograms']
}

/**
 * Hook to fetch deposition items (annotations or tomograms) filtered by organism name and dataset IDs.
 * Used for populating tables within organism accordions.
 * Integrates with the useFilter() hook to apply dataset ID filtering for both annotations and tomograms.
 */
export function useDepositionItemsByOrganism({
  depositionId,
  organismName,
  type,
  page = 1,
  pageSize,
  enabled = true,
}: UseDepositionItemsByOrganismParams) {
  const {
    ids: { datasets: datasetIds },
  } = useFilter()

  return useQuery({
    queryKey: [
      'deposition-items-by-organism',
      depositionId,
      organismName,
      type,
      page,
      pageSize,
      datasetIds,
    ],
    queryFn: async (): Promise<ItemsByOrganismResponse> => {
      if (!depositionId || !organismName) {
        return type === 'annotation' ? { annotations: [] } : { tomograms: [] }
      }

      const params = new URLSearchParams({
        depositionId: String(depositionId),
        organismName,
        type,
        page: String(page),
        pageSize: String(pageSize),
      })

      // Add dataset IDs if they exist
      datasetIds.forEach((datasetId) => {
        params.append('dataset_id', datasetId)
      })

      const response = await fetch(
        `/api/deposition-items-by-organism?${params.toString()}`,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}s by organism`)
      }

      const data = (await response.json()) as ItemsByOrganismResponse
      return data
    },
    enabled: enabled && !!depositionId && !!organismName,
  })
}
