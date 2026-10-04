from lib import *

# ---------- BAB 5 ----------
page('mint', 'Bagian 3 · Cadangan · Bab 5', f'''
{hero("bab5.jpg")}
<p>Sejauh ini kita sudah membangun pagi yang "normal". Tapi pagi yang normal tidak datang setiap hari. Ada pagi ketika anak bangun dengan suasana hati yang buruk. Ada pagi ketika alarm tidak berbunyi. Ada pagi ketika pesan WhatsApp dari pengasuh masuk jam 5.30: "Bu, maaf hari ini saya tidak bisa datang."</p>
<p>Tujuan bab ini bukan mencegah semua gangguan, karena itu mustahil. Tujuannya adalah <b>punya langkah yang sudah diputuskan sebelumnya</b>, supaya saat gangguan datang, kamu tidak perlu berpikir dari nol di tengah kepanikan.</p>
{h2("Rencana B #1: Anak Rewel")}
<ol>
<li><b>Turunkan target pagi itu.</b> Pagi seperti ini bukan waktunya melatih kemandirian. Kalau biasanya anak pakai baju sendiri, hari ini bantu saja.</li>
<li><b>Pangkas langkah yang tidak wajib.</b> Mandi bisa diganti cuci muka dan lap badan. Sarapan bisa dibawa, kalau memungkinkan.</li>
<li><b>Beri pilihan kecil, bukan perintah.</b> "Mau digendong ke kamar mandi atau jalan sendiri?"</li>
<li><b>Kurangi kata-kata.</b> Cukup kalimat pendek dan pelukan.</li>
<li><b>Pakai waktu cadangan.</b> Ini gunanya cadangan 3&ndash;5 menit di timeline Bab 3.</li>
</ol>
<p><b>Sebaiknya dihindari:</b> membandingkan dengan saudara atau anak lain, dan memulai "pelajaran" tentang sikap di tengah pagi yang sempit. Simpan untuk sore atau malam saat semua sudah tenang.</p>
''')

page('mint', 'Bagian 3 · Cadangan · Bab 5', f'''
{h2("Rencana B #2: Anak Sakit Ringan")}
<p>Bab ini tidak membahas cara menilai atau mengobati kondisi anak. Untuk itu, ikuti arahan dokter atau tenaga kesehatan yang biasa menangani anakmu. Yang kita siapkan di sini adalah <b>sisi logistiknya</b>.</p>
{card("Siapkan dari sekarang, saat anak sehat", cb(["Cari tahu aturan sekolah/daycare: kondisi apa yang membuat anak sebaiknya tidak masuk, dan cara izinnya","Simpan nomor wali kelas atau pengurus daycare di HP","Simpan kontak dokter atau klinik langganan","Ketahui aturan izin atau kerja dari rumah di kantormu","Tentukan dengan suami siapa yang lebih memungkinkan izin kalau anak harus di rumah","Tentukan &quot;pendamping cadangan&quot;: orang tua, mertua, saudara, atau tetangga yang dipercaya"]), "")}
<p><b>Di pagi harinya:</b> putuskan masuk atau tidak, berdasarkan aturan sekolah dan arahan tenaga kesehatan. Kalau tidak masuk, kabari sekolah, kantor, dan atur pendamping. Kalau masuk, selipkan kebutuhan tambahan di tas (tisu, baju ganti, botol minum lebih besar) dan kabari guru.</p>
{card("Template pesan izin ke sekolah", "<i>Selamat pagi, Bu/Pak [nama guru]. Saya [nama], orang tua dari [nama anak] kelas [kelas]. Hari ini [nama anak] izin tidak masuk karena kurang sehat. Terima kasih atas perhatiannya.</i>","y")}
{card("Template pesan ke atasan", "<i>Selamat pagi, [nama atasan]. Anak saya sedang kurang sehat pagi ini. Saya izin [datang terlambat / bekerja dari rumah / cuti] hari ini. Untuk pekerjaan [yang mendesak], akan saya [selesaikan jam berapa / serahkan ke siapa]. Saya tetap bisa dihubungi lewat [HP/WA/email].</i>","y")}
<p>Simpan kedua template ini di notes HP supaya tinggal diubah sedikit dan dikirim.</p>
''', z=1.05)

page('mint', 'Bagian 3 · Cadangan · Bab 5', f'''
{h2("Rencana B #3: Telat Bangun")}
<ol>
<li><b>Tarik napas dulu, lalu cek jam berangkat.</b> Hitung berapa menit yang tersisa sebenarnya. Sering kali situasinya tidak separah perasaan pertama.</li>
<li><b>Langsung ke Pagi Darurat 20 Menit</b> (di halaman berikut) kalau sisa waktunya kurang dari timeline normal.</li>
<li><b>Kabari lebih awal kalau memang akan telat.</b> Pesan singkat sebelum jam masuk biasanya lebih mudah diterima daripada datang telat tanpa kabar.</li>
</ol>
<p><b>Mencegah terulang:</b> kalau telat karena tidur terlalu malam, majukan jam checklist malam. Pasang dua alarm di dua perangkat berbeda. Letakkan alarm agak jauh dari tempat tidur, supaya harus berdiri untuk mematikannya.</p>
{h2("Rencana B #4: Pengasuh atau ART Izin Mendadak")}
<p>Bagi banyak ibu bekerja, ini salah satu pagi yang paling bikin panik, karena bukan hanya pagi yang terganggu, tapi seluruh hari. Siapkan <b>Daftar Pendamping Cadangan</b> sekarang:</p>
{tbl(["No","Nama / tempat","Nomor HP","Catatan (jam bisa, jarak, syarat)"],[["1","","",""],["2","","",""],["3","","",""]],"tall",["8%","28%","22%","42%"])}
<p>Pilihan yang bisa dipertimbangkan: orang tua atau mertua, saudara, tetangga yang dipercaya, daycare yang menerima penitipan harian, atau pengasuh panggilan yang sudah dikenal. Cara terbaik adalah <b>menghubungi mereka sekarang, saat tidak darurat.</b> Permintaan mendadak di jam 6 pagi lebih mudah diterima kalau sebelumnya sudah dibicarakan.</p>
<p><b>Di pagi harinya:</b> hubungi pendamping cadangan sesuai urutan. Kalau tidak ada yang bisa, bicarakan dengan suami siapa yang izin atau bekerja dari rumah (Bab 6). Kabari kantor secepatnya.</p>
{tip("Minta pengasuh mengabari paling lambat malam sebelumnya kalau ada kemungkinan tidak bisa datang. Tidak semua izin bisa diketahui lebih awal, tapi kebiasaan ini mengurangi kejutan di pagi hari.")}
''', z=1.04)

page('mint', 'Bagian 3 · Cadangan · Bab 5', f'''
{h2("Pagi Darurat 20 Menit")}
<p>Versi paling ringkas dari timeline Bab 3. Prinsipnya: <b>hanya yang wajib, sisanya dilepas.</b></p>
{tbl(["Menit","Mami","Anak"],[
["0","Bangunkan anak sambil nyalakan lampu","Bangun"],
["2","Cuci muka, sikat gigi, pakai baju kerja yang disiapkan semalam","Cuci muka, sikat gigi, pipis"],
["8","Bantu anak pakai baju","Pakai baju (dibantu)"],
["12","Ambil sarapan bawa (roti, buah, susu kotak), isi botol minum","Duduk, makan sesuatu yang cepat"],
["16","Ambil tas dari stasiun, cek kunci","Pakai sepatu"],
["20","<b>Berangkat</b>","<b>Berangkat</b>"]],"",["12%","54%","34%"])}
{tbl(["Boleh dilepas","Harus tetap ada"],[["Mandi pagi (ganti cuci muka &amp; lap badan)<br>Sarapan duduk di meja<br>Bekal masak (ganti bekal praktis)<br>Riasan lengkap<br>Merapikan tempat tidur dan rumah","Semua orang berpakaian layak<br>Tas lengkap<br>Anak sudah makan atau membawa makanan<br>Kunci dan dompet terbawa"]],"")}
{card("Stok Pagi Darurat &mdash; simpan selalu di rumah", cb(["Roti atau biskuit yang mengenyangkan","Buah yang tidak perlu dikupas rumit (pisang, jeruk kecil)","Susu kotak atau minuman kotak","Bekal kering cadangan yang tahan lama"]), "y")}
<p>Pagi Darurat 20 Menit hanya bisa berjalan kalau checklist malam sudah dilakukan. Tanpa baju dan tas yang siap di tempatnya, 20 menit hampir mustahil.</p>
''', z=1.05)

page('mint', 'Bagian 3 · Cadangan · Bab 5', f'''
{h2("Setelah Pagi yang Berantakan")}
<p>Rencana B tidak selalu berhasil sempurna. Saat itu terjadi, ingat: <b>satu pagi yang berantakan tidak membatalkan sistemmu.</b> Malam nanti, jalankan lagi checklist malam. Besok pagi, kembali ke timeline normal. Kalau mau, sore harinya tanyakan: <i>"Apa satu hal yang bisa disiapkan supaya pagi seperti tadi lebih ringan lain kali?"</i></p>
{h2("Contekan Cepat Rencana B")}
{tbl(["Kalau yang terjadi...","Langkah pertama"],[
["Anak rewel","Turunkan target, pangkas langkah, beri pilihan kecil"],
["Anak kurang sehat","Ikuti arahan tenaga kesehatan &bull; kabari sekolah &amp; kantor pakai template &bull; hubungi pendamping cadangan"],
["Telat bangun","Cek sisa menit &bull; langsung Pagi Darurat 20 Menit &bull; kabari lebih awal"],
["Pengasuh/ART izin","Hubungi Daftar Pendamping Cadangan sesuai urutan &bull; bicarakan izin/WFH dengan suami &bull; kabari kantor"]],"",["32%","68%"])}
{aksi("Isi Daftar Pendamping Cadangan, simpan dua template pesan di HP, dan siapkan Stok Pagi Darurat.", cb(["Daftar Pendamping Cadangan terisi minimal 2 nama","Minimal 1 pendamping cadangan sudah dihubungi dan bersedia","Template izin sekolah tersimpan di notes HP","Template izin kantor tersimpan di notes HP","Aturan izin sakit sekolah/daycare sudah diketahui","Stok Pagi Darurat tersedia di rumah"]) + p("Semua ini dikerjakan saat pagi sedang tenang, supaya saat pagi tidak tenang, kamu tinggal menjalankan."))}
''')

# ---------- BAB 6 ----------
page('coral', 'Bagian 3 · Cadangan · Bab 6', f'''
{hero("bab6.jpg")}
<p>Sampai bab ini, sebagian besar sistem memang dijalankan oleh Mami. Tapi pagi di rumah bukan urusan satu orang. Kalau ada suami di rumah pada pagi hari, sistem ini akan jauh lebih ringan kalau dijalankan berdua.</p>
<p>Bab ini bukan tentang siapa yang lebih banyak mengerjakan, dan bukan tentang mencari siapa yang kurang. Banyak suami sebenarnya mau membantu, tapi tidak tahu harus mulai dari mana. Yang sering hilang bukan niatnya, tapi <b>kejelasannya.</b> Pendekatan kita sederhana: <b>satu tugas tetap, yang jelas, dan dikerjakan setiap hari.</b></p>
{h2("Kenapa Satu Tugas Tetap?")}
<p>Kalimat "tolong bantu-bantu ya pagi ini" terdengar wajar, tapi sulit dijalankan. Bantu apa? Mulai jam berapa? Akibatnya, Mami tetap jadi "remote control", hanya saja sekarang untuk dua orang. Satu tugas tetap itu <b>jelas</b> (tahu persis bagiannya), <b>utuh</b> (tanggung jawab dari awal sampai selesai), dan <b>bisa jadi kebiasaan</b> (sama setiap hari). Satu tugas yang benar-benar lepas dari pikiranmu bisa terasa sangat berbeda dibanding banyak bantuan yang masih harus kamu arahkan.</p>
''')

page('coral', 'Bagian 3 · Cadangan · Bab 6', f'''
{h2("Pilihan Tugas Tetap untuk Suami")}
<p>Pilih tugas yang <b>cocok dengan jam dan kebiasaan suami</b>, bukan yang menurut Mami paling berat.</p>
{tbl(["Kalau suami...","Pilihan tugas"],[
["Bangun lebih awal","Membangunkan anak dan menemani di kamar mandi &bull; Menyiapkan sarapan &bull; Mengisi botol minum dan memasukkan bekal ke tas"],
["Berangkat bersamaan","Memakaikan baju dan sepatu anak &bull; Mengecek tas anak pakai chart &bull; Memanaskan kendaraan dan memastikan barang dari stasiun terbawa"],
["Berangkat lebih siang","Mengantar anak ke sekolah/daycare &bull; Merapikan meja makan dan dapur setelah semua berangkat"],
["Berangkat lebih pagi","Tugas malam: Blok 2 checklist malam atau menyiapkan baju anak &bull; Memasang alarm dan memastikan pintu terkunci"]],"",["28%","72%"])}
<p>Satu tugas dulu. Setelah berjalan lancar beberapa minggu, baru bicarakan kalau mau menambah.</p>
{h2("Cara Mengajak Bicara")}
<p><b>Pilih waktu yang tenang.</b> Bukan di tengah pagi yang kacau, bukan saat salah satu baru pulang kerja. Akhir pekan atau malam setelah anak tidur biasanya lebih pas.</p>
<p><b>Mulai dari tujuan bersama, bukan dari keluhan.</b></p>
{alt("Membuka obrolan","&quot;Kamu nggak pernah bantu pagi-pagi.&quot;","&quot;Aku lagi coba bikin pagi kita lebih tenang, biar nggak ada yang teriak-teriak dan nggak telat. Aku butuh bantuanmu di satu bagian.&quot;")}
<p><b>Tunjukkan sistemnya.</b> Perlihatkan timeline Bab 3 dan chart Bab 4, supaya suami mudah melihat di mana bagiannya. <b>Tawarkan pilihan.</b> "Dari yang ini, mana yang paling cocok sama jadwalmu?" Tugas yang dipilih sendiri biasanya lebih dijalankan.</p>
''', z=1.04)

page('coral', 'Bagian 3 · Cadangan · Bab 6', f'''
<p><b>Sepakati standar yang wajar.</b> Cara suami mengerjakan mungkin berbeda. Selama tujuannya tercapai, coba biarkan. Kalau setiap hasil dikoreksi, tugas itu pelan-pelan kembali ke tanganmu lagi.</p>
<p><b>Minta masukan juga.</b> "Menurutmu, bagian mana dari pagi kita yang paling bikin repot?" Kadang suami melihat hal yang tidak kamu lihat.</p>
{h2("Template Pembagian Tugas Pagi")}
<p>Isi bersama. Yang penting setiap baris punya satu nama yang jelas.</p>
{tbl(["Tugas","Mami","Suami","Anak","Lainnya"],[
"Malam sebelumnya",
["Siapkan baju anak","","","",""],["Siapkan tas &amp; isi stasiun","","","",""],["Putuskan &amp; siapkan bahan sarapan/bekal","","","",""],["Pasang alarm &amp; cek pintu","","","",""],
"Pagi hari",
["Bangunkan anak","","","",""],["Dampingi anak di kamar mandi","","","",""],["Pakaikan/cek baju anak","","","",""],["Siapkan sarapan","","","",""],["Siapkan bekal &amp; botol minum","","","",""],["Cek tas pakai chart","","","",""],["Siapkan kendaraan","","","",""],["Antar anak","","","",""],
"Kalau ada gangguan (Bab 5)",
["Yang izin/WFH kalau anak sakit","","","",""],["Yang menghubungi pendamping cadangan","","","",""]],"",["38%","15%","15%","15%","17%"])}
<p><b>Tugas tetap suami (satu kalimat):</b> ________________________________________________</p>
''', z=1.0)

page('coral', 'Bagian 3 · Cadangan · Bab 6', f'''
{h2("Kalau Kondisinya Berbeda")}
<p>Kalau suami bekerja di luar kota, shift malam, atau memang tidak ada di rumah saat pagi, bab ini tetap bisa dipakai.</p>
<ul>
<li><b>Geser tugas ke malam hari</b> saat ia di rumah.</li>
<li><b>Libatkan orang lain</b> lewat kolom "Lainnya": pengasuh, orang tua, atau keluarga.</li>
<li><b>Libatkan anak lebih banyak:</b> anak SD bisa punya satu tugas tetap juga.</li>
<li><b>Sederhanakan timeline</b> dan andalkan checklist malam lebih penuh kalau kamu menjalankan pagi sendirian.</li>
</ul>
<p>Sistem ini tetap bekerja. Pembagiannya saja yang menyesuaikan.</p>
{h2("Setelah Berjalan: Cek Bersama")}
<p>Setelah satu atau dua minggu, luangkan lima belas menit untuk mengobrol: apa yang sudah terasa lebih ringan, bagian mana yang masih sering macet, dan apakah ada tugas yang perlu ditukar. Jangan lupa bilang terima kasih. Kalimat sederhana seperti <i>"Pagi ini enak banget karena kamu yang pegang sarapan"</i> membantu kebiasaan baru terasa dihargai, dan lebih mungkin bertahan.</p>
{aksi("Ajak suami bicara lima belas menit, sepakati satu tugas tetap, dan isi template pembagian bersama.", fill(["Waktu mengobrol","Tugas tetap suami","Mulai berlaku tanggal","Tanggal cek bersama (1&ndash;2 minggu lagi)"]) + p("Satu tugas, jelas, dan disepakati berdua. Itu sudah cukup untuk memulai."))}
''')
