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
    slug = time.strftime("%Y%m%d-%H%M%S")
    folder = ap.OUT / slug
    folder.mkdir(parents=True)
    try:
        upload = request.files.get("video")
        if upload and upload.filename:
            video = folder / "video.mp4"
            upload.save(video)
        elif f.get("pin"):
            video = ap.download_pinterest(f["pin"].strip(), folder)
        else:
            return "Isi video atau link Pinterest", 400
        links = {k: (f.get(f"shopee_{k}") or f.get("shopee") or "").strip() for k in PLATFORMS}
        cap = ap.make_caption(f["produk"], links["fb"])
        judul = f.get("judul") or cap["judul"]
        ap.make_thumbnail(video, judul, folder)
    except Exception as e:
        shutil.rmtree(folder, ignore_errors=True)
        return f"Gagal: {e}", 500
    save(slug, {"slug": slug, "produk": f["produk"], "judul": judul, "video": video.name,
                "links": links, "headline": cap["headline"],
                "text": {"fb": cap["fb"], "ig": cap["ig"], "threads": cap["threads"]},
                "status": {}})
    return redirect(url_for("job", slug=slug))


@app.get("/job/<slug>")
@login_required
def job(slug):
    return render_template("job.html", job=load(slug), platforms=PLATFORMS)


@app.get("/job/<slug>/file/<name>")
@login_required
def job_file(slug, name):
    return send_from_directory(job_dir(slug), name)


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
