# Environment Variables Reference

This document provides a comprehensive reference for all environment variables used in the CryoET Data Portal frontend. These variables configure API endpoints, feature flags, analytics, and development settings.


## Quick Reference

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `API_URL_V2` | Yes | - | GraphQL API endpoint |
| `ENV` | Yes | - | Environment name (local/dev/staging/prod) |
| `LOCALHOST_PLAUSIBLE_TRACKING` | No | `false` | Enable Plausible analytics on localhost |
| `API_URL` | No | - | Legacy API endpoint (deprecated) |

---

## Environment File

### Location

Environment variables are configured in `.env` file at the package root:

```
/packages/data-portal/.env
```

### Example Configuration

A sample configuration is provided in `.env.example`:

**Location:** `/packages/data-portal/.env.example`

```bash
API_URL_V2=https://graphql.cryoetdataportal.czscience.com/graphql
ENV=local
LOCALHOST_PLAUSIBLE_TRACKING=false
```

---

## Variable Definitions

### API_URL_V2

**Type:** `string` (URL)
**Required:** Yes
**Purpose:** GraphQL API endpoint for data fetching

The primary API endpoint used by Apollo Client for all GraphQL queries and mutations. This is the v2 GraphQL API that powers the data portal.

**Values by environment:**

| Environment | URL |
|-------------|-----|
| Local | `https://graphql.cryoetdataportal.czscience.com/graphql` |
| Development | `https://graphql-dev.cryoetdataportal.czscience.com/graphql` |
| Staging | `https://graphql-staging.cryoetdataportal.czscience.com/graphql` |
| Production | `https://graphql.cryoetdataportal.czscience.com/graphql` |

**Used in:**
- Apollo Client configuration (`app/apollo.server.ts`)
- GraphQL code generation (`codegen.ts`)

**Example usage:**
```typescript
// app/apollo.server.ts
export const apolloClientV2 = new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: process.env.API_URL_V2,
  }),
})
```

---

### ENV

**Type:** `string`
**Required:** Yes
**Purpose:** Environment identifier for conditional logic and analytics

Identifies the current deployment environment. Used to enable/disable features, configure analytics domains, and adjust behavior.

**Allowed values:**

| Value | Description |
|-------|-------------|
| `local` | Local development environment |
| `dev` | Development deployment |
| `staging` | Staging deployment |
| `prod` | Production deployment |

**Used in:**
- Plausible analytics domain selection
- Feature flag logic
- Environment-specific behavior
- Root loader context (`app/root.tsx`)

**Example usage:**
```typescript
// app/root.tsx
export async function loader({ request }: LoaderFunctionArgs) {
  return typedjson({
    ENV: defaults(
      {
        ENV: process.env.ENV,
        // ...other env vars
      },
      ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
    ),
  })
}
```

**Plausible domain mapping:**
```typescript
export const PLAUSIBLE_ENV_URL_MAP: Record<string, string> = {
  local: 'http://localhost:3000',
  dev: 'https://cryoetdataportal-dev.cziscience.com',
  staging: 'https://cryoetdataportal-staging.cziscience.com',
  prod: 'https://cryoetdataportal.cziscience.com',
}
```

---

### LOCALHOST_PLAUSIBLE_TRACKING

**Type:** `boolean` (string: `'true'` or `'false'`)
**Required:** No
**Default:** `false`
**Purpose:** Enable Plausible analytics tracking on localhost

Controls whether analytics events are sent to Plausible when running on localhost. Typically disabled for local development to avoid polluting analytics data.

**Allowed values:**

| Value | Description |
|-------|-------------|
| `false` | Disable tracking on localhost (default) |
| `true` | Enable tracking on localhost |

**Used in:**
- Plausible analytics initialization
- Event tracking logic

**Example usage:**
```typescript
// Check if tracking should be enabled
const shouldTrack =
  process.env.ENV !== 'local' ||
  process.env.LOCALHOST_PLAUSIBLE_TRACKING === 'true'
```

---

### API_URL (Deprecated)

**Type:** `string` (URL)
**Required:** No
**Purpose:** Legacy API endpoint (v1)
**Status:** Deprecated - do not use for new development

This was the original REST API endpoint. The application now uses `API_URL_V2` (GraphQL) exclusively.

**Note:** This variable may still be present in configuration but is not actively used in current code. It will be removed in a future cleanup.

---

## Environment Context

Environment variables are exposed to the client-side application through the root loader. This pattern allows safe exposure of specific variables while keeping secrets server-side only.

### Server-Side Access

Directly access environment variables in server code (loaders, actions):

```typescript
// In a loader or action
export async function loader() {
  const apiUrl = process.env.API_URL_V2
  // Use apiUrl...
}
```

### Client-Side Access

Access environment variables through the `EnvironmentContext`:

```typescript
import { useEnvironment } from 'app/hooks/useEnvironment'

function MyComponent() {
  const { ENV, API_URL_V2 } = useEnvironment()

  // Use environment variables...
}
```

**Context definition:**
```typescript
// app/context/Environment.context.ts
export interface EnvironmentContextValue {
  API_URL?: string
  API_URL_V2?: string
  ENV?: string
  LOCALHOST_PLAUSIBLE_TRACKING?: string
}

export const ENVIRONMENT_CONTEXT_DEFAULT_VALUE: EnvironmentContextValue = {
  API_URL: undefined,
  API_URL_V2: undefined,
  ENV: 'local',
  LOCALHOST_PLAUSIBLE_TRACKING: 'false',
}
```

**Context provider:**
```typescript
// app/root.tsx
export async function loader({ request }: LoaderFunctionArgs) {
  return typedjson({
    ENV: defaults(
      {
        API_URL: process.env.API_URL,
        API_URL_V2: process.env.API_URL_V2,
        ENV: process.env.ENV,
        LOCALHOST_PLAUSIBLE_TRACKING: process.env.LOCALHOST_PLAUSIBLE_TRACKING,
      },
      ENVIRONMENT_CONTEXT_DEFAULT_VALUE,
    ),
  })
}

// Context is provided in Document component
<EnvironmentContext.Provider value={ENV}>
  {/* app content */}
</EnvironmentContext.Provider>
```

---

## GraphQL Code Generation

The `API_URL_V2` variable is also used during GraphQL code generation to fetch the schema.

**Configuration:** `codegen.ts`

```typescript
const SCHEMA_URL_V2 = process.env.API_URL_V2 ??
  'https://graphql.cryoetdataportal.czscience.com/graphql'

const config: CodegenConfig = {
  generates: {
    './app/__generated_v2__/': {
      schema: SCHEMA_URL_V2,
      documents: ['app/**/*V2*.{ts,tsx}'],
      preset: 'client',
    },
  },
}
```

**Commands:**
```bash
# Generate types from schema
pnpm data-portal build:codegen

# Watch mode
pnpm data-portal dev:codegen
```

---

## Local Development Setup

### Initial Setup

1. Copy the example environment file:
```bash
cd packages/data-portal
cp .env.example .env
```

2. Edit `.env` with your settings:
```bash
API_URL_V2=https://graphql.cryoetdataportal.czscience.com/graphql
ENV=local
LOCALHOST_PLAUSIBLE_TRACKING=false
```

3. Start the development server:
```bash
pnpm dev
```

### Troubleshooting

**Issue:** GraphQL queries fail with network error
**Solution:** Verify `API_URL_V2` is set correctly in `.env`

**Issue:** Code generation fails
**Solution:** Ensure `API_URL_V2` is accessible and points to a valid GraphQL endpoint

**Issue:** Analytics not working on localhost
**Solution:** Set `LOCALHOST_PLAUSIBLE_TRACKING=true` if you want to test analytics locally

---

## Deployment Configuration

Environment variables are set differently based on deployment platform:

### Docker/Container Deployments

Set environment variables in your container orchestration config:

```yaml
# docker-compose.yml example
services:
  frontend:
    environment:
      - API_URL_V2=https://graphql.cryoetdataportal.czscience.com/graphql
      - ENV=prod
```

### CI/CD Pipelines

Set as GitHub Actions secrets or pipeline variables:

```yaml
# .github/workflows/deploy.yml
env:
  API_URL_V2: ${{ secrets.API_URL_V2 }}
  ENV: ${{ secrets.ENV }}
```

### Server Deployments

Export in your shell or set in systemd service files:

```bash
# Export in shell
export API_URL_V2="https://graphql.cryoetdataportal.czscience.com/graphql"
export ENV="prod"

# Or in systemd service file
[Service]
Environment="API_URL_V2=https://graphql.cryoetdataportal.czscience.com/graphql"
Environment="ENV=prod"
```

---

## Security Considerations

### What to Expose

**Safe to expose to client:**
- `API_URL_V2` - Public API endpoint
- `ENV` - Environment name
- `LOCALHOST_PLAUSIBLE_TRACKING` - Feature flag

These variables are explicitly passed to the client through the root loader and can be safely included in client-side bundles.

### What NOT to Expose

**Never expose to client:**
- API keys or secrets
- Database connection strings
- Internal service URLs
- Authentication tokens

**Implementation:** Only variables explicitly passed through the root loader are available client-side. Server-only secrets should only be accessed in loaders/actions.

---

## Testing

### E2E Tests

Environment variables are set in Playwright configuration:

```typescript
// playwright.config.ts
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
}
```

**E2E constants:**
```typescript
// e2e/constants.ts
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
export const API_URL_V2 = process.env.API_URL_V2 ||
  'https://graphql.cryoetdataportal.czscience.com/graphql'
```

### Unit Tests

Mock environment variables in Jest tests:

```typescript
// In test setup or individual tests
process.env.API_URL_V2 = 'https://test-api.example.com/graphql'
process.env.ENV = 'test'
```

---

## Migration Notes

### Migrating from API_URL to API_URL_V2

If updating code that uses the deprecated `API_URL`:

1. Replace all references:
```typescript
// Before
const url = process.env.API_URL

// After
const url = process.env.API_URL_V2
```

2. Update GraphQL client configuration
3. Update code generation config
4. Update environment files
5. Update deployment configurations

---

## Next Steps

- [Query Parameters](./01-query-params.md) - URL parameter reference
- [Constants Reference](./03-constants-reference.md) - Application constants
- [Type Definitions](./04-type-definitions.md) - TypeScript types
- [GraphQL Schema](./05-graphql-schema.md) - GraphQL API reference
