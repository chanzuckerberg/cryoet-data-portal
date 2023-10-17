import ftplib
import json
import logging
from concurrent.futures import ProcessPoolExecutor, as_completed
from http.client import HTTPConnection
from urllib.parse import urlparse
from urllib.request import urlopen

import boto3
import botocore
import click


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


def get_ftp_client(ftp_server):
    ftp_client = ftplib.FTP(ftp_server)
    ftp_client.login()
    return ftp_client


def sync_file(ftp_server, filename, file_size, bucket, s3_key):
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
    # NOTE / TODO: We're cheating here because empiar gives us an HTTPS and FTP
    # endpoint with the same name, and since the FTP server is often overloaded
    # we're downloading files via HTTPS and listing them via FTP.
    with urlopen(f"https://{ftp_server}{filename}") as buffer:
        print(f"Uploading {s3_key} / {file_size / (1024 * 1024)}MB", flush=True)
        s3_resource.meta.client.upload_fileobj(buffer, Bucket=bucket, Key=s3_key)
        print(f"DONE: {s3_key} / {file_size / (1024 * 1024)}MB", flush=True)
        return f"DONE: {s3_key} / {file_size / (1024 * 1024)}MB"


def download_dir(
    workerpool,
    tasks,
    ftp_server,
    ftp_prefix,
    ftp_path,
    s3_bucket,
    s3_prefix,
):
    files = []

    ftp_client = get_ftp_client(ftp_server)
    try:
        ftp_client.retrlines(f"LIST {ftp_path}", files.append)
    except ftplib.error_perm as resp:
        if str(resp) == "550 No files found":
            print("No files in this directory")
        else:
            raise

    for f in files:
        (mode, _, _, _, size, _, _, _, fname) = f.split()
        ftp_file = f"{ftp_path}/{fname}"
        if mode.startswith("d"):
            download_dir(
                workerpool,
                tasks,
                ftp_server,
                ftp_prefix,
                ftp_file,
                s3_bucket,
                s3_prefix,
            )
        else:
            s3_key = f"{s3_prefix}{ftp_file[len(ftp_prefix):]}"
            tasks.append(
                workerpool.submit(
                    sync_file,
                    ftp_server,
                    ftp_file,
                    int(size),
                    s3_bucket,
                    s3_key,
                )
            )


@cli.command()
@click.option("--ftp-server", required=True, type=str, help="FTP server hostname")
@click.option("--ftp-path", required=True, type=str, help="FTP path to sync")
@click.option(
    "--s3-destination",
    required=True,
    type=str,
    help="S3 destination in the format s3://some-bucket/some/path",
)
@click.option(
    "--parallelism", type=int, default=5, help="How many uploads to run in parallel"
)
def sync(ftp_server, ftp_path, s3_destination, parallelism):
    s3_location = urlparse(s3_destination)

    ftp_client = get_ftp_client(ftp_server)
    with ProcessPoolExecutor(max_workers=parallelism) as workerpool:
        tasks = []
        download_dir(
            workerpool,
            tasks,
            ftp_server,
            ftp_path,
            ftp_path,
            s3_location.netloc,
            s3_location.path.strip("/"),
        )
        for taskres in as_completed(tasks):
            print(taskres.result())


if __name__ == "__main__":
    cli()
