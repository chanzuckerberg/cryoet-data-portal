# Table Page Layout

This document describes the standard layout pattern for table-based browse pages using the `TablePageLayout` component.


## Quick Reference

| Concept       | Component                 | Location                                                                                                                                      |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Main Layout   | `<TablePageLayout>`       | [`components/TablePageLayout/`](../../../packages/data-portal/app/components/TablePageLayout/)                                                   |
| Tab Content   | `<TablePageTabContent>`   | [`components/TablePageLayout/components/`](../../../packages/data-portal/app/components/TablePageLayout/components/)                             |
| Header        | `<TableHeaderDefinition>` | [`components/TablePageLayout/TableHeaderDefinition.tsx`](../../../packages/data-portal/app/components/TablePageLayout/TableHeaderDefinition.tsx) |
| Count Display | `<TableCount>`            | [`components/TablePageLayout/TableCount.tsx`](../../../packages/data-portal/app/components/TablePageLayout/TableCount.tsx)                       |

---

## Architecture Overview

The `TablePageLayout` component provides a consistent structure for all browse pages (datasets, depositions, runs):

```
┌─────────────────────────────────────┐
│           Header                     │
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

---

## Basic Usage

### Simple Single-Tab Page

```typescript
import { TablePageLayout } from 'app/components/TablePageLayout'

export default function BrowseDatasetsPage() {
  const { filteredDatasetsCount, totalDatasetsCount } = useDatasetsFilterData()
  const { t } = useI18n()

  return (
    <TablePageLayout
      tabs={[
        {
          title: t('datasets'),
          description: t('datasetsDescription'),
          learnMoreLink: 'https://docs.example.com/datasets',
          filterPanel: <DatasetFilter />,
          table: <DatasetTable />,
          noFilteredResults: <NoFilteredResults showSearchTip />,
          filteredCount: filteredDatasetsCount,
          totalCount: totalDatasetsCount,
          countLabel: t('datasets'),
          Header: BrowseDatasetTableHeader,
        },
      ]}
    />
  )
}
```

**Location:** [`routes/browse-data.datasets.tsx`](../../../packages/data-portal/app/routes/browse-data.datasets.tsx)

### Multi-Tab Page

```typescript
<TablePageLayout
  tabsTitle="Browse Data"
  tabs={[
    {
      title: t('datasets'),
      filteredCount: filteredDatasetsCount,
      totalCount: totalDatasetsCount,
      filterPanel: <DatasetFilter />,
      table: <DatasetTable />,
    },
    {
      title: t('depositions'),
      filteredCount: filteredDepositionsCount,
      totalCount: totalDepositionsCount,
      filterPanel: <DepositionFilter />,
      table: <DepositionTable />,
    },
  ]}
/>
```

**Location:** [`routes/browse-data.tsx`](../../../packages/data-portal/app/routes/browse-data.tsx)

---

## Component Props

### TablePageLayoutProps

```typescript
export interface TablePageLayoutProps {
  // Optional page header (custom component)
  header?: ReactNode

  // Tab configuration (required, minimum 1)
  tabs: TablePageTabProps[]

  // Optional title above tabs (for multi-tab pages)
  tabsTitle?: string

  // Optional download modal
  downloadModal?: ReactNode

  // Optional drawer components (metadata, etc.)
  drawers?: ReactNode

  // Optional banner (filter indicators, announcements)
  banner?: ReactNode

  // Optional title section below tabs
  title?: string
  titleContent?: ReactNode
}
```

### TablePageTabProps

```typescript
export interface TablePageTabProps {
  // Tab identification
  title: string

  // Content
  table: ReactNode
  filterPanel?: ReactNode
  noFilteredResults?: ReactNode

  // Metadata
  description?: string
  learnMoreLink?: string

  // Counts for display
  filteredCount: number
  totalCount?: number
  countLabel?: string

  // Custom header component
  Header?: ComponentType<TableHeaderProps>
}
```

**Location:** [`components/TablePageLayout/types.ts`](../../../packages/data-portal/app/components/TablePageLayout/types.ts)

---

## Layout Structure

### Main Layout Component

```typescript
export function TablePageLayout({
  header,
  tabs,
  tabsTitle,
  downloadModal,
  drawers,
  banner,
  title,
  titleContent,
}: TablePageLayoutProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTabTitle = searchParams.get(QueryParams.TableTab)
  const activeTab = tabs.find((tab) => tab.title === activeTabTitle) ?? tabs[0]

  return (
    <>
      {downloadModal}

      <div className="flex flex-col flex-auto">
        {header}

        {/* Tab Navigation */}
        {tabs.length > 1 && (
          <Tabs
            value={activeTab.title}
            onChange={(tabTitle) => {
              setSearchParams((prev) => {
                prev.set(QueryParams.TableTab, tabTitle)
                return prev
              })
            }}
            tabs={tabs.map((tab) => ({
              label: (
                <div>
                  <span>{tab.title}</span>
                  <span className="text-light-sds-color-primitive-gray-500 ml-[16px]">
                    {tab.filteredCount.toLocaleString()}
                  </span>
                </div>
              ),
              value: tab.title,
            }))}
          />
        )}

        {/* Title Section */}
        {title && (
          <div className="flex items-center gap-[50px] ml-sds-xl mt-sds-xxl mb-sds-l">
            <h2 className="font-semibold text-sds-header-xxl-600-wide">
              {title}
            </h2>
            {titleContent}
          </div>
        )}

        {/* Active Tab Content */}
        <TablePageTabContent banner={banner} {...activeTab} />

        {drawers}
      </div>
    </>
  )
}
```

**Location:** [`components/TablePageLayout/TablePageLayout.tsx`](../../../packages/data-portal/app/components/TablePageLayout/TablePageLayout.tsx)

---

## Tab Content Layout

### TablePageTabContent Component

The tab content component manages the two-column layout (filter + table):

```typescript
export function TablePageTabContent({
  description,
  filterPanel,
  Header,
  learnMoreLink,
  noFilteredResults,
  table,
  banner,
  ...headerProps
}: TablePageTabContentProps) {
  const hasNoResults = headerProps.filteredCount === 0

  return (
    <div className="flex flex-col flex-auto">
      {/* Banner (if provided) */}
      {banner}

      {/* Header with counts and actions */}
      {Header && <Header {...headerProps} />}

      <div className="flex flex-row flex-auto">
        {/* Left Column: Filter Panel */}
        {filterPanel && (
          <div className="w-[280px] min-w-[280px] border-r border-light-sds-color-primitive-gray-200">
            {filterPanel}
          </div>
        )}

        {/* Right Column: Table or Empty State */}
        <div className="flex flex-col flex-auto">
          {hasNoResults ? (
            <div className="flex items-center justify-center flex-auto">
              {noFilteredResults ?? <NoFilteredResults />}
            </div>
          ) : (
            table
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Header Pattern

### TableHeaderDefinition Component

Standard header with description, counts, and search:

```typescript
export function TableHeaderDefinition({
  countLabel,
  description,
  filteredCount,
  learnMoreLink,
  search,
  totalCount,
}: TableHeaderProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-l px-sds-xl pt-sds-xl pb-sds-l">
      {/* Description Row */}
      <div className="flex justify-between items-start">
        <p className="text-sds-body-m-400-wide text-light-sds-color-primitive-gray-600 max-w-[800px]">
          {description}
        </p>
        {learnMoreLink && (
          <Link to={learnMoreLink} target="_blank">
            {t('learnMore')}
          </Link>
        )}
      </div>

      {/* Counts and Search Row */}
      <div className="flex justify-between items-center">
        <TableCount
          countLabel={countLabel}
          filteredCount={filteredCount}
          totalCount={totalCount}
        />
        {search}
      </div>
    </div>
  )
}
```

**Location:** [`components/TablePageLayout/TableHeaderDefinition.tsx`](../../../packages/data-portal/app/components/TablePageLayout/TableHeaderDefinition.tsx)

### Custom Headers

For pages needing custom headers, create a wrapper component:

```typescript
function BrowseDatasetTableHeader(props: TableHeaderProps) {
  return (
    <TableHeaderDefinition
      {...props}
      search={<BrowseDataSearch />}
    />
  )
}

// Use in TablePageLayout
<TablePageLayout
  tabs={[
    {
      Header: BrowseDatasetTableHeader,
      // ... other props
    },
  ]}
/>
```

---

## Count Display

### TableCount Component

Displays filtered vs total counts:

```typescript
export function TableCount({
  countLabel,
  filteredCount,
  totalCount,
}: TableCountProps) {
  const { t } = useI18n()

  if (totalCount === undefined || filteredCount === totalCount) {
    return (
      <div className="text-sds-header-l-600-wide font-semibold">
        {filteredCount.toLocaleString()} {countLabel}
      </div>
    )
  }

  return (
    <div className="flex items-baseline gap-sds-xs">
      <span className="text-sds-header-l-600-wide font-semibold">
        {filteredCount.toLocaleString()}
      </span>
      <span className="text-sds-body-m-400-wide text-light-sds-color-primitive-gray-500">
        {t('of')} {totalCount.toLocaleString()} {countLabel}
      </span>
    </div>
  )
}
```

**Location:** [`components/TablePageLayout/TableCount.tsx`](../../../packages/data-portal/app/components/TablePageLayout/TableCount.tsx)

---

## Tab Management

### URL-Based Tab State

Active tab is stored in URL query parameters:

```typescript
const [searchParams, setSearchParams] = useSearchParams()
const activeTabTitle = searchParams.get(QueryParams.TableTab)
const activeTab = tabs.find((tab) => tab.title === activeTabTitle) ?? tabs[0]
```

### Tab Switching

```typescript
<Tabs
  value={activeTab.title}
  onChange={(tabTitle: string) => {
    setSearchParams((prev) => {
      prev.set(QueryParams.TableTab, tabTitle)
      return prev
    })
  }}
  tabs={tabs}
/>
```

**Benefits:**

- Bookmarkable tab selections
- Browser back/forward works
- Shareable URLs with active tab

---

## Banner Integration

### Filter Banner Example

Display active filter state above the table:

```typescript
<TablePageLayout
  banner={
    depositionId && organism && (
      <DepositionFilterBanner
        label={t('onlyDisplayingDatasetsWithOrganismAndDeposition', {
          replace: { organismName: organism, depositionId }
        })}
        onRemoveFilter={handleRemoveFilter}
      />
    )
  }
  tabs={[...]}
/>
```

**Location:** [`components/DepositionFilterBanner.tsx`](../../../packages/data-portal/app/components/DepositionFilterBanner.tsx)

---

## Empty States

### NoFilteredResults Component

Shown when filters return no results:

```typescript
export function NoFilteredResults({ showSearchTip }: Props) {
  const { t } = useI18n()
  const filter = useFilter()

  return (
    <div className="flex flex-col items-center gap-sds-l py-sds-xxl">
      <Icon sdsIcon="InfoCircle" sdsSize="xl" />
      <div className="text-center">
        <h3 className="text-sds-header-l-600-wide font-semibold mb-sds-xs">
          {t('noResultsFound')}
        </h3>
        <p className="text-sds-body-m-400-wide text-light-sds-color-primitive-gray-600">
          {showSearchTip
            ? t('tryAdjustingFiltersOrSearch')
            : t('tryAdjustingFilters')
          }
        </p>
      </div>
      <Button onClick={filter.reset}>
        {t('clearAllFilters')}
      </Button>
    </div>
  )
}
```

**Location:** [`components/NoFilteredResults.tsx`](../../../packages/data-portal/app/components/NoFilteredResults.tsx)

---

## Integration with Modals and Drawers

### Download Modal

Add download functionality to the page:

```typescript
<TablePageLayout
  downloadModal={
    <DownloadModal
      type="dataset"
      datasetId={datasetId}
      datasetTitle={datasetTitle}
    />
  }
  tabs={[...]}
/>
```

### Metadata Drawers

Add side drawers for detailed views:

```typescript
<TablePageLayout
  drawers={
    <>
      <MetadataDrawer
        drawerId={MetadataDrawerId.Dataset}
        label={t('dataset')}
        title={dataset.title}
        MetadataTabComponent={DatasetMetadataTab}
      />
      <MetadataDrawer
        drawerId={MetadataDrawerId.Run}
        label={t('run')}
        title={run.name}
        MetadataTabComponent={RunMetadataTab}
      />
    </>
  }
  tabs={[...]}
/>
```

---

## Responsive Design

### Breakpoints

The layout adapts to screen sizes using Tailwind breakpoints:

```typescript
// Filter panel: fixed width on desktop
className = 'w-[280px] min-w-[280px]'

// Content area: grows to fill remaining space
className = 'flex flex-col flex-auto'

// Max content width for large screens
className = 'max-w-content w-full self-center'
```

### Mobile Considerations

For mobile views, consider:

- Collapsible filter panels
- Stacked layouts instead of side-by-side
- Simplified table columns

---

## Best Practices

### Do's

✅ **Use consistent tab props structure**

```typescript
tabs={[
  {
    title: t('datasets'),
    filterPanel: <DatasetFilter />,
    table: <DatasetTable />,
    filteredCount,
    totalCount,
    countLabel: t('datasets'),
  },
]}
```

✅ **Provide descriptive empty states**

```typescript
noFilteredResults: <NoFilteredResults showSearchTip />
```

✅ **Use proper loading states**

```typescript
const { isLoadingDebounced } = useIsLoading()
{isLoadingDebounced ? <TableSkeleton /> : <DataTable />}
```

### Don'ts

❌ **Don't mix filter state sources**

```typescript
// Avoid - mixing URL and local state
const [localFilters, setLocalFilters] = useState({})
const urlFilters = useFilter()
```

❌ **Don't forget to handle empty tabs array**

```typescript
// The component requires at least 1 tab
tabs={[]} // ❌ Will cause errors
```

❌ **Don't skip accessibility features**

```typescript
// ✅ Always include proper ARIA labels
<button aria-label={t('openFilter')}>...</button>
```

---

## Error Boundary Integration

Wrap table content in error boundaries:

```typescript
<ErrorBoundary logId={TABLE_PAGE_LAYOUT_LOG_ID}>
  <TablePageLayout tabs={[...]} />
</ErrorBoundary>
```

This catches rendering errors and provides recovery options.

**Location:** [`components/ErrorBoundary.tsx`](../../../packages/data-portal/app/components/ErrorBoundary.tsx)

## Next Steps

- [Filter System](../02-data/03-filter-system.md) - How filters work with tables
- [Metadata Drawers](./03-metadata-drawers.md) - Drawer integration
- [Component Architecture](./01-component-architecture.md) - General component structure
