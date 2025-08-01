import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import type { DepositionApiEndpoint } from 'app/types/deposition-queries'
import {
  createQueryKey,
  fetchDepositionApi,
  shouldEnableQuery,
} from 'app/utils/deposition-api'

/**
 * Configuration for creating a deposition query hook
 */
interface DepositionQueryConfig<TData, TParams> {
  endpoint: DepositionApiEndpoint
  queryKeyPrefix: string
  requiredFields?: string[]
  transformResponse?: (data: unknown) => TData
  getQueryKeyValues?: (
    params: TParams,
  ) => (string | number | boolean | string[] | undefined | null)[]
  getApiParams?: (
    params: TParams,
  ) => Record<string, string | number | boolean | string[] | undefined>
  getRequiredParams?: (params: TParams) => Record<string, unknown>
}

/**
 * Base parameters that all deposition queries should support
 */
interface BaseQueryParams {
  enabled?: boolean
  depositionId?: number
  page?: number
  pageSize?: number
}

/**
 * Direct deposition query hook with standard patterns
 */
export function useDepositionQuery<TData, TParams extends BaseQueryParams>(
  config: DepositionQueryConfig<TData, TParams>,
  params: TParams,
): UseQueryResult<TData, Error> {
  const {
    endpoint,
    queryKeyPrefix,
    requiredFields = [],
    transformResponse,
    getQueryKeyValues,
    getApiParams,
    getRequiredParams,
  } = config

  // Build query key
  const queryKeyValues = getQueryKeyValues
    ? getQueryKeyValues(params)
    : (Object.values(params).filter((v) => v !== undefined) as (
        | string
        | number
        | boolean
        | string[]
        | undefined
        | null
      )[])

  const queryKey = createQueryKey(queryKeyPrefix, ...queryKeyValues)

  // Build API parameters
  const apiParams = getApiParams
    ? getApiParams(params)
    : (Object.fromEntries(
        Object.entries(params as Record<string, unknown>).filter(
          ([, value]) => value !== undefined,
        ),
      ) as Record<string, string | number | boolean | string[] | undefined>)

  // Determine required parameters for enablement check
  const requiredParams = getRequiredParams
    ? getRequiredParams(params)
    : (params as Record<string, unknown>)

  // Determine if query should be enabled
  const isEnabled = shouldEnableQuery(requiredParams, params.enabled)

  return useQuery({
    queryKey,
    queryFn: async (): Promise<TData> => {
      const data = await fetchDepositionApi<unknown>(
        endpoint,
        apiParams,
        requiredFields,
      )

      return transformResponse ? transformResponse(data) : (data as TData)
    },
    enabled: isEnabled,
  })
}

/**
 * Specialized hook for paginated queries
 */
export function usePaginatedDepositionQuery<
  TData,
  TParams extends BaseQueryParams & { page?: number },
>(
  config: Omit<DepositionQueryConfig<TData, TParams>, 'getQueryKeyValues'> & {
    getQueryKeyValues?: (
      params: TParams,
    ) => (string | number | boolean | string[] | undefined | null)[]
  },
  params: TParams,
): UseQueryResult<TData, Error> {
  const defaultGetQueryKeyValues = (
    queryParams: TParams,
  ): (string | number | boolean | string[] | undefined | null)[] => [
    queryParams.depositionId,
    queryParams.page ?? 1,

    ...Object.entries(queryParams)
      .filter(
        ([key]) =>
          key !== 'depositionId' && key !== 'page' && key !== 'enabled',
      )
      .map(
        ([, value]) =>
          value as string | number | boolean | string[] | undefined | null,
      )
      .filter((v) => v !== undefined),
  ]

  return useDepositionQuery<TData, TParams>(
    {
      ...config,
      getQueryKeyValues: config.getQueryKeyValues ?? defaultGetQueryKeyValues,
    },
    params,
  )
}

/**
 * Helper to create empty response for failed queries
 */
export function createEmptyResponse<T>(
  type: 'annotations' | 'tomograms' | 'datasets' | 'runs' | 'counts',
): T {
  switch (type) {
    case 'annotations':
      return { annotations: [] } as T
    case 'tomograms':
      return { tomograms: [] } as T
    case 'datasets':
      return {
        datasets: [],
        organismCounts: {},
        annotationCounts: {},
        tomogramCounts: {},
      } as T
    case 'runs':
      return { runs: [] } as T
    case 'counts':
      return { runCounts: {} } as T
    default:
      return {} as T
  }
}
