Use NEST Desktop with ViSimpl
=============================

.. image:: /_static/img/gif/external-visimpl.gif
   :align: left
   :alt: ViSimpl
   :target: #

ViSimpl visualizes neural activity from brain simulation data.
It displays spike activity in space and can be co-used with NEST Desktop.

.. seeAlso::
   For this approach, we need to run the simulation with Insite as recording backend.

   When you want to learn how to use NEST Desktop with Insite,
   please read :doc:`/user/usage-external/simulate-with-insite`.

|br|

.. _usage-with-visimpl-preparation:

Preparation
-----------

First, download the Docker Compose configuration file for NEST Desktop and Insite.

.. code-block:: bash

   wget https://raw.githubusercontent.com/nest-desktop/nest-desktop-docker/main/examples/insite/docker-compose.yml

Then, pull the docker images using Docker Compose.

.. code-block:: bash

   docker-compose pull

Afterwards, you can start NEST Desktop (with Insite).

.. code-block:: bash

   docker-compose up

||||

For ViSimpl, download the (binary) AppImage from the `page <https://vg-lab.es/visimpl/#downloads>`__,
make it executable and then open it.

.. code-block:: bash

   VERSION=1.8.3
   wget https://vg-lab.es/apps/visimpl/latest-release/visimpl-$VERSION-x86_64.AppImage
   chmod +x visimpl-$VERSION-x86_64.AppImage
   ./visimpl-$VERSION-x86_64.AppImage

.. hint::
   You can place NEST Desktop and ViSimpl side by side to see them both.


|br|

.. _usage-with-visimpl-how-to-use-nest-desktop-with-visimpl:

How to use NEST Desktop with ViSimpl
------------------------------------

.. image:: /_static/img/screenshots/external/nest-desktop-visimpl.png
   :alt: ViSimpl
   :target: #usage-with-visimpl-how-to-use-nest-desktop-with-visimpl

**Steps**

- In NEST Desktop, make sure that both backends (NEST Simulator and Insite) are running.
- Run the simulation of the network with Insite as recording backend.
- In ViSimpl, click on the :bdg:`REST` button to get data from Insite (check that you use the correct URL).

.. hint::
   - Increase the :bdg:`Request size` to 10 000 spikes in the REST dialog that it collects spikes faster.

- It shows spatial dots representing neurons and spikes are displayed in glowing mode.

.. hint::
   - Increase the :bdg:`Simulation timestep` to 1ms in :bdg:`Simulation Playback Configuration`.
   - Increase the :bdg:`Delay` to 5ms in :bdg:`Visual Configuration`.



Acknowledgements
----------------

Thanks for the collaboration on ViSimpl and NEST Desktop:

- Félix De Las Pozas Álvarez (Collaboration on ViSimpl and NEST Desktop)
- Marcel Krüger (Insite as recording backend)
- Óscar David Robles Sánchez (Lead developer of ViSimpl)
