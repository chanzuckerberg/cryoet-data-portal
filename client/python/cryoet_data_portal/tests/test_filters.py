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


def test_filter_merge(client) -> None:
    # Make sure our GQL filters get merged instead of letting the longest-path
    # queries overwrite shorter paths.
    runs = Run.find(client, [Run.name == "RUN1"])
    assert len(runs) == 1
    assert runs[0].name == "RUN1"

    tomograms = Tomogram.find(
        client,
        [
            Tomogram.tomogram_voxel_spacing.run.name == "RUN001",
            Tomogram.tomogram_voxel_spacing.run.dataset.id == 20002,
        ],
    )
    assert len(tomograms) == 1
    assert tomograms[0].tomogram_voxel_spacing.run.name == "RUN001"


def test_filter_on_object_raises_exceptions(client) -> None:
    # Make sure we can't filter on relationship fields directly
    match = "is an object and can't be compared directly."
    with pytest.raises(Exception, match=match):
        Run.find(client, [Run.annotations == 20001])
    with pytest.raises(Exception, match=match):
        Run.find(client, [Run.dataset == 20001])
