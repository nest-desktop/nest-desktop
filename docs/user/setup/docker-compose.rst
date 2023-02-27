Docker Compose |linux| |windows| |apple|
========================================

.. image:: /_static/img/logo/docker-compose-logo.png
   :align: left
   :target: #docker-compose-linux-windows-apple
   :width: 120px

Docker is a virtualization software packaging applications and its dependencies.
Docker Compose is a tool for running multi-container applications on Docker which uses the Compose file format.

.. seeAlso::
  For further information, please see the `official page of Docker Compose <https://github.com/docker/compose>`__.

|br|

Installation
------------

Docker Compose is available on multiple platforms.
This guide demonstrates some of the ways to install it on Linux, Windows and Mac.

Linux |linux|
^^^^^^^^^^^^^

Install Docker and Docker Compose in Terminal

.. code-block:: bash

   apt install docker.io docker-compose


Windows |windows| and macOS |apple|
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Docker Compose is included in Docker Desktop for Windows and macOS.
For more information, take a look at the `installation guide of Docker Desktop <https://www.docker.com/get-started>`__.

|br|

Pull and start Docker containers
--------------------------------

1. Get the configuration file for Docker Compose
(`docker-compose.yml <https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml>`__)

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml

2. Start NEST Desktop and NEST Simulator in a single command:

.. code-block:: bash

   docker-compose up

Now, the service starts the containers for NEST Desktop and NEST Simulator.
You can use NEST Desktop in the web browser at http://localhost:54286.

**The installation is now complete!**
:doc:`Now you can start constructing networks for the simulation! </user/usage-basic/index>`

.. seeAlso::
   For more information (like running the containers without root password, etc.),
   please read the full documentation of `NEST Desktop Docker <https://github.com/nest-desktop/nest-desktop-docker>`__.
