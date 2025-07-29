import { useMemo } from 'react'

import {
  createEmptyResponse,
  useDepositionQuery,
} from 'app/hooks/useDepositionQuery'
import type {
  DataContentsType,
  DepositionDatasetsResponse,
} from 'app/types/deposition-queries'
import { isDefined } from 'app/utils/nullish'

/**
 * Hook to fetch datasets for a deposition using React Query + API route.
 *
 * This uses a server-side API route to avoid CORS issues with direct GraphQL calls,
 * leveraging React Query for caching and state management.
 *
 * @param params - Object containing depositionId, type, and optional enabled flag
 * @returns React Query result with datasets array, loading state, and error handling
 */
export function useDatasetsForDeposition({
  depositionId,
  type,
  enabled = true,
}: {
  depositionId: number | undefined
  type: DataContentsType
  enabled?: boolean
}) {
  const query = useDepositionQuery<
    DepositionDatasetsResponse,
    {
      depositionId: number | undefined
      type: DataContentsType
      enabled?: boolean
    }
  >(
    {
      endpoint: 'depositionDatasets',
      queryKeyPrefix: 'deposition-datasets',
      getQueryKeyValues: (params) => [params.depositionId, params.type],
      getApiParams: (params) => ({
        depositionId: params.depositionId,
        type: params.type,
      }),
      getRequiredParams: (params) => ({
        depositionId: params.depositionId,
      }),
      transformResponse: (data): DepositionDatasetsResponse => {
        if (!data) {
          return createEmptyResponse('datasets')
        }
        return data as DepositionDatasetsResponse
      },
    },
    { depositionId, type, enabled },
  )

  const organismNames = useMemo(() => {
    if (!query.data?.datasets) return []

    return [
      ...new Set(
        query.data.datasets
          .map((dataset) => dataset.organismName)
          .filter(isDefined),
      ),
    ].sort()
  }, [query.data?.datasets])

  const organismCounts = useMemo(() => {
    return query.data?.organismCounts || {}
  }, [query.data?.organismCounts])

  const annotationCounts = useMemo(() => {
    return query.data?.annotationCounts || {}
  }, [query.data?.annotationCounts])

  const tomogramCounts = useMemo(() => {
    return query.data?.tomogramCounts || {}
  }, [query.data?.tomogramCounts])

  return {
    ...query,
    datasets: query.data?.datasets || [],
    organismNames,
    organismCounts,
    annotationCounts,
    tomogramCounts,
  }
}
