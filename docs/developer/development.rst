Work on the source code
=======================

First, prepare the development environment with required packages.

.. code-block:: bash

  yarn serve

The Live Development Server is serving at ``http://localhost:8080``.


**Setup**

Install NEST Desktop from source code on local machine using ``pip`` (where it finds ``setup.py``).
Recommended method is to install it in user home with the command argument ``--user``.

.. code-block:: bash

  python3 -m pip install --user -e .
  nest-desktop start

.. note::
  Do not forget to start NEST Server.


**Commit changes**

Go to dev branch for the development.

.. code-block:: bash

  git checkout dev

Fetch metadata from GitHub:

.. code-block:: bash

  git fetch

If required, pull data from GitHub:

.. code-block:: bash

  git pull

It is recommended to create a new branch for an approach goal.

.. code-block:: bash

  git checkout -b newBranch

If changes is ready for the commit:

.. code-block:: bash

  git add ...
  git commit -m 'This is my commit.'

|

Finally, push all of them to repository.

.. code-block:: bash

  git push --set-upstream origin newBranch
