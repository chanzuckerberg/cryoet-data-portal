import { useTypedLoaderData } from 'remix-typedjson'

import {
  GetDatasetsV2Query,
  GetDepositionLegacyDataV2Query,
} from 'app/__generated_v2__/graphql'
import { isDefined } from 'app/utils/nullish'

export function useDatasetsFilterData() {
  const { v2, legacyData } = useTypedLoaderData<{
    v2: GetDatasetsV2Query
    legacyData?: GetDepositionLegacyDataV2Query // For deposition pages
  }>()

  // Use legacyData for deposition pages, otherwise use v2 for dataset pages
  const dataSource = legacyData ?? v2

  return {
    filteredDatasetsCount:
      dataSource?.filteredDatasetsCount?.aggregate?.[0]?.count ?? 0,

    totalDatasetsCount:
      dataSource?.totalDatasetsCount?.aggregate?.[0]?.count ?? 0,

    organismNames:
      dataSource?.distinctOrganismNames?.aggregate
        ?.map((aggregate) => aggregate.groupBy?.organismName)
        .filter(isDefined) ?? [],

    cameraManufacturers:
      dataSource?.distinctCameraManufacturers?.aggregate
        ?.map((aggregate) => aggregate.groupBy?.cameraManufacturer)
        .filter(isDefined) ?? [],

    reconstructionMethods:
      dataSource?.distinctReconstructionMethods?.aggregate
        ?.map((aggregate) => aggregate.groupBy?.reconstructionMethod)
        .filter(isDefined) ?? [],

    reconstructionSoftwares:
      dataSource?.distinctReconstructionSoftwares?.aggregate
        ?.map((aggregate) => aggregate.groupBy?.reconstructionSoftware)
        .filter(isDefined) ?? [],

    objectNames: Array.from(
      new Set(
        [
          ...(dataSource?.distinctObjectNames?.aggregate
            ?.map((aggregate) => aggregate.groupBy?.objectName)
            .filter(isDefined) ?? []),
          ...(dataSource?.distinctIdentifiedObjectNames?.aggregate
            ?.map((aggregate) => aggregate.groupBy?.objectName)
            .filter(isDefined) ?? []),
        ].filter(isDefined),
      ),
    ),

    objectShapeTypes:
      dataSource?.distinctShapeTypes?.aggregate
        ?.map((aggregate) => aggregate.groupBy?.shapeType)
        .filter(isDefined) ?? [],
  }
}
