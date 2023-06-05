import os
from typing import Optional

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

    # Placeholders to be replaced at the end of this file
    tomograms = None
    runs = None
    authors = None
    funding_sources = None

    id = IntField()
    title = StringField()
    description = StringField()
    deposition_date = DateField()
    release_date = DateField()
    last_modified_date = DateField()
    related_database_entries = StringField()
    related_database_links = StringField()
    dataset_publications = StringField()
    dataset_citations = StringField()
    sample_type = StringField()
    organism_name = StringField()
    organism_taxid = StringField()
    tissue_name = StringField()
    tissue_id = StringField()
    cell_name = StringField()
    cell_type_id = StringField()
    cell_line_name = StringField()
    cell_line_source = StringField()
    sample_preparation = StringField()
    grid_preparation = StringField()
    other_setup = StringField()
    s3_prefix = StringField()
    https_prefix = StringField()


class DatasetAuthor(Model):
    _gql_type = "dataset_authors"

    dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id = IntField()
    dataset_id = IntField()
    orcid = StringField()
    name = StringField()
    corresponding_author_status = BooleanField()
    email = StringField()
    affiliation_name = StringField()
    affiliation_address = StringField()
    affiliation_identifier = StringField()


class DatasetFunding(Model):
    _gql_type = "dataset_funding"

    dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id = IntField()
    dataset_id = IntField()
    funding_agency_name = StringField()
    grant_id = StringField()


class Run(Model):
    _gql_type = "runs"

    dataset = ItemRelationship(Dataset, "dataset_id", "id")

    id = IntField()
    dataset_id = IntField()
    name = StringField()
    acceleration_voltage = IntField()
    spherical_aberration_constant = FloatField()
    microscope_manufacturer = StringField()
    microscope_model = StringField()
    microscope_energy_filter = StringField()
    microscope_phase_plate = StringField()
    microscope_image_corrector = StringField()
    microscope_additional_info = StringField()
    camera_manufacturer = StringField()
    camera_model = StringField()
    tilt_min = FloatField()
    tilt_max = FloatField()
    tilt_range = FloatField()
    tilt_step = FloatField()
    tilting_scheme = StringField()
    tilt_axis = FloatField()
    total_flux = FloatField()
    data_acquisition_software = FloatField()
    related_empiar_entry = StringField()
    binning_from_frames = FloatField()
    tilt_series_quality = IntField()
    s3_prefix = StringField()
    https_prefix = StringField()

    def download_everything(self):
        download_directory(self.s3_prefix, self.dataset.s3_prefix)

    def download_frames(self):
        download_directory(os.path.join(self.s3_prefix, "Frames"), self.dataset.s3_prefix)


class Tomogram(Model):
    _gql_type = "tomograms"

    dataset = ItemRelationship(Dataset, "dataset_id", "id")
    run = ItemRelationship(Run, "run_id", "id")

    id = IntField()
    dataset_id = IntField()
    run_id = IntField()
    name = StringField()
    size_x = IntField()
    size_y = IntField()
    size_z = IntField()
    voxel_spacing = FloatField()
    fiducial_alignment_status = StringField()
    reconstruction_method = StringField()
    reconstruction_software = StringField()
    processing = StringField()
    processing_software = StringField()
    tomogram_version = StringField()
    is_canonical = BooleanField()
    s3_omezarr_dir = StringField()
    https_omezarr_dir = StringField()
    s3_mrc_scale0 = StringField()
    s3_mrc_scale1 = StringField()
    s3_mrc_scale2 = StringField()
    https_mrc_scale0 = StringField()
    https_mrc_scale1 = StringField()
    https_mrc_scale2 = StringField()
    scale0_dimensions = StringField()
    scale1_dimensions = StringField()
    scale2_dimensions = StringField()
    ctf_corrected = BooleanField()

    def download_omezarr(self):
        recursive_prefix = "/".join(self.s3_omezarr_dir.split("/")[:-1]) + "/"
        download_directory(self.s3_omezarr_dir, recursive_prefix)

    def download_mrcfile(self, dest_path: Optional[str] = None, binning: Optional[int] = None):
        url = self.https_mrc_scale0
        if binning == 2:
            url = self.https_mrc_scale1
        if binning == 4:
            url = self.https_mrc_scale2
        download_https(url, dest_path)


class Annotation(Model):
    _gql_type = "annotations"

    run = ItemRelationship(Run, "run_id", "id")

    id = IntField()
    run_id = IntField()
    s3_metadata_path = StringField()
    https_metadata_path = StringField()
    s3_annotations_path = StringField()
    https_annotations_path = StringField()
    deposition_date = DateField()
    release_date = DateField()
    last_modified_date = DateField()
    annotation_publication = StringField()
    annotation_method = StringField()
    ground_truth_status = BooleanField()
    object_name = StringField()
    object_id = StringField()
    object_description = StringField()
    object_state = StringField()
    shape_type = StringField()
    object_weight = FloatField()
    object_diameter = FloatField()
    object_width = FloatField()
    object_count = IntField()
    confidence_precision = FloatField()
    confidence_recall = FloatField()
    ground_truth_used = StringField()

    def download(self, dest_path: Optional[str] = None):
        download_https(self.https_metadata_path, dest_path)
        download_https(self.https_annotations_path, dest_path)


class AnnotationAuthor(Model):
    _gql_type = "annotation_authors"

    annotation = ItemRelationship(Annotation, "annotation_id", "id")

    id = IntField()
    annotation_id = IntField()
    name = StringField()
    orcid = StringField()
    corresponding_author_status = BooleanField()
    primary_annotator_status = BooleanField()
    email = StringField()
    affiliation_name = StringField()
    affiliation_address = StringField()
    affiliation_identifier = StringField()


class TiltSeries(Model):
    _gql_type = "tiltseries"

    run = ItemRelationship(Run, "run_id", "id")

    id = IntField()
    run_id = IntField()
    s3_mrc_bin1 = StringField()
    s3_mrc_bin2 = StringField()
    s3_mrc_bin4 = StringField()
    s3_omezarr_dir = StringField()
    https_mrc_bin1 = StringField()
    https_mrc_bin2 = StringField()
    https_mrc_bin4 = StringField()
    https_omezarr_dir = StringField()
    s3_collection_metadata = StringField()
    https_collection_metadata = StringField()
    s3_angle_list = StringField()
    https_angle_list = StringField()
    s3_alignment_file = StringField()
    https_alignment_file = StringField()


# The list relationships are declared here since we have some circular
# relationships and we need all models to be defined before we can have
# them refer to each other.
Dataset.tomograms = ListRelationship(Tomogram, "id", "dataset_id")
Dataset.runs = ListRelationship(Run, "id", "dataset_id")
Dataset.authors = ListRelationship(DatasetAuthor, "id", "dataset_id")
Dataset.funding_sources = ListRelationship(DatasetFunding, "id", "dataset_id")

Run.tomograms = ListRelationship(Tomogram, "id", "run_id")
Run.annotations = ListRelationship(Annotation, "id", "run_id")
Run.tiltseries = ListRelationship(TiltSeries, "id", "run_id")

Annotation.authors = ListRelationship(AnnotationAuthor, "id", "annotation_id")
