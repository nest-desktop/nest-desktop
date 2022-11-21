Work on the source code
=======================

First, prepare the development environment with the required packages.

.. code-block:: bash

  yarn serve

The Live Development Server is now serving at ``http://localhost:8080``.

.. note::
   For more information on how to prepare the environment for the development,
   please check the :doc:`guide </developer/stages/preparation>`.

|

.. _development_setup:

Setup
-----

It is possible to install NEST Desktop from source code on a local machine using ``pip`` (where it finds ``setup.py``).
The recommended method is to install it in the user's home directory using the command argument ``--user``.

.. code-block:: bash

   python3 -m pip install --user -e .
   nest-desktop start

.. note::
   Do not forget to start NEST Simulator.

|

.. _development_commit-changes:

Commit changes
--------------

Go to the `dev` branch for the development.

.. code-block:: bash

   git checkout dev

Fetch the data from GitHub (download it to your local directory):

.. code-block:: bash

   git fetch

This command can be varied with options to e.g. fetch all branches (``git fetch --all``)
or to discard unreachable content (``git fetch --prune``),
even with multiple of them.
If required, intergrate the changes from GitHub into your local repository:

.. code-block:: bash

   git pull

It is recommended to create a new branch for an an implementation of a new feature/goal.

.. code-block:: bash

   git checkout -b newBranch

If your changes are ready to be commited, stage and commit them:

.. code-block:: bash

   git add ...
   git commit -m 'This is my commit.'

|

.. _development_push-changes-to-github:

Push changes to GitHub
----------------------

Finally, push all of them to repository on the internet (and create a merge request afterwards).

.. code-block:: bash

   git push --set-upstream origin newBranch

A merge request will then be handled by the team:
It will be reviewed and if it provides some nice additions, it will be merged.

.. note::
   It is likely that the review contains some change requests which have to be
   addressed and committed by you before the merge can be made.
