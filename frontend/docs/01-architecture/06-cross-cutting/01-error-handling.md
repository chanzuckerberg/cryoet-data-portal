# Error Handling

This document describes error handling patterns used throughout the CryoET Data Portal, including error boundaries, 404 pages, and error states.


## Quick Reference

| Pattern          | Implementation         | Location                                                                                              |
| ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| Error Boundaries | `<ErrorBoundary>`      | [`components/ErrorBoundary.tsx`](../../../packages/data-portal/app/components/ErrorBoundary.tsx)         |
| Route Errors     | Remix error boundaries | [`root.tsx`](../../../packages/data-portal/app/root.tsx)                                                 |
| Loading States   | `useIsLoading()` hook  | [`hooks/useIsLoading.ts`](../../../packages/data-portal/app/hooks/useIsLoading.ts)                       |
| Empty States     | `<NoFilteredResults>`  | [`components/NoFilteredResults.tsx`](../../../packages/data-portal/app/components/NoFilteredResults.tsx) |

---

## Error Boundary Pattern

### Basic Usage

Wrap components that might throw errors:

```typescript
import { ErrorBoundary } from 'app/components/ErrorBoundary'

function MyPage() {
  return (
    <ErrorBoundary logId="my-page">
      <ComponentThatMightThrow />
    </ErrorBoundary>
  )
}
```

### ErrorBoundary Component

```typescript
export function ErrorBoundary({
  children,
  logId,
}: {
  children: ReactNode
  logId?: string
}) {
  return (
    <FallbackRenderContext.Provider value={{ logId }}>
      <ReactErrorBoundary FallbackComponent={FallbackRender}>
        {children}
      </ReactErrorBoundary>
    </FallbackRenderContext.Provider>
  )
}
```

**Location:** [`components/ErrorBoundary.tsx`](../../../packages/data-portal/app/components/ErrorBoundary.tsx)

### Fallback UI

```typescript
function FallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useI18n()
  const { logId } = useContext(FallbackRenderContext)
  const errorMessage = getErrorMessage(error)

  useEffect(() => {
    if (logId) {
      sendLogs({
        level: LogLevel.Error,
        messages: [{
          type: 'browser',
          message: 'ErrorBoundary error',
          error: errorMessage,
          logId,
        }],
      })
    }
  }, [errorMessage, logId])

  return (
    <div role="alert" className="p-2">
      <p className="font-bold text-black ml-2">
        {t('somethingWentWrong')}:
      </p>
      <pre className="text-red-500 ml-2">{errorMessage}</pre>
      <Button onClick={resetErrorBoundary}>
        {t('refresh')}
      </Button>
    </div>
  )
}
```

**Features:**

- Displays error message to user
- Logs error to backend
- Provides refresh button to retry
- Shows full error details in development

---

## Automatic Error Recovery

### Table Render Errors

Special handling for table rendering errors with automatic reload:

```typescript
const MAX_RELOADS_FOR_TABLE_RENDER_ERROR = 3

function FallbackRender({ error }: FallbackProps) {
  const tableRenderErrorCountStorage = useSessionStorageValue(
    LocalStorageKeys.TableRenderErrorPageReloadCount,
    { defaultValue: 0 },
  )

  useEffect(() => {
    if (
      logId === TABLE_PAGE_LAYOUT_LOG_ID &&
      (tableRenderErrorCountStorage.value ?? 0) <
        MAX_RELOADS_FOR_TABLE_RENDER_ERROR
    ) {
      tableRenderErrorCountStorage.set((prev) => (prev ?? 0) + 1)
      window.location.reload()
    }
  }, [logId, tableRenderErrorCountStorage])

  // ... fallback UI
}
```

**Behavior:**

- Automatically reloads page on table errors (up to 3 times)
- Uses session storage to track reload count
- Prevents infinite reload loops
- Only applies to specific log IDs

---

## Remix Error Boundaries

### Route-Level Error Handling

Remix provides route-level error boundaries:

```typescript
// In any route file
export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  )
}
```

### 404 Not Found

Handle missing resources gracefully:

```typescript
export async function loader({ params }: LoaderFunctionArgs) {
  const dataset = await getDataset(params.id)

  if (!dataset) {
    throw new Response('Dataset not found', { status: 404 })
  }

  return json({ dataset })
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-sds-header-xxl-600-wide font-semibold mb-sds-l">
          404 - Dataset Not Found
        </h1>
        <p className="text-sds-body-l-400-wide mb-sds-xl">
          The dataset you're looking for doesn't exist.
        </p>
        <Link to="/browse-data/datasets">
          <Button>Browse Datasets</Button>
        </Link>
      </div>
    )
  }

  // Handle other errors
  return <GenericErrorPage error={error} />
}
```

---

## Loading States

### useIsLoading Hook

Provides loading state with debouncing:

```typescript
export function useIsLoading() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  const [isLoadingDebounced, setIsLoadingDebounced] = useDebouncedState(
    isLoading,
    250, // 250ms delay
  )

  useEffect(
    () => setIsLoadingDebounced(isLoading),
    [isLoading, setIsLoadingDebounced],
  )

  return {
    isLoading, // Immediate state
    isLoadingDebounced, // Debounced (prevents flashing)
  }
}
```

**Location:** [`hooks/useIsLoading.ts`](../../../packages/data-portal/app/hooks/useIsLoading.ts)

### Usage in Components

```typescript
function DataTable() {
  const { isLoadingDebounced } = useIsLoading()

  if (isLoadingDebounced) {
    return <TableSkeleton rows={10} />
  }

  return <Table data={data} />
}
```

**Why debounce?**

- Prevents UI flashing on fast navigation
- Especially important for cached routes
- Better UX for quick interactions

---

## Empty States

### NoFilteredResults Component

Display when filters return no results:

```typescript
export function NoFilteredResults({ showSearchTip }: Props) {
  const { t } = useI18n()
  const filter = useFilter()

  return (
    <div className="flex flex-col items-center gap-sds-l py-sds-xxl">
      <Icon
        sdsIcon="InfoCircle"
        sdsSize="xl"
        className="text-light-sds-color-primitive-gray-400"
      />

      <div className="text-center">
        <h3 className="text-sds-header-l-600-wide font-semibold mb-sds-xs">
          {t('noResultsFound')}
        </h3>
        <p className="text-sds-body-m-400-wide text-light-sds-color-primitive-gray-600">
          {showSearchTip
            ? t('tryAdjustingFiltersOrSearch')
            : t('tryAdjustingFilters')
          }
        </p>
      </div>

      <Button onClick={filter.reset} sdsType="secondary">
        {t('clearAllFilters')}
      </Button>
    </div>
  )
}
```

**Location:** [`components/NoFilteredResults.tsx`](../../../packages/data-portal/app/components/NoFilteredResults.tsx)

### EmptyState Component

Generic empty state for various scenarios:

```typescript
export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-sds-l py-sds-xxl">
      {icon && <Icon sdsIcon={icon} sdsSize="xl" />}

      <div className="text-center">
        <h3 className="text-sds-header-l-600-wide font-semibold mb-sds-xs">
          {title}
        </h3>
        {description && (
          <p className="text-sds-body-m-400-wide text-light-sds-color-primitive-gray-600">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  )
}
```

**Usage:**

```typescript
<EmptyState
  icon="InboxEmpty"
  title="No annotations available"
  description="This dataset doesn't have any annotations yet."
  action={
    <Link to="/browse-data/depositions">
      <Button>Browse Depositions</Button>
    </Link>
  }
/>
```

---

## Skeleton Loading States

### Table Skeleton

```typescript
export function TableSkeleton({ rows = 10, columns = 5 }: Props) {
  return (
    <div className="flex flex-col gap-sds-s p-sds-l">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-sds-m">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} variant="rectangular" height={40} />
          ))}
        </div>
      ))}
    </div>
  )
}
```

### Content Skeleton

```typescript
export function ContentSkeleton() {
  return (
    <div className="flex flex-col gap-sds-l p-sds-xl">
      <Skeleton variant="text" width="60%" height={40} />
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="70%" />
    </div>
  )
}
```

---

## API Error Handling

### GraphQL Errors

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { data, errors } = await apolloClientV2.query({
      query: GetDatasetsV2Document,
      variables: { where },
    })

    if (errors) {
      console.error('GraphQL errors:', errors)
      throw new Error('Failed to fetch datasets')
    }

    return json({ data })
  } catch (error) {
    console.error('Loader error:', error)
    throw new Response('Failed to load data', { status: 500 })
  }
}
```

### Network Errors

```typescript
async function fetchData() {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error (offline, CORS, etc.)
      showNotification({
        message: t('networkError'),
        type: 'error',
      })
    } else {
      // Other errors
      showNotification({
        message: t('genericError'),
        type: 'error',
      })
    }
    throw error
  }
}
```

---

## Error Logging

### sendLogs Utility

```typescript
export function sendLogs({
  level,
  messages,
}: {
  level: LogLevel
  messages: LogMessage[]
}) {
  const endpoint = '/api/logs'

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level,
      messages,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }),
  }).catch((error) => {
    console.error('Failed to send logs:', error)
  })
}
```

### Log Levels

```typescript
export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}
```

### Usage

```typescript
// Log an error
sendLogs({
  level: LogLevel.Error,
  messages: [
    {
      type: 'browser',
      message: 'Failed to load dataset',
      error: error.message,
      logId: 'dataset-page',
      datasetId: params.id,
    },
  ],
})

// Log info
sendLogs({
  level: LogLevel.Info,
  messages: [
    {
      type: 'browser',
      message: 'User downloaded dataset',
      datasetId: dataset.id,
    },
  ],
})
```

---

## User Feedback

### Toast Notifications

```typescript
import { useSnackbar } from '@czi-sds/components'

function MyComponent() {
  const { enqueueSnackbar } = useSnackbar()

  const handleAction = async () => {
    try {
      await performAction()
      enqueueSnackbar('Action completed successfully', {
        variant: 'success',
      })
    } catch (error) {
      enqueueSnackbar('Action failed', {
        variant: 'error',
      })
    }
  }
}
```

### Auto-Hide Snackbar Hook

```typescript
export function useAutoHideSnackbar() {
  const { enqueueSnackbar } = useSnackbar()

  return useCallback(
    (message: string, options?: SnackbarOptions) => {
      enqueueSnackbar(message, {
        ...options,
        autoHideDuration: 3000,
      })
    },
    [enqueueSnackbar],
  )
}
```

**Location:** [`hooks/useAutoHideSnackbar.ts`](../../../packages/data-portal/app/hooks/useAutoHideSnackbar.ts)

---

## Validation Errors

### Form Validation

```typescript
function DatasetForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (values: FormValues) => {
    const newErrors: Record<string, string> = {}

    if (!values.title) {
      newErrors.title = 'Title is required'
    }

    if (!values.organismName) {
      newErrors.organismName = 'Organism name is required'
    }

    return newErrors
  }

  const handleSubmit = (values: FormValues) => {
    const validationErrors = validate(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Submit form
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        error={!!errors.title}
        helperText={errors.title}
      />
      <Input
        label="Organism"
        error={!!errors.organismName}
        helperText={errors.organismName}
      />
    </form>
  )
}
```

---

## Best Practices

### Do's

✅ **Always provide user-friendly error messages**

```typescript
// Good
throw new Error('Failed to load dataset. Please try again.')

// Avoid
throw new Error('Network request failed with status 500')
```

✅ **Log errors for debugging**

```typescript
try {
  await action()
} catch (error) {
  console.error('Action failed:', error)
  sendLogs({ level: LogLevel.Error, messages: [...] })
  throw error
}
```

✅ **Provide recovery actions**

```typescript
<ErrorState
  message="Failed to load data"
  action={<Button onClick={retry}>Retry</Button>}
/>
```

✅ **Use appropriate error boundaries**

```typescript
<ErrorBoundary logId="specific-feature">
  <FeatureComponent />
</ErrorBoundary>
```

### Don'ts

❌ **Don't expose sensitive information**

```typescript
// Avoid
<div>Error: {error.stack}</div>

// Better
<div>An error occurred. Please try again.</div>
```

❌ **Don't ignore errors silently**

```typescript
// Avoid
try {
  await action()
} catch (error) {
  // Silent failure
}

// Better
try {
  await action()
} catch (error) {
  console.error(error)
  showNotification('Action failed')
}
```

❌ **Don't create error boundary waterfalls**

```typescript
// Avoid
<ErrorBoundary>
  <ErrorBoundary>
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  </ErrorBoundary>
</ErrorBoundary>

// Better - one boundary at appropriate level
<ErrorBoundary logId="page">
  <Component />
</ErrorBoundary>
```

---

## Testing Error States

### Testing Error Boundaries

```typescript
describe('ErrorBoundary', () => {
  it('catches errors and displays fallback', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('allows retry after error', async () => {
    const user = userEvent.setup()
    render(<ErrorBoundary><ComponentThatThrows /></ErrorBoundary>)

    await user.click(screen.getByText('Refresh'))
    expect(mockReset).toHaveBeenCalled()
  })
})
```

---

## Next Steps

- [Component Architecture](../04-components/01-component-architecture.md) - Component structure
- [Hooks Guide](./03-hooks-guide.md) - Custom hooks including useIsLoading
- [Technology Stack](../00-foundation/01-technology-stack.md) - Testing setup
