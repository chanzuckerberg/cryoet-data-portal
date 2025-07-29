import {
  createEmptyResponse,
  useDepositionQuery,
} from 'app/hooks/useDepositionQuery'
import { useFilter } from 'app/hooks/useFilter'
import type {
  ItemsByOrganismResponse,
  UnifiedItemsByOrganismParams,
} from 'app/types/deposition-queries'
import { DataContentsType } from 'app/types/deposition-queries'

interface UseDepositionItemsByOrganismParams
  extends UnifiedItemsByOrganismParams {}

/**
 * Hook to fetch deposition items (annotations or tomograms) filtered by organism name and dataset IDs.
 * Used for populating tables within organism accordions.
 * Integrates with the useFilter() hook to apply dataset ID filtering for both annotations and tomograms.
 */
export function useDepositionItemsByOrganism({
  depositionId,
  organismName,
  type,
  page = 1,
  pageSize,
  enabled = true,
}: UseDepositionItemsByOrganismParams) {
  const {
    ids: { datasets: datasetIds },
  } = useFilter()

  return useDepositionQuery<
    ItemsByOrganismResponse,
    UseDepositionItemsByOrganismParams & { datasetIds: string[] }
  >(
    {
      endpoint: 'depositionItemsByOrganism',
      queryKeyPrefix: 'deposition-items-by-organism',
      getQueryKeyValues: (params) => [
        params.depositionId,
        params.organismName,
        params.type,
        params.page,
        params.pageSize,
        params.datasetIds,
      ],
      getApiParams: (params) => ({
        depositionId: params.depositionId,
        organismName: params.organismName,
        type: params.type,
        page: params.page,
        pageSize: params.pageSize,
        dataset_id: params.datasetIds,
      }),
      getRequiredParams: (params) => ({
        depositionId: params.depositionId,
        organismName: params.organismName,
      }),
      transformResponse: (data): ItemsByOrganismResponse => {
        if (!data) {
          return type === DataContentsType.Annotations
            ? createEmptyResponse('annotations')
            : createEmptyResponse('tomograms')
        }
        return data as ItemsByOrganismResponse
      },
    },
    {
      depositionId,
      organismName,
      type,
      page,
      pageSize,
      datasetIds,
      enabled,
    },
  )
}
