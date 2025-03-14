import {
  GetDepositionsDataV2Query,
  OrderBy,
} from 'app/__generated_v2__/graphql'
import {
  BrowseAllDepositionsPageDataType,
  Deposition,
} from 'app/types/PageData/browseAllDepositionsPageData'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { remapAPI } from 'app/utils/apiMigration'
import { isDefined } from 'app/utils/nullish'

const remapV2Deposition = remapAPI<
  GetDepositionsDataV2Query['depositions'][number],
  Deposition
>({
  id: 'id',
  title: 'title',
  keyPhotoThumbnailUrl: 'keyPhotoThumbnailUrl',
  depositionDate: (deposition) => deposition.depositionDate.split('T')[0],
  authors: (deposition) =>
    deposition.authors?.edges?.map((edge) => edge.node) ?? [],
  annotationCount: (deposition) =>
    deposition.annotationsCount?.aggregate?.at(0)?.count ?? 0,
  annotatedObjects: (deposition) =>
    deposition.objectNames?.aggregate?.reduce((acc, aggregate) => {
      const objectName = aggregate.groupBy?.objectName
      const groundTruthStatus = !!aggregate.groupBy?.groundTruthStatus
      if (!objectName) return acc // Skip invalid entries
      if (acc.has(objectName)) {
        // If the objectName is already in the map
        if (groundTruthStatus) {
          acc.set(objectName, true) // if any runs have the ground truth status, set the annotatedObject to true
        }
      } else {
        acc.set(objectName, groundTruthStatus)
      }
      return acc
    }, new Map<string, boolean>()) || new Map<string, boolean>(),
  objectShapeTypes: (deposition) =>
    deposition.distinctShapeTypes?.aggregate
      ?.map((aggregate) => aggregate.groupBy?.annotationShapes?.shapeType)
      .filter(isDefined)
      .sort((shapeTypeA, shapeTypeB) => shapeTypeA.localeCompare(shapeTypeB)) ??
    [],
  acrossDatasets: (deposition) =>
    deposition.annotationDatasetCount?.aggregate?.length ?? 0,
} as const)

export const remapV2BrowseAllDepositions = (
  v2data: GetDepositionsDataV2Query,
  sortDirection: OrderBy = OrderBy.Desc,
) => {
  return remapAPI<GetDepositionsDataV2Query, BrowseAllDepositionsPageDataType>({
    totalDepositionCount: (data) =>
      data.totalDepositionCount?.aggregate?.at(0)?.count ?? 0,
    filteredDepositionCount: (data) =>
      data.filteredDepositionCount?.aggregate?.at(0)?.count ?? 0,
    depositions: (data) =>
      data.depositions.map(remapV2Deposition).sort((a, b) => {
        const dateDiff =
          new Date(b.depositionDate).getTime() -
          new Date(a.depositionDate).getTime()
        if (dateDiff !== 0) {
          return sortDirection === OrderBy.Desc ? dateDiff : -dateDiff
        }
        return sortDirection === OrderBy.Desc ? b.id - a.id : a.id - b.id
      }),
    allObjectNames: (data) =>
      Array.from(
        new Set(
          data.allObjectNames?.aggregate
            ?.map((aggregate) => aggregate.groupBy?.objectName ?? '')
            .filter((value) => value !== '') ?? [],
        ),
      ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
    allObjectShapeTypes: (data) =>
      Array.from(
        new Set(
          data.allObjectShapeTypes?.aggregate?.map(
            (aggregate) => aggregate.groupBy?.shapeType as ObjectShapeType,
          ) ?? [],
        ),
      ).sort((a, b) => a.localeCompare(b)),
  } as const)(v2data)
}
