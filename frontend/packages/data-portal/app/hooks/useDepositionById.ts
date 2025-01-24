import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDepositionByIdQuery } from 'app/__generated__/graphql'
import { GetDepositionByIdV2Query } from 'app/__generated_v2__/graphql'
import { isDefined } from 'app/utils/nullish'

export type Deposition = NonNullable<GetDepositionByIdQuery['deposition']>

export type Dataset = GetDepositionByIdQuery['datasets'][number]

export function useDepositionById() {
  const { v1, v2 } = useTypedLoaderData<{
    v1: GetDepositionByIdQuery
    v2: GetDepositionByIdV2Query
  }>()

  const annotationMethodCounts = new Map<string, number>(
    v2.depositions[0].annotationMethodCounts?.aggregate
      ?.map((aggregate) => [
        aggregate.groupBy?.annotationMethod,
        aggregate.count ?? 0,
      ])
      .filter((entry): entry is [string, number] => isDefined(entry[0])) ?? [],
  )

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
