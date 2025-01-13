import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDepositionByIdQuery } from 'app/__generated__/graphql'

export type Deposition = NonNullable<GetDepositionByIdQuery['deposition']>

export type Dataset = GetDepositionByIdQuery['datasets'][number]

export function useDepositionById() {
  const { v1: data, annotationMethodCounts } = useTypedLoaderData<{
    v1: GetDepositionByIdQuery
    annotationMethodCounts: Map<string, number>
  }>()

  const objectNames = useMemo(
    () =>
      Array.from(
        new Set(
          data.deposition?.object_names.flatMap(
            (annotation) => annotation.object_name,
          ),
        ),
      ),
    [data.deposition?.object_names],
  )

  const objectShapeTypes = useMemo(
    () =>
      Array.from(
        new Set(
          data.deposition?.annotations.flatMap((annotation) =>
            annotation.files.flatMap((file) => file.shape_type),
          ),
        ),
      ),
    [data.deposition?.annotations],
  )

  const organismNames = useMemo(
    () =>
      Array.from(
        new Set(data.datasets.flatMap((dataset) => dataset.organism_name)),
      ).filter(Boolean) as string[],
    [data.datasets],
  )

  return {
    deposition: data.deposition as Deposition,
    datasets: data.datasets,
    datasetsCount: data.datasets_aggregate.aggregate?.count ?? 0,
    filteredDatasetsCount:
      data.filtered_datasets_aggregate.aggregate?.count ?? 0,
    objectNames,
    objectShapeTypes,
    organismNames,
    annotationMethodCounts,
  }
}
