Prepare the environment
=======================


NEST Desktop is written in HTML5 but compiled by `Vue.js`, a web framework written in TypeScript.
For this, you need to install nodeJS (+ yarn).

Requirements
  - Python 3.6 or higher
  - node, yarn
  - NEST Simulator 3.0 or higher

You can install these requirements in host system.

However, I prefer to use Singularity container and leave the host system unchanged.
For this, I prepared Singularity recipe that build a container with required packages for the development.
You can find the definition file in ``singularity/nest-desktop-dev.def`` for building Singularity container.

|

**Build an environment with Singularity**

The definition file ``singularity/nest-desktop-dev.def``
contains an adequate environment to develop and build NEST Desktop.

Build a singularity image:

.. code-block:: bash

  singularity build nest-desktop-dev.sif singularity/nest-desktop-dev.def

Go to shell of singularity container:

.. code-block:: bash

  singularity shell nest-desktop-dev.sif

|

**Node modules**

Install node modules for NEST Desktop:

.. code-block:: bash

  yarn install


Check if any node modules are outdated:

.. code-block:: bash

  yarn outdated


Upgrade outdated node modules:

.. code-block:: bash

  yarn upgrade
