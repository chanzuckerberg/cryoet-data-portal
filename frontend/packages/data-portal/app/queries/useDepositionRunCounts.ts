import { useQuery } from '@tanstack/react-query'

interface RunCountsResponse {
  runCounts: Record<number, number>
}

export function useDepositionRunCounts(
  depositionId: number | undefined,
  datasetIds: number[],
) {
  return useQuery({
    queryKey: ['deposition-run-counts', depositionId, datasetIds],
    queryFn: async (): Promise<RunCountsResponse> => {
      if (!depositionId || datasetIds.length === 0) {
        return { runCounts: {} }
      }

      const response = await fetch(
        `/api/deposition-run-counts?depositionId=${depositionId}&datasetIds=${datasetIds.join(
          ',',
        )}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch run counts')
      }

      return response.json() as Promise<RunCountsResponse>
    },
    enabled: !!depositionId && datasetIds.length > 0,
  })
}
