# Constants Reference

This document provides a comprehensive reference for all application constants defined in the CryoET Data Portal frontend. Constants are organized by category and stored in `/packages/data-portal/app/constants/`.


## Quick Reference

| File | Purpose | Key Constants |
|------|---------|---------------|
| `query.ts` | Query parameters | `QueryParams` enum |
| `filterQueryParams.ts` | Filter parameter groups | Dataset, Run, Annotation filters |
| `pagination.ts` | Pagination limits | `MAX_PER_PAGE`, `MAX_PER_ACCORDION_GROUP` |
| `table.ts` | Table column widths | Width configurations per table type |
| `idPrefixes.ts` | ID prefixes | Entity ID prefixes |
| `dataTypes.ts` | Data type enums | Dataset, Deposition, Run types |
| `siteLinks.ts` | Internal/external links | Navigation URLs |
| `external-dbs.ts` | External database configs | EMPIAR, EMDB, DOI patterns |
| `objectShapeTypes.ts` | Shape type mappings | Shape to i18n key mappings |
| `methodTypes.ts` | Method type configs | Method ordering and i18n keys |
| `tiltSeries.ts` | Tilt series constants | Quality scores, tilt ranges |
| `localStorage.ts` | LocalStorage keys | Banner dismissal, preferences |
| `tags.ts` | Feature tags | Competition tags |
| `testIds.ts` | Test identifiers | E2E test data-testid values |
| `error.ts` | Error constants | Log identifiers |

---

## Query Parameters

**Location:** `/packages/data-portal/app/constants/query.ts`

### QueryParams Enum

The canonical source for all URL query parameter keys.

```typescript
export enum QueryParams {
  // Filtering
  AnnotationId = 'annotation_id',
  AnnotationName = 'annotation_name',
  AnnotatedObjectsOnly = 'annotated_objects',
  AnnotationSoftware = 'annotation-software',
  AuthorName = 'author',
  AuthorOrcid = 'author_orcid',
  AvailableFiles = 'files',
  CameraManufacturer = 'camera_manufacturer',
  Competition = 'competition',
  DatasetId = 'dataset_id',
  DepositionId = 'deposition-id',
  EmdbId = 'emdb_id',
  EmpiarId = 'empiar_id',
  FiducialAlignmentStatus = 'fiducial_alignment',
  FileFormat = 'file-format',
  GroundTruthAnnotation = 'ground_truth',
  MethodType = 'method-type',
  NumberOfRuns = 'runs',
  ObjectId = 'object-id',
  ObjectName = 'object',
  ObjectShapeType = 'object_shape',
  Organism = 'organism',
  QualityScore = 'quality_score',
  ReconstructionMethod = 'reconstruction_method',
  ReconstructionSoftware = 'reconstruction_software',
  TiltRangeMax = 'tilt_max',
  TiltRangeMin = 'tilt_min',
  TomogramProcessing = 'tomogram-processing',
  TomogramSampling = 'tomogram-sampling',

  // Pagination
  AnnotationsPage = 'annotations-page',
  Page = 'page',
  TomogramsPage = 'tomograms-page',

  // Navigation
  DepositionTab = 'deposition-tab',
  DownloadConfig = 'download-config',
  DownloadStep = 'download-step',
  DownloadTab = 'download-tab',
  DownloadTomogramId = 'download-tomogram',
  From = 'from',
  MetadataDrawer = 'metadata',
  MethodSummaryTab = 'method-summary-tab',
  ReferenceTomogramId = 'ref-tomogram',
  Search = 'search',
  ShowTour = 'showTour',
  Sort = 'sort',
  Tab = 'tab',
  TableTab = 'table-tab',

  // Feature flags
  EnableFeature = 'enable-feature',
  DisableFeature = 'disable-feature',
  GroupBy = 'group-by',
}
```

### FromLocationKey Enum

Navigation source location identifiers.

```typescript
export enum FromLocationKey {
  DepositionAnnotations = 'deposition-annotations',
  DepositionTomograms = 'deposition-tomograms',
}
```

See [Query Parameters Reference](./01-query-params.md) for detailed documentation.

---

## Filter Parameters

**Location:** `/packages/data-portal/app/constants/filterQueryParams.ts`

Filter parameter groups used by different pages.

| Constant | Parameters Count | Used By |
|----------|------------------|---------|
| `DATASET_FILTERS` | 18 | Dataset browse, search |
| `RUN_FILTERS` | 9 | Run browse |
| `ANNOTATION_FILTERS` | 7 | Annotation browse |
| `DEPOSITION_FILTERS` | 17 | Deposition browse |
| `SYSTEM_PARAMS` | 3 | System-wide |

**Example:**
```typescript
export const DATASET_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.AvailableFiles,
  QueryParams.NumberOfRuns,
  // ... more filters
] as const

export const SYSTEM_PARAMS = [
  QueryParams.EnableFeature,
  QueryParams.DisableFeature,
  QueryParams.From,
] as QueryParams[]
```

---

## Pagination

**Location:** `/packages/data-portal/app/constants/pagination.ts`

### Page Size Limits

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_PER_PAGE` | 20 | Standard page size for tables |
| `MAX_PER_ACCORDION_GROUP` | 10 | Items per accordion group |
| `MAX_PER_FULLY_OPEN_ACCORDION` | 5 | Items inside expanded accordion |
| `ANNOTATED_OBJECTS_MAX` | 4 | Max annotated objects to display for dataset |

**Example usage:**
```typescript
import { MAX_PER_PAGE } from 'app/constants/pagination'

const { data } = await query({
  variables: {
    limit: MAX_PER_PAGE,
    offset: (page - 1) * MAX_PER_PAGE,
  },
})
```

---

## Table Column Widths

**Location:** `/packages/data-portal/app/constants/table.ts`

Column width configurations for different table types. All values in pixels.

### Width Configuration Type

```typescript
export type TableColumnWidth = {
  max?: number
  min?: number
  width?: number  // Explicit width prevents column growth
}
```

### Dataset Table Widths

```typescript
export const DatasetTableWidths = {
  photo: { min: 150, max: 150, width: 150 },
  id: { min: 450, max: 800 },
  empiarId: { min: 120, max: 130 },
  organismName: { min: 100, max: 400 },
  runs: { min: 70, max: 100 },
  annotatedObjects: { min: 150, max: 400 },
}
```

### Annotation Table Widths

```typescript
export const AnnotationTableWidths = {
  id: { min: 250 },
  confidenceCell: { min: 81, max: 120 },
  depositionDate: { min: 91, max: 120 },
  objectName: { min: 120, max: 250 },
  shapeType: { width: 150 },
  methodType: { min: 81, max: 120 },
  actions: { min: 120, max: 120 },
}
```

### Tomogram Table Widths

```typescript
export const TomogramTableWidths = {
  photo: { min: 150, max: 150, width: 150 },
  name: { min: 250 },
  depositionDate: { max: 155 },
  alignment: { max: 120 },
  voxelSpacing: { max: 200 },
  reconstructionMethod: { max: 200 },
  postProcessing: { max: 200 },
  actions: { width: 164 },
}
```

### Run Table Widths

```typescript
export const RunTableWidths = {
  photo: { min: 150, max: 150, width: 150 },
  name: { min: 400 },
  tiltSeriesQuality: { min: 183, max: 210 },
  annotatedObjects: { min: 250, max: 400 },
  actions: { min: 175, max: 200 },
}
```

### Deposition Table Widths

```typescript
export const DepositionTableWidths = {
  photo: { min: 150, max: 150, width: 150 },
  id: { width: 500 },
  depositionDate: { width: 160 },
  annotations: { min: 120, max: 200 },
  annotatedObjects: { min: 140, max: 400 },
  objectShapeTypes: { min: 120, max: 200 },
  dataTypesAndCounts: { width: 184 },
}
```

### Deposition Page Dataset Table Widths

```typescript
export const DepositionPageDatasetTableWidths = {
  photo: { min: 150, max: 150, width: 150 },
  id: { min: 300, max: 800 },
  organism: { min: 100, max: 400 },
  runs: { min: 120, max: 200 },
  annotations: { min: 120, max: 200 },
  annotatedObjects: { min: 120, max: 400 },
}
```

### Method Summary Tables

```typescript
export const AnnotationMethodTableWidths = {
  count: { width: 72 },
  methodType: { width: 80 },
  methodDetails: { width: 360 },
  methodLinks: { width: 280 },
}

export const TomogramMethodTableWidths = {
  count: { width: 72 },
  voxelSpacing: { width: 85 },
  reconstructionMethod: { width: 138 },
  postProcessing: { width: 96 },
  ctfCorrected: { width: 89 },
}

export const AcquisitionMethodTableWidths = {
  microscope: { width: 108 },
  camera: { width: 94 },
  tiltingScheme: { width: 100 },
  pixelSize: { width: 57 },
  energyFilter: { width: 72 },
  electronOptics: { width: 125 },
  phasePlate: { width: 23 },
}

export const ExperimentalConditionsTableWidths = {
  sampleType: { width: 100 },
  samplePreparation: { width: 160 },
  gridPreparation: { width: 120 },
  runs: { width: 100 },
}
```

### Deposition Content Tables

```typescript
export const DepositionAnnotationTableWidths = {
  name: { width: 350 },
  objectShapeType: { width: 160 },
  methodType: { width: 160 },
  depositedIn: { width: 340 },
}

export const DepositionTomogramTableWidths = {
  photo: { min: 150, max: 150, width: 150 },
  name: { width: 200 },
  voxelSpacing: { width: 160 },
  reconstructionMethod: { width: 142 },
  postProcessing: { width: 120 },
  depositedIn: { width: 230 },
  actions: { width: 158 },
}
```

---

## ID Prefixes

**Location:** `/packages/data-portal/app/constants/idPrefixes.ts`

Entity ID prefixes used for identifying different data types.

```typescript
export enum IdPrefix {
  Alignment = 'AL',
  Annotation = 'AN',
  Dataset = 'DS',
  Deposition = 'CZCDP',
  Run = 'RN',
  TiltSeries = 'TS',
  Tomogram = 'TM',
}
```

| Prefix | Entity Type | Example |
|--------|-------------|---------|
| `AL` | Alignment | AL-12345 |
| `AN` | Annotation | AN-67890 |
| `DS` | Dataset | DS-10001 |
| `CZCDP` | Deposition | CZCDP-123 |
| `RN` | Run | RN-456 |
| `TS` | Tilt Series | TS-789 |
| `TM` | Tomogram | TM-1011 |

---

## Data Types

**Location:** `/packages/data-portal/app/constants/dataTypes.ts`

High-level data type categorization.

```typescript
export enum DATA_TYPES {
  DATASET = 'DATASET',
  DEPOSITION = 'DEPOSITION',
  RUN = 'RUN',
}
```

---

## Site Links

**Location:** `/packages/data-portal/app/constants/siteLinks.ts`

Internal and external navigation URLs.

```typescript
export enum SITE_LINKS {
  HOME = '/',
  COMPETITION = '/competition',
  BROWSE_DATA_DATASETS = '/browse-data/datasets',
  FAQ = 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_faq.html',
  PRIVACY = '/privacy',
  DATA_SUBMISSION_POLICY = '/data-submission-policy',
  DOCUMENTATION = 'https://chanzuckerberg.github.io/cryoet-data-portal',
  GROUND_TRUTH_FLAG_DOCS = 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_data.html#ground-truth-flag',
}
```

| Link | Type | Purpose |
|------|------|---------|
| `HOME` | Internal | Homepage |
| `COMPETITION` | Internal | Competition page |
| `BROWSE_DATA_DATASETS` | Internal | Dataset browse page |
| `FAQ` | External | Documentation FAQ |
| `PRIVACY` | Internal | Privacy policy |
| `DATA_SUBMISSION_POLICY` | Internal | Submission policy |
| `DOCUMENTATION` | External | Main documentation |
| `GROUND_TRUTH_FLAG_DOCS` | External | Ground truth flag docs |

---

## External Databases

**Location:** `/packages/data-portal/app/constants/external-dbs.ts`

Configuration for external database identifiers and URLs.

### Regular Expressions

```typescript
export const EMPIAR_ID = /EMPIAR-([\d]+)/
export const EMDB_ID = /EMD-([\d]+)/
export const DOI_ID = /(10\..+\/.+)/
```

### URLs

```typescript
export const EMPIAR_URL = 'https://www.ebi.ac.uk/empiar/'
export const EMDB_URL = 'https://www.ebi.ac.uk/emdb/'
export const DOI_URL = 'https://doi.org/'
```

### Labels

```typescript
export const EMPIAR_LABEL = 'EMPIAR ID'
export const EMDB_LABEL = 'EMDB ID'
export const DOI_LABEL = 'DOI'
```

### Database Type Enum

```typescript
export enum DatabaseType {
  EMPIAR,
  EMDB,
  DOI,
}
```

### Lookup Maps

```typescript
export const REGEX_MAP = new Map([
  [DatabaseType.EMPIAR, EMPIAR_ID],
  [DatabaseType.EMDB, EMDB_ID],
  [DatabaseType.DOI, DOI_ID],
])

export const URL_MAP = new Map([
  [DatabaseType.EMPIAR, EMPIAR_URL],
  [DatabaseType.EMDB, EMDB_URL],
  [DatabaseType.DOI, DOI_URL],
])

export const LABEL_MAP = new Map([
  [DatabaseType.EMPIAR, EMPIAR_LABEL],
  [DatabaseType.EMDB, EMDB_LABEL],
  [DatabaseType.DOI, DOI_LABEL],
])
```

**Usage example:**
```typescript
import { DatabaseType, REGEX_MAP, URL_MAP } from 'app/constants/external-dbs'

const empiarRegex = REGEX_MAP.get(DatabaseType.EMPIAR)
const match = text.match(empiarRegex)
if (match) {
  const url = `${URL_MAP.get(DatabaseType.EMPIAR)}${match[1]}`
}
```

---

## Object Shape Types

**Location:** `/packages/data-portal/app/constants/objectShapeTypes.ts`

Mapping shape types to internationalization keys.

### Shape Type to i18n Key Function

```typescript
export function getShapeTypeI18nKey(
  shapeType: Annotation_File_Shape_Type_Enum,
): I18nKeys {
  switch (shapeType) {
    case Annotation_File_Shape_Type_Enum.InstanceSegmentation:
      return 'instanceSegmentation'
    case Annotation_File_Shape_Type_Enum.OrientedPoint:
      return 'orientedPoint'
    case Annotation_File_Shape_Type_Enum.Point:
      return 'point'
    case Annotation_File_Shape_Type_Enum.SegmentationMask:
      return 'segmentationMask'
    case Annotation_File_Shape_Type_Enum.Mesh:
      return 'mesh'
    default:
      return checkExhaustive(shapeType)
  }
}
```

---

## Method Types

**Location:** `/packages/data-portal/app/constants/methodTypes.ts`

Configuration for annotation method types.

### Method Type Order

```typescript
export const METHOD_TYPE_ORDER = [
  Annotation_Method_Type_Enum.Hybrid,
  Annotation_Method_Type_Enum.Automated,
  Annotation_Method_Type_Enum.Simulated,
  Annotation_Method_Type_Enum.Manual,
]
```

### Method Type Label i18n

```typescript
export function getMethodTypeLabelI18nKey(
  methodType: Annotation_Method_Type_Enum,
): I18nKeys {
  switch (methodType) {
    case Annotation_Method_Type_Enum.Automated:
      return 'automated'
    case Annotation_Method_Type_Enum.Hybrid:
      return 'hybrid'
    case Annotation_Method_Type_Enum.Manual:
      return 'manual'
    case Annotation_Method_Type_Enum.Simulated:
      return 'simulated'
  }
}
```

### Method Type Tooltip i18n

```typescript
export function getMethodTypeTooltipI18nKey(
  methodType: Annotation_Method_Type_Enum,
): I18nKeys {
  switch (methodType) {
    case Annotation_Method_Type_Enum.Automated:
      return 'methodTypeAutomated'
    case Annotation_Method_Type_Enum.Hybrid:
      return 'methodTypeHybrid'
    case Annotation_Method_Type_Enum.Manual:
      return 'methodTypeManual'
    case Annotation_Method_Type_Enum.Simulated:
      return 'methodTypeSimulated'
  }
}
```

---

## Tilt Series

**Location:** `/packages/data-portal/app/constants/tiltSeries.ts`

Constants related to tilt series data.

### Quality Scores

```typescript
export enum TiltSeriesScore {
  VeryPoor = 1,
  Poor = 2,
  Moderate = 3,
  Good = 4,
  Excellent = 5,
}
```

| Score | Label | Value |
|-------|-------|-------|
| Very Poor | `TiltSeriesScore.VeryPoor` | 1 |
| Poor | `TiltSeriesScore.Poor` | 2 |
| Moderate | `TiltSeriesScore.Moderate` | 3 |
| Good | `TiltSeriesScore.Good` | 4 |
| Excellent | `TiltSeriesScore.Excellent` | 5 |

### Tilt Range Defaults

```typescript
export const DEFAULT_TILT_RANGE_MIN = 0
export const DEFAULT_TILT_RANGE_MAX = 180
```

---

## Local Storage Keys

**Location:** `/packages/data-portal/app/constants/localStorage.ts`

Keys for browser localStorage persistence.

```typescript
export enum LocalStorageKeys {
  CompetitionEndingBannerDismissed = 'competition-ending-banner-dismissed',
  CompetitionSurveyBannerDismissed = 'competition-survey-banner-dismissed',
  PolicyBannerDismissed = 'policy-banner-dismissed',
  SurveyBannerDismissed = 'survey-banner-dismissed',
  NeuroglancerBannerDismissed = 'neuroglancer-banner-dismissed',
  TableRenderErrorPageReloadCount = 'table-render-error-page-reload-count',
  PythonV3DeprecatedDismissed = 'deprecation-dismissed',

  // DEPRECATED - DO NOT USE
  CompetitionBannerDismissed = 'competition-banner-dismissed',
}
```

| Key | Purpose | Type |
|-----|---------|------|
| `CompetitionEndingBannerDismissed` | Track competition ending banner dismissal | boolean |
| `CompetitionSurveyBannerDismissed` | Track competition survey banner dismissal | boolean |
| `PolicyBannerDismissed` | Track policy banner dismissal | boolean |
| `SurveyBannerDismissed` | Track survey banner dismissal | boolean |
| `NeuroglancerBannerDismissed` | Track Neuroglancer banner dismissal | boolean |
| `TableRenderErrorPageReloadCount` | Count page reloads on table errors | number |
| `PythonV3DeprecatedDismissed` | Track Python v3 deprecation notice dismissal | boolean |

**Usage example:**
```typescript
import { LocalStorageKeys } from 'app/constants/localStorage'

// Set
localStorage.setItem(LocalStorageKeys.PolicyBannerDismissed, 'true')

// Get
const dismissed = localStorage.getItem(LocalStorageKeys.PolicyBannerDismissed) === 'true'
```

---

## Tags

**Location:** `/packages/data-portal/app/constants/tags.ts`

Feature tags for special content.

```typescript
export const Tags = {
  MLCompetition2024: 'competitionML2024Winners',
}
```

---

## Error Constants

**Location:** `/packages/data-portal/app/constants/error.ts`

Error logging identifiers.

```typescript
export const TABLE_PAGE_LAYOUT_LOG_ID = 'table-page-layout'
```

---

## Usage Best Practices

### Import from Constants

Always import from constants files rather than hardcoding values:

```typescript
// Good ✅
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'

const limit = MAX_PER_PAGE
const pageParam = QueryParams.Page

// Bad ❌
const limit = 20
const pageParam = 'page'
```

### Type Safety

Use enums for type-safe constant access:

```typescript
// Good ✅
import { IdPrefix } from 'app/constants/idPrefixes'

function formatId(type: IdPrefix, id: number): string {
  return `${type}-${id}`
}

// Bad ❌
function formatId(type: string, id: number): string {
  return `${type}-${id}`
}
```

### Documentation

When adding new constants:
1. Add to appropriate constants file
2. Export properly
3. Add JSDoc comments if behavior is non-obvious
4. Update this reference document

---

## Next Steps

- [Query Parameters](./01-query-params.md) - URL parameter reference
- [Environment Variables](./02-environment-variables.md) - Environment configuration
- [Type Definitions](./04-type-definitions.md) - TypeScript types
- [GraphQL Schema](./05-graphql-schema.md) - GraphQL API types
