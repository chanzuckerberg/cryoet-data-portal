import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsDataV2Query } from 'app/__generated_v2__/graphql'
import { remapV2BrowseAllDatasets } from 'app/apiNormalization'

export function useDatasets() {
  const { datasetsData: data } = useTypedLoaderData<{
    datasetsData: GetDatasetsDataV2Query
  }>()
  return useMemo(() => remapV2BrowseAllDatasets(data), [data])
}
