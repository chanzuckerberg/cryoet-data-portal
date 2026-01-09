# Query Parameters Reference

This document provides a comprehensive reference for all URL query parameters used throughout the CryoET Data Portal frontend. These parameters control filtering, pagination, navigation state, and UI behavior.


## Quick Reference

| Parameter | Type | Purpose | Values |
|-----------|------|---------|--------|
| `annotation_id` | number | Filter by annotation ID | Numeric ID |
| `annotation_name` | string | Filter by annotation name | Text search |
| `annotated_objects` | boolean | Show only annotated objects | `true`/`false` |
| `annotation-software` | string | Filter by annotation software | Software name |
| `annotations-page` | number | Pagination for annotations | Page number |
| `author` | string | Filter by author name | Author name |
| `author_orcid` | string | Filter by author ORCID | ORCID identifier |
| `files` | string | Filter by available file types | See Available Files |
| `camera_manufacturer` | string | Filter by camera manufacturer | Manufacturer name |
| `competition` | string | Filter competition entries | Competition ID |
| `dataset_id` | number | Filter by dataset ID | Numeric ID |
| `deposition-id` | number | Filter by deposition ID | Numeric ID |
| `deposition-tab` | string | Active deposition tab | Tab name |
| `download-config` | string | Download configuration | See Download Config |
| `download-step` | string | Download flow step | `configure`/`download` |
| `download-tab` | string | Active download tab | See Download Tab |
| `download-tomogram` | number | Selected tomogram for download | Tomogram ID |
| `emdb_id` | string | Filter by EMDB ID | EMDB identifier |
| `empiar_id` | string | Filter by EMPIAR ID | EMPIAR identifier |
| `fiducial_alignment` | boolean | Filter by fiducial alignment | `true`/`false` |
| `file-format` | string | Filter by file format | Format string |
| `from` | string | Navigation source location | See From Location |
| `ground_truth` | boolean | Filter ground truth annotations | `true`/`false` |
| `metadata` | boolean | Show metadata drawer | `true`/`false` |
| `method-summary-tab` | string | Active method summary tab | Tab name |
| `method-type` | string | Filter by annotation method | See Method Types |
| `runs` | string | Filter by number of runs | `>1`, `>5`, `>10`, etc. |
| `object-id` | string | Filter by object ID | Object identifier |
| `object` | string | Filter by object name | Object name |
| `object_shape` | string | Filter by shape type | See Shape Types |
| `organism` | string | Filter by organism | Organism name |
| `page` | number | Current page number | Page number |
| `quality_score` | number | Filter by quality score | 1-5 |
| `reconstruction_method` | string | Filter by reconstruction method | Method name |
| `reconstruction_software` | string | Filter by reconstruction software | Software name |
| `ref-tomogram` | number | Reference tomogram ID | Tomogram ID |
| `search` | string | Global search query | Search text |
| `showTour` | boolean | Show UI tour | `true`/`false` |
| `sort` | string | Sort order | Sort field |
| `tab` | string | Active tab | Tab name |
| `table-tab` | string | Active table tab | Tab name |
| `tilt_max` | number | Maximum tilt angle | Angle in degrees |
| `tilt_min` | number | Minimum tilt angle | Angle in degrees |
| `tomogram-processing` | string | Tomogram processing method | Processing type |
| `tomogram-sampling` | number | Tomogram sampling rate | Numeric value |
| `tomograms-page` | number | Pagination for tomograms | Page number |
| `enable-feature` | string | Enable feature flag | Feature name |
| `disable-feature` | string | Disable feature flag | Feature name |
| `group-by` | string | Group results by field | See Group By Options |

---

## QueryParams Enum

The `QueryParams` enum is the canonical source for all query parameter keys used in the application.

**Location:** `/packages/data-portal/app/constants/query.ts`

```typescript
export enum QueryParams {
  AnnotationId = 'annotation_id',
  AnnotationName = 'annotation_name',
  AnnotatedObjectsOnly = 'annotated_objects',
  AnnotationSoftware = 'annotation-software',
  AnnotationsPage = 'annotations-page',
  AuthorName = 'author',
  AuthorOrcid = 'author_orcid',
  AvailableFiles = 'files',
  CameraManufacturer = 'camera_manufacturer',
  Competition = 'competition',
  DatasetId = 'dataset_id',
  DepositionId = 'deposition-id',
  DepositionTab = 'deposition-tab',
  DownloadConfig = 'download-config',
  DownloadStep = 'download-step',
  DownloadTab = 'download-tab',
  DownloadTomogramId = 'download-tomogram',
  EmdbId = 'emdb_id',
  EmpiarId = 'empiar_id',
  FiducialAlignmentStatus = 'fiducial_alignment',
  FileFormat = 'file-format',
  From = 'from',
  GroundTruthAnnotation = 'ground_truth',
  MetadataDrawer = 'metadata',
  MethodSummaryTab = 'method-summary-tab',
  MethodType = 'method-type',
  NumberOfRuns = 'runs',
  ObjectId = 'object-id',
  ObjectName = 'object',
  ObjectShapeType = 'object_shape',
  Organism = 'organism',
  Page = 'page',
  QualityScore = 'quality_score',
  ReconstructionMethod = 'reconstruction_method',
  ReconstructionSoftware = 'reconstruction_software',
  ReferenceTomogramId = 'ref-tomogram',
  Search = 'search',
  ShowTour = 'showTour',
  Sort = 'sort',
  Tab = 'tab',
  TableTab = 'table-tab',
  TiltRangeMax = 'tilt_max',
  TiltRangeMin = 'tilt_min',
  TomogramProcessing = 'tomogram-processing',
  TomogramSampling = 'tomogram-sampling',
  TomogramsPage = 'tomograms-page',
  EnableFeature = 'enable-feature',
  DisableFeature = 'disable-feature',
  GroupBy = 'group-by',
}
```

---

## Filter Parameter Groups

Different pages use different subsets of query parameters for filtering. These are organized into filter groups.

**Location:** `/packages/data-portal/app/constants/filterQueryParams.ts`

### Dataset Filters

Used on dataset browse and search pages.

```typescript
const DATASET_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.AvailableFiles,
  QueryParams.NumberOfRuns,
  QueryParams.DatasetId,
  QueryParams.AuthorName,
  QueryParams.AuthorOrcid,
  QueryParams.Organism,
  QueryParams.CameraManufacturer,
  QueryParams.TiltRangeMin,
  QueryParams.TiltRangeMax,
  QueryParams.FiducialAlignmentStatus,
  QueryParams.ReconstructionMethod,
  QueryParams.ReconstructionSoftware,
  QueryParams.ObjectName,
  QueryParams.ObjectShapeType,
  QueryParams.AnnotatedObjectsOnly,
  QueryParams.EmpiarId,
  QueryParams.EmdbId,
  QueryParams.DepositionId,
] as const
```

### Run Filters

Used on run browse pages.

```typescript
const RUN_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.QualityScore,
  QueryParams.TiltRangeMin,
  QueryParams.TiltRangeMax,
  QueryParams.ObjectId,
  QueryParams.ObjectName,
  QueryParams.ObjectShapeType,
  QueryParams.AnnotatedObjectsOnly,
  QueryParams.DepositionId,
] as const
```

### Annotation Filters

Used on annotation browse pages.

```typescript
const ANNOTATION_FILTERS = [
  QueryParams.AuthorName,
  QueryParams.AuthorOrcid,
  QueryParams.ObjectName,
  QueryParams.ObjectId,
  QueryParams.ObjectShapeType,
  QueryParams.MethodType,
  QueryParams.AnnotationSoftware,
] as const
```

### Deposition Filters

Used on deposition browse pages.

```typescript
const DEPOSITION_FILTERS = [
  QueryParams.GroundTruthAnnotation,
  QueryParams.AvailableFiles,
  QueryParams.NumberOfRuns,
  QueryParams.DatasetId,
  QueryParams.AuthorName,
  QueryParams.AuthorOrcid,
  QueryParams.Organism,
  QueryParams.CameraManufacturer,
  QueryParams.TiltRangeMin,
  QueryParams.TiltRangeMax,
  QueryParams.FiducialAlignmentStatus,
  QueryParams.ReconstructionMethod,
  QueryParams.ReconstructionSoftware,
  QueryParams.ObjectName,
  QueryParams.ObjectShapeType,
  QueryParams.AnnotatedObjectsOnly,
  QueryParams.ObjectId,
] as const
```

### System Parameters

System-level parameters that control feature flags and navigation.

```typescript
const SYSTEM_PARAMS = [
  QueryParams.EnableFeature,
  QueryParams.DisableFeature,
  QueryParams.From,
] as QueryParams[]
```

---

## Enumerated Values

### Available Files

Filter values for `QueryParams.AvailableFiles`:

| Value | Description |
|-------|-------------|
| `annotation` | Annotation files available |
| `tomogram` | Tomogram files available |
| `raw-frames` | Raw frame files available |
| `tilt-series` | Tilt series files available |
| `ctf` | CTF (Contrast Transfer Function) files available |
| `tilt-series-alignment` | Tilt series alignment files available |

**Type definition:**
```typescript
type AvailableFilesFilterValue =
  | 'annotation'
  | 'tomogram'
  | 'raw-frames'
  | 'tilt-series'
  | 'ctf'
  | 'tilt-series-alignment'
```

### Number of Runs

Filter values for `QueryParams.NumberOfRuns`:

| Value | Description |
|-------|-------------|
| `>1` | More than 1 run |
| `>5` | More than 5 runs |
| `>10` | More than 10 runs |
| `>20` | More than 20 runs |
| `>50` | More than 50 runs |
| `>100` | More than 100 runs |

**Type definition:**
```typescript
type NumberOfRunsFilterValue =
  | '>1'
  | '>5'
  | '>10'
  | '>20'
  | '>50'
  | '>100'
```

### Download Configuration

Values for `QueryParams.DownloadConfig`:

| Value | Description |
|-------|-------------|
| `all-annotations` | Download all annotations |
| `tomogram` | Download tomogram |

**Enum definition:**
```typescript
enum DownloadConfig {
  AllAnnotations = 'all-annotations',
  Tomogram = 'tomogram',
}
```

### Download Step

Values for `QueryParams.DownloadStep`:

| Value | Description |
|-------|-------------|
| `configure` | Configuration step |
| `download` | Download step |

**Enum definition:**
```typescript
enum DownloadStep {
  Configure = 'configure',
  Download = 'download',
}
```

### Download Tab

Values for `QueryParams.DownloadTab`:

| Value | Description |
|-------|-------------|
| `api` | API download instructions |
| `aws` | AWS CLI download instructions |
| `curl` | cURL download instructions |
| `download` | Direct download |
| `portal-cli` | Portal CLI download instructions |

**Enum definition:**
```typescript
enum DownloadTab {
  API = 'api',
  AWS = 'aws',
  Curl = 'curl',
  Download = 'download',
  PortalCLI = 'portal-cli',
}
```

### Browse Data Tab

Values for main browse data tabs:

| Value | Description |
|-------|-------------|
| `datasets` | Browse datasets |
| `depositions` | Browse depositions |
| `runs` | Browse runs |

**Enum definition:**
```typescript
enum BrowseDataTab {
  Datasets = 'datasets',
  Depositions = 'depositions',
  Runs = 'runs',
}
```

### From Location Key

Values for `QueryParams.From` parameter:

| Value | Description |
|-------|-------------|
| `deposition-annotations` | Navigate from deposition annotations |
| `deposition-tomograms` | Navigate from deposition tomograms |

**Enum definition:**
```typescript
enum FromLocationKey {
  DepositionAnnotations = 'deposition-annotations',
  DepositionTomograms = 'deposition-tomograms',
}
```

### Method Types

Filter values for `QueryParams.MethodType`:

| Value | Description |
|-------|-------------|
| `automated` | Automated annotation method |
| `hybrid` | Hybrid annotation method |
| `manual` | Manual annotation method |
| `simulated` | Simulated annotation method |

See GraphQL enum `Annotation_Method_Type_Enum` for backend values.

### Object Shape Types

Filter values for `QueryParams.ObjectShapeType`:

| Value | Description |
|-------|-------------|
| `InstanceSegmentation` | Instance segmentation |
| `OrientedPoint` | Oriented point |
| `Point` | Point |
| `SegmentationMask` | Segmentation mask |
| `Mesh` | Mesh |

See GraphQL enum `Annotation_File_Shape_Type_Enum` for backend values.

### Group By Options

Values for `QueryParams.GroupBy`:

| Value | Description |
|-------|-------------|
| `none` | No grouping |
| `deposited_location` | Group by deposited location |
| `organism` | Group by organism |

**Enum definition:**
```typescript
enum GroupByOption {
  None = 'none',
  DepositedLocation = 'deposited_location',
  Organism = 'organism',
}
```

### Quality Score

Values for `QueryParams.QualityScore` (tilt series quality):

| Value | Description |
|-------|-------------|
| `1` | Very Poor |
| `2` | Poor |
| `3` | Moderate |
| `4` | Good |
| `5` | Excellent |

**Enum definition:**
```typescript
enum TiltSeriesScore {
  VeryPoor = 1,
  Poor = 2,
  Moderate = 3,
  Good = 4,
  Excellent = 5,
}
```

---

## Usage Examples

### Adding Query Parameters to URLs

```typescript
import { QueryParams } from 'app/constants/query'

// Using URLSearchParams
const params = new URLSearchParams()
params.set(QueryParams.Page, '2')
params.set(QueryParams.ObjectName, 'ribosome')
params.set(QueryParams.GroundTruthAnnotation, 'true')

const url = `/browse-data/datasets?${params.toString()}`
// Result: /browse-data/datasets?page=2&object=ribosome&ground_truth=true
```

### Reading Query Parameters

```typescript
import { useSearchParams } from '@remix-run/react'
import { QueryParams } from 'app/constants/query'

function MyComponent() {
  const [searchParams] = useSearchParams()

  const page = searchParams.get(QueryParams.Page) ?? '1'
  const organism = searchParams.get(QueryParams.Organism)
  const groundTruth = searchParams.get(QueryParams.GroundTruthAnnotation) === 'true'

  // Use parameters...
}
```

### Filtering by Multiple Values

```typescript
// Multiple values can be passed as comma-separated or repeated params
const params = new URLSearchParams()

// Comma-separated (preferred)
params.set(QueryParams.ObjectName, 'ribosome,proteasome')

// Or as array values
params.append(QueryParams.ObjectName, 'ribosome')
params.append(QueryParams.ObjectName, 'proteasome')
```

---

## Implementation Notes

### Parameter Naming Convention

- **Filter parameters**: Use snake_case (e.g., `dataset_id`, `object_shape`)
- **UI state parameters**: Use kebab-case (e.g., `download-tab`, `method-summary-tab`)
- **Pagination parameters**: Use simple names (e.g., `page`, `sort`)

### Type Safety

Always use the `QueryParams` enum rather than string literals to ensure type safety and prevent typos:

```typescript
// Good ✅
searchParams.get(QueryParams.DatasetId)

// Bad ❌
searchParams.get('dataset_id')
```

### State Persistence

Query parameters provide URL-based state persistence, making:
- Filters shareable via URL
- Browser back/forward navigation work correctly
- Page state bookmarkable

---

## Next Steps

- [Environment Variables](./02-environment-variables.md) - Environment configuration reference
- [Constants Reference](./03-constants-reference.md) - All application constants
- [Type Definitions](./04-type-definitions.md) - TypeScript type reference
- [GraphQL Schema](./05-graphql-schema.md) - GraphQL API types
