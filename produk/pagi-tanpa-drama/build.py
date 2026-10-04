import importlib, sys, html
import lib
mods = [m for m in ['c1','c2','c3','c4'] if __import__('os').path.exists(m + '.py')]
for m in mods:
    importlib.import_module(m)

css = open('style.css').read()
fonts = open('fonts/fonts.css').read()
out = ['<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Pagi Tanpa Drama</title><style>' + fonts + css + '</style></head><body>']
n = 0
for pg in lib.PAGES:
    n += 1
    cover = pg['cls'] == 'cover'
    band = '' if (cover or pg['theme'] == 'dark' and not pg['label']) else f'<div class="band"><span>{pg["label"]}</span><i>Pagi Tanpa Drama</i></div>'
    if pg['cls'] == 'lic':
        band = ''
    foot = '' if cover else (f'<div class="foot"><span>Pagi Tanpa Drama &middot; &copy; ToolkitParenting</span><span class="n">{n}</span><span>Untuk penggunaan pribadi, dilarang disebarluaskan</span></div>')
    inner = pg['html'] if cover else f'<div class="in"><div style="zoom:{pg["z"]}">{pg["html"]}</div></div>'
    padtop = '' 
    out.append(f'<section class="pg t-{pg["theme"]} {pg["cls"]}" data-n="{n}">{band}{inner}{foot}</section>')
out.append('</body></html>')
open('book.html', 'w').write('\n'.join(out))
print('pages', n)
