# Adding New Components

This guide covers creating reusable React components in the CryoET Data Portal frontend, including file structure, naming conventions, and best practices.

## Quick Reference

| Component Type      | Location                      | Example                                    |
| ------------------- | ----------------------------- | ------------------------------------------ |
| Feature component   | `app/components/FeatureName/` | `app/components/Dataset/`                  |
| Shared UI component | `app/components/`             | `app/components/ModalSubtitle.tsx`         |
| Filter component    | `app/components/Filters/`     | `app/components/Filters/BooleanFilter.tsx` |

---

## Component File Structure

### Single-File Components

For simple, standalone components:

```
app/components/
├── ModalSubtitle.tsx
└── I18n.tsx
```

### Multi-File Components (Feature Modules)

For complex features with multiple files:

```
app/components/Dataset/
├── index.ts                    # Public exports
├── DatasetHeader.tsx           # Main component
├── DatasetMetadataDrawer.tsx   # Sub-component
├── RunsTable.tsx               # Sub-component
├── utils.ts                    # Helper functions
└── types.ts                    # TypeScript types
```

---

## Step-by-Step: Creating a Component

### 1. Choose Component Location

Determine where your component belongs:

- **Feature-specific:** `app/components/FeatureName/` (e.g., `Dataset/`, `Download/`)
- **Generic/shared:** `app/components/ComponentName.tsx`
- **Filters:** `app/components/Filters/`
- **MDX/documentation:** `app/components/MDX/`

### 2. Create the Component File

**File:** `/packages/data-portal/app/components/ModalSubtitle.tsx`

```typescript
import { ReactNode } from 'react'

export function ModalSubtitle({
  label,
  value,
}: {
  label: ReactNode
  value: ReactNode
}) {
  return (
    <p className="text-light-sds-color-semantic-base-text-secondary text-sds-body-xs-400-wide leading-sds-body-xs">
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </p>
  )
}
```

**Key patterns:**

- Use named exports (not default exports) for consistency
- Use TypeScript for type safety
- Use inline prop types or extract to interfaces
- Use Tailwind CSS classes for styling

### 3. Add Props Interface (for Complex Components)

For components with many props, define a clear interface:

```typescript
interface DataTableProps {
  data: Array<Dataset>
  onRowClick?: (id: number) => void
  loading?: boolean
  emptyState?: ReactNode
  className?: string
}

export function DataTable({
  data,
  onRowClick,
  loading = false,
  emptyState,
  className,
}: DataTableProps) {
  // Component implementation
}
```

### 4. Use Hooks for Logic

Extract complex logic into custom hooks or use built-in hooks:

```typescript
import { useI18n } from 'app/hooks/useI18n'
import { useQueryParam } from 'app/hooks/useQueryParam'
import { QueryParams } from 'app/constants/query'

export function SearchBar() {
  const { t } = useI18n()
  const [search, setSearch] = useQueryParam<string>(QueryParams.Search)

  const handleChange = (value: string) => {
    setSearch(value)
  }

  return (
    <input
      type="text"
      value={search ?? ''}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={t('searchPlaceholder')}
      className="border rounded px-4 py-2"
    />
  )
}
```

### 5. Create an Index File (for Feature Modules)

Export public components from an index file:

**File:** `/packages/data-portal/app/components/Dataset/index.ts`

```typescript
export { DatasetHeader } from './DatasetHeader'
export { DatasetMetadataDrawer } from './DatasetMetadataDrawer'
export { RunsTable } from './RunsTable'
```

This allows clean imports:

```typescript
import { DatasetHeader, RunsTable } from 'app/components/Dataset'
```

---

## Component Patterns

### Pattern 1: Presentational Component

Pure components that receive data via props:

```typescript
import { Dataset } from 'app/types/dataset'

export function DatasetCard({ dataset }: { dataset: Dataset }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{dataset.title}</h3>
      <p className="text-gray-600">{dataset.description}</p>
      <div className="mt-4 flex gap-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          {dataset.runsCount} runs
        </span>
      </div>
    </div>
  )
}
```

### Pattern 2: Container Component

Components that fetch data and manage state:

```typescript
import { useLoaderData } from '@remix-run/react'
import { useFilter } from 'app/hooks/useFilter'
import { DatasetCard } from './DatasetCard'

export function DatasetList() {
  const { datasets } = useLoaderData<typeof loader>()
  const { filterState } = useFilter()

  const filteredDatasets = datasets.filter(
    (dataset) => !filterState.search ||
    dataset.title.toLowerCase().includes(filterState.search.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredDatasets.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </div>
  )
}
```

### Pattern 3: Compound Component

Components with sub-components for flexible composition:

```typescript
// File: app/components/Modal/Modal.tsx
export function Modal({ children, open }: { children: ReactNode; open: boolean }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {children}
      </div>
    </div>
  )
}

// File: app/components/Modal/ModalHeader.tsx
export function ModalHeader({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 py-4 border-b">
      <h2 className="text-2xl font-semibold">{children}</h2>
    </div>
  )
}

// File: app/components/Modal/ModalBody.tsx
export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="px-6 py-4">{children}</div>
}

// File: app/components/Modal/index.ts
export { Modal } from './Modal'
export { ModalHeader } from './ModalHeader'
export { ModalBody } from './ModalBody'

// Usage:
import { Modal, ModalHeader, ModalBody } from 'app/components/Modal'

<Modal open={isOpen}>
  <ModalHeader>Confirm Action</ModalHeader>
  <ModalBody>Are you sure you want to continue?</ModalBody>
</Modal>
```

### Pattern 4: Component with CSS Modules

Use CSS Modules for component-specific styles that can't be achieved with Tailwind:

```typescript
import { cns } from 'app/utils/cns'
import styles from './Filters.module.css'

export function BooleanFilter({
  label,
  onChange,
  value,
  wrapped,
}: {
  label: string
  onChange(value: boolean): void
  value: boolean
  wrapped?: boolean
}) {
  return (
    <div
      className={cns(
        styles.boolean,
        !wrapped && 'whitespace-nowrap',
        wrapped && 'max-w-[185px]',
        wrapped && styles.booleanWrapped,
      )}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label>{label}</label>
    </div>
  )
}
```

**From `/packages/data-portal/app/components/Filters/BooleanFilter.tsx`:**

- Combine Tailwind and CSS Module classes with `cns()` utility
- Use CSS Modules for complex styles (animations, pseudo-elements, etc.)

---

## Component Design Principles

### 1. Single Responsibility

Each component should do one thing well:

```typescript
// Good: Focused component
export function UserAvatar({ name, imageUrl }: { name: string; imageUrl: string }) {
  return (
    <img
      src={imageUrl}
      alt={name}
      className="w-10 h-10 rounded-full"
    />
  )
}

// Avoid: Component doing too much
export function UserProfile() {
  // Fetches data, manages state, renders avatar, renders bio, handles editing...
}
```

### 2. Prop Composition

Make components flexible through props:

```typescript
export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cns(
        'rounded font-medium transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  )
}
```

### 3. Type Safety

Always provide TypeScript types:

```typescript
import { Dataset } from 'app/types/dataset'

interface DatasetListProps {
  datasets: Dataset[]
  onSelect?: (dataset: Dataset) => void
  loading?: boolean
}

export function DatasetList({
  datasets,
  onSelect,
  loading = false,
}: DatasetListProps) {
  // Implementation
}
```

### 4. Internationalization

Use the i18n hook for all user-facing text:

```typescript
import { useI18n } from 'app/hooks/useI18n'

export function EmptyState() {
  const { t } = useI18n()

  return (
    <div className="text-center py-12">
      <p className="text-gray-500">{t('noResultsFound')}</p>
      <button className="mt-4 text-blue-600">{t('clearFilters')}</button>
    </div>
  )
}
```

---

## Using Third-Party Components

### [CZI Science Design System](https://github.com/chanzuckerberg/sci-components)

Prefer SDS components for consistency:

```typescript
import { InputCheckbox, Button } from '@czi-sds/components'

export function FormField() {
  return (
    <div>
      <InputCheckbox
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        label="Accept terms"
      />
      <Button sdsType="primary" sdsStyle="rounded">
        Submit
      </Button>
    </div>
  )
}
```

### Material-UI Components

Use MUI for complex UI patterns (modals, menus, tooltips):

```typescript
import { Tooltip } from '@mui/material'

export function InfoButton() {
  return (
    <Tooltip title="More information about this feature">
      <button className="text-blue-600">Info</button>
    </Tooltip>
  )
}
```

**Note:** Style MUI components with Tailwind, not MUI's `styled()` API.

---

## Testing Components

Write tests alongside components:

**File:** `/packages/data-portal/app/components/ModalSubtitle.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { ModalSubtitle } from './ModalSubtitle'

describe('<ModalSubtitle />', () => {
  it('should render label and value', () => {
    render(<ModalSubtitle label="Name" value="John Doe" />)

    expect(screen.getByText('Name:')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should render ReactNode as value', () => {
    render(
      <ModalSubtitle
        label="Link"
        value={<a href="/test">Click here</a>}
      />
    )

    expect(screen.getByRole('link', { name: 'Click here' })).toBeInTheDocument()
  })
})
```

See [Testing Guide](./06-testing-guide.md) for comprehensive testing patterns.

---

## Common Mistakes to Avoid

1. **Default exports:** Use named exports for better discoverability
2. **Inline styles:** Use Tailwind classes or CSS Modules instead
3. **Hardcoded text:** Always use i18n for user-facing strings
4. **Missing types:** Provide TypeScript interfaces for all props
5. **Large components:** Break down components that exceed ~200 lines
6. **Ignoring accessibility:** Add ARIA labels and semantic HTML

---

## Next Steps

- [Styling System](../01-architecture/05-styling/01-styling-system.md) - Learn when to use Tailwind vs CSS Modules vs MUI
- [Testing Guide](./06-testing-guide.md) - Write unit tests for your components
- [GraphQL Queries](./03-graphql-queries.md) - Fetch data for your components
