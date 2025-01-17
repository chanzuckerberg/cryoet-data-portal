import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDepositionByIdQuery } from 'app/__generated__/graphql'

export type Deposition = NonNullable<GetDepositionByIdQuery['deposition']>

export type Dataset = GetDepositionByIdQuery['datasets'][number]

export function useDepositionById() {
  const { v1, annotationMethodCounts } = useTypedLoaderData<{
    v1: GetDepositionByIdQuery
    annotationMethodCounts: Map<string, number>
  }>()

  const objectNames = useMemo(
    () =>
      Array.from(
        new Set(
          v1.deposition?.object_names.flatMap(
            (annotation) => annotation.object_name,
          ),
        ),
      ),
    [v1.deposition?.object_names],
  )

  const objectShapeTypes = useMemo(
    () =>
      Array.from(
        new Set(
          v1.deposition?.annotations.flatMap((annotation) =>
            annotation.files.flatMap((file) => file.shape_type),
          ),
        ),
      ),
    [v1.deposition?.annotations],
  )

  const organismNames = useMemo(
    () =>
      Array.from(
        new Set(v1.datasets.flatMap((dataset) => dataset.organism_name)),
      ).filter(Boolean) as string[],
    [v1.datasets],
  )

  return {
    deposition: v1.deposition as Deposition,
    datasets: v1.datasets,
    datasetsCount: v1.datasets_aggregate.aggregate?.count ?? 0,
    filteredDatasetsCount: v1.filtered_datasets_aggregate.aggregate?.count ?? 0,
    objectNames,
    objectShapeTypes,
    organismNames,
    annotationMethodCounts,
  }
}
