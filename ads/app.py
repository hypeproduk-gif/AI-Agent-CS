#!/usr/bin/env python3
"""Studio Iklan Meta versi lokal: web app di browser + Claude + foto AI Gemini.

  python3 ads/app.py        -> browser terbuka di http://localhost:8765

API key diisi lewat halaman web (disimpan di ads/.env, tidak ikut ter-commit).
"""
import base64, json, os, re, sys, threading, traceback, uuid, webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
import generate as g  # noqa: E402

ENV = ROOT / ".env"
PAGE = ROOT / "web" / "studio-iklan.html"
PORT = int(os.environ.get("PORT", 8765))
KEYS = ("ANTHROPIC_API_KEY", "GEMINI_API_KEY")


def load_env():
    if ENV.exists():
        for line in ENV.read_text().splitlines():
            k, _, v = line.partition("=")
            if k.strip() in KEYS and v.strip():
                os.environ[k.strip()] = v.strip()


def save_env(new):
    cur = {k: os.environ.get(k, "") for k in KEYS}
    cur.update({k: v.strip() for k, v in new.items() if k in KEYS and v and v.strip()})
    ENV.write_text("".join(f"{k}={v}\n" for k, v in cur.items() if v))
    os.chmod(ENV, 0o600)
    load_env()


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def send_json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            body = PAGE.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif self.path == "/api/status":
            self.send_json({k: bool(os.environ.get(k)) for k in KEYS})
        elif self.path.startswith("/output/"):
            p = (g.OUT / self.path.split("?")[0][len("/output/"):]).resolve()
            if not str(p).startswith(str(g.OUT.resolve())) or not p.is_file():
                return self.send_error(404)
            body = p.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "image/png")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_error(404)

    def do_POST(self):
        if self.client_address[0] not in ("127.0.0.1", "::1"):
            return self.send_error(403)
        try:
            data = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
            if self.path == "/api/keys":
                save_env(data)
                return self.send_json({k: bool(os.environ.get(k)) for k in KEYS})
            if self.path == "/api/claude":
                # prompt dari halaman sudah memuat aturan lengkap
                return self.send_json({"result": g.call(data["prompt"], system="Balas hanya JSON valid.")})
            if self.path == "/api/image":
                return self.send_json(make_image(data))
            self.send_error(404)
        except SystemExit as e:  # generate.call memakai sys.exit untuk error API
            self.send_json({"error": str(e)}, 400)
        except Exception as e:
            traceback.print_exc()
            self.send_json({"error": str(e)}, 500)


def make_image(data):
    if not os.environ.get("GEMINI_API_KEY"):
        raise RuntimeError("API key Gemini belum diisi.")
    slug = re.sub(r"[^a-z0-9-]+", "-", (data.get("slug") or "produk").lower()).strip("-") or "produk"
    out = g.OUT / slug / "scenes"
    out.mkdir(parents=True, exist_ok=True)
    def dump(dataurl, name):
        m = re.match(r"data:image/(\w+);base64,(.*)", dataurl or "", re.S)
        if not m:
            return None
        path = out / f"{name}.{'png' if m.group(1) == 'png' else 'jpg'}"
        path.write_bytes(base64.b64decode(m.group(2)))
        return path
    foto_path, inf_path = dump(data.get("foto"), "_produk"), dump(data.get("influencer"), "_influencer")
    img = g.ai_scene(data.get("prompt", ""), str(foto_path) if foto_path else None, raise_errors=True,
                     influencer_path=str(inf_path) if inf_path else None, scene_type=data.get("scene_type"))
    if img is None:
        raise RuntimeError("Gemini tidak mengembalikan gambar.")
    name = f"{uuid.uuid4().hex[:10]}.png"
    img.save(out / name)
    return {"url": f"/output/{slug}/scenes/{name}", "has_product": bool(foto_path)}


def main():
    load_env()
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    url = f"http://localhost:{PORT}"
    print(f"Studio Iklan jalan di {url}  (tutup jendela ini / Control+C untuk berhenti)")
    threading.Timer(1, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
