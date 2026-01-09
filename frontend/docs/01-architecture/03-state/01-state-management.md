# State Management

This document covers state management in the CryoET Data Portal frontend, including Jotai atoms for UI state, URL-based state via Remix, React contexts for shared data, and state synchronization patterns.

## Quick Reference

| State Type     | Technology    | Use Case                        | Location                                                                   |
| -------------- | ------------- | ------------------------------- | -------------------------------------------------------------------------- |
| Server State   | Remix loaders | Data from GraphQL API           | Route loaders, [GraphQL Integration](../02-data/01-graphql-integration.md) |
| Route State    | Remix params  | Page-specific data (e.g., ID)   | `params.id` in loaders                                                     |
| Filter State   | URL params    | Shareable, bookmarkable filters | `useFilter()`, `useQueryParam()`                                           |
| Global Context | React Context | Environment config, modals      | [`app/context/`](../../../packages/data-portal/app/context/)               |
| UI State       | Jotai atoms   | Transient component state       | [`app/state/`](../../../packages/data-portal/app/state/)                   |

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

## Choosing the Right State Approach

Before diving into implementation details, use this decision guide:

**Use Remix loaders** when data comes from the GraphQL API. Loaders run on the server before rendering, ensuring fresh data on every navigation. This eliminates client-side caching complexity.

**Use URL parameters** when state should be shareable or bookmarkable. Filters, pagination, search queries, and sorting all belong in the URL. This enables users to share links with applied filters and makes browser history work naturally.

**Use React Context** for configuration that rarely changes and needs to be globally accessible. Environment variables, feature flags, and modal contexts fit this category. Avoid Context for frequently-changing state as it triggers re-renders in all consuming components.

**Use Jotai atoms** for ephemeral UI state that changes frequently but doesn't need persistence. Selected items, expanded/collapsed states, and UI mode toggles are good candidates. Jotai's atomic model ensures only components reading the changed atom re-render.

**Use local state (useState)** for component-specific state that doesn't need to be shared, like form inputs or local toggle states.

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
    throw new Response(null, {
      status: 404,
      statusText: `Dataset ${id} not found`,
    })
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

Route files define params via filename (e.g., `datasets.$id.tsx` creates `params.id`). Params are always strings from the URL, so convert to numbers as needed and validate early to throw errors before querying.

| Route File            | URL Example        | Params              |
| --------------------- | ------------------ | ------------------- |
| `datasets.$id.tsx`    | `/datasets/123`    | `params.id = "123"` |
| `runs.$id.tsx`        | `/runs/456`        | `params.id = "456"` |
| `depositions.$id.tsx` | `/depositions/789` | `params.id = "789"` |

**Note:** Route params identify _which_ resource. Query params (covered next) control _how_ to display it (filters, pagination, sorting).

---

## URL-Based State

The primary state mechanism is **URL query parameters** managed by Remix.

### Filter State via URL

All filters, pagination, and sorting are stored in the URL:

```
/browse-data/datasets?organism=Homo+sapiens&page=2&sort=asc
```

**Benefits:**

- Shareable links with filters applied
- Bookmarkable search results
- Browser back/forward works naturally
- SEO-friendly (server can read params)

### Comprehensive Filter Management Example

The [`useFilter`](../../../packages/data-portal/app/hooks/useFilter.ts) hook provides a typed API for filter manipulation:

```typescript
import { useFilter } from 'app/hooks/useFilter'
import { useQueryParam, useQueryParams } from 'app/hooks/useQueryParam'
import { QueryParams } from 'app/constants/query'

function DatasetFilters() {
  const filter = useFilter()

  // Read filter values (typed from URL params)
  const organismNames = filter.sampleAndExperimentConditions.organismNames
  const objectNames = filter.annotation.objectNames

  // Update single filter
  filter.updateValue(QueryParams.Organism, ['Homo sapiens'])

  // Update multiple filters atomically
  filter.updateValues({
    [QueryParams.Organism]: ['Homo sapiens'],
    [QueryParams.ObjectName]: ['ribosome'],
  })

  // Reset all filters
  filter.reset()

  // For individual params, useQueryParam provides type-safe access
  const [search, setSearch] = useQueryParam<string>(QueryParams.Search, {
    defaultValue: '',
  })

  // For related params, useQueryParams manages them together
  const [{ min, max }, setRange] = useQueryParams({
    min: QueryParams.TiltRangeMin,
    max: QueryParams.TiltRangeMax,
  })

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search datasets..."
    />
  )
}
```

### Filter State Structure

From [`useFilter.ts`](../../../packages/data-portal/app/hooks/useFilter.ts), the filter state is organized into logical sections:

```typescript
export function getFilterState(searchParams: URLSearchParams) {
  return {
    includedContents: {
      isGroundTruthEnabled:
        searchParams.get(QueryParams.GroundTruthAnnotation) === 'true',
      availableFiles: searchParams.getAll(QueryParams.AvailableFiles),
      numberOfRuns: JSON.parse(
        searchParams.get(QueryParams.NumberOfRuns) ?? 'null',
      ),
    },
    ids: {
      datasets: searchParams.getAll(QueryParams.DatasetId),
      deposition: searchParams.get(QueryParams.DepositionId),
      // ... more ID fields
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
      objectShapeTypes: searchParams.getAll(QueryParams.ObjectShapeType),
      // ... more annotation fields
    },
  }
}

export type FilterState = ReturnType<typeof getFilterState>
```

This centralized parsing handles arrays (`getAll`), booleans, and nulls. The exported `FilterState` type ensures type safety across both client and server code.

### Custom Serialization

For complex values, provide custom serialization:

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

---

## React Context

Global configuration and utilities are provided via React Context. See [`app/context/`](../../../packages/data-portal/app/context/) for all context implementations.

### Environment Context

From [`Environment.context.ts`](../../../packages/data-portal/app/context/Environment.context.ts):

```typescript
export type EnvironmentContextValue = Required<
  Pick<
    NodeJS.ProcessEnv,
    'API_URL' | 'API_URL_V2' | 'ENV' | 'LOCALHOST_PLAUSIBLE_TRACKING'
  >
>

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
  return ENV === 'prod' ? <ProductionFeature /> : <DevFeature />
}
```

Context is provided in the root layout (`app/root.tsx`), where environment values are loaded from the server and passed to the provider. This pattern makes server-side configuration available client-side without exposing it in JavaScript bundles.

### Other Contexts

The codebase includes additional contexts following the same pattern:

- **DownloadModalContext**: Manages download modal state and configuration (dataset/run/annotation downloads)
- Additional contexts in [`app/context/`](../../../packages/data-portal/app/context/)

Each context exports a typed value interface, a context with sensible defaults, and a `use*` hook that throws if used outside its provider.

---

## Jotai Atomic State

The application uses Jotai for lightweight, atomic state management of ephemeral UI state.

### Why Jotai?

| Feature                    | Benefit                                            |
| -------------------------- | -------------------------------------------------- |
| **Atomic model**           | Small, focused pieces of state                     |
| **Minimal boilerplate**    | No actions, reducers, or providers                 |
| **Automatic optimization** | Only re-renders components that read changed atoms |
| **TypeScript-first**       | Excellent type inference                           |
| **Small bundle**           | ~3KB gzipped                                       |

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

### Standard Atom Pattern

From [`annotation.ts`](../../../packages/data-portal/app/state/annotation.ts):

```typescript
import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'
import { AnnotationShape } from 'app/types/gql/runPageTypes'

// Define the atom (private, not exported)
const selectedAnnotationAtom = atom<AnnotationShape | null>(null)

// Export a custom hook that wraps the atom
export function useSelectedAnnotationShape() {
  const [selectedAnnotationShape, setSelectedAnnotationShape] = useAtom(
    selectedAnnotationAtom,
  )

  return useMemo(
    () => ({ selectedAnnotationShape, setSelectedAnnotationShape }),
    [selectedAnnotationShape, setSelectedAnnotationShape],
  )
}
```

**Usage:**

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

1. Atom defined privately (not exported directly)
2. Custom hook wraps `useAtom()` for cleaner API
3. Hook memoized to prevent unnecessary re-renders
4. TypeScript types ensure type safety

### Atom Variations

All atoms in `app/state/` follow the same pattern above. Variations include:

- **Filter history atoms** (`filterHistory.ts`): Store previous URL params as strings for "back" navigation with filters preserved
- **Sync hooks**: `useSyncParamsWithState()` keeps atoms in sync with URL state
- **Simple primitives**: Banner visibility, drawer states stored as booleans or strings

For derived values or action atoms, Jotai supports:

```typescript
// Derived atom (read-only) - computes from another atom
const selectedIdAtom = atom((get) => get(selectedAnnotationAtom)?.id ?? null)

// Action atom (write-only) - custom write logic
const clearSelectionAtom = atom(null, (get, set) => {
  set(selectedAnnotationAtom, null)
})

// Atom family - dynamic atoms for collections
const expandedFamily = atomFamily((id: number) => atom(false))
```

See Jotai documentation for advanced patterns: https://jotai.org/docs/guides/composing-atoms

---

## State Synchronization Patterns

### URL to Atom Sync

Pattern for keeping atoms in sync with URL state (used for filter history):

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
    for (const key of newParams.keys()) {
      if (
        !filters.includes(key as QueryParams) &&
        !SYSTEM_PARAMS.includes(key as QueryParams)
      ) {
        newParams.delete(key)
      }
    }
    newParams.sort()
    setParams(newParams.toString())
  }, [filters, searchParams, setParams])
}
```

**Use case:** Remember browse page filters when navigating to detail page, then restore when returning.

### Server State to Atom Hydration

Initialize atoms from server-rendered data using `useHydrateAtoms`:

```typescript
import { useHydrateAtoms } from 'jotai/utils'

function DatasetPage() {
  const loaderData = useTypedLoaderData<typeof loader>()
  useHydrateAtoms([[selectedAnnotationAtom, loaderData.defaultAnnotation]])
  return <AnnotationViewer />
}
```

---

## State Management Decision Tree

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
- Environment config → React Context
- Form input → useState
- Selected annotation → Jotai atom

---

## Best Practices

### URL State

**Do:** Use URL params for shareable state (filters, pagination), keep params human-readable, validate on server, use typed hooks.

**Don't:** Store ephemeral UI state in URL, create URLs > 2000 chars, store sensitive data in params.

### Jotai Atoms

**Do:** Keep atoms small and focused, export custom hooks (not raw atoms), memoize hook returns, use descriptive names.

**Don't:** Create giant atoms with unrelated fields, export atoms directly, use atoms for URL-appropriate state, duplicate URL state in atoms.

### React Context

**Do:** Use for global config that rarely changes, provide at highest common ancestor, throw in useContext if not in provider.

**Don't:** Use for frequently-changing state, create deeply nested providers, use context for state that could be props.

---

## Performance Considerations

**Jotai:** Automatically optimizes re-renders. Only components reading a changed atom re-render; others in the same tree don't.

**URL State:** Updates are batched by Remix and don't cause full page reloads. Multiple rapid updates create only one history entry.

**Context:** Split contexts for independent concerns to prevent unnecessary re-renders. One giant context causes all consumers to re-render on any change.

---

## Debugging

**Jotai DevTools:** Install `jotai-devtools` for atom inspection during development.

**URL State:** Inspect in browser DevTools: `Object.fromEntries(new URLSearchParams(location.search))`

**React Context:** Add console logging to context hooks for debugging value changes.

## Next Steps

- [GraphQL Integration](../02-data/01-graphql-integration.md) - Server state management with Apollo
- [Styling System](../05-styling/01-styling-system.md) - UI state and styling approaches
- [Feature Flags](../06-cross-cutting/04-feature-flags.md) - Environment-based state configuration
