import { useQuery } from '@tanstack/react-query'

import { GetAnnotationsForRunAndDepositionQuery } from 'app/__generated_v2__/graphql'

/**
 * Hook to fetch paginated annotation shapes for a specific run within a specific deposition context
 * using React Query + API route.
 *
 * This uses a server-side API route to avoid CORS issues with direct GraphQL calls,
 * leveraging React Query for caching and state management.
 *
 * @param depositionId - The ID of the deposition
 * @param runId - The ID of the run to fetch annotations for
 * @param page - The page number for pagination (1-based)
 * @returns React Query result with annotation shapes data, loading state, and error handling
 */
export function useAnnotationsForRunAndDeposition(
  depositionId: number | undefined,
  runId: number | undefined,
  page: number,
) {
  return useQuery({
    queryKey: ['annotations-for-run', depositionId, runId, page],
    queryFn: async (): Promise<GetAnnotationsForRunAndDepositionQuery> => {
      if (!depositionId || !runId) {
        throw new Error('depositionId and runId are required')
      }

      const response = await fetch(
        `/api/annotations-for-run?depositionId=${depositionId}&runId=${runId}&page=${page}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch annotations for run and deposition')
      }

      const data: GetAnnotationsForRunAndDepositionQuery =
        (await response.json()) as GetAnnotationsForRunAndDepositionQuery

      return data
    },
    enabled: !!(depositionId && runId), // Only run query if both IDs are available
  })
}
