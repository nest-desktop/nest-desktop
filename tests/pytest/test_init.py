from importlib import metadata

import nest_desktop


def test_version_matches_metadata():
    assert nest_desktop.__version__ == metadata.version("nest-desktop")


def test_metadata_not_exported():
    assert not hasattr(nest_desktop, "metadata")
