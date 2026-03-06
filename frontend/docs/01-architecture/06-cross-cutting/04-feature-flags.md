# Feature Flags

This document covers the feature flag system in the CryoET Data Portal frontend, including environment-based flags, URL override capabilities, implementation patterns, and best practices for conditional feature rollouts.


## Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| Flag Config | [`utils/featureFlags.ts`](../../../packages/data-portal/app/utils/featureFlags.ts) | Feature flag definitions and logic |
| Environment | `process.env.ENV` | Current environment (local, dev, staging, prod) |
| URL Override | `?enable-feature=key` | Enable feature via URL |
| URL Disable | `?disable-feature=key` | Disable feature via URL |

> **Note:** Feature flags are added as needed for gradual rollouts and removed once features are stable. Check [`featureFlags.ts`](../../../packages/data-portal/app/utils/featureFlags.ts) for current flags.

---

## Feature Flag Architecture

The CryoET Portal uses a **simple environment-based feature flag system** with URL override support.

### Why Feature Flags?

| Use Case | Example |
|----------|---------|
| **Gradual Rollout** | Enable new features in dev/staging before production |
| **Environment-Specific** | Different behavior in local vs. production |
| **Testing** | QA can test features via URL params |
| **Emergency Disable** | Quickly disable problematic features |

### Design Principles

1. **Simple by default** - Boolean flags, no complex targeting
2. **URL overridable** - QA can test any flag state
3. **Environment-based** - Flags tied to deployment environment
4. **Server and client** - Same logic works in loaders and components
5. **Type-safe** - TypeScript ensures valid flag keys

---

## Feature Flag Configuration

### Flag Definitions

From [`featureFlags.ts`](../../../packages/data-portal/app/utils/featureFlags.ts):

```typescript
export type FeatureFlagEnvironment = typeof process.env.ENV

// Add new flags to this union type
export type FeatureFlagKey = 'myNewFeature' | 'betaFeature'

// Configure which environments each flag is enabled in
export const FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagEnvironment[]> = {
  myNewFeature: ['local', 'dev'],        // Dev only initially
  betaFeature: ['local', 'dev', 'staging', 'prod'],  // All environments
}
```

**Key types:**
- `FeatureFlagKey`: All available flag keys (type-safe)
- `FeatureFlagEnvironment`: Valid environment names
- `FEATURE_FLAGS`: Mapping of flags to enabled environments

### Environment Values

The `ENV` variable determines the current environment:

| Environment | Value | Description |
|------------|-------|-------------|
| Local | `'local'` | Developer machines |
| Development | `'dev'` | Development server |
| Staging | `'staging'` | Pre-production testing |
| Production | `'prod'` | Live production site |

Configured via `.env`:

```bash
# .env
ENV=local
```

---

## Checking Feature Flags

### Server-Side (Remix Loaders)

Use `getFeatureFlag()` in server-side code:

```typescript
import { getFeatureFlag } from 'app/utils/featureFlags'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const isNewFeatureEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'myNewFeature',
    params: url.searchParams,
  })

  if (isNewFeatureEnabled) {
    // Fetch additional data for new feature
    const extraData = await getExtraData()
    return json({ data, extraData })
  }

  return json({ data })
}
```

**Function signature:**

```typescript
export function getFeatureFlag({
  env,
  key,
  params = new URLSearchParams(),
}: {
  env: FeatureFlagEnvironment
  key: FeatureFlagKey
  params?: URLSearchParams
}): boolean
```

### Client-Side (React Components)

Use `useFeatureFlag()` hook in components:

```typescript
import { useFeatureFlag } from 'app/utils/featureFlags'

function MyComponent() {
  const isNewFeatureEnabled = useFeatureFlag('myNewFeature')

  return (
    <div>
      <h1>Title</h1>
      {isNewFeatureEnabled ? (
        <NewFeatureUI />
      ) : (
        <StandardUI />
      )}
    </div>
  )
}
```

**Hook signature:**

```typescript
export function useFeatureFlag(key: FeatureFlagKey): boolean
```

**Hook implementation:**

```typescript
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

---

## URL Override System

Feature flags can be **overridden via URL parameters** for testing.

### Enable Feature via URL

Add `?enable-feature=flagKey` to any URL:

```
https://cryoetdataportal.czscience.com/browse-data/datasets?enable-feature=myNewFeature
```

**Multiple flags:**

```
?enable-feature=myNewFeature&enable-feature=betaFeature
```

### Disable Feature via URL

Add `?disable-feature=flagKey` to any URL:

```
https://cryoetdataportal.czscience.com/browse-data/datasets?disable-feature=myNewFeature
```

### Override Logic

From [`featureFlags.ts`](../../../packages/data-portal/app/utils/featureFlags.ts):

```typescript
const ENABLE_FEATURE_PARAM = 'enable-feature'
const DISABLE_FEATURE_PARAM = 'disable-feature'

export function getFeatureFlag({
  env,
  key,
  params = new URLSearchParams(),
}: {
  env: FeatureFlagEnvironment
  key: FeatureFlagKey
  params?: URLSearchParams
}): boolean {
  // URL disable takes highest precedence
  if (params.getAll(DISABLE_FEATURE_PARAM).includes(key)) {
    return false
  }

  // URL enable takes second precedence
  if (params.getAll(ENABLE_FEATURE_PARAM).includes(key)) {
    return true
  }

  // Default to environment-based configuration
  return FEATURE_FLAGS[key].includes(env)
}
```

**Precedence order:**
1. URL `disable-feature` param (highest)
2. URL `enable-feature` param
3. Environment-based config (lowest)

---

## Common Patterns

### Conditional Rendering

**Simple toggle:**

```typescript
function Header() {
  const isBetaEnabled = useFeatureFlag('betaFeature')

  return (
    <nav>
      <Link to="/browse-data/datasets">Datasets</Link>
      {isBetaEnabled && (
        <Link to="/beta">Beta Features</Link>
      )}
    </nav>
  )
}
```

**Alternative content:**

```typescript
function Banner() {
  const isNewFeatureEnabled = useFeatureFlag('myNewFeature')

  return (
    <div>
      {isNewFeatureEnabled ? (
        <div>Try our new feature!</div>
      ) : (
        <div>Standard banner content</div>
      )}
    </div>
  )
}
```

### Feature-Gated Routes

```typescript
// app/routes/beta-feature.tsx
export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  // Check if feature is enabled
  const isBetaEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'betaFeature',
    params: url.searchParams,
  })

  if (!isBetaEnabled) {
    throw new Response('Not Found', { status: 404 })
  }

  // Feature is enabled, proceed with loading
  const data = await getBetaData(params.id)
  return json({ data })
}
```

### Conditional Data Fetching

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const isNewFeatureEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'myNewFeature',
    params: url.searchParams,
  })

  if (isNewFeatureEnabled) {
    // Fetch additional data when feature is enabled
    const [baseData, extraData] = await Promise.all([
      getBaseData(),
      getExtraData(),
    ])
    return json({ baseData, extraData })
  }

  // Standard data fetching
  const baseData = await getBaseData()
  return json({ baseData, extraData: null })
}
```

---

## Testing with Feature Flags

### QA Testing Workflow

1. **Test feature enabled:**
   ```
   https://staging.cryoetdataportal.czscience.com?enable-feature=newFeature
   ```

2. **Test feature disabled:**
   ```
   https://staging.cryoetdataportal.czscience.com?disable-feature=newFeature
   ```

3. **Test multiple flags:**
   ```
   ?enable-feature=featureA&enable-feature=featureB&disable-feature=featureC
   ```

### Unit Testing

Mock the feature flag hook in Jest tests:

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

**Test both states** - Always test both enabled and disabled states:

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

### E2E Testing

In Playwright tests:

```typescript
test('displays new feature when enabled', async ({ page }) => {
  await page.goto('/browse-data/datasets?enable-feature=myNewFeature')

  // Verify new feature UI is shown
  await expect(page.locator('[data-testid="new-feature"]')).toBeVisible()
})

test('hides new feature when disabled', async ({ page }) => {
  await page.goto('/browse-data/datasets?disable-feature=myNewFeature')

  // Verify new feature UI is hidden
  await expect(page.locator('[data-testid="new-feature"]')).not.toBeVisible()
})
```

---

## Adding New Feature Flags

### Step 1: Define the Flag

Add to `FeatureFlagKey` type and `FEATURE_FLAGS` object:

```typescript
// app/utils/featureFlags.ts

export type FeatureFlagKey =
  | 'existingFlag'
  | 'myNewFeature'  // ← Add new flag

export const FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagEnvironment[]> = {
  existingFlag: ['local', 'dev', 'staging', 'prod'],
  myNewFeature: ['local', 'dev'],  // ← Enable in local and dev only
}
```

### Step 2: Use the Flag

**In server code:**

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const isNewFeatureEnabled = getFeatureFlag({
    env: process.env.ENV,
    key: 'newFeature',
    params: url.searchParams,
  })

  if (isNewFeatureEnabled) {
    // New feature logic
  }
}
```

**In client code:**

```typescript
function MyComponent() {
  const isNewFeatureEnabled = useFeatureFlag('newFeature')

  return isNewFeatureEnabled ? <NewUI /> : <OldUI />
}
```

### Step 3: Test the Flag

```bash
# Test locally with flag enabled
http://localhost:3000?enable-feature=newFeature

# Test locally with flag disabled
http://localhost:3000?disable-feature=newFeature
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

## Common Use Cases

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

## Best Practices

### Flag Naming

✅ **Do:**
- Use camelCase: `advancedSearch`
- Be descriptive: `betaAnalytics` not `ba`
- Use positive names: `enableFeature` not `disableFeature`

❌ **Don't:**
- Use generic names: `feature1`, `newThing`
- Use abbreviations: `advSrch`, `ba`
- Use negative names: `hideOldUI`

### Flag Lifecycle

✅ **Do:**
- Start with dev/staging environments
- Gradually roll out to production
- Remove flag after feature is stable
- Document flag purpose in code comments
- Set timeline for flag removal

❌ **Don't:**
- Leave flags forever (creates tech debt)
- Skip staging testing
- Enable in prod without staging validation
- Create permanent "toggle" flags

### Code Organization

✅ **Do:**
- Keep flag checks close to usage
- Use flags in loaders for data fetching
- Use flags in components for UI changes
- Document what each flag controls

❌ **Don't:**
- Nest multiple flag checks deeply
- Use flags for permanent configuration (use env vars)
- Duplicate flag logic across files
- Forget to handle both true/false cases

### Performance

✅ **Do:**
- Check flags once per render/request
- Use memoization for expensive operations
- Avoid flag checks in tight loops

❌ **Don't:**
- Check flags in every list item
- Fetch different data based on flags without caching
- Create performance cliffs between flag states

---

## Troubleshooting

### Flag Not Working

**Problem:** Feature flag doesn't seem to have any effect.

**Solutions:**
1. Verify flag is in `FEATURE_FLAGS` object
2. Check environment value: `console.log(process.env.ENV)`
3. Ensure flag is in enabled environments array
4. Try URL override: `?enable-feature=flagKey`
5. Clear browser cache and cookies

### TypeScript Errors

**Problem:** TypeScript error when using new flag key.

**Solution:** Add flag to `FeatureFlagKey` type:

```typescript
export type FeatureFlagKey =
  | 'existingFlag'
  | 'newFlag'  // ← Add here
```

### URL Override Not Working

**Problem:** URL param doesn't override flag state.

**Solutions:**
1. Check param syntax: `?enable-feature=flagKey` (not `?flagKey=true`)
2. Verify URL params are passed to `getFeatureFlag()`
3. Check server-side: URL params must be read from `request.url`

## Future Enhancements

Potential improvements to the feature flag system:

### User-Based Targeting

```typescript
interface FeatureFlagConfig {
  environments: FeatureFlagEnvironment[]
  userIds?: string[]  // Enable for specific users
  percentage?: number  // Enable for % of users
}

// Example:
betaFeature: {
  environments: ['prod'],
  userIds: ['user1@example.com', 'user2@example.com'],
  percentage: 5,  // Enable for 5% of users
}
```

### Analytics Integration

```typescript
export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const isEnabled = /* ... */

  // Track feature flag usage
  useEffect(() => {
    plausible('FeatureFlag', {
      props: { flag: key, enabled: isEnabled },
    })
  }, [key, isEnabled])

  return isEnabled
}
```

### Remote Configuration

```typescript
// Fetch flags from remote API
export async function getRemoteFeatureFlags(): Promise<FeatureFlags> {
  const response = await fetch('https://api.example.com/feature-flags')
  return response.json()
}
```

---

## Next Steps

- [State Management](../03-state/01-state-management.md) - Managing feature-flag-dependent state
- [GraphQL Integration](../02-data/01-graphql-integration.md) - Conditional queries based on flags
- [Data Model](../02-data/02-data-model.md) - Understanding CryoET domain concepts
