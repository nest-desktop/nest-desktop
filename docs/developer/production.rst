Build and publish package
=========================

.. image:: ../_static/img/logo/pypi-logo-large.svg
  :width: 240px
  :alt: PyPI

|

To build and push NEST Desktop on `PyPI <https://pypi.org/project/nest-desktop/>`__ is a required step for the production.
Then Docker Hub can upgrade NEST Desktop in Docker image.

Requirements
  - setuptools, wheel, twine


The Python Package Index **nest-desktop** includes an executive command ``nest-desktop`` and a Python library ``nest_desktop``.

**Build**

Current work directory is ``nest-desktop``.

The building phase contains two steps:
First build a package of NEST Desktop using ``vue-cli-service``.

Initially, you have to upgrade the version of nest-desktop in:

  - ``packages.json``
  - ``nest_desktop/__init__.py``

Then generate app package using yarn. It builds the folder ``nest_desktop/app``:

.. code-block:: bash

  yarn build


The second step is to build pip package for PyPI:

.. code-block:: bash

  rm -rf build/ dist/ nest_desktop.egg-info/

Then generate distribution packages of `nest-desktop` for PyPI:

.. code-block:: bash

  python3 setup.py sdist bdist_wheel


**Upload**

Finally, the package is ready for the publication.
You can upload pip-package of ``nest-desktop`` to PyPI:

.. code-block:: bash

  python3 -m twine upload dist/*


Do not forget to commit changes and set version tag in git.

.. code-block:: bash

  git tag -a v3.0 -m 'v3.0.0'
  git push --tags
