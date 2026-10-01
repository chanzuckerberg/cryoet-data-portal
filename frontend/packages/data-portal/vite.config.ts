import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [remix(), tsconfigPaths()],

  optimizeDeps: {
    // Server-only dependency (uses top-level await) that the dev dependency
    // scanner picks up from `*.server.ts` modules.
    exclude: ['i18next-fs-backend'],
  },

  ssr: {
    // Packages whose CommonJS entry points don't interoperate with Node's ESM
    // loader (missing named exports, `{ default }`-wrapped components).
    // Bundling them lets Vite use their ESM builds instead.
    noExternal: ['@apollo/client', /^@mui\//],
  },
})
