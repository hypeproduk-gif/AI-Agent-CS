#!/usr/bin/env python3
"""Generator creative Meta Ads: brief produk -> gambar 9:16 & 4:5 + primary text + headline.

  python3 ads/generate.py ads/briefs/produk.txt --foto foto.png [--jumlah 15] [--cep 1,3] [--angle fomo,regret]

Env: ANTHROPIC_API_KEY (wajib), GEMINI_API_KEY (opsional, foto scene UGC dari foto produk asli).
"""
import argparse, base64, csv, io, json, os, re, sys, urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "output"
HISTORY = OUT / "_history.json"
MODEL = os.environ.get("ADS_MODEL", "claude-sonnet-5-5")
SIZES = {"9x16": (1080, 1920), "4x5": (1080, 1350)}
# Zona aman: Reels/Stories menutup ~14% atas & ~20% bawah
SAFE = {"9x16": (0.14, 0.20), "4x5": (0.05, 0.06)}
FONT_BOLD = ["/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
FONT_REG = ["/usr/share/fonts/opentype/inter/Inter-SemiBold.otf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]

SYSTEM = """Kamu media buyer + direct-response copywriter Meta Ads Indonesia dengan rekam jejak ROAS tinggi untuk objective PURCHASE.
Prinsip yang kamu pegang:
- Satu creative = satu angle = satu pesan. Hook berhenti-scroll dalam 1 detik (≤8 kata, spesifik, bukan generik).
- Angle WAJIB lahir dari detail unik produk ini (bahan, angka, momen pakai, keberatan khas target). Kalau hook bisa dipakai produk lain, buang.
- Variasikan tingkat awareness (problem-aware, solution-aware, product-aware) dan framework.

PENDEKATAN CEP (Category Entry Points): sebelum menulis, petakan 6 CEP = momen/situasi nyata saat target
teringat butuh kategori produk ini (KAPAN, DI MANA, BERSAMA SIAPA, KARENA APA, PERASAAN APA). Contoh skincare:
"pagi sebelum meeting lihat wajah kusam di cermin lift". CEP harus spesifik ke target di brief, bukan umum.
Setiap creative = 1 CEP x 1 ANGLE PSIKOLOGI. Momen CEP jadi latar hook, visual (image_prompt), dan copy.

15 ANGLE PSIKOLOGI (impulsive buying) — pakai id persis:
fomo (takut ketinggalan tren), instant_gratification (hasil cepat terasa), curiosity_gap (info sengaja belum lengkap),
shock_result (hasil di luar ekspektasi), social_proof (banyak orang pakai), authority (rekomendasi ahli),
hidden_gem (rahasia yang jarang dibahas), relatable_pain (masalah yang "ini aku banget"),
transformation (perubahan yang diinginkan), value_shock (harga terasa terlalu murah untuk nilainya),
curated_discovery (nemu tanpa sengaja, terasa organik), emotional_story (cerita personal/insecure),
comparison_curiosity (A vs B), demonstration_proof (tes langsung di depan kamera), regret_trigger ("nyesel baru tau").
Hook ditulis gaya orang pertama/UGC yang natural, bukan bahasa brand.

PAGAR KEJUJURAN per angle (wajib, iklan yang bohong = akun kena banned & refund tinggi):
- fomo/social_proof: hanya klaim viral/sold out/jumlah pembeli jika ADA di brief; kalau tidak, pakai momen tren tanpa angka palsu.
- authority: hanya jika brief menyebut ahli/sertifikasi nyata; kalau tidak, jadikan "cara ahli memilih bahan X" (edukasi).
- instant_gratification/shock_result/transformation: sebut sensasi atau hasil yang realistis sesuai brief, bukan janji instan; untuk kesehatan/berat badan hindari before-after (dilarang Meta).
- value_shock: hanya harga/promo di brief, bandingkan dengan nilai (per pemakaian, per hari), bukan harga coret palsu.
- emotional_story/curated_discovery: cerita boleh berupa persona ilustratif, tapi jangan pakai nama & kutipan seolah testimoni asli.
- Copy bahasa Indonesia sehari-hari, ngobrol, bukan bahasa iklan kaku. Primary text: hook di baris 1 (terlihat sebelum "lihat selengkapnya"), lalu masalah -> solusi -> bukti -> penawaran -> CTA. Pakai baris kosong, emoji secukupnya.
- Headline ≤40 karakter, fokus benefit/penawaran. Description ≤25 karakter.
- Kepatuhan Meta: jangan menyinggung atribut pribadi ("Kamu gendut?"), jangan klaim medis/hasil instan/garansi palsu, patuhi larangan klaim di brief.
- Testimoni HANYA boleh memakai kutipan yang ada di brief. Jika brief tidak punya testimoni, jangan pakai layout testimonial.
- Jangan mengarang angka, sertifikasi, atau harga yang tidak ada di brief."""

SCHEMA = """Balas HANYA JSON valid:
{
 "slug": "nama-produk-kebab",
 "strategy": {"ceps": [{"id": "cep1", "moment": "situasi spesifik", "trigger": "yang dirasakan/dipikirkan"}], "avatar": "", "core_desire": "", "main_pain": "", "objections": ["",""], "usp": "", "offer": ""},
 "creatives": [{
   "cep": "cep1",
   "psych_angle": "salah satu id dari 15 angle",
   "angle": "nama angle singkat (CEP x psikologi)",
   "awareness": "problem|solution|product",
   "framework": "problem_solution|before_after|testimonial|comparison|offer|myth_buster|ugc_callout",
   "layout": "hero|testimonial|split|comparison",
   "hook": "≤8 kata, teks besar di gambar",
   "subhead": "≤14 kata",
   "bullets": ["≤5 kata","≤5 kata","≤5 kata"],
   "badge": "≤3 kata (mis. 'BELI 1 GRATIS 1')",
   "cta": "≤3 kata",
   "quote": {"text": "", "name": ""},
   "split": {"left_label": "", "left": "", "right_label": "", "right": ""},
   "comparison": {"them_label": "", "them": ["","",""], "us_label": "", "us": ["","",""]},
   "palette": {"bg1": "#hex", "bg2": "#hex", "accent": "#hex", "text": "#hex"},
   "visual_brief": "arahan foto/video untuk tim konten (Indonesia): momen CEP, setting, pose, properti. Tulis [PRODUK ASLI] di setiap bagian yang WAJIB pakai foto/video produk asli (dipegang, dipakai, dites, teksturnya, kemasannya)",
   "image_prompt": "English: UGC photo of the exact CEP moment for this angle (who, where, time of day, emotion, what they do with the product). For transformation/demonstration show the product in use. No text.",
   "primary_text": "versi panjang",
   "primary_text_short": "versi ≤125 karakter",
   "headlines": ["","",""],
   "description": ""
 }]
}
Isi quote/split/comparison hanya sesuai layout-nya (lainnya boleh kosong)."""


def call(user, max_tokens=32000):
    key = os.environ.get("ANTHROPIC_API_KEY") or sys.exit("ANTHROPIC_API_KEY belum di-set")
    body = json.dumps({"model": MODEL, "max_tokens": max_tokens, "system": SYSTEM,
                       "messages": [{"role": "user", "content": user}]}).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", body, {
        "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
    with urllib.request.urlopen(req, timeout=900) as r:
        text = "".join(b.get("text", "") for b in json.load(r)["content"])
    return json.loads(text[text.find("{"): text.rfind("}") + 1])


def plan_strategy(brief):
    return call(f"BRIEF PRODUK:\n{brief}\n\nTahap 1: isi HANYA slug dan strategy (tepat 6 CEP, id cep1..cep6, "
                "masing-masing momen yang benar-benar berbeda). creatives = [].\n\n" + SCHEMA, 8000)


def plan_cep(brief, strategy, cep, n, avoid, angles=None):
    pick = (f"Pakai angle psikologi ini: {', '.join(angles)}." if angles else
            "Pakai ke-15 angle psikologi, masing-masing tepat 1 kali.")
    user = (f"BRIEF PRODUK:\n{brief}\n\nSTRATEGI:\n{json.dumps(strategy, ensure_ascii=False)}\n\n"
            f"Tahap 2: buat {n} creative KHUSUS untuk CEP {cep['id']}: \"{cep.get('moment')}\" ({cep.get('trigger')}). {pick} "
            "Semua hook, visual, dan copy berangkat dari momen CEP ini. Pakai minimal 3 layout berbeda. "
            "Isi creatives saja (slug/strategy boleh kosong).\n")
    if avoid:
        user += "Hook yang SUDAH dipakai (jangan diulang/dimirip-miripkan):\n- " + "\n- ".join(avoid[-120:]) + "\n"
    out = call(user + "\n" + SCHEMA)["creatives"]
    for c in out:
        c["cep"] = cep["id"]
    return out


UGC_STYLE = ("Authentic UGC smartphone photo, shot on iPhone, natural window light, slightly imperfect framing, "
             "real Indonesian person and real everyday setting, not a studio ad, no text, no captions, no watermark. "
             "Keep the top 30% of the frame visually calm (wall, sky, soft blur) for headline text.")


def ai_scene(prompt, foto_path):
    """Foto scene UGC via Gemini (Nano Banana). Foto produk asli dikirim sebagai referensi agar produk tidak dikarang."""
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        return None
    if foto_path:
        ins = ("Use the product in the reference image EXACTLY as it is (same shape, color, label, logo; do not redesign or add text to it). "
               "Place it naturally in the scene, held or used by the person or on a surface, clearly visible in the middle of the frame. ")
    else:
        ins = "Do NOT show any product, packaging, or brand. Leave clear empty space in the middle of the frame. "
    parts = [{"text": f"{prompt}\n\n{ins}{UGC_STYLE}"}]
    if foto_path:
        mime = "image/png" if foto_path.lower().endswith(".png") else "image/jpeg"
        parts.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(Path(foto_path).read_bytes()).decode()}})
    model = os.environ.get("IMAGE_MODEL", "gemini-2.5-flash-image")
    body = json.dumps({"contents": [{"parts": parts}], "generationConfig": {
        "responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "9:16"}}}).encode()
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", body,
                                 {"x-goog-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            for part in json.load(r)["candidates"][0]["content"]["parts"]:
                data = part.get("inline_data") or part.get("inlineData")
                if data:
                    return Image.open(io.BytesIO(base64.b64decode(data["data"]))).convert("RGB")
        raise ValueError("respons tanpa gambar")
    except Exception as e:
        print(f"  ! gambar AI gagal ({e}), pakai background gradien", file=sys.stderr)
        return None


# ---------- render ----------
def font(size, bold=True):
    for p in FONT_BOLD if bold else FONT_REG:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default(size)


def hexrgb(h, default=(20, 20, 20)):
    m = re.fullmatch(r"#?([0-9a-fA-F]{6})", (h or "").strip())
    return tuple(int(m.group(1)[i:i + 2], 16) for i in (0, 2, 4)) if m else default


def cover(img, w, h):
    s = max(w / img.width, h / img.height)
    img = img.resize((int(img.width * s) + 1, int(img.height * s) + 1), Image.LANCZOS)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))


def gradient(w, h, c1, c2):
    top, bot = Image.new("RGB", (w, h), c1), Image.new("RGB", (w, h), c2)
    mask = Image.linear_gradient("L").resize((w, h))
    return Image.composite(bot, top, mask)


def wrap(d, text, f, maxw):
    lines, cur = [], ""
    for word in text.split():
        t = f"{cur} {word}".strip()
        if d.textlength(t, font=f) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur); cur = word
    return lines + ([cur] if cur else [])


def fit(d, text, maxw, maxh, start, bold=True, lh=1.12):
    size = start
    while size > 24:
        f = font(size, bold)
        lines = wrap(d, text, f, maxw)
        if len(lines) * size * lh <= maxh and all(d.textlength(l, font=f) <= maxw for l in lines):
            return f, lines, int(size * lh)
        size -= 4
    f = font(24, bold)
    return f, wrap(d, text, f, maxw), 27


def draw_lines(d, lines, f, lh, x, y, w, fill, align="center", shadow=True):
    for l in lines:
        tw = d.textlength(l, font=f)
        tx = x + (w - tw) / 2 if align == "center" else x
        if shadow:
            d.text((tx + 3, y + 3), l, font=f, fill=(0, 0, 0, 140))
        d.text((tx, y), l, font=f, fill=fill)
        y += lh
    return y


def ink(col):
    return (25, 25, 25) if sum(col[:3]) > 450 else (255, 255, 255)


def pill(d, cx, y, text, f, bg, fg, pad=(36, 18)):
    tw = d.textlength(text, font=f)
    box = (cx - tw / 2 - pad[0], y, cx + tw / 2 + pad[0], y + f.size + pad[1] * 2)
    d.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=bg)
    d.text((cx - tw / 2, y + pad[1] - f.size * 0.08), text, font=f, fill=fg)
    return box[3]


def paste_product(canvas, foto, box):
    x0, y0, x1, y1 = map(int, box)
    if not foto:  # slot kosong untuk ditempel foto asli di Canva/CapCut
        layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        ImageDraw.Draw(layer).rounded_rectangle((x0, y0, x1, y1), 24, fill=(0, 0, 0, 70), outline=(255, 255, 255, 230), width=4)
        canvas.alpha_composite(layer)
        d = ImageDraw.Draw(canvas)
        f = font(min(44, (x1 - x0) // 9))
        t = "[PRODUK ASLI]"
        d.text(((x0 + x1 - d.textlength(t, font=f)) / 2, (y0 + y1 - f.size) / 2), t, font=f, fill=(255, 255, 255))
        return
    p = foto.copy()
    p.thumbnail((x1 - x0, y1 - y0), Image.LANCZOS)
    px, py = x0 + (x1 - x0 - p.width) // 2, y0 + (y1 - y0 - p.height) // 2
    if p.mode == "RGBA":
        sh = Image.new("RGBA", p.size, (0, 0, 0, 0))
        sh.putalpha(p.getchannel("A").point(lambda a: a * 0.45))
        canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(18)), (px + 14, py + 22))
        canvas.alpha_composite(p, (px, py))
    else:
        canvas.paste(p, (px, py))


def render(c, fmt, foto, scene):
    # produk sudah ada di foto scene (dari referensi) -> jangan tempel lagi
    put = (lambda box: None) if scene and foto else (lambda box: paste_product(canvas, foto, box))
    W, H = SIZES[fmt]
    pal = c.get("palette", {})
    bg1, bg2 = hexrgb(pal.get("bg1"), (30, 30, 60)), hexrgb(pal.get("bg2"), (10, 10, 20))
    acc, txt = hexrgb(pal.get("accent"), (255, 200, 0)), hexrgb(pal.get("text"), (255, 255, 255))
    base = cover(scene, W, H) if scene else gradient(W, H, bg1, bg2)
    canvas = base.convert("RGBA")
    if scene:  # gelapkan atas & bawah agar teks terbaca
        ov = gradient(W, H, (0, 0, 0), (0, 0, 0)).convert("RGBA")
        a = Image.linear_gradient("L").resize((W, H)).point(lambda v: int(abs(v - 128) * 1.4))
        ov.putalpha(a)
        canvas.alpha_composite(ov)
    d = ImageDraw.Draw(canvas)
    st, sb = SAFE[fmt]
    top, bottom, m = int(H * st), int(H * (1 - sb)), 70
    cw = W - 2 * m
    layout = c.get("layout", "hero")

    # badge + hook
    y = top
    if c.get("badge"):
        y = pill(d, W / 2, y, c["badge"].upper(), font(34), acc, bg2 if sum(acc) > 380 else (255, 255, 255)) + 28
    f, lines, lh = fit(d, c["hook"], cw, H * (0.20 if fmt == "9x16" else 0.22), 112)
    y = draw_lines(d, lines, f, lh, m, y, cw, txt) + 24
    if c.get("subhead") and layout != "testimonial":
        f, lines, lh = fit(d, c["subhead"], cw, H * 0.08, 46, bold=False)
        y = draw_lines(d, lines, f, lh, m, y, cw, txt) + 20

    cta_h = 120
    body_bottom = bottom - cta_h - 30

    if layout == "split" and c.get("split", {}).get("left"):
        s = c["split"]; half = (cw - 20) / 2
        for i, (lab, t, col) in enumerate([(s.get("left_label", "SEBELUM"), s["left"], (90, 90, 90)),
                                           (s.get("right_label", "SESUDAH"), s.get("right", ""), acc)]):
            x = m + i * (half + 20)
            d.rounded_rectangle((x, y, x + half, body_bottom), 28, fill=(*col, 225))
            fl = font(38); d.text((x + 28, y + 24), lab.upper(), font=fl, fill=ink(col))
            ft, ls, lh2 = fit(d, t, half - 56, (body_bottom - y) * 0.45, 44, bold=False)
            draw_lines(d, ls, ft, lh2, x + 28, y + 90, half - 56, ink(col), "left", False)
        if True:
            put((m + half - 140, body_bottom - 380, m + half + 160, body_bottom - 20))
    elif layout == "comparison" and c.get("comparison", {}).get("us"):
        cp = c["comparison"]; half = (cw - 20) / 2
        for i, (lab, items, mark, col) in enumerate([(cp.get("them_label", "Yang lain"), cp.get("them", []), "×", (60, 60, 60)),
                                                     (cp.get("us_label", "Kami"), cp["us"], "✓", acc)]):
            x = m + i * (half + 20)
            d.rounded_rectangle((x, y, x + half, body_bottom), 28, fill=(*col, 230))
            d.text((x + 28, y + 24), lab.upper(), font=font(38), fill=ink(col))
            yy = y + 100
            for it in items[:4]:
                ft, ls, lh2 = fit(d, f"{mark} {it}", half - 56, 140, 40, bold=False)
                yy = draw_lines(d, ls, ft, lh2, x + 28, yy, half - 56, ink(col), "left", False) + 22
    elif layout == "testimonial" and c.get("quote", {}).get("text"):
        q = c["quote"]
        card_b = body_bottom - (body_bottom - y) * 0.42
        d.rounded_rectangle((m, y, W - m, card_b), 32, fill=(255, 255, 255, 238))
        d.text((m + 40, y + 30), "★★★★★", font=font(48), fill=(255, 176, 0))
        ft, ls, lh2 = fit(d, f"“{q['text']}”", cw - 80, card_b - y - 200, 56, bold=True)
        yy = draw_lines(d, ls, ft, lh2, m + 40, y + 110, cw - 80, (25, 25, 25), "left", False)
        d.text((m + 40, yy + 16), f"— {q.get('name', '')}", font=font(36, False), fill=(90, 90, 90))
        put((m, card_b + 20, W - m, body_bottom))
    else:  # hero
        bl = [b for b in c.get("bullets", []) if b][:3]
        bl_h = len(bl) * 78
        put((m, y, W - m, body_bottom - bl_h - 20))
        yy = body_bottom - bl_h
        for b in bl:
            pill(d, W / 2, yy, f"✓ {b}", font(36, False), (0, 0, 0, 150), (255, 255, 255), (30, 14))
            yy += 78

    pill(d, W / 2, bottom - cta_h, f"{c.get('cta', 'Pesan Sekarang')} →", font(50), acc,
         bg2 if sum(acc) > 380 else (255, 255, 255), (60, 26))
    return canvas.convert("RGB")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("brief", help="file .txt berisi nama produk, fitur, benefit, harga, testimoni, dll")
    ap.add_argument("--foto", help="foto produk (PNG transparan paling bagus)")
    ap.add_argument("--jumlah", type=int, default=15, help="creative per CEP")
    ap.add_argument("--cep", help="hanya CEP tertentu, mis. 1,3 (default: semua 6)")
    ap.add_argument("--angle", help="batasi angle psikologi, pisah koma (mis. fomo,regret_trigger,value_shock)")
    ap.add_argument("--no-ai-image", action="store_true", help="jangan generate scene AI walau GEMINI_API_KEY ada")
    ap.add_argument("--dari-json", help="render ulang dari plan.json tanpa memanggil Claude")
    a = ap.parse_args()

    brief = Path(a.brief).read_text(encoding="utf-8")
    hist = json.loads(HISTORY.read_text()) if HISTORY.exists() else []
    angles = a.angle.split(",") if a.angle else None
    if a.dari_json:
        plan = json.loads(Path(a.dari_json).read_text())
    else:
        plan = plan_strategy(brief)
        plan["creatives"] = []
    slug = re.sub(r"[^a-z0-9-]+", "-", plan.get("slug", Path(a.brief).stem).lower()).strip("-")
    out = OUT / slug
    out.mkdir(parents=True, exist_ok=True)
    if not a.dari_json:
        ceps = plan["strategy"]["ceps"]
        if a.cep:
            ceps = [ceps[int(k) - 1] for k in a.cep.split(",")]
        for cep in ceps:
            print(f"Menulis creative {cep['id']}: {cep.get('moment')}")
            new = plan_cep(brief, plan["strategy"], cep, a.jumlah, hist + [c["hook"] for c in plan["creatives"]], angles)
            plan["creatives"] += new
            (out / "plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=2))
    (out / "plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=2))
    foto = Image.open(a.foto).convert("RGBA") if a.foto else None

    rows, md = [], [f"# Creative {slug}\n", "## Strategi\n```json\n" + json.dumps(plan.get("strategy", {}), ensure_ascii=False, indent=2) + "\n```\n"]
    count = {}
    for i, c in enumerate(plan["creatives"], 1):
        cep = c.get("cep") or "cep"
        count[cep] = count.get(cep, 0) + 1
        print(f"[{i}/{len(plan['creatives'])}] {c.get('angle')} ({c.get('layout')})")
        scene = None if a.no_ai_image else ai_scene(c.get("image_prompt", ""), a.foto)
        files = []
        for fmt in SIZES:
            p = out / f"{cep}-{count[cep]:02d}-{fmt}.png"
            render(c, fmt, foto, scene).save(p, optimize=True)
            files.append(p.name)
        rows.append({"no": i, "cep": c.get("cep"), "psych_angle": c.get("psych_angle"), "angle": c.get("angle"), "framework": c.get("framework"), "awareness": c.get("awareness"),
                     "image_9x16": files[0], "image_4x5": files[1], "primary_text": c.get("primary_text"),
                     "primary_text_short": c.get("primary_text_short"),
                     **{f"headline_{k + 1}": h for k, h in enumerate(c.get("headlines", [])[:3])},
                     "description": c.get("description"), "visual_brief": c.get("visual_brief"), "cta": c.get("cta")})
        md.append(f"## {i}. {c.get('angle')}\nCEP `{c.get('cep')}` · angle `{c.get('psych_angle')}` · {c.get('framework')} / {c.get('awareness')}-aware\n\n"
                  f"Gambar: `{files[0]}`, `{files[1]}`\n\n**Brief visual:** {c.get('visual_brief', '')}\n\n**Primary text:**\n\n{c.get('primary_text')}\n\n"
                  f"**Short:** {c.get('primary_text_short')}\n\n**Headlines:**\n" +
                  "".join(f"- {h}\n" for h in c.get("headlines", [])) + f"\n**Description:** {c.get('description')}\n")
        hist.append(c["hook"])

    with open(out / "copy.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(dict.fromkeys(k for r in rows for k in r)))
        w.writeheader(); w.writerows(rows)
    (out / "copy.md").write_text("\n".join(md), encoding="utf-8")
    if not a.dari_json:
        HISTORY.write_text(json.dumps(hist, ensure_ascii=False, indent=1))
    print(f"Selesai -> {out}")


if __name__ == "__main__":
    main()
