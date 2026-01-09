# Adding Filters

This guide covers implementing filters in the CryoET Data Portal, including UI components, URL state management, and GraphQL query integration.

## Quick Reference

| Component          | Purpose                 | Location                                      |
| ------------------ | ----------------------- | --------------------------------------------- |
| `BooleanFilter`    | Checkbox filters        | `app/components/Filters/BooleanFilter.tsx`    |
| `SelectFilter`     | Dropdown/multi-select   | `app/components/Filters/SelectFilter.tsx`     |
| `MultiInputFilter` | Numeric range inputs    | `app/components/Filters/MultiInputFilter.tsx` |
| `useFilter` hook   | Filter state management | `app/hooks/useFilter.ts`                      |

---

## Filter Architecture

Filters use a three-layer architecture:

1. **URL State** - Filter values stored in search parameters (shareable, bookmarkable)
2. **Filter Hook** - `useFilter()` manages state and URL synchronization
3. **UI Components** - Reusable filter components render inputs and handle updates

This approach ensures shareable URLs, working browser navigation, and filter persistence across refreshes.

---

## Step-by-Step: Adding a New Filter

### 1. Define the Query Parameter

**File:** `app/constants/filterQueryParams.ts`

```typescript
export enum QueryParams {
  ObjectName = 'object-name',
  ObjectShapeType = 'object-shape-type',
  ExperimentType = 'experiment-type', // Add your new param
}
```

### 2. Update Filter State Type

**File:** `app/hooks/useFilter.ts`

```typescript
export interface FilterState {
  annotation: {
    objectNames: string[]
    objectShapeTypes: string[]
  }
  experiment: {
    type: string[] // Add your new filter
  }
}
```

### 3. Update Filter State Parser

Add logic to parse your filter from URL parameters in `getFilterState()`:

```typescript
export function getFilterState(params: URLSearchParams): FilterState {
  return {
    annotation: {
      objectNames: params.getAll(QueryParams.ObjectName),
      objectShapeTypes: params.getAll(QueryParams.ObjectShapeType),
    },
    experiment: {
      type: params.getAll(QueryParams.ExperimentType),
    },
  }
}
```

### 4. Create the Filter Component

The core pattern for any filter component uses the `useFilter` hook to access state and trigger updates:

```typescript
export function ExperimentTypeFilter({ availableTypes }: Props) {
  const { updateValue, experiment: { type } } = useFilter()

  return (
    <SelectFilter
      multiple
      search
      label="Experiment Type"
      options={availableTypes.map((t) => ({ label: t, value: t }))}
      value={type.map((t) => ({ label: t, value: t }))}
      onChange={(options) => updateValue(QueryParams.ExperimentType, options)}
    />
  )
}
```

The `useFilter()` hook provides the current filter state and an `updateValue()` function that synchronizes changes to the URL. Use `useMemo` for expensive option transformations in production components. See `app/components/Filters/AnnotationObjectNameFilter.tsx` for the complete pattern with memoization.

### 5. Update GraphQL Query

Modify your GraphQL query to support the new filter. See [Building Dynamic Where Clauses](#building-dynamic-where-clauses) for the pattern.

### 6. Use Filter in Loader

Apply the filter in your route loader:

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const filterState = getFilterState(url.searchParams)

  const { data } = await getExperimentsV2({
    client: apolloClientV2,
    filterState,
  })

  return json({
    experiments: data.experiments,
    filters: { availableTypes: getAvailableTypes(data) },
  })
}
```

### 7. Add Filter to UI

Include your filter component in the filter panel:

```typescript
export function ExperimentFilterPanel() {
  const { filters } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-4">
      <ExperimentTypeFilter availableTypes={filters.availableTypes} />
    </div>
  )
}
```

---

## Filter Component Types

Choose the right filter component based on your data type and user interaction needs:

| Filter Type        | Use When                         | Example Use Cases                      |
| ------------------ | -------------------------------- | -------------------------------------- |
| `BooleanFilter`    | Binary yes/no choice             | Ground truth only, Has tomograms       |
| `SelectFilter`     | Choosing from predefined options | Object name, Quality score, Shape type |
| `MultiInputFilter` | Numeric ranges with min/max      | Tilt range, Resolution range           |

### BooleanFilter

Use for simple toggles where users enable/disable a constraint:

```typescript
<BooleanFilter
  label="Ground Truth Annotations Only"
  caption="Show only manually annotated data"
  value={includedContents.isGroundTruthEnabled}
  onChange={(value) => updateValue(QueryParams.GroundTruthAnnotation, value)}
/>
```

### SelectFilter

Use for single or multiple selection from a list. Add `multiple` for multi-select and `search` for filterable dropdowns with many options:

```typescript
<SelectFilter
  multiple
  search
  label="Object Name"
  options={objectNameOptions}
  value={selectedNames}
  onChange={(options) => updateValue(QueryParams.ObjectName, options)}
/>
```

### MultiInputFilter

Use for numeric ranges with separate min/max inputs:

```typescript
<MultiInputFilter
  label="Tilt Range"
  min={tiltSeries.min}
  max={tiltSeries.max}
  onMinChange={(value) => updateValue(QueryParams.TiltRangeMin, value)}
  onMaxChange={(value) => updateValue(QueryParams.TiltRangeMax, value)}
/>
```

---

## Filter State Management

### Using the useFilter Hook

```typescript
const {
  annotation, // Filter state for annotations
  experiment, // Filter state for experiments
  tiltSeries, // Filter state for tilt series
  includedContents, // Boolean filter states
  updateValue, // Function to update filter values
  filterState, // Raw filter state object
} = useFilter()
```

### Updating Filter Values

```typescript
// Single value
updateValue(QueryParams.ExperimentType, 'cryo-et')

// Array of values
updateValue(QueryParams.ObjectName, ['ribosome', 'membrane'])

// Boolean
updateValue(QueryParams.GroundTruthAnnotation, true)

// Clear a filter
updateValue(QueryParams.ObjectName, [])
```

### Clearing All Filters

```typescript
const [searchParams, setSearchParams] = useSearchParams()

const clearAllFilters = () => {
  const newParams = new URLSearchParams()
  newParams.set('page', '1') // Preserve pagination reset
  setSearchParams(newParams)
}
```

---

## Advanced Filter Patterns

### Dependent Filters

Show/hide filters based on other selections:

```typescript
export function FilterPanel() {
  const { annotation } = useFilter()
  const showAdvanced = annotation.objectNames.length > 0

  return (
    <div>
      <AnnotationObjectNameFilter />
      {showAdvanced && <ObjectShapeTypeFilter />}
    </div>
  )
}
```

### Dynamic Filter Options

Load filter options based on current selections:

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const filterState = getFilterState(new URL(request.url).searchParams)

  const { data: aggregates } = await getFilterAggregatesV2({
    client: apolloClientV2,
    baseFilter: filterState,
  })

  return json({
    filters: {
      availableObjectNames: aggregates.objectNames,
      availableShapeTypes: aggregates.shapeTypes,
    },
  })
}
```

---

## GraphQL Filter Integration

### Building Dynamic Where Clauses

The pattern for converting filter state to GraphQL where clauses:

```
1. Create empty where clause object
2. For each active filter:
   - Check if filter has values
   - Add appropriate condition (_in, _eq, _gte, _lte)
   - Merge with existing conditions on same field
3. Return completed where clause
```

**Example implementation** (from `app/graphql/getDatasetByIdV2.server.ts`):

```typescript
function buildRunFilter(filterState: FilterState): RunWhereClause {
  const where: RunWhereClause = {}

  // Array filter: use _in operator
  if (filterState.annotation.objectNames.length > 0) {
    where.annotations = {
      objectName: { _in: filterState.annotation.objectNames },
    }
  }

  // Range filter: use _gte/_lte operators
  if (filterState.tiltSeries.min) {
    where.tiltseries = {
      tiltRange: { _gte: parseFloat(filterState.tiltSeries.min) },
    }
  }

  // Boolean filter: use _eq operator
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

Use GraphQL `_and` for complex conditions:

```typescript
if (hasMultipleFilterTypes) {
  where._and = [
    { annotations: { objectName: { _in: objectNames } } },
    { tiltseries: { tiltSeriesQuality: { _in: qualityScores } } },
  ]
}
```

---

## Filter UI Layout

Organize filters in collapsible sections:

```typescript
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
    </div>
  )
}
```

---

## Testing Filters

### Unit Tests

Test filter components respond to user interaction:

```typescript
describe('<BooleanFilter />', () => {
  it('should update value on click', async () => {
    const onChange = jest.fn()
    render(<BooleanFilter label="Test" onChange={onChange} value={false} />)

    await userEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
```

See `app/components/Filters/BooleanFilter.test.tsx` for complete examples.

### E2E Tests

Test filter behavior in the full application:

```typescript
test('should filter runs by object name', async ({ page }) => {
  await page.goto('/datasets/123')
  await page.click('text=Object Name')
  await page.click('text=ribosome')

  await expect(page).toHaveURL(/object-name=ribosome/)
  expect(await page.locator('[data-testid="run-row"]').count()).toBeGreaterThan(
    0,
  )
})
```

---

## Best Practices

1. **URL as source of truth** - Always sync filter state with URL parameters
2. **Type safety** - Use TypeScript for filter state and GraphQL where clauses
3. **Debounce text inputs** - Prevent excessive URL updates while typing
4. **Preserve page state** - Reset pagination when filters change
5. **Performance** - Use `useMemo` for expensive filter option transformations
6. **Accessibility** - Ensure all filter controls are keyboard-navigable

---

## Next Steps

- [GraphQL Queries](./03-graphql-queries.md) - Build dynamic queries with filters
- [Testing Guide](./06-testing-guide.md) - Test filter components and behavior
- [Adding New Routes](./01-adding-new-routes.md) - Use filters in route loaders
