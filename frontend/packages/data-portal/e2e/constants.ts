import { readFileSync } from 'node:fs'

import baseConfig from 'e2e/config.json' assert { type: 'json' }
import { merge } from 'lodash-es'
import type Translations from 'public/locales/en/translation.json'

type E2EConfig = typeof baseConfig

export const translations = JSON.parse(
  readFileSync('public/locales/en/translation.json', 'utf-8'),
) as typeof Translations

export const E2E_CONFIG = merge(
  baseConfig,
  JSON.parse(process.env.E2E_CONFIG ?? '{}'),
) as E2EConfig

export const BROWSE_DATASETS_PATH = '/browse-data/datasets'
export const SINGLE_DATASET_PATH = `/datasets/${E2E_CONFIG.datasetId}`
export const SINGLE_RUN_PATH = `/runs/${E2E_CONFIG.runId}`
export const SINGLE_DEPOSITION_PATH = `/depositions/${E2E_CONFIG.depositionId}`

export const BROWSE_DATASETS_URL = `${E2E_CONFIG.url}${BROWSE_DATASETS_PATH}`
export const SINGLE_DATASET_URL = `${E2E_CONFIG.url}${SINGLE_DATASET_PATH}`
export const SINGLE_RUN_URL = `${E2E_CONFIG.url}${SINGLE_RUN_PATH}`
export const SINGLE_DEPOSITION_URL = `${E2E_CONFIG.url}${SINGLE_DEPOSITION_PATH}`
