Controller sidebar
==================

Network controller
------------------


Kernel settings
---------------

.. image:: /_static/img/screenshots/kernel-settings.png
   :align: right
   :target: #kernel-settings
   :width: 360px

The simulation parameters can be adjusted in the right sidebar.
They are contained in the NEST Simulator code (more information below),
so they will be passed to the NEST Simulator
whenever a simulation is started.
In the Kernel settings, the slider 'local number of threads' allows to set
the number of processes used by the NEST Simulator.
Please be aware that the shown number of threads does not match the number
of processors used by the NEST Simulator machine.
Therefore, selecting a number that is too large could lead to freezes on
the NEST Simulator machine.

It is possible to select the simulation resolution.
Here, you should be aware of the created load on the NEST Simulator as well:
small values for the resolution size create many calculations and data points.
Therefore, selecting small values for the simulation resolution can lead to
freezes and lags, so please be patient when you choose a small number. :)

The seed of the random number generator can also be chosen.
It is possible to choose a randomized seed.

The simulation time can be set as well (in Milliseconds).

|br|

.. _controller-sidebar_code-editor:

Code editor
-----------

.. image:: /_static/img/screenshots/code-editor.png
   :align: right
   :target: #code-editor
   :width: 360px

NEST Desktop generates textual code from the constructed network.
The generated code can be executed in any Python interpreter.
This way, the code semantics of the NEST Simulator is understandable and easily to learn.

The graphical representatives of the nodes deliver arguments to the block of the ``nest.Create(*)`` function.
Next, connections supply a specification for the block of the ``nest.Connect(*)`` function.
The function ``nest.Simulate(*)`` triggers the simulation of your constructed network.
All recording nodes fill a block to collect activities containing neuronal properties,
e.g. node ids and positions, and activity events.

|br|

.. _controller-sidebar_activity-controller:

Activity controller
-------------------

|br|

.. _controller-sidebar_activity-table:

Activity table
--------------

.. image:: /_static/img/screenshots/activity-table.png
   :align: right
   :target: #activity-table
   :width: 320px

You can go to the table by clicking on the :guilabel:`Stats` button.

It displays multiple panels for each recording device.
In each panel a table shows activity statistics of recorded elements (rows) of a node (population)..

In spike events, the columns show the spike counts, mean and
standard deviation of :math:`ISI` (inter-spike interval)
as well as :math:`CV_{ISI}` (Coefficient of variation in inter-spike interval).

In analog signals (e.g. membrane potentials), the columns show the mean
and standard deviation of the values.
