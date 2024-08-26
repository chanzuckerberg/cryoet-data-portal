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

version = cryoet_data_portal.__version__

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.intersphinx",
    "sphinx.ext.napoleon",
    "myst_nb",
    "sphinx_immaterial",
]

napoleon_custom_sections = ["Lifecycle"]
autodoc_default_options = {
    "member-order": "alphabetical",
    "exclude-members": "__init__",
}
autodoc_typehints = "none"
autoclass_content = "both"
tiledb_version = "latest"

intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "numpy": ("https://numpy.org/doc/stable", None),
    "scipy": ("https://docs.scipy.org/doc/scipy", None),
}

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store", "README.md"]
autodoc_class_signature = "separated"

source_suffix = [".rst", ".md"]

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

# Inject custom css files in `/_static/css/*`
html_static_path = ["_static"]
html_css_files = ["css/custom.css"]
html_logo = ""
html_title = "CryoET Data Portal Documentation"
html_favicon = "_static/img/favicon-cryoet-data-portal.png"

html_theme = "sphinx_immaterial"
object_description_options = [
    ("py:.*", dict(include_fields_in_toc=False)),
]
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
        #"navigation.expand",
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

extlinks = {
    "CryoET Data Portal": ("https://chanzuckerberg.github.io/cryoet-data-portal/%s", None),
}

# html_js_files = [
#     (
#         "https://plausible.io/js/script.js",
#         {"data-domain": "chanzuckerberg.github.io/cryoet-data-portal", "defer": "defer"},
#     ),
# ]

# -- Options for myst -------------------------------------------------
myst_enable_extensions = ['colon_fence']
myst_heading_anchors = 4
