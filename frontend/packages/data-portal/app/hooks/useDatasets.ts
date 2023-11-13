import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'

export type Dataset = GetDatasetsDataQuery['datasets'][number]

export function useDatasets() {
  const data = useTypedLoaderData<GetDatasetsDataQuery>()

  return {
    datasets: data.datasets,
    datasetCount: data.datasets_aggregate.aggregate?.count ?? 0,
    filteredDatasetCount:
      data.filtered_datasets_aggregate.aggregate?.count ?? 0,
  }
}
