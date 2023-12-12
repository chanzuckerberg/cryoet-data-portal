from cryoet_data_portal import Client, Dataset, Run


def test_relationships() -> None:
    client = Client()
    datasets = Dataset.find(client, [Dataset.id == 10000])
    ds = next(datasets)
    assert ds
    assert next(ds.authors)
    run = next(Run.find(client, [Run.dataset.id == ds.id]))
    assert run
    assert run.dataset_id == ds.id
    vs = next(run.tomogram_voxel_spacings)
    assert vs
    assert next(run.tiltseries)
    anno = next(vs.annotations)
    assert anno
    assert next(anno.files)
    assert next(anno.authors)
    tomo = next(vs.tomograms)
    assert tomo
    assert next(tomo.authors)


def test_relationships_reverse() -> None:
    client = Client()
    datasets = Dataset.find(client, [Dataset.id == 10000])

    ds = next(datasets)
    ds_author = next(ds.authors)
    run = next(Run.find(client, [Run.dataset.id == ds.id]))
    ts = next(run.tiltseries)
    vs = next(run.tomogram_voxel_spacings)
    anno = next(vs.annotations)
    anno_file = next(anno.files)
    anno_author = next(anno.authors)
    tomo = next(vs.tomograms)
    tomo_author = next(tomo.authors)

    assert tomo_author.tomogram
    assert tomo.tomogram_voxel_spacing
    assert anno_author.annotation
    assert anno_file.annotation
    assert anno.tomogram_voxel_spacing
    assert vs.run
    assert ts.run
    assert ds_author.dataset
    assert run.dataset
