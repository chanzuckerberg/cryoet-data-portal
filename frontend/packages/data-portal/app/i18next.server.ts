import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import Backend from 'i18next-fs-backend'
import { RemixI18Next } from 'remix-i18next/server'

import { i18n } from './i18next'

const DIRNAME = dirname(fileURLToPath(import.meta.url))

export const LOCALES_PATH = resolve(
  DIRNAME,
  '../public/locales/{{lng}}/{{ns}}.json',
)

export const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },

  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,
    backend: {
      loadPath: LOCALES_PATH,
    },
  },

  // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
  // E.g. The Backend plugin for loading translations from the file system
  // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
  plugins: [Backend],
})
