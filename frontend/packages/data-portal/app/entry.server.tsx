import {
  CacheProvider,
  ThemeProvider as EmotionThemeProvider,
} from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { createInstance } from 'i18next'
import Backend from 'i18next-fs-backend'
import { renderToString } from 'react-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'

import { createEmotionCache } from 'app/utils/createEmotionCache'

import { i18n } from './i18next'
import { i18next, LOCALES_PATH } from './i18next.server'
import { theme } from './theme'

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
                  <RemixServer context={remixContext} url={request.url} />
                </EmotionThemeProvider>
              </ThemeProvider>
            </StyledEngineProvider>
          </CacheProvider>
        </I18nextProvider>
      </QueryClientProvider>
    )
  }

  // Render the component to a string.
  const html = renderToString(<MuiRemixServer />)

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
