# Komponen HTML untuk workbook Pagi Tanpa Drama (layout A4 per halaman)
PAGES = []


def page(theme, label, html, num=True, cls='', z=1.12):
    PAGES.append(dict(theme=theme, label=label, html=html, num=num, cls=cls, z=z))


def img(name, cls='', alt=''):
    return f'<img class="{cls}" src="assets/{name}" alt="{alt}">'


def hero(name):
    return img(name, 'hero')


def h2(t):
    return f'<h2><span>{t}</span></h2>'


def h3(t):
    return f'<h3>{t}</h3>'


def p(t, cls=''):
    return f'<p class="{cls}">{t}</p>'


def ul(items, cls=''):
    return f'<ul class="{cls}">' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'


def ol(items):
    return '<ol>' + ''.join(f'<li>{i}</li>' for i in items) + '</ol>'


def box(t=''):
    return '<span class="box"></span>'


def cb(items, cls=''):
    return f'<ul class="cb {cls}">' + ''.join(f'<li><span class="box"></span><span>{i}</span></li>' for i in items) + '</ul>'


def card(title, body, cls=''):
    return f'<div class="card {cls}"><div class="ct">{title}</div>{body}</div>'


def tip(t, icon='ic-tip.png'):
    return f'<div class="tip">{img(icon)}<div>{t}</div></div>'


def alt(sit, before, after, extra=''):
    return (f'<div class="alt"><div class="sit">{sit}</div>'
            f'<div class="a1"><b>Alih-alih</b>{before}</div>'
            f'<div class="a2"><b>Coba</b>{after}{extra}</div></div>')


def tbl(head, rows, cls='', widths=None):
    cg = ''
    if widths:
        cg = '<colgroup>' + ''.join(f'<col style="width:{w}">' for w in widths) + '</colgroup>'
    th = ''.join(f'<th>{h}</th>' for h in head)
    out = f'<table class="{cls}">{cg}<thead><tr>{th}</tr></thead><tbody>'
    for r in rows:
        if isinstance(r, str):  # baris judul grup
            out += f'<tr class="grp"><td colspan="{len(head)}">{r}</td></tr>'
        else:
            out += '<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>'
    return out + '</tbody></table>'


def aksi(title, inner):
    return (f'<div class="aksi"><div class="ah">{img("ic-aksi.png")}<div class="at">{title}</div></div>'
            f'<div class="ab">{inner}</div></div>')


def fill(rows, head=('Yang ditentukan', 'Isianmu')):
    return tbl(list(head), [[r, '&nbsp;'] for r in rows], 'fill', ['46%', '54%'])


def stk(t, cls=''):
    return f'<span class="stk {cls}">{t}</span>'
