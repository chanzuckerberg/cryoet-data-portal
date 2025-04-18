/*
 * NOTE: This file does not use the preferred page object pattern.
 * This is because we did not have time to refactor.
 * Please do not use this file as an example of how to write tests.
 */

import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import { testPagination } from './pagination/testPagination'

const { pagination } = E2E_CONFIG
const { browseDatasets, singleDataset } = pagination

testPagination({
  rowLoadedSelector: `:has-text("${translations.datasetId}:")`,
  testFilter: browseDatasets.filter,
  testFilterWithNoPages: browseDatasets.filterWithNoPages,
  url: BROWSE_DATASETS_URL,
})

testPagination({
  rowLoadedSelector: `:has-text("${translations.runId}:")`,
  testFilter: singleDataset.filter,
  testFilterWithNoPages: singleDataset.filterWithNoPages,
  url: `${E2E_CONFIG.url}/datasets/${singleDataset.id}`,
})
