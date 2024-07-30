import sys

from ._version import version

# added to all http requests to identify the client for analytics
USER_AGENT = ";".join(
    [
        f"python={sys.version_info.major}.{sys.version_info.minor}",
        f"cryoet_data_portal_client={version}",
    ],
)
