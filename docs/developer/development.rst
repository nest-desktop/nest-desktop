Work on the source code
=======================

First, prepare the development environment with the required packages.

.. code-block:: bash

  yarn serve

The Live Development Server is serving at ``http://localhost:8080``.


**Setup**

It is possible to install NEST Desktop from source code on a local machine using ``pip`` (where it finds ``setup.py``).
The recommended method is to install it in the user's home directory using the command argument ``--user``.

.. code-block:: bash

  python3 -m pip install --user -e .
  nest-desktop start

.. note::
  Do not forget to start NEST Server.


**Commit changes**

Go to the `dev` branch for the development.

.. code-block:: bash

  git checkout dev

Fetch the data from GitHub (download it to your local directory):

.. code-block:: bash

  git fetch

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

Finally, push all of them to repository on the internet (and create a merge request afterwards).

.. code-block:: bash

  git push --set-upstream origin newBranch
