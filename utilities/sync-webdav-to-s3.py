import json
import logging
from concurrent.futures import ProcessPoolExecutor, as_completed
from http.client import HTTPConnection
from urllib.parse import urlparse

import boto3
import botocore
import click
from webdav4.client import Client


@click.group()
@click.option("--debug", is_flag=True, default=False, help="Enable HTTP debugging")
def cli(debug):
    if debug:
        HTTPConnection.debuglevel = 1
        logging.basicConfig()  # you need to initialize logging, otherwise you will not see anything from requests
        logging.getLogger().setLevel(logging.DEBUG)
        requests_log = logging.getLogger("urllib3")
        requests_log.setLevel(logging.DEBUG)
        requests_log.propagate = True


def get_webdav_client(webdav_config_file):
    webdav_settings = json.loads(open(webdav_config_file, "r").read())
    webdav_client = Client(
        f"{webdav_settings['url']}{webdav_settings['path']}",
        headers=webdav_settings["headers"],
        cookies=webdav_settings["cookies"],
    )
    return webdav_client


def sync_file(webdav_config_file, filename, file_size, bucket, s3_key):
    webdav_client = get_webdav_client(webdav_config_file)
    s3_resource = boto3.resource("s3")
    if not s3_resource.meta:
        raise Exception("s3 resource problem")
    print(f"Checking {s3_key} size: {file_size / (1024*1024)}MB", flush=True)
    try:
        objinfo = s3_resource.meta.client.head_object(Bucket=bucket, Key=s3_key)
        if objinfo["ContentLength"] == file_size:
            return f"Skipping {s3_key} / {file_size / (1024 * 1024)}MB"
    except botocore.exceptions.ClientError as error:
        if error.response["Error"]["Code"] == 404:
            pass
    with webdav_client.open(filename, "rb") as buffer:
        print(f"Uploading {s3_key} / {file_size / (1024 * 1024)}MB", flush=True)
        s3_resource.meta.client.upload_fileobj(buffer, Bucket=bucket, Key=s3_key)
        return f"DONE: {s3_key} / {file_size / (1024 * 1024)}MB"


def download_dir(
    workerpool,
    tasks,
    webdav_client,
    webdav_config_file,
    webdav_prefix,
    s3_bucket,
    s3_prefix,
):
    for item in webdav_client.ls(webdav_prefix):
        print(item)
        if item["type"] == "directory":
            download_dir(
                workerpool,
                tasks,
                webdav_client,
                webdav_config_file,
                f"{webdav_prefix}/{item['name']}",
                s3_bucket,
                s3_prefix,
            )
        else:
            s3_key = f"{s3_prefix}/{item['name']}"
            tasks.append(
                workerpool.submit(
                    sync_file,
                    webdav_config_file,
                    item["name"],
                    item["content_length"],
                    s3_bucket,
                    s3_key,
                )
            )


@cli.command()
@click.option(
    "--webdav-config-file",
    required=True,
    type=str,
    default="webdav_settings.json",
    help="Path to webdav source configuration",
)
@click.option(
    "--s3-destination",
    required=True,
    type=str,
    help="S3 destination in the format s3://some-bucket/some/path",
)
@click.option(
    "--parallelism", type=int, default=5, help="How many uploads to run in parallel"
)
def sync(webdav_config_file, s3_destination, parallelism):
    s3_location = urlparse(s3_destination)

    webdav_client = get_webdav_client(webdav_config_file)
    with ProcessPoolExecutor(max_workers=parallelism) as workerpool:
        tasks = []
        download_dir(
            workerpool,
            tasks,
            webdav_client,
            webdav_config_file,
            "",
            s3_location.netloc,
            s3_location.path.strip("/"),
        )
        for taskres in as_completed(tasks):
            print(taskres.result())


if __name__ == "__main__":
    cli()
