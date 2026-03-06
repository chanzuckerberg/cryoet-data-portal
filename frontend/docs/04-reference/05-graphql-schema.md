# GraphQL Schema Reference

This document provides an overview of the GraphQL schema used by the CryoET Data Portal frontend. The schema is automatically generated from the backend API and provides TypeScript types for all queries and mutations.


## Quick Reference

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `Dataset` | CryoET dataset | id, title, description, organism |
| `Run` | Tomography run | id, name, dataset, tiltseries |
| `Annotation` | 3D annotation | id, objectName, methodType, files |
| `Tomogram` | 3D reconstruction | id, voxelSpacing, reconstructionMethod, processing |
| `Deposition` | Data deposition | id, title, depositionDate, authors |
| `Alignment` | Tilt series alignment | id, alignmentMethod, alignmentType |
| `Tiltseries` | Tilt series data | id, tiltAxis, tiltMax, tiltMin |
| `Author` | Author metadata | name, orcid, email |

---

## Schema Overview

### Location

Generated GraphQL types are located in:
```
/packages/data-portal/app/__generated_v2__/
```

**Key files:**
- `graphql.ts` - All GraphQL types (7,565 lines)
- `gql.ts` - Document node utilities
- `fragment-masking.ts` - Fragment masking utilities (disabled)
- `index.ts` - Barrel export

### Generation

Types are auto-generated from the GraphQL API schema using GraphQL Code Generator.

**Schema URL:**
```
https://graphql.cryoetdataportal.czscience.com/graphql
```

**Configuration:** `codegen.ts`

**Commands:**
```bash
# Generate types once
pnpm data-portal build:codegen

# Watch mode (regenerate on schema changes)
pnpm data-portal dev:codegen
```

---

## Core Scalars

Custom scalar types mapped to TypeScript primitives.

| GraphQL Scalar | TypeScript Type | Description |
|----------------|-----------------|-------------|
| `DateTime` | `string` | ISO 8601 datetime string |
| `GlobalID` | `any` | Globally unique identifier |
| `Int` | `number` | Integer value |
| `Float` | `number` | Floating point value |
| `String` | `string` | Text string |
| `Boolean` | `boolean` | True/false value |

**Scalar definitions:**
```typescript
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: string; output: string }
  GlobalID: { input: any; output: any }
}
```

---

## Key Enums

### Annotation Method Type

```typescript
export enum Annotation_Method_Type_Enum {
  Automated = 'automated',
  Hybrid = 'hybrid',
  Manual = 'manual',
  Simulated = 'simulated',
}
```

### Annotation Shape Type

```typescript
export enum Annotation_File_Shape_Type_Enum {
  InstanceSegmentation = 'InstanceSegmentation',
  Mesh = 'Mesh',
  OrientedPoint = 'OrientedPoint',
  Point = 'Point',
  SegmentationMask = 'SegmentationMask',
}
```

### Annotation File Source

```typescript
export enum Annotation_File_Source_Enum {
  AuthorSubmitted = 'author_submitted',
  CommunitySubmitted = 'community_submitted',
  PortalStandard = 'portal_standard',
}
```

### Alignment Method Type

```typescript
export enum Alignment_Method_Type_Enum {
  PatchTracking = 'patch_tracking',
  PatchTrackingFiducial = 'patch_tracking+fiducial',
  Fiducial = 'fiducial',
}
```

### Alignment Type

```typescript
export enum Alignment_Type_Enum {
  Local = 'LOCAL',
  Global = 'GLOBAL',
}
```

### Deposition Types

```typescript
export enum Deposition_Types_Enum {
  Annotation = 'annotation',
  Dataset = 'dataset',
}
```

---

## Core Entity Types

### Dataset

Represents a CryoET dataset.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Numeric dataset ID |
| `_id` | `GlobalID` | Global ID |
| `title` | `String` | Dataset title |
| `description` | `String` | Dataset description |
| `depositionDate` | `DateTime` | Date deposited |
| `releaseDate` | `DateTime` | Date released |
| `lastModifiedDate` | `DateTime` | Last modification date |
| `relatedDatabaseEntries` | `String` | EMPIAR/EMDB IDs |
| `organism` | `DatasetOrganism` | Organism information |
| `authors` | `DatasetAuthorConnection` | Dataset authors |
| `funding` | `DatasetFundingConnection` | Funding sources |
| `runs` | `RunConnection` | Associated runs |

**Connections:**
- Authors (many-to-many)
- Funding sources (many-to-many)
- Runs (one-to-many)

### Run

Represents a tomography run within a dataset.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Numeric run ID |
| `_id` | `GlobalID` | Global ID |
| `name` | `String` | Run name |
| `dataset` | `Dataset` | Parent dataset |
| `tiltseries` | `TiltseriesConnection` | Associated tilt series |
| `tomogramVoxelSpacings` | `TomogramVoxelSpacingConnection` | Tomogram spacings |
| `annotationFiles` | `AnnotationFileConnection` | Annotation files |

**Connections:**
- Dataset (many-to-one)
- Tilt series (one-to-many)
- Tomogram voxel spacings (one-to-many)
- Annotation files (one-to-many)

### Annotation

Represents a 3D annotation of biological structures.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Numeric annotation ID |
| `_id` | `GlobalID` | Global ID |
| `objectName` | `String` | Annotated object name |
| `objectId` | `String` | Annotated object ID |
| `objectDescription` | `String` | Object description |
| `objectState` | `String` | Object state |
| `objectCount` | `Int` | Number of objects |
| `confidence` | `Float` | Confidence score |
| `groundTruthStatus` | `Boolean` | Ground truth flag |
| `methodType` | `Annotation_Method_Type_Enum` | Annotation method |
| `depositionDate` | `DateTime` | Date deposited |
| `releaseDate` | `DateTime` | Date released |
| `lastModifiedDate` | `DateTime` | Last modification |
| `authors` | `AnnotationAuthorConnection` | Authors |
| `annotationShapes` | `AnnotationShapeConnection` | Shape files |
| `methodLinks` | `AnnotationMethodLinkConnection` | Method links |
| `run` | `Run` | Associated run |
| `deposition` | `Deposition` | Associated deposition |

**Connections:**
- Authors (many-to-many)
- Annotation shapes/files (one-to-many)
- Method links (one-to-many)
- Run (many-to-one)
- Deposition (many-to-one, nullable)

### Tomogram

Represents a 3D reconstruction (tomogram).

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Numeric tomogram ID |
| `_id` | `GlobalID` | Global ID |
| `name` | `String` | Tomogram name |
| `sizeX` | `Int` | X dimension (voxels) |
| `sizeY` | `Int` | Y dimension (voxels) |
| `sizeZ` | `Int` | Z dimension (voxels) |
| `voxelSpacing` | `Float` | Voxel spacing (Å) |
| `fiducialAlignmentStatus` | `String` | Fiducial alignment |
| `reconstructionMethod` | `String` | Reconstruction method |
| `reconstructionSoftware` | `String` | Software used |
| `processing` | `String` | Post-processing |
| `processingLevel` | `String` | Processing level |
| `ctfCorrected` | `Boolean` | CTF corrected |
| `depositionDate` | `DateTime` | Date deposited |
| `releaseDate` | `DateTime` | Date released |
| `lastModifiedDate` | `DateTime` | Last modification |
| `httpsPath` | `String` | HTTPS download URL |
| `s3Path` | `String` | S3 path |
| `neuroglancerConfig` | `String` | Neuroglancer config URL |
| `keyPhotoUrl` | `String` | Thumbnail URL |
| `alignment` | `Alignment` | Alignment |
| `authors` | `TomogramAuthorConnection` | Authors |
| `deposition` | `Deposition` | Deposition |

**Connections:**
- Alignment (many-to-one)
- Authors (many-to-many)
- Deposition (many-to-one, nullable)
- Tomogram voxel spacing (many-to-one)

### Deposition

Represents a data deposition containing datasets, annotations, or tomograms.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Numeric deposition ID |
| `_id` | `GlobalID` | Global ID |
| `title` | `String` | Deposition title |
| `description` | `String` | Deposition description |
| `depositionDate` | `DateTime` | Date deposited |
| `releaseDate` | `DateTime` | Date released |
| `lastModifiedDate` | `DateTime` | Last modification |
| `relatedDatabaseEntries` | `String` | Related DB entries |
| `depositionTypes` | `DepositionTypeConnection` | Deposition types |
| `authors` | `DepositionAuthorConnection` | Authors |
| `annotations` | `AnnotationConnection` | Annotations |
| `tomograms` | `TomogramConnection` | Tomograms |
| `datasets` | `DatasetConnection` | Datasets |
| `alignments` | `AlignmentConnection` | Alignments |

**Connections:**
- Authors (many-to-many)
- Deposition types (many-to-many)
- Annotations (one-to-many)
- Tomograms (one-to-many)
- Datasets (one-to-many)
- Alignments (one-to-many)

### Alignment

Represents tilt series alignment parameters.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Numeric alignment ID |
| `_id` | `GlobalID` | Global ID |
| `alignmentMethod` | `Alignment_Method_Type_Enum` | Method used |
| `alignmentType` | `Alignment_Type_Enum` | LOCAL or GLOBAL |
| `isPortalStandard` | `Boolean` | Portal standard flag |
| `volumeXDimension` | `Float` | X dimension (Å) |
| `volumeYDimension` | `Float` | Y dimension (Å) |
| `volumeZDimension` | `Float` | Z dimension (Å) |
| `volumeXOffset` | `Float` | X offset (Å) |
| `volumeYOffset` | `Float` | Y offset (Å) |
| `volumeZOffset` | `Float` | Z offset (Å) |
| `xRotationOffset` | `Float` | X rotation (degrees) |
| `tiltOffset` | `Float` | Tilt offset (degrees) |
| `affineTransformationMatrix` | `String` | Transform matrix |
| `httpsAlignmentMetadata` | `String` | HTTPS metadata URL |
| `s3AlignmentMetadata` | `String` | S3 metadata path |
| `run` | `Run` | Associated run |
| `tiltseries` | `Tiltseries` | Associated tilt series |
| `deposition` | `Deposition` | Associated deposition |
| `tomograms` | `TomogramConnection` | Tomograms |

### Tiltseries

Represents tilt series acquisition data.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int` | Numeric tilt series ID |
| `_id` | `GlobalID` | Global ID |
| `accelerationVoltage` | `Int` | Voltage (kV) |
| `alignedTiltseriesBinning` | `Int` | Binning factor |
| `binningFromFrames` | `Float` | Binning from frames |
| `camera` | `String` | Camera used |
| `dataAcquisitionSoftware` | `String` | Acquisition software |
| `isAligned` | `Boolean` | Alignment status |
| `microscopeManufacturer` | `String` | Microscope manufacturer |
| `microscopeModel` | `String` | Microscope model |
| `pixelSpacing` | `Float` | Pixel spacing (Å) |
| `sphericalAberrationConstant` | `Float` | Cs value |
| `tiltAxis` | `Float` | Tilt axis (degrees) |
| `tiltMax` | `Float` | Max tilt (degrees) |
| `tiltMin` | `Float` | Min tilt (degrees) |
| `tiltRange` | `Float` | Tilt range (degrees) |
| `tiltSeriesQuality` | `Int` | Quality score (1-5) |
| `tiltStep` | `Float` | Tilt step (degrees) |
| `tiltingScheme` | `String` | Tilting scheme |
| `totalFlux` | `Float` | Total flux |
| `httpsAnglelist` | `String` | HTTPS angle list URL |
| `httpsCollectionMetadata` | `String` | HTTPS metadata URL |
| `httpsMrcBin1` | `String` | HTTPS MRC bin1 URL |
| `httpsOmezarr` | `String` | HTTPS OME-Zarr URL |
| `s3Anglelist` | `String` | S3 angle list path |
| `s3CollectionMetadata` | `String` | S3 metadata path |
| `s3MrcBin1` | `String` | S3 MRC bin1 path |
| `s3Omezarr` | `String` | S3 OME-Zarr path |
| `deposition` | `Deposition` | Associated deposition |
| `run` | `Run` | Associated run |

### Author Types

Author information for datasets, annotations, and tomograms.

**DatasetAuthor, AnnotationAuthor, TomogramAuthor, DepositionAuthor:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | `String` | Author name |
| `orcid` | `String` | ORCID identifier |
| `email` | `String` | Email address |
| `affiliation` | `String` | Institution affiliation |
| `affiliationIdentifier` | `String` | ROR or other ID |
| `correspondingAuthorStatus` | `Boolean` | Corresponding author |
| `primaryAuthorStatus` | `Boolean` | Primary author |

---

## Connection Types

GraphQL connections for paginated relationships.

### Connection Pattern

All connections follow the Relay cursor-based pagination pattern:

```typescript
export type [Entity]Connection = {
  edges: Array<[Entity]Edge>
  pageInfo: PageInfo
}

export type [Entity]Edge = {
  cursor: string
  node: [Entity]
}

export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
}
```

### Key Connections

| Connection Type | Purpose |
|-----------------|---------|
| `DatasetConnection` | Paginated datasets |
| `RunConnection` | Paginated runs |
| `AnnotationConnection` | Paginated annotations |
| `TomogramConnection` | Paginated tomograms |
| `DepositionConnection` | Paginated depositions |
| `DatasetAuthorConnection` | Dataset authors |
| `AnnotationAuthorConnection` | Annotation authors |
| `TomogramAuthorConnection` | Tomogram authors |
| `DepositionAuthorConnection` | Deposition authors |

**Usage example:**
```typescript
const query = gql`
  query GetDatasets($first: Int!) {
    datasets(first: $first) {
      edges {
        cursor
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`
```

---

## Aggregate Types

Aggregation functions for analytics queries.

### Aggregate Functions

Every entity type has aggregate functions:

```typescript
export type [Entity]Aggregate = {
  aggregate?: Array<[Entity]AggregateFunctions> | null
}

export type [Entity]AggregateFunctions = {
  avg?: [Entity]NumericalColumns | null
  count?: Int | null
  groupBy?: [Entity]GroupByOptions | null
  max?: [Entity]MinMaxColumns | null
  min?: [Entity]MinMaxColumns | null
  stddev?: [Entity]NumericalColumns | null
  sum?: [Entity]NumericalColumns | null
  variance?: [Entity]NumericalColumns | null
}
```

**Aggregation operations:**

| Function | Description |
|----------|-------------|
| `avg` | Average of numerical columns |
| `count` | Count of records |
| `groupBy` | Group by options |
| `max` | Maximum values |
| `min` | Minimum values |
| `stddev` | Standard deviation |
| `sum` | Sum of numerical columns |
| `variance` | Variance |

**Usage example:**
```typescript
const query = gql`
  query DatasetStats {
    datasetsAggregate {
      aggregate {
        count
        groupBy {
          organism {
            name
          }
        }
      }
    }
  }
`
```

---

## Filter Types

### Where Clauses

Every entity has a `WhereClause` type for filtering:

```typescript
export type [Entity]WhereClause = {
  _and?: Array<[Entity]WhereClause> | null
  _or?: Array<[Entity]WhereClause> | null
  _not?: [Entity]WhereClause | null

  // Field filters
  id?: IntComparators | null
  name?: StringComparators | null
  // ... other fields
}
```

### Comparators

Standard comparators for different types:

**IntComparators:**
```typescript
export type IntComparators = {
  _eq?: number | null
  _gt?: number | null
  _gte?: number | null
  _in?: Array<number> | null
  _lt?: number | null
  _lte?: number | null
  _neq?: number | null
  _nin?: Array<number> | null
}
```

**StringComparators:**
```typescript
export type StringComparators = {
  _eq?: string | null
  _gt?: string | null
  _gte?: string | null
  _ilike?: string | null
  _in?: Array<string> | null
  _like?: string | null
  _lt?: string | null
  _lte?: string | null
  _neq?: string | null
  _nilike?: string | null
  _nin?: Array<string> | null
  _nlike?: string | null
}
```

**BooleanComparators:**
```typescript
export type BooleanComparators = {
  _eq?: boolean | null
  _neq?: boolean | null
}
```

**DateTimeComparators:**
```typescript
export type DateTimeComparators = {
  _eq?: string | null
  _gt?: string | null
  _gte?: string | null
  _in?: Array<string> | null
  _lt?: string | null
  _lte?: string | null
  _neq?: string | null
  _nin?: Array<string> | null
}
```

---

## Order By Types

Every entity has an `OrderByClause` for sorting:

```typescript
export type [Entity]OrderByClause = {
  id?: OrderBy | null
  name?: OrderBy | null
  // ... other sortable fields
}

export enum OrderBy {
  Asc = 'asc',
  AscNullsFirst = 'asc_nulls_first',
  AscNullsLast = 'asc_nulls_last',
  Desc = 'desc',
  DescNullsFirst = 'desc_nulls_first',
  DescNullsLast = 'desc_nulls_last',
}
```

**Usage example:**
```typescript
const query = gql`
  query GetDatasets {
    datasets(orderBy: [{ releaseDate: desc }]) {
      edges {
        node {
          id
          title
          releaseDate
        }
      }
    }
  }
`
```

---

## Query Root

The root query type provides access to all entities:

```typescript
export type Query = {
  alignments: AlignmentConnection
  annotations: AnnotationConnection
  datasets: DatasetConnection
  depositions: DepositionConnection
  runs: RunConnection
  tiltseries: TiltseriesConnection
  tomograms: TomogramConnection

  // Aggregates
  alignmentsAggregate?: AlignmentAggregate
  annotationsAggregate?: AnnotationAggregate
  datasetsAggregate?: DatasetAggregate
  // ... more aggregates

  // Node interface lookup
  node?: Node
}
```

---

## Usage Examples

### Basic Query

```typescript
import { gql } from 'app/__generated_v2__/gql'

const GET_DATASETS = gql(`
  query GetDatasets($first: Int!) {
    datasets(first: $first) {
      edges {
        node {
          id
          title
          description
          releaseDate
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`)
```

### Filtered Query

```typescript
const GET_DATASETS_BY_ORGANISM = gql(`
  query GetDatasetsByOrganism($organism: String!) {
    datasets(
      where: {
        organism: {
          name: { _ilike: $organism }
        }
      }
    ) {
      edges {
        node {
          id
          title
          organism {
            name
          }
        }
      }
    }
  }
`)
```

### Aggregate Query

```typescript
const GET_DATASET_COUNTS = gql(`
  query GetDatasetCounts {
    datasetsAggregate {
      aggregate {
        count
        groupBy {
          organism {
            name
          }
        }
      }
    }
  }
`)
```

---

## Type Safety

### Typed Document Nodes

All queries return typed document nodes with full type inference:

```typescript
import { useQuery } from '@apollo/client'
import { GET_DATASETS } from './queries'

function DatasetList() {
  // `data` is fully typed based on the query
  const { data, loading, error } = useQuery(GET_DATASETS, {
    variables: { first: 20 },
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // TypeScript knows the shape of data.datasets
  return (
    <ul>
      {data.datasets.edges.map(({ node }) => (
        <li key={node.id}>{node.title}</li>
      ))}
    </ul>
  )
}
```

### Fragment Masking

Fragment masking is **disabled** in this project for simpler type usage:

```typescript
// codegen.ts
presetConfig: {
  fragmentMasking: false,  // No need to unwrap fragment results
}
```

This means fragment results can be used directly without additional unwrapping.

---

## Schema Updates

### When Schema Changes

1. Backend schema is updated
2. Run code generation to update types:
   ```bash
   pnpm data-portal build:codegen
   ```
3. Fix any TypeScript errors from breaking changes
4. Update queries if needed
5. Test thoroughly

### Breaking Changes

Common breaking changes to watch for:
- Field removals
- Field type changes
- Enum value changes
- Required field additions

---

## Next Steps

- [Query Parameters](./01-query-params.md) - URL parameter reference
- [Environment Variables](./02-environment-variables.md) - Environment configuration
- [Constants Reference](./03-constants-reference.md) - Application constants
- [Type Definitions](./04-type-definitions.md) - TypeScript type reference
- [API Routes](./06-api-routes.md) - Internal API endpoints
