============
NEST Desktop
============


.. image:: ./_static/img/logo/nest-desktop-logo.png
  :align: right
  :alt: NEST Desktop

|

Hello there! :-)

NEST Desktop is a web-based GUI application for NEST Simulator,
an advanced simulation tool for the computational neuroscience.

The app enables the rapid construction, parametrization,
and instrumentation of neuronal network models.

|

It's so great that you want to use NEST Desktop!

||||


.. _first-steps:

First steps
-----------

The video shows the few steps to construct a network and explore its activity.
For more information, please read :doc:`detailed guides of usage </user/usage>`.

.. raw:: html

   <div class="iframe-container">
      <iframe src="https://drive.ebrains.eu/f/157fc20ea0734e21aa2e/?raw=1" frameborder="0" allowfullscreen></iframe>
   </div>

||||

|

.. _getting-started-in-terminal-with-docker-compose:

Start from a terminal using Docker-compose
------------------------------------------

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml
   docker-compose up --build

For more information, please read the :doc:`detailed setup guides </user/setup>`.


||||

|

Content structure
^^^^^^^^^^^^^^^^^

The documentation is organized in four sections.
Select the appropriate section that fits your needs.

:The user: ... learns how to build networks, parameterize nodes and links,
  and perform simulations on the graphical interface.

:The lecturer: ... learns how to teach computational neuroscience using NEST Desktop.

:The deployer: ... learns how to set up NEST Desktop on a machine via Python Package,
  Docker or Singularity installation.

:The developer: ... learns the source code architecture of NEST Desktop and
  how to contribute code or enhancements to the project.


||||

|

Version info
^^^^^^^^^^^^

On ReadTheDocs, it is possible to select versions of this documentation.
These versions basically relate to the program versions (as found in the GitHub repository).
This can be noticed when clicking on the "Edit on GitHub" text at the top right.

Since the changes between patch level versions (e.g. 3.0.0 and 3.0.1) are usually not noticeable,
we show a single branch for the recent minor version releases (e.g. '3.0' for all 3.0.x releases).
This branch contains all patch releases and always points to the latest patch release of that release branch.
Please keep this in mind when searching for information on a specific version of NEST Desktop!

||||

:General: |docs| |license| |doi|
:Docker Hub: |dockerhub-version| |dockerhub-image-size| |dockerhub-pulls|
:GitHub: |github-commit-activitiy| |github-stars| |github-forks|
:PyPI: |pypi-version| |pypi-dm|

.. |docs| image:: https://img.shields.io/readthedocs/nest-desktop
  :alt: Documentation Status
  :target: https://nest-desktop.readthedocs.io

.. |license| image:: https://img.shields.io/github/license/nest-desktop/nest-desktop
  :alt: License
  :target: https://github.com/nest-desktop/nest-desktop/blob/main/LICENSE

.. |doi| image:: https://img.shields.io/badge/DOI-10.1523%2Feneuro.0274--21.2021-blue
  :alt: DOI
  :target: https://doi.org/10.1523/eneuro.0274-21.2021

.. |dockerhub-version| image:: https://img.shields.io/docker/v/nestsim/nest-desktop/latest
  :target: https://hub.docker.com/r/nestsim/nest-desktop
  :alt: Latest version

.. |dockerhub-image-size| image:: https://img.shields.io/docker/image-size/nestsim/nest-desktop/latest
  :alt: Image size
  :target: https://hub.docker.com/r/nestsim/nest-desktop

.. |dockerhub-pulls| image:: https://img.shields.io/docker/pulls/nestsim/nest-desktop
  :alt: Docker pulls
  :target: https://hub.docker.com/r/nestsim/nest-desktop

.. |github-commit-activitiy| image:: https://img.shields.io/github/commit-activity/m/nest-desktop/nest-desktop
  :alt: GitHub repository commit activity
  :target: https://github.com/nest-desktop/nest-desktop/commits/main

.. |github-stars| image:: https://img.shields.io/github/stars/nest-desktop/nest-desktop?style=social
  :alt: GitHub repository stars
  :target: https://github.com/nest-desktop/nest-desktop/stargazers

.. |github-forks| image:: https://img.shields.io/github/forks/nest-desktop/nest-desktop?style=social
  :alt: GitHub repository forks
  :target: https://github.com/nest-desktop/nest-desktop/network/members

.. |pypi-version| image:: https://img.shields.io/pypi/v/nest-desktop.svg?label=version
  :alt: Latest PyPI version
  :target: https://pypi.org/project/nest-desktop/

.. |pypi-dm| image:: https://img.shields.io/pypi/dm/nest-desktop.svg
  :alt: Number of PyPI downloads
  :target: https://pypi.org/project/nest-desktop/


.. include:: contents.rst
