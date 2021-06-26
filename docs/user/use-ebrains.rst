Use NEST Desktop on EBRAINS
===========================


.. image:: ../_static/img/logo/ebrains-logo.svg
  :width: 320px
  :alt: EBRAINS

|

**EBRAINS** is a platform infrastructure for neuroscience.
NEST Desktop is available as a prototype online.

.. raw:: html

  <div class="iframe-container">
    <iframe src="https://ebrains.eu/service/nest-desktop" frameborder="0" allowfullscreen></iframe>
  </div>

|

.. note::

  You need an **EBRAINS** account to access NEST Desktop.


||||

**Trouble shootings**

Why cannot I find NEST Server?
  Sometimes the issue is resolved when you check NEST Server.

  If not, the problem lies in the cookies and site data for the user authentication of the *EBRAINS* platform.
  That cookie expires after a session.
  This happens when you re-access to ``https://nest-desktop.apps.hbp.eu`` after the browser is closed.

  A simple solution is to reload the page with deleting the cookies (:guilabel:`CTRL` + :guilabel:`SHIFT` + :guilabel:`R`) so that you can re-login.

  A persistent solution is to set the browser configuration so that it deletes cookies and site data when the browser is closed (It works in Firefox), but avoid to accidentally delete cookies you want to keep.
