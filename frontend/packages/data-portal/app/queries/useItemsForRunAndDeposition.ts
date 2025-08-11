import { usePaginatedDepositionQuery } from 'app/hooks/useDepositionQuery'
import type {
  ItemsForRunResponse,
  UnifiedItemsForRunParams,
} from 'app/types/deposition-queries'
import { getItemForRunApiEndpoint } from 'app/utils/deposition-api'

/**
 * Unified hook to fetch paginated items (annotations or tomograms) for a specific run
 * within a specific deposition context using React Query + API route.
 *
 * This uses a server-side API route to avoid CORS issues with direct GraphQL calls,
 * leveraging React Query for caching and state management.
 *
 * @param params - Object containing depositionId, runId, page, type, and optional enabled flag
 * @returns React Query result with items data, loading state, and error handling
 */
export function useItemsForRunAndDeposition({
  depositionId,
  runId,
  type,
  page = 1,
  enabled = true,
}: UnifiedItemsForRunParams & { enabled?: boolean }) {
  const endpoint = getItemForRunApiEndpoint(type)

  return usePaginatedDepositionQuery<
    ItemsForRunResponse,
    UnifiedItemsForRunParams & { enabled?: boolean }
  >(
    {
      endpoint,
      queryKeyPrefix: `${type}s-for-run`,
      requiredFields: ['depositionId', 'runId'],
      getQueryKeyValues: (params) => [
        params.depositionId,
        params.runId,
        params.page,
      ],
      getApiParams: (params) => ({
        depositionId: params.depositionId,
        runId: params.runId,
        page: params.page,
      }),
      getRequiredParams: (params) => ({
        depositionId: params.depositionId,
        runId: params.runId,
      }),
    },
    {
      depositionId,
      runId,
      type,
      page,
      enabled,
    },
  )
}
