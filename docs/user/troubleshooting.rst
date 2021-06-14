Troubleshootings
================

Having trouble getting something working? Got a question that the rest of our docs can’t answer?
Maybe we can help with some answers to commonly asked questions and troublesome spots.


Error messages
--------------

**Server not found**

NEST Desktop cannot find the NEST Server.
It has two possible reasons:

  - NEST Desktop has wrong URL of the server. See FAQ for NEST Server below.
  - The server is down. Enter the url of the NEST Server, e.g. ``localhost:5000`` in web browser.

.. note::
  For advanced users:
  Check in terminal whether NEST Server is running (``curl localhost:5000``).


**Internal server error**

  It says that the back end (i.e, ``nest-server``) ended with an internal error.
  In this case, you have to monitor or debug the back end.

**NEST error**

  NEST Simulator produces value error, e.g. ``The value cannot be negative.``.

|
|

Frequently asked questions (FAQ)
--------------------------------

|

**NEST Server**

How can I change the URL of the NEST Server?
  In settings page you find the URL of the NEST Server.

How can I check NEST Server?
  In settings page you can click on :guilabel:`CHECK` button.
  If a chip with NEST version appears, this indicates that NEST Server is working.

|

**Project**

How can I make a new project?
  In the navigation sidebar you find a list item :guilabel:`New Project` to create a new project.

How can I duplicate a project?
  In the project toolbox you find a button to clone project.

How can I rename project?
  In the navigation sidebar you find the input field of the project name.
  There you are able to change the name of the project.

How can I save project?
  In the left navigation of the page you find a floppy disc icon to save project.

How can I delete a project?
  In the context menu of the projects (by clicking mouse right button on a project) you find method to delete.

How can I download a project?
  In the context menu of the projects (by clicking on mouse right button on a project) you find method to download.

How can I delete projects?
  In the context menu of the projects icon in navigation side bar you find a dialog to delete projects.
  Then select several projects and then delete them.

How can I download projects?
  In the context menu of the projects icon in navigation side bar you find a dialog to download projects.
  Then select several projects and then download them.

How can I upload projects?
  In the context menu of the projects icon in navigation side bar you find a dialog to upload projects.
  Then select a file or URL, it shows a list of projects.
  Select wanted project and then upload them.

How can I find data for the project in JSON format?
  When the development mode is on, clicking on the button :guilabel:`{}` for JSON you find JSON data of the current project.

|

**Network**

Where can I find network controller?
  You find network controller by clicking on an icon (:guilabel:`Network`) in right controller.
  Nodes and connections are stacked as card panels in the network controller.

How can I empty network?
  In network graph you find bottom left a trash button that empties the network.

How can I create nodes?
  In network graph you can click the right mouse button, then it appears a selector panel to select an element type of the node.

How can I connect nodes?
  In network graph you can click on connector of a source node, then move the mouse towards target node and click the target node.

How can I keep selected node to connect other nodes?
  Hold pressing :guilabel:`ALT` key before connecting nodes.

How can I (un)select node / connection?
  When a node or connection is selected you can press :guilabel:`ESC` to unselect it or in network graph you can click on node or connection to select it.
  Click on background area of the network graph or on the selected in the network controller unselect node or connection.
  An other method to (un)select is to click on node shape or connection toolbar in the network controller on the right side.

How can I colorize nodes?
  You find the method to color in the context menu of the node
  by clicking the right mouse button on node shape in network graph or node toolbar in the controller.

How can I change the color cycle of nodes?
  In the network settings you find the way to change the color cycle.

How can I delete node / connection?
  You find this method in the context menu of the node or connection
  by clicking the right mouse button on the element graph in the network graph
  or on colored toolbar in the network controller.

How can I modify parameters?
  You find a list of parameters in network controller.
  If they are not visible, switch to network selection to check the visibility of the parameters.

How can I reset all parameter value?
  In the context menu of node or connection you find the method to reset all parameters of the corresponding node or connection.

How can I reset a parameter value?
  In the context menu of a parameter (by clicking right button on a parameter) you find the method to reset parameter.
  It also shows the default value of the parameter.

How can I set inhibitory connection?
  You can set weights to negative value in the connection controller.

How can I get distribution for parameters?
  You are able to activate the distribution of the parameters in the export mode.

How can I get spatial node?
  In the context menu of the node, you can (un)set the spatial mode of the node.

How can I generate grid/free positions?
  When the node is spatial, position item will replace the population item.
  Click on position item to opens a popup of position specifications.
  Modify a value will generate positions, at the end of the panel you find a button to generate positions.

How can I generate array?
  In the context menu of the array parameters (e.g. spike times of spike generator) you find a method to generate array.

|

**Simulation**

How can I start simulation?
  Click on the :guilabel:`SIMULATE` button in top right of the page to start the simulation.

How can I stop simulation?
  Unfortunately, the option to stop simulation is not implemented.

How can I activate simulation after change?
  In the context menu of the :guilabel:`SIMULATE` button (by clicking mouse right button) you find an option to activate :guilabel:`simulation after change`.

How can I activate simulation after load?
  In the context menu of the :guilabel:`SIMULATE` button (by clicking mouse right button) you find an option to activate :guilabel:`simulation after load`.

How can I activate simulation after checkout?
  When you go to other network version of the history, it automatically starts the simulation.
  In the context menu of the :guilabel:`SIMULATE` button (by clicking mouse right button) you find an option to activate :guilabel:`simulation after checkout`.

Where can I find kernel controller of the simulation?
  The kernel controller shows by clicking on the engine icon in the right side.

Where can I set simulation time?
  You find simulation time in the kernel controller.

Where can I change time resolution of the kernel?
  You find time resolution for the NEST Simulator in the kernel controller.

.. warning::
   Please verify that the resolution of the recorders are larger than the resolution in the kernel.

Where can I change seed?
  You find seed value in the kernel controller.

How can I activate seed randomization?
  You find an option to activate seed randomization in the kernel controller.

How can I find Python scripted code of the simulation?
  In the right side you find a code symbol :guilabel:`<\>` for code editor.

|

**Activity**

How can I download activity data of a single recorder?
  In the context menu of the recorder you find a menu option to download events of this recorder.

How can I download activity data of all recorders?
  In projects dialog to download projects you find options to download activity of projects.

How can I drag/zoom the chart?
  You find modes in the mode bar (top) in activity graph.
  And click on the chart for dragging or zooming.

How can I reset to default view?
  Click on the house icon in the mode bar (top) to reset to default view.

How can I download plot of the chart?
  Click on the photo icon (top) to download plot of the chart.
  You can choose which format will be saved to file.

Where can I find activity controller?
  The controller for the animated activity is placed in the activity controller.
  You find activity controller by clicking on the `chart` icon in the stacked menu left to controller.

How can I modify bin size of the PSTH?
  In the chart controller you find tick slider to modify bin size.

How can I change the label of axes or the title?
  Click on the label of the axes or the title to change it.

How can I hide/show dots/lines?
  Click on the legend to alter the visibility of the dots/lines.

How can I stop animation?
  Go to animation controller. You find a pause icon to stop animation.

How can I increase/decrease animation speed?
  In the animation controller you find forward or backward to alter animation speed.

How can I change colorscale of dots?
  In the animation controller you find a colormap of the current colorscale.
  Next below of it you find an options to select colorscale.

How can I change size of dots?
  In the animation controller you find slider of the dot size.

How can I add trailing for dots?
  It only works in the animation of the spikes.

How can I rotate camera?
  Hold the mouse button on the animation area and then move it to rotate the camera.

How can I activate camera motion?
  In the animation controller you can increase the speed of the camera motion.

|

**Model**

What is terminology of this model?
  This model includes neuron, synapse and device (stimulus / recorder) models.

How can I read the documentation of a model?
  In the context menu of a node you find a documentation of this models.

|

**Settings**

Where can I find settings?
  You find settings by clicking on the cog icon right to navigation side bar.
  The settings are stored as 'local storage' of the browser.

How can I change settings?
  You can change settings in the settings section
  by clicking on cog icon next to navigation side bar.

How can I reset settings?
  In the loading page you can click on menu icon of the settings section to open menu.
  One of the menu item is to reset settings.

How can I reset databases?
  In the loading page you can click on menu icon of the database section to open menu.
  One of the menu item is to reset databases.

Where can I find the database?
  The databases are stored as 'Indexed DB' of the browser.

How can I switch to development view?
  In the settings of the application you find an option to switch to development view.
