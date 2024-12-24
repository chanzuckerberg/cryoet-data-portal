import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import {
  remapV1BrowseAllDatasets,
  remapV2BrowseAllDatasets,
} from 'app/apiNormalization'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'
import { getBrowseDatasetsV2 } from 'app/graphql/getBrowseDatasetsV2.server'

export async function loadDatasetsV1Data(
  client: ApolloClient<NormalizedCacheObject>,
  page: number,
) {
  const { data } = await getBrowseDatasets({
    client,
    page,
  })

  return remapV1BrowseAllDatasets(data)
}

export async function loadDatasetsV2Data(
  client: ApolloClient<NormalizedCacheObject>,
  page: number,
) {
  const { data } = await getBrowseDatasetsV2({
    client,
    page,
  })

  return remapV2BrowseAllDatasets(data)
}
