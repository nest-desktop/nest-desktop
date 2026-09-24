# https://www.python.org/dev/peps/pep-0440

import contextlib
from importlib import metadata

try:
    __version__ = metadata.version("nest-desktop")
except metadata.PackageNotFoundError:
    contextlib.suppress(metadata.PackageNotFoundError)

del metadata
