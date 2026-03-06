# GraphQL Queries

This guide covers writing GraphQL queries, generating TypeScript types, and using the Apollo Client in the CryoET Data Portal frontend.

## Quick Reference

| Task                               | Command                          |
| ---------------------------------- | -------------------------------- |
| Generate types once                | `pnpm data-portal build:codegen` |
| Watch mode during dev              | `pnpm data-portal dev:codegen`   |
| Full dev server (includes codegen) | `pnpm dev`                       |

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
      documents: ['app/**/*V2*.{ts,tsx}', 'app/routes/_index.tsx'],
      preset: 'client',
      presetConfig: { fragmentMasking: false }, // Simpler type access
      config: { scalars: { DateTime: 'string', numeric: 'number' } },
    },
  },
}
```

**Key decisions:**

- Fragment masking disabled for simpler type inference
- Custom scalar mappings (DateTime to string, numeric to number)
- Server-only queries have `.server.ts` suffix

---

## Creating a GraphQL Query

### 1. Define the Query

Create a `.server.ts` file in `app/graphql/` and define your query using the `gql` tagged template:

```typescript
import { gql } from 'app/__generated_v2__'

const GET_DATASET_BY_ID_QUERY_V2 = gql(`
  query GetDatasetByIdV2($id: Int, $runLimit: Int, $runOffset: Int) {
    datasets(where: { id: { _eq: $id } }) {
      id
      title
      description
      authors(orderBy: { authorListOrder: asc }) {
        edges { node { name, email, orcid } }
      }
      runsAggregate { aggregate { count } }
    }
    runs(where: { datasetId: { _eq: $id } }, limitOffset: { limit: $runLimit, offset: $runOffset }) {
      id
      name
    }
  }
`)
```

**Key patterns:**

- Import `gql` from generated types, not from `@apollo/client`
- Use `V2` suffix in query names to distinguish from older API versions
- Action + Resource naming: `GetDatasetByIdV2`, `GetRunsV2`, `GetAnnotationsV2`

See full implementation: [`getDatasetByIdV2.server.ts`](../packages/data-portal/app/graphql/getDatasetByIdV2.server.ts)

### 2. Export an Async Wrapper Function

Wrap the query in a typed async function that handles variables:

```typescript
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
    variables: { id, runLimit: 25, runOffset: (page - 1) * 25 },
  })
}
```

This pattern provides type safety for variables and return types while encapsulating pagination logic.

### 3. Generate TypeScript Types

```bash
pnpm data-portal build:codegen    # One-time generation
pnpm data-portal dev:codegen      # Watch mode
```

The generator creates typed document nodes in `app/__generated_v2__/`. Import these types for components and props:

```typescript
import {
  GetDatasetByIdV2Query,
  RunWhereClause,
} from 'app/__generated_v2__/graphql'

type DatasetResult = GetDatasetByIdV2Query['datasets'][0]
```

### 4. Use in a Remix Loader

```typescript
import { apolloClientV2 } from 'app/apollo.server'
import { getDatasetByIdV2 } from 'app/graphql/getDatasetByIdV2.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN
  if (Number.isNaN(id)) throw new Response(null, { status: 400 })

  const { data } = await getDatasetByIdV2({ id, client: apolloClientV2 })
  if (data.datasets.length === 0) throw new Response(null, { status: 404 })

  return json({ dataset: data.datasets[0], runs: data.runs })
}
```

### 5. Access Data in Component

```typescript
export default function DatasetPage() {
  const { dataset, runs } = useLoaderData<typeof loader>()
  return <div><h1>{dataset.title}</h1></div>
}
```

---

## Query Pattern Reference

The GraphQL API supports several query patterns. Here's a quick reference with examples:

| Pattern              | Use Case                      | Key Syntax                                        |
| -------------------- | ----------------------------- | ------------------------------------------------- |
| Basic with variables | Pagination, single item fetch | `limitOffset: { limit: $limit, offset: $offset }` |
| Filtering            | Search, faceted browse        | `where: { field: { _eq: value } }`                |
| Aggregations         | Counts, statistics            | `runsAggregate { aggregate { count } }`           |
| Nested relationships | Related entities              | `authors { edges { node { name } } }`             |
| Fragments            | Reusable field sets           | `...DatasetCoreFields`                            |

### Complete Example: Filtering with Aggregations

```typescript
const GET_FILTERED_RUNS_V2 = gql(`
  query GetFilteredRunsV2($filter: RunWhereClause, $limit: Int) {
    runs(where: $filter, orderBy: { name: asc }, limitOffset: { limit: $limit }) {
      id
      name
      annotationsAggregate {
        aggregate { count, groupBy { objectName } }
      }
    }
    runsAggregate(where: $filter) {
      aggregate { count }
    }
  }
`)

// Dynamic filter building
function buildRunFilter(params: URLSearchParams): RunWhereClause {
  const filter: RunWhereClause = {}
  const datasetId = params.get('datasetId')
  if (datasetId) filter.datasetId = { _eq: parseInt(datasetId, 10) }

  const objectNames = params.getAll('objectName')
  if (objectNames.length > 0) {
    filter.annotations = { objectName: { _in: objectNames } }
  }
  return filter
}
```

### Filter Operators

| Operator       | Example                                 | Description           |
| -------------- | --------------------------------------- | --------------------- |
| `_eq`          | `{ id: { _eq: 123 } }`                  | Equals                |
| `_in`          | `{ objectName: { _in: ['ribosome'] } }` | In list               |
| `_ilike`       | `{ name: { _ilike: '%search%' } }`      | Case-insensitive like |
| `_gte`, `_lte` | `{ count: { _gte: 10 } }`               | Range comparisons     |

---

## Working with Generated Types

### Import and Use Types

```typescript
import {
  GetDatasetByIdV2Query,
  Dataset,
  RunWhereClause,
} from 'app/__generated_v2__/graphql'

// Extract nested types
type DatasetResult = GetDatasetByIdV2Query['datasets'][0]

// Type component props
interface DatasetCardProps {
  dataset: Dataset
}
```

### Error Handling

```typescript
try {
  const result = await client.query({
    query: GET_DATASET_BY_ID_QUERY_V2,
    variables: { id },
  })
  if (result.error) throw new Error('Failed to fetch dataset')
  return result
} catch (error) {
  throw new Error('Failed to connect to API')
}
```

---

## Apollo Client Configuration

**File:** [`/packages/data-portal/app/apollo.server.ts`](../packages/data-portal/app/apollo.server.ts)

```typescript
export const apolloClientV2 = new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: createHttpLink({ uri: process.env.API_URL_V2 }),
  defaultOptions: { query: { fetchPolicy: 'no-cache' } },
})
```

**Why no-cache?** Each SSR request should have fresh data. Server-rendered pages don't benefit from client-side caching, and this simplifies cache invalidation.

---

## Troubleshooting

| Problem                          | Solution                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------- |
| Types not generated              | Ensure file matches `*V2*.{ts,tsx}` pattern; run `pnpm data-portal build:codegen` |
| Type errors after schema changes | Regenerate types with codegen                                                     |
| Query not found at runtime       | Import `gql` from `app/__generated_v2__`, not `@apollo/client`                    |
| Network errors                   | Check `API_URL_V2` in `.env` file                                                 |

---

## Best Practices

1. **Server-only queries:** Use `.server.ts` suffix for loader queries
2. **Type everything:** Import and use generated types
3. **Descriptive names:** Use clear query names like `GetDatasetByIdV2`
4. **Pagination:** Always implement pagination for list queries
5. **Minimize fields:** Only query fields you actually need
6. **Error handling:** Handle both GraphQL and network errors

---

## Next Steps

- [Adding New Routes](./01-adding-new-routes.md) - Use queries in Remix loaders
- [Adding Filters](./04-adding-filters.md) - Build dynamic query filters
- [Testing Guide](./06-testing-guide.md) - Test components that use GraphQL data
