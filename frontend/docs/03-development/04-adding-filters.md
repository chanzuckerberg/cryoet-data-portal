# Adding Filters

This guide provides step-by-step instructions for implementing filters in the CryoET Data Portal, including UI components, URL state management, and GraphQL query integration.


## Quick Reference

| Component | Purpose | Location |
|-----------|---------|----------|
| `BooleanFilter` | Checkbox filters | `app/components/Filters/BooleanFilter.tsx` |
| `SelectFilter` | Dropdown/multi-select | `app/components/Filters/SelectFilter.tsx` |
| `MultiInputFilter` | Numeric range inputs | `app/components/Filters/MultiInputFilter.tsx` |
| `useFilter` hook | Filter state management | `app/hooks/useFilter.ts` |

---

## Filter Architecture

Filters in the portal use a three-layer architecture:

1. **URL State** - Filter values stored in search parameters (shareable, bookmarkable)
2. **Filter Hook** - `useFilter()` manages state and URL synchronization
3. **UI Components** - Reusable filter components render inputs and handle updates

**Benefits:**
- Shareable URLs with filters applied
- Browser back/forward navigation works
- Filters persist across page refreshes
- Clean separation of concerns

---

## Step-by-Step: Adding a New Filter

### 1. Define the Query Parameter

Add your filter parameter to the constants:

**File:** `/packages/data-portal/app/constants/filterQueryParams.ts`

```typescript
export enum QueryParams {
  // Existing params
  ObjectName = 'object-name',
  ObjectShapeType = 'object-shape-type',

  // Add your new param
  ExperimentType = 'experiment-type',
}
```

### 2. Update Filter State Type

Add your filter to the filter state interface:

**File:** `/packages/data-portal/app/hooks/useFilter.ts`

```typescript
export interface FilterState {
  annotation: {
    objectNames: string[]
    objectShapeTypes: string[]
    objectId: string | null
  }
  // Add your new filter group
  experiment: {
    type: string[]
    minDate: string | null
    maxDate: string | null
  }
}
```

### 3. Update Filter State Parser

Add logic to parse your filter from URL parameters:

**File:** `/packages/data-portal/app/hooks/useFilter.ts`

```typescript
export function getFilterState(params: URLSearchParams): FilterState {
  return {
    annotation: {
      objectNames: params.getAll(QueryParams.ObjectName),
      objectShapeTypes: params.getAll(QueryParams.ObjectShapeType),
      objectId: params.get(QueryParams.ObjectId),
    },
    experiment: {
      type: params.getAll(QueryParams.ExperimentType),
      minDate: params.get(QueryParams.MinDate),
      maxDate: params.get(QueryParams.MaxDate),
    },
  }
}
```

### 4. Create the Filter Component

Create a new filter component or use an existing one:

**File:** `/packages/data-portal/app/components/Filters/ExperimentTypeFilter.tsx`

```typescript
import { useMemo } from 'react'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { BaseFilterOption } from 'app/types/filter'
import { SelectFilter } from './SelectFilter'

export function ExperimentTypeFilter({
  availableTypes,
}: {
  availableTypes: string[]
}) {
  const {
    updateValue,
    experiment: { type },
  } = useFilter()

  const typeOptions: BaseFilterOption[] = useMemo(
    () => availableTypes.map((t) => ({ label: t, value: t })),
    [availableTypes],
  )

  const selectedTypes: BaseFilterOption[] = useMemo(
    () => type.map((t) => ({ label: t, value: t })),
    [type],
  )

  return (
    <SelectFilter
      multiple
      search
      label="Experiment Type"
      onChange={(options) => updateValue(QueryParams.ExperimentType, options)}
      options={typeOptions}
      value={selectedTypes}
    />
  )
}
```

**Key patterns from `/packages/data-portal/app/components/Filters/AnnotationObjectNameFilter.tsx`:**
- Use `useFilter()` hook to access state and update function
- Use `useMemo` to transform data for filter components
- Call `updateValue()` with param name and new value

### 5. Update GraphQL Query

Modify your GraphQL query to support the new filter:

**File:** `/packages/data-portal/app/graphql/getExperimentsV2.server.ts`

```typescript
const GET_EXPERIMENTS_QUERY_V2 = gql(`
  query GetExperimentsV2($filter: ExperimentWhereClause) {
    experiments(where: $filter) {
      id
      type
      date
      title
    }
  }
`)

function buildExperimentFilter(
  filterState: FilterState
): ExperimentWhereClause {
  const filter: ExperimentWhereClause = {}

  // Add type filter
  if (filterState.experiment.type.length > 0) {
    filter.type = { _in: filterState.experiment.type }
  }

  // Add date range filter
  if (filterState.experiment.minDate) {
    filter.date = { _gte: filterState.experiment.minDate }
  }
  if (filterState.experiment.maxDate) {
    filter.date = {
      ...filter.date,
      _lte: filterState.experiment.maxDate,
    }
  }

  return filter
}
```

### 6. Use Filter in Loader

Apply the filter in your route loader:

**File:** `/packages/data-portal/app/routes/experiments.tsx`

```typescript
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { apolloClientV2 } from 'app/apollo.server'
import { getFilterState } from 'app/hooks/useFilter'
import { getExperimentsV2 } from 'app/graphql/getExperimentsV2.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const filterState = getFilterState(url.searchParams)

  const { data } = await getExperimentsV2({
    client: apolloClientV2,
    filterState,
  })

  return json({
    experiments: data.experiments,
    filters: {
      availableTypes: getAvailableTypes(data),
    },
  })
}
```

### 7. Add Filter to UI

Include your filter component in the filter panel:

```typescript
import { ExperimentTypeFilter } from 'app/components/Filters/ExperimentTypeFilter'

export function ExperimentFilterPanel() {
  const { filters } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-4">
      <ExperimentTypeFilter availableTypes={filters.availableTypes} />
      {/* Other filters */}
    </div>
  )
}
```

---

## Filter Component Types

### Boolean Filter (Checkbox)

Simple on/off toggle:

**From `/packages/data-portal/app/components/Filters/BooleanFilter.tsx`:**

```typescript
import { BooleanFilter } from 'app/components/Filters/BooleanFilter'

export function GroundTruthFilter() {
  const { updateValue, includedContents } = useFilter()

  return (
    <BooleanFilter
      label="Ground Truth Annotations Only"
      caption="Show only manually annotated data"
      value={includedContents.isGroundTruthEnabled}
      onChange={(value) =>
        updateValue(QueryParams.GroundTruthAnnotation, value)
      }
    />
  )
}
```

### Select Filter (Single or Multiple)

Dropdown selection:

```typescript
import { SelectFilter } from 'app/components/Filters/SelectFilter'

// Single select
<SelectFilter
  label="Quality Score"
  options={[
    { label: 'Excellent (4-5)', value: '4-5' },
    { label: 'Good (3-4)', value: '3-4' },
    { label: 'Fair (2-3)', value: '2-3' },
  ]}
  value={selectedQuality}
  onChange={(option) => updateValue(QueryParams.QualityScore, option)}
/>

// Multiple select with search
<SelectFilter
  multiple
  search
  label="Object Name"
  options={objectNameOptions}
  value={selectedNames}
  onChange={(options) => updateValue(QueryParams.ObjectName, options)}
/>
```

### Multi-Input Filter (Numeric Range)

Min/max range inputs:

```typescript
import { MultiInputFilter } from 'app/components/Filters/MultiInputFilter'

export function TiltRangeFilter() {
  const { updateValue, tiltSeries } = useFilter()

  return (
    <MultiInputFilter
      label="Tilt Range"
      min={tiltSeries.min}
      max={tiltSeries.max}
      onMinChange={(value) => updateValue(QueryParams.TiltRangeMin, value)}
      onMaxChange={(value) => updateValue(QueryParams.TiltRangeMax, value)}
    />
  )
}
```

---

## Filter State Management

### Using the useFilter Hook

The `useFilter()` hook provides:

```typescript
const {
  // Current filter state
  annotation,
  experiment,
  tiltSeries,
  includedContents,

  // Update function
  updateValue,

  // Raw filter state
  filterState,
} = useFilter()
```

### Updating Filter Values

Call `updateValue()` with the parameter name and new value:

```typescript
// Single value
updateValue(QueryParams.ExperimentType, 'cryo-et')

// Array of values
updateValue(QueryParams.ObjectName, ['ribosome', 'membrane'])

// Boolean
updateValue(QueryParams.GroundTruthAnnotation, true)

// Remove a filter (set to null/empty)
updateValue(QueryParams.ObjectName, [])
updateValue(QueryParams.Search, null)
```

### Multiple Filter Updates

Update multiple filters at once:

```typescript
const [searchParams, setSearchParams] = useSearchParams()

// Clear all filters
const clearAllFilters = () => {
  const newParams = new URLSearchParams()
  setSearchParams(newParams)
}

// Reset to defaults
const resetFilters = () => {
  const newParams = new URLSearchParams()
  newParams.set('page', '1')
  setSearchParams(newParams)
}
```

---

## Advanced Filter Patterns

### Dependent Filters

Show/hide filters based on other selections:

```typescript
export function FilterPanel() {
  const { annotation, updateValue } = useFilter()
  const showAdvanced = annotation.objectNames.length > 0

  return (
    <div>
      <AnnotationObjectNameFilter />

      {showAdvanced && (
        <>
          <ObjectShapeTypeFilter />
          <ObjectIdFilter />
        </>
      )}
    </div>
  )
}
```

### Dynamic Filter Options

Filter options that change based on data:

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const filterState = getFilterState(url.searchParams)

  // Get available filter options based on current filters
  const { data: aggregates } = await getFilterAggregatesV2({
    client: apolloClientV2,
    baseFilter: filterState,
  })

  return json({
    filters: {
      availableObjectNames: aggregates.objectNames,
      availableShapeTypes: aggregates.shapeTypes,
      // Options update based on current selection
    },
  })
}
```

### Filter with Search/Autocomplete

Enable search for large option lists:

```typescript
<SelectFilter
  multiple
  search  // Enable search input
  label="Object Name"
  options={largeObjectNameList}
  value={selectedNames}
  onChange={(options) => updateValue(QueryParams.ObjectName, options)}
/>
```

---

## GraphQL Filter Integration

### Building Dynamic Where Clauses

**Pattern from `/packages/data-portal/app/graphql/getDatasetByIdV2.server.ts`:**

```typescript
import { RunWhereClause } from 'app/__generated_v2__/graphql'

function buildRunFilter(filterState: FilterState): RunWhereClause {
  const where: RunWhereClause = {}

  // Tilt range filter
  if (filterState.tiltSeries.min || filterState.tiltSeries.max) {
    where.tiltseries = {
      tiltRange: {
        _gte: parseFloat(filterState.tiltSeries.min) || -90,
        _lte: parseFloat(filterState.tiltSeries.max) || 90,
      },
    }
  }

  // Quality score filter (multiple values)
  if (filterState.tiltSeries.qualityScore.length > 0) {
    where.tiltseries = {
      ...where.tiltseries,
      tiltSeriesQuality: {
        _in: filterState.tiltSeries.qualityScore.map((s) => parseInt(s, 10)),
      },
    }
  }

  // Object name filter (array)
  if (filterState.annotation.objectNames.length > 0) {
    where.annotations = {
      objectName: {
        _in: filterState.annotation.objectNames,
      },
    }
  }

  // Boolean filter
  if (filterState.includedContents.isGroundTruthEnabled) {
    where.annotations = {
      ...where.annotations,
      groundTruthStatus: { _eq: true },
    }
  }

  return where
}
```

### Combining Multiple Filters

Use GraphQL `_and` and `_or` operators:

```typescript
function buildComplexFilter(filterState: FilterState): RunWhereClause {
  const where: RunWhereClause = {}

  // AND condition: both filters must match
  if (
    filterState.annotation.objectNames.length > 0 &&
    filterState.tiltSeries.qualityScore.length > 0
  ) {
    where._and = [
      {
        annotations: {
          objectName: { _in: filterState.annotation.objectNames },
        },
      },
      {
        tiltseries: {
          tiltSeriesQuality: {
            _in: filterState.tiltSeries.qualityScore.map((s) => +s),
          },
        },
      },
    ]
  }

  return where
}
```

---

## Filter UI Layout

### Filter Panel Structure

Organize filters in collapsible sections:

```typescript
import { FilterSection } from 'app/components/Filters/FilterSection'

export function RunFilterPanel() {
  return (
    <div className="space-y-2">
      <FilterSection title="Annotations">
        <AnnotationObjectNameFilter />
        <ObjectShapeTypeFilter />
        <GroundTruthAnnotationFilter />
      </FilterSection>

      <FilterSection title="Tilt Series">
        <TiltRangeFilter />
        <QualityScoreFilter />
      </FilterSection>

      <FilterSection title="Advanced">
        <ObjectIdFilter />
        <MethodTypeFilter />
      </FilterSection>
    </div>
  )
}
```

### Clear Filters Button

Add functionality to reset filters:

```typescript
import { useSearchParams } from '@remix-run/react'

export function ClearFiltersButton() {
  const [searchParams, setSearchParams] = useSearchParams()
  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => key !== 'page'
  )

  if (!hasFilters) return null

  return (
    <button
      onClick={() => {
        const newParams = new URLSearchParams()
        newParams.set('page', '1')
        setSearchParams(newParams)
      }}
      className="text-blue-600 hover:underline"
    >
      Clear All Filters
    </button>
  )
}
```

---

## Testing Filters

### Unit Test Filter Components

**Pattern from `/packages/data-portal/app/components/Filters/BooleanFilter.test.tsx`:**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BooleanFilter } from './BooleanFilter'

describe('<BooleanFilter />', () => {
  it('should render label', () => {
    render(<BooleanFilter label="Test" onChange={() => {}} value={false} />)
    expect(screen.getByText('Test')).toBeVisible()
  })

  it('should update value on click', async () => {
    const onChange = jest.fn()
    render(<BooleanFilter label="Test" onChange={onChange} value={false} />)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
```

### E2E Test Filters

Test filters in E2E tests:

```typescript
import { test, expect } from '@playwright/test'

test('should filter runs by object name', async ({ page }) => {
  await page.goto('/datasets/123')

  // Open filter
  await page.click('text=Filters')

  // Select object name
  await page.click('text=Object Name')
  await page.click('text=ribosome')

  // Verify URL updated
  await expect(page).toHaveURL(/object-name=ribosome/)

  // Verify results filtered
  const runCount = await page.locator('[data-testid="run-row"]').count()
  expect(runCount).toBeGreaterThan(0)
})
```

---

## Best Practices

1. **URL as source of truth:** Always sync filter state with URL parameters
2. **Type safety:** Use TypeScript for filter state and GraphQL where clauses
3. **Debounce text inputs:** Prevent excessive URL updates while typing
4. **Preserve page state:** Keep non-filter params (like page number) when updating filters
5. **Show active filters:** Display applied filters clearly in the UI
6. **Performance:** Use `useMemo` for expensive filter option transformations
7. **Accessibility:** Ensure all filter controls are keyboard-navigable
8. **Clear feedback:** Show loading states during filter application

---

## Next Steps

- [GraphQL Queries](./03-graphql-queries.md) - Build dynamic queries with filters
- [Testing Guide](./06-testing-guide.md) - Test filter components and behavior
- [Adding New Routes](./01-adding-new-routes.md) - Use filters in route loaders
