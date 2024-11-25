import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { Order_By } from 'app/__generated__/graphql'
import { OrderBy } from 'app/__generated_v2__/graphql'
import {
  remapV1BrowseAllDepositions,
  remapV2BrowseAllDepositions,
} from 'app/apiNormalization'
import { getBrowseDepositions } from 'app/graphql/getBrowseDepositions.server'
import { getBrowseDepositionsV2 } from 'app/graphql/getBrowseDepositionsV2.server'

export async function loadDepositionsV1Data(
  client: ApolloClient<NormalizedCacheObject>,
  page: number,
) {
  const { data } = await getBrowseDepositions({
    client,
    orderBy: Order_By.Desc,
    page,
    query: '',
  })

  return remapV1BrowseAllDepositions(data)
}

export async function loadDepositionsV2Data(
  client: ApolloClient<NormalizedCacheObject>,
  page: number,
) {
  const { data } = await getBrowseDepositionsV2({
    client,
    orderBy: OrderBy.Desc,
    page,
  })

  return remapV2BrowseAllDepositions(data)
}
