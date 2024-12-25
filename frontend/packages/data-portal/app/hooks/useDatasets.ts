import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'
import { remapV1BrowseAllDatasets } from 'app/apiNormalization'

export function useDatasets() {
  const { datasetsData: data } = useTypedLoaderData<{
    datasetsData: GetDatasetsDataQuery
  }>()

  return useMemo(() => remapV1BrowseAllDatasets(data), [data])
}
