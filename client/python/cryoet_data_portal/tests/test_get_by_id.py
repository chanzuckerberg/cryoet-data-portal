from cryoet_data_portal import Dataset
from cryoet_data_portal._client import Client


def test_get_by_id(client: Client) -> None:
    dataset = Dataset.get_by_id(client, 20001)
    assert dataset.id == 20001
