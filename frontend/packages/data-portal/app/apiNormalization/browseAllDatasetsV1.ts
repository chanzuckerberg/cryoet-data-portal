import { GetDatasetsDataQuery } from 'app/__generated__/graphql'
import { AuthorInfoType } from 'app/types/authorInfo'
import {
  BrowseAllDatasetsPageDataType,
  Dataset,
} from 'app/types/PageData/browseAllDatasetsPageData'
import { remapAPI } from 'app/utils/apiMigration'

import { stringCompare } from './utils'

const remapV1Author = remapAPI<
  GetDatasetsDataQuery['datasets'][number]['authors'][number],
  AuthorInfoType
>({
  name: 'name',
  primaryAuthorStatus: 'primary_author_status',
  correspondingAuthorStatus: 'corresponding_author_status',
} as const)

const remapV1Dataset = remapAPI<
  GetDatasetsDataQuery['datasets'][number],
  Dataset
>({
  id: 'id',
  title: 'title',
  organismName: 'organism_name',
  datasetPublications: 'dataset_publications',
  keyPhotoThumbnailUrl: 'key_photo_thumbnail_url',
  relatedDatabaseEntries: 'related_database_entries',
  authors: (dataset) => dataset.authors.map(remapV1Author),
  runCount: (dataset) => dataset.runs_aggregate.aggregate?.count ?? 0,
  annotatedObjects: (dataset) =>
    Array.from(
      new Set(
        dataset.runs.flatMap((run) =>
          run.tomogram_voxel_spacings.flatMap((tomogramVoxelSpacing) =>
            tomogramVoxelSpacing.annotations.flatMap(
              (annotation) => annotation.object_name,
            ),
          ),
        ),
      ),
    ).sort(stringCompare),
} as const)

export const remapV1BrowseAllDatasets = remapAPI<
  GetDatasetsDataQuery,
  BrowseAllDatasetsPageDataType
>({
  totalDatasetCount: (data) => data.datasets_aggregate.aggregate?.count ?? 0,
  filteredDatasetCount: (data) =>
    data.filtered_datasets_aggregate.aggregate?.count ?? 0,
  datasets: (data) =>
    data.datasets
      .toSorted((a, b) => {
        const dateComparison =
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        if (dateComparison !== 0) {
          return dateComparison
        }
        return b.id - a.id
      })
      .map(remapV1Dataset),
} as const)
