import { GetDepositionsDataQuery } from 'app/__generated__/graphql'
import { AuthorInfoType } from 'app/types/authorInfo'
import {
  BrowseAllDepositionsPageDataType,
  Deposition,
} from 'app/types/PageData/browseAllDepositionsPageData'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { remapAPI } from 'app/utils/apiMigration'

const remapV1Author = remapAPI<
  GetDepositionsDataQuery['depositions'][number]['authors'][number],
  AuthorInfoType
>({
  name: 'name',
  primaryAuthorStatus: 'primary_author_status',
  correspondingAuthorStatus: 'corresponding_author_status',
} as const)

const remapV1Deposition = remapAPI<
  GetDepositionsDataQuery['depositions'][number],
  Deposition
>({
  id: 'id',
  title: 'title',
  keyPhotoThumbnailUrl: 'key_photo_thumbnail_url',
  depositionDate: 'deposition_date',
  authors: (deposition) => deposition.authors.map(remapV1Author),
  annotationCount: (deposition) =>
    deposition.annotations_aggregate.aggregate?.count ?? 0,
  annotatedObjects: (deposition) =>
    Array.from(
      new Set(
        deposition.annotations.map((annotation) => annotation.object_name),
      ),
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
  objectShapeTypes: () => [],
  acrossDatasets: () => 0,
} as const)

export const remapV1BrowseAllDepositions = remapAPI<
  GetDepositionsDataQuery,
  BrowseAllDepositionsPageDataType
>({
  totalDepositionCount: (data) =>
    data.depositions_aggregate.aggregate?.count ?? 0,
  filteredDepositionCount: (data) =>
    data.filtered_depositions_aggregate.aggregate?.count ?? 0,
  depositions: (data) => data.depositions.map(remapV1Deposition),
  allObjectNames: (data) =>
    Array.from(
      new Set(data.object_names.map((annotation) => annotation.object_name)),
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
  allObjectShapeTypes: (data) =>
    Array.from(
      new Set(
        data.object_shape_types.map(
          (annotation) => annotation.shape_type as ObjectShapeType,
        ),
      ),
    ).sort((a, b) => a.localeCompare(b)),
} as const)
