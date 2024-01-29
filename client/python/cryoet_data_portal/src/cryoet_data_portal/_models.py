import os
from datetime import date
from typing import Iterable, Optional

from ._file_tools import download_directory, download_https
from ._gql_base import (
    BooleanField,
    DateField,
    FloatField,
    IntField,
    ItemRelationship,
    ListRelationship,
    Model,
    StringField,
)


class Dataset(Model):
    """Metadata for a dataset in the CryoET Data Portal

    Attributes:
        id (int): An identifier for a CryoET dataset, assigned by the Data Portal. Used to identify the dataset as the directory name in data tree
        authors (List[DatasetAuthor]): An array relationship with DatasetAuthor
        cell_component_name (str): Name of the cellular component
        cell_component_id (str): If the dataset focuses on a specific part of a cell, the subset is included here
        cell_name (str): Name of the cell from which a biological sample used in a CryoET study is derived from.
        cell_strain_id (str): Link to more information about the cell strain
        cell_strain_name (str): Cell line or strain for the sample.
        cell_type_id (str): Cell Ontology identifier for the cell type
        dataset_citations (str): DOIs for publications that cite the dataset. Use a comma to separate multiple DOIs.
        dataset_publications (str): DOIs for publications that describe the dataset. Use a comma to separate multiple DOIs.
        deposition_date: Date when a dataset is initially received by the Data Portal.
        description (str): A short description of a CryoET dataset, similar to an abstract for a journal article or dataset.
        funding_sources: List[FundingSource] An array relationship with FundingSource
        grid_preparation (str): Describe Cryo-ET grid preparation.
        https_prefix (str): The HTTPS directory path where this dataset is contained
        last_modified_date (date):Date when a released dataset is last modified.
        key_photo_url (str): URL for the dataset preview image.
        key_photo_thumbnail_url (str): URL for the thumbnail of preview image.
        organism_name (str): Name of the organism from which a biological sample used in a CryoET study is derived from, e.g. homo sapiens
        organism_taxid (str): NCBI taxonomy identifier for the organism, e.g. 9606
        other_setup (str): Describe other setup not covered by sample preparation or grid preparation that may make this dataset unique in  the same publication
        related_database_entries (str): If a CryoET dataset is also deposited into another database, enter the database identifier here (e.g. EMPIAR-11445). Use a comma to separate multiple identifiers.
        related_database_links (str): If a CryoET dataset is also deposited into another database, e.g. EMPIAR, enter the database identifier here (e.g.https://www.ebi.ac.uk/empiar/EMPIAR-12345/).  Use a comma to separate multiple links.
        release_date (date): Date when a dataset is made available on the Data Portal.
        runs: List[Run] An array relationship with Run
        s3_prefix (str): The S3 public bucket path where this dataset is contained
        sample_preparation (str): Describe how the sample was prepared.
        sample_type (str): Type of samples used in a CryoET study. (cell, tissue, organism, intact organelle, in-vitro mixture, in-silico synthetic data, other)
        tissue_id (str): UBERON identifier for the tissue
        tissue_name (str): Name of the tissue from which a biological sample used in a CryoET study is derived from.
        title (str): Title of a CryoET dataset
    """

    _gql_type = "datasets"

    id: int = IntField()
    title: str = StringField()
    description: str = StringField()
    deposition_date: date = DateField()
    release_date: date = DateField()
    last_modified_date: date = DateField()
    related_database_entries: str = StringField()
    related_database_links: str = StringField()
    dataset_publications: str = StringField()
    dataset_citations: str = StringField()
    sample_type: str = StringField()
    organism_name: str = StringField()
    organism_taxid: str = StringField()
    tissue_name: str = StringField()
    tissue_id: str = StringField()
    cell_name: str = StringField()
    cell_type_id: str = StringField()
    cell_strain_name: str = StringField()
    cell_strain_id: str = StringField()
    sample_preparation: str = StringField()
    grid_preparation: str = StringField()
    other_setup: str = StringField()
    s3_prefix: str = StringField()
    https_prefix: str = StringField()
    key_photo_url: str = StringField()
    key_photo_thumbnail_url: str = StringField()
    cell_component_name: str = StringField()
    cell_component_id: str = StringField()

    runs: Iterable["Run"] = ListRelationship("Run", "id", "dataset_id")
    authors: Iterable["DatasetAuthor"] = ListRelationship(
        "DatasetAuthor",
        "id",
        "dataset_id",
    )
    funding_sources: Iterable["DatasetFunding"] = ListRelationship(
        "DatasetFunding",
        "id",
        "dataset_id",
    )

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this dataset.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        recursive_prefix = "/".join(self.s3_prefix.strip("/").split("/")[:-1]) + "/"
        download_directory(self.s3_prefix, recursive_prefix, dest_path)


class DatasetAuthor(Model):
    """Metadata for authors of a dataset

    Attributes:
        id (int): A numeric identifier for this author
        affiliation_address (str): Address of the institution an author is affiliated with.
        affiliation_identifier (str):  A unique identifier assigned to the affiliated institution by The Research Organization Registry (ROR).
        affiliation_name (str): Name of the institutions an author is affiliated with. Comma separated
        author_list_order(int): The order in which the author appears in the publication
        corresponding_author_status (bool):Indicating whether an author is the corresponding author
        dataset (Dataset): An object relationship with the dataset this author corresponds to
        dataset_id (int): Numeric identifier for the dataset this author corresponds to
        email (str): Email address for each author
        name (str): Full name of a dataset author (e.g. Jane Doe).
        primary_author_status (bool): Indicating whether an annotator is the main person executing the annotation, especially on manual annotation
        orcid (str): A unique, persistent identifier for researchers, provided by ORCID.
    """

    _gql_type = "dataset_authors"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id: int = IntField()
    dataset_id: int = IntField()
    orcid: str = StringField()
    name: str = StringField()
    corresponding_author_status: int = BooleanField()
    primary_author_status: int = BooleanField()
    email: str = StringField()
    affiliation_name: str = StringField()
    affiliation_address: str = StringField()
    affiliation_identifier: str = StringField()
    author_list_order: int = IntField()


class DatasetFunding(Model):
    """Metadata for a dataset's funding sources

    Attributes:
        id (int): A numeric identifier for this funding record
        dataset (Dataset): An object relationship with the dataset this funding source corresponds to
        dataset_id (int): Numeric identifier for the dataset this funding source corresponds to
        funding_agency_name (str): Name of the funding agency.
        grant_id (str): Grant identifier provided by the funding agency.
    """

    _gql_type = "dataset_funding"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id: int = IntField()
    dataset_id: int = IntField()
    funding_agency_name: str = StringField()
    grant_id: str = StringField()


class Run(Model):
    """Metadata for an experiment run

    Attributes:
        id (int): Numeric identifier (May change!)
        dataset (Dataset): An object relationship with the dataset this run is a part of
        dataset_id (int): Reference to the dataset this run is a part of
        name (str): Short name for the experiment run
        https_prefix (str): The HTTPS directory path where this dataset is contained
        s3_prefix (str): The S3 public bucket path where this dataset is contained
        tiltseries (list[TiltSeries]): An array relationship with TiltSeries that correspond to this run
        tomogram_voxel_spacings (list[TomogramVoxelSpacing]): An array relationship with the Tomogram Voxel Spacings created from this run
    """

    _gql_type = "runs"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id: int = IntField()
    dataset_id: int = IntField()
    name: str = StringField()
    s3_prefix: str = StringField()
    https_prefix: str = StringField()

    tomogram_voxel_spacings: Iterable["TomogramVoxelSpacing"] = ListRelationship(
        "TomogramVoxelSpacing",
        "id",
        "run_id",
    )
    tiltseries: Iterable["TiltSeries"] = ListRelationship("TiltSeries", "id", "run_id")

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this run.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_directory(self.s3_prefix, self.dataset.s3_prefix, dest_path)

    def download_frames(self, dest_path: Optional[str] = None):
        download_directory(
            os.path.join(self.s3_prefix, "Frames"),
            self.s3_prefix,
            dest_path,
        )


class TomogramVoxelSpacing(Model):
    """Metadata for a set of tomograms and annotations of a given voxel spacing

    Attributes:
        id (int): Numeric identifier (May change!)
        annotations (list[Annotation]): An array relationship with the annotations associated with this voxel spacing
        https_prefix (str): The HTTPS directory path where this dataset is contained
        run (Run): An object relationship with the run this voxel spacing is a part of
        run_id (int): Reference to the dataset this run is a part of
        s3_prefix (str): The S3 public bucket path where this dataset is contained
        tomograms (list[Tomogram]): An array relationship with Tomograms of this voxel spacing
        voxel_spacing (float): The voxel spacing for the tomograms in this set
    """

    _gql_type = "tomogram_voxel_spacings"

    run: Run = ItemRelationship(Run, "run_id", "id")

    id: int = IntField()
    run_id: int = IntField()
    voxel_spacing: float = FloatField()
    s3_prefix: str = StringField()
    https_prefix: str = StringField()

    tomograms: Iterable["Tomogram"] = ListRelationship(
        "Tomogram",
        "id",
        "tomogram_voxel_spacing_id",
    )
    annotations: Iterable["Annotation"] = ListRelationship(
        "Annotation",
        "id",
        "tomogram_voxel_spacing_id",
    )

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this run.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_directory(self.s3_prefix, self.run.s3_prefix, dest_path)


class Tomogram(Model):
    """Metadata for a tomogram

    Attributes:
        id (int): Numeric identifier for this tomogram (this may change!)
        affine_transformation_matrix (str): The flip or rotation transformation of this author submitted tomogram is indicated here
        ctf_corrected (bool): Whether this tomogram is CTF corrected
        dataset (Dataset): An object relationship with the dataset this tomogram is a part of
        dataset_id (int): Reference to the dataset this tomogram is a part of
        fiducial_alignment_status (str): Fiducial Alignment status: True = aligned with fiducial False = aligned without fiducial
        https_mrc_scale0 (str): HTTPS path to this tomogram in MRC format (no scaling)
        https_omezarr_dir (str): HTTPS path to this tomogram in multiscale OME-Zarr format
        is_canonical (bool): Is this tomogram considered the canonical tomogram for the run experiment? True=Yes
        key_photo_url (str): URL for the key photo
        key_photo_thumbnail_url (str): URL for the thumbnail of key photo
        name (str): Short name for this tomogram
        neuroglancer_config (str): the compact json of neuroglancer config
        offset_x (int): x offset data relative to the canonical tomogram in pixels
        offset_y (int): y offset data relative to the canonical tomogram in pixels
        offset_z (int):  z offset data relative to the canonical tomogram in pixels
        processing (str): Describe additional processing used to derive the tomogram
        processing_software (str): Processing software used to derive the tomogram
        reconstruction_method (str):Describe reconstruction method (Weighted back-projection, SART, SIRT)
        reconstruction_software (str):Name of software used for reconstruction
        s3_mrc_scale0 (str):S3 path to this tomogram in MRC format (no scaling)
        s3_omezarr_dir (str):S3 path to this tomogram in multiscale OME-Zarr format
        scale0_dimensions (str):comma separated x,y,z dimensions of the unscaled tomogram
        scale1_dimensions (str):comma separated x,y,z dimensions of the scale1 tomogram
        scale2_dimensions (str):comma separated x,y,z dimensions of the scale2 tomogram
        size_x (int): Number of pixels in the 3D data fast axis
        size_y (int): Number of pixels in the 3D data medium axis
        size_z (int):  Number of pixels in the 3D data slow axis.  This is the image projection direction at zero stage tilt
        type (str):  Tomogram purpose (ex: CANONICAL)
        tomogram_version (str): Version of tomogram using the same software and post-processing. Version of tomogram using the same software and post-processing. This will be presented as the latest version
        tomogram_voxel_spacing (TomogramVoxelSpacing): An object relationship with a specific voxel spacing for this experiment run
        voxel_spacing (float): Voxel spacing equal in all three axes in angstroms
    """

    _gql_type = "tomograms"

    tomogram_voxel_spacing: TomogramVoxelSpacing = ItemRelationship(
        TomogramVoxelSpacing,
        "tomogram_voxel_spacing_id",
        "id",
    )

    id: int = IntField()
    tomogram_voxel_spacing_id: int = IntField()
    name: str = StringField()
    size_x: int = IntField()
    size_y: int = IntField()
    size_z: int = IntField()
    fiducial_alignment_status: str = StringField()
    reconstruction_method: str = StringField()
    reconstruction_software: str = StringField()
    processing: str = StringField()
    processing_software: str = StringField()
    tomogram_version: str = StringField()
    is_canonical: int = BooleanField()
    s3_omezarr_dir: str = StringField()
    https_omezarr_dir: str = StringField()
    s3_mrc_scale0: str = StringField()
    https_mrc_scale0: str = StringField()
    scale0_dimensions: str = StringField()
    scale1_dimensions: str = StringField()
    scale2_dimensions: str = StringField()
    ctf_corrected: int = BooleanField()
    voxel_spacing: float = FloatField()
    offset_x: int = IntField()
    offset_y: int = IntField()
    offset_z: int = IntField()
    affine_transformation_matrix: str = StringField()
    key_photo_url: str = StringField()
    key_photo_thumbnail_url: str = StringField()
    neuroglancer_config: str = StringField()
    type: str = StringField()
    authors: Iterable["TomogramAuthor"] = ListRelationship(
        "TomogramAuthor",
        "id",
        "tomogram_id",
    )

    def download_omezarr(self, dest_path: Optional[str] = None):
        """Download the OME-Zarr version of this tomogram

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        recursive_prefix = "/".join(self.s3_omezarr_dir.split("/")[:-1]) + "/"
        download_directory(self.s3_omezarr_dir, recursive_prefix, dest_path)

    def download_mrcfile(self, dest_path: Optional[str] = None):
        """Download an MRC file of this tomogram

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        url = self.https_mrc_scale0
        download_https(url, dest_path)

    def download_all_annotations(
        self,
        dest_path: Optional[str] = None,
        format: Optional[str] = None,
        shape: Optional[str] = None,
    ):
        """Download all annotation files for this tomogram

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
            shape (Optional[str], optional): Choose a specific shape type to download (e.g.: OrientedPoint, SegmentationMask)
            format (Optional[str], optional): Choose a specific file format to download (e.g.: mrc, ndjson)
        """
        vs = self.tomogram_voxel_spacing
        for anno in vs.annotations:
            anno.download(dest_path, format, shape)


class TomogramAuthor(Model):
    """Metadata for a tomogram's authors

    Attributes:
        id (int): Numeric identifier for this tomogram's author (this may change!)
        affiliation_address (str): Address of the institution an author is affiliated with.
        affiliation_identifier (str): A unique identifier assigned to the affiliated institution by The Research Organization Registry (ROR).
        affiliation_name (str): Name of the institution an annotator is affiliated with. Sometimes, one annotator may have multiple affiliations.
        author_list_order (int): The order in which the author appears in the publication
        tomogram (Tomogram): An object relationship with the Tomogram this author is a part of
        tomogram_id (int): Reference to the tomogram this author contributed to
        corresponding_author_status (bool): Indicating whether an author is the corresponding author
        email (str): Email address for this author
        name (str): Full name of an author (e.g. Jane Doe).
        orcid (str): A unique, persistent identifier for researchers, provided by ORCID.
        primary_author_status (bool): Indicating whether an annotator is the main person executing the annotation, especially on manual annotation
    """

    _gql_type = "tomogram_authors"

    tomogram: Tomogram = ItemRelationship(Tomogram, "tomogram_id", "id")

    id: int = IntField()
    tomogram_id: int = IntField()
    name: str = StringField()
    orcid: str = StringField()
    corresponding_author_status: int = BooleanField()
    primary_author_status: int = BooleanField()
    email: str = StringField()
    affiliation_name: str = StringField()
    affiliation_address: str = StringField()
    affiliation_identifier: str = StringField()
    author_list_order: int = IntField()


class Annotation(Model):
    """Metadata for an annotation

    Attributes:
        id (int): Numeric identifier (May change!)
        annotation_method (str): Describe how the annotation is made (e.g. Manual, crYoLO, Positive Unlabeled Learning, template matching)
        annotation_publication (str): DOIs for publications that describe the dataset. Use a comma to separate multiple DOIs.
        annotation_software (str): Software used for generating this annotation
        authors (list[Author]): An array relationship with the authors of this annotation
        confidence_precision (float): Describe the confidence level of the annotation. Precision is defined as the % of annotation objects being true positive
        confidence_recall (float): Describe the confidence level of the annotation. Recall is defined as the % of true positives being annotated correctly
        deposition_date (date): Date when an annotation set is initially received by the Data Portal.
        ground_truth_status (bool): Whether an annotation is considered ground truth, as determined by the annotator.
        ground_truth_used (str): Annotation filename used as ground truth for precision and recall
        https_metadata_path (str): HTTPS path for the metadata json file for this annotation
        last_modified_date (date): Date when an annotation was last modified in the Data Portal
        object_count (int): Number of objects identified
        object_description (str): A textual description of the annotation object, can be a longer description to include additional information not covered by the Annotation object name and state.
        object_id (str): Gene Ontology Cellular Component identifier for the annotation object
        object_name (str): Name of the object being annotated (e.g. ribosome, nuclear pore complex, actin filament, membrane)
        object_state (str): Molecule state annotated (e.g. open, closed)
        release_date (date): Date when annotation data is made public by the Data Portal.
        tomogram_voxel_spacing (TomogramVoxelSpacing): An object relationship with a specific voxel spacing for this annotation
        tomogram_voxel_spacing_id (int): Reference to the tomogram voxel spacing group this annotation applies to
        s3_metadata_path (str): S3 path for the metadata json file for this annotation
    """

    _gql_type = "annotations"

    tomogram_voxel_spacing: TomogramVoxelSpacing = ItemRelationship(
        TomogramVoxelSpacing,
        "tomogram_voxel_spacing_id",
        "id",
    )

    annotation_method: str = StringField()
    annotation_publication: str = StringField()
    annotation_software: str = StringField()
    confidence_precision: float = FloatField()
    confidence_recall: float = FloatField()
    deposition_date: date = DateField()
    ground_truth_status: int = BooleanField()
    ground_truth_used: str = StringField()
    https_metadata_path: str = StringField()
    id: int = IntField()
    is_curator_recommended: bool = BooleanField()
    last_modified_date: date = DateField()
    object_count: int = IntField()
    object_description: str = StringField()
    object_id: str = StringField()
    object_name: str = StringField()
    object_state: str = StringField()
    release_date: date = DateField()
    s3_metadata_path: str = StringField()
    tomogram_voxel_spacing_id: int = IntField()

    authors: Iterable["AnnotationAuthor"] = ListRelationship(
        "AnnotationAuthor",
        "id",
        "annotation_id",
    )
    files: Iterable["AnnotationFile"] = ListRelationship(
        "AnnotationFile",
        "id",
        "annotation_id",
    )

    def download(
        self,
        dest_path: Optional[str] = None,
        format: Optional[str] = None,
        shape: Optional[str] = None,
    ):
        """Download annotation files for a given format and/or shape

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
            shape (Optional[str], optional): Choose a specific shape type to download (e.g.: OrientedPoint, SegmentationMask)
            format (Optional[str], optional): Choose a specific file format to download (e.g.: mrc, ndjson)
        """
        download_https(self.https_metadata_path, dest_path)
        for file in self.files:
            if format and file.format != format:
                continue
            if shape and file.shape_type != shape:
                continue
            file.download(dest_path)


class AnnotationFile(Model):
    """Metadata for an annotation file

    Attributes:
        id (int): Numeric identifier (May change!)
        format (str): File format for this file
        https_path (str): HTTPS url for the annotation file
        s3_path (str): S3 path for the annotation file
        shape_type (str): Describe whether this is a Point, OrientedPoint, or SegmentationMask file
        annotation_id (int): Reference to the annotation this file applies to
        Annotation (Annotation): The annotation this file is a part of
    """

    _gql_type = "annotation_files"

    annotation: "Annotation" = ItemRelationship(
        "Annotation",
        "annotation_id",
        "id",
    )

    format: str = StringField()
    https_path: str = StringField()
    id: int = IntField()
    annotation_id: int = IntField()
    https_path: str = StringField()
    s3_path: str = StringField()
    shape_type: str = StringField()

    def download(self, dest_path: Optional[str] = None):
        if self.format == "zarr":
            recursive_prefix = "/".join(self.s3_path.split("/")[:-1]) + "/"
            download_directory(self.s3_path, recursive_prefix, dest_path)
        else:
            download_https(self.https_path, dest_path)


class AnnotationAuthor(Model):
    """Metadata for an annotation's authors

    Attributes:
        id (int): Numeric identifier for this annotation author (this may change!)
        affiliation_address (str): Address of the institution an annotator is affiliated with.
        affiliation_identifier (str): A unique identifier assigned to the affiliated institution by The Research Organization Registry (ROR).
        affiliation_name (str): Name of the institution an annotator is affiliated with. Sometimes, one annotator may have multiple affiliations.
        annotation (Annotation): An object relationship with the annotation this author is a part of
        annotation_id (int): Reference to the annotation this author contributed to
        corresponding_author_status (bool): Indicating whether an annotator is the corresponding author
        email (str): Email address for this author
        name (str): Full name of an annotation author (e.g. Jane Doe).
        orcid (str): A unique, persistent identifier for researchers, provided by ORCID.
        primary_annotator_status (bool): Indicating whether an annotator is the main person executing the annotation, especially on manual annotation
    """

    _gql_type = "annotation_authors"

    annotation: Annotation = ItemRelationship(Annotation, "annotation_id", "id")

    id: int = IntField()
    annotation_id: int = IntField()
    name: str = StringField()
    orcid: str = StringField()
    corresponding_author_status: int = BooleanField()
    primary_annotator_status: int = BooleanField()
    email: str = StringField()
    affiliation_name: str = StringField()
    affiliation_address: str = StringField()
    affiliation_identifier: str = StringField()


class TiltSeries(Model):
    """Metadata about how a tilt series was generated, and locations of output files

    Attributes:
        id (int): Numeric identifier for this tilt series (this may change!)
        run (Run): An object relationship with the run this tiltseries is a part of
        run_id (int): Reference to the run this tiltseries is a part of
        acceleration_voltage (int): Electron Microscope Accelerator voltage in volts
        binning_from_frames (float): Describes the binning factor from frames to tilt series file
        camera_manufacturer: (str): Name of the camera manufacturer
        camera_model (str): Camera model name
        data_acquisition_software: (str): Software used to collect data
        https_alignment_file (str): HTTPS path to the alignment file for this tiltseries
        https_angle_list (str): HTTPS path to the angle list file for this tiltseries
        https_collection_metadata (str): HTTPS path to the collection metadata file for this tiltseries
        https_mrc_bin1 (str): HTTPS path to this tiltseries in MRC format (no scaling)
        https_omezarr_dir (str): HTTPS path to this tomogram in multiscale OME-Zarr format
        microscope_additional_info (str):  Other microscope optical setup information, in addition to energy filter, phase plate and image corrector
        microscope_energy_filter: (str): Energy filter setup used
        microscope_image_corrector (str): Image corrector setup
        microscope_manufacturer (str): Name of the microscope manufacturer
        microscope_model (str): Microscope model name
        microscope_phase_plate (str): Phase plate configuration
        related_empiar_entry (str):  If a tilt series is deposited into EMPIAR, enter the EMPIAR dataset identifier
        s3_alignment_file (str): S3 path to the alignment file for this tiltseries
        s3_angle_list (str): S3 path to the angle list file for this tiltseries
        s3_collection_metadata (str): S3 path to the collection metadata file for this tiltseries
        s3_mrc_bin1 (str): S3 path to this tiltseries in MRC format (no scaling)
        s3_omezarr_dir (str): S3 path to this tomogram in multiscale OME-Zarr format
        spherical_aberration_constant (float): Spherical Aberration Constant of the objective lens in millimeters
        tilt_axis (float): Rotation angle in degrees
        tilt_max (float): Maximal tilt angle in degrees
        tilt_min (float): Minimal tilt angle in degrees
        tilt_range (float): Total tilt range in degrees
        tilt_series_quality (int): Author assessment of tilt series quality within the dataset (1-5, 5 is best)
        tilt_step (float): Tilt step in degrees
        tilting_scheme (str): The order of stage tilting during acquisition of the data
        total_flux (float): Number of Electrons reaching the specimen in a square Angstrom area for the entire tilt series
    """

    _gql_type = "tiltseries"

    run: Run = ItemRelationship(Run, "run_id", "id")

    acceleration_voltage: int = IntField()
    aligned_tiltseries_binning: int = IntField()
    binning_from_frames: float = FloatField()
    camera_manufacturer: str = StringField()
    camera_model: str = StringField()
    data_acquisition_software: float = FloatField()
    frames_count: int = IntField()
    https_alignment_file: str = StringField()
    https_angle_list: str = StringField()
    https_collection_metadata: str = StringField()
    https_mrc_bin1: str = StringField()
    https_omezarr_dir: str = StringField()
    id: int = IntField()
    is_aligned: bool = BooleanField()
    microscope_additional_info: str = StringField()
    microscope_energy_filter: str = StringField()
    microscope_image_corrector: str = StringField()
    microscope_manufacturer: str = StringField()
    microscope_model: str = StringField()
    microscope_phase_plate: str = StringField()
    pixel_spacing: float = FloatField()
    related_empiar_entry: str = StringField()
    run_id: int = IntField()
    s3_alignment_file: str = StringField()
    s3_angle_list: str = StringField()
    s3_collection_metadata: str = StringField()
    s3_mrc_bin1: str = StringField()
    s3_omezarr_dir: str = StringField()
    spherical_aberration_constant: float = FloatField()
    tilt_axis: float = FloatField()
    tilt_max: float = FloatField()
    tilt_min: float = FloatField()
    tilt_range: float = FloatField()
    tilt_series_quality: int = IntField()
    tilt_step: float = FloatField()
    tilting_scheme: str = StringField()
    total_flux: float = FloatField()

    def download_collection_metadata(self, dest_path: Optional[str] = None):
        """Download the collection metadata for this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_https(self.https_collection_metadata, dest_path)

    def download_angle_list(self, dest_path: Optional[str] = None):
        """Download the angle list for this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_https(self.https_angle_list, dest_path)

    def download_alignment_file(self, dest_path: Optional[str] = None):
        """Download the alignment file for this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_https(self.https_alignment_file, dest_path)

    def download_omezarr(self, dest_path: Optional[str] = None):
        """Download the omezarr version of this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        recursive_prefix = "/".join(self.s3_omezarr_dir.split("/")[:-1]) + "/"
        download_directory(self.s3_omezarr_dir, recursive_prefix, dest_path)

    def download_mrcfile(
        self,
        dest_path: Optional[str] = None,
    ):
        """Download an MRC file for this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        url = self.https_mrc_bin1
        download_https(url, dest_path)


# Perform any additional configuration work for these models.
Dataset.setup()
DatasetAuthor.setup()
DatasetFunding.setup()
Run.setup()
Tomogram.setup()
TomogramAuthor.setup()
Annotation.setup()
AnnotationFile.setup()  # NEW
AnnotationAuthor.setup()
TiltSeries.setup()
TomogramVoxelSpacing.setup()
