Model view
==========

Left sidebar
------------

In this view you can manage your models.
The left sidebar shows a list of the available models.
You can search the models list in the search bar on top of the list.
Below the search bar, you have the possibility to select the following filter options regarding node type and model source:

Installed
  selects only models which are installed locally
GitHub
  selects only models which are available on GitHub
Neuron
  selects all neuron models
Stimulator
  selects all stimulator models
Recorder
  selects all recorder models
Synapse
  selects all synapse models


Please be aware that the model source filters work like a logical AND, while the node type filters work like a logical OR.
The node and source filters are combined with a logical AND (e.g. "(Installed AND GitHub) AND (Neuron OR Simulator)").

Center area
-----------

The center area displays the content for the model.
The bar on top contains three selectors on the left side,
which allow to switch between different content for the center area:

DOC
  model documentation (section contains a reference to the content within the NEST documentation in the upper right corner)
EXPLORER
  diagram(s) of the simulation results for an exemplary network containing this model (code can be found in the right sidebar)
EDITOR
  input fields to adjust all parameter settings, including value, value range, displayed unit and label, but also the settings for the input field in NEST Desktop

Right sidebar
-------------

Here you find the following three icon buttons in the sidebar to dislay these information:

Defaults
  default values for all parameters (even for some which cannot be altered in NEST Desktop)
Model
  input fields to change the parameter values (options can be adjusted in the "EDITOR" section of the center area)
Code
  code for the exemplary network which is used to generate the diagrams in the "EXPLORER" section of the center area