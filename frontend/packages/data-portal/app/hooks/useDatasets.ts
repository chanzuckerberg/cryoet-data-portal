import { useLoaderData } from 'react-router'

import { GetDatasetsV2Query } from 'app/__generated_v2__/graphql'

export function useDatasets() {
  const { v2 } = useLoaderData<{
    v2: GetDatasetsV2Query
  }>()

  return {
    datasets: v2.datasets,
  }
}
