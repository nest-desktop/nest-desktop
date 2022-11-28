Synapse model
=============

NEST Desktop is able to apply synapse models in the connections between neurons.
Here, we show steps how to observe neuronal activity in aspect of short-term plasticity and how to measure synaptic weights.

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

After you initially build the neurons with their connections, you can select another synapse model (Here: :bdg:`Tsodyks synapse`).
Configure the parameter values for facilitating or depressing synapse.

|br|

.. _synapse-model-observe-effects-of-short-term-synapses:

Observe effects of short-term synapses
--------------------------------------

.. image:: /_static/img/screenshots/synapse/neuronal-activity-tsodyks.png
   :align: left
   :height: 450px
   :target: #observe-effects-of-short-term-synapses

After the simulation you might register changes of PSP of neurons receiving spike inputs from other neuron via non-static synapses.

|br|

.. _synapse-model-measure-synaptic-weights:

Measure synaptic weights
------------------------

.. image:: /_static/img/screenshots/synapse/copied-synapse-model.png
   :align: right
   :target: #measure-synaptic-weights

Weight recorder is not a typical recorder like others.
It can only assigned to a synapse model to measure its weight.

First, import :bdg:`WEIGHT RECORDER` from GitHub.
You need to copy synapse model whose weight should be recorded.
Select copied synapse model for a connection between neurons.

Create a node with :bdg:`WEIGHT RECORDER` and connect to a connection
(Use target connection instead of target node).
You can see in the copied synapse model that it is assigned to :bdg:`WEIGHT RECORDER`.

.. image:: /_static/img/screenshots/synapse/weight-recorder-graph.png
   :align: left

|br|

After the simulation, add a new panel showing only weights.

.. image:: /_static/img/screenshots/synapse/weight-recorder.png
