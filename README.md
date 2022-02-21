# NEST Desktop

<p>
  <img src="https://raw.githubusercontent.com/nest-desktop/nest-desktop/latest/docs/_static/img/screenshots/start-page.png" />
</p>

**General:** &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
[![docs](https://img.shields.io/readthedocs/nest-desktop)](https://nest-desktop.readthedocs.io)
[![license](https://img.shields.io/github/license/nest-desktop/nest-desktop)](https://github.com/nest-desktop/nest-desktop/blob/main/LICENSE)
[![DOI](https://img.shields.io/badge/DOI-10.1523%2Feneuro.0274--21.2021-blue)](https://doi.org/10.1523/eneuro.0274-21.2021)

**Docker Hub:** &nbsp; &nbsp;
[![docker version](https://img.shields.io/docker/v/nestsim/nest-desktop/latest)](https://hub.docker.com/r/nestsim/nest-desktop)
[![image size](https://img.shields.io/docker/image-size/nestsim/nest-desktop/latest)](https://hub.docker.com/r/nestsim/nest-desktop)
[![docker pulls](https://img.shields.io/docker/pulls/nestsim/nest-desktop)](https://hub.docker.com/r/nestsim/nest-desktop)

**GitHub:** &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
[![commit activity](https://img.shields.io/github/commit-activity/m/nest-desktop/nest-desktop)](https://github.com/nest-desktop/nest-desktop/commits/main)
[![stars](https://img.shields.io/github/stars/nest-desktop/nest-desktop?style=social)](https://github.com/nest-desktop/nest-desktop/stargazers)
[![forks](https://img.shields.io/github/forks/nest-desktop/nest-desktop?style=social)](https://github.com/nest-desktop/nest-desktop/network/members)

**PyPI:** &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
[![pypi](https://img.shields.io/pypi/v/nest-desktop?label=version)](https://pypi.org/project/nest-desktop/)
[![downloads](https://img.shields.io/pypi/dm/nest-desktop)](https://pypi.org/project/nest-desktop/)

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

To get started with NEST Desktop and NEST Simulator, use Docker compose with the configuration file:

```
wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker-compose.yml
docker-compose up --build
```

For more information, please see the [User Documentation Page](https://nest-desktop.readthedocs.io).

### Cite NEST Desktop

In order to cite NEST Desktop in general, please use the DOI [10.5281/zenodo.5037050](https://doi.org/10.5281/zenodo.5037050) for all versions (always redirecting to the latest version).
If you like to refer to a single version, you can find these also on Zenodo, e.g. [10.5281/zenodo.5037051](https://doi.org/10.5281/zenodo.5037051) for Version 3.0.
You can use the reference to the paper for NEST Desktop (DOI: [10.1523/ENEURO.0274-21.2021](https://doi.org/10.1523/ENEURO.0274-21.2021)) mentioned above as well, if that is more appropriate in the context of your reference.

You will also find the exports for the citation managers on Zenodo and eNeuro.

### License

NEST Desktop is published under the [MIT](LICENSE) license.
