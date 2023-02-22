Synapse model
=============

NEST Desktop is able to apply synapse models to the connections between neurons.
Here, we show the steps how to observe neuronal activity in aspect of short-term plasticity and how to measure synaptic weights.

.. _synapse-model-import-synapse-model:

Import synapse model
--------------------

First, you have to import synapse models.

.. seeAlso::
   - :ref:`Import models in dialog <model-view-model-dialog>`

|br|

.. _synapse-model-connect-neurons-with-non-static-synapse:

Connect neurons with non-static synapse
---------------------------------------

.. image:: /_static/img/screenshots/synapse/tsodyks-synapse-controller.png
   :align: right
   :target: #connect-neurons-with-non-static-synapse

After you have initially built the neurons with their connections, you can select another synapse model (Here: :bdg:`Tsodyks synapse`).
Configure the parameter values for facilitating or depressing the synapse.

|br|

.. _synapse-model-observe-effects-of-short-term-synapses:

Observe effects of short-term synapses
--------------------------------------

.. image:: /_static/img/screenshots/synapse/neuronal-activity-tsodyks.png
   :align: left
   :height: 450px
   :target: #observe-effects-of-short-term-synapses

After the simulation you might register changes of PSP of neurons receiving spike inputs from other neurons via non-static synapses.

|br|

.. _synapse-model-measure-synaptic-weights:

Measure synaptic weights
------------------------

.. image:: /_static/img/screenshots/synapse/copied-synapse-model.png
   :align: right
   :target: #measure-synaptic-weights

A weight recorder is not a typical recorder like others.
It can only be assigned to a synapse model to measure its weight.

First, import :bdg:`WEIGHT RECORDER` from GitHub.
You need to copy the synapse model whose weight should be recorded.
Select the copied synapse model for an existing connection between neurons.

Create a node with :bdg:`WEIGHT RECORDER` and connect it to a connection
(use the connection as the target instead of a node).
You can see in the copied synapse model that it is assigned to :bdg:`WEIGHT RECORDER`.

.. image:: /_static/img/screenshots/synapse/weight-recorder-graph.png
   :align: left

|br|

After the simulation, add a new panel showing only weights.

.. image:: /_static/img/screenshots/synapse/weight-recorder.png
