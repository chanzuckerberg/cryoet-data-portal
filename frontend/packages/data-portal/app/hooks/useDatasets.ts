import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'

export type Dataset = GetDatasetsDataQuery['datasets'][number]

export function useDatasets() {
  const { datasetsData: data } = useTypedLoaderData<{
    datasetsData: GetDatasetsDataQuery
  }>()

  return useMemo(
    () => ({
      datasets: data.datasets,
      datasetCount: data.datasets_aggregate.aggregate?.count ?? 0,

      filteredDatasetCount:
        data.filtered_datasets_aggregate.aggregate?.count ?? 0,
    }),
    [
      data.datasets,
      data.datasets_aggregate.aggregate?.count,
      data.filtered_datasets_aggregate.aggregate?.count,
    ],
  )
}
