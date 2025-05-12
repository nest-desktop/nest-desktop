# https://www.python.org/dev/peps/pep-0440

from importlib import metadata  # noqa

try:
    __version__ = metadata.version("nest-desktop")
except metadata.PackageNotFoundError:
    pass

del metadata
