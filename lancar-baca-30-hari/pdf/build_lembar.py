"""Lembar Kerja Anak (printable) — Lancar Baca 30 Hari."""
import pathlib, weasyprint, random
from pypdf import PdfReader

ROOT = pathlib.Path(__file__).resolve().parent
F = (ROOT / "fonts").as_uri()
VOK = list("aiueo")
KONS = ["m", "s", "l", "b", "t", "k", "p", "n", "d", "r", "g"]
LVL = {1: "#E9C46A", 2: "#8FB39A", 3: "#9CC3D5", 4: "#C8735A", 5: "#1F4E4A"}
random.seed(7)

def page(level, title, body, sub=""):
    c = LVL[level]
    return f'''<section class="pg" style="--c:{c}"><div class="tab">Level {level}</div>
    <div class="t">{title}</div><div class="s">{sub}</div>{body}
    <div class="bisa">Aku bisa! <span>☆</span><span>☆</span><span>☆</span></div></section>'''

pages = []
# LEVEL 1 — satu halaman per huruf
KUNCI = {"a":"ayam","i":"ikan","u":"ular","e":"ember","o":"obat","m":"mata","s":"sapu","l":"lampu","b":"bola",
         "t":"topi","k":"kucing","p":"pisang","n":"nanas","d":"dasi","r":"roti","g":"gajah"}
for h in VOK + KONS[:3] + ["b","t","k","p","l","n","d","r","g"][1:]:
    pass
PICK = {}
POOL = list(KUNCI.values())
for h in KUNCI:
    yes = [w for w in ['ayam','api','ibu','ikan','ulat','uang','enak','ekor','obat','ombak','mata','madu','sapu','susu','lampu','lima','bola','batu','topi','tahu','kaki','kue','pisang','pipi','nanas','nasi','dasi','dua','roti','rusa','gigi','gula'] if w[0]==h][:2]
    no = [w for w in POOL if w[0]!=h]
    random.shuffle(no)
    row = yes + no[:2]
    random.shuffle(row)
    PICK[h] = row
urut = VOK + ["m","b","s","t","k","p","l","n","d","r","g"]
for h in urut:
    w = KUNCI[h]
    body = f'''<div class="big"><span>{h.upper()}</span><span>{h}</span></div>
    <div class="kunci"><div class="ph">gambar: {w}</div><div class="kata"><b>{w[0]}</b>{w[1:]}</div></div>
    <div class="lbl">Telusuri dengan jari, lalu dengan pensil</div>
    <div class="trace">{(h+" ")*7}</div>
    <div class="lbl">Lingkari kata yang bunyi awalnya /{h}/</div>
    <div class="row pick">{"".join(f"<span>{x}</span>" for x in PICK[h])}</div>'''
    pages.append(page(1, f"Bunyi /{h}/", body, f"seperti <b>{w[0]}</b>{w[1:]}"))

# LEVEL 2 — tangga + acak per konsonan
for k in KONS + ["c","j","h"][:0]:
    sk = [k+v for v in VOK]
    acak = sk[:]; random.shuffle(acak)
    tangga = "".join(f'<div class="step" style="margin-left:{i*14}mm">{s}</div>' for i, s in enumerate(sk))
    body = f'''<div class="lbl">Tangga suku kata — luncurkan jari dari huruf ke huruf</div>
    <div class="tangga"><div class="head">{k}</div>{tangga}</div>
    <div class="lbl">Baca acak</div><div class="row">{"".join(f"<span>{s}</span>" for s in acak)}</div>'''
    pages.append(page(2, f"Suku kata {k}", body, "ma-mi-mu-me-mo → baca turun, lalu acak"))
    if k in ("l", "k", "n", "g"):
        done = KONS[:KONS.index(k)+1]
        pool = [c+v for c in done for v in VOK]; random.shuffle(pool)
        grid = "".join(f"<td>{s}</td>" + ("</tr><tr>" if (i+1) % 5 == 0 else "") for i, s in enumerate(pool[:25]))
        pages.append(page(2, "Ulang campur", f'<table class="grid"><tr>{grid}</tr></table>', "Baca baris demi baris. Mama centang yang lancar."))

# LEVEL 3 — kata
KATA3 = [("bo·la","bola"),("ma·ta","mata"),("sa·pi","sapi"),("bu·ku","buku"),("ro·ti","roti"),("ka·ki","kaki"),
         ("su·su","susu"),("to·pi","topi"),("me·ja","meja"),("ku·da","kuda"),("na·si","nasi"),("gi·gi","gigi")]
for i in range(0, 12, 4):
    grp = KATA3[i:i+4]
    cards = "".join(f'<div class="wc"><div class="ph sm">gambar: {b}</div><div class="w">{a}</div><div class="w2">{b}</div></div>' for a, b in grp)
    pages.append(page(3, "Baca kata, lihat gambarnya", f'<div class="wcs">{cards}</div>', "Baca yang ada titiknya dulu, lalu yang utuh"))
KAL3 = ["mama beli roti", "papa minum susu", "adik suka bola", "kuda makan rumput", "baju kakak biru", "topi nenek baru"]
pages.append(page(3, "Kalimat pendek", '<ol class="kal">' + "".join(f"<li>{k}<div class='draw'></div></li>" for k in KAL3[:3]) + "</ol>", "Baca, lalu gambar di kotaknya"))

# LEVEL 4
EKOR = [("ka","n"),("ma","n"),("bu","s"),("to","p"),("la","t"),("ba","k")]
rows = "".join(f'<tr><td>{a}</td><td>+</td><td>{b}</td><td>=</td><td class="blank"></td></tr>' for a, b in EKOR)
pages.append(page(4, "Ekor Ajaib", f'<table class="ekor">{rows}</table>', "Tambahkan ekor, tulis, lalu baca"))
K4 = ["i·kan","man·di","ban·tal","sen·dok","bu·nga","nya·nyi","ku·cing","ja·lan"]
pages.append(page(4, "Kata dengan ekor", '<div class="row big2">' + "".join(f"<span>{k}</span>" for k in K4) + "</div>", "ng dan ny: dua huruf, satu suara"))

# LEVEL 5 — cerita
CERITA = {
 "Bola Merah Dimas": ["Dimas punya bola merah.", "Dimas main bola di depan rumah.", "Bola itu jatuh ke selokan.", "Dimas sedih.", "Dimas panggil Ayah.", "Ayah ambil bola dengan sapu.", "Bola merah kembali.", "Dimas bilang, \"Terima kasih, Ayah!\""],
 "Nasi Goreng Nenek": ["Hari Minggu pagi Raka ke rumah Nenek.", "Nenek mau masak nasi goreng.", "Raka bantu kupas bawang.", "Mata Raka jadi pedas.", "Nenek tertawa dan beri tisu.", "Nasi goreng sudah matang.", "Raka makan dua piring.", "\"Enak sekali, Nek!\""],
 "Hujan di Sekolah": ["Pulang sekolah hari hujan.", "Raka lupa bawa payung.", "Raka diam di depan kelas.", "Dodi datang bawa payung biru.", "\"Ayo pakai payungku berdua,\" kata Dodi.", "Mereka jalan pelan-pelan.", "Baju mereka basah sedikit.", "Tapi mereka tertawa."],
 "Kucing di Atas Genteng": ["Ada kucing kecil di atas genteng.", "Kucing itu tidak bisa turun.", "Kucing itu mengeong terus.", "Nala lihat dari jendela.", "Nala panggil Ayah.", "Ayah ambil tangga.", "Ayah bawa kucing turun.", "Nala beri kucing itu susu."],
 "Pasar Pagi": ["Pagi ini Nala ikut Ibu ke pasar.", "Pasar ramai sekali.", "Ibu beli tomat dan bayam.", "Nala pegang uang lima ribu.", "Nala beli tahu tiga buah.", "Ibu penjual beri uang kembali.", "Nala hitung uangnya.", "\"Pas, Bu!\" kata Nala."],
 "Hari Pertama di SD": ["Hari ini Nala masuk SD.", "Baju Nala merah putih.", "Nala agak takut.", "Ibu guru senyum pada Nala.", "Ada anak duduk di dekat Nala.", "Namanya Rara.", "Rara bilang, \"Mau main sama aku?\"", "Nala tidak takut lagi."],
}
for judul, kal in CERITA.items():
    body = f'<div class="ph wide">ilustrasi cerita</div><div class="cerita">{" ".join(kal)}</div><div class="lbl">Jawab bersama Mama</div><ol class="q"><li>Siapa tokohnya?</li><li>Kenapa ia sedih / takut?</li><li>Kalau kamu, apa yang kamu lakukan?</li></ol>'
    pages.append(page(5, judul, body, "Baca 2 kali. Kali kedua pasti lebih lancar."))

# KARTU
def kartu(items, level, title):
    cells = "".join(f'<div class="kt" style="border-color:{LVL[level]}">{x}</div>' for x in items)
    return f'<section class="pg kartu" style="--c:{LVL[level]}"><div class="tab">Kartu</div><div class="t">{title}</div><div class="s">Gunting di garis putus-putus</div><div class="kts">{cells}</div></section>'
setB = [k+v for k in KONS for v in VOK]
pages.append(kartu([h for h in VOK + KONS], 1, "Kartu Set A · Huruf"))
for i in range(0, len(setB), 20):
    pages.append(kartu(setB[i:i+20], 2, "Kartu Set B · Suku Kata"))
pages.append(kartu([b for _, b in KATA3] + ["mama","papa","kakak","adik","sate","kue","tahu","baju"], 3, "Kartu Set C · Kata"))
pages.append(kartu(["kan","man","bus","top","lat","bak","nga","nya","ngi","nyi","cing","dok","jan","lan","tal","ral","mah","pak","sen","ban"], 4, "Kartu Set D · Suku Kata Tertutup"))

# TRACKER & SERTIFIKAT
circles = "".join(f'<div class="ci{" star" if (i+1)%5==0 else ""}{" tes" if i+1 in (1,15,30) else ""}">{i+1}</div>' for i in range(30))
pages.append(f'<section class="pg tracker"><div class="t">Jalan Menuju Sekolah</div><div class="s">Tempel satu stiker setiap selesai berlatih. Bintang = hadiah kecil. ✎ = hari tes.</div><div class="cis">{circles}</div><div class="school">🏫</div></section>')
pages.append('<section class="pg sert"><div class="frame"><div class="s">Sertifikat</div><div class="t">Selamat!</div><p class="nm">______________________________</p><p>sudah berlatih membaca selama <b>30 sesi</b><br>bersama ______________________</p><p class="tgl">Tanggal: ________________</p></div></section>')

CSS = f'''
@font-face{{font-family:Fr;src:url("{F}/Fraunces.ttf");font-weight:100 900}}
@font-face{{font-family:Jk;src:url("{F}/PlusJakartaSans.ttf");font-weight:200 800}}
@page{{size:A4;margin:14mm;background:#FFFDF8;@bottom-center{{content:"Lancar Baca 30 Hari · Lembar Kerja Anak · © ToolkitParenting · untuk penggunaan pribadi";font:500 6.5pt Jk;color:#B3A594}}}}
html{{font-family:Jk;color:#2F2A26}}
.pg{{break-before:page;position:relative;height:262mm;border:1.5px solid var(--c);border-radius:6mm;padding:12mm 14mm;box-sizing:border-box}}
.tab{{position:absolute;top:-1px;right:14mm;background:var(--c);color:#fff;font:700 8pt Jk;letter-spacing:.14em;text-transform:uppercase;padding:2mm 4mm;border-radius:0 0 3mm 3mm}}
.t{{font:500 24pt Fr;color:#1F4E4A}} .s{{font-size:10pt;color:#7A6E63;margin:1mm 0 8mm}} .s b{{color:#C8735A}}
.lbl{{font:700 8pt Jk;letter-spacing:.12em;text-transform:uppercase;color:#A08C7C;margin:8mm 0 3mm}}
.big{{font:500 110pt/1 Fr;color:#1F4E4A;text-align:center}} .big span{{margin:0 8mm}} .big span+span{{color:var(--c)}}
.kunci{{text-align:center;margin-top:4mm}} .kata{{font:500 30pt Jk;margin-top:3mm}} .kata b{{color:#C8735A}}
.ph{{background:#F3EBDD;border-radius:4mm;color:#B09C84;font:600 7pt Jk;letter-spacing:.12em;text-transform:uppercase;width:55mm;height:42mm;margin:0 auto;display:flex;align-items:center;justify-content:center}}
.ph.sm{{width:100%;height:32mm}} .ph.wide{{width:100%;height:60mm}}
.trace{{font:300 54pt Jk;color:#D9CFC0;letter-spacing:6mm;border-top:1px dashed #D9CFC0;border-bottom:1px dashed #D9CFC0;white-space:nowrap;overflow:hidden}}
.bisa{{position:absolute;bottom:9mm;right:14mm;font:600 10pt Jk;color:#1F4E4A}} .bisa span{{font-size:20pt;color:var(--c);margin-left:2mm}}
.tangga{{position:relative;font:500 40pt/1.3 Fr;color:#1F4E4A}} .tangga .head{{color:#C8735A;font-size:54pt}} .step{{border-bottom:1px dotted #E6DCCB;width:30mm}}
.row{{font:500 30pt Fr;display:flex;justify-content:space-between;color:#1F4E4A}} .row span{{border:1.5px solid var(--c);border-radius:4mm;padding:2mm 6mm}}
.row.big2{{flex-wrap:wrap;gap:8mm 0;font-size:30pt}} .row.big2 span{{width:62mm;text-align:center;box-sizing:border-box}}
table.grid{{width:100%;border-collapse:collapse;font:500 30pt Fr;text-align:center;color:#1F4E4A}} table.grid td{{border:1px solid #E6DCCB;padding:6mm 0}}
.wcs{{display:flex;flex-wrap:wrap;gap:8mm}} .wc{{width:68mm;text-align:center}} .w{{font:500 30pt Fr;color:#1F4E4A;margin-top:3mm}} .w2{{font:500 18pt Jk;color:#7A6E63}}
.kal{{font:500 24pt Fr;color:#1F4E4A}} .draw{{height:45mm;border:1.5px dashed #D9CFC0;border-radius:4mm;margin:3mm 0 7mm}}
.ekor{{font:500 34pt Fr;color:#1F4E4A;margin:auto}} .ekor td{{padding:3mm 4mm}} .blank{{border-bottom:2px solid #C8735A;width:50mm}}
.cerita{{font:400 19pt/1.9 Fr;margin-top:7mm}} .q{{font-size:12pt;line-height:2.4}}
.row.pick{{font-size:22pt}} .kts{{display:flex;flex-wrap:wrap}} .kt{{width:45mm;height:44mm;border:1.5px dashed;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font:500 34pt Fr;color:#1F4E4A;margin:0 -0.75px -0.75px 0}}
.tracker{{border-color:#C99A3B}} .cis{{display:flex;flex-wrap:wrap;gap:7mm 9mm;justify-content:center;margin-top:10mm;flex-direction:row}}
.ci{{width:22mm;height:22mm;border-radius:50%;border:1.5px dashed #C99A3B;font:600 9pt Jk;color:#C99A3B;display:flex;align-items:flex-start;justify-content:center;padding-top:1.5mm;box-sizing:border-box}}
.ci.star{{background:#FBF0D9;border-style:solid}} .ci.tes{{border-color:#C8735A;color:#C8735A}} .ci.tes::after{{content:" ✎"}}
.school{{text-align:center;font-size:40pt;margin-top:8mm}}
.sert{{border:none;padding:0}} .frame{{border:3px double #C99A3B;border-radius:6mm;height:100%;text-align:center;padding-top:60mm;box-sizing:border-box;font-size:14pt}}
.sert .t{{font-size:44pt}} .nm{{font:400 20pt Fr;margin:14mm 0 6mm}} .tgl{{margin-top:20mm;color:#7A6E63}}
'''
cover = '<section style="text-align:center;padding-top:80mm"><div style="font:700 9pt Jk;letter-spacing:.2em;color:#C99A3B;text-transform:uppercase">Lancar Baca 30 Hari</div><div style="font:400 46pt Fr;color:#1F4E4A;margin:6mm 0">Lembar Kerja Anak</div><div style="color:#7A6E63">Print halaman sesuai level aktif · Level 1–5 · Kartu · Tracker · Sertifikat</div><div style="margin-top:20mm">Nama: ____________________________</div></section>'
html = f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{cover}{''.join(pages)}</body></html>"
out = ROOT / "Lancar-Baca-30-Hari-Lembar-Kerja-Anak.pdf"
weasyprint.HTML(string=html).write_pdf(out)
print(out.name, len(PdfReader(out).pages), "halaman")
