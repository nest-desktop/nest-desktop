Build and publish
=================

Currently, we build NEST Desktop for multiple targets and
publish them on various platforms.

.. note::
   Please be aware that a lot of steps are already covered by our `GitLab CI process <continuous-integration.html#gitlab>`__.
   Therefore, we recommend to inspect the ``.gitlab-ci.yml`` file together with this chapter.
   It might also be helpful to have a look at the commands defined in ``package.json``.

|br|

.. _production_python-package-index-pypi:

Python Package Index (PyPI)
---------------------------

.. image:: /_static/img/logo/pypi-logo-large.svg
   :alt: PyPI
   :width: 240px
   :target: #python-package-index-pypi

|br|

Building and pushing NEST Desktop on `PyPI <https://pypi.org/project/nest-desktop/>`__ is a required step for the production.
After that, Docker Hub can upgrade NEST Desktop in the provided Docker image.

Requirements
  - setuptools, wheel, twine


The Python Package Index **nest-desktop** includes an executive command ``nest-desktop`` and a Python library ``nest_desktop``.

Build
^^^^^

The current working directory is ``nest-desktop``.

The building phase contains two steps:
First, build a package of NEST Desktop using ``vue-cli-service``.

Initially, you have to upgrade the version of nest-desktop in:

- ``packages.json``
- ``nest_desktop/__init__.py``

Then generate the app package using ``yarn``. It builds the folder ``nest_desktop/app``:

.. code-block:: bash

   yarn build

The second step is to build a pip package for PyPI:

.. code-block:: bash

   rm -rf build/ dist/ nest_desktop.egg-info/

Then generate the distribution packages of `nest-desktop` for PyPI:

.. code-block:: bash

   python3 setup.py sdist bdist_wheel

|

Upload
^^^^^^

Finally, the package is ready for the the publication.
You can upload the pip-package of ``nest-desktop`` to PyPI:

.. code-block:: bash

   python3 -m twine upload dist/*

Do not forget to commit the changes you made and set a new version tag in git.

.. code-block:: bash

   git tag -a v3.0 -m 'v3.0.0'
   git push --tags

|br|

.. _production_conda:

Conda
-----

We have a conda-smithy `repository for nest-desktop <https://github.com/conda-forge/nest-desktop-feedstock>`__.
When a new Python package is released, we can change the version in ``meta.yaml``
(|see| the meta content `online <https://github.com/conda-forge/nest-desktop-feedstock/blob/main/recipe/meta.yaml>`__):

.. code-block::

   {% set version = "3.1.4" %}

.. note::
   It is also important to change the ``sha256`` checksum of the source of ``tar.gz`` file.

Then make a pull request on the base branch of this repository.

|br|

.. _production_electron-and-snap:

Electron and Snap
-----------------

In ``package.json``, there are also yarn commands configured to build an Electron app.
If you want to build a Snap package, please have a look into ``.gitlab-ci.yml``.

To try Snap on a local machine, you can use this command:

.. code-block:: bash

   snap install ./dist_electron/nest-desktop_x.y.z.snap --dangerous
