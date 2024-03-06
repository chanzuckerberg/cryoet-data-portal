import { readFileSync } from 'node:fs'

import type config from 'e2e/config.example.json'
import type translationsType from 'public/locales/en/translation.json'

export const translations = JSON.parse(
  readFileSync('public/locales/en/translation.json', 'utf-8'),
) as typeof translationsType

export const E2E_CONFIG = JSON.parse(process.env.E2E_CONFIG) as typeof config

export const BROWSE_DATASETS_URL = `${E2E_CONFIG.url}/browse-data/datasets`
export const SINGLE_DATASET_URL = `${E2E_CONFIG.url}/datasets/${E2E_CONFIG.datasetId}`
export const SINGLE_RUN_URL = `${E2E_CONFIG.url}/runs/${E2E_CONFIG.runId}`
