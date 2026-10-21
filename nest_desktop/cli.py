# cli.py

import os
import subprocess

import click

from nest_desktop import __version__
from nest_desktop.main import create_app

HOST = os.environ.get("NEST_DESKTOP_HOST", "127.0.0.1")
PORT = int(os.environ.get("NEST_DESKTOP_PORT", "54286"))


@click.group()
def main():
    pass


@main.command()
def pid():
    try:
        subprocess.run("pgrep -fo 'nest-desktop start'", shell=True, executable="/bin/bash", check=True)
    except Exception:  # noqa: BLE001
        click.echo("No such process")


@main.command()
@click.option("--host", "-h", default=HOST, help=f"use hostname/IP address for the server [default: {HOST}]")
@click.option("--port", "-p", default=PORT, help=f"use port for opening the socket [default: {PORT}]")
def start(host: str, port: int):
    msg = f"NEST Desktop is now running at http://{host}:{port}."
    click.echo(msg)
    click.echo("Use CTRL + C to stop this service.")
    click.echo(len(msg) * "-")

    create_app(host, port)


@main.command()
@click.option("--host", "-h", default=HOST, help=f"use hostname/IP address for the server [default: {HOST}]")
@click.option("--port", "-p", default=PORT, help=f"use port for opening the socket [default: {PORT}]")
def stop(host: str, port: int):
    try:
        subprocess.run("pgrep -fo 'nest-desktop start' | xargs kill", shell=True, executable="/bin/bash", check=True)
        click.echo(f"NEST Desktop running at http://{host}:{port} has stopped.")
    except Exception:  # noqa: BLE001
        click.echo(f"NEST Desktop is not running at http://{host}:{port}.")


@main.command()
def version():
    click.echo(__version__)


if __name__ == "__main__":
    main()
