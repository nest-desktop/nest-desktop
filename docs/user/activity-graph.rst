Activity graph
==============


Analog signals
--------------

Analog signals contain continuous quantities from the recording devices (``voltmeter`` or ``multimeter``).

.. _chart-graph-of-analog-signals:

**Chart graph of analog signals**

The chart graph shows panels for analog signals.
An other models of the panels can be chosen
by clicking on the card toolbar in the activity controller (on the right side).

.. image:: ../_static/img/screenshots/activity-chart-graph-analog.png
  :target: #chart-graph-of-analog-signals

By default it shows traces of the analog signals as a function of time.
A panel with histogram of values can be added when you select it in :guilabel:`+ ADD PANEL` Dropdown menu.

You can add more recorded signal to the panel when it comes from ``multimeter``.
Node records appearing as chip allow you to change its colors of the traces as well as of the bars.

|

.. _animation-graph-of-analog-signals:

**Animation graph of analog signals**

It can display an animated 3D graph for the spatial network forming layers in topology
whose neurons have geographical positions.

.. image:: ../_static/img/screenshots/activity-anim-graph-analog.png
  :target: #animation-graph-of-analog-signals

Values of the analog signals can be visualized in colors of recorded targets.
Here, it shows the color map ``spectral`` for the value scales (from min to max).
You can change the color map in the select menu between input fields of min and max values.

Additionally, an other geometry model (box or sphere) can be chosen.

Just play with different specification for the animation graph.

|

Spike activity
--------------

Spike events contain times and ids of the senders collected by the ``spike recorder``.

.. _chart-graph-of-spike-activity:

**Chart graph of spike activity**

.. image:: ../_static/img/screenshots/activity-chart-graph-spike.png
  :target: #chart-graph-of-spike-activity

By default it shows raster plot of the spike times as well as a histogram for spike times.

More panel models are:

 - histogram of spike senders,
 - histogram of interspike-intervals
 - histogram of coefficient of variation (:math:`CV_{ISI}`).

|

.. _animation-graph-of-spike-activity:

**Animation graph of spike activity**

.. image:: ../_static/img/screenshots/activity-anim-graph-spike.png
  :target: #animation-graph-of-spike-activity


Spikes can be visualized as transient blob appearence in the 3D animated graph.
To better follow spike activity, trail length can be increased.

Optionally, trails can be faded after spike time,
as well as the growing or shrinking mode can be applied
