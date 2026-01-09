# State Management

This document covers state management in the CryoET Data Portal frontend, including Jotai atoms for UI state, URL-based state via Remix, React contexts for shared data, and state synchronization patterns.


## Quick Reference

| State Type | Technology | Use Case | Location |
|------------|-----------|----------|----------|
| Server State | Remix loaders | Data from GraphQL API | Route loaders, [GraphQL Integration](../02-data/01-graphql-integration.md) |
| Route State | Remix params | Page-specific data (e.g., ID) | `params.id` in loaders |
| Filter State | URL params | Shareable, bookmarkable filters | `useFilter()`, `useQueryParam()` |
| Global Context | React Context | Environment config, modals | [`app/context/`](../../../packages/data-portal/app/context/) |
| UI State | Jotai atoms | Transient component state | [`app/state/`](../../../packages/data-portal/app/state/) |

---

## State Management Philosophy

The CryoET Data Portal follows a **distributed state management** approach:

1. **Remix loaders** handle server state (no client-side cache)
2. **Route params** identify specific resources (dataset ID, run ID)
3. **URL is the source of truth** for filters, pagination, and navigation
4. **React Context** provides global configuration and utilities
5. **Jotai atoms** manage ephemeral UI state (modals, selections, history)

**Benefits:**
- Shareable URLs with filters applied
- Browser back/forward works naturally
- No complex client-side cache invalidation
- Minimal global state reduces bugs

---

## Server State

Server state is data fetched from the GraphQL API via **Remix loaders**. This is the primary source of truth for all data displayed in the application.

### How It Works

1. **Loaders run on the server** before rendering the page
2. **Data is fetched via Apollo Client** with SSR mode enabled
3. **Components access data** via `useTypedLoaderData()` hook
4. **No client-side caching** - each navigation refetches fresh data

### Example: Dataset Details Page

From [`datasets.$id.tsx`](../../../packages/data-portal/app/routes/datasets.$id.tsx):

```typescript
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { apolloClientV2 } from 'app/apollo.server'
import { getDatasetByIdV2 } from 'app/graphql/getDatasetByIdV2.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  if (Number.isNaN(id)) {
    throw new Response(null, { status: 400, statusText: 'ID is not defined' })
  }

  const url = new URL(request.url)
  const { data } = await getDatasetByIdV2({
    id,
    client: apolloClientV2,
    params: url.searchParams,
  })

  if (data.datasets.length === 0) {
    throw new Response(null, { status: 404, statusText: `Dataset ${id} not found` })
  }

  return json({ v2: data })
}
```

**Accessing in components:**

```typescript
import { useTypedLoaderData } from 'remix-typedjson'

function DatasetPage() {
  const { v2 } = useTypedLoaderData<typeof loader>()
  const dataset = v2.datasets[0]

  return <DatasetHeader title={dataset.title} />
}
```

**Key patterns:**
- Validate route params before querying
- Throw `Response` objects for error handling (400, 404)
- Use `json()` helper to return typed data
- Access via `useTypedLoaderData()` for full type safety

For detailed GraphQL patterns, see [GraphQL Integration](../02-data/01-graphql-integration.md).

---

## Route State

Route state consists of **URL path parameters** like `/datasets/123` where `123` is the dataset ID. These parameters identify the specific resource being viewed.

### How It Works

1. **Route files define params** via filename (e.g., `datasets.$id.tsx` → `params.id`)
2. **Loaders extract and validate** params from `LoaderFunctionArgs`
3. **Params are always strings** - convert to numbers as needed
4. **Validation happens early** - throw errors before querying

### Example: Extracting Route Params

```typescript
// Route file: app/routes/datasets.$id.tsx
// URL: /datasets/123 → params.id = "123"

export async function loader({ params }: LoaderFunctionArgs) {
  // 1. Extract param (always a string from URL)
  const id = params.id ? +params.id : NaN

  // 2. Validate immediately
  if (Number.isNaN(id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  // 3. Use validated param in query
  const data = await fetchDataset(id)
  return json({ data })
}
```

### Common Route Param Patterns

| Route File | URL Example | Params |
|------------|-------------|--------|
| `datasets.$id.tsx` | `/datasets/123` | `params.id = "123"` |
| `runs.$id.tsx` | `/runs/456` | `params.id = "456"` |
| `depositions.$id.tsx` | `/depositions/789` | `params.id = "789"` |

**Note:** Route params identify *which* resource. Query params (covered next) control *how* to display it (filters, pagination, sorting).

---

## URL-Based State

The primary state mechanism is **URL query parameters** managed by Remix.

### Filter State via URL

All filters, pagination, and sorting are stored in the URL:

```
/browse-data/datasets?organism=Homo+sapiens&page=2&sort=asc
```

**Benefits:**
- ✅ Shareable links with filters applied
- ✅ Bookmarkable search results
- ✅ Browser back/forward works naturally
- ✅ No state synchronization bugs
- ✅ SEO-friendly (server can read params)

### useFilter Hook

The [`useFilter`](../../../packages/data-portal/app/hooks/useFilter.ts) hook provides a typed API for filter manipulation:

```typescript
import { useFilter } from 'app/hooks/useFilter'

function DatasetFilter() {
  const filter = useFilter()

  // Read filter values
  const organismNames = filter.sampleAndExperimentConditions.organismNames
  const objectNames = filter.annotation.objectNames

  // Update single filter
  filter.updateValue(QueryParams.Organism, ['Homo sapiens'])

  // Update multiple filters
  filter.updateValues({
    [QueryParams.Organism]: ['Homo sapiens'],
    [QueryParams.ObjectName]: ['ribosome'],
  })

  // Reset all filters
  filter.reset()
}
```

### Filter State Structure

From [`useFilter.ts`](../../../packages/data-portal/app/hooks/useFilter.ts):

```typescript
export function getFilterState(searchParams: URLSearchParams) {
  return {
    includedContents: {
      isGroundTruthEnabled:
        searchParams.get(QueryParams.GroundTruthAnnotation) === 'true',
      availableFiles: searchParams.getAll(QueryParams.AvailableFiles),
      numberOfRuns: JSON.parse(searchParams.get(QueryParams.NumberOfRuns) ?? 'null'),
    },

    ids: {
      datasets: searchParams.getAll(QueryParams.DatasetId),
      deposition: searchParams.get(QueryParams.DepositionId),
      empiar: searchParams.get(QueryParams.EmpiarId),
      emdb: searchParams.get(QueryParams.EmdbId),
    },

    author: {
      name: searchParams.get(QueryParams.AuthorName),
      orcid: searchParams.get(QueryParams.AuthorOrcid),
    },

    sampleAndExperimentConditions: {
      organismNames: searchParams.getAll(QueryParams.Organism),
    },

    annotation: {
      objectNames: searchParams.getAll(QueryParams.ObjectName),
      objectId: searchParams.get(QueryParams.ObjectId),
      objectShapeTypes: searchParams.getAll(QueryParams.ObjectShapeType),
      annotatedObjectsOnly: searchParams.get(QueryParams.AnnotatedObjectsOnly) === 'Yes',
    },

    // ... more sections
  }
}

export type FilterState = ReturnType<typeof getFilterState>
```

**Key features:**
1. Centralized parsing from URL params
2. Type-safe with exported `FilterState` type
3. Handles arrays, booleans, nulls
4. Used by both client and server (Remix loaders)

### useQueryParam Hook

For individual URL parameters, use [`useQueryParam`](../../../packages/data-portal/app/hooks/useQueryParam.ts):

```typescript
import { useQueryParam } from 'app/hooks/useQueryParam'
import { QueryParams } from 'app/constants/query'

function SearchBox() {
  const [query, setQuery] = useQueryParam<string>(QueryParams.Search, {
    defaultValue: '',
  })

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search datasets..."
    />
  )
}
```

**Features:**
- Type-safe with generics
- Optional default values
- Custom serialization/deserialization
- Automatic URL synchronization

**Advanced usage with custom serialization:**

```typescript
interface Filters {
  min: number
  max: number
}

const [filters, setFilters] = useQueryParam<Filters>(QueryParams.TiltRange, {
  serialize: (value) => JSON.stringify(value),
  deserialize: (value) => (value ? JSON.parse(value) : null),
})
```

### Multiple Query Parameters

For managing multiple related parameters:

```typescript
import { useQueryParams } from 'app/hooks/useQueryParam'

function TiltRangeFilter() {
  const [{ min, max }, setRange] = useQueryParams({
    min: QueryParams.TiltRangeMin,
    max: QueryParams.TiltRangeMax,
  })

  const handleUpdate = () => {
    setRange({ min: '-60', max: '60' })
  }

  const handleReset = () => {
    setRange(null) // Clears both params
  }
}
```

---

## React Context

Global configuration and utilities are provided via React Context.

### Environment Context

From [`Environment.context.ts`](../../../packages/data-portal/app/context/Environment.context.ts):

```typescript
import { createContext, useContext } from 'react'

export type EnvironmentContextValue = Required<
  Pick<
    NodeJS.ProcessEnv,
    'API_URL' | 'API_URL_V2' | 'ENV' | 'LOCALHOST_PLAUSIBLE_TRACKING'
  >
>

export const ENVIRONMENT_CONTEXT_DEFAULT_VALUE: EnvironmentContextValue = {
  API_URL: 'https://graphql-cryoet-api.cryoet.prod.si.czi.technology/v1/graphql',
  API_URL_V2: 'https://graphql.cryoetdataportal.czscience.com/graphql',
  ENV: 'local',
  LOCALHOST_PLAUSIBLE_TRACKING: 'false',
}

export const EnvironmentContext = createContext<EnvironmentContextValue>(
  ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
)

export function useEnvironment() {
  return useContext(EnvironmentContext)
}
```

**Usage:**

```typescript
import { useEnvironment } from 'app/context/Environment.context'

function FeatureFlaggedComponent() {
  const { ENV } = useEnvironment()

  if (ENV === 'prod') {
    return <ProductionFeature />
  }

  return <DevFeature />
}
```

**Context is provided in root:**

```typescript
// app/root.tsx
import { EnvironmentContext } from 'app/context/Environment.context'

export function loader() {
  return json({
    env: {
      API_URL: process.env.API_URL,
      API_URL_V2: process.env.API_URL_V2,
      ENV: process.env.ENV,
      LOCALHOST_PLAUSIBLE_TRACKING: process.env.LOCALHOST_PLAUSIBLE_TRACKING,
    },
  })
}

export default function App() {
  const { env } = useLoaderData<typeof loader>()

  return (
    <EnvironmentContext.Provider value={env}>
      <Outlet />
    </EnvironmentContext.Provider>
  )
}
```

### Download Modal Context

From [`DownloadModal.context.ts`](../../../packages/data-portal/app/context/DownloadModal.context.ts):

```typescript
import { createContext, useContext } from 'react'

export type DownloadModalType = 'dataset' | 'runs' | 'annotation'

export interface DownloadModalContextValue {
  annotationShapeToDownload?: AnnotationShape
  tomogramToDownload?: TomogramV2
  datasetId?: number
  datasetTitle?: string
  fileSize?: number
  httpsPath?: string
  s3Path?: string
  type: DownloadModalType
  // ... more fields
}

export const DownloadModalContext =
  createContext<DownloadModalContextValue | null>(null)

export function useDownloadModalContext() {
  const value = useContext(DownloadModalContext)

  if (!value) {
    throw new Error(
      'useDownloadModal must be used within a DownloadModalContext',
    )
  }

  return value
}
```

**Usage pattern:**

```typescript
import { DownloadModalContext } from 'app/context/DownloadModal.context'

function DatasetPage() {
  const [modalData, setModalData] = useState<DownloadModalContextValue | null>(null)

  return (
    <DownloadModalContext.Provider value={modalData}>
      <DatasetView />
      {modalData && <DownloadModal />}
    </DownloadModalContext.Provider>
  )
}

function DownloadButton() {
  const datasetId = useDatasetId()
  const setModalData = /* ... */

  const handleClick = () => {
    setModalData({
      type: 'dataset',
      datasetId,
      datasetTitle: 'My Dataset',
    })
  }
}
```

---

## Jotai Atomic State

The application uses Jotai for lightweight, atomic state management of ephemeral UI state.

### Why Jotai?

| Feature | Benefit |
|---------|---------|
| **Atomic model** | Small, focused pieces of state |
| **Minimal boilerplate** | No actions, reducers, or providers |
| **Automatic optimization** | Only re-renders components that read changed atoms |
| **TypeScript-first** | Excellent type inference |
| **Small bundle** | ~3KB gzipped |

### Atom Organization

All atoms are defined in [`app/state/`](../../../packages/data-portal/app/state/):

```
app/state/
├── annotation.ts              # Selected annotation shape
├── banner.ts                  # Banner visibility state
├── filterHistory.ts           # Filter history for back navigation
├── metadataDrawerTomogram.ts  # Metadata drawer state
└── search.ts                  # Search input state
```

### Basic Atom Pattern

From [`annotation.ts`](../../../packages/data-portal/app/state/annotation.ts):

```typescript
import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'
import { AnnotationShape } from 'app/types/gql/runPageTypes'

// Define the atom
const selectedAnnotationAtom = atom<AnnotationShape | null>(null)

// Export a custom hook that wraps the atom
export function useSelectedAnnotationShape() {
  const [selectedAnnotationShape, setSelectedAnnotationShape] = useAtom(
    selectedAnnotationAtom,
  )

  return useMemo(
    () => ({
      selectedAnnotationShape,
      setSelectedAnnotationShape,
    }),
    [selectedAnnotationShape, setSelectedAnnotationShape],
  )
}
```

**Usage in components:**

```typescript
import { useSelectedAnnotationShape } from 'app/state/annotation'

function AnnotationViewer() {
  const { selectedAnnotationShape, setSelectedAnnotationShape } =
    useSelectedAnnotationShape()

  return (
    <div>
      {selectedAnnotationShape && (
        <AnnotationDetails annotation={selectedAnnotationShape} />
      )}
      <button onClick={() => setSelectedAnnotationShape(null)}>
        Clear Selection
      </button>
    </div>
  )
}
```

**Key patterns:**
1. Atom defined privately (not exported)
2. Custom hook wraps `useAtom()` for cleaner API
3. Hook memoized to prevent unnecessary re-renders
4. TypeScript types ensure type safety

### Filter History Atoms

From [`filterHistory.ts`](../../../packages/data-portal/app/state/filterHistory.ts):

```typescript
import { atom, useAtom } from 'jotai'
import { useSearchParams } from '@remix-run/react'
import { useEffect } from 'react'

// Atoms for storing previous filter states
export const previousBrowseDatasetParamsAtom = atom('')
export const previousSingleDatasetParamsAtom = atom('')
export const previousDepositionIdAtom = atom<number | null>(null)
export const previousSingleDepositionParamsAtom = atom('')

// Hook to access browse dataset filter history
export function useBrowseDatasetFilterHistory() {
  const [previousBrowseDatasetParams, setPreviousBrowseDatasetParams] = useAtom(
    previousBrowseDatasetParamsAtom,
  )

  return {
    previousBrowseDatasetParams,
    setPreviousBrowseDatasetParams,
  }
}

// Syncs URL params with atom state
export function useSyncParamsWithState({
  filters,
  setParams,
}: {
  filters: readonly QueryParams[]
  setParams(params: string): void
}) {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)

    // Keep only allowed filters and system parameters
    for (const key of newParams.keys()) {
      const isAllowedFilter = filters.includes(key as QueryParams)
      const isSystemParam = SYSTEM_PARAMS.includes(key as QueryParams)

      if (!isAllowedFilter && !isSystemParam) {
        newParams.delete(key)
      }
    }

    newParams.sort()
    setParams(newParams.toString())
  }, [filters, searchParams, setParams])
}
```

**Usage:**

```typescript
import { useBrowseDatasetFilterHistory, useSyncParamsWithState } from 'app/state/filterHistory'
import { DATASET_FILTERS } from 'app/constants/filterQueryParams'

function BrowseDatasetsPage() {
  const { previousBrowseDatasetParams, setPreviousBrowseDatasetParams } =
    useBrowseDatasetFilterHistory()

  // Automatically sync URL params with atom
  useSyncParamsWithState({
    filters: DATASET_FILTERS,
    setParams: setPreviousBrowseDatasetParams,
  })

  // Navigate back with previous filters
  const handleBack = () => {
    const params = new URLSearchParams(previousBrowseDatasetParams)
    navigate(`/browse-data/datasets?${params.toString()}`)
  }
}
```

**Purpose:**
- Remember filter state when navigating between pages
- Enable "back" navigation with filters preserved
- Provide breadcrumb trails with context

---

## State Synchronization Patterns

### URL ↔ Atom Sync

Pattern for keeping atoms in sync with URL state:

```typescript
export function useSyncParamsWithState({
  filters,
  setParams,
}: {
  filters: readonly QueryParams[]
  setParams(params: string): void
}) {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)

    // Keep only allowed filters
    for (const key of newParams.keys()) {
      const isAllowedFilter = filters.includes(key as QueryParams)
      const isSystemParam = SYSTEM_PARAMS.includes(key as QueryParams)

      if (!isAllowedFilter && !isSystemParam) {
        newParams.delete(key)
      }
    }

    newParams.sort()
    setParams(newParams.toString())
  }, [filters, searchParams, setParams])
}
```

**Use case:** Remember browse page filters when navigating to detail page, then restore when returning.

### Server State → Atom Hydration

Pattern for initializing atoms from server-rendered data:

```typescript
import { useHydrateAtoms } from 'jotai/utils'

function DatasetPage() {
  const loaderData = useTypedLoaderData<typeof loader>()

  // Hydrate atom with server data
  useHydrateAtoms([
    [selectedAnnotationAtom, loaderData.defaultAnnotation],
  ])

  return <AnnotationViewer />
}
```

---

## Advanced Patterns

### Derived Atoms

Atoms can derive values from other atoms:

```typescript
import { atom } from 'jotai'

const selectedAnnotationAtom = atom<AnnotationShape | null>(null)

// Derived atom (read-only)
const selectedAnnotationIdAtom = atom((get) => {
  const annotation = get(selectedAnnotationAtom)
  return annotation?.id ?? null
})

// Usage
const [annotationId] = useAtom(selectedAnnotationIdAtom)
```

### Write-Only Atoms (Actions)

Atoms can define custom write logic:

```typescript
const selectedAnnotationAtom = atom<AnnotationShape | null>(null)

// Action atom
const clearSelectionAtom = atom(
  null, // No read value
  (get, set) => {
    set(selectedAnnotationAtom, null)
    // Could trigger side effects here
  }
)

// Usage
const [, clearSelection] = useAtom(clearSelectionAtom)
```

### Atom Families

For dynamic collections of atoms:

```typescript
import { atomFamily } from 'jotai/utils'

// Create atom for each dataset ID
const datasetExpandedFamily = atomFamily((datasetId: number) =>
  atom(false)
)

// Usage
function DatasetRow({ id }: { id: number }) {
  const [isExpanded, setIsExpanded] = useAtom(datasetExpandedFamily(id))
}
```

---

## State Management Decision Tree

Use this decision tree to choose the right state management approach:

```
Is the state server data?
├─ Yes → Use Remix loader + useTypedLoaderData
└─ No → Should it be shareable via URL?
    ├─ Yes → Use URL params (useQueryParam, useFilter)
    └─ No → Is it component-local?
        ├─ Yes → Use useState/useReducer
        └─ No → Does it change frequently?
            ├─ No → Use React Context
            └─ Yes → Use Jotai atom
```

**Examples:**
- GraphQL data → Remix loader
- Filter values → URL params
- Environment config → React Context (rarely changes)
- Form input → useState
- Selected annotation → Jotai atom (changes frequently)

---

## Best Practices

### URL State

✅ **Do:**
- Use URL params for all shareable state (filters, pagination, search)
- Keep URL params human-readable
- Validate and sanitize URL params on server
- Use typed query param hooks

❌ **Don't:**
- Store ephemeral UI state (modal open/closed) in URL
- Create URLs longer than ~2000 characters
- Store sensitive data in URL params

### Jotai Atoms

✅ **Do:**
- Keep atoms small and focused
- Export custom hooks, not raw atoms
- Memoize custom hook return values
- Use descriptive atom names

❌ **Don't:**
- Create giant atoms with many unrelated fields
- Export atoms directly (export hooks instead)
- Use atoms for state that should be in URL
- Duplicate URL state in atoms

### React Context

✅ **Do:**
- Use for truly global configuration (environment, theme)
- Provide context at highest common ancestor
- Throw error in useContext if not in provider
- Document what each context provides

❌ **Don't:**
- Use context for frequently changing state (causes re-renders)
- Create deeply nested context providers
- Use context for state that could be props
- Forget to provide default values

---

## Performance Considerations

### Jotai Optimization

Jotai automatically optimizes re-renders:

```typescript
// Only components reading selectedAnnotationAtom re-render
const [annotation] = useAtom(selectedAnnotationAtom)

// Components not using the atom don't re-render, even if in same tree
```

### URL State Performance

URL updates are debounced by Remix and don't cause full page reloads:

```typescript
// Fast updates are batched
filter.updateValue(QueryParams.Organism, 'Homo sapiens')
filter.updateValue(QueryParams.Page, '2') // Only one history entry
```

### Context Performance

Splitting contexts prevents unnecessary re-renders:

```typescript
// ✅ Good: Separate contexts for independent concerns
<EnvironmentContext.Provider value={env}>
  <DownloadModalContext.Provider value={modal}>
    <App />
  </DownloadModalContext.Provider>
</EnvironmentContext.Provider>

// ❌ Bad: One giant context causes re-renders for all consumers
<AppContext.Provider value={{ env, modal, user, theme, ... }}>
```

---

## Debugging

### Jotai DevTools

Install Jotai DevTools for atom inspection:

```bash
pnpm add jotai-devtools
```

```typescript
import { DevTools } from 'jotai-devtools'

function App() {
  return (
    <>
      <DevTools />
      <Routes />
    </>
  )
}
```

### URL State Debugging

View URL state in browser DevTools:

```typescript
// In console:
const params = new URLSearchParams(window.location.search)
console.log(Object.fromEntries(params))
```

### React Context Debugging

Add debug logging to context hooks:

```typescript
export function useEnvironment() {
  const value = useContext(EnvironmentContext)
  console.log('Environment:', value)
  return value
}
```

## Next Steps

- [GraphQL Integration](../02-data/01-graphql-integration.md) - Server state management with Apollo
- [Styling System](../05-styling/01-styling-system.md) - UI state and styling approaches
- [Feature Flags](../06-cross-cutting/04-feature-flags.md) - Environment-based state configuration
