# GraphQL Debugging

This guide covers debugging GraphQL queries, mutations, and schema-related issues in the CryoET Data Portal. Learn how to use Apollo DevTools, inspect network requests, troubleshoot codegen issues, and optimize query performance.

**Last updated:** December 10, 2025

## Apollo Client DevTools

### Installation

Install the Apollo Client DevTools browser extension:

- [Chrome/Edge](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/)

After installation, a new "Apollo" tab appears in browser DevTools.

### Using Apollo DevTools

#### Explorer Tab

**View active queries:**

The Explorer shows all queries currently cached by Apollo Client.

**Inspect query details:**

1. Click any query in the list
2. View query document (GraphQL query text)
3. View variables passed to the query
4. View cached result data
5. View loading/error states

**Re-run queries:**

Click the "Run in GraphiQL" button to open an interactive query editor.

#### GraphiQL Tab

**Interactive query editor:**

Write and test GraphQL queries without modifying code:

```graphql
query GetDataset($id: Int!) {
  datasets(where: { id: { _eq: $id } }) {
    id
    title
    description
    authors {
      name
      email
    }
  }
}
```

**Query variables:**

Add variables in the "Query Variables" panel:

```json
{
  "id": 10000
}
```

**Execute queries:**

Click the play button or press Cmd+Enter (macOS) / Ctrl+Enter (Windows).

**Features:**

- **Autocomplete**: Press Ctrl+Space for field suggestions
- **Documentation**: Click "Docs" to explore the schema
- **History**: Access previous queries from the history panel
- **Prettify**: Auto-format queries with the prettify button

#### Mutations Tab

Test mutations in isolation:

```graphql
mutation CreateDeposition($input: DepositionInput!) {
  createDeposition(input: $input) {
    id
    title
    status
  }
}
```

---

## Network Request Debugging

### Inspecting GraphQL Requests

**Open Network panel:**

1. DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Look for requests to the GraphQL endpoint

**Example request:**

```
POST https://graphql.cryoetdataportal.czscience.com/graphql
```

### Request Analysis

Click a GraphQL request to view details:

**Headers tab:**

```
Content-Type: application/json
Accept: application/json
```

**Payload tab:**

Shows the GraphQL query and variables:

```json
{
  "query": "query GetDatasets($limit: Int!) { datasets(limit: $limit) { id title } }",
  "variables": {
    "limit": 10
  }
}
```

**Response tab:**

Shows the GraphQL response:

```json
{
  "data": {
    "datasets": [
      { "id": "10000", "title": "Dataset A" },
      { "id": "10001", "title": "Dataset B" }
    ]
  }
}
```

### Common Request Issues

#### Problem: GraphQL errors in response

**Symptom:**

Response includes an `errors` array:

```json
{
  "errors": [
    {
      "message": "Field 'invalidField' doesn't exist on type 'Dataset'",
      "locations": [{ "line": 2, "column": 5 }]
    }
  ]
}
```

**Solution:**

1. **Check field name**: Ensure field exists in schema
2. **Regenerate types**: Run `pnpm build:codegen`
3. **Verify schema version**: Confirm API schema matches your types

#### Problem: Network timeout

**Symptom:**

Request fails with timeout error after 30+ seconds.

**Solution:**

1. **Simplify query**: Remove unnecessary fields or nested queries
2. **Add pagination**: Limit result set size
3. **Check API status**: Verify the GraphQL endpoint is responding

```graphql
# Before: Fetching too much data
query GetAllDatasets {
  datasets {
    id
    title
    runs {
      id
      tomograms {
        id
        # Deep nesting causes slow queries
      }
    }
  }
}

# After: Paginated and optimized
query GetDatasets($limit: Int!, $offset: Int!) {
  datasets(limit: $limit, offset: $offset) {
    id
    title
    # Fetch runs separately when needed
  }
}
```

#### Problem: 401 Unauthorized

**Symptom:**

```json
{
  "errors": [
    {
      "message": "Unauthorized"
    }
  ]
}
```

**Solution:**

The CryoET Data Portal uses public GraphQL endpoints. If seeing auth errors:

1. Check if endpoint URL is correct in `.env`:
```bash
API_URL_V2=https://graphql.cryoetdataportal.czscience.com/graphql
```

2. Verify no auth headers are accidentally being sent

---

## GraphQL Codegen Issues

### Type Generation Failures

#### Problem: Types not generated after schema change

**Symptom:**

Running `pnpm build:codegen` completes but types in `app/__generated_v2__/` are outdated.

**Solution:**

1. **Force clean generation**:
```bash
rm -rf app/__generated_v2__
pnpm build:codegen
```

2. **Check codegen config** (`codegen.ts`):
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
      // ...
    },
  },
}
```

3. **Verify file naming**: Query files must match the documents pattern
   - ✅ `app/graphql/getDatasetV2.ts`
   - ❌ `app/graphql/getDataset.ts` (missing V2)

#### Problem: Schema introspection fails

**Symptom:**

```
Error: Failed to load schema from https://...
```

**Solution:**

1. **Test schema endpoint**:
```bash
curl -X POST https://graphql.cryoetdataportal.czscience.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

2. **Check network connectivity**: Ensure you can reach the API

3. **Try alternative schema source**: Use a local schema file temporarily:
```typescript
// codegen.ts
const config: CodegenConfig = {
  generates: {
    './app/__generated_v2__/': {
      schema: './schema.graphql', // Local file
      // ...
    },
  },
}
```

#### Problem: Type mismatch after regeneration

**Symptom:**

```typescript
// Error: Type 'string' is not assignable to type 'number'
const id: number = dataset.id // dataset.id is now string
```

**Solution:**

The schema changed the field type. Update consuming code:

```typescript
// Before
const id: number = dataset.id

// After
const id: string = dataset.id
```

Or use type guards:

```typescript
const id = typeof dataset.id === 'string' ? parseInt(dataset.id) : dataset.id
```

### Custom Scalar Issues

#### Problem: DateTime fields have incorrect types

**Symptom:**

```typescript
// Expected: Date object
// Actual: string
const date: Date = dataset.createdAt // Type error
```

**Solution:**

DateTime scalars are mapped to strings in `codegen.ts`:

```typescript
config: {
  scalars: {
    DateTime: 'string',
    numeric: 'number',
  },
}
```

Convert strings to Date objects when needed:

```typescript
const createdAt = new Date(dataset.createdAt)
```

Or update the scalar mapping to use custom types:

```typescript
// types/scalars.ts
export type DateTime = Date

// codegen.ts
config: {
  scalars: {
    DateTime: './types/scalars#DateTime',
  },
}
```

---

## Query Optimization

### Identifying Slow Queries

**Use Network timing:**

1. Open DevTools → Network
2. Click a GraphQL request
3. View "Timing" tab
4. Look for high "Waiting (TTFB)" time

**Profile with Apollo DevTools:**

The Explorer tab shows query execution times.

### Common Performance Issues

#### Problem: N+1 Query Problem

**Symptom:**

Making multiple sequential requests instead of one batched request.

**Bad pattern:**

```typescript
// Fetches datasets first
const datasets = await fetchDatasets()

// Then fetches runs for each dataset (N additional queries)
for (const dataset of datasets) {
  const runs = await fetchRuns(dataset.id)
}
```

**Solution:**

Fetch related data in a single query:

```graphql
query GetDatasetsWithRuns {
  datasets {
    id
    title
    runs {
      id
      name
    }
  }
}
```

#### Problem: Over-fetching Data

**Symptom:**

Fetching large amounts of unused data.

**Bad pattern:**

```graphql
query GetDatasets {
  datasets {
    id
    title
    description
    # Many fields not used in the UI
    metadata
    funding
    authors {
      name
      email
      affiliations
      orcid
    }
  }
}
```

**Solution:**

Only request needed fields:

```graphql
query GetDatasetsForList {
  datasets {
    id
    title
    # Only fields displayed in the list view
  }
}
```

#### Problem: Unnecessary Re-fetching

**Symptom:**

Apollo Client makes the same query repeatedly.

**Cause:**

The default `fetchPolicy: 'no-cache'` in the CryoET Data Portal prevents caching:

```typescript
// apollo.server.ts
export const apolloClientV2 = new ApolloClient({
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache', // Every query hits the network
    },
  },
})
```

**Why no-cache?**

The application is server-rendered, so client-side caching isn't needed. Data is fetched fresh on each page load.

**Solution (if needed):**

For specific queries that benefit from caching, override the fetch policy:

```typescript
const { data } = useQuery(GET_DATASETS, {
  fetchPolicy: 'cache-first', // Check cache before network
})
```

---

## Debugging Query Results

### Missing Data in Response

#### Problem: Expected field returns null

**Example:**

```json
{
  "data": {
    "datasets": [
      {
        "id": "10000",
        "title": "Dataset A",
        "description": null  // Expected a value
      }
    ]
  }
}
```

**Possible causes:**

1. **Field is nullable in schema**: Check schema definition
2. **Data doesn't exist**: Database record has no value for that field
3. **Permissions issue**: Field is restricted (less common in public APIs)

**Debugging steps:**

1. **Check schema**:
```graphql
type Dataset {
  description: String  # Nullable (no !)
}
```

2. **Query the API directly** to verify data exists:
```bash
curl -X POST https://graphql.cryoetdataportal.czscience.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { datasets(where: {id: {_eq: 10000}}) { description } }"}'
```

3. **Add null checks in code**:
```typescript
const description = dataset.description ?? 'No description available'
```

### Unexpected Data Structure

#### Problem: Array expected but got object

**Symptom:**

```typescript
// Expected: Array
const datasets = data.datasets
datasets.map(d => d.title) // Error: datasets.map is not a function
```

**Solution:**

Check the actual response structure in DevTools:

```json
{
  "data": {
    "datasets": {
      "results": [/* array here */],
      "totalCount": 100
    }
  }
}
```

Update code to match:

```typescript
const datasets = data.datasets.results
```

---

## Fragment Masking

The CryoET Data Portal disables fragment masking for simpler type usage:

```typescript
// codegen.ts
presetConfig: {
  fragmentMasking: false, // Types are not wrapped
}
```

### What This Means

**With fragment masking** (default):
```typescript
const data = useFragment(DATASET_FRAGMENT, dataset)
// Must unwrap the fragment result
```

**Without fragment masking** (CryoET config):
```typescript
const { id, title } = dataset
// Direct access to fields
```

### Re-enabling Fragment Masking

If you need stricter type safety:

1. Update `codegen.ts`:
```typescript
presetConfig: {
  fragmentMasking: true,
}
```

2. Regenerate types:
```bash
pnpm build:codegen
```

3. Update component code to use `useFragment`:
```typescript
import { useFragment } from '@apollo/client'
import { DATASET_FRAGMENT } from './fragments'

function DatasetComponent({ dataset }) {
  const data = useFragment(DATASET_FRAGMENT, dataset)
  return <div>{data.title}</div>
}
```

---

## Testing GraphQL Queries

### Unit Testing with Mocked Data

**Mock Apollo Client:**

```typescript
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import { GET_DATASETS } from './queries'
import DatasetList from './DatasetList'

test('renders dataset list', async () => {
  const mocks = [
    {
      request: {
        query: GET_DATASETS,
        variables: { limit: 10 },
      },
      result: {
        data: {
          datasets: [
            { id: '1', title: 'Dataset A' },
            { id: '2', title: 'Dataset B' },
          ],
        },
      },
    },
  ]

  render(
    <MockedProvider mocks={mocks}>
      <DatasetList />
    </MockedProvider>
  )

  expect(await screen.findByText('Dataset A')).toBeInTheDocument()
})
```

### Testing Error States

```typescript
const errorMock = {
  request: {
    query: GET_DATASETS,
  },
  error: new Error('Network error'),
}

const mocks = [errorMock]

render(
  <MockedProvider mocks={mocks}>
    <DatasetList />
  </MockedProvider>
)

expect(await screen.findByText(/error/i)).toBeInTheDocument()
```

---

## Schema Exploration

### Using GraphiQL

Access the interactive schema explorer:

1. Install GraphiQL app or browser extension
2. Connect to: `https://graphql.cryoetdataportal.czscience.com/graphql`
3. Click "Docs" to explore schema

### Useful Introspection Queries

**List all types:**

```graphql
query GetAllTypes {
  __schema {
    types {
      name
      kind
    }
  }
}
```

**Get type details:**

```graphql
query GetTypeDetails {
  __type(name: "Dataset") {
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

**Find queries:**

```graphql
query GetQueries {
  __schema {
    queryType {
      fields {
        name
        args {
          name
          type {
            name
          }
        }
      }
    }
  }
}
```

---

## Next Steps

- [Debugging Guide](./02-debugging-guide.md) - General debugging techniques
- [Styling Issues](./04-styling-issues.md) - CSS troubleshooting
- [Build Errors](./05-build-errors.md) - Compilation errors
