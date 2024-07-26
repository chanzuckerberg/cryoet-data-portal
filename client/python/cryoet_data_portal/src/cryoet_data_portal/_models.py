"""CryoET data portal client model classes."""

from __future__ import annotations

import os
from datetime import date
from typing import List, Optional

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
    """Dataset Metadata

    Attributes:
        authors (List[DatasetAuthor]): An array relationship
        cell_component_id (str): If this dataset only focuses on a specific part of a cell, include the subset here
        cell_component_name (str): Name of the cellular component
        cell_name (str): Name of the cell from which a biological sample used in a CryoET study is derived from.
        cell_strain_id (str): NCBI Identifier for the cell line or strain
        cell_strain_name (str): Cell line or strain for the sample.
        cell_type_id (str): Cell Ontology identifier for the cell type
        dataset_citations (str): DOIs for publications that cite the dataset. Use a comma to separate multiple DOIs.
        dataset_publications (str): DOIs for publications that describe the dataset. Use a comma to separate multiple DOIs.
        deposition_date (date): Date when a dataset is initially received by the Data Portal.
        description (str): A short description of a CryoET dataset, similar to an abstract for a journal article or dataset.
        funding_sources (List[DatasetFunding]): An array relationship
        grid_preparation (str): Describe Cryo-ET grid preparation.
        https_prefix (str): The https directory path where this dataset is contained
        id (int): An identifier for a CryoET dataset, assigned by the Data Portal. Used to identify the dataset as the directory name in data tree
        key_photo_thumbnail_url (str): URL for the thumbnail of preview image.
        key_photo_url (str): URL for the dataset preview image.
        last_modified_date (date): Date when a released dataset is last modified.
        organism_name (str): Name of the organism from which a biological sample used in a CryoET study is derived from, e.g. homo sapiens
        organism_taxid (str): NCBI taxonomy identifier for the organism, e.g. 9606
        other_setup (str): Describe other setup not covered by sample preparation or grid preparation that may make this dataset unique in  the same publication
        related_database_entries (str): If a CryoET dataset is also deposited into another database, enter the database identifier here (e.g. EMPIAR-11445). Use a comma to separate multiple identifiers.
        related_database_links (str): If a CryoET dataset is also deposited into another database, e.g. EMPAIR, enter the database identifier here (e.g.https://www.ebi.ac.uk/empiar/EMPIAR-12345/).  Use a comma to separate multiple links.
        release_date (date): Date when a dataset is made available on the Data Portal.
        runs (List[Run]): An array relationship
        s3_prefix (str): The S3 public bucket path where this dataset is contained
        sample_preparation (str): Describe how the sample was prepared.
        sample_type (str): Type of samples used in a CryoET study. (cell, tissue, organism, intact organelle, in-vitro mixture, in-silico synthetic data, other)
        tissue_id (str): UBERON identifier for the tissue
        tissue_name (str): Name of the tissue from which a biological sample used in a CryoET study is derived from.
        title (str): Title of a CryoET dataset
    """

    _gql_type: str = "datasets"

    authors: List[DatasetAuthor] = ListRelationship("DatasetAuthor", "id", "dataset_id")
    cell_component_id: str = StringField()
    cell_component_name: str = StringField()
    cell_name: str = StringField()
    cell_strain_id: str = StringField()
    cell_strain_name: str = StringField()
    cell_type_id: str = StringField()
    dataset_citations: str = StringField()
    dataset_publications: str = StringField()
    deposition_date: date = DateField()
    description: str = StringField()
    funding_sources: List[DatasetFunding] = ListRelationship(
        "DatasetFunding",
        "id",
        "dataset_id",
    )
    grid_preparation: str = StringField()
    https_prefix: str = StringField()
    id: int = IntField()
    key_photo_thumbnail_url: str = StringField()
    key_photo_url: str = StringField()
    last_modified_date: date = DateField()
    organism_name: str = StringField()
    organism_taxid: str = StringField()
    other_setup: str = StringField()
    related_database_entries: str = StringField()
    related_database_links: str = StringField()
    release_date: date = DateField()
    runs: List[Run] = ListRelationship("Run", "id", "dataset_id")
    s3_prefix: str = StringField()
    sample_preparation: str = StringField()
    sample_type: str = StringField()
    tissue_id: str = StringField()
    tissue_name: str = StringField()
    title: str = StringField()

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this dataset.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        recursive_prefix = "/".join(self.s3_prefix.strip("/").split("/")[:-1]) + "/"
        download_directory(self.s3_prefix, recursive_prefix, dest_path)


class DatasetAuthor(Model):
    """Authors of a dataset

    Attributes:
        affiliation_address (str): Address of the institution an author is affiliated with.
        affiliation_identifier (str): A unique identifier assigned to the affiliated institution by The Research Organization Registry (ROR).
        affiliation_name (str): Name of the institutions an author is affiliated with. Comma separated
        author_list_order (int): The order in which the author appears in the publication
        corresponding_author_status (bool): Indicating whether an author is the corresponding author
        dataset (Dataset): An object relationship
        dataset_id (int): None
        email (str): Email address for each author
        id (int): None
        name (str): Full name of a dataset author (e.g. Jane Doe).
        orcid (str): A unique, persistent identifier for researchers, provided by ORCID.
        primary_author_status (bool): None
    """

    _gql_type: str = "dataset_authors"

    affiliation_address: str = StringField()
    affiliation_identifier: str = StringField()
    affiliation_name: str = StringField()
    author_list_order: int = IntField()
    corresponding_author_status: bool = BooleanField()
    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")
    dataset_id: int = IntField()
    email: str = StringField()
    id: int = IntField()
    name: str = StringField()
    orcid: str = StringField()
    primary_author_status: bool = BooleanField()


class DatasetFunding(Model):
    """Funding sources for a dataset

    Attributes:
        dataset (Dataset): An object relationship
        dataset_id (int): None
        funding_agency_name (str): Name of the funding agency.
        grant_id (str): Grant identifier provided by the funding agency.
        id (int): None
    """

    _gql_type: str = "dataset_funding"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")
    dataset_id: int = IntField()
    funding_agency_name: str = StringField()
    grant_id: str = StringField()
    id: int = IntField()


class Run(Model):
    """Data related to an experiment run

    Attributes:
        dataset (Dataset): An object relationship
        dataset_id (int): Reference to the dataset this run is a part of
        https_prefix (str): The https directory path where this dataset is contained
        id (int): Numeric identifier (May change!)
        name (str): Short name for the tilt series
        s3_prefix (str): The S3 public bucket path where this dataset is contained
        tiltseries (List[TiltSeries]): An array relationship
        tomogram_voxel_spacings (List[TomogramVoxelSpacing]): An array relationship
    """

    _gql_type: str = "runs"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")
    dataset_id: int = IntField()
    https_prefix: str = StringField()
    id: int = IntField()
    name: str = StringField()
    s3_prefix: str = StringField()
    tiltseries: List[TiltSeries] = ListRelationship("TiltSeries", "id", "run_id")
    tomogram_voxel_spacings: List[TomogramVoxelSpacing] = ListRelationship(
        "TomogramVoxelSpacing",
        "id",
        "run_id",
    )

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
    """The tomograms for each run are grouped by their voxel spacing

    Attributes:
        annotations (List[Annotation]): An array relationship
        https_prefix (str): None
        id (int): None
        run (Run): An object relationship
        run_id (int): None
        s3_prefix (str): None
        tomograms (List[Tomogram]): An array relationship
        voxel_spacing (float): None
    """

    _gql_type: str = "tomogram_voxel_spacings"

    annotations: List[Annotation] = ListRelationship(
        "Annotation",
        "id",
        "tomogram_voxel_spacing_id",
    )
    https_prefix: str = StringField()
    id: int = IntField()
    run: Run = ItemRelationship(Run, "run_id", "id")
    run_id: int = IntField()
    s3_prefix: str = StringField()
    tomograms: List[Tomogram] = ListRelationship(
        "Tomogram",
        "id",
        "tomogram_voxel_spacing_id",
    )
    voxel_spacing: float = FloatField()

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this tomogram voxel spacing.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_directory(self.s3_prefix, self.run.s3_prefix, dest_path)


class Tomogram(Model):
    """information about the tomograms in the CryoET Data Portal

    Attributes:
        affine_transformation_matrix (str): The flip or rotation transformation of this author submitted tomogram is indicated here
        authors (List[TomogramAuthor]): An array relationship
        ctf_corrected (bool): None
        deposition_id (int): id of the associated deposition.
        fiducial_alignment_status (str): Fiducial Alignment status: True = aligned with fiducial False = aligned without fiducial
        https_mrc_scale0 (str): https path to this tomogram in MRC format (no scaling)
        https_omezarr_dir (str): HTTPS path to the this multiscale omezarr tomogram
        id (int): Numeric identifier for this tomogram (this may change!)
        is_canonical (bool): Is this tomogram considered the canonical tomogram for the run experiment? True=Yes
        key_photo_thumbnail_url (str): URL for the thumbnail of key photo
        key_photo_url (str): URL for the key photo
        name (str): Short name for this tomogram
        neuroglancer_config (str): the compact json of neuroglancer config
        offset_x (int): x offset data relative to the canonical tomogram in pixels
        offset_y (int): y offset data relative to the canonical tomogram in pixels
        offset_z (int): z offset data relative to the canonical tomogram in pixels
        processing (str): Describe additional processing used to derive the tomogram
        processing_software (str): Processing software used to derive the tomogram
        reconstruction_method (str): Describe reconstruction method (Weighted backprojection, SART, SIRT)
        reconstruction_software (str): Name of software used for reconstruction
        s3_mrc_scale0 (str): S3 path to this tomogram in MRC format (no scaling)
        s3_omezarr_dir (str): S3 path to the this multiscale omezarr tomogram
        scale0_dimensions (str): comma separated x,y,z dimensions of the unscaled tomogram
        scale1_dimensions (str): comma separated x,y,z dimensions of the scale1 tomogram
        scale2_dimensions (str): comma separated x,y,z dimensions of the scale2 tomogram
        size_x (int): Number of pixels in the 3D data fast axis
        size_y (int): Number of pixels in the 3D data medium axis
        size_z (int): Number of pixels in the 3D data slow axis.  This is the image projection direction at zero stage tilt
        tomogram_version (str): Version of tomogram using the same software and post-processing. Version of tomogram using the same software and post-processing. This will be presented as the latest version
        tomogram_voxel_spacing (TomogramVoxelSpacing): An object relationship
        tomogram_voxel_spacing_id (int): None
        type (str): None
        voxel_spacing (float): Voxel spacing equal in all three axes in angstroms
    """

    _gql_type: str = "tomograms"

    affine_transformation_matrix: str = StringField()
    authors: List[TomogramAuthor] = ListRelationship(
        "TomogramAuthor",
        "id",
        "tomogram_id",
    )
    ctf_corrected: bool = BooleanField()
    deposition_id: int = IntField()
    fiducial_alignment_status: str = StringField()
    https_mrc_scale0: str = StringField()
    https_omezarr_dir: str = StringField()
    id: int = IntField()
    is_canonical: bool = BooleanField()
    key_photo_thumbnail_url: str = StringField()
    key_photo_url: str = StringField()
    name: str = StringField()
    neuroglancer_config: str = StringField()
    offset_x: int = IntField()
    offset_y: int = IntField()
    offset_z: int = IntField()
    processing: str = StringField()
    processing_software: str = StringField()
    reconstruction_method: str = StringField()
    reconstruction_software: str = StringField()
    s3_mrc_scale0: str = StringField()
    s3_omezarr_dir: str = StringField()
    scale0_dimensions: str = StringField()
    scale1_dimensions: str = StringField()
    scale2_dimensions: str = StringField()
    size_x: int = IntField()
    size_y: int = IntField()
    size_z: int = IntField()
    tomogram_version: str = StringField()
    tomogram_voxel_spacing: TomogramVoxelSpacing = ItemRelationship(
        TomogramVoxelSpacing,
        "tomogram_voxel_spacing_id",
        "id",
    )
    tomogram_voxel_spacing_id: int = IntField()
    type: str = StringField()
    voxel_spacing: float = FloatField()

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
    """Authors for a tomogram

    Attributes:
        affiliation_address (str): Address of the institution an annotator is affiliated with.
        affiliation_identifier (str): A unique identifier assigned to the affiliated institution by The Research Organization Registry (ROR).
        affiliation_name (str): Name of the institution an annotator is affiliated with. Sometimes, one annotator may have multiple affiliations.
        author_list_order (int): The order in which the author appears in the publication
        corresponding_author_status (bool): Indicating whether an author is the corresponding author (YES or NO)
        email (str): Email address for this author
        id (int): Numeric identifier for this tomogram author (this may change!)
        name (str): Full name of an tomogram author (e.g. Jane Doe).
        orcid (str): A unique, persistent identifier for researchers, provided by ORCID.
        primary_author_status (bool): Indicating whether an author is the main person creating the tomogram (YES or NO)
        tomogram (Tomogram): An object relationship
        tomogram_id (int): Reference to the tomogram this author contributed to
    """

    _gql_type: str = "tomogram_authors"

    affiliation_address: str = StringField()
    affiliation_identifier: str = StringField()
    affiliation_name: str = StringField()
    author_list_order: int = IntField()
    corresponding_author_status: bool = BooleanField()
    email: str = StringField()
    id: int = IntField()
    name: str = StringField()
    orcid: str = StringField()
    primary_author_status: bool = BooleanField()
    tomogram: Tomogram = ItemRelationship(Tomogram, "tomogram_id", "id")
    tomogram_id: int = IntField()


class Annotation(Model):
    """Inoformation about annotations for a given run

    Attributes:
        annotation_method (str): Describe how the annotation is made (e.g. Manual, crYoLO, Positive Unlabeled Learning, template matching)
        annotation_publication (str): DOIs for publications that describe the dataset. Use a comma to separate multiple DOIs.
        annotation_software (str): None
        authors (List[AnnotationAuthor]): An array relationship
        confidence_precision (float): Describe the confidence level of the annotation. Precision is defined as the % of annotation objects being true positive
        confidence_recall (float): Describe the confidence level of the annotation. Recall is defined as the % of true positives being annotated correctly
        deposition_date (date): Date when an annotation set is initially received by the Data Portal.
        deposition_id (int): id of the associated deposition.
        files (List[AnnotationFile]): An array relationship
        ground_truth_status (bool): Whether an annotation is considered ground truth, as determined by the annotator.
        ground_truth_used (str): Annotation filename used as ground truth for precision and recall
        https_metadata_path (str): https path for the metadata json file for this annotation
        id (int): Numeric identifier (May change!)
        is_curator_recommended (bool): Data curator’s subjective choice as the best annotation of the same annotation object ID
        last_modified_date (date): Date when an annotation was last modified in the Data Portal
        method_type (str): Provides information on the method type used for generating annotation
        object_count (int): Number of objects identified
        object_description (str): A textual description of the annotation object, can be a longer description to include additional information not covered by the Annotation object name and state.
        object_id (str): Gene Ontology Cellular Component identifier for the annotation object
        object_name (str): Name of the object being annotated (e.g. ribosome, nuclear pore complex, actin filament, membrane)
        object_state (str): Molecule state annotated (e.g. open, closed)
        release_date (date): Date when annotation data is made public by the Data Portal.
        s3_metadata_path (str): s3 path for the metadata json file for this annotation
        tomogram_voxel_spacing (TomogramVoxelSpacing): An object relationship
        tomogram_voxel_spacing_id (int): None
    """

    _gql_type: str = "annotations"

    annotation_method: str = StringField()
    annotation_publication: str = StringField()
    annotation_software: str = StringField()
    authors: List[AnnotationAuthor] = ListRelationship(
        "AnnotationAuthor",
        "id",
        "annotation_id",
    )
    confidence_precision: float = FloatField()
    confidence_recall: float = FloatField()
    deposition_date: date = DateField()
    deposition_id: int = IntField()
    files: List[AnnotationFile] = ListRelationship(
        "AnnotationFile",
        "id",
        "annotation_id",
    )
    ground_truth_status: bool = BooleanField()
    ground_truth_used: str = StringField()
    https_metadata_path: str = StringField()
    id: int = IntField()
    is_curator_recommended: bool = BooleanField()
    last_modified_date: date = DateField()
    method_type: str = StringField()
    object_count: int = IntField()
    object_description: str = StringField()
    object_id: str = StringField()
    object_name: str = StringField()
    object_state: str = StringField()
    release_date: date = DateField()
    s3_metadata_path: str = StringField()
    tomogram_voxel_spacing: TomogramVoxelSpacing = ItemRelationship(
        TomogramVoxelSpacing,
        "tomogram_voxel_spacing_id",
        "id",
    )
    tomogram_voxel_spacing_id: int = IntField()

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
        download_metadata = False
        for file in self.files:
            if format and file.format != format:
                continue
            if shape and file.shape_type != shape:
                continue
            file.download(dest_path)
            download_metadata = True
        if download_metadata:
            download_https(self.https_metadata_path, dest_path)


class AnnotationFile(Model):
    """Information about associated files for a given annotation

    Attributes:
        annotation (Annotation): An object relationship
        annotation_id (int): None
        format (str): Format of the annotation object file
        https_path (str): https path of the annotation file
        id (int): None
        is_visualization_default (bool): Data curator’s subjective choice of default annotation to display in visualization for an object
        s3_path (str): s3 path of the annotation file
        shape_type (str): The type of the annotation
    """

    _gql_type: str = "annotation_files"

    annotation: Annotation = ItemRelationship(Annotation, "annotation_id", "id")
    annotation_id: int = IntField()
    format: str = StringField()
    https_path: str = StringField()
    id: int = IntField()
    is_visualization_default: bool = BooleanField()
    s3_path: str = StringField()
    shape_type: str = StringField()

    def download(self, dest_path: Optional[str] = None):
        if self.format == "zarr":
            recursive_prefix = "/".join(self.s3_path.split("/")[:-1]) + "/"
            download_directory(self.s3_path, recursive_prefix, dest_path)
        else:
            download_https(self.https_path, dest_path)


class AnnotationAuthor(Model):
    """Authors for an annotation

    Attributes:
        affiliation_address (str): Address of the institution an annotator is affiliated with.
        affiliation_identifier (str): A unique identifier assigned to the affiliated institution by The Research Organization Registry (ROR).
        affiliation_name (str): Name of the institution an annotator is affiliated with. Sometimes, one annotator may have multiple affiliations.
        annotation (Annotation): An object relationship
        annotation_id (int): Reference to the annotation this author contributed to
        author_list_order (int): The order in which the author appears in the publication
        corresponding_author_status (bool): Indicating whether an annotator is the corresponding author (YES or NO)
        email (str): Email address for this author
        id (int): Numeric identifier for this annotation author (this may change!)
        name (str): Full name of an annotation author (e.g. Jane Doe).
        orcid (str): A unique, persistent identifier for researchers, provided by ORCID.
        primary_annotator_status (bool): Indicating whether an annotator is the main person executing the annotation, especially on manual annotation (YES or NO)
    """

    _gql_type: str = "annotation_authors"

    affiliation_address: str = StringField()
    affiliation_identifier: str = StringField()
    affiliation_name: str = StringField()
    annotation: Annotation = ItemRelationship(Annotation, "annotation_id", "id")
    annotation_id: int = IntField()
    author_list_order: int = IntField()
    corresponding_author_status: bool = BooleanField()
    email: str = StringField()
    id: int = IntField()
    name: str = StringField()
    orcid: str = StringField()
    primary_annotator_status: bool = BooleanField()


class TiltSeries(Model):
    """Tilt Series Metadata

    Attributes:
        acceleration_voltage (int): Electron Microscope Accelerator voltage in volts
        aligned_tiltseries_binning (int): The binning factor between the unaligned tilt series and the aligned tiltseries.
        binning_from_frames (float): Describes the binning factor from frames to tilt series file
        camera_manufacturer (str): Name of the camera manufacturer
        camera_model (str): Camera model name
        data_acquisition_software (str): Software used to collect data
        frames_count (int): Number of frames associated to the tilt series
        https_alignment_file (str): None
        https_angle_list (str): None
        https_collection_metadata (str): None
        https_mrc_bin1 (str): None
        https_omezarr_dir (str): None
        id (int): None
        is_aligned (bool): Tilt series is aligned
        microscope_additional_info (str): Other microscope optical setup information, in addition to energy filter, phase plate and image corrector
        microscope_energy_filter (str): Energy filter setup used
        microscope_image_corrector (str): Image corrector setup
        microscope_manufacturer (str): Name of the microscope manufacturer
        microscope_model (str): Microscope model name
        microscope_phase_plate (str): Phase plate configuration
        pixel_spacing (float): Pixel spacing equal in both axes in angstrom
        related_empiar_entry (str): If a tilt series is deposited into EMPIAR, enter the EMPIAR dataset identifier
        run (Run): An object relationship
        run_id (int): None
        s3_alignment_file (str): None
        s3_angle_list (str): None
        s3_collection_metadata (str): None
        s3_mrc_bin1 (str): None
        s3_omezarr_dir (str): None
        spherical_aberration_constant (float): Spherical Aberration Constant of the objective lens in millimeters
        tilt_axis (float): Rotation angle in degrees
        tilt_max (float): Maximal tilt angle in degrees
        tilt_min (float): Minimal tilt angle in degrees
        tilt_range (float): The difference between tilt_min and tilt_max
        tilt_series_quality (int): Author assessment of tilt series quality within the dataset (1-5, 5 is best)
        tilt_step (float): None
        tilting_scheme (str): The order of stage tilting during acquisition of the data
        total_flux (float): Number of Electrons reaching the specimen in a square Angstrom area for the entire tilt series
    """

    _gql_type: str = "tiltseries"

    acceleration_voltage: int = IntField()
    aligned_tiltseries_binning: int = IntField()
    binning_from_frames: float = FloatField()
    camera_manufacturer: str = StringField()
    camera_model: str = StringField()
    data_acquisition_software: str = StringField()
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
    run: Run = ItemRelationship(Run, "run_id", "id")
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


Dataset.setup()
DatasetAuthor.setup()
DatasetFunding.setup()
Run.setup()
TomogramVoxelSpacing.setup()
Tomogram.setup()
TomogramAuthor.setup()
Annotation.setup()
AnnotationFile.setup()
AnnotationAuthor.setup()
TiltSeries.setup()
