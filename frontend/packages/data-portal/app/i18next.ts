export const i18n = {
  supportedLngs: ['en'],
  fallbackLng: 'en',
  // React already escapes JSX expressions, so disable i18next's HTML escaping
  // to prevent special chars like "/" being converted to HTML entities (e.g. &#x2F;)
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
    transWrapTextNodes: 'span',
  },
}
