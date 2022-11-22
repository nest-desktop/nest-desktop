Python |linux| |windows| |apple|
================================

.. image:: /_static/img/logo/python-logo.png
   :align: right
   :target: #python-linux-windows-apple
   :width: 240px

NEST Simulator
--------------

1. Install NEST Simulator (SKIP THIS STEP IF YOU HAVE NEST 3 INSTALLED.):

   Read the full installation guide of NEST Simulator :doc:`here <nest-simulator:installation/index>`.

   We highly recommend installing NEST 3. With NEST 3, the API server (i.e., NEST Server) is already implemented.

2. Install the dependencies for the API Server of NEST Simulator:

   .. code-block:: bash

      pip install flask flask-cors RestrictedPython gunicorn

3. Start NEST Server as the back end:

   The API Server for NEST Simulator is referred to as **NEST Server**.

   .. code-block:: bash

      nest-server start

NEST Server is now running at http://localhost:52425.

You can find the detailed information on NEST Server :doc:`here <nest-simulator:connect_nest/nest_server>`.

NEST Desktop
------------

1. Install NEST Desktop

   NEST Desktop is available on PyPI and can be installed with the ``pip`` command:

   .. code-block:: bash

      pip3 install nest-desktop [--user] [--upgrade]

   For more information read the complete installing guide :doc:`here </user/setup/index>`.

2. Start NEST Desktop (in another terminal session):

   .. code-block:: bash

      nest-desktop start

Now NEST Desktop is started.
You can use NEST Desktop in the web browser at http://localhost:54286.
