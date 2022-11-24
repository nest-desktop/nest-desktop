Activity chart graph
====================

.. image:: /_static/img/screenshots/activity/activity-graph.png
   :align: left
   :target: #activity-graph
   :width: 360px

The chart graph contains graphical panels organized in vertical stacks.
Chart panels are introduced specifically to explore the network activity by mouse interaction.
It uses a scatter graph to visualize spike activity and a line graph to visualize analog signals.
When you add one or more sub-panels for spike activity
it shows a histogram graph of spike times or of inter-spike intervals.

|br|

.. _activity-chart-graph_analog-signals:

Analog signals
--------------

Analog signals contain continuous quantities from the recording devices (``voltmeter`` or ``multimeter``).

In the chart graph area, it is possible to visualize analog signals statically.
Every chart panel has an own controller card fur individual customization.
Other chart models can be chosen individually for each panel
by clicking on the card toolbar in the activity controller (on the right side).

.. image:: /_static/img/screenshots/activity/activity-chart-graph-analog.png
   :target: #analog-signals

By default it shows traces of the analog signals as a function of time.
A panel with a histogram of values can be added when you select it in the :guilabel:`+ ADD PANEL` dropdown menu.

You can add more recorded signals to the panel when it comes from ``multimeter``.
Node records appear as chips in the cards, which allow you to change the colors
of the corresponding traces and bars.

|br|

.. _activity-chart-graph_spike-activity:

Spike activity
--------------

Spike events contain times and ids of the senders collected by the ``spike recorder``.

.. image:: /_static/img/screenshots/activity/activity-chart-graph-spike.png
   :target: #spike-activity

By default, a raster plot of the spike times as well as a histogram for spike times is shown.

Further panel models are:

- histogram of spike senders,
- histogram of interspike-intervals and
- histogram of coefficient of variation (:math:`CV_{ISI}`).
