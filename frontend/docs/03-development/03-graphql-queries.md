# GraphQL Queries

This guide covers writing GraphQL queries, generating TypeScript types, and using the Apollo Client in the CryoET Data Portal frontend.


## Quick Reference

| Task | Command |
|------|---------|
| Generate types once | `pnpm data-portal build:codegen` |
| Watch mode during dev | `pnpm data-portal dev:codegen` |
| Full dev server (includes codegen) | `pnpm dev` |

**GraphQL endpoint:** Configured via `API_URL_V2` environment variable

**Generated types location:** `app/__generated_v2__/`

---

## GraphQL Setup Overview

The portal uses:

- **Apollo Client** for GraphQL queries
- **GraphQL Code Generator** to create TypeScript types from queries
- **Server-side rendering** - queries run in Remix loaders

**Configuration file:** `/packages/data-portal/codegen.ts`

```typescript
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
      presetConfig: {
        fragmentMasking: false,  // Simpler type access
      },
      config: {
        scalars: {
          DateTime: 'string',
          numeric: 'number',
        },
      },
    },
  },
}
```

**Key decisions:**
- Fragment masking disabled for simpler type inference
- Custom scalar mappings (DateTime → string, numeric → number)
- Server-only queries have `.server.ts` suffix

---

## Step-by-Step: Creating a GraphQL Query

### 1. Create a Query File

Create a `.server.ts` file in `app/graphql/`:

**File:** `/packages/data-portal/app/graphql/getDatasetByIdV2.server.ts`

```typescript
import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetDatasetByIdV2Query,
  DatasetWhereClause,
} from 'app/__generated_v2__/graphql'

const GET_DATASET_BY_ID_QUERY_V2 = gql(`
  query GetDatasetByIdV2(
    $id: Int,
    $runLimit: Int,
    $runOffset: Int,
    $runFilter: RunWhereClause,
  ) {
    datasets(where: { id: { _eq: $id } }) {
      id
      title
      description
      keyPhotoUrl
      releaseDate

      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
            email
            orcid
            primaryAuthorStatus
          }
        }
      }

      runsAggregate {
        aggregate {
          count
        }
      }
    }

    runs(
      where: $runFilter,
      orderBy: { name: asc },
      limitOffset: {
        limit: $runLimit,
        offset: $runOffset
      }
    ) {
      id
      name
      tomograms(first: 1, where: { isVisualizationDefault: { _eq: true } }) {
        edges {
          node {
            id
            keyPhotoThumbnailUrl
          }
        }
      }
    }
  }
`)

export async function getDatasetByIdV2({
  client,
  id,
  page = 1,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  page?: number
}): Promise<ApolloQueryResult<GetDatasetByIdV2Query>> {
  return client.query({
    query: GET_DATASET_BY_ID_QUERY_V2,
    variables: {
      id,
      runLimit: 25,
      runOffset: (page - 1) * 25,
      runFilter: { datasetId: { _eq: id } },
    },
  })
}
```

**Key patterns from `/packages/data-portal/app/graphql/getDatasetByIdV2.server.ts`:**
- Use `gql` tagged template from generated types
- Define query variables with proper types
- Export async function that calls `client.query()`
- Return typed `ApolloQueryResult<T>`

### 2. Name Your Query

Use descriptive names with the `V2` suffix:

```graphql
query GetDatasetByIdV2($id: Int) {
  # Query fields
}
```

**Naming conventions:**
- Action + Resource + V2: `GetDatasetByIdV2`, `GetRunsV2`
- Pluralize for lists: `GetDatasetsV2`, `GetAnnotationsV2`
- Include V2 to distinguish from older API versions

### 3. Generate TypeScript Types

Run the code generator:

```bash
# One-time generation
pnpm data-portal build:codegen

# Watch mode (auto-regenerate on file changes)
pnpm data-portal dev:codegen

# Or start full dev server (includes codegen)
pnpm dev
```

This creates type files in `app/__generated_v2__/`:

```typescript
// Auto-generated types
export type GetDatasetByIdV2Query = {
  __typename?: 'Query'
  datasets: Array<{
    __typename?: 'Dataset'
    id: number
    title: string
    description?: string | null
    // ... more fields
  }>
  runs: Array<{
    __typename?: 'Run'
    id: number
    name: string
    // ... more fields
  }>
}
```

### 4. Use Query in a Loader

Import and use your query function in a Remix loader:

**File:** `/packages/data-portal/app/routes/datasets.$id.tsx`

```typescript
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { apolloClientV2 } from 'app/apollo.server'
import { getDatasetByIdV2 } from 'app/graphql/getDatasetByIdV2.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const url = new URL(request.url)
  const page = +(url.searchParams.get('page') ?? '1')

  const { data } = await getDatasetByIdV2({
    id,
    page,
    client: apolloClientV2,
  })

  if (data.datasets.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Dataset with ID ${id} not found`,
    })
  }

  return json({
    dataset: data.datasets[0],
    runs: data.runs,
  })
}
```

### 5. Access Data in Component

Use `useLoaderData` with type inference:

```typescript
import { useLoaderData } from '@remix-run/react'

export default function DatasetPage() {
  const { dataset, runs } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>{dataset.title}</h1>
      <p>{dataset.description}</p>

      <h2>Runs ({runs.length})</h2>
      <ul>
        {runs.map((run) => (
          <li key={run.id}>{run.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## GraphQL Query Patterns

### Basic Query with Variables

```typescript
const GET_DATASETS_QUERY_V2 = gql(`
  query GetDatasetsV2($limit: Int, $offset: Int) {
    datasets(
      limitOffset: { limit: $limit, offset: $offset }
      orderBy: { releaseDate: desc }
    ) {
      id
      title
      description
    }
  }
`)
```

### Query with Filtering

```typescript
const GET_FILTERED_RUNS_QUERY_V2 = gql(`
  query GetFilteredRunsV2($filter: RunWhereClause) {
    runs(
      where: $filter
      orderBy: { name: asc }
    ) {
      id
      name
      annotations {
        id
        objectName
      }
    }
  }
`)

// Usage
const { data } = await client.query({
  query: GET_FILTERED_RUNS_QUERY_V2,
  variables: {
    filter: {
      datasetId: { _eq: 123 },
      annotations: {
        objectName: { _in: ['ribosome', 'membrane'] }
      }
    }
  }
})
```

### Query with Aggregations

```typescript
const GET_DATASET_STATS_QUERY_V2 = gql(`
  query GetDatasetStatsV2($id: Int) {
    datasets(where: { id: { _eq: $id } }) {
      id
      title

      runsAggregate {
        aggregate {
          count
        }
      }

      annotationsAggregate {
        aggregate {
          count
          groupBy {
            objectName
          }
        }
      }
    }
  }
`)
```

### Query with Nested Relationships

```typescript
const GET_DATASET_WITH_RUNS_QUERY_V2 = gql(`
  query GetDatasetWithRunsV2($id: Int) {
    datasets(where: { id: { _eq: $id } }) {
      id
      title

      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
            affiliationName
          }
        }
      }

      runs(first: 10) {
        id
        name
        tomograms(where: { isVisualizationDefault: { _eq: true } }) {
          edges {
            node {
              id
              keyPhotoThumbnailUrl
            }
          }
        }
      }
    }
  }
`)
```

### Query with Fragments

```typescript
// Define fragment
const DATASET_CORE_FIELDS_FRAGMENT = gql(`
  fragment DatasetCoreFields on Dataset {
    id
    title
    description
    releaseDate
    keyPhotoUrl
  }
`)

// Use fragment in query
const GET_DATASETS_QUERY_V2 = gql(`
  query GetDatasetsV2 {
    datasets {
      ...DatasetCoreFields
      runsAggregate {
        aggregate {
          count
        }
      }
    }
  }
`)
```

---

## Advanced Query Techniques

### Pagination

Implement offset-based pagination:

```typescript
const PAGE_SIZE = 25

export async function getDatasetsPaginated({
  client,
  page = 1,
}: {
  client: ApolloClient<NormalizedCacheObject>
  page?: number
}) {
  const offset = (page - 1) * PAGE_SIZE

  return client.query({
    query: GET_DATASETS_QUERY_V2,
    variables: {
      limit: PAGE_SIZE,
      offset,
    },
  })
}
```

### Dynamic Filters

Build filter objects dynamically:

```typescript
import { RunWhereClause } from 'app/__generated_v2__/graphql'

function buildRunFilter(params: URLSearchParams): RunWhereClause {
  const filter: RunWhereClause = {}

  const datasetId = params.get('datasetId')
  if (datasetId) {
    filter.datasetId = { _eq: parseInt(datasetId, 10) }
  }

  const objectNames = params.getAll('objectName')
  if (objectNames.length > 0) {
    filter.annotations = {
      objectName: { _in: objectNames }
    }
  }

  return filter
}

// Usage in loader
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const filter = buildRunFilter(url.searchParams)

  const { data } = await getFilteredRunsV2({
    client: apolloClientV2,
    filter,
  })

  return json({ runs: data.runs })
}
```

### Error Handling

Handle GraphQL errors gracefully:

```typescript
export async function getDatasetByIdV2({
  client,
  id,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
}) {
  try {
    const result = await client.query({
      query: GET_DATASET_BY_ID_QUERY_V2,
      variables: { id },
    })

    if (result.error) {
      console.error('GraphQL error:', result.error)
      throw new Error('Failed to fetch dataset')
    }

    return result
  } catch (error) {
    console.error('Network error:', error)
    throw new Error('Failed to connect to API')
  }
}
```

---

## Working with Generated Types

### Import Generated Types

```typescript
import {
  GetDatasetByIdV2Query,
  Dataset,
  Run,
  RunWhereClause,
} from 'app/__generated_v2__/graphql'
```

### Type Query Results

```typescript
type DatasetResult = GetDatasetByIdV2Query['datasets'][0]

function processDataset(dataset: DatasetResult) {
  // TypeScript knows all fields on dataset
  console.log(dataset.title, dataset.description)
}
```

### Type Component Props

```typescript
import { Dataset } from 'app/__generated_v2__/graphql'

interface DatasetCardProps {
  dataset: Dataset
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return <div>{dataset.title}</div>
}
```

---

## Apollo Client Configuration

The Apollo Client is configured for server-side rendering:

**File:** `/packages/data-portal/app/apollo.server.ts`

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

export const apolloClientV2 = new ApolloClient({
  ssrMode: true,  // Enable server-side rendering
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: process.env.API_URL_V2,
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',  // Fresh data on every request
    },
  },
})
```

**Why no-cache policy?**
- Each request should have fresh data
- Server-rendered pages don't benefit from client-side caching
- Simplifies cache invalidation logic

---

## Troubleshooting

### Types Not Generated

1. Ensure query file matches naming pattern: `*V2*.{ts,tsx}`
2. Check query syntax is valid GraphQL
3. Run `pnpm data-portal build:codegen` manually
4. Check `codegen.ts` documents array includes your file

### Type Errors After Schema Changes

```bash
# Regenerate types from updated schema
pnpm data-portal build:codegen
```

### Query Not Found at Runtime

Ensure you're importing from the generated types:

```typescript
// Correct
import { gql } from 'app/__generated_v2__'

// Incorrect
import { gql } from '@apollo/client'
```

### Network Errors

Check environment variable is set:

```bash
# .env file
API_URL_V2=https://graphql.cryoetdataportal.czscience.com/graphql
```

---

## Best Practices

1. **Server-only queries:** Use `.server.ts` suffix for loader queries
2. **Type everything:** Import and use generated types
3. **Descriptive names:** Use clear query names like `GetDatasetByIdV2`
4. **Fragments for reuse:** Extract common fields into fragments
5. **Pagination:** Always implement pagination for list queries
6. **Error handling:** Handle both GraphQL and network errors
7. **Variable types:** Use proper GraphQL types for variables
8. **Minimize fields:** Only query fields you actually need

---

## Next Steps

- [Adding New Routes](./01-adding-new-routes.md) - Use queries in Remix loaders
- [Adding Filters](./04-adding-filters.md) - Build dynamic query filters
- [Testing Guide](./06-testing-guide.md) - Test components that use GraphQL data
