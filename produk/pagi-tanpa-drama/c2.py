from lib import *

# ---------- BAB 3 ----------
page('yellow', 'Bagian 2 · Jalankan · Bab 3', f'''
{hero("bab3.jpg")}
<p>Di Bab 1 kamu sudah mencatat satu pagi apa adanya. Di Bab 2 kamu sudah memindahkan sebagian persiapan ke malam hari. Sekarang saatnya menyusun <b>urutan pagi yang tetap</b>, supaya setiap pagi tidak lagi terasa seperti hari pertama.</p>
<p>Dulu mungkin pagimu berjalan seperti ini: bangun, lalu mengerjakan apa pun yang paling mendesak saat itu. Masalahnya, di pagi hari <i>semuanya</i> terasa mendesak. Timeline mengubah itu. Kamu tidak perlu lagi berpikir "sekarang apa?" karena jawabannya sudah tertulis.</p>
{h2("Apa yang Dimaksud &quot;45 Menit&quot;?")}
<p>Agar jelas sejak awal: <b>45 menit dihitung dari anak dibangunkan sampai kalian keluar rumah.</b> Bagian inilah yang paling sering kacau. Sebelum anak bangun, kamu masih bisa bergerak sesuai ritmemu sendiri. Waktu sebelum itu adalah waktumu sendiri untuk bersiap, beribadah, atau memasak.</p>
<p>45 menit juga bukan angka keramat. Kalau anakmu butuh waktu lebih lama, atau rumahmu jauh dari sekolah, silakan sesuaikan jadi 50 atau 60 menit. Yang penting adalah <b>urutannya tetap dan waktunya cukup</b>, bukan secepat-cepatnya.</p>
{card("Ringkasnya", ul(["<b>Mami bangun</b> &rarr; mandi, berpakaian, siapkan sarapan &amp; bekal (waktumu sendiri)","<b>Menit 0</b> &rarr; anak dibangunkan","<b>Menit 45</b> &rarr; berangkat"]), "")}
''')

page('yellow', 'Bagian 2 · Jalankan · Bab 3', f'''
{h2("Aturan Utama: Ibu Siap Duluan")}
{img("mami-duluan.jpg","hero")}
<p>Kalau hanya ada satu hal yang kamu ambil dari bab ini, ambillah yang ini: <b>sebelum anak dibangunkan, kamu sudah mandi, sudah berpakaian kerja, dan tasmu sudah di stasiun.</b></p>
<p>Coba ingat pagi-pagi yang paling kacau. Sering kali saat anak sudah siap, kamu baru mulai berdandan, dan anak yang menunggu mulai bermain, menumpahkan sesuatu, atau membuka lagi sepatunya. Saat kamu siap duluan, seluruh perhatianmu di 45 menit itu bisa untuk anak. Dan anak biasanya lebih mudah digerakkan oleh orang tua yang tenang daripada yang sedang terburu-buru.</p>
{tbl(["Sebaiknya selesai sebelum anak bangun","Boleh ditunda sampai anak siap"],[["Mandi<br>Berpakaian kerja<br>Sarapan &amp; bekal sudah dimasak atau di atas kompor<br>Tasmu sudah di stasiun","Memakai sepatu<br>Riasan wajah terakhir<br>Jaket atau kerudung luar"]],"")}
''')

page('yellow', 'Bagian 2 · Jalankan · Bab 3', f'''
{h2("Timeline Versi Balita (2–5 Tahun)")}
<p>Balita biasanya belum bisa banyak mengurus diri sendiri, dan transisinya lambat. Karena itu timeline ini memberi jeda lebih panjang di setiap langkah.</p>
{tbl(["Menit","Contoh jam","Kegiatan"],[
["-30 s/d 0","05.45&ndash;06.15","<b>Waktu Mami:</b> mandi, berpakaian, siapkan sarapan &amp; bekal"],
["0","06.15","Bangunkan anak dengan pelan, beri waktu 3&ndash;5 menit untuk &quot;mengumpulkan nyawa&quot;"],
["5","06.20","Ke kamar mandi: pipis, cuci muka atau mandi, sikat gigi"],
["15","06.30","Pakai baju (sudah disiapkan semalam)"],
["22","06.37","Sarapan"],
["35","06.50","Cuci tangan, isi botol minum, masukkan bekal ke tas"],
["40","06.55","Pakai sepatu, ambil tas dari stasiun"],
["45","07.00","<b>Berangkat</b>"]],"",["16%","20%","64%"])}
{tip("Kalau anak mandi pagi, beri blok 10 menit penuh untuk kamar mandi. Sarapan balita sering lama: sajikan porsi kecil yang mudah dimakan. Kalau anak diantar ke daycare atau pengasuh, sebagian sarapan bisa dipindah ke sana sesuai kesepakatan.")}
{h2("Timeline Versi Anak SD (6–10 Tahun)")}
<p>Anak SD sudah bisa mengerjakan banyak langkah sendiri. Peranmu bergeser dari "mengerjakan" ke "mengecek".</p>
{tbl(["Menit","Contoh jam","Kegiatan"],[
["-30 s/d 0","05.30&ndash;06.00","<b>Waktu Mami:</b> mandi, berpakaian, siapkan sarapan &amp; bekal"],
["0","06.00","Bangunkan anak"],
["3","06.03","Anak ke kamar mandi: mandi, sikat gigi"],
["13","06.13","Anak pakai seragam sendiri"],
["20","06.20","Sarapan bersama"],
["32","06.32","Anak cek tas sendiri pakai chart (Bab 4), isi botol minum"],
["38","06.38","Pakai sepatu, ambil tas dari stasiun"],
["42","06.42","<b>Cadangan 3 menit</b> untuk yang lupa atau meleset"],
["45","06.45","<b>Berangkat</b>"]],"",["16%","20%","64%"])}
''', z=1.04)

page('yellow', 'Bagian 2 · Jalankan · Bab 3', f'''
{tip("Cadangan 3 menit bukan untuk diisi kegiatan lain. Kalau tidak terpakai, kalian berangkat lebih awal. Kalau anak masuk sekolah lebih pagi, geser seluruh timeline ke belakang, bukan dipadatkan.")}
{h2("Timeline Versi Dua Anak Beda Usia")}
<p>Kuncinya adalah <b>berselang, bukan bersamaan.</b> Anak yang lebih lambat (biasanya yang lebih kecil) dibangunkan belakangan, supaya kamu tidak mengurus dua anak di langkah yang sama. Contoh: kakak kelas 3 SD, adik 3 tahun.</p>
{tbl(["Menit","Jam","Kakak (SD)","Adik (Balita)"],[
["-30 s/d 0","05.30&ndash;06.00","<i>Masih tidur</i>","<i>Masih tidur</i>"],
["0","06.00","Dibangunkan","<i>Masih tidur</i>"],
["3","06.03","Mandi, sikat gigi (mandiri)","<i>Masih tidur</i>"],
["10","06.10","Pakai seragam (mandiri)","Dibangunkan pelan"],
["15","06.15","Mulai sarapan","Ke kamar mandi <b>(dibantu Mami)</b>"],
["25","06.25","Cek tas pakai chart","Pakai baju <b>(dibantu Mami)</b>"],
["30","06.30","Selesai sarapan, isi botol minum","Sarapan"],
["38","06.38","Pakai sepatu","Pakai sepatu <b>(dibantu Mami)</b>"],
["42","06.42","Cadangan","Cadangan"],
["45","06.45","<b>Berangkat</b>","<b>Berangkat</b>"]],"",["14%","16%","35%","35%"])}
<p><b>Kenapa pola ini berhasil:</b> saat kakak mengerjakan langkah mandiri, perhatianmu penuh untuk adik, dan kamu tidak perlu membantu dua anak di kamar mandi bersamaan. Kakak yang sudah siap bisa diberi tugas kecil, misalnya mengambilkan sepatu adik dari stasiun, tapi jangan jadikan kakak "pengasuh" tetap.</p>
<p>Kalau anak-anakmu dua-duanya balita, bangunkan yang paling lama "mengumpulkan nyawa" lebih dulu. Kalau dua-duanya SD, mereka bisa berjalan bersamaan dengan versi SD, cukup bagi giliran kamar mandi.</p>
<p><b>Ada pengasuh atau keluarga lain yang membantu?</b> Tuliskan siapa mengerjakan apa di kolom tersendiri, supaya tidak ada yang saling menunggu. Soal pembagian tugas dengan suami, kita bahas di Bab 6.</p>
''', z=1.04)

page('yellow', 'Bagian 2 · Jalankan · Bab 3', f'''
{h2("Template Timeline Versimu")}
<p>Pakai catatan pagi yang kamu buat di akhir Bab 1.</p>
<ol>
<li>Tulis jam <b>berangkat</b> yang kamu inginkan di baris paling bawah.</li>
<li>Mundur 45 menit (atau lebih kalau perlu). Itu jam <b>bangunkan anak</b>.</li>
<li>Mundur lagi 30 menit atau sesuai kebutuhanmu. Itu jam <b>Mami bangun</b>.</li>
<li>Isi langkah-langkah di tengahnya, beri waktu lebih untuk bagian yang paling sering macet.</li>
<li>Sisakan cadangan 3&ndash;5 menit sebelum berangkat.</li>
</ol>
{tbl(["Menit","Jam","Mami","Anak 1","Anak 2"],[["Mami bangun","","","",""],["0","","","",""],["&nbsp;","","","",""],["&nbsp;","","","",""],["&nbsp;","","","",""],["&nbsp;","","","",""],["&nbsp;","","","",""],["Cadangan","","","",""],["<b>Berangkat</b>","","","",""]],"tall",["16%","14%","24%","23%","23%"])}
<p>Setelah jadi, tempel timeline ini di tempat yang sering kamu lihat di pagi hari, misalnya pintu kulkas atau dekat cermin kamar mandi.</p>
''')

page('yellow', 'Bagian 2 · Jalankan · Bab 3', f'''
{h2("Minggu Pertama Pasti Belum Pas")}
<p>Timeline yang baru dibuat hampir tidak pernah langsung cocok. Itu bukan tanda gagal, itu data. Setiap sore di minggu pertama, tanyakan satu hal: <b>"Langkah mana yang tadi pagi paling molor?"</b> Lalu tambahkan waktu di langkah itu. Biasanya setelah satu sampai dua minggu, timeline mulai terasa pas dengan ritme rumahmu.</p>
{aksi("Isi Template Timeline Versimu, lalu jalankan besok pagi sekali saja.", p("Besok sore, isi catatan singkat ini:") + tbl(["Yang dicek","Isianmu"],[["Apakah Mami sudah siap sebelum anak dibangunkan?","Ya / Belum"],["Jam berangkat sebenarnya","&nbsp;"],["Langkah yang paling molor","&nbsp;"],["Perubahan kecil untuk lusa","&nbsp;"]],"fill",["52%","48%"]) + p("Satu kali percobaan sudah cukup untuk hari ini. Perbaikannya pelan-pelan."))}
''')

# ---------- BAB 4 ----------
page('pink', 'Bagian 2 · Jalankan · Bab 4', f'''
{hero("bab4.jpg")}
<p>Mari jujur sebentar, Mami. Hampir semua ibu pernah berteriak di pagi hari. Bukan karena tidak sayang, tapi karena jam terus berjalan, anak masih duduk memandangi satu kaus kaki, dan instruksi yang sama sudah diulang empat kali.</p>
<p>Bab ini tidak akan menghakimi teriakan itu. Yang kita lakukan adalah <b>mengurangi momen yang membuat kamu merasa harus berteriak</b>, dengan tiga alat: chart rutinitas, skrip pengganti teriak, dan trik transisi. Tujuannya pelan-pelan memindahkan "tombol" dari suaramu ke sistem yang bisa anak lihat dan ikuti sendiri.</p>
{h2("Kenapa Instruksi Lisan Sering Tidak Didengar")}
<p>Di pagi hari, anak menerima banyak sekali kalimat: "ayo bangun", "cepat mandi", "bajunya dipakai", "jangan main dulu", "sepatunya mana". Semuanya lewat suara, semuanya terdengar mirip. Bagi anak, terutama yang masih kecil, deretan kalimat seperti ini mudah lewat begitu saja. Bukan karena mereka nakal, tapi karena mereka belum terbiasa menyimpan urutan panjang di kepala sambil setengah mengantuk. Makanya alat pertama kita adalah sesuatu yang bisa <b>dilihat</b>.</p>
''')

page('pink', 'Bagian 2 · Jalankan · Bab 4', f'''
{h2("Alat 1: Chart Rutinitas Pagi")}
<p>Chart rutinitas adalah daftar langkah pagi anak, ditempel di tempat yang mudah dilihat, dengan urutan yang sama dengan timeline di Bab 3. Pertanyaan "habis ini apa, Ma?" sekarang bisa dijawab anak sendiri dengan melihat chart.</p>
<p><b>Versi balita (2&ndash;5 tahun): bergambar.</b> Balita belum bisa membaca, jadi setiap langkah diwakili gambar. Cukup 5&ndash;6 langkah.</p>
{img("chart-laki.jpg","strip")}
<p><b>Versi anak SD (6&ndash;10 tahun): checklist.</b> Anak SD bisa membaca dan mencentang sendiri: bangun dan rapikan selimut, mandi, sikat gigi, pakai seragam lengkap, sarapan, taruh piring di tempat cuci, cek tas, pakai sepatu, siap di pintu. Kedua versi tersedia siap cetak di Bonus 1.</p>
{tip("<b>Agar chart benar-benar dipakai:</b> tempel sejajar mata anak. Buat bersama anak, biarkan ia mewarnai atau memilih stiker. Beri cara menandai yang menyenangkan: jepitan jemuran yang dipindah untuk balita, spidol yang bisa dihapus untuk anak SD. Dan pastikan urutan chart sama dengan timeline.")}
<p><b>Cara mengenalkannya:</b> hari pertama sampai ketiga, jalani chart <i>bersama</i> anak. Tunjuk langkahnya, kerjakan bersama, tandai bersama. Setelah itu, ganti instruksimu dengan pertanyaan: "Di chart, habis ini apa?" Pelan-pelan, anak yang akan membaca sendiri tanpa ditanya.</p>
''', z=1.06)

page('pink', 'Bagian 2 · Jalankan · Bab 4', f'''
{h2("Alat 2: Skrip Pengganti Teriak")}
<p>Teriakan sering muncul karena di momen genting kita tidak punya kalimat lain yang siap dipakai. Skrip adalah kalimat pendek yang sudah disiapkan sebelumnya. Pilih 2&ndash;3 yang paling cocok dengan situasi di rumahmu.</p>
{alt("Saat anak belum mau bangun","&quot;Bangun! Sudah jam berapa ini!&quot;","&quot;Mami hitung sampai lima, terus kita bangun bareng. Mau duduk sendiri atau Mami bantu?&quot;")}
{alt("Saat anak terdistraksi mainan atau TV","&quot;Berhenti main! Dari tadi disuruh!&quot;","&quot;Mainannya boleh istirahat di sini, nanti sore ketemu lagi. Sekarang chart bilang apa?&quot;")}
{alt("Saat anak lama sekali di satu langkah","&quot;Cepetan! Kamu lambat banget!&quot;","&quot;Kira-kira bisa selesai sebelum lagu ini habis, nggak?&quot;")}
{alt("Saat anak menolak baju atau sepatu","&quot;Pakai yang itu! Nggak ada pilihan!&quot;","&quot;Yang ini atau yang ini? Kamu yang pilih.&quot;","<br><span class='small'>(Pastikan dua-duanya pilihan yang kamu setujui.)</span>")}
{alt("Saat kamu sudah mengulang instruksi berkali-kali","Menaikkan suara lebih tinggi lagi.","Mendekat, turunkan badan sejajar anak, sentuh bahunya, lalu bicara pelan: &quot;Sekarang waktunya pakai sepatu.&quot;")}
<p class="small">Yang terakhir ini sering jauh lebih efektif daripada teriakan dari ruangan lain, karena anak benar-benar menyadari kamu sedang bicara padanya.</p>
''', z=1.04)

page('pink', 'Bagian 2 · Jalankan · Bab 4', f'''
{alt("Saat kamu merasa mau meledak","(Menahan sampai meledak.)","&quot;Mami butuh tarik napas sebentar.&quot; Lalu benar-benar tarik napas tiga kali sebelum bicara lagi.")}
<p>Tidak apa-apa bilang begitu di depan anak. Anak juga belajar bahwa orang dewasa pun kadang perlu jeda.</p>
{card("Kalau tetap terlanjur berteriak", "<p>Itu akan terjadi, dan tidak menghapus semua usahamu. Setelah suasana tenang, cukup bilang: <i>&quot;Tadi Mami suaranya keras ya. Mami minta maaf. Besok kita coba lagi bareng.&quot;</i> Lalu lanjutkan. Tidak perlu berlarut-larut menyalahkan diri.</p>","o")}
{h2("Alat 3: Trik Transisi")}
<p>Pagi hari penuh perpindahan: dari tidur ke bangun, dari kamar ke kamar mandi, dari main ke makan, dari rumah ke luar. Banyak momen macet terjadi tepat di perpindahan ini.</p>
<ul>
<li><b>Peringatan sebelum pindah.</b> "Dua menit lagi kita pakai sepatu ya." Perpindahan yang diberitahu lebih dulu biasanya lebih mudah diterima daripada yang mendadak.</li>
<li><b>Lagu sebagai penanda waktu.</b> Pilih satu lagu untuk satu langkah, misalnya lagu favorit anak untuk pakai baju: selesai sebelum lagunya habis.</li>
<li><b>Timer yang bisa dilihat.</b> Timer dapur, jam pasir, atau timer di HP yang terlihat. Anak bisa melihat sisa waktunya sendiri.</li>
<li><b>Tugas kecil yang berarti.</b> Menekan tombol lift, membawa kunci dari stasiun, atau menjadi "pengecek pintu sudah dikunci".</li>
<li><b>Permainan "balapan".</b> "Siapa yang pakai sepatu duluan, Mami atau kamu?" Sesekali biarkan anak menang. Kalau anak mudah kesal saat kalah, lewati trik ini.</li>
<li><b>Sesuatu yang ditunggu di ujung.</b> Misalnya lima menit membaca buku bergambar bersama kalau semua sudah siap sebelum waktunya, atau memilih lagu di perjalanan. Jaga agar sederhana supaya bisa diulang setiap hari.</li>
</ul>
''', z=1.04)

page('pink', 'Bagian 2 · Jalankan · Bab 4', f'''
{h2("Yang Perlu Diingat")}
<p><b>Tidak semua trik cocok untuk semua anak.</b> Coba satu per satu, lihat reaksinya, lalu simpan yang berhasil. <b>Konsisten lebih penting daripada banyak trik.</b> Satu chart yang dipakai setiap hari jauh lebih berguna daripada lima trik yang ganti-ganti. <b>Hasilnya bertahap.</b> Yang kita cari adalah kecenderungan yang membaik dari minggu ke minggu, bukan perubahan dalam semalam.</p>
{aksi("Buat chart rutinitas bersama anak, lalu pilih dua skrip yang mau kamu pakai minggu ini.", fill(["Versi chart (balita / SD)","Lokasi chart ditempel","Cara anak menandai langkah","Skrip pilihan 1","Skrip pilihan 2","Trik transisi yang mau dicoba"]) + p("Tulis dua skrip pilihanmu di kertas kecil dan tempel di dekat timeline. Di momen genting, kalimat yang tertulis jauh lebih mudah diingat daripada yang hanya ada di kepala."))}
''')
