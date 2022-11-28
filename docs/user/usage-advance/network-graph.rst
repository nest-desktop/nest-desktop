Network graph
=============

.. image:: /_static/img/screenshots/network/network-graph.png
   :target: #

.. _network-graph-node-labels:

Node labels
-----------

Each node graph is labeled to identify the model of the node.
By default, it creates direct current generator (:bdg:`dc`) for a stimulus
and a voltmeter (:bdg:`vm`) for a recording device.
Neurons are just labeled with :bdg:`n`.
You can find the full label of the node model in the network controller.

|br|

.. _network-graph-node-colors:

Node colors
-----------

.. image:: /_static/img/screenshots/network/node-shapes.png
   :align: right
   :target: #node-colors

Nodes and connections contain parameter configurations
which are displayed in the controller panel in the side navigation.
The color of nodes helps you to associate the network graph with the controller
as well as the corresponding visualization of the network activity.
The color of lines is defined by the source node.

|br|

.. _network-graph-node-shapes:

Node shapes
-----------

The specific shape defines an element type of a node:

:Hexagon: A stimulus device alias stimulator is an instrument
  which only produces signals towards target nodes.
:Parallelogram: A recording device alias recorder is also an instrument
  which observes states of a recordable node.
:Others: A neuron node is the core engine of a neuronal network model
  which received inputs from other nodes and produces specific output using intrinsic equation. For more information about neuron shapes, see the next section.

|br|

.. _network-graph-neuron-shapes:

Neuron shapes
-------------

.. image:: /_static/img/screenshots/network/neuron-shapes.png
   :align: right
   :target: #neuron-shapes

The shape of neurons is represented differently by the set of synaptic weights of their connections.

:Square: Neurons without connections or mixed (positive and negative) synaptic weights to neurons
:Triangle: Neurons with excitatory connections to neurons (all synapse weights are positive)
:Circle: Neurons with inhibitory connections to neurons (all synapse weights are negative)
