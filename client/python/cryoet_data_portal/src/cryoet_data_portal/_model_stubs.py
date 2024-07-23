"""Contains model class stubs to define manually maintained methods."""
from __future__ import annotations

import os
from typing import Iterable, Optional

from cryoet_data_portal._file_tools import download_directory, download_https


class Annotation:
    files: Iterable[AnnotationFile]
    https_metadata_path: str

    def download(
        self,
        dest_path: Optional[str] = None,
        format: Optional[str] = None,
        shape: Optional[str] = None,
    ):
        """Download annotation files for a given format and/or shape

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
            shape (Optional[str], optional): Choose a specific shape type to download (e.g.: OrientedPoint, SegmentationMask)
            format (Optional[str], optional): Choose a specific file format to download (e.g.: mrc, ndjson)
        """
        download_metadata = False
        for file in self.files:
            if format and file.format != format:
                continue
            if shape and file.shape_type != shape:
                continue
            file.download(dest_path)
            download_metadata = True
        if download_metadata:
            download_https(self.https_metadata_path, dest_path)


class AnnotationFile:
    format: str
    https_path: str
    s3_path: str
    shape_type: str

    def download(self, dest_path: Optional[str] = None):
        if self.format == "zarr":
            recursive_prefix = "/".join(self.s3_path.split("/")[:-1]) + "/"
            download_directory(self.s3_path, recursive_prefix, dest_path)
        else:
            download_https(self.https_path, dest_path)


class Dataset:
    s3_prefix: str

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this dataset.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        recursive_prefix = "/".join(self.s3_prefix.strip("/").split("/")[:-1]) + "/"
        download_directory(self.s3_prefix, recursive_prefix, dest_path)


class Run:
    s3_prefix: str
    dataset: Dataset

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this run.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_directory(self.s3_prefix, self.dataset.s3_prefix, dest_path)

    def download_frames(self, dest_path: Optional[str] = None):
        download_directory(
            os.path.join(self.s3_prefix, "Frames"),
            self.s3_prefix,
            dest_path,
        )


class TiltSeries:
    https_alignment_file: str
    https_angle_list: str
    https_collection_metadata: str
    https_mrc_bin1: str
    s3_omezarr_dir: str

    def download_collection_metadata(self, dest_path: Optional[str] = None):
        """Download the collection metadata for this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_https(self.https_collection_metadata, dest_path)

    def download_angle_list(self, dest_path: Optional[str] = None):
        """Download the angle list for this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_https(self.https_angle_list, dest_path)

    def download_alignment_file(self, dest_path: Optional[str] = None):
        """Download the alignment file for this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_https(self.https_alignment_file, dest_path)

    def download_omezarr(self, dest_path: Optional[str] = None):
        """Download the omezarr version of this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        recursive_prefix = "/".join(self.s3_omezarr_dir.split("/")[:-1]) + "/"
        download_directory(self.s3_omezarr_dir, recursive_prefix, dest_path)

    def download_mrcfile(
        self,
        dest_path: Optional[str] = None,
    ):
        """Download an MRC file for this tiltseries

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        url = self.https_mrc_bin1
        download_https(url, dest_path)


class Tomogram:
    s3_omezarr_dir: str
    https_mrc_scale0: str
    tomogram_voxel_spacing: TomogramVoxelSpacing

    def download_omezarr(self, dest_path: Optional[str] = None):
        """Download the OME-Zarr version of this tomogram

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        recursive_prefix = "/".join(self.s3_omezarr_dir.split("/")[:-1]) + "/"
        download_directory(self.s3_omezarr_dir, recursive_prefix, dest_path)

    def download_mrcfile(self, dest_path: Optional[str] = None):
        """Download an MRC file of this tomogram

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        url = self.https_mrc_scale0
        download_https(url, dest_path)

    def download_all_annotations(
        self,
        dest_path: Optional[str] = None,
        format: Optional[str] = None,
        shape: Optional[str] = None,
    ):
        """Download all annotation files for this tomogram

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
            shape (Optional[str], optional): Choose a specific shape type to download (e.g.: OrientedPoint, SegmentationMask)
            format (Optional[str], optional): Choose a specific file format to download (e.g.: mrc, ndjson)
        """
        vs = self.tomogram_voxel_spacing
        for anno in vs.annotations:
            anno.download(dest_path, format, shape)


class TomogramVoxelSpacing:
    run: Run
    s3_prefix: str
    annotations: Iterable[Annotation]

    def download_everything(self, dest_path: Optional[str] = None):
        """Download all of the data for this tomogram voxel spacing.

        Args:
            dest_path (Optional[str], optional): Choose a destination directory. Defaults to $CWD.
        """
        download_directory(self.s3_prefix, self.run.s3_prefix, dest_path)
