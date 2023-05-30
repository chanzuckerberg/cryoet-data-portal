from cryoet_data_portal._client import get_client


def test_get_client() -> None:
    assert get_client() is True
