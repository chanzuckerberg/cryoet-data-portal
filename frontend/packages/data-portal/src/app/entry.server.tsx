import { defaultTheme } from '@czi-sds/components'
import {
  CacheProvider,
  ThemeProvider as EmotionThemeProvider,
} from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'

import { createEmotionCache } from 'src/utils/createEmotionCache'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  function MuiRemixServer() {
    return (
      <CacheProvider value={cache}>
        <StyledEngineProvider>
          <ThemeProvider theme={defaultTheme}>
            <EmotionThemeProvider theme={defaultTheme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <RemixServer context={remixContext} url={request.url} />
            </EmotionThemeProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
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
