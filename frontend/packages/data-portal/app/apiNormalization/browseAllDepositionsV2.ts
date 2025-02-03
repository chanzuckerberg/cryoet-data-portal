import { GetDepositionsDataV2Query } from 'app/__generated_v2__/graphql'
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
    Array.from(
      new Set(
        deposition.objectNames?.aggregate
          ?.map((aggregate) => aggregate.groupBy?.objectName ?? '')
          .filter((value) => value !== '') ?? [],
      ),
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
  objectShapeTypes: (deposition) =>
    deposition.distinctShapeTypes?.aggregate
      ?.map((aggregate) => aggregate.groupBy?.annotationShapes?.shapeType)
      .filter(isDefined)
      .sort((shapeTypeA, shapeTypeB) => shapeTypeA.localeCompare(shapeTypeB)) ??
    [],
  acrossDatasets: (deposition) =>
    deposition.annotationDatasetCount?.aggregate?.length ?? 0,
} as const)

export const remapV2BrowseAllDepositions = remapAPI<
  GetDepositionsDataV2Query,
  BrowseAllDepositionsPageDataType
>({
  totalDepositionCount: (data) =>
    data.totalDepositionCount?.aggregate?.at(0)?.count ?? 0,
  filteredDepositionCount: (data) =>
    data.filteredDepositionCount?.aggregate?.at(0)?.count ?? 0,
  depositions: (data) =>
    data.depositions.map(remapV2Deposition).sort((a, b) => {
      const dateDiff =
        new Date(b.depositionDate).getTime() -
        new Date(a.depositionDate).getTime()
      if (dateDiff !== 0) return dateDiff
      return b.id - a.id
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
} as const)
