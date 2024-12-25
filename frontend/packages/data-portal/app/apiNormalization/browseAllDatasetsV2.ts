import { GetDatasetsDataV2Query } from 'app/__generated_v2__/graphql'
import {
  BrowseAllDatasetsPageDataType,
  Dataset,
} from 'app/types/PageData/browseAllDatasetsPageData'
import { remapAPI } from 'app/utils/apiMigration'

import { stringCompare } from './utils'

const remapV2Dataset = remapAPI<
  GetDatasetsDataV2Query['datasets'][number],
  Dataset
>({
  id: 'id',
  title: 'title',
  organismName: 'organismName',
  datasetPublications: 'datasetPublications',
  keyPhotoThumbnailUrl: 'keyPhotoThumbnailUrl',
  relatedDatabaseEntries: 'relatedDatabaseEntries',
  authors: (dataset) => dataset.authors?.edges?.map((edge) => edge.node) ?? [],
  runCount: (dataset) => dataset.runCount?.aggregate?.at(0)?.count ?? 0,
  annotatedObjects: (dataset) =>
    Array.from(
      new Set(
        dataset.runs.edges.flatMap(
          (edge) =>
            edge.node.annotationsAggregate?.aggregate?.flatMap(
              (aggregate) => aggregate?.groupBy?.objectName ?? '',
            ) ?? [],
        ),
      ),
    )
      .filter((value) => value !== '')
      .sort(stringCompare),
} as const)

export const remapV2BrowseAllDatasets = remapAPI<
  GetDatasetsDataV2Query,
  BrowseAllDatasetsPageDataType
>({
  totalDatasetCount: (data) => data.datasetCount?.aggregate?.at(0)?.count ?? 0,
  filteredDatasetCount: (data) =>
    data.filteredDatasetCount?.aggregate?.at(0)?.count ?? 0,
  datasets: (data) => data.datasets.map(remapV2Dataset),
} as const)
