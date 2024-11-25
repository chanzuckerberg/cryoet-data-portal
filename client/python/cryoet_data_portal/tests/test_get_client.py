from concurrent.futures import ThreadPoolExecutor

from cryoet_data_portal import Dataset, Run
from cryoet_data_portal._client import Client
from cryoet_data_portal._models import Annotation


def test_relationships(client) -> None:
    datasets = Dataset.find(client, [Dataset.id == 20001])
    ds = datasets.pop()
    assert ds
    assert ds.authors.pop()
    depo = ds.deposition
    assert depo
    assert depo.authors.pop()
    assert depo.datasets.pop()
    assert depo.tomograms.pop()
    assert depo.annotations.pop()
    run = Run.find(client, [Run.dataset.id == ds.id]).pop()
    assert run
    assert run.dataset_id == ds.id
    vs = run.tomogram_voxel_spacings.pop()
    assert vs
    assert run.tiltseries.pop()
    anno = run.annotations.pop()
    assert anno
    shape = anno.annotation_shapes.pop()
    assert shape
    afile = shape.annotation_files.pop()
    assert afile
    assert afile.tomogram_voxel_spacing
    assert anno.authors.pop()
    tomo = vs.tomograms.pop()
    assert tomo
    assert tomo.authors.pop()


def test_relationships_reverse(client) -> None:
    datasets = Dataset.find(client, [Dataset.id == 20001])

    ds = datasets.pop()
    ds_author = ds.authors.pop()
    run = Run.find(client, [Run.dataset.id == ds.id]).pop()
    ts = run.tiltseries.pop()
    vs = run.tomogram_voxel_spacings.pop()
    anno = run.annotations.pop()
    anno_shape = anno.annotation_shapes.pop()
    anno_file = anno_shape.annotation_files.pop()
    anno_author = anno.authors.pop()
    tomo = vs.tomograms.pop()
    tomo_author = tomo.authors.pop()

    assert tomo_author.tomogram
    assert tomo.tomogram_voxel_spacing
    assert tomo.deposition
    assert anno_author.annotation
    assert anno_file.annotation_shape
    assert anno_file.tomogram_voxel_spacing
    assert anno_shape.annotation
    assert anno.deposition
    assert vs.run
    assert ts.run
    assert ts.deposition
    assert ds_author.dataset
    assert run.dataset


def test_correct_number_of_related_objects(client: Client):
    annos = Annotation.find(
        client,
        [Annotation.object_name == "Test Annotation Object Name"],
    )

    assert len(annos) == 1
    assert len(annos[0].annotation_shapes) == 2


def test_item_relationship_with_missing_id(client: Client):
    annos = Annotation.find(
        client,
        [Annotation.object_name == "Test Annotation Object Name"],
    )

    assert len(annos) == 1
    anno = annos[0]
    assert anno
    assert anno.deposition_id is None
    assert anno.deposition is None


# Make sure we can fetch data via a thread pool without errors
def test_thread_safety(client: Client):
    def _make_request(client: Client):
        return Annotation.find(client)

    with ThreadPoolExecutor() as tpe:
        threads = 5
        num_results = 0
        for annos in tpe.map(_make_request, (client,) * threads):
            num_results += 1
            assert len(annos) == 6
        assert num_results == threads
