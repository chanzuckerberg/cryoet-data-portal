# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "cryoet-data-portal"
copyright = "2022-2023 Chan Zuckerberg Initiative"
author = "Chan Zuckerberg Initiative"

import cryoet_data_portal

version = cryoet_data_portal.__version__

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx.ext.autodoc",
    "nbsphinx",
    "sphinx.ext.intersphinx",
    "sphinx.ext.napoleon",
    "myst_parser",
    "sphinx_toolbox.collapse"
]

napoleon_custom_sections = ["Lifecycle"]

tiledb_version = "latest"

intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "numpy": ("http://docs.scipy.org/doc/numpy", None),
    "scipy": ("http://docs.scipy.org/doc/scipy/reference", None),
}

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

source_suffix = [".rst", ".md"]


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

# html_theme = 'alabaster'
# Inject custom css files in `/_static/css/*`
html_static_path = ["_static"]

import sphinx_rtd_theme

html_theme = "sphinx_rtd_theme"
html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]

html_js_files = [
    (
        "https://plausible.io/js/script.js",
        {"data-domain": "chanzuckerberg.github.io/cryoet-data-portal", "defer": "defer"},
    ),
]

# -- Options for myst -------------------------------------------------
myst_enable_extensions = ['colon_fence']


def setup(app):
    app.add_css_file("css/custom.css")
