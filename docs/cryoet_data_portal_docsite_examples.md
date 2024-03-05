# Examples

Below are code snippets for completing various tasks using the Python Client API. Have an example you'd like to share with the community? Submit a [GitHub issue](https://github.com/chanzuckerberg/cryoet-data-portal/issues) and include "Example:" in your title.


<details>
  <summary>Query by annotated object or Gene Ontology terms using owlready2 library</summary>
  
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
terms = [t.name for t in terms]

# Query the portal for all annotation matching those terms
client = Client()
portal_objects = list(Annotation.find(client, [Annotation.object_id._in(terms)]))

# Runs that contain annotations with that term
object_runs = set([po.tomogram_voxel_spacing.run.id for po in portal_objects])

# Datasets that contain annotations with that term
object_datasets = set([po.tomogram_voxel_spacing.run.dataset_id for po in portal_objects])
  ```
</details>

<details>
  <summary>List zarr file contents using the zarr-package and HTTPS link</summary>
  
  Stream data using https
  
  ```python
from cryoet_data_portal import Client, Tomogram
import zarr

# An example Tomogram
client = Client()
tomo = Tomogram.find(client, [Tomogram.tomogram_voxel_spacing.run.dataset_id == 10000])[0]

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
</details>

<details>
  <summary>List zarr-file contents using the ome-zarr-package and HTTPS link</summary>
  
  Stream data using https
  
  ```python
from cryoet_data_portal import Client, Tomogram
from ome_zarr.io import parse_url
from ome_zarr.reader import Reader

# An example Tomogram
client = Client()
tomo = Tomogram.find(client, [Tomogram.tomogram_voxel_spacing.run.dataset_id == 10000])[0]

# Obtain the Zarr store 
url = tomo.https_omezarr_dir
store = parse_url(url, mode="r").store

# List the zarr contents
reader = Reader(parse_url(url))
nodes = list(reader())
nodes[0].data
  ```
</details>

<details>
  <summary>List zarr-file contents using the zarr-package and s3 link</summary>
  
  Stream data via S3
  
  ```python
from cryoet_data_portal import Client, Tomogram
import zarr

# An example Tomogram
client = Client()
tomo = Tomogram.find(client, [Tomogram.tomogram_voxel_spacing.run.dataset_id == 10000])[0]

# Open and list contents
g = zarr.open_group(tomo.s3_omezarr_dir, mode='r')
g.info_items()
  ```
</details>

<details>
  <summary>Open a tomogram array the zarr-package and https link</summary>
  
  Stream data using https
  
  ```python
from cryoet_data_portal import Client, Tomogram
import zarr

# An example Tomogram
client = Client()
tomo = Tomogram.find(client, [Tomogram.tomogram_voxel_spacing.run.dataset_id == 10000])[0]

g = zarr.open_array(f"{tomo.https_omezarr_dir}/0", mode='r')
  ```
</details>

<details>
  <summary>Find all annotation files available in Zarr-format from a dataset</summary>
  
  Use as training data for a segmentation model
  
  ```python
from cryoet_data_portal import Client, AnnotationFile 

# Get the client
client = Client()

# Select all zarr annotation files in dataset 10000
ret = list(AnnotationFile.find(client, [AnnotationFile.annotation.tomogram_voxel_spacing.run.dataset_id == 10000,  
                                        AnnotationFile.format == 'zarr']))
  ```
</details>

<details>
  <summary>Open a Point-annotation file and stream the contents from S3</summary>
  
  Use as training data for a particle picking model
  
  ```python
from cryoet_data_portal import Client, AnnotationFile
import s3fs
import ndjson

# Get a client instance
client = Client()

# Get all ndjson annotation files for dataset 10000
ret = list(AnnotationFile.find(client, [AnnotationFile.annotation.tomogram_voxel_spacing.run.dataset_id == 10000,  AnnotationFile.format == 'ndjson']))

# Create an S3 filesystem instance
fs = s3fs.S3FileSystem(anon=True)

# Open the first file and print the first annotation
name = ret[0].annotation.object_name
with fs.open(ret[0].s3_path) as pointfile:
    for point in ndjson.reader(pointfile):
        print(f"A {name} at {point['location']['x']}, {point['location']['y']}, {point['location']['z']}")
  ```
</details>

<details>
  <summary>Find all datasets that have movie frames available</summary>
  
  Start processing the raw data
  
  ```python
from cryoet_data_portal import Client, Dataset

# Get client instance
client = Client()

# FInd all datasets, that have tiltseries with 1 or more frame files
datasets_with_frames = list(Dataset.find(client, [Dataset.runs.tiltseries.frames_count > 0]))
  ```
</details>

<details>
  <summary>Find all tomograms with voxel spacing below a thredhold</summary>
  
  Select data of a specific resolution
  
  ```python
from cryoet_data_portal import Client, Tomogram

# Get client instance
client = Client()

# Get all tomograms with voxel spacing <= 10 Angstroms/voxel
tomos = list(Tomogram.find(client, [Tomogram.voxel_spacing <= 10]))

# S3 URIs for MRCs 
s3mrc = [t.s3_mrc_scale0 for t in tomos]

# S3 URIs for Zarrs
s3zarr = [t.s3_omezarr_dir for t in tomos]
  ```
</details>

<details>
  <summary>Compute statistics on the portal data using the API client</summary>
  
  Find how many runs there are in total for a given species
  
  ```python
from cryoet_data_portal import Client, Dataset, Run, Annotation
import matplotlib.pyplot as plt

# Get client instance
client = Client()

# Get all available runs
datasets = list(Dataset.find(client))

# Get unique organism names
species = [d.organism_name for d in datasets]
unique_species = set(species)

# Count the Runs
num_runs_per_species = {}
for spec in unique_species:
    num_runs_per_species[spec] = len(list(Run.find(client, [Run.dataset.organism_name == spec])))

# Sort by number
sorted_by_run = {t[0]: t[1] for t in sorted(num_runs_per_species.items(), key=lambda kv: (kv[1], kv[0]))}

# Plot results
plt.figure().set_figwidth(20)
plt.bar(sorted_by_run.keys(), sorted_by_run.values(), color='g')
plt.xticks(rotation=30, ha='right')
plt.show()
  ```
</details>

<details>
  <summary>Download the movie stacks of one run using S3 file streaming</summary>
  
  Start processing from raw data
  
  ```python
from cryoet_data_portal import Client, Run
import s3fs 
import os

client = Client()

runs = list(Run.find(client, [Run.dataset_id == 10004]))

# One run instance
run = runs[0]

fs = s3fs.S3FileSystem(anon=True)

# This is where the frames live
frames_dir = run.s3_prefix + 'Frames/'

# S3 allows listing
frames_list = fs.ls(frames_dir)

# Retrieval
outdir = f'/tmp/{run.name}/Frames/'
os.makedirs(outdir, exist_ok=True)

for file in frames_list:
    fs.get_file(file, f'{outdir}{os.path.basename(file)}')
  ```
</details>
