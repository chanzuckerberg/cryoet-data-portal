# Deposition Data Fetching Architecture

This document describes the client-side data fetching architecture used for the Deposition feature, including API routes, React Query integration, and the layered hook system.


## Quick Reference

| Layer                | Implementation                    | Files                                                                                              |
| -------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| API Routes           | Remix loaders returning JSON      | [`routes/api.deposition-*.ts`](../../../packages/data-portal/app/routes/)                             |
| API Communication    | `fetchDepositionApi()` utility    | [`utils/deposition-api.ts`](../../../packages/data-portal/app/utils/deposition-api.ts)                |
| Query Wrapper        | `useDepositionQuery()` hook       | [`hooks/useDepositionQuery.ts`](../../../packages/data-portal/app/hooks/useDepositionQuery.ts)        |
| Domain Hooks         | Feature-specific query hooks      | [`queries/use*ForDeposition.ts`](../../../packages/data-portal/app/queries/)                          |
| Orchestration        | `useDepositionGroupedData()`      | [`hooks/useDepositionGroupedData.ts`](../../../packages/data-portal/app/hooks/useDepositionGroupedData.ts) |
| Type Definitions     | API types and endpoints           | [`types/deposition-queries.ts`](../../../packages/data-portal/app/types/deposition-queries.ts)        |

---

## Why This Architecture?

### The Problem

The Deposition feature requires fetching data from our GraphQL API on the client side for interactive filtering, pagination, and real-time updates. However, direct client-side GraphQL calls face several challenges:

1. **CORS restrictions** - The GraphQL API may not allow direct browser requests
2. **Caching complexity** - Apollo Client's cache on server-rendered pages doesn't persist to client interactions
3. **Multiple dependent queries** - Deposition pages need to orchestrate several related queries (datasets, run counts, items)

### The Solution (Current Implementation)

We use a layered architecture that routes client-side requests through Remix API routes:

```
React Component
    ↓ (calls hook)
Domain Hook (e.g., useDatasetsForDeposition)
    ↓ (uses)
useDepositionQuery (React Query wrapper)
    ↓ (calls)
fetchDepositionApi() → HTTP GET → /api/deposition-*
    ↓ (Remix loader)
API Route (server-side)
    ↓ (executes)
GraphQL Query via Apollo Client
    ↓ (returns)
JSON Response → React Query cache → Component
```

**Key benefits:**

- GraphQL queries execute server-side, avoiding CORS issues
- React Query provides client-side caching, background refetching, and loading states
- Type-safe interfaces at each layer
- Clear separation of concerns

### Historical Context & Future Direction

> **Important:** This architecture was designed under time constraints as a pragmatic solution to get the Deposition feature working.

**Ideal future refactor:** The preferred approach would be to set up a GraphQL proxy and use Apollo Client directly from the frontend for client-side queries, similar to how server-side rendering works. This would:

- Eliminate the API wrapper layer entirely
- Leverage Apollo's built-in caching and query deduplication
- Reduce code complexity and maintenance burden
- Provide a consistent data-fetching pattern across the app

**Guidance for developers:** The current implementation works well, but avoid over-investing in extending this pattern. If building new features that need client-side GraphQL, consider whether it's time to implement the GraphQL proxy approach instead.

---

## Layer 1: API Routes

### Overview

Remix API routes serve as the server-side boundary between client code and GraphQL. Each route:

1. Parses and validates URL parameters
2. Executes GraphQL queries via Apollo Client
3. Returns JSON responses

### Available Routes

| Route                              | Purpose                                  | Parameters                        |
| ---------------------------------- | ---------------------------------------- | --------------------------------- |
| `/api/deposition-datasets`         | Get datasets for a deposition            | `depositionId`, `type`            |
| `/api/deposition-anno-runs`        | Get annotation runs for a dataset        | `depositionId`, `datasetId`, `page` |
| `/api/deposition-tomo-runs`        | Get tomogram runs for a dataset          | `depositionId`, `datasetId`, `page` |
| `/api/deposition-run-counts`       | Get annotation run counts per dataset    | `depositionId`, `datasetIds`      |
| `/api/deposition-tomo-run-counts`  | Get tomogram run counts per dataset      | `depositionId`, `datasetIds`      |
| `/api/annotations-for-run`         | Get annotations for a specific run       | `depositionId`, `runId`, `page`   |
| `/api/tomograms-for-run`           | Get tomograms for a specific run         | `depositionId`, `runId`, `page`   |

### Implementation Pattern

```typescript
// routes/api.deposition-datasets.ts
import { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { getDatasetsForDepositionViaAnnotationShapes } from 'app/graphql/getDatasetsForDepositionV2.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionId = url.searchParams.get('depositionId')
  const type = url.searchParams.get('type')

  // 1. Validate parameters
  if (!depositionId || Number.isNaN(Number(depositionId))) {
    return new Response('Missing or invalid depositionId', { status: 400 })
  }

  try {
    // 2. Execute GraphQL query server-side
    const { data } = await getDatasetsForDepositionViaAnnotationShapes(
      Number(depositionId)
    )

    // 3. Transform and return JSON
    const response = {
      datasets: data.datasets,
      organismCounts: data.organismCounts,
    }

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Failed to fetch datasets:', error)
    return new Response('Failed to fetch datasets', { status: 500 })
  }
}
```

---

## Layer 2: API Communication Utilities

### fetchDepositionApi()

The core utility for making API requests with validation and error handling:

```typescript
// utils/deposition-api.ts
export async function fetchDepositionApi<T>(
  endpoint: DepositionApiEndpoint,
  params: Record<string, string | number | boolean | string[] | undefined>,
  requiredFields: string[] = [],
): Promise<T> {
  // Validate required parameters
  validateRequiredParams(params, requiredFields)

  // Build URL and make request
  const url = buildApiUrl(endpoint, params)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
```

### Endpoint Mapping

All API endpoints are centralized in type definitions:

```typescript
// types/deposition-queries.ts
export const API_ENDPOINTS = {
  annotationsForRun: '/api/annotations-for-run',
  tomogramsForRun: '/api/tomograms-for-run',
  depositionDatasets: '/api/deposition-datasets',
  depositionAnnoRuns: '/api/deposition-anno-runs',
  depositionTomoRuns: '/api/deposition-tomo-runs',
  depositionRunCounts: '/api/deposition-run-counts',
  depositionTomoRunCounts: '/api/deposition-tomo-run-counts',
} as const
```

### Query Key Factory

Creates consistent cache keys for React Query:

```typescript
// utils/deposition-api.ts
export function createQueryKey(
  prefix: string,
  ...values: (string | number | boolean | undefined | null)[]
): (string | number | boolean | undefined | null)[] {
  return [prefix, ...values]
}
```

### Query Enablement Helper

Prevents queries from running with missing parameters:

```typescript
// utils/deposition-api.ts
export function shouldEnableQuery(
  requiredParams: Record<string, unknown>,
  enabled: boolean = true,
): boolean {
  if (!enabled) return false

  return Object.values(requiredParams).every(
    (value) => value !== undefined && value !== null,
  )
}
```

---

## Layer 3: React Query Wrapper Hooks

### useDepositionQuery

A generic wrapper that standardizes React Query usage for deposition data:

```typescript
// hooks/useDepositionQuery.ts
interface DepositionQueryConfig<TData, TParams> {
  endpoint: DepositionApiEndpoint
  queryKeyPrefix: string
  requiredFields?: string[]
  transformResponse?: (data: unknown) => TData
  getQueryKeyValues?: (params: TParams) => (string | number | undefined)[]
  getApiParams?: (params: TParams) => Record<string, unknown>
  getRequiredParams?: (params: TParams) => Record<string, unknown>
}

export function useDepositionQuery<TData, TParams extends BaseQueryParams>(
  config: DepositionQueryConfig<TData, TParams>,
  params: TParams,
): UseQueryResult<TData, Error> {
  // Build query key from config
  const queryKey = createQueryKey(config.queryKeyPrefix, ...queryKeyValues)

  // Determine if query should run
  const isEnabled = shouldEnableQuery(requiredParams, params.enabled)

  return useQuery({
    queryKey,
    queryFn: async () => {
      const data = await fetchDepositionApi(config.endpoint, apiParams)
      return config.transformResponse ? config.transformResponse(data) : data
    },
    enabled: isEnabled,
  })
}
```

### usePaginatedDepositionQuery

A specialized variant for paginated queries that includes page number in the cache key:

```typescript
// hooks/useDepositionQuery.ts
export function usePaginatedDepositionQuery<
  TData,
  TParams extends BaseQueryParams & { page?: number },
>(config, params): UseQueryResult<TData, Error> {
  // Automatically includes page in query key
  const defaultGetQueryKeyValues = (queryParams) => [
    queryParams.depositionId,
    queryParams.page ?? 1,
    // ...other params
  ]

  return useDepositionQuery({ ...config, getQueryKeyValues }, params)
}
```

---

## Layer 4: Domain-Specific Query Hooks

Domain hooks provide feature-specific interfaces built on top of `useDepositionQuery`.

### useDatasetsForDeposition

Fetches datasets for a deposition with derived data:

```typescript
// queries/useDatasetsForDeposition.ts
export function useDatasetsForDeposition(enabled: boolean = true) {
  const depositionId = useDepositionId()
  const [type] = useActiveDepositionDataType()

  const query = useDepositionQuery<DepositionDatasetsResponse, {...}>(
    {
      endpoint: 'depositionDatasets',
      queryKeyPrefix: 'deposition-datasets',
      getQueryKeyValues: (params) => [params.depositionId, params.type],
      getApiParams: (params) => ({
        depositionId: params.depositionId,
        ...(params.type && { type: params.type }),
      }),
      getRequiredParams: (params) => ({
        depositionId: params.depositionId,
      }),
    },
    { depositionId, type, enabled },
  )

  // Derive additional data from response
  const organismNames = useMemo(() => {
    return [...new Set(query.data?.datasets.map(d => d.organismName))].sort()
  }, [query.data?.datasets])

  return {
    ...query,
    datasets: query.data?.datasets || [],
    organismNames,
    organismCounts: query.data?.organismCounts || {},
  }
}
```

### Other Domain Hooks

- **`useDepositionRunsForDataset()`** - Fetches paginated runs for a dataset
- **`useItemsForRunAndDeposition()`** - Fetches annotations or tomograms for a run

---

## Layer 5: State Orchestration

### useDepositionGroupedData

Orchestrates multiple queries and provides unified data for the Deposition page:

```typescript
// hooks/useDepositionGroupedData.ts
export function useDepositionGroupedData(
  options: DepositionGroupedDataOptions = {},
): DepositionGroupedDataResult {
  const depositionId = useDepositionId()
  const [groupBy] = useGroupBy()
  const [type] = useActiveDepositionDataType()

  // Get filter state
  const { ids: { datasets: selectedDatasetIds } } = useFilter()

  // Fetch datasets
  const datasetsQuery = useDatasetsForDeposition(enabled)

  // Extract dataset IDs for dependent query
  const datasetIds = useMemo(() => {
    return datasetsQuery.datasets?.map((d) => d.id) || []
  }, [datasetsQuery.datasets])

  // Fetch run counts (depends on datasets)
  const runCountsQuery = useDepositionQuery<RunCountsResponse, {...>({
    endpoint: countsEndpoint,
    // ...config
  }, {
    depositionId,
    datasetIds,
    enabled: enabled && datasetIds.length > 0, // Only run when we have IDs
  })

  // Transform and aggregate data
  const result = useMemo(() => {
    // Filter datasets based on selection
    // Merge counts from multiple queries
    // Calculate totals
    return {
      datasets: datasetsWithCounts,
      organisms,
      counts,
      isLoading,
      error,
    }
  }, [datasetsQuery, runCountsQuery, selectedDatasetIds])

  return result
}
```

---

## Type System

### Parameter Types

```typescript
// types/deposition-queries.ts
export interface BaseDepositionQueryParams {
  depositionId: number | undefined
  enabled?: boolean
}

export interface PaginatedQueryParams extends BaseDepositionQueryParams {
  page?: number
  pageSize?: number
}

export interface DatasetParams extends BaseDepositionQueryParams {
  datasetId: number | undefined
  page: number
}
```

### Response Types

```typescript
// types/deposition-queries.ts
export interface DepositionDatasetsResponse {
  datasets: DatasetOption[]
  organismCounts: Record<string, number>
  annotationCounts: Record<number, number>
  tomogramCounts: Record<number, number>
}

export interface RunCountsResponse {
  runCounts: Record<number, number>
}
```

### Content Type Enum

```typescript
// types/deposition-queries.ts
export enum DataContentsType {
  Annotations = 'annotations',
  Tomograms = 'tomograms',
}
```

---

## Common Patterns

### Conditional Fetching

Only fetch when required parameters are available:

```typescript
const query = useDepositionQuery(config, {
  depositionId,
  enabled: depositionId !== undefined,
})
```

### Dependent Queries

Fetch data that depends on results from another query:

```typescript
// First query
const datasetsQuery = useDatasetsForDeposition()

// Extract IDs for second query
const datasetIds = datasetsQuery.datasets?.map(d => d.id) || []

// Second query - only runs when first completes
const countsQuery = useDepositionQuery(config, {
  datasetIds,
  enabled: datasetIds.length > 0,
})
```

### Response Transformation

Transform API responses before they reach components:

```typescript
useDepositionQuery({
  transformResponse: (data) => {
    // Normalize, filter, or reshape data
    return {
      ...data,
      datasets: data.datasets.filter(d => d.active),
    }
  },
}, params)
```

---

## Adding a New Deposition Query

### Step-by-Step Guide

1. **Add endpoint to `API_ENDPOINTS`** in `types/deposition-queries.ts`:

   ```typescript
   export const API_ENDPOINTS = {
     // existing endpoints...
     depositionNewData: '/api/deposition-new-data',
   } as const
   ```

2. **Add query key prefix** to `QUERY_KEY_PREFIXES`:

   ```typescript
   export const QUERY_KEY_PREFIXES = {
     // existing prefixes...
     depositionNewData: 'deposition-new-data',
   } as const
   ```

3. **Define TypeScript interfaces** for params and response:

   ```typescript
   export interface NewDataParams extends BaseDepositionQueryParams {
     someParam: string
   }

   export interface NewDataResponse {
     items: NewDataItem[]
   }
   ```

4. **Create API route** in `routes/api.deposition-new-data.ts`:

   ```typescript
   export async function loader({ request }: LoaderFunctionArgs) {
     // Parse params, call GraphQL, return JSON
   }
   ```

5. **Create GraphQL server function** in `graphql/getNewData.server.ts`

6. **Create domain hook** in `queries/useNewDataForDeposition.ts`:

   ```typescript
   export function useNewDataForDeposition(enabled = true) {
     const depositionId = useDepositionId()

     return useDepositionQuery<NewDataResponse, NewDataParams>({
       endpoint: 'depositionNewData',
       queryKeyPrefix: 'deposition-new-data',
       // ...config
     }, { depositionId, enabled })
   }
   ```

---

## Related Documentation

- [MDX Content System](./05-mdx-content-system.md) - Static content rendering patterns
- [State Management](../03-state/01-state-management.md) - Jotai atoms and React state
- [Hooks Guide](../06-cross-cutting/03-hooks-guide.md) - General hooks patterns
- [API Routes Reference](../../04-reference/06-api-routes.md) - Complete API routes listing
