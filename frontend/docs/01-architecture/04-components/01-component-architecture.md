# Component Architecture

This document covers component organization, directory structure, naming conventions, and architectural patterns used throughout the CryoET Data Portal frontend.

## Quick Reference

| Pattern           | Convention                        | Example                    |
| ----------------- | --------------------------------- | -------------------------- |
| Component files   | PascalCase, named after component | `DatasetTable.tsx`         |
| Component folders | PascalCase with index file        | `TablePageLayout/index.ts` |
| Hooks             | camelCase starting with `use`     | `useFilter.ts`             |
| Types             | PascalCase, separate files        | `types.ts`                 |
| Tests             | Same name with `.test.tsx`        | `Drawer.test.tsx`          |
| CSS Modules       | Same name with `.module.css`      | `styles.module.css`        |

### Key Components by Category

| Category | Key Components | Location |
|----------|---------------|----------|
| Browse Pages | `TablePageLayout`, `DatasetFilter`, `BrowseDataSearch` | [`components/TablePageLayout/`](../../../packages/data-portal/app/components/TablePageLayout/), [`components/DatasetFilter/`](../../../packages/data-portal/app/components/DatasetFilter/) |
| Detail Pages | `DatasetHeader`, `DepositionHeader`, `RunHeader` | [`components/Dataset/`](../../../packages/data-portal/app/components/Dataset/), [`components/Deposition/`](../../../packages/data-portal/app/components/Deposition/), [`components/Run/`](../../../packages/data-portal/app/components/Run/) |
| Drawers | `MetadataDrawer`, `AnnotationDrawer`, `TomogramMetadataDrawer` | [`components/MetadataDrawer/`](../../../packages/data-portal/app/components/MetadataDrawer/) |
| 3D Viewer | `ViewerPage`, Neuroglancer integration | [`components/Viewer/`](../../../packages/data-portal/app/components/Viewer/) |
| Filters | `SelectFilter`, `MultiInputFilter`, `BooleanFilter` | [`components/Filters/`](../../../packages/data-portal/app/components/Filters/) |

---

## Directory Structure

Components are organized by feature area in [`app/components/`](../../../packages/data-portal/app/components/):

```
app/components/
├── BrowseData/           # Dataset/deposition browse tables
├── DatasetFilter/        # Dataset filter panel
├── DepositionsFilters/   # Deposition filter panel
├── TablePageLayout/      # Standard browse page layout
├── MetadataDrawer/       # Side drawer for entity details
├── Download/             # Download modal and flows
├── Layout/               # App shell, header, footer
├── Dataset/              # Dataset detail page components
├── Deposition/           # Deposition detail page components (38 files)
├── Run/                  # Run detail page components
├── Viewer/               # 3D tomogram viewer
├── Filters/              # Base filter components (32 files)
├── Table/                # Core table library
├── Index/                # Landing page components
├── icons/                # Custom SVG icon components (19 files)
├── common/               # Shared utilities
├── MDX/                  # Markdown content rendering
└── MLChallenge/          # ML competition section (14 files)
```

### Component Folder Structure

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

**Example:** [`TablePageLayout/`](../../../packages/data-portal/app/components/TablePageLayout/)

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

## Naming Conventions

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

**Location:** [`TablePageLayout/types.ts`](../../../packages/data-portal/app/components/TablePageLayout/types.ts)

---

## Component Catalog

### Key Layout Components

#### TablePageLayout

The standard layout for browse and detail pages with filtering and tabbed content.

**Location:** [`components/TablePageLayout/`](../../../packages/data-portal/app/components/TablePageLayout/)

**Usage:**
```tsx
<TablePageLayout
  header={<DatasetHeader />}
  tabs={[
    {
      title: t('annotations'),
      filterPanel: <AnnotationFilter />,
      table: <RunAnnotationTable />,
      filteredCount: 42,
      totalCount: 100,
    },
    {
      title: t('tomograms'),
      table: <RunTomogramsTable />,
    },
  ]}
  drawers={
    <>
      <RunMetadataDrawer />
      <AnnotationDrawer />
    </>
  }
/>
```

**Provides:**
- Consistent page structure across browse/detail pages
- Filter panel + table layout
- Tab navigation for multiple data types
- Drawer management for metadata views

#### MetadataDrawer

Slide-out drawer showing detailed metadata for entities.

**Location:** [`components/MetadataDrawer/`](../../../packages/data-portal/app/components/MetadataDrawer/)

**Pattern:**
- State managed via URL parameters (`?metadata=dataset`)
- Supports multiple drawer types per page
- Consistent header/body/footer structure

### Detail Page Components

Entity detail pages follow a consistent component pattern with header, overview, tables, and drawers.

#### Dataset Components

**Location:** [`components/Dataset/`](../../../packages/data-portal/app/components/Dataset/)

| Component | Purpose |
|-----------|---------|
| [`DatasetHeader.tsx`](../../../packages/data-portal/app/components/Dataset/DatasetHeader.tsx) | Page header with download/cite actions |
| [`DatasetOverview.tsx`](../../../packages/data-portal/app/components/Dataset/DatasetOverview.tsx) | Summary metadata display |
| `DatasetMetadataTable.tsx` | Detailed metadata table |
| [`DatasetMetadataDrawer.tsx`](../../../packages/data-portal/app/components/Dataset/DatasetMetadataDrawer.tsx) | Side drawer for extended info |
| `RunsTable.tsx` | Table of runs in this dataset |

#### Deposition Components

**Location:** [`components/Deposition/`](../../../packages/data-portal/app/components/Deposition/)

The most complex component directory (38 files) due to the rich data relationships.

| Component | Purpose |
|-----------|---------|
| [`DepositionHeader.tsx`](../../../packages/data-portal/app/components/Deposition/DepositionHeader.tsx) | Header with tabs navigation |
| `DepositionOverview.tsx` | Deposition summary |
| `DatasetsTable.tsx` | Datasets within deposition |
| [`DepositionMetadataDrawer/`](../../../packages/data-portal/app/components/Deposition/DepositionMetadataDrawer/) | Complex metadata presentation (13 files) |
| [`MethodLinks/`](../../../packages/data-portal/app/components/Deposition/MethodLinks/), [`MethodSummary/`](../../../packages/data-portal/app/components/Deposition/MethodSummary/) | Method relationship display |
| [`RunRow/`](../../../packages/data-portal/app/components/Deposition/RunRow/), `TomogramRow.tsx` | Row components for nested tables |

#### Run Components

**Location:** [`components/Run/`](../../../packages/data-portal/app/components/Run/)

| Component | Purpose |
|-----------|---------|
| [`RunHeader.tsx`](../../../packages/data-portal/app/components/Run/RunHeader.tsx) | Run header with tomogram info |
| [`RunAnnotationTable.tsx`](../../../packages/data-portal/app/components/Run/RunAnnotationTable.tsx) | Annotations for this run |
| [`RunTomogramsTable.tsx`](../../../packages/data-portal/app/components/Run/RunTomogramsTable.tsx) | Available tomograms |
| [`TomogramMetadataDrawer.tsx`](../../../packages/data-portal/app/components/Run/TomogramMetadataDrawer.tsx) | Tomogram detail drawer |
| [`AnnotationDrawer.tsx`](../../../packages/data-portal/app/components/Run/AnnotationDrawer.tsx) | Annotation detail drawer |

### 3D Viewer

**Location:** [`components/Viewer/`](../../../packages/data-portal/app/components/Viewer/)

Neuroglancer-based 3D visualization for tomograms and annotations.

| File | Purpose |
|------|---------|
| [`ViewerPage.tsx`](../../../packages/data-portal/app/components/Viewer/ViewerPage.tsx) | Main viewer component |
| [`state.ts`](../../../packages/data-portal/app/components/Viewer/state.ts) | Complex state management |
| [`Tour.tsx`](../../../packages/data-portal/app/components/Viewer/Tour.tsx) | Interactive feature walkthrough |
| [`NeuroglancerDropdown.tsx`](../../../packages/data-portal/app/components/Viewer/NeuroglancerDropdown.tsx) | Viewer options menu |

**Key patterns:**
- Uses `neuroglancer` npm package via iframe
- State modifiers for toggling layers, panels, axis lines
- Tour system teaches users viewer features
- Lazy-loaded for performance (see [Route Patterns](../01-routing/02-route-patterns.md#pattern-6-lazy-loaded-viewer))

### Filter Architecture

Filters follow a two-layer pattern for reusability.

#### Layer 1: Base Filter Components

**Location:** [`components/Filters/`](../../../packages/data-portal/app/components/Filters/) (32 files)

Reusable filter primitives:

| Component | Purpose |
|-----------|---------|
| [`SelectFilter.tsx`](../../../packages/data-portal/app/components/Filters/SelectFilter.tsx) | Type-safe multi-select dropdown |
| [`MultiInputFilter.tsx`](../../../packages/data-portal/app/components/Filters/MultiInputFilter.tsx) | Multiple text inputs |
| [`InputFilter.tsx`](../../../packages/data-portal/app/components/Filters/InputFilter.tsx) | Single text input |
| [`BooleanFilter.tsx`](../../../packages/data-portal/app/components/Filters/BooleanFilter.tsx) | True/false toggle |
| [`FilterPanel.tsx`](../../../packages/data-portal/app/components/Filters/FilterPanel.tsx) | Filter container layout |
| [`FilterSection.tsx`](../../../packages/data-portal/app/components/Filters/FilterSection.tsx) | Collapsible filter group |

#### Layer 2: Domain Filter Composition

Domain-specific filters compose base components:

| Directory | Page |
|-----------|------|
| [`DatasetFilter/`](../../../packages/data-portal/app/components/DatasetFilter/) | `/browse-data/datasets` |
| `DepositionFilter/` | `/depositions/:id` |
| `DepositionsFilters/` | `/browse-data/depositions` |
| `RunFilter/` | `/runs/:id` |
| [`AnnotationFilter/`](../../../packages/data-portal/app/components/AnnotationFilter/) | Annotation sections |

See [Filter System](../02-data/03-filter-system.md) for implementation details.

### ML Challenge Components

**Location:** [`components/MLChallenge/`](../../../packages/data-portal/app/components/MLChallenge/) (14 files)

Feature-flag-driven dual-view architecture for the ML competition.

**Route:** [`app/routes/competition.tsx`](../../../packages/data-portal/app/routes/competition.tsx)

```tsx
// Feature flag determines which view to render
const showPostMlChallenge = useFeatureFlag('postMlChallenge')
return showPostMlChallenge ? <CompletedMLChallenge /> : <MLChallenge />
```

**Component structure:**

```
MLChallenge/
├── MLChallenge.tsx                # Active competition layout
├── MLChallengeHeader.tsx          # Blue header with challenge info
├── MLChallengeNavigation.tsx      # Sticky sidebar navigation
├── MainContent.tsx                # MDX-rendered sections
├── CompletedMLChallenge/          # Post-competition view
│   ├── CompletedMLChallenge.tsx   # Main completed layout
│   ├── constants.ts               # Hardcoded team scores/leaderboard
│   └── components/
│       ├── TopThreeWinners/       # Winner cards with images
│       ├── OtherWinners/          # Carousel for places 4-10
│       └── WinnerCard/            # Reusable winner display
├── MdxComponents/                 # Custom MDX components
│   ├── MdxPrizeTable.tsx
│   ├── MdxSeeLeaderboard.tsx
│   └── MdxToggleShowMore.tsx
└── MdxContent/                    # MDX content files
    ├── AboutTheCompetition.mdx
    ├── HowToParticipate.mdx
    └── Glossary.mdx
```

**Key files:** [`MLChallenge.tsx`](../../../packages/data-portal/app/components/MLChallenge/MLChallenge.tsx), [`MLChallengeHeader.tsx`](../../../packages/data-portal/app/components/MLChallenge/MLChallengeHeader.tsx), [`constants.ts`](../../../packages/data-portal/app/components/MLChallenge/constants.ts)

### Utility Components

| Directory | Purpose |
|-----------|---------|
| [`Table/`](../../../packages/data-portal/app/components/Table/) | Core table library (Table, PageTable, MetadataTable) |
| [`Layout/`](../../../packages/data-portal/app/components/Layout/) | App shell, navigation, footer |
| [`Index/`](../../../packages/data-portal/app/components/Index/) | Landing page components |
| [`icons/`](../../../packages/data-portal/app/components/icons/) | Custom SVG icon components (19 files) |
| [`common/`](../../../packages/data-portal/app/components/common/) | Shared utilities (CollapsibleDescription, ReusableSnackbar) |
| [`MDX/`](../../../packages/data-portal/app/components/MDX/) | Markdown content rendering |

---

## Composition Patterns

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

**Location:** [`routes/browse-data.datasets.tsx`](../../../packages/data-portal/app/routes/browse-data.datasets.tsx)

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

**Location:** [`MetadataDrawer.tsx`](../../../packages/data-portal/app/components/MetadataDrawer.tsx)

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

**Location:** [`hooks/useMetadataDrawer.ts`](../../../packages/data-portal/app/hooks/useMetadataDrawer.ts)

---

## Styling Conventions

### Styling Hierarchy

Follow this order: **SDS → MUI → Tailwind → CSS Modules**

**1. SDS Components (Primary):** Check SDS first for UI components

```typescript
import { Button, Icon } from '@czi-sds/components'

<Button sdsStyle="rounded" sdsType="primary">Submit</Button>
<Icon sdsIcon="Download" sdsSize="l" sdsType="button" />
```

**2. MUI (Secondary):** When SDS doesn't have the component

```typescript
import Tooltip from '@mui/material/Tooltip'
import Collapse from '@mui/material/Collapse'

<Tooltip title="Help text">...</Tooltip>
```

**3. Tailwind (Customization):** For layout and custom styling

```typescript
<div className="flex flex-col gap-sds-xl px-sds-l">
  <h2 className="text-sds-header-xl-600-wide font-semibold">
    {title}
  </h2>
</div>
```

**4. CSS Modules (Complex):** For styles Tailwind can't handle

```typescript
import styles from './Component.module.css'

<div className={styles.complexAnimation}>
  <span className={styles.customPseudoElement} />
</div>
```

**ESLint enforces:** Prefer Tailwind over MUI's `styled()` API

### Design System Tokens

Use [CZI SDS](https://github.com/chanzuckerberg/sci-components) tokens for consistency:

```typescript
// Spacing
className = 'gap-sds-xl px-sds-l mt-sds-xxl'

// Typography
className = 'text-sds-header-xl-600-wide leading-sds-header-xl'

// Colors
className = 'text-light-sds-color-primitive-gray-500'
```

---

## Data Flow

How a typical request flows through the component system:

```
1. User visits /browse-data/datasets?organism=human
       ↓
2. Route loader (browse-data.datasets.tsx) runs server-side
       ↓
3. Loader parses URL params using QueryParams enum
       ↓
4. getDatasetsFilter() converts params to GraphQL where clause
       ↓
5. Apollo Client executes GraphQL query
       ↓
6. Component renders with data from useTypedLoaderData()
       ↓
7. User changes filter → useFilter().updateValue() updates URL
       ↓
8. Remix reloads the route with new params
```

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

**Location:** [`Drawer.test.tsx`](../../../packages/data-portal/app/components/Drawer.test.tsx)

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

- [Table Page Layout](./02-table-page-layout.md) - Standard table page structure
- [Metadata Drawers](./03-metadata-drawers.md) - Drawer component patterns
- [Filter System](../02-data/03-filter-system.md) - URL-driven filtering patterns
- [Route Patterns](../01-routing/02-route-patterns.md) - Page-level patterns
- [Adding New Components](../../03-development/02-adding-new-components.md) - Step-by-step component creation
