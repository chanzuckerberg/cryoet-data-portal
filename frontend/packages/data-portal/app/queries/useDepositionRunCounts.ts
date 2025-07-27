import type {
  RunCountsResponse,
  UnifiedRunCountsParams,
} from 'app/types/deposition-queries'
import {
  createDepositionQuery,
  createEmptyResponse,
} from 'app/utils/createDepositionQuery'
import { getRunApiEndpoints } from 'app/utils/deposition-api'

/**
 * Unified hook to fetch run counts for datasets within a deposition.
 * Replaces the previous separate hooks for annotation and tomogram run counts.
 *
 * @param params - Object containing depositionId, datasetIds, type, and optional enabled flag
 * @returns React Query result with run counts data, loading state, and error handling
 */
export function useDepositionRunCounts({
  depositionId,
  datasetIds,
  type,
  enabled = true,
}: UnifiedRunCountsParams) {
  const { countsEndpoint } = getRunApiEndpoints(type)

  const createQueryHook = createDepositionQuery<
    RunCountsResponse,
    UnifiedRunCountsParams
  >({
    endpoint: countsEndpoint,
    queryKeyPrefix: `deposition-${type}-run-counts`,
    getQueryKeyValues: (params) => [
      params.depositionId,
      params.datasetIds.join(','),
    ],
    getApiParams: (params) => ({
      depositionId: params.depositionId,
      datasetIds: params.datasetIds.join(','),
    }),
    getRequiredParams: (params) => ({
      depositionId: params.depositionId,
      datasetIds: params.datasetIds?.length > 0 ? params.datasetIds : undefined,
    }),
    transformResponse: (data): RunCountsResponse => {
      if (!data) {
        return createEmptyResponse('counts')
      }
      return data as RunCountsResponse
    },
  })

  return createQueryHook({
    depositionId,
    datasetIds,
    type,
    enabled,
  })
}
