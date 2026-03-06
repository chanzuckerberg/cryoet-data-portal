# GraphQL Integration

This document covers the GraphQL integration in the CryoET Data Portal frontend, including Apollo Client setup, code generation configuration, query patterns, fragment composition, and server-side rendering strategies.


## Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| Apollo Client | [`apollo.server.ts`](../../../packages/data-portal/app/apollo.server.ts) | GraphQL client with SSR support |
| Codegen Config | [`codegen.ts`](../../../packages/data-portal/codegen.ts) | Type generation from schema |
| Queries | [`app/graphql/`](../../../packages/data-portal/app/graphql/) | GraphQL queries and server utilities |
| Fragments | [`app/graphql/fragments/`](../../../packages/data-portal/app/graphql/fragments/) | Reusable query fragments |
| Generated Types | [`app/__generated_v2__/`](../../../packages/data-portal/app/__generated_v2__/) | Auto-generated TypeScript types |
| Schema URL | `API_URL_V2` env var | GraphQL endpoint configuration |

---

## Apollo Client Setup

The application uses Apollo Client configured for server-side rendering with a no-cache strategy.

### Configuration

From [`apollo.server.ts`](../../../packages/data-portal/app/apollo.server.ts):

```typescript
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

export const apolloClientV2 = new ApolloClient({
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: process.env.API_URL_V2 ?? ENVIRONMENT_CONTEXT_DEFAULT_VALUE.API_URL_V2,
  }),
})
```

### Key Configuration Decisions

| Setting | Value | Rationale |
|---------|-------|-----------|
| `ssrMode` | `true` | Enables server-side rendering support |
| `fetchPolicy` | `'no-cache'` | Data is server-rendered once per request; no client-side caching needed |
| `uri` | `process.env.API_URL_V2` | Configurable endpoint via environment variable |

**Why no-cache?**
- All data fetching happens server-side in Remix loaders
- Pages are server-rendered on each request
- Eliminates cache invalidation complexity
- Reduces client-side bundle size

### Environment Configuration

The GraphQL endpoint is configured via the `API_URL_V2` environment variable:

```bash
# .env
API_URL_V2=https://graphql.cryoetdataportal.czscience.com/graphql
ENV=local
```

Default values are provided in [`Environment.context.ts`](../../../packages/data-portal/app/context/Environment.context.ts):

```typescript
export const ENVIRONMENT_CONTEXT_DEFAULT_VALUE: EnvironmentContextValue = {
  API_URL_V2: 'https://graphql.cryoetdataportal.czscience.com/graphql',
  ENV: 'local',
  // ...
}
```

---

## GraphQL Code Generation

The project uses GraphQL Code Generator to automatically generate TypeScript types from the GraphQL schema.

### Configuration

From [`codegen.ts`](../../../packages/data-portal/codegen.ts):

```typescript
import { CodegenConfig } from '@graphql-codegen/cli'

const SCHEMA_URL_V2 =
  process.env.API_URL_V2 ||
  'https://graphql.cryoetdataportal.czscience.com/graphql'

const config: CodegenConfig = {
  generates: {
    './app/__generated_v2__/': {
      schema: SCHEMA_URL_V2,
      documents: [
        'app/**/*V2*.{ts,tsx}',
        'app/routes/_index.tsx',
        'app/routes/browse-data.tsx',
      ],
      preset: 'client',
      plugins: [],

      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },

      config: {
        scalars: {
          DateTime: 'string',
          numeric: 'number',
          _numeric: 'number[][]',
        },
      },
    },
  },
  ignoreNoDocuments: true,
}
```

### Key Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `schema` | `SCHEMA_URL_V2` | Fetches schema from live GraphQL endpoint |
| `documents` | `app/**/*V2*.{ts,tsx}` | Files containing GraphQL queries to process |
| `preset` | `'client'` | Generates types optimized for client usage |
| `fragmentMasking` | `false` | Disables fragment masking for simpler type inference |
| `scalars` | Custom mappings | Maps GraphQL scalars to TypeScript types |

**Why fragment masking is disabled:**
- Simplifies type usage without needing to unwrap fragment results
- Reduces TypeScript complexity
- All fragment fields are directly accessible on parent types

### Scalar Type Mappings

| GraphQL Type | TypeScript Type | Example |
|-------------|-----------------|---------|
| `DateTime` | `string` | `"2024-01-15T10:30:00Z"` |
| `numeric` | `number` | `42.5` |
| `_numeric` | `number[][]` | `[[1, 2], [3, 4]]` |

### Commands

```bash
# Generate types once
pnpm data-portal build:codegen

# Watch mode (auto-regenerate on schema changes)
pnpm data-portal dev:codegen

# Full dev server (includes codegen watch)
pnpm data-portal dev
```

### Generated Files

The codegen process creates files in [`app/__generated_v2__/`](../../../packages/data-portal/app/__generated_v2__/):

```
app/__generated_v2__/
├── graphql.ts              # All GraphQL types and query types
├── gql.ts                  # gql tag function
├── fragment-masking.ts     # Fragment masking utilities (unused)
└── index.ts                # Public exports
```

Example generated query type:

```typescript
export type GetDatasetsV2Query = {
  __typename?: 'Query'
  datasets: Array<{
    __typename?: 'Dataset'
    id: number
    title: string
    organismName?: string | null
    // ... more fields
  }>
  filteredDatasetsCount: {
    aggregate: Array<{ count: number }>
  }
}
```

---

## Query Organization

GraphQL queries are colocated with their usage in server-side utilities.

### File Naming Convention

Queries intended for server-side use follow the `*.server.ts` naming convention:

```
app/graphql/
├── common.ts                           # Shared filter utilities
├── getDatasetsV2.server.ts             # Browse datasets query
├── getDatasetByIdV2.server.ts          # Single dataset query
├── getBrowseDepositionsV2.server.ts    # Browse depositions query
├── getDepositionByIdV2.server.ts       # Single deposition query
├── getRunByIdV2.server.ts              # Single run query
└── fragments/
    ├── getDatasetsAggregatesV2.server.ts
    └── getDataContentsV2.server.ts
```

**`.server.ts` suffix benefits:**
- Remix automatically excludes these files from client bundles
- Reduces client JavaScript payload
- Clear separation of server-only code

### Query Pattern

From [`getDatasetsV2.server.ts`](../../../packages/data-portal/app/graphql/getDatasetsV2.server.ts):

```typescript
import { gql } from 'app/__generated_v2__'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { GetDatasetsV2Query, OrderBy } from 'app/__generated_v2__/graphql'

// Define query with gql tag
const GET_DATASETS_QUERY = gql(`
  query GetDatasetsV2(
    $limit: Int,
    $offset: Int,
    $orderBy: [DatasetOrderByClause!]!,
    $datasetsFilter: DatasetWhereClause!,
  ) {
    datasets(
      where: $datasetsFilter
      orderBy: $orderBy,
      limitOffset: {
        limit: $limit,
        offset: $offset
      }
    ) {
      id
      title
      organismName
      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
          }
        }
      }
    }

    ...DatasetsAggregates
  }
`)

// Export typed function
export async function getDatasetsV2({
  page,
  titleOrderDirection,
  searchText,
  params = new URLSearchParams(),
  client,
}: {
  page: number
  titleOrderDirection?: OrderBy
  searchText?: string
  params?: URLSearchParams
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetsV2Query>> {
  const filterState = getFilterState(params)
  const datasetsFilter = getDatasetsFilter({
    filterState,
    searchText,
  })

  return client.query({
    query: GET_DATASETS_QUERY,
    variables: {
      datasetsFilter,
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      orderBy: titleOrderDirection
        ? [{ title: titleOrderDirection }, { releaseDate: OrderBy.Desc }]
        : [{ releaseDate: OrderBy.Desc }, { title: OrderBy.Asc }],
    },
  })
}
```

**Key patterns:**
1. Query defined with `gql` tag for type generation
2. Exported function wraps Apollo Client call
3. Function accepts client as parameter (dependency injection)
4. Returns strongly-typed `ApolloQueryResult`
5. Business logic (filters, pagination) handled in function

### Usage in Remix Loaders

From [`browse-data.datasets.tsx`](../../../packages/data-portal/app/routes/browse-data.datasets.tsx):

```typescript
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { apolloClientV2 } from 'app/apollo.server'
import { getDatasetsV2 } from 'app/graphql/getDatasetsV2.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')

  const { data: responseV2 } = await getDatasetsV2({
    page,
    params: url.searchParams,
    client: apolloClientV2,
  })

  return json({ v2: responseV2 })
}
```

---

## Fragment Composition

Fragments enable query reusability and reduce duplication.

### Shared Fragment Pattern

From [`getDatasetsAggregatesV2.server.ts`](../../../packages/data-portal/app/graphql/fragments/getDatasetsAggregatesV2.server.ts):

```typescript
import { gql } from 'app/__generated_v2__'

/**
 * Shares aggregate queries between datasets and deposition pages.
 *
 * Parent query must define the following variables:
 * - $datasetsFilter: DatasetWhereClause
 * - $datasetsByDepositionFilter: DatasetWhereClause
 * - $tiltseriesByDepositionFilter: TiltseriesWhereClause
 * ...
 */
export const GET_DATASETS_AGGREGATES_FRAGMENT = gql(`
  fragment DatasetsAggregates on Query {
    filteredDatasetsCount: datasetsAggregate(where: $datasetsFilter) {
      aggregate {
        count
      }
    }
    totalDatasetsCount: datasetsAggregate(where: $datasetsByDepositionFilter) {
      aggregate {
        count
      }
    }

    distinctOrganismNames: datasetsAggregate(where: $datasetsByDepositionFilter) {
      aggregate {
        count
        groupBy {
          organismName
        }
      }
    }
    // ... more aggregates
  }
`)
```

### Using Fragments

In parent query:

```typescript
const GET_DATASETS_QUERY = gql(`
  query GetDatasetsV2(
    $datasetsFilter: DatasetWhereClause!,
    $datasetsByDepositionFilter: DatasetWhereClause,
    # ... other variables
  ) {
    datasets(where: $datasetsFilter) {
      id
      title
    }

    ...DatasetsAggregates
  }
`)
```

**Benefits:**
- DRY: Aggregates used by both datasets and depositions pages
- Consistency: Same counts across pages
- Maintainability: Update in one place

---

## Filter Construction

Complex filter logic is centralized in [`common.ts`](../../../packages/data-portal/app/graphql/common.ts).

### Filter Builder Pattern

```typescript
import { DatasetWhereClause } from 'app/__generated_v2__/graphql'
import { FilterState } from 'app/hooks/useFilter'

export interface GetDatasetsFilterParams {
  filterState: FilterState
  depositionId?: number
  searchText?: string
  aggregatedDatasetIds?: number[]
  isIdentifiedObjectsEnabled?: boolean
}

export function getDatasetsFilter({
  filterState,
  depositionId,
  searchText,
  aggregatedDatasetIds,
  isIdentifiedObjectsEnabled = false,
}: GetDatasetsFilterParams): DatasetWhereClause {
  const where: DatasetWhereClause = {}

  // Search by Dataset Name
  if (searchText) {
    where.title = {
      _ilike: `%${searchText}%`,
    }
  }

  // Filter by organism
  const { organismNames } = filterState.sampleAndExperimentConditions
  if (organismNames.length > 0) {
    where.organismName = {
      _in: organismNames,
    }
  }

  // Filter by annotation object names
  if (filterState.annotation.objectNames.length > 0) {
    where.runs = {
      annotations: {
        objectName: {
          _in: filterState.annotation.objectNames,
        },
      },
    }
  }

  // ... more filter conditions

  return where
}
```

**Key patterns:**
1. Progressive filter building (add conditions as needed)
2. Nested filters for related entities (runs, annotations)
3. Type safety via generated `DatasetWhereClause` type
4. Handles complex scenarios (multi-table search, feature flags)

### Multi-Table Search Example

For advanced features like searching across both `annotations` and `identifiedObjects` tables:

```typescript
// Helper to create separate filters for each table
export function createAnnotationVsIdentifiedObjectFilters(
  filterState: FilterState,
) {
  const annotationFilter = {
    ...filterState,
    annotation: {
      ...filterState.annotation,
    },
  }

  const identifiedObjectFilter = {
    ...filterState,
    annotation: {
      ...filterState.annotation,
      _searchIdentifiedObjectsOnly: true,
    },
  }

  return { annotationFilter, identifiedObjectFilter }
}

// In query function:
const { annotationFilter, identifiedObjectFilter } =
  createAnnotationVsIdentifiedObjectFilters(filterState)

const [resultsWithAnnotations, resultsWithIdentifiedObjects] =
  await Promise.all([
    client.query({ query: GET_DATASETS_QUERY, variables: { datasetsFilter: getDatasetsFilter({ filterState: annotationFilter }) } }),
    client.query({ query: GET_DATASETS_QUERY, variables: { datasetsFilter: getDatasetsFilter({ filterState: identifiedObjectFilter }) } }),
  ])

// Merge and dedupe results
const unionDatasets = dedupeById([
  ...resultsWithAnnotations.data.datasets,
  ...resultsWithIdentifiedObjects.data.datasets,
])
```

---

## Type Safety

GraphQL Codegen ensures end-to-end type safety from schema to UI.

### Query Type Flow

```
GraphQL Schema
    ↓ (codegen)
Generated Types (app/__generated_v2__/graphql.ts)
    ↓ (import)
Query Definition (app/graphql/*.server.ts)
    ↓ (export typed function)
Remix Loader (app/routes/*.tsx)
    ↓ (json() return)
useTypedLoaderData Hook
    ↓ (type assertion)
Component Props
```

### Example Type Flow

```typescript
// 1. Generated type
export type GetDatasetByIdV2Query = {
  datasets: Array<{
    id: number
    title: string
  }>
}

// 2. Typed query function
export async function getDatasetByIdV2(): Promise<ApolloQueryResult<GetDatasetByIdV2Query>> {
  return client.query({ query: GET_DATASET_QUERY })
}

// 3. Loader with type
export async function loader() {
  const { data } = await getDatasetByIdV2()
  return json({ v2: data })
}

// 4. Component with type
export default function DatasetPage() {
  const { v2 } = useTypedLoaderData<{ v2: GetDatasetByIdV2Query }>()
  //    ^-- Fully typed!
}
```

### Custom Hook Pattern

For cleaner component code, wrap loader data in custom hooks:

From [`useDatasetById.ts`](../../../packages/data-portal/app/hooks/useDatasetById.ts):

```typescript
import { useTypedLoaderData } from 'remix-typedjson'
import { GetDatasetByIdV2Query } from 'app/__generated_v2__/graphql'

export function useDatasetById() {
  const { v2 } = useTypedLoaderData<{
    v2: GetDatasetByIdV2Query
  }>()

  const dataset = v2.datasets[0]
  const runs = v2.runs

  // Derive additional data with full type safety
  const objectNames = Array.from(
    new Set(
      v2.annotationsAggregate.aggregate
        ?.map((aggregate) => aggregate.groupBy?.objectName)
        .filter((name): name is string => name !== null && name !== undefined)
        ?? []
    ),
  )

  return {
    dataset,
    runs,
    objectNames,
    // ... more derived data
  }
}
```

---

## Server-Side Rendering

All GraphQL queries execute server-side for optimal performance and SEO.

### SSR Flow

1. **Request arrives** → Remix loader executes on server
2. **GraphQL query** → Apollo Client fetches from API
3. **Data returned** → Loader serializes to JSON
4. **HTML rendered** → Remix renders React components with data
5. **Response sent** → Client receives fully-rendered HTML + data

### Benefits

| Benefit | Description |
|---------|-------------|
| **Performance** | Data fetching doesn't block initial page render |
| **SEO** | Search engines see fully-rendered content |
| **No waterfalls** | All data fetched in parallel on server |
| **Smaller bundles** | No GraphQL client code in browser |

### No Client-Side Queries

Unlike traditional Apollo Client setups, this app has **zero client-side GraphQL queries**:

```typescript
// ❌ Never used in this codebase
import { useQuery } from '@apollo/client'

// ✅ Always use server-side loaders
export async function loader() {
  const { data } = await apolloClientV2.query({ ... })
  return json(data)
}
```

**Why?**
- Portal is read-only (no mutations)
- All navigation triggers new loader calls
- Simpler mental model
- Better performance (no client-side loading states)

---

## Best Practices

### Query Organization

✅ **Do:**
- Place queries in `app/graphql/*.server.ts`
- Export typed functions that wrap Apollo Client calls
- Use fragments for shared query sections
- Document required variables for fragments

❌ **Don't:**
- Define queries directly in route files
- Use client-side `useQuery` hooks
- Duplicate aggregate queries across files

### Type Safety

✅ **Do:**
- Run codegen before writing queries (`pnpm data-portal build:codegen`)
- Use generated types in function signatures
- Leverage TypeScript strict mode
- Create custom hooks for complex loader data

❌ **Don't:**
- Use `any` types for query results
- Skip codegen when schema changes
- Manually write GraphQL result types

### Performance

✅ **Do:**
- Fetch only needed fields
- Use pagination for large result sets
- Leverage parallel queries with `Promise.all`
- Return minimal data from loaders

❌ **Don't:**
- Over-fetch with `select *` style queries
- Fetch all pages at once
- Make sequential queries when parallel is possible
- Send huge JSON payloads to client

---

## Troubleshooting

### Codegen Issues

**Problem:** Types not updating after schema changes

**Solution:**
```bash
# Kill dev server, regenerate types, restart
pnpm data-portal build:codegen
pnpm data-portal dev
```

**Problem:** "Cannot find name 'gql'" error

**Solution:** Run codegen to generate the `gql` function:
```bash
pnpm data-portal build:codegen
```

### Query Errors

**Problem:** "Field doesn't exist on type" error

**Solution:** Schema may have changed. Regenerate types:
```bash
pnpm data-portal build:codegen
```

**Problem:** Query returns empty results

**Solution:** Check filter logic in `common.ts` and verify variables in GraphQL Playground

### Type Errors

**Problem:** Type mismatch in loader data

**Solution:** Ensure loader return type matches `useTypedLoaderData` type assertion

## Next Steps

- [State Management](../03-state/01-state-management.md) - Managing UI state with Jotai and URL state
- [Styling System](../05-styling/01-styling-system.md) - Tailwind, CSS Modules, and MUI integration
- [Remix Fundamentals](../01-routing/01-remix-fundamentals.md) - Server-side rendering and routing patterns
