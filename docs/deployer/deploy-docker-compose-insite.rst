Deploy NEST Desktop with Insite
===============================


The Insite system can be served as a backend for NEST Desktop.
It allows to visualize activity of the live simulation.

|

How to setup NEST Desktop and Insite
------------------------------------

First get the configuration file for Docker Compose.

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop-docker/main/examples/insite/docker-compose.yml

For more information about Docker Compose, please read the :doc:`documentation </deployer/deploy-docker-compose>`.

|

Next, start all services of the Docker Compose file.

.. code-block:: bash

   docker-compose up

NEST Desktop is now serving at ``http://localhost:8000``
whereas Insite NEST Module and Insite Access Node are serving
at ``http://localhost:5000`` and ``http://localhost:8080``, respectively.
