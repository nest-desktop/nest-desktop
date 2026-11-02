import importlib
import os
import runpy

import pytest

from nest_desktop import main


@pytest.fixture
def mock_server(monkeypatch):
    calls = {"chdir": [], "server": [], "serve_forever": 0}

    class FakeTCPServer:
        def __init__(self, address, handler):
            calls["server"].append((address, handler))

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def serve_forever(self):
            calls["serve_forever"] += 1

    monkeypatch.setattr(main.socketserver, "TCPServer", FakeTCPServer)
    monkeypatch.setattr(main.os, "chdir", lambda path: calls["chdir"].append(path))
    return calls


@pytest.fixture
def reload_main(monkeypatch):
    yield lambda: importlib.reload(main)
    monkeypatch.undo()
    importlib.reload(main)


def test_defaults(monkeypatch, reload_main):
    monkeypatch.delenv("NEST_DESKTOP_HOST", raising=False)
    monkeypatch.delenv("NEST_DESKTOP_PORT", raising=False)
    module = reload_main()
    assert module.HOST == "127.0.0.1"
    assert module.PORT == 54286


def test_env_overrides(monkeypatch, reload_main):
    monkeypatch.setenv("NEST_DESKTOP_HOST", "0.0.0.0")
    monkeypatch.setenv("NEST_DESKTOP_PORT", "8000")
    module = reload_main()
    assert module.HOST == "0.0.0.0"
    assert module.PORT == 8000


def test_create_app(mock_server):
    main.create_app("0.0.0.0", 8000)
    assert mock_server["chdir"] == [os.path.join(os.path.dirname(main.__file__), "app")]
    assert mock_server["server"] == [(("0.0.0.0", 8000), main.http.server.SimpleHTTPRequestHandler)]
    assert mock_server["serve_forever"] == 1


def test_create_app_defaults(mock_server):
    main.create_app()
    address, _ = mock_server["server"][0]
    assert address == (main.HOST, main.PORT)


def test_run_as_script(monkeypatch, mock_server):
    monkeypatch.setattr("sys.argv", ["main.py", "0.0.0.0", "8000"])
    runpy.run_path(main.__file__, run_name="__main__")
    address, _ = mock_server["server"][0]
    assert address == ("0.0.0.0", 8000)


def test_run_as_script_defaults(monkeypatch, mock_server):
    monkeypatch.setattr("sys.argv", ["main.py"])
    runpy.run_path(main.__file__, run_name="__main__")
    address, _ = mock_server["server"][0]
    assert address == (main.HOST, main.PORT)
