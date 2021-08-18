Deploy with Docker Compose
==========================


.. image:: ../_static/img/logo/docker-compose-logo.png
  :width: 240px
  :alt: Docker Compose

|

Docker is a virtualization software packaging applications and its dependencies in a virtual container that can run on any Linux server.
It is available for a variety of the operating systems, e.g. Linux, Mac and Windows.
For more information follow the link `here <https://www.docker.com/resources/what-container>`__.

NEST Desktop and NEST Simulator are prepared in different containers, but you can use docker-compose to start multiple containers, e.g. NEST Desktop, NEST Simulator.
Docker Compose needs the configuration file (``docker-compose.yml``).

Here, the guide shows you how to build containers with ``docker-compose``.

Requirements
  * `Docker Compose <https://docs.docker.com/compose/>`__

**Preparation**

.. code-block:: bash

  apt install docker-compose


**Get the configuration file `docker-compose.yml` from GitHub**

.. code-block:: bash

  wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml

It will pull images of NEST Desktop from https://hub.docker.com/r/nestdesktop/app)
and NEST Simulator can be started from within the official NEST image (https://hub.docker.com/r/nestsim/nest).


**Getting started**

Build and start the NEST Desktop and NEST Simulator containers.

.. code-block:: bash

  docker-compose up --build

NEST Desktop and NEST Simulator are now serving at ``http://localhost:8000`` and ``http://localhost:5000``, respectively.
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


Alternatively, you can clone the source code so that you can change the Dockerfile and build custom docker images on your  machine.
For more information, visit the page https://github.com/nest-desktop/nest-desktop-docker.


**Upgrade images**

First stop the containers and shut down services of nest-desktop and nest-server.

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


**Useful commands for docker-compose**

List containers.

.. code-block:: bash

  docker-compose ps

If there are no services (``nest-desktop`` and ``nest-server``) in the displayed list, it means that no containers can be started.
You can attach a container for services without starting it using ``--no-start``.

.. code-block:: bash

  docker-compose up --no-start


Then start the services ``nest-desktop`` and ``nest-server`` as daemon.

.. code-block:: bash

  docker-compose start


Stop the services ``nest-desktop`` and ``nest-server``.

.. code-block:: bash

  docker-compose stop


Shutdown the services ``nest-desktop`` and ``nest-server``.

.. code-block:: bash

  docker-compose down


|

**Acknowledgments**

Thanks for the help:

  - Steffen Graber (Docker Hub for NEST Simulator)
  - Jochen Martin Eppler (API Server for NEST Simulator)
