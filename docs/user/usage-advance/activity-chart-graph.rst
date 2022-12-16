Activity chart graph
====================

The chart graph contains graphical panels organized in vertical stacks.
Chart panels are introduced specifically to explore the network activity by mouse interaction.
The simulation produces two different types of data sets.
Spike events (recorded by :bdg:`spike recorder`) contain times and sender ids whereas analog signals contain continuous quantities from the recording devices (:bdg:`voltmeter` or :bdg:`multimeter`).

.. seeAlso::
   :ref:`Use controller for activity graph<controller-sidebar-activity-chart-controller>`

|br|

.. _activity-chart-graph-analog-signals:

|chart-line| Analog signals
---------------------------

.. image:: /_static/img/screenshots/activity/activity-chart-graph-step-input.png
   :align: left
   :target: #chart-line-analog-signals

By default, it displays a line trace of the membrane potential.

|br|

.. image:: /_static/img/screenshots/activity/activity-chart-graph-noise.png
   :align: left
   :target: #chart-line-analog-signals

With noise input (:bdg:`noise generator`), it shows noise behavior (fluctuation) of membrane potentials and histogram of distributed values.

|br|

.. _activity-chart-graph-spike-activity:

|chart-scatter-plot| Spike activity
-----------------------------------

.. image:: /_static/img/screenshots/activity/activity-chart-graph-spike.png
   :align: left
   :target: #chart-scatter-plot-spike-activity

By default, it displays a raster plot of the spike times as well as a time histogram of spikes.

|br|

.. image:: /_static/img/screenshots/activity/activity-chart-graph-spike-value-histogram.png
   :align: left
   :target: #chart-scatter-plot-spike-activity

It displays value histogram of inter-spike interval (ISI) as well as of coefficient of variation (CV of ISI) for the population.

|br|

.. image:: /_static/img/screenshots/activity/activity-chart-graph-spike-sender-histogram.png
   :align: left
   :target: #chart-scatter-plot-spike-activity

It displays spike count, average Inter-spike interval (ISI) and coefficient of variation (CV of ISI) for each sender, e.g. neuron.


.. |chart-line| image:: /_static/img/icons/chart-bell-curve-cumulative.svg
   :alt: chart-line
   :height: 32px
   :target: #

.. |chart-scatter-plot| image:: /_static/img/icons/chart-scatter-plot.svg
   :alt: chart-scatter-plot
   :height: 32px
   :target: #
