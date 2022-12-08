|axis-arrow| Activity animation graph
=====================================

It displays animated 3D graph for the spatial network
forming layers in topology whose neurons have geographical positions.

.. seeAlso::
   - :ref:`Use controller for activity graph<controller-sidebar-activity-animation-controller>`

.. _activity-animation-graph-analog-signals:

Analog signals
--------------

.. image:: /_static/img/screenshots/activity/activity-anim-graph-analog.png
   :align: left
   :target: #analog-signals

Analog signals contain continuous quantities from the recording devices (:bdg:`voltmeter` or :bdg:`multimeter`).

It is possible to display an animated 3D graph for the spatial network forming layers in topology
whose neurons have geographical positions.

Each box represents a neuron in its geographical position.
Values of the analog signals can be visualized using the colors of recorded event
(Here, it shows the color map :bdg:`spectral`).

|br|

.. _activity-animation-graph-spike-activity:

Spike activity
--------------

.. image:: /_static/img/screenshots/activity/activity-anim-graph-spike.png
   :align: left
   :target: #spike-activity

Spike events contain times and ids of the senders collected by the :bdg:`spike recorder`.

Spikes can be visualized as transient blobs appearing in the 3D animated graph.
To follow spike activity better, the trail length can be increased.

Optionally, trails can be faded after the spike time,
and a growing or shrinking mode can also be applied.

.. |axis-arrow| image:: /_static/img/icons/axis-arrow.svg
   :alt: axis-arrow
   :height: 60px
   :target: #
