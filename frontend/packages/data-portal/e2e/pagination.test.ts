import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'
import { getDatasetById } from 'app/graphql/getDatasetById.server'

import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import { TableValidatorOptions } from './filters/types'
import { validateDatasetsTable, validateRunsTable } from './filters/utils'
import { testPagination } from './pagination/testPagination'

const { browseDatasets, singleDataset } = E2E_CONFIG.pagination

testPagination({
  filterParams: new URLSearchParams([
    [browseDatasets.filter.key, browseDatasets.filter.value],
  ]),
  rowLoadedSelector: `:has-text("${translations.datasetId}:")`,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,

  async getMaxPages(client, params, pageNumber) {
    const { data } = await getBrowseDatasets({
      client,
      params,
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
  filterParams: new URLSearchParams([
    [singleDataset.filter.key, singleDataset.filter.value],
  ]),
  rowLoadedSelector: `:has-text("${translations.runId}:")`,
  url: `${E2E_CONFIG.url}/datasets/${singleDataset.id}`,
  validateTable: validateRunsTableWithId,

  async getMaxPages(client, params, pageNumber) {
    const { data } = await getDatasetById({
      client,
      params,
      page: pageNumber,
      id: +singleDataset.id,
    })
    const count = data.datasets.at(0)?.filtered_runs_count.aggregate?.count ?? 0

    return Math.ceil(count / MAX_PER_PAGE)
  },
})
