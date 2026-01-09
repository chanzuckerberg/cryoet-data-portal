# Analytics

The CryoET Data Portal uses [Plausible Analytics](https://plausible.io/) for privacy-focused, lightweight analytics tracking.

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

**Dashboard Access:** Credentials are in 1Password `Imaging` vault under `Plausible (current)`.

---

## Why Plausible?

Plausible is a privacy-focused analytics platform that requires no cookies, is GDPR/CCPA compliant by default, and uses a lightweight ~1KB script (compared to Google Analytics' ~45KB). It provides essential metrics without the complexity of traditional analytics platforms.

---

## Architecture Overview

### Environment-Based Domain Mapping

Each environment tracks to a separate Plausible domain to keep analytics data isolated. The `PLAUSIBLE_ENV_URL_MAP` in `usePlausible.ts` maps the `ENV` value to the appropriate tracking domain:

| Environment | Plausible Domain                            |
| ----------- | ------------------------------------------- |
| `local`     | `frontend.cryoet.dev.si.czi.technology`     |
| `dev`       | `frontend.cryoet.dev.si.czi.technology`     |
| `staging`   | `frontend.cryoet.staging.si.czi.technology` |
| `prod`      | `cryoetdataportal.czscience.com`            |

### Script Initialization

The Plausible script is loaded in `root.tsx` via a `<script>` tag with `defer` attribute. The `getPlausibleUrl()` function constructs the script URL with extensions for:

- **outbound-links**: Automatically tracks clicks to external links
- **file-downloads**: Automatically tracks clicks to downloadable files
- **local**: Enables localhost tracking (when `LOCALHOST_PLAUSIBLE_TRACKING=true`)

---

## Event System

### Defining Events

All trackable events are defined in the `Events` enum in `usePlausible.ts`. Each event has a human-readable name used in the Plausible dashboard (e.g., `'Click download tomogram'`, `'Filter'`).

Each event also has a corresponding strongly-typed payload in `EventPayloads`. This ensures type safety when tracking events and documents what data each event captures.

### Download Modal Events

Download modal events share a common payload structure via `PlausibleDownloadModalPayload<T>`. This includes context like `datasetId`, `runId`, `fileSize`, `step`, and `tab`, plus any event-specific fields passed through the generic type parameter.

---

## Using the Hooks

### `usePlausible()`

The primary hook for tracking custom events. Call it with an event from the `Events` enum and its typed payload:

```typescript
const plausible = usePlausible()
plausible(Events.ClickDeposition, { id: 123 })
```

The hook automatically:
- Reads environment configuration from context
- Constructs the payload with event name, domain, URL, and props
- In local environment: logs to console and optionally sends to Plausible
- In other environments: sends directly to Plausible API

### `useLogPlausibleCopyEvent()`

A specialized hook for copy-to-clipboard events that automatically includes download modal context in the payload. Use it when tracking copy actions within the download modal flow.

---

## Server-Side Event Proxy

The `api.event.ts` route provides a server-side proxy for Plausible events. This preserves the client IP for accurate geolocation data and avoids ad-blocker interference.

> **Note:** The proxy is currently not in active use. Events are sent directly to `https://plausible.io/api/event`.

---

## Integration Points

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

In local environment, all events are logged to the console regardless of tracking settings. This makes it easy to verify event tracking during development without checking the Plausible dashboard.

To actually send events to Plausible from localhost, set `LOCALHOST_PLAUSIBLE_TRACKING=true` in your `.env` file. Local events are sent to the dev domain, not production.

---

## Adding New Events

1. **Add the event to the `Events` enum** with a descriptive, human-readable name
2. **Add the payload type to `EventPayloads`** with the data you need to capture
3. **Use `usePlausible()` in your component** to track the event

---

## Best Practices

### Event Naming

Use descriptive, action-based names with consistent verb tense (`'Open'`, `'Close'`, `'Click'`). Include context in the name when helpful (e.g., `'Click dataset from deposition'`). Avoid vague names, technical jargon, or inconsistent conventions.

### Payload Design

Include relevant context like IDs, types, and states—enough to answer "who, what, where, when." Keep payloads focused on analytics needs. Never include sensitive user data (emails, tokens) or unnecessarily large objects.

### Event Granularity

Track meaningful user interactions, completion of multi-step flows, and key conversion points. Avoid tracking every DOM event, internal state changes, or events that will never be analyzed. Group related events with shared payload types.

---

## Troubleshooting

### Events Not Appearing in Plausible

1. Check that `ENV` is set correctly
2. Look for logged events in the browser console
3. Verify network requests to `plausible.io/api/event`
4. Check if ad blockers are interfering
5. Wait a few minutes—Plausible can have processing delay

### Local Events Not Sending

1. Verify `LOCALHOST_PLAUSIBLE_TRACKING=true` in `.env`
2. Restart the dev server after changing `.env`
3. Check console for the logged event payload

### TypeScript Errors

Ensure the event is added to the `Events` enum and its payload type is added to `EventPayloads`. Verify your payload matches the type definition.

---

## Related Documentation

- [Hooks Guide](./03-hooks-guide.md) - Full hook catalog including analytics hooks
- [Environment Variables](../../04-reference/02-environment-variables.md) - Environment configuration reference
- [API Routes](../../04-reference/06-api-routes.md) - Server-side route documentation
- [Plausible Documentation](https://plausible.io/docs) - Official Plausible docs
