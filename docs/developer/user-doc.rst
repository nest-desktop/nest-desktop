User documentation
==================

We use `Sphinx <https://www.sphinx-doc.org/en/master/>`__ to generate the documentation and `Read the Docs <https://readthedocs.org/>`__  to publish it.
Sphinx uses reStructuredText.
To learn more about the syntax, check out this quick reference.

Requirements
  * `Sphinx <https://www.sphinx-doc.org/en/master/>`__
  * `Read the Docs Sphinx Theme <https://github.com/readthedocs/sphinx_rtd_theme>`__

Current working directory: ``nest-desktop/docs``.
To install Sphinx and the Read the Docs theme via ``pip``:

.. code-block:: bash

  python3 -m pip install sphinx sphinx_rtd_theme

**Development: Render HTML offline**

Build the documentation which your created with Sphinx in the ``docs`` folder offline:

.. code-block:: bash

  rm -r _build/; make html


**Publication: Push to ReadTheDocs**

The documentation files for the main branch are automatically rebuilt (and updated) each time a push is made to the repository.
The docs for other versions depend on the GitHub tags.
