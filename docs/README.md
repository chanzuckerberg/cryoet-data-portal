# CryoET Data Portal Documentation

The documentation website is currently hosted on https://chanzuckerberg.github.io/cryoet-data-portal/.

The documentation site is rebuilt each time a tag is created on the repo, which happens on release. This will include the Sphinx website (for the Python API)

A full rebuild can also be triggered manually as the workflow supports `workflow_dispatch`. This should be done if a bug in the documentation is found and a release is not necessary.

## Versioned documentation

To make sure the documentation on the site refers to the correct version of the Portal API, the site is versioned. This
means that the documentation pages contain a version switcher listing the available versions. To add a new version to the
switcher, edit the `version_info` section of the `html_theme_options` config dictionary in `docs/conf.py`. For example,

```python
    "version_info": [
        {
            "version": "dev", # version number or path
            "title": "Stable (latest)", # title to be displayed in the dropdown
            "aliases": ["stable"], # list of aliases for the version; not needed for regular versions, only latest/stable
        },
        # Add new versions here
        {
            "version": "v4.0",
            "title": "v4.0",
            "aliases": [""],
        },
    ],
```

## Branches

Multiple branches are used to manage the documentation:
- `main`: This branch contains the latest version of the documentation. It is automatically deployed to the `dev` folder of the `gh-pages` branch when a new PR is merged. **This is the default version of the documentation**.
- `docs-vX.X`: These branches contain the documentation for the specific version of the API. They are automatically deployed to the `vX.X` folder of the `gh-pages` branch when a new release is made, or manually if the `backport-docs` label is used in a new PR.
- `gh-pages`: This branch contains the generated documentation. It is automatically updated when a new PR is merged to the `main` branch, and needs to be manually updated when the `backport-docs` label is used in a new PR. A symbolic link called `stable` points to the latest version of the documentation, making sure this is the default version of the site.

## Backports

The latest version of the site is automatically generated and deployed to the `gh-pages` branch whenever a PR is merged to the main branch. However, if a bug is found in the documentation for a previous version, the `backport-docs` GitHub label can be used on a pull request or issue to flag the need for a rebuild of the documentation for that version. In that case, the commits associated with the PR will be (manually) cherry-picked to the `docs-vX.X` branch, and the documentation will need to be rebuilt and deployed to the `gh-pages` branch.
