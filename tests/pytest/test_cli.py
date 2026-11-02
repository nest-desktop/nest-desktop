import importlib
import runpy
import subprocess

import pytest
from click.testing import CliRunner

from nest_desktop import __version__, cli


@pytest.fixture
def runner():
    return CliRunner()


@pytest.fixture
def mock_run(monkeypatch):
    calls = []

    def fake_run(cmd, **kwargs):
        calls.append((cmd, kwargs))
        return subprocess.CompletedProcess(cmd, 0)

    monkeypatch.setattr(cli.subprocess, "run", fake_run)
    return calls


@pytest.fixture
def failing_run(monkeypatch):
    def fake_run(cmd, **kwargs):
        raise subprocess.CalledProcessError(1, cmd)

    monkeypatch.setattr(cli.subprocess, "run", fake_run)


@pytest.fixture
def mock_create_app(monkeypatch):
    calls = []
    monkeypatch.setattr(cli, "create_app", lambda host, port: calls.append((host, port)))
    return calls


@pytest.fixture
def reload_cli(monkeypatch):
    yield lambda: importlib.reload(cli)
    monkeypatch.undo()
    importlib.reload(cli)


def test_defaults(monkeypatch, reload_cli):
    monkeypatch.delenv("NEST_DESKTOP_HOST", raising=False)
    monkeypatch.delenv("NEST_DESKTOP_PORT", raising=False)
    module = reload_cli()
    assert module.HOST == "127.0.0.1"
    assert module.PORT == 54286


def test_env_overrides(runner, monkeypatch, reload_cli):
    monkeypatch.setenv("NEST_DESKTOP_HOST", "0.0.0.0")
    monkeypatch.setenv("NEST_DESKTOP_PORT", "8000")
    module = reload_cli()
    assert module.HOST == "0.0.0.0"
    assert module.PORT == 8000
    result = runner.invoke(module.main, ["start", "--help"])
    assert "[default: 0.0.0.0]" in result.output
    assert "[default: 8000]" in result.output


def test_run_as_script(monkeypatch, capsys):
    monkeypatch.setattr("sys.argv", ["cli.py", "version"])
    with pytest.raises(SystemExit) as exc_info:
        runpy.run_path(cli.__file__, run_name="__main__")
    assert exc_info.value.code == 0
    assert capsys.readouterr().out == f"{__version__}\n"


def test_help_lists_commands(runner):
    result = runner.invoke(cli.main, ["--help"])
    assert result.exit_code == 0
    for command in ("pid", "start", "stop", "version"):
        assert command in result.output


def test_unknown_command(runner):
    result = runner.invoke(cli.main, ["foo"])
    assert result.exit_code != 0
    assert "No such command" in result.output


def test_version(runner):
    result = runner.invoke(cli.main, ["version"])
    assert result.exit_code == 0
    assert result.output == f"{__version__}\n"


def test_pid(runner, mock_run):
    result = runner.invoke(cli.main, ["pid"])
    assert result.exit_code == 0
    assert result.output == ""
    assert len(mock_run) == 1
    cmd, kwargs = mock_run[0]
    assert cmd == "pgrep -fo 'nest-desktop start'"
    assert kwargs["check"] is True


def test_pid_no_process(runner, failing_run):
    result = runner.invoke(cli.main, ["pid"])
    assert result.exit_code == 0
    assert result.output == "No such process\n"


def test_start_defaults(runner, mock_create_app):
    result = runner.invoke(cli.main, ["start"])
    assert result.exit_code == 0
    msg = f"NEST Desktop is now running at http://{cli.HOST}:{cli.PORT}."
    assert result.output.splitlines() == [msg, "Use CTRL + C to stop this service.", len(msg) * "-"]
    assert mock_create_app == [(cli.HOST, cli.PORT)]


@pytest.mark.parametrize("args", [["--host", "0.0.0.0", "--port", "8000"], ["-h", "0.0.0.0", "-p", "8000"]])
def test_start_options(runner, mock_create_app, args):
    result = runner.invoke(cli.main, ["start", *args])
    assert result.exit_code == 0
    assert "http://0.0.0.0:8000." in result.output
    assert mock_create_app == [("0.0.0.0", 8000)]


def test_start_invalid_port(runner, mock_create_app):
    result = runner.invoke(cli.main, ["start", "--port", "abc"])
    assert result.exit_code == 2
    assert mock_create_app == []


def test_stop(runner, mock_run):
    result = runner.invoke(cli.main, ["stop"])
    assert result.exit_code == 0
    assert result.output == f"NEST Desktop running at http://{cli.HOST}:{cli.PORT} has stopped.\n"
    cmd, kwargs = mock_run[0]
    assert cmd == "pgrep -fo 'nest-desktop start' | xargs kill"
    assert kwargs["check"] is True


def test_stop_options(runner, mock_run):
    result = runner.invoke(cli.main, ["stop", "-h", "0.0.0.0", "-p", "8000"])
    assert result.exit_code == 0
    assert result.output == "NEST Desktop running at http://0.0.0.0:8000 has stopped.\n"


def test_stop_not_running(runner, failing_run):
    result = runner.invoke(cli.main, ["stop"])
    assert result.exit_code == 0
    assert result.output == f"NEST Desktop is not running at http://{cli.HOST}:{cli.PORT}.\n"
