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
from bs4 import BeautifulSoup
from jinja2.filters import FILTERS
import copy

logger = logging.getLogger("sphinx")
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
html_js_files = ["js/faq.js", "js/version_redirect.js"]

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
        "announce.dismiss",
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
    "version_dropdown": True,
    "version_info": [
        {
            "version": "dev", # version number or path
            "title": "Stable (latest)", # title to be displayed in the dropdown
            "aliases": ["stable"], # list of aliases for the version
        },
        {
            "version": "v4.0",
            "title": "v4.0",
            "aliases": [""],
        },
    ],
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


def format_attributes(item):
    """Format attributes in a table instead of a list in API Reference page.

    """
    soup = BeautifulSoup(item, "html.parser")
    classes = soup.find_all("dl", "py class objdesc")

    for c in classes:
        # A class has the following contents:
        # 0 -> '\n'
        # 1 -> <dt class="sig sig-object highlight py" id="cryoet_data_portal.TomogramVoxelSpacing">
        #        <em class="property"><span class="pre">class</span><span class="w"> </span></em><span class="sig-prename descclassname"><span class="pre">cryoet_data_portal.</span></span><span class="sig-name descname"><span class="pre">TomogramVoxelSpacing</span></span><a class="headerlink" href="#cryoet_data_portal.TomogramVoxelSpacing" title="Link to this definition">¶</a></dt>
        # 2 -> '\n'
        # 3 -> <dd><p>Voxel spacings for a run</p>
        #        <dl class="py attribute objdesc"> ... (including methods)
        desc = c.contents[3]
        # Create table structure
        attributes = BeautifulSoup("<div class='attrstable' id='attrstable'></div>", "html.parser")
        attributes.div.append(attributes.new_tag("span", attrs={"class": "doc-section-title"}))
        attributes.div.span.append(attributes.new_tag("b")).append("Attributes:")
        attributes.div.append(attributes.new_tag('table'))
        attributes.div.table["class"] = "docutils field-list attribute-list"
        attributes.div.table.append(soup.new_tag("thead"))
        attributes.div.table.thead.append(soup.new_tag("tr"))
        attributes.div.table.thead.tr.append(soup.new_tag("th")).append("Name")
        attributes.div.table.thead.tr.append(soup.new_tag("th")).append("Type")
        attributes.div.table.thead.tr.append(soup.new_tag("th")).append("Description")
        attributes.div.table.append(soup.new_tag("tbody"))
        # child -> <dl class="py attribute objdesc">...</dl>
        for child in desc.children:
            if child.name=="dl" and "attribute" in child["class"]:
                attr_name = child.dt.span.span
                attr_type = child.dd.dl.dd.p
                attr_type.name = "span"
                attr_type["class"] = "pre"
                attr_desc = child.dd.p
                new_row = attributes.new_tag("tr", attrs={"class": "doc-section-item"})
                new_row.append(attributes.new_tag("td", attrs={"class": "nowrap"})).append(attr_name.wrap(attributes.new_tag("code")))
                new_row.append(attributes.new_tag("td", attrs={"class": "nowrap"})).append(attr_type.wrap(attributes.new_tag("code")))
                new_row.append(attributes.new_tag("td")).append(attr_desc)
                attributes.div.table.tbody.append(new_row)
                if desc.find(id="attrstable"):
                    desc.find(id="attrstable").decompose()
                child.replace_with(copy.copy(attributes.div))
    return str(soup)

FILTERS["format_attributes"] = format_attributes

def html_page_context(app, pagename, templatename, context, doctree):
    """Add custom template for API Reference page.

    Works in conjunction with format_attributes.

    """
    if pagename == "api_reference":
        return "api_template.html"


def setup(app):
    warning_handler, *_ = [
        h for h in logger.handlers
        if isinstance(h, sphinx_logging.WarningStreamHandler)
    ]
    warning_handler.filters.insert(0, FilterSphinxWarnings(app))

    # Docstring styling for Python API
    app.connect("html-page-context", html_page_context)
