import sys, re, markdown, pathlib, subprocess, json, html as H
src, out, title, sub, _price = sys.argv[1:6]
hooks = json.loads(sys.argv[6]) if len(sys.argv) > 6 else []
md = pathlib.Path(src).read_text().split("\n---\n", 1)[1]
_L = re.compile(r"^(\s*[-*]|\s*\d+\.)\s")
_o = []
for _ln in md.split("\n"):
    if _L.match(_ln) and _o and _o[-1].strip() and not _L.match(_o[-1]) and not _o[-1].startswith(("    ", "\t")):
        _o.append("")
    _o.append(_ln)
md = "\n".join(_o)
body = markdown.markdown(md, extensions=["tables", "fenced_code"])
body = re.sub(r"\[([^\]\n<]{1,45})\]", r'<span class="ph">[\1]</span>', body)
body = body.replace("<h1>", '<h1 class="chap">')
body = body.replace("<h2>Yuk, lanjut ngobrol di Threads</h2>", '<div class="follow"><h2>Yuk, lanjut ngobrol di Threads</h2>', 1)
if '<div class="follow">' in body: body += "</div>"
CREAM = "#FAF6F1"
CSS = f"""
@page{{size:A4;margin:16mm 0 18mm 0}}
*{{box-sizing:border-box}}
html,body{{background:{CREAM};margin:0}}
body{{font-family:'Plus Jakarta Sans',sans-serif;font-size:10.5pt;color:#2B2231;line-height:1.65;padding:0 22mm}}
.cover{{height:297mm;width:210mm;margin:0;padding:26mm 22mm 22mm;background:#2E1A3A;color:#FAF6F1;display:flex;flex-direction:column;gap:14mm;break-after:page;position:relative;overflow:hidden}}
.cover:before{{content:"";position:absolute;right:-60mm;top:70mm;width:170mm;height:170mm;border-radius:50%;background:radial-gradient(circle,#F4A26155,#F4A26100 70%)}}
.cover .tag{{align-self:flex-start;background:#F4A261;color:#2E1A3A;font-weight:800;padding:5px 13px;border-radius:99px;font-size:9.5pt;letter-spacing:.05em}}
.cover h1{{font-size:36pt;line-height:1.05;margin:0;font-weight:800}}
.cover h1 em{{font-style:normal;color:#F4A261}}
.cover .sub{{font-size:13pt;opacity:.85;margin:6px 0 0;max-width:130mm}}
.phone{{position:relative;align-self:center;width:92mm;background:#FFFFFF;border-radius:11mm;padding:9mm 5mm 7mm;border:2.5mm solid #4A2F59;color:#1c1c1c}}
.phone:before{{content:"";position:absolute;top:3mm;left:50%;transform:translateX(-50%);width:22mm;height:2.2mm;border-radius:2mm;background:#1c1c1c}}
.pt{{font-weight:800;font-size:11pt;padding:0 2mm 3mm;border-bottom:1px solid #eee}}
.post{{display:flex;gap:3mm;padding:3.5mm 2mm;border-bottom:1px solid #eee;font-size:8.6pt;line-height:1.45}}
.post:last-child{{border-bottom:0}}
.av{{flex:none;width:8mm;height:8mm;border-radius:50%;background:linear-gradient(135deg,#F4A261,#B4562A)}}
.post b{{display:block;font-size:8.2pt}} .post b i{{color:#1D9BF0;font-style:normal}}
.acts{{color:#999;font-size:8pt;margin-top:1.5mm;letter-spacing:2mm}}
.cover .chips{{display:flex;gap:8px;flex-wrap:wrap}}
.cover .chips span{{border:1.5px solid #F4A26199;border-radius:10px;padding:7px 12px;font-weight:700;font-size:10pt}}
.cover .by{{margin-top:auto;font-weight:700;font-size:11.5pt;display:flex;justify-content:space-between}}
.cover .by span{{opacity:.7;font-weight:600}}
.lic{{break-after:page;padding-top:10mm}}
.lic h2{{color:#2E1A3A;margin-top:0}}
.lic .grid{{display:flex;gap:12px}}.lic .grid div{{flex:1;background:#fff;border-radius:14px;padding:14px 16px;border:1px solid #E9DFD3}}
h1.chap{{break-before:page;font-size:21pt;color:#2E1A3A;border-left:7px solid #F4A261;padding-left:12px;margin-top:0}}
h2{{font-size:14pt;color:#B4562A;margin-top:22px;break-after:avoid}}
h3{{font-size:11.5pt;color:#2E1A3A;break-after:avoid}}
li{{margin:3px 0}}
code{{font-family:inherit;background:#fff;border:1px solid #E9DFD3;border-radius:6px;padding:1px 5px;font-size:9.6pt}}
pre{{background:#fff;border:1.5px dashed #F4A261;border-radius:12px;padding:10px 14px;white-space:pre-wrap;break-inside:avoid}}
pre code{{border:0;padding:0;background:none}}
blockquote{{margin:12px 0;background:#2E1A3A;color:#FAF6F1;border-radius:12px;padding:10px 16px}}
table{{border-collapse:collapse;width:100%;background:#fff;font-size:9.3pt}}th{{background:#2E1A3A;color:#fff}}td,th{{border:1px solid #E9DFD3;padding:6px 8px}}tr{{break-inside:avoid}}
.ph{{background:#FCE3CF;color:#8A3B14;border-radius:4px;padding:0 3px;font-weight:600}}
blockquote{{break-inside:avoid;margin:18px 0;padding:14px 18px;border-radius:14px}}
blockquote p:first-child strong{{letter-spacing:.08em;font-size:9pt;color:#F4A261}}
.follow{{break-inside:avoid;margin-top:22px;background:#fff;border:2px solid #F4A261;border-radius:16px;padding:6px 20px 12px}}
.follow h2{{margin-top:12px}}
hr{{border:0;border-top:1px solid #E9DFD3;margin:18px 0}}
"""
posts = "".join(f'<div class="post"><div class="av"></div><div><b>ghinaelsha <i>●</i></b>{H.escape(h)}<div class="acts">♡ ◯ ⟲ ➤</div></div></div>' for h in hooks[:3])
cover = f"""<div class="cover"><span class="tag">THREADS TOOLKIT</span>
<div><h1>{title.replace('+','<em>+</em>')}</h1><p class="sub">{sub}</p></div>
{f'<div class="phone"><div class="pt">Threads</div>{posts}</div>' if posts else ''}
<div class="chips"><span>Langsung dipakai</span><span>Bisa dari HP</span><span>Untuk niche apa pun</span></div>
<div class="by">by Ghina Elsha <span>@ghinaelsha</span></div></div>
COVER_SPLIT<div class="lic"><h2>Produk Original Ghina Elsha</h2><p>Terima kasih sudah membeli produk original. File ini untuk dipakai sendiri.</p>
<div class="grid"><div><b>✅ Boleh</b><br>Dipakai untuk akun dan bisnismu sendiri. Isinya bebas kamu ubah dan posting.</div>
<div><b>❌ Dilarang</b><br>Menjual ulang, membagikan, atau mengunggah file ini ke mana pun, gratis maupun berbayar.</div></div>
<p style="font-size:9pt;margin-top:14px">Dilindungi UU No. 28 Tahun 2014 tentang Hak Cipta. Kalau kamu dapat file ini bukan dari pembelian resmi, dukung pembuatnya dengan membeli yang original. © 2026 Ghina Elsha</p></div>"""
cov_html, rest = cover.split("COVER_SPLIT")
HEADX = '<html><head><meta charset=utf-8><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel=stylesheet><style>'+CSS+'</style>'
docs = {"cover": HEADX + '<style>@page{margin:0}body{padding:0}</style></head><body>' + cov_html + '</body></html>',
        "body": HEADX + '</head><body>' + rest + body + '</body></html>'}
TPL = '<style>html,body{margin:0!important;padding:0!important}</style>'
band = lambda h, inner: TPL + f'<div style="-webkit-print-color-adjust:exact;print-color-adjust:exact;background:{CREAM};width:100%;height:{h};margin:0;padding:0 22mm;display:flex;align-items:center;justify-content:space-between;font-size:7pt;color:#9A8C9F;font-family:sans-serif;box-sizing:border-box">{inner}</div>'
head = band("11.5mm", "")
foot = band("13mm", f'<span>{H.escape(title)} · © Ghina Elsha</span><span class="pageNumber"></span><span>Untuk penggunaan pribadi, dilarang disebarluaskan</span>')
parts = []
for k, d in docs.items():
    tmp = pathlib.Path(f"{out}.{k}.html"); tmp.write_text(d); pdf = f"{out}.{k}.pdf"; parts.append(pdf)
    hf = f"displayHeaderFooter:true,headerTemplate:{json.dumps(head)},footerTemplate:{json.dumps(foot)}," if k == "body" else ""
    js = f"""const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://{tmp.resolve()}',{{waitUntil:'networkidle'}});
await p.pdf({{path:{json.dumps(pdf)},printBackground:true,{hf}preferCSSPageSize:true}});await b.close();}})();"""
    subprocess.run(["node", "-e", js], check=True); tmp.unlink()
from pypdf import PdfWriter
w = PdfWriter()
for pdf in parts: w.append(pdf)
w.write(out); [pathlib.Path(x).unlink() for x in parts]
