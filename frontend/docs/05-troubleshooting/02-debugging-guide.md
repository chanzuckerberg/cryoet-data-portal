# Debugging Guide

This guide covers debugging techniques, development tools, and best practices for troubleshooting issues in the CryoET Data Portal frontend. Learn how to efficiently identify and resolve bugs using browser DevTools, IDE debugging, and logging strategies.

**Last updated:** December 10, 2025

## Browser DevTools Setup

### Chrome/Chromium DevTools

The primary debugging environment for the CryoET Data Portal.

**Opening DevTools:**
- macOS: `Cmd + Option + I`
- Windows/Linux: `Ctrl + Shift + I`
- Right-click → "Inspect"

**Essential panels:**

1. **Console** - View logs, errors, and run JavaScript
2. **Sources** - Set breakpoints and step through code
3. **Network** - Monitor API requests and responses
4. **React DevTools** - Inspect React component tree
5. **Apollo DevTools** - Debug GraphQL queries (see [GraphQL Debugging](./03-graphql-debugging.md))

**Recommended settings:**

Open DevTools Settings (F1):
- ✅ Enable "Disable cache (while DevTools is open)"
- ✅ Enable "Preserve log upon navigation"
- ✅ Enable JavaScript source maps

---

## React Developer Tools

### Installation

Install the React DevTools browser extension:

- [Chrome/Edge](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Using React DevTools

After installation, two new DevTools tabs appear: **Components** and **Profiler**.

#### Components Tab

**Inspect component hierarchy:**

1. Click the component tree icon in DevTools
2. Click any element on the page to select it
3. View props, state, hooks, and context in the right panel

**Useful features:**

- **Search components**: Use the search box to find components by name
- **Filter components**: Hide internal React components or DOM elements
- **Edit props/state**: Double-click values to modify them in real-time
- **View source**: Click the `<>` icon to jump to component source

**Debugging Jotai atoms:**

Jotai state appears in the Hooks section:

```typescript
// In component
const [filter, setFilter] = useAtom(filterAtom)

// In React DevTools → Components → Hooks
// Look for "Atom" with the current value
```

#### Profiler Tab

**Analyze component performance:**

1. Click "Start profiling"
2. Interact with the application
3. Click "Stop profiling"
4. Review flamegraph and ranked chart

**Key metrics:**

- **Render duration**: Time spent rendering each component
- **Render count**: Number of times each component rendered
- **Why did this render?**: Shows which props/state changed

**Optimization tips:**

- Look for components that render frequently with no visible changes
- Identify expensive components (long render duration)
- Use `React.memo()` for components with stable props
- Optimize child component renders before parent components

---

## VS Code Debugging

### Launch Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}/frontend/packages/data-portal",
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test", "--runInBand", "--no-cache"],
      "cwd": "${workspaceFolder}/frontend/packages/data-portal",
      "console": "integratedTerminal",
      "env": {
        "NODE_OPTIONS": "--experimental-vm-modules"
      }
    },
    {
      "name": "Debug Current Test File",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test", "${relativeFile}", "--runInBand", "--no-cache"],
      "cwd": "${workspaceFolder}/frontend/packages/data-portal",
      "console": "integratedTerminal",
      "env": {
        "NODE_OPTIONS": "--experimental-vm-modules"
      }
    }
  ]
}
```

### Setting Breakpoints

**In source files:**

1. Click in the gutter (left of line numbers)
2. Or place cursor on line and press `F9`
3. Red dot appears indicating breakpoint

**Conditional breakpoints:**

1. Right-click in gutter → "Add Conditional Breakpoint"
2. Enter condition (e.g., `userId === '123'`)
3. Breakpoint only triggers when condition is true

**Logpoints:**

Non-breaking breakpoints that log to console:

1. Right-click in gutter → "Add Logpoint"
2. Enter message with expressions in `{}` (e.g., `User: {userName}`)
3. Message logs when execution reaches that line

### Debug Controls

When paused at a breakpoint:

- **Continue** (F5): Resume execution
- **Step Over** (F10): Execute current line, skip into function calls
- **Step Into** (F11): Enter function on current line
- **Step Out** (Shift+F11): Exit current function
- **Restart** (Cmd+Shift+F5): Restart debugger

---

## Console Logging Best Practices

### Effective Logging

**Use descriptive labels:**

```typescript
// Bad: Generic log
console.log(data)

// Good: Labeled log
console.log('Dataset response:', data)

// Better: Structured log with context
console.log('Dataset fetch completed:', {
  datasetId,
  recordCount: data.length,
  timestamp: new Date().toISOString(),
})
```

**Use appropriate log levels:**

```typescript
// Informational
console.log('User navigated to datasets page')

// Warnings for recoverable issues
console.warn('API rate limit approaching:', remainingRequests)

// Errors for failures
console.error('Failed to fetch dataset:', error)

// Debugging (remove before commit)
console.debug('Filter state updated:', filterState)
```

### Console Utilities

**Grouping related logs:**

```typescript
console.group('Dataset Processing')
console.log('Fetching dataset:', datasetId)
console.log('Applying filters:', filters)
console.log('Sorting by:', sortField)
console.groupEnd()
```

**Timing operations:**

```typescript
console.time('Dataset fetch')
await fetchDataset(datasetId)
console.timeEnd('Dataset fetch')
// Output: Dataset fetch: 234.5ms
```

**Table display for arrays:**

```typescript
console.table(datasets.map(d => ({
  id: d.id,
  title: d.title,
  status: d.status,
})))
```

**Stack traces:**

```typescript
console.trace('How did we get here?')
```

### Conditional Logging

Only log in development:

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', debugData)
}
```

Use environment variable for verbose logging:

```typescript
const DEBUG = process.env.DEBUG === 'true'

if (DEBUG) {
  console.log('Detailed state:', state)
}
```

---

## Network Debugging

### Monitoring API Requests

**Network panel setup:**

1. Open DevTools → Network tab
2. Filter by type: XHR, Fetch, or All
3. Enable "Preserve log" for navigation debugging

**Analyzing requests:**

Click any request to view:
- **Headers**: Request/response headers, query parameters
- **Payload**: Request body (for POST/PUT requests)
- **Response**: Response body and status
- **Timing**: DNS lookup, connection, wait, download times

**Common issues:**

**1. 404 Not Found:**
```
GET /api/datasets/invalid-id → 404

Solution: Check URL construction and route configuration
```

**2. 401 Unauthorized:**
```
GET /api/protected-resource → 401

Solution: Verify authentication token is sent in headers
```

**3. 500 Internal Server Error:**
```
POST /api/datasets → 500

Solution: Check server logs and request payload validity
```

**4. CORS errors:**
```
Access to fetch at 'https://api.example.com' from origin 'http://localhost:8080'
has been blocked by CORS policy

Solution: Configure CORS headers on the API server
```

### Replaying Requests

**Using cURL:**

1. Right-click request in Network panel
2. "Copy" → "Copy as cURL"
3. Paste in terminal to replay

**Using Fetch:**

1. Right-click request in Network panel
2. "Copy" → "Copy as fetch"
3. Paste in Console to replay

**Modifying and resending:**

```javascript
// Example: Resend with modified headers
fetch('https://api.example.com/datasets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Debug': 'true', // Add debug header
  },
  body: JSON.stringify({ id: 'test-123' })
})
```

---

## Debugging Remix Loaders

### Server-Side Logging

Loader functions execute on the server, so logs appear in the terminal, not browser console.

**Add logging to loaders:**

```typescript
// app/routes/datasets.$id.tsx
import { json, LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ params }: LoaderFunctionArgs) {
  console.log('[Loader] Fetching dataset:', params.id)

  try {
    const dataset = await fetchDataset(params.id)
    console.log('[Loader] Dataset fetched successfully:', dataset.title)
    return json({ dataset })
  } catch (error) {
    console.error('[Loader] Failed to fetch dataset:', error)
    throw error
  }
}
```

**Check terminal output:**

```bash
[Loader] Fetching dataset: 123
[Loader] Dataset fetched successfully: Example Dataset

# Or with errors:
[Loader] Failed to fetch dataset: Error: Network timeout
```

### Debugging Loader Responses

**Inspect loader data in components:**

```typescript
import { useLoaderData } from '@remix-run/react'

export default function DatasetPage() {
  const data = useLoaderData<typeof loader>()

  // Temporary debugging
  console.log('Loader data received:', data)

  return <div>{/* ... */}</div>
}
```

**View in Network tab:**

Remix loaders create network requests to `?_data=routes/...`:

1. Open DevTools → Network
2. Filter by "Fetch/XHR"
3. Look for requests with `?_data=` in the URL
4. Click to view loader response

---

## Debugging State Management

### Jotai Atom Debugging

**Log atom updates:**

```typescript
import { atom } from 'jotai'

export const filterAtom = atom<FilterState>({ /* ... */ })

// Debug atom with side effects
export const filterAtomWithLogging = atom(
  (get) => {
    const value = get(filterAtom)
    console.log('Filter atom read:', value)
    return value
  },
  (get, set, update: FilterState) => {
    console.log('Filter atom updated:', update)
    set(filterAtom, update)
  }
)
```

**Use Jotai DevTools:**

Install the Jotai DevTools package for visualization:

```bash
pnpm add -D jotai-devtools
```

Wrap your app:

```typescript
import { DevTools } from 'jotai-devtools'

function App() {
  return (
    <>
      {process.env.NODE_ENV === 'development' && <DevTools />}
      {/* ... */}
    </>
  )
}
```

### URL State Debugging

Remix uses URL parameters for state. Debug by inspecting the URL:

```typescript
import { useSearchParams } from '@remix-run/react'

export default function Component() {
  const [searchParams] = useSearchParams()

  // Log current URL state
  console.log('URL params:', Object.fromEntries(searchParams))

  return <div>{/* ... */}</div>
}
```

---

## Performance Debugging

### Identifying Slow Components

**Use React Profiler API:**

```typescript
import { Profiler } from 'react'

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
) {
  if (actualDuration > 50) {
    console.warn(`Slow render detected: ${id}`, {
      phase,
      duration: `${actualDuration.toFixed(2)}ms`,
    })
  }
}

export default function ExpensiveComponent() {
  return (
    <Profiler id="ExpensiveComponent" onRender={onRenderCallback}>
      {/* component content */}
    </Profiler>
  )
}
```

### Memory Leak Detection

**Monitor memory usage:**

1. Open DevTools → Memory tab
2. Take heap snapshot
3. Interact with application
4. Take second heap snapshot
5. Compare snapshots to find retained objects

**Common causes:**

- Event listeners not cleaned up
- Intervals/timeouts not cleared
- Large objects stored in state
- Circular references preventing garbage collection

**Fix example:**

```typescript
useEffect(() => {
  const handleResize = () => {
    console.log('Window resized')
  }

  window.addEventListener('resize', handleResize)

  // Cleanup: Remove listener when component unmounts
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])
```

---

## Error Boundary Debugging

The application uses `react-error-boundary` to catch rendering errors.

**Add error logging:**

```typescript
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  // Log error details
  console.error('Error boundary caught:', error)

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function onError(error: Error, info: { componentStack: string }) {
  // Log to error tracking service
  console.error('Component error:', error, info.componentStack)
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      {/* app content */}
    </ErrorBoundary>
  )
}
```

---

## Source Map Troubleshooting

### Enabling Source Maps

Source maps are automatically generated in development. If they're not working:

**Check Remix config:**

```javascript
// remix.config.js
export default {
  sourcemap: true, // Ensure this is enabled (or remove - true by default)
}
```

**Check browser settings:**

DevTools Settings (F1) → Sources:
- ✅ "Enable JavaScript source maps"
- ✅ "Enable CSS source maps"

**Verify source maps in DevTools:**

Sources tab → Should show original TypeScript files, not compiled JavaScript.

### Source Map Not Loading

**Problem:**
```
Could not load content for webpack://source-map-missing.ts
```

**Solution:**

1. Clear browser cache and hard reload (Cmd+Shift+R / Ctrl+Shift+R)
2. Restart dev server: `pnpm dev`
3. Check that source files exist in the codebase

---

## Next Steps

- [GraphQL Debugging](./03-graphql-debugging.md) - Apollo DevTools and query debugging
- [Styling Issues](./04-styling-issues.md) - CSS troubleshooting techniques
- [Build Errors](./05-build-errors.md) - Compilation error solutions
