Continuous integration (CI) with GitLab
=======================================


Since the source code of NEST Desktop is mirrored (`.github/workflows/ebrains-push.yml`)
to `EBRAINS GitLab <https://gitlab.ebrains.eu/nest/nest-desktop>`__,
we are able to setup an automated CI systems for the compilation and deployment.
You can find the configurations in `.gitlab-ci.yml` that we prepared two stages, `build` and `deploy`.

In each stage, we prepared two parallel pipelines in which jobs will be executed when a specific branch is pushed:
  - the development pipeline for the `dev` branch to check the functional operation of the CI (later with testing).
  - the production pipeline for the `main` branch when NEST Desktop is released.

In the build stage CI uses `Node.js` to produce NEST Desktop to `nest_desktop/app` folder.

In the deploy stage CI deploys Python package and Docker images for `docker-registry.ebrains.eu` and `hub.docker.com`.
All jobs in the deploy stage depend on the job successfully executed in the build stage.

Each executable job of development and production pipelines has a base job
that the job script in both cases are identical
but it is only different in version variable for Python package and Docker image.
