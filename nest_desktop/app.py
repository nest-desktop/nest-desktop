import http.server
import socketserver
import os
import sys

__all__ = ['run']

NEST_DESKTOP_HOST = os.environ.get('NEST_DESKTOP_HOST', '127.0.0.1')
NEST_DESKTOP_PORT = os.environ.get('NEST_DESKTOP_PORT', 54286)


def run(host=NEST_DESKTOP_HOST, port=NEST_DESKTOP_PORT):

    web_dir = os.path.join(os.path.dirname(__file__), "app")
    os.chdir(web_dir)

    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer((host, port), Handler) as httpd:
        httpd.serve_forever()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        host = sys.argv[1]
        port = sys.argv[2]
        run(host, int(port))
    else:
        run()
