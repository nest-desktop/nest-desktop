Docker Compose |linux| |windows| |apple|
========================================

.. image:: /_static/img/logo/docker-compose-logo.png
   :align: right
   :target: #docker-compose-linux-windows-apple
   :width: 240px

Docker is a virtualization software packaging applications and its dependencies.
Docker Compose is a tool for running multi-container applications on Docker defined using the Compose file format.
To get more information, see the `official page of Docker Compose <https://github.com/docker/compose>`__.

|br|

Windows |windows| and macOS |apple|
-----------------------------------

Docker Compose is included in Docker Desktop for Windows and macOS.
For more information take a look at the `installation guide of Docker Desktop <https://www.docker.com/get-started>`__.

Please keep in mind that on Windows you can also use the Windows Subsystem for Linux (WSL) version 2 or higher,
which allows you to run Docker without emulation.
This offers performance advantages and more features.
Detailed instructions on how to use Docker on WSL (version 2+) are provided by
`Docker <https://docs.docker.com/desktop/windows/wsl/>`__ and
`Microsoft <https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers>`__.

|br|

Quick setup in Linux |linux|
----------------------------

1. Install Docker and Docker Compose

.. code-block:: bash

   apt install docker.io docker-compose

2. Get configuration file for Docker-compose
(`docker-compose.yml <https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml>`__)

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml

3. Build and start NEST Desktop and NEST Simulator with a single command:

.. code-block:: bash

   sudo docker-compose up --build

Now NEST Desktop is started.
You can use NEST Desktop in the web browser at http://localhost:54286.

**The installation is now complete!**
:doc:`Now we can start constructing networks for the simulation! </user/usage-basic/index>`

.. seeAlso::
   For more information (like running the containers without root password, etc.),
   please read the full documentation of `NEST Desktop Docker <https://github.com/nest-desktop/nest-desktop-docker>`__.
