"""
An API client library to facilitate use of the Cryo-Electron Tomography portal API. The Portal is a collection of high quality tomograms and metadata.

For more information on the API, visit the [cryoet-data-portal repo](https://github.com/chanzuckerberg/cryoet-data-portal/)
"""

try:
    from importlib import metadata
except ImportError:
    # for python <=3.7
    import importlib_metadata as metadata  # type: ignore[no-redef]

from ._client import Client
from ._models import (
    Annotation,
    AnnotationAuthor,
    AnnotationFile,
    Dataset,
    DatasetAuthor,
    DatasetFunding,
    Run,
    TiltSeries,
    Tomogram,
    TomogramAuthor,
    TomogramVoxelSpacing,
)

try:
    __version__ = metadata.version("cryoet_data_portal")
except metadata.PackageNotFoundError:
    # package is not installed
    __version__ = "0.0.0-unknown"

__all__ = [
    "Client",
    "Annotation",
    "AnnotationFile",
    "AnnotationAuthor",
    "Dataset",
    "DatasetAuthor",
    "DatasetFunding",
    "Run",
    "TiltSeries",
    "Tomogram",
    "TomogramAuthor",
    "TomogramVoxelSpacing",
]
