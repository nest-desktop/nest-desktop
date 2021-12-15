Usage Guide with Insite
=======================

This is a guide to show how to use NEST Desktop with Insite.


Insite is a recording backend module which is also integrated in NEST Simulator.
Basically, with Insite neuronal or network activity can be observed during the simulation.

The Insite functionality in NEST can be activated with this command:

.. code-block:: python

  nest.Install('insitemodule')

Next, set recording devices with this certain specification:

.. code-block:: python

  {'record_to': 'insite'}.

Now, Insite receives activity events from these recording devices.
The client can fetch activity from the Access Node of Insite on another port (default: 8080).
