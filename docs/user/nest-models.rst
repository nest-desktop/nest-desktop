NEST models
===========

This is a guide for the NEST models
(e.g. neurons, simulators or synapses) in NEST Desktop.

Below the icon for the project section, you can see the one of the model section, where you can

  - read documentation on models,
  - explore model activities or
  - edit model configurations.

|br|

Navigation list
---------------

.. image:: ../_static/img/screenshots/model-nav.png
  :align: left

Models are enlisted in the right side navigation bar.
You can select a model to read its documentation, its activity or to edit its configuration.

Above the model list you will find a search field and tags which you can use to filter models in the list.
Selected filter tags appear as chips under the search field.

In order to select a tag you need to click on the `filter` icon left to the search field.
Multiple filter tags can be applied.
Selected filter tags can be removed (click on close icon :guilabel:`x`).

|br|

Setting filter tags in the model list
-------------------------------------

It is possible to select filter tags to display only models with certain properties.
The following filter tags are available:

.. image:: ../_static/img/screenshots/models-filter-tag.png
  :align: right

Installed:
  Show models which are installed in NEST Desktop

GitHub:
  Show models which are provided in `an own GitHub repository <https://github.com/nest-desktop/nest-desktop-models>`__

Neuron/stimulator/recorder/synapse:
  Show models of the selected element type

|br|

Model menu
----------

.. image:: ../_static/img/screenshots/models-menu.png
  :align: left

By clicking the right mouse button on the model icon, a menu appears
where you can select actions for models.

|br|

Import model(s)
---------------

You can import models from various sources,
e.g. a file you uploaded from you computer, a file from a GitHub repository or from a specified URL.

.. note::
   Model files should be formatted in JSON.

When you select ``Import from GitHub``, choose an element type
and then a JSON file of your desired model group which includes all functions of synapse currents.

The table shows a list of models from which you can select which ones you want to import.

.. image:: ../_static/img/screenshots/models-import.png

|br|

||||

Documentation
-------------

.. image:: ../_static/img/screenshots/model-documentation.png

The model documentation shows a help text of a model fetched from the NEST Simulator directly.
It contains only raw text and thus, no formatted equations, tables and links.
The button :guilabel:`MORE` directs to the official (and styled) documentation of NEST Simulator.

|br|

Explore activity of a neuron model
----------------------------------

.. image:: ../_static/img/screenshots/model-activity-explorer.png
  :align: left

You can explore the activity dynamics of neuron models.
First, choose a simulation to see the neuronal response to a specific stimulus device.

Then start the simulation by clicking on the :guilabel:`Simulate` button.

You can use the code editor to see changes in activity.

.. note::
   It is important to disable the simulation with Insite.

.. image:: ../_static/img/screenshots/model-activity.png

|br|

Model editor
------------

The model editor allows you to make changes in parameter specifications,
e.g. default value, unit, label or inputs.

.. image:: ../_static/img/screenshots/model-editor.png


.. |br| raw:: html

  <div style="display: inline-block; width: 100%" />
