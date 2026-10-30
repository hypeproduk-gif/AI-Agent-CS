"""Shopee Affiliate autopost: Pinterest -> thumbnail -> caption -> Facebook + Instagram.

Pakai:
  python autopost.py --pin https://pin.it/xxxx --shopee https://s.shopee.co.id/xxxx \
      --produk "Serum Vitamin C" [--judul "Glowing 7 Hari"] [--dry-run]
  python autopost.py --video video-saya.mp4 --shopee ... --produk "..."   # video sendiri
  python autopost.py --video v.mp4 --shopee-fb LINK1 --shopee-ig LINK2 --shopee-threads LINK3 \
      --produk "..."   # link beda per platform untuk tracking Sub ID
"""
import argparse, json, os, shutil, subprocess, sys, time
from pathlib import Path

import requests
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont

load_dotenv()
OUT = Path("output")
GRAPH = f"https://graph.facebook.com/{os.getenv('GRAPH_VERSION', 'v21.0')}"
THREADS = "https://graph.threads.net/v1.0"


def download_pinterest(url: str, folder: Path) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["yt-dlp", "-f", "best[ext=mp4]/best", "--merge-output-format", "mp4",
         "-o", str(folder / "video.%(ext)s"), url],
        check=True,
    )
    return next(folder.glob("video.*"))


def make_thumbnail(video: Path, judul: str, folder: Path) -> Path:
    frame = folder / "frame.jpg"
    subprocess.run(["ffmpeg", "-y", "-ss", "1", "-i", str(video), "-frames:v", "1", str(frame)],
                   check=True, capture_output=True)
    img = Image.open(frame).convert("RGB")
    w, h = img.size
    draw = ImageDraw.Draw(img, "RGBA")
    size = max(28, w // 12)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", size)
    except OSError:
        font = ImageFont.load_default()
    # bungkus teks per baris
    lines, cur = [], ""
    for word in judul.upper().split():
        test = f"{cur} {word}".strip()
        if draw.textlength(test, font=font) > w * 0.9 and cur:
            lines.append(cur); cur = word
        else:
            cur = test
    lines.append(cur)
    box_h = len(lines) * int(size * 1.25) + size
    top = int(h * 0.62)
    draw.rectangle([0, top, w, top + box_h], fill=(238, 77, 45, 220))  # oranye Shopee
    y = top + size // 2
    for line in lines:
        x = (w - draw.textlength(line, font=font)) / 2
        draw.text((x, y), line, font=font, fill="white", stroke_width=2, stroke_fill="black")
        y += int(size * 1.25)
    thumb = folder / "thumbnail.jpg"
    img.save(thumb, quality=92)
    return thumb


COPY_SYSTEM = """Kamu copywriter affiliate Shopee Indonesia yang jago bikin orang berhenti scroll,
merasa "ini gue banget", lalu klik link. Tulis seperti orang biasa yang cerita ke teman, bukan brand.

ATURAN HOOK (baris pertama, maks 12 kata) - pilih yang paling cocok:
- tuding masalah spesifik: "Muka kusam padahal udah skincare-an tiap hari?"
- pengakuan/cerita: "Jujur nyesel baru tau ini sekarang..."
- kontras/kejutan: "Harganya cuma 40rb tapi hasilnya kayak treatment klinik"
- larangan/peringatan: "Jangan beli serum dulu sebelum liat ini"
- angka konkret: "3 hari pakai, temen kantor langsung nanya"
Hook harus menyebut situasi nyata target, bukan kata umum seperti "produk terbaik", "wajib punya".

STRUKTUR caption (PAS):
1. Hook.
2. Agitasi: 2-3 baris menggambarkan momen masalah sehari-hari yang menyebalkan/memalukan
   (detail konkret: tempat, waktu, perasaan, omongan orang).
3. Solusi: kenalkan produk sebagai hal yang "akhirnya ketemu", 3-4 poin manfaat dengan emoji,
   tiap poin = hasil yang dirasakan, bukan fitur teknis.
4. Penguat: harga/promo/rating/jumlah terjual bila diberikan; kalau tidak ada jangan dikarang.
5. CTA dengan urgensi wajar (stok/promo/flash sale hanya bila diberikan) - ajak klik sekarang.

LARANGAN: klaim medis/menyembuhkan, angka/testimoni palsu, kata "dijamin 100%",
bahasa kaku/formal, kalimat iklan klise. Kalimat pendek, banyak jeda baris, enak dibaca di HP."""


def ask_ai(system: str, prompt: str) -> str:
    """AI_PROVIDER=gemini (ada kuota gratis) atau anthropic (berbayar)."""
    if os.getenv("AI_PROVIDER", "anthropic") == "gemini":
        model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        r = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
            params={"key": os.environ["GEMINI_API_KEY"]},
            json={"system_instruction": {"parts": [{"text": system}]},
                  "contents": [{"parts": [{"text": prompt}]}],
                  "generationConfig": {"responseMimeType": "application/json"}},
            timeout=120)
        if not r.ok:
            raise RuntimeError(f"Gemini {r.status_code}: {r.text[:300]}")
        return r.json()["candidates"][0]["content"]["parts"][0]["text"]
    import anthropic
    msg = anthropic.Anthropic().messages.create(
        model=os.getenv("CLAUDE_MODEL", "claude-sonnet-5-5"), max_tokens=1500,
        system=system, messages=[{"role": "user", "content": prompt}])
    return msg.content[0].text


def make_caption(produk: str, shopee: str, info: str = "") -> dict:
    prompt = (
        f"Produk: {produk}\n"
        + (f"Info tambahan (target, masalah, harga, promo, keunggulan): {info}\n" if info else "")
        + "\nBalas JSON saja dengan field:\n"
        '- "judul": teks thumbnail maks 5 kata, memancing penasaran (bukan nama produk)\n'
        '- "headline": maks 40 karakter, untuk baris judul Facebook\n'
        '- "fb": caption Facebook mengikuti struktur PAS, 80-150 kata, tanpa link dan tanpa hashtag\n'
        '- "ig": caption Instagram Reels, hook beda dari fb, 60-120 kata, akhiri dengan ajakan '
        '"komen MAU" atau "cek link di komentar", tanpa link dan tanpa hashtag\n'
        '- "threads": storytelling orang pertama (masalah pribadi -> nemu produk -> hasil jujur), '
        "santai seperti curhat, tanpa hashtag, tanpa nada iklan, maks 450 karakter\n"
        '- "hashtags": 8-12 hashtag relevan tanpa tanda #'
    )
    text = ask_ai(COPY_SYSTEM, prompt)
    data = json.loads(text[text.find("{"): text.rfind("}") + 1])
    tags = " ".join("#" + t.lstrip("#") for t in data["hashtags"])
    data["fb"] = f"{data['headline']}\n\n{data['fb']}\n\n🛒 Cek di sini 👉 {shopee}\n\n{tags}"
    # IG tidak bisa klik link di caption -> link ditaruh di komentar pertama
    data["ig"] = f"{data['ig']}\n\n{tags}"
    return data


def post_facebook(video: Path, thumb: Path, caption: str) -> str:
    page, token = os.environ["META_PAGE_ID"], os.environ["META_PAGE_TOKEN"]
    with open(video, "rb") as v, open(thumb, "rb") as t:
        r = requests.post(f"https://graph-video.facebook.com/{page}/videos",
                          data={"access_token": token, "description": caption},
                          files={"source": v, "thumb": t}, timeout=600)
    r.raise_for_status()
    return r.json()["id"]


def post_instagram(video: Path, thumb: Path, caption: str, slug: str, shopee: str) -> str:
    ig, token = os.environ["META_IG_USER_ID"], os.environ["META_PAGE_TOKEN"]
    pub_dir = Path(os.getenv("PUBLIC_DIR", "./public"))
    pub_dir.mkdir(parents=True, exist_ok=True)
    base = os.environ["PUBLIC_BASE_URL"].rstrip("/")
    shutil.copy(video, pub_dir / f"{slug}.mp4")
    shutil.copy(thumb, pub_dir / f"{slug}.jpg")
    r = requests.post(f"{GRAPH}/{ig}/media", data={
        "media_type": "REELS", "video_url": f"{base}/{slug}.mp4",
        "cover_url": f"{base}/{slug}.jpg", "caption": caption, "access_token": token,
    }, timeout=60)
    r.raise_for_status()
    container = r.json()["id"]
    for _ in range(60):  # tunggu proses video maks ~10 menit
        s = requests.get(f"{GRAPH}/{container}",
                         params={"fields": "status_code", "access_token": token}).json()
        if s.get("status_code") == "FINISHED":
            break
        if s.get("status_code") == "ERROR":
            raise RuntimeError(f"IG gagal memproses video: {s}")
        time.sleep(10)
    r = requests.post(f"{GRAPH}/{ig}/media_publish",
                      data={"creation_id": container, "access_token": token}, timeout=60)
    r.raise_for_status()
    media_id = r.json()["id"]
    # link Shopee ditaruh di komentar pertama
    requests.post(f"{GRAPH}/{media_id}/comments",
                  data={"message": f"🛒 Link produk: {shopee}", "access_token": token})
    return media_id


def post_threads(slug: str, text: str, shopee: str) -> str:
    uid, token = os.environ["THREADS_USER_ID"], os.environ["THREADS_TOKEN"]
    base = os.environ["PUBLIC_BASE_URL"].rstrip("/")
    r = requests.post(f"{THREADS}/{uid}/threads", data={
        "media_type": "VIDEO", "video_url": f"{base}/{slug}.mp4",
        "text": text[:500], "access_token": token}, timeout=60)
    r.raise_for_status()
    container = r.json()["id"]
    for _ in range(60):
        s = requests.get(f"{THREADS}/{container}",
                         params={"fields": "status,error_message", "access_token": token}).json()
        if s.get("status") == "FINISHED":
            break
        if s.get("status") == "ERROR":
            raise RuntimeError(f"Threads gagal memproses video: {s}")
        time.sleep(10)
    r = requests.post(f"{THREADS}/{uid}/threads_publish",
                      data={"creation_id": container, "access_token": token}, timeout=60)
    r.raise_for_status()
    post_id = r.json()["id"]
    # link di balasan sendiri agar postingan utama tidak terlihat seperti iklan
    reply = requests.post(f"{THREADS}/{uid}/threads", data={
        "media_type": "TEXT", "text": f"Ini link yang aku pakai: {shopee}",
        "reply_to_id": post_id, "access_token": token}, timeout=60).json()
    time.sleep(5)
    requests.post(f"{THREADS}/{uid}/threads_publish",
                  data={"creation_id": reply["id"], "access_token": token}, timeout=60)
    return post_id


def main():
    ap = argparse.ArgumentParser()
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--pin", help="Link video Pinterest")
    src.add_argument("--video", help="File video sendiri (mp4)")
    ap.add_argument("--shopee", help="Link Shopee affiliate (dipakai semua platform)")
    ap.add_argument("--shopee-fb", help="Link khusus Facebook (Sub ID fb)")
    ap.add_argument("--shopee-ig", help="Link khusus Instagram (Sub ID ig)")
    ap.add_argument("--shopee-threads", help="Link khusus Threads (Sub ID threads)")
    ap.add_argument("--produk", required=True, help="Nama/deskripsi singkat produk")
    ap.add_argument("--judul", help="Teks thumbnail (default: dari AI)")
    ap.add_argument("--info", default="", help="Target, masalah, harga, promo, keunggulan")
    ap.add_argument("--dry-run", action="store_true", help="Jangan posting")
    ap.add_argument("--only", choices=["fb", "ig", "threads"], help="Posting ke satu platform saja")
    a = ap.parse_args()
    links = {k: getattr(a, f"shopee_{k}") or a.shopee for k in ("fb", "ig", "threads")}
    needed = [a.only] if a.only else ["fb", "ig", "threads"]
    missing = [k for k in needed if not links[k]]
    if missing:
        ap.error(f"link Shopee belum diisi untuk: {', '.join(missing)} (pakai --shopee atau --shopee-<platform>)")

    slug = time.strftime("%Y%m%d-%H%M%S")
    folder = OUT / slug
    print("1/4 Ambil video...")
    if a.video:
        folder.mkdir(parents=True, exist_ok=True)
        video = folder / "video.mp4"
        shutil.copy(a.video, video)
    else:
        video = download_pinterest(a.pin, folder)
    print("2/4 Buat caption...");        cap = make_caption(a.produk, links["fb"] or "", a.info)
    print("3/4 Buat thumbnail...");      thumb = make_thumbnail(video, a.judul or cap["judul"], folder)
    (folder / "caption.json").write_text(json.dumps(cap, ensure_ascii=False, indent=2))
    print(f"   hasil di {folder}")
    if a.dry_run:
        print(cap["fb"]); return
    print("4/4 Posting...")
    if a.only in (None, "fb"):
        print("   Facebook:", post_facebook(video, thumb, cap["fb"]))
    if a.only in (None, "ig"):
        print("   Instagram:", post_instagram(video, thumb, cap["ig"], slug, links["ig"]))
    if a.only == "threads" or (a.only is None and os.getenv("THREADS_TOKEN")):
        if a.only == "threads":  # file publik biasanya disalin oleh langkah IG
            pub = Path(os.getenv("PUBLIC_DIR", "./public")); pub.mkdir(parents=True, exist_ok=True)
            shutil.copy(video, pub / f"{slug}.mp4")
        print("   Threads:", post_threads(slug, cap["threads"], links["threads"]))


if __name__ == "__main__":
    sys.exit(main())
