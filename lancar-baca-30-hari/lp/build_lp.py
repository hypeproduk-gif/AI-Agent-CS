"""Build LP Scalev (atas + bawah) — Lancar Baca 30 Hari. Gambar diambil dari render PDF asli."""
import base64, io, pathlib, subprocess, tempfile, re
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent
PDF = ROOT.parent / "pdf"
PRICE = "Rp99.000"  # CEK harga final

def page_img(pdf, n, w):
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(["pdftoppm", "-r", "110", "-png", "-f", str(n), "-l", str(n), str(pdf), f"{d}/p"], check=True)
        im = Image.open(next(pathlib.Path(d).glob("p*.png"))).convert("RGB")
    im.thumbnail((w, 4000))
    b = io.BytesIO(); im.save(b, "JPEG", quality=72)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()

BOOK = PDF / "Lancar-Baca-30-Hari.pdf"
KIDS = PDF / "Lancar-Baca-30-Hari-Lembar-Kerja-Anak.pdf"
COVER = page_img(BOOK, 1, 820)
INTIP = [(page_img(BOOK, 6, 480), "Tes Level: tahu anak mulai dari mana"),
         (page_img(BOOK, 9, 480), "Aksi Hari Ini di setiap bab"),
         (page_img(KIDS, 18, 480), "Tangga suku kata untuk anak"),
         (page_img(KIDS, 39, 480), "Cerita pendek + pertanyaan"),
         (page_img(KIDS, 46, 480), "120 kartu suku kata"),
         (page_img(KIDS, 52, 480), "Tracker 30 sesi")]

CSS = """
*{box-sizing:border-box}body{margin:0;background:#FAF5EC;color:#2F2A26;font-family:'Plus Jakarta Sans',sans-serif;font-size:14.5px;line-height:1.6}
h1,h2,h3{font-family:'Fraunces',serif;font-weight:500;color:#1F4E4A;margin:0 0 10px;line-height:1.2}
h1{font-size:29px}h2{font-size:23px}h3{font-size:16px}
section{padding-block:22px}.wrap{max-width:560px;margin:0 auto;padding-inline:20px}
p{margin:0 0 10px}b,strong{color:#1F4E4A}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#C99A3B;margin-bottom:6px}
.wm{font-weight:500;color:#1F4E4A;font-size:15px}.wm b{color:#C99A3B;font-weight:800}
.hero{padding-top:18px;text-align:center}.hero p{color:#5b524b}
.hero img.cover{width:78%;border-radius:6px;box-shadow:0 18px 40px rgba(31,78,74,.22);margin:12px auto 14px;display:block}
.chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:6px 0 14px}.chips span{background:#fff;border:1px solid #E6DCCB;border-radius:20px;padding:4px 11px;font-size:12.5px}
.btn,.btn:link,.btn:visited,.btn:hover,.btn:active,.btn:focus{display:block;text-align:center;background:#1F4E4A;color:#fff!important;-webkit-text-fill-color:#fff!important;text-decoration:none!important;font-weight:700;padding:15px 18px;border-radius:12px;font-size:16px}
.sage .btn{background:#C99A3B}
.hero img,section img,.price-card img{height:auto!important;max-height:none!important;object-fit:contain!important;aspect-ratio:auto!important}
.card{background:#fff;border:1px solid #E6DCCB;border-radius:14px;padding:16px 18px}
ol.log{list-style:none;padding:0;margin:0}ol.log li{padding:9px 0;border-bottom:1px dashed #E6DCCB}ol.log li span{display:inline-block;min-width:48px;color:#C8735A;font-weight:700;font-size:13px}
.punch{color:#C8735A;font-weight:700;font-family:'Fraunces',serif;font-size:18px;margin-top:12px}
ul.tick{list-style:none;padding:0;margin:0}ul.tick li{padding:7px 0 7px 26px;position:relative}ul.tick li:before{content:"\\2713";position:absolute;left:0;color:#8FB39A;font-weight:800}ul.x li:before{content:"\\2013";color:#C8735A}
.lv{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #F0E8DA}.lv i{flex:none;width:30px;height:30px;border-radius:50%;color:#fff;font-style:normal;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.grid figure{margin:0}.grid img{width:100%;border-radius:6px;border:1px solid #E6DCCB}.grid figcaption{font-size:12px;color:#7A6E63;margin-top:4px}
.note{background:#EEF3EC;border-radius:12px;padding:12px 14px;font-size:13.5px}
.sage{background:#1F4E4A;color:#F3EEE4}.sage h2,.sage b{color:#fff}
.price-card{background:#fff;border:2px solid #C99A3B;border-radius:16px;padding:20px;text-align:center}
.price{font-family:'Fraunces',serif;font-size:40px;color:#1F4E4A;margin:6px 0}
.stack{text-align:left;margin:12px 0}.stack div{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #E6DCCB;font-size:13.5px}
details{background:#fff;border:1px solid #E6DCCB;border-radius:12px;padding:12px 14px;margin-bottom:8px}summary{font-weight:700;cursor:pointer;color:#1F4E4A}details p{margin:8px 0 0}
footer{text-align:center;font-size:12px;color:#7A6E63;padding:24px 20px 90px}
#sticky{position:fixed;left:0;right:0;bottom:0;padding:10px 16px;background:rgba(250,245,236,.96);box-shadow:0 -4px 14px rgba(0,0,0,.08);transform:translateY(110%);transition:.3s;z-index:50}#sticky.show{transform:none}#sticky .btn{max-width:528px;margin:0 auto;padding:13px}
"""
HEAD = '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet"><style>' + CSS + "</style>"
WM = '<div class="wm"><b>Toolkit</b>Parenting</div><!-- CEK: ganti dengan <img class="logo"> logo asli base64 -->'
LV = [("#E9C46A", "Kenal Huruf & Bunyinya", "bunyi /b/, bukan “be”"), ("#8FB39A", "Suku Kata Terbuka", "ba-bi-bu-be-bo"),
      ("#9CC3D5", "Kata Dua Suku Kata", "bo-la, ma-ta, bu-ku"), ("#C8735A", "Suku Kata Tertutup & Kalimat", "i-kan, bu-nga, nya-nyi"),
      ("#1F4E4A", "Cerita Pendek", "6 cerita + pertanyaan paham")]
lv_html = "".join(f'<div class="lv"><i style="background:{c}">{i+1}</i><div><b>Level {i+1}: {t}</b><br><span style="color:#7A6E63;font-size:13px">{d}</span></div></div>' for i, (c, t, d) in enumerate(LV))
intip_html = "".join(f'<figure><img src="{s}" alt=""><figcaption>{c}</figcaption></figure>' for s, c in INTIP)

ATAS = f"""{HEAD}
<section class="hero"><div class="wrap">
{WM}
<h1 style="margin-top:16px">Anak sebentar lagi masuk SD, tapi masih bingung <i>b</i> dan <i>d</i>?</h1>
<p>Mau ngajarin sendiri, tapi ujungnya Mami marah, anak nangis, buku ditutup.</p>
<p><b>Bukan anaknya yang susah. Biasanya urutannya saja yang belum pas.</b></p>
<img class="cover" src="{COVER}" alt="Lancar Baca 30 Hari">
<div class="chips"><span>Anak 5&ndash;7 tahun</span><span>15 menit sehari</span><span>Langsung print</span><span>3 bonus</span></div>
<a class="btn" href="#harga">Aku Mau Mulai Malam Ini</a>
</div></section>

<section><div class="wrap"><div class="eyebrow">Sore yang sering terjadi</div><h2>Niatnya belajar 15 menit&hellip;</h2>
<div class="card"><ol class="log">
<li><span>16.40</span>Buku dibuka. Anak sudah lari ke sofa.</li>
<li><span>16.45</span>&ldquo;Ini huruf apa?&rdquo; &mdash; &ldquo;Nggak tahu.&rdquo; Padahal minggu lalu tahu.</li>
<li><span>16.48</span>&ldquo;Be&hellip; a&hellip; bea?&rdquo; Mami mulai bingung cara jelasinnya.</li>
<li><span>16.52</span><b>Suara Mami mulai naik. Anak mulai menangis.</b></li>
<li><span>16.55</span>Buku ditutup. Besok diulang, hasilnya sama.</li>
</ol><div class="punch">Capek dua-duanya. Dan rasa bersalahnya tinggal di Mami.</div></div>
</div></section>

<section><div class="wrap"><h2>Kalau dibiarkan&hellip;</h2>
<ul class="tick x">
<li><b>Anak masuk kelas dengan rasa &ldquo;aku nggak bisa&rdquo;</b>, padahal temannya sudah mulai membaca.</li>
<li><b>Belajar jadi momen yang ditakuti</b>, bukan dinanti.</li>
<li><b>Mami bingung harus mulai dari mana</b>, ganti-ganti video YouTube tanpa urutan.</li>
</ul></div></section>

<section><div class="wrap"><div class="eyebrow">Solusinya</div><h2>Lancar Baca 30 Hari</h2>
<p>Program membaca bertahap untuk dikerjakan <b>Mami dan anak di rumah, 15 menit sehari</b>. Isinya bukan kumpulan worksheet acak, tapi <b>urutan yang jelas</b>: tes dulu, mulai dari level yang tepat, naik level saat anak benar-benar siap.</p>
<div class="note"><b>Kenapa berbeda?</b> Anak diajari <b>bunyi</b> huruf (/b/), bukan nama huruf (&ldquo;be&rdquo;). Itu sebabnya &ldquo;be-a&rdquo; berhenti jadi &ldquo;bea&rdquo;, dan mulai jadi &ldquo;ba&rdquo;.</div>
</div></section>

<section><div class="wrap"><h2>Isi programnya</h2>
<div class="card" style="margin-bottom:12px"><b>Tes Level 10 menit</b><br><span style="color:#7A6E63;font-size:13px">Tahu anak mulai dari level mana. Diulang di sesi 15 dan 30 untuk melihat progres.</span></div>
<div class="card">{lv_html}</div>
<h3 style="margin-top:16px">Plus</h3>
<ul class="tick">
<li><b>Panduan Mami per sesi:</b> apa yang dilakukan menit 0 sampai 15</li>
<li><b>Skrip &ldquo;Alih-alih / Coba&rdquo;:</b> kalimat saat anak salah, bosan, atau menolak</li>
<li><b>Bab khusus hari berat:</b> anak mogok, tertukar b&ndash;d, jalan di tempat</li>
<li><b>Bonus 1:</b> 120 kartu suku kata + 6 permainan</li>
<li><b>Bonus 2:</b> tracker 30 sesi + sertifikat</li>
<li><b>Bonus 3:</b> kenal angka 1&ndash;20 & latihan menulis huruf</li>
</ul></div></section>

<section><div class="wrap"><h2>Bayangin 6 minggu lagi&hellip;</h2>
<ul class="tick">
<li><b>Anak yang menagih</b> &ldquo;Ma, kita belajar huruf kapan?&rdquo;</li>
<li><b>Mami tahu persis</b> hari ini harus ngapain, tanpa mikir.</li>
<li><b>Ada angka progres</b> dari Tes Level, bukan cuma perasaan.</li>
<li><b>Anak masuk SD dengan rasa</b> &ldquo;aku bisa&rdquo;.</li>
</ul>
<div class="note" style="margin-top:10px"><b>Janji jujur kami:</b> setiap anak punya tempo sendiri. &ldquo;30&rdquo; adalah jumlah sesi latihan, bukan jaminan lancar dalam 30 hari. Yang kami jamin: urutan yang jelas dan alat untuk melihat progresnya.</div>
</div></section>

<section><div class="wrap"><div class="eyebrow">Intip halaman asli</div><h2>Bukan template asal jadi</h2>
<div class="grid">{intip_html}</div>
<p style="font-size:12.5px;color:#7A6E63;margin-top:8px">Buku panduan Mami 35 halaman + lembar kerja anak 53 halaman, format PDF siap print A4.</p>
</div></section>

<section><div class="wrap"><div class="card" style="text-align:center">{WM}
<p style="margin-top:8px;font-size:13px;color:#7A6E63">Alat bantu praktis untuk orang tua Indonesia</p>
<p>Disusun oleh <b>Tim ToolkitParenting</b> dengan satu prinsip: <b>pendek, rutin, dan menyenangkan</b>. Kami tidak menjanjikan keajaiban. Kami menyiapkan urutan yang jelas supaya Mami tidak perlu menebak.</p></div>
</div></section>

<section><div class="wrap"><h2>Cara mulainya</h2>
<div class="card"><ol class="log">
<li><span>1</span>Klik tombol, isi form, bayar.</li>
<li><span>2</span>File PDF dikirim otomatis.</li>
<li><span>3</span>Print Tes Level & tracker, lakukan tes malam ini.</li>
<li><span>4</span>Besok, sesi pertama 15 menit.</li>
</ol></div></div></section>

<section id="harga"><div class="wrap"><div class="price-card">
<div class="eyebrow">Paket lengkap</div><h2>Lancar Baca 30 Hari</h2>
<div class="stack">
<div><span>Buku panduan Mami (7 bab)</span><span>&#10003;</span></div>
<div><span>Lembar kerja anak Level 1&ndash;5</span><span>&#10003;</span></div>
<div><span>120 kartu suku kata + 6 permainan</span><span>&#10003;</span></div>
<div><span>Tracker 30 sesi + sertifikat</span><span>&#10003;</span></div>
<div><span>Kenal angka & latihan menulis</span><span>&#10003;</span></div>
</div>
<!-- CEK: harga coret hanya jika promo benar-benar berlaku -->
<div class="price">{PRICE}</div>
<p style="font-size:13px;color:#7A6E63">Sekali bayar &middot; file PDF &middot; bisa di-print berulang untuk anak sendiri</p>
</div>
<p style="text-align:center;font-size:13px;margin-top:14px">&darr; Isi form di bawah, file dikirim otomatis ke WhatsApp/email &darr;</p>
</div></section>
"""

BAWAH = f"""{HEAD}
<section><div class="wrap"><h2>Pertanyaan yang sering masuk</h2>
<details><summary>Anak saya belum kenal huruf sama sekali, bisa?</summary><p>Bisa. Tes Level akan mengarahkan ke Level 1, mulai dari bunyi vokal.</p></details>
<details><summary>Anak saya sudah SD kelas 1&ndash;2, masih cocok?</summary><p>Cocok. Mulai dari level hasil tes, banyak anak kelas 1 mulai di Level 2&ndash;3.</p></details>
<details><summary>Saya bukan guru, bisa mengajarkannya?</summary><p>Bisa. Setiap sesi ada panduan menit per menit dan kalimat yang bisa langsung dipakai.</p></details>
<details><summary>Anak saya susah duduk lama.</summary><p>Karena itu sesinya cuma 15 menit, dengan permainan di tengahnya.</p></details>
<details><summary>Apakah dijamin lancar dalam 30 hari?</summary><p>Tidak ada yang bisa menjamin itu. Program ini memberi urutan dan alat untuk mengukur progres.</p></details>
<details><summary>Bentuknya apa?</summary><p>PDF siap print A4, dikirim otomatis setelah pembayaran.</p></details>
<details><summary>Masuk SD kan tidak boleh tes calistung?</summary><p>Benar. Tujuan program ini bukan lolos tes, tapi supaya anak masuk kelas dengan percaya diri.</p></details>
</div></section>

<section class="sage"><div class="wrap" style="text-align:center">
<h2>Mulai dari 15 menit malam ini</h2>
<p>Tidak perlu menunggu &ldquo;waktu yang pas&rdquo;. Cukup print Tes Level, lalu duduk di sebelah anak.</p>
<a class="btn" href="#harga">Aku Mau Lancar Baca 30 Hari</a>
</div></section>

<footer><div class="wm"><b>Toolkit</b>Parenting</div><p>Alat bantu praktis untuk orang tua Indonesia<br>&copy; 2026 ToolkitParenting. Produk digital, untuk penggunaan pribadi.</p></footer>
<div id="sticky"><a class="btn" href="#harga">Mulai Lancar Baca &middot; {PRICE}</a></div>
<script>(function(){{var s=document.getElementById('sticky'),h=document.querySelector('.hero'),p=document.getElementById('harga');
if(!s||!('IntersectionObserver' in window))return; if(!h||!p){{s.classList.add('show');return;}}
var hv=true,pv=false;function u(){{s.classList.toggle('show',!hv&&!pv);}}
new IntersectionObserver(function(e){{hv=e[0].isIntersecting;u();}}).observe(h);
new IntersectionObserver(function(e){{pv=e[0].isIntersecting;u();}},{{rootMargin:'0px 0px -20% 0px'}}).observe(p);}})();</script>
"""

def esc(s):
    return "".join(c if ord(c) < 128 else f"&#{ord(c)};" for c in s)

for name, body in (("LP-LancarBaca-atas.html", ATAS), ("LP-LancarBaca-bawah.html", BAWAH)):
    (ROOT / name).write_text(esc(body))
(ROOT / "preview.html").write_text("<meta name=viewport content='width=device-width'>" + esc(ATAS) + "<div style='padding:30px;text-align:center;background:#eee'>[FORM SCALEV]</div>" + esc(BAWAH))
print("ok")
