# Metadata Drawers

Metadata drawers provide a way to display detailed information about datasets, runs, annotations, and other entities without navigating away from the current page. They slide in from the right side of the screen, preserving the user's context while offering deeper exploration of selected items.

## Quick Reference

| Component             | Purpose               | Location                                                                                           |
| --------------------- | --------------------- | -------------------------------------------------------------------------------------------------- |
| `<MetadataDrawer>`    | Main drawer component | [`components/MetadataDrawer.tsx`](../../../packages/data-portal/app/components/MetadataDrawer.tsx) |
| `<Drawer>`            | Base drawer primitive | [`components/Drawer.tsx`](../../../packages/data-portal/app/components/Drawer.tsx)                 |
| `useMetadataDrawer()` | State management hook | [`hooks/useMetadataDrawer.ts`](../../../packages/data-portal/app/hooks/useMetadataDrawer.ts)       |

---

## Architecture Overview

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

Drawers use URL query parameters to manage their open/closed state. This means drawer state survives page refreshes, can be bookmarked, and supports browser back/forward navigation. When a user clicks a table row to view details, the URL updates to reflect the open drawer, making the interaction shareable.

### Key Features

- **URL-driven state**: Open/closed and active tab stored in query parameters
- **Tab navigation**: Multiple content views (Metadata, Method Summary, How to Cite)
- **Animated transitions**: Smooth slide-in/out using Material-UI's Drawer
- **Accessible**: ARIA attributes, keyboard navigation, focus trapping
- **Dismissible**: Close via button, clicking outside, or pressing Escape

---

## Basic Usage

### Opening a Drawer

Use the `useMetadataDrawer` hook to control drawer state from any component:

```typescript
const drawer = useMetadataDrawer()

<button onClick={() => drawer.openDrawer(MetadataDrawerId.Dataset)}>
  View Details
</button>
```

### Rendering a Drawer

Place `MetadataDrawer` components at the page level, typically via `TablePageLayout`'s `drawers` prop:

```typescript
<MetadataDrawer
  drawerId={MetadataDrawerId.Dataset}
  label={t('dataset')}
  title={dataset.title}
  idInfo={{ label: 'datasetId', text: String(dataset.id) }}
  MetadataTabComponent={DatasetMetadataTab}
  HowToCiteTabComponent={DatasetHowToCiteTab}
/>
```

**Example:** [`components/Dataset/DatasetMetadataDrawer.tsx`](../../../packages/data-portal/app/components/Dataset/DatasetMetadataDrawer.tsx)

---

## useMetadataDrawer Hook

The hook provides methods to open, close, and navigate drawers. State is synchronized with URL query parameters.

### API

| Method                     | Purpose                                    |
| -------------------------- | ------------------------------------------ |
| `openDrawer(id, tab?)`     | Open a specific drawer, optionally to a tab |
| `closeDrawer()`            | Close the active drawer                    |
| `toggleDrawer(id, tab?)`   | Toggle drawer open/closed                  |
| `setActiveTab(tab)`        | Switch to a different tab                  |
| `activeDrawer`             | Currently open drawer ID (or null)         |
| `activeTab`                | Currently active tab (or null)             |

### Drawer IDs

Each entity type has a dedicated drawer ID:

- `MetadataDrawerId.Annotation`
- `MetadataDrawerId.Dataset`
- `MetadataDrawerId.Deposition`
- `MetadataDrawerId.Run`
- `MetadataDrawerId.Tomogram`

### Tab IDs

Available tabs vary by drawer type:

- `MetadataTab.Metadata` - Key-value metadata display
- `MetadataTab.MethodSummary` - Methodology information
- `MetadataTab.HowToCite` - Citation information
- `MetadataTab.ObjectOverview` - Object details (annotations)

**Location:** [`hooks/useMetadataDrawer.ts`](../../../packages/data-portal/app/hooks/useMetadataDrawer.ts)

---

## MetadataDrawer Props

| Prop                        | Type            | Purpose                                      |
| --------------------------- | --------------- | -------------------------------------------- |
| `drawerId`                  | `MetadataDrawerId` | Which drawer this instance represents     |
| `label`                     | `string`        | Small label above the title (e.g., "Dataset") |
| `title`                     | `string`        | Main title displayed in header               |
| `idInfo`                    | `{ label, text }` | Optional ID display below title            |
| `MetadataTabComponent`      | `ComponentType` | Component for Metadata tab                   |
| `MethodSummaryTabComponent` | `ComponentType` | Component for Method Summary tab             |
| `HowToCiteTabComponent`     | `ComponentType` | Component for How to Cite tab                |
| `ObjectOverviewTabComponent`| `ComponentType` | Component for Object Overview tab            |
| `onClose`                   | `() => void`    | Additional callback when drawer closes       |
| `disabled`                  | `boolean`       | Prevents drawer from opening                 |

Only tabs with provided components are displayed. If you only pass `MetadataTabComponent`, the drawer shows a single-tab view without tab navigation.

**Location:** [`components/MetadataDrawer.tsx`](../../../packages/data-portal/app/components/MetadataDrawer.tsx)

---

## Tab Content Patterns

Each tab component receives no props and accesses data via context or hooks. Common patterns:

### Metadata Tab

Display structured key-value information using `MetadataSection` and `MetadataItem`:

```typescript
function DatasetMetadataTab() {
  const { dataset } = useDataset()
  return (
    <MetadataSection title="Basic Information">
      <MetadataItem label="Title" value={dataset.title} />
      <MetadataItem label="Description" value={dataset.description} />
    </MetadataSection>
  )
}
```

### How to Cite Tab

Provide copyable citation text:

```typescript
function DatasetHowToCiteTab() {
  const { dataset } = useDataset()
  return (
    <CopyBox content={dataset.citation} label="Dataset Citation" />
  )
}
```

### Method Summary Tab

Display methodology in a structured format, often using tables or lists to present acquisition and annotation methods.

---

## Integration with Table Page Layout

Drawers are typically rendered via the `drawers` prop of `TablePageLayout`:

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

Table rows trigger drawer opens via the `useMetadataDrawer` hook, while the drawer components render at the page level.

---

## Base Drawer Component

The `Drawer` component wraps Material-UI's Drawer with portal defaults:

- **Position**: Right-anchored slide-in
- **Width**: Fixed at 512px (max-width: 100% for mobile)
- **Dismissal**: Click outside, Escape key, or close button
- **Animation**: Smooth slide transition

**Location:** [`components/Drawer.tsx`](../../../packages/data-portal/app/components/Drawer.tsx)

---

## Analytics

Drawer interactions are tracked via Plausible analytics. Events are automatically logged when drawers open or close, capturing which drawer type was accessed. This helps understand which metadata views are most valuable to users.

---

## Accessibility

The drawer implementation includes:

- `role="dialog"` and `aria-modal="true"` on the drawer container
- `aria-labelledby` pointing to the title element
- Focus trapping within the open drawer
- Escape key closes the drawer
- Tab navigation through interactive elements

---

## Best Practices

**Do:**
- Keep drawers focused on a single entity type
- Use URL state for persistence (via `useMetadataDrawer`)
- Provide multiple close affordances (button, click outside, Escape)
- Include loading states for async data

**Don't:**
- Nest drawers within drawers
- Overload drawers with too much scrollable content
- Forget to handle the case where no entity is selected

---

## Top Banner Offset

When a top banner (announcements, etc.) is visible, drawers automatically adjust their top margin to avoid overlap. This is handled via the `isTopBannerVisibleAtom` Jotai atom.

## Next Steps

- [Table Page Layout](./02-table-page-layout.md) - Integrating drawers with tables
- [Component Architecture](./01-component-architecture.md) - General component structure
- [Hooks Guide](../06-cross-cutting/03-hooks-guide.md) - More about useMetadataDrawer
