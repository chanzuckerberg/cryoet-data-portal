# Adding New Routes

This guide walks through creating new routes/pages in the CryoET Data Portal frontend using Remix's file-based routing system.


> **Before you start:** Review [Route Patterns](../01-architecture/01-routing/02-route-patterns.md) to choose the appropriate pattern for your use case. The codebase has 6 distinct route patterns—selecting the right one upfront saves refactoring later.

## Quick Reference

| Pattern | File Path | URL |
|---------|-----------|-----|
| Static route | `app/routes/about.tsx` | `/about` |
| Dynamic route | `app/routes/datasets.$id.tsx` | `/datasets/123` |
| Nested route | `app/routes/browse-data.datasets.tsx` | `/browse-data/datasets` |
| Index route | `app/routes/_index.tsx` | `/` |

---

## Route File Naming Convention

Remix uses file-based routing with special naming conventions:

- **Dots (`.`)** represent URL path segments: `browse-data.datasets.tsx` → `/browse-data/datasets`
- **Dollar signs (`$`)** denote dynamic parameters: `datasets.$id.tsx` → `/datasets/:id`
- **Underscores (`_`)** prefix pathless routes: `_index.tsx` is the root index route

---

## Step-by-Step: Creating a New Route

### 1. Create the Route File

Create a new file in `app/routes/` with the appropriate naming pattern:

```bash
# Example: Create a route for /experiments
touch app/routes/experiments.tsx
```

**File:** `/packages/data-portal/app/routes/experiments.tsx`

### 2. Define the Loader Function

The loader runs on the server before rendering and provides data to your component:

```typescript
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { apolloClientV2 } from 'app/apollo.server'
import { getExperimentsV2 } from 'app/graphql/getExperimentsV2.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = +(url.searchParams.get('page') ?? '1')

  // Fetch data using GraphQL
  const { data } = await getExperimentsV2({
    client: apolloClientV2,
    page,
  })

  // Return JSON response
  return json({
    experiments: data.experiments,
  })
}
```

**Key patterns from `/packages/data-portal/app/routes/datasets.$id.tsx`:**
- Use `LoaderFunctionArgs` for type-safe loader parameters
- Extract URL parameters via `params` or search params via `request.url`
- Use Apollo Client to fetch GraphQL data
- Return data with `json()` helper
- Throw `Response` objects for errors (404, 400, etc.)

### 3. Create the Component

Export a default React component that renders the page:

```typescript
import { useLoaderData } from '@remix-run/react'
import { useI18n } from 'app/hooks/useI18n'

export default function ExperimentsPage() {
  const { experiments } = useLoaderData<typeof loader>()
  const { t } = useI18n()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {t('experiments')}
      </h1>

      <div className="space-y-4">
        {experiments.map((experiment) => (
          <div key={experiment.id} className="border rounded p-4">
            <h2 className="text-xl">{experiment.title}</h2>
            <p>{experiment.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Key patterns:**
- Use `useLoaderData<typeof loader>()` for type-safe data access
- Use `useI18n()` hook for translations
- Use Tailwind CSS classes for styling

### 4. Add Dynamic Route Parameters

For routes with dynamic segments (e.g., `/datasets/123`), use `$` in the filename:

```typescript
// File: app/routes/experiments.$id.tsx

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const { data } = await getExperimentByIdV2({
    id,
    client: apolloClientV2,
  })

  if (data.experiments.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Experiment with ID ${id} not found`,
    })
  }

  return json({ experiment: data.experiments[0] })
}
```

### 5. Implement Revalidation Strategy (Optional)

Control when your route data refetches using `shouldRevalidate`:

```typescript
import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { shouldRevalidatePage } from 'app/utils/revalidate'
import { QueryParams } from 'app/constants/query'

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [
      QueryParams.Page,
      QueryParams.Search,
      QueryParams.Filter,
    ],
  })
}
```

**From `/packages/data-portal/app/routes/datasets.$id.tsx`:**
- List specific query parameters that should trigger data refetching
- This prevents unnecessary network requests when unrelated params change

---

## Common Route Patterns

### Static Content Route

For pages with minimal or no dynamic data:

```typescript
// File: app/routes/terms.tsx

export default function TermsPage() {
  const { t } = useI18n()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>{t('termsOfService')}</h1>
      <div>{/* Static content */}</div>
    </div>
  )
}
```

### Route with Search Parameters

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') ?? ''
  const filter = url.searchParams.get('filter') ?? ''

  const { data } = await searchExperiments({
    client: apolloClientV2,
    search,
    filter,
  })

  return json({ results: data.results })
}
```

### Nested Routes

Create hierarchical URLs using dot notation:

```typescript
// File: app/routes/browse-data.datasets.tsx
// URL: /browse-data/datasets

// File: app/routes/browse-data.runs.tsx
// URL: /browse-data/runs
```

---

## Working with Route Data

### Access Loader Data in Components

```typescript
import { useLoaderData } from '@remix-run/react'

export default function MyPage() {
  const { dataset, runs } = useLoaderData<typeof loader>()

  return <div>{dataset.title}</div>
}
```

### Access Route Parameters

```typescript
import { useParams } from '@remix-run/react'

export default function MyPage() {
  const { id } = useParams()

  return <div>Viewing item {id}</div>
}
```

### Access Search Parameters

```typescript
import { useSearchParams } from '@remix-run/react'

export default function MyPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get('page') ?? '1'

  return <div>Page {page}</div>
}
```

---

## Route Organization Best Practices

1. **Loader location:** Keep loaders in the same file as the route component
2. **GraphQL queries:** Create separate query files in `app/graphql/` and import them
3. **Complex logic:** Extract business logic to utility functions in `app/utils/`
4. **Shared components:** Place reusable components in `app/components/`
5. **Type safety:** Always use `LoaderFunctionArgs` and `useLoaderData<typeof loader>()`

---

## Error Handling

Throw `Response` objects for HTTP errors:

```typescript
// 404 Not Found
throw new Response(null, {
  status: 404,
  statusText: 'Resource not found',
})

// 400 Bad Request
throw new Response(null, {
  status: 400,
  statusText: 'Invalid parameters',
})
```

Remix will automatically render error boundaries for thrown responses.

---

## Next Steps

- [Route Patterns](../01-architecture/01-routing/02-route-patterns.md) - Understand the 6 route patterns in the codebase
- [Adding New Components](./02-adding-new-components.md) - Create reusable UI components
- [GraphQL Queries](./03-graphql-queries.md) - Write and generate GraphQL types
- [Testing Guide](./06-testing-guide.md) - Test your routes with Jest and Playwright
