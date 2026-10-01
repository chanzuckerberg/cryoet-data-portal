import { PassThrough } from 'node:stream'

import {
  CacheProvider,
  ThemeProvider as EmotionThemeProvider,
} from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createInstance } from 'i18next'
import Backend from 'i18next-fs-backend'
import { renderToPipeableStream } from 'react-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type { EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'

import { createEmotionCache } from 'app/utils/createEmotionCache'

import { i18n } from './i18next'
import { i18next, LOCALES_PATH } from './i18next.server'
import { theme } from './theme'

// Reject/cancel resolved single-fetch promises after this many milliseconds.
export const streamTimeout = 5_000

/**
 * Renders the app to a complete HTML string. Unlike `renderToString`, this
 * waits for suspended components, which single fetch relies on to inline
 * loader data into the document.
 */
function renderToStringAsync(element: React.ReactElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(element, {
      onAllReady() {
        let html = ''
        const body = new PassThrough()
        body.on('data', (chunk: Buffer) => {
          html += chunk.toString()
        })
        body.on('end', () => resolve(html))
        body.on('error', reject)
        pipe(body)
      },
      onShellError: reject,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error)
      },
    })

    // Give single fetch a chance to reject pending promises before aborting.
    setTimeout(abort, streamTimeout + 1_000)
  })
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  const instance = createInstance()
  const lng = await i18next.getLocale(request)
  const ns = i18next.getRouteNamespaces(remixContext)

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18n,
      lng,
      ns,
      backend: { loadPath: LOCALES_PATH },
    })

  function MuiRemixServer() {
    const client = new QueryClient()

    return (
      <QueryClientProvider client={client}>
        <I18nextProvider i18n={instance}>
          <CacheProvider value={cache}>
            <StyledEngineProvider>
              <ThemeProvider theme={theme}>
                <EmotionThemeProvider theme={theme}>
                  {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                  <CssBaseline />
                  <ServerRouter context={remixContext} url={request.url} />
                </EmotionThemeProvider>
              </ThemeProvider>
            </StyledEngineProvider>
          </CacheProvider>
        </I18nextProvider>
      </QueryClientProvider>
    )
  }

  // Render the component to a string.
  const html = await renderToStringAsync(<MuiRemixServer />)

  // Grab the CSS from emotion
  const { styles } = extractCriticalToChunks(html)

  let stylesHTML = ''

  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`
    stylesHTML = `${stylesHTML}${newStyleTag}`
  })

  // Add the Emotion style tags after the insertion point meta tag
  const markup = html.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`,
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
