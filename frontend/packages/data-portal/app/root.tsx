import { withEmotionCache } from '@emotion/react'
// eslint-disable-next-line cryoet-data-portal/no-root-mui-import
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'
import { cssBundleHref } from '@remix-run/css-bundle'
import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { defaults } from 'lodash-es'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useChangeLanguage } from 'remix-i18next'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { Layout } from './components/Layout'
import { LiveReload, LiveReloadOverlay } from './components/LiveReload'
import { ClientStyleContext } from './context/ClientStyle.context'
import {
  ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
  EnvironmentContext,
} from './context/Environment.context'
import { PLAUSIBLE_ENV_URL_MAP } from './hooks/usePlausible'
import { i18next } from './i18next.server'
import { useCloseDrawerOnUnmount } from './state/drawer'
import tailwindStyles from './tailwind.css'
import { theme } from './theme'

interface DocumentProps {
  children: React.ReactNode
  title?: string
}

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request)

  return typedjson({
    locale,
    ENV: defaults(
      {
        API_URL: process.env.API_URL,
        ENV: process.env.ENV,
        LOCALHOST_PLAUSIBLE_TRACKING: process.env.LOCALHOST_PLAUSIBLE_TRACKING,
      },
      ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
    ),
  })
}

export function shouldRevalidate() {
  // Data returned from the root is pretty static, so we can disable
  // revalidation forever to disable re-fetching root data.
  return false
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext)
    const { ENV, locale } = useTypedLoaderData<typeof loader>()

    // This hook will change the i18n instance language to the current locale
    // detected by the loader, this way, when we do something to change the
    // language, this locale will change and i18next will load the correct
    // translation files
    useChangeLanguage(locale)

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

    const { i18n } = useTranslation()

    return (
      <html lang={locale} dir={i18n?.dir?.()}>
        <head>
          {title ? <title>{title}</title> : null}

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <Meta />

          <Links />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />

          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
            rel="stylesheet"
          />

          <link href="/fonts/ANDALEMO.ttf" rel="stylesheet" />

          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />

          <script
            defer
            data-domain={PLAUSIBLE_ENV_URL_MAP[ENV.ENV]}
            src="/plausible.js"
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
  {
    rel: 'icon',
    href: '/favicon.png',
    type: 'image/png',
  },
  { rel: 'stylesheet', href: tailwindStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export const handle = {
  i18n: 'translation',
}

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  useCloseDrawerOnUnmount()

  return (
    <Document>
      <Outlet />
    </Document>
  )
}
