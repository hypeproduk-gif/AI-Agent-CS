import sys, re, markdown, pathlib, subprocess, json
src, out, title, sub, price = sys.argv[1:6]
md = pathlib.Path(src).read_text()
md = md.split("\n---\n",1)[1]  # drop header block (cover replaces it)
html = markdown.markdown(md, extensions=["tables","fenced_code"])
html = re.sub(r"\[([^\]\n<]{1,45})\]", r'<span class="ph">[\1]</span>', html)
html = re.sub(r"<h1>", '<h1 class="chap">', html)
CSS = """
@page{size:A4;margin:18mm 17mm 20mm}@page :first{margin:0}
*{box-sizing:border-box}
body{font-family:'Plus Jakarta Sans',sans-serif;font-size:10.5pt;color:#2B2231;line-height:1.6;background:#FAF6F1;margin:0}
.cover{height:297mm;width:210mm;padding:28mm 22mm;background:#2E1A3A;color:#FAF6F1;display:flex;flex-direction:column;justify-content:space-between;break-after:page}
.cover .tag{display:inline-block;background:#F4A261;color:#2E1A3A;font-weight:800;padding:6px 14px;border-radius:99px;font-size:10pt;letter-spacing:.04em}
.cover h1{font-size:40pt;line-height:1.05;margin:18px 0 12px;font-weight:800}
.cover h1 em{font-style:normal;color:#F4A261}
.cover p.sub{font-size:14pt;opacity:.85;max-width:140mm}
.cover .stack{display:flex;gap:10px;flex-wrap:wrap}
.cover .stack span{border:1.5px solid #F4A26199;border-radius:12px;padding:10px 14px;font-weight:700;font-size:11pt}
.cover .by{font-weight:700;font-size:12pt}
.lic{break-after:page;padding-top:20mm}
.lic h2{color:#2E1A3A}
.lic .grid{display:flex;gap:12px}.lic .grid div{flex:1;background:#fff;border-radius:14px;padding:14px 16px;border:1px solid #E9DFD3}
h1.chap{break-before:page;font-size:22pt;color:#2E1A3A;border-left:8px solid #F4A261;padding-left:12px;margin-top:0}
h2{font-size:14pt;color:#B4562A;margin-top:22px;break-after:avoid}
h3{font-size:11.5pt;color:#2E1A3A;break-after:avoid}
ol li,ul li{margin:3px 0}
code{font-family:inherit;background:#fff;border:1px solid #E9DFD3;border-radius:6px;padding:1px 5px;font-size:9.6pt}
pre{background:#fff;border:1.5px dashed #F4A261;border-radius:12px;padding:10px 14px;white-space:pre-wrap;break-inside:avoid}
pre code{border:0;padding:0;background:none;font-size:9.6pt}
blockquote{margin:12px 0;background:#2E1A3A;color:#FAF6F1;border-radius:12px;padding:10px 16px}
table{border-collapse:collapse;width:100%;background:#fff;font-size:9.5pt}th{background:#2E1A3A;color:#fff}td,th{border:1px solid #E9DFD3;padding:6px 8px}
.ph{background:#FCE3CF;color:#8A3B14;border-radius:4px;padding:0 3px;font-weight:600}
hr{border:0;border-top:1px solid #E9DFD3;margin:18px 0}
"""
words = title.split(" ",2)
cover = f"""<div class="cover"><div><span class="tag">THREADS TOOLKIT</span>
<h1>{title.replace('+','<em>+</em>')}</h1><p class="sub">{sub}</p></div>
<div class="stack"><span>Langsung copas</span><span>Bisa dari HP</span><span>Untuk niche apa pun</span></div>
<div class="by">by Ghina Elsha</div></div>
<div class="lic"><h2>Produk Original Ghina Elsha</h2><p>Terima kasih sudah membeli produk original. File ini untuk dipakai sendiri.</p>
<div class="grid"><div><b>✅ Boleh</b><br>Dipakai untuk akun & bisnismu sendiri. Hook dan prompt di dalamnya bebas kamu ubah dan posting.</div>
<div><b>❌ Dilarang</b><br>Menjual ulang, membagikan, atau mengunggah file ini ke mana pun, gratis maupun berbayar.</div></div>
<p style="font-size:9pt;margin-top:14px">Dilindungi UU No. 28 Tahun 2014 tentang Hak Cipta. Kalau kamu dapat file ini bukan dari pembelian resmi, dukung pembuatnya dengan membeli yang original. © 2026 Ghina Elsha</p></div>"""
doc = f"""<html><head><meta charset=utf-8><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel=stylesheet><style>{CSS}</style></head><body>{cover}{html}</body></html>"""
foot = f'<div style="font-size:7pt;color:#9A8C9F;width:100%;padding:0 17mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>{title} · © Ghina Elsha</span><span class="pageNumber"></span><span>Untuk penggunaan pribadi, dilarang disebarluaskan</span></div>'
pathlib.Path(out+'.html').write_text(doc)
js=f'''const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://{pathlib.Path(out).resolve()}.html',{{waitUntil:'networkidle'}});
await p.pdf({{path:{json.dumps(out)},format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:{json.dumps(foot)},preferCSSPageSize:true}});await b.close();}})();'''
subprocess.run(['node','-e',js],check=True)
pathlib.Path(out+'.html').unlink()
