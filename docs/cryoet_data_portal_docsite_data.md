# Data Schema

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

The Browse Datasets page shows a table of all datasets on the Portal. These datasets are not currently ordered. Instead, the right side filter panel provides options for filtering the table according to files included in the datasets, such as ground truth annotation files; the author or ID of the dataset; organism in the sample; hardware; metadata for the tilt series or reconstructed tomograms. In addition, the search bar filters based on keywords or phrases. The dataset entries in the table have descriptive names, such as "S. pombe cryo-FIB lamellae acquired with defocus-only," which aim to summarize the experiment as well as the organism name, number of runs in the dataset, and list of annotated objects, such as membrane. Datasets on the Portal may be found in other image databases. On the Browse Datasets page, the datasets table shows the EMPIAR ID for datasets that are also found on the Electron Microscopy Public Image Archive. 

On a given Dataset Overview page, the View All Info panel contains metadata for the dataset. These metadata are defined in the table below:

The table on a Dataset Overview page contains an overview of the runs in the dataset. Each run has a name defined by the dataset authors as well as a Run ID, which is assigned by the Portal and is subject to change. In addition to the run name, the tilt series quality and list of annotated objects is detailed for each run. 

The tilt series quality score is assigned by the dataset authors and is meant for comparing tilt series within a dataset on a relative subjective scale to communicate their quality estimate to users. Score ranges 1-5, with 5 being best. Below is an example scale based mainly on alignability and usefulness for the intended analysis.

| Rating | Quality   | Description                                                                                                                                                                          |
| :----: | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5      | Excellent | Full Tilt Series/Reconstructions could be used in publication ready figures.                                                                                                         |
| 4      | Good      | Full Tilt Series/Reconstructions are useful for analysis (subtomogram averaging, segmentation).                                                                                      |
| 3      | Medium    | Minor parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis.                                                           |
| 2      | Marginal  | Major parts of the tilt series (projection images) need to be or have been discarded prior to reconstruction and analysis. Useful for analysis only after heavy manual intervention. |
| 1      | Low       | Not useful for analysis with current tools (not alignable), useful as a test case for problematic data only.                                                                         |
## Runs

## Annotations

## Depositions
Depositions are collections of data submitted together. All data being submitted together will be tagged with the same deposition ID. On the Portal, we will surface depositions that contain annotations submitted together. 

*More information is coming soon!*
