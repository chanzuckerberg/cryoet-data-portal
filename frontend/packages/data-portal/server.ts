/* eslint-disable @typescript-eslint/no-floating-promises */

import 'dotenv/config'

import { createRequestHandler } from '@remix-run/express'
import { installGlobals, ServerBuild } from '@remix-run/node'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import sourceMapSupport from 'source-map-support'

import { ServerContext } from 'app/types/context'

// patch in Remix runtime globals
installGlobals()
sourceMapSupport.install()

const BUILD_PATH = './build/server/index.js'

async function main() {
  const viteDevServer =
    process.env.NODE_ENV === 'production'
      ? undefined
      : await import('vite').then((vite) =>
          vite.createServer({ server: { middlewareMode: true } }),
        )

  const app = express()

  app.use(compression())

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by')

  if (viteDevServer) {
    app.use(viteDevServer.middlewares)
  } else {
    // Vite fingerprints its assets so we can cache forever.
    app.use(
      '/assets',
      express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
    )

    // Everything else (like favicon.ico) is cached for an hour. You may want to be
    // more aggressive with this caching.
    app.use(express.static('build/client', { maxAge: '1h' }))
  }

  app.use(
    '/neuroglancer',
    express.static(path.join('..', 'neuroglancer', 'dist')),
  )

  app.use(morgan('tiny'))

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.all(
    '*',
    createRequestHandler({
      build: viteDevServer
        ? () =>
            viteDevServer.ssrLoadModule(
              'virtual:remix/server-build',
            ) as Promise<ServerBuild>
        : ((await import(BUILD_PATH)) as ServerBuild),
      mode: process.env.NODE_ENV,
      getLoadContext: (req) => ({ clientIp: req.ip }) as ServerContext,
    }),
  )

  const port = process.env.PORT || 8080
  app.listen(port, () => {
    console.log(`Started CryoET Data Portal server at http://localhost:${port}`)
  })
}

main()
