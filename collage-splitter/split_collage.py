#!/usr/bin/env python3
"""Pisahkan kolase foto menjadi file satu per satu, dengan ukuran sesuai keinginan.

Contoh:
  python split_collage.py kolase.jpg                       # deteksi otomatis, ukuran asli
  python split_collage.py kolase.jpg --grid 2x3            # kolase rapi 2 baris x 3 kolom
  python split_collage.py folder_kolase/ --size 1080x1080 --fit cover
  python split_collage.py kolase.png --width 1200 --format png
"""
import argparse
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageOps

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}


def detect_boxes(img, min_area_pct, tol, pad):
    """Cari kotak tiap foto dengan memisahkan dari warna latar (spasi/border kolase)."""
    bgr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    h, w = bgr.shape[:2]
    border = np.concatenate([bgr[0, :], bgr[-1, :], bgr[:, 0], bgr[:, -1]])
    bg = np.median(border, axis=0)
    diff = np.abs(bgr.astype(np.int16) - bg.astype(np.int16)).max(axis=2)
    mask = (diff > tol).astype(np.uint8) * 255
    k = max(3, int(min(h, w) * 0.004))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((k, k), np.uint8), iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((k, k), np.uint8))
    cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    boxes = []
    for c in cnts:
        x, y, bw, bh = cv2.boundingRect(c)
        if bw * bh >= h * w * min_area_pct / 100:
            boxes.append((x + pad, y + pad, x + bw - pad, y + bh - pad))
    # urut baca: atas->bawah, kiri->kanan
    rows = sorted(boxes, key=lambda b: b[1])
    out, row = [], []
    for b in rows:
        if row and b[1] > row[0][1] + (row[0][3] - row[0][1]) * 0.5:
            out += sorted(row, key=lambda r: r[0]); row = []
        row.append(b)
    out += sorted(row, key=lambda r: r[0])
    return out


def grid_boxes(img, rows, cols, pad):
    w, h = img.size
    return [
        (c * w // cols + pad, r * h // rows + pad, (c + 1) * w // cols - pad, (r + 1) * h // rows - pad)
        for r in range(rows) for c in range(cols)
    ]


def resize(im, width, height, fit):
    if not width and not height:
        return im
    if width and height:
        if fit == "cover":
            return ImageOps.fit(im, (width, height), Image.LANCZOS)
        if fit == "contain":
            im = ImageOps.contain(im, (width, height), Image.LANCZOS)
            canvas = Image.new("RGB", (width, height), (255, 255, 255))
            canvas.paste(im, ((width - im.width) // 2, (height - im.height) // 2))
            return canvas
        return im.resize((width, height), Image.LANCZOS)  # stretch
    if width:
        return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    return im.resize((round(im.width * height / im.height), height), Image.LANCZOS)


def process(path, args, outdir):
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    if args.grid:
        r, c = map(int, args.grid.lower().split("x"))
        boxes = grid_boxes(img, r, c, args.pad)
    else:
        boxes = detect_boxes(img, args.min_area, args.tol, args.pad)
    if not boxes:
        print(f"[!] {path.name}: tidak ada foto terdeteksi. Coba --grid RxC atau turunkan --tol.")
        return 0
    outdir.mkdir(parents=True, exist_ok=True)
    for i, b in enumerate(boxes, 1):
        crop = resize(img.crop(b), args.width, args.height, args.fit)
        dest = outdir / f"{path.stem}_{i:02d}.{args.format}"
        if args.format == "png":
            crop.save(dest, optimize=True)
        else:
            crop.save(dest, quality=args.quality, subsampling=0, optimize=True)
    print(f"[ok] {path.name}: {len(boxes)} foto -> {outdir}")
    return len(boxes)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("input", help="file kolase atau folder berisi kolase")
    p.add_argument("-o", "--out", default="hasil", help="folder output (default: hasil)")
    p.add_argument("--grid", help="mode grid tetap, mis. 2x3 (baris x kolom); default: deteksi otomatis")
    p.add_argument("--size", help="ukuran output WxH, mis. 1080x1080")
    p.add_argument("--width", type=int, help="lebar output (tinggi menyesuaikan rasio)")
    p.add_argument("--height", type=int, help="tinggi output (lebar menyesuaikan rasio)")
    p.add_argument("--fit", choices=["cover", "contain", "stretch"], default="cover",
                   help="bila WxH diberikan: cover=crop pas, contain=ada margin putih, stretch=ubah paksa")
    p.add_argument("--format", choices=["jpg", "png", "webp"], default="jpg")
    p.add_argument("--quality", type=int, default=95, help="kualitas JPG/WEBP 1-100 (default 95)")
    p.add_argument("--tol", type=int, default=25, help="toleransi warna latar (default 25)")
    p.add_argument("--min-area", type=float, default=1.0, help="min. luas foto, %% dari kolase (default 1)")
    p.add_argument("--pad", type=int, default=0, help="potong n piksel dari tepi tiap foto (buang border)")
    args = p.parse_args()
    if args.size:
        args.width, args.height = map(int, args.size.lower().split("x"))
    if args.format == "jpeg":
        args.format = "jpg"

    src = Path(args.input)
    files = sorted(f for f in src.iterdir() if f.suffix.lower() in EXTS) if src.is_dir() else [src]
    total = sum(process(f, args, Path(args.out)) for f in files)
    print(f"Selesai: {total} foto dari {len(files)} kolase.")
    return 0 if total else 1


if __name__ == "__main__":
    sys.exit(main())
