from ._file_tools import download_directory


def download_everything(self, dest_path: str | None = None):
    """Download all of the data for this dataset.

    Args:
        dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
    """
    recursive_prefix = "/".join(self.s3_prefix.strip("/").split("/")[:-1]) + "/"
    download_directory(self.s3_prefix, recursive_prefix, dest_path)