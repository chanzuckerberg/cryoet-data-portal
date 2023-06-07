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
        cell_line_name (str): Cell line or strain for the sample.
        cell_line_source (str): Name of the company from which the sample is sourced from.
        cell_name (str): Name of the cell from which a biological sample used in a CryoET study is derived from.
        cell_type_id (str): Cell Ontology identifier for the cell type
        dataset_citations (str): DOIs for publications that cite the dataset. Use a comma to separate multiple DOIs.
        dataset_publications (str): DOIs for publications that describe the dataset. Use a comma to separate multiple DOIs.
        deposition_date: date! Date when a dataset is initially received by the Data Portal.
        description (str): A short description of a CryoET dataset, similar to an abstract for a journal article or dataset.
        funding_sources: List[FundingSource] An array relationship with FundingSource
        grid_preparation (str): Describe Cryo-ET grid preparation.
        https_prefix (str): The HTTPS directory path where this dataset is contained
        last_modified_date (date):Date when a released dataset is last modified.
        organism_name (str): Name of the organism from which a biological sample used in a CryoET study is derived from, e.g. homo sapiens
        organism_taxid (str): NCBI taxonomy identifier for the organism, e.g. 9606
        other_setup (str): Describe other setup not covered by sample preparation or grid preparation that may make this dataset unique in  the same publication
        related_database_entries (str): If a CryoET dataset is also deposited into another database, enter the database identifier here (e.g. EMPIAR-11445). Use a comma to separate multiple identifiers.
        related_database_links (str): If a CryoET dataset is also deposited into another database, e.g. EMPAIR, enter the database identifier here (e.g.https://www.ebi.ac.uk/empiar/EMPIAR-12345/).  Use a comma to separate multiple links.
        release_date (date): Date when a dataset is made available on the Data Portal.
        runs: List[Run] An array relationship with Run
        s3_prefix (str): The S3 public bucket path where this dataset is contained
        sample_preparation (str): Describe how the sample was prepared.
        sample_type (str): Type of samples used in a CryoET study. (cell, tissue, organism, intact organelle, in-vitro mixture, in-silico synthetic data, other)
        tissue_id (str): UBERON identifier for the tissue
        tissue_name (str): Name of the tissue from which a biological sample used in a CryoET study is derived from.
        title (str): Title of a CryoET dataset
        tomograms (list[Tomogram]): An array relationship with Tomogram
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
    cell_line_name: str = StringField()
    cell_line_source: str = StringField()
    sample_preparation: str = StringField()
    grid_preparation: str = StringField()
    other_setup: str = StringField()
    s3_prefix: str = StringField()
    https_prefix: str = StringField()

    tomograms: Iterable["Tomogram"] = ListRelationship("Tomogram", "id", "dataset_id")
    runs: Iterable["Run"] = ListRelationship("Run", "id", "dataset_id")
    authors: Iterable["DatasetAuthor"] = ListRelationship("DatasetAuthor", "id", "dataset_id")
    funding_sources: Iterable["DatasetFunding"] = ListRelationship("DatasetFunding", "id", "dataset_id")

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
        corresponding_author_status (bool):Indicating whether an author is the corresponding author
        dataset (Dataset): An object relationship with the dataset this author correspods to
        dataset_id (int): Numeric identifier for the dataset this author corresponds to
        email (str): Email address for each autho
        name (str): Full name of a dataset author (e.g. Jane Doe).
        orcid (str): A unique, persistent identifier for researchers, provided by ORCID.
    """

    _gql_type = "dataset_authors"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id: int = IntField()
    dataset_id: int = IntField()
    orcid: str = StringField()
    name: str = StringField()
    corresponding_author_status: int = BooleanField()
    email: str = StringField()
    affiliation_name: str = StringField()
    affiliation_address: str = StringField()
    affiliation_identifier: str = StringField()


class DatasetFunding(Model):
    """Metadata for a dataset's funding sources

    Attributes:
        id (int): A numeric identifier for this funding record
        dataset (Dataset): An object relationship with the dataset this funding source correspods to
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
        acceleration_voltage (int): Electron Microscope Accelerator voltage in volts
        annotations (list[Annotation]): An array relationship with the annotations associated with this run
        binning_from_frames (float): Describes the binning factor from frames to tilt series file
        camera_manufacturer: (str): Name of the camera manufacturer
        camera_model (str): Camera model name
        data_acquisition_software: (str): Software used to collect data
        dataset (Dataset): An object relationship with the dataset this run is a part of
        dataset_id (int): Reference to the dataset this run is a part of
        https_prefix (str): The HTTPS directory path where this dataset is contained
        microscope_additional_info (str):  Other microscope optical setup information, in addition to energy filter, phase plate and image corrector
        microscope_energy_filter: (str): Energy filter setup used
        microscope_image_corrector (str): Image corrector setup
        microscope_manufacturer (str): Name of the microscope manufacturer
        microscope_model (str): Microscope model name
        microscope_phase_plate (str): Phase plate configuration
        name (str): Short name for the tilt series
        related_empiar_entry (str):  If a tilt series is deposited into EMPIAR, enter the EMPIAR dataset identifier
        s3_prefix (str): The S3 public bucket path where this dataset is contained
        spherical_aberration_constant (float): Spherical Aberration Constant of the objective lens in millimeters
        tilt_axis (float): Rotation angle in degrees
        tilt_max (float): Maximal tilt angle in degrees
        tilt_min (float): Minimal tilt angle in degrees
        tilt_range (float): Total tilt range in degrees
        tilt_series_quality (int): Author assessment of tilt series quality within the dataset (1-5, 5 is best)
        tilt_step (float): Tilt step in degrees
        tilting_scheme (str): The order of stage tilting during acquisition of the data
        tiltseries (list[TiltSeries]): An array relationship with TiltSeries that correspond to this run
        tomograms (list[Tomogram]): An array relationship with Tomograms that correspond to this run
        total_flux (float): Number of Electrons reaching the specimen in a square Angstrom area for the entire tilt series
    """

    _gql_type = "runs"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id: int = IntField()
    dataset_id: int = IntField()
    name: str = StringField()
    acceleration_voltage: int = IntField()
    spherical_aberration_constant: float = FloatField()
    microscope_manufacturer: str = StringField()
    microscope_model: str = StringField()
    microscope_energy_filter: str = StringField()
    microscope_phase_plate: str = StringField()
    microscope_image_corrector: str = StringField()
    microscope_additional_info: str = StringField()
    camera_manufacturer: str = StringField()
    camera_model: str = StringField()
    tilt_min: float = FloatField()
    tilt_max: float = FloatField()
    tilt_range: float = FloatField()
    tilt_step: float = FloatField()
    tilting_scheme: str = StringField()
    tilt_axis: float = FloatField()
    total_flux: float = FloatField()
    data_acquisition_software: float = FloatField()
    related_empiar_entry: str = StringField()
    binning_from_frames: float = FloatField()
    tilt_series_quality: int = IntField()
    s3_prefix: str = StringField()
    https_prefix: str = StringField()

    tomograms: Iterable["Tomogram"] = ListRelationship("Tomogram", "id", "run_id")
    annotations: Iterable["Annotation"] = ListRelationship("Annotation", "id", "run_id")
    tiltseries: Iterable["TiltSeries"] = ListRelationship("TiltSeries", "id", "run_id")

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this run.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_directory(self.s3_prefix, self.dataset.s3_prefix, dest_path)

    def download_frames(self, dest_path: Optional[str] = None):
        download_directory(os.path.join(self.s3_prefix, "Frames"), self.dataset.s3_prefix)


class Tomogram(Model):
    """Metadata for a tomogram

    Attributes:
        id (int): Numeric identifier for this tomogram (this may change!)
        ctf_corrected (bool): Whether this tomogram is CTF corrected
        dataset (Dataset): An object relationship with the dataset this tomogram is a part of
        dataset_id (int): Reference to the dataset this tomogram is a part of
        fiducial_alignment_status (str): Fiducial Alignment status: True = aligned with fiducial False = aligned without fiducial
        https_mrc_scale0 (str): HTTPS path to this tomogram in MRC format (no scaling)
        https_mrc_scale1 (str): HTTPS path to this tomogram in MRC format (downscaled to 50%)
        https_mrc_scale2 (str): HTTPS path to this tomogram in MRC format (downscaled to 25%)
        https_omezarr_dir (str): HTTPS path to the this multiscale omezarr tomogram
        is_canonical (bool): Is this tomogram considered the canonical tomogram for the run experiment? True=Yes
        name (str): Short name for this tomogram
        processing (str): Describe additional processing used to derive the tomogram
        processing_software (str): Processing software used to derive the tomogram
        reconstruction_method (str):Describe reconstruction method (Weighted backprojection, SART, SIRT)
        reconstruction_software (str):Name of software used for reconstruction
        run (Run): An object relationship with the run this tomogram is a part of
        run_id (int): Reference to the run this tomogram is a part of
        s3_mrc_scale1 (str):S3 path to this tomogram in MRC format (downscaled to 50%)
        s3_mrc_scale2 (str):S3 path to this tomogram in MRC format (downscaled to 25%)
        s3_mrc_scale0 (str):S3 path to this tomogram in MRC format (no scaling)
        s3_omezarr_dir (str):S3 path to the this multiscale omezarr tomogram
        scale0_dimensions (str):comma separated x,y,z dimensions of the unscaled tomogram
        scale1_dimensions (str):comma separated x,y,z dimensions of the scale1 tomogram
        scale2_dimensions (str):comma separated x,y,z dimensions of the scale2 tomogram
        size_x (int): Number of pixels in the 3D data fast axis
        size_y (int): Number of pixels in the 3D data medium axis
        size_z (int):  Number of pixels in the 3D data slow axis.  This is the image projection direction at zero stage tilt
        tomogram_version (str): Version of tomogram using the same software and post-processing. Version of tomogram using the same software and post-processing. This will be presented as the latest version
        voxel_spacing (float): Voxel spacing equal in all three axes in angstroms
    """

    _gql_type = "tomograms"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")
    run: Run = ItemRelationship(Run, "run_id", "id")

    id: int = IntField()
    dataset_id: int = IntField()
    run_id: int = IntField()
    name: str = StringField()
    size_x: int = IntField()
    size_y: int = IntField()
    size_z: int = IntField()
    voxel_spacing: float = FloatField()
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
    s3_mrc_scale1: str = StringField()
    s3_mrc_scale2: str = StringField()
    https_mrc_scale0: str = StringField()
    https_mrc_scale1: str = StringField()
    https_mrc_scale2: str = StringField()
    scale0_dimensions: str = StringField()
    scale1_dimensions: str = StringField()
    scale2_dimensions: str = StringField()
    ctf_corrected: int = BooleanField()

    def download_omezarr(self, dest_path: Optional[str] = None):
        """Download the omezarr version of this tomogram

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        recursive_prefix = "/".join(self.s3_omezarr_dir.split("/")[:-1]) + "/"
        download_directory(self.s3_omezarr_dir, recursive_prefix, dest_path)

    def download_mrcfile(self, dest_path: Optional[str] = None, binning: Optional[int] = None):
        """Download an MRC file with a given binning factor

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
            binning (Optional[int], optional): _description_. Downscaling factor for the MRC file to download, either 1, 2, or 4. Defaults to 1 (full size)
        """
        url = self.https_mrc_scale0
        if binning == 2:
            url = self.https_mrc_scale1
        if binning == 4:
            url = self.https_mrc_scale2
        download_https(url, dest_path)


class Annotation(Model):
    """Metadata for an annotation

    Attributes:
        id (int): Numeric identifier (May change!)
        annotation_method (str): Describe how the annotation is made (e.g. Manual, crYoLO, Positive Unlabeled Learning, template matching)
        annotation_publication (str): DOIs for publications that describe the dataset. Use a comma to separate multiple DOIs.
        authors (list[Author]): An array relationship with the authors of this annotation
        confidence_precision (float): Describe the confidence level of the annotation. Precision is defined as the % of annotation objects being true positive
        confidence_recall (float): Describe the confidence level of the annotation. Recall is defined as the % of true positives being annotated correctly
        deposition_date (date): Date when an annotation set is initially received by the Data Portal.
        ground_truth_status (bool): Whether an annotation is considered ground truth, as determined by the annotator.
        ground_truth_used (str): Annotation filename used as ground truth for precision and recall
        https_annotations_path (str): HTTPS path for the annotations file for these annotations
        https_metadata_path (str): HTTPS path for the metadata json file for this annotation
        last_modified_date (date): Date when an annotation was last modified in the Data Portal
        object_count (int): Number of objects identified
        object_description (str): A textual description of the annotation object, can be a longer description to include additional information not covered by the Annotation object name and state.
        object_diameter (float): Diameter of the annotation object in Angstrom; applicable if the object shape is point or vector
        object_id (str): Gene Ontology Cellular Component identifier for the annotation object
        object_name (str): Name of the object being annotated (e.g. ribosome, nuclear pore complex, actin filament, membrane)
        object_state (str): Molecule state annotated (e.g. open, closed)
        object_weight (float): Molecular weight of the annotation object, in Dalton
        object_width (float): Average width of the annotation object in Angstroms; applicable if the object shape is line
        release_date (date): Date when annotation data is made public by the Data Portal.
        run (Run): An object relationship with the run this annotation is a part of
        run_id (int): Reference to the run these annotations are a part of
        s3_annotations_path (str): S3 path for the annotations file for these annotations
        s3_metadata_path (str): S3 path for the metadata json file for this annotation
        shape_type (str): The format are the individual annotations are stored in
    """

    _gql_type = "annotations"

    run: Run = ItemRelationship(Run, "run_id", "id")

    id: int = IntField()
    run_id: int = IntField()
    s3_metadata_path: str = StringField()
    https_metadata_path: str = StringField()
    s3_annotations_path: str = StringField()
    https_annotations_path: str = StringField()
    deposition_date: date = DateField()
    release_date: date = DateField()
    last_modified_date: date = DateField()
    annotation_publication: str = StringField()
    annotation_method: str = StringField()
    ground_truth_status: int = BooleanField()
    object_name: str = StringField()
    object_id: str = StringField()
    object_description: str = StringField()
    object_state: str = StringField()
    shape_type: str = StringField()
    object_weight: float = FloatField()
    object_diameter: float = FloatField()
    object_width: float = FloatField()
    object_count: int = IntField()
    confidence_precision: float = FloatField()
    confidence_recall: float = FloatField()
    ground_truth_used: str = StringField()

    authors: Iterable["AnnotationAuthor"] = ListRelationship("AnnotationAuthor", "id", "annotation_id")

    def download(self, dest_path: Optional[str] = None):
        download_https(self.https_metadata_path, dest_path)
        download_https(self.https_annotations_path, dest_path)


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
    """File locations for key files in a run's TiltSeries

    Attributes:
        id (int): Numeric identifier for this tilt series (this may change!)
        https_alignment_file (str): HTTPS path to the alignment file for this tiltseries
        https_angle_list (str): HTTPS path to the angle list file for this tiltseries
        https_collection_metadata (str): HTTPS path to the collection metadata file for this tiltseries
        https_mrc_bin1 (str): HTTPS path to this tiltseries in MRC format (no scaling)
        https_mrc_bin2 (str): HTTPS path to this tiltseries in MRC format (downscaled to 50%)
        https_mrc_bin4 (str): HTTPS path to this tiltseries in MRC format (downscaled to 25%)
        https_omezarr_dir (str): HTTPS path to the this multiscale omezarr tiltseries
        run (Run): An object relationship with the run this tiltseries is a part of
        run_id (int): Reference to the run this tiltseries is a part of
        s3_alignment_file (str): S3 path to the alignment file for this tiltseries
        s3_angle_list (str): S3 path to the angle list file for this tiltseries
        s3_collection_metadata (str): S3 path to the collection metadata file for this tiltseries
        s3_mrc_bin1 (str): S3 path to this tiltseries in MRC format (no scaling)
        s3_mrc_bin2 (str): S3 path to this tiltseries in MRC format (downscaled to 50%)
        s3_mrc_bin4 (str): S3 path to this tiltseries in MRC format (downscaled to 25%)
        s3_omezarr_dir (str): S3 path to the this multiscale omezarr tiltseries
    """

    _gql_type = "tiltseries"

    run: Run = ItemRelationship(Run, "run_id", "id")

    id: int = IntField()
    run_id: int = IntField()
    s3_mrc_bin1: str = StringField()
    s3_mrc_bin2: str = StringField()
    s3_mrc_bin4: str = StringField()
    s3_omezarr_dir: str = StringField()
    https_mrc_bin1: str = StringField()
    https_mrc_bin2: str = StringField()
    https_mrc_bin4: str = StringField()
    https_omezarr_dir: str = StringField()
    s3_collection_metadata: str = StringField()
    https_collection_metadata: str = StringField()
    s3_angle_list: str = StringField()
    https_angle_list: str = StringField()
    s3_alignment_file: str = StringField()
    https_alignment_file: str = StringField()

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

    def download_mrcfile(self, dest_path: Optional[str] = None, binning: Optional[int] = None):
        """Download an MRC file with a given binning factor

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
            binning (Optional[int], optional): _description_. Downscaling factor for the MRC file to download, either 1, 2, or 4. Defaults to 1 (full size)
        """
        url = self.https_mrc_bin1
        if binning == 2:
            url = self.https_mrc_bin2
        if binning == 4:
            url = self.https_mrc_bin4
        download_https(url, dest_path)


# Perform any additional configuration work for these models.
Dataset.setup()
DatasetAuthor.setup()
DatasetFunding.setup()
Run.setup()
Tomogram.setup()
Annotation.setup()
AnnotationAuthor.setup()
TiltSeries.setup()
