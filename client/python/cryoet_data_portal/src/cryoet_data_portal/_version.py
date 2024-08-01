try:
    from importlib import metadata
except ImportError:
    # for python <=3.7
    import importlib_metadata as metadata  # type: ignore[no-redef]

try:
    version = metadata.version("cryoet_data_portal")
except metadata.PackageNotFoundError:
    # package is not installed
    version = "0.0.0-unknown"
