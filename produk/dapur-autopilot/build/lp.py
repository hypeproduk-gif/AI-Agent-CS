# -*- coding: utf-8 -*-
"""LP Scalev Dapur Autopilot: LP-dapur-autopilot-atas.html + -bawah.html"""
import os, base64, re
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "output")
def img(n): return "data:image/jpeg;base64," + base64.b64encode(open(os.path.join(HERE, "lpimg", n), "rb").read()).decode()

CSS = r"""
*{box-sizing:border-box}body{margin:0;background:#FAF5EC;color:#2F2A26;font:500 14.5px/1.6 'Plus Jakarta Sans',sans-serif}
.wrap{max-width:560px;margin:0 auto;padding-inline:20px}section{padding-block:22px}
h1{font-size:29px;line-height:1.15;margin:8px 0 10px;font-weight:800;letter-spacing:-.01em}h2{font-size:23px;line-height:1.2;margin:0 0 12px;font-weight:800}h3{font-size:16px;margin:0 0 4px}
p{margin:0 0 10px}b{font-weight:800}.hl{background:linear-gradient(transparent 60%,#F3D58A 60%)}
.kick{font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#C9772F}
.hero{background:#1F4E4A;color:#F4EEDF;padding-top:26px}.hero h1{color:#fff}.hero .kick{color:#E6B75A}
.hero img,section img,.price-card img{width:100%;height:auto!important;max-height:none!important;object-fit:contain!important;aspect-ratio:auto!important;display:block;border-radius:14px}
.hero img.cover{box-shadow:0 18px 40px rgba(0,0,0,.35);margin:14px auto 16px;max-width:300px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 16px}.chips span{border:1.4px solid rgba(255,255,255,.4);border-radius:30px;padding:4px 11px;font-size:12.5px;font-weight:700}
.btn,.btn:link,.btn:visited,.btn:hover,.btn:active,.btn:focus{display:block;text-align:center;background:#C9772F;color:#fff!important;-webkit-text-fill-color:#fff!important;text-decoration:none!important;font-weight:800;font-size:16.5px;padding:15px 18px;border-radius:14px;box-shadow:0 6px 0 #9C5A20}
.btn small{display:block;font-weight:600;font-size:12px;opacity:.9}
.log{list-style:none;padding:0;margin:0 0 12px}.log li{display:flex;gap:12px;padding:9px 0;border-bottom:1px dashed #DCCFB8}
.log li span{flex:none;font-weight:800;color:#C9772F;width:48px}.log li.hot{font-weight:800}
.punch{background:#C9772F;color:#fff;border-radius:14px;padding:14px 16px;font-weight:800;font-size:16px}
.dark{background:#2F2A26;color:#F1E9DA}.dark h2{color:#fff}
.x li{margin-bottom:8px}.ticks{list-style:none;padding:0;margin:0}.ticks li{padding:8px 0 8px 30px;position:relative;border-bottom:1px solid #EBE0CC}
.ticks li::before{content:"\2713";position:absolute;left:0;top:7px;width:21px;height:21px;border-radius:50%;background:#3E5B4A;color:#fff;font-size:12px;text-align:center;line-height:21px;font-weight:800}
.flow{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.flow div{background:#fff;border:1px solid #E6DCCB;border-radius:12px;padding:10px 12px;font-size:13px}
.flow b{display:block;color:#1F4E4A;font-size:14px}.flow .m{color:#8A8378;font-size:12px}
.card{background:#fff;border:1px solid #E6DCCB;border-radius:16px;padding:16px;margin-bottom:10px}
.pair{display:flex;align-items:center;gap:8px;background:#fff;border-radius:12px;padding:10px 12px;margin-bottom:7px;border:1px solid #E6DCCB;font-size:13.5px}
.pair .a{flex:1;color:#7A746A}.pair .ar{color:#C9772F;font-weight:800}.pair .b{flex:1.2;font-weight:800;color:#1F4E4A}
.peek{display:grid;grid-template-columns:1fr 1fr;gap:10px}.peek img{box-shadow:0 6px 18px rgba(0,0,0,.12)}
.sage{background:#3E5B4A;color:#F3EEE2}.sage h2{color:#fff}
.price-card{background:#fff;border:2.5px solid #1F4E4A;border-radius:20px;padding:18px;text-align:left}
.stack{list-style:none;padding:0;margin:0 0 12px}.stack li{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px dashed #E0D4BE;font-size:14px}
.price{font-size:40px;font-weight:800;color:#1F4E4A;text-align:center;line-height:1;margin:14px 0 4px}.price small{font-size:14px;color:#7A746A;font-weight:600}
.note{background:#FFF6E3;border-left:4px solid #C9772F;border-radius:10px;padding:12px 14px;font-size:13.5px}
.faq details{background:#fff;border:1px solid #E6DCCB;border-radius:12px;padding:12px 14px;margin-bottom:8px}.faq summary{font-weight:800;cursor:pointer}
.faq details p{margin:8px 0 0}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;color:#1F4E4A}
footer{text-align:center;font-size:12px;color:#8A8378;padding:20px 20px 90px}
#sticky{position:fixed;left:0;right:0;bottom:0;padding:10px 14px;background:rgba(250,245,236,.96);box-shadow:0 -4px 16px rgba(0,0,0,.1);transform:translateY(110%);transition:.25s;z-index:99}
#sticky.show{transform:none}#sticky .btn{max-width:530px;margin:0 auto;padding:12px}
"""
HEAD = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">'
CTA = '<a class="btn" href="#harga">Aku Mau Pagi yang Tenang &rarr;<small>Rp79rb &middot; langsung download</small></a>'

atas = f"""{HEAD}<style>{CSS}</style>
<section class="hero"><div class="wrap">
<div class="kick">Untuk Mami yang kerja &amp; anaknya bawa bekal</div>
<h1>Jam 9 malam masih bingung &ldquo;besok masak apa&rdquo;?<br>Jam 6 pagi panik bikin bekal?</h1>
<p>Masalahnya bukan Mami kurang rajin. Masalahnya Mami <b>masak dua kali &amp; mikir dari nol setiap hari.</b></p>
<p style="font-size:16.5px"><b style="color:#F3C96B">Dapur Autopilot: masak sekali malam ini, bekal besok pagi tinggal pindah &mdash; 10 menit.</b></p>
<img class="cover" src="{img('p1-01.jpg')}" alt="Cover Dapur Autopilot">
<div class="chips"><span>20 pasangan menu malam &rarr; bekal</span><span>Belanja 1&times; seminggu</span><span>Rencana B 10 menit</span><span>PDF + printable</span></div>
{CTA}</div></section>

<section><div class="wrap"><div class="kick">Kenal jam-jam ini?</div><h2>Hari Senin Mami, versi jujur</h2>
<ol class="log">
<li><span>21.47</span>Buka kulkas. Ada ayam setengah, wortel dua. Lima menit berdiri. Tutup lagi.</li>
<li><span>21.52</span>&ldquo;Besok pagi aja deh beli lauk.&rdquo;</li>
<li><span>05.40</span>Alarm. Nasi belum dimasak. Lauk belum ada.</li>
<li class="hot"><span>06.32</span>&ldquo;Mamiii, bekal aku mana?&rdquo; &mdash; nasi + telur ceplok. Lagi. Ketiga kalinya minggu ini.</li>
<li><span>07.15</span>Di jalan ke kantor, perasaan bersalahnya ikut nebeng.</li>
</ol><div class="punch">Dan besok, semuanya diulang dari nol lagi.</div></div></section>

<section class="dark"><div class="wrap"><h2>Kalau dibiarkan terus&hellip;</h2>
<ul class="x"><li><b>Uang bocor</b> ke jajan, lauk jadi, dan ojek makanan tiap kali panik.</li>
<li><b>Anak bosan</b> dengan bekal yang itu-itu saja, lalu pulang dengan kotak masih penuh.</li>
<li><b>Energi Mami habis</b> sebelum jam 7 pagi, padahal hari kerja baru mulai.</li>
<li><b>Bahan busuk di kulkas</b> karena dibeli tanpa rencana.</li></ul></div></section>

<section><div class="wrap"><div class="kick">Solusinya bukan resep baru</div><h2>Solusinya: <span class="hl">sistem</span>.</h2>
<p>Resep di internet ada jutaan, tapi tetap saja bingung tiap malam. Dapur Autopilot mengganti &ldquo;mikir tiap hari&rdquo; dengan <b>3 aturan sederhana:</b></p>
<div class="card"><h3>1. Rumus 1 Masak = 2 Makan</h3><p>Setiap masakan malam sudah dirancang untuk jadi bekal. Sisihkan 1 porsi, besok <b>ubah bentuk</b> &mdash; bukan sisa yang dipanaskan.</p></div>
<div class="card"><h3>2. Hari Tetap</h3><p>Senin ayam, Selasa telur, Rabu ikan, Kamis daging, Jumat Seru. <b>Tidak ada lagi &ldquo;masak apa ya&rdquo;.</b></p></div>
<div class="card"><h3>3. Rencana B</h3><p>Lembur? Lupa belanja? 10 menu darurat 10 menit dari stok dapur. <b>Hari kacau tetap ada bekal.</b></p></div>
<h3 style="margin-top:16px">Contohnya begini:</h3>
<div class="pair"><span class="a">&#127769; Ayam kecap mentega</span><span class="ar">&rarr;</span><span class="b">&#9728;&#65039; Onigiri ayam kecap</span></div>
<div class="pair"><span class="a">&#127769; Chicken katsu</span><span class="ar">&rarr;</span><span class="b">&#9728;&#65039; Katsu sando</span></div>
<div class="pair"><span class="a">&#127769; Bola daging BBQ</span><span class="ar">&rarr;</span><span class="b">&#9728;&#65039; Mie goreng bakso</span></div>
<div class="pair"><span class="a">&#127769; Perkedel tahu</span><span class="ar">&rarr;</span><span class="b">&#9728;&#65039; Nugget tahu bentuk bintang</span></div>
<p style="font-size:13px;color:#7A746A">+16 pasangan lainnya, lengkap dengan bahan, langkah malam, apa yang disisihkan, dan langkah pagi.</p>
{CTA}</div></section>

<section style="background:#F1E8D6"><div class="wrap"><h2>Isi paketnya</h2>
<ul class="ticks">
<li><b>Ebook 40 halaman</b> &mdash; 8 bab sistem, tiap bab ada lembar &ldquo;Aksi Hari Ini&rdquo;</li>
<li><b>20 kartu menu malam &rarr; bekal</b> &mdash; untuk 4 minggu penuh</li>
<li><b>Prep Minggu 60 menit</b> &mdash; urutan kerja menit per menit</li>
<li><b>Sistem Zona Kulkas</b> &mdash; rak &ldquo;Bekal Besok&rdquo; yang bikin pagi tinggal ambil</li>
<li><b>10 menu Rencana B</b> &mdash; semua &le;10 menit dari stok</li>
<li><b>BONUS 1:</b> Kalender dapur 4 minggu (tempel di kulkas)</li>
<li><b>BONUS 2:</b> Daftar belanja Minggu 1&ndash;4, sudah digabung per kategori</li>
<li><b>BONUS 3:</b> Label zona kulkas &amp; wadah siap gunting</li>
<li><b>BONUS 4:</b> Tracker Bintang Bekal untuk diisi bersama anak</li></ul></div></section>

<section><div class="wrap"><h2>Bayangin minggu depan&hellip;</h2>
<ul class="ticks">
<li><b>Malam hari nggak berdiri lagi di depan kulkas.</b> Kalender sudah bilang masak apa.</li>
<li><b>Pagi tinggal 15 menit</b> &mdash; ambil rak Bekal Besok, ubah bentuk, masuk kotak. Sambil minum teh.</li>
<li><b>Belanja cukup sekali seminggu.</b> Daftarnya sudah jadi, tinggal centang.</li>
<li><b>Anak buka kotak bekal dan nemu onigiri, katsu sando, pizza roll</b> &mdash; bukan telur ceplok lagi.</li>
<li><b>Suami atau ART bisa ikut jalanin</b> karena semuanya tertulis.</li>
<li><b>Hari kacau nggak bikin panik.</b> Ada Rencana B.</li></ul>
<div class="note"><b>Catatan jujur:</b> ini sistem dapur, bukan sulap. Mami tetap masak &mdash; tapi cukup sekali, tanpa mikir, dan pagi jauh lebih ringan.</div></div></section>

<section style="background:#F1E8D6"><div class="wrap"><div class="kick">Intip halaman asli</div><h2>Bukan PDF asal-asalan</h2>
<div class="peek"><img src="{img('p14-14.jpg')}" alt="Kartu menu"><img src="{img('p31-31.jpg')}" alt="Kalender"></div>
<img src="{img('p36-36.jpg')}" alt="Daftar belanja" style="margin-top:10px;max-width:270px;margin-inline:auto"></div></section>

<section><div class="wrap"><div class="kick">Dibuat oleh</div>
<div class="brand"><span style="display:inline-block;width:30px;height:26px;background:#1F4E4A;border-radius:6px;border-top:4px solid #C99A3B"></span>Tim ToolkitParenting</div>
<p style="margin-top:8px">Alat bantu praktis untuk orang tua Indonesia. Kami bikin produk yang <b>langsung bisa dipakai malam ini</b>, bukan teori panjang. Bahan yang ada di pasar &amp; supermarket biasa, alat dapur standar (teflon, rice cooker).</p></div></section>

<section style="background:#F1E8D6"><div class="wrap"><h2>Cara mulai (5 menit)</h2>
<div class="flow"><div><b>1. Checkout</b><span class="m">isi form di bawah</span></div><div><b>2. Download</b><span class="m">link langsung dikirim</span></div><div><b>3. Cetak kalender</b><span class="m">tempel di kulkas</span></div><div><b>4. Malam ini</b><span class="m">sisihkan 1 porsi</span></div></div></div></section>

<section id="harga"><div class="wrap"><div class="price-card"><div class="kick" style="text-align:center">Semua yang Mami dapat</div>
<ul class="stack"><li><span>Ebook Dapur Autopilot (8 bab)</span><b>&#10003;</b></li><li><span>20 kartu menu malam &rarr; bekal</span><b>&#10003;</b></li><li><span>10 menu Rencana B</span><b>&#10003;</b></li><li><span>Kalender 4 minggu + versi kosong</span><b>&#10003;</b></li><li><span>Daftar belanja Minggu 1&ndash;4</span><b>&#10003;</b></li><li><span>Label kulkas + Tracker Bintang</span><b>&#10003;</b></li></ul>
<!-- CEK: tambahkan harga coret HANYA jika memang ada harga normal yang berlaku -->
<div class="price">Rp79.000 <small>sekali bayar</small></div>
<p style="text-align:center;font-size:13px;color:#7A746A">Lebih murah dari 2&times; pesan lauk online saat panik pagi hari.</p></div>
<div class="note" style="margin-top:12px">&#128071; <b>Isi form di bawah</b> &mdash; nama, WA, email. Link download dikirim otomatis setelah pembayaran.</div></div></section>
"""

STICKY_JS = r"""<script>(function(){var s=document.getElementById('sticky'),h=document.querySelector('.hero'),p=document.getElementById('harga');
if(!s||!('IntersectionObserver' in window))return; if(!h||!p){s.classList.add('show');return;}
var hv=true,pv=false;function u(){s.classList.toggle('show',!hv&&!pv);}
new IntersectionObserver(function(e){hv=e[0].isIntersecting;u();}).observe(h);
new IntersectionObserver(function(e){pv=e[0].isIntersecting;u();},{rootMargin:'0px 0px -20% 0px'}).observe(p);})();</script>"""

faq = [("Bentuknya apa?", "PDF yang bisa dibaca di HP dan dicetak. Link download dikirim setelah pembayaran."),
       ("Anak saya pilih-pilih, cocok?", "Ada bab khusus: aturan &ldquo;1 Aman + 1 Baru&rdquo; dan cara ganti bentuk tanpa masak menu terpisah."),
       ("Butuh alat khusus?", "Tidak. Cukup teflon, panci, rice cooker. Air fryer opsional."),
       ("Bahannya susah dicari?", "Tidak, semuanya ada di pasar atau supermarket biasa."),
       ("Kalau saya pulang malam terus?", "Justru untuk itu ada Rencana B: 10 menu 10 menit dari stok."),
       ("Anak saya masih TK, bisa?", "Bisa, menu dirancang untuk anak usia TK sampai SD. Potong lebih kecil untuk yang kecil."),
       ("Boleh dibagikan ke teman?", "Untuk keluarga sendiri saja ya. Ajak teman beli sendiri supaya kami bisa terus berkarya.")]
faq_html = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in faq)
bawah = f"""{HEAD}<style>{CSS}</style>
<section class="faq"><div class="wrap"><h2>Pertanyaan yang sering muncul</h2>{faq_html}</div></section>
<section class="sage"><div class="wrap"><h2>Besok pagi bisa sama seperti hari ini.<br>Atau bisa beda.</h2>
<p>Malam ini Mami bisa berdiri lagi di depan kulkas. Atau Mami bisa buka Dapur Autopilot, lihat kalender, masak, dan <b>sisihkan satu porsi.</b></p>
<p>Besok jam 6, bekalnya tinggal pindah.</p>
<a class="btn" href="#harga">Ya, Aku Mau Dapur Autopilot &rarr;<small>Rp79rb &middot; langsung download</small></a></div></section>
<footer>&copy; 2026 ToolkitParenting &middot; Alat bantu praktis untuk orang tua Indonesia</footer>
<div id="sticky">{CTA}</div>{STICKY_JS}"""

def esc(s):
    # escape non-ASCII: di dalam <style> pakai \hex, sisanya entity
    parts = re.split(r'(<style>.*?</style>)', s, flags=re.S)
    out = []
    for p in parts:
        if p.startswith("<style>"):
            out.append("".join(c if ord(c) < 128 else "\\%x " % ord(c) for c in p))
        else:
            out.append("".join(c if ord(c) < 128 else "&#%d;" % ord(c) for c in p))
    return "".join(out)

for name, s in [("LP-dapur-autopilot-atas.html", atas), ("LP-dapur-autopilot-bawah.html", bawah)]:
    open(os.path.join(OUT, name), "w", encoding="ascii").write(esc(s))
# preview gabungan untuk QA
open(os.path.join(HERE, "lp-preview.html"), "w", encoding="ascii").write(
    "<!doctype html><meta name=viewport content='width=device-width'>" + esc(atas) +
    "<div style='padding:30px;text-align:center;background:#eee'>[ FORM SCALEV ]</div>" + esc(bawah))
print("lp ok")
