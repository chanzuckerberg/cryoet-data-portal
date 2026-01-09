# Application Entry Points

This document covers the application bootstrap process and the three key entry point files that initialize the CryoET Data Portal frontend.

## Quick Reference

| File | Purpose | Runs On |
|------|---------|---------|
| [`root.tsx`](../../../packages/data-portal/app/root.tsx) | Root React component, document structure, providers | Server + Client |
| [`entry.server.tsx`](../../../packages/data-portal/app/entry.server.tsx) | Server-side rendering entry | Server only |
| [`entry.client.tsx`](../../../packages/data-portal/app/entry.client.tsx) | Client-side hydration entry | Client only |

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
export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request)
  return typedjson({
    locale,
    ENV: {
      API_URL: process.env.API_URL,
      API_URL_V2: process.env.API_URL_V2,
      ENV: process.env.ENV,
      // ...additional env vars
    },
  })
}
```

### Revalidation

The `shouldRevalidate` function returns `false` because root data is static:

```tsx
export function shouldRevalidate() {
  return false
}
```

This prevents unnecessary re-fetching of environment variables on navigation.

### Provider Structure

```tsx
<EnvironmentContext.Provider value={data.ENV}>
  <CacheProvider value={emotionCache}>
    <ThemeProvider theme={theme}>
      <Outlet />
    </ThemeProvider>
  </CacheProvider>
</EnvironmentContext.Provider>
```

---

## entry.server.tsx

Server-side rendering entry point that handles initial HTML generation.

**Location:** [`app/entry.server.tsx`](../../../packages/data-portal/app/entry.server.tsx)

### Responsibilities

1. **CSS Extraction** - Extracts critical CSS from Emotion cache for SSR
2. **i18n Initialization** - Initializes i18next with server-side locale detection
3. **Provider Setup** - Sets up QueryClient and theme providers for SSR
4. **HTML Rendering** - Renders React to a string for the response

### SSR Flow

```
Request arrives
    ↓
Remix calls handleRequest()
    ↓
Initialize i18next with detected locale
    ↓
Create Emotion cache for CSS extraction
    ↓
Render React tree to string
    ↓
Extract and inject critical CSS
    ↓
Return HTML response
```

### Key Patterns

**Emotion CSS Extraction:**
```tsx
const emotionCache = createEmotionCache()
const { extractCriticalToChunks } = createEmotionServer(emotionCache)

// After rendering, extract CSS
const chunks = extractCriticalToChunks(html)
const styles = constructStyleTagsFromChunks(chunks)
```

**i18n Server Setup:**
```tsx
const instance = createInstance()
await instance.use(initReactI18next).init({
  ...i18n,
  lng: locale,
  ns: ['translation'],
  backend: { loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json') },
})
```

---

## entry.client.tsx

Client-side hydration entry point that takes over after the browser loads.

**Location:** [`app/entry.client.tsx`](../../../packages/data-portal/app/entry.client.tsx)

### Responsibilities

1. **React Hydration** - Hydrates server-rendered HTML with React
2. **i18n Client Setup** - Initializes i18next with client-side language detection
3. **Emotion Cache** - Sets up Emotion cache on the client for CSS-in-JS

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
hydrateRoot() attaches React to DOM
    ↓
App becomes interactive
```

### Key Patterns

**Client Hydration:**
```tsx
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>
    </StrictMode>,
  )
})
```

**i18n Client Detection:**
```tsx
await i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    ...i18n,
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    detection: { order: ['htmlTag'], caches: [] },
  })
```

---

## Bootstrap Sequence

Understanding how these files work together:

```
1. Request arrives at server
   ↓
2. entry.server.tsx handles request
   - Initializes i18n
   - Creates Emotion cache
   ↓
3. root.tsx loader runs
   - Detects locale
   - Exposes ENV variables
   ↓
4. React tree renders server-side
   - root.tsx renders document structure
   - Route loaders fetch data
   - Components render with data
   ↓
5. HTML sent to browser
   ↓
6. entry.client.tsx runs
   - Initializes client i18n
   - Creates client Emotion cache
   ↓
7. hydrateRoot() attaches React
   - DOM becomes interactive
   - Event handlers attached
```

---

## Environment Context

Environment variables flow from server to client through the root loader:

```tsx
// In root.tsx loader
return typedjson({
  ENV: {
    API_URL_V2: process.env.API_URL_V2,
    ENV: process.env.ENV,
    // ...
  },
})

// In any component
const { API_URL_V2, ENV } = useContext(EnvironmentContext)
```

This pattern ensures:
- Server has access to `process.env` directly
- Client receives env vars serialized in the HTML
- No sensitive variables are exposed (only explicitly listed ones)

---

## Next Steps

- [Remix Fundamentals](../01-routing/01-remix-fundamentals.md) - Server-side rendering and routing patterns
- [Component Architecture](../04-components/01-component-architecture.md) - Component organization and structure
