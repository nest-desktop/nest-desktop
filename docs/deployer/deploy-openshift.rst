Deploy on OpenShift
===================

.. image:: ../_static/img/logo/openshift-logo.png
  :width: 240px
  :alt: OpenShift

|

The documentation shows how to deploy NEST Desktop on OpenShift resources.
Here, we give some examples which we deployed NEST Desktop on EBRAINS.

Requirements
  * `OC Client Tools <https://www.okd.io/download.html#oc-platforms>`__


**Deploy NEST Desktop on EBRAINS**

.. image:: ../_static/img/logo/ebrains-logo.svg
  :width: 320px
  :alt: EBRAINS

|

EBRAINS provides two OKD infrastructures
  * https://okd-dev.hbp.eu for the development.
  * https://okd.hbp.eu for the production.

.. Note::
  I strongly recommend to use the development page for testing.

**Register client for authentication on EBRAINS**

To access to NEST Desktop on EBRAINS infrastructure, an authentication is requested.
You find the codes on https://github.com/nest-desktop/apache2-oidc.

Here are the steps how to setup authentication for NEST Desktop properly.

.. code-block:: bash

   bash get-dev-token.sh

Change configuration file and then create a client for your application.

.. code-block:: bash

   bash create-client.sh

Keep ``client_id`` and ``client_secret`` for the **okd** infrastructure.


**Build NEST Desktop on EBRAINS**

First, copy command line from the web console of ``https://okd-dev.hbp.eu`` and enter in terminal to login via oc:

.. code-block:: bash

  oc login https://okd-dev.hbp.eu:443 --token=<TOKEN>

Get status of current project:

.. code-block:: bash

  oc status


You can find the configurations on https://github.com/nest-desktop/nest-desktop-ebrains.
Here, you have to modify the environment for EBRAINS authentication,
i.e. ``OIDC_CLIENT_ID`` and ``OIDC_CLIENT_SECRET`` of NEST Desktop
(which is printed after setting up the client for NEST Desktop).

Execute the bash script to deploy ``nest-desktop``, ``nest-server`` and ``apache2-oidc`` containers:

.. code-block:: bash

  bash setup-nest-desktop.sh


**Further usage**

Scaling up the replicas (pods or nodes):

.. code-block:: bash

  oc scale --replicas=2 dc nest-desktop


|

**Acknowledgements**

Thanks for the help to integrate NEST Desktop on EBRAINS resources:

  - Alberto Madonna (Concepting)
  - Collin McMurtrie (Contacting)
  - Fabrice Gaillard (Concepting of user authentication)
  - Jonathan Villemaire-Krajden (Concepting)
  - Martin Jochen Eppler (Contacting)
