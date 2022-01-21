# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))

# -- Project information -----------------------------------------------------

project = 'NEST Desktop'
copyright = '2021, Sebastian Spreizer'
author = 'Sebastian Spreizer'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

master_doc = 'contents'

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_rtd_theme'

html_theme_options = {
    'logo_only': True,
    'display_version': True,
    'prev_next_buttons_location': 'none',
    'style_external_links': False,
    'style_nav_header_background': '#0F6D99',
    # Toc options
    'collapse_navigation': False,
    'sticky_navigation': True,
    'navigation_depth': 3,
    'includehidden': False,
    'titles_only': False,
    # 'github_url': 'https://github.com/nest-desktop/nest-desktop'
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

if os.environ.get("READTHEDOCS") == "True":
    version = os.environ.get("READTHEDOCS_VERSION")
    if version == "dev":
        rst_prolog = ".. warning:: \n   This version of the documentation is NOT an official release. \
                     You are reading the documentation which is in active and ongoing development. \
                     You can change versions on the bottom left of the screen."

intersphinx_mapping = {
    'nestml': ('https://nestml.readthedocs.io/en/latest/', None),
    'simulator': ('https://nest-simulator.readthedocs.io/en/latest/', None),
}

def setup(app):
  app.add_css_file('css/styles.css')
