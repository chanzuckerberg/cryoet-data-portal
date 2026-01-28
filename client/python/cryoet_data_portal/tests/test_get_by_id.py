from cryoet_data_portal import Dataset
from cryoet_data_portal._client import Client
from cryoet_data_portal._models import IdentifiedObject


def test_get_by_id(client: Client) -> None:
    dataset = Dataset.get_by_id(client, 20001)
    assert dataset.id == 20001


def test_identified_object_get_by_id(client: Client) -> None:
    identified_object = IdentifiedObject.get_by_id(client, 30001)
    assert identified_object.id == 30001
    assert identified_object.object_id == "GO:0005840"
    assert identified_object.object_name == "ribosome"
    assert identified_object.object_description == "A large ribonucleoprotein complex"
    assert identified_object.object_state == "assembled"
    assert identified_object.run_id is not None
