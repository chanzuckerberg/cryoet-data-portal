import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetByIdV2Query } from 'app/__generated_v2__/graphql'
import { isDefined } from 'app/utils/nullish'

export function useDatasetById() {
  const { v2 } = useTypedLoaderData<{
    v2: GetDatasetByIdV2Query
  }>()

  const { runs } = v2

  const { unFilteredRuns } = v2

  const dataset = v2.datasets[0]

  const deposition = v2.depositions[0]

  const objectNames =
    v2.annotationsAggregate.aggregate
      ?.map((aggregate) => aggregate.groupBy?.objectName)
      .filter(isDefined) ?? []

  const objectShapeTypes =
    v2.annotationShapesAggregate.aggregate
      ?.map((aggregate) => aggregate.groupBy?.shapeType)
      .filter(isDefined) ?? []

  const tiltseriesQualityScores =
    v2.tiltseriesAggregate.aggregate
      ?.map((aggregate) => aggregate.groupBy?.tiltSeriesQuality)
      .filter(isDefined) ?? []

  return {
    runs,
    unFilteredRuns,
    dataset,
    deposition,
    objectNames,
    objectShapeTypes,
    tiltseriesQualityScores,
  }
}
