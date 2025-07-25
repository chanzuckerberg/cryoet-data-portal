(examples)=
# Examples

Below are code snippets for completing various tasks using the Python Client API. Have an example you'd like to share with the community? Submit a [GitHub issue](https://github.com/chanzuckerberg/cryoet-data-portal/issues) and include "Example:" in your title.

:::{admonition} Access and download alignment files <a class="headerlink" href="#download-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: download-example
:collapsible: open

Alignment files are stored in the database, as well as in metadata-files on S3.

You have multiple options for accessing them:

- Directly using the API client by using `Alignment.per_section_alignments` (see the {class}`PerSectionSectionAlignmentParameters class <cryoet_data_portal.PerSectionAlignmentParameters>`). Retrieve the metadata file on the S3 bucket using `Alignment.s3_alignment_metadata(S3-URI)` or `Alignment.https_alignment_metadata(HTTP-URL)`.

- For an even more convenient way, you can use the `cryoet-alignment` python package to directly create [AreTomo3-](https://github.com/czimaginginstitute/AreTomo3) or [IMOD-formatted](https://bio3d.colorado.edu/imod/) alignment files:

To install the `cryoet-alignment` package with pip, use: `pip install "cryoet-alignment>=0.0.10"`

The below code snippet shows how to download tiltseries and alignments for dataset 10447 using the `cryoet-alignment` package with the `cryoet-data-portal` API:

```
import cryoet_data_portal as cdp
import os
from cryoet_alignment.io.cryoet_data_portal import Alignment
from cryoet_alignment import write

client = cdp.Client()

# Loop through all tomograms of 10447
for tomogram in cdp.Tomogram.find(client, [cdp.Tomogram.run.dataset_id==10447]):
    # Some output to track progress
    print(f"Processing tomogram {tomogram.id} from run {tomogram.run.name}")

    # Read cryoet-data-portal alignment from S3
    cdp_ali = Alignment.from_s3(tomogram.alignment.s3_alignment_metadata, anon=True)

    # Get necessary tilt series metadata
    tilt_series = tomogram.alignment.tiltseries
    pixel_size = tilt_series.pixel_spacing
    dim_z, dim_y, dim_x = tilt_series.size_z, tilt_series.size_y, tilt_series.size_x

    # Create some destination directory (adapt path to your needs)
    os.makedirs(f"/tmp/10447_data/{tomogram.run.name}/", exist_ok=True)

    # Download the tiltseries
    tilt_series.download_mrcfile(f"/tmp/10447_data/{tomogram.run.name}/")

    # Save in IMOD format
    imod_ali = cdp_ali.to_imod(ts_size=(dim_x, dim_y, dim_z), ts_spacing=pixel_size)
    write(imod_ali, f"/tmp/10447_data/{tomogram.run.name}/{tomogram.run.name}")

    # Save in AreTomo3 format
    are_ali = cdp_ali.to_aretomo(ts_size=(dim_x, dim_y, dim_z))
    write(are_ali, f"/tmp/10447_data/{tomogram.run.name}/{tomogram.run.name}.aln")
```
:::

:::{admonition} Query by annotated object or Gene Ontology terms using owlready2 library <a class="headerlink" href="#query-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: query-example
:collapsible:

Find all membrane annotations, including when the annotation has a subclass of membrane.

```python
import owlready2 as owl
from cryoet_data_portal import Client, Annotation

# Get Gene Ontology
onto = owl.get_ontology('https://purl.obolibrary.org/obo/go.owl')
onto.load()

# Get all terms that are subclasses of "membrane", GO_0016020 ID
# -  http://purl.obolibrary.org/obo/GO_0016020 is general membrane term (should match 10000, 10001, 10010)
# -  http://purl.obolibrary.org/obo/GO_0005874 is general microtubule term (should match 10000, 10001)
# -  http://purl.obolibrary.org/obo/GO_0035869 ciliary transition zone (should match 10009)
terms = onto.search(subclass_of = onto.search_one(iri = "*GO_0016020"))

# Get IRIs
term_names = [t.name.replace("_", ":") for t in terms]

# Query the portal for all annotation matching those terms
client = Client()
portal_objects = Annotation.find(client, [Annotation.object_id._in(term_names)])

# Runs that contain annotations with that term
object_runs = set([po.run.id for po in portal_objects])

# Datasets that contain annotations with that term
object_datasets = set([po.run.dataset_id for po in portal_objects])
```
:::

:::{admonition} List zarr file contents using the zarr package and HTTPS link <a class="headerlink" href="#list-contents-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: list-contents-example
:collapsible:

Stream data using https

```python
from cryoet_data_portal import Client, Tomogram
import zarr

# An example Tomogram
client = Client()
tomo = Tomogram.find(client, [Tomogram.run.dataset_id == 10000])[0]

# Obtain the HTTPS URL to the tomogram
url = tomo.https_omezarr_dir

# List the zarr contents
g = zarr.open_group(url, mode="r")
for i in g.attrs["multiscales"][0]["datasets"]:
  print(i["coordinateTransformations"])
  print(i["path"])
  path = i["path"]
  x = zarr.open(f"{url}/{path}")
  print(x.info_items())
```
:::

:::{admonition} List zarr-file contents using the ome-zarr package and HTTPS link <a class="headerlink" href="#list-https-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: list-https-example
:collapsible:

Stream data using https

```python
from cryoet_data_portal import Client, Tomogram
from ome_zarr.io import parse_url
from ome_zarr.reader import Reader

# An example Tomogram
client = Client()
tomo = Tomogram.find(client, [Tomogram.run.dataset_id == 10000])[0]

# Obtain the Zarr store
url = tomo.https_omezarr_dir
store = parse_url(url, mode="r").store

# List the zarr contents
reader = Reader(parse_url(url))
nodes = list(reader())
nodes[0].data
```
:::

:::{admonition} List zarr-file contents using the zarr package and S3 link <a class="headerlink" href="#list-s3-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: list-s3-example
:collapsible:

Stream data via S3

```python
from cryoet_data_portal import Client, Tomogram
import zarr

# An example Tomogram
client = Client()
tomo = Tomogram.find(client, [Tomogram.run.dataset_id == 10000])[0]

# Open and list contents
g = zarr.open_group(tomo.s3_omezarr_dir, mode='r')
g.info_items()
```
:::

:::{admonition} Open a tomogram array using the zarr package and HTTPS link <a class="headerlink" href="#open-tomogram-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: open-tomogram-example
:collapsible:

Stream data using https

```python
from cryoet_data_portal import Client, Tomogram
import zarr

# An example Tomogram
client = Client()
tomo = Tomogram.find(client, [Tomogram.run.dataset_id == 10000])[0]

g = zarr.open_array(f"{tomo.https_omezarr_dir}/0", mode='r')
```
:::

:::{admonition} Find all annotation files available in ZARR format from a dataset <a class="headerlink" href="#find-annotations-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: find-annotations-example
:collapsible:

Use as training data for a segmentation model

```python
from cryoet_data_portal import Client, AnnotationFile

# Get the client
client = Client()

# Select all zarr annotation files in dataset 10000
ret = AnnotationFile.find(client, [
    AnnotationFile.annotation_shape.annotation.run.dataset_id == 10000,
    AnnotationFile.format == 'zarr'
])
```
:::

:::{admonition} Open a Point-annotation file and stream the contents from S3 <a class="headerlink" href="#open-annotations-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: open-annotations-example
:collapsible:

Use as training data for a particle picking model

```python
from cryoet_data_portal import Client, AnnotationFile
import s3fs
import ndjson

# Get a client instance
client = Client()

# Get all ndjson annotation files for dataset 10000
ret = AnnotationFile.find(client, [AnnotationFile.annotation_shape.annotation.run.dataset_id == 10000,  AnnotationFile.format == 'ndjson'])

# Create an S3 filesystem instance
fs = s3fs.S3FileSystem(anon=True)

# Open the first file and print the first annotation
name = ret[0].annotation_shape.annotation.object_name
with fs.open(ret[0].s3_path) as pointfile:
  for point in ndjson.reader(pointfile):
      print(f"A {name} at {point['location']['x']}, {point['location']['y']}, {point['location']['z']}")
```
:::

:::{admonition} Find all datasets that have movie frames available <a class="headerlink" href="#find-datasets-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: find-datasets-example
:collapsible:

Start processing the raw data

```python
from cryoet_data_portal import Client, Dataset

# Get client instance
client = Client()

# Find all datasets, that have 1 or more frame files
datasets_with_frames = Dataset.find(client, [Dataset.runs.frames.id != None])
```
:::

:::{admonition} Find all tomograms with voxel spacing below a threshold <a class="headerlink" href="#find-threshold-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: find-threshold-example
:collapsible:

Select data of a specific resolution

```python
from cryoet_data_portal import Client, Tomogram

# Get client instance
client = Client()

# Get all tomograms with voxel spacing <= 10 Angstroms/voxel
tomos = Tomogram.find(client, [Tomogram.voxel_spacing <= 10])

# S3 URIs for MRCs
s3mrc = [t.s3_mrc_scale0 for t in tomos]

# S3 URIs for Zarrs
s3zarr = [t.s3_omezarr_dir for t in tomos]
```
:::

:::{admonition} Compute statistics on the portal data using the API client <a class="headerlink" href="#compute-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: compute-example
:collapsible:

Find how many runs there are in total for a given species

```python
from cryoet_data_portal import Client, Dataset, Run, Annotation
import matplotlib.pyplot as plt

# Get client instance
client = Client()

# Get all available datasets
datasets = Dataset.find(client)

# Get unique organism names
species = [d.organism_name for d in datasets]
unique_species = set(species)

# Count the Runs
num_runs_per_species = {}
for spec in unique_species:
  num_runs_per_species[spec] = len(Run.find(client, [Run.dataset.organism_name == spec]))

# Sort by number
sorted_by_run = {t[0]: t[1] for t in sorted(num_runs_per_species.items(), key=lambda kv: (kv[1], kv[0]))}

# Plot results
plt.figure().set_figwidth(20)
plt.bar(sorted_by_run.keys(), sorted_by_run.values(), color='g')
plt.xticks(rotation=30, ha='right')
plt.show()
```
:::

:::{admonition} Download the movie stacks of one run using S3 file streaming <a class="headerlink" href="#download-movie-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: download-movie-example
:collapsible:

Start processing from raw data

```python
from cryoet_data_portal import Client, Run
import s3fs
import os

client = Client()

runs = Run.find(client, [Run.dataset_id == 10004])

# One run instance
run = runs[0]

# Get list of frames files associated to this run
frames_list = run.frames

# Retrieval
outdir = f'/tmp/{run.name}/Frames/'
os.makedirs(outdir, exist_ok=True)

fs = s3fs.S3FileSystem(anon=True)

for frame in frames_list:
  frame_path = frame.s3_path
  fs.get_file(frame_path, os.path.join(outdir, os.path.basename(frame_path)))
```
:::

:::{admonition} Get all voxel spacings available for this run <a class="headerlink" href="#all-voxel-spacings-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: all-voxel-spacings-example
:collapsible:

```python
from cryoet_data_portal import Client, TomogramVoxelSpacing

RUN_ID = 17070  # Example run ID
client = Client()
vs = TomogramVoxelSpacing.find(client, [TomogramVoxelSpacing.run_id == RUN_ID])
vs_num = set([v.voxel_spacing for v in vs])
```
:::

:::{admonition} Get all types of post-processing methods for tomograms in this run <a class="headerlink" href="#all-tomogram-processing-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: all-tomogram-processing-example
:collapsible:

```python
from cryoet_data_portal import Client, Tomogram

RUN_ID = 17070  # Example run ID
client = Client()
tomo = Tomogram.find(client, [Tomogram.run_id == RUN_ID])
tomo_proc = set([t.processing for t in tomo])
```
:::

:::{admonition} Get all annotated object names for this run <a class="headerlink" href="#all-annotated-object-example" title="Permalink to this example">¶</a>
:class: czi-faq
:name: all-annotated-object-example
:collapsible:

```python
from cryoet_data_portal import Client, Annotation

RUN_ID = 500  # Example run ID
client = Client()
anno = Annotation.find(client, [Annotation.run_id == RUN_ID])
anno_name = set([a.object_name for a in anno])
```
:::
