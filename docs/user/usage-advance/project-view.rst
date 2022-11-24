Project view
============

.. _project-view_manage-projects:

Manage projects
---------------

.. image:: /_static/img/screenshots/project/project-nav.png
   :align: left
   :target: #manage-projects

NEST Desktop has a project management helping you to organize your networks and network activity.
If you want to explore the network activity of the project,
you will have to start the simulation (see :ref:`usage-basic_simulate-networks`).

Top of navigation sidebar, you see a toolbar containing buttons
to create a new project (|new|) as well as to reload (|reload|), export (|export|), import (|import|), delete (|delete-projects|) or reset (|reset|) multiple projects.

.. warning::
   You should export projects that you want to keep: If you refresh your browser
   or delete the web page cookie, the project will be lost!

Creating a new project is defined where you can construct a network from the scratch
(see :ref:`usage-basic_construct-networks`).

|br|

.. _project-view_project-menu:

Projects menu
^^^^^^^^^^^^^

.. image:: /_static/img/screenshots/project/projects-menu.png
   :align: left
   :target: #projects-menu


The projects menu will be displayed when the user clicks the :guilabel:`PROJECTS` in the system bar (top black bar).
An opened project menu shows the same options which are displayed as buttons in the toolbar.

In the menu you find options to create a new project (|new|) as well as to reload (|reload|), export (|export|), import (|import|), delete (|delete-projects|) or reset (|reset|) multiple projects.


|br|

.. _project-view_project-list:

Project list
^^^^^^^^^^^^

.. image:: /_static/img/screenshots/project/project-menu.png
   :align: left
   :target: #project-list

Below the buttons you find the search field and a list of the projects.
Select a project to load it for the usage.
Once a project is loaded, a save icon (|save-ok|) appears on the right side.
You can move the mouse on the project item, it shows three vertical dots (|vertical-dots|)
for a menu with options to rename (|rename|), unload (|unload|), reload (|reload|), duplicate (|duplicate|), export (|export|) or delete (|delete|) this project.

.. warning::
   Unless you click on the save button, the project is not stored in the database of the
   web page cookie and is lost when you reload the page!

   Another important remark is that NEST Desktop stores only projects
   with neuronal networks in the cookie database,
   but all activity will be lost after page reload!

.. _project-view_project-bar:

Project dialog
^^^^^^^^^^^^^^

It is possible to import projects from different sources: You can choose between :guilabel:`drive` (local storage), :guilabel:`GitHub` and
:guilabel:`URL` (other one than GitHub URLs).

.. image:: /_static/img/screenshots/project/projects-import.png
   :target: #project-dialog

||||

Also you are able to export multiple projects. The selection checkbox appears when the project is loaded (Click on validate box).

.. image:: /_static/img/screenshots/project/projects-export.png
   :target: #project-dialog

||||

|br|

Project bar
-----------

.. image:: /_static/img/screenshots/project/project-bar.png
   :target: #project-bar

The project bar contains content tabs (network editor, activity explorer and lab book), the project name, the network history and the simulation button.

.. tip:: It is useful to give project a proper name so that you can recognize your projects.

.. _project-view_network-history:

Network history
^^^^^^^^^^^^^^^

.. image:: /_static/img/gif/network-history.gif
   :align: right
   :target: #network-history

After every network changes, it pushed a snapshot of the current network to the history list.
With the network history you can undo or redo the network changes.
Loading a snapshot from this history is called `checkout network`.


.. |delete-projects| image:: /_static/img/icons/trash-can-outline.svg
   :alt: delete projects
   :height: 17.6px
   :target: #

.. |delete| image:: /_static/img/icons/delete.svg
   :alt: delete
   :height: 17.6px
   :target: #

.. |duplicate| image:: /_static/img/icons/content-duplicate.svg
   :alt: duplicate
   :height: 17.6px
   :target: #

.. |export| image:: /_static/img/icons/export.svg
   :alt: export
   :height: 17.6px
   :target: #

.. |import| image:: /_static/img/icons/import.svg
   :alt: import
   :height: 17.6px
   :target: #

.. |new| image:: /_static/img/icons/plus.svg
   :alt: plus
   :height: 17.6px
   :target: #

.. |reload| image:: /_static/img/icons/reload.svg
   :alt: reload
   :height: 17.6px
   :target: #

.. |rename| image:: /_static/img/icons/pencil-outline.svg
   :alt: rename
   :height: 17.6px
   :target: #

.. |reset| image:: /_static/img/icons/database-refresh-outline.svg
   :alt: reset
   :height: 17.6px
   :target: #

.. |save-ok| image:: /_static/img/icons/content-save-check-outline.svg
   :alt: save-ok
   :height: 17.6px
   :target: #

.. |unload| image:: /_static/img/icons/power.svg
   :alt: unload
   :height: 17.6px
   :target: #

.. |vertical-dots| image:: /_static/img/icons/dots-vertical.svg
   :alt: vertical-dots
   :height: 17.6px
   :target: #
