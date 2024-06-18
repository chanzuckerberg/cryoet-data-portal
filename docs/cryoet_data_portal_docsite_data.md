# Data Organization

The Data Portal is organized in a hierarchical structure. We welcome contributions to the Portal. [Use this form](https://airtable.com/apppmytRJXoXYTO9w/shr5UxgeQcUTSGyiY?prefill_Event=Portal&hide_Event=true) to express interest in adding your data to the Portal.

## Overview

The CryoET Data Portal has 3 levels in the data hierarchy:

- **Dataset** is a set of image files for tilt series, reconstructed tomograms, and cellular and/or subcellular annotation files. Every dataset contains only one sample type prepared and imaged with the same conditions. The dataset title, such as "S. pombe cryo-FIB lamellae acquired with defocus-only," summarizes these conditions. Samples can be a cell, tissue or organism; intact organelle; in-vitro mixture of macromolecules or their complex; or in-silico synthetic data, where the experimental conditions are kept constant. Datasets typically contain multiple runs (see below). Downloading a dataset downloads all files, including all available tilt series, tomograms, and annotations.

- **Run** is one experiment, or replicate, within a dataset, where all runs in a dataset have the same sample and imaging conditions. Every run contains a collection of all tomography data and annotations related to imaging one physical location in a sample. It typically contains one tilt series and all associated data (e.g. movie frames, tilt series image stack, tomograms, annotations, and metadata), but in some cases, it may be a set of tilt series that form a mosaic. Runs contain at least one annotation for every tomogram. When downloading a run from a Portal page, you may choose to download the tomogram or all available annotations. To download all data associated with a run (i.e. all available movie frames, tilt series image stack, tomograms, annotations, and associated metadata), [use the API](#run-download-options).

- **Annotation** is a point or segmentation indicating the location of a macromolecular complex in the tomogram. On a run overview page, you may choose to download individual annotations.

For more detailed explanations refer to the sections below.

1. [Datasets](#datasets)
2. [Runs](#runs)
3. [Annotations](#annotations)
4. [Depositions](#depositions) - *Coming Soon!*

## Datasets

Datasets are contributed sets of image files associated with imaging one sample type with the same sample preparation and imaging settings. Datasets contain runs, where each run corresponds to imaging one physical location in the prepared samples.

The Browse Datasets page shows a table of all datasets on the Portal. These datasets are not currently ordered. Instead, the right side filter panel provides options for filtering the table according to files included in the datasets, such as ground truth annotation files; the author or ID of the dataset; organism in the sample; hardware; metadata for the tilt series or reconstructed tomograms. In addition, the search bar filters based on keywords or phrases. The dataset entries in the table have descriptive names, such as "S. pombe cryo-FIB lamellae acquired with defocus-only," which aim to summarize the experiment as well as a Dataset ID assigned by the Portal, the organism name, number of runs in the dataset, and list of annotated objects, such as membrane. Datasets on the Portal may be found in other image databases. On the Browse Datasets page, the datasets table shows the EMPIAR ID for datasets that are also found on the Electron Microscopy Public Image Archive.

On a given Dataset Overview page, the View All Info panel contains metadata for the dataset.

### Dataset Overview Page

The table on a Dataset Overview page contains an overview of the runs in the dataset. Each run has a name defined by the dataset authors as well as a Run ID, which is assigned by the Portal and is subject to change in the rare case where the run data needs to be re-ingested to the Portal. In addition to the run name, the [tilt series quality](#tilt-series-quality) and list of annotated objects is detailed for each run. Each entry has a `View Tomogram` button which will display the tomogram using an instance of Neuroglancer in the browser. The tomogram is visualized along with annotations that are manually chosen to display as many annotations as possible without overlap or occlusion.

#### Tilt Series Quality

The tilt series quality score is assigned by the dataset authors to communicate their quality estimate to users. This score is only applicable for comparing tilt series within a dataset on a relative subjective scale. Score ranges 1-5, with 5 being best. Below is an example scale based mainly on alignability and usefulness for the intended analysis.

| Rating | Quality   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.|

### Dataset Download Options

The `Download Dataset` button opens a dialog with instructions for downloading the dataset using [Amazon Web Services Command Line Interface](./cryoet_data_portal_docsite_aws.md) or the [Portal API](./python-api.rst). Datasets are downloaded as folders named the Dataset ID. The folder contains subfolders for each run named the author-chosen run name, a folder named Images which contains the key photos of the dataset displayed on the Portal, and a JSON file named `dataset_metadata.json` containing the dataset metadata. The run folders contain subfolders named Tomogram and TiltSeries, containing the tomogram and tilt series image files, and a JSON file named `run_metadata.json` containing the run metadata. More details on the run folder file structure is found in the documentation [below](#run-download-options).

## Runs

A tomography run is a collection of all data and annotations related to one physical location in a sample and is associated with a dataset that typically contains many other runs. On the Data Portal pages, runs are directly linked to their tomograms. However, in the [data schema](https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html#data-model) used in the Portal API, runs are connected to tomograms through the `TomogramVoxelSpacing` class which specifies the sampling or voxel size of the tomogram. For a single run, multiple tomograms of different spacings can be available.

An overview of all runs in a dataset is presented in the Dataset Overview page. Each run has its own Run Overview Page, where the View All Info panel contains metadata for the run. 

### Run Overview Page

The summary on the Run Overview page shows a subset of the run metadata as well as the number and type of files in the run and the [tilt series quality score](#tilt-series-quality). The `View Tomogram` button opens the associated tomogram along with annotations using an instance of Neuroglancer in the browser. The annotations displayed with the tomogram are manually chosen to display as many annotations as possible without overlap or occlusion.

The table on a Run Overview page contains an overview of the annotations for the tomograms in this run. Each annotation has an Annotation ID, which is assigned by the Portal and is subject to change in the rare case where the annotation data needs to be re-ingested in the Portal. In addition to the Annotation ID, the table shows the object annotated, the type of the annotation, such as segmentation or point, the method used for annotation, such as manual or automated, and metrics for assessing the annotation.

### Run Download Options

The `Download Run` button opens a dialog with instructions for downloading tomograms or all annotations. Tomograms can be downloaded directly in the browser as MRC or OME-Zarr files following selection of which tomogram to download based on the tomogram sampling and processing. The All Annotations option provides instructions on using [Amazon Web Services Command Line Interface](./cryoet_data_portal_docsite_aws.md) or the [Portal API](./python-api.rst) to download. 

You can also use the Portal API to download all run data as a folder. For example, to download all run data for Run ID 645 into your current working directory, use the below code snippet: 

```python
from cryoet_data_portal import Client, Run

client = Client()

run = Run.get_by_id(client, 645)
run.download_everything()
```

Runs are downloaded as folders named the author-chosen run name. The folder contains subfolders named Tomograms and TiltSeries and a JSON file named `run_metadata.json` containing the run metadata. The Tomogram folder has a subfolder for every voxel spacing available, and each of those folders contains subfolders NeuorglancerPrecompute, which has files for visualizing the data in Neuroglancer; KeyPhotos, which contains the key photos of the run displayed on the Portal; CanonicalTomogram, which has the tomogram as an MRC file and OME-Zarr directory along with tomogram metadata and metadata for visualizing the tomogram with Neuroglancer; and Annotations. More details on the Annotation folder file structure is found in the documentation [below](#annotation-download-options). The TiltSeries folder contains the tilt series images as an MRC file and OME-Zarr directory as well as a JSON file with the tilt series metadata.

## Annotations

Annotations are summarized in a table on Run Overview pages. Each annotation has an Annotation ID, which is assigned by the Portal and is subject to change in the rare case where the annotation data needs to be re-ingested in the Portal. Each annotation labels exactly one type of object, such as ribosome or membrane, indicated by the Object Type column of the table. For every object, there is one type of annotation per entry in the table indicated in the Object Shape Type column. The options are Segmentation for semantic segmentation masks, Instance Segmentation for segmentation masks where each individual object is labeled with its own color, Point for point annotations, and Oriented Point for point annotations that have an associated rotation matrix. The method used for generating the annotation is displayed for each annotation with manual meaning the annotations were created by hand, automated meaning automated tools or algorithms without supervision were used, and hybrid meaning the annotations were generated using a combination of automated and manual methods.

Annotations also have an optional precision field, which is the percentage of true positives among the total number of positive predictions where a value of 100% means everything found is actually the object of interest, and a recall field, which is the percentage of true positives among the actual number of objects where a value of 100% meaning all objects of interest were found. The Precision and Recall fields can only be calculated by comparing with a ground truth annotation, so for many annotations on the Portal, this field is marked NA for not available.

Authors may also utilize the Ground Truth flag on entries in the annotation table. The Ground Truth flag indicates that this annotation is endorsed by the author for use as training or validation data for machine learning models.

Each annotation has its own metadata, which can be viewed using the info icon on the entry in the annotations table.

### Visualizing Annotations with Tomograms in Neuroglancer

There is no definitive rule for which annotations are displayed with a tomogram in Neuroglancer by default. The annotations are manually chosen by the data curation team to display as many annotations as possible without overlap or occlusion. For example, when the cytoplasm is annotated as a whole, it would occlude other annotations, such as protein picks. When there is a ground truth and predicted annotation, the ground truth annotation is displayed by default. Authors contributing data can specify the desired default annotations during the submission process.

The CryoET Data Portal napari plugin can be used to visualize tomograms, annotations, and metadata. Refer to [this documentation](https://github.com/chanzuckerberg/napari-cryoet-data-portal#usage) to learn about how to use the plugin and to [this page](https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_napari.html) to learn more about napari and CryoET Data Portal.

### Annotation Download Options

Individual entries in the annotations table can be downloaded using the `Download` button on the right side of the table.

Instance Segmentations, Oriented Points, and Points all can be downloaded directly in the browser as Newline Delimited JSON (ndJSON) files, where each line in the file is its own JSON. The download dialog also has instructions for downloading using curl, [Amazon Web Services Command Line Interface](./cryoet_data_portal_docsite_aws.md) or the [Portal API](./python-api.rst). In all cases, the JSON entries have a `type` field with instancePoint, orientedPoint, and point for Instance Segmentations, Oriented Points, and Points, respectively, and a `location` field with the x, y, z coordinates. For Instance Segmentations, there is also an `instance_id` to group points into geometric segmentation masks. For Oriented Points, there is also an `xyz_rotation_matrix` field with a 3x3 rotation matrix corresponding to each point.

Semantic segmentation masks can downloaded using [Amazon Web Services Command Line Interface](./cryoet_data_portal_docsite_aws.md) or the [Portal API](./python-api.rst) as MRC files or OME-Zarr directories. When downloading all annotations on a Run Overview page, both the MRC file and the OME-Zarr directory will be downloaded for each segmentation mask.

## Depositions
Depositions are collections of data submitted together. All data being submitted together will be tagged with the same deposition ID. On the Portal, we will surface depositions that contain annotations submitted together.

*More information is coming soon!*
