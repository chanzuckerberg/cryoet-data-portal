import { TextDecoder, TextEncoder } from 'node:util'

import { jest } from '@jest/globals'

// jsdom doesn't provide these, but react-router relies on them.
Object.assign(global, { TextDecoder, TextEncoder })

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (i18nKey: string) => i18nKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),

  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}))

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response),
)
