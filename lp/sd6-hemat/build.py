# Bangun LP 2 halaman (LP + Checkout) Siap Ujian Kelas 6 versi hemat Rp59.000.
# Pakai: python3 lp/sd6-hemat/build.py <folder gambar y-home.jpg, y-soal.jpg, y-sim.jpg>
import base64, sys, os
IMG = sys.argv[1]
OUT = os.path.dirname(os.path.abspath(__file__))
img = lambda n: 'data:image/jpeg;base64,' + base64.b64encode(open(f'{IMG}/y-{n}.jpg', 'rb').read()).decode()
CO = 'GANTI-DENGAN-LINK-HALAMAN-CHECKOUT'

FONT = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
CSS = '''<style>
.sh,.sh *{box-sizing:border-box;margin:0;padding:0}
.sh{--nv:#0b1f4d;--nv2:#132f6e;--gd:#f5b82e;--gd2:#ffd66b;--ink:#1c2333;--mut:#5b6476;--bg:#f6f7fb;--ok:#16a34a;--no:#dc2626;
font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:var(--ink);background:var(--bg);font-size:17px;line-height:1.6;width:100%;overflow-x:hidden}
.sh .w{max-width:560px;margin:0 auto;padding:0 20px}
.sh h1,.sh h2,.sh h3{text-wrap:balance;line-height:1.25;font-weight:800}.sh p,.sh li{text-wrap:pretty}
.sh h1{font-size:30px}.sh h2{font-size:24px;margin-bottom:14px}.sh h3{font-size:18px}
.sh .top{background:var(--no);color:#fff;text-align:center;font-weight:700;font-size:14px;padding:9px 12px}
.sh .hero{background:linear-gradient(170deg,var(--nv),var(--nv2));color:#fff;padding:30px 0 36px;text-align:center}
.sh .hero h1 span{color:var(--gd2)}.sh .hero p.s{font-size:17px;opacity:.92;margin:12px 0 20px}
.sh .ph{width:250px;margin:0 auto 20px;border-radius:30px;background:#000;padding:9px;box-shadow:0 20px 40px #0007}.sh .ph img{width:100%;display:block;border-radius:22px}
.sh .cta{display:block;background:var(--gd);color:var(--nv)!important;text-decoration:none!important;text-align:center;font-weight:800;font-size:19px;padding:17px 14px;border-radius:14px;box-shadow:0 5px 0 #b7841a;margin:6px 0}
.sh .cta small{display:block;font-size:13px;font-weight:600;opacity:.85}
.sh .chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:14px;font-size:13.5px}.sh .chips span{border:1px solid #ffffff55;border-radius:99px;padding:5px 12px}
.sh .sec{padding:34px 0}.sh .alt{background:#fff}
.sh .pain li{list-style:none;background:#fff;border-left:4px solid var(--no);border-radius:10px;padding:12px 14px;margin-bottom:10px;box-shadow:0 1px 3px #0001}
.sh .note{background:#fff7e0;border:1px solid #f5d48a;border-radius:12px;padding:14px 16px;margin-top:14px;font-weight:600}
.sh .ft{display:flex;gap:14px;align-items:center;margin-bottom:18px}.sh .ft img{width:120px;border-radius:12px;border:1px solid #e3e6ee;flex:none}
.sh .ft p{font-size:15.5px;color:var(--mut)}
.sh .list li{list-style:none;padding:8px 0 8px 32px;position:relative;border-bottom:1px dashed #e3e6ee}.sh .list li:before{content:"✓";position:absolute;left:4px;top:7px;color:var(--ok);font-weight:800}
.sh .plan{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e3e6ee}.sh .plan div{display:flex;gap:12px;padding:12px 16px;border-bottom:1px solid #eef0f5}.sh .plan b{min-width:92px;color:var(--nv2)}
.sh .steps{counter-reset:s}.sh .steps li{list-style:none;counter-increment:s;padding:10px 0 10px 46px;position:relative}.sh .steps li:before{content:counter(s);position:absolute;left:0;top:8px;width:32px;height:32px;border-radius:50%;background:var(--nv);color:var(--gd2);font-weight:800;display:flex;align-items:center;justify-content:center}
.sh .cmp{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;font-size:15px}.sh .cmp td,.sh .cmp th{padding:10px 12px;border-bottom:1px solid #eef0f5;text-align:left}.sh .cmp th{background:var(--nv);color:#fff}.sh .cmp td:last-child{font-weight:700;color:var(--nv2)}
.sh .honest{background:#eef4ff;border-radius:14px;padding:18px}.sh .honest li{list-style:none;padding:5px 0}
.sh details{background:#fff;border:1px solid #e3e6ee;border-radius:12px;padding:13px 16px;margin-bottom:10px}.sh summary{font-weight:700;cursor:pointer}.sh details p{margin-top:8px;color:var(--mut);font-size:15.5px}
.sh .price{background:linear-gradient(170deg,var(--nv),var(--nv2));color:#fff;text-align:center;padding:34px 0}
.sh .price .n{font-size:46px;font-weight:800;color:var(--gd2);line-height:1.1}.sh .price ul{text-align:left;margin:16px 0}.sh .price li{list-style:none;padding:4px 0}
.sh .foot{text-align:center;font-size:12.5px;color:var(--mut);padding:18px 0 90px}
.sh .sticky{position:fixed;left:0;right:0;bottom:0;background:#fffffff2;border-top:1px solid #e3e6ee;padding:10px 16px;z-index:50}.sh .sticky .cta{margin:0 auto;max-width:520px;padding:13px;font-size:17px}
@media(min-width:700px){.sh h1{font-size:38px}.sh .ft img{width:150px}}
</style>'''

lp = f'''{FONT}{CSS}<div class="sh">
<div class="top">⏰ UAS semester 1 kelas 6 sudah dekat. Mulai latihan hari ini.</div>
<div class="hero"><div class="w">
<h1>UAS Sudah Dekat.<br><span>Anak Sudah Latihan Berapa&nbsp;Soal?</span></h1>
<p class="s">320 soal latihan 4 mapel kelas 6, langsung dikoreksi dan dibahas. Cukup ±30 menit sehari dari&nbsp;HP.</p>
<div class="ph"><img src="{img('home')}" alt="Tampilan aplikasi Siap Ujian Kelas 6"></div>
<a class="cta" href="{CO}">Mulai Latihan · Rp59.000<small>Sekali bayar · langsung bisa dipakai</small></a>
<div class="chips"><span>✓ Matematika</span><span>✓ B. Indonesia</span><span>✓ B. Inggris</span><span>✓ IPA</span></div>
</div></div>

<div class="sec"><div class="w">
<h2>Kalau Ini Terjadi di Rumah, Anda Tidak&nbsp;Sendiri</h2>
<ul class="pain">
<li>Ditanya “sudah belajar?”, jawabnya “sudah”, tapi latihannya cuma LKS.</li>
<li>Mau bantu belajar, tapi bingung soal kelas 6 sekarang seperti apa.</li>
<li>Anak bisa di rumah, tapi panik dan kehabisan waktu saat ujian.</li>
<li>Les tambahan menjelang UAS mahal, jadwalnya juga susah.</li>
</ul>
<p class="note">Yang dibutuhkan 2 minggu sebelum UAS bukan materi baru. Yang dibutuhkan: <u>banyak latihan soal + tahu salahnya di&nbsp;mana</u>.</p>
</div></div>

<div class="sec alt"><div class="w">
<h2>Siap Ujian Kelas 6: Latihan Singkat, Langsung Tahu&nbsp;Salahnya</h2>
<div class="ft"><img src="{img('soal')}" alt="Soal dan pembahasan"><div><h3>Jawab → langsung dibahas</h3><p>Salah? Jawaban benar dan cara mengerjakannya langsung muncul. Anak belajar sendiri, orang tua tidak perlu jadi guru.</p></div></div>
<div class="ft"><img src="{img('sim')}" alt="Simulasi ujian bertimer"><div><h3>Simulasi ujian 60 menit</h3><p>40 soal dengan timer, seperti ujian sungguhan. Anak terbiasa mengatur waktu sebelum hari H.</p></div></div>
<div class="ft"><img src="{img('home')}" alt="Paket drill dan nilai"><div><h3>Nilai per paket terlihat</h3><p>Warna hijau, kuning, merah. Sekali lihat, Anda tahu mapel mana yang perlu dikejar.</p></div></div>
</div></div>

<div class="sec"><div class="w">
<h2>Yang Anda Dapat</h2>
<ul class="list">
<li><b>320 soal pilihan</b> Matematika, B. Indonesia, B. Inggris, IPA kelas 6 (Kurikulum Merdeka)</li>
<li><b>32 paket drill</b> × 10 soal, bertahap: dasar → menengah → HOTS</li>
<li><b>Pembahasan</b> di setiap soal</li>
<li><b>Simulasi ujian bertimer</b> 40 soal / 60 menit</li>
<li><b>Drill topik lemah</b> otomatis dari soal yang sering salah</li>
<li><b>Hitung mundur</b> ke tanggal ujian + rapor nilai</li>
<li><b>Ringkasan materi</b> 4 mapel, bisa dicetak</li>
</ul>
</div></div>

<div class="sec alt"><div class="w">
<h2>Jadwal 2 Minggu Menuju UAS</h2>
<div class="plan">
<div><b>Senin–Jumat</b><span>3 paket drill sehari (±30 menit)</span></div>
<div><b>Sabtu</b><span>1 simulasi ujian 60 menit</span></div>
<div><b>Minggu</b><span>Drill topik lemah + ulang soal salah</span></div>
<div><b>H-2</b><span>Baca ringkasan materi, simulasi terakhir</span></div>
</div>
<p style="margin-top:12px;color:var(--mut);font-size:15px">Semua 32 paket selesai dalam ±11 hari. Jawaban tersimpan otomatis, bisa dicicil.</p>
</div></div>

<div class="sec"><div class="w">
<h2>Lebih Hemat dari Les Tambahan</h2>
<table class="cmp"><tr><th></th><th>Les menjelang UAS</th><th>Siap Ujian Kelas 6</th></tr>
<tr><td>Biaya</td><td>Rp300 ribu–1 juta</td><td>Rp59.000 sekali</td></tr>
<tr><td>Jadwal</td><td>Ikut jadwal les</td><td>Kapan saja</td></tr>
<tr><td>Pembahasan</td><td>Di kelas</td><td>Tiap soal, bisa diulang</td></tr>
<tr><td>Antar-jemput</td><td>Perlu</td><td>Tidak perlu</td></tr></table>
</div></div>

<div class="sec alt"><div class="w">
<h2>Cara Dapatnya</h2>
<ol class="steps">
<li>Klik tombol, isi nama &amp; nomor WhatsApp.</li>
<li>Bayar Rp59.000 (transfer, e-wallet, QRIS).</li>
<li>Link aplikasi langsung dikirim. Buka di HP atau laptop, tanpa install, tanpa login.</li>
</ol>
</div></div>

<div class="sec"><div class="w">
<div class="honest"><h3 style="margin-bottom:8px">Supaya Jelas dari Awal</h3><ul>
<li>✅ Soal disusun sesuai materi kelas 6 Kurikulum Merdeka (Fase C).</li>
<li>✅ Ini latihan, <b>bukan bocoran soal</b> UAS sekolah.</li>
<li>✅ Nilai tetap tergantung latihan anak. Kami tidak menjanjikan nilai tertentu.</li>
<li>✅ Sekali bayar, tanpa biaya bulanan.</li>
</ul></div>
</div></div>

<div class="sec alt"><div class="w">
<h2>Pertanyaan yang Sering Ditanya</h2>
<details><summary>Perlu download aplikasi?</summary><p>Tidak. Cukup buka link di browser HP/laptop (Chrome, Safari). Bisa disimpan ke layar utama.</p></details>
<details><summary>320 soal cukup untuk UAS?</summary><p>Untuk 2 minggu terakhir, cukup: ±30 menit sehari sudah menyelesaikan semua paket, plus simulasi dan drill topik lemah untuk mengulang yang salah.</p></details>
<details><summary>Kurikulumnya apa?</summary><p>Kurikulum Merdeka kelas 6 (Fase C), termasuk pengulangan materi kelas 4–5 yang sering muncul di ujian.</p></details>
<details><summary>Bisa dipakai berapa anak?</summary><p>Untuk 1 keluarga. Jika kakak-adik memakai 1 HP, gunakan browser berbeda agar progres tidak tercampur.</p></details>
<details><summary>Bisa dicetak?</summary><p>Bisa cetak per paket dan ringkasan materi dari menu Cetak. Ada juga tambahan versi PDF siap cetak di halaman pembayaran.</p></details>
</div></div>

<div class="price"><div class="w">
<h2>Mulai Latihan Malam Ini</h2>
<div class="n">Rp59.000</div><p style="opacity:.85">sekali bayar · akses langsung</p>
<ul><li>✓ 320 soal + pembahasan, 4 mapel</li><li>✓ 32 paket drill + simulasi bertimer</li><li>✓ Drill topik lemah + rapor</li><li>✓ Ringkasan materi</li></ul>
<a class="cta" href="{CO}">Ya, Saya Mau Mulai ›<small>Link aplikasi langsung dikirim setelah bayar</small></a>
</div></div>
<div class="foot">© Toolkit Parenting · toolkitparenting.my.id</div>
<div class="sticky"><a class="cta" href="{CO}">Mulai Latihan · Rp59.000</a></div>
</div>'''

co = f'''{FONT}{CSS}<div class="sh">
<div class="top">⏰ UAS sudah dekat. Setelah bayar, anak bisa mulai latihan hari ini.</div>
<div class="sec" style="padding:22px 0 10px"><div class="w">
<div class="ft" style="background:#fff;border:1px solid #e3e6ee;border-radius:14px;padding:14px"><img src="{img('home')}" style="width:96px" alt=""><div><h3>Siap Ujian Kelas 6</h3><p style="font-size:14.5px">320 soal + pembahasan · 4 mapel · simulasi bertimer</p><p style="font-size:22px;font-weight:800;color:var(--nv2)">Rp59.000</p></div></div>
<ul class="list" style="font-size:15.5px;margin-top:8px">
<li>Link aplikasi <b>langsung dikirim</b> setelah pembayaran</li>
<li>Tanpa install, tanpa login, buka di HP/laptop</li>
<li>Sekali bayar, tanpa biaya bulanan</li>
</ul>
<p class="note" style="font-size:15px">Isi nomor WhatsApp yang aktif. Link aplikasi dikirim ke sana.</p>
</div></div>
</div>'''

for name, html in [('LP-halaman-1-landing.html', lp), ('LP-halaman-2-checkout.html', co)]:
    open(f'{OUT}/{name}', 'w').write(html)
    print(name, len(html) // 1024, 'KB')
