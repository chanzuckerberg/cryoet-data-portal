import { AuthorInfoType } from 'app/types/authorInfo'

export type BrowseAllDatasetsPageDataType = {
  totalDatasetCount: number
  filteredDatasetCount: number
  datasets: Dataset[]
}

export type Dataset = {
  id: number
  title: string
  authors: AuthorInfoType[]
  keyPhotoThumbnailUrl?: string
  organismName: string
  // TODO: convert datasetPublications and relatedDatabaseEntries to arrays
  datasetPublications: string
  relatedDatabaseEntries: string
  runCount: number
  annotatedObjects: string[]
}
