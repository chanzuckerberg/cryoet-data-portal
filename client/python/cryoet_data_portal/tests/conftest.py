import pytest

from cryoet_data_portal import Client


@pytest.fixture
def client():
    client = Client("http://localhost:8080/v1/graphql")
    yield client


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--expensive",
        action="store_true",
        dest="expensive",
        default=False,
        help="enable 'expensive' decorated tests",
    )


def pytest_configure(config: pytest.Config) -> None:
    if not config.option.expensive:
        config.option.markexpr = "not expensive"
