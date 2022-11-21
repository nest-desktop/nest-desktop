Project view
============

.. _project-view_manage-projects:

Manage projects
---------------

NEST Desktop has a project management helping you to organize your networks and network activity.
If you want to explore the network activity of the project,
you will have to start the simulation (see :ref:`usage-basic_simulate-networks`).

Top of navigation sidebar, you see a toolbar containing buttons
to create a new project (:guilabel:`+`)reload, export, import, delete or reset multiple projects.
The same options can be found in the menu (labelled :guilabel:`Projects`) in the system bar.

.. image:: /_static/img/gif/manage-projects.gif
   :align: left
   :target: #manage-projects
   :width: 320px

Creating a new project is defined
where you can construct a network from the scratch (see :ref:`usage-basic_construct-networks`).
It is useful to give project a proper name so that you can recognize your projects.

Below the search field it shows a list of the projects.
Clicking with right mouse button on a project item
shows a menu with options to reload, duplicate, export or delete a project.

It is possible to import projects from different sources.
The same holds for exporting projects:
You can choose between :guilabel:`File` (local storage), :guilabel:`GitHub` and
:guilabel:`URL` (meaning other URLS than GitHub URLs).

.. warning::
   Unless you click on the save button, the project is not stored in the database of the web page cookie
   and is lost when you reload the page!

   You should export projects that you want to keep: If you refresh your browser
   or delete the web page cookie, the project will be lost!

   Another important remark is that NEST Desktop stores only projects
   with neuronal networks in the cookie database,
   but all activity will be lost after page reload!

.. _project-view_project-menu:

Project menu
------------

TODO

.. _project-view_project-list:

Project list
------------

TODO

.. _project-view_project-bar:

Project bar
-----------

TODO

.. _project-view_network-history:

Network history
^^^^^^^^^^^^^^^

.. image:: /_static/img/gif/network-history.gif
   :align: right
   :target: #network-history

After every network changes, it automatic snapshot of the network it created
and pushed to the network history list.
With this network history you can undo or redo the network changes.
Loading a snapshot from this history is called `checkout network`.
