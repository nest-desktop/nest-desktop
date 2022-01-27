Deploy NEST Desktop with Insite
===============================


.. image:: ../_static/img/logo/docker-compose-logo.png
  :alt: Docker Compose
  :target: #deploy-nest-desktop-with-insite
  :width: 240px

|

The Insite system can be served as a backend for NEST Desktop.
It allows to visualize activity of the live simulation.

|

First get the configuration file for Docker Compose.

.. code-block:: bash

  wget https://raw.githubusercontent.com/nest-desktop/nest-desktop-docker/main/docker-compose-insite.yml

For more information about Docker Compose, please read the :doc:`documentation <deploy-docker-compose>`.

|

Next, start all services of the Docker compose.

.. code-block:: bash

  docker-compose -f docker-compose-insite.yml up

NEST Desktop is now serving at ``http://localhost:8000``
whereas Insite NEST Module and Insite Access Node are serving at ``http://localhost:5000``
and ``http://localhost:8080``, respectively.
