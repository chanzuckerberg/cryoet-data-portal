# Hooks Guide

This document catalogs the custom React hooks used throughout the CryoET Data Portal with usage examples and best practices.


## Quick Reference

| Hook                  | Purpose                 | Location                                                                                  |
| --------------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| `useFilter()`         | URL-driven filter state | [`hooks/useFilter.ts`](../../../packages/data-portal/app/hooks/useFilter.ts)                 |
| `useI18n()`           | Type-safe translations  | [`hooks/useI18n.ts`](../../../packages/data-portal/app/hooks/useI18n.ts)                     |
| `useMetadataDrawer()` | Drawer state management | [`hooks/useMetadataDrawer.ts`](../../../packages/data-portal/app/hooks/useMetadataDrawer.ts) |
| `useQueryParam()`     | Single URL param state  | [`hooks/useQueryParam.ts`](../../../packages/data-portal/app/hooks/useQueryParam.ts)         |
| `useIsLoading()`      | Debounced loading state | [`hooks/useIsLoading.ts`](../../../packages/data-portal/app/hooks/useIsLoading.ts)           |
| `usePlausible()`      | Analytics tracking      | [`hooks/usePlausible.ts`](../../../packages/data-portal/app/hooks/usePlausible.ts)           |

---

## State Management Hooks

### useFilter

Manages URL-driven filter state for datasets, runs, and depositions.

```typescript
function DatasetTable() {
  const filter = useFilter()

  // Read filter state
  const organismNames = filter.sampleAndExperimentConditions.organismNames
  const isGroundTruth = filter.includedContents.isGroundTruthEnabled

  // Update single filter
  const handleOrganismChange = (organism: string) => {
    filter.updateValue(QueryParams.Organism, organism)
  }

  // Update multiple filters
  const handleApplyFilters = () => {
    filter.updateValues({
      [QueryParams.Organism]: ['Homo sapiens'],
      [QueryParams.GroundTruthAnnotation]: 'true',
    })
  }

  // Reset all filters
  const handleReset = () => {
    filter.reset()
  }
}
```

**See:** [Filter System](../02-data/03-filter-system.md)

**Location:** [`hooks/useFilter.ts`](../../../packages/data-portal/app/hooks/useFilter.ts)

---

### useQueryParam

Manages a single URL query parameter with type safety.

```typescript
function MyComponent() {
  const [sort, setSort] = useQueryParam<'asc' | 'desc'>(
    QueryParams.Sort,
    {
      defaultValue: 'asc',
      serialize: (value) => String(value),
      deserialize: (value) => (value as 'asc' | 'desc') || 'asc',
    }
  )

  return (
    <Select
      value={sort}
      onChange={(value) => setSort(value)}
    >
      <MenuItem value="asc">Ascending</MenuItem>
      <MenuItem value="desc">Descending</MenuItem>
    </Select>
  )
}
```

**Options:**

- `defaultValue` - Default when param not in URL
- `serialize` - Convert value to string for URL
- `deserialize` - Parse string from URL
- `preventScrollReset` - Don't scroll to top on change

**Location:** [`hooks/useQueryParam.ts`](../../../packages/data-portal/app/hooks/useQueryParam.ts)

---

### useQueryParams

Manages multiple URL query parameters together.

```typescript
function MyComponent() {
  const [params, setParams] = useQueryParams({
    [QueryParams.Page]: stringParam(),
    [QueryParams.Sort]: stringParam<'asc' | 'desc'>(),
    [QueryParams.Search]: stringParam(),
  })

  // Read values
  const { page, sort, search } = params

  // Update single param
  setParams({ [QueryParams.Page]: '2' })

  // Update multiple params
  setParams({
    [QueryParams.Sort]: 'desc',
    [QueryParams.Page]: '1',
  })

  // Clear all params
  setParams(null)
}
```

**Location:** [`hooks/useQueryParam.ts`](../../../packages/data-portal/app/hooks/useQueryParam.ts)

---

### useMetadataDrawer

Manages metadata drawer state via URL parameters.

```typescript
function DatasetRow({ dataset }: Props) {
  const drawer = useMetadataDrawer()

  return (
    <button
      onClick={() => {
        drawer.openDrawer(MetadataDrawerId.Dataset, MetadataTab.Metadata)
      }}
    >
      View Details
    </button>
  )
}

function MyPage() {
  const drawer = useMetadataDrawer()

  // Check active drawer
  const isDatasetDrawerOpen = drawer.activeDrawer === MetadataDrawerId.Dataset

  // Get active tab
  const currentTab = drawer.activeTab

  // Close drawer
  const handleClose = () => {
    drawer.closeDrawer()
  }

  // Toggle drawer
  const handleToggle = () => {
    drawer.toggleDrawer(MetadataDrawerId.Dataset)
  }

  // Change tab
  const handleTabChange = (tab: MetadataTab) => {
    drawer.setActiveTab(tab)
  }
}
```

**See:** [Metadata Drawers](../04-components/03-metadata-drawers.md)

**Location:** [`hooks/useMetadataDrawer.ts`](../../../packages/data-portal/app/hooks/useMetadataDrawer.ts)

---

### useAccordionState

Manages expanded state and pagination for accordion groups.

```typescript
function OrganismAccordionTable() {
  const accordionState = useAccordionState()

  return organisms.map((organism) => {
    const groupKey = organism.name
    const currentPage = accordionState.getCurrentPage(groupKey)
    const isExpanded = accordionState.isExpanded(groupKey)

    return (
      <Accordion
        key={groupKey}
        expanded={isExpanded}
        onChange={(_, expanded) => {
          accordionState.toggleGroup(groupKey, expanded)
          if (!expanded) {
            accordionState.resetPagination(groupKey)
          }
        }}
      >
        <AccordionSummary>{organism.name}</AccordionSummary>
        <AccordionDetails>
          <DataTable
            data={organism.data.slice(
              0,
              currentPage * accordionState.defaultPageSize
            )}
          />
          <Pagination
            page={currentPage}
            onChange={(page) => accordionState.updatePagination(groupKey, page)}
          />
        </AccordionDetails>
      </Accordion>
    )
  })
}
```

**Location:** [`hooks/useAccordionState.ts`](../../../packages/data-portal/app/hooks/useAccordionState.ts)

---

### useGroupBy

Manages grouping option with URL state.

```typescript
function DepositionTable() {
  const [groupBy, setGroupBy] = useGroupBy({
    preventScrollReset: true,
  })

  return (
    <Select
      value={groupBy}
      onChange={(value) => setGroupBy(value)}
    >
      <MenuItem value={GroupByOption.None}>No Grouping</MenuItem>
      <MenuItem value={GroupByOption.Organism}>Group by Organism</MenuItem>
      <MenuItem value={GroupByOption.Dataset}>Group by Dataset</MenuItem>
    </Select>
  )
}
```

**Location:** [`hooks/useGroupBy.ts`](../../../packages/data-portal/app/hooks/useGroupBy.ts)

---

## Data Fetching Hooks

> **Note:** For client-side data fetching in the Deposition feature (React Query + API routes), see [Deposition Data Fetching](../02-data/04-deposition-data-fetching.md).

### useDatasets

Access datasets from Remix loader data.

```typescript
function DatasetTable() {
  const { datasets } = useDatasets()

  return (
    <Table>
      {datasets.map((dataset) => (
        <TableRow key={dataset.id}>
          <TableCell>{dataset.title}</TableCell>
        </TableRow>
      ))}
    </Table>
  )
}
```

**Location:** [`hooks/useDatasets.ts`](../../../packages/data-portal/app/hooks/useDatasets.ts)

---

### useDatasetById

Fetch a specific dataset by ID.

```typescript
function DatasetDetails() {
  const { dataset, loading, error } = useDatasetById(123)

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

**Location:** [`hooks/useDatasetById.ts`](../../../packages/data-portal/app/hooks/useDatasetById.ts)

---

### useRunById

Fetch a specific run by ID.

```typescript
function RunDetails({ runId }: Props) {
  const { run, loading, error } = useRunById(runId)

  if (loading) return <Skeleton />
  if (error) return <ErrorState error={error} />

  return (
    <div>
      <h2>{run.name}</h2>
      <p>Dataset: {run.dataset.title}</p>
    </div>
  )
}
```

**Location:** [`hooks/useRunById.ts`](../../../packages/data-portal/app/hooks/useRunById.ts)

---

### useDepositionById

Fetch a specific deposition by ID.

```typescript
function DepositionDetails({ depositionId }: Props) {
  const { deposition, loading, error } = useDepositionById(depositionId)

  if (loading) return <Skeleton />
  if (error) return <ErrorState error={error} />

  return (
    <div>
      <h1>{deposition.title}</h1>
      <p>Type: {deposition.depositionTypes[0].type}</p>
    </div>
  )
}
```

**Location:** [`hooks/useDepositionById.ts`](../../../packages/data-portal/app/hooks/useDepositionById.ts)

---

## UI State Hooks

### useIsLoading

Provides loading state with debouncing to prevent UI flashing.

```typescript
function DataTable() {
  const { isLoading, isLoadingDebounced } = useIsLoading()

  // Use immediate loading for critical UI
  if (isLoading) {
    console.log('Navigation started')
  }

  // Use debounced loading for skeleton/spinner UI
  if (isLoadingDebounced) {
    return <TableSkeleton />
  }

  return <Table data={data} />
}
```

**Why debounce?**

- Prevents flashing on fast navigation
- Better UX for cached routes
- 250ms delay balances responsiveness and stability

**See:** [Error Handling](./01-error-handling.md)

**Location:** [`hooks/useIsLoading.ts`](../../../packages/data-portal/app/hooks/useIsLoading.ts)

---

### useDownloadModalQueryParamState

Manages download modal state and configuration.

```typescript
function DatasetActions({ dataset }: Props) {
  const {
    openDatasetDownloadModal,
    openRunDownloadModal,
    openAnnotationDownloadModal,
    closeDownloadModal,
  } = useDownloadModalQueryParamState()

  return (
    <>
      <Button
        onClick={() =>
          openDatasetDownloadModal({
            datasetId: dataset.id,
            fileSize: dataset.size,
          })
        }
      >
        Download Dataset
      </Button>

      <Button
        onClick={() =>
          openRunDownloadModal({
            runId: run.id,
            datasetId: dataset.id,
          })
        }
      >
        Download Run
      </Button>
    </>
  )
}
```

**See:** [Download Modal](../04-components/04-download-modal.md)

**Location:** [`hooks/useDownloadModalQueryParamState.ts`](../../../packages/data-portal/app/hooks/useDownloadModalQueryParamState.ts)

---

## Internationalization Hooks

### useI18n

Type-safe wrapper around react-i18next.

```typescript
function MyComponent() {
  const { t, i18n } = useI18n()

  // Simple translation
  const title = t('datasets')

  // With interpolation
  const message = t('datasetCount', { count: 42 })

  // With pluralization
  const results = t('acrossDatasets', { count: 5 })

  // Change language (if multi-language support added)
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  // Get current language
  const currentLanguage = i18n.language

  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  )
}
```

**See:** [Internationalization](./02-internationalization.md)

**Location:** [`hooks/useI18n.ts`](../../../packages/data-portal/app/hooks/useI18n.ts)

---

## Analytics Hooks

### usePlausible

Track user interactions and events.

```typescript
function DatasetTable() {
  const plausible = usePlausible()

  const handleDownload = (datasetId: number) => {
    plausible(Events.OpenDownloadModal, {
      datasetId,
      fileSize: dataset.size,
    })
  }

  const handleFilter = (field: QueryParams, value: string) => {
    plausible(Events.Filter, {
      field,
      value,
      type: 'dataset',
    })
  }

  const handleViewTomogram = (tomogramId: number) => {
    plausible(Events.ViewTomogram, {
      tomogramId,
      datasetId: dataset.id,
      runId: run.id,
      organism: dataset.organismName,
      type: 'tomogram',
    })
  }
}
```

**Available Events:**

- `Events.OpenDownloadModal`
- `Events.CloseDownloadModal`
- `Events.Filter`
- `Events.ToggleMetadataDrawer`
- `Events.ViewTomogram`
- `Events.ClickBrowseDataTab`
- `Events.ClickDeposition`
- `Events.CopyDownloadInfo`

**Location:** [`hooks/usePlausible.ts`](../../../packages/data-portal/app/hooks/usePlausible.ts)

---

### useLogPlausibleCopyEvent

Track copy-to-clipboard events.

```typescript
function CopyableText({ content }: Props) {
  const logCopyEvent = useLogPlausibleCopyEvent()

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    logCopyEvent({
      datasetId: dataset.id,
      type: 'dataset-s3-path',
      content,
    })
  }

  return (
    <Button onClick={handleCopy}>
      Copy to Clipboard
    </Button>
  )
}
```

**Location:** [`hooks/useLogPlausibleCopyEvent.ts`](../../../packages/data-portal/app/hooks/useLogPlausibleCopyEvent.ts)

---

## Utility Hooks

### useEffectOnce

Run effect only once on mount.

```typescript
function MyComponent() {
  const [data, setData] = useState(null)

  useEffectOnce(() => {
    // This runs only once on mount
    initializeComponent()
    fetchInitialData()
  })

  return <div>{data}</div>
}
```

**Implementation:**

```typescript
export function useEffectOnce(effect: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, [])
}
```

**Location:** [`hooks/useEffectOnce.ts`](../../../packages/data-portal/app/hooks/useEffectOnce.ts)

---

### useResizeObserver

Observe element size changes.

```typescript
function ResponsiveComponent() {
  const [ref, rect] = useResizeObserver()

  return (
    <div ref={ref}>
      {rect && (
        <p>
          Width: {rect.width}px, Height: {rect.height}px
        </p>
      )}
      <DynamicContent />
    </div>
  )
}
```

**Returns:**

- `ref` - Ref to attach to element
- `rect` - DOMRect with width, height, x, y, etc.

**Location:** [`hooks/useResizeObserver.ts`](../../../packages/data-portal/app/hooks/useResizeObserver.ts)

---

### useAutoHideSnackbar

Show auto-hiding notification.

```typescript
function MyComponent() {
  const showNotification = useAutoHideSnackbar()

  const handleSuccess = () => {
    showNotification('Operation completed successfully', {
      variant: 'success',
    })
  }

  const handleError = () => {
    showNotification('Operation failed', {
      variant: 'error',
    })
  }

  return (
    <div>
      <Button onClick={handleSuccess}>Success Action</Button>
      <Button onClick={handleError}>Failing Action</Button>
    </div>
  )
}
```

**Default:** 3-second auto-hide duration

**Location:** [`hooks/useAutoHideSnackbar.ts`](../../../packages/data-portal/app/hooks/useAutoHideSnackbar.ts)

---

## Best Practices

### Do's

✅ **Use appropriate hook for state type**

```typescript
// URL state for shareable/bookmarkable state
const [sort, setSort] = useQueryParam(QueryParams.Sort)

// React state for temporary UI state
const [isExpanded, setIsExpanded] = useState(false)
```

✅ **Compose hooks for complex features**

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

✅ **Use debounced loading for UI skeletons**

```typescript
const { isLoadingDebounced } = useIsLoading()
return isLoadingDebounced ? <Skeleton /> : <Content />
```

✅ **Provide meaningful analytics events**

```typescript
plausible(Events.Filter, {
  field: QueryParams.Organism,
  value: 'Homo sapiens',
  type: 'dataset',
})
```

### Don'ts

❌ **Don't use URL state for sensitive data**

```typescript
// Avoid
const [password, setPassword] = useQueryParam('password')

// Use
const [password, setPassword] = useState('')
```

❌ **Don't forget to track user actions**

```typescript
// Missing analytics
const handleDownload = () => {
  downloadFile()
}

// With analytics
const handleDownload = () => {
  plausible(Events.OpenDownloadModal, { datasetId })
  downloadFile()
}
```

❌ **Don't create hooks that mix concerns**

```typescript
// Avoid - mixing data fetching and UI state
function useDatasetTableState() {
  const datasets = useDatasets()
  const [selectedRow, setSelectedRow] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Too many concerns
}

// Better - separate hooks
function MyComponent() {
  const { datasets } = useDatasets()
  const [selectedRow, setSelectedRow] = useState(null)
  const modalState = useModalState()
}
```

---

## Creating Custom Hooks

### Hook Naming

Always prefix hooks with `use`:

```typescript
// Good
useDatasetFilter()
useOrganismPagination()
useTableSort()

// Bad
getDatasetFilter()
datasetFilter()
organismPagination()
```

### Hook Pattern

```typescript
/**
 * Hook description explaining purpose and usage
 */
export function useMyFeature(options?: MyFeatureOptions) {
  // State
  const [value, setValue] = useState()

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies])

  // Callbacks
  const handleAction = useCallback(() => {
    // Memoized callback
  }, [dependencies])

  // Return API
  return {
    value,
    setValue,
    handleAction,
  }
}
```

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react'

describe('useMyFeature', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useMyFeature())
    expect(result.current.value).toBe(defaultValue)
  })

  it('should update value', () => {
    const { result } = renderHook(() => useMyFeature())

    act(() => {
      result.current.setValue(newValue)
    })

    expect(result.current.value).toBe(newValue)
  })
})
```

---

## Next Steps

- [Filter System](../02-data/03-filter-system.md) - Deep dive into useFilter
- [Metadata Drawers](../04-components/03-metadata-drawers.md) - Using useMetadataDrawer
- [Download Modal](../04-components/04-download-modal.md) - Download hooks
- [Internationalization](./02-internationalization.md) - Using useI18n
- [Deposition Data Fetching](../02-data/04-deposition-data-fetching.md) - React Query + API route pattern
