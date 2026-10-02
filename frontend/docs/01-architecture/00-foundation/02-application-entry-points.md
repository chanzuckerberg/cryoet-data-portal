# Application Entry Points

This document covers the application bootstrap process and the three key entry point files that initialize the CryoET Data Portal frontend. The app uses React Router v7 in framework mode (formerly Remix), built with Vite. React Router picks up `app/root.tsx`, `app/entry.server.tsx` and `app/entry.client.tsx` by convention; the Express server in [`server.ts`](../../../packages/data-portal/server.ts) hands requests to React Router.

## Quick Reference

| File | Purpose | Runs On |
|------|---------|---------|
| [`root.tsx`](../../../packages/data-portal/app/root.tsx) | Root React component, document structure, providers | Server + Client |
| [`entry.server.tsx`](../../../packages/data-portal/app/entry.server.tsx) | Server-side rendering entry | Server only |
| [`entry.client.tsx`](../../../packages/data-portal/app/entry.client.tsx) | Client-side hydration entry | Client only |
| [`server.ts`](../../../packages/data-portal/server.ts) | Express server, Vite dev middleware / production build | Server only |

---

## root.tsx

The root component wraps the entire application and establishes the document structure.

**Location:** [`app/root.tsx`](../../../packages/data-portal/app/root.tsx)

### Responsibilities

1. **HTML Document Structure** - Sets up `<html>`, `<head>`, and `<body>` elements
2. **Environment Variables** - Exposes server environment variables to the client via loader
3. **i18n Language Detection** - Detects and sets the user's locale
4. **Emotion CSS Cache** - Configures CSS-in-JS for styled components (MUI)

### Loader Pattern

The loader function runs server-side on every request to expose environment variables:

```tsx
import { LoaderFunctionArgs } from 'react-router'

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request)

  return {
    locale,
    ENV: defaults(
      {
        API_URL: process.env.API_URL,
        API_URL_V2: process.env.API_URL_V2,
        ENV: process.env.ENV,
        LOCALHOST_PLAUSIBLE_TRACKING: process.env.LOCALHOST_PLAUSIBLE_TRACKING,
      },
      ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
    ),
  }
}
```

The loader returns a plain object (single fetch serializes it), and the `Document` component reads it with `useLoaderData<typeof loader>()`.

### Revalidation

The `shouldRevalidate` function returns `false` because root data is static:

```tsx
export function shouldRevalidate() {
  return false
}
```

This prevents unnecessary re-fetching of environment variables on navigation.

### Document Structure

`root.tsx` renders the document using components from `react-router`. The Emotion cache, MUI theme and QueryClient providers are set up in the entry files (see below); `root.tsx` uses `withEmotionCache` to re-inject styles on the client.

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router'

<html lang={locale} dir={i18n?.dir?.()}>
  <head>
    <Meta />
    <Links />
    <meta name="emotion-insertion-point" content="emotion-insertion-point" />
  </head>
  <body>
    <EnvironmentContext.Provider value={ENV}>
      <Layout>{children /* <Outlet /> */}</Layout>
    </EnvironmentContext.Provider>
    <ScrollRestoration />
    <Scripts />
  </body>
</html>
```

---

## entry.server.tsx

Server-side rendering entry point that handles initial HTML generation.

**Location:** [`app/entry.server.tsx`](../../../packages/data-portal/app/entry.server.tsx)

### Responsibilities

1. **CSS Extraction** - Extracts critical CSS from Emotion cache for SSR
2. **i18n Initialization** - Initializes i18next with server-side locale detection
3. **Provider Setup** - Sets up QueryClient and theme providers for SSR
4. **HTML Rendering** - Renders `<ServerRouter />` with `renderToPipeableStream`, waits for `onAllReady`, and collects the full HTML for the response
5. **Stream Timeout** - Exports `streamTimeout` (5 seconds), after which pending single-fetch promises are rejected

### SSR Flow

```
Request arrives
    ↓
React Router runs route loaders, then calls handleRequest()
    ↓
Initialize i18next with detected locale
    ↓
Create Emotion cache for CSS extraction
    ↓
renderToPipeableStream(<ServerRouter />), wait for onAllReady, collect HTML
    ↓
Extract critical CSS and inject it after the emotion-insertion-point meta tag
    ↓
Return HTML response
```

### Key Patterns

**Rendering:**
```tsx
import { renderToPipeableStream } from 'react-dom/server'
import type { EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'

export const streamTimeout = 5_000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  // ...providers wrap <ServerRouter context={remixContext} url={request.url} />

  // Resolves once `onAllReady` fires, so suspended single-fetch data is inlined
  const html = await renderToStringAsync(<MuiRemixServer />)
  // ...
}
```

**Emotion CSS Extraction:**
```tsx
const cache = createEmotionCache()
const { extractCriticalToChunks } = createEmotionServer(cache)

// After rendering, extract CSS and build <style data-emotion> tags
const { styles } = extractCriticalToChunks(html)
// ...then insert them after <meta name="emotion-insertion-point" ... />
```

**i18n Server Setup:**
```tsx
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
```

`i18next` here is the `RemixI18Next` instance from [`app/i18next.server.ts`](../../../packages/data-portal/app/i18next.server.ts) (package `remix-i18next/server`).

---

## entry.client.tsx

Client-side hydration entry point that takes over after the browser loads.

**Location:** [`app/entry.client.tsx`](../../../packages/data-portal/app/entry.client.tsx)

### Responsibilities

1. **React Hydration** - Hydrates server-rendered HTML with `<HydratedRouter />`
2. **i18n Client Setup** - Initializes i18next with client-side language detection
3. **Emotion Cache** - Sets up Emotion cache on the client for CSS-in-JS
4. **Provider Setup** - Wraps the app in QueryClient, Emotion cache and MUI theme providers

### Hydration Flow

```
Browser receives HTML
    ↓
JavaScript bundle loads
    ↓
Initialize i18next with client detection
    ↓
Create client-side Emotion cache
    ↓
hydrateRoot(document, <HydratedRouter />) attaches React to DOM
    ↓
App becomes interactive
```

### Key Patterns

**Client Hydration:**
```tsx
import { HydratedRouter } from 'react-router/dom'

startTransition(() => {
  hydrateRoot(
    document,
    <QueryClientProvider client={client}>
      <ClientCacheProvider>
        <StyledEngineProvider>
          <ThemeProvider theme={theme}>
            <EmotionThemeProvider theme={theme}>
              <CssBaseline />
              <HydratedRouter />
            </EmotionThemeProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ClientCacheProvider>
    </QueryClientProvider>,
  )
})
```

Hydration is scheduled with `requestIdleCallback` (falling back to `setTimeout` in Safari).

**i18n Client Detection:**
```tsx
await i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    ...i18n,
    ns: getInitialNamespaces(), // from 'remix-i18next/client'
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    detection: { order: ['htmlTag'], caches: [] },
  })
```

---

## server.ts

Express server that hosts the React Router app.

**Location:** [`server.ts`](../../../packages/data-portal/server.ts) (run with `node --loader ts-node/esm server.ts`)

### Responsibilities

1. **Development** - Creates a Vite dev server in middleware mode and loads the server build with `ssrLoadModule('virtual:react-router/server-build')`, giving HMR via Vite
2. **Production** - Serves `build/client/assets` (immutable, cached for 1 year) and `build/client`, and imports the server build from `./build/server/index.js`
3. **Extras** - Serves `/neuroglancer` from `../neuroglancer/dist`, a `/healthz` endpoint, compression and request logging
4. **Load Context** - Passes `{ clientIp }` to loaders/actions via `getLoadContext`

```ts
import { createRequestHandler } from '@react-router/express'

app.all(
  '*',
  createRequestHandler({
    build: viteDevServer
      ? () =>
          viteDevServer.ssrLoadModule(
            'virtual:react-router/server-build',
          ) as Promise<ServerBuild>
      : ((await import(BUILD_PATH)) as ServerBuild),
    mode: process.env.NODE_ENV,
    getLoadContext: (req) => ({ clientIp: req.ip }) as ServerContext,
  }),
)
```

---

## Bootstrap Sequence

Understanding how these files work together:

```
1. Request arrives at the Express server (server.ts)
   - createRequestHandler() from @react-router/express
   ↓
2. Loaders run
   - root.tsx loader detects locale and exposes ENV variables
   - Route loaders fetch data
   ↓
3. entry.server.tsx handleRequest() runs
   - Initializes i18n
   - Creates Emotion cache
   ↓
4. React tree renders server-side
   - root.tsx renders document structure
   - Components render with loader data
   ↓
5. HTML sent to browser
   ↓
6. entry.client.tsx runs
   - Initializes client i18n
   - Creates client Emotion cache
   ↓
7. hydrateRoot() attaches <HydratedRouter />
   - DOM becomes interactive
   - Event handlers attached
```

---

## Environment Context

Environment variables flow from server to client through the root loader:

```tsx
// In root.tsx loader
return {
  locale,
  ENV: defaults(
    {
      API_URL_V2: process.env.API_URL_V2,
      ENV: process.env.ENV,
      // ...
    },
    ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
  ),
}

// In any component
const { API_URL_V2, ENV } = useContext(EnvironmentContext)
```

This pattern ensures:
- Server has access to `process.env` directly
- Client receives env vars serialized in the HTML
- No sensitive variables are exposed (only explicitly listed ones)

---

## Next Steps

- [React Router Fundamentals](../01-routing/01-react-router-fundamentals.md) - Server-side rendering and routing patterns
- [Component Architecture](../04-components/01-component-architecture.md) - Component organization and structure
