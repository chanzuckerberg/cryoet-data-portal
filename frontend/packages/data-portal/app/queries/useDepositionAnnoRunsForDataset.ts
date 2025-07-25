import { useQuery } from '@tanstack/react-query'

import { GetDepositionAnnoRunsForDatasetQuery } from 'app/__generated_v2__/graphql'

/**
 * Hook to fetch paginated runs for a specific dataset that belong to a specific deposition,
 * along with annotation counts for each run, using React Query + API route.
 *
 * This uses a server-side API route to avoid CORS issues with direct GraphQL calls,
 * leveraging React Query for caching and state management.
 *
 * @param depositionId - The ID of the deposition
 * @param datasetId - The ID of the dataset to fetch runs for
 * @param page - The page number for pagination (1-based)
 * @returns React Query result with runs data, loading state, and error handling
 */
export function useDepositionAnnoRunsForDataset({
  depositionId,
  datasetId,
  page,
}: {
  depositionId: number | undefined
  datasetId: number | undefined
  page: number
}) {
  return useQuery({
    queryKey: ['deposition-anno-runs', depositionId, datasetId, page],
    queryFn: async (): Promise<GetDepositionAnnoRunsForDatasetQuery> => {
      if (!depositionId || !datasetId) {
        throw new Error('depositionId and datasetId are required')
      }

      const response = await fetch(
        `/api/deposition-anno-runs?depositionId=${depositionId}&datasetId=${datasetId}&page=${page}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch deposition annotation runs')
      }

      const data: GetDepositionAnnoRunsForDatasetQuery =
        (await response.json()) as GetDepositionAnnoRunsForDatasetQuery

      return data
    },
    enabled: !!(depositionId && datasetId), // Only run query if both IDs are available
  })
}
