import { useTypedLoaderData } from 'remix-typedjson'

import {
  GetDatasetsV2Query,
  GetDepositionByIdV2Query,
} from 'app/__generated_v2__/graphql'
import { isDefined } from 'app/utils/nullish'

export function useDatasetsFilterData() {
  const { v2 } = useTypedLoaderData<{
    v2: GetDatasetsV2Query | GetDepositionByIdV2Query // TODO: Move this data into props.
  }>()

  return {
    organismNames:
      v2.distinctOrganismNames.aggregate
        ?.map((aggregate) => aggregate.groupBy?.organismName)
        .filter(isDefined) ?? [],
    cameraManufacturers:
      v2.distinctCameraManufacturers.aggregate
        ?.map((aggregate) => aggregate.groupBy?.cameraManufacturer)
        .filter(isDefined) ?? [],
    reconstructionMethods:
      v2.distinctReconstructionMethods.aggregate
        ?.map((aggregate) => aggregate.groupBy?.reconstructionMethod)
        .filter(isDefined) ?? [],
    reconstructionSoftwares:
      v2.distinctReconstructionSoftwares.aggregate
        ?.map((aggregate) => aggregate.groupBy?.reconstructionSoftware)
        .filter(isDefined) ?? [],
    objectNames:
      v2.distinctObjectNames.aggregate
        ?.map((aggregate) => aggregate.groupBy?.objectName)
        .filter(isDefined) ?? [],
    objectShapeTypes:
      v2.distinctShapeTypes.aggregate
        ?.map((aggregate) => aggregate.groupBy?.shapeType)
        .filter(isDefined) ?? [],
  }
}
