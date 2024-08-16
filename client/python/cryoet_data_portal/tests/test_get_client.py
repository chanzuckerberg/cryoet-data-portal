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
    assert depo.dataset.pop()
    assert depo.tomograms.pop()
    assert depo.annotations.pop()
    run = Run.find(client, [Run.dataset.id == ds.id]).pop()
    assert run
    assert run.dataset_id == ds.id
    vs = run.tomogram_voxel_spacings.pop()
    assert vs
    assert run.tiltseries.pop()
    anno = vs.annotations.pop()
    assert anno
    assert anno.files.pop()
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
    anno = vs.annotations.pop()
    anno_file = anno.files.pop()
    anno_author = anno.authors.pop()
    tomo = vs.tomograms.pop()
    tomo_author = tomo.authors.pop()

    assert tomo_author.tomogram
    assert tomo.tomogram_voxel_spacing
    assert tomo.deposition
    assert anno_author.annotation
    assert anno_file.annotation
    assert anno.tomogram_voxel_spacing
    assert anno.deposition
    assert vs.run
    assert ts.run
    assert ts.deposition
    assert ds_author.dataset
    assert run.dataset


def test_item_relationship_with_missing_id(client: Client):
    annos = Annotation.find(client, [Annotation.id == 45])

    assert len(annos) == 1
    anno = annos[0]
    assert anno
    assert anno.deposition_id is None
    assert anno.deposition is None
