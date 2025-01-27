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

  return {
    deposition: v1.deposition as Deposition,
    datasets: v1.datasets,
    annotationMethodCounts,
  }
}
