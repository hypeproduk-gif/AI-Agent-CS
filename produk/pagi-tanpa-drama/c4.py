from lib import *

# ---------- BAB 7 ----------
page('sun', 'Bagian 4 · Mulai · Bab 7', f'''
{hero("bab7.jpg")}
<p>Mami sudah membaca enam bab. Mungkin sebagian sudah kamu coba, mungkin sebagian masih tersimpan di kepala. Keduanya tidak apa-apa. Bab terakhir ini merangkum semuanya jadi satu tantangan sederhana: <b>satu perbaikan per hari, selama tujuh hari.</b></p>
<p>Mengubah seluruh pagi sekaligus hampir selalu terasa berat, lalu berhenti di hari ketiga. Satu perbaikan kecil yang berhasil setiap hari jauh lebih mungkin bertahan.</p>
{h2("Aturan Challenge")}
<ol>
<li><b>Satu perbaikan per hari, tidak lebih.</b> Tujuan kita bukan cepat, tapi bertahan.</li>
<li><b>Perbaikan hari sebelumnya tetap dijalankan.</b> Semuanya menumpuk pelan-pelan.</li>
<li><b>Tidak ada hari yang "gagal".</b> Kalau satu hari terlewat, cukup lanjutkan besoknya.</li>
<li><b>Isi tracker setiap sore atau malam.</b> Hanya butuh dua menit.</li>
<li><b>Boleh mulai hari apa saja.</b> Banyak ibu merasa lebih mudah mulai Minggu malam.</li>
</ol>
{card("Hari 1: Siapkan Baju Malam Ini <small>(Bab 2)</small>", cb(["Tentukan tempat baju untuk besok","Siapkan baju semua orang yang berangkat"]) + '<p class="small">Perhatikan besok: apakah pagi terasa lebih cepat tanpa memilih baju?</p>', "y")}
''')

page('sun', 'Bagian 4 · Mulai · Bab 7', f'''
{card("Hari 2: Bangun Stasiun Siap Berangkat <small>(Bab 2)</small>", cb(["Tentukan lokasi stasiun","Semua tas, sepatu, kunci sudah di stasiun sebelum tidur","Tetap siapkan baju besok"]) + '<p class="small">Perhatikan besok: berapa kali terdengar "ada yang lihat ... nggak?"</p>', "")}
{card("Hari 3: Mami Siap Duluan <small>(Bab 3)</small>", cb(["Pasang alarm sesuai jam &quot;Mami bangun&quot;","Besok pagi: selesai bersiap sebelum membangunkan anak","Tetap jalankan Hari 1 dan 2"]) + '<p class="small">Perhatikan besok: apakah perhatianmu terasa lebih utuh untuk anak?</p>', "")}
{card("Hari 4: Jalankan Timeline <small>(Bab 3)</small>", cb(["Timeline versimu sudah terisi dan ditempel","Besok pagi: ikuti urutan timeline","Catat langkah mana yang paling molor","Tetap jalankan Hari 1&ndash;3"]), "")}
{card("Hari 5: Kenalkan Chart Rutinitas <small>(Bab 4)</small>", cb(["Chart rutinitas dibuat dan ditempel (Bonus 1)","Cara menandai langkah sudah ditentukan","Tulis dua skrip pengganti teriak dan tempel di dekat timeline","Tetap jalankan Hari 1&ndash;4"]) + '<p class="small">Perhatikan besok: berapa kali kamu perlu mengulang instruksi?</p>', "")}
{card("Hari 6: Siapkan Rencana B <small>(Bab 5)</small>", cb(["Isi Daftar Pendamping Cadangan","Simpan template pesan izin sekolah dan kantor di HP","Cek atau belanja Stok Pagi Darurat","Tetap jalankan Hari 1&ndash;5"]), "")}
''', z=1.04)

page('sun', 'Bagian 4 · Mulai · Bab 7', f'''
{card("Hari 7: Satu Tugas Tetap untuk Suami <small>(Bab 6)</small>", cb(["Mengobrol dengan suami (atau anggota keluarga yang membantu)","Satu tugas tetap sudah disepakati","Template pembagian tugas terisi dan ditempel","Tetap jalankan Hari 1&ndash;6"]) + '<p class="small">Kenapa di hari terakhir? Karena setelah enam hari, kamu sudah punya sistem nyata untuk ditunjukkan, bukan hanya rencana.</p>', "m")}
{h2("Tracker 7 Hari")}
<p>Isi setiap sore atau malam. Versi siap cetak tersedia di Bonus 4. Setelah hari ketujuh, bandingkan dengan catatan pagi pertamamu di Bab 1.</p>
{h2("Setelah Hari Ketujuh")}
<ul>
<li><b>Pertahankan yang berhasil.</b> Simpan yang membuat pagi lebih ringan, sesuaikan yang masih terasa berat.</li>
<li><b>Evaluasi sebulan sekali.</b> Anak tumbuh, jadwal sekolah berubah; luangkan lima belas menit di akhir bulan.</li>
<li><b>Naikkan kemandirian anak pelan-pelan,</b> satu langkah demi satu langkah.</li>
<li><b>Kembali ke buku ini kapan saja.</b> Setelah libur panjang atau anak naik kelas, ulangi Challenge 7 Hari. Biasanya jauh lebih cepat karena dasarnya sudah ada.</li>
</ul>
{aksi("Tentukan tanggal mulai Challenge 7 Hari dan tulis di kalender.", fill(["Tanggal mulai Hari 1","Waktu mengisi tracker setiap hari","Tanggal evaluasi bulanan pertama"]) + p("Satu tanggal. Itu langkah pertamanya."))}
''')

# ---------- PENUTUP ----------
page('cream', 'Penutup', f'''
{hero("penutup.jpg")}
{h2("Penutup")}
<p>Mami, pagi yang kamu jalani setiap hari adalah pekerjaan yang jarang terlihat. Tidak ada yang memberi nilai untuk bekal yang sudah siap, anak yang berangkat dengan baju lengkap, atau kamu yang tiba di kantor tepat waktu setelah mengurus semuanya.</p>
<p>Buku ini tidak menjanjikan pagi yang sempurna. Akan tetap ada hari yang berantakan, anak yang rewel, dan alarm yang terlewat. Yang kamu punya sekarang adalah sistem yang bisa diulang, dan cara untuk kembali ke jalur setelah hari yang sulit.</p>
{h2("Satu Permintaan Terakhir, Mami")}
<p>Workbook ini hanya akan bekerja kalau <b>dikerjakan</b>, bukan hanya dibaca.</p>
<p>Kita semua pernah begitu: beli planner, semangat di hari pertama, lalu filenya tenggelam di folder Download. Atau sudah dicetak rapi, lalu tersimpan di laci dan tidak pernah disentuh lagi. Buku ini dibuat supaya tidak bernasib sama.</p>
<p>Kamu tidak perlu mengerjakan semuanya. Tapi kerjakan <b>sesuatu</b>, dan mulailah malam ini:</p>
<ul>
<li><b>Cetak satu halaman saja,</b> checklist malam di Bonus 2, lalu tempel di kulkas.</li>
<li><b>Isi satu tabel saja,</b> misalnya Aksi Hari Ini di Bab 1.</li>
<li><b>Tulis tanggal mulai Challenge 7 Hari</b> di kalender HP-mu sekarang, sebelum menutup file ini.</li>
</ul>
<p>Tidak apa-apa kalau tulisannya berantakan, tabelnya dicoret-coret, atau checklist-nya bolong di beberapa malam. Workbook yang penuh coretan justru tanda sedang dipakai.</p>
''', z=1.0)

page('cream', 'Penutup', f'''
{aksi("Janji kecil untuk diri sendiri", tbl(["Yang akan aku lakukan","Kapan"],[["Halaman pertama yang aku cetak","&nbsp;"],["Aksi pertama yang aku kerjakan","&nbsp;"],["Tanggal mulai Challenge 7 Hari","&nbsp;"]],"fill",["58%","42%"]) + p("Satu langkah kecil yang dikerjakan jauh lebih berarti daripada seluruh buku yang hanya disimpan."))}
<div class="bigmsg" style="margin-top:8mm">Semoga lebih banyak pagi yang <em>tenang</em>, Mami.</div>
<p class="big">Semoga lebih banyak pagi di rumahmu yang berjalan tenang. Dan semoga di perjalanan berangkat kerja, yang ikut bersamamu bukan lagi rasa bersalah, tapi sedikit lega.</p>
<p class="center" style="margin-top:12mm"><span class="logowrap">{img("logo.png","logo")}</span></p>
''', z=1.1)

# ---------- BONUS ----------
page('dark', 'Bonus printable', f'''
<div style="text-align:center;padding-top:42mm">
<div class="stk">Bonus printable</div>
<div class="bigmsg" style="font-size:34pt;margin:7mm 0 5mm;color:#FFD23F">Siap Cetak,<br><span style="color:#fff">Siap Tempel</span></div>
<p class="big">Empat lembar yang bisa kamu cetak dan pakai langsung.</p>
<div style="max-width:120mm;margin:8mm auto 0;text-align:left">
{tbl(["#","Printable"],[["1","Chart Rutinitas Pagi Anak (balita &amp; SD)"],["2","Checklist Malam 15 Menit (tempel kulkas)"],["3","30 Ide Sarapan dan Bekal 5 Menit"],["4","Tracker Challenge 7 Hari"]],"",["14%","86%"])}
</div></div>
''', z=1.0)

page('cream', 'Bonus 1 · Chart rutinitas', f'''
<div class="bn"><span class="tag">Bonus 1 &middot; Versi balita (2&ndash;5 tahun)</span><span class="tt">Pagi [Nama Anak]</span></div>
<p>Cetak, tempel sejajar mata anak. Pilih satu versi. Jepit jepitan jemuran di bawah tiap gambar, lalu pindahkan ke kotak "Sudah" setiap langkah selesai.</p>
{img("chart-laki.jpg","strip")}
{tbl(["Bangun","Pipis","Sikat Gigi","Pakai Baju","Makan","Pakai Sepatu"],[["Sudah <span class='box'></span>"]*6],"tall")}
<hr style="border:0;border-top:.5mm dashed #1E1B19;margin:5mm 0">
{img("chart-hijab.jpg","strip")}
{tbl(["Bangun","Pipis","Sikat Gigi","Pakai Baju","Makan","Pakai Sepatu"],[["Sudah <span class='box'></span>"]*6],"tall")}
<p class="center big"><b>Hore, aku siap berangkat!</b></p>
''', z=1.0)

sd_rows = ["Bangun &amp; rapikan selimut","Mandi","Sikat gigi","Pakai seragam lengkap","Sarapan","Taruh piring di tempat cuci","Cek tas: buku, PR, botol minum, bekal","Pakai sepatu","Siap di pintu"]
bx = "<span class='box'></span>"
page('cream', 'Bonus 1 · Chart rutinitas', f'''
<div class="bn"><span class="tag">Bonus 1 &middot; Versi anak SD (6&ndash;10 tahun)</span><span class="tt">Checklist Pagi [Nama Anak]</span></div>
<p>Laminating dulu, lalu centang pakai spidol yang bisa dihapus.</p>
{tbl(["Langkah","Sen","Sel","Rab","Kam","Jum"],[[r]+[bx]*5 for r in sd_rows],"",["44%","11.2%","11.2%","11.2%","11.2%","11.2%"])}
<p class="center big"><b>Semua tercentang = aku keren hari ini!</b></p>
{h2("Versi kosong (sesuaikan dengan timeline-mu)")}
{tbl(["Langkah","Sen","Sel","Rab","Kam","Jum"],[["&nbsp;"]+[bx]*5 for _ in range(6)],"tall",["44%","11.2%","11.2%","11.2%","11.2%","11.2%"])}
''', z=1.0)

page('night', 'Bonus 2 · Tempel di kulkas', f'''
<div class="bn" style="background:#fff;color:var(--ink)"><span class="tag">Bonus 2</span><span class="tt">Tempel di Kulkas</span></div>
{img("bonus2.jpg","strip")}
<div class="grid2">
<div>{card("&#9312; Baju", cb(["Baju anak lengkap (sampai kaus kaki)","Baju kerja Mami lengkap","Taruh di tempat baju besok"]), "y")}
{card("&#9314; Makanan", cb(["Menu sarapan diputuskan","Menu bekal diputuskan","Bahan disiapkan","Kotak bekal siap"]), "y")}</div>
<div>{card("&#9313; Tas &amp; Stasiun", cb(["Tas anak dicek (buku, PR, surat)","Tas Mami dicek (ID, charger, dompet, kunci)","Botol minum dicuci","Semua tas di stasiun"]), "m")}
{card("&#9315; Cek Besok", cb(["Ada acara khusus?","Bensin / saldo aman?","Alarm terpasang"]), "m")}</div></div>
{card("Malam capek? Versi 5 menit", cb(["Baju besok ditentukan","Tas di stasiun","Alarm terpasang"]), "o")}
''', z=1.05)

menu = lambda rows: [[str(n), m, s, a] for n, m, s, a in rows]
H = ["No","Menu","Siapkan malam","Pagi hari"]
W = ["7%","31%","33%","29%"]
page('cream', 'Bonus 3 · 30 ide sarapan & bekal', f'''
<div class="bn"><span class="tag">Bonus 3</span><span class="tt">30 Ide Sarapan dan Bekal 5 Menit</span></div>
<p>"5 menit" adalah waktu di pagi hari, dengan asumsi bahan sudah disiapkan malam sebelumnya. Pilih 5&ndash;7 ide untuk dirotasi setiap minggu. Sesuaikan dengan selera, usia, dan kebutuhan makan anakmu.</p>
{img("bonus3.jpg","strip")}
{h2("Nasi &amp; Lauk")}
{tbl(H, menu([(1,"Nasi telur dadar gulung","Kocok telur + daun bawang, simpan di kulkas","Dadar, gulung, potong"),(2,"Nasi kepal isi abon","Siapkan nasi dan abon","Kepal, isi, bungkus plastik"),(3,"Nasi goreng sederhana","Siapkan nasi dan bumbu","Tumis 3&ndash;4 menit"),(4,"Nasi + nugget/sosis","Siapkan nasi","Goreng/panggang nugget"),(5,"Nasi + telur ceplok kecap","Siapkan nasi","Ceplok telur, beri kecap"),(6,"Nasi + ayam suwir","Suwir ayam masak dari sore","Panaskan, tata di kotak"),(7,"Nasi + tempe/tahu bacem","Bacem akhir pekan, simpan di kulkas","Goreng sebentar"),(8,"Onigiri tuna mayo","Campur tuna + mayo","Bentuk nasi, isi, bungkus")]),"",W)}
''', z=1.0)

page('cream', 'Bonus 3 · 30 ide sarapan & bekal', f'''
{h2("Roti")}
{tbl(H, menu([(9,"Roti selai kacang + pisang","Tidak perlu","Oles, iris pisang, tangkupkan"),(10,"Roti telur","Kocok telur","Celup roti, panggang di teflon"),(11,"Sandwich keju + ham/smoked beef","Tidak perlu","Susun, tangkupkan, potong"),(12,"Roti gulung sosis","Siapkan sosis","Gulung, panggang sebentar"),(13,"Roti bakar cokelat/keju","Tidak perlu","Oles, panggang di teflon"),(14,"Roti isi telur orak-arik","Tidak perlu","Orak-arik, isi ke roti")]),"",W)}
{h2("Mie &amp; Pasta")}
{tbl(H, menu([(15,"Makaroni keju","Rebus makaroni, simpan di kulkas","Panaskan dengan susu + keju"),(16,"Spageti saus bolognese","Saus dari akhir pekan, rebus spageti","Panaskan, campur"),(17,"Bihun goreng","Rendam bihun, siapkan bumbu","Tumis 3&ndash;4 menit"),(18,"Mie telur rebus","Siapkan sayur yang sudah dipotong","Rebus mie + telur + sayur")]),"",W)}
{h2("Siap Beku <small style='font-family:Poppins;font-size:8pt;text-transform:none'>(dibuat akhir pekan, simpan di freezer)</small>")}
{tbl(["No","Menu","Siapkan akhir pekan","Pagi hari"], menu([(27,"Risol/lumpia","Buat dan bekukan","Goreng/air fryer"),(28,"Nugget ayam buatan sendiri","Buat dan bekukan","Goreng/panggang"),(29,"Perkedel kentang","Buat dan bekukan","Goreng"),(30,"Martabak telur mini","Buat dan bekukan","Goreng/panggang")]),"",W)}
''', z=1.0)

page('cream', 'Bonus 3 · 30 ide sarapan & bekal', f'''
{h2("Ringan &amp; Cepat")}
{tbl(H, menu([(19,"Oatmeal/overnight oats","Campur oat + susu, simpan di kulkas","Tambah buah, siap makan"),(20,"Sereal + susu","Tidak perlu","Tuang"),(21,"Pancake","Buat adonan, simpan di kulkas","Tuang, masak di teflon"),(22,"Telur rebus + buah","Rebus telur, simpan di kulkas","Kupas, siapkan buah"),(23,"Kentang rebus + telur","Rebus kentang","Panaskan, tambah telur"),(24,"Jagung rebus","Rebus dari malam","Panaskan"),(25,"Ubi/singkong kukus","Kukus dari malam","Panaskan"),(26,"Bubur instan + topping","Siapkan topping","Seduh, beri topping")]),"",W)}
{h2("Daftar Menu Mingguanku")}
{tbl(["Hari","Sarapan","Bekal"],[[d,"",""] for d in ["Senin","Selasa","Rabu","Kamis","Jumat"]],"tall",["20%","40%","40%"])}
''', z=1.0)

page('sun', 'Bonus 4 · Tracker challenge', f'''
<div class="bn"><span class="tag">Bonus 4</span><span class="tt">Challenge Pagi Tanpa Drama</span></div>
<p><b>Tanggal mulai:</b> ____________________</p>
{tbl(["Hari","Perbaikan","Jalan?","Jam berangkat","Suara naik (0 / 1&ndash;2 / 3+)","Pagi terasa","Catatan kecil"],[
[str(i),t,"","","","",""] for i,t in enumerate(["Siapkan baju malam","Stasiun Siap Berangkat","Mami siap duluan","Jalankan timeline","Chart rutinitas anak","Siapkan Rencana B","Satu tugas tetap suami"],1)],"tall",["7%","22%","9%","13%","16%","16%","17%"])}
<p><b>Lingkari wajah yang paling menggambarkan pagimu hari itu.</b></p>
<div class="mood">{img("mood1.png")}{img("mood2.png")}{img("mood3.png")}</div>
{h2("Sebelum vs Sesudah")}
{tbl(["","Pagi pertama (catatan Bab 1)","Hari ke-7"],[["Jam bangun","",""],["Jam berangkat","",""],["Momen paling macet","",""]],"tall",["26%","40%","34%"])}
''', z=1.0)

page('sun', 'Bonus 4 · Tracker challenge', f'''
{card("Yang paling berhasil untukku:", "<div style='height:42mm'></div>", "y")}
{card("Yang masih perlu disesuaikan:", "<div style='height:42mm'></div>", "m")}
<div class="bigmsg" style="margin-top:10mm;text-align:center">Pagi bukan soal anak <em>lambat</em>.<br>Sistemnya yang <em>belum ada</em>.<br><span style="font-size:14pt">Dan sekarang, sistemnya sudah ada di tanganmu.</span></div>
<p class="center" style="margin-top:8mm"><span class="logowrap">{img("logo.png","logo")}</span></p>
''', z=1.0)
