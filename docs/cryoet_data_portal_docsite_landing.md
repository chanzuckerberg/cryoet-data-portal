# Browse and visualize datasets in the new beta site: https://cryoetdataportal.czscience.com

# Read documentation and API  in *this alpha site*:<br>CryoET Data Portal

The Chan Zuckerberg Institute for Advanced Biological Imaging (CZ Imaging Institute) has developed the prototype CryoET Data Portal providing queryable and organized data from cryoET experiments. The initial target users are segmentation algorithm developers to produce annotations for diverse macromolecules in the tomogram that may be used for high-resolution subtomogram averaging. We have 120 tomograms from 3 datasets contributed by the groups of Julia Mahamid and Jürgen Plitzko [see [beta site](https://cryoetdataportal.czscience.com) for current details of about 300 datasets]. Each of these tomograms have a minimum of “ground truth” point annotations of ribosomes. We also provide a [Python API](https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html) to query and download the data. This portal is not intended to be a final product, but rather, a first step to start a discussion in the wider community as to what is needed with such a portal. We welcome feedback from the community on the data structure, design and functionality. Share first impressions, or sign up for invites to future feedback activities in [this short form](https://airtable.com/apppmytRJXoXYTO9w/shrjmV9knAC7E7VVM?prefill_Event=P1BannerF&hide_Event=true).

## Get Started:

![CZII Graphic Github](https://github.com/chanzuckerberg/cryoet-data-portal/assets/100323416/dc425098-d949-479f-b2f2-325f1c944784)

Electron Tomography workflow and the data we provide.

**A.** Sample is rotated to different tilt angles and electrons pass through to produce projection images of the 3D volume

**B.** We provide raw movie frames collected by a direct detector and may also provide these stacked into a tilt series of images

**C.** A 3D tomographic reconstructed volume is produced by back projecting projections which are first corrected in a variety of ways (motion correction, CTF estimation, etc.)

**D.** We provide the 3D volume together with any available point annotations or semantic segmentations of macromolecular complexes for each volume

[//]: # (### CryoET Data Portal Data and Schema)

[//]: # (A description of the CryoET Portal data and its schema is detailed [here]&#40;https://docs.google.com/document/d/11h0u3YYF1EWCTjxu3ObShx26HgLAfJhn9I_tIaeQ6GI/edit#?usp=sharing&#41;. )

### Getting Started Links
- [Quick Start](https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_quick_start.html)
- [Python API Client](https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html)
- Metadata and schema (Coming soon)
- File formats (Coming soon)
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

Data from the portal must acknowledge the data providers and the original publications as follows (inserting or omitting as needed based on which datasets are used):
Some of the data used in this work was provided by the group(s) of Julia Mahamid (EMBL)/Jürgen Plitzko (MPI) [see [beta site](https://cryoetdataportal.czscience.com) for current details]. The work is described more fully in the publication:

| Provider | Julia Mahamid | Julia Mahamid | Jürgen Plitzko |
| ----------- | ----------- | ----------- | ----------- |
| Dataset name | 10000 | 10001 | 10004 |
| Acknowledgement | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1101/2023.04.28.538734](https://www.biorxiv.org/content/10.1101/2023.04.28.538734v1) |

Segmentation experts and developers are also encouraged to get in touch with the data providers if they feel they have developed a useful tool that might help to process the entirety of the datasets (which are much larger than the subsets provided for the portal) more efficiently or effectively.

## Questions, Feedback, and Issues/Bugs
- Users are encouraged to submit questions, bugs, and feature requests for the CryoET Data Portal via [GitHub issues](https://github.com/chanzuckerberg/cryoet-data-portal/issues).
- If you believe you have found a security issue, please disclose it by contacting security@chanzuckerberg.com.
