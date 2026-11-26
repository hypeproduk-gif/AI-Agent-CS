"""Build PDF Lancar Baca 30 Hari dari naskah markdown.
Gambar dibaca dari ../aset/img/<nama>.jpg|png; kalau belum ada, tampil placeholder.
Logo dari ../aset/logo.png (wajib file asli)."""
import re, pathlib, markdown, weasyprint
from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parent
NASKAH = ROOT.parent / "naskah"
IMG = ROOT.parent / "aset" / "img"
LOGO = ROOT.parent / "aset" / "logo.png"
TITLE = "Lancar Baca 30 Hari"

LEVEL_COLOR = {"1": "#E9C46A", "2": "#8FB39A", "3": "#9CC3D5", "4": "#C8735A", "5": "#1F4E4A"}

def img(name, cls="hero", label=None):
    for ext in ("jpg", "png"):
        p = IMG / f"{name}.{ext}"
        if p.exists():
            return f'<img class="{cls}" src="{p.as_uri()}">'
    return f'<div class="{cls} ph"><span>Ilustrasi · {label or name}</span></div>'

def logo(cls="logo"):
    if LOGO.exists():
        return f'<img class="{cls}" src="{LOGO.as_uri()}">'
    return f'<div class="{cls} wordmark"><b>Toolkit</b>Parenting</div>'

def md(text):
    text = re.sub(r"(?m)^(?!\s*$)(?![-*] |\d+\. |\|)(.+)\n(?=(?:[-*] |\d+\. ))", r"\1\n\n", text)
    return markdown.markdown(text, extensions=["tables", "sane_lists", "nl2br"])

def enhance(html):
    s = BeautifulSoup(html, "html.parser")
    # wrap h2 sections
    for h2 in s.find_all("h2"):
        t = h2.get_text()
        cls = None
        if "AKSI HARI INI" in t: cls = "aksi"
        elif "TANDA" in t: cls = "siap"
        if cls:
            box = s.new_tag("div", attrs={"class": cls})
            nodes = []
            for sib in h2.next_siblings:
                if getattr(sib, "name", None) in ("h2", "h1", "hr"): break
                nodes.append(sib)
            h2.wrap(box)
            for n in nodes: box.append(n.extract())
            h2.string = "Aksi Hari Ini" if cls == "aksi" else t.replace("✅", "").strip().title()
            label = s.new_tag("div", attrs={"class": "box-label"})
            label.string = "✦" if cls == "aksi" else "↑"
            h2.insert_before(label)
    for bq in s.find_all("blockquote"):
        txt = bq.get_text()
        bq["class"] = "moment" if re.search(r"\b\d{2}\.\d{2}\b", txt) else "tip"
    for tb in s.find_all("table"):
        th = [x.get_text().strip() for x in tb.find_all("th")]
        if th[:2] == ["Alih-alih", "Coba"]: tb["class"] = "alt"
        elif th == ["", ""] or not "".join(th): tb["class"] = "fill"
    for hr in s.find_all("hr"): hr.decompose()
    out = str(s)
    out = re.sub(r"\*\*(\d{2}\.\d{2})\*\*", r'<span class="jam">\1</span>', out)
    out = out.replace("☐", '<span class="box"></span>')
    return out

def chapter_pages(text, img_map):
    """Pisahkan per '# BAB n' / '# BONUS n' / '# PEMBUKA' / '# PENUTUP'."""
    parts = re.split(r"\n(?=# (?:BAB|BONUS|PEMBUKA|PENUTUP)\b)", "\n" + text)
    html = []
    for p in parts:
        p = p.strip().replace("---\n---", "")
        if not p: continue
        lines = p.split("\n")
        eyebrow = lines[0][2:].strip()
        title = lines[1][2:].strip() if lines[1].startswith("# ") else ""
        body = "\n".join(lines[2:] if title else lines[1:])
        key = eyebrow.lower().replace(" ", "")
        lvl = re.search(r"Level (\d)", title)
        color = LEVEL_COLOR.get(lvl.group(1), "#C99A3B") if lvl else "#C99A3B"
        chip = f'<span class="lvl" style="background:{color}">Level {lvl.group(1)}</span>' if lvl else ""
        html.append(f'''<section class="chapter" style="--acc:{color}">
          {img(img_map.get(key, key), "hero", eyebrow)}
          <div class="eyebrow">{eyebrow.title()} {chip}</div>
          <h1>{title}</h1>
          {enhance(md(body))}
        </section>''')
    return "\n".join(html)

def build():
    raw = {f.name: f.read_text() for f in sorted(NASKAH.glob("*.md"))}
    b1 = raw["00-kerangka-dan-bab-1.md"]
    b1 = b1[b1.index("# BAB 1"):]
    img_map = {"bab1": "bab1", "pembuka": "pembuka", "penutup": "penutup",
               "bonus1": "bonus-banner", "bonus2": "bonus-banner", "bonus3": "bonus-banner"}
    order = [raw["01-pembuka.md"], b1, raw["02-bab-2-4.md"], raw["03-bab-5-7.md"], raw["04-bonus-penutup.md"]]
    content = "\n".join(chapter_pages(t, img_map) for t in order)

    cover = f'''<section class="cover">
      {img("cover", "cover-img", "Cover: Mami & Raka di meja belajar")}
      <div class="cover-text">
        <div class="cover-kicker">Program membaca bertahap untuk anak 5–7 tahun</div>
        <div class="cover-title">Lancar Baca<br><em>30 Hari</em></div>
        <div class="cover-sub">30 sesi · 15 menit sehari · dari bunyi huruf sampai cerita pendek</div>
      </div>
      <div class="cover-badge">{logo()}</div>
    </section>'''
    lisensi = f'''<section class="lisensi">
      {logo("logo-lg")}
      <h1>Produk Original ToolkitParenting</h1>
      <p class="lead">Terima kasih sudah membeli produk original. Setiap pembelian membantu kami terus membuat alat bantu praktis untuk orang tua Indonesia.</p>
      <div class="two"><div class="card ok"><h3>Boleh</h3><ul><li>Dicetak berulang kali untuk anak sendiri</li><li>Disimpan di perangkat pribadi</li><li>Dipakai untuk anak-anak dalam satu keluarga</li></ul></div><div class="card no"><h3>Dilarang</h3><ul><li>Dibagikan ke grup WA, Telegram, atau media sosial</li><li>Dijual ulang, dalam bentuk file maupun cetak</li><li>Dipakai untuk kelas, les, atau sekolah tanpa lisensi</li></ul></div></div>
      <p class="law">Buku ini dilindungi Undang-Undang Republik Indonesia No. 28 Tahun 2014 tentang Hak Cipta. Kalau Mami menerima file ini dari pihak lain, mohon dukung kami dengan membeli versi originalnya.</p>
      <p class="copy">© 2026 ToolkitParenting · Alat bantu praktis untuk orang tua Indonesia</p>
    </section>'''
    css = (ROOT / "style.css").read_text().replace("FONTDIR", (ROOT / "fonts").as_uri())
    html = f'<!doctype html><html lang="id"><head><meta charset="utf-8"><style>{css}</style></head><body>{cover}{lisensi}{content}</body></html>'
    (ROOT / "preview.html").write_text(html)
    out = ROOT / "Lancar-Baca-30-Hari.pdf"
    weasyprint.HTML(string=html, base_url=str(ROOT)).write_pdf(out)
    from pypdf import PdfReader
    print(out, len(PdfReader(out).pages), "halaman")

if __name__ == "__main__":
    build()
