# Quick start

This page provides details to start using the CryoET Data Portal.

**Contents**

1. [Installation](#installation).
2. [Python quick start](python-quick-start).

## Installation


(Optional) In your working directory, make and activate a virtual environment or conda environment. For example:

```shell
python -m venv ./venv
source ./venv/bin/activate
```

Install the `cryoet-data-portal` package via pip:

```shell
pip install -U cryoet-data-portal
```

## Python quick start

Below are 3 examples of common operations you can do with the client.

### Find all tomograms for a certain organism and download preview-sized MRC files:

The following iterates over all tomograms in 

```python
import json
from cryoet_data_portal import Client, Tomogram

# Instantiate a client, using the data portal GraphQL API by default
client = Client()

# Find all tomograms related to a specific organism
tomos = Tomogram.find(
    client, [Tomogram.dataset.organism_name == "Caenorhabditis elegans"]
)
for tomo in tomos:
    # Access any useful metadata for each tomogram
    print(tomo.name)

    # Print the tomogram metadata as a json string
    print(json.dumps(tomo.to_dict(), indent=4))

    # Download a 25% size preview image (uncomment to actually download files)
    # tomo.download_mrcfile(binning=4)

```

Downloads display a progress bar by default:

```
Position_128_2
{
    "id": 21,
    "dataset_id": 10004,
    "run_id": 21,
    "name": "Position_128_2",
    <truncated>
}
Downloading https://files.cryoetdataportal.cziscience.com/10004/Position_128_2/Tomograms/CanonicalTomogram/Position_128_2_bin4.mrc to /Users/yourusername/path/to/Position_128_2_bin4.mrc
100%|████████████████████████████████████████████████████████████████| 55.7M/55.7M [00:01<00:00, 30.6MiB/s]
Position_129_2
{
... more output ...
```

### Filtering by properties on related objects:

The following finds all runs with a particular annotator and minimum tomogram size, and opens the first one in napari.

```python
from cryoet_data_portal import Client, Run
import napari


client = Client()

# Find all runs with annotations by Florian Beck and at least 300 voxels
# in the Z dimension
runs = Run.find(
    client,
    [
        Run.annotations.authors.name._in(["Florian Beck"]),
        Run.tomograms.size_z > 300,
    ],
)

for run in runs:
    print(run.name)
    # Open the omezarr for the first tomogram in this run in napari
    for tomo in run.tomograms:
        url = tomo.https_omezarr_dir
        
        viewer = napari.Viewer()
        viewer.open(url, plugin="napari-ome-zarr")
        break
    break

    
```

Napari will open omezarr tomograms after printing the run name

``` bash
Position_128_2
```
