Activity animation graph
========================

It displays animated 3D graph for the spatial network
forming layers in topology whose neurons have geographical positions.

.. _activity-animation-graph-analog-signals:

Analog signals
--------------

Analog signals contain continuous quantities from the recording devices (``voltmeter`` or ``multimeter``).

It is possible to display an animated 3D graph for the spatial network forming layers in topology
whose neurons have geographical positions.

.. image:: /_static/img/screenshots/activity/activity-anim-graph-analog.png
   :target: #analog-signals

|br|

Values of the analog signals can be visualized using the colors of recorded targets.
Here, it shows the color map ``spectral`` for the value scales (from min to max).
You can change the color map in the dropdown menu between the input fields of the min and max values.

Additionally, an other geometry model (box or sphere) can be chosen.

We recommend trying out many different options
for the animation graph to find the best representation,
as the optimal ones depend heavily on the simulation data
and the intended use of the visualization.

|br|

.. _activity-animation-graph-spike-activity:

Spike activity
--------------

Spike events contain times and ids of the senders collected by the ``spike recorder``.

.. image:: /_static/img/screenshots/activity/activity-anim-graph-spike.png
   :target: #spike-activity

|br|

Spikes can be visualized as transient blobs appearing in the 3D animated graph.
To follow spike activity better, the trail length can be increased.

Optionally, trails can be faded after the spike time,
and a growing or shrinking mode can also be applied.
