# https://www.python.org/dev/peps/pep-0440

from importlib import metadata as _metadata  # noqa

__version__ = _metadata.version("nest-desktop")
del _metadata
