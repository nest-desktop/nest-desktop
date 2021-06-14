User documentation
==================

We use Sphinx to generate documentation and Read the Docs to publish it.
Sphinx uses reStructuredText.
To learn more about the syntax, check out this quick reference.

Requirements
  * sphinx, sphinx rth theme

Current work directory: ``nest-desktop/docs``.
To install sphinx and readthedocs theme via  ``pip``:

.. code-block:: bash

  python3 -m pip install sphinx sphinx_rtd_theme

**Development: Render HTML offline**

Build sphinx documentation in ``docs`` folder offline:

.. code-block:: bash

  rm -r _build/; make html


**Publication: Push to ReadTheDocs**

It automatically builds docs for master for each push commits to master.
Docs for other version depends on GitHub tags.
