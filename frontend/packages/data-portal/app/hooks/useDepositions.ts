import { detailedDiff } from 'deep-object-diff'
import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDepositionsDataQuery } from 'app/__generated__/graphql'
import { GetDepositionsDataV2Query } from 'app/__generated_v2__/graphql'
import {
  remapV1BrowseAllDepositions,
  remapV2BrowseAllDepositions,
} from 'app/apiNormalization'

export function useDepositions() {
  const { v1, v2 } = useTypedLoaderData<{
    v1: GetDepositionsDataQuery
    v2: GetDepositionsDataV2Query
  }>()

  const v1result = useMemo(() => remapV1BrowseAllDepositions(v1), [v1])
  const v2result = useMemo(() => remapV2BrowseAllDepositions(v2), [v2])

  // eslint-disable-next-line no-console
  console.log(detailedDiff(v1result.depositions, v2result.depositions))

  return v2result
}
