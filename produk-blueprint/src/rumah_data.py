NICHE = "Rumah & Kebersihan"
SETTING = "clean simple Indonesian home interior"
PLACE = "a clean bright Indonesian living room"
FACELESS = "Only hands visible, no face."
AMB = "natural home sounds"
DEF_M = "rumah cepat kotor dan berantakan"
DEF_K = "bersih lebih cepat tanpa capek"
PH = ["alat pel putar", "ngepel capek dan lantai tetap lengket", "peras otomatis, lantai cepat kering"]
TPL_FILE = "rumah_tpl.json"
TIPS_BROLL = "Rekam pakai HP posisi tegak, siang hari dengan jendela terbuka. Cukup tangan, nggak perlu tampil wajah. Rekam kondisi sebelum dan sesudah dari sudut yang sama persis supaya perbedaannya kelihatan. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar."
CATS = [["Semua", None], ["Alat bersih-bersih", ["01","02","03","07"]], ["Rak & penyimpanan", ["04","07","09"]],
        ["Cairan pembersih", ["01","05","06"]], ["Barang di atas Rp150 ribu", ["06","08","10"]]]
START = [
 ("Hari 1","Gaya 02: Sebelum-Sesudah","Paling gampang. Rekam bagian kotor, bersihkan, rekam lagi dari sudut yang sama."),
 ("Hari 2","Gaya 07: Beres-beres yang Bikin Puas","Hampir tanpa ngomong, cukup suara."),
 ("Hari 3","Gaya 01: Masalah yang Bikin Kesel","Barang yang sama dengan gaya beda."),
 ("Hari 4","Gaya 03: Balapan Waktu","HP ditaruh di penyangga, layar dibagi dua di CapCut."),
 ("Hari 5","Gaya 09: 1 Alat, Banyak Fungsi","Ajak penonton menyimpan video."),
 ("Hari 6","Gaya 08: Review Jujur","Untuk barang yang sudah dipakai seminggu lebih."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Kesel", sub="Tunjukkan masalah, lalu solusinya",
 inti="Mulai dari kotoran atau kerepotan yang semua orang alami, lalu tunjukkan alatnya bekerja.",
 psikologi="Kotoran membandel bikin kesal semua ibu rumah tangga. Begitu penonton melihat masalah yang sama, mereka menunggu solusinya sampai akhir.",
 cocok="Pembersih kerak, alat pel, sikat, pembersih kaca",
 hooks=["Kerak kamar mandi kamu kayak gini?","Ngepel capek tapi lantai masih lengket?","Kaca jendela belang terus?","Debu di sela-sela susah dibersihin?","Bau apek di lemari nggak hilang-hilang?"],
 scripts=[
  S("Cairan pembersih kerak","18 detik",[
   ("0–3","Kerak kamar mandi kamu kayak gini?","KERAK MEMBANDEL? 😩","Dari dekat: keramik kamar mandi berkerak kuning.","Close-up of yellow limescale stains on bathroom tiles"),
   ("3–8","Digosok sampai pegel tetap nggak hilang.","DIGOSOK NGGAK HILANG","Tangan menggosok keras, kerak tetap.","A hand scrubbing hard with a brush, stains remain"),
   ("8–14","Semprot ini, diamkan lima menit, sikat sebentar, bilas.","SEMPROT, DIAMKAN 5 MENIT ✅","Disemprot, didiamkan, disikat ringan, dibilas jadi putih.","Cleaner sprayed on tiles, then a light brush stroke and rinse reveals clean white tiles"),
   ("14–18","Cek keranjang kuning ya.","CEK KERANJANG 👇","Botol pembersih di pinggir bak.","A cleaner spray bottle on the edge of a bathtub, a hand points down"),
  ]),
  S("Pel putar (spin mop)","20 detik",[
   ("0–3","Ngepel capek tapi lantai masih lengket?","LANTAI MASIH LENGKET? 😤","Kaki menginjak lantai lengket (kaki saja).","Bare feet stepping on a sticky dull floor"),
   ("3–8","Pel biasa diperas pakai tangan, airnya masih banyak.","PERAS PAKAI TANGAN","Tangan memeras pel kain kotor.","Hands wringing a dirty cloth mop"),
   ("8–15","Pel ini diperas tinggal injak, muter sendiri. Lantai cepat kering.","INJAK, MUTER SENDIRI ✅","Kaki menginjak pedal ember, kepala pel berputar, lalu ngepel.","A foot presses a spin mop bucket pedal, the mop head spins dry, then glides across a shiny floor"),
   ("15–20","Cek keranjang kuning.","CEK KERANJANG 👇","Pel dan ember di pojok rumah.","A spin mop and bucket in the corner of a clean room"),
  ]),
  S("Wiper kaca 2 sisi","18 detik",[
   ("0–3","Kaca jendela belang terus?","KACA BELANG? 🪟","Kaca dengan bekas lap belang.","Close-up of a window with streaky smears in sunlight"),
   ("3–8","Lap pakai kain malah makin belang.","LAP KAIN = BELANG","Kain mengelap kaca.","A cloth wiping a window leaving streaks"),
   ("8–14","Pakai wiper ini: sisi spons buat gosok, sisi karet buat tarik air.","GOSOK + TARIK ✅","Wiper digosok lalu ditarik, kaca bening.","A two-sided window squeegee scrubs then pulls water off, leaving clear glass"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Wiper di dekat jendela.","A window squeegee leaning by a clean window"),
  ]),
 ]),
dict(id="02", name="Sebelum-Sesudah", sub="Tunjukkan perubahan yang jelas",
 inti="Rekam kondisi kotor, proses singkat, dan hasil bersih dari sudut yang sama persis.",
 psikologi="Perubahan dari kotor ke bersih memberi rasa puas yang besar. Bukti visual ini lebih meyakinkan daripada kalimat apa pun.",
 cocok="Pembersih kerak, sikat elektrik, vacuum, pembersih sofa",
 hooks=["Sofa 5 tahun nggak dicuci, aku bersihin.","Sebelum dan sesudah, nggak pakai edit.","Kamar mandi ini bikin aku malu.","Lihat airnya…","Ini cuma 10 menit."],
 scripts=[
  S("Vacuum cleaner portable","18 detik",[
   ("0–3","Lihat apa yang keluar dari kasur aku.","LIHAT INI 😱","Wadah debu vacuum penuh kotoran.","Close-up of a clear vacuum dust bin full of grey dust"),
   ("3–8","Padahal kasurnya kelihatan bersih.","PADAHAL KELIHATAN BERSIH","Kasur rapi.","A neatly made mattress that looks clean"),
   ("8–14","Vacuum ini kecil tapi isapnya kuat, sekalian bisa buat sofa sama jok motor.","KECIL TAPI KUAT ✅","Vacuum disapukan ke kasur dan sofa.","A handheld vacuum sweeping across a mattress and sofa cushion"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Vacuum di rak.","A handheld vacuum on a shelf"),
  ]),
  S("Sikat elektrik serbaguna","20 detik",[
   ("0–3","Sela keramik hitam gini, kamu gosok pakai apa?","SELA KERAMIK HITAM","Nat keramik hitam dari dekat.","Close-up of blackened tile grout lines"),
   ("3–8","(suara sikat berputar)","(tanpa tulisan)","Sikat elektrik berputar di nat.","An electric spin brush scrubbing grout with foam"),
   ("8–15","Setengah bersih, setengah belum. Bedanya jauh banget.","SEBELUM | SESUDAH ✅","Nat setengah putih setengah hitam.","Grout line half clean white and half black side by side"),
   ("15–20","Kepala sikatnya bisa diganti. Keranjang kuning.","CEK KERANJANG 👇","Sikat dan kepala gantinya.","An electric brush with interchangeable heads laid out"),
  ]),
  S("Pembersih sofa / karpet","20 detik",[
   ("0–3","Lihat airnya…","LIHAT AIRNYA 🤢","Air kotor di wadah alat.","Murky dirty water in a cleaning machine tank"),
   ("3–8","Ini dari sofa yang tiap hari diduduki.","DARI SOFA INI","Sofa kain bernoda.","A fabric sofa with visible stains"),
   ("8–15","Semprot, sedot. Nodanya hilang, sofa kayak baru.","SEMPROT, SEDOT ✅","Alat menyedot noda, kain bersih.","A spot cleaner sprays and suctions a stain off a sofa"),
   ("15–20","Hemat jasa cuci sofa. Keranjang kuning.","CEK KERANJANG 👇","Sofa bersih.","A clean fabric sofa in a bright living room"),
  ]),
 ]),
dict(id="03", name="Balapan Waktu", sub="Cara lama lawan alat baru",
 inti="Layar dibagi dua: cara lama di kiri, alat baru di kanan, sambil dihitung waktunya.",
 psikologi="Orang penasaran siapa yang menang, jadi menonton sampai habis. Selisih waktu membuat manfaat alat langsung terasa.",
 cocok="Sapu karet, vacuum, pel, alat lipat baju, setrika uap",
 hooks=["Sapu biasa vs sapu ini. Siapa menang?","Lipat baju manual vs pakai papan ini.","Setrika biasa vs setrika uap.","Stopwatch nyala, siap?","Selisihnya bikin aku nyesel."],
 scripts=[
  S("Sapu karet rambut","18 detik",[
   ("0–3","Sapu biasa vs sapu karet. Siapa yang bersih?","SAPU BIASA vs KARET","Layar dibagi dua, dua sapu.","Split screen, a regular broom on the left and a rubber broom on the right"),
   ("3–9","Rambut sama debu halus, sapu biasa cuma muter-muter.","KIRI: CUMA MUTER","Sapu biasa, rambut berterbangan.","A regular broom scattering hair and dust on a tiled floor"),
   ("9–14","Sapu karet, semua kumpul jadi satu.","KANAN: KUMPUL SEMUA ✅","Sapu karet mengumpulkan rambut.","A rubber broom gathering all hair and dust into one neat pile"),
   ("14–18","Bisa buat karpet juga. Keranjang kuning.","CEK KERANJANG 👇","Sapu karet bersandar di dinding.","A rubber broom leaning on a wall"),
  ]),
  S("Papan lipat baju","18 detik",[
   ("0–3","Lipat baju manual vs pakai papan ini.","MANUAL vs PAPAN ⏱️","Tumpukan baju dan papan lipat.","A pile of clothes next to a plastic folding board"),
   ("3–9","Satu, dua, tiga, lipat. Lima detik satu baju.","5 DETIK SATU BAJU","Papan dilipat cepat.","Hands flip a folding board panels quickly, folding a shirt neatly"),
   ("9–14","Ukurannya sama semua, lemari jadi rapi.","UKURAN SAMA ✅","Tumpukan baju rapi seragam.","A neat stack of identically folded shirts"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Papan lipat bersandar.","A folding board leaning against a wardrobe"),
  ]),
  S("Setrika uap gantung","20 detik",[
   ("0–3","Setrika biasa vs setrika uap. Mana lebih cepat?","BIASA vs UAP ⏱️","Layar dibagi dua.","Split screen, an iron and board on the left, a garment steamer on the right"),
   ("3–9","Yang kiri masih pasang meja setrika.","KIRI: PASANG MEJA DULU","Meja setrika dibuka.","Hands setting up an ironing board"),
   ("9–15","Yang kanan, baju digantung, uapin, langsung rapi.","KANAN: GANTUNG, UAPIN ✅","Uap menghilangkan kusut di baju gantung.","A handheld steamer smoothing wrinkles from a hanging shirt"),
   ("15–20","Cocok buat yang buru-buru pagi. Keranjang kuning.","CEK KERANJANG 👇","Setrika uap di rak.","A garment steamer on a shelf"),
  ]),
 ]),
dict(id="04", name="Cerita \"Kayak Aku Banget\"", sub="Ceritakan dari sudut pandang penonton",
 inti="Pilih satu tipe orang (ibu tanpa ART, kontrakan sempit, punya kucing) dan ceritakan dari sudut pandangnya.",
 psikologi="Penonton membayangkan dirinya di posisi itu. Barang terasa seperti jawaban untuk kehidupan sehari-harinya.",
 cocok="Rak susun, gantungan, pembersih bulu, organizer",
 hooks=["POV: ibu tanpa ART, rumah harus tetap rapi.","POV: kontrakan sempit, barang banyak.","POV: punya kucing, bulunya di mana-mana.","POV: pulang kerja, rumah berantakan.","POV: tamu datang mendadak."],
 scripts=[
  S("Rak susun serbaguna","20 detik",[
   ("0–4","POV: kontrakan sempit, barang banyak.","POV: KONTRAKAN SEMPIT 🏠","Pojok ruangan penuh barang bertumpuk.","A cramped corner of a small room with items piled on the floor"),
   ("4–10","Aku beli rak susun ini. Pasangnya tanpa alat.","PASANG TANPA ALAT","Rak dirakit dengan tangan.","Hands snap together a tiered storage rack without tools"),
   ("10–16","Barang naik ke atas, lantai jadi lega.","LANTAI JADI LEGA ✅","Rak terisi rapi, lantai kosong.","A tidy storage rack filled with items, clear floor below"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Rak di pojok.","A storage rack in the corner of a tidy room"),
  ]),
  S("Roller pembersih bulu","18 detik",[
   ("0–4","POV: punya kucing, bulunya di mana-mana.","POV: PUNYA KUCING 🐱","Bulu kucing di sofa.","Cat hair covering a dark sofa cushion"),
   ("4–10","Roller ini tinggal gosok bolak-balik.","GOSOK BOLAK-BALIK","Roller digosok di sofa.","A reusable lint roller rolled back and forth over a sofa"),
   ("10–14","Bulunya masuk ke wadah, tinggal buang. Nggak perlu ganti isi.","NGGAK PERLU GANTI ISI ✅","Wadah dibuka, bulu dibuang.","The roller compartment opened and cat hair dumped into a bin"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Roller di sofa bersih.","A lint roller on a clean sofa"),
  ]),
  S("Gantungan baju susun","18 detik",[
   ("0–4","POV: lemari penuh, baju nggak muat.","POV: LEMARI PENUH 😵","Lemari sesak.","A packed wardrobe with clothes crammed together"),
   ("4–10","Satu gantungan ini muat lima baju, tinggal diturunkan.","1 GANTUNGAN = 5 BAJU","Gantungan susun diturunkan vertikal.","A cascading hanger holding five shirts flipped to hang vertically"),
   ("10–14","Lemari langsung lega.","LEMARI LEGA ✅","Lemari rapi dengan ruang kosong.","A tidy wardrobe with free space"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Paket gantungan.","A pack of cascading hangers"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang aman",
 inti="Ajari cara memilih produk kebersihan yang aman dan awet, lalu tunjukkan produkmu yang lolos.",
 psikologi="Orang takut salah beli cairan yang merusak lantai atau berbahaya untuk anak. Tips aman bikin kamu dipercaya.",
 cocok="Cairan pembersih, pengharum ruangan, pel, sapu",
 hooks=["Jangan pakai pembersih ini di lantai marmer.","Pembersih lantai aman buat anak, cek ini.","Kenapa pel kamu cepat bau?","3 hal yang dicek sebelum beli vacuum.","Stop campur cairan pembersih!"],
 scripts=[
  S("Pembersih lantai aman anak","20 detik",[
   ("0–4","Anak suka main di lantai? Cek pembersih lantaimu.","ANAK MAIN DI LANTAI?","Tangan kecil di lantai (tangan saja).","A toddler's small hands playing on a tiled floor"),
   ("4–10","Pilih yang wanginya lembut dan ada keterangan aman untuk keluarga.","WANGI LEMBUT + AMAN","Jari menunjuk label botol.","A finger points to the label on a floor cleaner bottle"),
   ("10–16","Yang ini lolos, dan lantai tetap kinclong.","LOLOS ✅","Lantai mengilap habis dipel.","A shiny freshly mopped floor reflecting window light"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Botol di dekat ember.","A floor cleaner bottle beside a mop bucket"),
  ]),
  S("Kepala pel microfiber","20 detik",[
   ("0–4","Kenapa pel kamu cepat bau?","PEL CEPAT BAU? 🤢","Kepala pel lama kusam.","An old grey smelly mop head"),
   ("4–10","Pel katun gampang lembap dan jamuran. Pilih microfiber yang cepat kering.","PILIH MICROFIBER","Dua bahan pel berdampingan.","Cotton and microfiber mop heads side by side"),
   ("10–16","Bisa dicuci mesin dan dipakai ulang.","BISA DICUCI MESIN ✅","Kepala pel masuk mesin cuci.","A microfiber mop head placed into a washing machine"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Paket kepala pel.","A pack of microfiber mop heads"),
  ]),
  S("Vacuum cleaner kabel","20 detik",[
   ("0–4","Tiga hal yang harus dicek sebelum beli vacuum.","CEK 3 HAL ✋","Beberapa vacuum di toko online (layar HP).","A phone screen showing several vacuum cleaners"),
   ("4–10","Daya isapnya, filternya bisa dicuci, dan panjang kabelnya.","DAYA ✅ FILTER ✅ KABEL ✅","Filter dilepas dan dibilas.","A vacuum filter removed and rinsed under a tap"),
   ("10–16","Yang ini lolos semua, kabelnya lima meter.","LOLOS SEMUA","Vacuum dipakai di karpet.","A vacuum cleaner used on a rug"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Vacuum di pojok.","A vacuum cleaner standing in a corner"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan alat mahal dengan produkmu yang hasilnya mirip.",
 psikologi="Alat mahal jadi pembanding, sehingga produkmu terasa sangat worth it.",
 cocok="Vacuum, pel, pengharum, cairan pembersih",
 hooks=["Vacuum 3 juta vs 300 ribu.","Pembersih impor vs lokal.","Hasilnya sama, harganya beda 10 kali.","Jangan beli yang mahal dulu.","Aku nemu kembaran alat mahal."],
 scripts=[
  S("Vacuum stick murah","20 detik",[
   ("0–4","Vacuum tiga juta vs tiga ratus ribu.","3 JUTA vs 300RB 🤔","Dua vacuum berdampingan.","Two stick vacuums side by side"),
   ("4–10","Aku tabur beras di karpet, dua-duanya aku tes.","TES BERAS DI KARPET","Beras di karpet.","Rice grains scattered on a rug"),
   ("10–16","Dua-duanya bersih sekali sapu. Buat rumah biasa, ini cukup.","SAMA-SAMA BERSIH ✅","Vacuum murah menyedot beras.","An affordable stick vacuum picks up all the rice in one pass"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Vacuum murah diangkat.","A hand lifts the affordable stick vacuum"),
  ]),
  S("Pengharum ruangan reed diffuser","18 detik",[
   ("0–4","Diffuser 400 ribu vs 40 ribu.","400RB vs 40RB","Dua diffuser.","Two reed diffusers side by side"),
   ("4–10","Wanginya sama-sama lembut dan memenuhi ruangan.","WANGI MEMENUHI RUANGAN","Diffuser di meja tamu.","A reed diffuser on a living room table"),
   ("10–14","Yang murah tahan sebulan lebih.","TAHAN SEBULAN ✅","Botol diffuser dari dekat.","Close-up of a reed diffuser bottle"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Diffuser di rak.","A reed diffuser on a shelf"),
  ]),
  S("Cairan pembersih serbaguna","18 detik",[
   ("0–4","Pembersih impor vs lokal. Bedanya apa?","IMPOR vs LOKAL","Dua botol.","Two cleaner spray bottles side by side"),
   ("4–10","Aku tes di noda minyak kompor.","TES NODA MINYAK","Noda minyak di kompor.","Greasy stains on a stovetop"),
   ("10–14","Dua-duanya bersih, yang lokal harganya seperempat.","SAMA BERSIH ✅","Disemprot dan dilap, bersih.","Cleaner sprayed and wiped revealing a clean stovetop"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol lokal diangkat.","A hand holds up the local cleaner bottle"),
  ]),
 ]),
dict(id="07", name="Beres-beres yang Bikin Puas", sub="Dari berantakan jadi rapi, cukup suara",
 inti="Rekam dari berantakan sampai rapi. Biarkan suara yang bicara, hampir tanpa ngomong.",
 psikologi="Video beres-beres enak ditonton berulang kali dan bikin penonton ikut merasa lega. Video yang ditonton ulang lebih sering muncul di beranda.",
 cocok="Organizer laci, kotak penyimpanan, rak sepatu, keranjang",
 hooks=["Beresin laci paling berantakan.","Tonton pakai suara 🔊","Sabtu pagi, beres-beres.","Restock kamar mandi paling satisfying.","Laci ini bikin aku malu."],
 scripts=[
  S("Organizer laci","20 detik",[
   ("0–3","(tanpa ngomong)","LACI AKU SEBELUMNYA 😵","Laci campur aduk.","A messy drawer full of tangled random items"),
   ("3–13","(tanpa ngomong, dekatkan HP supaya suaranya terdengar)","(tanpa tulisan)","Organizer dipasang, barang disusun.","Satisfying sequence of hands placing drawer organizer trays and sorting items into them"),
   ("13–17","(tanpa ngomong)","SESUDAHNYA ✨","Laci rapi.","A perfectly organized drawer, camera slowly pulls back"),
   ("17–20","Link di keranjang kuning.","CEK KERANJANG 👇","Laci ditutup pelan.","A neat drawer slides closed"),
  ]),
  S("Rak sepatu susun","20 detik",[
   ("0–3","(suara sepatu jatuh)","DEPAN PINTU AKU… 😩","Sepatu berserakan di depan pintu.","Shoes piled messily by a front door"),
   ("3–13","(tanpa ngomong)","(tanpa tulisan)","Rak dirakit, sepatu disusun.","Hands assemble a stackable shoe rack and line up shoes on it"),
   ("13–17","(tanpa ngomong)","SESUDAHNYA ✨","Teras rapi.","A tidy entryway with a neat shoe rack"),
   ("17–20","Link di keranjang kuning.","CEK KERANJANG 👇","Rak sepatu.","A shoe rack by a door"),
  ]),
  S("Dispenser sabun & sampo","20 detik",[
   ("0–3","(tanpa ngomong)","KAMAR MANDI AKU 🫣","Botol sabun berantakan di lantai kamar mandi.","Assorted shampoo and soap bottles cluttered on a bathroom floor"),
   ("3–13","(tanpa ngomong, suara tuang)","(tanpa tulisan)","Sabun dan sampo dituang ke dispenser.","Soap and shampoo poured into matching wall-mounted dispensers"),
   ("13–17","(tanpa ngomong)","SESUDAHNYA ✨","Dispenser rapi di dinding.","Matching dispensers neatly mounted on a bathroom wall"),
   ("17–20","Link di keranjang kuning.","CEK KERANJANG 👇","Tangan menekan dispenser.","A hand presses a dispenser pump"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah dipakai seminggu lebih, sebut kekurangannya duluan, lalu kelebihannya dan cocok untuk siapa.",
 psikologi="Kejujuran bikin penonton percaya. Pembeli tahu apa yang diharapkan, jadi jarang kecewa.",
 cocok="Vacuum, robot pel, setrika uap, produk di atas Rp150 ribu",
 hooks=["Sebulan pakai robot vacuum, jujurnya…","Bukan endorse, aku beli sendiri.","Ada yang nggak aku suka.","Jangan beli ini kalau rumahmu…","Plus minus setelah sebulan."],
 scripts=[
  S("Robot vacuum","22 detik",[
   ("0–4","Sebulan pakai robot vacuum. Aku jujur ya.","SEBULAN, JUJUR","Robot di lantai.","A robot vacuum on a tiled floor"),
   ("4–10","Minusnya: suka nyangkut di kabel dan kaki kursi.","❌ NYANGKUT DI KABEL","Robot tersangkut kabel.","A robot vacuum stuck against a cable"),
   ("10–17","Tapi tiap hari lantai bersih tanpa aku sapu. Hemat tenaga banget.","✅ NGGAK PERLU NYAPU","Robot membersihkan sendiri.","A robot vacuum cleaning a floor by itself"),
   ("17–22","Cocok buat rumah yang lantainya lega. Keranjang kuning.","COCOK BUAT KAMU? 👇","Robot di dock.","A robot vacuum on its charging dock"),
  ]),
  S("Setrika uap","20 detik",[
   ("0–4","Dua minggu pakai setrika uap. Ada minusnya.","2 MINGGU PAKAI","Setrika uap di meja.","A garment steamer on a table"),
   ("4–10","Minusnya: kurang rapi buat kerah dan lipatan celana.","❌ KERAH KURANG RAPI","Kerah dari dekat.","Close-up of a shirt collar"),
   ("10–16","Tapi buat gamis dan kemeja, cepat banget dan nggak bikin kain mengilap.","✅ GAMIS & KEMEJA CEPAT","Uap di gamis.","A steamer smoothing a hanging dress"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Setrika uap.","A garment steamer"),
  ]),
  S("Keset microfiber","18 detik",[
   ("0–4","Plus minus keset viral ini.","PLUS MINUS","Keset di depan kamar mandi.","A doormat by a bathroom door"),
   ("4–10","Minusnya: warnanya gampang kotor kalau terang.","❌ WARNA TERANG CEPAT KOTOR","Keset terang.","A light-colored doormat"),
   ("10–14","Plusnya: nyerap air cepat banget, kaki langsung kering.","✅ CEPAT NYERAP","Air dituang, langsung terserap.","Water poured on a doormat absorbs instantly"),
   ("14–18","Pilih warna gelap. Keranjang kuning.","CEK KERANJANG 👇","Keset warna gelap.","A dark doormat"),
  ]),
 ]),
dict(id="09", name="1 Alat, Banyak Fungsi", sub="Satu barang, banyak kegunaan",
 inti="Tunjukkan fungsi yang tidak terduga supaya nilai produk terasa berlipat.",
 psikologi="Makin banyak kegunaan, makin murah terasa. Orang menyimpan videonya untuk dicoba nanti.",
 cocok="Kain microfiber, sikat celah, keranjang lipat, kait tempel",
 hooks=["Kait tempel ini bisa buat 3 hal.","Satu kain buat semua.","3 hack beres-beres yang aku nyesel baru tahu.","Simpan video ini, nanti butuh.","Satu alat, gantiin tiga."],
 scripts=[
  S("Kait tempel tanpa bor","20 detik",[
   ("0–3","Kait tempel ini bisa buat tiga hal.","1 KAIT = 3 FUNGSI","Kait tempel di tangan.","An adhesive wall hook in a hand"),
   ("3–8","Satu: gantung kabel charger.","CARA #1","Kabel digantung di kait.","A charger cable hung on an adhesive hook"),
   ("8–13","Dua: gantung sapu biar nggak jatuh.","CARA #2","Sapu tergantung.","A broom hanging from an adhesive hook"),
   ("13–20","Tiga: gantung tas di balik pintu. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Tas tergantung di pintu.","A bag hanging on an adhesive hook behind a door"),
  ]),
  S("Sikat celah serbaguna","20 detik",[
   ("0–3","Sikat kecil ini masuk ke mana aja.","MASUK KE MANA AJA","Sikat celah di tangan.","A slim crevice brush in a hand"),
   ("3–8","Satu: rel jendela.","CARA #1","Rel jendela digosok.","A crevice brush cleaning a window track"),
   ("8–13","Dua: sela keran.","CARA #2","Sela keran digosok.","A crevice brush cleaning around a faucet base"),
   ("13–20","Tiga: sela keyboard. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Sela keyboard.","A crevice brush cleaning between keyboard keys"),
  ]),
  S("Keranjang lipat","20 detik",[
   ("0–3","Keranjang ini bisa dilipat tipis.","BISA DILIPAT TIPIS","Keranjang dilipat.","A collapsible basket folded flat"),
   ("3–8","Satu: keranjang baju kotor.","CARA #1","Berisi baju.","A collapsible basket filled with laundry"),
   ("8–13","Dua: tempat mainan anak.","CARA #2","Berisi mainan.","A collapsible basket full of toys"),
   ("13–20","Tiga: bawa belanjaan. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Berisi belanjaan.","A collapsible basket carrying groceries"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Bandingkan dengan biaya jasa",
 inti="Bandingkan harga alat dengan biaya jasa atau barang sekali pakai supaya terasa hemat.",
 psikologi="Biaya jasa yang rutin terasa besar. Alat yang balik modal dalam beberapa kali pakai terasa seperti tabungan.",
 cocok="Pembersih sofa, pel microfiber, lap reusable, robot vacuum",
 hooks=["Jasa cuci sofa 300 ribu. Alat ini balik modal sekali pakai.","Berhenti beli tisu dapur.","Aku hitungin biar kamu nggak kaget.","Hemat sejuta setahun.","Jangan bilang mahal sebelum lihat ini."],
 scripts=[
  S("Alat cuci sofa portable","20 detik",[
   ("0–4","Jasa cuci sofa 300 ribu. Alat ini balik modal sekali pakai.","BALIK MODAL 1X PAKAI 🧮","Kalkulator HP dan alat.","A smartphone calculator next to a portable spot cleaner"),
   ("4–10","Setahun hemat 600 ribu.","HEMAT 600RB/TAHUN","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Bisa dipakai kapan aja, nggak perlu nunggu jadwal.","KAPAN AJA ✅","Alat dipakai di kasur.","A portable cleaner used on a mattress"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Alat di rak.","A portable spot cleaner on a shelf"),
  ]),
  S("Lap microfiber isi 10","20 detik",[
   ("0–4","Berhenti beli tisu dapur. Aku hitungin.","STOP BELI TISU 🧻","Tisu dapur dan lap.","Paper towel rolls next to a stack of microfiber cloths"),
   ("4–10","Tisu dapur seminggu sepuluh ribu, setahun lima ratus ribu.","SETAHUN 500RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Lap ini isi sepuluh, dicuci, dipakai berbulan-bulan.","DIPAKAI BERBULAN-BULAN ✅","Lap mengelap meja.","A microfiber cloth wiping a table clean"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Tumpukan lap.","A stack of colorful microfiber cloths"),
  ]),
  S("Pel semprot (spray mop)","20 detik",[
   ("0–4","Pel ini bikin hemat cairan pel. Aku hitungin.","HEMAT CAIRAN PEL 🧮","Pel semprot dan botol cairan.","A spray mop next to a bottle of floor cleaner"),
   ("4–10","Ngepel pakai ember habis banyak cairan. Pakai semprot, cukup sedikit.","CUKUP SEDIKIT","Semprotan halus ke lantai.","A spray mop misting a small amount of cleaner on a floor"),
   ("10–16","Satu botol bisa tiga kali lebih awet.","3X LEBIH AWET ✅","Lantai bersih mengilap.","A shiny clean floor"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Pel bersandar.","A spray mop leaning against a wall"),
  ]),
 ]),
]
