import { jest } from '@jest/globals'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Initialize i18next for tests
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {},
      },
    },
  })
  .catch((error) => {
    console.error('Failed to initialize i18next:', error)
  })

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

  // Export the UseTranslationOptions type to avoid TypeScript issues
  UseTranslationOptions: {} as unknown,
}))

jest.mock('app/hooks/useI18n', () => ({
  // mock the custom useI18n hook that wraps useTranslation
  useI18n: () => ({
    t: (i18nKey: string) => i18nKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}))

jest.mock('@web3-storage/multipart-parser', () => ({
  parseMultipart: jest.fn(),
}))

// Mock remix-i18next server-side functionality to prevent loading translation files
jest.mock('remix-i18next/server', () => ({
  RemixI18Next: jest.fn().mockImplementation(() => ({
    getFixedT: jest.fn().mockImplementation(() => (key: string) => key),
    getT: jest.fn().mockImplementation(() => (key: string) => key),
    getLocale: jest.fn().mockReturnValue('en'),
  })),
}))

// Mock the i18next server instance 
jest.mock('app/i18next.server', () => ({
  i18next: {
    getFixedT: jest.fn().mockImplementation(() => (key: string) => key),
    getT: jest.fn().mockImplementation(() => (key: string) => key),
    getLocale: jest.fn().mockReturnValue('en'),
  },
  LOCALES_PATH: '/mock/path/locales/{{lng}}/{{ns}}.json',
}))

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response),
)

// Mock MUI TouchRipple to prevent act() warnings during tests
jest.mock('@mui/material/ButtonBase/TouchRipple', () => {
  const React = jest.requireActual('react')
  return (React as typeof import('react')).forwardRef(
    (props: Record<string, unknown>, ref: unknown) =>
      (React as typeof import('react')).createElement('span', {
        ref,
        ...props,
      }),
  )
})

// Suppress console warnings for TouchRipple during tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeEach(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0]
    if (
      typeof firstArg === 'string' &&
      (firstArg.includes('Warning: An update to ForwardRef(TouchRipple)') ||
        firstArg.includes('not wrapped in act'))
    ) {
      return
    }
    originalConsoleError(...args)
  }

  console.warn = (...args: unknown[]) => {
    const firstArg = args[0]
    if (
      typeof firstArg === 'string' &&
      firstArg.includes('Buttons without sdsStyle or sdsType props')
    ) {
      return
    }
    originalConsoleWarn(...args)
  }
})

afterEach(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})
