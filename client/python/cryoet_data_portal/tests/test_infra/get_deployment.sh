#!/bin/bash
if [ "$1" = 'staging' ]; then
	# If there's a release-please branch, this is the file that controls staging versions!
	RELEASE_SHA=$(curl -s "https://raw.githubusercontent.com/chanzuckerberg/cryoet-data-portal-backend/refs/heads/release-please--branches--main--components--apiv2/.infra/staging/values.yaml" | grep ' tag:' | head -n 1 | awk '{ print $2; }' | cut -d '-' -f 2)
fi
if [ -n "$RELEASE_SHA" ]; then
	echo $RELEASE_SHA
else
	# If this isn't staging, or we don't have an active release-please branch, fetch the appropriate hash from the `main` branch.
	curl -s "https://api.github.com/repos/chanzuckerberg/cryoet-data-portal-backend/commits/main" | grep '"sha":' | head -n 1 | awk -F '"' '{ print $4 }'
fi
