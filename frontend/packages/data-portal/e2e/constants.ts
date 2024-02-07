import type config from 'e2e/config.example.json'

export const E2E_CONFIG = JSON.parse(process.env.E2E_CONFIG) as typeof config

export const BROWSE_DATASETS_URL = `${E2E_CONFIG.url}/browse-data/datasets`
