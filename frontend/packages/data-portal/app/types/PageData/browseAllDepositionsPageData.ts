import { Annotation_File_Shape_Type_Enum } from 'app/__generated_v2__/graphql'
import { AuthorInfoType } from 'app/types/authorInfo'
import { ObjectShapeType } from 'app/types/shapeTypes'

export type BrowseAllDepositionsPageDataType = {
  totalDepositionCount: number
  filteredDepositionCount: number
  depositions: Deposition[]
  allObjectNames: string[]
  allObjectShapeTypes: ObjectShapeType[]
}

export type Deposition = {
  id: number
  title: string
  authors: AuthorInfoType[]
  keyPhotoThumbnailUrl?: string
  depositionDate: string
  annotationCount?: number
  acrossDatasets: number
  annotatedObjects: Map<string, boolean>
  objectShapeTypes: Annotation_File_Shape_Type_Enum[]
  tomogramsCount?: number
  totalImagingData: number
}
