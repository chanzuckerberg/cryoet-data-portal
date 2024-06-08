import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'
import { getDatasetById } from 'app/graphql/getDatasetById.server'

import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import { TableValidatorOptions } from './filters/types'
import { validateDatasetsTable, validateRunsTable } from './filters/utils'
import { testPagination } from './pagination/testPagination'
import { getParamsFromFilter } from './pagination/utils'

const { pagination } = E2E_CONFIG
const { browseDatasets, singleDataset } = pagination

testPagination({
  rowLoadedSelector: `:has-text("${translations.datasetId}:")`,
  testFilter: browseDatasets.filter,
  testFilterWithNoPages: browseDatasets.filterWithNoPages,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,

  async getMaxPages(client, filter, pageNumber) {
    const { data } = await getBrowseDatasets({
      client,
      params: getParamsFromFilter(filter),
      page: pageNumber,
    })
    const count = data.filtered_datasets_aggregate.aggregate?.count ?? 0

    return Math.ceil(count / MAX_PER_PAGE)
  },
})

const validateRunsTableWithId = (options: TableValidatorOptions) =>
  validateRunsTable({
    ...options,
    id: +singleDataset.id,
  })

testPagination({
  rowLoadedSelector: `:has-text("${translations.runId}:")`,
  testFilter: singleDataset.filter,
  testFilterWithNoPages: singleDataset.filterWithNoPages,
  url: `${E2E_CONFIG.url}/datasets/${singleDataset.id}`,
  validateTable: validateRunsTableWithId,

  async getMaxPages(client, filter, pageNumber) {
    const { data } = await getDatasetById({
      client,
      params: getParamsFromFilter(filter),
      page: pageNumber,
      id: +singleDataset.id,
    })
    const count = data.datasets.at(0)?.filtered_runs_count.aggregate?.count ?? 0

    return Math.ceil(count / MAX_PER_PAGE)
  },
})
