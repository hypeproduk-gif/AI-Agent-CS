"""Storyboard -> video konsisten.

Alur per shot:
  1. Keyframe  : image-edit multi-referensi (karakter + produk + storyboard) + style & seed tetap.
  2. Animasi   : image-to-video dari keyframe (opsional tail frame = keyframe shot berikutnya,
                 atau frame awal = frame terakhir shot sebelumnya).
  3. Gabung    : ffmpeg concat -> out/<project>/final.mp4

Hasil tiap langkah di-cache di out/<project>/, jadi re-run hanya mengerjakan yang belum ada
(hapus file keyframe/klip tertentu untuk regenerate satu shot saja).

Env: FAL_KEY (https://fal.ai/dashboard/keys). Butuh ffmpeg di PATH.
"""
import argparse, base64, json, mimetypes, os, shutil, subprocess, sys, time
from pathlib import Path

import requests, yaml

IMAGE_MODEL = os.getenv("IMAGE_MODEL", "fal-ai/nano-banana/edit")
VIDEO_MODEL = os.getenv("VIDEO_MODEL", "fal-ai/kling-video/v2.1/pro/image-to-video")
QUEUE = "https://queue.fal.run"


def data_uri(path, dry=False):
    if dry:
        return f"<{path}>"
    mime = mimetypes.guess_type(str(path))[0] or "image/png"
    return f"data:{mime};base64," + base64.b64encode(Path(path).read_bytes()).decode()


def fal(model, payload, dry):
    if dry:
        print(f"  [dry-run] {model}: {json.dumps({k: (v[:40] + '…' if isinstance(v, str) and len(v) > 40 else v) for k, v in payload.items() if k != 'image_urls'})}")
        return None
    h = {"Authorization": f"Key {os.environ['FAL_KEY']}"}
    r = requests.post(f"{QUEUE}/{model}", json=payload, headers=h, timeout=120)
    r.raise_for_status()
    job = r.json()
    while True:
        s = requests.get(job["status_url"], headers=h, timeout=60).json()
        if s["status"] == "COMPLETED":
            break
        if s["status"] not in ("IN_QUEUE", "IN_PROGRESS"):
            sys.exit(f"{model} gagal: {s}")
        time.sleep(5)
    return requests.get(job["response_url"], headers=h, timeout=60).json()


def download(url, dest):
    with requests.get(url, stream=True, timeout=300) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            shutil.copyfileobj(r, f)


def last_frame(video, dest):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-sseof", "-0.1", "-i", str(video),
                    "-frames:v", "1", "-q:v", "2", str(dest)], check=True)


def make_keyframe(sb, shot, out, dry):
    dest = out / f"{shot['id']}_key.png"
    if dest.exists():
        return dest
    refs = list(sb.get("references", {}).items())
    images = [data_uri(p, dry) for _, p in refs]
    names = ", ".join(f"image {i + 1} = '{n}'" for i, (n, _) in enumerate(refs))
    if shot.get("storyboard"):
        images.append(data_uri(shot["storyboard"], dry))
        names += f", image {len(images)} = storyboard sketch (follow its composition and framing only)"
    prompt = (f"{shot['keyframe']}. {sb.get('character_lock', '')} "
              f"Style: {sb['style']}. References: {names}. Keep identity, product and palette identical to references.")
    res = fal(IMAGE_MODEL, {"prompt": prompt, "image_urls": images, "num_images": 1,
                            "aspect_ratio": sb.get("aspect_ratio", "9:16"), "seed": sb.get("seed"),
                            "output_format": "png"}, dry)
    if res:
        download(res["images"][0]["url"], dest)
    return dest


def make_clip(sb, shot, start_img, tail_img, out, dry):
    dest = out / f"{shot['id']}.mp4"
    if dest.exists():
        return dest
    payload = {"prompt": f"{shot['motion']}. {sb['style']}. Same person and product throughout, no morphing.",
               "image_url": None if dry else data_uri(start_img),
               "duration": str(shot.get("duration", 5)),
               "negative_prompt": "blur, distort, low quality, face change, extra fingers, text artifacts",
               "cfg_scale": 0.5}
    if tail_img and (dry or Path(tail_img).exists()):
        payload["tail_image_url"] = None if dry else data_uri(tail_img)
    res = fal(VIDEO_MODEL, payload, dry)
    if res:
        download(res["video"]["url"], dest)
    return dest


def concat(clips, dest):
    lst = dest.with_suffix(".txt")
    lst.write_text("".join(f"file '{c.resolve()}'\n" for c in clips))
    # re-encode agar fps/resolusi seragam antar klip
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "18", "-an", str(dest)], check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("storyboard")
    ap.add_argument("--dry-run", action="store_true", help="tampilkan request tanpa memanggil API")
    ap.add_argument("--keyframes-only", action="store_true", help="berhenti setelah keyframe (review dulu)")
    ap.add_argument("--tail", action="store_true", help="pakai keyframe shot berikutnya sebagai frame akhir")
    a = ap.parse_args()

    sb = yaml.safe_load(Path(a.storyboard).read_text())
    out = Path("out") / sb["project"]
    out.mkdir(parents=True, exist_ok=True)
    if not a.dry_run and not os.getenv("FAL_KEY"):
        sys.exit("Set FAL_KEY dulu.")
    shots = sb["shots"]

    print("1/3 Keyframe")
    keys = []
    for s in shots:
        print(f"- {s['id']}")
        keys.append(make_keyframe(sb, s, out, a.dry_run))
    if a.keyframes_only:
        print(f"Keyframe di {out}/ — cek, hapus yang jelek, jalankan ulang.")
        return

    print("2/3 Animasi")
    clips = []
    for i, s in enumerate(shots):
        print(f"- {s['id']}")
        start = keys[i]
        if s.get("continue_from_previous") and clips:
            start = out / f"{s['id']}_start.png"
            if not a.dry_run and not start.exists():
                last_frame(clips[-1], start)
        tail = keys[i + 1] if a.tail and i + 1 < len(shots) and not shots[i + 1].get("continue_from_previous") else None
        clips.append(make_clip(sb, s, start, tail, out, a.dry_run))

    if a.dry_run:
        return
    print("3/3 Gabung")
    concat(clips, out / "final.mp4")
    print(f"Selesai: {out / 'final.mp4'}")


if __name__ == "__main__":
    main()
