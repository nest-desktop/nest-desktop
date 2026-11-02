import importlib
from importlib import metadata

import nest_desktop


def test_version_matches_metadata():
    assert nest_desktop.__version__ == metadata.version("nest-desktop")


def test_metadata_not_exported():
    assert not hasattr(nest_desktop, "metadata")


def test_version_fallback(monkeypatch):
    def fake_version(name):
        raise metadata.PackageNotFoundError(name)

    monkeypatch.setattr(metadata, "version", fake_version)
    try:
        importlib.reload(nest_desktop)
        assert nest_desktop.__version__ == "unknown"
    finally:
        monkeypatch.undo()
        importlib.reload(nest_desktop)
