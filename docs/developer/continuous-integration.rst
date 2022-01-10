Continuous integration (CI) with GitLab
=======================================


Since the source code of NEST Desktop is mirrored (`.github/workflows/ebrains-push.yml`)
to `EBRAINS GitLab <https://gitlab.ebrains.eu/nest/nest-desktop>`__,
we are able to setup automated CI systems for the compilation and the deployment.
You can find the configuration in `.gitlab-ci.yml`. It consists of two stages, `build` and `deploy`.

In each stage, we prepared two parallel pipelines in which jobs will be executed when a specific branch is pushed:
  - the development pipeline for the `dev` branch to check the functional operation of the CI (later with testing).
  - the production pipeline for the `main` branch when NEST Desktop is released.

In the build stage CI uses `Node.js` to produce NEST Desktop and store it in the `nest_desktop/app` folder.

In the deploy stage the CI deploys NEST Desktop as a Python package and as Docker images for `EBRAINS Harbor <https://docker-registry.ebrains.eu>`__` (the Docker container registry of EBRAINS) and `Docker Hub <https://hub.docker.com>`__`.
All jobs in the deploy stage depend on the job of the build stage being executed successfully.

Each executable job of the development and production pipelines has a base job,
so that the job scripts in both cases are identical
but they only differ in the version variable for the Python package and the Docker image.
