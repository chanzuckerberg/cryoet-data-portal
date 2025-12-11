# Build Errors

This guide covers troubleshooting compilation, bundling, and build-time errors in the CryoET Data Portal frontend. Learn how to diagnose and fix TypeScript errors, Remix build issues, dependency problems, and more.

**Last updated:** December 10, 2025

## Build Process Overview

The complete build process runs multiple steps:

```bash
pnpm build
```

This executes:
1. **GraphQL codegen** (`pnpm build:codegen`) - Generate types from schema
2. **Neuroglancer build** (`pnpm build:neuroglancer`) - Build 3D viewer package
3. **CSS Module types** (`pnpm build:tcm`) - Generate TypeScript definitions
4. **Remix build** (`pnpm build:remix`) - Bundle application

Each step must complete successfully for the build to succeed.

---

## TypeScript Compilation Errors

### Strict Mode Type Errors

#### Problem: Type errors in strict mode

**Symptom:**

```typescript
// Error: Object is possibly 'undefined'
const title = dataset.title.toUpperCase()
```

**Cause:**

TypeScript strict mode is enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Solutions:**

**1. Add null checks:**

```typescript
// Before
const title = dataset.title.toUpperCase()

// After
const title = dataset.title?.toUpperCase() ?? 'Untitled'
```

**2. Use type guards:**

```typescript
if (dataset.title) {
  const title = dataset.title.toUpperCase()
}
```

**3. Use non-null assertion (when certain):**

```typescript
// Only if you're certain title exists
const title = dataset.title!.toUpperCase()
```

**4. Fix the type definition:**

```typescript
// If title should never be undefined, update the type
interface Dataset {
  title: string  // Remove ? if not optional
}
```

### Unused Variables Errors

#### Problem: Build fails with unused variable errors

**Symptom:**

```typescript
const unused = 'value'  // Error: 'unused' is assigned but never used
```

**Cause:**

TypeScript config enforces no unused locals:

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Solutions:**

**1. Remove unused variables:**

```typescript
// Remove entirely if not needed
```

**2. Prefix with underscore:**

```typescript
// Indicates intentionally unused
const _unused = 'value'
```

**3. Use the variable:**

```typescript
const value = 'value'
console.log(value)  // Now it's used
```

**4. For function parameters:**

```typescript
// Before
function handler(event, context) {  // Error: 'context' is unused
  console.log(event)
}

// After
function handler(event, _context) {  // Underscore prefix allowed
  console.log(event)
}
```

### Module Resolution Errors

#### Problem: Cannot find module

**Symptom:**

```typescript
import { Component } from 'app/components/Component'
// Error: Cannot find module 'app/components/Component'
```

**Cause:**

Path alias not configured or incorrect import path.

**Solutions:**

**1. Check tsconfig paths:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "app/*": ["./app/*"],
      "neuroglancer": ["../neuroglancer/dist"]
    }
  }
}
```

**2. Use relative imports:**

```typescript
// Instead of absolute
import { Component } from './Component'
```

**3. Verify file exists:**

```bash
ls app/components/Component.tsx
```

**4. Check file extension:**

TypeScript resolves `.ts`, `.tsx`, `.d.ts` automatically, but double-check:

```typescript
// Wrong
import { Component } from 'app/components/Component.ts'

// Right
import { Component } from 'app/components/Component'
```

### GraphQL Type Errors

#### Problem: GraphQL query types don't match

**Symptom:**

```typescript
const { data } = useQuery(GET_DATASET)
// Error: Property 'dataset' does not exist on type
```

**Cause:**

Types not generated or outdated after schema changes.

**Solutions:**

**1. Regenerate types:**

```bash
rm -rf app/__generated_v2__
pnpm build:codegen
```

**2. Verify query file naming:**

Files must match the codegen pattern:

```typescript
// codegen.ts
documents: [
  'app/**/*V2*.{ts,tsx}',
  'app/routes/_index.tsx',
  'app/routes/browse-data.tsx',
]
```

Rename file to include `V2`:
```
app/graphql/getDataset.ts → app/graphql/getDatasetV2.ts
```

**3. Import generated types:**

```typescript
import { GetDatasetQuery } from 'app/__generated_v2__/graphql'

const { data } = useQuery<GetDatasetQuery>(GET_DATASET)
```

**4. Restart TypeScript server:**

In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

---

## Remix Build Errors

### Server Dependencies Not Bundled

#### Problem: Module not found in production

**Symptom:**

```
Error: Cannot find module 'graphql-tag'
    at Module._resolveFilename
```

**Cause:**

ESM-only packages must be bundled for the server.

**Solution:**

Add to `remix.config.js`:

```javascript
export default {
  serverDependenciesToBundle: [
    'graphql-tag',
    'optimism',
    /@apollo\/.*/,
    // Add other ESM packages
  ],
}
```

**Common packages to bundle:**

- Apollo Client packages (`/@apollo\/.*/`)
- GraphQL utilities (`graphql-tag`, `@graphql-typed-document-node/core`)
- Material-UI (`/@mui\/.*/`)
- I18n (`remix-i18next`)

### Route Module Errors

#### Problem: Build fails with route errors

**Symptom:**

```
Error: Route "routes/datasets.$id" does not export a default component
```

**Cause:**

Remix routes must export a default component.

**Solution:**

**Export default component:**

```typescript
// app/routes/datasets.$id.tsx

// Wrong
export function DatasetPage() {
  return <div>Dataset</div>
}

// Right
export default function DatasetPage() {
  return <div>Dataset</div>
}
```

**Or use named export with re-export:**

```typescript
export function DatasetPage() {
  return <div>Dataset</div>
}

// eslint-disable-next-line import/no-default-export
export default DatasetPage
```

### CSS Import Errors

#### Problem: Cannot import CSS in routes

**Symptom:**

```
Error: You must use the `@remix-run/css-bundle` package
```

**Cause:**

CSS imports require configuration.

**Solution:**

The project uses CSS bundling automatically. Ensure imports are correct:

```typescript
// For CSS Modules
import styles from './Component.module.css'

// For regular CSS (use sparingly)
import './styles.css'
```

If using links export:

```typescript
import type { LinksFunction } from '@remix-run/node'
import styles from './styles.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
]
```

---

## Dependency Errors

### Peer Dependency Conflicts

#### Problem: Peer dependency version mismatch

**Symptom:**

```
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^17.0.0" from some-package@1.0.0
```

**Cause:**

Package requires a different React version.

**Solutions:**

**1. Check if warning only:**

pnpm often warns but continues. Try installing anyway:

```bash
pnpm install
```

**2. Update dependency:**

```bash
pnpm update some-package
```

**3. Use overrides (last resort):**

In `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "react": "^18.2.0"
    }
  }
}
```

### Conflicting Dependencies

#### Problem: Multiple versions of same package

**Symptom:**

```
Warning: Found multiple versions of 'lodash'
```

**Solution:**

**1. Check dependency tree:**

```bash
pnpm list lodash
```

**2. Deduplicate dependencies:**

```bash
pnpm dedupe
```

**3. Use overrides to force single version:**

```json
{
  "pnpm": {
    "overrides": {
      "lodash": "4.17.21"
    }
  }
}
```

### Missing Dependencies

#### Problem: Module not installed

**Symptom:**

```
Error: Cannot find module '@testing-library/react'
```

**Solutions:**

**1. Install dependencies:**

```bash
pnpm install
```

**2. Check if dev dependency:**

Dev dependencies aren't installed in production:

```bash
# Development
pnpm install

# Production (skips devDependencies)
pnpm install --prod
```

**3. Add missing dependency:**

```bash
pnpm add @testing-library/react
```

---

## Memory and Performance Issues

### Out of Memory Errors

#### Problem: Build fails with heap error

**Symptom:**

```
FATAL ERROR: Ineffective mark-compacts near heap limit
Allocation failed - JavaScript heap out of memory
```

**Solutions:**

**1. Increase Node memory:**

```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

**2. Add to package.json:**

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' pnpm build:remix"
  }
}
```

**3. Clear caches:**

```bash
pnpm clean
rm -rf node_modules/.cache
pnpm build
```

**4. Close other applications:**

Free up system memory during builds.

### Slow Build Times

#### Problem: Build takes too long

**Solutions:**

**1. Check what's slow:**

```bash
# Time each step
time pnpm build:codegen
time pnpm build:neuroglancer
time pnpm build:tcm
time pnpm build:remix
```

**2. Skip unchanged steps:**

If only changing app code:

```bash
# Skip codegen if schema unchanged
pnpm build:remix
```

**3. Use development mode:**

Development builds are faster (no minification):

```bash
pnpm dev
```

**4. Enable persistent cache:**

Remix uses cache by default. Don't delete `.cache` directory between builds.

---

## ESLint Build Errors

### Import/Export Errors

#### Problem: Default export not allowed

**Symptom:**

```
Error: Prefer named exports [import/no-default-export]
```

**Cause:**

ESLint enforces named exports:

```javascript
// typescript.cjs
rules: {
  'import/no-default-export': 'error',
}
```

**Solutions:**

**1. Use named export:**

```typescript
// Before
export default function Component() {}

// After
export function Component() {}
```

**2. Disable for specific files (Remix routes):**

```typescript
// Routes require default exports
export default function DatasetPage() {}

// eslint-disable-next-line import/no-default-export
```

**3. Or add comment at top of file:**

```typescript
/* eslint-disable import/no-default-export */
export default function Component() {}
```

### Import Sorting Errors

#### Problem: Imports in wrong order

**Symptom:**

```
Error: Expected imports to be sorted [simple-import-sort/imports]
```

**Solution:**

Auto-fix with ESLint:

```bash
pnpm lint:eslint:fix
```

Or manually sort imports:

```typescript
// Correct order:
// 1. Side effects
import 'dotenv/config'

// 2. Node built-ins
import path from 'node:path'

// 3. External packages
import { useQuery } from '@apollo/client'
import { Button } from '@mui/material'

// 4. App imports
import { Component } from 'app/components/Component'

// 5. Relative imports
import { helper } from './helper'
```

### Restricted Import Errors

#### Problem: Using disallowed import

**Symptom:**

```
Error: Prefer tailwind over MUI styled components [no-restricted-imports]
```

**Cause:**

Custom ESLint rule prevents MUI `styled`:

```javascript
'no-restricted-imports': [
  'error',
  {
    patterns: [
      {
        group: ['@mui/*'],
        importNames: ['styled'],
        message: 'Prefer tailwind over MUI styled components',
      },
    ],
  },
]
```

**Solution:**

Use Tailwind instead:

```typescript
// Before
import { styled } from '@mui/material/styles'
const StyledDiv = styled('div')({ padding: '1rem' })

// After
<div className="p-4">
```

---

## CSS Module Build Errors

### Type Generation Fails

#### Problem: CSS Module types not created

**Symptom:**

Build succeeds but no `.d.ts` files generated.

**Solution:**

**1. Run type generation:**

```bash
pnpm build:tcm
```

**2. Check file pattern:**

```bash
# Should match: app/**/*.module.css
ls app/**/*.module.css
```

**3. Verify typed-css-modules is installed:**

```bash
pnpm list typed-css-modules
```

### Invalid CSS Syntax

#### Problem: CSS Module has syntax errors

**Symptom:**

```
Error: Unclosed block at line 10
```

**Solution:**

**1. Check CSS syntax:**

```css
/* Wrong: Missing closing brace */
.container {
  padding: 1rem;

/* Right */
.container {
  padding: 1rem;
}
```

**2. Validate with Stylelint:**

```bash
pnpm lint:stylelint
```

**3. Use PostCSS nesting syntax:**

```css
/* Correct nesting */
.container {
  & .nested {
    color: red;
  }
}
```

---

## Environment Variable Errors

### Missing Environment Variables

#### Problem: Environment variables undefined

**Symptom:**

```typescript
console.log(process.env.API_URL_V2)  // undefined
```

**Solutions:**

**1. Create `.env` file:**

```bash
cp .env.example .env
```

**2. Add variable to `.env`:**

```
API_URL_V2=https://graphql.cryoetdataportal.czscience.com/graphql
```

**3. Load with dotenv:**

```typescript
import 'dotenv/config'
```

**4. Restart server:**

```bash
pnpm dev
```

**Note:** Environment variables are loaded in `server.ts` and `codegen.ts`:

```typescript
import 'dotenv/config'
```

### Environment Variables in Client Code

#### Problem: process.env is undefined in browser

**Cause:**

Server environment variables aren't automatically available in client code.

**Solution:**

**Pass via loader:**

```typescript
// app/root.tsx
export async function loader() {
  return json({
    ENV: {
      API_URL_V2: process.env.API_URL_V2,
    },
  })
}
```

**Access in components:**

```typescript
import { useLoaderData } from '@remix-run/react'

export default function Component() {
  const { ENV } = useLoaderData<typeof loader>()
  console.log(ENV.API_URL_V2)
}
```

---

## Production Build Issues

### Production Build vs Dev Mismatch

#### Problem: Works in dev, fails in production

**Symptoms:**

- Styles missing in production
- Routes not found
- Assets not loading

**Solutions:**

**1. Test production build locally:**

```bash
pnpm build
pnpm start
```

**2. Check environment variables:**

Production may have different env vars:

```bash
ENV=production API_URL_V2=https://api.prod.example.com pnpm start
```

**3. Verify static assets:**

```bash
# Check build output
ls public/build
```

**4. Check server logs:**

Look for errors when starting production server.

### Minification Errors

#### Problem: Code breaks after minification

**Symptom:**

Production build runs but JavaScript errors occur.

**Solution:**

**1. Disable minification temporarily:**

```javascript
// remix.config.js
export default {
  serverMinify: false,  // Disable to debug
}
```

**2. Check for dynamic code:**

Avoid `eval` or `Function` constructor - breaks in minified code.

**3. Test with source maps:**

Source maps help debug minified production code.

---

## Debugging Build Process

### Verbose Build Output

**Enable detailed logging:**

```bash
# Remix verbose mode
pnpm build:remix --verbose

# Node debug mode
NODE_DEBUG=* pnpm build
```

### Build Cache Issues

**Clear all caches:**

```bash
pnpm clean
rm -rf node_modules/.cache
rm -rf .cache
rm -rf build
pnpm install
pnpm build
```

### Incremental Type Checking

TypeScript incremental mode speeds up builds:

```json
{
  "compilerOptions": {
    "incremental": true
  }
}
```

Cache is stored in `.tsbuildinfo` files.

---

## CI/CD Build Issues

### Build Succeeds Locally, Fails in CI

**Common causes:**

1. **Node version mismatch:**

```yaml
# GitHub Actions
- uses: actions/setup-node@v3
  with:
    node-version: '20.10.0'  # Match .nvmrc
```

2. **pnpm version mismatch:**

```yaml
- uses: pnpm/action-setup@v2
  with:
    version: 8.10.5  # Match package.json engines
```

3. **Missing environment variables:**

```yaml
env:
  API_URL_V2: ${{ secrets.API_URL_V2 }}
```

4. **Different lockfile:**

Commit `pnpm-lock.yaml`:

```bash
git add pnpm-lock.yaml
git commit -m "Update lockfile"
```

5. **Cached dependencies:**

Clear CI cache and rebuild.

---

## Getting Help

### Creating Minimal Reproductions

When reporting build errors:

1. **Minimal code sample:**
```typescript
// Minimal example that reproduces the error
```

2. **Build command:**
```bash
pnpm build:remix
```

3. **Full error output:**
```
Error: Cannot find module...
[full stack trace]
```

4. **Environment info:**
```bash
node --version
pnpm --version
```

### Reading Error Stack Traces

**Error format:**

```
Error: Cannot find module 'missing-package'
    at Module._resolveFilename (internal/modules/cjs/loader.js:636:15)
    at Module._load (internal/modules/cjs/loader.js:562:25)
    at Module.require (internal/modules/cjs/loader.js:692:17)
    at require (internal/modules/cjs/helpers.js:25:18)
    at Object.<anonymous> (/app/routes/datasets.tsx:3:1)
                                                    ↑ Your code
```

**Focus on:**
- First line: Error message
- Last few lines: Your code that triggered the error

---

## Next Steps

- [Debugging Guide](./02-debugging-guide.md) - Dev tools and debugging techniques
- [GraphQL Debugging](./03-graphql-debugging.md) - Apollo and query issues
- [Styling Issues](./04-styling-issues.md) - CSS troubleshooting
