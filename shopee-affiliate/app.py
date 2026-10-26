"""Web app Shopee Affiliate: upload video / link Pinterest -> preview caption & thumbnail -> posting.

Jalankan: python app.py   (default port 8090, login pakai APP_PASSWORD di .env)
"""
import json, os, shutil, threading, time, traceback
from functools import wraps
from pathlib import Path

from flask import (Flask, Response, abort, redirect, render_template, request,
                   send_from_directory, url_for)

import autopost as ap

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 300 * 1024 * 1024  # 300 MB
PUB = Path(os.getenv("PUBLIC_DIR", "./public"))
PLATFORMS = {"fb": "Facebook", "ig": "Instagram", "threads": "Threads"}


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.authorization
        if not auth or auth.password != os.environ["APP_PASSWORD"]:
            return Response("Login dulu", 401, {"WWW-Authenticate": 'Basic realm="autopost"'})
        return f(*args, **kwargs)
    return wrapper


def job_dir(slug: str) -> Path:
    d = ap.OUT / slug
    if "/" in slug or ".." in slug or not d.is_dir():
        abort(404)
    return d


def load(slug: str) -> dict:
    return json.loads((job_dir(slug) / "job.json").read_text())


def save(slug: str, job: dict):
    (ap.OUT / slug / "job.json").write_text(json.dumps(job, ensure_ascii=False, indent=2))


@app.get("/")
@login_required
def index():
    jobs = []
    for d in sorted(ap.OUT.glob("*/job.json"), reverse=True)[:20]:
        jobs.append(json.loads(d.read_text()))
    return render_template("index.html", jobs=jobs, platforms=PLATFORMS)


@app.post("/generate")
@login_required
def generate():
    f = request.form
    links = {k: (f.get(f"shopee_{k}") or f.get("shopee") or "").strip() for k in PLATFORMS}
    sources = []
    base = time.strftime("%Y%m%d-%H%M%S")
    for i, up in enumerate(u for u in request.files.getlist("video") if u.filename):
        folder = ap.OUT / f"{base}-{len(sources) + 1}"
        folder.mkdir(parents=True)
        up.save(folder / "video.mp4")
        sources.append((folder.name, None))
    for url in f.get("pin", "").split():
        folder = ap.OUT / f"{base}-{len(sources) + 1}"
        folder.mkdir(parents=True)
        sources.append((folder.name, url.strip()))
    if not sources:
        return "Isi video atau link Pinterest", 400
    for slug, url in sources:
        save(slug, {"slug": slug, "produk": f["produk"], "judul": f.get("judul", ""),
                    "video": "video.mp4", "links": links, "info": f.get("info", ""), "headline": "", "pin": url,
                    "text": {k: "" for k in PLATFORMS}, "status": {}, "gen": "antre..."})
    threading.Thread(target=run_generate, args=([s for s, _ in sources],), daemon=True).start()
    return redirect(url_for("job", slug=sources[0][0]) if len(sources) == 1 else url_for("index"))


def run_generate(slugs: list):
    for slug in slugs:
        folder = ap.OUT / slug
        j = load(slug)
        j["gen"] = "memproses..."; save(slug, j)
        try:
            video = folder / "video.mp4"
            if j["pin"]:
                video = ap.download_pinterest(j["pin"], folder)
            cap = ap.make_caption(j["produk"], j["links"]["fb"], j.get("info", ""))
            j["judul"] = j["judul"] or cap["judul"]
            ap.make_thumbnail(video, j["judul"], folder)
            j.update(video=video.name, headline=cap["headline"], gen="",
                     text={"fb": cap["fb"], "ig": cap["ig"], "threads": cap["threads"]})
        except Exception as e:
            traceback.print_exc()
            j["gen"] = f"❌ {e}"[:300]
        save(slug, j)


@app.get("/job/<slug>")
@login_required
def job(slug):
    return render_template("job.html", job=load(slug), platforms=PLATFORMS)


@app.get("/job/<slug>/file/<name>")
@login_required
def job_file(slug, name):
    return send_from_directory(job_dir(slug), name)


@app.post("/job/<slug>/recaption")
@login_required
def recaption(slug):
    j = load(slug)
    j["info"] = request.form.get("info", j.get("info", ""))
    try:
        cap = ap.make_caption(j["produk"], j["links"]["fb"], j["info"])
    except Exception as e:
        return f"Gagal: {e}", 500
    j.update(headline=cap["headline"], text={"fb": cap["fb"], "ig": cap["ig"], "threads": cap["threads"]})
    save(slug, j)
    return redirect(url_for("job", slug=slug))


@app.post("/job/<slug>/post")
@login_required
def post(slug):
    j = load(slug)
    for k in PLATFORMS:
        j["text"][k] = request.form.get(f"text_{k}", j["text"][k])
    chosen = [k for k in PLATFORMS if request.form.get(f"on_{k}")]
    for k in chosen:
        if not j["links"][k]:
            return f"Link Shopee untuk {PLATFORMS[k]} kosong", 400
        j["status"][k] = "menunggu..."
    save(slug, j)
    threading.Thread(target=run_post, args=(slug, chosen), daemon=True).start()
    return redirect(url_for("job", slug=slug))


def run_post(slug: str, chosen: list):
    folder = ap.OUT / slug
    j = load(slug)
    video, thumb = folder / j["video"], folder / "thumbnail.jpg"
    PUB.mkdir(parents=True, exist_ok=True)
    shutil.copy(video, PUB / f"{slug}.mp4")
    shutil.copy(thumb, PUB / f"{slug}.jpg")
    for k in chosen:
        j["status"][k] = "memproses..."; save(slug, j)
        try:
            if k == "fb":
                pid = ap.post_facebook(video, thumb, j["text"]["fb"])
            elif k == "ig":
                pid = ap.post_instagram(video, thumb, j["text"]["ig"], slug, j["links"]["ig"])
            else:
                pid = ap.post_threads(slug, j["text"]["threads"], j["links"]["threads"])
            j["status"][k] = f"✅ terposting (id {pid})"
        except Exception as e:
            traceback.print_exc()
            body = getattr(getattr(e, "response", None), "text", "")
            j["status"][k] = f"❌ {e} {body}"[:500]
        save(slug, j)


@app.get("/media/<path:name>")
def media(name):  # publik, dibaca server Instagram/Threads
    return send_from_directory(PUB, name)


if __name__ == "__main__":
    ap.OUT.mkdir(exist_ok=True)
    app.run(host="0.0.0.0", port=int(os.getenv("APP_PORT", 8090)))
