User documentation
==================

We use reStructuredText for `Sphinx <https://www.sphinx-doc.org/en/master/>`__
to generate the documentation locally and online on `Read the Docs <https://readthedocs.org/>`__.
To learn more about the syntax, check out `this quick reference <https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html>`__.
Please have a look at the `coding conventions <coding-conventions.html>`__, too.

Requirements
   - `Sphinx <https://www.sphinx-doc.org/en/master/>`__
   - `Material Design Theme for Sphinx <https://bashtage.github.io/sphinx-material/>`__

Use the working directory: ``nest-desktop/docs``.
To install Sphinx and the Read the Docs theme via ``pip``:

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docs/requirements.txt
   python3 -m pip install -r requirements.txt

|

.. _documentation_development-build-html-locally:

Development: Build HTML locally
-------------------------------

Build the documentation which your created with Sphinx in the ``docs`` folder offline:

.. code-block:: bash

   make clean; make html

Start the Python server to serve the documentation locally,
i.e. available only on your personal machine.

.. code-block:: bash

   python3 -m http.server --directory ./_build/html 8000

Then open the URL ``http://localhost:8000`` with your browser.

|

.. _documentation_publication-push-to-readthedocs:

Publication: Push to ReadTheDocs
--------------------------------

The documentation files for the dev branch are automatically rebuilt (and updated)
each time a push is made to the repository.
The docs for other versions refer to the GitHub tags or branches.
The ``latest`` tag is assigned to the latest release version.

|

Optional: Use Apptainer
-----------------------

Build an Apptainer image file:

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop-apptainer/master/recipes/development/doc-sphinx.def
   apptainer build doc-sphinx.sif doc-sphinx.def

Start the Apptainer container:

.. code-block:: bash

   apptainer shell doc-sphinx.sif

Now you are in an Apptainer virtualization in which you can execute the ``sphinx`` command.
