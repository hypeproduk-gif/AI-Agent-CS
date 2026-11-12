# -*- coding: utf-8 -*-
"""LP v2 (benefit-heavy) Dapur Autopilot -> output/LP-v2-dapur-autopilot-atas.html / -bawah.html"""
import os
from lp import CSS, HEAD, STICKY_JS, img, esc, OUT, HERE
from content import R

CSS2 = CSS + r"""
.hero2{background:#1F4E4A;color:#F4EEDF;padding-top:24px}.hero2 h1{color:#fff;font-size:30px}
.hero2 .kick{color:#E6B75A}.hero2 img.ph{border-radius:18px;box-shadow:0 16px 36px rgba(0,0,0,.35);margin:14px 0}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.grid4 img{border-radius:8px!important}
.bene{list-style:none;padding:0;margin:0}.bene li{background:#fff;border:1px solid #E6DCCB;border-radius:14px;padding:12px 14px 12px 52px;margin-bottom:8px;position:relative}
.bene li i{position:absolute;left:12px;top:12px;width:30px;height:30px;border-radius:50%;background:#F3E3BE;font-style:normal;text-align:center;line-height:30px;font-size:16px}
.bene li b{display:block;color:#1F4E4A;font-size:15px}
.ba{width:100%;border-collapse:separate;border-spacing:0;border-radius:14px;overflow:hidden;border:1px solid #E6DCCB;background:#fff;font-size:13.5px}
.ba th{padding:10px;font-size:13px;color:#fff}.ba th:first-child{background:#9A9286}.ba th:last-child{background:#3E5B4A}
.ba td{padding:9px 10px;border-top:1px solid #EFE6D6;vertical-align:top;width:50%}.ba td:first-child{color:#8A8378}.ba td:last-child{font-weight:700;color:#1F4E4A}
.math{background:#fff;border:2px dashed #C9772F;border-radius:16px;padding:16px;text-align:center}
.math .big{font-size:30px;font-weight:800;color:#C9772F;line-height:1.1}
.who{display:grid;grid-template-columns:1fr 1fr;gap:8px}.who div{background:#fff;border-radius:12px;padding:10px 12px;border:1px solid #E6DCCB;font-size:13px}
.who div::before{content:"\2714  ";color:#3E5B4A;font-weight:800}
"""

CTA = '<a class="btn" href="#harga">Aku Mau Dapur Autopilot &rarr;<small>Rp79rb &middot; langsung download</small></a>'

def ul(items):
    return '<ul class="bene">' + "".join(f"<li><i>{ic}</i><b>{t}</b>{d}</li>" for ic, t, d in items) + "</ul>"

grid = '<div class="grid4">' + "".join(f'<img src="{img("m/%02d.jpg" % x["no"])}" alt="{x["bekal"]}">' for x in R[:16]) + "</div>"

atas = f"""{HEAD}<style>{CSS2}</style>
<section class="hero2 hero"><div class="wrap">
<div class="kick">Untuk Mami kerja yang anaknya bawa bekal</div>
<h1>Mulai minggu depan, Mami nggak perlu mikir &ldquo;besok masak apa&rdquo; lagi.</h1>
<p>Masak sekali malam ini. Besok pagi bekal anak <b style="color:#F3C96B">tinggal pindah 10 menit</b> &mdash; dan isinya bikin anak penasaran buka kotak bekalnya.</p>
<img class="ph" src="{img('hero.jpg')}" alt="Katsu sando bekal">
<div class="chips"><span>20 menu bekal 4 minggu</span><span>Belanja 1&times; seminggu</span><span>Pagi cuma 15 menit</span></div>
{CTA}</div></section>

<section><div class="wrap"><div class="kick">Ini isi kotak bekal anak Mami 4 minggu ke depan</div>
<h2>20 hari sekolah. 20 bekal beda. Nol mikir.</h2>{grid}
<p style="font-size:13px;color:#7A746A;margin-top:8px">Onigiri, katsu sando, sushi roll tempe, pizza roll, nugget bintang&hellip; semuanya dari masakan makan malam keluarga.</p></div></section>

<section style="background:#F1E8D6"><div class="wrap"><div class="kick">Minggu pertama</div><h2>Yang langsung Mami rasakan</h2>
{ul([("&#127769;","Malam lebih tenang.","Nggak ada lagi 5 menit berdiri bengong di depan kulkas. Kalender sudah jawab: malam ini masak apa."),
     ("&#9200;","Pagi cuma 15 menit.","Ambil rak &ldquo;Bekal Besok&rdquo;, ubah bentuk, masuk kotak. Sambil minum teh, bukan sambil teriak."),
     ("&#128564;","Bangun lebih santai.","Bekal sudah setengah jadi dari semalam. Alarm nggak perlu diset subuh-subuh lagi."),
     ("&#128722;","Belanja cukup sekali seminggu.","Daftar belanja 4 minggu sudah jadi per kategori. Tinggal centang, nggak ada bolak-balik warung."),
     ("&#128176;","Dompet lebih aman.","Stop pesan lauk online dadakan, stop jajan karena &ldquo;nggak sempat masak&rdquo;."),
     ("&#129388;","Kulkas rapi, bahan nggak busuk.","Semua dibeli sesuai rencana, semua punya tempat dan hari."),
     ("&#128588;","Rasa bersalah hilang.","Anak berangkat bawa bekal rumahan yang dibuat dengan rencana, bukan dengan panik.")])}
</div></section>

<section><div class="wrap"><div class="kick">Buat si kecil</div><h2>Yang dirasakan anak</h2>
{ul([("&#127793;","Bekal beda setiap hari.","20 menu dalam 4 minggu. Nggak ada lagi &ldquo;telur ceplok lagi, Mi?&rdquo;"),
     ("&#11088;","Bentuknya bikin semangat makan.","Nugget bintang, onigiri, sushi roll, pizza roll &mdash; bekal yang pengen dipamerin ke teman."),
     ("&#127881;","Punya hari favorit.","Jumat Seru: anak ikut pilih bentuk atau topping. Mereka yang nagih bekalnya."),
     ("&#127822;","Ada buah &amp; sayur tiap hari.","Formula kotak bekal yang seimbang, tanpa harus perang soal sayur."),
     ("&#128140;","Ngerasa diperhatikan.","Tiap buka kotak, ada &ldquo;Mami&rdquo; di dalamnya &mdash; meski Mami lagi meeting.")])}
</div></section>

<section class="dark"><div class="wrap"><h2>Dan setelah sebulan&hellip;</h2>
<ul class="x"><li><b>Mami punya 20 menu andalan</b> yang sudah teruji di keluarga sendiri.</li>
<li><b>Sistemnya jalan sendiri.</b> Suami atau ART bisa ikut masak tanpa nanya &ldquo;ini dimasak apa?&rdquo;.</li>
<li><b>Tinggal ulang dari Minggu 1</b> &mdash; dipakai terus selama anak masih bawa bekal.</li>
<li><b>Dapur nggak lagi jadi sumber stres</b> nomor satu di rumah.</li></ul></div></section>

<section><div class="wrap"><h2>Sebelum vs sesudah</h2>
<table class="ba"><tr><th>Sebelum</th><th>Dengan Dapur Autopilot</th></tr>
<tr><td>Mikir menu tiap malam</td><td>Lihat kalender, selesai</td></tr>
<tr><td>Masak 2&times; (malam &amp; pagi)</td><td>Masak 1&times;, pagi tinggal rakit</td></tr>
<tr><td>Belanja dadakan 3&ndash;4&times; seminggu</td><td>Belanja 1&times; pakai daftar jadi</td></tr>
<tr><td>Bekal itu-itu saja</td><td>20 bekal beda dalam 4 minggu</td></tr>
<tr><td>Hari lembur = panik</td><td>Ada 10 menu Rencana B, &le;10 menit</td></tr>
<tr><td>Berangkat kerja bawa rasa bersalah</td><td>Berangkat kerja dengan tenang</td></tr></table></div></section>

<section style="background:#F1E8D6"><div class="wrap"><h2>Hitungan simpelnya</h2>
<div class="math"><p>Sekali pesan lauk online karena panik pagi:</p><div class="big">&plusmn; Rp30.000</div>
<p style="margin-top:8px">Dapur Autopilot <b>Rp79.000</b>, dipakai berbulan-bulan.<br><b>Cukup 3&times; nggak panik pesan lauk &mdash; sudah balik modal.</b></p></div>
{CTA}</div></section>

<section><div class="wrap"><h2>Cocok banget kalau Mami&hellip;</h2>
<div class="who"><div>Kerja kantoran / WFH</div><div>Anak TK&ndash;SD bawa bekal</div><div>Pulang sore / malam</div><div>Nggak punya ART</div><div>Punya ART tapi capek ngarahin</div><div>Sering bingung menu</div><div>Pengen bekal anak variatif</div><div>Pengen hemat belanja</div></div></div></section>

<section style="background:#F1E8D6"><div class="wrap"><h2>Isi paketnya</h2>
<ul class="ticks">
<li><b>Ebook 41 halaman</b> &mdash; 8 bab sistem + lembar &ldquo;Aksi Hari Ini&rdquo;</li>
<li><b>20 kartu menu bergambar</b> &mdash; bahan, langkah malam, yang disisihkan, langkah pagi</li>
<li><b>Prep Minggu 60 menit</b> &mdash; urutan kerja menit per menit</li>
<li><b>10 menu Rencana B</b> &mdash; untuk hari lembur &amp; kacau</li>
<li><b>BONUS:</b> Kalender 4 minggu, daftar belanja Minggu 1&ndash;4, label kulkas, Tracker Bintang anak</li></ul></div></section>

<section><div class="wrap"><div class="kick">Intip halaman asli</div><h2>Bukan PDF asal-asalan</h2>
<div class="peek"><img src="{img('p31-31.jpg')}" alt="Galeri bekal"><img src="{img('p14-14.jpg')}" alt="Kartu menu"></div></div></section>

<section id="harga"><div class="wrap"><div class="price-card"><div class="kick" style="text-align:center">Semua yang Mami dapat</div>
<ul class="stack"><li><span>Ebook Dapur Autopilot (8 bab)</span><b>&#10003;</b></li><li><span>20 kartu menu bergambar</span><b>&#10003;</b></li><li><span>10 menu Rencana B</span><b>&#10003;</b></li><li><span>Kalender 4 minggu + versi kosong</span><b>&#10003;</b></li><li><span>Daftar belanja Minggu 1&ndash;4</span><b>&#10003;</b></li><li><span>Label kulkas + Tracker Bintang</span><b>&#10003;</b></li></ul>
<!-- CEK: tambahkan harga coret HANYA jika memang ada harga normal yang berlaku -->
<div class="price">Rp79.000 <small>sekali bayar</small></div>
<p style="text-align:center;font-size:13px;color:#7A746A">Akses selamanya. Cetak sepuasnya untuk keluarga sendiri.</p></div>
<div class="note" style="margin-top:12px">&#128071; <b>Isi form di bawah</b> &mdash; link download dikirim otomatis setelah pembayaran.</div></div></section>
"""

faq = [("Bentuknya apa?", "PDF yang bisa dibaca di HP dan dicetak. Link download dikirim setelah pembayaran."),
       ("Anak saya pilih-pilih, cocok?", "Ada bab khusus: aturan &ldquo;1 Aman + 1 Baru&rdquo; dan cara ganti bentuk tanpa masak menu terpisah."),
       ("Butuh alat khusus?", "Tidak. Teflon, panci, rice cooker cukup. Air fryer opsional."),
       ("Bahannya mahal / susah dicari?", "Tidak. Semua bahan ada di pasar atau supermarket biasa."),
       ("Saya sering pulang malam.", "Justru itu gunanya Rencana B: 10 menu 10 menit dari stok."),
       ("Anak saya masih TK?", "Bisa. Menu untuk TK sampai SD; potong lebih kecil untuk yang kecil."),
       ("Boleh dibagikan?", "Untuk keluarga sendiri ya. Ajak teman beli sendiri supaya kami bisa terus berkarya.")]
bawah = f"""{HEAD}<style>{CSS2}</style>
<section class="faq"><div class="wrap"><h2>Pertanyaan yang sering muncul</h2>{"".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in faq)}</div></section>
<section class="sage"><div class="wrap"><h2>Malam ini Mami bisa bengong lagi depan kulkas.<br>Atau mulai pakai sistemnya.</h2>
<p>Satu keputusan malam ini = puluhan pagi yang lebih tenang ke depan. Untuk Mami, dan untuk si kecil yang buka kotak bekalnya jam istirahat nanti.</p>
<a class="btn" href="#harga">Ya, Aku Mau Pagi yang Tenang &rarr;<small>Rp79rb &middot; langsung download</small></a></div></section>
<footer>&copy; 2026 ToolkitParenting &middot; Alat bantu praktis untuk orang tua Indonesia</footer>
<div id="sticky">{CTA}</div>{STICKY_JS}"""

for name, s in [("LP-v2-dapur-autopilot-atas.html", atas), ("LP-v2-dapur-autopilot-bawah.html", bawah)]:
    open(os.path.join(OUT, name), "w", encoding="ascii").write(esc(s))
open(os.path.join(HERE, "lp-preview.html"), "w", encoding="ascii").write(
    "<!doctype html><meta name=viewport content='width=device-width'>" + esc(atas) +
    "<div style='padding:30px;text-align:center;background:#eee'>[ FORM SCALEV ]</div>" + esc(bawah))
print("lp2 ok")
