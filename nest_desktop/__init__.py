# https://www.python.org/dev/peps/pep-0440

from importlib import metadata

try:
    __version__ = metadata.version("nest-desktop")
except metadata.PackageNotFoundError:
    __version__ = "unknown"

del metadata
