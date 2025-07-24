import { useQuery } from '@tanstack/react-query'

import { GetTomogramsForRunAndDepositionQuery } from 'app/__generated_v2__/graphql'

interface UseTomogramsForRunAndDepositionParams {
  depositionId?: number
  runId?: number
  page?: number
}

/**
 * Hook to fetch paginated tomograms for a specific run within a specific deposition context
 * using React Query + API route.
 *
 * This uses a server-side API route to avoid CORS issues with direct GraphQL calls,
 * leveraging React Query for caching and state management.
 *
 * @param params - Object containing depositionId, runId, and page number
 * @returns React Query result with tomograms data, loading state, and error handling
 */
export function useTomogramsForRunAndDeposition({
  depositionId,
  runId,
  page = 1,
}: UseTomogramsForRunAndDepositionParams) {
  return useQuery({
    queryKey: ['tomograms-for-run', depositionId, runId, page],
    queryFn: async (): Promise<GetTomogramsForRunAndDepositionQuery> => {
      if (!depositionId || !runId) {
        throw new Error('depositionId and runId are required')
      }

      const response = await fetch(
        `/api/tomograms-for-run?depositionId=${depositionId}&runId=${runId}&page=${page}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch tomograms for run and deposition')
      }

      const data: GetTomogramsForRunAndDepositionQuery =
        (await response.json()) as GetTomogramsForRunAndDepositionQuery

      return data
    },
    enabled: !!(depositionId && runId), // Only run query if both IDs are available
  })
}
