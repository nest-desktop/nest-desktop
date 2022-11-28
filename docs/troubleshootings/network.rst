.. faq-network:

Network
=======

Where can I find the network controller?
   You will find the network controller by clicking on the network icon (|network|) in the right controller.
   Models, nodes and connections are stacked as card panels in the network controller.

   .. seeAlso::
      - :ref:`controller-sidebar-network-controller`

How can I empty a network?
   In the network graph you will find top right a trash button that empties the network.

   .. seeAlso::
      - :doc:`/user/usage-advance/network-graph`


How can I create nodes?
   In the network graph you can click with the right mouse button,
   then a selector panel appears to select an element type of the new node.

   .. seeAlso::
      - :ref:`Create nodes in the usage guide <usage-basic-create-nodes>`

How can I connect nodes?
   In the network graph you can click on the connector of a source node,
   then move the mouse towards the target node and click on the target node.

   .. seeAlso::
      - :ref:`Connect nodes in the usage guide <usage-basic-connect-nodes>`

How can I connect a node with multiple nodes?
   Hold down the :bdg:`ALT` key when clicking on the target nodes.

How can I (un)select a node / a connection?
   When a node or connection is selected you can press :bdg:`ESC` to unselect it
   or in network graph you can click on another node
   or connection to select it (and to remove the selection of the former one).

   Click on the background area of the network graph
   or on the selected entry in the network controller to unselect a node or connection.
   An other method to (un)select is to click on the node label
   or the connection toolbar in the network controller on the right side again.

How can I colorize nodes?
   You will find the method to color in the context menu of the node
   by clicking with the right mouse button on the node shape in the network graph
   or the node toolbar in the controller.

How can I change the color cycle of nodes?
   In the network settings you will find the way to change the color cycle.

How can I delete node / connection?
   You will find this method in the context menu of the node or connection
   by clicking with the right mouse button on the element graph in the network graph
   or on the colored toolbar in the network controller.

How can I change the node model?
   You can click on model name twice and it opens a dropdown displaying models.

   .. seeAlso::
      - :ref:`Change node model in network controller <usage-basic-select-model-and-parameters>`.

How can I modify parameters?
   You will find a list of parameters in the network controller.
   If they are not visible, click on the model selection to check the visibility of the parameters.

   .. seeAlso::
      - :ref:`Modify parameters in the controller <usage-basic-select-model-and-parameters>`.

How can I reset all parameter values?
   In the context menu of a node or connection you will find the method
   to reset all parameters of the corresponding node or connection.

How can I reset a parameter value?
   In the context menu of a parameter (by clicking right button on a parameter)
   you can find the method to reset a parameter.
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
   Modifying a value will generate positions, at the end of the panel
   you will find a button to generate positions.

How can I generate an array?
   In the context menu of the array parameters (e.g. the spike times of a spike generator)
   you will find a method to generate an array.

.. |network| image:: /_static/img/icons/network.svg
   :alt: network
   :height: 17.6px
   :target: #
