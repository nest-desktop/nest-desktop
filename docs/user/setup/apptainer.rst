Apptainer |linux|
=================

.. image:: /_static/img/logo/apptainer-logo.png
   :align: left
   :target: #apptainer-linux
   :width: 120px

Apptainer, former Singularity, is an application container for **Linux** systems.
For more information read the full documentation of Apptainer
`here <https://apptainer.org/>`__.

|br|

Get recipes
-----------

1. Clone a working copy from the repository and go to the folder:

.. code-block:: bash

   git clone https://github.com/nest-desktop/nest-desktop-apptainer
   cd nest-desktop-apptainer

2. Register the bash command for NEST Desktop Apptainer:

.. code-block:: bash

   export PATH=$PATH:$PWD/bin/

.. note::
   You will have to repeat this every time you end a terminal session.
   If you like to register this command permanently,
   please proceed according to the `full documentation <https://github.com/nest-desktop/nest-desktop-apptainer>`__.

Build image
-----------

3. Build the Apptainer images (it will ask for sudo password):

.. code-block:: bash

   nest-desktop-apptainer build

.. note::
   This command (and the following ones) need to be executed inside the folder
   where the container files are located, i.e. the ``nest-desktop-apptainer`` folder.

Start container
---------------

4. Start the Apptainer instances of NEST Desktop and NEST Simulator:

.. code-block:: bash

   nest-desktop-apptainer start

Now NEST Desktop is started.
You can use NEST Desktop in the web browser at http://localhost:54286.

**The installation is now complete!**
:doc:`Now we can start constructing networks for the simulation! </user/usage-basic/index>`

For more information read the full documentation of `NEST Desktop Apptainer <https://github.com/nest-desktop/nest-desktop-apptainer>`__.

.. warning::
   If the apptainer (esp. NEST Simulator) is running, your system is exposed for unauthorized access!
