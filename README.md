<p>
  <img src="https://raw.githubusercontent.com/nest-desktop/nest-desktop/v3.0/docs/_static/img/screenshots/start-page.png" />
</p>

GitHub
[![commit activity](https://img.shields.io/github/commit-activity/m/nest-desktop/nest-desktop)](https://github.com/nest-desktop/nest-desktop/commits/main)
[![stars](https://img.shields.io/github/stars/nest-desktop/nest-desktop?style=social)](https://github.com/nest-desktop/nest-desktop/stargazers)
[![forks](https://img.shields.io/github/forks/nest-desktop/nest-desktop?style=social)](https://github.com/nest-desktop/nest-desktop/network/members)

PyPI
[![pypi](https://img.shields.io/pypi/v/nest-desktop?label=version)](https://pypi.org/project/nest-desktop/)
[![downloads](https://img.shields.io/pypi/dm/nest-desktop)](https://pypi.org/project/nest-desktop/)

DockerHub
[![docker version](https://img.shields.io/docker/v/nestdesktop/app/3.0)](https://hub.docker.com/r/nestdesktop/app)
[![image size](https://img.shields.io/docker/image-size/nestdesktop/app/3.0)](https://hub.docker.com/r/nestdesktop/app)
[![docker pulls](https://img.shields.io/docker/pulls/nestdesktop/app)](https://hub.docker.com/r/nestdesktop/app)

[![docs](https://img.shields.io/readthedocs/nest-desktop)](https://nest-desktop.readthedocs.io)
[![license](https://img.shields.io/github/license/nest-desktop/nest-desktop)](https://github.com/nest-desktop/nest-desktop/blob/main/LICENSE)
[![DOI](https://img.shields.io/badge/DOI-10.1101%2F2021.06.15.444791-blue)](https://doi.org/10.1101/2021.06.15.444791)


---

NEST Desktop is a web-based application which provides a graphical user interface for [NEST Simulator](https://nest-simulator.org). With this easy-to-use tool, users can interactively construct neuronal networks and explore network dynamics.

Advanced users often choose NEST Simulator: a prominent tool for spiking neuronal networks to measure network dynamics.
However, programming knowledge is required to write code for this tool.
NEST Desktop bypasses this requirement, but still teaches users how to construct and explore neuronal networks.
A textual script is generated from the constructed networks and sent to NEST Simulator;
the network activity is then visualized in a graph or table.
It is a useful teaching tool, since the network graphs and network activity visualizations can be exported to files that users can implement for their course protocol.

NEST Desktop is available on [EBRAINS](https://ebrains.eu/service/nest-desktop) (free EBRAINS account required).

### Quick start

To get started with NEST Desktop and NEST Server, use Docker compose with the configuration file:

```
wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml
docker-compose up --build
```
For more information, please see the [User Documentation Page](https://nest-desktop.readthedocs.io).


### Citation

You can use the reference to the preprint for NEST Desktop which is available on [bioRxiv](https://www.biorxiv.org/content/10.1101/2021.06.15.444791v1).


### License [MIT](LICENSE)
