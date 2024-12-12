import { jest } from '@jest/globals'

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
