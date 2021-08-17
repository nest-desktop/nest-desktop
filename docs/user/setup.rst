Setup Guide
===========


This guide provides a detailed documentation on how to install NEST Desktop with NEST Simulator.
The front end NEST Desktop requires NEST Simulator as the back end for the simulation.
NEST Simulator has an API Server which can forward requests to simulation engine.
For more information, please have a look `here <https://nest-simulator.readthedocs.io/en/stable/nest_server.html>`__.


.. image:: ../_static/img/installation-guide.png
  :width: 100%
  :target: #setup-guide

|

Docker (+ Docker Compose) and Singularity provide virtualization for NEST Desktop and NEST Simulator.
These approaches are recommended to run NEST Desktop and NEST Simulator in the same time.

Furthermore, you are able to install NEST Desktop with ``pip`` command.
On the other hand, installing NEST Simulator on your computer directly is not an easy approach.
Thus, it is rather for experienced users.

You can read the installation instructions by clicking one of these logos below:

.. raw:: html

    <div class="center" style="height:150px">
      <div class="column col-3">
        <a href="#via-docker">
          <div class="black center">
            <img class="ma-2" src="../_static/img/logo/docker-compose-logo.png" style="height:100px">
            <h2>Docker Compose</h2>
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

      <div class="column col-3">
        <a href="#via-python-package">
          <div class="black center">
            <img class="ma-2" src="../_static/img/logo/pypi-logo.svg" style="height:100px">
            <h2>Python Package</h2>
          </div>
        </a>
      </div>
    </div>


||||

Via Docker Compose for |linux| |windows| |apple|
------------------------------------------------

.. image:: ../_static/img/logo/docker-compose-logo.png
  :width: 240px
  :target: #via-docker

|

Docker is a virtualization software packaging applications and its dependencies.
Docker Compose is a tool for running multi-container applications on Docker defined using the Compose file format.
To get more information, see the `official page of Docker Compose <https://github.com/docker/compose>`__.


**Windows** |windows| **and macOS** |apple|

Docker Compose is included in Docker Desktop for Windows and macOS.
For more information take a look at `installation guide of Docker Desktop <https://www.docker.com/get-started>`__.


**Quick setup in Linux** |linux|

1. Install Docker and Docker Compose

.. code-block:: bash

  apt install docker.io docker-compose

2. Get configuration file for Docker-compose (`docker-compose.yml <https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml>`__)

.. code-block:: bash

  wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml

3. Build and start NEST Desktop and NEST Simulator with a single command:

.. code-block:: bash

  docker-compose up --build

Now NEST Desktop is started.
You can use NEST Desktop in the web browser at http://localhost:8000.

**Installation is now complete!**
:doc:`Now we can start constructing networks for the simulation! <usage>`.


For more information read the full documentation of the `NEST Desktop Docker <https://github.com/nest-desktop/nest-desktop-docker>`__.


Via Singularity for |linux|
---------------------------

.. image:: ../_static/img/logo/singularity-logo.svg
  :width: 240px
  :target: #via-singularity

|

Singularity is an application container for **Linux** systems.
For more information read the full documentation of the Singularity
`here <https://sylabs.io/docs/>`__.

1. Clone a working copy from the repository and go to the folder:

.. code-block:: bash

  git clone https://github.com/nest-desktop/nest-desktop-singularity
  cd nest-desktop-singularity

2. Register bash command for NEST Desktop Singularity:

.. code-block:: bash

  export PATH=$PATH:$PWD/bin/

3. Build Singularity images (it will ask for sudo password):

.. code-block:: bash

  nest-desktop-singularity build

4. Start Singularity instances of NEST Desktop and NEST Simulator:

.. code-block:: bash

  nest-desktop-singularity start

Now NEST Desktop is started.
You can use NEST Desktop in the web browser at http://localhost:8000.

**Installation is now complete!**
:doc:`Now we can start constructing networks for the simulation! <usage>`.

For more information read the full documentation of the `NEST Desktop Singularity <https://github.com/nest-desktop/nest-desktop-singularity>`__.



Via Python Package for |linux| |windows| |apple|
------------------------------------------------

.. image:: ../_static/img/logo/pypi-logo.svg
  :width: 240px
  :target: #via-python-package

|

1. (For advanced user) Install NEST Simulator:

Since NEST 3, API Server is implemented in NEST Simulator.
Skip this step when the appropriate NEST Simulator (3.0 or higher) is already installed on your computer.

Read the full installation guide of NEST Simulator
`here <https://nest-simulator.readthedocs.io/en/latest/installation/index.html>`__.

2. Install dependencies for API Server of NEST Simulator:

.. code-block:: bash

  pip install flask flask-cors RestrictedPython uwsgi

3. Start NEST Server as the back end:

The API Server for NEST Simulator is referred to as **NEST Server**.

.. code-block:: bash

  nest-server start

Now, NEST Server is running at http://localhost:5000.

Read detailed information of NEST Server `here <https://nest-simulator.readthedocs.io/en/stable/nest_server.html>`__.

4. Install NEST Desktop

NEST Desktop is available on PyPI and can be installed with ``pip`` command:

.. code-block:: bash

  pip3 install nest-desktop [--user] [--upgrade]

For more information read the full installing docs :doc:`here <setup>`.

5. Start NEST Desktop (in another terminal session):

.. code-block:: bash

  nest-desktop start

Now NEST Desktop is started.
You can use NEST Desktop in the web browser at http://localhost:8000.

**Installation is now complete!**
:doc:`Now we can start constructing networks for the simulation! <usage>`.

For more information read the full documentation of the command API :doc:`here </developer/command-API>`.


.. |apple| image:: ../_static/img/icons/apple.svg
  :width: 24px
  :alt: apple
  :target: #

.. |linux| image:: ../_static/img/icons/linux.svg
  :width: 24px
  :alt: linux
  :target: #

.. |windows| image:: ../_static/img/icons/windows.svg
  :width: 24px
  :alt: windows
  :target: #
