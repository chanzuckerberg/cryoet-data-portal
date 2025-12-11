# Component Patterns

This document describes the component organization, file structure, and naming conventions used throughout the CryoET Data Portal frontend.

**Last updated:** December 10, 2025

## Quick Reference

| Pattern           | Convention                        | Example                    |
| ----------------- | --------------------------------- | -------------------------- |
| Component files   | PascalCase, named after component | `DatasetTable.tsx`         |
| Component folders | PascalCase with index file        | `TablePageLayout/index.ts` |
| Hooks             | camelCase starting with `use`     | `useFilter.ts`             |
| Types             | PascalCase, separate files        | `types.ts`                 |
| Tests             | Same name with `.test.tsx`        | `Drawer.test.tsx`          |
| CSS Modules       | Same name with `.module.css`      | `styles.module.css`        |

---

## File Organization

### Component Directory Structure

Components are organized in [`app/components/`](../../packages/data-portal/app/components/) with a consistent structure:

```
app/components/
├── ComponentName.tsx              # Simple component (single file)
├── ComponentFolder/               # Complex component (folder)
│   ├── index.ts                  # Exports main component only (no barrel exports)
│   ├── ComponentFolder.tsx       # Main component
│   ├── ComponentFolder.test.tsx  # Jest unit tests
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts                  # Helper functions
│   └── components/               # Sub-components (if needed)
│       └── SubComponent.tsx
```

**Example:** [`TablePageLayout/`](../../packages/data-portal/app/components/TablePageLayout/)

```typescript
// index.ts - Only export the main component for simpler imports
export { TablePageLayout } from './TablePageLayout'
```

**Why no barrel exports?** The `index.ts` file should only export the component with the same name as the directory. This enables cleaner imports (`app/components/TablePageLayout` instead of `app/components/TablePageLayout/TablePageLayout`) while avoiding barrel export issues like circular dependencies and slower builds.

**Importing other modules:** Import types, utilities, and sub-components explicitly from their files:

```typescript
// Main component - via index.ts
import { TablePageLayout } from 'app/components/TablePageLayout'

// Types - explicit import (no barrel export)
import type { TablePageLayoutProps } from 'app/components/TablePageLayout/types'

// Utilities - explicit import
import { formatTableData } from 'app/components/TablePageLayout/utils'
```

---

## Component Naming Conventions

### Component Names

- **PascalCase** for all component names
- Descriptive names that indicate purpose
- Suffix with component type when helpful

```typescript
// Good
DatasetTable.tsx
MetadataDrawer.tsx
FilterPanel.tsx
BrowseDataHeader.tsx

// Avoid
dataset - table.tsx
metadata.tsx
filter.tsx
```

### Props Interfaces

Props interfaces follow the pattern `{ComponentName}Props`:

```typescript
// TablePageLayout/types.ts
export interface TablePageLayoutProps {
  header?: ReactNode
  tabs: TablePageTabProps[]
  tabsTitle?: string
  downloadModal?: ReactNode
  drawers?: ReactNode
  banner?: ReactNode
  title?: string
  titleContent?: ReactNode
}
```

**Location:** [`TablePageLayout/types.ts`](../../packages/data-portal/app/components/TablePageLayout/types.ts)

---

## Component Composition Patterns

### Container/Presentational Split

Complex features use a container/presentational pattern:

**Container** (smart component):

- Handles data fetching
- Manages state
- Contains business logic

**Presentational** (dumb component):

- Receives data via props
- Focuses on UI rendering
- No business logic

```typescript
// Container component (in routes/)
export default function BrowseDatasetsPage() {
  const { filteredDatasetsCount, totalDatasetsCount } = useDatasetsFilterData()
  const { t } = useI18n()

  return (
    <TablePageLayout
      tabs={[{
        title: t('datasets'),
        table: <DatasetTable />,
        filteredCount: filteredDatasetsCount,
      }]}
    />
  )
}

// Presentational component (in components/)
export function TablePageLayout({ tabs, header }: TablePageLayoutProps) {
  return (
    <div className="flex flex-col flex-auto">
      {header}
      <TablePageTabContent {...activeTab} />
    </div>
  )
}
```

**Location:** [`routes/browse-data.datasets.tsx`](../../packages/data-portal/app/routes/browse-data.datasets.tsx)

---

## Styling Patterns

### Tailwind-First Approach

**Primary:** Use Tailwind utility classes for styling

```typescript
<div className="flex flex-col gap-sds-xl px-sds-l">
  <h2 className="text-sds-header-xl-600-wide font-semibold">
    {title}
  </h2>
</div>
```

**Secondary:** CSS Modules for complex/repeated styles

```typescript
import styles from './Component.module.css'

<div className={styles.complexLayout}>
  <span className={styles.customElement} />
</div>
```

**ESLint enforces:** Prefer Tailwind over MUI's `styled()` API

### Design System Tokens

Use CZI SDS tokens for consistency:

```typescript
// Spacing
className = 'gap-sds-xl px-sds-l mt-sds-xxl'

// Typography
className = 'text-sds-header-xl-600-wide leading-sds-header-xl'

// Colors
className = 'text-light-sds-color-primitive-gray-500'
```

---

## Common Component Patterns

### Conditional Rendering

Use TypeScript's type narrowing with optional props:

```typescript
export function MetadataDrawer({
  MetadataTabComponent,
  MethodSummaryTabComponent,
}: MetaDataDrawerProps) {
  return (
    <div>
      {drawer.activeTab === MetadataTab.Metadata &&
        MetadataTabComponent && <MetadataTabComponent />}

      {drawer.activeTab === MetadataTab.MethodSummary &&
        MethodSummaryTabComponent && <MethodSummaryTabComponent />}
    </div>
  )
}
```

**Location:** [`MetadataDrawer.tsx`](../../packages/data-portal/app/components/MetadataDrawer.tsx)

### Compound Components

Create related components that work together:

```typescript
// Parent component
export function TablePageLayout({ tabs, header, drawers }: Props) {
  return (
    <>
      {header}
      <TablePageTabContent {...activeTab} />
      {drawers}
    </>
  )
}

// Child components used together
<TablePageLayout
  header={<BrowseDataHeader />}
  tabs={[...]}
  drawers={<MetadataDrawer />}
/>
```

### Component-Specific Hooks

Extract complex logic into custom hooks colocated with components:

```typescript
// hooks/useMetadataDrawer.ts
export function useMetadataDrawer() {
  const [queryParams, setQueryParams] = useQueryParams({
    [QueryParams.MetadataDrawer]: stringParam<MetadataDrawerId>(),
    [QueryParams.Tab]: stringParam<MetadataTab>(),
  })

  return {
    activeDrawer: queryParams[QueryParams.MetadataDrawer],
    openDrawer: (drawer: MetadataDrawerId) => {
      /* ... */
    },
    closeDrawer: () => {
      /* ... */
    },
  }
}
```

**Location:** [`hooks/useMetadataDrawer.ts`](../../packages/data-portal/app/hooks/useMetadataDrawer.ts)

---

## Import Patterns

### Import Order

Follow this order (enforced by ESLint):

1. External dependencies (React, libraries)
2. Internal dependencies (components, hooks)
3. Types
4. Assets/styles

```typescript
import { Button, Icon } from '@czi-sds/components'
import { useCallback, useMemo } from 'react'

import { Drawer } from 'app/components/Drawer'
import { useI18n } from 'app/hooks/useI18n'
import { useMetadataDrawer } from 'app/hooks/useMetadataDrawer'

import type { MetaDataDrawerProps } from './types'
```

### Named Exports (Preferred)

Use named exports over default exports:

```typescript
// Good
export function DatasetTable() {
  /* ... */
}

// Avoid (except for route components)
export default function DatasetTable() {
  /* ... */
}
```

**Rationale:** Better IDE support, easier refactoring, explicit imports

**Exception:** Route components must use default exports (Remix convention)

---

## Testing Patterns

### Test File Location

Tests are colocated with components:

```
app/components/
├── Drawer.tsx
├── Drawer.test.tsx       # Unit tests here
```

### Testing Library Usage

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<ComponentName />)
    await user.click(screen.getByRole('button'))
  })
})
```

**Location:** [`Drawer.test.tsx`](../../packages/data-portal/app/components/Drawer.test.tsx)

---

## Type Definitions

### Component Props Types

Define props in dedicated `types.ts` files for complex components:

```typescript
// types.ts
import { ReactNode } from 'react'

export interface TablePageLayoutProps {
  header?: ReactNode
  tabs: TablePageTabProps[]
  downloadModal?: ReactNode
}

export interface TablePageTabProps {
  title: string
  table: ReactNode
  filterPanel?: ReactNode
  filteredCount: number
}
```

### Shared Types Location

- Component-specific types: `components/ComponentName/types.ts`
- Shared types: `app/types/`
- Generated types: `app/__generated_v2__/`

---

## Anti-Patterns to Avoid

### Don't Use MUI styled()

```typescript
// ❌ Avoid
import { styled } from '@mui/material'
const StyledDiv = styled('div')({ /* ... */ })

// ✅ Use Tailwind instead
<div className="flex gap-4 p-2" />
```

### Don't Mix Presentation and Data Fetching

```typescript
// ❌ Avoid - mixing concerns
export function DatasetTable() {
  const { data } = useQuery(GET_DATASETS) // Data fetching in presentational component
  return <table>{data.map(...)}</table>
}

// ✅ Separate concerns
export function DatasetsPage() {
  const { datasets } = useDatasets() // Container handles data
  return <DatasetTable datasets={datasets} />
}
```

### Don't Use Barrel Exports

```typescript
// ❌ Avoid - barrel exports in index.ts
export { TablePageLayout } from './TablePageLayout'
export { TableHeaderDefinition } from './TableHeaderDefinition'
export type { TablePageLayoutProps } from './types'
export * from './utils'

// ✅ Only export the main component in index.ts
export { TablePageLayout } from './TablePageLayout'

// ✅ Import other modules explicitly
import type { TablePageLayoutProps } from 'app/components/TablePageLayout/types'
```

**Why:** Barrel exports cause circular dependency issues, slow down builds, and make it harder to trace where imports originate. The `index.ts` exists solely to simplify importing the main component.

### Don't Create Overly Deep Folder Nesting

```typescript
// ❌ Avoid
components / Feature / SubFeature / Component / SubComponent / Item.tsx

// ✅ Keep it flat
components / Feature / FeatureItem.tsx
components / Feature / components / SubComponent.tsx
```

---

## Next Steps

- [Filter System](./02-filter-system.md) - URL-driven filtering patterns
- [Table Page Layout](./03-table-page-layout.md) - Standard table page structure
- [Metadata Drawers](./04-metadata-drawers.md) - Drawer component patterns
- [Internationalization](./07-internationalization.md) - i18next patterns
