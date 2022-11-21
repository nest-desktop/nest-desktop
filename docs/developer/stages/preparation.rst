Prepare the environment
=======================

NEST Desktop is written in `Vue.js` (a web framework written in TypeScript), and also in TypeScript.
The Vue code is transpiled to HTML5 and JavaScript Code. There are multiple ways to develop Vue applications,
but my preferred way (and probably the most common one) to develop NEST Desktop is to use `Node.js` (and optionally `Yarn`).
Therefore, if you do not use any of the container systems mentioned below,
you will need to `install Node.js <https://nodejs.org/en/download/package-manager/>`__
(for Windows, an easy installation guide can be found `here <https://treehouse.github.io/installation-guides/windows/node-windows.html>`__ ),
which gives you also the possibility to install `Yarn`.

Requirements
   - Node.js, Yarn
   - NEST Simulator 3.0 or higher

You can install these requirements in the host system.

However, we prefer to use a Singularity container and leave the host system unchanged.
For this, we prepared a Singularity recipe that build a container with the required packages for the development.
You can find the definition file in ``singularity/dev-node-16-alpine.def`` for building this Singularity container.

|

.. _preparation_build-an-environment-with-singularity:

Build an environment with Singularity
-------------------------------------

The definition file ``singularity/dev-node-16-alpine.def``
contains an adequate environment to develop and build NEST Desktop.

Build a singularity image:

.. code-block:: bash

   singularity build dev-node-16-alpine.sif singularity/dev-node-16-alpine.def

Go to the shell of singularity container:

.. code-block:: bash

   singularity shell dev-node-16-alpine.sif

|

.. _preparation_commands:

Commands
--------

Install node modules for NEST Desktop:

.. code-block:: bash

   yarn install

Start a development server:

.. code-block:: bash

   yarn serve

.. note::
   The command ``yarn serve`` uses the configuration file ``vue.config.js``.
   This file controls the threads used for the linting (the statical-syntactical code checks).
   With the default configuration, all available threads are used to minimize the build time.
   This might slow down other programs.
   There are cases where you cannot afford that
   and prefer a slightly longer execution time.
   In that cases, you can either adjust the number of threads in that file.
   This reduces the CPU load, but some CPU resources might stay unused.
   Alternatively you can execute the console in which you want to spawn the ``yarn`` command with a lower priority.
   On Linux (even on MacOS or Windows using WSL2 and an available shell command) this can be done using

   .. code-block:: bash

     nice -n 20 bash

   This will spawn a new console inside your current console, but with the lowest processing priority possible,
   i.e. this console and its tasks do not block other tasks (like video conferences, etc.) significantly.
   Do not be confused that there will be no new window
   and no major visual cues that you are now in another process.
   In that console you can now execute the commands mentioned above.

|

.. _preparation_useful-commands:

Useful commands
---------------

Check if any node modules are outdated:

.. code-block:: bash

   yarn outdated

Upgrade outdated node modules:

.. code-block:: bash

   yarn upgrade
