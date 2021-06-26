Setup Guide
===========


This guide provides a detailed documentation on how to install and start only NEST Desktop (without NEST Server).
When you want to start the bundle of NEST Desktop and NEST Server, you can read the instructions :doc:`here <../deployer/deploy-docker>`.

.. note::

  NEST Desktop requires NEST Server which runs only in Linux systems (when deployed without any containerization technique).
  For more information read the full installing docs of NEST Simulator
  `here <https://nest-simulator.readthedocs.io/en/latest/installation/index.html>`__.


You can read the installation instructions by clicking one of these logos below:

.. raw:: html

    <div class="center" style="height:150px">
      <div class="column col-3">
        <a href="#via-python-package">
          <div class="black center">
            <img class="ma-2" src="../_static/img/logo/pypi-logo.svg" style="height:100px">
            <h2>Python Package</h2>
          </div>
        </a>
      </div>

      <div class="column col-3">
        <a href="#via-docker">
          <div class="black center">
            <img class="ma-2" src="../_static/img/logo/Moby-logo.png" style="height:100px">
            <h2>Docker</h2>
          </div>
        </a>
      </div>

      <div class="column col-3">
        <a href="#via-singularity">
          <div class="black center">
            <img class="ma-2" src="../_static/img/logo/singularity-logo.svg" style="height:100px">
            <h2>Singularity</h2>
          </div>
        </a>
      </div>
    </div>


||||

Via Python Package
------------------

.. image:: ../_static/img/logo/pypi-logo.svg
  :width: 240px
  :target: #via-python-package

|

1. NEST Desktop is available on PyPI and can be installed with pip:

.. code-block:: bash

  pip3 install nest-desktop [--user] [--upgrade]

For more information read the full installing docs :doc:`here <setup>`.

2. Start NEST Desktop (in another terminal session):

.. code-block:: bash

  nest-desktop start

NEST Desktop is serving at ``http://localhost:8000``.

For more information read the full documentation of the command API :doc:`here </developer/command-API>`.


Via Docker
----------

.. image:: ../_static/img/logo/Moby-logo.png
  :width: 240px
  :target: #via-docker

|

Docker is a virtualization software packaging applications and its dependencies in a virtual container that can run on any Linux server.
In fact, it is available for a wide variety of operating systems, e.g. Linux, Mac and Windows. For more information on this technology, take a look at `this overview <https://www.docker.com/resources/what-container>`__.


1. Pull the NEST Desktop image from Docker Hub:

.. code-block:: bash

  docker pull nestdesktop/app

2. Start the Docker container:

.. code-block:: bash

  docker run -rm -it -p 8000:8000 --name nest-desktop nestdesktop/app

NEST Desktop is now serving at ``http://localhost:8000``.

.. note::

  It only starts NEST Desktop without NEST Server.
  If you want to both together (front end and back end), you can use Docker Compose, which is documented :doc:`here </deployer/deploy-docker>`.


.. rubric:: Arguments

You can find the help texts of docker arguments by :code:`docker run --help`.

+----+-------------------------------------------+
| -p | Publish a container's port(s) to the host |
+----+-------------------------------------------+
| -i | Keep STDIN open even if not attached      |
+----+-------------------------------------------+
| -t | Allocate a pseudo-TTY                     |
+----+-------------------------------------------+



Via Singularity
---------------

.. image:: ../_static/img/logo/singularity-logo.svg
  :width: 240px
  :target: #via-singularity

|

Singularity is an application container for Linux systems.
For more information read the full documentation
`here <https://sylabs.io/docs/>`__.

1. Clone a working copy from the repository and go to the Singularity folder:

.. code-block:: bash

  git clone https://github.com/nest-desktop/nest-desktop
  cd nest-desktop/singularity

2. Build the Singularity container (with sudo):

.. code-block:: bash

  singularity build nest-desktop-app.sif nest-desktop-app.def

3. Start the Singularity container

.. code-block:: bash

  singularity run nest-desktop-app.sif

NEST Desktop is now serving at ``http://localhost:8000``.
