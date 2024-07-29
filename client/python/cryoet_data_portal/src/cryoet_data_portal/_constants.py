import sys

import cryoet_data_portal

# added to all http requests to identify the client for analytics
USER_AGENT = {
    "User-agent": ";".join(
        [
            f"python={sys.version_info.major}.{sys.version_info.minor}",
            f"cryoet_data_portal_client={cryoet_data_portal.__version__}",
        ],
    ),
}
