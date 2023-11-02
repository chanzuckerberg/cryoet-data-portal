import { useLoaderData } from '@remix-run/react'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'

export type Dataset = GetDatasetsDataQuery['datasets'][number]

export function useDatasets() {
  const data = useLoaderData<GetDatasetsDataQuery>()

  return {
    datasets: data.datasets as unknown as Dataset[],
    datasetCount: data.datasets_aggregate.aggregate?.count ?? 0,
    filteredDatasetCount:
      data.filtered_datasets_aggregate.aggregate?.count ?? 0,
  }
}
