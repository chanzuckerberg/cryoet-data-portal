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
  annotationCount: number
  acrossDatasets: number
  annotatedObjects: string[]
  objectShapeTypes: ObjectShapeType[]
}
