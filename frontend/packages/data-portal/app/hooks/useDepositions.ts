import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDepositionsDataV2Query } from 'app/__generated_v2__/graphql'
import { remapV2BrowseAllDepositions } from 'app/apiNormalization'

export function useDepositions() {
  const { v2 } = useTypedLoaderData<{
    v2: GetDepositionsDataV2Query
  }>()

  const v2result = useMemo(() => remapV2BrowseAllDepositions(v2), [v2])

  return v2result
}
