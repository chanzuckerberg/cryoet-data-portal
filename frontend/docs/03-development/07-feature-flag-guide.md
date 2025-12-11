# Feature Flag Guide

This guide explains how to add and use feature flags in the CryoET Data Portal frontend to control feature rollout across environments.

**Last updated:** December 10, 2025

## Quick Reference

| Task | How |
|------|-----|
| Define flag | Add to `FEATURE_FLAGS` in `app/utils/featureFlags.ts` |
| Use in component | `const isEnabled = useFeatureFlag('myFeature')` |
| Use in loader | `getFeatureFlag({ env, key, params })` |
| Enable in dev | Add `?enable-feature=myFeature` to URL |
| Disable in prod | Add `?disable-feature=myFeature` to URL |

---

## Feature Flag System

The portal uses a simple environment-based feature flag system with URL override capabilities.

**Benefits:**
- Control feature visibility per environment (local, dev, staging, prod)
- Test features in production using URL parameters
- Gradual rollout from dev → staging → prod
- Easy cleanup when features are stable

**Configuration file:** `/packages/data-portal/app/utils/featureFlags.ts`

---

## Step-by-Step: Adding a Feature Flag

### 1. Define the Feature Flag Key

Add your flag key to the `FeatureFlagKey` type:

**File:** `/packages/data-portal/app/utils/featureFlags.ts`

```typescript
export type FeatureFlagKey =
  | 'depositions'
  | 'expandDepositions'
  | 'postMlChallenge'
  | 'identifiedObjects'
  | 'myNewFeature'  // Add your flag
```

### 2. Configure Environment Availability

Add your flag to the `FEATURE_FLAGS` configuration:

```typescript
export const FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagEnvironment[]> = {
  depositions: ['local', 'dev', 'staging', 'prod'],
  expandDepositions: ['local', 'dev', 'staging', 'prod'],
  postMlChallenge: ['local', 'dev', 'staging', 'prod'],
  identifiedObjects: ['local', 'dev', 'staging', 'prod'],

  // Start with local only
  myNewFeature: ['local'],
}
```

**Environment progression:**
1. `['local']` - Developer testing only
2. `['local', 'dev']` - Deployed to dev environment
3. `['local', 'dev', 'staging']` - Deployed to staging for QA
4. `['local', 'dev', 'staging', 'prod']` - Fully rolled out

### 3. Use in Components

Use the `useFeatureFlag` hook in React components:

```typescript
import { useFeatureFlag } from 'app/utils/featureFlags'

export function MyComponent() {
  const isMyFeatureEnabled = useFeatureFlag('myNewFeature')

  return (
    <div>
      <h1>My Component</h1>

      {isMyFeatureEnabled && (
        <div>
          <h2>New Feature!</h2>
          <p>This feature is only visible when enabled.</p>
        </div>
      )}
    </div>
  )
}
```

### 4. Use in Loaders

Use `getFeatureFlag` function in server-side loaders:

**Pattern from `/packages/data-portal/app/routes/datasets.$id.tsx`:**

```typescript
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime'
import { getFeatureFlag } from 'app/utils/featureFlags'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const isMyFeatureEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'myNewFeature',
    params: url.searchParams,
  })

  // Conditional logic based on feature flag
  if (isMyFeatureEnabled) {
    // Fetch additional data for new feature
    const extraData = await fetchExtraData()
    return json({ extraData })
  }

  return json({})
}

export default function MyPage() {
  const { extraData } = useLoaderData<typeof loader>()
  const isMyFeatureEnabled = useFeatureFlag('myNewFeature')

  return (
    <div>
      {isMyFeatureEnabled && extraData && (
        <NewFeatureSection data={extraData} />
      )}
    </div>
  )
}
```

### 5. Use in GraphQL Queries

Conditionally modify queries based on feature flags:

**Pattern from `/packages/data-portal/app/graphql/getDatasetByIdV2.server.ts`:**

```typescript
import { getFeatureFlag } from 'app/utils/featureFlags'

export async function getDatasetByIdV2({
  client,
  id,
  params,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  params?: URLSearchParams
}) {
  // Check feature flag
  const isIdentifiedObjectsEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'identifiedObjects',
    params,
  })

  // Build query filter based on flag
  const filter = buildFilter({
    id,
    includeIdentifiedObjects: isIdentifiedObjectsEnabled,
  })

  return client.query({
    query: GET_DATASET_BY_ID_QUERY_V2,
    variables: { filter },
  })
}
```

---

## Feature Flag Patterns

### Conditional Rendering

Show/hide UI elements:

```typescript
export function DatasetPage() {
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  return (
    <div>
      <h1>Dataset</h1>

      {isExpandDepositions ? (
        <ExpandedDepositionView />
      ) : (
        <CompactDepositionView />
      )}
    </div>
  )
}
```

### Conditional Logic

**From `/packages/data-portal/app/routes/datasets.$id.tsx`:**

```typescript
export default function DatasetByIdPage() {
  const { dataset, deposition } = useDatasetById()
  const { t } = useI18n()
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  // Different label based on feature flag
  const label = isExpandDepositions
    ? t('onlyDisplayingRunsFromDeposition', {
        id: deposition?.id,
        name: deposition?.title,
      })
    : deposition && (
        <I18n
          i18nKey="onlyDisplayingRunsWithAnnotations"
          values={{
            id: deposition.id,
            title: deposition.title,
            url: `/depositions/${deposition.id}`,
          }}
        />
      )

  return <div>{label}</div>
}
```

### Conditional Routes

Enable/disable entire routes:

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const isDepositionsEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'depositions',
    params: new URL(request.url).searchParams,
  })

  if (!isDepositionsEnabled) {
    throw new Response('Not Found', { status: 404 })
  }

  // Load route data
  return json({ data })
}
```

### Conditional Navigation

Show/hide navigation links:

```typescript
export function Navigation() {
  const isDepositionsEnabled = useFeatureFlag('depositions')

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/datasets">Datasets</Link>
      <Link to="/runs">Runs</Link>

      {isDepositionsEnabled && (
        <Link to="/depositions">Depositions</Link>
      )}
    </nav>
  )
}
```

---

## URL Parameter Overrides

Feature flags can be overridden via URL parameters for testing:

### Enable a Feature

Add `?enable-feature=flagName` to any URL:

```
# Enable in staging
https://staging.cryoetdataportal.czscience.com/datasets/123?enable-feature=myNewFeature

# Enable in production (for testing)
https://cryoetdataportal.czscience.com/datasets/123?enable-feature=myNewFeature
```

### Disable a Feature

Add `?disable-feature=flagName` to any URL:

```
# Disable in dev
https://dev.cryoetdataportal.czscience.com/datasets/123?disable-feature=myNewFeature
```

### Multiple Overrides

Enable/disable multiple features:

```
?enable-feature=feature1&enable-feature=feature2&disable-feature=feature3
```

---

## Feature Flag Implementation

### Hook Implementation

**From `/packages/data-portal/app/utils/featureFlags.ts`:**

```typescript
import { useSearchParams } from '@remix-run/react'
import { useEnvironment } from 'app/context/Environment.context'

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const [params] = useSearchParams()
  const { ENV } = useEnvironment()

  return getFeatureFlag({
    key,
    params,
    env: ENV,
  })
}
```

### Function Implementation

```typescript
export function getFeatureFlag({
  env,
  key,
  params = new URLSearchParams(),
}: {
  env: FeatureFlagEnvironment
  key: FeatureFlagKey
  params?: URLSearchParams
}): boolean {
  // Check for explicit disable
  if (params.getAll('disable-feature').includes(key)) {
    return false
  }

  // Check for explicit enable
  if (params.getAll('enable-feature').includes(key)) {
    return true
  }

  // Check environment configuration
  return FEATURE_FLAGS[key].includes(env)
}
```

**Logic:**
1. URL `disable-feature` overrides everything (returns `false`)
2. URL `enable-feature` overrides environment config (returns `true`)
3. Fall back to environment configuration from `FEATURE_FLAGS`

---

## Testing with Feature Flags

### Unit Tests

Mock the feature flag hook:

```typescript
import { jest } from '@jest/globals'

// Mock the hook
jest.mock('app/utils/featureFlags', () => ({
  useFeatureFlag: jest.fn(),
}))

import { useFeatureFlag } from 'app/utils/featureFlags'

describe('MyComponent', () => {
  it('should render new feature when enabled', () => {
    // Enable the flag
    (useFeatureFlag as jest.Mock).mockReturnValue(true)

    render(<MyComponent />)
    expect(screen.getByText('New Feature!')).toBeVisible()
  })

  it('should hide new feature when disabled', () => {
    // Disable the flag
    (useFeatureFlag as jest.Mock).mockReturnValue(false)

    render(<MyComponent />)
    expect(screen.queryByText('New Feature!')).not.toBeInTheDocument()
  })
})
```

### E2E Tests

Test with URL parameters:

```typescript
import { test, expect } from '@playwright/test'

test('should show feature when enabled via URL', async ({ page }) => {
  await page.goto('/datasets/123?enable-feature=myNewFeature')

  await expect(page.locator('text=New Feature!')).toBeVisible()
})

test('should hide feature when disabled via URL', async ({ page }) => {
  await page.goto('/datasets/123?disable-feature=myNewFeature')

  await expect(page.locator('text=New Feature!')).not.toBeVisible()
})
```

### Test Both States

Always test both enabled and disabled states:

```typescript
describe('Feature Flag: myNewFeature', () => {
  describe('when enabled', () => {
    beforeEach(() => {
      (useFeatureFlag as jest.Mock).mockReturnValue(true)
    })

    it('should show new UI', () => {
      // Test enabled state
    })

    it('should fetch additional data', () => {
      // Test enabled logic
    })
  })

  describe('when disabled', () => {
    beforeEach(() => {
      (useFeatureFlag as jest.Mock).mockReturnValue(false)
    })

    it('should show old UI', () => {
      // Test disabled state
    })

    it('should not fetch additional data', () => {
      // Test disabled logic
    })
  })
})
```

---

## Feature Flag Lifecycle

### 1. Development Phase

```typescript
// Only available locally
myNewFeature: ['local']
```

- Develop feature behind flag
- Test locally with flag enabled
- No impact on deployed environments

### 2. Dev Environment

```typescript
// Available in local + dev
myNewFeature: ['local', 'dev']
```

- Deploy to dev environment
- Test with real data
- Gather initial feedback

### 3. Staging Environment

```typescript
// Available in local + dev + staging
myNewFeature: ['local', 'dev', 'staging']
```

- QA testing on staging
- Performance testing
- User acceptance testing

### 4. Production Rollout

```typescript
// Available everywhere
myNewFeature: ['local', 'dev', 'staging', 'prod']
```

- Feature live in production
- Monitor for issues
- Can still disable via URL if needed

### 5. Cleanup

Once the feature is stable and fully rolled out:

1. Remove the feature flag checks from code
2. Remove the flag from `FEATURE_FLAGS` configuration
3. Remove the flag key from `FeatureFlagKey` type

```typescript
// Before cleanup
{isMyFeatureEnabled && <NewFeature />}

// After cleanup (feature is permanent)
<NewFeature />
```

---

## Best Practices

1. **Start narrow, expand gradually** - Begin with `['local']`, expand as confidence grows
2. **Test both states** - Always verify code works with flag on AND off
3. **Keep flags short-lived** - Remove flags once features are stable
4. **Document flag purpose** - Add comments explaining what the flag controls
5. **Clean up old flags** - Remove flags after features are fully deployed
6. **Use descriptive names** - Flag names should clearly indicate what they control
7. **Avoid flag dependencies** - Features shouldn't depend on multiple flags
8. **Test URL overrides** - Ensure `enable-feature` and `disable-feature` work

---

## Common Use Cases

### A/B Testing

```typescript
const useNewAlgorithm = useFeatureFlag('newAlgorithm')

const results = useNewAlgorithm
  ? algorithmV2(data)
  : algorithmV1(data)
```

### Beta Features

```typescript
const isBetaEnabled = useFeatureFlag('betaFeatures')

{isBetaEnabled && (
  <div className="border-2 border-yellow-500 p-4">
    <span className="text-yellow-700">BETA</span>
    <BetaFeature />
  </div>
)}
```

### Deprecation

```typescript
const useLegacyUI = useFeatureFlag('legacyUI')

return useLegacyUI ? <OldComponent /> : <NewComponent />
```

### Performance Optimization

```typescript
const useOptimizedRenderer = useFeatureFlag('optimizedRenderer')

return useOptimizedRenderer
  ? <FastRenderer data={data} />
  : <StandardRenderer data={data} />
```

---

## Troubleshooting

### Flag Not Working

1. **Check environment** - Verify flag is enabled for current environment in `FEATURE_FLAGS`
2. **Check spelling** - Flag key must match exactly (case-sensitive)
3. **Check ENV variable** - Ensure `process.env.ENV` is set correctly
4. **Clear URL params** - Remove conflicting `disable-feature` parameters

### Flag Enabled in Wrong Environment

1. **Check configuration** - Review `FEATURE_FLAGS` array for the flag
2. **Check deployment** - Ensure latest code is deployed
3. **Use URL override** - Use `?disable-feature=flagName` to disable

### TypeScript Errors

```typescript
// Error: Type '"myFeature"' is not assignable to type 'FeatureFlagKey'

// Solution: Add to FeatureFlagKey type
export type FeatureFlagKey =
  | 'existingFlag'
  | 'myFeature'  // Add this
```

---

## Next Steps

- [Adding New Routes](./01-adding-new-routes.md) - Use feature flags in route loaders
- [Adding New Components](./02-adding-new-components.md) - Conditionally render components
- [Testing Guide](./06-testing-guide.md) - Test feature-flagged code
