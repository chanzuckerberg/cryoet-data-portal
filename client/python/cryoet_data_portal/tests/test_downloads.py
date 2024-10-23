import os
import tempfile

import pytest

from cryoet_data_portal import (
    Annotation,
    Dataset,
    Run,
    TiltSeries,
    Tomogram,
    TomogramVoxelSpacing,
)


@pytest.fixture
def tmp_dir():
    with tempfile.TemporaryDirectory() as tmpdirname:
        yield tmpdirname


def test_download_annotations(tmp_dir, client) -> None:
    """download a single annotation file for a dataset, using format/shape filters"""
    annos = Annotation.find(
        client,
        [
            Annotation.run.name == "RUN2",
            Annotation.object_name.ilike("%ribosome%"),
        ],
    )
    anno = annos[0]
    assert anno
    anno.download(tmp_dir, "ndjson", "OrientedPoint")
    files = os.listdir(tmp_dir)
    assert set(files) == {"author2-ribosome-1.0.json", "ribosome.ndjson"}


def test_download_tomo_annotations_with_shape_filter(tmp_dir, client) -> None:
    """Make sure downloading annotations for a specific shape type doesn't download"""
    """metadata for other annotations without this shape type"""
    tomo = Tomogram.find(
        client,
        [
            Tomogram.run.name == "RUN1",
        ],
    )[0]
    assert tomo
    tomo.download_all_annotations(dest_path=tmp_dir, format="ndjson", shape="Point")
    files = os.listdir(tmp_dir)
    assert set(files) == {"ribosome.ndjson", "author1-ribosome-1.0.json"}


def test_download_all_annotations_including_zarr(tmp_dir, client) -> None:
    """Download all files for a particular annotation. Using ds 20001 because it has a zarr."""
    anno = Annotation.find(
        client,
        [
            Annotation.run.dataset_id == 20001,
            Annotation.run.name == "RUN1",
            Annotation.object_name == "Test Annotation Object Name",
        ],
    )[0]
    assert anno
    anno.download(tmp_dir)
    files = os.listdir(tmp_dir)
    assert set(files) == {
        "mitochondria.mrc",
        "mitochondria.zarr",
        "mitochondria.ndjson",
        "author1-mitochondria-1.0.json",
    }
    assert os.path.exists(os.path.join(tmp_dir, "mitochondria.zarr/0"))


def test_download_relative_path(tmp_dir, client) -> None:
    """Download files to a *relative path*"""
    # Change the process' CWD to the tmp dir
    os.chdir(tmp_dir)
    subdir_name = "my_test_subdir"
    dest_dir = os.path.join(tmp_dir, subdir_name)
    os.makedirs(dest_dir)
    tomo = Tomogram.find(
        client,
        [
            Tomogram.run.dataset_id == 20001,
            Tomogram.run.name == "RUN2",
        ],
    )[0]
    assert tomo
    tomo.download_all_annotations(subdir_name)
    files = os.listdir(dest_dir)
    assert set(files) == {
        "author2-ribosome-1.0.json",
        "ribosome.mrc",
        "ribosome.ndjson",
        "ribosome.zarr",
    }


def test_download_without_path(tmp_dir, client) -> None:
    """Download files *without specifying a path* (should default to CWD)"""
    # Change the process' CWD to the tmp dir
    os.chdir(tmp_dir)
    tomo = Tomogram.find(
        client,
        [
            Tomogram.run.dataset_id == 20001,
            Tomogram.run.name == "RUN2",
        ],
    )[0]
    assert tomo
    tomo.download_all_annotations(format="ndjson")
    files = os.listdir(tmp_dir)
    assert set(files) == {
        "author2-ribosome-1.0.json",
        "ribosome.ndjson",
    }


def test_download_default_dir(tmp_dir, client) -> None:
    """Download files with no dest dir specified (defaults to CWD)"""
    # Change the process' CWD to the tmp dir
    os.chdir(tmp_dir)
    tomo = Tomogram.find(
        client,
        [Tomogram.run.name == "RUN2"],
    )[0]
    assert tomo
    tomo.download_all_annotations(None, "ndjson")
    files = os.listdir(tmp_dir)
    assert set(files) == {"author2-ribosome-1.0.json", "ribosome.ndjson"}


def test_tiltseries_downloaders(tmp_dir, client):
    ts = TiltSeries.find(client, [TiltSeries.run.name == "RUN1"])[0]
    assert ts
    ts.download_angle_list(tmp_dir)
    ts.download_omezarr(tmp_dir)
    ts.download_mrcfile(tmp_dir)
    files = os.listdir(tmp_dir)
    assert set(files) == {
        "RUN1.rawtlt",
        "RUN1_bin1.mrc",
        "RUN1.zarr",
    }
    assert os.path.exists(os.path.join(tmp_dir, "RUN1.zarr/0/zarr_file2"))


def test_dataset_downloaders(tmp_dir, client):
    ds = Dataset.find(client, [Dataset.id == 20001])[0]
    assert ds
    ds.download_everything(tmp_dir)
    files = os.listdir(tmp_dir)
    assert files == ["20001"]
    assert os.path.exists(
        os.path.join(
            tmp_dir,
            "20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.mrc",
        ),
    )


def test_run_downloaders(tmp_dir, client):
    run = Run.find(client, [Run.name == "RUN1"])[0]
    assert run
    run.download_everything(tmp_dir)
    run.download_frames(tmp_dir)
    files = os.listdir(os.path.join(tmp_dir, "Frames"))
    assert files == ["frame1"]


def test_tvs_download(tmp_dir, client):
    tvs = TomogramVoxelSpacing.find(
        client,
        [
            TomogramVoxelSpacing.run.name == "RUN2",
        ],
    )[0]
    assert tvs
    tvs.download_everything(tmp_dir)
    files = os.listdir(tmp_dir)
    assert set(files) == {"TomogramVoxelSpacing7.56"}
    assert os.path.exists(
        os.path.join(tmp_dir, "TomogramVoxelSpacing7.56/Annotations/ribosome.ndjson"),
    )


def test_tomogram_download(tmp_dir, client):
    tomo = Tomogram.find(
        client,
        [
            Tomogram.run.name == "RUN2",
            Tomogram.run.dataset_id == 20001,
        ],
    )[0]
    assert tomo
    tomo.download_omezarr(tmp_dir)
    tomo.download_mrcfile(tmp_dir)
    files = os.listdir(tmp_dir)
    assert set(files) == {"RUN2.mrc", "RUN2.zarr"}
    assert os.path.exists(os.path.join(tmp_dir, "RUN2.zarr/0/zarr_file2"))
