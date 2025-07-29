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
 * Creates a reusable deposition query hook with standard patterns
 */
export function createDepositionQuery<TData, TParams extends BaseQueryParams>(
  config: DepositionQueryConfig<TData, TParams>,
) {
  return function useDepositionQuery(
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
}

/**
 * Specialized factory for paginated queries
 */
export function createPaginatedDepositionQuery<
  TData,
  TParams extends BaseQueryParams & { page?: number },
>(
  config: Omit<DepositionQueryConfig<TData, TParams>, 'getQueryKeyValues'> & {
    getQueryKeyValues?: (
      params: TParams,
    ) => (string | number | boolean | string[] | undefined | null)[]
  },
) {
  const defaultGetQueryKeyValues = (
    params: TParams,
  ): (string | number | boolean | string[] | undefined | null)[] => [
    params.depositionId,
    params.page ?? 1,

    ...Object.entries(params)
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

  return createDepositionQuery<TData, TParams>({
    ...config,
    getQueryKeyValues: config.getQueryKeyValues ?? defaultGetQueryKeyValues,
  })
}

/**
 * Specialized factory for organism-filtered queries
 */
export function createOrganismFilteredQuery<
  TData,
  TParams extends BaseQueryParams & {
    depositionId?: number
    organismName?: string
    page?: number
    pageSize?: number
  },
>(
  config: Omit<
    DepositionQueryConfig<TData, TParams>,
    'getQueryKeyValues' | 'getRequiredParams'
  > & {
    getQueryKeyValues?: (
      params: TParams,
    ) => (string | number | boolean | string[] | undefined | null)[]
    getRequiredParams?: (params: TParams) => Record<string, unknown>
  },
) {
  const defaultGetQueryKeyValues = (
    params: TParams & { organismName?: string },
  ): (string | number | boolean | string[] | undefined | null)[] => [
    params.depositionId,
    params.organismName,
    params.page ?? 1,
    params.pageSize,

    ...Object.entries(params)
      .filter(
        ([key]) =>
          ![
            'depositionId',
            'organismName',
            'page',
            'pageSize',
            'enabled',
          ].includes(key),
      )
      .map(
        ([, value]) =>
          value as string | number | boolean | string[] | undefined | null,
      )
      .filter((v) => v !== undefined),
  ]

  const defaultGetRequiredParams = (
    params: TParams & { organismName?: string },
  ) => ({
    depositionId: params.depositionId,
    organismName: params.organismName,
  })

  return createDepositionQuery<TData, TParams>({
    ...config,
    getQueryKeyValues: config.getQueryKeyValues ?? defaultGetQueryKeyValues,
    getRequiredParams: config.getRequiredParams ?? defaultGetRequiredParams,
  })
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
