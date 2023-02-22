Deploy NEST Desktop with Insite
===============================


The Insite system can be served as a used for NEST Desktop.
It allows to visualize activity of the live simulation.

|

How to setup NEST Desktop and Insite
------------------------------------

First, get the configuration file for Docker Compose.

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop-docker/main/examples/insite/docker-compose.yml

For more information about Docker Compose, please read the
corresponding :doc:`documentation </deployer/deploy-docker-compose>`.

|

Next, start all services of the Docker Compose file.

.. code-block:: bash

   docker-compose up

NEST Desktop is now served at ``http://localhost:54286``,
whereas Insite NEST Module and Insite Access Node are served
at ``http://localhost:52425`` and ``http://localhost:52056``, respectively.

.. seeAlso::
   - :doc:`/user/usage-external/simulate-with-insite`
