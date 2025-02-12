---
hide-navigation: true
---

# Changelog

:::{czi-warning} Attention
The v3 Python API will be deprecated on Wednesday, February 26, 2025. Please update your Python API client to continue accessing the `cryoet-data-portal` package.

## v4 Python API

8 new classes were added to the API:

| Class name | Description |
| :---: | :---: |
| `Alignment` | Tilt series alignment |
| `AnnotationMethodLink` | A set of links to models, source code, documentation, etc referenced by annotation method |
| `AnnotationShape` | Shapes associated with an annotation |
| `DepositionType` | The type of data submitted as a part of a deposition (e.g. annotation, dataset, tomogram) |
| `Frame` | Raw frames used for generating tilt series |
| `FrameAcquisitionFile` | References to files containing more information about frame acquisition |
| `GainFile` | Gain values for frames in this run |
| `PerSectionAlignmentParameters` | Map alignment parameters to tilt series frames |

### Changes to the Client

The v4 release of the Python API was paired with the v3 release of the Client. A summary of the changes between Client v2 and Client v3 is below.

| Client V2 Field | Client V3 Field |
| :---: | :---: |
| `Annotation.files` | `Annotation.annotation_shapes[*].annotation_files` |
| `Annotation.tomogram_voxel_spacing` | `Annotation.annotation_shapes[*].annotation_files[*].tomogram_voxel_spacing` |
| `AnnotationFile.annotation` | `AnnotationFile.annotation_shape.annotation` |
| `AnnotationFile.shape_type` | `AnnotationFile.annotation_shape.shape_type` |
| `AnnotationAuthor.primary_annotator_status` | removed |
| `Dataset.dataset_citations` | removed |
| `Dataset.organism_taxid` | Converted from str -> int |
| `Dataset.related_database_links` | `Dataset.related_database_entries` |
| `TiltSeries.frames_count` | `TiltSeries.tiltseries_frames_count` |
| `TiltSeries.https_mrc_bin1` | `TiltSeries.https_mrc_file` |
| `TiltSeries.s3_mrc_bin1` | `TiltSeries.s3_mrc_file` |
| `TiltSeries.s3_alignment_file` | `TiltSeries.alignments[*].download_alignment_file(FORMAT)` |
| `TiltSeries.https_alignment_file` | `TiltSeries.alignments[*].download_alignment_file(FORMAT)` |
| `Tomogram.https_mrc_scale0` | `Tomogram.https_mrc_file` |
| `Tomogram.s3_mrc_scale0` | `Tomogram.s3_mrc_file` |
| `Tomogram.type` | Replaced with `Tomogram.is_canonical` and `Tomogram.is_standardized` |
| `Tomogram.affine_transformation_matrix` | `Tomogram.alignment.affine_transformation_matrix` |
| `Deposition.dataset` | `Deposition.datasets` |
| `Deposition.deposition_types` | `Deposition.deposition_types[*].type` |
| `Deposition.https_prefix` | removed |
| `TomogramVoxelSpacing.annotations` | `TomogramVoxelSpacing.annotation_files[*].annotation_shape.annotations` |
| `Tiltseries.download_collection_metadata()` | removed |
