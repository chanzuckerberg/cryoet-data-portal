# Analytics

This document covers the analytics tracking system in the CryoET Data Portal frontend using [Plausible Analytics](https://plausible.io/), including event tracking, environment configuration, implementation patterns, and best practices.

## Quick Reference

| Component       | Location                                                                                                   | Purpose                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Core Hook       | [`hooks/usePlausible.ts`](../../../packages/data-portal/app/hooks/usePlausible.ts)                         | Event definitions and tracking hook           |
| Copy Event Hook | [`hooks/useLogPlausibleCopyEvent.ts`](../../../packages/data-portal/app/hooks/useLogPlausibleCopyEvent.ts) | Copy-to-clipboard event tracking              |
| Script Loading  | [`root.tsx`](../../../packages/data-portal/app/root.tsx)                                                   | Plausible script initialization               |
| Event Proxy     | [`routes/api.event.ts`](../../../packages/data-portal/app/routes/api.event.ts)                             | Server-side event proxy (preserves client IP) |

**Environment Variables:**

| Variable                       | Required | Default   | Purpose                                           |
| ------------------------------ | -------- | --------- | ------------------------------------------------- |
| `ENV`                          | Yes      | -         | Selects Plausible domain (local/dev/staging/prod) |
| `LOCALHOST_PLAUSIBLE_TRACKING` | No       | `'false'` | Enable analytics tracking on localhost            |

---

## Why Plausible?

Plausible is a privacy-focused, lightweight analytics platform that:

- **Privacy-first**: No cookies, GDPR/CCPA compliant by default
- **Lightweight**: ~1KB script vs Google Analytics' ~45KB
- **Open source**: Self-hostable if needed
- **Simple**: Focused on essential metrics without complexity

---

## Architecture Overview

### Environment-Based Domain Mapping

Each environment tracks to a separate Plausible domain to keep analytics data isolated:

```typescript
// hooks/usePlausible.ts
export const PLAUSIBLE_ENV_URL_MAP: Record<NodeJS.ProcessEnv['ENV'], string> = {
  local: 'frontend.cryoet.dev.si.czi.technology',
  dev: 'frontend.cryoet.dev.si.czi.technology',
  staging: 'frontend.cryoet.staging.si.czi.technology',
  prod: 'cryoetdataportal.czscience.com',
}
```

| Environment | Plausible Domain                            |
| ----------- | ------------------------------------------- |
| `local`     | `frontend.cryoet.dev.si.czi.technology`     |
| `dev`       | `frontend.cryoet.dev.si.czi.technology`     |
| `staging`   | `frontend.cryoet.staging.si.czi.technology` |
| `prod`      | `cryoetdataportal.czscience.com`            |

### Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Component     │────>│  usePlausible()  │────>│  Plausible API  │
│   (event call)  │     │  (hook)          │     │  (external)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
        │                        ▼
        │               ┌──────────────────┐
        │               │  Console log     │
        │               │  (local only)    │
        │               └──────────────────┘
        │
        ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Page View     │────>│  Plausible       │────>│  Plausible API  │
│   (automatic)   │     │  Script (root)   │     │  (external)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Script Initialization

The Plausible script is loaded in the document `<head>` via [`root.tsx`](../../../packages/data-portal/app/root.tsx):

```typescript
// root.tsx
<script
  defer
  data-domain={PLAUSIBLE_ENV_URL_MAP[ENV.ENV]}
  src={getPlausibleUrl({
    hasLocalhostTracking: ENV.LOCALHOST_PLAUSIBLE_TRACKING === 'true',
  })}
/>
```

### Script URL Generation

The `getPlausibleUrl()` function builds the script URL with optional extensions:

```typescript
// hooks/usePlausible.ts
export function getPlausibleUrl({
  hasLocalhostTracking,
}: {
  hasLocalhostTracking: boolean
}) {
  const extensions = [
    'outbound-links', // Track outbound link clicks
    'file-downloads', // Track file download clicks
    ...(hasLocalhostTracking ? ['local'] : []), // Enable localhost tracking
  ].join('.')

  return `https://plausible.io/js/script.${extensions}.js`
}
```

**Script Extensions:**

- `outbound-links`: Automatically tracks clicks to external links
- `file-downloads`: Automatically tracks clicks to downloadable files
- `local`: Enables tracking on localhost (when `LOCALHOST_PLAUSIBLE_TRACKING=true`)

---

## Event System

### Event Definitions

All trackable events are defined in the `Events` enum:

```typescript
// hooks/usePlausible.ts
export enum Events {
  CitePortal = 'Cite Portal',
  ClickBackToConfigureDownload = 'Click back to configure download',
  ClickBreadcrumb = 'Click breadcrumb',
  ClickBrowseDataTab = 'Click browse data tab',
  ClickDatasetFromDeposition = 'Click dataset from deposition',
  ClickDeposition = 'Click deposition',
  ClickDownloadTab = 'Click download tab',
  ClickDownloadTomogram = 'Click download tomogram',
  ClickNextToDownloadOptions = 'Click next to configure download',
  CloseDownloadModal = 'Close download modal',
  CopyDownloadInfo = 'Copy download info',
  Filter = 'Filter',
  OpenDownloadModal = 'Open download modal',
  ToggleMetadataDrawer = 'Toggle metadata drawer',
  ViewTomogram = 'View tomogram',
}
```

### Event Payloads

Each event has a strongly-typed payload:

```typescript
export type EventPayloads = {
  [Events.CitePortal]: {
    cite: boolean
  }

  [Events.Filter]: {
    field: string
    value?: string | null
    type: 'dataset' | 'run'
  }

  [Events.ToggleMetadataDrawer]: {
    open: boolean
    type: MetadataDrawerId
  }

  [Events.ViewTomogram]: {
    datasetId: number
    organism: string
    runId: number
    tomogramId: number | string
    type: 'dataset' | 'run' | 'tomogram'
  }

  [Events.ClickBrowseDataTab]: {
    tab: BrowseDataTab
  }

  [Events.ClickDeposition]: {
    id: number
  }

  [Events.ClickDatasetFromDeposition]: {
    datasetId: number
    depositionId: number
  }

  [Events.ClickBreadcrumb]: {
    type: BreadcrumbType
    datasetId?: number
    depositionId?: number
  }

  // Download modal events use PlausibleDownloadModalPayload
  [Events.OpenDownloadModal]: PlausibleDownloadModalPayload
  [Events.CloseDownloadModal]: PlausibleDownloadModalPayload
  [Events.ClickNextToDownloadOptions]: PlausibleDownloadModalPayload
  [Events.ClickBackToConfigureDownload]: PlausibleDownloadModalPayload
  [Events.ClickDownloadTab]: PlausibleDownloadModalPayload
  [Events.ClickDownloadTomogram]: PlausibleDownloadModalPayload<{
    downloadUrl: string
  }>
  [Events.CopyDownloadInfo]: PlausibleDownloadModalPayload<{
    type: string
    content: string
  }>
}
```

### Download Modal Payload

Download modal events share a common payload structure:

```typescript
export type PlausibleDownloadModalPayload<T = object> = T & {
  annotationId?: number
  annotationName?: string
  tomogramId?: number
  referenceTomogramId?: number
  config?: DownloadConfig
  datasetId?: number
  fileSize?: number
  objectShapeType?: string
  runId?: number
  step?: DownloadStep
  tab?: DownloadTab
  tomogramProcessing?: string
  tomogramSampling?: string
  fileFormat?: string
}
```

---

## Hooks

### `usePlausible()`

The primary hook for tracking custom events:

```typescript
import { Events, usePlausible } from 'app/hooks/usePlausible'

function MyComponent() {
  const plausible = usePlausible()

  const handleClick = () => {
    plausible(Events.ClickDeposition, { id: 123 })
  }

  return <button onClick={handleClick}>View Deposition</button>
}
```

**Hook behavior:**

1. Reads `ENV` and `LOCALHOST_PLAUSIBLE_TRACKING` from environment context
2. Constructs payload with event name, domain, URL, and props
3. In local environment:
   - Always logs to console for debugging
   - Only sends to Plausible if `LOCALHOST_PLAUSIBLE_TRACKING=true`
4. In other environments: sends directly to Plausible API

**Implementation:**

```typescript
export function usePlausible() {
  const { ENV, LOCALHOST_PLAUSIBLE_TRACKING } = useEnvironment()

  const logPlausibleEvent = useCallback(
    <E extends keyof EventPayloads>(
      event: E,
      ...payloads: EventPayloads[E][]
    ) => {
      const payload = {
        name: event,
        domain: PLAUSIBLE_ENV_URL_MAP[ENV],
        url: window.location.href,
        props: payloads[0],
      }

      if (ENV === 'local') {
        console.info({
          message: 'Plausible event',
          event,
          payload,
        })

        if (LOCALHOST_PLAUSIBLE_TRACKING !== 'true') {
          return
        }
      }

      axios.post('https://plausible.io/api/event', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
    [ENV, LOCALHOST_PLAUSIBLE_TRACKING],
  )

  return logPlausibleEvent
}
```

### `useLogPlausibleCopyEvent()`

A specialized hook for tracking copy-to-clipboard events:

```typescript
import { useLogPlausibleCopyEvent } from 'app/hooks/useLogPlausibleCopyEvent'

function DownloadCommandDisplay({ command }: { command: string }) {
  const { logPlausibleCopyEvent } = useLogPlausibleCopyEvent()

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    logPlausibleCopyEvent('AWS CLI', command)
  }

  return (
    <div>
      <code>{command}</code>
      <button onClick={handleCopy}>Copy</button>
    </div>
  )
}
```

This hook automatically includes download modal context (datasetId, runId, fileSize) in the payload.

---

## Server-Side Event Proxy

The [`api.event.ts`](../../../packages/data-portal/app/routes/api.event.ts) route provides a server-side proxy for Plausible events:

```typescript
// routes/api.event.ts
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

  console.log(`Sending plausible event to client ${clientIp}`)

  const response = await fetch('https://plausible.io/api/event', payload)
  const responseBody = await response.text()

  return new Response(responseBody, {
    status: response.status,
    headers: response.headers,
  })
}
```

**Why proxy events?**

- Preserves client IP for accurate geolocation data
- Avoids ad-blocker interference
- Enables server-side logging

> **Note:** The proxy is currently not in active use (see TODO in code). Events are sent directly to `https://plausible.io/api/event`.

---

## Common Patterns

### Tracking User Navigation

```typescript
function BrowseDataTabs() {
  const plausible = usePlausible()

  const handleTabChange = (tab: BrowseDataTab) => {
    plausible(Events.ClickBrowseDataTab, { tab })
  }

  return (
    <Tabs onChange={handleTabChange}>
      <Tab value="datasets">Datasets</Tab>
      <Tab value="depositions">Depositions</Tab>
    </Tabs>
  )
}
```

### Tracking Filter Changes

```typescript
function FilterPanel() {
  const plausible = usePlausible()

  const handleFilterChange = (field: string, value: string | null) => {
    plausible(Events.Filter, {
      field,
      value,
      type: 'dataset',
    })
  }

  return (
    <Select
      onChange={(value) => handleFilterChange('organism', value)}
      options={organisms}
    />
  )
}
```

### Tracking Modal Interactions

```typescript
function DownloadModal() {
  const plausible = usePlausible()
  const { getPlausiblePayload } = useDownloadModalQueryParamState()

  const handleOpen = () => {
    plausible(Events.OpenDownloadModal, getPlausiblePayload())
  }

  const handleClose = () => {
    plausible(Events.CloseDownloadModal, getPlausiblePayload())
  }

  return (
    <Modal onOpen={handleOpen} onClose={handleClose}>
      {/* Modal content */}
    </Modal>
  )
}
```

### Tracking External Actions

```typescript
function CiteButton({ datasetId }: { datasetId: number }) {
  const plausible = usePlausible()

  const handleCite = () => {
    plausible(Events.CitePortal, { cite: true })
    // Copy citation to clipboard
  }

  return <Button onClick={handleCite}>Cite</Button>
}
```

---

## Integration Points

The following components track Plausible events:

| Component/Feature    | Events Tracked                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Download Modal**   | `OpenDownloadModal`, `CloseDownloadModal`, `ClickNextToDownloadOptions`, `ClickDownloadTab`, `ClickDownloadTomogram`, `ClickBackToConfigureDownload`, `CopyDownloadInfo` |
| **Filter System**    | `Filter`                                                                                                                                                                 |
| **Browse Data Tabs** | `ClickBrowseDataTab`                                                                                                                                                     |
| **Deposition Table** | `ClickDeposition`, `ClickDatasetFromDeposition`                                                                                                                          |
| **Breadcrumbs**      | `ClickBreadcrumb`                                                                                                                                                        |
| **Metadata Drawer**  | `ToggleMetadataDrawer`                                                                                                                                                   |
| **Tomogram Viewer**  | `ViewTomogram`                                                                                                                                                           |
| **Citation Button**  | `CitePortal`                                                                                                                                                             |

---

## Local Development

### Console Logging

In local environment, all events are logged to the console regardless of tracking settings:

```javascript
// Console output
{
  message: 'Plausible event',
  event: 'Filter',
  payload: {
    name: 'Filter',
    domain: 'frontend.cryoet.dev.si.czi.technology',
    url: 'http://localhost:3000/browse-data/datasets?organism=human',
    props: { field: 'organism', value: 'human', type: 'dataset' }
  }
}
```

### Enabling Local Tracking

To send events to Plausible from localhost:

```bash
# .env
LOCALHOST_PLAUSIBLE_TRACKING=true
```

This is useful for:

- Testing event tracking during development
- Verifying payloads are correctly formatted
- Debugging tracking issues

> **Note:** Local events are sent to the dev domain, not production.

---

## Adding New Events

### Step 1: Define the Event

Add to the `Events` enum:

```typescript
// hooks/usePlausible.ts
export enum Events {
  // ... existing events
  NewFeatureClick = 'New feature click',
}
```

### Step 2: Define the Payload Type

Add the payload type to `EventPayloads`:

```typescript
export type EventPayloads = {
  // ... existing payloads
  [Events.NewFeatureClick]: {
    featureId: string
    source: 'header' | 'sidebar' | 'footer'
  }
}
```

### Step 3: Use in Component

```typescript
function NewFeature() {
  const plausible = usePlausible()

  const handleClick = () => {
    plausible(Events.NewFeatureClick, {
      featureId: 'feature-123',
      source: 'header',
    })
  }

  return <button onClick={handleClick}>New Feature</button>
}
```

---

## Best Practices

### Event Naming

✅ **Do:**

- Use descriptive, action-based names: `'Click download tomogram'`
- Use consistent verb tense: `'Open'`, `'Close'`, `'Click'`
- Include context in the name: `'Click dataset from deposition'`

❌ **Don't:**

- Use vague names: `'Event1'`, `'ButtonClick'`
- Mix naming conventions: `'click_button'` vs `'ClickButton'`
- Use technical jargon: `'MutateGraphQLCache'`

### Payload Design

✅ **Do:**

- Include relevant context (IDs, types, states)
- Keep payloads focused on analytics needs
- Use typed payloads for type safety
- Include enough data to answer "who, what, where, when"

❌ **Don't:**

- Include sensitive user data (emails, tokens)
- Include large objects or arrays
- Include redundant information
- Over-track (not every click needs tracking)

### Event Granularity

✅ **Do:**

- Track meaningful user interactions
- Track completion of multi-step flows
- Track key conversion points
- Group related events with shared payload types

❌ **Don't:**

- Track every DOM event
- Track internal state changes
- Track developer debugging actions
- Create events that will never be analyzed

### Testing

✅ **Do:**

- Verify events in console during development
- Test event payloads are correctly formatted
- Include event tracking in code reviews
- Document what each event measures

❌ **Don't:**

- Skip testing event tracking
- Assume events are working without verification
- Deploy without checking Plausible dashboard

---

## Troubleshooting

### Events Not Appearing in Plausible

1. **Check environment**: Ensure `ENV` is set correctly
2. **Check console**: Look for logged events in browser console
3. **Check network**: Verify requests to `plausible.io/api/event`
4. **Check ad blockers**: Some ad blockers block Plausible
5. **Wait for processing**: Plausible can take a few minutes to show events

### Local Events Not Sending

1. Verify `LOCALHOST_PLAUSIBLE_TRACKING=true` in `.env`
2. Restart the dev server after changing `.env`
3. Check console for the logged event payload

### TypeScript Errors

If you get type errors when adding events:

1. Ensure event is added to `Events` enum
2. Ensure payload type is added to `EventPayloads`
3. Verify payload matches the type definition

---

## Access and Credentials

Credentials to access the Plausible dashboard are located in the 1Password `Imaging` vault under `Plausible (current)`.

---

## Related Documentation

- [Hooks Guide](./03-hooks-guide.md) - Full hook catalog including analytics hooks
- [Environment Variables](../../04-reference/02-environment-variables.md) - Environment configuration reference
- [API Routes](../../04-reference/06-api-routes.md) - Server-side route documentation
- [Plausible Documentation](https://plausible.io/docs) - Official Plausible docs
