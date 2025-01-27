import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'
import { GetDatasetsV2Query } from 'app/__generated_v2__/graphql'

export type Dataset = GetDatasetsDataQuery['datasets'][number]

export function useDatasets() {
  const { v2 } = useTypedLoaderData<{
    v2: GetDatasetsV2Query
  }>()

  return {
    datasets: v2.datasets,
  }
}
