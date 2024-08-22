# Python package release process
To release a new version of python client, merge a pull request to main with change to **./client/python/cryoet-data-portal**. Release-please will automatically create a PR with the a version bump if needed. The name of the PR will be **chore(main): release cryoet-data-portal-python-client vX.X.X**. Here is an [example](https://github.com/chanzuckerberg/cryoet-data-portal/pull/981) of a release PR. Merging the release-please PR will create a new release in github and a new version will be uploaded to pypi. If no changes were made that affect the python client, the python client will not be release. Closing the PR will skip the release of these changes and they will be included in the next release.

If the version number needs to be change see [release-plesae documentation](https://github.com/googleapis/release-please?tab=readme-ov-file#how-do-i-change-the-version-number) for how to change the version number. This same process can be used to manually release the package.

## Build Locally
The python client can be build locally by running the following:
```bash
make build
```

# Manual Release Process
After merging in the release-please PR, if the python package did not release it can be manually release by doing the following:
1. Setup your environment to upload to pypi by following the instructions [here](https://packaging.python.org/en/latest/guides/distributing-packages-using-setuptools/#create-an-account)
2. Pull the latest changes from main
3. Run the following command to release the python client:
```bash
make release/pypi
```
