import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsV2Query } from 'app/__generated_v2__/graphql'

export function useDatasets() {
  const { v2 } = useTypedLoaderData<{
    v2: GetDatasetsV2Query
  }>()

  return {
    datasets: v2.datasets,
  }
}
