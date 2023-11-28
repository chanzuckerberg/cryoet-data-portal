/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  serverDependenciesToBundle: [
    // Apollo
    'graphql-tag',
    'optimism',
    'symbol-observable',
    'ts-invariant',
    'tslib',
    'zen-observable-ts',
    /@apollo\/.*/,
    /@wry\/.*/,

    // Material UI
    /@mui\/.*/,

    // Remix I18next
    'remix-i18next',
    'accept-language-parser',
    'intl-parse-accept-language',
  ],
  serverMinify: true,
}
