# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "CryoET Data Portal Documentation"
copyright = "2022-2024 Chan Zuckerberg Initiative"
author = "Chan Zuckerberg Initiative"

import cryoet_data_portal
import logging
from sphinx.util import logging as sphinx_logging

version = cryoet_data_portal.__version__

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.intersphinx",
    "sphinx.ext.napoleon",
    "myst_nb",
    "sphinx_immaterial",
    "sphinx_external_toc",
    "sphinx_design",
]

napoleon_custom_sections = ["Lifecycle"]
autodoc_default_options = {
    "member-order": "alphabetical",
    "exclude-members": "__init__",
}
autodoc_typehints = "none"
autodoc_class_signature = "separated"
autoclass_content = "both"
#autodoc_inherit_docstrings = True

tiledb_version = "latest"

intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "numpy": ("https://numpy.org/doc/stable", None),
    "scipy": ("https://docs.scipy.org/doc/scipy", None),
}

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store", "README.md"]

source_suffix = [".rst", ".md"]

external_toc_path = "_toc.yml"
external_toc_exclude_missing = True

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

# Inject custom css files in `/_static/css/*`
html_static_path = ["_static"]
html_css_files = ["css/custom.css"]
html_js_files = ["js/faq.js"]

html_logo = ""
html_title = "CryoET Data Portal Documentation"
html_favicon = "_static/img/favicon-cryoet-data-portal.png"

html_theme = "sphinx_immaterial"
html_theme_options = {
    "icon": {
        "repo": "fontawesome/brands/github",
        "edit": "material/file-edit-outline",
    },
    "site_url": "https://chanzuckerberg.github.io/cryoet-data-portal",
    "repo_url": "https://github.com/chanzuckerberg/cryoet-data-portal/",
    "repo_name": "CryoET Data Portal Documentation",
    "edit_uri": "blob/main/docs",
    "globaltoc_collapse": False,
    "features": [
        "toc.follow",
        "toc.sticky",
        "navigation.tabs",
        "navigation.tabs.sticky",
    ],
    "palette": [
        {
            "media": "(prefers-color-scheme: light)",
            "scheme": "default",
            "primary": "indigo",
            "accent": "blue",
            "toggle": {
                "icon": "material/lightbulb-outline",
                "name": "Switch to dark mode",
            },
        },
        {
            "media": "(prefers-color-scheme: dark)",
            "scheme": "slate",
            "primary": "indigo",
            "accent": "blue",
            "toggle": {
                "icon": "material/lightbulb",
                "name": "Switch to light mode",
            },
        },
    ],
    "font": {
        "text": "Inter",  # used for all the pages' text
        "code": "Roboto Mono",  # used for literal code blocks
    },
    # "analytics": {"provider": "google", "property": "G-XXXXXXXXXX"},
}

# Remove icons from toc elements in API page
object_description_options = [
    ("py:class", dict(toc_icon_class=None)),
    ("py:parameter", dict(toc_icon_class=None, include_in_toc=False)),
    ("py:method", dict(toc_icon_class=None, include_in_toc=False)),
    ("py:attribute", dict(include_in_toc=False)),
    ("py:.*", dict(include_fields_in_toc=False)),
]

sphinx_immaterial_custom_admonitions = [
    {
        "name": "czi-info",
        "title": "Info",
        "color": "#3867FA",
        "icon": "IconExclamationMarkCircleLarge",
        "override": True,
    },
    {
        "name": "czi-warning",
        "title": "Warning",
        "color": "#F5A623",
        "icon": "IconExclamationMarkCircleLarge",
        "override": True,
    },
]

sphinx_immaterial_icon_path = ["./_static/img"]

# -- Options for myst -------------------------------------------------
myst_enable_extensions = ['colon_fence']
myst_heading_anchors = 4


class FilterSphinxWarnings(logging.Filter):
    """Filter autodoc warning

    autodoc emits the following message on cryoet_data_portal._client.Client:

      Parameter name 'url' does not match any of the parameters defined in the
      signature: []

    The warnings are not useful - they don't result in any missing documentation
    or rendering issues, so we can safely ignore them.

    """

    def __init__(self, app):
        self.app = app
        super().__init__()

    def filter(self, record: logging.LogRecord) -> bool:
        msg = record.getMessage()
        filter_out = "does not match any of the parameters"
        return not (filter_out in msg)


def setup(app):
    logger = logging.getLogger("sphinx")
    warning_handler, *_ = [
        h for h in logger.handlers
        if isinstance(h, sphinx_logging.WarningStreamHandler)
    ]
    warning_handler.filters.insert(0, FilterSphinxWarnings(app))
