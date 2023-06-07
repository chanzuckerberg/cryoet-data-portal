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
        recursive_prefix = "/".join(self.s3_prefix.strip("/").split("/")[:-1]) + "/"
        download_directory(self.s3_prefix, recursive_prefix, dest_path)


class DatasetAuthor(Model):
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
    _gql_type = "dataset_funding"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id: int = IntField()
    dataset_id: int = IntField()
    funding_agency_name: str = StringField()
    grant_id: str = StringField()


class Run(Model):
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
        download_directory(self.s3_prefix, self.dataset.s3_prefix, dest_path)

    def download_frames(self, dest_path: Optional[str] = None):
        download_directory(os.path.join(self.s3_prefix, "Frames"), self.dataset.s3_prefix)


class Tomogram(Model):
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
        recursive_prefix = "/".join(self.s3_omezarr_dir.split("/")[:-1]) + "/"
        download_directory(self.s3_omezarr_dir, recursive_prefix, dest_path)

    def download_mrcfile(self, dest_path: Optional[str] = None, binning: Optional[int] = None):
        url = self.https_mrc_scale0
        if binning == 2:
            url = self.https_mrc_scale1
        if binning == 4:
            url = self.https_mrc_scale2
        download_https(url, dest_path)


class Annotation(Model):
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
        download_https(self.https_collection_metadata, dest_path)

    def download_angle_list(self, dest_path: Optional[str] = None):
        download_https(self.https_angle_list, dest_path)

    def download_alignment_file(self, dest_path: Optional[str] = None):
        download_https(self.https_alignment_file, dest_path)

    def download_omezarr(self, dest_path: Optional[str] = None):
        recursive_prefix = "/".join(self.s3_omezarr_dir.split("/")[:-1]) + "/"
        download_directory(self.s3_omezarr_dir, recursive_prefix, dest_path)

    def download_mrcfile(self, dest_path: Optional[str] = None, binning: Optional[int] = None):
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
