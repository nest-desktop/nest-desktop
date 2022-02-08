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
author = 'Sebastian Spreizer'
copyright = '2016-2022, Sebastian Spreizer'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.autosectionlabel',
    'sphinx.ext.intersphinx',
]

# Ensure unique targets
autosectionlabel_prefix_document = True

root_doc = 'contents'

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# Include text at the beginning of every file.
if os.environ.get('READTHEDOCS') == 'True':
    version = os.environ.get('READTHEDOCS_VERSION')
    if version == 'dev':
        rst_prolog = '.. warning:: \n   This version of the documentation is NOT an official release. \
                     You are reading the documentation version which is in active and ongoing development. \
                     You can change versions on the bottom left of the screen.'


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_rtd_theme'

html_theme_options = {
    'collapse_navigation': True,
    'display_version': True,
    # 'github_url': 'https://github.com/nest-desktop/nest-desktop',
    'includehidden': False,
    'logo_only': True,
    'navigation_depth': 3,
    'prev_next_buttons_location': 'none',
    'sticky_navigation': True,
    'style_external_links': False,
    'style_nav_header_background': '#fff',
    'titles_only': False,
}

html_logo = '_static/img/logo/nest-desktop-logo.png'
html_favicon = '_static/favicon.ico'

html_css_files = [
    'css/bootstrap.min.css',
    'css/styles.css'
]

html_js_files = [
    'js/bootstrap.min.js',
]

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# add links to modules and objects.
intersphinx_mapping = {
    'nest-simulator': ('https://nest-simulator.readthedocs.io/en/latest/', None),
}
