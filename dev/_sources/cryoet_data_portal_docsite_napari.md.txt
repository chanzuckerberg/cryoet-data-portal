(using-napari)=
# Using napari

[napari](https://napari.org) is a general purpose interactive image viewer for Python
with some support for cryoET data formats and for streaming data from remote storage services like AWS-S3.
We added some extra tools and documentation to help use napari with the CryoET Data Portal.


## Installation

Installing complex Python packages like napari can be difficult, especially as it and its dependencies evolve over time.
We strongly recommend isolating your installation in an environment to manage this complexity.
If you followed the quickstart guide and already created a virtual environment to install the `cryoet-data-portal` package, you *may* be able to reuse that environment for installing napari.

However, many napari users and developers use the `conda` environment manager, so we recommend that here instead.
Download and install [miniconda](https://docs.conda.io/en/latest/miniconda.html) and run the following commands to create and activate a conda environment.

```shell
conda create -y -n napari-env -c conda-forge python=3.9
conda activate napari-env
```

From here, installing the latest version of napari with `pip` should work for most platforms.

```shell
pip install -U "napari[all]"
```

:::{czi-warning} Attention
For ARM macOS (Apple Silicon), pre-built packages of Qt5 are not available on PyPI, so the above command will fail.
Instead, either install Qt6 separately with the following two commands

```shell
pip install -U napari
pip install -U PyQt6
```

or use `conda` or `mamba` as described in the [latest napari installation instructions](https://napari.org/dev/tutorials/fundamentals/installation.html#install-as-python-package-recommended).
:::

After successful installation, open napari by simply running

```shell
napari
```
from the command line.
Also see the [main napari documentation for other ways to run napari](https://napari.org/stable/tutorials/fundamentals/getting_started.html).

If you run into problems with the commands above, see the [latest napari documentation for more detailed installation instructions](https://napari.org/dev/tutorials/fundamentals/installation.html#install-as-python-package-recommended) or reach out to cryoetdataportal@chanzuckerberg.org


## Plugins

napari has some built-in functionality, but relies heavily on an ecosystem of plugins to
provide support for the wide variety of data formats in the scientific imaging community.

For the CryoET Data Portal, we recommend installing two plugins to read the formats used to store tomograms.

```shell
pip install -U napari_mrcfile_reader napari_ome_zarr
```

After installing these two plugins, you should be able open tomograms from the data portal in both the MRC and OME-zarr formats.
The simplest way to open local files and folders in napari is to drag and drop them onto napari's main canvas.
Alternatively, access napari's file menu and click on *Open File(s)* or *Open Folder* items to select local files and folders.


## Open a tomogram

Instead of opening files manually in napari, you can write Python to automate this process.
The following code finds all tomograms with a particular annotator and minimum tomogram size
using the Python client and opens the first one in napari.

:::{czi-warning} Attention
This example depends on installing the napari-ome-zarr plugin mentioned above.
:::

```python
import napari

from cryoet_data_portal import Client, Tomogram

client = Client()

# Find all tomograms with annotations by Sara Goetz and at least 300 voxels
# in the Z dimension
tomograms = Tomogram.find(
    client,
    [
        Tomogram.run.annotations.authors.name._in(["Sara Goetz"]),
        Tomogram.size_z > 300,
    ],
)

for tomo in tomograms:
    print(tomo.name)
    print(tomo.size_z)
    url = tomo.https_omezarr_dir
    viewer = napari.Viewer()
    viewer.open(url, plugin="napari-ome-zarr")
    break

napari.run()
```

After running this from the command line, napari should open and display the multi-scale
OME-zarr tomogram after printing the run name and z-size

```
TS_026
1000
```

though this may take a while depending on your network connection.


## Data portal plugin

We also built [a plugin that lets you browse the CryoET Data Portal in napari](https://github.com/chanzuckerberg/napari-cryoet-data-portal) to quickly display tomograms, annotations, and metadata


```{image} https://github.com/chanzuckerberg/cryoet-data-portal/assets/2608297/2e8f0792-7fc7-4831-b3da-3202d5995843
:alt: napari with the CryoET Data Portal widget showing
:align: center
```

This plugin can be installed from PyPI by running

```shell
pip install -U napari-cryoet-data-portal
```

After installation, navigate to napari's *Plugins* menu and click on the *CryoET Data Portal* item to open the browser.

```{image} https://github.com/chanzuckerberg/cryoet-data-portal/assets/2608297/f129cdab-f97d-4514-a631-f9401d7c7bac
:alt: The napari plugin menu showing the CryoET Data Portal item
:align: center
```

See the [plugin's README](https://github.com/chanzuckerberg/napari-cryoet-data-portal#usage) for details on how to use it.
