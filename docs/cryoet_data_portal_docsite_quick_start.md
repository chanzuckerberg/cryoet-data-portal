# Quick start

This page provides details to help you get started using the CryoET Data Portal Client API.

**Contents**

1. [Installation](#installation)
2. [API Functions Overview](#api-functions-overview)
3. [Example Code Snippets](#examples)

## Installation

### Requirements

The CryoET Data Portal Client requires a Linux or MacOS system with:

- Python 3.7 to Python 3.11.
- Recommended: >16 GB of memory.
- Recommended: >5 Mbps internet connection.
- Recommended: for increased performance, use the API through an AWS-EC2 instance from the region `us-west-2`. The CryoET Portal data are hosted in a AWS-S3 bucket in that region.

### Install in a Virtual Environment

(Optional) In your working directory, make and activate a virtual environment or conda environment. For example:

```shell
python -m venv ./venv
source ./venv/bin/activate
```

Install the latest `cryoet_data_portal` package via pip:

```shell
pip install -U cryoet-data-portal
```

## API Functions Overview

The Portal API has functions for searching and downloading data. **Every class** has a `find` and `get_by_id` method for selecting data, and most classes have `download...` methods for downloading the data. Below is a table of the API classes download functions.

| **Class**               | **Download Functions**                                                                                 |
|-------------------------|--------------------------------------------------------------------------------------------------------|
| Dataset                 | `download_everything`                                                                                  |
| DatasetAuthor           | None                                                                                                   |
| DatasetFunding          | None                                                                                                   |
| Run                     | `download_everything`                                                                                  |
| TomogramVoxelSpacing    | `download_everything`                                                                                  |
| Tomogram                | `download_all_annotations`, `download_mrcfile`, `download_omezarr`                                     |
| TomogramAuthor          | None                                                                                                   |
| Annotation              | `download`                                                                                            |
| AnnotationFile          | None                                                                                                   |
| AnnoatationAuthor       | None                                                                                                   |
| TiltSeries              | `download_alignment_file`, `download_angle_list`, `download_collection_metadata`, `download_mrcfile`, `download_omezarr` |

The `find` method selects data based on user-chosen queries. These queries can have python operators `==`, `!=`, `>`, `>=`, `<`, `<=`; method operators `like`, `ilike`, `_in`; and strings or numbers. The method operators are defined in the table below:

| **Method Operator** | **Definition**                                                                               |
|---------------------|----------------------------------------------------------------------------------------------|
| like                | partial match, with the `%` character being a wildcard                                        |
| ilike               | case-insensitive partial match, with the `%` character being a wildcard                       |
| _in                 | accepts a list of values that are acceptable matches                                          |

The general format of using the `find` method is as follows:

```
data_of_interest = find(client, queries)
```

The `get_by_id` method allows you to select data using the ID found on the Portal. For example, to select the data for [Dataset 10005](https://cryoetdataportal.czscience.com/datasets/10005) on the Portal and download it into your current directory use this snippet:

```
data_10005 = Dataset.get_by_id(client, 10005)
data_10005.download_everything()
```

## Examples

Below are 3 examples of common operations you can do with the API. Check out the [examples page](./cryoet_data_portal_docsite_examples.md) for more code snippets or the [tutorials page](./tutorials.md) for longer examples.

### Browse all data in the portal

To illustrate the relationships among the classes in the Portal, below is a loop that iterates over all datasets in the portal, then all runs per dataset, then all tomograms per run and outputs the name of each object.

:::{attention}
This loop is impractical! It iterates over all data in the Portal. It is simply for demonstrative purposes and should not be included in efficient code.
:::

```python
from cryoet_data_portal import Client, Dataset

# Instantiate a client, using the data portal GraphQL API by default
client = Client()

# Iterate over all datasets
for dataset in Dataset.find(client):
    print(f"Dataset: {dataset.title}")
    for run in dataset.runs:
        print(f"  - run: {run.name}")
        for tvs in run.tomogram_voxel_spacings:
            print(f"    - voxel spacing: {tvs.voxel_spacing}")
            for tomo in tvs.tomograms:
                print(f"        - tomo: {tomo.name}")

```

The output with the object names would display something like:

```
Dataset: S. pombe cells with defocus
  - run: TS_026
    - voxel spacing: 13.48
        - tomo: TS_026
...
```

### Find all datasets containing membrane annotations

The below example uses the `find` method with a longer API expression in the query to select datasets that have membrane annotations and print the IDs of those datasets.

```
import cryoet_data_portal as portal

# Instantiate a client, using the data portal GraphQL API by default
client = portal.Client()

# Use the find method to select datasets that contain membrane annotations
datasets = portal.Dataset.find(client, [portal.Dataset.runs.tomogram_voxel_spacings.annotations.object_name.ilike("%membrane%")])
for d in datasets:
   print(d.id)
```

### Find all tomograms for a certain organism and download preview-sized MRC files:

The following iterates over all tomograms related to a specific organism and downloads each tomogram in MRC format.

```python
import json

from cryoet_data_portal import Client, Tomogram

# Instantiate a client, using the data portal GraphQL API by default
client = Client()

# Find all tomograms related to a specific organism
tomos = Tomogram.find(
    client,
    [
        Tomogram.tomogram_voxel_spacing.run.dataset.organism_name
        == "Schizosaccharomyces pombe"
    ],
)
for tomo in tomos:
    # Access any useful metadata for each tomogram
    print(tomo.name)

    # Print the tomogram metadata as a json string
    print(json.dumps(tomo.to_dict(), indent=4))

    # Download a tomogram in the MRC format (uncomment to actually download files)
    # tomo.download_mrcfile()
```

Downloads display a progress bar by default:

```
TS_026
{
    "id": 121,
    "tomogram_voxel_spacing_id": 1,
    "name": "TS_026",
... more output ...
```
