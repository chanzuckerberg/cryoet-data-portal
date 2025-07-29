import type {
  RunsQueryResponse,
  UnifiedRunsParams,
} from 'app/types/deposition-queries'
import { createPaginatedDepositionQuery } from 'app/utils/createDepositionQuery'
import { getRunApiEndpoints } from 'app/utils/deposition-api'

/**
 * Unified hook to fetch paginated runs for a specific dataset within a deposition.
 * Replaces the previous separate hooks for annotation and tomogram runs.
 *
 * @param params - Object containing depositionId, datasetId, page, type, and optional enabled flag
 * @returns React Query result with runs data, loading state, and error handling
 */
export function useDepositionRunsForDataset({
  depositionId,
  datasetId,
  page,
  type,
  enabled = true,
}: UnifiedRunsParams & { enabled?: boolean }) {
  const { runsEndpoint } = getRunApiEndpoints(type)

  const createQueryHook = createPaginatedDepositionQuery<
    RunsQueryResponse,
    UnifiedRunsParams & { enabled?: boolean }
  >({
    endpoint: runsEndpoint,
    queryKeyPrefix: `deposition-${type}-runs`,
    requiredFields: ['depositionId', 'datasetId'],
    getQueryKeyValues: (params) => [
      params.depositionId,
      params.datasetId,
      params.page,
    ],
    getApiParams: (params) => ({
      depositionId: params.depositionId,
      datasetId: params.datasetId,
      page: params.page,
    }),
    getRequiredParams: (params) => ({
      depositionId: params.depositionId,
      datasetId: params.datasetId,
    }),
  })

  return createQueryHook({
    depositionId,
    datasetId,
    page,
    type,
    enabled,
  })
}
