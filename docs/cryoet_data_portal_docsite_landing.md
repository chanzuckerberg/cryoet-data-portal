# CryoET Data Portal

The Chan Zuckerberg Institute for Advanced Biological Imaging (CZ Imaging Institute) has developed the prototype CryoET Data Portal providing queryable and organized data from cryoET experiments. The initial target users are segmentation algorithm developers to produce annotations for diverse macromolecules in the tomogram that may be used for high-resolution subtomogram averaging. We currently have 185 tomograms from four datasets contributed by the groups of Julia Mahamid and Jürgen Plitzko. Each of these tomograms have a minimum of “ground truth” point annotations of ribosomes. We also provide a python API to query and download the data. This portal is not intended to be a final product, but rather, a first step to start a discussion in the wider community as to what is needed with such a portal. We welcome feedback from the community on the data structure, design and functionality. Once we have gathered some feedback we plan to organize a community-wide workshop to discuss next steps.

## Get Started:

Each of the data sets provides all or some of the following data: (i) raw movies, (ii) unaligned tilt series, (iii) aligned tilt series, (iv) annotations. 
<add image>
Here is a summary of the datasets that have been provided. A full description can be found below under Data and schema (hyperlink to Data and schema). The data can be downloaded through a Python API (hyperlink to Python API).
  
| Provider | Julia Mahamid | Julia Mahamid | Jürgen Pltzco |
| ----------- | ----------- | ----------- | ----------- |
| Dataset name | 100000 | 10001 | 10004 |
| Sample | S. Pombe | S.Pombe | C. elegans |
| # tomos | 10 | 10 | 100 |
| Raw movies | Yes | Yes | Yes |
| Raw tilts | Yes | Yes | No |
| 3D volumes | Yes | Yes | Yes |
| Point Annotations (number of particles) | Ribosome (##), FAS (##) | Ribosome | Ribosome |
| Acknowledgement | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1101/2023.04.28.538734](https://www.biorxiv.org/content/10.1101/2023.04.28.538734v1) |

### Getting Started Links
- [Quick Start](https://www.google.com/)
- [Data and schema](https://www.google.com/)
- [Python Client Library](https://github.com/chanzuckerberg/cryoet-data-portal/tree/main/client/python/cryoet_data_portal)
- [napari plugin](https://www.google.com/)


## Citing the CryoET Data Portal
 
Data from the portal must acknowledge the data providers and the original publications as follows (inserting of omitting as needed based on which datasets are used):
Some of the data used in this work was provided by the group (s) of Julia Mahamid (EMBL)/Juergen Plitzco (MPI). The work is described more fully in the publication:

| Provider | Julia Mahamid | Julia Mahamid | Jürgen Pltzco |
| ----------- | ----------- | ----------- | ----------- |
| Dataset name | 100000 | 10001 | 10004 |
| Acknowledgement | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1038/s41592-022-01746-2](http://doi.org/doi:10.1038/s41592-022-01746-2) | [doi:10.1101/2023.04.28.538734](https://www.biorxiv.org/content/10.1101/2023.04.28.538734v1) |

  Segmentation experts and developers are also encouraged to get in touch with the data providers (Julia Mahamid and Jürgen Plitzco) if they feel they have developed a useful tool that might help to process the entirety of the datasets (which are much larger than the subsets provided for the portal) more efficiently or effectively.

## CryoET Data Portal Data and Schema
A description of the CryoET Portal data and its schema is detailed [here](https://www.google.com/).

  ⚠️ Note that the data may include…:
  - Movies of the raw data?
- Aligned tilt series?  Etc.. etc.
- Annotations
  
## CryoET Data Portal Plans
This is a prototype of a cryoET Data Portal providing queryable and organized data from cryoET experiments. The initial target users are segmentation algorithm developers to produce annotations for diverse macromolecules in the tomogram that may be used for high-resolution subtomogram averaging.  This portal is not intended to be a final product but rather a first step to start a discussion in the wider community as to what is needed with such a portal. We welcome feedback from the community on the data structure, design and functionality. Once we have gathered some feedback we plan to organize a community-wide workshop to discuss next steps.

## Questions, Feedback, and Issues/Bugs
- Users are encouraged to submit questions, bugs, and feature requests for the CryoET Data Portal via [Github issues](https://github.com/chanzuckerberg/cryoet-portal/issues).
- Questions? Send email to cryoetdataportal@chanzuckerberg.com 
- If you believe you have found a security issue, please disclose it by contacting security@chanzuckerberg.com.
