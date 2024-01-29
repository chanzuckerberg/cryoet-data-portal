import logging
import os
from typing import Optional
from urllib.parse import urlparse

import boto3
import requests
from botocore import UNSIGNED
from botocore.client import Config
from tqdm import tqdm

logger = logging.getLogger("cryoet-data-portal")


def get_anon_s3_client():
    boto_url = os.getenv("BOTO_ENDPOINT_URL")
    if boto_url:
        # Allow tests to use a signature version other than UNSIGNED due to https://github.com/boto/botocore/issues/2442
        signature_version = os.getenv("BOTO_SIGNATURE_VERSION", UNSIGNED)
        return boto3.client(
            "s3",
            endpoint_url=boto_url,
            config=Config(signature_version=signature_version),
        )

    return boto3.client("s3", config=Config(signature_version=UNSIGNED))


def parse_s3_url(url: str) -> (str, str):
    parsed = urlparse(url)
    return parsed.netloc, parsed.path


def download_https(
    url: str,
    dest_path: Optional[str] = None,
    with_progress: bool = True,
):
    dest_path = get_destination_path(url, dest_path)
    fetch_request = requests.get(url, stream=True)
    total_size = int(fetch_request.headers["content-length"])
    block_size = 1024 * 512
    logger.info("Downloading %s to %s", url, dest_path)
    with tqdm(
        total=total_size,
        unit="iB",
        unit_scale=True,
        disable=(not with_progress),
    ) as progress_bar, open(dest_path, "wb") as f:
        for data in fetch_request.iter_content(block_size):
            progress_bar.update(len(data))
            f.write(data)


def get_destination_path(
    url: str,
    dest_path: Optional[str],
    recursive_from_prefix: Optional[str] = None,
) -> str:
    if not dest_path:
        dest_path = os.getcwd()
    dest_path = os.path.abspath(dest_path)

    if not os.path.isdir(dest_path) and recursive_from_prefix:
        raise ValueError("Recursive downloads require a base directory")

    # If we're downloading recursively, we need to add the dest URL
    # (minus the prefix) to the dest path.
    if not recursive_from_prefix:
        recursive_from_prefix = url[0 : -len(os.path.basename(url))]
    path_suffix = url[len(recursive_from_prefix) :]
    dest_path = os.path.join(dest_path, os.path.dirname(path_suffix))
    if not os.path.isdir(dest_path):
        os.makedirs(dest_path, exist_ok=True)
    dest_path = os.path.join(dest_path, os.path.basename(path_suffix))
    return dest_path


# This requires bucket listing so we'll need to use s3 instead of https
def download_directory(
    s3_url: str,
    recursive_from_prefix: str,
    dest_path: Optional[str] = None,
    with_progress: bool = True,
):
    s3_client = get_anon_s3_client()
    paginator = s3_client.get_paginator("list_objects_v2")
    bucket, path = parse_s3_url(s3_url)
    path = path.lstrip("/")

    total_size = 0
    files = {}
    pages = paginator.paginate(Bucket=bucket, Prefix=path)
    for page in pages:
        for key in page.get("Contents"):
            total_size += key["Size"]
            files[key["Key"]] = key["Size"]

    with tqdm(
        total=total_size,
        unit="iB",
        unit_scale=True,
        disable=(not with_progress),
    ) as progress_bar:
        for key, size in files.items():
            local_file = get_destination_path(
                f"s3://{bucket}/{key}",
                dest_path,
                recursive_from_prefix,
            )
            # Don't re-download files we already have
            if os.path.exists(local_file):
                stats = os.stat(local_file)
                if stats.st_size == size:
                    progress_bar.update(size)
                    continue
            s3_client.download_file(
                bucket,
                key,
                local_file,
                Callback=progress_bar.update,
            )
