from cryoet_data_portal import Client, Dataset, Run


def test_relationships() -> None:
    client = Client()
    datasets = Dataset.find(client)
    dataset_count = 0
    run_count = 0
    tomo_count = 0
    tomo_authors_count = 0
    anno_authors_count = 0
    anno_files_count = 0
    ds_authors_count = 0
    for dataset in datasets:
        dataset_count += 1
        for _ in dataset.authors:
            ds_authors_count += 1
        for run in Run.find(client, [Run.dataset.id == dataset.id]):
            run_count += 1
            assert run.dataset_id == dataset.id
            for vs in run.tomogram_voxel_spacings:
                for anno in vs.annotations:
                    for _ in anno.files:
                        anno_files_count += 1
                    for _ in anno.authors:
                        anno_authors_count += 1
                for tomo in vs.tomograms:
                    tomo_count += 1
                    for _ in tomo.authors:
                        tomo_authors_count += 1
                break
            break
        break
    assert dataset_count > 0
    assert run_count > 0
    assert tomo_count > 0
    assert tomo_authors_count > 0
    assert anno_authors_count > 0
    assert anno_files_count > 0
    assert ds_authors_count > 0
