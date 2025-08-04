(contributing-data)=
# Contribute Data to the Portal

The CryoET Data Portal supports a rapidly growing cryoET data corpus because of generous contributions from researchers like you!

## Submission and Publication Process

1. Read our [data submission policy](https://cryoetdataportal.czscience.com/data-submission-policy) (all data has a CC0 license) and [data schema](data-organization) to learn how data is shared and organized on the Portal.
2. Review the [metadata requirements](#metadata-requirements) to understand the requirements of data submission.
3. [Contact us](https://airtable.com/apppmytRJXoXYTO9w/shr5UxgeQcUTSGyiY?prefill_Event=Portal&hide_Event=true) and we'll reach out with next steps.

## Metadata Requirements

### Glossary

* **Deposition**: Depositions are collections of datasets, annotations, and/or (in the future) tomograms contributed by the same author(s). The website currently shows only depositions that include annotations
* **Dataset:** Datasets are contributed sets of files associated with imaging one sample type with the same experimental conditions
* **Run:** A tomography run is a collection of all data and annotations related to one physical location in a sample and is associated with a dataset that typically contains many other runs.

### Deposition of full datasets

#### Deposition (dataset group)

Dataset group depositions contain 1 or more datasets.

**Required**

- Title
- Description (1-5 sentences)
- Authors (Name, ORCID, email, whether primary or corresponding)
- Cross-References (DOI, EMPIAR, EMDB, PDB)

#### Dataset

**Required**

- Title
- Description (1-5 sentences)
- Authors (Name, ORCID, email, whether primary or corresponding)
- Cross-References (DOI, EMPIAR, EMDB, PDB)
- Funding Information (Agency Name, Grant ID)
- Sample Type, one of:
  - `cell`
  - `tissue`
  - `organism`
  - `organelle`
  - `virus`
  - `in_vitro`
  - `in_silico`
  - `other`
- Description of sample preparation (steps separated by `+`)
- Description of grid preparation (steps separated by `+`)
- Description of other information not captured above
- Organism Name, ID (NCBI taxID)
- If cell:
  - Cell Type Name, ID (cell ontology)
  - Strain Name, ID
- If tissue:
  - Tissue Name, ID (UBERON identifier)
- If organelle:
  - Cell Component Name, ID (Gene Ontology)

**Optional**

- **File/URL**: Key photo for the website

#### Movie Stacks / Acquisition metadata

**Required per Run**

- **Files:** Movie stacks in MRC, TIFF or EER format (or as listed, compressed)
  - Should be able to be associated to a **Run** by file name or location
- **File:** 1 MDOC file per run or similar (indicating mapping to tilt series and tilt order)
  - Should be able to be associated to a **Run** by file name or location

- Whether already gain corrected (True/False)
- Acceleration Voltage
- Spherical Abberation
- Tilt range (min, max)
- Tilt Step
- Tilt Scheme
- dose per movie stack (preferred) or Total Dose per **Run**
- Acquisition software
- Camera manufacturer and model
- Microscope manufacturer and model
- Microscope optical setup
  - Energy Filter Name
  - Image Corrector Type
  - Phase Plate Type
- Pixel Size (if not correct in file header)

**Optional**

- **Files:** Gain reference in MRC, DM4, GAIN format
  - Should be able to be associated with a **Run** (e.g. provide CSV-mapping of run name to gain name)

#### Tilt series (required per Run)

**Required** **per Run**

- **File:** 1 Assembled tilt series in MRC or OME-Zarr format
  - Should be able to be associated to a **Run** by file name or location
- **File:** Tilt angles in assembled tilt series in RAWTLT format (textfile, one angle per line)
  - Should be able to be associated to a **Run** by file name or location

- Authors (Name, ORCID, email, whether primary or corresponding)
- Binning from frames
- Pixel size (if not correct in header)
- Tilt axis rotation
- Whether is already transformed according to alignment in 2D

**Optional**

- Subjective quality rating according to [this scale](tilt-series-quality)

#### Alignment (required per Run)

- **Files:**
  - If aligned in IMOD (global alignments)
    - **Required:** XF file
    - **Required:** TLT file
    - **Optional:** XTILT file, tilt.com file, newst.com file
  - If aligned in AreTomo3:
    - **Required:** ALN-File

- Method type, one of:
  - fiducial based
  - patch tracking
  - projection matching
- Alignment type, one of:
  - Global (rigid transformations only)
  - Local (non-rigid transformations)
- Any alignment parameters not captured by the alignment file
  - Tilt offset
  - Volume origin offset
  - X-tilt offset

#### Tomograms (optional)

**Required per Run**

- **File**: at least one tomogram in MRC or OME-Zarr format
  - Should be able to be associated to a **Run** by file name or location

- voxel size
- Ctf-corrected (True/False)
- Reconstruction method
- Reconstruction software
- Post-Processing (e.g. raw, denoised, filtered)
- Processing software

#### Annotations (optional)

**Required per Annotated object:**

- Object name
- Object ID (Gene Ontology or UniprotKB accession number)

**Optional per Annotated object:**

- Object state
- object description

**Required per Annotation File:**

- **File:** Annotation in MRC, OME-Zarr, STAR (RELION, STOPGAP), CSV, GLB, STL, OBJ, VTK format
  - At the same size, alignment, voxel spacing as one of the submitted tomograms.
- Authors (Name, ORCID, email, whether primary or corresponding)
- Cross-References  (DOI, EMPIAR, EMDB, PDB)
- Can be considered ground truth (True/False)
- Annotation method
  - Description (steps separated by `+`)
  - Annotation software
  - Method links
  - Method type, one of:
    - Manual
    - Hybrid
    - Automated
    - Simulated

### Deposition of annotations for existing datasets

#### Deposition (annotation group)

Annotation group depositions contain annotations for one or more existing datasets

**Required**

- Title
- Description (1-5 sentences)
- Authors (Name, ORCID, email, whether primary or corresponding)
- Cross-References (DOI, EMPIAR, EMDB, PDB)

#### Annotations

**Required per Annotated object:**

- Object name
- Object ID (Gene Ontology or UniprotKB accession number)
- Object state

**Optional per Annotated object:**

- object description

**Required per Annotation File:**

- **File:** Annotation in MRC, OME-Zarr, STAR (RELION, STOPGAP), CSV, GLB, STL, OBJ, VTK format
  - At the same size, alignment, voxel spacing as one of the existing tomograms.
- Authors (Name, ORCID, email, whether primary or corresponding)
- Cross-References  (DOI, EMPIAR, EMDB, PDB)
- Can be considered ground truth (True/False)
- Annotation method
  - Description (steps separated by `+`)
  - Annotation software
  - Method links
  - Method type, one of:
    - Manual
    - Hybrid
    - Automated
    - Simulated

### Deposition of tomograms for existing datasets

#### Deposition (tomogram group)

Tomogram group depositions contain 1 or more tomograms for an existing dataset.

**Required**

- Title
- Description (1-5 sentences)
- Authors (Name, ORCID, email, whether primary or corresponding)
- Cross-References (DOI, EMPIAR, EMDB, PDB)

#### Tomograms (required per Run)

**Required per Run**

- **File**: at least one tomogram in MRC or OME-Zarr format
  - Should be able to be associated to a **Run** by file name or location

- voxel size
- Ctf-corrected (True/False)
- Reconstruction method
- Reconstruction software
- Post-Processing (e.g. raw, denoised, filtered)
- Processing software

#### Alignment (required if new)

If none of the existing alignments was used, it is required to submit the new alignment along with the tomograms.

- **Files:**
  - If aligned in IMOD (global alignments)
    - **Required:** XF file
    - **Required:** TLT file
    - **Optional:** XTILT file, tilt.com file, newst.com file
  - If aligned in AreTomo:
    - **Required:** ALN-File

- Method type, one of:
  - fiducial based
  - patch tracking
  - projection matching
- Alignment type, one of:
  - Global (rigid transformations only)
  - Local (non-rigid transformations)
- Any alignment parameters not captured by the alignment file, e.g.
  - Tilt offset
  - Volume origin offset
  - X-tilt offset
