import pytest

from cryoet_data_portal import Run, Tomogram


def test_basic_filters(client) -> None:
    # Make sure we can filter on local and remote fields
    runs = Run.find(client, [Run.name == "RUN1"])
    assert len(runs) == 1
    assert runs[0].name == "RUN1"

    tomograms = Tomogram.find(
        client,
        [Tomogram.tomogram_voxel_spacing.run.name == "RUN1"],
    )
    assert len(tomograms) == 1
    assert tomograms[0].tomogram_voxel_spacing.run.name == "RUN1"


def test_filter_on_object_raises_exceptions(client) -> None:
    # Make sure we can't filter on relationship fields directly
    with pytest.raises(Exception) as exc_info:
        Run.find(client, [Run.tomogram_voxel_spacings.annotations == 20001])
    assert (
        exc_info.value.args[0]
        == '"tomogram_voxel_spacings.annotations" is an object and can\'t be compared directly. Please filter on one of its scalar attributes instead: annotation_method, annotation_publication, annotation_software, confidence_precision, confidence_recall, deposition_date, ground_truth_status, ground_truth_used, https_metadata_path, id, is_curator_recommended, last_modified_date, object_count, object_description, object_id, object_name, object_state, release_date, s3_metadata_path, tomogram_voxel_spacing_id'
    )
    with pytest.raises(Exception) as exc_info:
        Run.find(client, [Run.dataset == 20001])
    assert (
        exc_info.value.args[0]
        == '"dataset" is an object and can\'t be compared directly. Please filter on one of its scalar attributes instead: id, cell_component_id, cell_component_name, cell_name, cell_strain_id, cell_strain_name, cell_type_id, dataset_citations, dataset_publications, deposition_date, description, grid_preparation, https_prefix, key_photo_thumbnail_url, key_photo_url, last_modified_date, organism_name, organism_taxid, other_setup, related_database_entries, related_database_links, release_date, s3_prefix, sample_preparation, sample_type, tissue_id, tissue_name, title'
    )
