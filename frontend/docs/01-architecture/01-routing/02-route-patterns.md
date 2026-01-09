# Route Patterns

This document describes the 6 distinct route patterns used throughout the CryoET Data Portal frontend. Understanding these patterns helps you choose the right approach when creating new routes.


## Overview

| Pattern | When to Use | Example Routes |
|---------|-------------|----------------|
| [Browse Page](#pattern-1-browse-page) | Paginated lists with filters | `browse-data.datasets.tsx` |
| [Detail Page](#pattern-2-detail-page) | Single entity view with tabs | `datasets.$id.tsx`, `runs.$id.tsx` |
| [MDX Content](#pattern-3-mdx-content) | Static content pages | `privacy.tsx`, `competition.tsx` |
| [Lazy-Loaded Viewer](#pattern-4-lazy-loaded-viewer) | Heavy components needing code splitting | `view.runs.$id.tsx` |
| [API Resource Route](#pattern-5-api-resource-route) | JSON endpoints for client-side fetching | `api.deposition-datasets.ts` |
| [React Query + API Proxy](#pattern-6-react-query--api-proxy) | Complex client-side data with CORS concerns | `depositions.$id.tsx` |

---

## Pattern 1: Browse Page

**Use when:** Building a paginated list page with filtering, sorting, and search capabilities.

**Key characteristics:**
- Apollo Client fetches data in the loader
- URL search params drive all filter state
- Uses `TablePageLayout` component for consistent structure
- Syncs filter state to Jotai atoms for navigation history

**Example routes:**
- [`browse-data.datasets.tsx`](../../../packages/data-portal/app/routes/browse-data.datasets.tsx)
- [`browse-data.depositions.tsx`](../../../packages/data-portal/app/routes/browse-data.depositions.tsx)

### Code Structure

```typescript
// app/routes/browse-data.datasets.tsx

import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { apolloClientV2 } from 'app/apollo.server'
import { getDatasetsV2 } from 'app/graphql/getDatasetsV2.server'
import { QueryParams } from 'app/constants/query'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  // Extract filter params from URL
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
  const sort = url.searchParams.get(QueryParams.Sort)
  const query = url.searchParams.get(QueryParams.Search) ?? ''

  // Fetch with Apollo Client
  const { data } = await getDatasetsV2({
    page,
    searchText: query,
    params: url.searchParams,  // Pass all params for filter processing
    client: apolloClientV2,
  })

  return json({ datasets: data })
}

export default function BrowseDatasetsPage() {
  const { filteredCount, totalCount } = useDatasetsFilterData()

  // Sync URL params to Jotai for back-navigation
  const { setPreviousBrowseDatasetParams } = useBrowseDatasetFilterHistory()
  useSyncParamsWithState({
    filters: DATASET_FILTERS,
    setParams: setPreviousBrowseDatasetParams,
  })

  return (
    <TablePageLayout
      tabs={[{
        title: t('datasets'),
        filterPanel: <DatasetFilter />,
        table: <DatasetTable />,
        filteredCount,
        totalCount,
      }]}
    />
  )
}
```

### Key Files

| File | Purpose |
|------|---------|
| [`app/graphql/common.ts`](../../../packages/data-portal/app/graphql/common.ts) | `getDatasetsFilter()` converts URL params to GraphQL where clause |
| [`app/hooks/useFilter.ts`](../../../packages/data-portal/app/hooks/useFilter.ts) | `useFilter()` hook for reading/updating filter state |
| [`app/state/filterHistory.ts`](../../../packages/data-portal/app/state/filterHistory.ts) | Jotai atoms and `useSyncParamsWithState()` |
| [`app/components/TablePageLayout/`](../../../packages/data-portal/app/components/TablePageLayout/) | Standard browse page layout |

---

## Pattern 2: Detail Page

**Use when:** Displaying a single entity (dataset, run, deposition) with multiple related data sections.

**Key characteristics:**
- Dynamic route parameter (`$id`) for entity ID
- Custom `shouldRevalidate()` to control data refetching
- Multi-tab layout for different data types
- Multiple metadata drawers for detailed views
- Error handling for invalid/missing IDs

**Example routes:**
- [`datasets.$id.tsx`](../../../packages/data-portal/app/routes/datasets.$id.tsx)
- [`runs.$id.tsx`](../../../packages/data-portal/app/routes/runs.$id.tsx)

### Code Structure

```typescript
// app/routes/runs.$id.tsx

import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { getRunByIdV2 } from 'app/graphql/getRunByIdV2.server'
import { shouldRevalidatePage } from 'app/utils/revalidate'
import { QueryParams } from 'app/constants/query'

export async function loader({ params, request }: LoaderFunctionArgs) {
  // Validate ID parameter
  const id = params.id ? +params.id : NaN
  if (Number.isNaN(id)) {
    throw new Response(null, { status: 400, statusText: 'ID is not defined' })
  }

  const { data } = await getRunByIdV2({ id, client: apolloClientV2 })

  if (data.runs.length === 0) {
    throw new Response(null, { status: 404, statusText: `Run ${id} not found` })
  }

  return json({ run: data.runs[0] })
}

// Only refetch when specific params change
export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [
      QueryParams.ObjectName,
      QueryParams.MethodType,
      QueryParams.AnnotationsPage,
      QueryParams.DepositionId,
    ],
  })
}

export default function RunByIdPage() {
  const { run } = useRunById()

  return (
    <TablePageLayout
      header={<RunHeader />}
      tabs={[
        {
          title: t('annotations'),
          filterPanel: <AnnotationFilter />,
          table: <RunAnnotationTable />,
        },
        {
          title: t('tomograms'),
          table: <RunTomogramsTable />,
        },
      ]}
      drawers={
        <>
          <RunMetadataDrawer />
          <AnnotationDrawer />
          <TomogramMetadataDrawer />
        </>
      }
    />
  )
}
```

### Key Patterns

**ID Validation:**
```typescript
const id = params.id ? +params.id : NaN
if (Number.isNaN(id)) {
  throw new Response(null, { status: 400, statusText: 'ID is not defined' })
}
```

**Custom Revalidation:**
```typescript
export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [QueryParams.Page, QueryParams.Filter],  // Only these trigger refetch
  })
}
```

**Multiple Drawers:**
Detail pages often have multiple metadata drawers for different entity types (run metadata, annotation details, tomogram details).

---

## Pattern 3: MDX Content

**Use when:** Building static content pages (policies, documentation, competition pages).

**Key characteristics:**
- MDX files stored in `/website-docs/` or component directories
- Server-side serialization with `next-mdx-remote`
- Custom components for rich formatting
- Can be combined with dynamic data (hybrid pattern)

**Example routes:**
- [`privacy.tsx`](../../../packages/data-portal/app/routes/privacy.tsx) (simple)
- [`terms.tsx`](../../../packages/data-portal/app/routes/terms.tsx) (simple)
- [`competition.tsx`](../../../packages/data-portal/app/routes/competition.tsx) (hybrid)

### Simple MDX Pattern

```typescript
// app/routes/privacy.tsx

import { getMdxContent } from 'app/utils/repo.server'
import { MdxContent } from 'app/components/MDX'

export async function loader() {
  return getMdxContent('website-docs/privacy-policy.mdx')
}

export default function PrivacyPage() {
  return <MdxContent />
}
```

### Hybrid MDX + Data Pattern

```typescript
// app/routes/competition.tsx

import { typedjson } from 'remix-typedjson'
import { getLocalFileContent } from 'app/utils/repo.server'
import { getWinningDepositions } from 'app/graphql/getWinningDepositions.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const prefix = 'app/components/MLChallenge/MdxContent'

  // Load multiple MDX files in parallel
  const [aboutContent, glossaryContent, howToContent] = await Promise.all([
    getLocalFileContent(`${prefix}/AboutTheCompetition.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/Glossary.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/HowToParticipate.mdx`, { raw: true }),
  ])

  // Fetch dynamic data
  const { data } = await getWinningDepositions({ client: apolloClientV2 })

  return typedjson({
    aboutContent,
    glossaryContent,
    howToContent,
    winningDepositions: data.depositions,
  })
}

export default function CompetitionPage() {
  const showPostChallenge = useFeatureFlag('postMlChallenge')

  // Feature flag switches between active/completed competition views
  return showPostChallenge ? <CompletedMLChallenge /> : <MLChallenge />
}
```

### Key Files

| File | Purpose |
|------|---------|
| [`app/utils/repo.server.ts`](../../../packages/data-portal/app/utils/repo.server.ts) | `getMdxContent()`, `getLocalFileContent()` |
| [`app/components/MDX/MdxContent.tsx`](../../../packages/data-portal/app/components/MDX/MdxContent.tsx) | MDX renderer with custom components |
| [`/website-docs/`](../../../../website-docs/) | Static MDX content files |

---

## Pattern 4: Lazy-Loaded Viewer

**Use when:** A route renders a heavy component that should be code-split for performance.

**Key characteristics:**
- Uses React `lazy()` and `Suspense` for code splitting
- Heavy component loaded only when route is visited
- Fallback UI shown during loading
- Keeps initial bundle size small

**Example route:**
- [`view.runs.$id.tsx`](../../../packages/data-portal/app/routes/view.runs.$id.tsx) (3D viewer)

### Code Structure

```typescript
// app/routes/view.runs.$id.tsx

import { lazy, Suspense } from 'react'
import { typedjson } from 'remix-typedjson'
import { getRunByIdV2 } from 'app/graphql/getRunByIdV2.server'

// Lazy load the heavy viewer component
const ViewerPage = lazy(() =>
  import('app/components/Viewer/ViewerPage').then((mod) => ({
    default: mod.ViewerPage,
  })),
)

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN
  if (Number.isNaN(id)) {
    throw new Response(null, { status: 400 })
  }

  const { data } = await getRunByIdV2({ id, client: apolloClientV2 })

  if (data.runs.length === 0) {
    throw new Response(null, { status: 404 })
  }

  return typedjson({ run: data.runs[0] })
}

export default function RunByIdViewerPage() {
  const { run } = useTypedLoaderData<typeof loader>()

  return (
    <Suspense fallback={<ViewerLoadingState />}>
      <ViewerPage run={run} />
    </Suspense>
  )
}

function ViewerLoadingState() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Loading viewer...</div>
    </div>
  )
}
```

### When to Use

- 3D viewers (Neuroglancer, Three.js)
- Complex visualization components
- Code editors or heavy form builders
- Any component with large dependencies

---

## Pattern 5: API Resource Route

**Use when:** Creating JSON endpoints for client-side data fetching (used by React Query hooks).

**Key characteristics:**
- Returns JSON responses, not HTML
- Named with `api.` prefix
- Validates request parameters
- Used as server-side proxies for GraphQL

**Example routes:**
- [`api.deposition-datasets.ts`](../../../packages/data-portal/app/routes/api.deposition-datasets.ts)
- [`api.annotations-for-run.ts`](../../../packages/data-portal/app/routes/api.annotations-for-run.ts)
- [`api.event.ts`](../../../packages/data-portal/app/routes/api.event.ts) (POST action)

### Naming Convention

```
api.<entity>-<operation>.ts → /api/<entity>-<operation>

Examples:
api.deposition-datasets.ts    → /api/deposition-datasets
api.annotations-for-run.ts    → /api/annotations-for-run
api.deposition-run-counts.ts  → /api/deposition-run-counts
```

### Basic Structure

```typescript
// app/routes/api.annotations-for-run.ts

import { LoaderFunctionArgs } from '@remix-run/server-runtime'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  // Extract and validate parameters
  const runId = url.searchParams.get('runId')
  const depositionId = url.searchParams.get('depositionId')
  const page = url.searchParams.get('page') ?? '1'

  if (!runId || !depositionId) {
    return new Response('Missing required parameters', { status: 400 })
  }

  if (Number.isNaN(Number(runId)) || Number.isNaN(Number(depositionId))) {
    return new Response('Invalid parameter format', { status: 400 })
  }

  try {
    const { data } = await getAnnotationsForRun({
      runId: Number(runId),
      depositionId: Number(depositionId),
      page: Number(page),
      client: apolloClientV2,
    })

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response('Failed to fetch annotations', { status: 500 })
  }
}
```

### Action Routes (POST/PUT)

```typescript
// app/routes/api.event.ts - Analytics proxy

import { ActionFunctionArgs } from '@remix-run/server-runtime'

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.text()

  // Forward to Plausible analytics
  const response = await fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': request.headers.get('User-Agent') ?? '',
      'X-Forwarded-For': request.headers.get('X-Forwarded-For') ?? '',
    },
    body,
  })

  return new Response(null, { status: response.status })
}
```

### Validation Helpers

For complex validation, use helper functions from `app/utils/api-helpers.ts`:

```typescript
import { validateNumericParam, parsePageParams, createJsonResponse } from 'app/utils/api-helpers'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const depositionId = validateNumericParam(url.searchParams.get('depositionId'))
  if (!depositionId) {
    return new Response('Invalid depositionId', { status: 400 })
  }

  const { page, pageSize } = parsePageParams(url.searchParams)

  // ... fetch data

  return createJsonResponse(data)
}
```

---

## Pattern 6: React Query + API Proxy

**Use when:** Client-side data fetching is needed and direct browser-to-GraphQL requests would face CORS issues.

**Key characteristics:**
- Remix API routes act as server-side proxies
- React Query manages client-side caching and state
- Avoids CORS by making same-origin requests
- Used for complex paginated data within detail pages

**Example routes:**
- [`depositions.$id.tsx`](../../../packages/data-portal/app/routes/depositions.$id.tsx) (consumer)
- [`api.deposition-datasets.ts`](../../../packages/data-portal/app/routes/api.deposition-datasets.ts) (API route)

### Architecture

```
Browser (Client)
    ↓ fetch (same-origin, no CORS)
Remix API Route (/api/deposition-datasets)
    ↓ Apollo Client (server-side)
GraphQL Endpoint (no CORS issues)
    ↓
JSON Response back to browser
    ↓
React Query caches and manages state
```

### API Route Structure

```typescript
// app/routes/api.deposition-datasets.ts

import { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { getDatasetsForDeposition } from 'app/graphql/getDatasetsForDeposition.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionId = url.searchParams.get('depositionId')

  // Validate parameters
  if (!depositionId || Number.isNaN(Number(depositionId))) {
    return new Response('Missing or invalid depositionId', { status: 400 })
  }

  try {
    const { data } = await getDatasetsForDeposition({
      depositionId: Number(depositionId),
      client: apolloClientV2,
    })

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response('Failed to fetch datasets', { status: 500 })
  }
}
```

### Query Hook Structure

```typescript
// app/queries/useDatasetsForDeposition.ts

import { useQuery } from '@tanstack/react-query'
import { fetchDepositionApi, createQueryKey } from 'app/utils/deposition-api'

export function useDatasetsForDeposition(depositionId: number, enabled = true) {
  return useQuery({
    queryKey: createQueryKey('datasets-for-deposition', depositionId),
    queryFn: () => fetchDepositionApi('/api/deposition-datasets', { depositionId }),
    enabled: !!depositionId && enabled,
  })
}
```

### Key Files

| File | Purpose |
|------|---------|
| [`app/utils/deposition-api.ts`](../../../packages/data-portal/app/utils/deposition-api.ts) | API fetch utilities and cache key helpers |
| [`app/hooks/useDepositionQuery.ts`](../../../packages/data-portal/app/hooks/useDepositionQuery.ts) | Base query hook configuration |
| [`app/queries/`](../../../packages/data-portal/app/queries/) | Query hooks for each endpoint |
| [`app/types/deposition-queries.ts`](../../../packages/data-portal/app/types/deposition-queries.ts) | Endpoint URL constants |

### When to Use This Pattern

- Complex nested data that changes independently of the main page data
- Paginated tables within a detail page
- Data that benefits from client-side caching across navigation
- Avoiding CORS issues with external GraphQL endpoints

---

## Decision Guide

Use this flowchart to choose the right pattern:

```
Is this a JSON API endpoint?
├─ Yes → Pattern 5: API Resource Route
└─ No ↓

Is this a static content page (policy, docs)?
├─ Yes → Pattern 3: MDX Content
└─ No ↓

Is this a list/browse page with filters?
├─ Yes → Pattern 1: Browse Page
└─ No ↓

Is this a single entity detail page?
├─ Yes ↓
│   Does it need client-side data fetching?
│   ├─ Yes → Pattern 6: React Query + API Proxy
│   └─ No → Pattern 2: Detail Page
└─ No ↓

Does it load a heavy component (3D viewer)?
├─ Yes → Pattern 4: Lazy-Loaded Viewer
└─ No → Start with Pattern 2, adapt as needed
```

---

## Pattern Combinations

Some routes combine multiple patterns:

| Route | Patterns Used |
|-------|---------------|
| `depositions.$id.tsx` | Detail Page + React Query + API Proxy |
| `competition.tsx` | MDX Content + Apollo Client (hybrid) |
| `browse-data.depositions.tsx` | Browse Page + Feature Flags |

---

## Next Steps

- [Adding New Routes](../../03-development/01-adding-new-routes.md) - Step-by-step route creation guide
- [Filter System](../02-data/03-filter-system.md) - URL-driven filtering patterns
- [Table Page Layout](../04-components/02-table-page-layout.md) - Standard layout component
- [API Routes Reference](../../04-reference/06-api-routes.md) - Complete API route documentation
