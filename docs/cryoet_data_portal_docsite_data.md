# Data Schema

The Data Portal organizes data in a hierarchial structure. We welcome contributions to the Portal. [Use this form](https://airtable.com/apppmytRJXoXYTO9w/shr5UxgeQcUTSGyiY?prefill_Event=Portal&hide_Event=true) to express interest in adding your data to the Portal.

## Overview

The CryoET Data Portal uses the following data schema:

- A **dataset** is a set of image files for tilt series, reconstructed tomograms, and cellular and/or subcellular annotation files. Every dataset contains only one sample type prepared and imaged with the same conditions. The dataset title, such as "S. pombe cryo-FIB lamellae acquired with defocus-only," summarizes these conditions. Samples can be a cell, tissue or organism; intact organelle; in-vitro mixture of macromolecules or their complex; or in-silico synthetic data, where the experimental conditions are kept constant. Datasets typically contain multiple runs (see below). Downloading a dataset downloads all files, including all available tilt series, tomograms, and annotations.

- A **run** is one experiment, or replicate, within a dataset, where all runs in a dataset have the same sample and imaging conditions. Every run contains a collection of all tomography data and annotations related to imaging one physical location in a sample. It typically contains one tilt series and all associated data (e.g. movie frames, tilt series image stack, tomograms, annotations, and metadata), but in some cases, it may be a set of tilt series that form a mosaic. Runs contain at least one annotation for every tomogram. When downloading a run from a Portal page, you may choose to download the tomogram or all available annotations. To download all data associated with a run (i.e. all available movie frames, tilt series image stack, tomograms, annotations, and associated metadata), please refer to the API download guide.

- An **annotation** is a point or segmentation indicating the location of a macromolecular complex in the tomogram. On the run page, you may choose to download tomograms with their annotations.

For more detailed explanations refer to the sections below.

1. [Datasets](#datasets)
2. [Runs](#runs)
3. [Annotations](#annotations)
4. [Depositions](#depositions)

## Datasets

## Runs

## Annotations

## Depositions
