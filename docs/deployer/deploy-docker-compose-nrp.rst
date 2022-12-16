Deploy NEST Desktop with NRP
============================


.. image:: /_static/img/screenshots/external/nest-desktop-nrp.png
   :alt: Neuro Robotics Plattform
   :target: #deploy-nest-desktop-with-nrp

|

The Insite system can be served as a backend for NEST Desktop.
It allows to visualize activity of the live simulation.

|

How to setup NEST Desktop and NRP
---------------------------------

First download the configuration file of Docker Compose from Github:

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop-docker/main/examples/nrp/docker-compose.yml

Then start all services (`nest-desktop`, `insite-nest-module`, `insite-access-module`, `nrp-backend` and `nrp-frontend`):

.. code-block:: bash

   docker-compose up

It takes few minutes to pull all five docker images and start all containers.

.. seeAlso::
   - Be sure that NEST Desktop runs two backends: NEST Simulator and Insite Access Node.
     For more information, please read :doc:`/user/usage-external/simulate-with-insite`.
   - For the usage, please read :doc:`/user/usage-external/usage-with-nrp`.
