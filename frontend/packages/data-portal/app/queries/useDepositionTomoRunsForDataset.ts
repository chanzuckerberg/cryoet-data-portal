import { useQuery } from '@tanstack/react-query'

import { GetDepositionTomoRunsForDatasetQuery } from 'app/__generated_v2__/graphql'

/**
 * Hook to fetch paginated runs for a specific dataset that belong to a specific deposition,
 * along with tomogram counts for each run, using React Query + API route.
 *
 * This uses a server-side API route to avoid CORS issues with direct GraphQL calls,
 * leveraging React Query for caching and state management.
 *
 * @param depositionId - The ID of the deposition
 * @param datasetId - The ID of the dataset to fetch runs for
 * @param page - The page number for pagination (1-based)
 * @returns React Query result with runs data, loading state, and error handling
 */
export function useDepositionTomoRunsForDataset({
  depositionId,
  datasetId,
  page,
}: {
  depositionId: number | undefined
  datasetId: number | undefined
  page: number
}) {
  return useQuery({
    queryKey: ['deposition-tomo-runs', depositionId, datasetId, page],
    queryFn: async (): Promise<GetDepositionTomoRunsForDatasetQuery> => {
      if (!depositionId || !datasetId) {
        throw new Error('depositionId and datasetId are required')
      }

      const response = await fetch(
        `/api/deposition-tomo-runs?depositionId=${depositionId}&datasetId=${datasetId}&page=${page}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch deposition tomogram runs')
      }

      const data: GetDepositionTomoRunsForDatasetQuery =
        (await response.json()) as GetDepositionTomoRunsForDatasetQuery

      return data
    },
    enabled: !!(depositionId && datasetId), // Only run query if both IDs are available
  })
}
