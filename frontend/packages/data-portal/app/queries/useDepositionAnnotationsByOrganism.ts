import { useQuery } from '@tanstack/react-query'

import type { GetDepositionAnnotationsQuery } from 'app/__generated_v2__/graphql'

interface UseDepositionAnnotationsByOrganismParams {
  depositionId: number | undefined
  organismName: string | undefined
  page?: number
  pageSize: number
  enabled?: boolean
}

interface AnnotationsByOrganismResponse {
  annotations: GetDepositionAnnotationsQuery['annotationShapes']
}

/**
 * Hook to fetch deposition annotations filtered by organism name.
 * Used for populating annotation tables within organism accordions.
 */
export function useDepositionAnnotationsByOrganism({
  depositionId,
  organismName,
  page = 1,
  pageSize,
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
