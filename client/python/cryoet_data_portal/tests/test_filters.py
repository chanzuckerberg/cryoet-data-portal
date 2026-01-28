import pytest

from cryoet_data_portal import Run, Tomogram
from cryoet_data_portal._models import IdentifiedObject


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


def test_filter_merge(client) -> None:
    # Make sure our GQL filters get merged instead of letting the longest-path
    # queries overwrite shorter paths.
    tomograms = Tomogram.find(
        client,
        [
            Tomogram.tomogram_voxel_spacing.run.name == "RUN002",
            Tomogram.tomogram_voxel_spacing.run.dataset.id == 20002,
        ],
    )
    assert len(tomograms) == 1
    assert tomograms[0].tomogram_voxel_spacing.run.name == "RUN002"


def test_filter_on_object_raises_exceptions(client) -> None:
    # Make sure we can't filter on relationship fields directly
    match = "is an object and can't be compared directly."
    with pytest.raises(Exception, match=match):
        Run.find(client, [Run.annotations == 20001])
    with pytest.raises(Exception, match=match):
        Run.find(client, [Run.dataset == 20001])


def test_identified_object_find(client) -> None:
    all_objects = IdentifiedObject.find(client)
    assert len(all_objects) == 3

    ribosomes = IdentifiedObject.find(
        client,
        [IdentifiedObject.object_name == "ribosome"],
    )
    assert len(ribosomes) == 2
    for obj in ribosomes:
        assert obj.object_name == "ribosome"

    go_objects = IdentifiedObject.find(
        client,
        [IdentifiedObject.object_id == "GO:0005739"],
    )
    assert len(go_objects) == 1
    assert go_objects[0].object_name == "mitochondrion"


def test_identified_object_find_with_run_filter(client) -> None:
    run1_objects = IdentifiedObject.find(
        client,
        [IdentifiedObject.run.name == "RUN1"],
    )
    assert len(run1_objects) == 2

    run2_objects = IdentifiedObject.find(
        client,
        [IdentifiedObject.run.name == "RUN2"],
    )
    assert len(run2_objects) == 1
    assert run2_objects[0].object_name == "ribosome"
