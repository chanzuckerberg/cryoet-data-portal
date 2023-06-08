from cryoet_data_portal import Client, Run


def test_get_client() -> None:
    client = Client()
    runs = Run.find(client)
    run_count = 0
    for run in runs:
        run_count += 1
        tomo_count = 0
        for _ in run.tomogram_voxel_spacings:
            tomo_count += 1
        assert tomo_count >= 1
    assert run_count >= 1
