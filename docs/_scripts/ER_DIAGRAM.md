```mermaid
erDiagram
Dataset {
    string title
    string description
    string organism_name
    integer organism_taxid
    string tissue_name
    BTO_ID tissue_id
    string cell_name
    CL_ID cell_type_id
    string cell_strain_name
    string cell_strain_id
    sample_type_enum sample_type
    string sample_preparation
    string grid_preparation
    string other_setup
    string key_photo_url
    string key_photo_thumbnail_url
    string cell_component_name
    GO_ID cell_component_id
    integer id
    date deposition_date
    date release_date
    date last_modified_date
    DOI_LIST publications
    EMPIAR_EMDB_PDB_LIST related_database_entries
    string related_database_links
    string dataset_citations
    string s3_prefix
    string https_prefix
}
Run {
    string name
    integer id
    string s3_prefix
    string https_prefix
}
Tomogram {
    string name
    float size_x
    float size_y
    float size_z
    float voxel_spacing
    fiducial_alignment_status_enum fiducial_alignment_status
    tomogram_reconstruction_method_enum reconstruction_method
    tomogram_processing_enum processing
    float tomogram_version
    string processing_software
    string reconstruction_software
    boolean is_canonical
    string s3_omezarr_dir
    string https_omezarr_dir
    string s3_mrc_file
    string https_mrc_file
    string scale0_dimensions
    string scale1_dimensions
    string scale2_dimensions
    boolean ctf_corrected
    integer offset_x
    integer offset_y
    integer offset_z
    string key_photo_url
    string key_photo_thumbnail_url
    string neuroglancer_config
    tomogram_type_enum tomogram_type
    boolean is_standardized
    integer id
    string s3_prefix
    string https_prefix
}
Any {

}
TomogramVoxelSpacing {
    float voxel_spacing
    integer id
    string s3_prefix
    string https_prefix
}
AnnotationFile {
    string format
    string s3_path
    string https_path
    boolean is_visualization_default
    annotation_file_source_enum source
    integer id
}
AnnotationShape {
    annotation_file_shape_type_enum shape_type
    integer id
}
Annotation {
    string s3_metadata_path
    string https_metadata_path
    EMPIAR_EMDB_DOI_PDB_LIST annotation_publication
    string annotation_method
    boolean ground_truth_status
    string object_id
    string object_name
    string object_description
    string object_state
    integer object_count
    float confidence_precision
    float confidence_recall
    string ground_truth_used
    string annotation_software
    boolean is_curator_recommended
    annotation_method_type_enum method_type
    string method_links
    integer id
    date deposition_date
    date release_date
    date last_modified_date
}
Deposition {
    TomogramsList tomograms
    string deposition_title
    string deposition_description
    integer id
    DOI_LIST publications
    EMPIAR_EMDB_PDB_LIST related_database_entries
    string related_database_links
    string dataset_citations
    date deposition_date
    date release_date
    date last_modified_date
}
DepositionType {
    deposition_types_enum type
    integer id
}
Tiltseries {
    string s3_omezarr_dir
    string s3_mrc_file
    string https_omezarr_dir
    string https_mrc_file
    string s3_collection_metadata
    string https_collection_metadata
    string s3_angle_list
    string https_angle_list
    string s3_gain_file
    string https_gain_file
    float acceleration_voltage
    float spherical_abberation_constant
    tiltseries_microscope_manufacturer_enum microscope_manufacturer
    string microscope_model
    string microscope_energy_filter
    string microscope_phase_plate
    string microscope_image_corrector
    string microscope_additional_info
    string camera_manufacturer
    string camera_model
    float tilt_min
    float tilt_max
    float tilt_range
    float tilt_step
    string tilting_scheme
    float tilt_axis
    float total_flux
    string data_acquisition_software
    EMPIAR_ID related_empiar_entry
    float binning_from_frames
    integer tilt_series_quality
    boolean is_aligned
    float pixel_spacing
    float aligned_tiltseries_binning
    integer tiltseries_frames_count
    integer id
}
PerSectionParameters {
    integer z_index
    float defocus
    float astigmatism
    float astigmatic_angle
    integer id
}
Frame {
    float raw_angle
    integer acquisition_order
    float dose
    boolean is_gain_corrected
    string s3_gain_file
    string https_gain_file
    integer id
    string s3_prefix
    string https_prefix
}
Alignment {
    string alignment
    alignment_type_enum alignment_type
    float volume_x_dimension
    float volume_y_dimension
    float volume_z_dimension
    float volume_x_offset
    float volume_y_offset
    float volume_z_offset
    float volume_x_rotation
    float tilt_offset
    string local_alignment_file
    integer id
}
PerSectionAlignmentParameters {
    integer z_index
    float x_offset
    float y_offset
    float in_plane_rotation
    float beam_tilt
    float tilt_angle
    integer id
}
DepositionAuthor {
    integer id
    integer author_list_order
    ORCID orcid
    string name
    string email
    string affiliation_name
    string affiliation_address
    string affiliation_identifier
    boolean corresponding_author_status
    boolean primary_author_status
}
AnnotationAuthor {
    integer id
    integer author_list_order
    ORCID orcid
    string name
    string email
    string affiliation_name
    string affiliation_address
    string affiliation_identifier
    boolean corresponding_author_status
    boolean primary_author_status
}
TomogramAuthor {
    integer id
    integer author_list_order
    ORCID orcid
    string name
    string email
    string affiliation_name
    string affiliation_address
    string affiliation_identifier
    boolean corresponding_author_status
    boolean primary_author_status
}
DatasetAuthor {
    integer id
    integer author_list_order
    ORCID orcid
    string name
    string email
    string affiliation_name
    string affiliation_address
    string affiliation_identifier
    boolean corresponding_author_status
    boolean primary_author_status
}
DatasetFunding {
    string funding_agency_name
    string grant_id
    integer id
}

Dataset ||--|o Deposition : "deposition"
Dataset ||--}o DatasetFunding : "funding_sources"
Dataset ||--}o DatasetAuthor : "authors"
Dataset ||--}o Run : "runs"
Run ||--}o Alignment : "alignments"
Run ||--}o Annotation : "annotations"
Run ||--|| Dataset : "dataset"
Run ||--}o Frame : "frames"
Run ||--}o Tiltseries : "tiltseries"
Run ||--}o TomogramVoxelSpacing : "tomogram_voxel_spacings"
Run ||--}o Tomogram : "tomograms"
Tomogram ||--|o Alignment : "alignment"
Tomogram ||--}o TomogramAuthor : "authors"
Tomogram ||--|o Deposition : "deposition"
Tomogram ||--|o Run : "run"
Tomogram ||--|o TomogramVoxelSpacing : "tomogram_voxel_spacing"
Tomogram ||--|o Any : "affine_transformation_matrix"
TomogramVoxelSpacing ||--}o AnnotationFile : "annotation_files"
TomogramVoxelSpacing ||--|o Run : "run"
TomogramVoxelSpacing ||--}o Tomogram : "tomograms"
AnnotationFile ||--|o Alignment : "alignment"
AnnotationFile ||--|o AnnotationShape : "annotation_shape"
AnnotationFile ||--|o TomogramVoxelSpacing : "tomogram_voxel_spacing"
AnnotationShape ||--|o Annotation : "annotation"
AnnotationShape ||--}o AnnotationFile : "annotation_files"
Annotation ||--|o Run : "run"
Annotation ||--}o AnnotationShape : "annotation_shapes"
Annotation ||--}o AnnotationAuthor : "authors"
Annotation ||--|o Deposition : "deposition"
Deposition ||--}o DepositionAuthor : "authors"
Deposition ||--}o Alignment : "alignments"
Deposition ||--}o Annotation : "annotations"
Deposition ||--}o Dataset : "datasets"
Deposition ||--}o Frame : "frames"
Deposition ||--}o Tiltseries : "tiltseries"
Deposition ||--}o DepositionType : "deposition_types"
DepositionType ||--|o Deposition : "deposition"
Tiltseries ||--}o Alignment : "alignments"
Tiltseries ||--}o PerSectionParameters : "per_section_parameters"
Tiltseries ||--|| Run : "run"
Tiltseries ||--|o Deposition : "deposition"
PerSectionParameters ||--|| Frame : "frame"
PerSectionParameters ||--|| Tiltseries : "tiltseries"
Frame ||--|o Deposition : "deposition"
Frame ||--}o PerSectionParameters : "per_section_parameters"
Frame ||--|o Run : "run"
Alignment ||--}o AnnotationFile : "annotation_files"
Alignment ||--}o PerSectionAlignmentParameters : "per_section_alignments"
Alignment ||--|o Deposition : "deposition"
Alignment ||--|o Tiltseries : "tiltseries"
Alignment ||--}o Tomogram : "tomograms"
Alignment ||--|o Run : "run"
PerSectionAlignmentParameters ||--|| Alignment : "alignment"
DepositionAuthor ||--|o Deposition : "deposition"
AnnotationAuthor ||--|o Annotation : "annotation"
TomogramAuthor ||--|o Tomogram : "tomogram"
DatasetAuthor ||--|o Dataset : "dataset"
DatasetFunding ||--|o Dataset : "dataset"

```
