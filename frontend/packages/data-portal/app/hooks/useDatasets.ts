import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'

export type Dataset = GetDatasetsDataQuery['datasets'][number]

export function useDatasets() {
  const { v1 } = useTypedLoaderData<{
    v1: GetDatasetsDataQuery
  }>()

  return {
    datasets: v1.datasets,
  }
}
