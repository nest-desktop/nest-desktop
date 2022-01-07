Deploy Insite with Docker Compose
=================================


.. image:: ../_static/img/logo/docker-compose-logo.png
  :width: 240px
  :alt: Docker Compose

|

Insite can be started as a backend for NEST Desktop.
It allows to render activity during the simulation.

First get asset of Insite from GitHub and then unzip it.

.. code-block:: bash

  wget https://github.com/VRGroupRWTH/insite/archive/refs/tags/1.0.0.tar.gz
  tar -zxf 1.0.0.tar.gz
  cd insite-1.0.0


Next, start Insite with Docker Compose.
For more information about Docker Compose, please read the :doc:`documentation <deploy-docker>`.

.. code-block:: bash

  docker-compose up --build

The backend is now served but you have to start the frontend NEST Desktop.
