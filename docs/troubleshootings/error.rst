.. _error_server-not-found:

Server not found
----------------

NEST Desktop cannot find the NEST Simulator.
It has two possible reasons:

- NEST Desktop has a wrong URL under which it tries to contact the server.
  |see| the :doc:`FAQ for NEST Simulator </troubleshootings/nest-simulator>`.

- NEST Server is not running. Try to start NEST Server.

- The user authorization to the backend is not granted.

.. hint::
   Check NEST Simulator is running (if the URL is ``localhost:52425``):

   - in URL of Browser: ``http://localhost:52425``
   - in Terminal: ``curl http://localhost:52425``
   - in Python: ``import requests; requests.get('http://localhost:52425')``

.. _error_internal-server-error:

Internal server error
---------------------

It says that the back end (i.e, ``nest-server``) ended with an internal error.
In this case, you have to review the log of the back end.

.. _error_nest-error:

NEST error
----------

NEST Simulator produces a value error, e.g. ``The value must be strictly negative.``.
Please have a look at the official :doc:`NEST documentation <nest-simulator:index>`
to obtain the correct syntax for the commands.
