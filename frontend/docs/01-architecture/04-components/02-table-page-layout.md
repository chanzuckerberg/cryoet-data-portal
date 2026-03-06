# Table Page Layout

The `TablePageLayout` component provides a consistent structure for browse pages throughout the portal. It solves the common need for pages that display filterable, tabbed data tables with associated metadata drawers and download functionality.

## Quick Reference

| Concept       | Component                 | Location                                                                                         |
| ------------- | ------------------------- | ------------------------------------------------------------------------------------------------ |
| Main Layout   | `<TablePageLayout>`       | [`components/TablePageLayout/`](../../../packages/data-portal/app/components/TablePageLayout/)   |
| Tab Content   | `<TablePageTabContent>`   | [`components/TablePageLayout/components/`](../../../packages/data-portal/app/components/TablePageLayout/components/) |
| Header        | `<TableHeaderDefinition>` | [`components/TablePageLayout/TableHeaderDefinition.tsx`](../../../packages/data-portal/app/components/TablePageLayout/TableHeaderDefinition.tsx) |
| Count Display | `<TableCount>`            | [`components/TablePageLayout/TableCount.tsx`](../../../packages/data-portal/app/components/TablePageLayout/TableCount.tsx) |

---

## Architecture Overview

The layout follows a consistent visual hierarchy used across datasets, depositions, and runs pages:

```
┌─────────────────────────────────────┐
│           Header                    │
├─────────────────────────────────────┤
│   Tabs (if multiple)                │
├─────────────────────────────────────┤
│ ┌─────────────┬─────────────────────┤
│ │   Filter    │    Table            │
│ │   Panel     │    Content          │
│ │             │                     │
│ └─────────────┴─────────────────────┤
└─────────────────────────────────────┘
```

The component handles several concerns automatically: tab state persistence via URL parameters, conditional rendering of single vs. multi-tab layouts, filter panel positioning, and empty state display when filters return no results.

---

## Basic Usage

At minimum, provide a `tabs` array with at least one tab configuration. Each tab defines its filter panel, table content, and count information:

```typescript
<TablePageLayout
  tabs={[
    {
      title: t('datasets'),
      filterPanel: <DatasetFilter />,
      table: <DatasetTable />,
      filteredCount: filteredDatasetsCount,
      totalCount: totalDatasetsCount,
      countLabel: t('datasets'),
      Header: BrowseDatasetTableHeader,
    },
  ]}
/>
```

For multi-tab pages, add multiple entries to the `tabs` array. The component automatically renders tab navigation and manages the active tab state through URL query parameters, making tab selections bookmarkable and shareable.

**Examples:** [`routes/browse-data.datasets.tsx`](../../../packages/data-portal/app/routes/browse-data.datasets.tsx), [`routes/browse-data.tsx`](../../../packages/data-portal/app/routes/browse-data.tsx)

---

## Component Props

### TablePageLayoutProps

The main layout accepts these props:

| Prop            | Type              | Purpose                                              |
| --------------- | ----------------- | ---------------------------------------------------- |
| `tabs`          | `TablePageTabProps[]` | Tab configurations (required, minimum 1)         |
| `tabsTitle`     | `string`          | Title displayed above tabs for multi-tab pages       |
| `header`        | `ReactNode`       | Custom header component above the tabs               |
| `banner`        | `ReactNode`       | Banner below tabs (filter indicators, announcements) |
| `title`         | `string`          | Section title below tabs                             |
| `titleContent`  | `ReactNode`       | Additional content next to the title                 |
| `downloadModal` | `ReactNode`       | Download modal rendered at page level                |
| `drawers`       | `ReactNode`       | Metadata drawers rendered at page level              |

### TablePageTabProps

Each tab configuration includes:

| Prop               | Type                  | Purpose                                          |
| ------------------ | --------------------- | ------------------------------------------------ |
| `title`            | `string`              | Tab label and identifier                         |
| `table`            | `ReactNode`           | Table component to render                        |
| `filterPanel`      | `ReactNode`           | Filter sidebar component                         |
| `filteredCount`    | `number`              | Current filtered result count                    |
| `totalCount`       | `number`              | Total unfiltered count (optional)                |
| `countLabel`       | `string`              | Label for count display (e.g., "datasets")       |
| `description`      | `string`              | Description text shown in header                 |
| `learnMoreLink`    | `string`              | External documentation link                      |
| `noFilteredResults`| `ReactNode`           | Custom empty state component                     |
| `Header`           | `ComponentType`       | Custom header component                          |

**Full type definitions:** [`components/TablePageLayout/types.ts`](../../../packages/data-portal/app/components/TablePageLayout/types.ts)

---

## Layout Behavior

### Tab State Management

The active tab is stored in URL query parameters using `QueryParams.TableTab`. This provides browser history integration—users can navigate back/forward between tabs and share URLs that open specific tabs.

When the page loads, the component checks for a tab parameter in the URL. If none exists or the specified tab isn't found, it defaults to the first tab in the array.

### Two-Column Content Layout

The `TablePageTabContent` component renders a two-column layout: a fixed-width (280px) filter panel on the left and a flexible-width table area on the right. When `filteredCount` is zero, the table area displays the `noFilteredResults` component (defaulting to `<NoFilteredResults />`).

### Header Rendering

If a tab provides a `Header` component, it receives the tab's metadata props (`filteredCount`, `totalCount`, `countLabel`, `description`, `learnMoreLink`) and can render them as needed. The standard `TableHeaderDefinition` component displays a description row with a "Learn more" link, plus a counts row with an optional search component.

---

## Custom Headers

For pages needing custom header behavior (like adding a search input), wrap `TableHeaderDefinition`:

```typescript
function BrowseDatasetTableHeader(props: TableHeaderProps) {
  return <TableHeaderDefinition {...props} search={<BrowseDataSearch />} />
}
```

Then pass it as the `Header` prop in your tab configuration.

**Location:** [`components/TablePageLayout/TableHeaderDefinition.tsx`](../../../packages/data-portal/app/components/TablePageLayout/TableHeaderDefinition.tsx)

---

## Count Display

The `TableCount` component handles two display modes:

1. **Unfiltered**: Shows just the count and label (e.g., "1,234 datasets")
2. **Filtered**: Shows filtered count relative to total (e.g., "156 of 1,234 datasets")

The component automatically chooses the appropriate format based on whether `totalCount` is provided and differs from `filteredCount`.

---

## Integration with Modals and Drawers

The layout provides dedicated slots for modals and drawers that need to render at the page level but be triggered from within table content:

```typescript
<TablePageLayout
  tabs={[...]}
  downloadModal={<DownloadModal type="dataset" datasetId={datasetId} />}
  drawers={
    <>
      <MetadataDrawer drawerId={MetadataDrawerId.Dataset} {...props} />
      <MetadataDrawer drawerId={MetadataDrawerId.Run} {...props} />
    </>
  }
/>
```

This pattern keeps modal/drawer state management at the page level while allowing table rows to trigger opens via shared hooks (`useDownloadModalQueryParamState`, `useMetadataDrawer`).

---

## Banner Integration

The `banner` prop renders content between the tabs and the filter/table area. Common uses include filter state indicators:

```typescript
<TablePageLayout
  banner={depositionId && <DepositionFilterBanner depositionId={depositionId} />}
  tabs={[...]}
/>
```

**Location:** [`components/DepositionFilterBanner.tsx`](../../../packages/data-portal/app/components/DepositionFilterBanner.tsx)

---

## Empty States

When `filteredCount` is zero, the layout displays the `noFilteredResults` component. The default `<NoFilteredResults />` shows a message suggesting filter adjustments and a "Clear all filters" button. Pass `showSearchTip` to include search-related guidance:

```typescript
noFilteredResults: <NoFilteredResults showSearchTip />
```

**Location:** [`components/NoFilteredResults.tsx`](../../../packages/data-portal/app/components/NoFilteredResults.tsx)

---

## Best Practices

**Do:**
- Provide both `filteredCount` and `totalCount` for clear feedback on filter impact
- Use descriptive `countLabel` values that match user expectations
- Include meaningful `description` and `learnMoreLink` for discoverability
- Wrap table content in loading states for better UX during data fetches

**Don't:**
- Pass an empty `tabs` array (minimum 1 tab required)
- Mix URL-based filter state with local component state
- Forget accessibility labels on interactive elements

---

## Error Handling

Wrap the layout in an error boundary to catch rendering errors and provide recovery options:

```typescript
<ErrorBoundary logId={TABLE_PAGE_LAYOUT_LOG_ID}>
  <TablePageLayout tabs={[...]} />
</ErrorBoundary>
```

**Location:** [`components/ErrorBoundary.tsx`](../../../packages/data-portal/app/components/ErrorBoundary.tsx)

## Next Steps

- [Filter System](../02-data/03-filter-system.md) - How filters work with tables
- [Metadata Drawers](./03-metadata-drawers.md) - Drawer integration
- [Component Architecture](./01-component-architecture.md) - General component structure
