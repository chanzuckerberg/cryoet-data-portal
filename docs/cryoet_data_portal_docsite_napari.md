# CryoET with napari

[napari](https://napari.org) is a general purpose interactive image viewer for Python
with some support for cryoET data formats and for streaming data from remote storage services like AWS-S3.

We added some extra tools and documentation to help use napari with the CryoET Data Portal.


## Installation

Installing complex Python packages like napari can be difficult, especially as it and its dependencies evolve over time.
We strongly recommend isolating your installation in a virtual or conda environment to manage this complexity.

If you followed the quick start guide and already created a Python environment to install the `cryoet-data-portal` package, you may be able to reuse that environment for installing napari.
Otherwise, create and activate a new environment with the following commands.

```shell
python -m venv ./venv
source ./venv/bin/activate
```

For many platforms, installing the latest version of napari with `pip` should work.

```shell
pip install -U "napari[all]"
```

:::attention
For ARM macOS (Apple Silicon), pre-built packages of Qt5 are not available on PyPI, so the above command will fail.
Instead, either install Qt6 separately with the following two commands

```shell
pip install -U napari
pip install -U PyQt6
```

or use `conda` or `mamba` as described in the [latest napari installation instructions](https://napari.org/dev/tutorials/fundamentals/installation.html#install-as-python-package-recommended).
:::

After successful installation, open napari by running

```shell
napari
```

from your terminal.
See the [main napari documentation for other ways to run napari](https://napari.org/stable/tutorials/fundamentals/getting_started.html).

If you run into problems with the commands above, see the [latest napari documentation for alternative and more detailed installation instructions](https://napari.org/dev/tutorials/fundamentals/installation.html#install-as-python-package-recommended) or reach out to cryoetdataportal@chanzuckerberg.org.


### Plugins

napari has some built-in functionality, but relies heavily on an ecosystem of plugins to
provide compatibility with the wide variety of data formats in the scientific imaging community.

For the CryoET Data Portal, we recommend installing two plugins to read the formats used to store tomograms.

```shell
pip install -U napari_mrcfile_reader napari_ome_zarr
```

After installing these two plugins, you should be able open tomograms from the data portal in both the MRC and OME-zarr formats.

TODO: screenshots on how to open files in napari.

Feel free to take a look at [the napari hub](https://www.napari-hub.org/) too see the variety of other napari plugins available.

:::warning
Be careful not to install too many different napari plugins in a single environment.
Each plugin is its own Python package with its own dependencies and version constraints,
so installing many packages in one environment can cause problems and even break napari itself.
Instead, create new environments to experiment with new sets of related plugins.
:::


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

TODO: screenshot/video

This plugin is not yet available on PyPI, but the latest development version can be installed with `pip` as long as you also have `git` installed.

```shell
pip install git+https://github.com/chanzuckerberg/napari-cryoet-data-portal.git
```

TODO: step 1, open napari

TODO: step 2, locate the plugin menu and open the portal widget 

Click the *Connect* button to establish a connection to the data portal.

![Connect button and editable URI to the portal](https://github.com/chanzuckerberg/napari-cryoet-data-portal/assets/2608297/bad1dbb7-2752-4b1a-b9d2-d0d685e4536c)

After connecting to the portal, datasets are added below as they are found.

![Datasets and tomograms in the portal shown as an interactive tree](https://github.com/chanzuckerberg/napari-cryoet-data-portal/assets/2608297/47ececbd-40e6-4374-9c64-18a07ce36bf2)

Datasets and tomograms can be filtered by specifying a regular expression pattern.
TODO: link to QRegularExpression docs.

![Datasets and tomograms filtered by the text 26, so that only two are shown](https://github.com/chanzuckerberg/napari-cryoet-data-portal/assets/2608297/437cb5e3-ac53-4fc0-83a9-53cd4c9f67c1)

Selecting a dataset displays its metadata, which can be similarly explored and filtered with a regular expression.

![Metadata of dataset 10000 shown as an interactive tree of keys and values](https://github.com/chanzuckerberg/napari-cryoet-data-portal/assets/2608297/f9793891-84e9-4a82-af2f-51b68bcf4287)

Selecting a tomogram displays its metadata and also opens the lowest resolution tomogram and all of its associated point annotations in the napari viewer.

![Metadata of tomogram TS_026 shown as an interactive tree of keys and values](https://github.com/chanzuckerberg/napari-cryoet-data-portal/assets/2608297/1dabcaa0-c232-4b1d-adc7-b431b4a80418)

Higher resolution tomograms can be loaded instead by selecting a different resolution and clicking the *Open* button.

![Open button and resolution selector showing high resolution](https://github.com/chanzuckerberg/napari-cryoet-data-portal/assets/2608297/9132c68a-dd8e-420b-b31e-746baa9fc2bd)

In this case, napari only loads the data that needs to be displayed in the canvas.
While this can reduce the amount of data loaded, it may also cause performance problems when initially opening and exploring the data.

In general, finding and fetching data from the portal can take a long time.
All plugin operations that fetch data from the portal try to run concurrently in order to keep interaction with napari and the plugin as responsive as possible.
These operations can also be cancelled by clicking the *Cancel* button.

![Progress bar with loading status and cancel button](https://github.com/chanzuckerberg/napari-cryoet-data-portal/assets/2608297/b0ba4a69-5f24-4aaf-99d5-37541cfff17f)