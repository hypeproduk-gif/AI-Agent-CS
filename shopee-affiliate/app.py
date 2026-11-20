"""Web app Shopee Affiliate: upload video / link Pinterest -> preview caption & thumbnail -> posting.

Jalankan: python app.py   (default port 8090, login pakai APP_PASSWORD di .env)
"""
import json, os, re, shutil, threading, time, traceback
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path

from flask import (Flask, Response, abort, redirect, render_template, request,
                   send_from_directory, url_for)

import autopost as ap
import shopee_api

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
    info = f.get("info", "")
    product_url = f.get("product_url", "").strip()
    if product_url and shopee_api.enabled():
        try:
            auto = shopee_api.links_per_platform(product_url)
            links = {k: links[k] or auto[k] for k in PLATFORMS}
            extra = shopee_api.product_info(product_url)
            info = f"{info}\n{extra}".strip() if extra else info
        except Exception as e:
            return f"Gagal mengambil dari Shopee API: {e}", 500
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
                    "video": "video.mp4", "links": links, "info": info, "headline": "", "pin": url,
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


@app.post("/job/<slug>/retry")
@login_required
def retry(slug):
    j = load(slug)
    j["gen"] = "antre..."
    save(slug, j)
    threading.Thread(target=run_generate, args=([slug],), daemon=True).start()
    return redirect(url_for("job", slug=slug))


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


# ---------- Antrean Threads: teks dari generator, posting otomatis terjadwal ----------
QUEUE = ap.OUT / "threads_queue.json"
QLOCK = threading.Lock()
WIB = timezone(timedelta(hours=7))


def q_load() -> list:
    try:
        return json.loads(QUEUE.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def q_save(items: list):
    QUEUE.parent.mkdir(exist_ok=True)
    QUEUE.write_text(json.dumps(items, ensure_ascii=False, indent=2))


def slot_times() -> list:
    return [t.strip() for t in os.getenv("THREADS_TIMES", "07:00,12:00,19:00").split(",") if t.strip()]


def parse_bulk(raw: str, link: str) -> list:
    """Blok dipisah baris '---'. Baris yang diawali 'KOMENTAR:' = balasan berisi link."""
    items = []
    for block in re.split(r"^\s*---+\s*$", raw, flags=re.M):
        post, reply = [], ""
        for line in block.strip().splitlines():
            if line.upper().startswith("KOMENTAR:"):
                reply = line.split(":", 1)[1].strip()
            else:
                post.append(line)
        text = "\n".join(post).strip()
        if text:
            if not reply and link:
                reply = f"Ini yang aku pakai: {link}"
            items.append({"text": text, "reply": reply})
    return items


def q_post(item: dict):
    image_url = ""
    if item.get("image"):
        image_url = f"{os.environ['PUBLIC_BASE_URL'].rstrip('/')}/{item['image']}"
    try:
        pid = ap.threads_post_with_reply(item["text"], item.get("reply", ""), image_url=image_url)
        item.update(status="posted", post_id=pid, posted_ts=time.time(), posted_at=datetime.now(WIB).strftime("%d/%m %H:%M"))
    except Exception as e:
        traceback.print_exc()
        item.update(status="error", error=str(e)[:300])


def q_next_pending(items: list):
    """Selang-seling: kalau postingan terakhir berlink, utamakan obrolan (tanpa link), dan sebaliknya."""
    pending = [i for i in items if i["status"] == "pending"]
    if not pending:
        return None
    posted = [i for i in items if i["status"] == "posted"]
    by_time = sorted(posted, key=lambda i: i.get("posted_ts", 0))
    last = by_time[-1] if by_time else None
    want_link = not bool(last.get("reply")) if last else True
    same_type = [i for i in pending if bool(i.get("reply")) == want_link] or pending
    # Hindari kiriman (produk) yang sama tayang berturut-turut: pilih batch yang paling lama tidak tayang
    last_seen = {i.get("batch"): i.get("posted_ts", 0) for i in by_time}
    return min(same_type, key=lambda i: last_seen.get(i.get("batch"), -1))


ENV_FILE = Path(__file__).with_name(".env")


def refresh_threads_token():
    """Perpanjang token Threads (berlaku ~60 hari) dan simpan token baru ke .env."""
    import requests
    r = requests.get("https://graph.threads.net/refresh_access_token", timeout=30, params={
        "grant_type": "th_refresh_token", "access_token": os.environ["THREADS_TOKEN"]})
    if not r.ok:
        print("Gagal perpanjang token Threads:", r.text[:300])
        return
    new = r.json()["access_token"]
    os.environ["THREADS_TOKEN"] = new
    if ENV_FILE.exists():
        text = re.sub(r"^THREADS_TOKEN=.*$", f"THREADS_TOKEN={new}", ENV_FILE.read_text(), flags=re.M)
        ENV_FILE.write_text(text)
    print("Token Threads diperpanjang")


def cleanup_posted(days: float = 3):
    """Hapus postingan yang sudah tayang lebih dari `days` hari beserta fotonya."""
    cutoff = time.time() - days * 86400
    with QLOCK:
        items = q_load()
        keep = []
        for it in items:
            if it.get("status") == "posted" and it.get("posted_ts", 0) < cutoff:
                if it.get("image"):
                    (PUB / it["image"]).unlink(missing_ok=True)
            else:
                keep.append(it)
        if len(keep) != len(items):
            q_save(keep)


def scheduler():
    done = set()
    last_cleanup = 0.0
    last_refresh = time.time() - 6 * 86400  # percobaan pertama sehari setelah start (token min. 24 jam)
    while True:
        if os.getenv("THREADS_TOKEN") and time.time() - last_refresh > 7 * 86400:
            last_refresh = time.time()
            try:
                refresh_threads_token()
            except Exception:
                traceback.print_exc()
        if time.time() - last_cleanup > 3600:
            last_cleanup = time.time()
            cleanup_posted(float(os.getenv("THREADS_KEEP_DAYS", "3")))
        now = datetime.now(WIB)
        key = now.strftime("%Y-%m-%d %H:%M")
        if now.strftime("%H:%M") in slot_times() and key not in done and os.getenv("THREADS_TOKEN"):
            done.add(key)
            with QLOCK:
                items = q_load()
                item = q_next_pending(items)
                if item:
                    q_post(item)
                    q_save(items)
        time.sleep(20)


@app.get("/threads")
@login_required
def threads_page():
    items = q_load()
    return render_template("threads.html", items=list(enumerate(items)), times=slot_times(),
                           https=os.getenv("PUBLIC_BASE_URL", "").startswith("https://"),
                           ready=bool(os.getenv("THREADS_TOKEN")),
                           pending=sum(i["status"] == "pending" for i in items))


@app.post("/threads/add")
@login_required
def threads_add():
    new = parse_bulk(request.form.get("bulk", ""), request.form.get("link", "").strip())
    img = request.files.get("image")
    image_name = ""
    if img and img.filename and len(new) == 1:
        PUB.mkdir(parents=True, exist_ok=True)
        image_name = f"th-{int(time.time())}{Path(img.filename).suffix.lower() or '.jpg'}"
        img.save(PUB / image_name)
    batch = str(time.time())
    with QLOCK:
        items = q_load()
        for it in new:
            items.append({**it, "image": image_name, "status": "pending", "batch": batch,
                          "added": datetime.now(WIB).strftime("%d/%m %H:%M")})
        q_save(items)
    return redirect(url_for("threads_page"))


@app.post("/threads/<int:i>/image")
@login_required
def threads_image(i):
    img = request.files.get("image")
    with QLOCK:
        items = q_load()
        if not 0 <= i < len(items):
            abort(404)
        if img and img.filename:
            PUB.mkdir(parents=True, exist_ok=True)
            name = f"th-{int(time.time())}-{i}{Path(img.filename).suffix.lower() or '.jpg'}"
            img.save(PUB / name)
            items[i]["image"] = name
        elif request.form.get("remove"):
            items[i]["image"] = ""
        q_save(items)
    return redirect(url_for("threads_page"))


@app.post("/threads/<int:i>/<action>")
@login_required
def threads_action(i, action):
    with QLOCK:
        items = q_load()
        if not 0 <= i < len(items):
            abort(404)
        if action == "delete":
            items.pop(i)
        elif action == "now":
            q_post(items[i])
        elif action == "up" and i > 0:
            items[i - 1], items[i] = items[i], items[i - 1]
        q_save(items)
    return redirect(url_for("threads_page"))


@app.get("/media/<path:name>")
def media(name):  # publik, dibaca server Instagram/Threads
    return send_from_directory(PUB, name)


if __name__ == "__main__":
    ap.OUT.mkdir(exist_ok=True)
    threading.Thread(target=scheduler, daemon=True).start()
    app.run(host="0.0.0.0", port=int(os.getenv("APP_PORT", 8090)))
