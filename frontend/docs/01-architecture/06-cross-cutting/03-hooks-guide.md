# Hooks Guide

This document catalogs the custom React hooks used throughout the CryoET Data Portal, organized by category with representative examples and best practices.

## Quick Reference

| Hook                  | Purpose                 | Location                                                                                     |
| --------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| `useFilter()`         | URL-driven filter state | [`hooks/useFilter.ts`](../../../packages/data-portal/app/hooks/useFilter.ts)                 |
| `useI18n()`           | Type-safe translations  | [`hooks/useI18n.ts`](../../../packages/data-portal/app/hooks/useI18n.ts)                     |
| `useMetadataDrawer()` | Drawer state management | [`hooks/useMetadataDrawer.ts`](../../../packages/data-portal/app/hooks/useMetadataDrawer.ts) |
| `useQueryParam()`     | Single URL param state  | [`hooks/useQueryParam.ts`](../../../packages/data-portal/app/hooks/useQueryParam.ts)         |
| `useIsLoading()`      | Debounced loading state | [`hooks/useIsLoading.ts`](../../../packages/data-portal/app/hooks/useIsLoading.ts)           |
| `usePlausible()`      | Analytics tracking      | [`hooks/usePlausible.ts`](../../../packages/data-portal/app/hooks/usePlausible.ts)           |

---

## URL State Hooks

Manage state that is synchronized with URL query parameters for shareable/bookmarkable state.

**When to use:** For filters, sorting, pagination, drawer state, or any UI state that should persist in the URL and be shareable via links.

### Hook API Overview

| Hook                | Purpose                 | Returns                                          |
| ------------------- | ----------------------- | ------------------------------------------------ |
| `useFilter`         | Multi-filter URL state  | `{ values, updateValue, updateValues, reset }`   |
| `useQueryParam`     | Single URL param        | `[value, setValue]`                              |
| `useQueryParams`    | Multiple URL params     | `[params, setParams]`                            |
| `useGroupBy`        | Grouping option state   | `[groupBy, setGroupBy]`                          |
| `useMetadataDrawer` | Drawer open/close state | `{ activeDrawer, openDrawer, closeDrawer, ... }` |

### Representative Example: useFilter

All URL state hooks follow similar patterns. `useFilter` demonstrates the core approach:

```typescript
function DatasetTable() {
  const filter = useFilter()

  // Read filter state
  const organismNames = filter.sampleAndExperimentConditions.organismNames

  // Update single filter
  const handleOrganismChange = (organism: string) => {
    filter.updateValue(QueryParams.Organism, organism)
  }

  // Update multiple filters atomically
  const handleApplyFilters = () => {
    filter.updateValues({
      [QueryParams.Organism]: ['Homo sapiens'],
      [QueryParams.GroundTruthAnnotation]: 'true',
    })
  }

  // Reset all filters
  const handleReset = () => filter.reset()
}
```

**See:** [Filter System](../02-data/03-filter-system.md) for complete filter documentation.

### Other URL State Hooks

**useQueryParam** - Single parameter with type safety and serialization:

```typescript
const [sort, setSort] = useQueryParam<'asc' | 'desc'>(QueryParams.Sort, {
  defaultValue: 'asc',
  serialize: (v) => String(v),
  deserialize: (v) => (v as 'asc' | 'desc') || 'asc',
})
```

**useMetadataDrawer** - Drawer state via URL for shareable deep links:

```typescript
const drawer = useMetadataDrawer()
drawer.openDrawer(MetadataDrawerId.Dataset, MetadataTab.Metadata)
drawer.closeDrawer()
```

**See:** [Metadata Drawers](../04-components/03-metadata-drawers.md) for drawer documentation.

---

## Data Fetching Hooks

Access data loaded by Remix route loaders or fetch data by ID.

**When to use:** Access server-loaded data in components, or fetch individual entities by ID.

> **Note:** For client-side data fetching with React Query, see [Deposition Data Fetching](../02-data/04-deposition-data-fetching.md).

### Hook API Overview

| Hook                | Input          | Returns                          |
| ------------------- | -------------- | -------------------------------- |
| `useDatasets`       | -              | `{ datasets: Dataset[] }`        |
| `useDatasetById`    | `id`           | `{ dataset, loading, error }`    |
| `useRunById`        | `runId`        | `{ run, loading, error }`        |
| `useDepositionById` | `depositionId` | `{ deposition, loading, error }` |

### Representative Example: useDatasetById

All data hooks follow similar loading/error patterns:

```typescript
function DatasetDetails({ id }: { id: number }) {
  const { dataset, loading, error } = useDatasetById(id)

  if (loading) return <Skeleton />
  if (error) return <ErrorState error={error} />

  return (
    <div>
      <h1>{dataset.title}</h1>
      <p>{dataset.description}</p>
    </div>
  )
}
```

The pattern is consistent across all `use*ById` hooks - they return data, loading state, and error state.

---

## UI State Hooks

Manage component-level UI state that doesn't need URL persistence.

**When to use:** Loading indicators, accordion expansion, snackbar notifications, modal state, resize observers.

### Hook API Overview

| Hook                              | Purpose                    | Returns                             |
| --------------------------------- | -------------------------- | ----------------------------------- |
| `useIsLoading`                    | Debounced navigation state | `{ isLoading, isLoadingDebounced }` |
| `useAccordionState`               | Accordion expand/collapse  | `{ isExpanded, toggleGroup, ... }`  |
| `useDownloadModalQueryParamState` | Download modal control     | `{ openDatasetDownloadModal, ... }` |
| `useAutoHideSnackbar`             | Auto-hiding notifications  | `(message, options) => void`        |
| `useResizeObserver`               | Element size changes       | `[ref, DOMRect]`                    |

### Representative Example: useIsLoading

```typescript
function DataTable() {
  const { isLoading, isLoadingDebounced } = useIsLoading()

  // Use debounced loading for skeleton UI (prevents flashing)
  if (isLoadingDebounced) {
    return <TableSkeleton />
  }

  return <Table data={data} />
}
```

**Why debounce?** Prevents UI flashing on fast navigation. The 250ms delay balances responsiveness with visual stability.

**See:** [Error Handling](./01-error-handling.md) for loading state patterns.

---

## Internationalization Hooks

### useI18n

Type-safe wrapper around react-i18next.

```typescript
function MyComponent() {
  const { t, i18n } = useI18n()

  const title = t('datasets')                      // Simple translation
  const message = t('datasetCount', { count: 42 }) // With interpolation
  const results = t('acrossDatasets', { count: 5 })// With pluralization

  return <h1>{title}</h1>
}
```

**See:** [Internationalization](./02-internationalization.md)

---

## Analytics Hooks

Track user interactions for product insights.

### usePlausible

```typescript
function DatasetTable() {
  const plausible = usePlausible()

  const handleDownload = (datasetId: number) => {
    plausible(Events.OpenDownloadModal, { datasetId, fileSize: dataset.size })
  }

  const handleFilter = (field: QueryParams, value: string) => {
    plausible(Events.Filter, { field, value, type: 'dataset' })
  }
}
```

**Available Events:** `OpenDownloadModal`, `CloseDownloadModal`, `Filter`, `ToggleMetadataDrawer`, `ViewTomogram`, `ClickBrowseDataTab`, `ClickDeposition`, `CopyDownloadInfo`

**useLogPlausibleCopyEvent** - Convenience hook for copy-to-clipboard tracking.

---

## Utility Hooks

### Common Utilities

| Hook                | Purpose                      | Example Usage                                |
| ------------------- | ---------------------------- | -------------------------------------------- |
| `useEffectOnce`     | Run effect only on mount     | `useEffectOnce(() => initializeComponent())` |
| `useResizeObserver` | Observe element size changes | `const [ref, rect] = useResizeObserver()`    |

---

## Best Practices

### Choosing the Right State Location

```typescript
// URL state: shareable/bookmarkable (filters, pagination, drawer state)
const [sort, setSort] = useQueryParam(QueryParams.Sort)

// React state: temporary UI state (hover, focus, local toggles)
const [isExpanded, setIsExpanded] = useState(false)
```

### Composing Hooks

```typescript
function MyComponent() {
  const filter = useFilter()
  const drawer = useMetadataDrawer()
  const plausible = usePlausible()

  const handleFilterChange = (value: string) => {
    filter.updateValue(QueryParams.Organism, value)
    plausible(Events.Filter, { field: 'organism', value })
  }
}
```

### Common Mistakes to Avoid

- **Don't use URL state for sensitive data** - passwords, tokens should use React state
- **Don't forget analytics** - track meaningful user actions for product insights
- **Don't mix concerns** - keep hooks focused on single responsibilities

---

## Creating Custom Hooks

### Naming Convention

Always prefix hooks with `use`:

```typescript
useDatasetFilter() // Good
getDatasetFilter() // Bad - not recognized as hook
```

### Standard Pattern

```typescript
export function useMyFeature(options?: MyFeatureOptions) {
  const [value, setValue] = useState()

  useEffect(() => {
    /* side effects */
  }, [dependencies])

  const handleAction = useCallback(() => {
    /* logic */
  }, [dependencies])

  return { value, setValue, handleAction }
}
```

**Testing hooks:** See [Testing Guide](../../03-development/06-testing-guide.md) for hook testing patterns with React Testing Library.

---

## Next Steps

- [Filter System](../02-data/03-filter-system.md) - Deep dive into useFilter
- [Metadata Drawers](../04-components/03-metadata-drawers.md) - Using useMetadataDrawer
- [Download Modal](../04-components/04-download-modal.md) - Download hooks
- [Internationalization](./02-internationalization.md) - Using useI18n
- [Deposition Data Fetching](../02-data/04-deposition-data-fetching.md) - React Query + API route pattern
