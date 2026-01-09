# Error Handling

This document describes error handling patterns used throughout the CryoET Data Portal.

## Quick Reference

| Pattern          | Implementation         | Location                                                                                                 |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| Error Boundaries | `<ErrorBoundary>`      | [`components/ErrorBoundary.tsx`](../../../packages/data-portal/app/components/ErrorBoundary.tsx)         |
| Route Errors     | Remix error boundaries | [`root.tsx`](../../../packages/data-portal/app/root.tsx)                                                 |
| Loading States   | `useIsLoading()` hook  | [`hooks/useIsLoading.ts`](../../../packages/data-portal/app/hooks/useIsLoading.ts)                       |
| Empty States     | `<NoFilteredResults>`  | [`components/NoFilteredResults.tsx`](../../../packages/data-portal/app/components/NoFilteredResults.tsx) |

## Error Handling Decision Table

Use this table to determine which error handling approach to use:

| Scenario                    | Approach             | Why                                         |
| --------------------------- | -------------------- | ------------------------------------------- |
| Component render errors     | `<ErrorBoundary>`    | Catches JS errors, prevents full page crash |
| Missing resource (404)      | Throw Response       | Remix handles with route ErrorBoundary      |
| Server data loading failure | Throw Response       | Shows proper error page with status code    |
| GraphQL query errors        | Try/catch in loader  | Log error, throw appropriate Response       |
| Network failures            | Try/catch + toast    | Show user-friendly notification             |
| Form validation errors      | Local state          | Display inline errors near fields           |
| Async client-side errors    | Try/catch + snackbar | Inform user without navigation              |
| Table rendering issues      | Auto-retry boundary  | Session storage tracks retries (max 3)      |

---

## Error Boundary Pattern

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

### Implementation

The ErrorBoundary wraps React's error boundary with logging and recovery:

```typescript
// components/ErrorBoundary.tsx
export function ErrorBoundary({ children, logId }: { children: ReactNode; logId?: string }) {
  return (
    <FallbackRenderContext.Provider value={{ logId }}>
      <ReactErrorBoundary FallbackComponent={FallbackRender}>
        {children}
      </ReactErrorBoundary>
    </FallbackRenderContext.Provider>
  )
}

function FallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useI18n()
  const { logId } = useContext(FallbackRenderContext)

  useEffect(() => {
    if (logId) {
      sendLogs({ level: LogLevel.Error, messages: [{ type: 'browser', error: getErrorMessage(error), logId }] })
    }
  }, [error, logId])

  return (
    <div role="alert" className="p-2">
      <p className="font-bold">{t('somethingWentWrong')}:</p>
      <pre className="text-red-500">{getErrorMessage(error)}</pre>
      <Button onClick={resetErrorBoundary}>{t('refresh')}</Button>
    </div>
  )
}
```

**Features:** Displays error message, logs to backend, provides refresh button, shows details in development.

### Automatic Table Error Recovery

Table rendering errors auto-reload up to 3 times using session storage:

```typescript
// Inside FallbackRender for TABLE_PAGE_LAYOUT_LOG_ID
if (
  logId === TABLE_PAGE_LAYOUT_LOG_ID &&
  reloadCount < MAX_RELOADS_FOR_TABLE_RENDER_ERROR
) {
  tableRenderErrorCountStorage.set((prev) => (prev ?? 0) + 1)
  window.location.reload()
}
```

---

## Remix Route Error Handling

### Throwing Errors in Loaders

```typescript
export async function loader({ params }: LoaderFunctionArgs) {
  const dataset = await getDataset(params.id)
  if (!dataset) {
    throw new Response('Dataset not found', { status: 404 })
  }
  return json({ dataset })
}
```

### Route ErrorBoundary

Each route can export an ErrorBoundary to handle errors:

```typescript
export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-sds-header-xxl-600-wide font-semibold">404 - Not Found</h1>
        <Link to="/browse-data/datasets"><Button>Browse Datasets</Button></Link>
      </div>
    )
  }

  return <GenericErrorPage error={error} />
}
```

See [`root.tsx`](../../../packages/data-portal/app/root.tsx) for the root error boundary implementation.

---

## Loading States

### useIsLoading Hook

Provides loading state with debouncing to prevent UI flashing:

```typescript
export function useIsLoading() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'
  const [isLoadingDebounced] = useDebouncedState(isLoading, 250)

  return { isLoading, isLoadingDebounced }
}
```

**Usage:**

```typescript
function DataTable() {
  const { isLoadingDebounced } = useIsLoading()
  if (isLoadingDebounced) return <TableSkeleton rows={10} />
  return <Table data={data} />
}
```

**Why debounce?** Prevents UI flashing on fast navigation, especially for cached routes.

### Skeleton Components

```typescript
// Table skeleton
export function TableSkeleton({ rows = 10, columns = 5 }: Props) {
  return (
    <div className="flex flex-col gap-sds-s">
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
      <Icon sdsIcon="InfoCircle" sdsSize="xl" />
      <h3>{t('noResultsFound')}</h3>
      <p>{showSearchTip ? t('tryAdjustingFiltersOrSearch') : t('tryAdjustingFilters')}</p>
      <Button onClick={filter.reset} sdsType="secondary">{t('clearAllFilters')}</Button>
    </div>
  )
}
```

**Location:** [`components/NoFilteredResults.tsx`](../../../packages/data-portal/app/components/NoFilteredResults.tsx)

### Generic EmptyState

```typescript
<EmptyState
  icon="InboxEmpty"
  title="No annotations available"
  description="This dataset doesn't have any annotations yet."
  action={<Link to="/browse-data/depositions"><Button>Browse Depositions</Button></Link>}
/>
```

---

## API Error Handling

### GraphQL Errors in Loaders

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

### Client-Side Network Errors

```typescript
async function fetchData() {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    const message =
      error instanceof TypeError ? t('networkError') : t('genericError')
    showNotification({ message, type: 'error' })
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
  fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level,
      messages,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    }),
  }).catch(console.error)
}

// Log levels: Debug, Info, Warning, Error
sendLogs({
  level: LogLevel.Error,
  messages: [
    {
      type: 'browser',
      message: 'Failed to load dataset',
      logId: 'dataset-page',
      datasetId: params.id,
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
      enqueueSnackbar('Action completed', { variant: 'success' })
    } catch {
      enqueueSnackbar('Action failed', { variant: 'error' })
    }
  }
}
```

**Auto-hide hook:** [`hooks/useAutoHideSnackbar.ts`](../../../packages/data-portal/app/hooks/useAutoHideSnackbar.ts)

---

## Best Practices

### Do

- **Provide user-friendly messages:** `'Failed to load dataset. Please try again.'` not `'500 Internal Server Error'`
- **Log errors for debugging:** Always `console.error` and `sendLogs` before re-throwing
- **Provide recovery actions:** Include retry buttons or navigation links
- **Use specific logIds:** Helps identify error sources in logs

### Don't

- **Expose sensitive information:** Never show stack traces to users in production
- **Ignore errors silently:** Always log and inform the user
- **Nest error boundaries:** One boundary at the appropriate level is sufficient

```typescript
// Avoid nested boundaries
<ErrorBoundary><ErrorBoundary><Component /></ErrorBoundary></ErrorBoundary>

// Better: single boundary at appropriate level
<ErrorBoundary logId="page"><Component /></ErrorBoundary>
```

---

## Testing Error States

```typescript
describe('ErrorBoundary', () => {
  it('catches errors and displays fallback', () => {
    const ThrowError = () => { throw new Error('Test error') }
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('allows retry after error', async () => {
    render(<ErrorBoundary><ComponentThatThrows /></ErrorBoundary>)
    await userEvent.click(screen.getByText('Refresh'))
    expect(mockReset).toHaveBeenCalled()
  })
})
```

---

## Next Steps

- [Component Architecture](../04-components/01-component-architecture.md) - Component structure
- [Hooks Guide](./03-hooks-guide.md) - Custom hooks including useIsLoading
- [Technology Stack](../00-foundation/01-technology-stack.md) - Testing setup
