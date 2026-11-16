NICHE = "Gadget & Aksesoris HP"
SETTING = "clean modern Indonesian home desk"
PLACE = "a clean modern home desk with a laptop"
FACELESS = "Only hands visible, no face."
AMB = "natural indoor sounds"
DEF_M = "HP cepat habis baterai"
DEF_K = "lebih praktis dipakai sehari-hari"
PH = ["powerbank 10000 mAh", "baterai HP habis di jalan", "tipis, fast charging, muat di saku"]
TPL_FILE = "gadget_tpl.json"
TIPS_BROLL = "Rekam di meja bersih dengan cahaya jendela, HP perekam ditaruh di penyangga. Cukup tangan. Tunjukkan angka nyata (persen baterai, jam, kecepatan) di layar supaya dipercaya. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar."
CATS = [["Semua", None], ["Charger & powerbank", ["01","03","05","10"]], ["Audio (TWS, speaker)", ["02","06","08"]],
        ["Aksesoris HP", ["04","07","09"]], ["Barang di atas Rp200 ribu", ["06","08","10"]]]
START = [
 ("Hari 1","Gaya 03: Balapan Waktu","Paling gampang. Tes cas dua HP berdampingan."),
 ("Hari 2","Gaya 01: Masalah yang Bikin Kesel","Tunjukkan masalah sehari-hari, lalu solusinya."),
 ("Hari 3","Gaya 07: Unboxing yang Bikin Puas","Hampir tanpa ngomong, cukup suara kemasan."),
 ("Hari 4","Gaya 06: Murah vs Mahal","Penonton gadget suka banget perbandingan."),
 ("Hari 5","Gaya 05: Jangan Beli Sebelum Cek Ini","Ajari cara cek kapasitas asli dan sertifikasi."),
 ("Hari 6","Gaya 08: Review Jujur","Untuk barang yang sudah dipakai seminggu lebih."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Kesel", sub="Tunjukkan masalah, lalu solusinya",
 inti="Mulai dari masalah HP sehari-hari (baterai habis, kabel rusak, HP jatuh), lalu tunjukkan produknya.",
 psikologi="Semua orang pernah panik baterai habis atau HP jatuh. Masalah yang dikenali bikin penonton berhenti dan menunggu solusinya.",
 cocok="Powerbank, kabel, holder, casing, tempered glass",
 hooks=["Baterai HP tinggal 5% pas lagi di jalan?","Kabel charger kamu kayak gini?","HP jatuh, layar retak lagi?","Pegal pegang HP pas nonton?","Charger lama banget penuhnya?"],
 scripts=[
  S("Powerbank magnetic","18 detik",[
   ("0–3","Baterai HP tinggal lima persen pas lagi di jalan?","BATERAI 5%? 😱","Layar HP baterai merah 5%.","Close-up of a phone screen showing a red 5% battery warning"),
   ("3–8","Ribet bawa kabel, colokan nggak ada.","RIBET BAWA KABEL","Tangan mencari kabel di tas berantakan.","A hand digging through a messy bag for a charging cable"),
   ("8–14","Powerbank ini nempel di belakang HP, langsung ngecas. Tanpa kabel.","NEMPEL, LANGSUNG NGECAS ✅","Powerbank ditempel magnet ke HP, ikon charging muncul.","A slim magnetic power bank snaps onto the back of a phone and the charging icon appears"),
   ("14–18","Tipis, muat di saku. Cek keranjang kuning.","CEK KERANJANG 👇","HP dan powerbank masuk saku.","A phone with a magnetic power bank slipped into a jacket pocket"),
  ]),
  S("Kabel data braided","18 detik",[
   ("0–3","Kabel charger kamu kayak gini?","KABEL KAYAK GINI? 😬","Kabel lama terkelupas di ujung.","Close-up of a frayed broken charging cable end"),
   ("3–8","Ganti kabel tiap bulan, boros.","GANTI TIAP BULAN","Tumpukan kabel rusak.","A pile of broken charging cables"),
   ("8–14","Kabel ini dilapisi anyaman, aku tekuk-tekuk tetap kuat.","DITEKUK TETAP KUAT ✅","Kabel ditekuk dan ditarik.","Hands bend and tug a braided charging cable repeatedly"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Kabel tergulung rapi.","A neatly coiled braided cable on a desk"),
  ]),
  S("Holder HP lipat","18 detik",[
   ("0–3","Pegal pegang HP pas nonton atau video call?","PEGAL PEGANG HP? 😩","Tangan pegal memegang HP.","A tired hand holding up a phone while watching a video"),
   ("3–8","Holder lipat ini tinggal buka, taruh HP.","BUKA, TARUH","Holder dibuka, HP diletakkan.","A foldable phone stand unfolded and a phone placed on it"),
   ("8–14","Tingginya bisa diatur, pas buat masak sambil nonton resep.","TINGGI BISA DIATUR ✅","Holder dinaikkan di meja dapur.","An adjustable phone stand raised on a counter showing a recipe video"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Holder terlipat kecil.","A folded phone stand next to a phone"),
  ]),
 ]),
dict(id="02", name="Hasil Dulu", sub="Tunjukkan hasilnya duluan",
 inti="Detik pertama tunjukkan hasil yang bikin penasaran: suara jernih, foto bagus, layar mulus.",
 psikologi="Penonton membeli gadget karena hasilnya. Hasil yang ditampilkan duluan bikin mereka penasaran alat apa yang dipakai.",
 cocok="TWS, mic clip-on, ring light, lensa HP, speaker",
 hooks=["Dengerin bedanya pakai headset.","Ini direkam pakai HP, bukan kamera.","Tebak harganya.","Suara jernih padahal di pinggir jalan.","Foto produk kayak studio, di meja rumah."],
 scripts=[
  S("Mic wireless clip-on","18 detik",[
   ("0–3","Ini aku ngomong di pinggir jalan raya.","DI PINGGIR JALAN 🚗","Mic kecil terjepit di baju, latar jalan ramai.","A tiny wireless clip-on mic attached to a shirt collar, busy street blurred behind"),
   ("3–8","Suaranya tetap jernih kan? Bising jalannya hampir nggak kedengeran.","TETAP JERNIH ✅","Receiver dicolok ke HP.","A wireless mic receiver plugged into a phone"),
   ("8–14","Tinggal colok ke HP, langsung nyambung. Cocok buat ngonten.","COLOK, NYAMBUNG","Tangan menyalakan mic, lampu biru menyala.","A hand switches on a wireless mic, blue indicator light glows"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Set mic dalam case.","A wireless mic set in its charging case"),
  ]),
  S("Ring light + tripod","16 detik",[
   ("0–3","(tanpa ngomong)","FOTO KAYAK STUDIO 📸","Foto produk terang dan rapi di layar HP.","A phone screen showing a bright clean product photo"),
   ("3–8","Foto ini diambil di meja rumah, pakai ring light ini.","DI MEJA RUMAH","Ring light dinyalakan di meja.","A ring light switching on over a small desk setup"),
   ("8–12","Ada tiga warna lampu dan tripod-nya bisa tinggi.","3 WARNA + TRIPOD ✅","Warna lampu diganti.","A ring light cycling between warm, neutral and cool colors"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Ring light berdiri.","A ring light on a tripod in a room"),
  ]),
  S("TWS earbuds ANC","18 detik",[
   ("0–3","(suara bising, lalu sunyi)","BISING → SUNYI 🎧","Earbuds dipasang, suasana kafe ramai.","Earbuds being put in at a noisy busy cafe, close-up of ear only"),
   ("3–8","Ini fitur peredam bising. Suara kafe langsung hilang.","PEREDAM BISING","Jari mengetuk earbud.","A finger taps an earbud to switch on noise cancellation"),
   ("8–14","Baterainya tahan seharian sama case-nya.","TAHAN SEHARIAN ✅","Case dibuka, earbuds di dalam.","An earbuds case opened showing the buds charging"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Case di meja.","An earbuds case on a desk"),
  ]),
 ]),
dict(id="03", name="Balapan Waktu", sub="Tes langsung berdampingan",
 inti="Tes dua barang berdampingan dengan angka yang terlihat: persen baterai, waktu, kecepatan.",
 psikologi="Angka nyata adalah bukti paling kuat untuk pembeli gadget. Format lomba membuat penonton menonton sampai ada pemenang.",
 cocok="Charger fast charging, kabel, powerbank, flashdisk",
 hooks=["Charger biasa vs fast charging, 30 menit.","Tes cas dua HP barengan.","Siapa yang penuh duluan?","Stopwatch nyala.","Selisihnya bikin kaget."],
 scripts=[
  S("Charger fast charging 33W","20 detik",[
   ("0–4","Charger biasa vs fast charging. Tes tiga puluh menit.","BIASA vs FAST ⏱️","Dua HP 10% dicolok berdampingan.","Two phones side by side both at 10% battery being plugged in"),
   ("4–10","Mulai dari sepuluh persen dua-duanya.","MULAI 10%","Layar dua HP.","Close-up of two phone screens showing 10% battery"),
   ("10–16","Tiga puluh menit: yang biasa baru 35, yang ini udah 70 persen.","35% vs 70% ✅","Dua layar HP menunjukkan persen berbeda.","Two phone screens showing 35% and 70% battery"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Charger di meja.","A fast charger brick on a desk"),
  ]),
  S("Flashdisk USB 3.0","18 detik",[
   ("0–4","Flashdisk lama vs USB 3.0. Copy film dua giga.","LAMA vs USB 3.0 ⏱️","Dua flashdisk dicolok di laptop.","Two USB flash drives plugged into a laptop"),
   ("4–10","Yang baru selesai dalam setengah menit.","BARU: 30 DETIK","Progress bar cepat penuh.","A file copy progress bar filling quickly on a laptop screen"),
   ("10–14","Yang lama masih lima menit lagi.","LAMA: 5 MENIT 😴","Progress bar lambat.","A slow file copy progress bar"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Flashdisk di tangan.","A USB flash drive in a palm"),
  ]),
  S("Kabel 3 in 1","18 detik",[
   ("0–4","Tiga HP, satu kabel. Bisa?","3 HP, 1 KABEL","Tiga HP berbeda di meja.","Three different phones on a desk"),
   ("4–10","Kabel ini punya tiga ujung, semua ngecas barengan.","CAS BARENGAN ✅","Tiga HP dicolok, ikon charging muncul.","A 3-in-1 cable charging three phones at once"),
   ("10–14","Nggak perlu rebutan colokan di rumah.","NGGAK REBUTAN","Satu stopkontak.","A single wall socket with one plug"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Kabel tergulung.","A coiled 3-in-1 cable"),
  ]),
 ]),
dict(id="04", name="Cerita \"Kayak Aku Banget\"", sub="Ceritakan dari sudut pandang penonton",
 inti="Pilih satu tipe orang (ojol, pekerja WFH, gamer, ibu yang suka nonton drakor) dan ceritakan dari sudut pandangnya.",
 psikologi="Penonton membayangkan dirinya memakai barang itu dalam kesehariannya, sehingga terasa sebagai kebutuhan.",
 cocok="Holder motor, stand laptop, cooling pad, lampu meja",
 hooks=["POV: ojol yang HP-nya harus nyala seharian.","POV: WFH, leher pegal tiap sore.","POV: nonton drakor sampai malam.","POV: anak sekolah online.","POV: jualan online dari HP."],
 scripts=[
  S("Holder HP motor anti getar","20 detik",[
   ("0–4","POV: ojol yang HP-nya harus kelihatan terus.","POV: OJOL 🛵","Setang motor.","A scooter handlebar in daylight"),
   ("4–10","Holder ini dijepit kuat, jalan berlubang pun HP nggak lepas.","JEPIT KUAT","Holder dipasang, motor melewati jalan bergelombang.","A phone holder clamped on handlebars, phone stays steady on a bumpy road"),
   ("10–16","Ada peredam getar, jadi kamera HP aman.","PEREDAM GETAR ✅","Bagian peredam dari dekat.","Close-up of the vibration dampener on a phone mount"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Holder di motor terparkir.","A phone holder on a parked scooter"),
  ]),
  S("Stand laptop lipat","18 detik",[
   ("0–4","POV: kerja di rumah, leher pegal tiap sore.","POV: WFH, LEHER PEGAL 😣","Laptop rendah di meja.","A laptop sitting low and flat on a dining table"),
   ("4–10","Stand ini bikin layar sejajar mata.","LAYAR SEJAJAR MATA","Stand dibuka, laptop naik.","A foldable laptop stand raising a laptop to eye level"),
   ("10–14","Bisa dilipat masuk tas.","BISA DILIPAT ✅","Stand dilipat tipis.","The laptop stand folded flat"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Stand di meja.","A laptop stand on a desk"),
  ]),
  S("Lampu meja LED","18 detik",[
   ("0–4","POV: anak belajar malam, lampu kamar redup.","POV: BELAJAR MALAM 📚","Meja belajar redup.","A dim study desk at night"),
   ("4–10","Lampu ini terangnya bisa diatur, cahayanya nggak bikin silau.","NGGAK SILAU","Lampu dinyalakan dan diatur.","A desk lamp turned on and brightness adjusted with a touch"),
   ("10–14","Bisa dicas, jadi nggak repot kabel.","BISA DICAS ✅","Lampu dicolok USB.","A desk lamp charging via USB"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Lampu menyala di meja.","A glowing desk lamp over open books"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang aman",
 inti="Ajari cara mengecek gadget yang aman dan sesuai klaim, lalu tunjukkan produkmu yang lolos.",
 psikologi="Banyak gadget murah klaimnya palsu. Tips mengecek bikin kamu dipercaya seperti teman yang paham teknologi.",
 cocok="Powerbank, charger, kabel, memory card",
 hooks=["Jangan beli powerbank sebelum cek ini.","Charger murah bisa bikin HP rusak?","Kapasitas powerbank kamu asli nggak?","Cara cek memory card palsu.","3 hal yang dicek sebelum beli charger."],
 scripts=[
  S("Powerbank bersertifikat","20 detik",[
   ("0–4","Jangan beli powerbank sebelum cek ini.","CEK DULU ✋","Beberapa powerbank.","Several power banks on a desk"),
   ("4–10","Cek nomor SNI, dan pastikan kapasitasnya masuk akal sama ukurannya.","CEK SNI + KAPASITAS","Jari menunjuk label di powerbank.","A finger points at the certification label on a power bank"),
   ("10–16","Yang ini ada SNI-nya dan ada pengaman panas berlebih.","LOLOS ✅","Powerbank mengecas HP.","A power bank charging a phone"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Powerbank di tangan.","A power bank held in a hand"),
  ]),
  S("Charger original","20 detik",[
   ("0–4","Charger murah bisa bikin baterai cepat drop.","CHARGER MURAH? ⚠️","Charger tanpa merek.","An unbranded charger brick"),
   ("4–10","Pilih yang ada sertifikasi dan pengaman arus.","PILIH YANG ADA PENGAMAN","Label pada charger dari dekat.","Close-up of labels printed on a charger"),
   ("10–16","Yang ini aman dan tetap cepat.","AMAN + CEPAT ✅","Charger mengecas HP.","A charger fast-charging a phone"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Charger di meja.","A charger on a desk"),
  ]),
  S("Memory card","20 detik",[
   ("0–4","Memory card kamu kapasitasnya asli nggak?","ASLI NGGAK? 🤔","Memory card di jari.","A microSD card between fingers"),
   ("4–10","Cek pakai aplikasi tes kapasitas, gratis.","TES PAKAI APLIKASI","Layar laptop menjalankan tes.","A laptop screen running a storage test"),
   ("10–16","Yang ini hasil tesnya sesuai. Cocok buat CCTV dan HP.","HASIL SESUAI ✅","Memory card masuk CCTV.","A microSD card inserted into a home security camera"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Kemasan memory card.","A memory card in its package"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan gadget bermerek mahal dengan produkmu yang fungsinya mirip.",
 psikologi="Pembeli gadget suka merasa pintar. Produk mahal jadi pembanding sehingga produkmu terasa paling masuk akal.",
 cocok="TWS, smartwatch, speaker, keyboard",
 hooks=["TWS 3 juta vs 300 ribu.","Smartwatch mahal vs ini.","Dengerin bedanya.","Fiturnya sama, harganya beda 10 kali.","Kembaran gadget mahal."],
 scripts=[
  S("TWS murah","20 detik",[
   ("0–4","TWS tiga juta vs tiga ratus ribu. Dengerin bedanya.","3 JUTA vs 300RB 🎧","Dua case TWS.","Two earbuds cases side by side"),
   ("4–10","Buat dengar musik dan telepon, suaranya mirip.","SUARA MIRIP","Earbuds dipakai bergantian (telinga saja).","Earbuds placed in an ear, close-up of ear only"),
   ("10–16","Bedanya di fitur kecil. Buat sehari-hari, ini cukup.","BUAT SEHARI-HARI CUKUP ✅","Case dibuka.","An affordable earbuds case opening"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","TWS di meja.","Earbuds on a desk"),
  ]),
  S("Smartwatch","20 detik",[
   ("0–4","Smartwatch enam juta vs enam ratus ribu.","6 JUTA vs 600RB ⌚","Dua jam di pergelangan.","Two smartwatches on wrists side by side"),
   ("4–10","Dua-duanya bisa notifikasi WA, hitung langkah, dan pantau tidur.","FITUR UTAMA SAMA","Layar notifikasi.","A smartwatch screen showing a message notification"),
   ("10–16","Baterai yang murah malah lebih awet, seminggu.","BATERAI SEMINGGU ✅","Layar baterai.","A smartwatch showing a battery level"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Jam di kotak.","A smartwatch in its box"),
  ]),
  S("Speaker bluetooth","18 detik",[
   ("0–4","Speaker dua juta vs dua ratus ribu.","2 JUTA vs 200RB 🔊","Dua speaker.","Two bluetooth speakers side by side"),
   ("4–10","Buat di kamar atau piknik, suaranya udah kencang.","UDAH KENCANG","Speaker di meja piknik.","A bluetooth speaker on a picnic blanket"),
   ("10–14","Tahan cipratan air juga.","TAHAN CIPRATAN ✅","Air dicipratkan.","Water splashed on a speaker"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Speaker diangkat.","A hand lifts a speaker"),
  ]),
 ]),
dict(id="07", name="Unboxing yang Bikin Puas", sub="Buka kemasan, cukup suara",
 inti="Rekam unboxing dari dekat dengan suara kemasan yang jelas, hampir tanpa ngomong.",
 psikologi="Unboxing memberi rasa senang seperti membuka hadiah. Penonton ikut merasakan dan penasaran isinya.",
 cocok="TWS, smartwatch, keyboard, aksesoris setup meja",
 hooks=["Unboxing paling satisfying.","Tonton pakai suara 🔊","Setup meja kerja baru.","Paket datang!","Isinya lengkap banget."],
 scripts=[
  S("Keyboard wireless","18 detik",[
   ("0–3","(suara plastik dibuka)","PAKET DATANG 📦","Kotak dibuka pelan.","Slow close-up of a box lid being lifted"),
   ("3–11","(tanpa ngomong, suara ketikan)","(tanpa tulisan)","Keyboard dikeluarkan, diketik.","A wireless keyboard unwrapped and typed on with satisfying clicky sounds"),
   ("11–15","Bisa nyambung ke HP, tablet, dan laptop.","NYAMBUNG KE 3 ALAT ✅","Keyboard dipakai dengan tablet.","A wireless keyboard typing into a tablet"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Setup meja rapi.","A tidy desk setup with the keyboard"),
  ]),
  S("Lampu LED strip meja","18 detik",[
   ("0–3","(tanpa ngomong)","SETUP MEJA BARU ✨","Meja gelap.","A plain desk in a dark room"),
   ("3–11","(tanpa ngomong)","(tanpa tulisan)","Lampu strip ditempel di belakang meja.","Hands stick an LED strip behind a desk"),
   ("11–15","Warnanya bisa diganti dari HP.","GANTI WARNA DARI HP ✅","Warna berganti.","LED strip glowing and changing colors"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Meja bercahaya.","A desk glowing with ambient light"),
  ]),
  S("Smartwatch anak","18 detik",[
   ("0–3","(suara kemasan)","HADIAH BUAT ANAK 🎁","Kotak dibuka.","A colorful box being opened"),
   ("3–11","(tanpa ngomong)","(tanpa tulisan)","Jam dikeluarkan dan dinyalakan.","A kids smartwatch taken out and switched on"),
   ("11–15","Bisa telepon dan lacak lokasi anak dari HP orang tua.","TELEPON + LACAK ✅","Layar HP menampilkan peta.","A parent's phone screen showing a map location"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Jam di pergelangan kecil.","A smartwatch on a child's small wrist"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah dipakai beberapa minggu, sebut kekurangannya duluan, lalu kelebihannya dan cocok untuk siapa.",
 psikologi="Pembeli gadget sering kecewa dengan klaim berlebihan. Review jujur bikin kamu dipercaya dan mengurangi komplain.",
 cocok="TWS, smartwatch, kamera CCTV, produk di atas Rp200 ribu",
 hooks=["Sebulan pakai TWS ini, jujurnya…","Bukan endorse, aku beli sendiri.","Ada yang nggak aku suka.","Jangan beli ini kalau kamu…","Plus minus setelah sebulan."],
 scripts=[
  S("Kamera CCTV wifi","22 detik",[
   ("0–4","Sebulan pakai CCTV ini di rumah. Aku jujur ya.","SEBULAN, JUJUR","Kamera di sudut ruangan.","A small wifi security camera in the corner of a room"),
   ("4–10","Minusnya: rekaman malam agak buram kalau ruangan gelap total.","❌ MALAM AGAK BURAM","Layar HP rekaman malam.","A phone screen showing a grainy night recording"),
   ("10–17","Tapi bisa pantau rumah dari HP dan ada notif kalau ada gerakan.","✅ PANTAU DARI HP","Notifikasi gerakan di HP.","A phone receiving a motion alert notification"),
   ("17–22","Cocok buat pantau anak atau rumah kosong. Keranjang kuning.","COCOK BUAT KAMU? 👇","Kamera terpasang.","A mounted security camera"),
  ]),
  S("TWS gaming","20 detik",[
   ("0–4","Plus minus TWS ini setelah sebulan.","PLUS MINUS","TWS di meja.","Earbuds on a desk"),
   ("4–10","Minusnya: case-nya agak besar buat saku.","❌ CASE AGAK BESAR","Case di saku.","An earbuds case bulging in a pocket"),
   ("10–16","Tapi delay-nya kecil, cocok buat game dan nonton.","✅ DELAY KECIL","HP main game.","Hands playing a mobile game"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Case dibuka.","An earbuds case opened"),
  ]),
  S("Tripod HP bluetooth","20 detik",[
   ("0–4","Dua minggu pakai tripod ini buat ngonten.","2 MINGGU PAKAI","Tripod berdiri.","A phone tripod standing on a floor"),
   ("4–10","Minusnya: kalau dinaikkan paling tinggi, agak goyang.","❌ PALING TINGGI GOYANG","Tripod tinggi bergoyang.","A fully extended tripod wobbling slightly"),
   ("10–16","Tapi ringan, ada remote, dan bisa jadi tongsis.","✅ RINGAN + REMOTE","Remote ditekan.","A thumb presses a bluetooth shutter remote"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Tripod terlipat.","A folded phone tripod"),
  ]),
 ]),
dict(id="09", name="1 Alat, Banyak Fungsi", sub="Satu barang, banyak kegunaan",
 inti="Tunjukkan fungsi yang jarang orang tahu supaya produk terasa lebih bernilai.",
 psikologi="Makin banyak fungsi, makin murah terasa. Tips tersembunyi mendorong orang menyimpan video.",
 cocok="Ring holder, OTG, stylus, kabel organizer",
 hooks=["Ring di belakang HP ini bisa buat 3 hal.","OTG ini fungsinya bukan cuma colok flashdisk.","3 fungsi tersembunyi.","Simpan video ini.","Satu aksesoris, gantiin tiga."],
 scripts=[
  S("Ring holder HP","20 detik",[
   ("0–3","Ring di belakang HP ini bisa buat tiga hal.","1 RING = 3 FUNGSI","Ring di belakang HP.","A ring holder on the back of a phone"),
   ("3–8","Satu: pegangan biar HP nggak jatuh.","CARA #1","Jari masuk ring.","A finger through a phone ring grip"),
   ("8–13","Dua: berdiri buat nonton.","CARA #2","HP berdiri di meja dengan ring.","A phone standing on a table using its ring as a kickstand"),
   ("13–20","Tiga: nempel di holder magnet mobil. Simpan, link di keranjang.","CARA #3 + SIMPAN 👇","HP menempel di holder mobil.","A phone with a ring holder snapping onto a magnetic car mount"),
  ]),
  S("OTG Type-C","20 detik",[
   ("0–3","OTG ini bukan cuma buat flashdisk.","BUKAN CUMA FLASHDISK","OTG di tangan.","A small USB-C OTG adapter in a hand"),
   ("3–8","Satu: pindahin foto dari flashdisk.","CARA #1","Flashdisk dicolok ke HP.","A flash drive plugged into a phone via OTG"),
   ("8–13","Dua: colok mouse buat kerja di HP.","CARA #2","Mouse terhubung.","A mouse connected to a phone via OTG"),
   ("13–20","Tiga: colok keyboard. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Keyboard terhubung.","A keyboard connected to a phone via OTG"),
  ]),
  S("Pena stylus","18 detik",[
   ("0–3","Stylus murah ini berguna banget.","BERGUNA BANGET","Stylus di tangan.","A stylus pen in a hand"),
   ("3–8","Satu: tanda tangan digital.","CARA #1","Tanda tangan di layar.","A stylus signing on a phone screen"),
   ("8–13","Dua: anak belajar menulis di tablet.","CARA #2","Tangan kecil menulis.","A child's hand writing on a tablet with a stylus"),
   ("13–18","Tiga: edit foto lebih presisi. Simpan, link di keranjang.","CARA #3 + SIMPAN 👇","Edit foto.","A stylus editing a photo on a tablet"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Hitung berapa yang dihemat",
 inti="Ubah harga gadget jadi hitungan hemat dibanding biaya rutin atau barang sekali pakai.",
 psikologi="Gadget terasa mahal sampai dihitung manfaatnya. Hitungan sederhana bikin pembelian terasa masuk akal.",
 cocok="Powerbank, smart plug, lampu tenaga surya, CCTV",
 hooks=["Smart plug ini bikin tagihan listrik turun?","Aku hitungin biar kamu nggak kaget.","Lebih murah dari sekali servis.","Jangan bilang mahal sebelum lihat ini.","Balik modal dalam sebulan."],
 scripts=[
  S("Smart plug wifi","20 detik",[
   ("0–4","Colokan pintar ini bikin listrik lebih hemat. Aku hitungin.","LISTRIK LEBIH HEMAT? 🧮","Smart plug dan kalkulator.","A smart plug next to a smartphone calculator"),
   ("4–10","Dulu dispenser sama TV standby nyala terus semalaman.","STANDBY SEMALAMAN","Lampu standby menyala.","Standby lights glowing on appliances at night"),
   ("10–16","Sekarang mati otomatis pakai jadwal dari HP.","MATI OTOMATIS ✅","Jadwal diatur di aplikasi.","A phone app setting a schedule for a smart plug"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Smart plug terpasang.","A smart plug in a wall socket"),
  ]),
  S("Lampu tenaga surya","20 detik",[
   ("0–4","Lampu teras tanpa bayar listrik.","TANPA BAYAR LISTRIK ☀️","Lampu surya di teras.","A solar wall light on a porch"),
   ("4–10","Siang ngecas pakai matahari, malam nyala sendiri.","SIANG CAS, MALAM NYALA","Panel kena sinar matahari.","A small solar panel in sunlight"),
   ("10–16","Nggak perlu kabel, dan nyala otomatis ada sensor gerak.","SENSOR GERAK ✅","Lampu menyala saat ada orang lewat.","A solar light turning on as someone walks by at night"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Lampu menyala malam.","A glowing solar light at night"),
  ]),
  S("Powerbank 20000 mAh","20 detik",[
   ("0–4","Powerbank ini bisa ngecas HP berapa kali? Aku hitungin.","BERAPA KALI? 🧮","Powerbank dan HP.","A large power bank next to a phone"),
   ("4–10","Kapasitas segini bisa ngecas HP sekitar empat kali.","± 4X CAS","Layar indikator powerbank.","A power bank display showing percentage"),
   ("10–16","Mudik dan liburan nggak perlu cari colokan.","NGGAK CARI COLOKAN ✅","Powerbank di tas travel.","A power bank in a travel bag"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Powerbank diangkat.","A hand holds up a power bank"),
  ]),
 ]),
]
