import { defaultTheme } from '@czi-sds/components'
import { withEmotionCache } from '@emotion/react'
// eslint-disable-next-line cryoet-data-portal/no-root-mui-import
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'
import { cssBundleHref } from '@remix-run/css-bundle'
import { json, LinksFunction } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { defaults } from 'lodash-es'
import { useContext } from 'react'

import { Layout } from './components/Layout'
import { LiveReload, LiveReloadOverlay } from './components/LiveReload'
import { ClientStyleContext } from './context/ClientStyle.context'
import {
  ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
  EnvironmentContext,
} from './context/Environment.context'
import tailwindStyles from './tailwind.css'

interface DocumentProps {
  children: React.ReactNode
  title?: string
}

export function loader() {
  return json({
    ENV: defaults(
      {
        API_URL: process.env.API_URL,
        ENV: process.env.ENV,
      },
      ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
    ),
  })
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext)
    const { ENV } = useLoaderData<typeof loader>()

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      // eslint-disable-next-line no-param-reassign
      emotionCache.sheet.container = document.head

      // re-inject tags
      const { tags } = emotionCache.sheet
      emotionCache.sheet.flush()

      tags.forEach((tag) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        const sheet = emotionCache.sheet as any

        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        sheet._insertTag(tag)
      })

      // reset cache to reapply global styles
      clientStyleData.reset()
    }, [])

    return (
      <html lang="en">
        <head>
          {title ? <title>{title}</title> : null}

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta
            name="theme-color"
            content={defaultTheme.palette.primary.main}
          />
          <Meta />

          <Links />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />

          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
            rel="stylesheet"
          />

          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body className="h-screen w-screen flex flex-col flex-auto">
          <EnvironmentContext.Provider value={ENV}>
            <Layout>{children}</Layout>
          </EnvironmentContext.Provider>

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <LiveReloadOverlay />
        </body>
      </html>
    )
  },
)

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}
