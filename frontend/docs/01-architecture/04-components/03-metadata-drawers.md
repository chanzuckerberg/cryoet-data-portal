# Metadata Drawers

This document describes the drawer pattern used for displaying detailed metadata throughout the CryoET Data Portal.


## Quick Reference

| Component             | Purpose               | Location                                                                                        |
| --------------------- | --------------------- | ----------------------------------------------------------------------------------------------- |
| `<MetadataDrawer>`    | Main drawer component | [`components/MetadataDrawer.tsx`](../../../packages/data-portal/app/components/MetadataDrawer.tsx) |
| `<Drawer>`            | Base drawer primitive | [`components/Drawer.tsx`](../../../packages/data-portal/app/components/Drawer.tsx)                 |
| `useMetadataDrawer()` | State management hook | [`hooks/useMetadataDrawer.ts`](../../../packages/data-portal/app/hooks/useMetadataDrawer.ts)       |

---

## Architecture Overview

Drawers are sliding panels that display detailed information without navigating away from the current page:

```
┌──────────────────────┬────────────┐
│                      │  Drawer    │
│   Main Content       │  Header    │
│                      │            │
│                      │  Tabs      │
│                      ├────────────┤
│                      │  Tab       │
│                      │  Content   │
│                      │            │
└──────────────────────┴────────────┘
```

### Key Features

- **URL-driven state** - Drawer open/closed state in query parameters
- **Tab navigation** - Multiple content views within drawer
- **Dismissible** - Click outside or close button to dismiss
- **Animated** - Smooth slide-in/out transitions
- **Accessible** - Proper ARIA attributes and keyboard navigation

---

## Basic Usage

### Opening a Drawer

```typescript
import { useMetadataDrawer, MetadataDrawerId } from 'app/hooks/useMetadataDrawer'

function DatasetRow({ dataset }: Props) {
  const drawer = useMetadataDrawer()

  return (
    <button
      onClick={() => drawer.openDrawer(MetadataDrawerId.Dataset)}
    >
      View Details
    </button>
  )
}
```

### Rendering a Drawer

```typescript
<MetadataDrawer
  drawerId={MetadataDrawerId.Dataset}
  label={t('dataset')}
  title={dataset.title}
  idInfo={{
    label: 'datasetId',
    text: String(dataset.id),
  }}
  MetadataTabComponent={DatasetMetadataTab}
  HowToCiteTabComponent={DatasetHowToCiteTab}
/>
```

**Location:** [`components/Dataset/DatasetMetadataDrawer.tsx`](../../../packages/data-portal/app/components/Dataset/DatasetMetadataDrawer.tsx)

---

## useMetadataDrawer Hook

### State Management

The hook manages drawer state via URL query parameters:

```typescript
export function useMetadataDrawer() {
  const [queryParams, setQueryParams] = useQueryParams({
    [QueryParams.MetadataDrawer]: stringParam<MetadataDrawerId>(),
    [QueryParams.Tab]: stringParam<MetadataTab>(),
  })

  return {
    activeDrawer: queryParams[QueryParams.MetadataDrawer],
    activeTab: queryParams[QueryParams.Tab],
    openDrawer: (drawer: MetadataDrawerId, tab?: MetadataTab) => {
      /* ... */
    },
    closeDrawer: () => {
      /* ... */
    },
    toggleDrawer: (drawer: MetadataDrawerId, tab?: MetadataTab) => {
      /* ... */
    },
    setActiveTab: (tab: MetadataTab) => {
      /* ... */
    },
  }
}
```

**Location:** [`hooks/useMetadataDrawer.ts`](../../../packages/data-portal/app/hooks/useMetadataDrawer.ts)

### Drawer IDs

```typescript
export enum MetadataDrawerId {
  Annotation = 'annotation',
  Dataset = 'dataset',
  Deposition = 'deposition',
  Run = 'run',
  Tomogram = 'tomogram',
}
```

### Tab IDs

```typescript
export enum MetadataTab {
  HowToCite = 'howToCite',
  Metadata = 'metadata',
  MethodSummary = 'methodSummary',
  ObjectOverview = 'objectOverview',
}
```

### API Methods

| Method                   | Purpose                   | Example                                       |
| ------------------------ | ------------------------- | --------------------------------------------- |
| `openDrawer(id, tab?)`   | Open specific drawer      | `drawer.openDrawer(MetadataDrawerId.Dataset)` |
| `closeDrawer()`          | Close active drawer       | `drawer.closeDrawer()`                        |
| `toggleDrawer(id, tab?)` | Toggle drawer open/closed | `drawer.toggleDrawer(MetadataDrawerId.Run)`   |
| `setActiveTab(tab)`      | Switch to different tab   | `drawer.setActiveTab(MetadataTab.HowToCite)`  |

---

## MetadataDrawer Component

### Props Interface

```typescript
interface MetaDataDrawerProps {
  // Identification
  drawerId: MetadataDrawerId
  label: string
  title: string

  // Optional ID display
  idInfo?: {
    label: I18nKeys
    text: string
  }

  // Tab components (optional, only include what you need)
  MetadataTabComponent?: ComponentType
  ObjectOverviewTabComponent?: ComponentType
  MethodSummaryTabComponent?: ComponentType
  HowToCiteTabComponent?: ComponentType

  // Callbacks
  onClose?(): void

  // State
  disabled?: boolean
}
```

### Component Structure

```typescript
export function MetadataDrawer({
  drawerId,
  label,
  title,
  idInfo,
  MetadataTabComponent,
  MethodSummaryTabComponent,
  HowToCiteTabComponent,
  onClose,
  disabled,
}: MetaDataDrawerProps) {
  const drawer = useMetadataDrawer()
  const isOpen = drawer.activeDrawer === drawerId && !disabled

  return (
    <Drawer open={isOpen} onClose={drawer.closeDrawer}>
      <div className="flex flex-col flex-auto">
        {/* Header */}
        <header className="flex items-start justify-between px-sds-xl pt-sds-xl pb-sds-xxl">
          <div className="flex flex-col">
            <p className="text-xs uppercase font-semibold mb-sds-s">
              {label}
            </p>
            <p className="text-sds-header-xl-600-wide font-semibold">
              {title}
            </p>
            {idInfo && (
              <p className="text-light-sds-color-semantic-base-text-secondary">
                <span className="font-semibold">{t(idInfo.label)}:</span>
                <span>{idInfo.text}</span>
              </p>
            )}
          </div>
          <Button onClick={drawer.closeDrawer} sdsStyle="icon" />
        </header>

        {/* Tab Navigation */}
        <div className="px-sds-xl border-b-2">
          <Tabs
            tabs={tabs}
            value={drawer.activeTab ?? MetadataTab.Metadata}
            onChange={(value) => drawer.setActiveTab(value)}
          />
        </div>

        {/* Tab Content */}
        <div className="flex flex-col flex-auto px-sds-xl pt-sds-xl pb-sds-xxl">
          {drawer.activeTab === MetadataTab.Metadata &&
            MetadataTabComponent && <MetadataTabComponent />}
          {drawer.activeTab === MetadataTab.MethodSummary &&
            MethodSummaryTabComponent && <MethodSummaryTabComponent />}
          {drawer.activeTab === MetadataTab.HowToCite &&
            HowToCiteTabComponent && <HowToCiteTabComponent />}
        </div>
      </div>
    </Drawer>
  )
}
```

**Location:** [`components/MetadataDrawer.tsx`](../../../packages/data-portal/app/components/MetadataDrawer.tsx)

---

## Base Drawer Component

### Drawer Props

```typescript
interface DrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}
```

### Implementation

```typescript
export function Drawer({ open, onClose, children, className }: DrawerProps) {
  return (
    <MuiDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: cns(
          'w-[512px] max-w-full',
          className,
        ),
      }}
    >
      {children}
    </MuiDrawer>
  )
}
```

**Features:**

- Right-anchored slide-in
- Fixed width (512px)
- Click-outside to close
- Escape key to close
- Backdrop overlay

**Location:** [`components/Drawer.tsx`](../../../packages/data-portal/app/components/Drawer.tsx)

---

## Tab Content Patterns

### Metadata Tab

Display key-value metadata in a structured format:

```typescript
function DatasetMetadataTab() {
  const { dataset } = useDataset()

  return (
    <div className="divide-y divide-light-sds-color-primitive-gray-300">
      <MetadataSection title="Basic Information">
        <MetadataItem label="Title" value={dataset.title} />
        <MetadataItem label="Description" value={dataset.description} />
      </MetadataSection>

      <MetadataSection title="Authors">
        {dataset.authors.map((author) => (
          <AuthorLink key={author.id} author={author} />
        ))}
      </MetadataSection>
    </div>
  )
}
```

### Method Summary Tab

Display methodology information:

```typescript
function DepositionMethodSummaryTab() {
  return (
    <div className="flex flex-col gap-sds-xl">
      <MethodSummaryTable
        title="Acquisition Methods"
        methods={acquisitionMethods}
      />
      <MethodSummaryTable
        title="Annotation Methods"
        methods={annotationMethods}
      />
    </div>
  )
}
```

### How To Cite Tab

Provide citation information:

```typescript
function DatasetHowToCiteTab() {
  const { dataset } = useDataset()

  return (
    <div className="flex flex-col gap-sds-l">
      <div>
        <h3 className="font-semibold mb-sds-s">Dataset Citation</h3>
        <CopyBox content={dataset.citation} />
      </div>

      <div>
        <h3 className="font-semibold mb-sds-s">Portal Citation</h3>
        <CopyBox content={PORTAL_CITATION} />
      </div>
    </div>
  )
}
```

---

## Integration Patterns

### With Table Page Layout

```typescript
<TablePageLayout
  tabs={[...]}
  drawers={
    <>
      <MetadataDrawer
        drawerId={MetadataDrawerId.Dataset}
        label={t('dataset')}
        title={selectedDataset?.title ?? ''}
        MetadataTabComponent={DatasetMetadataTab}
        HowToCiteTabComponent={DatasetHowToCiteTab}
      />
      <MetadataDrawer
        drawerId={MetadataDrawerId.Run}
        label={t('run')}
        title={selectedRun?.name ?? ''}
        MetadataTabComponent={RunMetadataTab}
      />
    </>
  }
/>
```

### With Table Rows

Open drawer when clicking on a table row:

```typescript
function DatasetTableRow({ dataset }: Props) {
  const drawer = useMetadataDrawer()

  return (
    <TableRow
      onClick={() => {
        drawer.openDrawer(MetadataDrawerId.Dataset)
        // Store selected dataset ID in state/context for drawer to access
      }}
      className="cursor-pointer hover:bg-gray-50"
    >
      <TableCell>{dataset.title}</TableCell>
      <TableCell>{dataset.id}</TableCell>
    </TableRow>
  )
}
```

---

## Analytics Integration

### Tracking Drawer Events

Drawer open/close events are automatically tracked:

```typescript
const plausible = usePlausible()

useEffect(() => {
  if (typeof prevIsOpen === 'boolean' && prevIsOpen !== isOpen) {
    plausible(Events.ToggleMetadataDrawer, {
      type: drawerId,
      open: isOpen,
    })
  }
}, [drawerId, isOpen, plausible, prevIsOpen])
```

This tracks:

- Which drawers are opened
- How often each drawer type is used
- Time spent viewing drawer content

---

## Styling Patterns

### Header Section

```typescript
<header className="flex items-start justify-between px-sds-xl pt-sds-xl pb-sds-xxl">
  <div className="flex flex-col">
    <p className="text-xs text-light-sds-color-semantic-base-text-secondary font-semibold uppercase mb-sds-s">
      {label}
    </p>
    <p className="text-sds-header-xl-600-wide max-w-[390px] truncate font-semibold">
      {title}
    </p>
  </div>
  <Button onClick={closeDrawer} sdsStyle="icon" />
</header>
```

### Tab Navigation

```typescript
<div className="px-sds-xl border-b-2 border-light-sds-color-primitive-gray-200">
  <Tabs
    className="!m-0"
    tabs={tabs}
    value={activeTab}
    onChange={setActiveTab}
  />
</div>
```

### Content Section

```typescript
<div
  className={cns(
    'flex flex-col flex-auto',
    'px-sds-xl pt-sds-xl pb-sds-xxl',
    activeTab === MetadataTab.Metadata &&
      'divide-y divide-light-sds-color-primitive-gray-300',
  )}
>
  {/* Tab content */}
</div>
```

---

## Accessibility

### ARIA Attributes

```typescript
<Drawer
  role="dialog"
  aria-labelledby="drawer-title"
  aria-modal="true"
>
  <h2 id="drawer-title">{title}</h2>
</Drawer>
```

### Keyboard Navigation

- **Escape** - Close drawer
- **Tab** - Navigate through interactive elements
- **Shift+Tab** - Reverse tab navigation

### Focus Management

```typescript
// Focus trap keeps focus within drawer when open
<Drawer open={isOpen}>
  <FocusTrap active={isOpen}>
    {children}
  </FocusTrap>
</Drawer>
```

---

## Advanced Patterns

### Conditional Tabs

Only show tabs that have content:

```typescript
const tabs = useMemo<TabData<MetadataTab>[]>(
  () => [
    ...(MetadataTabComponent
      ? [{ label: t('metadata'), value: MetadataTab.Metadata }]
      : []),
    ...(MethodSummaryTabComponent
      ? [{ label: t('methodSummary'), value: MetadataTab.MethodSummary }]
      : []),
    ...(HowToCiteTabComponent
      ? [{ label: t('howToCite'), value: MetadataTab.HowToCite }]
      : []),
  ],
  [MetadataTabComponent, MethodSummaryTabComponent, HowToCiteTabComponent, t],
)
```

### Top Banner Offset

Account for top banner when positioning drawer:

```typescript
const isTopBannerVisible = useAtomValue(isTopBannerVisibleAtom)

<div
  className={cns(
    'flex flex-col flex-auto',
    isTopBannerVisible ? 'mt-10' : 'mt-0',
  )}
>
  {/* Drawer content */}
</div>
```

### Disabled State

Prevent drawer from opening in certain conditions:

```typescript
<MetadataDrawer
  drawerId={MetadataDrawerId.Dataset}
  disabled={!selectedDataset} // Disabled when no selection
  {...props}
/>
```

---

## Best Practices

### Do's

✅ **Keep drawers focused**

```typescript
// Good - single purpose
<MetadataDrawer title="Dataset Details" />

// Avoid - mixing unrelated content
<MetadataDrawer title="Dataset + Run + Annotation" />
```

✅ **Use URL state for persistence**

```typescript
// Drawer state survives page refresh
const drawer = useMetadataDrawer()
```

✅ **Provide clear close affordances**

```typescript
// Multiple ways to close
<Button onClick={closeDrawer} />  // Close button
<Drawer onClose={closeDrawer} />   // Click outside
// + Escape key (handled by MUI)
```

### Don'ts

❌ **Don't nest drawers**

```typescript
// Avoid - confusing UX
<Drawer>
  <Drawer> {/* Nested drawer */}
  </Drawer>
</Drawer>
```

❌ **Don't forget loading states**

```typescript
// Include loading states
{isLoading ? <Skeleton /> : <MetadataContent />}
```

❌ **Don't overload with content**

```typescript
// Keep content scannable, use tabs for organization
// Avoid very long scrolling sections
```

## Next Steps

- [Table Page Layout](./02-table-page-layout.md) - Integrating drawers with tables
- [Component Architecture](./01-component-architecture.md) - General component structure
- [Hooks Guide](../06-cross-cutting/03-hooks-guide.md) - More about useMetadataDrawer
