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
  // Fetch all three in parallel — base data no longer blocks the others (the 404
  // check just moves after the await).
  const [{ data: responseV2 }, { data: expandedData }, { data }] =
    await Promise.all([
      getDepositionBaseData({
        client,
        id: params.id,
        params: url.searchParams,
      }),
      getDepositionExpandedData({ client, id: params.id }),
      fetchConditionalData(client, params, url),
    ])

  if (responseV2.depositions.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new Response(null, {
      status: 404,
      statusText: `Deposition with ID ${params.id} not found`,
    })
  }

  return {
    expandedData,
    v2: responseV2,
    annotations: data && 'annotationShapes' in data ? data : undefined,
    tomograms: data && 'tomograms' in data ? data : undefined,
  }
}
