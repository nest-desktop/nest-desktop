Deploy on OpenStack
===================


.. image:: /_static/img/logo/openstack-logo.svg
   :align: right
   :alt: OpenStack
   :width: 240px

The guide provides a step-by-step documentation on how to deploy NEST Desktop on OpenStack resources.
For more information on OpenStack, please follow this link: https://www.redhat.com/en/topics/openstack.

As an example of an OpenStack infrastructure, we show the deployment on bwCloud,
which is assigned to the universities in Baden-Württemberg, Germany.
For more information bwCloud, follow the link:  https://www.bw-cloud.org/.

Deployers can build an OpenStack image via Packer and Ansible.

Requirements:
   - `Packer <https://www.packer.io/downloads.html>`__
   - `Ansible (2.3.2.0 or newer) <https://releases.ansible.com/ansible/>`__


Deploy NEST Desktop on bwCloud
------------------------------

.. image:: /_static/img/logo/bwcloud-logo.svg
   :alt: OpenStack
   :width: 240px

|

You can find the source code on https://github.com/nest-desktop/nest-desktop-bwCloud.

1. Download the OpenStack RC File from
   `bwCloud dashboard <https://portal.bw-cloud.org/project/api_access/>`__:

  :guilabel:`Project` -> :guilabel:`API Access` -> :guilabel:`Download OpenStack RC File`

2. Source the RC file to login:

.. code-block:: bash

   source Project_<userID>-openrc.sh

3. Modify the Ansible configurations in ``infrastructure/bwCloud/nest-desktop.json``.

  Set ``image_name``. Values for ``source_image`` and ``networks`` are taken from bwCloud dashboard.

4. Build an image on bwCloud:

.. code-block:: bash

  packer build nest-desktop.json

5. Start an instance on the bwCloud dashboard and it will have a public IP of the virtual machine.

|

Acknowledgements
----------------

Thanks for the help to integrate NEST Desktop on *bwCloud*:

- Bernd Wiebelt
- Jonathan Bauer
- Michael Janczyk
- Manuel Messner
- Christopher Ill
