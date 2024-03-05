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
