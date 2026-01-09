# Technology Stack

This document provides a comprehensive overview of the technologies used in the CryoET Data Portal frontend, including rationale for selection and how they integrate together.


## Quick Reference

| Category | Technology |
|----------|------------|
| Framework | Remix |
| UI Library | React |
| Language | TypeScript |
| GraphQL Client | Apollo Client |
| State Management | Jotai |
| CSS Framework | Tailwind CSS |
| Component Library | Material-UI |
| Design System | CZI SDS |
| Unit Testing | Jest |
| E2E Testing | Playwright |
| Package Manager | pnpm |
| Runtime | Node.js |

> **Note:** For current versions, see `package.json`. Node.js version is specified in `.nvmrc`.

---

## Core Framework

### Remix

Remix is a full-stack React framework that provides server-side rendering (SSR), route-based code splitting, and a streamlined data loading model.

**Why Remix over Next.js?**

[Internal benchmarks](https://github.com/chanzuckerberg/cryoet-data-portal/issues/50#issuecomment-1741672041) (September 2023) comparing both frameworks with identical dependencies (Tailwind, Material-UI, SDS components) showed significant performance advantages:

| Metric | Next.js | Remix | Improvement |
|--------|---------|-------|-------------|
| Production Build | 26.7s | 2.5s | ~10x faster |
| Dev First Page Build | 12.4s | 3.2s | ~4x faster |

**Key benefits:**
- **Route-based code splitting** - Each route is a separate bundle, reducing initial load time
- **Server-side data loading** - Loaders fetch data before rendering, eliminating client-side waterfalls
- **Progressive enhancement** - Forms and navigation work without JavaScript
- **Built-in CSS bundling** - Simplified asset management

**Related packages:**
- `@remix-run/react` - React integration
- `@remix-run/node` - Server-side runtime
- `@remix-run/express` - Express server adapter
- `@remix-run/dev` - Development tooling

**Configuration:** [`remix.config.js`](../../../packages/data-portal/remix.config.js)

For detailed patterns, see [Remix Fundamentals](../01-routing/01-remix-fundamentals.md).

---

### React

React is the UI library for building component-based interfaces.

**Key features used:**
- Suspense for lazy loading components
- Strict Mode for development warnings

---

### TypeScript

TypeScript provides static type checking with **strict mode enabled** for maximum type safety.

**Strict mode settings** (from [`tsconfig.json`](../../../packages/data-portal/tsconfig.json)):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Key benefits:**
- Catch errors at compile time rather than runtime
- Improved IDE support with autocompletion
- Self-documenting code through type annotations
- Safer refactoring

---

### Node.js & Express

The application runs on Node.js with Express as the HTTP server.

**Node version** is specified in [`.nvmrc`](../../../packages/data-portal/.nvmrc) - use `nvm use` to activate.

**Server features:**
- Gzip compression via `compression` middleware
- Request logging via `morgan`
- Hot module reloading in development

**Configuration:** [`server.ts`](../../../packages/data-portal/server.ts)

---

## GraphQL & Data Layer

### Apollo Client

Apollo Client is the GraphQL client used for data fetching with SSR support.

**Configuration** ([`apollo.server.ts`](../../../packages/data-portal/app/apollo.server.ts)):
```typescript
export const apolloClientV2 = new ApolloClient({
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',  // Server-rendered, no client cache needed
    },
  },
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: process.env.API_URL_V2,
  }),
})
```

**Why Apollo?**
- Industry-standard GraphQL client
- Excellent SSR support
- TypeScript integration via codegen
- Fragment support for query composition
- Powerful caching (when needed)

For detailed patterns, see [GraphQL Integration](../02-data/01-graphql-integration.md).

---

### GraphQL Code Generation

GraphQL Codegen automatically generates TypeScript types from the GraphQL schema.

**Configuration** ([`codegen.ts`](../../../packages/data-portal/codegen.ts)):
```typescript
const config: CodegenConfig = {
  generates: {
    './app/__generated_v2__/': {
      schema: SCHEMA_URL_V2,
      documents: ['app/**/*V2*.{ts,tsx}', ...],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,  // Simpler type usage
      },
    },
  },
}
```

**Key decisions:**
- **Fragment masking disabled** - Simpler type inference without needing to unwrap results
- **Custom scalar mapping** - `DateTime` → `string`, `numeric` → `number`
- **Generated to `app/__generated_v2__/`** - Separate from source code

**Commands:**
```bash
pnpm data-portal build:codegen  # One-time generation
pnpm data-portal dev:codegen    # Watch mode
```

---

### TanStack React Query

React Query manages server state separately from UI state, providing caching, background refetching, and error handling.

**When to use:**
- REST API calls
- Data that benefits from caching
- Background synchronization

**Note:** GraphQL queries typically go through Apollo Client. React Query is used for non-GraphQL server interactions.

---

## State Management

The application uses a layered state management approach. For detailed patterns, see [State Management](../03-state/01-state-management.md).

### Server State (Remix Loaders)

Server state is data fetched from the GraphQL API via Remix loaders. This is the primary source of data in the application - covered in detail in the [GraphQL & Data Layer](#graphql--data-layer) section above.

---

### Route State

Route parameters from the URL path (e.g., `/datasets/:id`) identify specific resources:

```typescript
// app/routes/datasets.$id.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN
  // Use id to fetch specific dataset
}
```

---

### URL State

Remix's routing system supports URL-based state through search parameters (`?query=value`). The filter system uses URL state extensively to make filters shareable and bookmarkable.

```typescript
import { useQueryParam } from 'app/hooks/useQueryParam'

const [search, setSearch] = useQueryParam<string>(QueryParams.Search)
```

---

### React Context

Global configuration (environment variables, feature flags) is provided via React Context. See [`app/context/`](../../../packages/data-portal/app/context/).

---

### Jotai

Jotai provides atomic state management for ephemeral UI state - small, composable pieces of state without the boilerplate of Redux.

**Why Jotai?**
- Lightweight (~3KB)
- Atomic model - only re-renders components that use changed atoms
- Less boilerplate than Redux
- Great for complex UI state
- No context providers needed (uses React's native context)

**Usage pattern:**
```typescript
// Define an atom
import { atom } from 'jotai'
export const filterAtom = atom<FilterState>({ ... })

// Use in component
import { useAtom } from 'jotai'
const [filter, setFilter] = useAtom(filterAtom)
```

**State files location:** [`app/state/`](../../../packages/data-portal/app/state/)

---

## Styling System

The styling approach uses a layered hierarchy: **SDS → MUI → Tailwind → CSS Modules**

### [CZI Science Design System (SDS)](https://github.com/chanzuckerberg/sci-components)

SDS is the **primary styling approach** - always check SDS first for UI components.

**Integration:**
- Pre-built components via `@czi-sds/components` (buttons, inputs, icons, menus, dialogs)
- Design tokens imported into Tailwind config

**When to use:**
- UI components (buttons, inputs, icons, menus, dialogs, etc.)
- Always the first choice before MUI or custom components

---

### Material-UI (MUI)

MUI is the **secondary choice** when SDS doesn't have the component.

**Packages:**
- `@mui/material` - Core components
- `@mui/icons-material` - Icon library
- `@mui/base` - Headless components

**When to use:**
- When SDS doesn't have the component
- Complex UI patterns (tooltips, collapse, etc.)
- Accessibility-critical components

**Note:** Use MUI components but style them with Tailwind, not MUI's `styled()`.

---

### Tailwind CSS

Tailwind is used for **customization and layout** - utility-first CSS framework.

**Configuration** ([`tailwind.config.ts`](../../../packages/data-portal/tailwind.config.ts)):
```typescript
import sds from '@czi-sds/components/dist/tailwind.json'

export default {
  content: ['./app/**/*.{ts,tsx,scss}'],
  theme: {
    extend: {
      ...sds,  // CZI Science Design System tokens
      screens: { /* Custom breakpoints from 360px to 2040px */ },
      maxWidth: { content: '1600px' },
    },
  },
}
```

**When to use:**
- Layout (flex, grid, positioning)
- Customization of SDS/MUI components
- Custom components when SDS/MUI don't have what you need
- Always use SDS tokens when available (`gap-sds-m`, not `gap-4`)

**ESLint enforces no MUI styled()** ([`typescript.cjs`](../../../packages/eslint-config/typescript.cjs)):
```javascript
'no-restricted-imports': ['error', {
  patterns: [{
    group: ['@mui/*'],
    importNames: ['styled'],
    message: 'Prefer tailwind over MUI styled components',
  }],
}]
```

---

### Emotion

Emotion is a CSS-in-JS library used primarily for SSR style extraction.

**Packages:**
- `@emotion/react` - Core library
- `@emotion/styled` - Styled components API
- `@emotion/cache` - SSR cache management

**Why needed?**
- Material-UI uses Emotion internally
- Enables server-side style extraction for SSR
- Prevents flash of unstyled content

---

### CSS Modules

CSS Modules provide component-scoped styles to prevent class name collisions.

**Files:** `*.module.css` or `*.module.scss`

**Type generation:**
```bash
pnpm data-portal build:tcm  # Generate .d.ts files
pnpm data-portal dev:tcm    # Watch mode
```

For detailed styling guidance, see [Styling System](../05-styling/01-styling-system.md).

---

## Internationalization

### i18next

i18next is the internationalization framework with server and client support.

**Packages:**
- `i18next` - Core library
- `react-i18next` - React bindings
- `remix-i18next` - Remix integration
- `i18next-browser-languagedetector` - Browser language detection
- `i18next-fs-backend` - Server-side translation loading

**Translation files:** [`public/locales/en/translation.json`](../../../packages/data-portal/public/locales/en/translation.json)

**Usage:**
```typescript
import { useTranslation } from 'react-i18next'

function Component() {
  const { t } = useTranslation()
  return <h1>{t('datasets.title')}</h1>
}
```

---

## Testing

### Jest

Jest is the unit testing framework.

**Configuration** ([`jest.config.cjs`](../../../packages/data-portal/jest.config.cjs)):
```javascript
module.exports = {
  testTimeout: 10000,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
}
```

**Related packages:**
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - DOM matchers
- `@testing-library/user-event` - User interaction simulation

**Commands:**
```bash
pnpm data-portal test        # Run tests
pnpm data-portal test:watch  # Watch mode
pnpm data-portal test:cov    # With coverage
```

---

### Playwright

Playwright is the E2E testing framework with multi-browser support.

**Configuration** ([`playwright.config.ts`](../../../packages/data-portal/playwright.config.ts)):
```typescript
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,  // Increased for visual regression testing
  retries: process.env.CI ? 2 : 0,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

**Key features:**
- Tests run on Chromium, Firefox, and WebKit
- Video recording on failure
- 2 retries on CI

**Commands:**
```bash
pnpm data-portal e2e        # Run E2E tests
pnpm data-portal e2e:debug  # Debug mode
pnpm data-portal e2e:ui     # Interactive UI
```

---

## Code Quality

### ESLint

ESLint enforces code quality and consistency.

**Base configuration:** Airbnb style guide with TypeScript support

**Custom rules highlight:**
- Named exports preferred over default exports
- Automatic import sorting
- No MUI `styled()` - use Tailwind instead
- Unused imports detection

**Configuration:** [`.eslintrc.cjs`](../../../packages/data-portal/.eslintrc.cjs)

**Commands:**
```bash
pnpm lint       # Run linter
pnpm lint:fix   # Auto-fix issues
```

---

### Prettier

Prettier enforces consistent code formatting.

**Configuration** ([`.prettierrc.yml`](../../../.prettierrc.yml)):
```yaml
arrowParens: always
semi: false
singleQuote: true
tabWidth: 2
trailingComma: all
```

---

### Stylelint

Stylelint enforces CSS/SCSS best practices.

**Commands:**
```bash
pnpm stylelint  # Run CSS linter
```

---

## Build & Development

### pnpm

pnpm is the package manager, chosen for its speed and disk efficiency.

**Monorepo workspace packages:**
- `packages/data-portal` - Main application
- `packages/eslint-config` - Shared ESLint configuration
- `packages/eslint-plugin` - Custom ESLint rules
- `packages/neuroglancer` - 3D visualization library

**Enforcement:** The `preinstall` script prevents using npm or yarn.

---

### Development Server

The dev server runs multiple processes concurrently:

```bash
pnpm dev
# Runs:
# 1. pnpm dev:codegen   - Watch GraphQL schema changes
# 2. pnpm dev:remix     - Remix dev server with HMR
# 3. pnpm dev:tcm       - Watch CSS Module type generation
```

---

## Configuration Files Reference

| File | Purpose |
|------|---------|
| [`tsconfig.json`](../../../packages/data-portal/tsconfig.json) | TypeScript configuration |
| [`remix.config.js`](../../../packages/data-portal/remix.config.js) | Remix bundling configuration |
| [`tailwind.config.ts`](../../../packages/data-portal/tailwind.config.ts) | Tailwind CSS configuration |
| [`codegen.ts`](../../../packages/data-portal/codegen.ts) | GraphQL code generation |
| [`jest.config.cjs`](../../../packages/data-portal/jest.config.cjs) | Jest test configuration |
| [`playwright.config.ts`](../../../packages/data-portal/playwright.config.ts) | E2E test configuration |
| [`postcss.config.js`](../../../packages/data-portal/postcss.config.js) | CSS processing pipeline |
| [`.eslintrc.cjs`](../../../packages/data-portal/.eslintrc.cjs) | ESLint rules |
| [`.prettierrc.yml`](../../../.prettierrc.yml) | Prettier formatting rules |
| [`.nvmrc`](../../../packages/data-portal/.nvmrc) | Node.js version |

## Next Steps

- [Remix Fundamentals](../01-routing/01-remix-fundamentals.md) - Loaders, routes, SSR patterns
- [GraphQL Integration](../02-data/01-graphql-integration.md) - Apollo, codegen, queries
- [State Management](../03-state/01-state-management.md) - Jotai, URL state, contexts
- [Styling System](../05-styling/01-styling-system.md) - Tailwind + CSS Modules + MUI
