import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'

export type Dataset = GetDatasetsDataQuery['datasets'][number]

export function useDatasets() {
  const { v1 } = useTypedLoaderData<{
    v1: GetDatasetsDataQuery
  }>()

  return useMemo(
    () => ({
      datasets: v1.datasets,
      datasetCount: v1.datasets_aggregate.aggregate?.count ?? 0,

      filteredDatasetCount:
        v1.filtered_datasets_aggregate.aggregate?.count ?? 0,
    }),
    [
      v1.datasets,
      v1.datasets_aggregate.aggregate?.count,
      v1.filtered_datasets_aggregate.aggregate?.count,
    ],
  )
}
