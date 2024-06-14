# Data Organization

The Data Portal is organized in a hierarchical structure. We welcome contributions to the Portal. [Use this form](https://airtable.com/apppmytRJXoXYTO9w/shr5UxgeQcUTSGyiY?prefill_Event=Portal&hide_Event=true) to express interest in adding your data to the Portal.

## Overview

The CryoET Data Portal has 3 levels in the data hierarchy:

- **Dataset** is a set of image files for tilt series, reconstructed tomograms, and cellular and/or subcellular annotation files. Every dataset contains only one sample type prepared and imaged with the same conditions. The dataset title, such as "S. pombe cryo-FIB lamellae acquired with defocus-only," summarizes these conditions. Samples can be a cell, tissue or organism; intact organelle; in-vitro mixture of macromolecules or their complex; or in-silico synthetic data, where the experimental conditions are kept constant. Datasets typically contain multiple runs (see below). Downloading a dataset downloads all files, including all available tilt series, tomograms, and annotations.

- **Run** is one experiment, or replicate, within a dataset, where all runs in a dataset have the same sample and imaging conditions. Every run contains a collection of all tomography data and annotations related to imaging one physical location in a sample. It typically contains one tilt series and all associated data (e.g. movie frames, tilt series image stack, tomograms, annotations, and metadata), but in some cases, it may be a set of tilt series that form a mosaic. Runs contain at least one annotation for every tomogram. When downloading a run from a Portal page, you may choose to download the tomogram or all available annotations. To download all data associated with a run (i.e. all available movie frames, tilt series image stack, tomograms, annotations, and associated metadata), use the API.

- **Annotation** is a point or segmentation indicating the location of a macromolecular complex in the tomogram. On a run overview page, you may choose to download individual annotations.

For more detailed explanations refer to the sections below.

1. [Datasets](#datasets)
2. [Runs](#runs)
3. [Annotations](#annotations)
4. [Depositions](#depositions) - *Coming Soon!*

## Datasets

Datasets are contributed sets of image files associated with imaging one sample type with the same sample preparation and imaging settings. Datasets contain runs, where each run corresponds to imaging one physical location in the prepared samples. 

The Browse Datasets page shows a table of all datasets on the Portal. These datasets are not currently ordered. Instead, the right side filter panel provides options for filtering the table according to files included in the datasets, such as ground truth annotation files; the author or ID of the dataset; organism in the sample; hardware; metadata for the tilt series or reconstructed tomograms. In addition, the search bar filters based on keywords or phrases. The dataset entries in the table have descriptive names, such as "S. pombe cryo-FIB lamellae acquired with defocus-only," which aim to summarize the experiment as well as a Dataset ID assigned by the Portal, the organism name, number of runs in the dataset, and list of annotated objects, such as membrane. Datasets on the Portal may be found in other image databases. On the Browse Datasets page, the datasets table shows the EMPIAR ID for datasets that are also found on the Electron Microscopy Public Image Archive. 

On a given Dataset Overview page, the View All Info panel contains metadata for the dataset. These metadata are defined in the tables below including their mapping to attributes in the Portal API:

### Dataset Metadata

| Metadata | API field   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |

### Sample and Experiment Conditions

| Metadata | API field   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |

### Tilt Series

| Metadata | API field   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |

### Dataset Overview Page

The table on a Dataset Overview page contains an overview of the runs in the dataset. Each run has a name defined by the dataset authors as well as a Run ID, which is assigned by the Portal and is subject to change in the rare case where the run data needs to be re-ingested in the Portal. In addition to the run name, the tilt series quality and list of annotated objects is detailed for each run. Each entry has a View Tomogram button which will display the tomogram using an instance of Neuroglancer in the browser. The tomogram is visualized along with annotations that are manually chosen to display as many annotations as possible without overlap or occlusion.

#### Tilt Series Quality

The tilt series quality score is assigned by the dataset authors and is meant for comparing tilt series within a dataset on a relative subjective scale to communicate their quality estimate to users. Score ranges 1-5, with 5 being best. Below is an example scale based mainly on alignability and usefulness for the intended analysis.

| Rating | Quality   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |

### Dataset Download Options

Download options
In GUI
aws s3 --no-sign-request sync s3://cryoet-data-portal-public/10027/ 10027
Download methods
from cryoet_data_portal import Client, Dataset


client = Client()


dataset = Dataset.get_by_id(client, 10027)
dataset.download_everything('10027')
What do you get?
Folder

## Runs

A tomography run is a collection of all data and annotations related to one physical location in a sample and is associated with a dataset that typically contains many other runs. An overview of all runs in a dataset is presented in the Dataset Overview page.

Each run has its own Run Overview Page, where the View All Info panel contains metadata for the run. These metadata are defined in the tables below including their mapping to attributes in the Portal API:

### Tilt Series

This table contains all the information in the Dataset Tilt Series metadata with some additional fields.

| Metadata | API field   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |

### Tomogram

| Metadata | API field   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |


### Run Overview Page

The summary on the Run Overview page shows a subset of the run metadata as well as the number and type of files in the run and the [tilt series quality score](#tilt-series-quality).The View Tomogram button opens the associated tomogram along with annotations using an instance of Neuroglancer in the browser. The annotations displayed with the tomogram are manually chosen to display as many annotations as possible without overlap or occlusion.

The table on a Run Overview page contains an overview of the annotations for the tomograms in this run. Each annotation has an Annotation ID, which is assigned by the Portal and is subject to change in the rare case where the annotation data needs to be re-ingested in the Portal. In addition to the Annotation ID, the table shows the object annotated as well as the type of the annotation, such as segmentation or point.

### Run Download Options

Download
Direct download
Tomogram
Select tomogram based on sampling, processing, file format (zarr or mrc)
Direct download
Curl, aws, API
API
from cryoet_data_portal import Client, Tomogram


client = Client()


tomogram = Tomogram.get_by_id(client, 1014)
tomogram.download_mrcfile()


All Annotations
from cryoet_data_portal import (
  Client,
  TomogramVoxelSpacing,
)


client = Client()
tomogram_voxel_spacing = TomogramVoxelSpacing.get_by_id(
  client,
  894,
)


for annotation in tomogram_voxel_spacing.annotations:
  annotation.download()
Download individual annotations using the download button
All data using API
from cryoet_data_portal import Client, Dataset


client = Client()


dataset = Dataset.get_by_id(client, 644)
dataset.download_everything('644')


## Annotations

Annotations are summarized in a table on Run Overview pages. Each annotation has an Annotation ID, which is assigned by the Portal and is subject to change in the rare case where the annotation data needs to be re-ingested in the Portal. Each annotation labels exactly one type of object, such as ribosome or membrane, indicated by the Object Type column of the table. For every object, there is one type of annotation per entry in the table indicated in the Object Shape Type column. The options are Segmentation for semantic segmentation masks, Instance Segmentation for segmentation masks where each individual object is labeled with its own color, Point for point annotations, and Oriented Point for point annotations that have an associated vector. Annotations also have an optional precision field, which is the percentage of true positives among the total number of positive predictions where a value of 100% means everything found is actually the object of interest, and a recall field, which is the percentage of true positives among the actual number of objects where a value of 100% meaning all objects of interest were found.

Authors may also utilize the Ground Truth flag on entries in the annotation table. The Ground Truth flag indicates that this annotation is endorsed by the author for use as training or validation data for machine learning models.

Each annotation has its own metadata, which can be viewed using the info icon on the entry in the annotations table. These metadata are defined in the tables below including their mapping to attributes in the Portal API:

### Annotation Overview

| Metadata | API field   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |

### Annotation Object

| Metadata | API field   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |

### Annotation Confidence

| Metadata | API field   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |


### Visualizing Annotations with Tomograms in Neuroglancer

There is no definitive rule for which annotations are displayed with a tomogram in Neuroglancer by default. The annotations are manually chosen by the data curation team to display as many annotations as possible without overlap or occlusion. For example, when the cytoplasm is annotated as a whole, it would occlude other annotations included within, such as protein picks. When there is a ground truth and predicted annotation, the ground truth annotation is displayed by default. Authors contributing data can specify the desired default annotations during the submission process.

The CryoET Data Portal napari plugin can be used to visualize tomograms, annotations, and metadata. Refer to [this documentation](https://github.com/chanzuckerberg/napari-cryoet-data-portal#usage) to learn about how to use the plugin and to [this page](https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_napari.html) to learn more about napari and CryoET Data Portal.

### Annotation Download Options

## Depositions
Depositions are collections of data submitted together. All data being submitted together will be tagged with the same deposition ID. On the Portal, we will surface depositions that contain annotations submitted together. 

*More information is coming soon!*
