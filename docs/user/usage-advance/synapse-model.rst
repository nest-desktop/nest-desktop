Synapse model
=============

NEST Desktop is able to apply synapse models in the connections between neurons.
Here, we show steps how to observe neuronal activity in aspect of short-term plasticity and how to measure synaptic weights.

.. _synapse-model_import-synapse-model:

Import synapse model
--------------------

First, you have to import synapse models.
Go to the model view and find your desired synapse model.
Next, click on three dots, then select a menu item to import it from GitHub.
For more information to import models, please read the guide :ref:`import-models`.


.. _synapse-model_connect-neurons-with-non-static-synapse:

Connect neurons with non-static synapse
---------------------------------------

.. image:: /_static/img/screenshots/tsodyks-synapse-controller.png
   :align: right
   :target: #connect-neurons-with-non-static-synapse

After you initially build the neurons with their connections, you can select another synapse model (Here: Tsodyks synapse).
Configure the parameters for facilatating or depressing synapse.

|br|

.. _synapse-model_observe-effects-of-short-term-synapses:

Observe effects of short-term synapses
--------------------------------------

.. image:: /_static/img/screenshots/neuronal-activity-tsodyks.png
   :align: left
   :height: 450px
   :target: #observe-effects-of-short-term-synapses

After the simulation you might register changes of PSP of neurons receiving spike inputs from other neuron via non-static synapses.

|br|

.. _synapse-model_measure-synaptic-weights:

Measure synaptic weights
------------------------

.. image:: /_static/img/screenshots/copied-synapse-model.png
   :align: right
   :target: #measure-synaptic-weights

Weight recorder is not a typical recorder like others.
It can only assigned to a synapse model to measure its weight.

First, import weight recorder from GitHub.
You need to copy synapse model whose weight should be recorded.
Select copied synapse model for a connection between neurons.

Create a node for weight recorder and connect to a connection.
You can see in the copied synapse model that it is assigned to weight recorder.

.. image:: /_static/img/screenshots/weight-recorder-graph.png
   :align: left

|br|

After the simulation, add a new panel showing only weights.

.. image:: /_static/img/screenshots/weight-recorder.png
