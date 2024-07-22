
from datetime import date
from typing import List

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
        authors (List["DatasetAuthor"]): 
        cell_component_id (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        cell_component_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        cell_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        cell_strain_id (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        cell_strain_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        cell_type_id (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        dataset_citations (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        dataset_publications (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        deposition_date (date): None
        description (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        funding_sources (List["DatasetFunding"]): 
        grid_preparation (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_prefix (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        key_photo_thumbnail_url (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        key_photo_url (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        last_modified_date (date): None
        organism_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        organism_taxid (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        other_setup (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        related_database_entries (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        related_database_links (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        release_date (date): None
        runs (List["Run"]): 
        s3_prefix (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        sample_preparation (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        sample_type (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        tissue_id (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        tissue_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        title (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
    """

    _gql_type: str = "datasets"

    authors: List["DatasetAuthor"] = ListRelationship("DatasetAuthor", "id", "datasetauthor_id")
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
    funding_sources: List["DatasetFunding"] = ListRelationship("DatasetFunding", "id", "datasetfunding_id")
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
    runs: List["Run"] = ListRelationship("Run", "id", "run_id")
    s3_prefix: str = StringField()
    sample_preparation: str = StringField()
    sample_type: str = StringField()
    tissue_id: str = StringField()
    tissue_name: str = StringField()
    title: str = StringField()


class DatasetAuthor(Model):
    """Authors of a dataset

    Attributes:
        affiliation_address (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        affiliation_identifier (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        affiliation_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        author_list_order (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        corresponding_author_status (bool): The `Boolean` scalar type represents `true` or `false`.
        dataset (Dataset): Dataset Metadata
        dataset_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        email (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        orcid (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        primary_author_status (bool): The `Boolean` scalar type represents `true` or `false`.
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
        dataset (Dataset): Dataset Metadata
        dataset_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        funding_agency_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        grant_id (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
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
        dataset (Dataset): Dataset Metadata
        dataset_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        https_prefix (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        s3_prefix (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        tiltseries (List["TiltSeries"]): 
        tomogram_voxel_spacings (List["TomogramVoxelSpacing"]): 
    """

    _gql_type: str = "runs"

    dataset: Dataset = ItemRelationship(Dataset, "dataset_id", "id")
    dataset_id: int = IntField()
    https_prefix: str = StringField()
    id: int = IntField()
    name: str = StringField()
    s3_prefix: str = StringField()
    tiltseries: List["TiltSeries"] = ListRelationship("TiltSeries", "id", "tiltseries_id")
    tomogram_voxel_spacings: List["TomogramVoxelSpacing"] = ListRelationship("TomogramVoxelSpacing", "id", "tomogramvoxelspacing_id")


class TomogramVoxelSpacing(Model):
    """The tomograms for each run are grouped by their voxel spacing

    Attributes:
        annotations (List["Annotation"]): 
        https_prefix (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        run (Run): Data related to an experiment run
        run_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        s3_prefix (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        tomograms (List["Tomogram"]): 
        voxel_spacing (float): None
    """

    _gql_type: str = "tomogram_voxel_spacings"

    annotations: List["Annotation"] = ListRelationship("Annotation", "id", "annotation_id")
    https_prefix: str = StringField()
    id: int = IntField()
    run: Run = ItemRelationship(Run, "run_id", "id")
    run_id: int = IntField()
    s3_prefix: str = StringField()
    tomograms: List["Tomogram"] = ListRelationship("Tomogram", "id", "tomogram_id")
    voxel_spacing: float = FloatField()


class Tomogram(Model):
    """information about the tomograms in the CryoET Data Portal

    Attributes:
        affine_transformation_matrix (str): None
        authors (List["TomogramAuthor"]): 
        ctf_corrected (bool): The `Boolean` scalar type represents `true` or `false`.
        deposition_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        fiducial_alignment_status (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_mrc_scale0 (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_omezarr_dir (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        is_canonical (bool): The `Boolean` scalar type represents `true` or `false`.
        key_photo_thumbnail_url (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        key_photo_url (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        neuroglancer_config (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        offset_x (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        offset_y (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        offset_z (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        processing (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        processing_software (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        reconstruction_method (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        reconstruction_software (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        s3_mrc_scale0 (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        s3_omezarr_dir (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        scale0_dimensions (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        scale1_dimensions (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        scale2_dimensions (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        size_x (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        size_y (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        size_z (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        tomogram_version (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        tomogram_voxel_spacing (TomogramVoxelSpacing): The tomograms for each run are grouped by their voxel spacing
        tomogram_voxel_spacing_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        voxel_spacing (float): None
    """

    _gql_type: str = "tomograms"

    affine_transformation_matrix: str = StringField()
    authors: List["TomogramAuthor"] = ListRelationship("TomogramAuthor", "id", "tomogramauthor_id")
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
    tomogram_voxel_spacing: TomogramVoxelSpacing = ItemRelationship(TomogramVoxelSpacing, "tomogramvoxelspacing_id", "id")
    tomogram_voxel_spacing_id: int = IntField()
    voxel_spacing: float = FloatField()


class TomogramAuthor(Model):
    """Authors for a tomogram

    Attributes:
        affiliation_address (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        affiliation_identifier (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        affiliation_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        author_list_order (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        corresponding_author_status (bool): The `Boolean` scalar type represents `true` or `false`.
        email (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        orcid (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        primary_author_status (bool): The `Boolean` scalar type represents `true` or `false`.
        tomogram (Tomogram): information about the tomograms in the CryoET Data Portal
        tomogram_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
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
        annotation_method (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        annotation_publication (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        annotation_software (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        authors (List["AnnotationAuthor"]): 
        confidence_precision (float): None
        confidence_recall (float): None
        deposition_date (date): None
        deposition_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        files (List["AnnotationFile"]): 
        ground_truth_status (bool): The `Boolean` scalar type represents `true` or `false`.
        ground_truth_used (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_metadata_path (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        is_curator_recommended (bool): The `Boolean` scalar type represents `true` or `false`.
        last_modified_date (date): None
        method_type (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        object_count (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        object_description (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        object_id (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        object_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        object_state (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        release_date (date): None
        s3_metadata_path (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        tomogram_voxel_spacing (TomogramVoxelSpacing): The tomograms for each run are grouped by their voxel spacing
        tomogram_voxel_spacing_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
    """

    _gql_type: str = "annotations"

    annotation_method: str = StringField()
    annotation_publication: str = StringField()
    annotation_software: str = StringField()
    authors: List["AnnotationAuthor"] = ListRelationship("AnnotationAuthor", "id", "annotationauthor_id")
    confidence_precision: float = FloatField()
    confidence_recall: float = FloatField()
    deposition_date: date = DateField()
    deposition_id: int = IntField()
    files: List["AnnotationFile"] = ListRelationship("AnnotationFile", "id", "annotationfile_id")
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
    tomogram_voxel_spacing: TomogramVoxelSpacing = ItemRelationship(TomogramVoxelSpacing, "tomogramvoxelspacing_id", "id")
    tomogram_voxel_spacing_id: int = IntField()


class AnnotationFile(Model):
    """Information about associated files for a given annotation

    Attributes:
        annotation (Annotation): Inoformation about annotations for a given run
        annotation_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        format (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_path (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        is_visualization_default (bool): The `Boolean` scalar type represents `true` or `false`.
        s3_path (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        shape_type (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
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


class AnnotationAuthor(Model):
    """Authors for an annotation

    Attributes:
        affiliation_address (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        affiliation_identifier (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        affiliation_name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        annotation (Annotation): Inoformation about annotations for a given run
        annotation_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        author_list_order (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        corresponding_author_status (bool): The `Boolean` scalar type represents `true` or `false`.
        email (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        name (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        orcid (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        primary_annotator_status (bool): The `Boolean` scalar type represents `true` or `false`.
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
        acceleration_voltage (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        aligned_tiltseries_binning (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        binning_from_frames (float): None
        camera_manufacturer (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        camera_model (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        data_acquisition_software (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        frames_count (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        https_alignment_file (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_angle_list (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_collection_metadata (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_mrc_bin1 (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        https_omezarr_dir (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        is_aligned (bool): The `Boolean` scalar type represents `true` or `false`.
        microscope_additional_info (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        microscope_energy_filter (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        microscope_image_corrector (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        microscope_manufacturer (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        microscope_model (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        microscope_phase_plate (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        pixel_spacing (float): None
        related_empiar_entry (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        run (Run): Data related to an experiment run
        run_id (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        s3_alignment_file (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        s3_angle_list (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        s3_collection_metadata (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        s3_mrc_bin1 (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        s3_omezarr_dir (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        spherical_aberration_constant (float): None
        tilt_axis (float): None
        tilt_max (float): None
        tilt_min (float): None
        tilt_range (float): None
        tilt_series_quality (int): The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
        tilt_step (float): None
        tilting_scheme (str): The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
        total_flux (float): None
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