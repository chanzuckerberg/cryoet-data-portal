# Data Model

This document explains the CryoET Data Portal domain model, including the core entities (datasets, runs, tomograms, annotations, depositions), their relationships, hierarchical structure, and how they map to the GraphQL schema.


## Quick Reference

| Entity | Description | Key Fields |
|--------|-------------|------------|
| **Dataset** | A collection of experimental data from a single specimen | `id`, `title`, `organismName`, `releaseDate` |
| **Run** | A single imaging run within a dataset | `id`, `name`, `tiltseriesId` |
| **Tomogram** | A 3D reconstruction from tilt series images | `id`, `voxelSpacing`, `reconstructionMethod`, `processing` |
| **Annotation** | Labeled biological objects in a tomogram | `id`, `objectName`, `objectId`, `methodType` |
| **Deposition** | A submission of data to the portal | `id`, `title`, `depositionDate`, `depositionTypes` |
| **Tiltseries** | Raw image data collected at different angles | `id`, `tiltRange`, `cameraManufacturer` |
| **Alignment** | Geometric transformation for tiltseries alignment | `id`, `alignmentMethod`, `isPortalStandard` |

---

## Entity Hierarchy

The CryoET data model follows a hierarchical structure:

```
Deposition (submission container)
  ↓
Dataset (experimental specimen)
  ↓
Run (imaging session)
  ├── Tiltseries (raw images)
  │   └── Alignment (geometric transformation)
  │       └── Tomogram (3D reconstruction)
  │           └── Annotation (labeled objects)
  └── IdentifiedObjects (detected but not annotated objects)
```

**Visual representation:**

```
┌─────────────────────────────────────────────┐
│ Deposition                                  │
│ (DOI: 10.1234/example)                      │
├─────────────────────────────────────────────┤
│  Dataset 1: "E. coli ribosomes"             │
│  │                                           │
│  ├── Run 1: "Run_001"                       │
│  │   ├── Tiltseries                         │
│  │   │   └── Alignment                      │
│  │   │       └── Tomogram (voxel: 10Å)      │
│  │   │           ├── Annotation: Ribosome   │
│  │   │           └── Annotation: Membrane   │
│  │   └── IdentifiedObjects: Ribosome       │
│  │                                           │
│  └── Run 2: "Run_002"                       │
│      └── ...                                 │
│                                              │
│  Dataset 2: "Human mitochondria"            │
│  └── ...                                     │
└─────────────────────────────────────────────┘
```

---

## Core Entities

### Dataset

A **Dataset** represents a collection of cryo-ET data from a single biological specimen.

**Purpose:** Group all imaging data related to one experimental sample.

**GraphQL Type:**

```typescript
export type Dataset = {
  __typename?: 'Dataset'
  id: number
  title: string
  description: string
  organismName?: string | null
  tissueName?: string | null
  cellName?: string | null
  cellStrainName?: string | null

  // Metadata
  releaseDate: string  // DateTime
  depositionDate: string  // DateTime
  lastModifiedDate: string  // DateTime

  // External references
  relatedDatabaseEntries?: string | null  // EMPIAR-12345, EMD-67890
  datasetPublications?: string | null  // DOIs
  keyPhotoThumbnailUrl?: string | null
  keyPhotoUrl?: string | null

  // Relationships
  authors: AuthorConnection
  runs: RunConnection
  deposition?: Deposition | null

  // Aggregates
  runsAggregate?: RunAggregate
}
```

**Key Concepts:**

| Field | Description | Example |
|-------|-------------|---------|
| `organismName` | Scientific name of organism | `"Homo sapiens"`, `"Escherichia coli"` |
| `tissueName` | Tissue type if applicable | `"brain"`, `"liver"` |
| `cellName` | Cell type | `"neuron"`, `"HeLa"` |
| `relatedDatabaseEntries` | Links to EMPIAR, EMDB | `"EMPIAR-10001, EMD-1234"` |
| `keyPhotoThumbnailUrl` | Representative image thumbnail | HTTPS URL to image |

**Example Usage:**

```typescript
// In a loader
const { data } = await client.query({
  query: GET_DATASET_QUERY,
  variables: { id: 10001 },
})

const dataset = data.datasets[0]
console.log(dataset.title)  // "Mitochondrial ribosomes from S. cerevisiae"
console.log(dataset.organismName)  // "Saccharomyces cerevisiae"
console.log(dataset.runsAggregate.aggregate.count)  // 5 runs
```

---

### Run

A **Run** represents a single imaging session within a dataset.

**Purpose:** Group data from one tomogram acquisition (tilt series → alignment → reconstruction).

**GraphQL Type:**

```typescript
export type Run = {
  __typename?: 'Run'
  id: number
  name: string

  // Relationships
  dataset?: Dataset
  datasetId: number
  tiltseries: TiltseriesConnection
  tomograms: TomogramConnection
  annotations: AnnotationConnection
  identifiedObjects: IdentifiedObjectConnection

  // Aggregates
  tomogramsAggregate?: TomogramAggregate
  annotationsAggregate?: AnnotationAggregate
}
```

**Key Concepts:**

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Run identifier within dataset | `"TS_001"`, `"Run_045"` |
| `tiltseries` | Raw tilt series images | One or more tilt series |
| `tomograms` | 3D reconstructions | Multiple processing versions |
| `annotations` | Biological object labels | Ribosomes, membranes, etc. |

**Relationships:**
- One dataset → many runs
- One run → many tilt series (usually 1)
- One run → many tomograms (different processings)
- One run → many annotations

**Example Usage:**

```typescript
const run = data.runs[0]
console.log(run.name)  // "TS_043"
console.log(run.tomogramsAggregate.aggregate.count)  // 3 tomograms
console.log(run.annotationsAggregate.aggregate.count)  // 12 annotations
```

---

### Tomogram

A **Tomogram** is a 3D reconstruction of the specimen from tilt series images.

**Purpose:** Provide different processing versions of the same 3D volume.

**GraphQL Type:**

```typescript
export type Tomogram = {
  __typename?: 'Tomogram'
  id: number
  name: string

  // Reconstruction details
  voxelSpacing: number  // Angstroms per voxel
  sizeX: number  // Voxels in X dimension
  sizeY: number
  sizeZ: number
  reconstructionMethod: Tomogram_Reconstruction_Method_Enum
  reconstructionSoftware: string
  processing: Tomogram_Processing_Enum

  // Alignment details
  fiducialAlignmentStatus: Fiducial_Alignment_Status_Enum
  ctfCorrected?: boolean | null

  // Relationships
  run?: Run
  alignment?: Alignment
  deposition?: Deposition

  // Download paths
  httpsPath: string
  s3Path: string
  httpsAnglePath?: string | null
  httpsOmezarroDirPath?: string | null

  // Viewer
  neuroglancerConfig?: string | null
  keyPhotoThumbnailUrl?: string | null
  keyPhotoUrl?: string | null
}
```

**Reconstruction Methods:**

| Method | Description |
|--------|-------------|
| `WBP` | Weighted Back Projection (fast, lower quality) |
| `SIRT` | Simultaneous Iterative Reconstruction Technique |
| `SART` | Simultaneous Algebraic Reconstruction Technique |
| `FourierSpace` | Fourier space reconstruction |

**Processing Types:**

| Processing | Description | Use Case |
|-----------|-------------|----------|
| `RAW` | Unprocessed reconstruction | Full resolution data |
| `DENOISED` | Noise-reduced | Better visualization |
| `FILTERED` | Filtered for features | Enhance structures |

**Alignment Status:**

| Status | Description |
|--------|-------------|
| `FIDUCIAL` | Aligned using fiducial markers (gold beads) |
| `NON_FIDUCIAL` | Aligned using image features |

**Example Usage:**

```typescript
const tomogram = data.tomograms[0]
console.log(tomogram.voxelSpacing)  // 10.0 Å/voxel
console.log(tomogram.reconstructionMethod)  // "SIRT"
console.log(tomogram.processing)  // "DENOISED"
console.log(`${tomogram.sizeX} × ${tomogram.sizeY} × ${tomogram.sizeZ}`)  // "1024 × 1024 × 512"

// Open in viewer
window.location.href = `/view/runs/${tomogram.run.id}?tomogram_id=${tomogram.id}`
```

---

### Annotation

An **Annotation** is a labeled biological object or structure in a tomogram.

**Purpose:** Identify and localize specific biological features (ribosomes, membranes, etc.).

**GraphQL Type:**

```typescript
export type Annotation = {
  __typename?: 'Annotation'
  id: number

  // Object identification
  objectName: string
  objectId: string  // GO ID or UniProt accession
  objectDescription?: string | null
  objectState?: string | null  // "open", "closed", etc.
  objectCount?: number | null

  // Annotation metadata
  annotationMethod: string
  annotationSoftware?: string | null
  annotationPublication?: string | null
  methodType: Annotation_Method_Type_Enum

  // Quality metrics
  confidencePrecision?: number | null  // % true positives
  confidenceRecall?: number | null  // % annotated correctly
  groundTruthStatus?: boolean | null
  isCuratorRecommended?: boolean | null

  // Relationships
  run?: Run
  deposition?: Deposition
  annotationShapes: AnnotationShapeConnection
  authors: AnnotationAuthorConnection

  // Dates
  depositionDate: string
  releaseDate: string
  lastModifiedDate: string

  // Download paths
  httpsMetadataPath: string
  s3MetadataPath: string
}
```

**Method Types:**

| Method | Description | Example |
|--------|-------------|---------|
| `MANUAL` | Hand-annotated by expert | Gold standard annotations |
| `AUTOMATED` | Fully automated software | Deep learning detection |
| `HYBRID` | Semi-automated with manual curation | Auto-detection + manual check |

**Annotation Shapes:**

Annotations consist of geometric shapes representing the objects:

```typescript
export type AnnotationShape = {
  __typename?: 'AnnotationShape'
  id: number
  shapeType: Annotation_File_Shape_Type_Enum  // Point, OrientedPoint, etc.

  annotation: Annotation

  // File information
  annotationFiles: AnnotationFileConnection
}
```

**Shape Types:**

| Shape Type | Description | Use Case |
|-----------|-------------|----------|
| `Point` | 3D coordinate | Small particles |
| `OrientedPoint` | Point + orientation | Directional structures |
| `InstanceSegmentation` | 3D mask per object | Complex structures |
| `SemanticSegmentationMask` | Binary 3D mask | Continuous structures (membranes) |

**Object ID Standards:**

| ID Format | Source | Example |
|-----------|--------|---------|
| `GO:*` | Gene Ontology | `GO:0005840` (ribosome) |
| `UniProtKB:*` | UniProt | `UniProtKB:P12345` |

**Example Usage:**

```typescript
const annotation = data.annotations[0]
console.log(annotation.objectName)  // "ribosome"
console.log(annotation.objectId)  // "GO:0005840"
console.log(annotation.methodType)  // "HYBRID"
console.log(annotation.objectCount)  // 1523 ribosomes
console.log(annotation.confidencePrecision)  // 0.95 (95%)

// Get shape files
annotation.annotationShapes.edges.forEach(({ node }) => {
  console.log(node.shapeType)  // "OrientedPoint"
  console.log(node.annotationFiles.edges[0].node.format)  // "ndjson"
})
```

---

### Deposition

A **Deposition** is a submission of data to the CryoET Data Portal.

**Purpose:** Track data submissions, provenance, and enable versioning.

**GraphQL Type:**

```typescript
export type Deposition = {
  __typename?: 'Deposition'
  id: number
  title: string
  description: string

  // Submission metadata
  depositionDate: string
  releaseDate: string
  lastModifiedDate: string

  // Classification
  depositionTypes: DepositionTypeConnection
  tag?: string | null  // e.g., "ML_CHALLENGE_2024"

  // Relationships
  authors: DepositionAuthorConnection
  datasets: DatasetConnection
  annotations: AnnotationConnection
  tomograms: TomogramConnection

  // Aggregates
  datasetsAggregate?: DatasetAggregate
  annotationsAggregate?: AnnotationAggregate
  tomogramsAggregate?: TomogramAggregate
}
```

**Deposition Types:**

| Type | Description |
|------|-------------|
| `DATASET` | New dataset with raw data |
| `ANNOTATION` | New annotations for existing datasets |
| `TOMOGRAM` | New tomogram reconstructions |

**Tags:**

Special classifications for depositions:

| Tag | Description |
|-----|-------------|
| `ML_CHALLENGE_2024` | ML Challenge 2024 competition data |
| `GROUND_TRUTH` | Curated ground truth annotations |

**Feature Flag Behavior:**

With `expandDepositions` feature flag:
- **Enabled**: Show all deposition types
- **Disabled**: Show only `ANNOTATION` depositions

**Example Usage:**

```typescript
const deposition = data.depositions[0]
console.log(deposition.title)  // "Ribosome annotations from ML Challenge"
console.log(deposition.tag)  // "ML_CHALLENGE_2024"
console.log(deposition.datasetsAggregate.aggregate.count)  // 10 datasets
console.log(deposition.annotationsAggregate.aggregate.count)  // 1234 annotations

// Check deposition type
const hasAnnotations = deposition.depositionTypes.edges.some(
  ({ node }) => node.type === 'ANNOTATION'
)
```

---

### Tiltseries

A **Tiltseries** is a collection of 2D images taken at different tilt angles.

**Purpose:** Provide raw image data for tomogram reconstruction.

**GraphQL Type:**

```typescript
export type Tiltseries = {
  __typename?: 'Tiltseries'
  id: number

  // Acquisition parameters
  tiltRange: number  // Total tilt range in degrees
  tiltStep: number  // Increment between tilts
  tiltAxisAngle: number  // Rotation of tilt axis
  tiltSeriesQuality: number  // Quality score 1-5

  // Camera details
  cameraManufacturer?: string | null
  cameraModel?: string | null
  accelerationVoltage: number  // keV
  microscopeManufacturer: string
  microscopeModel: string

  // Image details
  pixelSpacing: number  // Angstroms
  tiltSeriesFormat?: string | null  // MRC, TIFF, etc.
  totalFlux: number  // e-/Å²

  // Relationships
  run?: Run
  alignments: AlignmentConnection

  // Download paths
  httpsPath?: string | null
  s3Path?: string | null
  httpsOmezarroDirPath?: string | null
}
```

**Common Values:**

| Parameter | Typical Range | Description |
|-----------|---------------|-------------|
| `tiltRange` | 60-120° | Total angular range (e.g., -60° to +60°) |
| `tiltStep` | 2-3° | Angle increment between images |
| `accelerationVoltage` | 200-300 keV | Electron beam energy |
| `pixelSpacing` | 1-20 Å | Physical size of each pixel |
| `tiltSeriesQuality` | 1-5 | Subjective quality rating |

**Example Usage:**

```typescript
const tiltseries = data.tiltseries[0]
console.log(`Tilt range: ±${tiltseries.tiltRange / 2}°`)  // "Tilt range: ±60°"
console.log(`Step: ${tiltseries.tiltStep}°`)  // "Step: 3°"
console.log(`Camera: ${tiltseries.cameraManufacturer} ${tiltseries.cameraModel}`)
// "Camera: Gatan K3"
console.log(`Quality: ${tiltseries.tiltSeriesQuality}/5`)  // "Quality: 4/5"
```

---

### Alignment

An **Alignment** defines the geometric transformation to align tilt series images.

**Purpose:** Correct for image drift and rotation between tilts.

**GraphQL Type:**

```typescript
export type Alignment = {
  __typename?: 'Alignment'
  id: number

  // Alignment metadata
  alignmentMethod?: Alignment_Method_Type_Enum | null
  alignmentType?: Alignment_Type_Enum | null
  isPortalStandard?: boolean | null

  // Transformation parameters
  affineTransformationMatrix?: string | null
  tiltOffset?: number | null
  volumeXDimension?: number | null
  volumeYDimension?: number | null
  volumeZDimension?: number | null
  volumeXOffset?: number | null
  volumeYOffset?: number | null
  volumeZOffset?: number | null
  xRotationOffset?: number | null

  // Relationships
  tiltseries?: Tiltseries
  run?: Run
  tomograms: TomogramConnection

  // Download paths
  httpsAlignmentMetadata?: string | null
  s3AlignmentMetadata?: string | null
}
```

**Alignment Methods:**

| Method | Description |
|--------|-------------|
| `PATCH_TRACKING` | Track features across tilts |
| `MARKER_BASED` | Use fiducial markers |
| `FEATURE_BASED` | Detect and match features |

**Alignment Types:**

| Type | Description |
|------|-------------|
| `LOCAL` | Per-region alignment |
| `GLOBAL` | Single transformation for entire series |

---

## Entity Relationships

### Dataset ↔ Run ↔ Tomogram

```
Dataset
  └── runs (1-to-many)
      └── Run
          ├── tiltseries (1-to-many, usually 1)
          │   └── Tiltseries
          │       └── alignments (1-to-many)
          │           └── Alignment
          │               └── tomograms (1-to-many)
          │                   └── Tomogram
          └── annotations (1-to-many)
              └── Annotation
```

**Query Pattern:**

```graphql
query GetDatasetWithRuns($id: Int!) {
  datasets(where: { id: { _eq: $id } }) {
    id
    title
    runs {
      id
      name
      tomograms {
        id
        voxelSpacing
        reconstructionMethod
      }
      annotations {
        id
        objectName
        objectCount
      }
    }
  }
}
```

### Deposition Relationships

Depositions can contain multiple entity types:

```
Deposition
  ├── datasets (1-to-many)
  │   └── Dataset
  ├── annotations (1-to-many)
  │   └── Annotation
  └── tomograms (1-to-many)
      └── Tomogram
```

**Why?** A deposition might add new annotations to existing datasets, or submit entirely new datasets.

---

## Common Query Patterns

### Get Dataset with All Related Data

```typescript
const GET_DATASET_FULL = gql(`
  query GetDatasetFull($id: Int!) {
    datasets(where: { id: { _eq: $id } }) {
      id
      title
      organismName
      authors {
        edges {
          node {
            name
            primaryAuthorStatus
          }
        }
      }
      runs {
        id
        name
        tiltseries {
          id
          tiltRange
          cameraManufacturer
        }
        tomograms {
          id
          voxelSpacing
          reconstructionMethod
          processing
        }
        annotations {
          id
          objectName
          objectId
          methodType
          objectCount
        }
      }
    }
  }
`)
```

### Filter Datasets by Annotation Object

```typescript
const datasetsFilter = {
  runs: {
    annotations: {
      objectName: {
        _in: ['ribosome', 'membrane'],
      },
    },
  },
}
```

### Count Annotations Per Object

```typescript
const GET_OBJECT_COUNTS = gql(`
  query GetObjectCounts {
    annotationsAggregate {
      aggregate {
        count
        groupBy {
          objectName
        }
      }
    }
  }
`)

// Result:
// [
//   { objectName: "ribosome", count: 1234 },
//   { objectName: "membrane", count: 567 },
//   { objectName: "nuclear pore", count: 89 }
// ]
```

---

## Identified Objects

**IdentifiedObjects** are detected objects that haven't been fully annotated.

**Purpose:** Provide intermediate results from object detection pipelines.

**Difference from Annotations:**
- **Annotations**: Manually curated, high confidence, publication-ready
- **IdentifiedObjects**: Automated detections, may need validation

**GraphQL Type:**

```typescript
export type IdentifiedObject = {
  __typename?: 'IdentifiedObject'
  id: number

  // Object identification
  objectName: string
  objectId: string

  // Detection metadata
  detectionMethod: string
  detectionSoftware?: string | null
  confidence?: number | null

  // Relationships
  run?: Run
}
```

**Feature Flag:** Only visible when `identifiedObjects` feature flag is enabled.

**Usage Pattern:**

```typescript
const isIdentifiedObjectsEnabled = useFeatureFlag('identifiedObjects')

if (isIdentifiedObjectsEnabled) {
  // Search both annotations and identified objects
  const results = await Promise.all([
    getAnnotations({ objectName }),
    getIdentifiedObjects({ objectName }),
  ])
}
```

---

## Data Statistics

### Typical Data Sizes

| Entity | Typical Count | Example |
|--------|---------------|---------|
| Datasets | 100-1000 | 500 datasets |
| Runs per Dataset | 1-50 | 5 runs |
| Tomograms per Run | 1-5 | 3 (raw, denoised, filtered) |
| Annotations per Run | 0-100 | 20 annotations |
| Objects per Annotation | 10-10,000 | 1,500 ribosomes |

### File Sizes

| Data Type | Typical Size | Range |
|-----------|-------------|-------|
| Tomogram | 1-10 GB | 500 MB - 50 GB |
| Tiltseries | 5-50 GB | 1 GB - 200 GB |
| Annotation File | 1-100 MB | 100 KB - 500 MB |
| Metadata JSON | 10-100 KB | 1 KB - 1 MB |

---

## Best Practices

### Querying Large Datasets

✅ **Do:**
- Use pagination for lists
- Fetch only needed fields
- Use aggregates for counts
- Filter server-side

❌ **Don't:**
- Fetch all runs at once
- Request full nested trees
- Count on client-side

**Example:**

```typescript
// ✅ Good: Paginated with specific fields
const GET_DATASETS = gql(`
  query GetDatasets($limit: Int!, $offset: Int!) {
    datasets(limitOffset: { limit: $limit, offset: $offset }) {
      id
      title
      organismName
      runsAggregate {
        aggregate { count }
      }
    }
  }
`)

// ❌ Bad: Fetch everything
const GET_ALL_DATA = gql(`
  query GetAllData {
    datasets {
      id
      runs {
        id
        tomograms {
          # ... deeply nested
        }
      }
    }
  }
`)
```

### Understanding IDs

✅ **Do:**
- Use numeric `id` for stable references
- Use `_id` (GlobalID) for GraphQL node queries
- Store IDs as numbers in state

❌ **Don't:**
- Assume IDs are sequential
- Use IDs across environments (dev vs prod)
- Hardcode IDs in code

---

## Next Steps

- [Filter System](./03-filter-system.md) - URL-driven filtering for the data model
- [State Management](../03-state/01-state-management.md) - Managing entity state
- [Feature Flags](../06-cross-cutting/04-feature-flags.md) - Conditional entity visibility
