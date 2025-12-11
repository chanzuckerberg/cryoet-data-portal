# Codebase Tour

A guided walkthrough of key files in the CryoET Data Portal frontend. This tour helps you understand how the major pieces fit together.

> **Prerequisites**: Complete [Project Structure](./03-project-structure.md) and [Development Workflow](./04-development-workflow.md) before continuing.

## How to Use This Guide

Open each file as you read about it. The goal is to build a mental map of where things live and how they connect. Files are listed in the order you'd encounter them following a request through the system.

All paths are relative to `packages/data-portal/`.

## Quick Reference

| Category     | Key Files                                                           |
| ------------ | ------------------------------------------------------------------- |
| Entry Points | `app/root.tsx`, `app/entry.server.tsx`, `app/entry.client.tsx`      |
| Routes       | `app/routes/browse-data.datasets.tsx`, `app/routes/browse-data.tsx` |
| GraphQL      | `app/apollo.server.ts`, `app/graphql/common.ts`                     |
| State        | `app/state/filterHistory.ts`, `app/hooks/useFilter.ts`              |
| Constants    | `app/constants/query.ts`, `app/constants/filterQueryParams.ts`      |

## Application Entry Points

### `app/root.tsx`

The root component that wraps the entire application.

**What it does:**

- Sets up the HTML document structure (`<html>`, `<head>`, `<body>`)
- Loads environment variables via the `loader` function and exposes them to the client
- Initializes i18n language detection
- Configures Emotion CSS-in-JS cache for styled components
- Wraps the app in `EnvironmentContext.Provider`

**Key patterns:**

```tsx
// Loader exposes environment variables to the client
export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request)
  return typedjson({
    locale,
    ENV: {
      API_URL: process.env.API_URL,
      API_URL_V2: process.env.API_URL_V2,
      ENV: process.env.ENV,
      // ...
    },
  })
}
```

The `shouldRevalidate` function returns `false` because root data is static—this prevents unnecessary re-fetching.

### `app/entry.server.tsx`

Server-side rendering entry point. Handles the initial HTML generation.

**What it does:**

- Extracts CSS from Emotion cache for SSR
- Initializes i18next with server-side locale detection
- Sets up QueryClient and theme providers

### `app/entry.client.tsx`

Client-side hydration entry point. Takes over after the browser loads.

**What it does:**

- Hydrates the React app
- Initializes i18next with client-side language detection
- Sets up Emotion cache on the client

## Route Files

Routes in Remix define both the URL structure and data loading. Files in `app/routes/` map to URLs.

### `app/routes/browse-data.tsx`

Parent layout route for all browse pages (`/browse-data/*`).

**What it does:**

- Queries toolbar data (dataset/deposition counts)
- Renders the `BrowseDataHeader` with tabs
- Provides an `<Outlet />` for child routes (datasets, depositions)

This demonstrates Remix's nested routing—child routes render inside the parent's `<Outlet />`.

### `app/routes/browse-data.datasets.tsx`

The datasets browse page (`/browse-data/datasets`). This is the **core example** of the data fetching pattern.

**What it does:**

1. **Loader** fetches data server-side:

   ```tsx
   export async function loader({ request }: LoaderFunctionArgs) {
     const url = new URL(request.url)
     const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
     const sort = url.searchParams.get(QueryParams.Sort) as
       | CellHeaderDirection
       | undefined
     const query = url.searchParams.get(QueryParams.Search) ?? ''

     const { data: responseV2 } = await getDatasetsV2({
       page,
       titleOrderDirection: orderByV2,
       searchText: query,
       params: url.searchParams,
       client: apolloClientV2,
     })

     return json({ v2: responseV2, deposition })
   }
   ```

2. **Component** uses the data with filtering UI:

   ```tsx
   export default function BrowseDatasetsPage() {
     const { filteredDatasetsCount, totalDatasetsCount } =
       useDatasetsFilterData()

     return (
       <TablePageLayout
         tabs={[
           {
             title: t('datasets'),
             filterPanel: <DatasetFilter />,
             table: <DatasetTable />,
             filteredCount: filteredDatasetsCount,
             totalCount: totalDatasetsCount,
             // ...
           },
         ]}
       />
     )
   }
   ```

**Key patterns to note:**

- URL search params drive filtering (via `QueryParams` enum)
- Server-side data fetching in `loader`
- `TablePageLayout` component provides consistent page structure
- Filter state synced via `useSyncParamsWithState`

### Other Important Routes

| Route File                    | URL                        | Purpose                           |
| ----------------------------- | -------------------------- | --------------------------------- |
| `_index.tsx`                  | `/`                        | Landing page with aggregate stats |
| `browse-data.depositions.tsx` | `/browse-data/depositions` | Depositions browse table          |
| `datasets.$id.tsx`            | `/datasets/:id`            | Single dataset detail page        |
| `depositions.$id.tsx`         | `/depositions/:id`         | Single deposition detail page     |
| `runs.$id.tsx`                | `/runs/:id`                | Single run detail page            |

## GraphQL Layer

### `app/apollo.server.ts`

Apollo Client configuration for server-side queries.

**What it does:**

- Creates Apollo Client with SSR mode (`ssrMode: true`)
- Uses `no-cache` fetch policy (Remix handles caching)
- Points to `API_URL_V2` environment variable

All GraphQL queries happen server-side in route loaders.

### `app/graphql/common.ts`

**Critical file**: Converts UI filter state to GraphQL where clauses.

**What it does:**

The `getDatasetsFilter()` function transforms a `FilterState` object into a `DatasetWhereClause`:

```tsx
export function getDatasetsFilter({
  filterState,
  depositionId,
  searchText,
}: GetDatasetsFilterParams): DatasetWhereClause {
  const where: DatasetWhereClause = {}

  // Search by Dataset Name
  if (searchText) {
    where.title = { _ilike: `%${searchText}%` }
  }

  // Ground Truth Annotation filter
  if (filterState.includedContents.isGroundTruthEnabled) {
    where.runs ??= { annotations: {} }
    where.runs.annotations.groundTruthStatus = { _eq: true }
  }

  // Organism filter
  const { organismNames } = filterState.sampleAndExperimentConditions
  if (organismNames.length > 0) {
    where.organismName = { _in: organismNames }
  }

  // ... more filters
  return where
}
```

Understanding this file is essential for adding new filters.

### `app/graphql/*.server.ts`

Server-side query functions follow a consistent pattern:

```
app/graphql/
├── getDatasetsV2.server.ts      # Fetch datasets with filtering
├── getDepositionByIdV2.server.ts # Single deposition
├── getRunByIdV2.server.ts       # Single run
└── ...
```

The `.server.ts` suffix ensures these only run server-side (Remix convention).

## State Management

The app uses a combination of URL state (primary) and Jotai atoms (UI state).

### `app/hooks/useFilter.ts`

**Critical hook**: Reads filter state from URL and provides update methods.

**What it does:**

1. `getFilterState()` parses URL params into a typed object:

   ```tsx
   export function getFilterState(searchParams: URLSearchParams) {
     return {
       includedContents: {
         isGroundTruthEnabled:
           searchParams.get(QueryParams.GroundTruthAnnotation) === 'true',
         availableFiles: searchParams.getAll(QueryParams.AvailableFiles),
         // ...
       },
       ids: {
         datasets: searchParams.getAll(QueryParams.DatasetId),
         deposition: searchParams.get(QueryParams.DepositionId),
         // ...
       },
       // ...more filter groups
     }
   }
   ```

2. `useFilter()` returns the state plus update methods:

   ```tsx
   const filter = useFilter()

   // Read current filters
   filter.includedContents.availableFiles

   // Update a single filter
   filter.updateValue(QueryParams.Organism, ['human'])

   // Reset all filters
   filter.reset()
   ```

### `app/state/filterHistory.ts`

Jotai atoms for remembering filter state across navigation.

**What it does:**

- `previousBrowseDatasetParamsAtom` - Stores dataset page filters
- `previousSingleDatasetParamsAtom` - Stores single dataset page filters
- `useSyncParamsWithState()` - Syncs URL params to atoms for back navigation

**Pattern:**

```tsx
// In a route component
const { previousBrowseDatasetParams, setPreviousBrowseDatasetParams } =
  useBrowseDatasetFilterHistory()

useSyncParamsWithState({
  filters: DATASET_FILTERS,
  setParams: setPreviousBrowseDatasetParams,
})
```

### Other State Files

| File                                  | Purpose                                    |
| ------------------------------------- | ------------------------------------------ |
| `app/state/search.ts`                 | Global search query atom                   |
| `app/state/annotation.ts`             | Selected annotation shape state            |
| `app/state/banner.ts`                 | Notification banner state                  |
| `app/state/metadataDrawerTomogram.ts` | Which tomogram is shown in metadata drawer |

## Hooks Directory

### Filter & Query Hooks

| Hook                       | Purpose                           |
| -------------------------- | --------------------------------- |
| `useFilter.ts`             | Read/write URL filter state       |
| `useQueryParam.ts`         | Read/write single URL query param |
| `useDatasetsFilterData.ts` | Get filtered/total dataset counts |

### Data Fetching Hooks

| Hook                   | Purpose                 |
| ---------------------- | ----------------------- |
| `useDatasetById.ts`    | Fetch single dataset    |
| `useDepositionById.ts` | Fetch single deposition |
| `useDepositions.ts`    | Fetch depositions list  |

### UI Hooks

| Hook                   | Purpose                                |
| ---------------------- | -------------------------------------- |
| `useI18n.ts`           | Type-safe wrapper around react-i18next |
| `useMetadataDrawer.ts` | Open/close metadata drawer             |
| `usePlausible.ts`      | Analytics event tracking               |
| `useEffectOnce.ts`     | Effect that runs only on mount         |

## Components Overview

Components are organized by feature area:

```
app/components/
├── BrowseData/           # Dataset/deposition tables
├── DatasetFilter/        # Dataset filter panel
├── DepositionsFilters/   # Deposition filter panel
├── TablePageLayout/      # Standard browse page layout
├── MetadataDrawer/       # Side drawer for details
├── Download/             # Download modal and flows
├── Layout/               # App shell, header, footer
└── ...individual components
```

### Key Components

| Component            | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `TablePageLayout`    | Standard layout for browse pages (filters + table) |
| `DatasetFilter`      | Filter panel for datasets                          |
| `MetadataDrawer`     | Slide-out drawer showing detailed metadata         |
| `BrowseDataSearch`   | Search input for browse pages                      |
| `PaginationControls` | Page navigation                                    |

## Constants & Configuration

### `app/constants/query.ts`

**Critical file**: Enum of all URL query parameter names.

```tsx
export enum QueryParams {
  AnnotationId = 'annotation_id',
  AuthorName = 'author',
  AvailableFiles = 'files',
  DatasetId = 'dataset_id',
  DepositionId = 'deposition-id',
  Organism = 'organism',
  Page = 'page',
  Search = 'search',
  Sort = 'sort',
  // ... more params
}
```

Always use this enum instead of string literals for query params.

### `app/constants/filterQueryParams.ts`

Defines which filters apply to which pages:

```tsx
export const DATASET_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.AvailableFiles,
  QueryParams.Organism,
  // ...
] as const

export const DEPOSITION_FILTERS = [
  QueryParams.AuthorName,
  QueryParams.Competition,
  // ...
] as const
```

### `app/context/Environment.context.ts`

React context providing environment variables throughout the app:

```tsx
const { API_URL_V2, ENV } = useContext(EnvironmentContext)
```

## Generated Files

### `app/__generated_v2__/`

Auto-generated GraphQL TypeScript types. **Never edit these manually.**

Regenerate after changing GraphQL queries:

```bash
pnpm build:codegen
```

These types are used throughout the codebase for type-safe GraphQL operations.

## Feature Flags

### `app/utils/featureFlags.ts`

Controls feature availability via environment variables or URL params.

**Usage in routes:**

```tsx
import { getFeatureFlag } from 'app/utils/featureFlags'

export async function loader({ request }: LoaderFunctionArgs) {
  const isFeatureEnabled = getFeatureFlag({
    request,
    key: 'expandDepositions',
  })
  // ...
}
```

## Data Flow Summary

Here's how a typical request flows through the system:

1. **User visits** `/browse-data/datasets?organism=human`
2. **Route loader** (`browse-data.datasets.tsx`) runs server-side
3. **Loader parses** URL params using `QueryParams` enum
4. **`getDatasetsFilter()`** converts params to GraphQL where clause
5. **Apollo Client** executes GraphQL query
6. **Component renders** with data from `useTypedLoaderData()`
7. **User changes filter** → `useFilter().updateValue()` updates URL
8. **Remix reloads** the route with new params

## Next Steps

Continue to [Technology Stack](../01-architecture/01-technology-stack.md) for deeper understanding of the frameworks and libraries used.
