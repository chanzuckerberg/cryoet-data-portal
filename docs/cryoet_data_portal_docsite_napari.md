# napari

[napari](https://napari.org) is a general purpose interactive image viewer for Python
with some support cryoET data formats and streaming data from storage services like AWS-S3.

We added some extra tools and documentation to help use napari with the CryoET Data Portal.


## Installation

See the [napari documentation on how to install it locally on your machine](https://napari.org/stable/tutorials/fundamentals/installation.html).

Installing complex Python packages like napari can be difficult, especially
as it, its dependencies, and operating systems evolve over time.
Therefore, strongly consider isolating your installation in a virtual or conda environment.

napari has some built-in functionality, but relies heavily on an ecosystem of plugins to
provide compatibility with the wide variety of data formats in the scientific imaging community.
Take a look at [the napari hub](https://www.napari-hub.org/) too see the variety of
plugins available that augment napari's functionality.

We recommend installing plugins that are particularly useful for interacting with the CryoET Data Portal.

```shell
pip install -U napari_mrcfile_reader napari_ome_zarr
```

:::warning
Be careful not to install too many different napari plugins in a single environment.
Each plugin is its own Python package with its own dependencies and version constraints,
so installing many packages in one environment can cause problems and even break napari itself.
Instead, create new environments to experiment with new sets of related plugins.
:::

If you run into problems during installation, feel free to reach out to
cryoetdataportal@chanzuckerberg.org for support.


## Display a tomogram

The following code finds all tomograms with a particular annotator and minimum tomogram size,
and opens the first one in napari.

```python
import napari

from cryoet_data_portal import Client, Tomogram

client = Client()

# Find all tomograms with annotations by Sara Goetz and at least 300 voxels
# in the Z dimension
tomograms = Tomogram.find(
    client,
    [
        Tomogram.tomogram_voxel_spacing.annotations.authors.name._in(["Sara Goetz"]),
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

napari should open and display the multi-scale OME-zarr tomogram after printing the
run name and z-size

```
TS_026
1000
```

though this may take a while depending on your network connection.


## Browse the portal with our plugin

We built [a plugin that lets you browse the CryoET Data Portal in napari to quickly display tomograms, annotations, and metadata](https://github.com/chanzuckerberg/napari-cryoet-data-portal).

This plugin is not yet available on PyPI, but the latest development version can be installed with `pip` as long as you also have `git` installed.
Use the following command to install this plugin.

```shell
pip install git+https://github.com/chanzuckerberg/napari-cryoet-data-portal.git
```
