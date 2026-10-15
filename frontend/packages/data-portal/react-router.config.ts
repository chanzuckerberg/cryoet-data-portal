import type { Config } from '@react-router/dev/config'

// eslint-disable-next-line import/no-default-export
export default {
  ssr: true,
  // Ship the full route manifest with the initial document instead of
  // discovering routes lazily via /__manifest. With this few routes, lazy
  // discovery only adds a round-trip before the first client navigation
  // (including search-param-only navigations like switching table tabs).
  routeDiscovery: { mode: 'initial' },
} satisfies Config
