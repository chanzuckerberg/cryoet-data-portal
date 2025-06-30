import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.

  return {
    plugins: [react()],
    server: {
      port: 9000,
    },
    base: '',
    resolve: {
      // Include only specific data sources.
      conditions: [
        // "neuroglancer/datasource:none_by_default",
        // "neuroglancer/datasource/precomputed:enabled",
      ],
    },
    esbuild: {
      // Needed to acommodate decorator usage in Neuroglancer TypeScript sources.
      target: 'es2022',
    },
    worker: {
      // Required due to use of dynamic imports in Neuroglancer.
      format: 'es',
    },
    build: {
      // Avoid spurious warnings due to large chunks from Neuroglancer.
      chunkSizeWarningLimit: 2 * 1024 * 1024,
      rollupOptions: {
        input: {
          neuroglancer: path.resolve(__dirname, 'index.html'),
        },
      },
    },
    optimizeDeps: {
      entries: [
        'index.html',
        // In order for Vite to properly find all of Neuroglancer's transitive
        // dependencies, instruct Vite to search for dependencies starting from
        // all of the bundle entry points.
        //
        // These have to be specified explicitly because vite does not allow globs
        // within `node_modules`.
        'node_modules/neuroglancer/lib/main.bundle.js',
        'node_modules/neuroglancer/lib/async_computation.bundle.js',
        'node_modules/neuroglancer/lib/chunk_worker.bundle.js',
      ],
      // Neuroglancer is incompatible with Vite's optimizeDeps step used for the
      // dev server due to its use of `new URL` syntax (not supported by esbuild).
      exclude: ['neuroglancer'],
    },
  }
})
