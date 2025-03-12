/* eslint-disable @typescript-eslint/no-floating-promises */

import { createRequestHandler } from '@remix-run/express'
import { broadcastDevReady, installGlobals, ServerBuild } from '@remix-run/node'
import compression from 'compression'
import express, { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import sourceMapSupport from 'source-map-support'

import { ServerContext } from 'app/types/context'

// patch in Remix runtime globals
installGlobals()
sourceMapSupport.install()

const BUILD_PATH = './build/index.js'
const WATCH_PATH = './build/version.txt'

let build: ServerBuild

async function reimportServer() {
  const stat = fs.statSync(BUILD_PATH)

  // use a timestamp query parameter to bust the import cache
  return import(`${BUILD_PATH}?t=${stat.mtimeMs}`) as Promise<ServerBuild>
}

// Create a request handler that watches for changes to the server build during development.
async function getRequestHandler() {
  async function handleServerUpdate() {
    // 1. re-import the server build
    build = await reimportServer()

    // Add debugger to assist in v2 dev debugging
    if (build?.assets === undefined) {
      console.log(build.assets)
      // eslint-disable-next-line no-debugger
      debugger
    }

    // 2. tell dev server that this app server is now up-to-date and ready
    broadcastDevReady(build)
  }

  if (process.env.NODE_ENV === 'development') {
    // We'll make chokidar a dev dependency so it doesn't get bundled in production.
    const chokidar =
      process.env.NODE_ENV === 'development' ? await import('chokidar') : null

    chokidar
      ?.watch(WATCH_PATH, { ignoreInitial: true })
      .on('add', handleServerUpdate)
      .on('change', handleServerUpdate)
  }

  // wrap request handler to make sure its recreated with the latest build for every request
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({ clientIp: req.ip }) as ServerContext,
      })(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

async function main() {
  build = (await import(BUILD_PATH)) as ServerBuild
  const app = express()

  app.use(compression())

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by')

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' }),
  )

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static('public', { maxAge: '1h' }))
  app.use(
    '/neuroglancer',
    express.static(path.join('..', 'neuroglancer', 'dist')),
  )

  app.use(morgan('tiny'))

  // Check if the server is running in development mode and use the devBuild to reflect realtime changes in the codebase.
  app.all('*', await getRequestHandler())

  const port = process.env.PORT || 8080
  app.listen(port, () => {
    console.log(
      `Started CryoET Data Portal dev server at http://localhost:${port}`,
    )

    // send "ready" message to dev server
    if (process.env.NODE_ENV === 'development') {
      broadcastDevReady(build)
    }
  })
}

main()
