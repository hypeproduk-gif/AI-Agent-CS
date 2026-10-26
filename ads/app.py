#!/usr/bin/env python3
"""Studio Iklan Meta versi lokal: web app di browser + Claude + foto AI Gemini.

  python3 ads/app.py        -> browser terbuka di http://localhost:8765

API key diisi lewat halaman web (disimpan di ads/.env, tidak ikut ter-commit).
"""
import base64, json, os, re, sys, threading, time, traceback, uuid, webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
import generate as g  # noqa: E402

ENV = ROOT / ".env"
PAGE = ROOT / "web" / "studio-iklan.html"
BATCH = ROOT / "web" / "batch.html"
PORT = int(os.environ.get("PORT", 8765))
KEYS = ("ANTHROPIC_API_KEY", "GEMINI_API_KEY", "OPENROUTER_API_KEY", "OPENAI_API_KEY")


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
        if self.path in ("/", "/index.html", "/studio"):
            body = (PAGE if self.path == "/studio" or not BATCH.exists() else BATCH).read_bytes()
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
            self.send_header("Content-Type", "image/jpeg" if p.suffix == ".jpg" else "image/png")
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
            if self.path == "/api/upload":
                return self.send_json(save_upload(data))
            if self.path == "/api/style":
                return self.send_json(analyze_style(data))
            if self.path == "/api/batch":
                return self.send_json(make_batch(data))
            if self.path == "/api/creative":
                return self.send_json(make_creative(data))
            if self.path == "/api/image":
                return self.send_json(make_image(data))
            self.send_error(404)
        except SystemExit as e:  # generate.call memakai sys.exit untuk error API
            self.send_json({"error": str(e)}, 400)
        except Exception as e:
            traceback.print_exc()
            self.send_json({"error": str(e)}, 500)


def save_upload(data):
    """Foto hasil Gem / foto asli untuk satu creative."""
    slug = re.sub(r"[^a-z0-9-]+", "-", (data.get("slug") or "produk").lower()).strip("-") or "produk"
    m = re.match(r"data:image/(\w+);base64,(.*)", data.get("data") or "", re.S)
    if not m:
        raise RuntimeError("File bukan gambar.")
    out = g.OUT / slug / "scenes"
    out.mkdir(parents=True, exist_ok=True)
    name = f"up-{uuid.uuid4().hex[:10]}.{'png' if m.group(1) == 'png' else 'jpg'}"
    (out / name).write_bytes(base64.b64decode(m.group(2)))
    return {"url": f"/output/{slug}/scenes/{name}"}


def _slug(data):
    return re.sub(r"[^a-z0-9-]+", "-", (data.get("slug") or "produk").lower()).strip("-") or "produk"


def _dump(dataurl, path_noext):
    m = re.match(r"data:image/(\w+);base64,(.*)", dataurl or "", re.S)
    if not m:
        return None
    path = path_noext.with_suffix(".png" if m.group(1) == "png" else ".jpg")
    path.write_bytes(base64.b64decode(m.group(2)))
    return path


def analyze_style(data):
    """Claude membaca creative referensi (winning ads) dan merumuskan 'DNA gaya' visualnya."""
    imgs = []
    for u in (data.get("refs") or [])[:6]:
        m = re.match(r"data:(image/(?:png|jpeg|webp|gif));base64,(.*)", u, re.S)
        if m:
            imgs.append((m.group(1), m.group(2)))
    if not imgs:
        raise RuntimeError("Upload minimal 1 creative referensi.")
    return g.call(STYLE_PROMPT, 4000, system="Kamu art director Meta Ads. Balas hanya JSON valid.", images=imgs)


STYLE_PROMPT = """Gambar-gambar ini adalah creative iklan yang terbukti winning. Rumuskan DNA gaya visualnya
supaya bisa ditiru untuk produk LAIN tanpa menjiplak brand, produk, orang, atau teksnya.
Balas JSON:
{"ringkasan": "3-5 kalimat bahasa Indonesia untuk pemilik bisnis: kenapa gaya ini menarik dan apa cirinya",
 "style_dna": "English, 120-200 words: format (photo/UGC/graphic/collage/screenshot), composition & layout grid, where the product and person sit, camera & lighting, color palette (hex), typography style (weight, case, outline, highlight boxes, stickers), text placement & amount, graphic elements (arrows, badges, emojis, price tags, borders), overall mood",
 "text_slots": ["jenis teks yang biasanya muncul, mis. headline besar atas, badge harga, CTA bawah"]}"""


def make_creative(data):
    """Creative utuh bergaya referensi: referensi gaya + produk asli + (opsional) wajah influencer."""
    rid = uuid.uuid4().hex[:8]  # nama file unik: beberapa gambar dibuat bersamaan
    slug = _slug(data)
    out = g.OUT / slug / "final"
    out.mkdir(parents=True, exist_ok=True)
    tmp = g.OUT / slug / "refs"
    tmp.mkdir(parents=True, exist_ok=True)
    refs = [p for i, u in enumerate((data.get("refs") or [])[:3]) if (p := _dump(u, tmp / f"{rid}-style{i}"))]
    prod = _dump(data.get("foto"), tmp / f"{rid}-produk")
    face = _dump(data.get("influencer"), tmp / f"{rid}-influencer") if data.get("show_face", True) else None
    order, labels = [], []
    if refs:
        labels.append(f"Images 1-{len(refs)} are STYLE REFERENCES (winning ads): copy their visual style, layout, typography "
                      "treatment and mood, but NEVER their brand, product, people or words.")
        order += refs
    if prod:
        labels.append(f"Image {len(order) + 1} is the PRODUCT: show it EXACTLY as is (shape, color, label, logo), clearly visible.")
        order.append(prod)
    if face:
        labels.append(f"Image {len(order) + 1} is the INFLUENCER: if a person appears, keep this exact facial identity.")
        order.append(face)
    fmt = data.get("fmt", "9x16")
    aspect = {"9x16": "9:16", "4x5": "4:5"}[fmt]
    safe = ("Keep ALL text and the product inside the central area: nothing important in the top 14% or bottom 20% "
            "(Reels/Stories UI covers them)." if fmt == "9x16" else "Keep a small margin around all text.")
    prompt = (f"Create ONE finished, ready-to-run Meta ad creative, vertical {aspect}.\n{' '.join(labels)}\n\n"
              f"STYLE DNA to follow:\n{data.get('style_dna', '')}\n\nTHIS CREATIVE:\n{data.get('brief', '')}\n\n"
              f"Write every on-image text in Indonesian EXACTLY as given (correct spelling, no extra words, no fake numbers or logos). "
              f"{safe} Text must be large and readable on a phone.")
    img = g.ai_creative(prompt, [str(p) for p in order], aspect, data.get("engine", "auto"))
    W, H = (1080, 1920) if fmt == "9x16" else (1080, 1350)
    s = max(W / img.width, H / img.height)
    img = img.resize((round(img.width * s), round(img.height * s)))
    l, t = (img.width - W) // 2, (img.height - H) // 2
    name = f"{data.get('id', uuid.uuid4().hex)[:12]}-{fmt}-{uuid.uuid4().hex[:6]}.png"
    img.crop((l, t, l + W, t + H)).save(out / name)
    return {"url": f"/output/{slug}/final/{name}"}


SIZES = {"9:16": (1080, 1920), "4:5": (1080, 1350), "1:1": (1080, 1080)}


def make_batch(data):
    """Satu gambar dari satu brief + gambar referensi bebas (produk/model/gaya). Tanpa Claude."""
    rid = uuid.uuid4().hex[:8]  # nama file unik: beberapa gambar dibuat bersamaan
    out = g.OUT / "batch"
    out.mkdir(parents=True, exist_ok=True)
    tmp = out / "_refs"
    tmp.mkdir(exist_ok=True)
    refs = [p for i, u in enumerate((data.get("refs") or [])[:6]) if (p := _dump(u, tmp / f"{rid}-ref{i}"))]
    aspect = data.get("aspect", "9:16")
    note = data.get("note", "").strip()
    prompt = (f"{note}\n\n" if note else "") + data.get("prompt", "") + (
        f"\n\nVertical {aspect} image. Reference images are attached in order; follow what the text says about them "
        "(e.g. use the product exactly as shown, keep the person's face, copy the visual style). "
        "Any on-image text must be spelled exactly as written in the brief.")
    q = data.get("quality") if data.get("quality") in ("low", "medium", "high") else None
    img = g.ai_creative(prompt, [str(p) for p in refs], aspect, data.get("engine", "auto"), q)
    W, H = SIZES.get(aspect, (1080, 1920))
    s = max(W / img.width, H / img.height)
    img = img.resize((round(img.width * s), round(img.height * s)))
    l, t = (img.width - W) // 2, (img.height - H) // 2
    name = f"{time.strftime('%m%d-%H%M%S')}-{uuid.uuid4().hex[:6]}-{aspect.replace(':', 'x')}.png"
    img.crop((l, t, l + W, t + H)).save(out / name)
    return {"url": f"/output/batch/{name}"}


def make_image(data):
    if not any(os.environ.get(k) for k in KEYS[1:]):
        raise RuntimeError("API key foto AI (Gemini / OpenRouter / OpenAI) belum diisi.")
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
    rid = uuid.uuid4().hex[:8]
    foto_path, inf_path = dump(data.get("foto"), f"_{rid}-produk"), dump(data.get("influencer"), f"_{rid}-influencer")
    img = g.ai_scene(data.get("prompt", ""), str(foto_path) if foto_path else None, raise_errors=True,
                     influencer_path=str(inf_path) if inf_path else None, scene_type=data.get("scene_type"), show_face=data.get("show_face"), style=data.get("image_style") or "ugc")
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
