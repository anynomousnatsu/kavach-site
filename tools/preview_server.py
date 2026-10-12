"""Local preview that behaves like the Cloudflare Workers static-assets deploy.

- /services serves services.html; /services.html and /services/ redirect (307) to /services
- /index.html redirects to /
- files matched by .assetsignore return 404, as they will not be uploaded
- unknown paths return 404.html with status 404 (not_found_handling: "404-page")

Usage: python tools/preview_server.py [port]   (default 8737, run from the repo root)
"""
import fnmatch
import gzip
import http.server
import io
import os
import sys
from urllib.parse import urlsplit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8737


def ignore_patterns():
    path = os.path.join(ROOT, ".assetsignore")
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as f:
        return [ln.strip() for ln in f if ln.strip() and not ln.startswith("#")]


IGNORED = ignore_patterns()


def is_ignored(rel):
    parts = rel.strip("/").split("/")
    for pat in IGNORED:
        if any(fnmatch.fnmatch(p, pat) for p in parts):
            return True
    return False


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def send_head(self):
        # Cloudflare compresses text assets in production. Match that for local
        # rendering/performance checks; fonts/images are already compressed.
        filename = self.translate_path(self.path)
        suffix = os.path.splitext(filename)[1].lower()
        accepts_gzip = any(
            part.split(";", 1)[0].strip() == "gzip" and
            not any(param.strip() in ("q=0", "q=0.0") for param in part.split(";")[1:])
            for part in self.headers.get("Accept-Encoding", "").split(",")
        )
        if accepts_gzip and os.path.isfile(filename) and suffix in (".html", ".css", ".js", ".xml", ".txt", ".svg"):
            with open(filename, "rb") as source:
                body = gzip.compress(source.read(), compresslevel=6, mtime=0)
            self.send_response(200)
            self.send_header("Content-Type", self.guess_type(filename))
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Vary", "Accept-Encoding")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(filename)))
            self.end_headers()
            return io.BytesIO(body)
        return super().send_head()

    def redirect(self, location):
        self.send_response(307)
        self.send_header("Location", location)
        self.end_headers()

    def not_found(self):
        body = open(os.path.join(ROOT, "404.html"), "rb").read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def route(self):
        parts = urlsplit(self.path)
        path, query = parts.path, ("?" + parts.query if parts.query else "")
        if is_ignored(path):
            return self.not_found()
        if path == "/index.html":
            return self.redirect("/" + query)
        if path.endswith(".html"):
            return self.redirect(path[:-5] + query)
        if path != "/" and path.endswith("/") and os.path.isfile(os.path.join(ROOT, path.strip("/") + ".html")):
            return self.redirect(path.rstrip("/") + query)
        if path == "/":
            self.path = "/index.html"
        elif os.path.isfile(os.path.join(ROOT, path.lstrip("/") + ".html")):
            self.path = path + ".html"
        elif not os.path.isfile(os.path.join(ROOT, path.lstrip("/"))):
            return self.not_found()
        return super().do_GET() if self.command == "GET" else super().do_HEAD()

    def do_GET(self):
        self.route()

    def do_HEAD(self):
        self.route()


if __name__ == "__main__":
    print(f"Preview on http://localhost:{PORT}")
    http.server.ThreadingHTTPServer(("", PORT), Handler).serve_forever()
