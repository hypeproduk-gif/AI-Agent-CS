NICHE = "Fashion Pria & Grooming"
SETTING = "clean minimalist Indonesian bedroom or bathroom"
PLACE = "a clean minimalist bedroom"
FACELESS = "Face not shown; frame from the neck down, or show hands, jaw or hair in close-up."
AMB = "natural indoor sounds"
DEF_M = "penampilan kelihatan kusut"
DEF_K = "kelihatan lebih rapi"
PH = ["kaos polos cotton combed 30s", "kaos cepat melar dan kusam", "adem, nggak melar, jahitan rapi"]
TPL_FILE = "pria_tpl.json"
TIPS_BROLL = "Rekam di depan cermin atau HP di penyangga, cahaya dari jendela. Kalau nggak mau tampil wajah, rekam dari leher ke bawah, atau tangan dan detail barang. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar. Tips: banyak yang beli barang pria justru istri atau pacarnya, jadi angle hadiah juga laku."
CATS = [["Semua", None], ["Baju & celana", ["02","05","06","09"]], ["Sepatu & tas", ["06","07","08"]],
        ["Grooming (cukur, parfum, pomade)", ["01","03","04","10"]], ["Barang di atas Rp200 ribu", ["06","08","10"]]]
START = [
 ("Hari 1","Gaya 02: Hasil Dulu (Try-on)","Paling gampang. Pakai, berputar di depan cermin, leher ke bawah."),
 ("Hari 2","Gaya 01: Masalah yang Bikin Kesel","Tunjukkan masalah sehari-hari pria, lalu solusinya."),
 ("Hari 3","Gaya 07: Tes Bahan","Rekam kain atau sol sepatu dari dekat: ditarik, ditekuk, disiram."),
 ("Hari 4","Gaya 04: Hadiah buat Suami/Pacar","Angka penjualan barang pria sering datang dari pembeli perempuan."),
 ("Hari 5","Gaya 09: 1 Baju, Banyak Gaya","Satu barang dipadukan jadi 3 tampilan."),
 ("Hari 6","Gaya 08: Review Jujur","Sebut kekurangannya dulu biar dipercaya."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Kesel", sub="Tunjukkan masalah, lalu solusinya",
 inti="Mulai dari masalah penampilan pria sehari-hari (cukuran perih, bau badan, rambut lepek), lalu tunjukkan produknya.",
 psikologi="Pria jarang mencari solusi sampai masalahnya terasa mengganggu. Masalah yang ditunjukkan dengan jelas bikin mereka sadar butuh.",
 cocok="Alat cukur, deodoran, pomade, sabun muka pria",
 hooks=["Cukuran bikin perih dan merah?","Rambut lepek padahal baru jam 10?","Bau badan pas meeting?","Jenggot tumbuh nggak rata?","Bro, ini yang bikin penampilanmu naik level."],
 scripts=[
  S("Alat cukur elektrik","18 detik",[
   ("0–3","Cukuran bikin perih dan merah?","CUKURAN PERIH? 😣","Rahang dengan bintik merah habis cukur (rahang saja).","Close-up of a jawline with red razor irritation bumps"),
   ("3–8","Pisau cukur biasa sering bikin luka kecil.","PISAU BIASA = LUKA","Pisau cukur manual di wastafel.","A manual razor lying by a sink"),
   ("8–14","Alat cukur elektrik ini lembut di kulit, bisa basah dan kering.","LEMBUT, BASAH & KERING ✅","Alat cukur di rahang.","An electric shaver gliding smoothly along a jawline, no full face"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Alat cukur di wastafel.","An electric shaver on a bathroom counter"),
  ]),
  S("Pomade water based","18 detik",[
   ("0–3","Rambut lepek padahal baru jam sepuluh?","LEPEK JAM 10? 😩","Rambut lepek dari dekat (rambut saja).","Close-up of flat limp men's hair"),
   ("3–8","Pomade minyak bikin lengket dan susah dicuci.","LENGKET, SUSAH DICUCI","Tangan berminyak.","Greasy fingers after using oil pomade"),
   ("8–14","Pomade ini berbasis air. Tahan seharian, keramas sekali langsung bersih.","TAHAN SEHARIAN ✅","Pomade diambil, rambut ditata.","Fingers scoop water-based pomade and style hair into a neat look"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Wadah pomade.","A pomade tin on a bathroom shelf"),
  ]),
  S("Deodoran spray pria","18 detik",[
   ("0–3","Bau badan pas meeting penting?","BAU PAS MEETING? 😬","Kemeja dengan noda keringat (ketiak saja).","Close-up of a sweat stain on a dress shirt underarm"),
   ("3–8","Aku semprot ini pagi sebelum berangkat.","SEMPROT PAGI","Spray disemprot.","A deodorant spray misting under an arm, tasteful framing"),
   ("8–14","Sampai sore tetap segar, wanginya nggak menyengat.","SEGAR SAMPAI SORE ✅","Kemeja rapi di kantor.","A crisp dress shirt at an office desk, neck down"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Kaleng di tas kerja.","A deodorant spray in a work bag"),
  ]),
 ]),
dict(id="02", name="Hasil Dulu (Try-on)", sub="Pakai dulu, baru jelaskan",
 inti="Detik pertama tampilkan barang sudah dipakai dan terlihat bagus, baru jelaskan detailnya.",
 psikologi="Pembeli pria ingin tahu jatuhnya di badan asli. Try-on menjawab itu tanpa perlu banyak kata.",
 cocok="Kemeja, kaos, celana chino, jaket, sepatu",
 hooks=["Kemeja 100 ribuan tapi kelihatan mahal.","Badan berisi pakai ini, tetap rapi.","Outfit kerja seminggu, satu celana.","Tinggi 165 pakai ini.","Kaos polos yang beda kelasnya."],
 scripts=[
  S("Kemeja oxford","18 detik",[
   ("0–3","(tanpa ngomong, merapikan lengan kemeja)","KELIHATAN MAHAL ✨","Merapikan lengan kemeja (leher ke bawah).","Hands rolling up the sleeves of a crisp oxford shirt, neck down"),
   ("3–8","Kemeja ini seratus ribuan. Bahannya oxford, tebal tapi adem.","OXFORD, ADEM","Kain dari dekat.","Close-up of oxford shirt fabric texture"),
   ("8–14","Bisa buat kerja, bisa buat nongkrong. Nggak gampang kusut.","NGGAK GAMPANG KUSUT ✅","Kemeja diremas lalu dilepas, tetap rapi.","An oxford shirt crumpled in a fist then released, staying neat"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Kemeja di gantungan.","Oxford shirts in several colors on hangers"),
  ]),
  S("Celana chino slim","18 detik",[
   ("0–3","(tanpa ngomong, berjalan)","SATU CELANA, SEMINGGU 👖","Berjalan memakai chino (pinggang ke bawah).","Walking in slim chino pants, waist down"),
   ("3–8","Chino ini melar sedikit, jadi enak dipakai duduk lama.","MELAR, ENAK DUDUK","Celana ditarik.","Hands stretch chino fabric"),
   ("8–14","Warnanya netral, cocok sama kemeja dan kaos.","WARNA NETRAL ✅","Dipadukan dengan kemeja dan kaos.","Chinos paired with a shirt and then a t-shirt, neck down"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Celana terlipat.","Folded chino pants"),
  ]),
  S("Jaket bomber","16 detik",[
   ("0–3","(tanpa ngomong, memakai jaket)","LANGSUNG KEREN 🔥","Memakai jaket (leher ke bawah).","Putting on a bomber jacket, neck down"),
   ("3–8","Jaket ini ringan, cocok buat naik motor malam.","RINGAN, BUAT MOTOR","Jaket di atas motor.","A bomber jacket worn while sitting on a scooter, neck down"),
   ("8–12","Ada saku dalam buat HP.","SAKU DALAM ✅","Saku dalam dibuka.","A hand opens the inner pocket of a jacket"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Jaket di gantungan.","A bomber jacket on a hanger"),
  ]),
 ]),
dict(id="03", name="Rutinitas Pagi", sub="Tunjukkan urutan siap-siap",
 inti="Rekam rutinitas siap-siap pagi pria yang cepat, dengan produk sebagai bintangnya.",
 psikologi="Rutinitas singkat terasa gampang ditiru. Pria suka cara praktis yang tidak ribet.",
 cocok="Sabun muka pria, alat cukur, pomade, parfum, sunscreen pria",
 hooks=["Rutinitas pagi pria, 5 menit.","Grooming buat yang malas ribet.","3 barang wajib pria kantoran.","Siap-siap kerja versi cepat.","Biar kelihatan segar seharian."],
 scripts=[
  S("Sabun muka pria (oil control)","20 detik",[
   ("0–4","Rutinitas pagi pria, cuma lima menit.","5 MENIT ⏱️","Tiga produk di wastafel.","Three grooming products lined up on a bathroom sink"),
   ("4–10","Pertama sabun muka ini, biar minyak di muka berkurang.","1. SABUN MUKA","Busa di tangan, air membasuh.","Foam in hands, water splashing, no full face"),
   ("10–15","Terus pomade dan parfum. Beres.","2. POMADE 3. PARFUM","Rambut ditata, parfum disemprot.","Quick shots of hair styled and cologne sprayed on a wrist"),
   ("15–20","Muka nggak kusam sampai siang. Cek keranjang kuning.","CEK KERANJANG 👇","Sabun muka di wastafel.","A men's face wash tube on a sink"),
  ]),
  S("Parfum pria","18 detik",[
   ("0–4","Langkah terakhir sebelum berangkat: parfum.","LANGKAH TERAKHIR","Botol parfum di meja.","A men's cologne bottle on a dresser"),
   ("4–10","Semprot di nadi tangan dan leher. Jangan digosok.","NADI + LEHER","Semprotan di pergelangan.","Cologne sprayed onto a wrist"),
   ("10–14","Wanginya tahan sampai sore.","TAHAN SAMPAI SORE ✅","Botol dari dekat.","Close-up of a cologne bottle in window light"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol di tas.","A small cologne bottle in a bag"),
  ]),
  S("Trimmer jenggot","18 detik",[
   ("0–4","Rapiin jenggot tiap pagi, dua menit.","2 MENIT RAPI","Trimmer di tangan.","A beard trimmer held in a hand"),
   ("4–10","Pasang sisir sesuai panjang yang mau, terus sapukan.","PASANG SISIR, SAPUKAN","Trimmer di dagu (dagu saja).","A beard trimmer with a guard combing along a chin, no full face"),
   ("10–14","Hasilnya rata dan rapi.","RATA & RAPI ✅","Jenggot rapi dari dekat.","Close-up of a neatly trimmed beard on a jaw"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Trimmer di wastafel.","A beard trimmer on a sink"),
  ]),
 ]),
dict(id="04", name="Hadiah buat Suami/Pacar", sub="Ceritakan dari sudut pandang pembeli perempuan",
 inti="Banyak barang pria dibeli oleh istri atau pacar. Ceritakan dari sudut pandang mereka yang ingin memberi hadiah.",
 psikologi="Perempuan sering bingung memilih hadiah pria. Video yang memberi ide hadiah praktis langsung menjawab kebingungan itu.",
 cocok="Dompet, jam tangan, parfum, ikat pinggang, set grooming",
 hooks=["POV: bingung kasih hadiah buat suami.","Hadiah anniversary buat dia yang susah dikasih.","Kado buat ayah yang berguna.","Suami aku langsung pakai tiap hari.","Hadiah di bawah 200 ribu buat cowok."],
 scripts=[
  S("Dompet kulit pria","20 detik",[
   ("0–4","POV: bingung kasih hadiah buat suami.","BINGUNG KASIH HADIAH? 🎁","Tangan perempuan memegang kotak hadiah.","A woman's hands holding a wrapped gift box"),
   ("4–10","Aku kasih dompet ini. Dompet lamanya udah sobek.","DOMPET LAMA SOBEK","Dompet lama usang.","An old worn-out wallet with torn edges"),
   ("10–16","Kulitnya halus, slot kartunya banyak, dan tipis di saku.","TIPIS + BANYAK SLOT ✅","Dompet baru dibuka, kartu masuk.","A new leather wallet opened, cards slid into slots"),
   ("16–20","Dia langsung pakai. Cek keranjang kuning.","CEK KERANJANG 👇","Dompet dalam kotak.","A leather wallet in a gift box"),
  ]),
  S("Jam tangan analog","18 detik",[
   ("0–4","Hadiah anniversary buat dia yang susah dikasih.","HADIAH ANNIVERSARY ❤️","Kotak jam dibuka.","A watch box being opened"),
   ("4–10","Jam ini simpel, cocok buat kerja dan acara.","SIMPEL, COCOK SEMUA","Jam dipakai di pergelangan.","A minimalist analog watch on a man's wrist"),
   ("10–14","Tahan cipratan air.","TAHAN CIPRATAN ✅","Air di permukaan jam.","Water droplets on a watch face"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Jam di kotak.","A watch in its gift box"),
  ]),
  S("Set grooming pria","18 detik",[
   ("0–4","Kado buat ayah yang berguna tiap hari.","KADO BUAT AYAH 👨","Set grooming dalam kotak.","A men's grooming kit in a box"),
   ("4–10","Isinya gunting kuku, trimmer, dan sisir dalam satu tas.","SEMUA DALAM SATU TAS","Isi set ditunjukkan.","Hands show nail clippers, a trimmer and a comb in a pouch"),
   ("10–14","Praktis dibawa ke mana-mana.","PRAKTIS DIBAWA ✅","Tas grooming masuk koper.","A grooming pouch placed into a suitcase"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Set di meja.","A grooming kit on a table"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang tepat",
 inti="Ajari cara memilih ukuran, bahan, atau keaslian, lalu tunjukkan produkmu yang lolos.",
 psikologi="Pria malas retur. Tips memilih yang tepat sekali beli membuat mereka percaya dan langsung checkout.",
 cocok="Kaos, kemeja, celana, sepatu, parfum",
 hooks=["Jangan beli kaos polos sebelum cek ini.","Kenapa kaosmu cepat melar?","Cara pilih ukuran kemeja online.","Parfum kamu asli atau isi ulang?","3 hal yang dicek sebelum beli sepatu."],
 scripts=[
  S("Kaos polos cotton combed","20 detik",[
   ("0–4","Jangan beli kaos polos sebelum cek ini.","CEK DULU ✋","Tumpukan kaos.","A stack of plain t-shirts"),
   ("4–10","Cek bahannya: cotton combed lebih adem dan nggak gampang melar.","CEK BAHAN","Label bahan dari dekat.","Close-up of a fabric label on a t-shirt"),
   ("10–16","Cek jahitan leher, harus rapat. Yang ini lolos.","JAHITAN LEHER RAPAT ✅","Jahitan leher ditarik.","Hands stretch a t-shirt collar showing tight stitching"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Kaos terlipat.","Folded plain t-shirts in several colors"),
  ]),
  S("Kemeja (pilih ukuran)","20 detik",[
   ("0–4","Cara pilih ukuran kemeja online biar nggak salah.","BIAR NGGAK SALAH","Meteran di tangan.","A measuring tape in hands"),
   ("4–10","Ukur lebar bahu kemeja yang paling pas, terus bandingkan tabel.","UKUR BAHU","Meteran di bahu kemeja.","A measuring tape across the shoulders of a flat shirt"),
   ("10–16","Kemeja ini tabel ukurannya lengkap.","TABEL LENGKAP ✅","Layar HP tabel ukuran.","A phone screen showing a size chart"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Kemeja terlipat.","A folded shirt"),
  ]),
  S("Sepatu sneakers","20 detik",[
   ("0–4","Tiga hal yang dicek sebelum beli sepatu.","CEK 3 HAL","Sepatu di lantai.","A pair of sneakers on a floor"),
   ("4–10","Solnya empuk, jahitannya rapi, dan ukuran pakai panjang telapak kaki.","SOL ✅ JAHITAN ✅ UKURAN ✅","Sol ditekan, jahitan dilihat.","A thumb presses a sneaker sole, then close-up of stitching"),
   ("10–16","Sepatu ini lolos semua.","LOLOS ✅","Berjalan memakai sepatu (kaki saja).","Feet walking in sneakers"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Sepatu di kotak.","Sneakers in a box"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan barang branded dengan produkmu yang kualitasnya mirip.",
 psikologi="Pria suka barang yang worth it. Pembanding branded membuat produkmu terasa pilihan cerdas.",
 cocok="Sepatu, tas, jam, kemeja, parfum",
 hooks=["Sepatu 2 juta vs 300 ribu.","Kaos branded vs lokal.","Parfum mahal vs ini, wanginya mirip.","Bedanya cuma di logo.","Jangan beli yang mahal dulu, bro."],
 scripts=[
  S("Sneakers lokal","20 detik",[
   ("0–4","Sepatu dua juta vs tiga ratus ribu.","2 JUTA vs 300RB 👟","Dua pasang sepatu.","Two pairs of white sneakers side by side"),
   ("4–10","Solnya sama-sama empuk, jahitannya sama rapi.","SOL & JAHITAN SAMA","Sol dan jahitan dari dekat.","Close-up comparison of sneaker soles and stitching"),
   ("10–16","Dipakai seharian, kaki tetap nyaman.","TETAP NYAMAN ✅","Berjalan (kaki saja).","Feet walking in affordable sneakers"),
   ("16–20","Bedanya cuma logo. Keranjang kuning.","BEDA LOGO DOANG 👇","Sepatu diangkat.","A hand lifts a sneaker"),
  ]),
  S("Parfum lokal","18 detik",[
   ("0–4","Parfum dua juta vs dua ratus ribu.","2 JUTA vs 200RB","Dua botol parfum.","Two cologne bottles side by side"),
   ("4–10","Aku semprot di dua tangan, wanginya mirip banget.","WANGINYA MIRIP","Semprot di dua pergelangan.","Cologne sprayed on two wrists"),
   ("10–14","Tahannya juga sampai sore.","TAHAN SAMPAI SORE ✅","Botol lokal dari dekat.","Close-up of an affordable cologne bottle"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol diangkat.","A hand holds up a cologne bottle"),
  ]),
  S("Tas selempang pria","18 detik",[
   ("0–4","Tas selempang branded vs lokal.","BRANDED vs LOKAL","Dua tas.","Two men's sling bags side by side"),
   ("4–10","Isinya sama-sama muat HP, dompet, powerbank.","MUAT SAMA","Tas diisi barang.","Hands put a phone, wallet and power bank into a sling bag"),
   ("10–14","Bahannya tahan air.","TAHAN AIR ✅","Air disiram ke tas.","Water poured on a sling bag beading off"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Tas dipakai.","A sling bag worn across the chest, neck down"),
  ]),
 ]),
dict(id="07", name="Tes Bahan", sub="Bukti dari dekat",
 inti="Uji barang langsung: ditarik, ditekuk, disiram air, diinjak.",
 psikologi="Pria percaya bukti fisik. Tes langsung menggantikan rasa memegang barang di toko.",
 cocok="Kaos, celana, sepatu, ikat pinggang, tas",
 hooks=["Aku siram air, tembus nggak?","Ditarik kenceng, melar nggak?","Ditekuk 100 kali, retak nggak?","Tes paling jujur.","Kuat nggak sih?"],
 scripts=[
  S("Sepatu anti air","16 detik",[
   ("0–3","Aku siram air, tembus nggak?","TEMBUS NGGAK? 💧","Sepatu di wastafel.","A sneaker placed in a sink"),
   ("3–8","(tanpa ngomong)","(tanpa tulisan)","Air disiram ke sepatu.","Water poured over a sneaker, beading off the surface"),
   ("8–12","Bagian dalamnya tetap kering.","DALAM TETAP KERING ✅","Tisu dimasukkan, tetap kering.","A tissue pulled out of the shoe dry"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Sepatu di lantai.","A sneaker on a floor"),
  ]),
  S("Ikat pinggang kulit","16 detik",[
   ("0–3","Ditekuk seratus kali, retak nggak?","RETAK NGGAK? 🤔","Ikat pinggang di tangan.","A leather belt in hands"),
   ("3–8","(tanpa ngomong)","(tanpa tulisan)","Ikat pinggang ditekuk berulang.","A leather belt bent back and forth repeatedly"),
   ("8–12","Nggak retak, kulitnya tetap halus.","NGGAK RETAK ✅","Permukaan kulit dari dekat.","Close-up of smooth uncracked leather"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Ikat pinggang tergulung.","A coiled leather belt"),
  ]),
  S("Kaos oversize","16 detik",[
   ("0–3","Ditarik kenceng, melar nggak?","MELAR NGGAK?","Kaos dibentangkan.","A t-shirt laid flat"),
   ("3–8","(tanpa ngomong)","(tanpa tulisan)","Leher kaos ditarik lebar.","Hands stretch a t-shirt collar wide"),
   ("8–12","Balik ke bentuk semula.","BALIK SEMULA ✅","Leher kembali rapat.","The collar snaps back into shape"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Kaos terlipat.","Folded oversized t-shirts"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah dipakai beberapa minggu, sebut kekurangannya duluan, lalu kelebihannya dan cocok untuk siapa.",
 psikologi="Pria benci kecewa dengan barang yang tidak sesuai. Review jujur membangun kepercayaan.",
 cocok="Sepatu, jam, tas, alat cukur, produk di atas Rp200 ribu",
 hooks=["Sebulan pakai sepatu ini, jujurnya…","Bukan endorse, aku beli sendiri.","Ada yang nggak aku suka.","Plus minus setelah sebulan.","Jangan beli ini kalau kamu…"],
 scripts=[
  S("Sepatu kerja kulit","22 detik",[
   ("0–4","Sebulan pakai sepatu ini ke kantor. Jujurnya gini.","SEBULAN, JUJUR","Sepatu di lantai.","Leather work shoes on a floor"),
   ("4–10","Minusnya: minggu pertama agak keras di tumit.","❌ AWAL AGAK KERAS","Tumit sepatu dari dekat.","Close-up of a stiff leather shoe heel"),
   ("10–17","Setelah itu nyaman, dan kulitnya tetap mengilap.","✅ NYAMAN + MENGILAP","Berjalan (kaki saja).","Feet walking in polished leather shoes"),
   ("17–22","Pakai kaus kaki tebal di awal. Keranjang kuning.","CEK KERANJANG 👇","Sepatu di kotak.","Leather shoes in a box"),
  ]),
  S("Alat cukur rambut (clipper)","20 detik",[
   ("0–4","Plus minus clipper ini setelah sebulan cukur sendiri.","PLUS MINUS","Clipper di meja.","A hair clipper on a table"),
   ("4–10","Minusnya: suaranya agak berisik.","❌ AGAK BERISIK","Clipper menyala.","A hair clipper running"),
   ("10–16","Plusnya: tajam, baterai awet, hemat ongkos cukur.","✅ TAJAM + HEMAT","Rambut dicukur rapi (rambut saja).","A clipper trimming the side of a head, hair only"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Clipper dengan sisirnya.","A clipper with guard combs"),
  ]),
  S("Tas ransel kerja","20 detik",[
   ("0–4","Dua bulan pakai tas ini ke kantor.","2 BULAN PAKAI","Tas di kursi.","A work backpack on an office chair"),
   ("4–10","Minusnya: agak berat kalau kosong.","❌ AGAK BERAT","Tas diangkat.","A hand lifts an empty backpack"),
   ("10–16","Plusnya: muat laptop, ada port USB, dan tahan hujan.","✅ LAPTOP + USB + TAHAN HUJAN","Laptop masuk tas.","A laptop slid into a backpack compartment"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Tas dipakai.","A backpack worn on shoulders, neck down"),
  ]),
 ]),
dict(id="09", name="1 Baju, Banyak Gaya", sub="Satu barang dipadukan jadi beberapa tampilan",
 inti="Tunjukkan satu barang dipakai dengan 3 padanan berbeda.",
 psikologi="Pria suka barang serbaguna. Satu barang untuk banyak acara terasa hemat dan praktis.",
 cocok="Kemeja, chino, jaket, kaos polos, sepatu putih",
 hooks=["1 kemeja, 3 gaya.","Satu celana buat kerja dan nongkrong.","Kaos polos, 3 outfit.","Simpan buat inspirasi outfit.","Lemari minimalis pria."],
 scripts=[
  S("Kemeja linen","20 detik",[
   ("0–3","Satu kemeja, tiga gaya.","1 KEMEJA = 3 GAYA","Kemeja di gantungan.","A linen shirt on a hanger"),
   ("3–8","Satu: kerja, dikancing rapi pakai chino.","GAYA #1 💼","Outfit kerja (leher ke bawah).","A buttoned linen shirt with chinos, neck down"),
   ("8–13","Dua: santai, dibuka jadi outer di atas kaos.","GAYA #2 ☕","Outfit santai.","An open linen shirt over a t-shirt, neck down"),
   ("13–20","Tiga: kondangan, pakai celana bahan. Simpan, link di keranjang.","GAYA #3 + SIMPAN 👇","Outfit kondangan.","A linen shirt with dress trousers, neck down"),
  ]),
  S("Kaos polos hitam","20 detik",[
   ("0–3","Kaos polos hitam, tiga outfit.","3 OUTFIT","Kaos di gantungan.","A plain black t-shirt on a hanger"),
   ("3–8","Satu: sama jeans.","GAYA #1","Kaos dan jeans.","A black tee with jeans, neck down"),
   ("8–13","Dua: dalaman jas.","GAYA #2","Kaos dengan jas.","A black tee under a blazer, neck down"),
   ("13–20","Tiga: sama jaket. Simpan videonya, link di keranjang.","GAYA #3 + SIMPAN 👇","Kaos dengan jaket.","A black tee under a bomber jacket, neck down"),
  ]),
  S("Sepatu putih","20 detik",[
   ("0–3","Sepatu putih ini masuk ke semua outfit.","MASUK SEMUA OUTFIT","Sepatu putih.","White sneakers on a floor"),
   ("3–8","Satu: sama jeans.","GAYA #1","Jeans dan sepatu.","White sneakers with jeans, legs only"),
   ("8–13","Dua: sama chino.","GAYA #2","Chino dan sepatu.","White sneakers with chinos, legs only"),
   ("13–20","Tiga: sama celana pendek. Simpan, link di keranjang.","GAYA #3 + SIMPAN 👇","Celana pendek.","White sneakers with shorts, legs only"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Bandingkan dengan biaya rutin",
 inti="Bandingkan harga barang dengan biaya rutin (barbershop, laundry) supaya terasa hemat.",
 psikologi="Biaya kecil yang rutin terasa besar kalau dijumlah. Alat yang balik modal cepat terasa sebagai investasi.",
 cocok="Clipper, trimmer, setrika uap, semir sepatu, parfum isi ulang",
 hooks=["Cukur di barbershop 50 ribu. Clipper ini balik modal 4 kali.","Aku hitungin biar nggak kaget.","Hemat sejuta setahun.","Jangan bilang mahal sebelum lihat ini.","Investasi kecil buat penampilan."],
 scripts=[
  S("Hair clipper","20 detik",[
   ("0–4","Cukur di barbershop lima puluh ribu. Clipper ini balik modal empat kali.","BALIK MODAL 4X 🧮","Clipper dan kalkulator.","A hair clipper next to a smartphone calculator"),
   ("4–10","Cukur sebulan sekali, setahun enam ratus ribu.","SETAHUN 600RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Bisa buat anak dan bapak juga.","SEKELUARGA ✅","Rambut dirapikan (rambut saja).","A clipper trimming hair, hair only"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Clipper di meja.","A hair clipper"),
  ]),
  S("Set semir dan perawatan sepatu","18 detik",[
   ("0–4","Cuci sepatu di jasa tiga puluh lima ribu. Aku hitungin.","JASA 35RB 🧮","Set perawatan sepatu.","A shoe care kit on a table"),
   ("4–10","Sebulan dua kali, setahun 840 ribu.","SETAHUN 840RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–14","Set ini bisa dipakai puluhan kali.","PULUHAN KALI ✅","Sepatu dibersihkan.","A brush cleaning a sneaker with foam"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Sepatu bersih.","A clean white sneaker"),
  ]),
  S("Parfum 100ml","18 detik",[
   ("0–4","Parfum 100 ml vs 30 ml. Mana lebih hemat?","100ML vs 30ML","Dua botol.","A large and a small cologne bottle"),
   ("4–10","Yang kecil 120 ribu, yang besar 250 ribu.","120RB vs 250RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–14","Per ml, yang besar hampir setengah harga.","HAMPIR SETENGAH ✅","Botol besar.","A large cologne bottle"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol diangkat.","A hand holds up the large bottle"),
  ]),
 ]),
]
