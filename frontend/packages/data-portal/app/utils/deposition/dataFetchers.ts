import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { match, P } from 'ts-pattern'

import { getDepositionAnnotations } from 'app/graphql/getDepositionAnnotationsV2.server'
import {
  getDepositionBaseData,
  getDepositionExpandedData,
  getDepositionLegacyData,
} from 'app/graphql/getDepositionByIdV2.server'
import { getDepositionTomograms } from 'app/graphql/getDepositionTomogramsV2.server'
import { DataContentsType } from 'app/types/deposition-queries'

import { LoaderParams } from './loaderValidation'

export interface FetchDepositionDataParams {
  client: ApolloClient<NormalizedCacheObject>
  params: LoaderParams
  url: URL
  isExpandDepositions: boolean
}

export interface DepositionData {
  expandedData: unknown
  v2: unknown
  legacyData: unknown
  annotations: unknown
  tomograms: unknown
}

/**
 * Validates that a deposition exists by fetching base data
 * @param client - Apollo client instance
 * @param id - Deposition ID to validate
 * @param params - URL search parameters for filtering
 * @throws Response with 404 status if deposition not found
 * @returns Base deposition data
 */
async function validateDepositionExists(
  client: ApolloClient<NormalizedCacheObject>,
  id: number,
  params: URLSearchParams,
) {
  const { data: responseV2 } = await getDepositionBaseData({
    client,
    id,
    params,
  })

  if (responseV2.depositions.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new Response(null, {
      status: 404,
      statusText: `Deposition with ID ${id} not found`,
    })
  }

  return responseV2
}

/**
 * Fetches expanded deposition data when the feature flag is enabled
 * @param client - Apollo client instance
 * @param id - Deposition ID
 * @param isExpandDepositions - Whether expand depositions feature is enabled
 * @returns Promise resolving to expanded data or undefined
 */
async function fetchExpandedData(
  client: ApolloClient<NormalizedCacheObject>,
  id: number,
  isExpandDepositions: boolean,
) {
  return isExpandDepositions
    ? getDepositionExpandedData({ client, id })
    : Promise.resolve({ data: undefined })
}

/**
 * Fetches conditional data based on feature flags and tab selection
 * @param client - Apollo client instance
 * @param params - Loader parameters
 * @param url - Request URL for search params
 * @param isExpandDepositions - Whether expand depositions feature is enabled
 * @returns Promise resolving to conditional data
 */
async function fetchConditionalData(
  client: ApolloClient<NormalizedCacheObject>,
  params: LoaderParams,
  url: URL,
  isExpandDepositions: boolean,
) {
  return match({
    isExpandDepositions,
    depositionTab: params.type,
  })
    .with({ isExpandDepositions: false }, () =>
      getDepositionLegacyData({
        client,
        id: params.id,
        page: params.page,
        orderBy: params.orderByV2,
        params: url.searchParams,
      }),
    )
    .with(
      {
        isExpandDepositions: true,
        depositionTab: P.union(DataContentsType.Annotations, null),
      },
      () =>
        getDepositionAnnotations({
          client,
          page: params.page,
          depositionId: params.id,
          params: url.searchParams,
        }),
    )
    .with(
      {
        isExpandDepositions: true,
        depositionTab: DataContentsType.Tomograms,
      },
      () =>
        getDepositionTomograms({
          client,
          page: params.page,
          depositionId: params.id,
          params: url.searchParams,
        }),
    )
    .otherwise(() => Promise.resolve({ data: undefined }))
}

/**
 * Orchestrates all deposition data fetching
 * @param fetchParams - Parameters for data fetching
 * @returns Promise resolving to complete deposition data
 */
export async function fetchDepositionData({
  client,
  params,
  url,
  isExpandDepositions,
}: FetchDepositionDataParams): Promise<DepositionData> {
  // First validate existence
  const responseV2 = await validateDepositionExists(
    client,
    params.id,
    url.searchParams,
  )

  // Then fetch remaining data in parallel
  const [{ data: expandedData }, { data }] = await Promise.all([
    fetchExpandedData(client, params.id, isExpandDepositions),
    fetchConditionalData(client, params, url, isExpandDepositions),
  ])

  return {
    expandedData,
    v2: responseV2,
    legacyData: data && 'datasets' in data ? data : undefined,
    annotations: data && 'annotationShapes' in data ? data : undefined,
    tomograms: data && 'tomograms' in data ? data : undefined,
  }
}
