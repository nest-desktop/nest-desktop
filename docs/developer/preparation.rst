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

**Build an environment with Singularity**

The definition file ``singularity/dev-node-16-alpine.def``
contains an adequate environment to develop and build NEST Desktop.

Build a singularity image:

.. code-block:: bash

  singularity build dev-node-16-alpine.sif singularity/dev-node-16-alpine.def

Go to the shell of singularity container:

.. code-block:: bash

  singularity shell dev-node-16-alpine.sif

|

**Commands**

Install node modules for NEST Desktop:

.. code-block:: bash

  yarn install

Start a development server:

.. code-block:: bash

  yarn serve

|

**Useful commands**

Check if any node modules are outdated:

.. code-block:: bash

  yarn outdated

Upgrade outdated node modules:

.. code-block:: bash

  yarn upgrade
