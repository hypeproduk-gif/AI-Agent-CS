NICHE = "Makeup & Alat Kecantikan"
SETTING = "bright Indonesian bedroom with a vanity mirror"
PLACE = "a bright bedroom in front of a vanity mirror"
FACELESS = "Never show a full face; only hands, lips, one eye, cheek, or hair in close-up."
AMB = "soft natural room sounds"
DEF_M = "makeup cepat luntur"
DEF_K = "awet seharian"
PH = ["lip cream matte", "lipstik nempel di gelas dan cepat hilang", "nggak transfer, awet sampai sore"]
TPL_FILE = "makeup_tpl.json"
TIPS_BROLL = "Rekam pakai HP posisi tegak di depan jendela, jangan pakai filter supaya warna asli kelihatan. Kalau nggak mau tampil wajah, rekam bibir, satu mata, pipi, atau swatch di punggung tangan saja. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar."
CATS = [["Semua", None], ["Bibir & pipi", ["01","02","06","07","09"]], ["Base (cushion, bedak)", ["01","03","05","08"]],
        ["Alat rambut & kecantikan", ["02","04","10"]], ["Barang di bawah Rp50 ribu", ["06","07","09"]]]
START = [
 ("Hari 1","Gaya 07: Tes Ketahanan","Paling gampang. Swatch di tangan, gosok, rekam dari dekat."),
 ("Hari 2","Gaya 02: Hasil Dulu","Tunjukkan hasil jadinya duluan, baru produknya."),
 ("Hari 3","Gaya 03: Makeup 5 Menit","Rekam urutan dandan harianmu."),
 ("Hari 4","Gaya 06: Murah vs Mahal","Penonton suka cari kembaran produk mahal."),
 ("Hari 5","Gaya 09: 1 Produk Banyak Fungsi","Ajak penonton menyimpan video."),
 ("Hari 6","Gaya 08: Review Jujur","Untuk produk yang sudah kamu pakai seminggu lebih."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Kesel", sub="Tunjukkan masalah makeup, lalu solusinya",
 inti="Mulai dari masalah makeup yang sering terjadi (luntur, cakey, nempel di masker), lalu tunjukkan produknya.",
 psikologi="Hampir semua perempuan pernah kesal makeup-nya luntur. Begitu masalahnya muncul di layar, penonton merasa 'ini aku' dan menunggu solusinya.",
 cocok="Lip cream, cushion, setting spray, bedak, maskara",
 hooks=["Lipstik kamu nempel di gelas terus?","Makeup luntur padahal baru jam 10?","Bedak cakey di hidung? Ini sebabnya.","Pakai masker, makeup langsung hilang?","Maskara luntur jadi mata panda?"],
 scripts=[
  S("Lip cream transferproof","18 detik",[
   ("0–3","Lipstik kamu nempel di gelas terus?","NEMPEL DI GELAS? 😩","Gelas dengan bekas lipstik tebal di pinggirnya.","Close-up of a glass rim with a heavy lipstick stain"),
   ("3–8","Aku ganti ke lip cream ini. Oles, tunggu satu menit.","OLES, TUNGGU 1 MENIT","Lip cream dioles ke bibir (bibir saja).","Close-up of lips being painted with a matte lip cream applicator"),
   ("8–14","Minum, makan gorengan, gelasnya tetap bersih.","GELAS TETAP BERSIH ✅","Bibir minum dari gelas, gelas ditunjukkan bersih.","Lips sip from a glass, then the clean glass rim is shown to the camera"),
   ("14–18","Warnanya banyak. Cek keranjang kuning.","CEK KERANJANG 👇","Deretan lip cream di meja rias.","A row of lip cream tubes on a vanity table, a hand points down"),
  ]),
  S("Setting spray","18 detik",[
   ("0–3","Makeup luntur padahal baru jam sepuluh?","BARU JAM 10 UDAH LUNTUR?","Pipi berminyak dari dekat, bedak terlihat pecah.","Close-up of oily cheek skin with broken powder"),
   ("3–8","Langkah terakhir yang sering dilupain: setting spray.","LANGKAH TERAKHIR","Botol setting spray diangkat.","A hand lifts a setting spray bottle near a mirror"),
   ("8–14","Semprot tiga kali, pola huruf X dan T. Makeup jadi menyatu dan awet.","SEMPROT X + T ✅","Semprotan halus di cahaya jendela.","Slow motion fine mist sprayed in front of a mirror, glowing in window light"),
   ("14–18","Wajib buat kondangan. Cek keranjang kuning.","CEK KERANJANG 👇","Botol di tas makeup.","A setting spray bottle in a makeup pouch"),
  ]),
  S("Maskara waterproof","18 detik",[
   ("0–3","Maskara luntur jadi mata panda?","MATA PANDA? 🐼","Bawah mata dengan noda maskara (satu mata saja).","Close-up of one eye with smudged black mascara under it"),
   ("3–8","Coba yang waterproof kayak gini. Sisirnya kecil, bulu mata kecil pun kena.","SISIR KECIL","Maskara disapukan ke bulu mata.","Close-up of a mascara wand coating eyelashes, one eye only"),
   ("8–14","Aku tes kena air, tetap aman.","KENA AIR AMAN ✅","Swatch maskara di tangan disiram air.","Water poured over a mascara swatch on the back of a hand, it stays intact"),
   ("14–18","Cek keranjang kuning ya.","CEK KERANJANG 👇","Tube maskara di meja.","A mascara tube on a vanity table"),
  ]),
 ]),
dict(id="02", name="Hasil Dulu", sub="Tunjukkan hasil jadinya duluan",
 inti="Detik pertama langsung tampilkan hasil akhir yang cantik, baru tunjukkan alat atau produknya.",
 psikologi="Penonton membeli hasil, bukan barang. Hasil yang bikin pengen ditampilkan duluan supaya orang berhenti scroll dan penasaran caranya.",
 cocok="Catokan, curly iron, hair dryer, blush, bulu mata palsu",
 hooks=["Rambut kayak habis dari salon, padahal di rumah.","Tebak ini pakai apa?","5 menit, rambut langsung bervolume.","Ini bukan filter.","Pipi merona alami kayak gini cuma pakai satu barang."],
 scripts=[
  S("Catokan curly 2 in 1","18 detik",[
   ("0–3","(tanpa ngomong, rambut bergelombang dikibaskan)","KAYAK HABIS SALON ✨","Gerakan lambat: rambut bergelombang rapi dikibaskan (rambut saja).","Slow motion of glossy loose waves of black hair swinging, only hair visible"),
   ("3–8","Ini bukan dari salon. Pakai catokan ini di rumah.","DI RUMAH AJA","Catokan dinyalakan, lampu menyala.","A hair styling iron switched on, its indicator light glowing"),
   ("8–14","Jepit, putar, tarik pelan. Bisa lurus, bisa curly.","JEPIT, PUTAR, TARIK ✅","Rambut dijepit, diputar, ditarik, jadi gelombang.","Hands clamp a strand of hair with a flat iron, twist and glide down creating a wave"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Catokan di meja rias.","A hair styling iron on a vanity table"),
  ]),
  S("Blush stick","16 detik",[
   ("0–3","(tanpa ngomong)","PIPI MERONA ALAMI 🌸","Pipi merona dari dekat di cahaya jendela.","Close-up of a naturally flushed cheek in soft window light"),
   ("3–8","Cuma pakai blush stick ini, tiga titik di pipi.","3 TITIK DI PIPI","Blush stick ditotol di pipi.","A cream blush stick dotted three times on a cheek"),
   ("8–12","Tepuk-tepuk pakai jari, menyatu kayak warna asli kulit.","TEPUK PAKAI JARI ✅","Jari menepuk sampai rata.","Fingertips tap cream blush until it blends seamlessly"),
   ("12–16","Bisa buat bibir juga. Keranjang kuning.","CEK KERANJANG 👇","Blush stick di telapak tangan.","A blush stick resting in an open palm"),
  ]),
  S("Hair dryer volume brush","18 detik",[
   ("0–3","(suara hair dryer)","VOLUME KAYAK IKLAN 💁‍♀️","Rambut bervolume dikibaskan.","Slow motion bouncy voluminous blow-dried hair, only hair visible"),
   ("3–8","Rambut aku tipis dan lepek. Ini rahasianya.","DULU LEPEK","Rambut basah dan lepek.","Flat damp limp hair hanging straight"),
   ("8–14","Sisir sambil keringin, dari akar ke ujung. Lima menit beres.","5 MENIT BERES ✅","Sikat pengering menyisir rambut, rambut mengembang.","A hot air volumizing brush combs through hair from root to tip, hair becomes bouncy"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Alat di meja rias.","A hot air brush on a vanity table"),
  ]),
 ]),
dict(id="03", name="Makeup 5 Menit", sub="Urutan dandan harian yang cepat",
 inti="Rekam urutan makeup harian yang cepat, dengan produk yang dijual sebagai bintangnya.",
 psikologi="Ibu-ibu nggak punya banyak waktu. Video 'cuma 5 menit' terasa bisa ditiru, dan penonton menonton sampai habis untuk lihat hasil akhirnya.",
 cocok="Cushion, bedak, pensil alis, lip & cheek, makeup set",
 hooks=["Makeup 5 menit buat antar anak sekolah.","Makeup kantor cuma 3 barang.","Dandan cepat tapi tetap segar.","Makeup buat yang nggak bisa makeup.","Pagi buru-buru? Ini urutannya."],
 scripts=[
  S("Cushion","20 detik",[
   ("0–4","Makeup lima menit buat antar anak sekolah.","CUMA 5 MENIT ⏱️","Tiga produk di meja, jam menunjukkan pagi.","Three makeup products on a vanity next to a clock showing early morning"),
   ("4–10","Pertama, cushion. Tepuk tipis-tipis, langsung rata.","1. CUSHION","Puff menepuk cushion ke pipi.","A puff presses into a cushion compact and pats onto a cheek"),
   ("10–15","Terus alis sama lip cream, selesai.","2. ALIS 3. BIBIR","Alis dan bibir dari dekat.","Quick close-ups of an eyebrow being filled and lips being tinted"),
   ("15–20","Cushion-nya ringan dan nggak bikin kusam. Cek keranjang kuning.","CEK KERANJANG 👇","Cushion dibuka di meja.","An open cushion compact on a vanity table"),
  ]),
  S("Pensil alis 2 in 1","18 detik",[
   ("0–4","Alis berantakan bikin makeup kelihatan nggak rapi.","ALIS = KUNCI","Alis tanpa makeup dari dekat.","Close-up of a sparse uneven eyebrow"),
   ("4–10","Pensil ini ada sikatnya. Gambar tipis, terus sisir.","GAMBAR + SISIR","Pensil menggambar helai alis, lalu disisir.","A brow pencil draws fine strokes, then a spoolie brushes them"),
   ("10–15","Hasilnya natural, kayak alis asli.","NATURAL ✅","Alis rapi dari dekat.","Close-up of a neat natural-looking eyebrow"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Pensil alis di meja.","A brow pencil on a vanity table"),
  ]),
  S("Lip & cheek tint","18 detik",[
   ("0–4","Makeup kantor cuma butuh satu barang ini.","CUMA 1 BARANG","Tint di tangan.","A lip and cheek tint held in a hand"),
   ("4–10","Tepuk di pipi biar segar, terus oles di bibir.","PIPI + BIBIR","Tint ditepuk di pipi, lalu di bibir.","Tint dabbed onto a cheek and blended, then applied on lips"),
   ("10–15","Warnanya senada, kelihatan segar seharian.","SENADA ✅","Bibir dan pipi dari dekat.","Close-up of matching rosy lips and cheek"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Tint di tas kerja.","A tint tube inside a work bag"),
  ]),
 ]),
dict(id="04", name="Cerita \"Kayak Aku Banget\"", sub="Ceritakan dari sudut pandang penonton",
 inti="Pilih satu tipe orang (ibu baru, kerja kantoran, rambut tipis) dan ceritakan dari sudut pandangnya.",
 psikologi="Penonton membayangkan dirinya memakai produk itu. Barang terasa dibuat khusus untuk masalahnya.",
 cocok="Hair dryer, catokan, set kuas, bulu mata, alat kecantikan",
 hooks=["POV: ibu baru yang nggak sempat ke salon.","POV: rambut tipis yang capek lepek terus.","POV: mau kondangan tapi nggak mau bayar MUA.","POV: kerja kantoran, berangkat jam 6 pagi.","POV: pertama kali belajar makeup."],
 scripts=[
  S("Set kuas makeup","20 detik",[
   ("0–4","POV: bingung kuas mana buat apa.","POV: PEMULA MAKEUP 🙋‍♀️","Tangan memegang banyak kuas bingung.","Hands holding a messy bunch of different makeup brushes, unsure"),
   ("4–10","Set ini ada tulisan fungsinya di gagang.","ADA TULISAN FUNGSINYA","Gagang kuas dari dekat.","Close-up of labeled makeup brush handles"),
   ("10–16","Bulunya lembut, nggak rontok, hasilnya rata.","LEMBUT, NGGAK RONTOK ✅","Kuas diusap ke punggung tangan.","A soft makeup brush swept across the back of a hand"),
   ("16–20","Lengkap sama tasnya. Cek keranjang kuning.","CEK KERANJANG 👇","Set kuas dalam tas.","A makeup brush set arranged in a pouch"),
  ]),
  S("Bulu mata palsu magnetik","18 detik",[
   ("0–4","POV: mau kondangan tapi nggak bisa pasang bulu mata pakai lem.","NGGAK BISA PAKAI LEM? 😅","Lem bulu mata belepotan di jari.","Messy lash glue stuck on fingertips"),
   ("4–10","Ini pakai magnet. Oles eyeliner-nya, tempel bulu matanya.","PAKAI MAGNET","Bulu mata menempel sendiri di garis eyeliner (satu mata).","A magnetic false lash snapping onto magnetic eyeliner, one eye only"),
   ("10–14","Lima detik nempel, bisa dipakai berkali-kali.","5 DETIK NEMPEL ✅","Mata berkedip, bulu mata tetap.","Close-up of one eye blinking with magnetic lashes staying in place"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Kotak bulu mata di meja.","A magnetic lash kit box on a vanity table"),
  ]),
  S("Catokan mini portable","18 detik",[
   ("0–4","POV: ibu kerja, rambut kusut habis pakai helm.","KUSUT HABIS PAKAI HELM 🪖","Rambut kusut di depan cermin (rambut saja).","Frizzy flattened hair after wearing a helmet"),
   ("4–10","Aku bawa catokan mini ini di tas. Pakai USB.","MUAT DI TAS + USB","Catokan mini dikeluarkan dari tas, dicolok USB.","A mini hair straightener taken out of a handbag and plugged into a USB power bank"),
   ("10–14","Dua menit, rambut rapi lagi.","2 MENIT RAPI ✅","Rambut dicatok jadi rapi.","A mini straightener glides through hair leaving it smooth"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Catokan di tas.","A mini straightener inside an open handbag"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang tepat",
 inti="Ajari cara memilih (shade, tanggal kedaluwarsa, BPOM, panas alat), lalu tunjukkan produkmu yang lolos.",
 psikologi="Orang takut salah shade atau beli produk palsu. Tips yang berguna bikin kamu dipercaya sebagai teman yang paham.",
 cocok="Cushion, foundation, catokan, bedak, produk di atas Rp100 ribu",
 hooks=["Jangan beli cushion sebelum cek shade dengan cara ini.","Kenapa foundation kamu jadi abu-abu?","Catokan bikin rambut gosong? Cek ini dulu.","Cara bedain makeup asli dan palsu.","3 hal yang harus dicek sebelum checkout makeup."],
 scripts=[
  S("Cushion (pilih shade)","22 detik",[
   ("0–4","Jangan beli cushion sebelum cek shade dengan cara ini.","CEK SHADE DULU ✋","Beberapa cushion berjejer.","Several cushion compacts lined up on a table"),
   ("4–10","Jangan tes di tangan. Tes di rahang, karena warnanya beda.","TES DI RAHANG","Tiga garis swatch di rahang (rahang saja).","Three foundation swatch lines on a jawline, only jaw visible"),
   ("10–16","Pilih yang hilang menyatu. Kulit sawo matang biasanya cocok shade natural atau warm.","PILIH YANG MENYATU ✅","Swatch yang menyatu ditunjuk.","A finger points at the swatch that blends perfectly into the skin"),
   ("16–22","Cushion ini shade-nya banyak buat kulit Indonesia. Keranjang kuning.","CEK KERANJANG 👇","Cushion dibuka.","An open cushion compact held toward the camera"),
  ]),
  S("Catokan pengatur suhu","20 detik",[
   ("0–4","Catokan bikin rambut gosong? Cek ini dulu.","RAMBUT GOSONG? 🔥","Ujung rambut kering bercabang.","Close-up of dry split hair ends"),
   ("4–10","Pilih yang bisa atur suhu. Rambut tipis cukup suhu rendah.","BISA ATUR SUHU","Layar suhu catokan ditekan.","A finger presses buttons on a hair straightener temperature display"),
   ("10–16","Platnya keramik, jadi panasnya rata dan nggak narik rambut.","PLAT KERAMIK ✅","Plat dari dekat, catok meluncur halus.","Close-up of ceramic plates, then the iron glides smoothly through hair"),
   ("16–20","Yang ini lolos semua. Cek keranjang kuning.","CEK KERANJANG 👇","Catokan diangkat.","A hand holds up a hair straightener"),
  ]),
  S("Bedak tabur","20 detik",[
   ("0–4","Bedak kamu bikin muka abu-abu di foto?","ABU-ABU DI FOTO? 📸","Pipi dengan bedak putih tebal.","Close-up of cheek with thick white powder flashback"),
   ("4–10","Pilih bedak tabur yang transparan dan butirannya halus.","TRANSPARAN + HALUS","Bedak diusap di punggung tangan, hilang menyatu.","Translucent loose powder swept on the back of a hand, disappearing into skin"),
   ("10–16","Hasilnya matte tapi tetap kelihatan kulit asli.","MATTE NATURAL ✅","Pipi matte natural.","Close-up of naturally matte cheek skin"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Wadah bedak dibuka.","An open jar of loose powder on a vanity"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan produk mahal dengan produkmu yang hasilnya mirip tapi jauh lebih murah.",
 psikologi="Produk mahal jadi pembanding, sehingga produkmu terasa sangat worth it. Penonton senang merasa dapat 'kembaran' yang hemat.",
 cocok="Lip cream, cushion, setting spray, beauty blender, palet",
 hooks=["Lipstik 500 ribu vs 35 ribu.","Aku nemu kembaran makeup mahal.","Beauty blender 300 ribu vs 15 ribu.","Hasilnya sama, harganya beda 10 kali.","Jangan beli yang mahal dulu sebelum lihat ini."],
 scripts=[
  S("Beauty sponge","20 detik",[
   ("0–4","Spons makeup 300 ribu vs 15 ribu. Bedanya apa?","300RB vs 15RB 🤔","Dua spons di meja.","Two makeup sponges side by side on a vanity"),
   ("4–10","Aku basahin dua-duanya. Sama-sama mengembang.","SAMA-SAMA MENGEMBANG","Dua spons dibasahi, mengembang.","Two makeup sponges soaked in water, both expanding"),
   ("10–16","Hasil foundation-nya? Sama-sama rata dan nggak nyerap banyak.","HASIL SAMA RATA ✅","Dua sisi punggung tangan dengan foundation rata.","Foundation blended evenly on two areas of the back of a hand with two sponges"),
   ("16–20","Beli yang murah dapat lima. Keranjang kuning.","DAPAT 5 👇","Lima spons warna-warni.","Five colorful makeup sponges in a row"),
  ]),
  S("Lip cream lokal","20 detik",[
   ("0–4","Lipstik 500 ribu vs lip cream 35 ribu.","500RB vs 35RB 💄","Dua produk bibir berdampingan.","A luxury lipstick and an affordable lip cream side by side"),
   ("4–10","Aku swatch di tangan, terus aku gosok tisu.","SWATCH + GOSOK TISU","Dua swatch, tisu diusap.","Two lip swatches on a hand, a tissue rubbed over them"),
   ("10–15","Yang murah malah lebih awet, nggak pindah ke tisu.","YANG MURAH LEBIH AWET ✅","Tisu bersih di sisi lip cream.","Close-up showing one swatch smudged and the other intact"),
   ("15–20","Cek keranjang kuning, warnanya banyak.","CEK KERANJANG 👇","Deretan lip cream.","A row of lip cream shades"),
  ]),
  S("Setting spray lokal","20 detik",[
   ("0–4","Setting spray 600 ribu vs 60 ribu.","600RB vs 60RB","Dua botol berdampingan.","Two setting spray bottles side by side"),
   ("4–10","Semprotannya sama-sama halus kayak kabut.","SAMA-SAMA HALUS","Dua semprotan halus di cahaya jendela.","Two fine mists sprayed side by side in window light"),
   ("10–16","Aku tes delapan jam di cuaca panas, makeup tetap aman.","8 JAM AMAN ✅","Pipi makeup tetap rapi sore hari.","Close-up of intact makeup on cheek skin in afternoon light"),
   ("16–20","Hemat 500 ribu. Keranjang kuning.","HEMAT 500RB 👇","Botol murah diangkat.","A hand holds up the affordable setting spray"),
  ]),
 ]),
dict(id="07", name="Tes Ketahanan", sub="Swatch, gosok, siram",
 inti="Uji produk langsung di depan kamera: swatch, gosok, siram air, tempel masker. Hampir tanpa ngomong.",
 psikologi="Tes langsung adalah bukti yang tidak bisa dibantah. Video tes enak ditonton dan bikin orang penasaran sampai akhir.",
 cocok="Lip cream, eyeliner, maskara, alis, foundation",
 hooks=["Aku siram air, tahan nggak?","Tes masker: nempel atau nggak?","Gosok 10 kali, masih ada?","Tes paling kejam buat eyeliner.","Tahan minyak goreng nggak ya?"],
 scripts=[
  S("Eyeliner spidol waterproof","16 detik",[
   ("0–3","Tes paling kejam buat eyeliner.","TES PALING KEJAM 💀","Garis eyeliner di punggung tangan.","A sharp black eyeliner line drawn on the back of a hand"),
   ("3–8","(tanpa ngomong)","DISIRAM AIR 💧","Air disiram ke garis eyeliner.","Water poured over an eyeliner swatch"),
   ("8–12","(tanpa ngomong)","DIGOSOK 10X","Jari menggosok, garis tetap tajam.","A finger rubs the swatch repeatedly, line stays sharp"),
   ("12–16","Masih utuh. Cek keranjang kuning.","MASIH UTUH ✅👇","Garis eyeliner utuh ditunjukkan.","Close-up of an intact eyeliner line on wet skin"),
  ]),
  S("Lip cream (tes masker)","16 detik",[
   ("0–3","Tes masker: nempel atau nggak?","TES MASKER 😷","Lip cream dioles di bibir.","Lips painted with matte lip cream"),
   ("3–9","(tanpa ngomong)","(tanpa tulisan)","Masker dipakai, ditekan, lalu dibuka.","A face mask pressed over lips, then removed"),
   ("9–13","Bagian dalam masker bersih.","MASKER BERSIH ✅","Bagian dalam masker ditunjukkan.","The clean inside of a face mask shown to the camera"),
   ("13–16","Cek keranjang kuning.","CEK KERANJANG 👇","Lip cream di meja.","A lip cream tube on a vanity"),
  ]),
  S("Pensil alis waterproof","16 detik",[
   ("0–3","Habis wudu alis hilang?","HABIS WUDU HILANG? 💦","Air membasuh alis (alis saja).","Water splashed over an eyebrow, only brow visible"),
   ("3–9","(tanpa ngomong)","(tanpa tulisan)","Swatch pensil alis disiram dan diusap.","A brow pencil swatch on a hand rinsed with water and wiped"),
   ("9–13","Tetap ada, nggak luntur.","TETAP ADA ✅","Swatch utuh.","An intact brow swatch on wet skin"),
   ("13–16","Cek keranjang kuning.","CEK KERANJANG 👇","Pensil alis di meja.","A brow pencil on a vanity"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah dipakai beberapa kali, sebut kekurangannya duluan, baru kelebihannya, lalu cocok untuk siapa.",
 psikologi="Kejujuran bikin penonton percaya. Pembeli sudah tahu apa yang diharapkan, jadi jarang kecewa.",
 cocok="Cushion, palet, hair dryer, catokan, produk di atas Rp100 ribu",
 hooks=["Seminggu pakai cushion viral ini, jujurnya…","Bukan endorse, aku beli sendiri.","Yang nggak dibilang orang soal produk ini.","Jangan beli ini kalau kulitmu…","Plus minus setelah sebulan."],
 scripts=[
  S("Cushion viral","22 detik",[
   ("0–4","Seminggu pakai cushion ini. Aku jujur ya.","SEMINGGU, JUJUR","Cushion di tangan.","A cushion compact held in a hand"),
   ("4–10","Minusnya: kalau kulitmu kering, bisa kelihatan pecah di pipi. Pakai pelembap dulu.","❌ KULIT KERING: PAKAI PELEMBAP","Pipi dengan sedikit garis kering.","Close-up of slight dry patches on a cheek"),
   ("10–17","Plusnya: ringan, nutupin kemerahan, dan awet sampai sore.","✅ RINGAN ✅ AWET","Pipi rata sore hari.","Close-up of even cheek skin in afternoon light"),
   ("17–22","Cocok buat kulit normal ke berminyak. Keranjang kuning.","COCOK BUAT KAMU? 👇","Cushion di meja.","A cushion compact on a vanity table"),
  ]),
  S("Hair dryer ionic","22 detik",[
   ("0–4","Sebulan pakai hair dryer ini. Ada yang aku nggak suka.","SEBULAN PAKAI","Hair dryer di meja.","A hair dryer on a vanity table"),
   ("4–10","Minusnya: agak berat kalau dipakai lama.","❌ AGAK BERAT","Tangan memegang hair dryer, terlihat pegal.","A hand holding a hair dryer, wrist tilting from the weight"),
   ("10–17","Tapi rambut jadi nggak kusut dan lebih cepat kering.","✅ NGGAK KUSUT ✅ CEPAT","Rambut halus setelah dikeringkan.","Smooth shiny hair after blow drying, only hair visible"),
   ("17–22","Worth it buat rambut panjang. Keranjang kuning.","CEK KERANJANG 👇","Hair dryer dan sisir.","A hair dryer next to a brush"),
  ]),
  S("Palet eyeshadow","20 detik",[
   ("0–4","Plus minus palet ini setelah sebulan.","PLUS MINUS","Palet dibuka.","An eyeshadow palette opened"),
   ("4–10","Minusnya: warna glitter-nya agak susah diambil.","❌ GLITTER SUSAH","Jari mengambil glitter.","A finger dabbing a glitter shade"),
   ("10–16","Tapi warna matte-nya lembut dan cocok buat sehari-hari.","✅ MATTE LEMBUT","Swatch warna matte di tangan.","Soft matte eyeshadow swatches on the back of a hand"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Palet di meja.","An eyeshadow palette on a vanity"),
  ]),
 ]),
dict(id="09", name="1 Produk, Banyak Fungsi", sub="Satu barang, banyak kegunaan",
 inti="Tunjukkan beberapa cara pakai produk yang jarang orang tahu.",
 psikologi="Makin banyak kegunaan, makin murah terasa. Orang menyimpan video tips untuk dicoba nanti.",
 cocok="Lip & cheek, pensil coklat, bedak tabur, vaseline, setting spray",
 hooks=["Satu barang ini gantiin 3 makeup.","Kamu cuma pakai ini buat bibir? Sayang.","3 cara pakai yang jarang orang tahu.","Simpan video ini sebelum kondangan.","Makeup minimalis buat ibu-ibu."],
 scripts=[
  S("Lip & cheek tint","20 detik",[
   ("0–3","Satu barang ini bisa gantiin tiga makeup.","1 BARANG = 3 MAKEUP","Tint di tangan.","A lip and cheek tint in a hand"),
   ("3–8","Satu: lipstik.","CARA #1 💋","Dioles di bibir.","Tint applied on lips"),
   ("8–13","Dua: blush on.","CARA #2 🌸","Ditepuk di pipi.","Tint dabbed and blended on a cheek"),
   ("13–20","Tiga: eyeshadow tipis. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Ditepuk di kelopak mata (satu mata).","Tint lightly tapped on one eyelid"),
  ]),
  S("Pensil coklat (eyebrow)","20 detik",[
   ("0–3","Pensil alis ini bukan cuma buat alis.","BUKAN CUMA ALIS","Pensil coklat di tangan.","A brown brow pencil in a hand"),
   ("3–8","Satu: alis.","CARA #1","Mengisi alis.","Filling an eyebrow with a brown pencil"),
   ("8–13","Dua: eyeliner coklat yang lembut.","CARA #2","Garis tipis di kelopak (satu mata).","A soft brown line along one upper lash line"),
   ("13–20","Tiga: tahi lalat manis. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Titik kecil di pipi.","A tiny beauty mark dotted on a cheek"),
  ]),
  S("Bedak tabur transparan","18 detik",[
   ("0–3","Bedak tabur punya tiga fungsi rahasia.","3 FUNGSI RAHASIA","Wadah bedak dibuka.","An open jar of translucent powder"),
   ("3–8","Satu: kunci makeup.","CARA #1","Bedak ditepuk.","A puff presses loose powder onto a cheek"),
   ("8–13","Dua: bikin lipstik matte lebih awet.","CARA #2","Tisu di bibir, bedak ditepuk di atasnya.","Powder tapped through a tissue placed over lips"),
   ("13–18","Tiga: rambut lepek jadi bervolume. Simpan, link di keranjang.","CARA #3 + SIMPAN 👇","Bedak di akar rambut.","Translucent powder dusted onto hair roots, only hair visible"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Bandingkan dengan biaya salon",
 inti="Bandingkan harga alat dengan biaya ke salon atau MUA supaya terasa sebagai tabungan.",
 psikologi="Biaya salon yang rutin terasa besar. Kalau alatnya balik modal dalam beberapa kali pakai, harga jadi terasa murah.",
 cocok="Catokan, hair dryer, alat curly, set kuas, nail kit",
 hooks=["Catok di salon 50 ribu. Catokan ini balik modal 3 kali pakai.","Berhenti bayar salon tiap minggu.","Aku hitungin biar kamu nggak kaget.","Kondangan sebulan 3 kali? Hitung ini.","Lebih murah dari sekali ke salon."],
 scripts=[
  S("Catokan 2 in 1","20 detik",[
   ("0–4","Catok di salon 50 ribu. Ini balik modal 3 kali pakai.","BALIK MODAL 3X PAKAI 🧮","Kalkulator HP dan catokan.","A smartphone calculator next to a hair straightener"),
   ("4–10","Setahun bisa habis 1,2 juta di salon.","SETAHUN 1,2 JUTA 💸","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Sekarang aku catok sendiri, hasilnya rapi juga.","CATOK SENDIRI ✅","Rambut dicatok rapi.","A hair straightener gliding through smooth hair"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Catokan di meja.","A hair straightener on a vanity"),
  ]),
  S("Nail kit / kutek set","20 detik",[
   ("0–4","Manikur di salon 80 ribu. Aku hitungin kalau di rumah.","SALON 80RB 💅","Kuku cantik dan kalkulator.","Neatly painted nails next to a smartphone calculator"),
   ("4–10","Satu set ini bisa dipakai puluhan kali.","PULUHAN KALI PAKAI","Isi set kutek dibuka.","A nail kit with polishes and tools laid out"),
   ("10–16","Hasilnya rapi, sambil nonton TV di rumah.","RAPI DI RUMAH ✅","Kutek dioles rapi.","A brush painting a fingernail neatly"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Set kutek.","A nail kit on a table"),
  ]),
  S("Curly iron otomatis","20 detik",[
   ("0–4","Curly di salon 100 ribu, sekali pakai.","SALON 100RB SEKALI","Rambut curly dan kalkulator.","Curled hair next to a smartphone calculator"),
   ("4–10","Alat ini cuma dua kali biaya salon.","= 2X BIAYA SALON","Alat curly otomatis di tangan.","An automatic hair curler held in a hand"),
   ("10–16","Rambut masuk sendiri, keluar langsung curly.","MASUK SENDIRI ✅","Rambut tersedot dan keluar curly.","Hair being drawn into an automatic curler and released as a curl"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Alat di meja rias.","An automatic curler on a vanity"),
  ]),
 ]),
]
