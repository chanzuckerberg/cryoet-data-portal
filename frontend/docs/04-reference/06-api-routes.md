# API Routes Reference

This document provides a comprehensive reference for all internal API routes in the CryoET Data Portal frontend. These routes are implemented as Remix loaders and actions in the `/packages/data-portal/app/routes/` directory.


## Quick Reference

| Route | Method | Purpose | Parameters |
|-------|--------|---------|------------|
| `/api/event` | POST | Proxy Plausible analytics events | Request body |
| `/api/logs` | POST | Client-side log forwarding | `logs` array |
| `/api/annotations-for-run` | GET | Annotations for specific run | `depositionId`, `runId`, `page` |
| `/api/deposition-anno-runs` | GET | Annotation runs for deposition | `depositionId` |
| `/api/deposition-annotations-by-organism` | GET | Annotations grouped by organism | `depositionId`, `page` |
| `/api/deposition-datasets` | GET | Datasets for deposition | `depositionId`, `type` |
| `/api/deposition-items-by-organism` | GET | Items (annotations/tomograms) by organism | `depositionId`, `type`, `page` |
| `/api/deposition-run-counts` | GET | Run counts for datasets | `depositionId`, `datasetIds` |
| `/api/deposition-runs` | GET | Runs for dataset | `depositionId`, `datasetId`, `page`, `type` |
| `/api/deposition-tomograms-by-organism` | GET | Tomograms grouped by organism | `depositionId`, `page` |
| `/api/deposition-tomo-runs` | GET | Tomogram runs for deposition | `depositionId` |
| `/api/deposition-tomo-run-counts` | GET | Tomogram run counts | `depositionId`, `datasetIds` |
| `/api/items-for-run` | GET | Items (annotations/tomograms) for run | `depositionId`, `runId`, `page`, `type` |
| `/api/tomograms-for-run` | GET | Tomograms for specific run | `depositionId`, `runId`, `page` |

---

## Analytics & Logging

### POST /api/event

Proxy for Plausible analytics events. Forwards client analytics to Plausible.io.

**Location:** `app/routes/api.event.ts`

**Method:** POST (action)

**Purpose:** Forward analytics events from client to Plausible while preserving client IP for accurate geolocation.

**Request Body:**
- Plausible event JSON (passed through)

**Response:**
- Status: Same as Plausible response
- Body: Plausible response body (text)

**Implementation:**
```typescript
export async function action({ request, context }: ActionFunctionArgs) {
  let { clientIp } = context as ServerContext
  clientIp = clientIp.replace('::ffff:', '')

  const payload = {
    body: request.body,
    method: request.method,
    headers: removeNullishValues({
      'Content-Type': 'application/json',
      'user-agent': request.headers.get('user-agent'),
      'X-Forwarded-For': clientIp,
    }) as HeadersInit,
  }

  const response = await fetch('https://plausible.io/api/event', payload)
  const responseBody = await response.text()
  const { status, headers } = response

  return new Response(responseBody, { status, headers })
}
```

**Usage:**
```typescript
// Client-side
await fetch('/api/event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'pageview',
    url: window.location.href,
    domain: 'cryoetdataportal.cziscience.com',
  }),
})
```

---

### POST /api/logs

Forward client-side logs to server console.

**Location:** `app/routes/api.logs.ts`

**Method:** POST (action)

**Purpose:** Forward client-side console logs to server for debugging and error tracking.

**Request Body:**
```typescript
{
  logs: Array<{
    level: 'log' | 'debug' | 'error' | 'info' | 'warn' | 'trace'
    messages: any[]
  }>
}
```

**Response:**
- Status: 200
- Body: `'OK'`

**Implementation:**
```typescript
export async function action({ request }: ActionFunctionArgs) {
  const { logs } = (await request.json()) as LogApiRequestBody

  logs.forEach((entry) => console[entry.level](...entry.messages))

  return 'OK'
}
```

**Usage:**
```typescript
import { LogLevel } from 'app/types/logging'

// Client-side
const logs = [
  { level: LogLevel.Error, messages: ['Error occurred:', error] },
  { level: LogLevel.Info, messages: ['Info message'] },
]

await fetch('/api/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ logs }),
})
```

---

## Deposition Data Routes

### GET /api/deposition-datasets

Get datasets for a specific deposition with counts.

**Location:** `app/routes/api.deposition-datasets.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `type` | string | Yes | `'annotations'` or `'tomograms'` |

**Response:**
```typescript
{
  datasets: Array<{
    id: number
    title: string
    organismName: string | null
  }>
  organismCounts: Record<string, number>
  annotationCounts: Record<number, number>  // When type=annotations
  tomogramCounts: Record<number, number>    // When type=tomograms
}
```

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch datasets

**Example:**
```typescript
const response = await fetch(
  '/api/deposition-datasets?depositionId=123&type=annotations'
)
const data = await response.json()
// data.datasets = [{ id: 1, title: "Dataset 1", organismName: "E. coli" }, ...]
```

---

### GET /api/deposition-runs

Get runs for a specific dataset in a deposition.

**Location:** `app/routes/api.deposition-runs.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `datasetId` | number | Yes | Dataset ID |
| `page` | number | Yes | Page number (1-indexed) |
| `type` | string | Yes | `'annotations'` or `'tomograms'` |

**Response:**
- GraphQL query result (annotations or tomograms)

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch runs

**Example:**
```typescript
const response = await fetch(
  '/api/deposition-runs?depositionId=123&datasetId=456&page=1&type=annotations'
)
const data = await response.json()
```

---

### GET /api/deposition-run-counts

Get run counts for multiple datasets.

**Location:** `app/routes/api.deposition-run-counts.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `datasetIds` | string | Yes | Comma-separated dataset IDs |

**Response:**
```typescript
{
  runCounts: Record<number, number>  // datasetId -> count
}
```

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch run counts

**Example:**
```typescript
const response = await fetch(
  '/api/deposition-run-counts?depositionId=123&datasetIds=1,2,3'
)
const data = await response.json()
// data.runCounts = { 1: 5, 2: 3, 3: 7 }
```

---

### GET /api/deposition-anno-runs

Get annotation runs for a deposition (no pagination).

**Location:** `app/routes/api.deposition-anno-runs.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |

**Response:**
- GraphQL query result with annotation runs

**Errors:**
- 400: Missing or invalid depositionId
- 500: Failed to fetch annotation runs

---

### GET /api/deposition-tomo-runs

Get tomogram runs for a deposition (no pagination).

**Location:** `app/routes/api.deposition-tomo-runs.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |

**Response:**
- GraphQL query result with tomogram runs

**Errors:**
- 400: Missing or invalid depositionId
- 500: Failed to fetch tomogram runs

---

### GET /api/deposition-tomo-run-counts

Get tomogram run counts for multiple datasets.

**Location:** `app/routes/api.deposition-tomo-run-counts.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `datasetIds` | string | Yes | Comma-separated dataset IDs |

**Response:**
```typescript
{
  runCounts: Record<number, number>  // datasetId -> count
}
```

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch run counts

---

### GET /api/annotations-for-run

Get annotations for a specific run.

**Location:** `app/routes/api.annotations-for-run.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `runId` | number | Yes | Run ID |
| `page` | number | Yes | Page number (1-indexed) |

**Response:**
- GraphQL query result with annotation data

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch annotations

**Example:**
```typescript
const response = await fetch(
  '/api/annotations-for-run?depositionId=123&runId=456&page=1'
)
const data = await response.json()
```

---

### GET /api/tomograms-for-run

Get tomograms for a specific run.

**Location:** `app/routes/api.tomograms-for-run.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `runId` | number | Yes | Run ID |
| `page` | number | Yes | Page number (1-indexed) |

**Response:**
- GraphQL query result with tomogram data

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch tomograms

**Example:**
```typescript
const response = await fetch(
  '/api/tomograms-for-run?depositionId=123&runId=456&page=1'
)
const data = await response.json()
```

---

### GET /api/items-for-run

Get items (annotations or tomograms) for a specific run.

**Location:** `app/routes/api.items-for-run.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `runId` | number | Yes | Run ID |
| `page` | number | Yes | Page number (1-indexed) |
| `type` | string | Yes | `'annotations'` or `'tomograms'` |

**Response:**
- GraphQL query result (annotations or tomograms based on type)

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch items

**Example:**
```typescript
const response = await fetch(
  '/api/items-for-run?depositionId=123&runId=456&page=1&type=annotations'
)
const data = await response.json()
```

---

### GET /api/deposition-annotations-by-organism

Get annotations grouped by organism for a deposition.

**Location:** `app/routes/api.deposition-annotations-by-organism.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `page` | number | Yes | Page number (1-indexed) |

**Response:**
- GraphQL query result with annotations grouped by organism

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch annotations

---

### GET /api/deposition-tomograms-by-organism

Get tomograms grouped by organism for a deposition.

**Location:** `app/routes/api.deposition-tomograms-by-organism.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `page` | number | Yes | Page number (1-indexed) |

**Response:**
- GraphQL query result with tomograms grouped by organism

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch tomograms

---

### GET /api/deposition-items-by-organism

Get items (annotations or tomograms) grouped by organism.

**Location:** `app/routes/api.deposition-items-by-organism.ts`

**Method:** GET (loader)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `depositionId` | number | Yes | Deposition ID |
| `type` | string | Yes | `'annotations'` or `'tomograms'` |
| `page` | number | Yes | Page number (1-indexed) |

**Response:**
```typescript
{
  annotations?: [...],  // When type=annotations
  tomograms?: [...],    // When type=tomograms
}
```

**Errors:**
- 400: Missing or invalid parameters
- 500: Failed to fetch items

---

## Route Conventions

### File Naming

API routes use Remix's file-based routing with dot notation:
```
app/routes/api.[route-name].ts
```

This creates routes at `/api/[route-name]`.

### Method Handling

- **GET requests:** Export a `loader` function
- **POST requests:** Export an `action` function
- **Other methods:** Not currently used

**Example structure:**
```typescript
// For GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  // Handle request
  return response
}

// For POST requests
export async function action({ request }: ActionFunctionArgs) {
  // Handle request
  return response
}
```

---

## Common Patterns

### Parameter Validation

Most routes validate numeric parameters:

```typescript
const depositionId = url.searchParams.get('depositionId')
if (!depositionId || Number.isNaN(Number(depositionId))) {
  return new Response('Missing or invalid depositionId', { status: 400 })
}
```

### GraphQL Queries

Routes use Apollo Client for GraphQL queries:

```typescript
import { apolloClientV2 } from 'app/apollo.server'
import { getDatasetById } from 'app/graphql/getDatasetByIdV2.server'

const result = await getDatasetById({
  client: apolloClientV2,
  id: datasetId,
})
```

### JSON Responses

Standard JSON response pattern:

```typescript
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Error Handling

Consistent error response pattern:

```typescript
try {
  // Fetch data
  return createJsonResponse(data)
} catch (error) {
  console.error('Failed to fetch data:', error)
  return new Response('Failed to fetch data', { status: 500 })
}
```

---

## Helper Utilities

### API Helpers

**Location:** `app/utils/api-helpers.ts`

```typescript
// Validate numeric parameter
function validateNumericParam(param: string | null, name: string): number {
  if (!param || Number.isNaN(Number(param))) {
    throw new Error(`Missing or invalid ${name}`)
  }
  return Number(param)
}

// Create JSON response
function createJsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}

// Handle API error
function handleApiError(error: unknown, operation: string): Response {
  console.error(`Failed to ${operation}:`, error)
  return new Response(`Failed to ${operation}`, { status: 500 })
}
```

### Parameter Parsers

**Location:** `app/utils/param-parsers.ts`

```typescript
// Validate deposition tab parameter
function validateDepositionTab(type: string | null): DataContentsType {
  if (!type || !Object.values(DataContentsType).includes(type as DataContentsType)) {
    throw new Error('Missing or invalid type parameter')
  }
  return type as DataContentsType
}
```

---

## Testing

### Unit Testing

Test API routes using Remix's testing utilities:

```typescript
import { createRequest } from '@remix-run/node'
import { loader } from './api.example'

test('returns data for valid request', async () => {
  const request = createRequest('http://localhost/api/example?id=1')
  const response = await loader({ request, params: {}, context: {} })
  const data = await response.json()

  expect(data).toBeDefined()
})
```

### E2E Testing

Test API routes through Playwright:

```typescript
test('fetches deposition datasets', async ({ page }) => {
  const response = await page.request.get(
    '/api/deposition-datasets?depositionId=123&type=annotations'
  )

  expect(response.ok()).toBeTruthy()
  const data = await response.json()
  expect(data.datasets).toHaveLength(5)
})
```

---

## Performance Considerations

### Caching

API routes do not implement caching by default. Consider adding:
- Response caching headers
- Server-side caching for expensive queries
- CDN caching for static data

**Example:**
```typescript
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300', // 5 minutes
  },
})
```

### Pagination

All paginated routes use page numbers (1-indexed). Consider the page size when querying:

```typescript
import { MAX_PER_PAGE } from 'app/constants/pagination'

const offset = (page - 1) * MAX_PER_PAGE
const limit = MAX_PER_PAGE
```

---

## Security Considerations

### Input Validation

Always validate and sanitize inputs:

```typescript
// Good ✅
const id = validateNumericParam(idParam, 'id')

// Bad ❌
const id = Number(idParam) // No validation
```

### Error Messages

Don't leak sensitive information in error messages:

```typescript
// Good ✅
return new Response('Failed to fetch data', { status: 500 })

// Bad ❌
return new Response(`Database error: ${error.message}`, { status: 500 })
```

### CORS

API routes inherit CORS settings from the main application. Add CORS headers if needed for external access:

```typescript
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})
```

---

## Next Steps

- [Query Parameters](./01-query-params.md) - URL parameter reference
- [Environment Variables](./02-environment-variables.md) - Environment configuration
- [Constants Reference](./03-constants-reference.md) - Application constants
- [Type Definitions](./04-type-definitions.md) - TypeScript types
- [GraphQL Schema](./05-graphql-schema.md) - GraphQL API reference
