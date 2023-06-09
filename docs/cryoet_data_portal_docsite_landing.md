# CryoET Data Portal

The Chan Zuckerberg Institute for Advanced Biological Imaging (CZ Imaging Institute) has developed the prototype CryoET Data Portal providing queryable and organized data from cryoET experiments. The initial target users are segmentation algorithm developers to produce annotations for diverse macromolecules in the tomogram that may be used for high-resolution subtomogram averaging. We currently have 120 tomograms from three datasets contributed by the groups of Julia Mahamid and Jürgen Plitzko. Each of these tomograms have a minimum of “ground truth” point annotations of ribosomes. We also provide a Python API to query and download the data. This portal is not intended to be a final product, but rather, a first step to start a discussion in the wider community as to what is needed with such a portal. We welcome feedback from the community on the data structure, design and functionality. Once we have gathered some feedback we plan to organize a community-wide workshop to discuss next steps.

| Share your thoughts on the cryoET data portal in this [short survey](https://forms.gle/ANyFtvqCRBSHyHfV6)! |
| --- |

## Get Started:

![Screenshot 2023-06-09 at 10 40 22 AM](https://github.com/chanzuckerberg/cryoet-data-portal/assets/100323416/79dd79c7-86d1-4621-a6c6-2b5e8e164abe)

Electron Tomography workflow and the data we provide.

**A.** Sample is rotated to different tilt angles and electrons pass through to produce projection images of the 3D volume

**B.** We provide raw movie frames collected by a direct detector and may also provide these stacked into a tilt series of images

**C.** A 3D tomographic reconstructed volume is produced by back projecting projections which are first corrected in a variety of ways (motion correction, CTF estimation, etc.)

**D.** We provide the 3D volume together with point annotations of (at least one) macromolecular complex for each volume

Here is a summary of the datasets that have been provided. A full description can be found below under [Data and schema](https://docs.google.com/document/d/11h0u3YYF1EWCTjxu3ObShx26HgLAfJhn9I_tIaeQ6GI/edit#?usp=sharing). The data can be downloaded through a [Python API](https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html).
  
| Provider | Julia Mahamid | Julia Mahamid | Jürgen Plitzko |
| ----------- | ----------- | ----------- | ----------- |
| Dataset name | 10000 | 10001 | 10004 |
| Sample | S. Pombe | S.Pombe | C. elegans |
| # tomos | 10 | 10 | 100 |
| Raw movies | Yes | Yes | Yes |
| Raw tilts | Yes | Yes | No |
| 3D volumes | Yes | Yes | Yes |
| Point annotations | Ribosome, FAS | Ribosome | Ribosome |
| Acknowledgement | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1101/2023.04.28.538734](https://www.biorxiv.org/content/10.1101/2023.04.28.538734v1) |

### Getting Started Links
- [Quick Start](https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_quick_start.html)
- [Python API Client](https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html)
- [Metadata and schema](https://docs.google.com/document/d/11h0u3YYF1EWCTjxu3ObShx26HgLAfJhn9I_tIaeQ6GI/edit#?usp=sharing)
- [File formats](https://docs.google.com/document/d/1YfzaS7spKOQMrBAUIfQquWskijWDUhpEURxW7nkmwaU/edit#?usp=sharing)
- [napari](https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_napari.html)

## S3 Bucket Info
The CryoET Data Portal S3 bucket supports public access. The bucket URL is:

```
s3://cryoet-data-portal-public
```

To list the bucket contents with the S3 CLI without credentials, please use the following:

```
aws s3 ls --no-sign-request s3://cryoet-data-portal-public
```
  
## Citing the CryoET Data Portal
 
Data from the portal must acknowledge the data providers and the original publications as follows (inserting of omitting as needed based on which datasets are used):
Some of the data used in this work was provided by the group (s) of Julia Mahamid (EMBL)/Jürgen Plitzko (MPI). The work is described more fully in the publication:

| Provider | Julia Mahamid | Julia Mahamid | Jürgen Plitzko |
| ----------- | ----------- | ----------- | ----------- |
| Dataset name | 10000 | 10001 | 10004 |
| Acknowledgement | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1101/2023.04.28.538734](https://www.biorxiv.org/content/10.1101/2023.04.28.538734v1) |

  Segmentation experts and developers are also encouraged to get in touch with the data providers (Julia Mahamid and Jürgen Plitzko) if they feel they have developed a useful tool that might help to process the entirety of the datasets (which are much larger than the subsets provided for the portal) more efficiently or effectively.

## CryoET Data Portal Data and Schema
A description of the CryoET Portal data and its schema is detailed [here](https://docs.google.com/document/d/11h0u3YYF1EWCTjxu3ObShx26HgLAfJhn9I_tIaeQ6GI/edit#?usp=sharing).
  
## CryoET Data Portal Plans
This is a prototype of a cryoET Data Portal providing queryable and organized data from cryoET experiments. The initial target users are segmentation algorithm developers to produce annotations for diverse macromolecules in the tomogram that may be used for high-resolution subtomogram averaging.  This portal is not intended to be a final product but rather a first step to start a discussion in the wider community as to what is needed with such a portal. We welcome feedback from the community on the data structure, design and functionality. Once we have gathered some feedback we plan to organize a community-wide workshop to discuss next steps.

## Questions, Feedback, and Issues/Bugs
- Users are encouraged to submit questions, bugs, and feature requests for the CryoET Data Portal via [Github issues](https://github.com/chanzuckerberg/cryoet-data-portal/issues).
- Questions? Email us at cryoetdataportal@chanzuckerberg.com 
- If you believe you have found a security issue, please disclose it by contacting security@chanzuckerberg.com.
