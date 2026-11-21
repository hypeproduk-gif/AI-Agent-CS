import base64,io,re,subprocess,tempfile,pathlib,sys
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parent.parent
HEAD=(ROOT/'LP-bank-hook.html').read_text(); HEAD=HEAD[:HEAD.index('</style>')+8]
SCRIPT=(ROOT/'LP-bank-hook.html').read_text(); SCRIPT=SCRIPT[SCRIPT.index('<script>'):]
def page(pdf,n,w):
    d=tempfile.mkdtemp(); subprocess.run(['pdftoppm','-r','80','-jpeg','-f',str(n),'-l',str(n),str(ROOT/pdf),d+'/x'],check=True)
    return Image.open(next(pathlib.Path(d).glob('*.jpg'))).convert('RGB')
def uri(im,w):
    im=im.copy(); im.thumbnail((w,9999)); b=io.BytesIO(); im.save(b,'JPEG',quality=70); return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
def cover(pdfs):
    ims=[page(p,1,0) for p in pdfs]
    if len(ims)==1: return uri(ims[0],820)
    h=600; ims=[i.resize((int(i.width*h/i.height),h)) for i in ims]; gap=16
    c=Image.new('RGB',(sum(i.width for i in ims)+gap*(len(ims)+1),h+2*gap),'#FAF6F1'); x=gap
    for i in ims: c.paste(i,(x,gap)); x+=i.width+gap
    return uri(c,820)
esc=lambda t:''.join(c if ord(c)<128 else f'&#{ord(c)};' for c in t)
def ok(items): return '<ul class="ok">'+''.join(f'<li>{i}</li>' for i in items)+'</ul>'
def build(P):
    co='/'+P['co']; cov=cover(P['pdfs']); prev=''.join(f'<img src="{uri(page(p,n,0),480)}" alt="Halaman isi">' for p,n in P['preview'])
    log=''.join(f'<li>{l}</li>' for l in P['pain'])
    isi=''.join(f'<h3 style="margin-top:14px">{h}</h3><p>{t}</p>' for h,t in P['isi'])
    faq=''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q,a in P['faq'])
    strike=f'<div style="text-decoration:line-through;color:#8a7f8f">{P["strike"]}</div>' if P.get('strike') else ''
    lp=HEAD+f'''
<section class="hero"><div class="wrap"><h1>{P["h1"]}</h1><p>{P["sub"]}</p><p><b>{P["reframe"]}</b></p>
<img src="{cov}" alt="{P["name"]}"><div class="chips">{''.join(f"<span>{c}</span>" for c in P["chips"])}</div>
<a class="btn" href="{co}">{P["cta"]}</a></div></section>
<section><div class="wrap"><h2>Kenal momen ini?</h2><ol class="log">{log}</ol><p class="punch">{P["punch"]}</p></div></section>
<section class="dark"><div class="wrap"><h2>{P["why_h"]}</h2>{P["why"]}</div></section>
<section><div class="wrap"><h2>Isinya</h2>{isi}</div></section>
<section><div class="wrap"><h2>Bayangin minggu depan</h2>{ok(P["benefit"])}<p style="font-size:13px"><i>{P["honest"]}</i></p></div></section>
<section><div class="wrap"><h2>Intip isinya</h2><div class="grid2">{prev}</div></div></section>
<section><div class="wrap"><h2>Dibuat oleh Ghina Elsha</h2><p>Aku sendiri lagi membangun akun Threads dari affiliate ke produk sendiri, dan prosesnya aku share terbuka. Semua yang ada di sini yang aku pakai sehari-hari.</p></div></section>
<section><div class="wrap"><h2>Cara mulai</h2><ol class="log"><li><b>1.</b> Klik tombol, isi data, bayar.</li><li><b>2.</b> File PDF langsung dikirim.</li><li><b>3.</b> {P["step3"]}</li></ol></div></section>
<section id="harga"><div class="wrap"><div class="price-card"><h2>{P["name"]}</h2>{ok(P["stack"])}{strike}<div class="price">{P["price"]}</div></div>
<a class="btn" href="{co}">Ambil Sekarang, {P["short"]}</a><p style="font-size:13px;margin-top:10px">File PDF dikirim otomatis setelah pembayaran.</p></div></section>
<section><div class="wrap"><h2>Pertanyaan</h2>{faq}</div></section>
<section class="dark"><div class="wrap"><h2>{P["close_h"]}</h2><p>{P["close"]}</p><a class="btn" href="{co}">Ambil Sekarang, {P["short"]}</a></div></section>
<footer>&copy; 2026 Ghina Elsha</footer><div id="sticky"><a class="btn" href="{co}">{P["cta"]}, {P["short"]}</a></div>'''+SCRIPT
    copage=HEAD+f'''
<section><div class="wrap"><div class="price-card" style="display:flex;gap:14px;align-items:center">
<img src="{cov}" alt="{P["name"]}" style="width:{150 if len(P["pdfs"])>1 else 96}px!important;flex:none">
<div><h3>{P["name"]}</h3>{strike}<div class="price" style="font-size:26px">{P["price"]}</div></div></div>
{ok(P["stack"])}<p style="font-size:13px">Isi data di bawah. File dikirim otomatis ke email/WhatsApp setelah pembayaran.</p></div></section>'''
    (ROOT/f'LP-{P["slug"]}.html').write_text(esc(lp)); (ROOT/f'CO-{P["slug"]}.html').write_text(esc(copage))
