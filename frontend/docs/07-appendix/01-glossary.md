# Glossary

This glossary defines domain-specific terminology used in the CryoET Data Portal frontend codebase. Understanding these terms is essential for working with the application's data model and user interface.


---

## CryoET Domain Terms

| Term                                  | Definition                                                                                                                                                                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alignment**                         | The process and metadata for aligning a tilt series to create a 3D reconstruction. Can be LOCAL (per-section) or GLOBAL (whole series). Includes transformation matrices and volume dimensions. |
| **Annotation**                        | Metadata describing identified objects within a tomogram. Includes information about the annotation method (manual/automated/hybrid), confidence metrics, and object identifiers.               |
| **Annotation Method**                 | The technique used to generate annotations (e.g., manual picking, crYoLO, template matching, Positive Unlabeled Learning). Stored in `annotationMethod` field.                                  |
| **Annotation Shape**                  | The specific geometric representation of an annotated object. Can be Point, OrientedPoint, InstanceSegmentation, or SegmentationMask.                                                           |
| **Cryo-Electron Tomography (CryoET)** | A microscopy technique that captures 3D images of biological samples frozen at cryogenic temperatures by collecting multiple 2D images at different tilt angles.                                |
| **Dataset**                           | A collection of related runs, typically representing a scientific study or experimental series. Contains metadata about sample preparation, imaging conditions, and associated publications.    |
| **Deposition**                        | A submission of data to the portal. Can be a dataset deposition or an annotation deposition. Includes depositor information, dates, and associated files.                                       |
| **Ground Truth**                      | An annotation that has been verified as accurate and is used as a reference standard. Indicated by `groundTruthStatus` boolean field.                                                           |
| **Object ID**                         | A standardized identifier for annotated biological structures, typically from Gene Ontology Cellular Component (GO) or UniProtKB. Stored in `objectId` field.                                   |
| **Object Name**                       | Human-readable name of the annotated biological structure (e.g., "ribosome", "nuclear pore complex", "actin filament", "membrane").                                                             |
| **Reconstruction Method**             | The algorithm used to generate a tomogram from a tilt series (e.g., Weighted Back Projection, SIRT, SART).                                                                                      |
| **Run**                               | A single tomographic data collection session. Contains tilt series, alignments, tomograms, and annotations. Part of a dataset.                                                                  |
| **Shape Type**                        | The geometric representation type for an annotation. Values include: `Point`, `OrientedPoint`, `InstanceSegmentation`, `SegmentationMask`.                                                      |
| **Tilt Offset**                       | Additional angular offset applied during alignment, measured in degrees. Used to correct for stage tilt errors.                                                                                 |
| **Tilt Series**                       | A sequence of 2D images of the same sample captured at incrementally different tilt angles. Raw data used to generate tomograms.                                                                |
| **Tiltseries**                        | (Alternative spelling) Same as Tilt Series. Used in type names and API fields.                                                                                                                  |
| **Tomogram**                          | A 3D reconstruction generated from a tilt series through alignment and reconstruction algorithms. The primary 3D volume data.                                                                   |
| **Voxel Spacing**                     | The physical distance between adjacent volume elements (voxels) in a tomogram, measured in angstroms (Å). Critical for scale and measurement accuracy.                                          |

---

## Technical Terms

| Term                      | Definition                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Angstrom (Å)**          | Unit of measurement equal to 0.1 nanometers or 10⁻¹⁰ meters. Used for voxel spacing and volume dimensions in CryoET data.           |
| **Confidence Precision**  | Percentage of annotated objects that are true positives. Measures annotation accuracy.                                              |
| **Confidence Recall**     | Percentage of true positive objects that were correctly annotated. Measures annotation completeness.                                |
| **Deposition Date**       | ISO 8601 formatted date when data was first received by the portal. Stored as `DateTime` scalar.                                    |
| **Entity Interface**      | GraphQL interface implemented by domain objects (Alignment, Annotation, Dataset, etc.). Provides common fields like `id` and `_id`. |
| **GlobalID**              | Unique identifier following Relay GraphQL specification. Distinguished from numeric `id` field which may change.                    |
| **HTTPS Path**            | Public web URL for accessing data files. Typically points to S3-backed content delivery.                                            |
| **Method Type**           | Classification of annotation generation approach. Enum values: `manual`, `automated`, `hybrid`.                                     |
| **Neuroglancer Config**   | Configuration string for the Neuroglancer 3D viewer, specifying data sources, shaders, and visualization parameters.                |
| **Per Section Alignment** | Individual alignment parameters for each section/tilt in a tilt series. Part of LOCAL alignment approach.                           |
| **Portal Standard**       | Indicates whether an alignment is the recommended/canonical version for the portal. Boolean flag `isPortalStandard`.                |
| **Processing**            | Post-processing applied to a tomogram (e.g., denoising, filtering). Stored as string field.                                         |
| **Reconstruction Volume** | The 3D space defined by alignment parameters, including dimensions (X/Y/Z) and offsets. Measured in angstroms.                      |
| **Release Date**          | ISO 8601 formatted date when data became publicly accessible on the portal.                                                         |
| **S3 Path**               | Amazon S3 object key for data files stored in cloud object storage. Internal storage path.                                          |

---

## UI/UX Terms

| Term                   | Definition                                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Browse Data**        | Top-level navigation mode. Enum values: `datasets`, `depositions`, `runs`. Defined in `BrowseDataType` enum.                                                   |
| **Breadcrumbs**        | Navigation trail showing current location. Types include: `all-datasets`, `all-depositions`, `single-dataset`, `return-to-deposition`.                         |
| **Deposited Location** | Geographic or institutional location where data was deposited. Used for grouping in UI tables.                                                                 |
| **Download Type**      | Type of data available for download. Enum includes: `AllAnnotations`, `Tomogram`. Defined in `DownloadType` enum.                                              |
| **Filter State**       | URL-synchronized state for browse/search filters. Managed through URL search parameters for shareability.                                                      |
| **Group By Option**    | UI option for organizing tabular data. Used in deposition views to group by location or run.                                                                   |
| **Key Photo URL**      | URL to thumbnail or representative image for a tomogram. Used in browse views and cards.                                                                       |
| **Method Type Filter** | Filter option for annotation method classification (manual/automated/hybrid).                                                                                  |
| **Object Shape Type**  | UI-facing representation of annotation shape type. TypeScript type: `'InstanceSegmentation' \| 'OrientedPoint' \| 'Point' \| 'SegmentationMask'`.              |
| **Row Data**           | Flattened data structure for table rows. Types include `AnnotationRowData` and `TomogramRowData` with denormalized fields.                                     |
| **Run Name**           | Human-readable identifier for a run, typically following a naming convention with dataset prefix.                                                              |

---

## GraphQL Terms

| Term                    | Definition                                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Aggregate Functions** | GraphQL query capabilities for computing statistics (count, sum, avg, min, max, stddev, variance) across collections.             |
| **Connection**          | Relay-style pagination pattern. Types include `AnnotationConnection`, `TomogramConnection`, etc. Contains `edges` and `pageInfo`. |
| **Edge**                | Individual item in a Relay connection, containing `node` (the actual data) and `cursor` (for pagination).                         |
| **Fragment Masking**    | GraphQL Codegen feature (disabled in this project via `fragmentMasking: false`) that would wrap fragment types.                   |
| **Node Interface**      | GraphQL interface for entities with globally unique IDs. Provides `_id` field of type `GlobalID`.                                 |
| **Order By Clause**     | GraphQL input type specifying sort order. Each entity has a corresponding `OrderByClause` type.                                   |
| **Page Info**           | Pagination metadata in Relay connections. Contains `hasNextPage`, `hasPreviousPage`, `startCursor`, `endCursor`.                  |
| **Where Clause**        | GraphQL input type for filtering queries. Each entity has a corresponding `WhereClause` type with field comparators.              |

---

## Code Organization Terms

| Term                        | Definition                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **API Response Type**       | TypeScript interface defining response shape from route loaders. Examples: `DepositionDatasetsResponse`, `AnnotationsResponse`. |
| **Breadcrumb Type**         | Enum defining breadcrumb navigation context. Values map to different navigation states in the app.                              |
| **Data Contents Type**      | Type parameter specifying whether view shows annotations or tomograms. Used in generic deposition components.                   |
| **Deposition Grouped Data** | Hook and utility types for organizing deposition data by location and run. See `useDepositionGroupedData` hook.                 |
| **Deposition Type**         | Enum distinguishing between dataset and annotation depositions. Values: `Dataset`, `Annotation`.                                |
| **Entity Interface Type**   | TypeScript representation of GraphQL `EntityInterface`. Common base for domain objects.                                         |
| **Generated Types**         | TypeScript types auto-generated from GraphQL schema in `app/__generated_v2__/` directory.                                       |
| **Row Data Interface**      | TypeScript interface for flattened table data. Includes computed fields for display (e.g., `depositedLocation`, `runName`).     |
| **Shape Type Literal**      | TypeScript literal union type for annotation shapes. More restrictive than GraphQL enum.                                        |

---

## Next Steps

- [External Resources](./02-external-resources.md) - Links to external documentation for technologies used
- [Technology Stack](../01-architecture/00-foundation/01-technology-stack.md) - Overview of all technologies used
