import os
from pathlib import Path
from unittest.mock import patch

import pytest

from cryoet_data_portal._file_tools import get_destination_path


class TestGetDestinationPath:
    def test_url(self, tmp_path) -> None:
        with patch("cryoet_data_portal._file_tools.os.getcwd", return_value=tmp_path):
            url = "https://example.com/file.txt"
            expected = os.path.join(tmp_path, "file.txt")
            assert get_destination_path(url, None) == expected

    def test_dest_path_exists(self, tmp_path) -> None:
        url = "https://example.com/file.txt"
        dest_path = os.path.join(tmp_path, "my_dest")
        os.makedirs(dest_path)
        expected = os.path.join(dest_path, "file.txt")
        assert get_destination_path(url, dest_path) == expected

    def test_dest_path_does_not_exist(self, tmp_path) -> None:
        """Test that the destination path is created if it does not exist"""
        url = "https://example.com/file.txt"
        dest_path = os.path.join(tmp_path, "my_dest")
        expected = os.path.join(dest_path, "file.txt")
        assert get_destination_path(url, dest_path) == expected
        assert os.path.isdir(dest_path)

    def test_recursive_from_prefix_where_dest_path_exist(self, tmp_path) -> None:
        """Test when a recursive_from_prefix is provided and the dest_path exists"""
        url = "https://example.com/a/file.txt"
        dest_path = os.path.join(tmp_path, "my_dest")
        os.makedirs(dest_path)
        recursive_from_prefix = "https://example.com/"
        expected = os.path.join(dest_path, "a", "file.txt")
        assert get_destination_path(url, dest_path, recursive_from_prefix) == expected

    def test_recursive_from_prefix_where_dest_path_does_not_exist(
        self,
        tmp_path,
    ) -> None:
        """Test when a recursive_from_prefix is provided and the dest_path does not exist. The dest_path should be created."""
        url = "https://example.com/a/b/file.txt"
        dest_path = os.path.join(tmp_path, "my_dest")
        recursive_from_prefix = "https://example.com/"
        expected_path = os.path.join(dest_path, "a", "b")
        expected = os.path.join(dest_path, "a", "b", "file.txt")
        assert get_destination_path(url, dest_path, recursive_from_prefix) == expected
        assert os.path.isdir(expected_path)

    def test_invalid_dest_path(
        self,
        tmp_path,
    ) -> None:
        url = "https://example.com/file.txt"
        dest_path = os.path.join(tmp_path, "\000")
        recursive_from_prefix = "https://example.com/"
        with pytest.raises(ValueError):
            get_destination_path(url, dest_path, recursive_from_prefix)

    def test_dest_path_is_existing_file(self, tmp_path) -> None:
        """Test that an error is raised if the dest_path is an existing file"""
        url = "https://example.com/file.txt"
        dest_path = os.path.join(tmp_path, "test.txt")
        Path(dest_path).touch()
        with pytest.raises(ValueError):
            get_destination_path(url, dest_path)
