/*
 * NOTE: This file does not use the preferred page object pattern.
 * This is because we did not have time to refactor.
 * Please do not use this file as an example of how to write tests.
 */

import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getDatasetByIdV2 } from 'app/graphql/getDatasetByIdV2.server'
import { getDatasetsV2 } from 'app/graphql/getDatasetsV2.server'

import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import { testPagination } from './pagination/testPagination'
import { getParamsFromFilter } from './pagination/utils'

const { pagination } = E2E_CONFIG
const { browseDatasets, singleDataset } = pagination

testPagination({
  rowLoadedSelector: `:has-text("${translations.datasetId}:")`,
  testFilter: browseDatasets.filter,
  testFilterWithNoPages: browseDatasets.filterWithNoPages,
  url: BROWSE_DATASETS_URL,

  async getMaxPages(client, filter, page) {
    const { data } = await getDatasetsV2({
      client,
      page,
      params: getParamsFromFilter(filter),
    })
    const count = data.filteredDatasetsCount.aggregate?.at(0)?.count ?? 0

    return Math.ceil(count / MAX_PER_PAGE)
  },
})

testPagination({
  rowLoadedSelector: `:has-text("${translations.runId}:")`,
  testFilter: singleDataset.filter,
  testFilterWithNoPages: singleDataset.filterWithNoPages,
  url: `${E2E_CONFIG.url}/datasets/${singleDataset.id}`,

  async getMaxPages(client, filter, pageNumber) {
    const { data } = await getDatasetByIdV2({
      client,
      params: getParamsFromFilter(filter),
      page: pageNumber,
      id: +singleDataset.id,
    })

    const count =
      data.datasets.at(0)?.filteredRunsCount?.aggregate?.at(0)?.count ?? 0

    return Math.ceil(count / MAX_PER_PAGE)
  },
})
