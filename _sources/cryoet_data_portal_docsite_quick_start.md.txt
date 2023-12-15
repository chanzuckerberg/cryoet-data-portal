# Quick start

This page provides details to start using the CryoET Data Portal.

**Contents**

1. [Installation](#installation).
2. [Python quick start](#python-quick-start).

## Installation


(Optional) In your working directory, make and activate a virtual environment or conda environment. For example:

```shell
python -m venv ./venv
source ./venv/bin/activate
```

Install the latest `cryoet-data-portal` package via pip:

```shell
pip install -U cryoet-data-portal
```

## Python quick start

Below are 3 examples of common operations you can do with the client.

### Browse data in the portal

The following iterates over all datasets in the portal, then all runs per dataset, then all tomograms per run

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

And outputs the name of each object:

```
Dataset: S. pombe cells with defocus
  - run: TS_026
    - voxel spacing: 13.48
        - tomo: TS_026
...
```

### Find all tomograms for a certain organism and download preview-sized MRC files:

The following iterates over all tomograms related to a specific organism and downloads a 25% scale preview tomogram in MRC format for each one.

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
