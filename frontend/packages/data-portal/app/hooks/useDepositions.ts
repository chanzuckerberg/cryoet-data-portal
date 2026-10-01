import { useLoaderData } from '@remix-run/react'
import { useMemo } from 'react'

import {
  GetDepositionsDataV2Query,
  OrderBy,
} from 'app/__generated_v2__/graphql'
import { remapV2BrowseAllDepositions } from 'app/apiNormalization'

export function useDepositions() {
  const { v2, orderBy } = useLoaderData<{
    v2: GetDepositionsDataV2Query
    orderBy: OrderBy
  }>()
  const v2result = useMemo(
    () => remapV2BrowseAllDepositions(v2, orderBy),
    [v2, orderBy],
  )

  return v2result
}
