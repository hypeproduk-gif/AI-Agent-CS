from lib import *

# ---------- COVER ----------
page('cream', '', f'<div class="cover pg-cover">{img("cover.jpg","full")}<div class="ribbon">Sistem 45 menit &bull; Workbook untuk ibu bekerja</div></div>', num=False, cls='cover')

# ---------- LISENSI ----------
page('cream', '', f'''
<div class="lic">
<span class="logowrap">{img("logo.png","logo")}</span>
<h1>Produk Original ToolkitParenting</h1>
<p>Terima kasih sudah membeli <b>Pagi Tanpa Drama</b> langsung dari ToolkitParenting. File ini adalah produk digital original dan dilisensikan untuk <b>penggunaan pribadi</b> pembeli.</p>
<div class="two">
<div class="ok"><b class="h">Boleh</b>{ul(["Dibaca dari HP, tablet, atau laptop milikmu","Dicetak untuk dipakai sendiri dan keluarga di rumah","Diisi, ditempel, dan dipakai berulang kali"])}</div>
<div class="no"><b class="h">Dilarang</b>{ul(["Membagikan atau mengirim file ini ke orang lain, termasuk lewat grup WhatsApp, Telegram, atau Google Drive","Menjual ulang, baik file maupun hasil cetaknya","Mengubah, menyalin isi, atau mengaku sebagai karya sendiri","Mengunggah ke situs, marketplace, atau media sosial"])}</div>
</div>
<p>Isi, desain, dan ilustrasi di dalam workbook ini dilindungi Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta.</p>
<p>Kalau ada teman yang tertarik, arahkan saja untuk membeli versi originalnya. Setiap pembelian membantu kami terus membuat alat bantu praktis untuk orang tua Indonesia.</p>
<p class="small">Mendapatkan file ini bukan dari ToolkitParenting? Kemungkinan itu salinan tidak resmi.<br>&copy; 2026 ToolkitParenting. Hak cipta dilindungi.</p>
</div>''', num=True, cls='lic')

# ---------- HALO MAMI ----------
page('cream', 'Pembuka', f'''
{hero("hero-halo.jpg")}
<p>Kalau kamu membuka buku ini, kemungkinan besar pagimu sedang tidak mudah.</p>
<p>Bangun paling awal, mengurus anak, menyiapkan sarapan dan bekal, bersiap kerja, lalu berangkat sambil berharap tidak telat. Dan sering kali, di tengah semua itu, ada suara yang naik, ada anak yang menangis, dan ada rasa bersalah yang ikut terbawa sampai kantor.</p>
<p>Buku ini ditulis untuk ibu yang bekerja dan juga memegang banyak urusan rumah. Isinya bukan teori panjang, dan bukan nasihat untuk jadi ibu yang lebih sabar. Isinya adalah <b>sistem sederhana yang bisa diulang</b>: apa yang disiapkan malam hari, urutan pagi yang jelas, cara menggerakkan anak tanpa harus terus mengulang instruksi, dan rencana cadangan untuk hari-hari yang meleset.</p>
<div class="card y"><div class="ct">Satu hal perlu dikatakan sejak awal</div>
<p><b>Buku ini tidak menjanjikan pagi yang sempurna.</b> Anak tetap akan ada hari rewelnya. Alarm tetap bisa terlewat. Yang kita bangun adalah pagi yang lebih teratur, dan cara untuk kembali ke jalur setelah hari yang berantakan.</p></div>
<p>Kamu tidak perlu mengubah semuanya sekaligus. Satu perbaikan kecil yang berjalan sudah merupakan kemajuan.</p>
<div class="bigmsg" style="margin-top:4mm">Pagi bukan soal anak <em>lambat</em>.<br>Sistemnya yang <em>belum ada</em>.</div>
''')

# ---------- CARA PAKAI + ISI BUKU ----------
page('cream', 'Cara memakai & isi buku', f'''
{h2("Cara Memakai Buku Ini")}
<ol>
<li><b>Mulai dari Kuis di halaman berikutnya.</b> Kuis ini menunjukkan sumber kekacauan pagi yang paling sering terjadi di rumahmu, dan bab mana yang perlu dibaca lebih dulu.</li>
<li><b>Baca sesuai kebutuhan, tidak harus berurutan.</b> Kalau waktumu terbatas, langsung ke bab yang disarankan hasil kuismu.</li>
<li><b>Kerjakan Aksi Hari Ini di setiap akhir bab.</b> Aksi inilah yang mengubah isi buku jadi kebiasaan. Satu aksi kecil lebih berguna daripada satu bab yang dibaca lalu dilupakan.</li>
<li><b>Pakai bagian yang siap pakai.</b> Ada checklist, template, skrip, dan tabel yang bisa langsung diisi. Cetak halaman yang kamu perlukan, atau isi langsung di PDF.</li>
<li><b>Cetak bonus printable.</b> Di bagian akhir ada empat bonus: chart rutinitas anak, checklist malam untuk ditempel di kulkas, 30 ide sarapan dan bekal, serta tracker 7 hari.</li>
<li><b>Bingung mulai dari mana? Ikuti Challenge 7 Hari di Bab 7.</b> Challenge ini merangkum seluruh isi buku jadi satu perbaikan per hari selama seminggu.</li>
</ol>
{h2("Isi Buku")}
<div class="part"><div class="pl c1">Mulai dari sini<small>Kuis &amp; peta cepat</small></div><div class="pr"><b>Kuis tipe kekacauan pagi &bull; Peta cepat "pagimu begini, buka bab ini"</b></div></div>
<div class="part"><div class="pl c2">1 &bull; Siapkan<small>Malam hari</small></div><div class="pr"><b>Bab 1 Kenapa Pagi Selalu Kacau</b>5 sumber kekacauan &bull; catatan pagi pertama<br><b>Bab 2 Kuncinya Ada di Malam Sebelumnya</b>Checklist malam 15 menit &bull; Stasiun Siap Berangkat</div></div>
<div class="part"><div class="pl c4">2 &bull; Jalankan<small>Pagi hari</small></div><div class="pr"><b>Bab 3 Timeline 45 Menit</b>Timeline balita, anak SD, dua anak &bull; template timeline<br><b>Bab 4 Membuat Anak Bergerak Tanpa Teriak</b>Chart rutinitas &bull; skrip pengganti teriak &bull; trik transisi</div></div>
<div class="part"><div class="pl c3">3 &bull; Cadangan<small>Kalau ada yang meleset</small></div><div class="pr"><b>Bab 5 Rencana B</b>Anak rewel &bull; sakit ringan &bull; telat bangun &bull; pengasuh izin &bull; Pagi Darurat 20 Menit<br><b>Bab 6 Libatkan Suami</b>Pilihan tugas tetap &bull; template pembagian tugas</div></div>
<div class="part"><div class="pl c5">4 &bull; Mulai<small>Satu perbaikan per hari</small></div><div class="pr"><b>Bab 7 Challenge 7 Hari</b>Satu perbaikan per hari &bull; tracker</div></div>
<div class="part"><div class="pl c1">+ Bonus<small>Siap cetak</small></div><div class="pr"><b>4 printable</b>Chart anak &bull; checklist kulkas &bull; 30 ide sarapan &amp; bekal &bull; tracker 7 hari</div></div>
<p class="center big" style="margin-top:3mm"><b>Siap? Ambil pulpen, dan mari mulai dari kuis.</b></p>
''')

# ---------- KUIS ----------
page('peach', 'Mulai dari sini · Kuis', f'''
<div class="bigmsg" style="font-size:19pt;margin-bottom:1mm">Kuis: apa tipe <em>kekacauan</em> pagimu?</div>
<p>Jawab jujur, berdasarkan pagi-pagi di dua minggu terakhir. Lingkari satu jawaban yang paling mendekati.</p>
<div class="qz"><b class="q">1. Jam 6 pagi, yang paling sering kamu lakukan adalah...</b><div>A. Mikir mau masak/siapkan apa untuk sarapan dan bekal<br>B. Mencari barang yang kemarin entah ditaruh di mana<br>C. Tergantung hari, tidak ada pola tetap<br>D. Membangunkan anak berkali-kali<br>E. Pagiku lumayan lancar, sampai ada yang meleset</div></div>
<div class="qz"><b class="q">2. Kalau telat, biasanya karena...</b><div>A. Kelamaan memutuskan sesuatu<br>B. Ada barang yang hilang<br>C. Aku sendiri belum siap waktu anak sudah siap (atau sebaliknya)<br>D. Anak lama sekali di satu langkah<br>E. Ada kejadian di luar rencana</div></div>
<div class="qz"><b class="q">3. Kalimat yang paling sering keluar dari mulutmu di pagi hari...</b><div>A. "Hari ini mau apa ya?"<br>B. "Di mana sih ...?"<br>C. "Eh, tadi aku sampai mana?"<br>D. "Ayo cepat, ayo, ayo!"<br>E. "Aduh, kenapa harus hari ini?"</div></div>
<div class="qz"><b class="q">4. Malam hari sebelum tidur, biasanya...</b><div>A. Belum kepikiran soal besok pagi<br>B. Barang-barang masih tersebar di mana-mana<br>C. Kadang siap-siap, kadang tidak<br>D. Anak tidurnya larut atau jamnya berubah-ubah<br>E. Sudah siap, tapi tidak ada rencana kalau ada yang berubah</div></div>
<div class="qz"><b class="q">5. Kalau pagimu bisa diperbaiki satu hal saja, kamu pilih...</b><div>A. Tidak perlu mikir lagi di pagi hari<br>B. Semua barang siap di satu tempat<br>C. Punya urutan yang jelas<br>D. Anak bisa jalan sendiri tanpa disuruh terus<br>E. Punya rencana cadangan yang siap pakai</div></div>
<p style="margin-top:3mm"><b>Hitung jawabanmu.</b> Huruf yang paling banyak adalah tipe utama kekacauan pagimu. Kalau ada dua huruf yang sama banyak, berarti kamu punya dua tipe, dan itu sangat wajar.</p>
{tbl(["A","B","C","D","E"],[["&nbsp;","&nbsp;","&nbsp;","&nbsp;","&nbsp;"]],"fill tall")}
''')

# ---------- HASIL KUIS ----------
page('peach', 'Mulai dari sini · Hasil kuis', f'''
{h2("Hasil Kuis")}
<div class="hasil"><div class="L">A</div><div><div class="ct">Paling banyak A: Tipe "Mikir di Tempat"</div>Pagimu habis untuk memutuskan. Kamu sebenarnya cekatan, tapi tenagamu terkuras sebelum sempat bergerak.<em>Bab yang paling membantumu: Bab 2 dan Bonus 3 (30 Ide Sarapan dan Bekal 5 Menit).</em></div></div>
<div class="hasil"><div class="L">B</div><div><div class="ct">Paling banyak B: Tipe "Cari-cari Barang"</div>Waktumu bocor sedikit demi sedikit karena barang tidak punya "rumah" tetap.<em>Bab yang paling membantumu: Bab 2, terutama bagian Stasiun Siap Berangkat.</em></div></div>
<div class="hasil"><div class="L">C</div><div><div class="ct">Paling banyak C: Tipe "Tanpa Urutan"</div>Pagimu bisa jalan, tapi selalu terasa berantakan karena setiap hari urutannya berbeda.<em>Bab yang paling membantumu: Bab 3 (Timeline 45 Menit).</em></div></div>
<div class="hasil"><div class="L">D</div><div><div class="ct">Paling banyak D: Tipe "Remote Control"</div>Kamu jadi penggerak untuk setiap langkah anak, dan itu yang paling menguras emosi.<em>Bab yang paling membantumu: Bab 4 dan Bonus 1 (Chart Rutinitas Pagi Anak).</em></div></div>
<div class="hasil"><div class="L">E</div><div><div class="ct">Paling banyak E: Tipe "Rapuh Saat Meleset"</div>Kamu sudah punya dasar yang cukup baik. Yang belum ada adalah jaring pengaman.<em>Bab yang paling membantumu: Bab 5 (Rencana B).</em></div></div>
{tip("Tipe ini bukan label untuk dirimu, Mami. Ini hanya peta untuk tahu harus mulai memperbaiki dari mana. Semua bab tetap berguna, tapi kamu tidak harus mengerjakan semuanya sekaligus.")}
{h2("Satu Hal yang Perlu Kamu Pegang")}
<p>Buku ini tidak menjanjikan pagi yang sempurna. Masih akan ada hari anak menangis karena kaus kakinya "rasanya aneh". Masih akan ada hari kamu telat.</p>
<p>Yang kita bangun adalah <b>pagi yang lebih teratur, dengan sistem yang bisa diulang.</b> Jadi saat ada hari yang berantakan, kamu tidak mulai dari nol lagi keesokan harinya. Target yang realistis: lebih banyak pagi yang lancar daripada yang kacau. Itu sudah kemenangan besar.</p>
''')

# ---------- PETA CEPAT ----------
page('peach', 'Mulai dari sini · Peta cepat', f'''
{h2("Peta Cepat: Pagimu Begini, Buka Ini")}
<p>Tidak perlu membaca berurutan. Cari momen yang paling sering terjadi di rumahmu, lalu langsung buka bagiannya.</p>
{tbl(["Kalau pagimu terasa begini...","Langsung buka"],[
["Mengulang instruksi yang sama 3&ndash;5 kali sebelum anak bergerak","<b>Bab 4</b> Chart Rutinitas &bull; Bonus 1"],
["Jam 06.30 masih cari kaus kaki sebelah, kunci, botol minum","<b>Bab 2</b> Stasiun Siap Berangkat"],
["Jam 05.30 berdiri di depan kulkas, bingung bekal dan sarapan","<b>Bab 2</b> Checklist Malam &bull; Bonus 3"],
["Suara naik, lalu rasa bersalah ikut berangkat kerja","<b>Bab 4</b> Skrip Pengganti Teriak"],
["Jam sudah 06.45, anak belum mandi, kamu baru mulai bersiap","<b>Bab 3</b> Timeline 45 Menit &bull; Mami Siap Duluan"],
["Dua anak beda usia, semuanya minta dibantu bersamaan","<b>Bab 3</b> Timeline Dua Anak Beda Usia"],
["Pengasuh/ART izin mendadak, atau anak kurang sehat pagi ini","<b>Bab 5</b> Rencana B #2 dan #4"],
["Alarm terlewat, sisa waktu cuma 20 menit","<b>Bab 5</b> Pagi Darurat 20 Menit"],
["Semuanya mengandalkan kamu, suami mau bantu tapi bingung mulai dari mana","<b>Bab 6</b> Satu Tugas Tetap untuk Suami"],
["Mau mulai, tapi bingung dari mana","<b>Bab 7</b> Challenge 7 Hari"],
],"",['62%','38%'])}
{aksi("Mulai dari hal paling kecil: pilih satu baris di atas", p("Lingkari satu baris yang paling sering terjadi di pagimu. Buka bagiannya malam ini, kerjakan Aksi Hari Ini di akhir bab, lalu lanjut ke bab berikutnya kalau sudah terasa ringan."))}
''')

# ---------- BAB 1 ----------
page('peach', 'Bagian 1 · Siapkan · Bab 1', f'''
{hero("bab1.jpg")}
<p>Jam 06.10. Kamu sudah bangun dari setengah enam, tapi entah kenapa jam 06.50 kamu masih mencari kaus kaki sebelah, si kecil belum mau pakai baju, bekal belum ditutup, dan suaramu sudah naik satu oktaf.</p>
<p>Lalu di motor atau di mobil, kamu diam. Ada rasa bersalah yang ikut berangkat kerja bareng kamu.</p>
<p>Kalau itu terdengar familiar, Mami, kamu tidak sendirian. Dan yang lebih penting: <b>pagi yang kacau hampir tidak pernah soal kamu kurang sabar atau kurang pintar mengatur.</b> Biasanya soal sistem yang belum ada, atau sistem yang belum cocok dengan kondisi rumahmu.</p>
<p>Kabar baiknya, sistem bisa dibangun. Pelan-pelan, satu bagian demi satu bagian. Tapi sebelum membangun, kita perlu tahu dulu apa yang sebenarnya bikin pagimu berantakan. Karena solusi untuk pagi yang "telat bangun" beda dengan solusi untuk pagi yang "anaknya susah digerakkan".</p>
{h2("5 Sumber Kekacauan Pagi")}
<p>Dari cerita banyak ibu bekerja, kekacauan pagi biasanya datang dari lima sumber ini. Sering kali lebih dari satu sekaligus.</p>
<div class="src">{img("ic-lemari.png")}<div><span class="n">1.</span> <b>Keputusan yang Ditunda ke Pagi</b><br>Mau pakai baju apa, bekal isinya apa, sarapan apa, bawa payung atau tidak. Setiap keputusan kecil makan waktu dan tenaga, dan di pagi hari keputusan kecil ini menumpuk jadi besar.<em>Tandanya: kamu sering berdiri di depan lemari atau kulkas sambil berpikir, "Hmm, apa ya?"</em></div></div>
''')

page('peach', 'Bagian 1 · Siapkan · Bab 1', f'''
<div class="src">{img("ic-barang.png")}<div><span class="n">2.</span> <b>Barang yang Tidak Ada di Tempatnya</b><br>Sepatu sebelah, kunci motor, botol minum, buku PR, ID card kantor. Mencari barang adalah pemakan waktu paling diam-diam di pagi hari. Lima menit di sini, tiga menit di sana, tiba-tiba sudah telat.<em>Tandanya: kalimat "Ada yang lihat ... nggak?" muncul hampir setiap pagi.</em></div></div>
<div class="src">{img("ic-urutan.png")}<div><span class="n">3.</span> <b>Urutan yang Berubah-ubah</b><br>Hari ini mandi dulu baru sarapan, besok sarapan dulu baru mandi. Kamu kadang siap duluan, kadang terakhir. Tanpa urutan tetap, otak harus "menyusun ulang" pagi setiap hari, dan anak juga jadi bingung harus apa.<em>Tandanya: setiap pagi terasa seperti hari pertama.</em></div></div>
<div class="src">{img("ic-remote.png")}<div><span class="n">4.</span> <b>Anak yang Belum Punya Rutinitas Sendiri</b><br>Anak menunggu disuruh untuk setiap langkah: bangun, ke kamar mandi, pakai baju, pakai sepatu. Semua bergantung pada suaramu. Akhirnya kamu jadi "remote control" yang harus terus ditekan, dan capeknya luar biasa.<em>Tandanya: kamu mengulang instruksi yang sama 3&ndash;5 kali sebelum anak bergerak.</em></div></div>
<div class="src">{img("ic-payung.png")}<div><span class="n">5.</span> <b>Tidak Ada Cadangan untuk Hal Tak Terduga</b><br>Rencana pagimu pas-pasan. Begitu ada satu hal yang meleset (anak rewel, pengasuh izin, air mati), seluruh pagi ikut ambruk karena tidak ada ruang dan tidak ada rencana B.<em>Tandanya: pagi yang "normal" masih bisa jalan, tapi satu gangguan kecil langsung bikin telat.</em></div></div>
{aksi("Catat pagimu besok, tanpa mengubah apa pun.", p("Besok pagi, siapkan kertas kecil atau notes di HP. Tulis hanya tiga hal:") + tbl(["Yang dicatat","Isianmu"],[["Jam berapa kamu mulai bangun","&nbsp;"],["Jam berapa kalian benar-benar keluar rumah","&nbsp;"],["Satu momen yang paling bikin macet atau bikin suaramu naik","&nbsp;"]],"fill",["52%","48%"]) + p("Tidak perlu diperbaiki dulu. Cukup dicatat. Catatan ini akan kita pakai di Bab 3 saat menyusun timeline 45 menit versimu sendiri."))}
''')

# ---------- BAB 2 ----------
page('dusk', 'Bagian 1 · Siapkan · Bab 2', f'''
{hero("bab2.jpg")}
<p>Ini mungkin bukan kabar yang Mami ingin dengar setelah seharian kerja: <b>pagi yang lancar biasanya dimulai dari malam sebelumnya.</b></p>
<p>Tenang, bukan berarti kamu harus begadang menyiapkan semuanya. Yang kita butuhkan hanya <b>15 menit</b>, di jam yang sama setiap malam, dengan urutan yang sama.</p>
<p>Kenapa malam? Karena di malam hari tidak ada jam yang mengejar. Keputusan kecil yang di pagi hari terasa berat ("baju apa?", "bekal apa?") di malam hari bisa diambil dengan kepala yang lebih tenang.</p>
<p>Prinsipnya sederhana: <b>pindahkan sebanyak mungkin keputusan dan persiapan dari pagi ke malam.</b> Pagi tinggal menjalankan, bukan memikirkan.</p>
{h2("Kapan 15 Menit Ini Dilakukan?")}
<p>Pilih satu waktu yang paling masuk akal untuk rumahmu, lalu pakai terus:</p>
<ul>
<li><b>Setelah anak tidur.</b> Rumah lebih tenang, kamu bisa fokus. Cocok kalau anak tidur di jam yang cukup teratur.</li>
<li><b>Setelah makan malam, bersama anak.</b> Anak ikut menyiapkan baju dan tasnya sendiri. Lebih ramai, tapi sekalian melatih kebiasaan anak. Cocok untuk anak usia 4 tahun ke atas.</li>
<li><b>Sebelum kamu mandi malam.</b> Dijadikan "gerbang": selesai 15 menit ini, baru boleh istirahat.</li>
</ul>
<p>Yang penting bukan jamnya, tapi <b>konsistensinya.</b> Kegiatan yang terikat pada momen tetap jauh lebih mudah dijalankan daripada "nanti kalau sempat."</p>
''')

page('dusk', 'Bagian 1 · Siapkan · Bab 2', f'''
{h2("Checklist Malam 15 Menit")}
<p>Checklist ini dibagi dalam empat blok. Kerjakan berurutan. Kalau malam itu sangat capek, kerjakan <b>Blok 1 dan 2 saja</b>, itu sudah menyelamatkan sebagian besar pagimu.</p>
<div class="grid2">
<div>{card("Blok 1 &mdash; Baju (&plusmn; 4 menit)", cb(["Baju anak lengkap, termasuk kaus dalam, kaus kaki, jilbab/aksesoris","Baju kerjamu lengkap, termasuk sepatu dan tas","Semua baju diletakkan di satu tempat yang sudah ditentukan"]), "y")}
{card("Blok 3 &mdash; Makanan (&plusmn; 5 menit)", cb(["Menu sarapan besok sudah diputuskan","Menu bekal besok sudah diputuskan","Bahan yang bisa disiapkan malam ini sudah disiapkan","Kotak bekal sudah dicuci dan diletakkan dekat tempat masak"]), "y")}</div>
<div>{card("Blok 2 &mdash; Tas &amp; Barang (&plusmn; 4 menit)", cb(["Tas anak dicek: buku, PR, seragam olahraga, surat sekolah","Tas kerjamu dicek: ID card, charger, dompet, kunci","Botol minum dicuci dan siap diisi","Semua tas di Stasiun Siap Berangkat"]), "m")}
{card("Blok 4 &mdash; Cek Besok (&plusmn; 2 menit)", cb(["Lihat kalender: ada acara khusus di sekolah atau kantor?","Cek bensin / saldo e-toll / saldo ojek online","Pasang alarm"]), "m")}</div>
</div>
<p class="small">Checklist ini juga tersedia dalam versi tempel kulkas di Bonus 2.</p>
{h2("Tips agar Checklist Tidak Terasa Berat")}
<p><b>Minggu pertama, jangan kejar semuanya.</b> Kalau selama ini kamu tidak punya rutinitas malam sama sekali, mulai dari Blok 1 dulu selama beberapa hari. Setelah terasa otomatis, tambahkan Blok 2, lalu seterusnya.</p>
<p><b>Putuskan menu sekali seminggu, bukan setiap malam.</b> Blok 3 akan jauh lebih cepat kalau menu seminggu sudah ditentukan di akhir pekan. Bonus 3 berisi 30 ide sarapan dan bekal 5 menit yang bisa kamu rotasi.</p>
<p><b>Libatkan anak sesuai usianya.</b> Anak 3&ndash;4 tahun bisa memilih satu dari dua baju yang kamu tawarkan. Anak 6 tahun ke atas bisa menyiapkan tas dan bajunya sendiri, lalu kamu cukup mengecek.</p>
<p><b>Kalau terlewat semalam, tidak apa-apa.</b> Besok malam mulai lagi. Sistem ini tidak rusak hanya karena satu malam bolong.</p>
''')

page('dusk', 'Bagian 1 · Siapkan · Bab 2', f'''
{h2("Stasiun Siap Berangkat")}
<p>Ingat sumber kekacauan nomor 2 di Bab 1: barang yang tidak ada di tempatnya? Solusinya adalah <b>satu titik tetap di dekat pintu keluar</b>, tempat semua barang untuk berangkat "tinggal".</p>
<p>Aturannya satu: <b>apa pun yang dibawa keluar rumah besok pagi, malam ini sudah ada di stasiun.</b> Pagi hari, kamu dan anak cukup mengambil dari satu tempat, lalu berangkat.</p>
{img("stasiun.jpg","hero")}
<p><b>Isi stasiun biasanya:</b> tas sekolah/daycare anak, tas kerjamu, sepatu semua orang yang berangkat, kunci kendaraan atau rumah, helm atau jaket (kalau naik motor), payung, dan barang khusus besok (surat izin, uang kas, kotak prakarya).</p>
<p><b>Tidak perlu beli apa-apa.</b> Stasiun bisa berupa satu rak sepatu dengan baki di atasnya, beberapa gantungan di dinding dekat pintu (satu per orang), keranjang plastik (satu per orang), atau ujung meja yang sengaja dikosongkan khusus untuk ini.</p>
{tip("<b>Tips penempatan:</b> sedekat mungkin dengan pintu yang kamu pakai untuk berangkat. Pasang gantungan kunci di situ juga. Kalau anak lebih dari satu, beri tanda nama atau warna berbeda. Pasang di ketinggian yang bisa dijangkau anak, supaya anak bisa mengambil dan menaruh barangnya sendiri.")}
<p><b>Kebiasaan pendukung:</b> saat pulang kerja atau pulang sekolah, barang langsung kembali ke stasiun, bukan ke sofa atau meja makan. Ini butuh waktu untuk jadi kebiasaan, jadi ingatkan dengan santai selama beberapa minggu pertama.</p>
''')

page('dusk', 'Bagian 1 · Siapkan · Bab 2', f'''
{h2("Tempat Baju untuk Besok")}
<p>Selain stasiun di dekat pintu, siapkan juga satu tempat khusus untuk <b>baju besok</b>: gantungan di balik pintu kamar, satu keranjang kecil per anak, atau satu kursi di kamar. Anak yang masih kecil biasanya lebih semangat kalau tempatnya "miliknya" sendiri, misalnya keranjang dengan stiker kesukaannya.</p>
{h2("Bagaimana Kalau Malam Juga Kacau?")}
<p>Ada malam-malam yang memang sudah penuh: anak rewel, pekerjaan dibawa pulang, atau kamu sudah terlalu lelah. Untuk malam seperti itu, pakai <b>Versi 5 Menit</b>:</p>
{card("Versi 5 Menit", cb(["Baju anak dan bajumu besok sudah ditentukan","Tas semua orang sudah di stasiun","Alarm terpasang"]), "y")}
<p>Sisanya bisa dikerjakan besok pagi dengan versi darurat di Bab 5. Lima menit lebih baik daripada tidak sama sekali.</p>
{aksi("Tentukan lokasi Stasiun Siap Berangkat malam ini, lalu jalankan Blok 1 dan Blok 2.", fill(["Lokasi Stasiun Siap Berangkat","Lokasi tempat baju untuk besok","Waktu tetap untuk checklist malam"]) + p("Tidak perlu sempurna. Pakai tempat dan wadah yang ada di rumah. Besok pagi, perhatikan: berapa kali kamu mencari barang dibanding biasanya?"))}
''')
