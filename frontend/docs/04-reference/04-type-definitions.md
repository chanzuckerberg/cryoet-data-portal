# Type Definitions Reference

This document provides a comprehensive reference for key TypeScript types and interfaces used in the CryoET Data Portal frontend. Types are organized by category and stored in `/packages/data-portal/app/types/`.


## Quick Reference

| File | Purpose | Key Types |
|------|---------|-----------|
| `filter.ts` | Filter types | `FilterValue`, `BaseFilterOption` |
| `shapeTypes.ts` | Annotation shapes | `ObjectShapeType` |
| `browseData.ts` | Browse page tabs | `BrowseDataTab` |
| `download.ts` | Download flow | `DownloadTab`, `DownloadStep`, `DownloadConfig` |
| `table.ts` | Table data structures | `TableData`, `TableDataValue` |
| `state.ts` | Jotai state types | `AtomTupleWithValue` |
| `context.ts` | Context types | `ServerContext` |
| `logging.ts` | Logging types | `LogLevel`, `LogEntry`, `LogApiResponse` |
| `deposition.ts` | Deposition data | `RunData`, `AnnotationRowData`, `TomogramRowData` |
| `depositionTypes.ts` | Deposition enums | `DepositionType`, `GroupByOption` |
| `api-responses.ts` | API responses | `PaginatedResponse`, `ApiErrorResponse` |
| `authorInfo.ts` | Author data | `AuthorInfoType` |
| `breadcrumbs.ts` | Navigation | `BreadcrumbType` |
| `i18n.ts` | Internationalization | `I18nKeys` |
| `utils.ts` | Utility types | Helper types |

---

## Filter Types

**Location:** `/packages/data-portal/app/types/filter.ts`

Types for filtering data in browse and search interfaces.

### Base Filter Option

Generic filter option interface extending SDS autocomplete.

```typescript
export interface BaseFilterOption<T extends string = string>
  extends Omit<DefaultAutocompleteOption, 'name'> {
  value: T
  label?: string
}
```

### Filter Values

Union type representing all possible filter value types.

```typescript
export type FilterValue =
  | string
  | null
  | string[]
  | BaseFilterOption
  | BaseFilterOption[]
```

### Number of Runs Filter

```typescript
export type NumberOfRunsFilterValue =
  | '>1'
  | '>5'
  | '>10'
  | '>20'
  | '>50'
  | '>100'

export type NumberOfRunsFilterOption =
  BaseFilterOption<NumberOfRunsFilterValue>
```

### Available Files Filter

```typescript
export type AvailableFilesFilterValue =
  | 'annotation'
  | 'tomogram'
  | 'raw-frames'
  | 'tilt-series'
  | 'ctf'
  | 'tilt-series-alignment'

export type AvailableFilesFilterOption =
  BaseFilterOption<AvailableFilesFilterValue>
```

### Fiducial Alignment Status Filter

```typescript
export type FiducialAlignmentStatusFilterValue = 'true' | 'false'

export type FiducialAlignmentStatusFilterOption =
  BaseFilterOption<FiducialAlignmentStatusFilterValue>
```

---

## Shape Types

**Location:** `/packages/data-portal/app/types/shapeTypes.ts`

Annotation object shape types.

```typescript
export type ObjectShapeType =
  | 'InstanceSegmentation'
  | 'OrientedPoint'
  | 'Point'
  | 'SegmentationMask'
```

**Note:** These align with GraphQL enum `Annotation_File_Shape_Type_Enum`.

---

## Browse Data Types

**Location:** `/packages/data-portal/app/types/browseData.ts`

Types for the browse data pages.

```typescript
export enum BrowseDataTab {
  Datasets = 'datasets',
  Depositions = 'depositions',
  Runs = 'runs',
}
```

| Tab | Description |
|-----|-------------|
| `Datasets` | Browse datasets page |
| `Depositions` | Browse depositions page |
| `Runs` | Browse runs page |

---

## Download Types

**Location:** `/packages/data-portal/app/types/download.ts`

Types for the download flow UI.

### Download Tab

```typescript
export enum DownloadTab {
  API = 'api',
  AWS = 'aws',
  Curl = 'curl',
  Download = 'download',
  PortalCLI = 'portal-cli',
}
```

| Tab | Description |
|-----|-------------|
| `API` | Python API download instructions |
| `AWS` | AWS CLI download instructions |
| `Curl` | cURL download commands |
| `Download` | Direct download interface |
| `PortalCLI` | Portal CLI instructions |

### Download Step

```typescript
export enum DownloadStep {
  Configure = 'configure',
  Download = 'download',
}
```

| Step | Description |
|------|-------------|
| `Configure` | Configuration/selection step |
| `Download` | Download execution step |

### Download Config

```typescript
export enum DownloadConfig {
  AllAnnotations = 'all-annotations',
  Tomogram = 'tomogram',
}
```

| Config | Description |
|--------|-------------|
| `AllAnnotations` | Download all annotations for run |
| `Tomogram` | Download single tomogram |

---

## Table Types

**Location:** `/packages/data-portal/app/types/table.ts`

Types for table data structures and rendering.

### Table Data Value

```typescript
export type TableDataValue = string | number
```

### Table Data

Interface for table row data with optional custom rendering.

```typescript
export interface TableData {
  className?: string
  inline?: boolean
  label: string
  labelExtra?: ReactNode
  subLabel?: ReactNode
  labelTooltip?: ReactNode
  labelTooltipProps?: Partial<TooltipProps>
  renderValue?(value: TableDataValue): ReactNode
  renderValues?(values: TableDataValue[]): ReactNode
  values: TableDataValue[] | (() => TableDataValue[])
  fullWidth?: boolean  // Spans both columns when true
}
```

| Property | Type | Description |
|----------|------|-------------|
| `className` | `string?` | CSS class for row |
| `inline` | `boolean?` | Inline layout flag |
| `label` | `string` | Primary label text |
| `labelExtra` | `ReactNode?` | Extra content after label |
| `subLabel` | `ReactNode?` | Secondary label text |
| `labelTooltip` | `ReactNode?` | Tooltip content |
| `labelTooltipProps` | `Partial<TooltipProps>?` | Tooltip props |
| `renderValue` | `function?` | Custom single value renderer |
| `renderValues` | `function?` | Custom multi-value renderer |
| `values` | `TableDataValue[] \| (() => TableDataValue[])` | Data values |
| `fullWidth` | `boolean?` | Single cell spanning both columns |

---

## State Types

**Location:** `/packages/data-portal/app/types/state.ts`

Types for Jotai state management.

### Atom Tuple with Value

Type for Jotai atom hydration.

```typescript
import { WritableAtom } from 'jotai'

type AnyWritableAtom = WritableAtom<unknown, any[], any>

export type AtomTupleWithValue<A = AnyWritableAtom, V = unknown> = readonly [
  A,
  V,
]
```

**Usage:**
```typescript
import { useHydrateAtoms } from 'jotai/utils'
import { AtomTupleWithValue } from 'app/types/state'

function MyComponent({ initialValues }: { initialValues: AtomTupleWithValue[] }) {
  useHydrateAtoms(initialValues)
  // ...
}
```

---

## Context Types

**Location:** `/packages/data-portal/app/types/context.ts`

Types for Remix context objects.

### Server Context

Extended context with client IP for server-side code.

```typescript
import { AppLoadContext } from '@remix-run/server-runtime'

export interface ServerContext extends AppLoadContext {
  clientIp: string
}
```

**Usage:**
```typescript
// In loader or action
export async function action({ context }: ActionFunctionArgs) {
  const { clientIp } = context as ServerContext
  // Use clientIp...
}
```

---

## Logging Types

**Location:** `/packages/data-portal/app/types/logging.ts`

Types for client-side logging API.

### Log Level

```typescript
export enum LogLevel {
  Log = 'log',
  Debug = 'debug',
  Error = 'error',
  Info = 'info',
  Warn = 'warn',
  Trace = 'trace',
}
```

### Log Entry

```typescript
export interface LogEntry {
  level: LogLevel
  messages: any[]
}
```

### Log API Request

```typescript
export interface LogApiRequestBody {
  logs: LogEntry[]
}
```

### Log API Response

```typescript
export interface LogApiErrorResponse {
  status: 'error'
  error: string
}

export interface LogApiSuccessResponse {
  status: 'ok'
}

export type LogApiResponse = LogApiSuccessResponse | LogApiErrorResponse
```

**Usage:**
```typescript
const logs: LogEntry[] = [
  { level: LogLevel.Error, messages: ['Error occurred', errorObject] },
  { level: LogLevel.Info, messages: ['Info message'] },
]

const response = await fetch('/api/logs', {
  method: 'POST',
  body: JSON.stringify({ logs }),
})
```

---

## Deposition Types

**Location:** `/packages/data-portal/app/types/deposition.ts`

Types for deposition data structures.

### Run Data

Generic run data with items.

```typescript
export interface RunData<T> {
  id: number
  runName: string
  items: T[]
  annotationCount?: number
  tomogramCount?: number
}
```

### Deposited Location Data

Data grouped by deposited location.

```typescript
export interface DepositedLocationData<T> {
  depositedLocation: string
  runs: RunData<T>[]
}
```

### Annotation Row Data

Annotation table row structure.

```typescript
export interface AnnotationRowData {
  id: number
  annotationName: string
  shapeType: string
  methodType: string
  depositedIn: string
  depositedLocation: string
  runName: string
  objectName?: string
  confidence?: number
  description?: string
  fileFormat?: string
  s3Path?: string
  groundTruthStatus?: boolean
}
```

### Tomogram Row Data

Tomogram table row structure.

```typescript
export interface TomogramRowData {
  id: number
  name: string
  depositedIn: string
  depositedLocation: string
  runName: string
  keyPhotoUrl?: string
  voxelSpacing: number
  reconstructionMethod: string
  processing: string
  neuroglancerConfig?: string
}
```

---

## Deposition Type Enums

**Location:** `/packages/data-portal/app/types/depositionTypes.ts`

Enums for deposition-related filtering and grouping.

### Deposition Type

```typescript
export enum DepositionType {
  Dataset = 'dataset',
  Annotation = 'annotation',
}
```

### Group By Option

```typescript
export enum GroupByOption {
  None = 'none',
  DepositedLocation = 'deposited_location',
  Organism = 'organism',
}
```

---

## API Response Types

**Location:** `/packages/data-portal/app/types/api-responses.ts`

Standard API response structures for internal endpoints.

### Run Counts Response

```typescript
export interface RunCountsResponse {
  runCounts: Record<number, number>
}
```

### Dataset Option

```typescript
export interface DatasetOption {
  id: number
  title: string
  organismName: string | null
}
```

### Deposition Datasets Response

```typescript
export interface DepositionDatasetsResponse {
  datasets: DatasetOption[]
  organismCounts: Record<string, number>
  annotationCounts: Record<number, number>
  tomogramCounts: Record<number, number>
}
```

### Paginated Response

Generic paginated data response.

```typescript
export interface PaginatedResponse<T> {
  data: T
  pagination?: {
    page: number
    pageSize: number
    total?: number
  }
}
```

### Annotations Response

```typescript
export interface AnnotationsResponse {
  data: GetDepositionAnnotationsQuery['annotationShapes']
}
```

### Tomograms Response

```typescript
export interface TomogramsResponse {
  data: GetDepositionTomogramsQuery['tomograms']
}
```

### Items By Organism Response

```typescript
export interface ItemsByOrganismResponse {
  annotations?: GetDepositionAnnotationsQuery['annotationShapes']
  tomograms?: GetDepositionTomogramsQuery['tomograms']
}
```

### API Error Response

```typescript
export interface ApiErrorResponse {
  error: string
  message?: string
}
```

---

## Author Info

**Location:** `/packages/data-portal/app/types/authorInfo.ts`

Author metadata structure.

```typescript
export type AuthorInfoType = {
  correspondingAuthorStatus?: boolean | null
  email?: string | null
  name: string
  orcid?: string | null
  kaggleId?: string | null
  primaryAuthorStatus?: boolean | null
}
```

| Property | Type | Description |
|----------|------|-------------|
| `correspondingAuthorStatus` | `boolean?` | Is corresponding author |
| `email` | `string?` | Author email |
| `name` | `string` | Author name (required) |
| `orcid` | `string?` | ORCID identifier |
| `kaggleId` | `string?` | Kaggle ID |
| `primaryAuthorStatus` | `boolean?` | Is primary author |

---

## Breadcrumb Types

**Location:** `/packages/data-portal/app/types/breadcrumbs.ts`

Types for navigation breadcrumbs.

```typescript
export enum BreadcrumbType {
  AllDatasets = 'all-datasets',
  AllDepositions = 'all-depositions',
  SingleDataset = 'single-dataset',
  ReturnToDeposition = 'return-to-deposition',
}
```

---

## Utility Types

**Location:** `/packages/data-portal/app/types/utils.ts`

General utility types and helpers.

### Exhaustive Check

Utility function for exhaustive type checking in switch statements.

```typescript
export function checkExhaustive(value: never): never {
  throw new Error(`Unhandled value: ${value}`)
}
```

**Usage:**
```typescript
function handleShapeType(shape: ObjectShapeType) {
  switch (shape) {
    case 'Point':
      return 'point'
    case 'OrientedPoint':
      return 'oriented-point'
    case 'InstanceSegmentation':
      return 'instance-segmentation'
    case 'SegmentationMask':
      return 'segmentation-mask'
    default:
      return checkExhaustive(shape)  // Compile error if case missing
  }
}
```

---

## Type Best Practices

### Prefer Interfaces for Objects

Use interfaces for object shapes that may be extended:

```typescript
// Good ✅
export interface UserData {
  id: number
  name: string
}

// Less flexible
export type UserData = {
  id: number
  name: string
}
```

### Use Type for Unions

Use type aliases for union types:

```typescript
// Good ✅
export type FilterValue = string | null | string[]

// Not recommended
export interface FilterValue {
  // Can't represent unions with interfaces
}
```

### Use Enums for Fixed Sets

Use enums for fixed sets of related values:

```typescript
// Good ✅
export enum DownloadTab {
  API = 'api',
  AWS = 'aws',
  Curl = 'curl',
}

// Less type-safe
export type DownloadTab = 'api' | 'aws' | 'curl'
```

### Generic Types for Reusability

Use generics for reusable container types:

```typescript
// Good ✅
export interface PaginatedResponse<T> {
  data: T
  pagination?: PaginationInfo
}

// Less flexible
export interface PaginatedDatasetResponse {
  data: Dataset[]
  pagination?: PaginationInfo
}
```

### Document Complex Types

Add JSDoc comments to complex or non-obvious types:

```typescript
/**
 * Table data structure with optional custom rendering.
 * Use renderValue/renderValues for custom cell rendering,
 * otherwise values are rendered as-is.
 */
export interface TableData {
  label: string
  values: TableDataValue[]
  renderValue?(value: TableDataValue): ReactNode
}
```

---

## Next Steps

- [Query Parameters](./01-query-params.md) - URL parameter reference
- [Environment Variables](./02-environment-variables.md) - Environment configuration
- [Constants Reference](./03-constants-reference.md) - Application constants
- [GraphQL Schema](./05-graphql-schema.md) - GraphQL API types
