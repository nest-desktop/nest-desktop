import http.server
import socketserver
import os
import sys

__all__ = ['run']


def run(host="127.0.0.1", port=8000):

    web_dir = os.path.join(os.path.dirname(__file__), "app")
    os.chdir(web_dir)

    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), Handler) as httpd:
        httpd.serve_forever()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        host = sys.argv[1]
        port = sys.argv[2]
        run(host, int(port))
    else:
        run()
