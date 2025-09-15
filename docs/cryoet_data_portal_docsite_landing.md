---
hide-navigation: true
tocdepth: 3
---

# CryoET Data Portal | Documentation

The [Chan Zuckerberg Institute for Advanced Biological Imaging (CZ Imaging Institute)](https://www.czimaginginstitute.org/) has made a beta release of the [CryoET Data Portal](https://cryoetdataportal.czscience.com) providing queryable and organized data from CryoET experiments. Each of the nearly 20,000 tomograms on the Portal have at least one structure annotated.

`````{grid} 1 1 1 2
:class-container: landing-grid
:gutter: 2 2 2 2

````{grid-item}
```{button-ref} data-organization
:color: primary
:align: center

Learn about the Data Schema
```
````

````{grid-item}
```{button-ref} contributing-data
:color: primary
:align: center

Learn about Contributing Data
```
````
`````

This site provides additional documentation for using our [Python API](python-api) to query and download data and for navigating the [CryoET Data Portal](https://cryoetdataportal.czscience.com) and its visualization tools. We hope this site will assist segmentation algorithm developers to produce annotations for diverse macromolecules in the tomograms that may be used for high-resolution subtomogram averaging.

We welcome feedback from the community on the data structure, design and functionality.
- Share first impressions, or sign up for invites to future feedback activities in [this short form](https://airtable.com/apppmytRJXoXYTO9w/shrjmV9knAC7E7VVM?prefill_Event=P1BannerF&hide_Event=true).
- Submit bugs for the CryoET Data Portal via [GitHub issues](https://github.com/chanzuckerberg/cryoet-data-portal/issues/new?assignees=&labels=bug&projects=&template=bug.md&title=).
- Start a [Github discussion](https://github.com/chanzuckerberg/cryoet-data-portal/discussions/new/choose) with questions or to request new features.

## Getting Started

::::{grid} 1 1 2 2
:gutter: 2

:::{grid-item-card} Get Started
:link: quick-start
:link-type: ref

Install and start using the Python Client API
:::

:::{grid-item-card} API Reference
:link: api-reference
:link-type: ref

Information on the Python Client API Classes
:::

:::{grid-item-card} Tutorials
:link: tutorials
:link-type: doc

Examples of selecting, downloading, and visualizing data from the Portal
:::

:::{grid-item-card} About CryoET Data Portal
:link: about
:link-type: doc

Learn about CryoET data and how to find and preview it on the Portal
:::
::::

## Amazon Web Services S3 Bucket Info

The CryoET Data Portal S3 bucket supports public access. The bucket URL is:

```
s3://cryoet-data-portal-public
```

To list the bucket contents with the S3 CLI without credentials, please use the following:

```
aws s3 ls --no-sign-request s3://cryoet-data-portal-public
```

Refer to [this how-to guide](download-data) for information on downloading data from our AWS S3 bucket.

(citing-the-cryoet-data-portal)=
## Citing the CryoET Data Portal

### Portal Citation

If you use the CryoET Data Portal in your work, please cite the following publication:

Ermel, U., Cheng, A., Ni, J.X. et al. A data portal for providing standardized annotations for cryo-electron tomography. Nat Methods 21, 2200–2202 (2024). [https://doi.org/10.1038/s41592-024-02477-2](https://doi.org/10.1038/s41592-024-02477-2)

### Acknowledging Data Contributors

If you use data from the Portal in your work, please acknowledge the authors and cite associated publications. Below is an example of recommended formatting:

> Some of the data used in this work was provided by Irene de Teresa Trueba et al and Mallak Ali et al. The data are available through the CryoET Data Portal (Nat Methods 21, 2200–2202 (2024). [https://doi.org/10.1038/s41592-024-02477-2](https://doi.org/10.1038/s41592-024-02477-2)) with the following metadata.
>
> | Deposition ID | Entity Type | Entity ID(s) | Primary Author(s) | Associated Publication DOI(s) |
> | ------------- | ----------- | ------------ | ----------------- | ----------------------------- |
> | 10000 | Dataset | 10000, 10001 | Irene de Teresa Trueba | 10.1101/2022.04.12.488077, 10.1038/s41592-022-01746-2 |
> | 10312 | Dataset | 10442 | Mallak Ali, Ariana Peck, Yue Yu, Jonathan Schwartz | None |

### Finding Citation Metadata via the API or GraphQL

You can programmatically retrieve metadata for your citations via the Python API.

#### API Example - Dataset, Annotation, or Tomogram

```python
from cryoet_data_portal import Client, Dataset
client = Client()
dataset = Dataset.get_by_id(client, 10442)
print(dataset.deposition_id)  # Get the deposition ID
print(dataset.dataset_publications)   # List of DOIs of associated publications
```

Output:
```python
10312
None
```

#### API Example - Runs

For runs, access the deposition ID and publication DOIs through the parent dataset:

```python
from cryoet_data_portal import Client, Run
client = Client()

run = Run.get_by_id(client, 10005) # use the numeric Run ID
print(run.dataset.deposition_id)  # Get the deposition ID
print(run.dataset.dataset_publications)   # List of DOIs of associated publications
```

Output:
```python
10029
10.1073/pnas.1518952113
```

#### GraphQL Example - Dataset, Annotation or Tomogram

```graphql
query GetDatasetPublication {
  datasets(where: { id: { _eq: 10442 } }) {
    id
    depositionId
    datasetPublications
  }
}
```

Output:
```json
{
  "data": {
    "datasets": [
      {
        "id": 10442,
        "depositionId": 10312,
        "datasetPublications": null
      }
    ]
  }
}
```

#### GraphQL Example - Runs

For runs, access the deposition ID and publication DOIs through the parent dataset:

```graphql
query GetRunPublication{
  runs(where: { id: { _eq: 10005 } }) {
    id
    dataset {
      depositionId
      datasetPublications
    }
  }
}
```

Output:
```json
{
  "data": {
    "runs": [
      {
        "id": 10005,
        "dataset": {
          "depositionId": 10029,
          "datasetPublications": [
            "10.1073/pnas.1518952113"
          ]
        }
      }
    ]
  }
}
```

:::{czi-info} Note
Segmentation experts and developers are also encouraged to get in touch with the data providers if they feel they have developed a useful tool that might help to process the entirety of the datasets (which are much larger than the subsets provided for the portal) more efficiently or effectively.
:::
