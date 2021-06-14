Deploy with Docker Compose
==========================


.. image:: ../_static/img/logo/docker-compose-logo.png
  :width: 240px
  :alt: Docker Compose

|

Docker is a virtualization software packaging applications and its dependencies in a virtual container that can run on any Linux server.
It is available for a variety of the operating systems, e.g. Linux, Mac and Windows.
For more information follow the link `here <https://www.docker.com/resources/what-container>`__.

NEST Desktop and NEST Server are prepared in different containers.
But you can use docker-compose to start multiple containers, e.g. NEST Desktop, NEST Server.
Docker compose needs the configuration file (``docker-compose.yml``).

Here, the guide shows you how to build containers with ``docker-compose``.

Requirements
  * `Docker compose <https://docs.docker.com/compose/>`__

**Installation**

.. code-block:: bash

  apt install docker-compose


**Get the configuration file `docker-compose.yml` from GitHub**

.. code-block:: bash

  wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml

It will pull images of NEST Desktop from https://hub.docker.com/r/nestdesktop/app)
and NEST Server can be started in official NEST image (https://hub.docker.com/r/nestsim/nest).


**Getting started**

Build and start NEST Desktop and NEST Server containers.

.. code-block:: bash

  docker-compose up --build

NEST Desktop and NEST Server are now serving at ``http://localhost:8000`` and ``http://localhost:5000``, respectively.
With :guilabel:`CTRL` + :guilabel:`C` you can shutdown these services.

.. rubric:: Configurations in :code:`docker-compose.yml`

Here, you can find details of configuration file.

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


Alternatively, you can clone the source code that you can change Dockerfile and build docker images on your machine.
For more information, visit the page https://github.com/nest-desktop/nest-desktop-docker.


**Useful commands for docker-compose**

List containers.

.. code-block:: bash

  docker-compose ps

If no services (``nest-desktop`` and ``nest-server``) is in the list, it means that no containers can be started.
You can attach container for services without starting ``--no-start``.

.. code-block:: bash

  docker-compose up --no-start


Then start services ``nest-desktop`` and ``nest-server`` as a daemon.

.. code-block:: bash

  docker-compose start


Stop services ``nest-desktop`` and ``nest-server``.

.. code-block:: bash

  docker-compose stop


Shutdown services ``nest-desktop`` and ``nest-server``.

.. code-block:: bash

  docker-compose down


|

**Acknowledgments**

Thanks for the help:

  - Steffen Graber (Docker Hub for NEST Simulator)
  - Jochen Martin Eppler (NEST Server)
