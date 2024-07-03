import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDepositionsDataQuery } from 'app/__generated__/graphql'

export type Deposition = GetDepositionsDataQuery['depositions'][number]

export function useDepositions() {
  const data = useTypedLoaderData<GetDepositionsDataQuery>()

  return useMemo(
    () => ({
      depositions: data.depositions,
      depositionCount: data.depositions_aggregate.aggregate?.count ?? 0,

      filteredDepositionCount:
        data.filtered_depositions_aggregate.aggregate?.count ?? 0,

      objectNames: data.object_names.map((value) => value.object_name),

      objectShapeTypes: data.object_shape_types.map(
        (value) => value.shape_type,
      ),
    }),
    [
      data.depositions,
      data.depositions_aggregate.aggregate?.count,
      data.filtered_depositions_aggregate.aggregate?.count,
      data.object_names,
      data.object_shape_types,
    ],
  )
}
