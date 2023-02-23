Continuous integration (CI)
===========================

Mirror Action on GitHub
-----------------------

Since the NEST Desktop team has only restricted access to the CI resources of GitHub,
the source code of NEST Desktop is mirrored (``.github/workflows/ebrains-push.yml``)
to the `EBRAINS GitLab <https://gitlab.ebrains.eu/nest/nest-desktop>`__,
where we are able to use automated CI systems for the compilation and the deployment.
We use only a small GitHub CI setup to transfer the code to the EBRAINS GitLab
and execute the compute-intensive workloads there.

Jobs on GitLab
--------------

You can find the configuration in ``.gitlab-ci.yml``.
It consists of two stages, `build` and `deploy`.

In each stage, we prepared two parallel pipelines in which jobs will be executed
when a specific branch is pushed:

- the development pipeline for the `dev` branch to check the functional operation of the CI
  (in the future with testing) and
- the production pipeline for the `main` branch when NEST Desktop is released.

In the build stage, the CI pipeline uses `Node.js` to produce NEST Desktop
and to store it in the ``nest_desktop/app`` folder.

In the deploy stage, the CI deploys NEST Desktop as a Python package
and as Docker images for `EBRAINS Harbor <https://docker-registry.ebrains.eu>`__
(the Docker container registry of EBRAINS)
and `Docker Hub <https://hub.docker.com>`__.
All jobs in the deploy stage depend on the job of the build stage being executed successfully.

Each executable job of the development and production pipelines has a base job,
so that the job scripts in both cases seem to be identical,
but they only differ in the version variable for the Python package and the Docker image.

.. note::
   You can check these scripts also for commands if you want
   to execute single build steps manually on your machine.
