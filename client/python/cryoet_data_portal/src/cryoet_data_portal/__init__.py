"""
The Python API client is primarily a GraphQL client that interacts with our
GraphQL API endpoint. Install the `cryoet-data-portal` package to use the
following classes with methods for searching and downloading datasets, tomograms,
annotations and related files and metadata from the portal.
"""

from ._client import Client
from ._models import (
    Alignment,
    Annotation,
    AnnotationAuthor,
    AnnotationFile,
    AnnotationMethodLink,
    AnnotationShape,
    Dataset,
    DatasetAuthor,
    DatasetFunding,
    Deposition,
    DepositionAuthor,
    DepositionType,
    Frame,
    FrameAcquisitionFile,
    GainFile,
    PerSectionAlignmentParameters,
    PerSectionParameters,
    Run,
    TiltSeries,
    Tomogram,
    TomogramAuthor,
    TomogramVoxelSpacing,
)

__version__ = "4.4.1"

__all__ = [
    "Client",
    "Alignment",
    "Annotation",
    "AnnotationAuthor",
    "AnnotationFile",
    "AnnotationMethodLink",
    "AnnotationShape",
    "Dataset",
    "DatasetAuthor",
    "DatasetFunding",
    "Deposition",
    "DepositionAuthor",
    "DepositionType",
    "Frame",
    "FrameAcquisitionFile",
    "GainFile",
    "PerSectionParameters",
    "PerSectionAlignmentParameters",
    "Run",
    "TiltSeries",
    "TomogramAuthor",
    "TomogramVoxelSpacing",
    "Tomogram",
]
