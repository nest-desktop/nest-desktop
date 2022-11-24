Deploy with Docker Compose
==========================

.. image:: /_static/img/logo/docker-compose-logo.png
   :align: right
   :alt: Docker Compose
   :width: 240px

Docker is a virtualization software packaging applications and its dependencies in a virtual container
that can run on any Linux server.
It is available for a variety of the operating systems, e.g. Linux, Mac and Windows.
For more information follow the link `here <https://www.docker.com/resources/what-container>`__.

NEST Desktop and NEST Simulator are prepared in different containers,
but you can use docker-compose to start multiple containers, e.g. NEST Desktop, NEST Simulator.
Docker Compose needs the configuration file (``docker-compose.yml``).

Here, the guide shows you how to build containers with ``docker-compose``.

Requirements:
  - `Docker Compose <https://docs.docker.com/compose/>`__

|

.. _deploy-docker-compose_preparation:

Preparation
-----------

Prepare your local environment by installing Docker (if you have not installed it yet).

.. code-block:: bash

   apt install docker-compose

|

.. _deploy-docker-compose_get-configuration-file:

Get the configuration file
--------------------------

The configuration file  `docker-compose.yml` contains all setup steps executed by Docker.
Fetch this file from GitHub:

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml

It will pull images of NEST Desktop from
https://docker-registry.ebrains.eu/harbor/projects/6/repositories/nest-desktop
and NEST Simulator can be started from within the official NEST image
(https://docker-registry.ebrains.eu/harbor/projects/6/repositories/nest-simulator).

|

.. _deploy-docker-compose_getting-started:

Getting started
---------------

Build and start the NEST Desktop and NEST Simulator containers.

.. code-block:: bash

   docker-compose up --build

NEST Desktop and NEST Simulator are now serving at ``http://localhost:54286`` and ``http://localhost:52425``, respectively.
With :guilabel:`CTRL` + :guilabel:`C` you can shutdown these services.

.. rubric:: Configurations in :code:`docker-compose.yml`

Here, you can find the details of the configuration file.

+----------------+------------------------------------+
| image          | Get docker image from Docker Hub   |
+----------------+------------------------------------+
| container_name | Set container name                 |
+----------------+------------------------------------+
| ports          | Bind host ports to container ports |
+----------------+------------------------------------+
| command        | Execute command on container start |
+----------------+------------------------------------+
| environment    | Set environment variables          |
+----------------+------------------------------------+


Alternatively, you can clone the source code so that you can change the Dockerfile
and build custom docker images on your machine.
For more information, visit the page https://github.com/nest-desktop/nest-desktop-docker.

|

.. _deploy-docker-compose_upgrade-images:

Upgrade images
--------------

First stop the containers and shut down all services "nest-desktop" and "nest-simulator".

.. code-block:: bash

   docker-compose stop
   docker-compose down

Then pull images from docker hub.

.. code-block:: bash

   docker-compose pull

Afterwards, you can start the services and containers.

.. code-block:: bash

   docker-compose up --no-start
   docker-compose start

|

.. _deploy-docker-compose_useful-commands:

Useful commands
---------------

In the following you can find some useful commands for docker-compose.

List containers.

.. code-block:: bash

   docker-compose ps

If there are no services (``nest-desktop`` and ``nest-simulator``) in the displayed list,
it means that no containers can be started.
You can attach a container for services without starting it using ``--no-start``.

.. code-block:: bash

   docker-compose up --no-start

Then start all services ``nest-desktop`` and ``nest-simulator`` as daemon.

.. code-block:: bash

   docker-compose start

Stop all services, here ``nest-desktop`` and ``nest-simulator``.

.. code-block:: bash

   docker-compose stop

Shutdown all services, here ``nest-desktop`` and ``nest-simulator``.

.. code-block:: bash

   docker-compose down


.. _deploy-docker-compose_set-environments:

Set environments
----------------

**Custom port of NEST Simulator**

For some reason the port 52425 is already occupied and
thus starting the server instance of NEST Simulator might cause conflicts.
To resolve this issue, you can change the port to 54321 for NEST Simulator server instance.

You have to change three lines:

- Set the environment ``NEST_SIMULATOR_PORT: 54321`` in ``nest-desktop`` service.
- Set the environment ``NEST_SERVER_PORT: 54321`` in ``nest-simulator`` service.
- Change the port binding to ``"54321:54321"`` in ``nest-simulator`` service.


An example configuration for docker-compose would be:

.. code-block::

   version: "3"

   services:
     nest-desktop:
       image: docker-registry.ebrains.eu/nest/nest-desktop:3.2
       environment:
         NEST_SIMULATOR_PORT: 54321
       ports:
         - "54286:54286"

     nest-simulator:
       image: docker-registry.ebrains.eu/nest/nest-simulator:3.4
       environment:
         NEST_CONTAINER_MODE: "nest-server"
         NEST_SERVER_PORT: 54321
       ports:
         - "54321:54321"

|

Acknowledgments
---------------

Thanks for the help:

- Steffen Graber (Docker Hub for NEST Simulator)
- Jochen Martin Eppler (API Server for NEST Simulator)
