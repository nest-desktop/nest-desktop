# cli.py

import argparse
import os
import subprocess
import sys

from nest_desktop import __version__
from nest_desktop.main import create_app

HOST = os.environ.get("NEST_DESKTOP_HOST", "127.0.0.1")
PORT = int(os.environ.get("NEST_DESKTOP_PORT", "54286"))


def main() -> None:
    global HOST, PORT

    parser = argparse.ArgumentParser(description="A Python-based server instance for the NEST Desktop", add_help=False)
    parser.add_argument("operation", choices=["pid", "start", "stop", "version"])

    parser.add_argument(
        "-h", "--host", type=str, help="use hostname/IP address <HOST> for the server [default: 127.0.0.1]"
    )
    parser.add_argument("-p", "--port", type=int, help="use port <PORT> for opening the socket [default: 4286]")

    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit(0)

    args = parser.parse_args()

    if args.host:
        HOST = args.host

    if args.port:
        PORT = args.port

    match args.operation:
        case "pid":
            try:
                subprocess.run("pgrep -fo 'nest-desktop start'", shell=True, executable="/bin/bash", check=True)
            except Exception:  # noqa: BLE001
                print("No such process")

        case "start":
            msg = f"NEST Desktop is now running at http://{HOST}:{PORT}."
            print(msg)
            print("Use CTRL + C to stop this service.")
            print(len(msg) * "-")

            create_app(HOST, PORT)

        case "stop":
            try:
                subprocess.run(
                    "pgrep -fo 'nest-desktop start' | xargs kill", shell=True, executable="/bin/bash", check=True
                )
                print(f"NEST Desktop running at http://{HOST}:{PORT} has stopped.")
            except Exception:  # noqa: BLE001
                print(f"NEST Desktop is not running at http://{HOST}:{PORT}.")

        case "version":
            print(__version__)
