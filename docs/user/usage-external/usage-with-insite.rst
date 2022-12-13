Simulate with Insite
====================


.. image:: /_static/img/gif/external-insite.gif
   :align: left
   :alt: Insite
   :target: #

This is a guide to show how to use NEST Desktop with Insite.

Insite is a recording backend module which is also integrated in NEST Simulator.
Basically, with Insite neuronal or network activity can be observed during the simulation.

|br|

.. note::
   Simulation with Insite needs to be run with Insite docker images
   :bdg:`nest-module` and :bdg:`access-node`.
   The best method is to use Docker Compose, which also deploys NEST Desktop and Insite.
   For more information, please read the :doc:`deployment guide of Insite </deployer/deploy-docker-compose-insite>`.

|br|

.. _usage-with-insite-check-if-insite-is-running:

Check if Insite is running
--------------------------

.. image:: /_static/img/screenshots/external/settings-insite.png
   :align: left
   :target: #check-if-insite-is-running

In the settings page you can check whether the Insite backend is running.

|br|

.. _usage-with-insite-enable-simulation-with-insite:

Enable simulation with Insite
-----------------------------

.. image:: /_static/img/screenshots/external/code-editor-toolbar-insite.png
   :align: right
   :target: #enable-simulation-with-insite

After successfully receiving a ping from the Insite Access node of the backend,
you can activate the button :bdg:`Insite` in the toolbar of the code editor
(second from left).

|br|

.. _usage-with-insite-script-code-for-simulation-with-insite:

Script code for simulation with Insite
--------------------------------------

The Insite module has to be loaded in the NEST kernel.
Preferentially load the :bdg:`insitemodule` directly after importing NEST:

.. code-block:: python

   nest.Install('insitemodule')


Next, the parameter :bdg:`record_to` of any recording device
(e.g. :bdg:`spike recorder`, :bdg:`multimeter` or :bdg:`voltmeter`) has to been modified:

.. code-block:: python

   ...
   recorder.set({"record_to": "insite"})
   ...


Now, the Insite recording module collects activity events from the modified recording devices.
The client receives activity from the Insite Access Node on another port (default: ``8080``).

.. seeAlso::
   For more information about Insite, please visit the official
   `documentation of Insite <https://vrgrouprwth.github.io/insite/>`__ from the VR Group of RWTH Aachen.

|br|

Acknowledgements
----------------

Thanks for integrating Insite in NEST Simulator and NEST Desktop:

- Simon Oehrl (Conceptual design for Insitufication in NEST Desktop)
- Marcel Krüger (Collaboration of Insitufication in NEST Desktop)
