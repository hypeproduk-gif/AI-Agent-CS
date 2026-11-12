# -*- coding: utf-8 -*-
"""Ilustrasi kotak bekal (SVG top-down) untuk 20 menu Dapur Autopilot."""
import random, math, itertools
_UID = itertools.count(1)

C = dict(rice="#FFFFFF", grain="#ECE5D6", nori="#22302A", kecap="#8B4A22", gold="#E2A443",
         gold2="#C27A2A", egg="#F5CB45", white="#FFFDF5", lettuce="#7DB65A", cuc="#A7D07A",
         cucr="#4E8A3A", tomato="#E1503B", carrot="#F08A3A", tempe="#C9995A", bread="#F7E4BC",
         crust="#C98A4B", pink="#F2A08E", corn="#F7D14C", brown="#7A4524", cheese="#F9C846")

def fx(v): return f"{v:.1f}"

def rice_bed(x, y, w, h, rnd, n=90):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{C["rice"]}"/>'
    for _ in range(n):
        gx, gy = x + rnd.random() * w, y + rnd.random() * h
        s += f'<ellipse cx="{fx(gx)}" cy="{fx(gy)}" rx="5" ry="2.6" transform="rotate({rnd.randint(0,180)} {fx(gx)} {fx(gy)})" fill="{C["grain"]}"/>'
    return s

def crumbs(cx, cy, r, rnd, col, n=10):
    return "".join(f'<circle cx="{fx(cx+(rnd.random()-.5)*r*1.5)}" cy="{fx(cy+(rnd.random()-.5)*r*1.2)}" r="{fx(1.2+rnd.random()*1.6)}" fill="{col}"/>' for _ in range(n))

def onigiri(cx, cy, s, fill, rnd):
    p = f"M{cx},{cy-s} L{cx-s*.92},{cy+s*.7} L{cx+s*.92},{cy+s*.7}Z"
    g = f'<path d="{p}" fill="#fff" stroke="#fff" stroke-width="{s*.38}" stroke-linejoin="round"/>'
    g += f'<path d="{p}" fill="none" stroke="{C["grain"]}" stroke-width="{s*.38+3}" stroke-linejoin="round" opacity=".5"/>'
    g += f'<path d="{p}" fill="#fff" stroke="#fff" stroke-width="{s*.36}" stroke-linejoin="round"/>'
    for _ in range(18):
        gx, gy = cx + (rnd.random() - .5) * s * 1.1, cy + (rnd.random() - .1) * s * .8
        g += f'<ellipse cx="{fx(gx)}" cy="{fx(gy)}" rx="3.6" ry="1.9" fill="{C["grain"]}" transform="rotate({rnd.randint(0,180)} {fx(gx)} {fx(gy)})"/>'
    g += f'<circle cx="{cx}" cy="{cy-s*.15}" r="{s*.22}" fill="{fill}"/>'
    g += f'<rect x="{cx-s*.42}" y="{cy+s*.25}" width="{s*.84}" height="{s*.68}" rx="4" fill="{C["nori"]}"/>'
    return g

def sando(x, y, w, h, layers, ang=0):
    """potongan sandwich dilihat dari sisi potong: roti - isi - roti"""
    g = f'<g transform="rotate({ang} {x+w/2} {y+h/2})"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{C["crust"]}"/>'
    g += f'<rect x="{x+5}" y="{y+5}" width="{w-10}" height="{h-10}" rx="9" fill="{C["bread"]}"/>'
    tot = sum(t for _, t in layers); cy = y + h / 2 - tot / 2
    for col, t in layers:
        g += f'<rect x="{x+5}" y="{fx(cy)}" width="{w-10}" height="{t}" fill="{col}"/>'; cy += t
    return g + "</g>"

def ball(cx, cy, r, col, hi="#fff", glaze=.35):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{col}"/>'
            f'<ellipse cx="{cx-r*.35}" cy="{cy-r*.38}" rx="{r*.32}" ry="{r*.2}" fill="{hi}" opacity="{glaze}"/>')

def nugget(cx, cy, rx, ry, rnd, col=None, ang=0):
    col = col or C["gold"]
    return (f'<g transform="rotate({ang} {cx} {cy})"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{col}"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="{C["gold2"]}" stroke-width="2.5" opacity=".6"/>'
            + crumbs(cx, cy, rx, rnd, C["gold2"], 9) + "</g>")

def star(cx, cy, r, col):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * .5; a = -math.pi / 2 + i * math.pi / 5
        pts.append(f"{fx(cx+rr*math.cos(a))},{fx(cy+rr*math.sin(a))}")
    return (f'<polygon points="{" ".join(pts)}" fill="{col}" stroke="{C["gold2"]}" stroke-width="3" stroke-linejoin="round"/>'
            f'<circle cx="{cx-r*.15}" cy="{cy-r*.15}" r="{r*.12}" fill="#fff" opacity=".35"/>')

def skewer(x1, y1, x2, y2, items):
    g = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#C8A877" stroke-width="5" stroke-linecap="round"/>'
    n = len(items)
    for i, it in enumerate(items):
        t = (i + .7) / (n + .4); cx, cy = x1 + (x2 - x1) * t, y1 + (y2 - y1) * t
        g += it(cx, cy)
    return g

def spiral(cx, cy, r, outer, inner, fill, ring=None):
    g = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{outer}"/>'
    if ring: g += f'<circle cx="{cx}" cy="{cy}" r="{r*.86}" fill="{ring}"/>'
    g += f'<circle cx="{cx}" cy="{cy}" r="{r*.62}" fill="{inner}"/>'
    d = f"M{cx},{cy}"
    for i in range(1, 40):
        a = i * .45; rr = r * .6 * i / 40
        d += f" L{fx(cx+rr*math.cos(a))},{fx(cy+rr*math.sin(a))}"
    return g + f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{r*.16}" stroke-linecap="round"/>'

def egg_half(cx, cy, r, ang=0):
    return (f'<g transform="rotate({ang} {cx} {cy})"><ellipse cx="{cx}" cy="{cy}" rx="{r}" ry="{r*.78}" fill="{C["white"]}" stroke="#E9E1CC" stroke-width="2"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r*.45}" fill="{C["egg"]}"/></g>')

def fried_rice(x, y, w, h, rnd, base, bits):
    g = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{base}"/>'
    for _ in range(110):
        gx, gy = x + rnd.random() * w, y + rnd.random() * h
        g += f'<ellipse cx="{fx(gx)}" cy="{fx(gy)}" rx="5" ry="2.6" fill="#fff" opacity=".35" transform="rotate({rnd.randint(0,180)} {fx(gx)} {fx(gy)})"/>'
    for col, n, r in bits:
        for _ in range(n):
            g += f'<circle cx="{fx(x+8+rnd.random()*(w-16))}" cy="{fx(y+8+rnd.random()*(h-16))}" r="{fx(r*(.7+rnd.random()*.6))}" fill="{col}"/>'
    return g

# ---------------- lauk pendamping ----------------
def side(kind, x, y, w, h, rnd):
    cx, cy = x + w / 2, y + h / 2; g = ""
    if kind == "cuc":
        for i, (dx, dy) in enumerate([(-22, -20), (20, -18), (-18, 22), (22, 22)]):
            g += f'<circle cx="{cx+dx}" cy="{cy+dy}" r="21" fill="{C["cucr"]}"/><circle cx="{cx+dx}" cy="{cy+dy}" r="17" fill="{C["cuc"]}"/>'
            g += "".join(f'<circle cx="{fx(cx+dx+7*math.cos(a))}" cy="{fx(cy+dy+7*math.sin(a))}" r="1.8" fill="#E8F2C8"/>' for a in [0, 2.1, 4.2])
    elif kind == "tomato":
        for dx, dy in [(-20, -22), (20, -14), (-14, 22), (24, 26)]:
            g += ball(cx + dx, cy + dy, 18, C["tomato"], "#fff", .45) + f'<path d="M{cx+dx-5},{cy+dy-16} l5,4 l5,-4" stroke="#4E8A3A" stroke-width="3" fill="none"/>'
    elif kind == "orange":
        for dx, dy, a in [(-6, -18, -20), (8, 20, 15)]:
            g += (f'<g transform="rotate({a} {cx+dx} {cy+dy})"><path d="M{cx+dx-38},{cy+dy} A38,38 0 0 1 {cx+dx+38},{cy+dy}Z" fill="#F29A2E"/>'
                  f'<path d="M{cx+dx-32},{cy+dy-1} A32,32 0 0 1 {cx+dx+32},{cy+dy-1}Z" fill="#FBC56A"/>'
                  + "".join(f'<line x1="{cx+dx}" y1="{cy+dy-2}" x2="{fx(cx+dx+30*math.cos(-math.pi*k/5))}" y2="{fx(cy+dy-2+30*math.sin(-math.pi*k/5))}" stroke="#F29A2E" stroke-width="2"/>' for k in range(1, 5)) + "</g>")
    elif kind == "grape":
        for dx, dy in [(-18, -24), (2, -26), (22, -22), (-10, -4), (12, -4), (-20, 16), (2, 16), (22, 16), (-8, 36), (14, 36)]:
            g += ball(cx + dx, cy + dy, 12, "#7B4A8E", "#fff", .4)
    elif kind == "straw":
        for dx, dy, a in [(-20, -18, -15), (20, -14, 20), (-14, 24, 10), (22, 26, -20)]:
            g += (f'<g transform="rotate({a} {cx+dx} {cy+dy})"><path d="M{cx+dx-16},{cy+dy-8} Q{cx+dx},{cy+dy-18} {cx+dx+16},{cy+dy-8} Q{cx+dx+12},{cy+dy+16} {cx+dx},{cy+dy+22} Q{cx+dx-12},{cy+dy+16} {cx+dx-16},{cy+dy-8}Z" fill="#E2403E"/>'
                  f'<path d="M{cx+dx-10},{cy+dy-12} l10,-6 l10,6" fill="#5FA046"/>'
                  + "".join(f'<circle cx="{cx+dx+ox}" cy="{cy+dy+oy}" r="1.3" fill="#FCE38A"/>' for ox, oy in [(-6, -1), (5, 2), (-2, 9), (7, 10), (-7, 9)]) + "</g>")
    elif kind == "broc":
        for dx, dy in [(-18, -16), (18, -12), (0, 22)]:
            g += f'<rect x="{cx+dx-4}" y="{cy+dy}" width="8" height="18" rx="3" fill="#A9C97A"/>'
            g += "".join(ball(cx + dx + ox, cy + dy + oy, 9, "#4F8F3A", "#fff", .2) for ox, oy in [(-8, -2), (8, -2), (0, -10), (0, 2)])
    elif kind == "apple":
        for dx, dy, a in [(-10, -18, -25), (10, 0, -10), (-6, 22, 10)]:
            g += (f'<g transform="rotate({a} {cx+dx} {cy+dy})"><path d="M{cx+dx-34},{cy+dy} A34,20 0 0 0 {cx+dx+34},{cy+dy}Z" fill="#D84436"/>'
                  f'<path d="M{cx+dx-30},{cy+dy+1} A30,15 0 0 0 {cx+dx+30},{cy+dy+1}Z" fill="#FBF0D4"/></g>')
    elif kind == "corn":
        for _ in range(26):
            g += f'<rect x="{fx(x+12+rnd.random()*(w-30))}" y="{fx(y+12+rnd.random()*(h-30))}" width="11" height="10" rx="3" fill="{C["corn"]}" stroke="#E4B52C" stroke-width="1.5"/>'
    elif kind in ("sauce", "mayo", "kecap"):
        col = {"sauce": C["tomato"], "mayo": "#FFF6DA", "kecap": "#4A2516"}[kind]
        g += f'<circle cx="{cx}" cy="{cy}" r="36" fill="#fff" stroke="#E2DACB" stroke-width="3"/><circle cx="{cx}" cy="{cy}" r="27" fill="{col}"/><ellipse cx="{cx-9}" cy="{cy-10}" rx="8" ry="4" fill="#fff" opacity=".4"/>'
    elif kind == "lettuce":
        for dx, dy in [(-15, -10), (15, 5), (-5, 20)]:
            g += f'<path d="M{cx+dx-30},{cy+dy} q10,-26 30,-24 q22,0 28,22 q-10,18 -30,16 q-20,0 -28,-14Z" fill="{C["lettuce"]}"/><path d="M{cx+dx-24},{cy+dy} q24,-4 50,0" stroke="#B9DC8E" stroke-width="2.5" fill="none"/>'
    return g

# ---------------- hidangan utama ----------------
def main(no, rnd):
    X, Y, W, H = 30, 30, 220, 240
    cx, cy = X + W / 2, Y + H / 2
    if no == 1:
        return rice_bed(X, Y, W, H, rnd, 0).replace(C["rice"], "#F4EFE4") + onigiri(cx - 48, cy - 40, 52, C["kecap"], rnd) + onigiri(cx + 46, cy + 42, 52, C["kecap"], rnd)
    if no in (2, 8, 16):
        lay = {2: [(C["egg"], 22), ("#F3A65A", 5), (C["lettuce"], 6)],
               8: [("#EBD9B5", 26), (C["corn"], 4), (C["lettuce"], 6)],
               16: [("#E9F1D2", 10), (C["gold"], 30), (C["gold2"], 4)]}[no]
        bg = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#F7F1E4"/>'
        return bg + sando(X + 14, Y + 14, 92, 100, lay, -5) + sando(X + 114, Y + 18, 92, 100, lay, 4) + sando(X + 60, Y + 126, 100, 100, lay, -2)
    if no == 3:
        g = rice_bed(X, Y, W, H, rnd)
        for i, (dx, dy, a) in enumerate([(-50, -60, -20), (30, -50, 15), (-40, 20, 10), (40, 30, -15), (0, 90, 5)]):
            g += nugget(cx + dx, cy + dy, 44, 22, rnd, ang=a)
        g += f'<path d="M{X+20},{cy-90} q15,-12 30,0 t30,0 t30,0 t30,0 t30,0 t30,0" stroke="#FFF6DA" stroke-width="6" fill="none" stroke-linecap="round"/>'
        g += f'<path d="M{X+20},{cy+70} q15,-12 30,0 t30,0 t30,0 t30,0 t30,0 t30,0" stroke="#FFF6DA" stroke-width="6" fill="none" stroke-linecap="round"/>'
        return g
    if no == 4:
        g = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#E8B866"/>'
        for i in range(16):
            yy = Y + 10 + i * 15
            g += f'<path d="M{X},{yy} q14,{8 if i%2 else -8} 28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0 t28,0" stroke="#F3CF82" stroke-width="6" fill="none"/>'
        for dx, dy in [(-50, -60), (40, -30), (-30, 30), (50, 70), (-60, 90)]:
            g += ball(cx + dx, cy + dy, 22, "#6E3A1E", "#fff", .3)
        for dx, dy in [(10, -90), (-10, 70), (60, 10)]:
            g += f'<path d="M{cx+dx-25},{cy+dy} q25,-22 50,0 q-25,18 -50,0Z" fill="#4F8F3A"/>'
        return g
    if no == 5:
        g = rice_bed(X, Y, W, H, rnd)
        it = lambda kinds: [{"t": lambda a, b: f'<rect x="{fx(a-17)}" y="{fx(b-14)}" width="34" height="28" rx="6" fill="#9B5A2E"/>',
                             "e": lambda a, b: f'<ellipse cx="{fx(a)}" cy="{fx(b)}" rx="15" ry="12" fill="{C["white"]}" stroke="#E5DCC5" stroke-width="2"/>',
                             "c": lambda a, b: f'<circle cx="{fx(a)}" cy="{fx(b)}" r="14" fill="{C["cucr"]}"/><circle cx="{fx(a)}" cy="{fx(b)}" r="11" fill="{C["cuc"]}"/>'}[k] for k in kinds]
        for i in range(3):
            g += skewer(X + 20, Y + 50 + i * 70, X + W - 15, Y + 30 + i * 70, it("tetct"))
        return g
    if no in (6, 13):
        bits = [(C["corn"], 22, 5), (C["carrot"], 16, 4.5), ("#F4E3C2", 18, 7), (C["egg"], 10, 7)] if no == 6 else \
               [(C["lettuce"], 22, 4.5), (C["egg"], 10, 7)]
        g = fried_rice(X, Y, W, H, rnd, "#D9A35B" if no == 6 else "#D29A57", bits)
        if no == 13:
            for dx, dy, a in [(-50, -60, 0), (40, -40, 60), (-30, 30, 120), (50, 70, 200), (-60, 95, 30), (10, 100, 300)]:
                g += f'<g transform="rotate({a} {cx+dx} {cy+dy})"><path d="M{cx+dx-18},{cy+dy} a18,18 0 1 1 18,18" stroke="{C["pink"]}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M{cx+dx-18},{cy+dy} a18,18 0 1 1 18,18" stroke="#F7C2B4" stroke-width="4" fill="none" stroke-dasharray="4 7"/></g>'
        return g
    if no == 7:
        g = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#F3E9D6"/>'
        for dx, dy in [(-55, -70), (45, -55), (-35, 50), (60, 70)]:
            g += f'<ellipse cx="{cx+dx}" cy="{cy+dy}" rx="40" ry="34" fill="#C88A3C"/><ellipse cx="{cx+dx}" cy="{cy+dy}" rx="34" ry="28" fill="#E9B865"/>'
        for dx, dy, a in [(5, -5, 20), (-60, 105, -10), (55, 5, -30)]:
            g += egg_half(cx + dx, cy + dy, 30, a).replace(C["white"], "#C08A55")
        return g
    if no == 9:
        g = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#F3E9D6"/>'
        for i, (yy, a) in enumerate([(Y + 15, -3), (Y + 125, 2)]):
            g += f'<g transform="rotate({a} {cx} {yy+50})"><rect x="{X+15}" y="{yy}" width="{W-30}" height="100" rx="14" fill="#E07F3C"/><rect x="{X+15}" y="{yy}" width="{W-30}" height="22" rx="10" fill="#F6C24A"/>'
            for _ in range(12):
                mx, my = X + 30 + rnd.random() * (W - 60), yy + 35 + rnd.random() * 50
                g += f'<path d="M{fx(mx)},{fx(my)} a8,8 0 0 1 14,0" stroke="#F8D98B" stroke-width="5" fill="none" stroke-linecap="round"/>'
            g += "</g>"
        return g
    if no == 10:
        g = rice_bed(X, Y + 120, W, 120, rnd, 40) + f'<rect x="{X}" y="{Y}" width="{W}" height="120" fill="#F7F1E4"/>'
        for dx, dy, r in [(-60, -70, 34), (0, -60, 32), (60, -72, 34), (-30, 60, 30), (40, 60, 30)]:
            g += star(cx + dx, cy + dy, r, "#EBB867")
        return g
    if no == 11:
        g = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#F7F1E4"/>'
        for dx, dy in [(-50, -55), (50, -55), (0, 60)]:
            g += f'<circle cx="{cx+dx}" cy="{cy+dy}" r="56" fill="#fff" stroke="#E7DFCF" stroke-width="3"/>' + spiral(cx + dx, cy + dy, 48, "#EAD3A2", "#F6E6C2", C["kecap"], "#F2DDB0")
            g += f'<circle cx="{cx+dx+18}" cy="{cy+dy-12}" r="9" fill="{C["lettuce"]}"/><circle cx="{cx+dx-14}" cy="{cy+dy+16}" r="7" fill="{C["cheese"]}"/>'
        return g
    if no == 12:
        g = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#F7F1E4"/>'
        for i in range(5):
            xx, yy = X + 14 + (i % 3) * 68, Y + 20 + (i // 3) * 115
            g += f'<rect x="{xx}" y="{yy}" width="60" height="96" rx="10" fill="#F2C443"/><path d="M{xx+8},{yy+20} h44 M{xx+8},{yy+48} h44 M{xx+8},{yy+76} h44" stroke="#FBE08A" stroke-width="4"/>'
            g += crumbs(xx + 30, yy + 48, 40, rnd, "#5C9A44", 7)
        return g
    if no == 14:
        g = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#F7F1E4"/>'
        for dx, dy in [(-48, -55), (48, 55)]:
            x0, y0 = cx + dx, cy + dy
            g += f'<circle cx="{x0}" cy="{y0}" r="56" fill="{C["lettuce"]}"/><circle cx="{x0}" cy="{y0}" r="50" fill="{C["cheese"]}"/><circle cx="{x0}" cy="{y0}" r="46" fill="#D69A4C"/>'
            g += f'<circle cx="{x0}" cy="{y0}" r="40" fill="#E7B062"/>' + "".join(f'<ellipse cx="{x0+a}" cy="{y0+b}" rx="4" ry="2.2" fill="#FFF3D6"/>' for a, b in [(-14, -10), (10, -16), (16, 8), (-8, 14), (2, -2)])
            g += f'<line x1="{x0}" y1="{y0}" x2="{x0+30}" y2="{y0-40}" stroke="#C8A877" stroke-width="4" stroke-linecap="round"/><circle cx="{x0+30}" cy="{y0-40}" r="6" fill="{C["tomato"]}"/>'
        return g
    if no == 15:
        g = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#F7F1E4"/>'
        for i in range(6):
            x0, y0 = X + 46 + (i % 2) * 128, Y + 44 + (i // 2) * 76
            g += f'<circle cx="{x0}" cy="{y0}" r="38" fill="{C["nori"]}"/><circle cx="{x0}" cy="{y0}" r="33" fill="#fff"/>'
            g += crumbs(x0, y0, 34, rnd, C["grain"], 10)
            g += f'<rect x="{x0-14}" y="{y0-12}" width="18" height="18" rx="4" fill="#9B5A2E"/><rect x="{x0+4}" y="{y0-6}" width="11" height="16" rx="3" fill="{C["cuc"]}"/>'
        return g
    if no == 17:
        g = rice_bed(X, Y, W, H, rnd, 50)
        for i in range(4):
            yy = Y + 30 + i * 55
            g += f'<g transform="rotate({-8+i*5} {cx} {yy+18})"><rect x="{X+22}" y="{yy}" width="{W-44}" height="40" rx="20" fill="#DE9C45"/><rect x="{X+30}" y="{yy+6}" width="{W-60}" height="10" rx="5" fill="#F1C47A"/>'
            g += f'<path d="M{X+70},{yy+2} v36 M{X+130},{yy+2} v36" stroke="#C67E2E" stroke-width="2.5" opacity=".6"/></g>'
        return g
    if no == 18:
        g = rice_bed(X, Y, W, H, rnd, 0).replace(C["rice"], "#F7F1E4")
        for dx, dy in [(-55, -70), (-55, 0)]:
            g += f'<circle cx="{cx+dx}" cy="{cy+dy}" r="32" fill="#fff" stroke="#EDE6D8" stroke-width="2"/><rect x="{cx+dx-32}" y="{cy+dy+4}" width="64" height="18" fill="{C["nori"]}"/>'
        for dx, dy, a in [(50, -80, 10), (55, -20, -12), (50, 40, 8), (-30, 85, -6), (50, 100, 14)]:
            g += nugget(cx + dx, cy + dy, 34, 22, rnd, ang=a)
        return g
    if no == 19:
        g = rice_bed(X, Y, W, H, rnd)
        for i in range(3):
            g += skewer(X + 20, Y + 55 + i * 70, X + W - 15, Y + 45 + i * 70,
                        [lambda a, b: ball(round(a,1), round(b,1), 19, "#5B2E1A", "#F0A070", .5)] * 4)
        return g
    if no == 20:
        g = f'<rect x="{X}" y="{Y}" width="{W}" height="{H}" fill="#F7F1E4"/>'
        for i in range(6):
            x0, y0 = X + 50 + (i % 2) * 120, Y + 44 + (i // 2) * 76
            g += spiral(x0, y0, 36, "#D9A15A", "#F6E2BA", C["tomato"], "#E8BC78")
            g += f'<circle cx="{x0+10}" cy="{y0-8}" r="6" fill="{C["pink"]}"/><circle cx="{x0-8}" cy="{y0+10}" r="6" fill="{C["cheese"]}"/>'
        return g
    return ""

SIDES = {1: ("cuc", "orange"), 2: ("tomato", "sauce"), 3: ("cuc", "grape"), 4: ("orange", "apple"),
         5: ("straw", "kecap"), 6: ("cuc", "apple"), 7: ("broc", "grape"), 8: ("corn", "orange"),
         9: ("broc", "straw"), 10: ("sauce", "cuc"), 11: ("grape", "tomato"), 12: ("tomato", "orange"),
         13: ("cuc", "straw"), 14: ("lettuce", "apple"), 15: ("mayo", "orange"), 16: ("lettuce", "grape"),
         17: ("sauce", "apple"), 18: ("sauce", "broc"), 19: ("corn", "orange"), 20: ("tomato", "grape")}

def bento(no, frame="#1F4E4A"):
    rnd = random.Random(no * 7)
    s1, s2 = SIDES[no]
    clip = f"c{no}u{next(_UID)}"
    return f'''<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="{clip}a"><rect x="30" y="30" width="220" height="240" rx="24"/></clipPath>
<clipPath id="{clip}b"><rect x="265" y="30" width="105" height="112" rx="20"/></clipPath>
<clipPath id="{clip}c"><rect x="265" y="158" width="105" height="112" rx="20"/></clipPath></defs>
<rect x="14" y="20" width="380" height="276" rx="44" fill="#000" opacity=".12"/>
<rect x="10" y="10" width="380" height="280" rx="44" fill="{frame}"/>
<rect x="30" y="30" width="220" height="240" rx="24" fill="#FFFDF8"/>
<rect x="265" y="30" width="105" height="112" rx="20" fill="#FFFDF8"/>
<rect x="265" y="158" width="105" height="112" rx="20" fill="#FFFDF8"/>
<g clip-path="url(#{clip}a)">{main(no, rnd)}</g>
<g clip-path="url(#{clip}b)">{side(s1, 265, 30, 105, 112, rnd)}</g>
<g clip-path="url(#{clip}c)">{side(s2, 265, 158, 105, 112, rnd)}</g>
</svg>'''
