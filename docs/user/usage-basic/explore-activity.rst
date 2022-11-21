Explore activity
================

.. image:: /_static/img/screenshots/activity-explorer.png
   :target: #explore-activity
   :width: 100%

The network activity is composed of neuronal properties (positions and ids of neurons)
and recorded events from recording devices.
Events can be subdivided in two groups: spike events and analog signals.
Spike events contain times and ids of the senders emitting events to the recording devices
which can be considered as collectors (``spike recorder``).
Analog signals contain continuous quantities from the recording devices
aka samplers (``voltmeter`` or ``multimeter``)
which query their targets at given time intervals.
Network activity can be explored in a :doc:`Activity graph </user/usage-advance/activity-chart-graph>` or :ref:`controller-sidebar_activity-table`.
