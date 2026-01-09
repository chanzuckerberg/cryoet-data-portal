# Code Style

This document outlines the code style conventions, linting rules, formatting standards, and naming patterns used in the CryoET Data Portal frontend. Consistent code style improves readability, reduces merge conflicts, and helps maintain code quality across the project.


## Quick Reference

| Tool       | Purpose                       | Command              |
| ---------- | ----------------------------- | -------------------- |
| ESLint     | JavaScript/TypeScript linting | `pnpm lint:eslint`   |
| Prettier   | Code formatting               | `pnpm lint:prettier` |
| Stylelint  | CSS/SCSS linting              | `pnpm stylelint`     |
| TypeScript | Type checking                 | `pnpm type-check`    |
| Pre-commit | Run all checks                | Automatic on commit  |

---

## ESLint Configuration

ESLint enforces code quality, best practices, and consistency across JavaScript and TypeScript files.

### Base Configuration

The project extends the Airbnb style guide with TypeScript support:

```javascript
// packages/eslint-config/typescript.cjs
extends: [
  'airbnb',
  'airbnb-typescript',
  'airbnb/hooks',
  'plugin:@typescript-eslint/recommended',
  'plugin:prettier/recommended',
]
```

### Key Rules

**Named exports preferred:**

```typescript
// ✅ Good
export function calculateTotal() { ... }
export const MAX_ITEMS = 100

// ❌ Avoid
export default function() { ... }
```

Named exports are required because they:

- Enable better IDE autocompletion and refactoring
- Make imports more explicit and searchable
- Prevent naming inconsistencies across files

**Automatic import sorting:**

Imports are automatically organized by `simple-import-sort` in this order:

1. Side effect imports
2. Node.js built-ins (prefixed with `node:`)
3. Third-party packages
4. App imports (starting with `app/`)
5. Relative imports (starting with `./` or `../`)

```typescript
// Correctly sorted imports
import 'some-side-effect'
import { useEffect } from 'react'
import { apolloClient } from 'app/apollo.server'
import { LocalComponent } from './LocalComponent'
```

**No MUI styled() API:**

MUI components are the second choice after SDS (see [Styling System](../01-architecture/05-styling/01-styling-system.md)), but use Tailwind for styling instead of MUI's `styled()` API:

```typescript
// ❌ Avoid - MUI styled() API
import { styled } from '@mui/material/styles'
const StyledDiv = styled('div')({ padding: 16 })

// ✅ Good - Use Tailwind for styling
<div className="p-sds-l">...</div>

// ✅ Good - MUI component styled with Tailwind
import Tooltip from '@mui/material/Tooltip'
<Tooltip title="Help" className="text-sds-body-s">...</Tooltip>
```

**Unused imports detection:**

The `unused-imports` plugin automatically detects and can remove unused imports:

```typescript
// ❌ Error - unused import
import { useState, useEffect } from 'react' // only useState is used

// ✅ Good
import { useState } from 'react'
```

**Underscore prefix for unused variables:**

Use leading underscores for intentionally unused variables:

```typescript
// In destructuring
const { data, _error } = useQuery()

// In function parameters
function handleClick(_event: MouseEvent, index: number) {
  console.log(index)
}
```

### Custom Rules

**No root MUI imports:**

Prevents importing from `@mui/material` directly - use specific subpaths:

```typescript
// ❌ Error
import { Button } from '@mui/material'

// ✅ Good
import Button from '@mui/material/Button'
```

**Prefer lodash-es:**

Use the ES modules version of lodash for better tree-shaking:

```typescript
// ❌ Error
import _ from 'lodash'

// ✅ Good
import { debounce } from 'lodash-es'
```

### Running ESLint

```bash
# Lint all files
pnpm lint:eslint

# Auto-fix issues
pnpm lint:eslint:fix

# Run all linters (includes ESLint)
pnpm lint

# Auto-fix all linting issues
pnpm lint:fix
```

### Performance Optimization

The ESLint configuration has two modes:

**Fast mode (default):**

```bash
pnpm lint
```

**Comprehensive mode (with type checking):**

```bash
ALL=true pnpm lint
```

The comprehensive mode enables:

- `import/no-cycle` - Detects circular dependencies
- TypeScript type-checking rules (slower but more thorough)

Use comprehensive mode before committing significant changes. CI runs comprehensive checks automatically.

---

## Prettier Configuration

Prettier enforces consistent code formatting automatically.

### Settings

```yaml
# .prettierrc.yml
arrowParens: always # (x) => x instead of x => x
semi: false # No semicolons
singleQuote: true # 'hello' instead of "hello"
tabWidth: 2 # 2 spaces for indentation
trailingComma: all # Trailing commas everywhere
```

### Examples

**No semicolons:**

```typescript
// ✅ Good
const name = 'CryoET'
const age = 42

// ❌ Prettier will remove these
const name = 'CryoET'
const age = 42
```

**Single quotes:**

```typescript
// ✅ Good
const message = 'Hello world'

// ❌ Prettier will change these
const message = 'Hello world'
```

**Trailing commas:**

```typescript
// ✅ Good
const config = {
  name: 'portal',
  version: '1.0.0',
  enabled: true,
}

// ❌ Missing trailing comma
const config = {
  name: 'portal',
  version: '1.0.0',
  enabled: true,
}
```

**Arrow function parens:**

```typescript
// ✅ Good
const double = (x) => x * 2
const process = (a, b) => a + b

// ❌ Prettier will add parens
const double = (x) => x * 2
```

### Running Prettier

```bash
# Check formatting
pnpm lint:prettier

# Auto-fix formatting
pnpm lint:prettier:fix

# Format as part of all linters
pnpm lint:fix
```

**Integration:** Prettier runs automatically through ESLint via `eslint-plugin-prettier`, ensuring formatting and linting happen together.

---

## Stylelint Configuration

Stylelint enforces CSS and SCSS best practices, with special rules for CSS Modules.

### Base Configuration

```yaml
# packages/data-portal/.stylelintrc.yml
extends:
  - stylelint-config-recommended
  - stylelint-config-sass-guidelines
  - stylelint-config-css-modules
  - stylelint-config-prettier

customSyntax: postcss-scss
```

### Key Rules

**CamelCase class names:**

CSS Module classes must use camelCase:

```css
/* ✅ Good */
.containerWrapper {
  padding: 16px;
}

.buttonPrimary {
  background: blue;
}

/* ❌ Error */
.container-wrapper {
  padding: 16px;
}

.button_primary {
  background: blue;
}
```

**Rationale:** CamelCase enables dot notation access in JavaScript:

```typescript
// With camelCase
<div className={styles.containerWrapper} />

// With kebab-case (requires brackets)
<div className={styles['container-wrapper']} />
```

**Nesting depth:**

Maximum 4 levels of nesting (excluding pseudo-classes and at-rules):

```scss
// ✅ Good
.container {
  .header {
    .title {
      .icon {
        // Level 4 - OK
      }
    }
  }
}

// ✅ Pseudo-classes don't count
.button {
  &:hover {
    &:active {
      // OK - pseudo-classes ignored
    }
  }
}

// ❌ Error - too deep
.level1 {
  .level2 {
    .level3 {
      .level4 {
        .level5 {
          // Too deep!
        }
      }
    }
  }
}
```

### Running Stylelint

```bash
# Lint CSS/SCSS files
pnpm stylelint

# Auto-fix issues
pnpm lint:stylelint:fix

# Run as part of all linters
pnpm lint
```

---

## TypeScript Configuration

TypeScript is configured with **strict mode enabled** for maximum type safety.

### Strict Mode Settings

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

### Type Safety Guidelines

**Avoid `any` type:**

```typescript
// ❌ Avoid
function process(data: any) {
  return data.value
}

// ✅ Good - use proper types
interface Data {
  value: string
}

function process(data: Data) {
  return data.value
}

// ✅ Good - use unknown for truly unknown types
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as Data).value
  }
}
```

**Explicit return types for exported functions:**

```typescript
// ✅ Good
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ⚠️ Acceptable but less clear
export function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

**Proper null/undefined handling:**

```typescript
// ❌ Unsafe
function getName(user: User) {
  return user.profile.name // Error if profile is undefined
}

// ✅ Good - optional chaining
function getName(user: User) {
  return user.profile?.name ?? 'Unknown'
}
```

### Running Type Check

```bash
# Type check all packages
pnpm type-check

# Type check specific package
pnpm data-portal type-check
```

---

## Naming Conventions

### Files and Folders

**React components:** PascalCase

```
DatasetTable.tsx
TomogramViewer.tsx
MetadataPanel.tsx
```

**Utilities and hooks:** camelCase

```
formatDate.ts
useDatasets.ts
apolloClient.ts
```

**Constants:** camelCase file, UPPER_CASE exports

```
// apiConstants.ts
export const API_URL = '...'
export const MAX_RETRIES = 3
```

**Types:** PascalCase (can match component name)

```
DatasetTable.tsx
DatasetTable.types.ts  // or
DatasetTableTypes.ts
```

**Tests:** Match source file with extension

```
DatasetTable.tsx
DatasetTable.test.tsx
```

**CSS Modules:** Match component name

```
DatasetTable.tsx
DatasetTable.module.scss
```

### Variables and Functions

**Variables:** camelCase

```typescript
const datasetCount = 10
const isLoading = false
const userName = 'Alice'
```

**Functions:** camelCase, verb-first

```typescript
function fetchDatasets() {}
function calculateTotal() {}
function handleClick() {}
```

**React components:** PascalCase

```typescript
function DatasetTable() {}
function TomogramViewer() {}
```

**Constants:** UPPER_CASE

```typescript
const MAX_ITEMS = 100
const API_TIMEOUT = 5000
const DEFAULT_PAGE_SIZE = 20
```

**Boolean variables:** is/has/should prefix

```typescript
const isLoading = false
const hasError = true
const shouldRender = false
```

**Event handlers:** handle prefix

```typescript
function handleClick(event: MouseEvent) {}
function handleSubmit(data: FormData) {}
function handleChange(value: string) {}
```

### Types and Interfaces

**Interfaces:** PascalCase, no I prefix

```typescript
// ✅ Good
interface Dataset {
  id: string
  name: string
}

// ❌ Avoid I prefix
interface IDataset {
  id: string
  name: string
}
```

**Type aliases:** PascalCase

```typescript
type DatasetStatus = 'active' | 'inactive' | 'pending'
type FetchResult<T> = { data: T } | { error: Error }
```

**Enums:** PascalCase for name and members

```typescript
enum DatasetType {
  Tomogram = 'tomogram',
  Annotation = 'annotation',
  Raw = 'raw',
}
```

---

## Pre-commit Hooks

Pre-commit hooks automatically run linters and formatters before each commit.

### Configured Hooks

```yaml
# .pre-commit-config.yaml (frontend section)
- repo: local
  hooks:
    - id: pnpm-lint
      name: pnpm lint
      entry: sh -c 'cd frontend && pnpm -r lint'
      language: system
      types: [file]
      files: frontend/.*\.(cjs|js|ts|tsx|json|css|md|yml)$
```

### What Runs

On each commit to frontend files:

1. ESLint checks all modified `.ts`, `.tsx`, `.js`, `.cjs` files
2. Prettier formats all modified files
3. Stylelint checks all modified `.css`, `.scss` files
4. TypeScript type checking (in ALL mode)

**Bypass (not recommended):**

```bash
git commit --no-verify
```

Only bypass hooks when absolutely necessary (e.g., work-in-progress commits on a feature branch).

---

## IDE Configuration

### VS Code

**Recommended extensions:**

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Stylelint (`stylelint.vscode-stylelint`)
- EditorConfig (`editorconfig.editorconfig`)

**Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

---

## Next Steps

- [Pull Request Guidelines](./02-pr-guidelines.md) - How to submit quality PRs
- [Commit Conventions](./03-commit-conventions.md) - Conventional commit format
- [Release Process](./04-release-process.md) - How releases work
