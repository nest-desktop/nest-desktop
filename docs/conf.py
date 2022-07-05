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

import sphinx_material

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

# root_doc = 'contents'

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

extensions.append("sphinx_material")

html_context = sphinx_material.get_html_context()

html_css_files = [
    'css/styles.css'
]

html_logo = '_static/img/logo/nest-desktop-logo.png'
html_favicon = '_static/favicon.ico'


html_js_files = []

html_show_sourcelink = False

html_sidebars = {
    "**": ["logo-text.html", "globaltoc.html", "localtoc.html", "searchbox.html"]
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

html_theme = 'sphinx_material'

html_theme_options = {
    'base_url': 'https://nest-desktop.readthedocs.io/en/latest/',
    'color_primary': 'deep-orange',
    'color_accent': 'white',
    'css_minify': False,
    'globaltoc_collapse': True,
    'globaltoc_depth': 1,
    'globaltoc_includehidden': True,
    'html_minify': False,
    'html_prettify': True,
    "master_doc": False,
    "nav_links": [
        {
            "href": "user/index",
            "internal": True,
            "title": "User",
        },
        {
            "href": "lecturer/index",
            "internal": True,
            "title": "Lecturer",
        },
        {
            "href": "deployer/index",
            "internal": True,
            "title": "Deployer",
        },
        {
            "href": "developer/index",
            "internal": True,
            "title": "Developer",
        },
        {},
        {},
        {
            "href": "https://nest-simulator.readthedocs.io/",
            "internal": False,
            "title": "NEST Simulator",
        },
    ],
    'nav_title': 'NEST Desktop',
    'repo_name': 'Edit on GitHub',
    'repo_url': 'https://github.com/nest-desktop/nest-desktop/',
    'theme_color': 'ff6633',
    "version_dropdown": True,
}

html_theme_path = sphinx_material.html_theme_path()

# add links to modules and objects.
intersphinx_mapping = {
    'nest-simulator': ('https://nest-simulator.readthedocs.io/en/latest/', None),
}
