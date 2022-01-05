User documentation
==================

We use reStructuredText for `Sphinx <https://www.sphinx-doc.org/en/master/>`__ to generate the documentation locally
and online on `Read the Docs <https://readthedocs.org/>`__.
To learn more about the syntax, check out this quick reference.

Requirements
  * `Sphinx <https://www.sphinx-doc.org/en/master/>`__
  * `Read the Docs Sphinx Theme <https://github.com/readthedocs/sphinx_rtd_theme>`__

Current working directory: ``nest-desktop/docs``.
To install Sphinx and the Read the Docs theme via ``pip``:

.. code-block:: bash

  python3 -m pip install sphinx sphinx_rtd_theme


**Development: Build HTML locally**

Build a singularity image:

.. code-block:: bash

  singularity build nest-desktop-prod.sif singularity/nest-desktop-prod.def

Build the documentation which your created with Sphinx in the ``docs`` folder offline:

.. code-block:: bash

  rm -r _build/; make html

Start the python server to serve the documentation locally, i.e. available only on your personal machine.

.. code-block:: bash

python3 -m http.server 8002

Then open the URL `http://localhost:8002` with your browser.


**Publication: Push to ReadTheDocs**

The documentation files for the dev branch are automatically rebuilt (and updated)
each time a push is made to the repository.
The docs for other versions depend on the GitHub tags.
The latest tags refers to the latest release version.
