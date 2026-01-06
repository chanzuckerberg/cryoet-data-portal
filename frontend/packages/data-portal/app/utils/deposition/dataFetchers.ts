import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { match, P } from 'ts-pattern'

import { getDepositionAnnotations } from 'app/graphql/getDepositionAnnotationsV2.server'
import {
  getDepositionBaseData,
  getDepositionExpandedData,
} from 'app/graphql/getDepositionByIdV2.server'
import { getDepositionTomograms } from 'app/graphql/getDepositionTomogramsV2.server'
import { DataContentsType } from 'app/types/deposition-queries'

import { LoaderParams } from './loaderValidation'

export interface FetchDepositionDataParams {
  client: ApolloClient<NormalizedCacheObject>
  params: LoaderParams
  url: URL
}

export interface DepositionData {
  expandedData: unknown
  v2: unknown
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
 * Fetches conditional data based on tab selection
 * @param client - Apollo client instance
 * @param params - Loader parameters
 * @param url - Request URL for search params
 * @returns Promise resolving to conditional data
 */
async function fetchConditionalData(
  client: ApolloClient<NormalizedCacheObject>,
  params: LoaderParams,
  url: URL,
) {
  return match(params.type)
    .with(P.union(DataContentsType.Annotations, null), () =>
      getDepositionAnnotations({
        client,
        page: params.page,
        depositionId: params.id,
        params: url.searchParams,
      }),
    )
    .with(DataContentsType.Tomograms, () =>
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
}: FetchDepositionDataParams): Promise<DepositionData> {
  // First validate existence
  const responseV2 = await validateDepositionExists(
    client,
    params.id,
    url.searchParams,
  )

  // Then fetch remaining data in parallel
  const [{ data: expandedData }, { data }] = await Promise.all([
    getDepositionExpandedData({ client, id: params.id }),
    fetchConditionalData(client, params, url),
  ])

  return {
    expandedData,
    v2: responseV2,
    annotations: data && 'annotationShapes' in data ? data : undefined,
    tomograms: data && 'tomograms' in data ? data : undefined,
  }
}
