---
hide-navigation: true
---

# CryoET Data Portal | Documentation

The [Chan Zuckerberg Institute for Advanced Biological Imaging (CZ Imaging Institute)](https://www.czimaginginstitute.org/) has made a beta release of the [CryoET Data Portal](https://cryoetdataportal.czscience.com) providing queryable and organized data from CryoET experiments. Each of the over 15,000 tomograms on the Portal have at least one structure annotated.

```{button-ref} data-organization
:color: primary
:align: center

Learn about the Data Schema
```

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

## Citing the CryoET Data Portal

Data from the portal must acknowledge the data providers and the original publications. The following is provided as an example:

Some of the data used in this work was provided by the group(s) of Julia Mahamid (EMBL)/Jürgen Plitzko (MPI) [see [beta site](https://cryoetdataportal.czscience.com) for current details]. The work is described more fully in the publication:

| Provider | Julia Mahamid | Julia Mahamid | Jürgen Plitzko |
| ----------- | ----------- | ----------- | ----------- |
| Dataset name | 10000 | 10001 | 10004 |
| Acknowledgement | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1101/2023.04.28.538734](https://www.biorxiv.org/content/10.1101/2023.04.28.538734v1) |

:::{czi-info} Note
Segmentation experts and developers are also encouraged to get in touch with the data providers if they feel they have developed a useful tool that might help to process the entirety of the datasets (which are much larger than the subsets provided for the portal) more efficiently or effectively.
:::
