import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import { GetDatasetByIdV2Query } from 'app/__generated_v2__/graphql'
import { isDefined } from 'app/utils/nullish'

export function useDatasetById() {
  const { v1, v2 } = useTypedLoaderData<{
    v1: GetDatasetByIdQuery
    v2: GetDatasetByIdV2Query
  }>()

  const dataset = v1.datasets[0]

  const deposition = v2.depositions[0]

  const objectNames =
    v2.annotationsAggregate.aggregate
      ?.map((aggregate) => aggregate.groupBy?.objectName)
      .filter(isDefined) ?? []

  const objectShapeTypes =
    v2.annotationShapesAggregate.aggregate
      ?.map((aggregate) => aggregate.groupBy?.shapeType)
      .filter(isDefined) ?? []

  return {
    dataset,
    objectNames,
    objectShapeTypes,
    deposition,
  }
}
