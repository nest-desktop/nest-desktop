<h1 align="center">
  <img
    alt="NEST Desktop"
    src="https://raw.githubusercontent.com/nest-desktop/nest-desktop/0a3c75e38ed85b5ee952773450eb61cf6e7dc821/icons/icon.png"
    width="256"
    >
  <br />
  NEST Desktop
</h1>

<p align="center">
  A web-based application for spiking neuronal simulation.
</p>

|          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| General  | [![docs](https://img.shields.io/readthedocs/nest-desktop?label=Documentation&logo=readthedocs&logoColor=white)](https://nest-desktop.readthedocs.io) [![license](https://img.shields.io/github/license/nest-desktop/nest-desktop)](https://github.com/nest-desktop/nest-desktop/blob/main/LICENSE) [![DOI](https://img.shields.io/badge/DOI-10.1523%2Feneuro.0274--21.2021-blue)](https://doi.org/10.1523/eneuro.0274-21.2021)                                                                                                                                                                                                                                                          |
| GitHub   | [![Latest release](https://img.shields.io/github/release/nest-desktop/nest-desktop.svg?label=latest%20release&logo=github&logoColor=white)](https://github.com/nest-desktop/nest-desktop/releases) [![GitHub commit activity](https://img.shields.io/github/commit-activity/y/nest-desktop/nest-desktop)](https://github.com/nest-desktop/nest-desktop/commits/main) [![GitHub forks](https://img.shields.io/github/forks/nest-desktop/nest-desktop?style=social)](https://github.com/nest-desktop/nest-desktop/network/members) [![GitHub stars](https://img.shields.io/github/stars/nest-desktop/nest-desktop?style=social)](https://github.com/nest-desktop/nest-desktop/stargazers) |
| Docker   | [![Docker image version](https://img.shields.io/docker/v/nest/nest-desktop/latest?label=Docker&logo=docker&logoColor=white)](https://hub.docker.com/r/nest/nest-desktop) [![Docker image size](https://img.shields.io/docker/image-size/nest/nest-desktop/latest)](https://hub.docker.com/r/nest/nest-desktop) [![Docker image pulls](https://img.shields.io/docker/pulls/nest/nest-desktop)](https://hub.docker.com/r/nest/nest-desktop)                                                                                                                                                                                                                                               |
| Python   | [![Python version](https://img.shields.io/pypi/v/nest-desktop?label=Python&logo=python&logoColor=white)](https://pypi.org/project/nest-desktop/) [![Python downloads](https://img.shields.io/pypi/dm/nest-desktop)](https://pypi.org/project/nest-desktop/)                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Conda    | [![Conda version](https://img.shields.io/conda/vn/conda-forge/nest-desktop?logo=conda-forge&logoColor=white)](https://anaconda.org/conda-forge/nest-desktop) [![Conda downloads total](https://img.shields.io/conda/dn/conda-forge/nest-desktop)](https://anaconda.org/conda-forge/nest-desktop)                                                                                                                                                                                                                                                                                                                                                                                        |
| AppImage | [![AppImage version](https://img.shields.io/github/release/nest-desktop/nest-desktop-appImage?label=AppImage&logo=linux&logoColor=white)](https://github.com/nest-desktop/nest-desktop-appImage/releases) [![AppImage downloads total](https://img.shields.io/github/downloads/nest-desktop/nest-desktop-appImage/total)](https://github.com/nest-desktop/nest-desktop-appImage/releases)                                                                                                                                                                                                                                                                                               |
| Flatpak  | [![Flatpak version](https://img.shields.io/flathub/v/io.github.nest_desktop.nest-desktop?logo=flathub)](https://flathub.org/apps/io.github.nest_desktop.nest-desktop) [![Flathub Downloads](https://img.shields.io/flathub/downloads/io.github.nest_desktop.nest-desktop)](https://flathub.org/apps/io.github.nest_desktop.nest-desktop)                                                                                                                                                                                                                                                                                                                                                |
| Snap     | [![Snap version](https://img.shields.io/snapcraft/v/nest-desktop/latest/stable?logo=snapcraft&logoColor=white)](https://snapcraft.io/nest-desktop)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### Synopsis

NEST Desktop is a web-based application which provides a graphical user interface for [NEST
Simulator](https://nest-simulator.org). With this easy-to-use tool, users can interactively construct neuronal networks
and explore network dynamics.

Advanced users often choose NEST Simulator: a prominent tool for spiking neuronal networks to measure network
dynamics.However, programming knowledge is required to write code for this tool. NEST Desktop bypasses this requirement,
but still teaches users how to construct and explore neuronal networks. A textual script is generated from the
constructed networks and sent to NEST Simulator; the network activity is then visualized in a graph or table. It is a
useful teaching tool, since the network graphs and network activity visualizations can be exported to files that users
can implement for their course protocol.

NEST Desktop is available on [EBRAINS](https://ebrains.eu/service/nest-desktop) (free EBRAINS account required).

### Quick start

To get started with NEST Desktop and NEST Simulator, use Docker compose with the configuration file:

```
wget https://raw.githubusercontent.com/nest-desktop/nest-desktop/main/docker/docker-compose.yml
docker-compose up --build
```

For more information, please see the [User Documentation Page](https://nest-desktop.readthedocs.io).

### Cite NEST Desktop

In order to cite NEST Desktop in general, please use the DOI
[10.5281/zenodo.5037050](https://doi.org/10.5281/zenodo.5037050) for all versions (always redirecting to the latest
version). If you like to refer to a single version, you can find these also on Zenodo, e.g.
[10.5281/zenodo.5037051](https://doi.org/10.5281/zenodo.5037051) for Version 3.0. You can use the reference to the paper
for NEST Desktop (DOI: [10.1523/ENEURO.0274-21.2021](https://doi.org/10.1523/ENEURO.0274-21.2021)) mentioned above as
well, if that is more appropriate in the context of your reference.

You will also find the exports for the citation managers on Zenodo and eNeuro.

### Funding

This project has received funding from the European Union’s Horizon 2020 Framework Programme for Research and Innovation
under Specific Grant Agreement No. 785907 (Human Brain Project SGA2) and No. 945539 (Human Brain Project SGA3). This
project was funded by the Helmholtz Association Initiative and Networking Fund under project number SO-092 (Advanced
Computing Architectures, ACA). This work was supported by the DFG Excellence Cluster BrainLinks-BrainTools (grant EXC
1086).

### License

NEST Desktop is published under the [MIT](LICENSE) license.
