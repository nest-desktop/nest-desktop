Deploy Insite with Docker Compose
=================================


.. image:: ../_static/img/logo/docker-compose-logo.png
  :width: 240px
  :alt: Docker Compose

|

Insite can be started as a backend module for NEST Desktop.
It allows to render activity during the simulation already.

.. note::

  For more information about Insite, please read the `documentation <https://vrgrouprwth.github.io/insite/>`__.

First get the configuration file for Docker Compose to start NEST Desktop and Insite:

.. code-block:: bash

  wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose-insite.yml docker-compose.yml

Next, start services of NEST Desktop and Insite including NEST Module and Access Node.
For more information about Docker Compose, please read the :doc:`documentation <deploy-docker-compose>`.

.. code-block:: bash

  docker-compose up --build

The services are now served and you are ready to use NEST Desktop with Insite.
How to use NEST Desktop with Insite, please check the :doc:`guide <user/usage-insite>`.
