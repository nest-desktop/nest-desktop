Conda |linux| |windows| |apple|
===============================

.. image:: /_static/img/logo/conda-logo.png
   :align: left
   :target: #conda-linux-windows-apple
   :width: 120px

Anaconda provides packages for `NEST Desktop <https://anaconda.org/conda-forge/nest-desktop>`__.
and `NEST Simulator <https://anaconda.org/conda-forge/nest-simulator>`__.
These packages can be installed with Conda.
We highly recommend installing NEST 3.
With NEST 3, the API server (i.e., NEST Server) is already implemented.

|br|

Install with Conda
------------------

1. Create Conda environment called :bdg:`nest3` and install NEST Simulator:

   .. code-block:: bash

      conda create -n nest3 nest-simulator

2. Activate the Conda environment :bdg:`nest3`:

   .. code-block:: bash

      conda activate nest3

3. Install the dependencies for the API Server of NEST Simulator:

   .. code-block:: bash

      conda install flask flask-cors RestrictedPython gunicorn

4. Install NEST Desktop

   .. code-block:: bash

      conda install nest-desktop


Start with Conda
----------------

1. Start NEST Server as the back end:

   The API Server for NEST Simulator is referred to as **NEST Server**.

   .. code-block:: bash

      nest-server start

   NEST Server is now running at http://localhost:52425.

2. Start NEST Desktop (in another terminal session):

   .. code-block:: bash

      nest-desktop start

   NEST Desktop is now started and available in the web browser at http://localhost:54286.

|

**The installation is now complete!**
:doc:`Now we can start constructing networks for the simulation! </user/usage-basic/index>`

For more information read the full documentation of the command API
:doc:`here </user/usage-advance/command-API>`.
