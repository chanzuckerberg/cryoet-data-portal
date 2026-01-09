# Remix Patterns

This document covers the Remix-specific patterns and conventions used in the CryoET Data Portal frontend, including route organization, data loading, navigation, and server-side rendering.


## Quick Reference

| Pattern | Location | Purpose |
|---------|----------|---------|
| Route files | `app/routes/` | Page components and data loaders |
| Layout routes | `browse-data.tsx` | Shared UI with `<Outlet />` |
| Dynamic routes | `datasets.$id.tsx` | Parameter-based pages |
| API routes | `api.*.ts` | Server-side endpoints |
| Loader hooks | `app/hooks/use*.ts` | Abstract loader data access |
| Revalidation | `app/utils/revalidate.ts` | Control data refetching |

---

## Route Structure and Organization

Routes are located in [`app/routes/`](../../../packages/data-portal/app/routes/) and follow Remix's file-based routing conventions.

### Naming Conventions

| Pattern | Example | URL Path |
|---------|---------|----------|
| Index route | `_index.tsx` | `/` |
| Static route | `competition.tsx` | `/competition` |
| Nested route | `browse-data.datasets.tsx` | `/browse-data/datasets` |
| Dynamic route | `datasets.$id.tsx` | `/datasets/:id` |
| Layout route | `browse-data.tsx` | Parent for nested routes |
| API route | `api.deposition-runs.ts` | `/api/deposition-runs` |
| Special characters | `plausible[.js].ts` | `/plausible.js` |

### Route Files Overview

```
app/routes/
├── _index.tsx                    # Landing page (/)
├── browse-data.tsx               # Layout route with header + Outlet
├── browse-data.datasets.tsx      # /browse-data/datasets
├── browse-data.depositions.tsx   # /browse-data/depositions
├── datasets.$id.tsx              # /datasets/:id (dynamic)
├── depositions.$id.tsx           # /depositions/:id (dynamic)
├── runs.$id.tsx                  # /runs/:id (dynamic)
├── view.runs.$id.tsx             # /view/runs/:id (3D viewer)
├── competition.tsx               # /competition
├── api.deposition-runs.ts        # /api/deposition-runs
├── api.logs.ts                   # /api/logs
├── api.event.ts                  # /api/event
└── ...
```

---

## Data Loading Patterns

All data fetching happens server-side via `loader` functions. The codebase uses **loaders only** (no actions/forms) since the portal is read-only.

### Basic Loader Pattern

```typescript
// app/routes/_index.tsx
import { json } from '@remix-run/server-runtime'
import { apolloClientV2 } from 'app/apollo.server'

const LANDING_PAGE_DATA_QUERY = gql(`
  query LandingPageData {
    datasetsAggregate {
      aggregate { count }
    }
  }
`)

export async function loader() {
  const { data } = await apolloClientV2.query({
    query: LANDING_PAGE_DATA_QUERY,
  })

  return json(data)
}
```

### Loader with Request Parameters

For routes that need URL parameters or search params:

```typescript
// app/routes/datasets.$id.tsx
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN
  const url = new URL(request.url)
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')

  // Validate parameters
  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const { data: responseV2 } = await getDatasetByIdV2({
    id,
    page,
    client: apolloClientV2,
    params: url.searchParams,
  })

  // Handle not found
  if (responseV2.datasets.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Dataset with ID ${id} not found`,
    })
  }

  return json({ v2: responseV2 })
}
```

### Accessing Loader Data

The codebase uses `remix-typedjson` for type-safe loader data access:

```typescript
// Direct usage in route component
import { useTypedLoaderData } from 'remix-typedjson'

export default function DatasetByIdPage() {
  const { v2 } = useTypedLoaderData<{ v2: GetDatasetByIdV2Query }>()
  // ...
}
```

### Custom Hooks for Loader Data

Complex routes abstract loader data into custom hooks for cleaner components:

```typescript
// app/hooks/useDatasetById.ts
import { useTypedLoaderData } from 'remix-typedjson'
import { GetDatasetByIdV2Query } from 'app/__generated_v2__/graphql'

export function useDatasetById() {
  const { v2 } = useTypedLoaderData<{
    v2: GetDatasetByIdV2Query
  }>()

  const dataset = v2.datasets[0]
  const deposition = v2.depositions[0]
  const { runs, unFilteredRuns } = v2

  // Derive additional data...
  const objectNames = Array.from(
    new Set(
      v2.annotationsAggregate.aggregate
        ?.map((aggregate) => aggregate.groupBy?.objectName)
        .filter(isDefined) ?? []
    ),
  )

  return {
    runs,
    unFilteredRuns,
    dataset,
    deposition,
    objectNames,
    // ...
  }
}
```

Usage in component:

```typescript
// app/routes/datasets.$id.tsx
export default function DatasetByIdPage() {
  const { dataset, deposition, unFilteredRuns } = useDatasetById()
  // Component has clean access to derived data
}
```

### GraphQL Server Utilities

Data fetching logic is extracted to server utilities in `app/graphql/*.server.ts`:

```typescript
// app/graphql/getDatasetByIdV2.server.ts
export async function getDatasetByIdV2({
  id,
  page,
  client,
  params,
  depositionId,
}: GetDatasetByIdParams) {
  return client.query({
    query: GET_DATASET_BY_ID_V2_QUERY,
    variables: {
      id,
      runLimit: MAX_PER_PAGE,
      runOffset: (page - 1) * MAX_PER_PAGE,
      // Build filter variables from params...
    },
  })
}
```

---

## Route Component Structure

A typical route file follows this structure:

```typescript
// 1. Imports
import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

// 2. GraphQL query (if inline)
const MY_QUERY = gql(`...`)

// 3. Loader function
export async function loader({ params, request }: LoaderFunctionArgs) {
  // Fetch data server-side
}

// 4. Meta function (optional)
export const meta: MetaFunction = () => [
  { title: 'Page Title | CryoET Data Portal' },
]

// 5. Revalidation function (optional)
export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({ ...args, paramsToRefetch: [...] })
}

// 6. Default export - the page component
export default function MyPage() {
  // Use hooks to access loader data
  // Return JSX
}
```

---

## Meta Functions

Meta functions define page metadata for SEO and social sharing:

```typescript
// app/routes/competition.tsx
export const meta: MetaFunction = () => {
  return [
    { title: 'ML Competition | CryoET Data Portal' },
    { property: 'og:title', content: 'CryoET Data Portal - ML Competition' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://cryoetdataportal.czscience.com/images/index-header.png' },
    { property: 'og:url', content: 'https://cryoetdataportal.czscience.com/competition' },
    { property: 'og:description', content: 'Learn about the winners...' },
    { property: 'description', content: 'Learn about the winners...' },
    { property: 'twitter:card', content: 'summary_large_image' },
  ]
}
```

---

## Layout Routes

Layout routes render shared UI and use `<Outlet />` for child content.

### Layout Route Pattern

```typescript
// app/routes/browse-data.tsx
import { Outlet } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

export async function loader({ request }: LoaderFunctionArgs) {
  // Fetch data shared across all child routes
  const { data } = await apolloClientV2.query({
    query: GET_TOOLBAR_DATA_QUERY,
  })

  return json(data)
}

export function shouldRevalidate() {
  // Data is static so we don't have to refetch every time
  return false
}

export default function BrowseDataPage() {
  return (
    <div className="flex flex-col flex-auto">
      <BrowseDataHeader />  {/* Shared header */}
      <Outlet />            {/* Child routes render here */}
    </div>
  )
}
```

### Nested Route Structure

```
browse-data.tsx           → Layout with header
├── browse-data.datasets.tsx    → /browse-data/datasets
└── browse-data.depositions.tsx → /browse-data/depositions
```

Both child routes render inside the `<Outlet />` and share the `BrowseDataHeader`.

---

## Navigation and URL State

URL search parameters are the **primary source of truth** for filter state, making filters shareable and bookmarkable.

### useQueryParam Hook

The [`useQueryParam`](../../../packages/data-portal/app/hooks/useQueryParam.ts) hook provides a React state-like API for managing individual URL search parameters. It wraps Remix's `useSearchParams` and returns a tuple similar to `useState`.

**Features:**
- Returns `[value, setValue]` tuple for reading and writing a single query parameter
- Supports custom `serialize` and `deserialize` functions for type conversion
- Supports `defaultValue` when the parameter is not present in the URL
- Optional `preventScrollReset` to maintain scroll position on updates
- The setter accepts either a value or a callback function `(prev) => next`

### Usage Examples

```typescript
// Reading a query param
const [page] = useQueryParam<string>(QueryParams.Page)
const [depositionId] = useQueryParam<string>(QueryParams.DepositionId)

// Writing a query param
const [, setPage] = useQueryParam<string>(QueryParams.Page)
setPage('2')

// Removing a query param
setPage(null)
```

### Direct useSearchParams Usage

For bulk parameter updates:

```typescript
import { useSearchParams } from '@remix-run/react'

const [, setSearchParams] = useSearchParams()

const handleRemoveFilter = () => {
  const nextParams = new URLSearchParams(previousParams)
  nextParams.delete(QueryParams.DepositionId)
  nextParams.delete(QueryParams.From)
  nextParams.sort()
  setSearchParams(nextParams)
}
```

### QueryParams Enum

All query parameter names are centralized in [`app/constants/query.ts`](../../../packages/data-portal/app/constants/query.ts):

```typescript
export enum QueryParams {
  Page = 'page',
  Search = 'search',
  DepositionId = 'deposition_id',
  ObjectName = 'object_name',
  // ...
}
```

---

## Revalidation Patterns

Remix automatically revalidates loaders after navigation. The `shouldRevalidate` function controls this behavior to avoid unnecessary refetches.

### Static Data - Never Revalidate

```typescript
// app/routes/browse-data.tsx
export function shouldRevalidate() {
  // Data is static so we don't have to refetch every time
  return false
}
```

### Conditional Revalidation

The [`shouldRevalidatePage`](../../../packages/data-portal/app/utils/revalidate.ts) utility determines whether a route's loader should refetch data based on URL parameter changes.

**How it works:**
- Accepts Remix's `ShouldRevalidateFunctionArgs` plus an optional `paramsToRefetch` array
- Compares current and next URL search params against a list of parameters to watch
- Returns `false` (skip refetch) if:
  - The request method is GET
  - The route `id` parameter hasn't changed
  - None of the watched parameters have changed
- Otherwise, returns `defaultShouldRevalidate` to let Remix decide

This prevents unnecessary data fetching when users navigate or interact with UI elements that don't affect the data being displayed.

### Usage in Routes

```typescript
// app/routes/datasets.$id.tsx
export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [
      QueryParams.ObjectName,
      QueryParams.ObjectId,
      QueryParams.ObjectShapeType,
      QueryParams.MethodType,
      QueryParams.AnnotationsPage,
      QueryParams.DepositionId,
      // ... other filter params
    ],
  })
}
```

This ensures the loader only refetches when filter parameters change, not on every navigation.

---

## API Routes

API routes provide server-side endpoints. They serve two purposes in this codebase:

### 1. Utility Routes

Some API routes provide server-side utilities:

**`api.logs.ts`** - Forwards frontend logs to the server for centralized logging:

```typescript
// app/routes/api.logs.ts
import { ActionFunctionArgs } from '@remix-run/server-runtime'

export async function action({ request }: ActionFunctionArgs) {
  const { logs } = (await request.json()) as LogApiRequestBody

  logs.forEach((entry) => console[entry.level](...entry.messages))

  return 'OK'
}
```

**`api.event.ts`** - Sends analytics events to Plausible:

```typescript
// app/routes/api.event.ts
import { ActionFunctionArgs } from '@remix-run/server-runtime'

export async function action({ request, context }: ActionFunctionArgs) {
  let { clientIp } = context as ServerContext
  clientIp = clientIp.replace('::ffff:', '')

  const payload = {
    body: request.body,
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      'user-agent': request.headers.get('user-agent'),
      'X-Forwarded-For': clientIp,
    },
  }

  const response = await fetch('https://plausible.io/api/event', payload)
  return new Response(await response.text(), {
    status: response.status,
    headers: response.headers,
  })
}
```

### 2. API Proxy Routes

Most API routes exist to **work around CORS issues**. They act as server-side proxies, allowing the frontend to make requests to external services without browser CORS restrictions.

```typescript
// app/routes/api.deposition-runs.ts
import { LoaderFunctionArgs } from '@remix-run/server-runtime'
import {
  createJsonResponse,
  handleApiError,
  validateNumericParam,
} from 'app/utils/api-helpers'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  try {
    const depositionId = validateNumericParam(
      url.searchParams.get('depositionId'),
      'depositionId',
    )
    const datasetId = validateNumericParam(
      url.searchParams.get('datasetId'),
      'datasetId',
    )

    const result = await getDepositionAnnoRunsForDataset({
      client: apolloClientV2,
      depositionId,
      datasetId,
    })

    return createJsonResponse(result.data)
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 })
    }
    return handleApiError(error, 'fetch deposition runs')
  }
}
```

**API proxy routes:**
- `api.deposition-runs.ts`
- `api.deposition-anno-runs.ts`
- `api.deposition-datasets.ts`
- `api.annotations-for-run.ts`
- `api.tomograms-for-run.ts`
- And more in `app/routes/api.*.ts`

### API Helper Utilities

Common patterns are extracted to [`app/utils/api-helpers.ts`](../../../packages/data-portal/app/utils/api-helpers.ts):

- `validateNumericParam()` - Validate and parse numeric query params
- `createJsonResponse()` - Create consistent JSON responses
- `handleApiError()` - Standardized error handling

---

## SSR Patterns

### Root Layout

The root layout ([`app/root.tsx`](../../../packages/data-portal/app/root.tsx)) sets up the document structure:

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request)

  return typedjson({
    locale,
    ENV: {
      API_URL: process.env.API_URL,
      API_URL_V2: process.env.API_URL_V2,
      ENV: process.env.ENV,
    },
  })
}

export function shouldRevalidate() {
  return false  // Environment config never changes
}
```

### Emotion Cache for SSR

Material-UI requires Emotion cache setup for proper SSR. The root component uses `withEmotionCache` HOC:

```typescript
const Document = withEmotionCache(
  ({ children, title }, emotionCache) => {
    const { ENV, locale } = useTypedLoaderData<typeof loader>()

    return (
      <html lang={locale}>
        <head>{/* Meta, Links */}</head>
        <body>
          <EnvironmentContext.Provider value={ENV}>
            <Layout>{children}</Layout>
          </EnvironmentContext.Provider>
          <Scripts />
        </body>
      </html>
    )
  }
)
```

---

## Key Patterns Summary

| Pattern | Description |
|---------|-------------|
| **Loaders only** | No actions/forms - the portal is read-only |
| **GraphQL-centric** | All data fetching via Apollo Client |
| **URL state** | Search params are source of truth for filters |
| **Jotai for history** | Atoms store navigation history, not app state |
| **Custom hooks** | Abstract loader data for cleaner components |
| **Conditional revalidation** | Only refetch when relevant params change |
| **Server utilities** | GraphQL logic in `*.server.ts` files |

---

## Error Handling

Routes throw `Response` objects for errors:

```typescript
// 400 Bad Request - Invalid parameters
if (Number.isNaN(+id)) {
  throw new Response(null, {
    status: 400,
    statusText: 'ID is not defined',
  })
}

// 404 Not Found - Resource doesn't exist
if (responseV2.datasets.length === 0) {
  throw new Response(null, {
    status: 404,
    statusText: `Dataset with ID ${id} not found`,
  })
}
```

Remix automatically renders the appropriate error boundary for thrown responses.

## Next Steps

- [GraphQL Integration](../02-data/01-graphql-integration.md) - Apollo Client, codegen, queries
- [State Management](../03-state/01-state-management.md) - Jotai atoms, URL state, contexts
- [Styling System](../05-styling/01-styling-system.md) - Tailwind + CSS Modules + MUI
