Troubleshootings
================

Having trouble getting something working? Got a question that the rest of our docs can’t answer?
Maybe we can help with some answers to commonly asked questions and troublesome spots.


Error messages
--------------

**Server not found**

NEST Desktop cannot find the NEST Simulator.
It has two possible reasons:

  - NEST Desktop has a wrong URL under which it tries to contact the server. See the FAQ for NEST Simulator below.
  - The server is down. Contact the server operators and enter the URL of the NEST Simulator, e.g. ``localhost:5000`` in a web browser to check if it is running again.

.. note::
  For advanced users:
  Check in a terminal whether NEST Simulator is running (``curl localhost:5000``).


**Internal server error**

  It says that the back end (i.e, ``nest-server``) ended with an internal error.
  In this case, you have to monitor or debug the back end.

**NEST error**

  NEST Simulator produces a value error, e.g. ``The value cannot be negative.``.
  Please have a look at the official `NEST documentation <https://nest-simulator.readthedocs.io/en/latest/>`__ to obtain the correct syntax for the commads.

|
|

Frequently asked questions (FAQ)
--------------------------------

|

**NEST Simulator**

How can I change the URL of the NEST Simulator?
  On the settings page you can find the URL of the NEST Simulator.

How can I check NEST Simulator?
  On the settings page you can click on :guilabel:`CHECK` button.
  If a chip with NEST version appears, this indicates that NEST Simulator is working.

|

**Project**

How can I make a new project?
  In the navigation sidebar you will find a list item :guilabel:`New Project` to create a new project.

How can I duplicate a project?
  In the project toolbox you will find a button to clone project.

How can I rename a project?
  In the navigation sidebar you will find the input field of the project name.
  There you are able to change the name of the project.

How can I save a project?
  In the left navigation of the page you will find a floppy disc icon to save a project.

How can I delete a project?
  In the context menu of the projects (by clicking with the mouse right button on a project) you will find a method to delete a project.

How can I download a project?
  In the context menu of the projects (by clicking with the mouse right button on a project) you will find a method to download a project.

How can I delete multiple projects at once?
  In the context menu of the projects icon in the navigation side bar you will find a dialog to delete projects.
  Then select several projects and delete them.

How can I download multiple projects at once?
  In the context menu of the projects icon in the navigation side bar you will find a dialog to download projects.
  Then select several projects and download them.

How can I upload projects?
  In the context menu of the projects icon in navigation side bar you find a dialog to upload projects.
  Then select a file or URL, it shows a list of projects.
  Select wanted project and then upload them.

Where can I find the data for the project in JSON format?
  When the development mode is enabled, clicking on the button :guilabel:`{}` (on which the prominent brackets used in JSON are shown) you will find the JSON data of the current project.

|

**Network**

Where can I find the network controller?
  You will find the network controller by clicking on the icon (:guilabel:`Network`) in the right controller.
  Nodes and connections are stacked as card panels in the network controller.

How can I empty a network?
  In the network graph you will find top right a trash button that empties the network.

How can I create nodes?
  In the network graph you can click with the right mouse button, then a selector panel appears to select the element type of the new node.

How can I connect nodes?
  In the network graph you can click on the connector of a source node, then move the mouse towards the target node and click on the target node.

How can I connect a node with multiple nodes?
  Hold down the :guilabel:`ALT` key when clicking on the target nodes.

How can I (un)select a node / a connection?
  When a node or connection is selected you can press :guilabel:`ESC` to unselect it or in network graph you can click on another node or connection to select it (and to remove the selection of the former one).
  Click on the background area of the network graph or on the selected entry in the network controller to unselect a node or connection.
  An other method to (un)select is to click on the node label or the connection toolbar in the network controller on the right side again.

How can I colorize nodes?
  You will find the method to color in the context menu of the node by clicking with the right mouse button on the node shape in the network graph or the node toolbar in the controller.

How can I change the color cycle of nodes?
  In the network settings you will find the way to change the color cycle.

How can I delete node / connection?
  You will find this method in the context menu of the node or connection by clicking with the right mouse button on the element graph in the network graph or on the colored toolbar in the network controller.

How can I modify parameters?
  You will find a list of parameters in the network controller.
  If they are not visible, click on the model selection to check the visibility of the parameters.

How can I reset all parameter values?
  In the context menu of a node or connection you will find the method to reset all parameters of the corresponding node or connection.

How can I reset a parameter value?
  In the context menu of a parameter (by clicking right button on a parameter) you can find the method to reset a parameter.
  It also shows the default value of the parameter.

How can I set a connection to "inhibitory"?
  You can assign a negative value to the weights in the connection controller.

How can I get the distribution for parameters?
  You are able to activate the distribution of the parameters in the export mode.

How can I get a spatial node?
  In the context menu of the node, you can (un)set the spatial mode of the node.

How can I generate grid/free positions?
  When the node is spatial, a position item will replace the population item.
  Click on the position item to open a popup of the position specifications.
  Modifying a value will generate positions, at the end of the panel you will find a button to generate positions.

How can I generate an array?
  In the context menu of the array parameters (e.g. the spike times of a spike generator) you will find a method to generate an array.

|

**Simulation**

How can I start a simulation?
  Click on the :guilabel:`SIMULATE` button in top right of the page to start the simulation.

How can I stop a simulation?
  Unfortunately, the option to stop simulation is not implemented.

How can I activate "simulation after change"?
  In the context menu of the :guilabel:`SIMULATE` button (by clicking it with the right mouse right button) you will find an option to activate :guilabel:`simulation after change`.

How can I activate "simulation after load"?
  In the context menu of the :guilabel:`SIMULATE` button (by clicking it with the right mouse button) you will find an option to activate :guilabel:`simulation after load`.

How can I activate "simulation after checkout"?
  When you go to another network version of the history, it automatically starts the simulation.
  In the context menu of the :guilabel:`SIMULATE` button (by clicking it with the right mouse button) you will find an option to activate :guilabel:`simulation after checkout`.

Where can I find the kernel controller of the simulation?
  The kernel controller can be shown by clicking on the engine icon on the right side.

Where can I set the simulation time?
  You will find the simulation time in the kernel controller.

Where can I change the time resolution of the kernel?
  You will find the time resolution for the NEST Simulator in the kernel controller.

.. warning::
   Please verify that the resolution of the recorders are larger than the resolution in the kernel!

Where can I change the seed?
  You can find the seed value in the kernel controller.

How can I activate the seed randomization?
  You can find an option to activate the seed randomization in the kernel controller.

How can I find the Python script code of the simulation?
  On the right side you can find a code symbol :guilabel:`<\>` opening the code editor.

|

**Activity**

How can I download the activity data of a single recorder?
  In the context menu of the recorder you will find a menu option to download the events of this recorder.

How can I download activity data of all recorders?
  In the projects dialog to download projects you can find options to download the activity of projects.

How can I drag/zoom the chart?
  You will find those modes in the mode bar (top) in the activity graph.
  For dragging or zooming, simple click on the chart.

How can I reset the view to the default one?
  Click on the house icon in the mode bar (top) to reset the view to the default one.

How can I download plot of the chart?
  Click on the photo icon (top) to download the plot of the chart.
  You can choose which format will be used.

Where can I find activity controller?
  The controller for the animated activity is placed in the activity controller.
  You can find the activity controller by clicking on the `chart` icon on the right side.

How can I modify the bin size of the PSTH?
  In the chart controller you will find tick slider to modify the bin size.

How can I change the labeling of axes or the title?
  Click on the label of the axe or the title to change it.

How can I hide/show dots/lines?
  Click on the legend to alter the visibility of the dots/lines.

How can I stop an animation?
  Go to the animation controller. You will find a pause icon to stop the animation.

How can I increase/decrease the animation speed?
  In the animation controller you will find a forward or backward button to alter the animation speed.

How can I change the colorscale of dots?
  In the animation controller you will find a colormap of the current colorscale.
  A little below you will find an options to select the colorscale.

How can I change the size of dots?
  In the animation controller you can find a slider to adjust the dot size.

How can I add a "trailing" effect for dots?
  It only works with the animation of the spikes.

How can I rotate camera?
  Click and hold the (left) mouse button on the animation area and then move it around to rotate the camera.

|

**Model**

What is the terminology of this model?
  This model includes neuron, synapse and device (stimulus / recorder) models.

How can I read the documentation of a model?
  In the context menu of a node you will find a documentation of these models.

|

**Settings**

Where can I find the settings?
  You will find settings by clicking on the cog icon on the left in the navigation side bar.
  The settings are stored in the 'local storage' of the browser.

How can I change settings?
  You can change settings in the settings section by clicking on cog icon next to navigation side bar.

Where can I find the databases?
  The databases are stored as the 'Indexed DB' of the browser.

How can I switch to the development view?
  In the settings of the application you will find an option to switch to the development view.
