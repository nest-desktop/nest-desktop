# main.py

import http.server
import os
import socketserver
import sys

HOST = os.environ.get("NEST_DESKTOP_HOST", "127.0.0.1")
PORT = int(os.environ.get("NEST_DESKTOP_PORT", "54286"))


def create_app(host: str = HOST, port: int = PORT):

    web_dir = os.path.join(os.path.dirname(__file__), "app")
    os.chdir(web_dir)

    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer((host, port), Handler) as httpd:
        httpd.serve_forever()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        host = sys.argv[1]
        port = sys.argv[2]
        create_app(host, int(port))
    else:
        create_app()
