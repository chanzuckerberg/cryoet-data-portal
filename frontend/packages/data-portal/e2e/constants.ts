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

export const BROWSE_DATASETS_URL = `${E2E_CONFIG.url}/browse-data/datasets`
export const SINGLE_DATASET_URL = `${E2E_CONFIG.url}/datasets/${E2E_CONFIG.datasetId}`
export const SINGLE_RUN_URL = `${E2E_CONFIG.url}/runs/${E2E_CONFIG.runId}`
