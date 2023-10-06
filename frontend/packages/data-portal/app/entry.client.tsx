import {
  CacheProvider,
  ThemeProvider as EmotionThemeProvider,
} from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { RemixBrowser } from '@remix-run/react'
import { startTransition, useMemo, useState } from 'react'
import { hydrateRoot } from 'react-dom/client'

import {
  ClientStyleContext,
  ClientStyleContextValue,
} from './context/ClientStyle.context'
import { theme } from './theme'
import { createEmotionCache } from './utils/createEmotionCache'

interface ClientCacheProviderProps {
  children: React.ReactNode
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache())

  const clientStyleContextValue = useMemo<ClientStyleContextValue>(
    () => ({
      reset() {
        setCache(createEmotionCache())
      },
    }),
    [],
  )

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <ClientCacheProvider>
        <StyledEngineProvider>
          <ThemeProvider theme={theme}>
            <EmotionThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <RemixBrowser />
            </EmotionThemeProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ClientCacheProvider>,
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1)
}
