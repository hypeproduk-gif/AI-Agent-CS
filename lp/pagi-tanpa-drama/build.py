import base64, re, os
D = os.path.dirname(os.path.abspath(__file__))
FONT = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">'
ANTON = "@font-face{font-family:'Anton';font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64," + base64.b64encode(open(f'{D}/img/anton.woff2','rb').read()).decode() + ") format('woff2')}"
css = '<style>' + ANTON + open(f'{D}/src/lp.css').read() + '</style>'
MIME = {'jpg': 'image/jpeg', 'png': 'image/png'}

def embed(t):
    def r(m):
        f = m.group(1)
        return f'data:{MIME[f.rsplit(".",1)[1]]};base64,' + base64.b64encode(open(f'{D}/img/{f}', 'rb').read()).decode()
    return re.sub(r'\{\{img:([^}]+)\}\}', r, t)

def esc(t):
    # semua karakter non-ASCII jadi entity (aman untuk Scalev)
    return ''.join(c if ord(c) < 128 else f'&#{ord(c)};' for c in t)

atas = esc(FONT + css + embed(open(f'{D}/src/atas.html').read()))
bawah = esc(css + embed(open(f'{D}/src/bawah.html').read()))
os.makedirs(f'{D}/dist', exist_ok=True)
open(f'{D}/dist/LP-pagi-tanpa-drama-atas.html', 'w').write(atas)
open(f'{D}/dist/LP-pagi-tanpa-drama-bawah.html', 'w').write(bawah)
form = '<section style="padding:22px 20px"><div class="wrap"><div class="card" style="text-align:center"><b>[ Form Scalev tampil di sini ]</b></div></div></section>'
prev = f'<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pagi Tanpa Drama</title></head><body>{atas}{form}{bawah}</body></html>'
open(f'{D}/dist/preview.html', 'w').write(prev)
for n in ('atas', 'bawah', 'preview'):
    print(n, round(os.path.getsize(f'{D}/dist/' + ('preview.html' if n == 'preview' else f'LP-pagi-tanpa-drama-{n}.html')) / 1024), 'KB')
