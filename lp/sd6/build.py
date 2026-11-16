# Bangun LP atas & bawah untuk dua produk kelas 6, memakai CSS/JS LP kelas 5 (pola LP TKA SMP, palet premium).
# Jalankan: python3 lp/sd6/build.py
import json, re, os
D = os.path.dirname(os.path.abspath(__file__))
A5 = open(os.path.join(D, '../sd5/lp-sd5-atas.html')).read()
B5 = open(os.path.join(D, '../sd5/lp-sd5-bawah.html')).read()
HEAD = A5[A5.index('<link'):A5.index('<style>')]
CSS_A = re.search(r'<style>(.*?)</style>', A5, re.S).group(1)
CSS_B = re.search(r'<style>(.*?)</style>', B5, re.S).group(1)
JS = re.search(r'<script>(.*?)</script>', A5, re.S).group(1)
FAQJS = re.search(r'<script>(.*?)</script>', B5, re.S).group(1)
EXTRA = ('.bs-bump{border:2px dashed #E8B04B;background:#FFF8E7;border-radius:12px;padding:12px 14px;margin:12px 0 0}'
         '.bs-bump b{color:#0F1F4A}.bs-bump .t{display:inline-block;background:#C0392B;color:#fff;font-weight:800;font-size:11px;padding:2px 7px;border-radius:5px;margin-right:6px}'
         '.bs-vs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.bs-vs div{background:#F7F9FF;border:1px solid #E5EDFF;border-radius:10px;padding:10px;font-size:13.5px}.bs-vs b{display:block;color:#0F1F4A;font-size:14px;margin-bottom:3px}')

tri = '<svg viewBox="0 0 240 210" width="200"><circle cx="110" cy="100" r="80" fill="#e0f2fe" stroke="#0369a1" stroke-width="2"/><circle cx="110" cy="100" r="3"/><line x1="110" y1="100" x2="190" y2="100" stroke="#c00" stroke-width="2"/><text x="150" y="92" font-size="14" text-anchor="middle" fill="#c00">r = 14 cm</text></svg>'
lever = '<svg viewBox="0 0 300 150" width="260"><line x1="30" y1="80" x2="270" y2="80" stroke="#78350f" stroke-width="8" stroke-linecap="round"/><rect x="32" y="44" width="36" height="34" fill="#f59e0b" stroke="#92400e"/><text x="50" y="36" font-size="11" text-anchor="middle">beban</text><polygon points="132,120 168,120 150,86" fill="#64748b"/><text x="150" y="138" font-size="11" text-anchor="middle">titik tumpu</text><line x1="250" y1="20" x2="250" y2="72" stroke="#dc2626" stroke-width="3"/><polygon points="243,64 257,64 250,76" fill="#dc2626"/><text x="250" y="14" font-size="11" text-anchor="middle" fill="#dc2626">kuasa</text></svg>'
DEMO = [
    dict(tag="Matematika · lingkaran", soal="Luas lingkaran pada gambar adalah ... (π = 22/7)" + tri, opsi=["88 cm²", "616 cm²", "308 cm²", "1.232 cm²"], jawaban=1, pembahasan="L = π × r × r = 22/7 × 14 × 14 = <b>616 cm²</b>. Jawaban: <b>B</b>."),
    dict(tag="IPA · pesawat sederhana", soal="Gambar menunjukkan tuas (pengungkit) golongan ..." + lever, opsi=["golongan 1", "golongan 2", "golongan 3", "bukan tuas"], jawaban=0, pembahasan="Titik tumpu berada di antara beban dan kuasa → <b>tuas golongan 1</b> (contoh: gunting, linggis). Jawaban: <b>A</b>."),
    dict(tag="Bahasa Indonesia · konjungsi", soal="Kata hubung yang tepat: <em>\"Rafi sudah belajar keras ___ nilainya belum memuaskan.\"</em>", opsi=["karena", "sehingga", "tetapi", "agar"], jawaban=2, pembahasan="Kalimat berisi pertentangan, jadi konjungsinya <b>tetapi</b>. Jawaban: <b>C</b>."),
    dict(tag="Bahasa Inggris · simple past", soal="Yesterday, my sister ... a new bag at the market.", opsi=["buy", "buys", "bought", "will buy"], jawaban=2, pembahasan="\"Yesterday\" = masa lampau → verb 2: buy → <b>bought</b>. Jawaban: <b>C</b>."),
]
JS2 = re.sub(r'var DEMO=\[.*?\];var idx', 'var DEMO=' + json.dumps(DEMO, ensure_ascii=False) + ';var idx', JS, count=1, flags=re.S)
assert JS2 != JS

def li(ic, b, s, tag=''):
    t = {'U': '<span class="bs-paket-tag tag-utama">Utama</span>', 'T': '<span class="bs-paket-tag tag-termasuk">Termasuk</span>', 'G': '<span class="bs-paket-tag tag-gratis">BONUS</span>'}.get(tag, '')
    return f'<li class="bs-paket-item"><span class="bs-paket-ic">{ic}</span><div class="bs-paket-body"><b>{b}</b><span>{s}</span></div>{t}</li>'
def pain(ic, s): return f'<li><span class="bs-pain-ic">{ic}</span><div class="bs-pain-body"><span>{s}</span></div></li>'

ISI_SOAL = [li('🔢', '1.000 Soal Matematika', 'Bilangan bulat, pangkat & akar, pecahan–persen, KPK–FPB, lingkaran, volume & luas permukaan, koordinat, statistika', 'U'),
            li('📖', '1.000 Soal Bahasa Indonesia', 'Ide pokok, simpulan, konjungsi, kalimat efektif, kalimat langsung, pidato–iklan–slogan, surat resmi, puisi', 'U'),
            li('🇬🇧', '1.000 Soal Bahasa Inggris', 'Simple past, future, comparison, health problems, countries, directions, reading', 'U'),
            li('🔬', '1.000 Soal IPA', 'Tata surya, gerhana, perkembangbiakan, pubertas, perubahan wujud, pesawat sederhana, listrik, lingkungan', 'U')]

P = {
 'drill': dict(
   slug='siap-ujian-kelas6', nama='Siap Ujian Kelas 6', anchor='sd6d-order', harga='89.000', hrb='89rb', coret='249.000', hemat='160.000',
   kick='Siap Ujian · SD Kelas 6 · UAS Desember',
   h1='UAS semester 1 tinggal <span style="white-space:nowrap">hitungan minggu.</span> Anak sudah <em style="white-space:nowrap">siap diuji?</em>',
   lead='Drill per topik sesuai materi UAS sekolah, 160 paket bertahap, dan 50 simulasi bertimer, 4 mapel kelas 6 lengkap pembahasan. Lanjut dipakai sampai <b>ujian akhir SD</b>.',
   stats=[('160', 'Paket drill'), ('50', 'Simulasi bertimer'), ('Rp89rb', 'Sekali bayar')], cta='Siapkan Anak Sekarang',
   m_h2='UAS awal Desember.<br><em>Latihan harus tepat sasaran.</em>',
   pains=[pain('⏳', 'UAS tinggal beberapa minggu, tapi <b>belum tahu harus mulai latihan dari mana</b>'), pain('😰', 'Anak <b>belum terbiasa mengerjakan 40 soal dengan waktu terbatas</b>'), pain('🤔', 'Sudah latihan banyak soal, tapi <b>tidak tahu topik mana yang masih lemah</b>'), pain('💸', 'Bimbel intensif kelas 6 bisa <b>ratusan ribu per bulan</b>')],
   kalau=[pain('→', 'Anak panik saat ujian karena belum pernah latihan dengan waktu terbatas'), pain('→', 'Waktu habis untuk mengulang topik yang sudah dikuasai, yang lemah malah terlewat'), pain('→', 'Nilai tidak mencerminkan kemampuan aslinya hanya karena kurang terbiasa'), pain('→', 'Nilai rapor semester 1 kurang, padahal kelas 6 jadi bekal masuk SMP')],
   note='Yang membuat anak siap bukan jumlah jam belajar, tapi <b>latihan bertahap, simulasi rutin, dan menambal topik yang lemah</b>.',
   s_h2='Drill bertahap, simulasi ujian,<br><em>lalu tambal yang lemah.</em>',
   s_lead='Mulai dari paket dasar, naik ke menengah dan HOTS. Tiap akhir pekan, simulasi 40 soal 60 menit. Setelah itu, aplikasi otomatis memberi drill dari topik dengan nilai terendah.',
   sol=[li('📚', 'Drill per topik sesuai materi UAS', 'Pilih topik yang diujikan sekolah, 15 soal per latihan'), li('📅', 'Hitung mundur ke hari ujian', 'Isi tanggal UAS, aplikasi memberi target paket per hari'), li('📦', '160 paket drill bertahap', 'Paket 1–14 dasar, 15–28 menengah, 29–40 HOTS · 25 soal per paket'), li('⏱️', '50 simulasi ujian bertimer', '40 soal, 60 menit, pembahasan muncul setelah dikumpulkan'), li('🎯', 'Drill topik lemah otomatis', '10 soal dari 3 topik dengan nilai terendah'), li('📊', 'Rapor & riwayat simulasi', 'Lihat perkembangan nilai dari minggu ke minggu'), li('💾', 'Bisa dicicil', 'Jawaban tersimpan otomatis, lanjutkan kapan saja')],
   isi_extra=[li('📦', '160 paket drill + 50 simulasi', 'Tersusun dari dasar sampai HOTS, termasuk simulasi campuran 4 mapel', 'T'), li('📘', '37 bab ringkasan materi kelas 6', 'Dibaca sebelum drill, bisa dicetak', 'T')],
   langkah3=('Drill tiap hari, simulasi tiap pekan', '1–2 paket per hari, 1 simulasi bertimer di akhir pekan, lalu drill topik lemah.'),
   rows=[('4.000 soal + pembahasan tiap nomor', '129.000'), ('160 paket drill + 50 simulasi bertimer', '69.000'), ('Drill topik lemah + rapor + hitung mundur', '51.000')],
   bul=['4.000 soal 4 mapel kelas 6 + pembahasan', '160 paket drill: dasar → menengah → HOTS', '50 simulasi 40 soal / 60 menit', 'Drill topik lemah otomatis + rapor', 'Dibuka di HP, tablet, laptop · akses selamanya'],
   bump='<b><span class="t">TAMBAHAN +Rp20.000</span>PDF siap cetak</b><br><span style="font-size:13.5px">5 file PDF: <b>40 paket drill per mapel</b> (4 file, 1.000 soal per file) + <b>10 simulasi ujian campuran</b> (400 soal + pembahasan). Tinggal print, kerjakan di kertas seperti ujian sungguhan. Centang di form pemesanan.</span>',
   cmp=('Bimbel intensif 3 bulan: <b>±Rp1–2 juta</b>', 'Paket ini: 160 drill + 50 simulasi, <b>hanya Rp89.000</b>', 'Kurang dari Rp1.000 per hari sampai hari ujian.'),
   close=('Mulai drill selagi masih ada waktu.', 'Pakai untuk UAS Desember, lanjutkan sampai ujian akhir SD. Sekali bayar.'),
   faq=[('Bisa dipakai untuk UAS/PAS semester 1?', 'Bisa. Buka <b>📚 Drill per Topik</b>, lalu pilih topik yang diujikan di sekolah anak (lihat kisi-kisi atau buku paketnya). Setelah UAS, aplikasi tetap dipakai untuk semester 2 dan ujian akhir SD.'), ('Bedanya dengan Les di Rumah Kelas 6?', 'Siap Ujian dirancang untuk <b>persiapan menjelang ujian</b>: paket drill, simulasi bertimer, hitung mundur, dan drill topik lemah. Les di Rumah dirancang untuk <b>latihan rutin harian</b> sepanjang tahun (100 hari). Bank soalnya sama-sama kelas 6, jadi cukup pilih salah satu sesuai kebutuhan.'),
        ('Apakah ini soal asli ujian atau bocoran?', 'Bukan. Ini soal latihan yang kami susun mengikuti materi kelas 6 Kurikulum Merdeka, ditambah pengulangan materi kelas 4–5 yang sering keluar. Bentuk soal ujian di tiap daerah/sekolah bisa berbeda.'),
        ('Ujian anak saya tinggal 1 bulan. Masih sempat?', 'Bisa. Isi tanggal ujian, lalu ikuti target paket per hari. Prioritaskan simulasi campuran dan drill topik lemah.'),
        ('Apa isi PDF tambahan Rp20.000?', '5 file PDF siap cetak: 40 paket drill tiap mapel (4 file) dan 10 simulasi ujian campuran dengan pembahasan. Cocok bila anak lebih fokus mengerjakan di kertas.'),
        ('Perlu instal aplikasi atau bayar bulanan?', 'Tidak. Dibuka di browser HP, tablet, atau laptop. Sekali bayar, akses selamanya untuk 1 keluarga.'),
        ('Bagaimana cara mengaksesnya?', 'Setelah bayar, Anda menerima email berisi link halaman member. Di sana ada tombol membuka aplikasi dan kode akses.')]),
 'harian': dict(
   slug='les-di-rumah-kelas6', nama='Les di Rumah Kelas 6', anchor='sd6h-order', harga='99.000', hrb='99rb', coret='299.000', hemat='200.000',
   kick='Les di Rumah · SD Kelas 6 · 4 Mapel',
   h1='Kelas 6 jangan tunggu <span style="white-space:nowrap">menjelang ujian.</span> Mulai <em style="white-space:nowrap">40 menit sehari</em> dari&nbsp;sekarang.',
   lead='4.000 soal kelas 6 untuk Matematika, Bahasa Indonesia, Bahasa Inggris & IPA, lengkap pembahasan. Anak latihan sendiri dari HP, <b>langsung dikoreksi & dibahas</b>.',
   stats=[('4.000', 'Soal + pembahasan'), ('100', 'Hari program'), ('Rp99rb', 'Sekali bayar')], cta='Mulai Les di Rumah',
   m_h2='Kelas 6 penentu.<br><em>Belajar mepet bikin anak tertekan.</em>',
   pains=[pain('💸', 'Les kelas 6 bisa <b>Rp400–900 ribu per bulan</b>, padahal anak cuma bertemu guru 2 kali seminggu'), pain('😰', 'Materi makin sulit: <b>lingkaran, volume tabung, bilangan bulat</b>, dan orang tua sudah lupa caranya'), pain('📚', '<b>Tidak ada latihan rutin di rumah</b>, belajar hanya saat ada PR atau ulangan'), pain('😔', 'Baru serius belajar <b>sebulan sebelum ujian</b>, anak jadi stres')],
   kalau=[pain('→', 'Materi menumpuk dan harus dikejar dalam waktu singkat menjelang ujian'), pain('→', 'Anak kelelahan dan kehilangan percaya diri'), pain('→', 'Biaya bimbel intensif di akhir tahun jauh lebih mahal'), pain('→', 'Anda menyesal: <em>"harusnya dari awal kelas 6 dibiasakan latihan."</em>')],
   note='Persiapan terbaik untuk ujian adalah <b>latihan sedikit tapi rutin sejak awal kelas 6</b>, bukan belajar mati-matian di akhir.',
   s_h2='Les di rumah yang rutin,<br><em>dikoreksi & dibahas otomatis.</em>',
   s_lead='10 soal per mapel tiap hari, langsung tahu benar/salah, lalu baca pembahasannya. Anda cukup cek rapor di akhir pekan.',
   sol=[li('📋', 'Materi kelas 6 Kurikulum Merdeka', 'Ditambah pengulangan kelas 4–5 yang sering keluar di ujian'), li('💡', 'Pembahasan tiap nomor', 'Anak paham alasannya sendiri'), li('📈', 'Level naik 2 kali', 'Hari 1–35 dasar, 36–70 menengah, 71–100 HOTS'), li('📊', 'Rapor topik lemah', 'Bantuan Anda jadi tepat sasaran'), li('📱', 'Buka dari HP', 'Tanpa instal aplikasi'), li('💾', 'Bisa dicicil', 'Jawaban tersimpan otomatis, lanjutkan dari soal terakhir')],
   isi_extra=[li('📊', 'Rapor topik lemah + ulang soal salah', 'Hitungan hari beruntun untuk motivasi anak', 'T'), li('📘', '37 bab ringkasan materi kelas 6', 'Bisa dibaca & dicetak', 'T')],
   langkah3=('40 menit sehari, 4 mapel', 'Anak mengerjakan 10 soal per mapel, langsung dikoreksi & dibahas. Anda cek rapor di akhir pekan.'),
   rows=[('4.000 soal interaktif + pembahasan', '149.000'), ('Program 100 hari + rapor topik lemah', '89.000'), ('37 bab ringkasan materi', '61.000')],
   bul=['4.000 soal 4 mapel kelas 6 + pembahasan', 'Level naik 2 kali: dasar → menengah → HOTS', 'Rapor topik lemah, ulang soal salah, hari beruntun', 'Jawaban tersimpan otomatis, bisa dicicil', 'Dibuka di HP, tablet, laptop · akses selamanya'],
   bump='<b><span class="t">TAMBAHAN +Rp20.000</span>PDF siap cetak</b><br><span style="font-size:13.5px">4 file PDF lembar latihan <b>100 hari per mapel</b> (1.000 soal per file) + kunci jawaban. Tinggal print, anak bisa mengerjakan di kertas tanpa layar. Centang di form pemesanan.</span>',
   cmp=('Les/bimbel 3 bulan: <b>±Rp1,5–2,5 juta</b>', 'Paket ini: 4.000 soal + pembahasan, ±3 bulan, <b>hanya Rp99.000</b>', 'Cuma ±Rp1.000 per hari, kurang dari uang jajan anak.'),
   close=('Mulai rutinitas belajar kelas 6 minggu ini.', '40 menit sehari, 4 mapel, langsung dikoreksi dan dibahas.'),
   faq=[('Bedanya dengan Siap Ujian Kelas 6?', 'Les di Rumah dirancang untuk <b>latihan rutin harian</b> (100 hari, 10 soal per mapel per hari). Siap Ujian dirancang untuk <b>drill menjelang ujian</b> (paket drill, simulasi bertimer, hitung mundur). Bank soalnya sama-sama kelas 6, jadi cukup pilih salah satu sesuai kebutuhan.'),
        ('Saya sudah lupa materi kelas 6. Tetap bisa dipakai?', 'Bisa. Setiap soal punya pembahasan yang ditulis untuk dibaca anak sendiri, plus 37 bab ringkasan materi.'),
        ('Materinya sesuai kurikulum sekolah?', 'Disusun mengikuti materi kelas 6 Kurikulum Merdeka, ditambah pengulangan kelas 4–5. Urutan bab di sekolah bisa berbeda.'),
        ('Apa isi PDF tambahan Rp20.000?', '4 file PDF siap cetak berisi lembar latihan 100 hari per mapel beserta kunci jawaban. Cocok bila anak lebih suka mengerjakan di kertas.'),
        ('Perlu instal aplikasi atau bayar bulanan?', 'Tidak. Dibuka di browser HP, tablet, atau laptop. Sekali bayar, akses selamanya untuk 1 keluarga.'),
        ('Bagaimana cara mengaksesnya?', 'Setelah bayar, Anda menerima email berisi link halaman member. Di sana ada tombol membuka aplikasi dan kode akses.')]),
}
def build(c):
    stat = ''.join(f'<div class="bs-stat"><div class="num">{n}</div><div class="lbl">{l}</div></div>' for n, l in c['stats'])
    rows = ''.join(f'<div class="bs-price-row"><span class="name">{n}</span><span class="check"><s style="opacity:.6">Rp{v}</s></span></div>' for n, v in c['rows'])
    bul = ''.join(f'<li><span class="chk">✓</span>{b}</li>' for b in c['bul'])
    a, b, k = c['cmp']
    atas = f'''<!-- LP ATAS — {c['nama'].upper()} — tempel SEBELUM form Scalev -->{HEAD}<style>{CSS_A}{EXTRA}</style><div class="bs">
<div class="bs-nav"><div class="bs-nav-brand"><strong>ToolkitParenting</strong></div><a href="#{c['anchor']}" class="bs-nav-cta">Dapatkan — Rp{c['hrb']}</a></div>
<div class="bs-hero"><span class="bs-kick bs-kick-mark">{c['kick']}</span><h1 class="bs-h1">{c['h1']}</h1><p class="bs-lead dim">{c['lead']}</p><p class="bs-trustline">Disusun mengikuti materi kelas 6 Kurikulum Merdeka Fase C</p>
<div class="bs-stat-row">{stat}</div><a href="#{c['anchor']}" class="bs-btn" style="margin-top:12px">{c['cta']}<span class="bs-cta-price"><s>Rp{c['coret']}</s> Rp{c['harga']}</span></a></div><div class="bs-divider"></div>
<div class="bs-sec bs-white"><span class="bs-kick bs-kick-navy">Masalahnya</span><h2 class="bs-h2">{c['m_h2']}</h2><p class="bs-lead">Yang sering dirasakan orang tua kelas 6.</p><ul class="bs-pain-list">{''.join(c['pains'])}</ul></div>
<div class="bs-sec bs-paper"><span class="bs-kick bs-kick-navy">Kalau dibiarkan</span><ul class="bs-pain-list">{''.join(c['kalau'])}</ul><div class="bs-level-note">{c['note']}</div></div><div class="bs-divider"></div>
<div class="bs-sec bs-white"><span class="bs-kick bs-kick-mark">Solusinya</span><h2 class="bs-h2">{c['s_h2']}</h2><p class="bs-lead">{c['s_lead']}</p><ul class="bs-paket-list">{''.join(c['sol'])}</ul></div><div class="bs-divider"></div>
<div class="bs-sec bs-dark"><h2 class="bs-h2 white">Ini bukan kumpulan soal <em>asal banyak.</em></h2><ul class="bs-pain-list" style="margin-top:9px"><li><div class="bs-pain-body"><span style="color:rgba(255,255,255,.78)">4.000 soal baru khusus kelas 6, tersusun dari dasar sampai HOTS</span></div></li><li><div class="bs-pain-body"><span style="color:rgba(255,255,255,.78)">Soal bergambar: lingkaran, tabung, prisma, koordinat, diagram lingkaran, tata surya, tuas</span></div></li><li><div class="bs-pain-body"><span style="color:rgba(255,255,255,.78)">Jujur: alat latihan, bukan soal ujian asli dan bukan jaminan nilai</span></div></li></ul></div><div class="bs-divider"></div>
<div class="bs-sec bs-white"><span class="bs-kick bs-kick-navy">Isi paket</span><h2 class="bs-h2">Semua yang dibutuhkan anak <em>kelas 6.</em></h2><ul class="bs-paket-list">{''.join(ISI_SOAL + c['isi_extra'])}</ul></div><div class="bs-divider"></div>
<div class="bs-sec bs-paper"><span class="bs-kick bs-kick-navy">Coba sendiri</span><h2 class="bs-h2">Rasakan cara <em>anak berlatih di sini.</em></h2><p class="bs-lead">4 contoh soal kelas 6, satu dari tiap mapel. Pilih jawaban, lalu lihat pembahasannya.</p>
<div class="bs-sample" id="demo"><div class="bs-sample-bar"><div class="bs-sample-steps" id="dsteps"></div><div class="bs-sample-count" id="dcount">Soal 1 dari 4</div></div><div id="demoStage"></div><div class="bs-done" id="demoDone"><div class="big">Nah, begitu rasanya.</div><div class="sc" id="doneScore"></div><a href="#{c['anchor']}" class="bs-btn">Ambil 4.000 soal lengkap →</a></div></div></div><div class="bs-divider"></div>
<div class="bs-sec bs-white"><span class="bs-kick bs-kick-navy">Cara pakai</span><h2 class="bs-h2">Tiga langkah. <em>Tanpa antar-jemput.</em></h2><ul class="bs-paket-list">{li('1️⃣', 'Isi data & selesaikan pembayaran', 'Link halaman member dikirim ke email setelah pembayaran selesai.')}{li('2️⃣', 'Buka aplikasi & masukkan kode', 'Klik link aplikasi di halaman member, masukkan kode akses, isi nama anak.')}{li('3️⃣', *c['langkah3'])}</ul></div><div class="bs-divider"></div>
<div class="bs-sec bs-paper" id="{c['anchor']}"><span class="bs-kick bs-kick-mark">Dapatkan sekarang</span><h2 class="bs-h2">Semua ini, <em>dalam satu paket.</em></h2>
<div class="bs-price-card"><div class="bs-price-head"><div class="bs-price-head-lbl">✦ {c['nama']}</div><div class="bs-price-head-sub">{c['kick'].split(' · ')[-1]}</div></div>
<div class="bs-price-amount"><div class="bs-price-old">Rp{c['coret']}</div><div class="bs-price-now"><span class="rp">Rp</span><span class="amt">{c['harga']}</span></div><div class="bs-price-note">sekali bayar, bukan langganan</div><div class="bs-hemat">Hemat Rp{c['hemat']}</div></div>
<div class="bs-price-detail">{rows}</div><div class="bs-price-bullets"><ul>{bul}</ul></div>
<div class="bs-price-footer"><div class="a1">{a}</div><div class="vs">vs</div><div class="a2">{b}</div><div class="a3">{k}</div></div></div>
<div class="bs-bump">{c['bump']}</div>
<div style="text-align:center;padding:16px 10px 30px"><div style="font-size:16px;font-weight:700;color:#0F1F4A;margin-bottom:4px">👇 Isi data di bawah untuk mendapatkan&nbsp;akses</div><div style="font-size:14px;color:#5A5548;line-height:1.5">Link halaman member (berisi aplikasi & kode akses) dikirim ke email setelah pembayaran&nbsp;selesai.</div></div></div>
</div><script>{JS2}</script><!-- END LP ATAS -->'''
    fq = ''.join(f'<div class="bs-faq-item{" open" if i == 0 else ""}"><button class="bs-faq-q">{q}</button><div class="bs-faq-a">{x}</div></div>' for i, (q, x) in enumerate(c['faq']))
    ct, cs = c['close']
    bawah = f'''<!-- LP BAWAH — {c['nama'].upper()} — tempel SETELAH form Scalev -->{HEAD}<style>{CSS_B}</style><div class="bs bs2"><div class="bs-divider"></div>
<div class="bs-sec bs-white"><span class="bs-kick bs-kick-navy">Pertanyaan umum</span><h2 class="bs-h2">Sering ditanyakan <em>orang tua.</em></h2><p class="bs-lead" style="margin-bottom:10px">Jawaban jujur, tanpa berlebihan.</p>{fq}</div><div class="bs-divider"></div>
<div class="bs-sec bs-paper"><div class="bs-honest"><strong>Catatan jujur.</strong>{c['nama']} adalah alat bantu latihan mandiri untuk siswa SD kelas 6. Materi disusun mengikuti Kurikulum Merdeka Fase C kelas 6 dan pengulangan kelas 4–5. Bukan soal ujian sebenarnya, bukan prediksi, dan bukan jaminan nilai. Lisensi untuk penggunaan pribadi 1&nbsp;keluarga.</div></div><div class="bs-divider"></div>
<div class="bs-sec bs-dark bs-footer-cta"><span class="bs-kick bs-kick-dark">Mulai minggu ini</span><h2 class="bs-h2 white" style="margin-bottom:7px">{ct}</h2><p>{cs}</p><a href="#{c['anchor']}" class="bs-btn">Dapatkan Paket — Rp{c['harga']}<small>Akses dikirim ke email setelah pembayaran</small></a></div>
<div class="bs-footer-bar"><div class="bs-footer-brand"><span>T</span> ToolkitParenting</div><div class="bs-footer-note">© ToolkitParenting · Dibuat untuk membantu anak Indonesia belajar.<br>Bukan afiliasi resmi Kemendikdasmen; kurikulum disebut sebagai acuan penyusunan materi.<br>Pembayaran diproses aman via Scalev.</div></div></div><script>{FAQJS}</script><!-- END LP BAWAH -->'''
    for nm, html in [('atas', atas), ('bawah', bawah)]:
        p = os.path.join(D, f"lp-{c['slug']}-{nm}.html"); open(p, 'w').write(html); print(p.split('/')[-1], len(html.encode()) // 1024, 'KB')
for c in P.values(): build(c)
