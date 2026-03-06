# Filter System

This document describes the URL-driven filter system used throughout the CryoET Data Portal for datasets, runs, and depositions.


## Quick Reference

| Concept                    | Implementation             | File                                                                        |
| -------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| Filter State Management    | `useFilter()` hook         | [`hooks/useFilter.ts`](../../../packages/data-portal/app/hooks/useFilter.ts)   |
| GraphQL Filter Translation | `getDatasetsFilter()`      | [`graphql/common.ts`](../../../packages/data-portal/app/graphql/common.ts)     |
| URL Params                 | `QueryParams` enum         | [`constants/query.ts`](../../../packages/data-portal/app/constants/query.ts)   |
| Filter UI                  | `<FilterPanel>` components | [`components/Filters/`](../../../packages/data-portal/app/components/Filters/) |

---

## Architecture Overview

The filter system follows a unidirectional data flow:

```
URL Query Params → useFilter() → Filter State → GraphQL Where Clause → API
         ↑                                                                 |
         └─────────────────── User Interaction ────────────────────────────┘
```

### Key Principles

1. **URL is the source of truth** - All filter state lives in URL query parameters
2. **Shareable/bookmarkable** - URLs can be copied and shared
3. **Type-safe** - TypeScript ensures filter values match expected types
4. **GraphQL-ready** - Filters translate directly to GraphQL `where` clauses

---

## useFilter Hook

### Basic Usage

The `useFilter()` hook provides filter state and update methods:

```typescript
import { useFilter } from 'app/hooks/useFilter'
import { QueryParams } from 'app/constants/query'

function MyComponent() {
  const filter = useFilter()

  // Read filter state
  const organismNames = filter.sampleAndExperimentConditions.organismNames
  const isGroundTruth = filter.includedContents.isGroundTruthEnabled

  // Update a single filter
  filter.updateValue(QueryParams.Organism, 'Homo sapiens')

  // Update multiple filters at once
  filter.updateValues({
    [QueryParams.Organism]: ['Homo sapiens', 'Mus musculus'],
    [QueryParams.GroundTruthAnnotation]: 'true',
  })

  // Reset all filters
  filter.reset()
}
```

**Location:** [`hooks/useFilter.ts`](../../../packages/data-portal/app/hooks/useFilter.ts)

### Filter State Structure

The hook returns a structured filter state object:

```typescript
export type FilterState = {
  // Included content filters
  includedContents: {
    isGroundTruthEnabled: boolean
    availableFiles: AvailableFilesFilterValue[]
    numberOfRuns: NumberOfRunsFilterValue | null
  }

  // ID filters
  ids: {
    datasets: string[]
    deposition: string | null
    empiar: string | null
    emdb: string | null
  }

  // Author filters
  author: {
    name: string | null
    orcid: string | null
  }

  // Sample and experiment conditions
  sampleAndExperimentConditions: {
    organismNames: string[]
  }

  // Hardware filters
  hardware: {
    cameraManufacturer: string | null
  }

  // Tilt series metadata
  tiltSeries: {
    min: string
    max: string
    qualityScore: string[]
  }

  // Tomogram metadata
  tomogram: {
    fiducialAlignmentStatus: string | null
    reconstructionMethod: string | null
    reconstructionSoftware: string | null
  }

  // Annotation metadata
  annotation: {
    annotationSoftwares: string[]
    objectId: string | null
    methodTypes: string[]
    objectNames: string[]
    objectShapeTypes: Annotation_File_Shape_Type_Enum[]
    annotatedObjectsOnly: boolean
  }

  // Tag filters
  tags: {
    competition: boolean
  }
}
```

### Update Methods

| Method                      | Purpose                 | Example                                                    |
| --------------------------- | ----------------------- | ---------------------------------------------------------- |
| `updateValue(param, value)` | Update single filter    | `filter.updateValue(QueryParams.Organism, 'Homo sapiens')` |
| `updateValues(params)`      | Update multiple filters | `filter.updateValues({ [QueryParams.Organism]: [...] })`   |
| `reset()`                   | Clear all filters       | `filter.reset()`                                           |

**Behavior:**

- Updates use `replace: true` - no new history entry
- Automatically resets pagination (`QueryParams.Page`)
- Uses `preventScrollReset: true` - maintains scroll position
- Logs events to Plausible analytics

---

## GraphQL Filter Translation

### getDatasetsFilter()

Converts filter state to GraphQL `DatasetWhereClause`:

```typescript
import { getDatasetsFilter } from 'app/graphql/common'

const where = getDatasetsFilter({
  filterState: filter,
  searchText: 'mitochondria',
  depositionId: 123,
})

// Generates GraphQL where clause:
{
  title: { _ilike: '%mitochondria%' },
  organismName: { _in: ['Homo sapiens'] },
  runs: {
    annotations: {
      depositionId: { _eq: 123 },
      groundTruthStatus: { _eq: true }
    }
  }
}
```

**Location:** [`graphql/common.ts`](../../../packages/data-portal/app/graphql/common.ts)

### Filter Categories

#### Included Contents

```typescript
// Ground truth annotations
if (filterState.includedContents.isGroundTruthEnabled) {
  where.runs = {
    annotations: {
      groundTruthStatus: { _eq: true },
    },
  }
}

// Available files (annotation, tomogram, tilt-series, etc.)
for (const availableFile of filterState.includedContents.availableFiles) {
  switch (availableFile) {
    case 'annotation':
      where.runs.annotationsAggregate = {
        count: { predicate: { _gt: 0 } },
      }
      break
    case 'tomogram':
      where.runs.tomogramsAggregate = {
        count: { predicate: { _gt: 0 } },
      }
      break
  }
}
```

#### Organism Filtering

```typescript
const { organismNames } = filterState.sampleAndExperimentConditions
if (organismNames.length > 0) {
  where.organismName = { _in: organismNames }
}
```

#### Annotation Object Filtering

```typescript
// Object name filtering
if (objectNames.length > 0) {
  where.runs = {
    annotations: {
      objectName: { _in: objectNames },
    },
  }
}

// Object ID filtering
if (objectId) {
  where.runs = {
    annotations: {
      objectId: { _eq: objectId },
    },
  }
}

// Shape type filtering
if (objectShapeTypes.length > 0) {
  where.runs = {
    annotations: {
      annotationShapes: {
        shapeType: { _in: objectShapeTypes },
      },
    },
  }
}
```

#### Tilt Range Filtering

```typescript
const tiltRangeMin = parseFloat(filterState.tiltSeries.min)
const tiltRangeMax = parseFloat(filterState.tiltSeries.max)

if (Number.isFinite(tiltRangeMin) || Number.isFinite(tiltRangeMax)) {
  where.runs = {
    tiltseries: {
      tiltRange: {
        _gte: Number.isFinite(tiltRangeMin)
          ? tiltRangeMin
          : DEFAULT_TILT_RANGE_MIN,
        _lte: Number.isFinite(tiltRangeMax)
          ? tiltRangeMax
          : DEFAULT_TILT_RANGE_MAX,
      },
    },
  }
}
```

---

## Filter UI Components

### Filter Panel Structure

```typescript
<FilterPanel>
  <FilterSection title="Included Contents">
    <BooleanFilter
      label="Ground Truth Annotation"
      queryParam={QueryParams.GroundTruthAnnotation}
    />
    <DataTypesFilter />
  </FilterSection>

  <FilterSection title="Name / ID">
    <InputFilter
      label="Dataset ID"
      queryParam={QueryParams.DatasetId}
    />
    <AuthorFilter />
  </FilterSection>

  <FilterSection title="Sample & Experiment Conditions">
    <OrganismNameFilter />
  </FilterSection>
</FilterPanel>
```

**Location:** [`components/DatasetFilter/`](../../../packages/data-portal/app/components/DatasetFilter/)

### Common Filter Components

#### InputFilter

Single text input with debouncing:

```typescript
<InputFilter
  label="Author Name"
  placeholder="Sami Writer"
  queryParam={QueryParams.AuthorName}
/>
```

#### SelectFilter

Dropdown selection:

```typescript
<SelectFilter
  label="Reconstruction Method"
  options={['WBP', 'SIRT', 'SART', 'Fourier Space']}
  queryParam={QueryParams.ReconstructionMethod}
/>
```

#### MultiInputFilter

Multiple value input with autocomplete:

```typescript
<MultiInputFilter
  label="Organism Name"
  options={organismOptions}
  queryParam={QueryParams.Organism}
  multiple
/>
```

#### BooleanFilter

True/false toggle:

```typescript
<BooleanFilter
  label="Ground Truth Annotation"
  queryParam={QueryParams.GroundTruthAnnotation}
/>
```

**Location:** [`components/Filters/`](../../../packages/data-portal/app/components/Filters/)

---

## Query Param Conventions

### URL Parameter Names

Query parameters are defined in `QueryParams` enum:

```typescript
export enum QueryParams {
  // Pagination
  Page = 'page',

  // Search
  Search = 'query',

  // Dataset filters
  DatasetId = 'dataset_id',
  Organism = 'organism_name',

  // Annotation filters
  ObjectName = 'object_name',
  ObjectId = 'object_id',
  ObjectShapeType = 'object_shape_type',
  AnnotationSoftware = 'annotation_software',
  MethodType = 'method_type',

  // Tomogram filters
  ReconstructionMethod = 'reconstruction_method',
  ReconstructionSoftware = 'reconstruction_software',
  FiducialAlignmentStatus = 'fiducial_alignment_status',

  // Hardware
  CameraManufacturer = 'camera_manufacturer',

  // Tilt series
  TiltRangeMin = 'tilt_range_min',
  TiltRangeMax = 'tilt_range_max',

  // Author
  AuthorName = 'author_name',
  AuthorOrcid = 'author_orcid',

  // Available files
  AvailableFiles = 'available_files',
  GroundTruthAnnotation = 'ground_truth',

  // Tags
  Competition = 'competition',
}
```

**Location:** [`constants/query.ts`](../../../packages/data-portal/app/constants/query.ts)

### Multi-Value Parameters

Some parameters support multiple values using repeated keys:

```
?organism_name=Homo%20sapiens&organism_name=Mus%20musculus
```

This is parsed as:

```typescript
searchParams.getAll(QueryParams.Organism) // ['Homo sapiens', 'Mus musculus']
```

---

## Server-Side Integration

### Loader Pattern

Filters are applied server-side in Remix loaders:

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
  const query = url.searchParams.get(QueryParams.Search) ?? ''

  const { data } = await getDatasetsV2({
    page,
    searchText: query,
    params: url.searchParams,
    client: apolloClientV2,
  })

  return json({ v2: data })
}
```

### getDatasetsV2 Server Function

```typescript
export async function getDatasetsV2({
  page,
  params,
  searchText,
  client,
}: GetDatasetsOptions) {
  const filterState = getFilterState(params)

  const where = getDatasetsFilter({
    filterState,
    searchText,
  })

  return client.query({
    query: GetDatasetsV2Document,
    variables: {
      where,
      limit: BROWSE_DATASETS_PAGE_SIZE,
      offset: (page - 1) * BROWSE_DATASETS_PAGE_SIZE,
    },
  })
}
```

**Location:** [`graphql/getDatasetsV2.server.ts`](../../../packages/data-portal/app/graphql/getDatasetsV2.server.ts)

---

## Advanced Patterns

### Filter Value Normalization

The `normalizeFilterValue()` function handles different filter value types:

```typescript
function normalizeFilterValue(value: FilterValue): string[] {
  return match(value)
    .returnType<string[]>()
    .with(P.array(P.string), (val) => val)
    .with(P.array({ value: P.string }), (val) => val.map((v) => v.value))
    .with(P.string, (val) => [val])
    .with({ value: P.string }, (val) => [val.value])
    .otherwise(() => [])
}
```

Supports:

- `string` → `['string']`
- `string[]` → `['a', 'b']`
- `{ value: string }` → `['value']`
- `{ value: string }[]` → `['a', 'b']`

### Dual Query Approach

For complex filters (e.g., searching across both annotations and identified objects):

```typescript
export function createAnnotationVsIdentifiedObjectFilters(
  filterState: FilterState,
) {
  const annotationFilter = {
    ...filterState,
    annotation: {
      ...filterState.annotation,
      _searchIdentifiedObjectsOnly: false,
    },
  }

  const identifiedObjectFilter = {
    ...filterState,
    annotation: {
      ...filterState.annotation,
      _searchIdentifiedObjectsOnly: true,
    },
  }

  return { annotationFilter, identifiedObjectFilter }
}
```

This allows querying multiple tables and merging results on the frontend.

---

## Analytics Integration

### Automatic Event Logging

Filter changes automatically log to Plausible analytics:

```typescript
const logPlausibleEvent = useCallback(
  (param: QueryParams, value?: FilterValue) => {
    plausible(Events.Filter, {
      field: param,
      value: normalizedValue,
      type: filterType, // 'dataset' or 'run'
    })
  },
  [filterType, plausible],
)
```

This tracks:

- Which filters are used most
- Filter combinations
- Dataset vs Run filtering patterns

---

## Best Practices

### Do's

✅ **Use URL state for all filter values**

```typescript
const filter = useFilter()
filter.updateValue(QueryParams.Organism, selectedOrganism)
```

✅ **Reset pagination when filters change**

```typescript
// Automatically done by useFilter()
prev.delete(QueryParams.Page)
```

✅ **Provide clear feedback on active filters**

```typescript
{filter.sampleAndExperimentConditions.organismNames.length > 0 && (
  <FilterBanner>Filtered by organism</FilterBanner>
)}
```

### Don'ts

❌ **Don't store filter state in React state**

```typescript
// Avoid - loses shareability
const [filters, setFilters] = useState({})
```

❌ **Don't forget to handle multiple values**

```typescript
// Avoid - only gets first value
const organism = searchParams.get(QueryParams.Organism)

// Correct - gets all values
const organisms = searchParams.getAll(QueryParams.Organism)
```

❌ **Don't mutate filter state directly**

```typescript
// Avoid
filter.annotation.objectNames.push('new')

// Correct
filter.updateValue(QueryParams.ObjectName, [...objectNames, 'new'])
```

## Next Steps

- [Deposition Data Fetching](./04-deposition-data-fetching.md) - Client-side data fetching patterns
- [Table Page Layout](../04-components/02-table-page-layout.md) - How filters integrate with tables
- [Hooks Guide](../06-cross-cutting/03-hooks-guide.md) - More custom hooks
