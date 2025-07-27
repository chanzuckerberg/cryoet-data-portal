import { useQuery } from '@tanstack/react-query'

import type { GetDepositionAnnotationsQuery } from 'app/__generated_v2__/graphql'
import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'

interface UseDepositionAnnotationsByOrganismParams {
  depositionId: number | undefined
  organismName: string | undefined
  page?: number
  pageSize?: number
  enabled?: boolean
}

interface AnnotationsByOrganismResponse {
  annotations: GetDepositionAnnotationsQuery['annotationShapes']
  page: number
  pageSize: number
  hasNextPage: boolean
}

/**
 * Hook to fetch deposition annotations filtered by organism name.
 * Used for populating annotation tables within organism accordions.
 */
export function useDepositionAnnotationsByOrganism({
  depositionId,
  organismName,
  page = 1,
  pageSize = MAX_PER_FULLY_OPEN_ACCORDION,
  enabled = true,
}: UseDepositionAnnotationsByOrganismParams) {
  return useQuery({
    queryKey: [
      'deposition-annotations-by-organism',
      depositionId,
      organismName,
      page,
      pageSize,
    ],
    queryFn: async (): Promise<AnnotationsByOrganismResponse> => {
      if (!depositionId || !organismName) {
        return {
          annotations: [],
          page: 1,
          pageSize,
          hasNextPage: false,
        }
      }

      const params = new URLSearchParams({
        depositionId: String(depositionId),
        organismName,
        page: String(page),
        pageSize: String(pageSize),
      })

      const response = await fetch(
        `/api/deposition-annotations-by-organism?${params.toString()}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch annotations by organism')
      }

      const data = (await response.json()) as AnnotationsByOrganismResponse
      return data
    },
    enabled: enabled && !!depositionId && !!organismName,
  })
}
