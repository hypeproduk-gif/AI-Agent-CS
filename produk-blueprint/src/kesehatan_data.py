NICHE = "Kesehatan & Suplemen"
SETTING = "bright clean Indonesian home"
PLACE = "a bright clean Indonesian living room"
FACELESS = "Only hands, arms, shoulders or feet visible, no face."
AMB = "soft natural home sounds"
DEF_M = "badan gampang pegal dan capek"
DEF_K = "badan terasa lebih segar"
PH = ["alat pijat leher", "leher pegal habis kerja seharian", "pijatannya enak, bisa dibawa ke mana-mana"]
TPL_FILE = "kesehatan_tpl.json"
TIPS_BROLL = "Rekam pakai HP posisi tegak di ruangan terang. Cukup tangan, bahu, atau kaki. PENTING: jangan bilang suplemen bisa menyembuhkan penyakit. Pakai kata 'membantu', 'terasa', dan 'menurutku', tunjukkan nomor BPOM, dan sarankan konsultasi dokter untuk yang punya kondisi khusus. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar."
CATS = [["Semua", None], ["Alat pijat & relaksasi", ["01","02","04","08"]], ["Suplemen & minuman sehat", ["03","05","06","10"]],
        ["Alat cek kesehatan", ["05","07","09"]], ["Barang di atas Rp200 ribu", ["06","08","10"]]]
START = [
 ("Hari 1","Gaya 02: Rasakan Dulu","Paling gampang. Rekam alat pijat dipakai dan reaksi lega (tanpa wajah)."),
 ("Hari 2","Gaya 01: Masalah yang Bikin Kesel","Ceritakan pegal atau capek sehari-hari."),
 ("Hari 3","Gaya 03: Rutinitas Sehat","Rekam kebiasaan pagi atau malammu."),
 ("Hari 4","Gaya 05: Jangan Beli Sebelum Cek Ini","Ajari cara cek BPOM. Ini bikin kamu sangat dipercaya."),
 ("Hari 5","Gaya 09: 1 Alat, Banyak Fungsi","Ajak penonton menyimpan video."),
 ("Hari 6","Gaya 08: Review Jujur","Untuk barang yang sudah dipakai minimal 2 minggu."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Kesel", sub="Tunjukkan keluhan, lalu yang membantu",
 inti="Mulai dari keluhan sehari-hari (pegal, susah tidur, lupa minum), lalu tunjukkan barang yang membantu. Tanpa janji menyembuhkan.",
 psikologi="Keluhan ringan sehari-hari dialami hampir semua orang dewasa. Penonton merasa dimengerti dan mencari cara praktis untuk merasa lebih baik.",
 cocok="Alat pijat, koyo, botol minum pengingat, bantal ergonomis",
 hooks=["Leher pegal habis kerja seharian?","Kamu minum air cuma 3 gelas sehari?","Bangun tidur punggung sakit?","Kaki pegal habis berdiri lama?","Ibu-ibu, ini yang bikin badan aku lebih enteng."],
 scripts=[
  S("Alat pijat leher elektrik","18 detik",[
   ("0–3","Leher pegal habis kerja seharian?","LEHER PEGAL? 😣","Tangan memijat tengkuk sendiri (bahu ke bawah).","A hand rubbing the back of a stiff neck, framed from the shoulders"),
   ("3–8","Mau pijat ke tukang pijat nggak sempat terus.","NGGAK SEMPAT PIJAT","Jam dinding malam.","A wall clock showing late evening"),
   ("8–14","Aku pakai alat ini sepuluh menit sambil nonton TV. Rasanya enak dan rileks.","10 MENIT, RILEKS ✅","Alat pijat dipasang di leher, lampu menyala.","A U-shaped neck massager resting on shoulders, glowing gently, no face"),
   ("14–18","Bisa dicas, dibawa ke kantor juga. Keranjang kuning.","CEK KERANJANG 👇","Alat di sofa.","A neck massager on a sofa cushion"),
  ]),
  S("Botol minum 2 liter dengan penanda waktu","18 detik",[
   ("0–3","Kamu minum air cuma tiga gelas sehari?","CUMA 3 GELAS? 💧","Gelas kosong di meja kerja.","An empty glass on a busy work desk"),
   ("3–8","Aku juga sering lupa, sampai sore baru sadar.","SERING LUPA","Tangan memegang kepala di depan laptop.","A hand resting on a forehead in front of a laptop"),
   ("8–14","Botol ini ada penanda jam. Jadi tahu harus minum sampai garis mana.","ADA PENANDA JAM ✅","Botol diisi, garis jam terlihat.","A large water bottle with printed time markers being filled"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol di meja kerja.","A time-marked water bottle on a desk"),
  ]),
  S("Bantal ergonomis memory foam","18 detik",[
   ("0–3","Bangun tidur leher kaku?","BANGUN TIDUR KAKU? 😖","Tangan memegang leher di kasur.","A hand holding a stiff neck while sitting on a bed, no face"),
   ("3–8","Bisa jadi bantalnya terlalu tinggi atau terlalu kempes.","BANTAL KEMPES?","Bantal kempes ditekan.","A flat old pillow pressed down by a hand"),
   ("8–14","Bantal ini bentuknya ikut lekuk leher, empuk tapi menopang.","IKUT LEKUK LEHER ✅","Bantal memory foam ditekan lalu kembali.","A contoured memory foam pillow pressed and slowly bouncing back"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Bantal di kasur rapi.","A memory foam pillow on a neatly made bed"),
  ]),
 ]),
dict(id="02", name="Rasakan Dulu", sub="Tunjukkan rasa leganya duluan",
 inti="Detik pertama tampilkan momen lega dan nyaman saat memakai alat, baru jelaskan barangnya.",
 psikologi="Penonton bisa 'ikut merasakan' lewat gerakan tubuh yang rileks. Rasa nyaman ditunjukkan duluan bikin mereka penasaran alatnya.",
 cocok="Pijat kaki, massage gun, alat pijat mata, kompres hangat",
 hooks=["Ini rasanya kayak dipijat beneran.","Tonton sampai akhir, kamu bakal pengen.","10 menit, langsung enteng.","Hadiah terbaik buat orang tua.","Pulang kerja, langsung ini."],
 scripts=[
  S("Alat pijat kaki","18 detik",[
   ("0–3","(tanpa ngomong, kaki rileks)","KAYAK DIPIJAT BENERAN 😌","Kaki masuk ke alat pijat, jari kaki rileks.","Feet placed into a foot massager, toes relaxing, only feet visible"),
   ("3–8","Habis berdiri seharian, aku pakai alat pijat kaki ini.","HABIS BERDIRI SEHARIAN","Tombol ditekan.","A finger presses the start button on a foot massager"),
   ("8–14","Ada mode pijat dan hangat. Lima belas menit badan rasanya lebih enteng.","PIJAT + HANGAT ✅","Kaki di alat, latar sofa.","Feet relaxing in a foot massager in front of a sofa"),
   ("14–18","Cocok buat hadiah orang tua. Keranjang kuning.","CEK KERANJANG 👇","Alat di lantai ruang tamu.","A foot massager on a living room floor"),
  ]),
  S("Massage gun mini","16 detik",[
   ("0–3","(suara getaran)","10 MENIT, ENTENG 💆","Massage gun di bahu (bahu saja).","A mini massage gun pressed on a shoulder, no face"),
   ("3–8","Habis olahraga atau kerja lama, aku pakai ini di bahu dan betis.","BAHU + BETIS","Massage gun di betis.","A mini massage gun gliding over a calf"),
   ("8–12","Kecil, muat di tas, ada empat kepala.","MUAT DI TAS ✅","Ganti kepala pijat.","Hands swap massage gun heads"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Massage gun di tas.","A mini massage gun in a gym bag"),
  ]),
  S("Kompres hangat elektrik","16 detik",[
   ("0–3","(tanpa ngomong)","HANGATNYA PAS 🔥","Kompres di perut atau punggung (tanpa wajah).","An electric heating pad resting on a lower back, no face"),
   ("3–8","Kompres ini hangat dalam satu menit, nggak perlu rebus air.","HANGAT 1 MENIT","Kompres dicolok, lampu menyala.","An electric heat pad plugged in, indicator light on"),
   ("8–12","Suhunya bisa diatur dan mati otomatis.","MATI OTOMATIS ✅","Tombol suhu ditekan.","A finger adjusts a heat pad temperature controller"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Kompres terlipat.","A folded electric heating pad"),
  ]),
 ]),
dict(id="03", name="Rutinitas Sehat", sub="Tunjukkan kebiasaan harian",
 inti="Rekam rutinitas pagi atau malam yang sehat, dengan produk sebagai bagian alaminya.",
 psikologi="Rutinitas sehat terasa bisa ditiru dan memotivasi. Produk terlihat dipakai sungguhan, bukan sekadar dipamerkan.",
 cocok="Vitamin, minuman kolagen, madu, susu protein, teh herbal",
 hooks=["Rutinitas pagi aku sebelum kerja.","Kebiasaan kecil yang bikin badan lebih fit.","Ibu-ibu umur 40, ini rutinitasku.","Malam sebelum tidur, aku minum ini.","5 menit pagi buat badan."],
 scripts=[
  S("Vitamin C 1000 mg","20 detik",[
   ("0–4","Rutinitas pagi aku sebelum kerja, cuma lima menit.","RUTINITAS PAGI ☀️","Pagi hari, gelas air dan vitamin di meja.","Morning light, a glass of water and a vitamin bottle on a table"),
   ("4–10","Minum air putih dulu, terus vitamin C satu tablet setelah sarapan.","AIR PUTIH + VITAMIN C","Tablet dilarutkan di air.","An effervescent vitamin tablet dissolving in a glass of water"),
   ("10–16","Ini sudah BPOM. Buat aku, bantu jaga badan di musim hujan.","SUDAH BPOM ✅","Jari menunjuk nomor BPOM.","A finger points at a registration number on a vitamin tube"),
   ("16–20","Cek keranjang kuning. Kalau punya kondisi khusus, tanya dokter dulu ya.","CEK KERANJANG 👇","Tube vitamin di meja.","A vitamin tube on a breakfast table"),
  ]),
  S("Madu murni","18 detik",[
   ("0–4","Kebiasaan pagi dari ibu aku: madu sesendok.","MADU SESENDOK 🍯","Sendok madu kental menetes.","A spoonful of thick golden honey slowly dripping"),
   ("4–10","Aku campur ke air hangat atau teh.","CAMPUR AIR HANGAT","Madu diaduk ke teh.","Honey stirred into a cup of warm tea"),
   ("10–14","Madu ini kental dan sudah terdaftar BPOM.","KENTAL + BPOM ✅","Botol madu dari dekat.","Close-up of a honey bottle label"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol madu di meja.","A honey jar on a kitchen table"),
  ]),
  S("Susu protein / susu nabati","18 detik",[
   ("0–4","Habis olahraga pagi, aku minum ini.","HABIS OLAHRAGA 🏃‍♀️","Sepatu olahraga di lantai.","Running shoes by a door after a morning workout"),
   ("4–10","Satu sendok, kocok sama air atau susu.","1 SENDOK, KOCOK","Bubuk dimasukkan ke shaker.","A scoop of powder poured into a shaker bottle and shaken"),
   ("10–14","Rasanya enak, bikin kenyang lebih lama.","KENYANG LEBIH LAMA ✅","Shaker diminum (tanpa wajah).","A hand holds a shaker bottle, drinking motion, no face"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Kemasan di meja.","A protein powder pouch on a counter"),
  ]),
 ]),
dict(id="04", name="Cerita \"Kayak Aku Banget\"", sub="Ceritakan dari sudut pandang penonton",
 inti="Pilih satu tipe orang (ibu 40-an, pekerja kantoran, anak yang merawat orang tua) dan ceritakan dari sudut pandangnya.",
 psikologi="Penonton membayangkan dirinya atau orang tuanya. Barang terasa sebagai bentuk perhatian, bukan sekadar belanja.",
 cocok="Tensimeter, alat pijat, kursi pijat, hadiah orang tua",
 hooks=["POV: anak yang khawatir sama tensi ibunya.","POV: ibu 40-an, badan mulai gampang pegal.","POV: kerja duduk 8 jam sehari.","POV: orang tua tinggal jauh.","POV: mau kasih hadiah yang berguna."],
 scripts=[
  S("Tensimeter digital","20 detik",[
   ("0–4","POV: anak yang khawatir sama tensi ibunya.","POV: KHAWATIR SAMA IBU 🫶","Tangan anak memegang tangan ibu yang lebih tua.","A younger hand holding an older person's hand"),
   ("4–10","Aku belikan tensimeter digital ini, biar ibu bisa cek sendiri di rumah.","CEK SENDIRI DI RUMAH","Manset dipasang di lengan.","A blood pressure cuff wrapped on an older person's upper arm"),
   ("10–16","Angkanya besar, gampang dibaca, ada suaranya.","ANGKA BESAR ✅","Layar menampilkan angka besar.","A digital blood pressure monitor screen with large numbers"),
   ("16–20","Hasilnya tetap konsultasikan ke dokter ya. Keranjang kuning.","CEK KERANJANG 👇","Tensimeter di meja.","A blood pressure monitor on a table"),
  ]),
  S("Kursi pijat lipat / alas pijat punggung","20 detik",[
   ("0–4","POV: kerja duduk delapan jam sehari.","POV: DUDUK 8 JAM 💻","Kursi kerja dan laptop.","An office chair in front of a laptop"),
   ("4–10","Aku pasang alas pijat ini di kursi.","PASANG DI KURSI","Alas pijat dipasang.","A back massage cushion strapped onto an office chair"),
   ("10–16","Sambil kerja, punggung dipijat pelan. Rasanya lebih rileks.","SAMBIL KERJA ✅","Punggung bersandar, tangan mengetik.","Hands typing on a laptop while leaning back on a massage cushion"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Alas pijat di kursi.","A massage cushion on an office chair"),
  ]),
  S("Timbangan badan digital","18 detik",[
   ("0–4","POV: lagi program jaga berat badan.","POV: JAGA BERAT BADAN","Kaki di dekat timbangan.","Bare feet next to a digital bathroom scale"),
   ("4–10","Timbangan ini tersambung ke HP, jadi grafiknya kelihatan.","TERSAMBUNG KE HP","Kaki naik timbangan, HP menampilkan grafik.","Feet step on a smart scale and a phone shows a progress chart"),
   ("10–14","Jadi lebih semangat lihat progresnya.","LEBIH SEMANGAT ✅","Grafik di layar HP.","A phone screen showing a weight trend chart"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Timbangan di kamar mandi.","A smart scale on a bathroom floor"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang aman",
 inti="Ajari cara mengecek keamanan produk kesehatan (BPOM, izin edar Kemenkes, tanggal kedaluwarsa), lalu tunjukkan produkmu yang lolos.",
 psikologi="Produk kesehatan palsu dan klaim berlebihan membuat orang waspada. Tips mengecek menjadikan kamu sumber yang dipercaya.",
 cocok="Suplemen, madu, termometer, tensimeter, alat medis rumahan",
 hooks=["Jangan beli suplemen sebelum cek ini.","Cara cek BPOM cuma 10 detik.","Suplemen 'sembuh segala penyakit'? Hati-hati.","Termometer kamu akurat nggak?","3 hal yang dicek sebelum beli suplemen."],
 scripts=[
  S("Suplemen kolagen ber-BPOM","22 detik",[
   ("0–4","Jangan beli suplemen sebelum cek ini.","CEK DULU ✋","Beberapa kemasan suplemen.","Several supplement packages on a table"),
   ("4–10","Cek nomor BPOM di website atau aplikasi BPOM. Cuma sepuluh detik.","CEK BPOM 10 DETIK","Layar HP aplikasi cek BPOM.","A phone screen showing a product registration check app"),
   ("10–16","Hati-hati yang klaim menyembuhkan segala penyakit. Suplemen itu pelengkap, bukan obat.","SUPLEMEN ≠ OBAT ⚠️","Jari menunjuk tulisan di kemasan.","A finger points at text on a supplement box"),
   ("16–22","Yang ini terdaftar dan klaimnya wajar. Cek keranjang kuning.","LOLOS ✅👇","Kemasan diangkat.","A hand holds up a collagen supplement box"),
  ]),
  S("Termometer digital","20 detik",[
   ("0–4","Termometer kamu akurat nggak?","AKURAT NGGAK? 🌡️","Termometer di tangan.","A digital thermometer in a hand"),
   ("4–10","Pilih yang ada izin edar dari Kemenkes, dan hasilnya keluar cepat.","ADA IZIN EDAR","Tulisan izin edar di kemasan.","Close-up of a medical device registration number on packaging"),
   ("10–16","Yang ini sepuluh detik langsung bunyi.","10 DETIK ✅","Layar termometer menampilkan angka.","A digital thermometer screen displaying a reading"),
   ("16–20","Wajib ada di kotak P3K. Keranjang kuning.","CEK KERANJANG 👇","Kotak P3K terbuka.","An open first aid box with a thermometer"),
  ]),
  S("Madu (cek keaslian)","20 detik",[
   ("0–4","Madu kamu asli atau campuran?","ASLI ATAU CAMPURAN?","Dua botol madu.","Two honey jars side by side"),
   ("4–10","Cek terdaftar BPOM dan baca komposisinya, harus seratus persen madu.","CEK BPOM + KOMPOSISI","Label komposisi.","Close-up of an ingredient label on a honey jar"),
   ("10–16","Yang ini lolos, teksturnya kental.","LOLOS ✅","Madu kental dituang.","Thick honey poured from a spoon"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Botol madu.","A honey jar"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan alat kesehatan bermerek mahal dengan produkmu yang fungsinya mirip.",
 psikologi="Alat kesehatan sering terasa mahal. Pembanding mahal membuat produkmu terasa masuk akal dan terjangkau.",
 cocok="Alat pijat, massage gun, tensimeter, timbangan",
 hooks=["Massage gun 4 juta vs 400 ribu.","Alat pijat mal vs online.","Fungsinya sama, harganya beda jauh.","Jangan beli yang mahal dulu.","Kembaran alat pijat mahal."],
 scripts=[
  S("Massage gun","20 detik",[
   ("0–4","Massage gun empat juta vs empat ratus ribu.","4 JUTA vs 400RB 🤔","Dua massage gun.","Two massage guns side by side"),
   ("4–10","Dua-duanya punya beberapa level dan kepala pijat.","LEVEL + KEPALA SAMA","Kepala pijat dijejerkan.","Massage gun heads laid out in a row"),
   ("10–16","Buat pegal sehari-hari, yang murah sudah cukup enak.","SEHARI-HARI CUKUP ✅","Massage gun di betis.","An affordable massage gun on a calf"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Massage gun di case.","A massage gun in its case"),
  ]),
  S("Alat pijat bantal","18 detik",[
   ("0–4","Alat pijat di mal vs online.","MAL vs ONLINE","Dua bantal pijat.","Two massage pillows side by side"),
   ("4–10","Bola pijatnya sama-sama berputar dan ada mode hangat.","BERPUTAR + HANGAT","Bola pijat berputar terlihat.","Rotating massage nodes visible in a massage pillow"),
   ("10–14","Harganya cuma sepertiga.","CUMA SEPERTIGA ✅","Bantal di sofa.","A massage pillow on a sofa"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Bantal diangkat.","A hand lifts a massage pillow"),
  ]),
  S("Tensimeter","18 detik",[
   ("0–4","Tensimeter dua juta vs tiga ratus ribu.","2 JUTA vs 300RB","Dua tensimeter.","Two blood pressure monitors side by side"),
   ("4–10","Fungsi utamanya sama: ukur tensi dan denyut nadi.","FUNGSI SAMA","Layar angka.","A blood pressure monitor display"),
   ("10–14","Yang ini juga punya memori hasil ukur.","ADA MEMORI ✅","Tombol memori ditekan.","A finger presses a memory button"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Tensimeter di kotak.","A blood pressure monitor in its box"),
  ]),
 ]),
dict(id="07", name="Tes Langsung", sub="Bukti di depan kamera",
 inti="Tes alat langsung dengan hasil yang terlihat: angka, waktu, atau perbandingan.",
 psikologi="Bukti nyata di depan kamera lebih dipercaya daripada klaim. Penonton menonton sampai hasilnya keluar.",
 cocok="Termometer, timbangan, oximeter, botol pengingat minum",
 hooks=["Aku tes akurasinya.","Dua alat, hasilnya sama?","Berapa detik keluar hasilnya?","Tes langsung, tanpa edit.","Bandingkan dengan alat puskesmas."],
 scripts=[
  S("Oximeter jari","16 detik",[
   ("0–3","Berapa detik oximeter ini keluar hasilnya?","BERAPA DETIK? ⏱️","Jari masuk oximeter.","A finger placed into a pulse oximeter"),
   ("3–8","(tanpa ngomong)","(tanpa tulisan)","Layar menyala, angka muncul.","A pulse oximeter screen lighting up with readings"),
   ("8–12","Lima detik, langsung keluar kadar oksigen dan denyut nadi.","5 DETIK ✅","Layar angka dari dekat.","Close-up of oxygen and pulse readings"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Oximeter di kotak P3K.","A pulse oximeter in a first aid kit"),
  ]),
  S("Timbangan dapur/badan (tes akurasi)","16 detik",[
   ("0–3","Aku tes akurasi timbangan ini.","TES AKURASI ⚖️","Timbangan di lantai.","A digital scale on a floor"),
   ("3–8","Aku taruh galon isi penuh, sembilan belas liter.","GALON 19 LITER","Galon ditaruh di timbangan.","A full water gallon placed on a scale"),
   ("8–12","Hasilnya pas, sesuai berat galon.","HASIL PAS ✅","Layar angka.","A scale display showing an accurate reading"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Timbangan.","A digital scale"),
  ]),
  S("Botol minum pengingat (smart bottle)","16 detik",[
   ("0–3","Botol ini nyala kalau aku lupa minum.","NYALA KALAU LUPA 💡","Botol di meja.","A smart water bottle on a desk"),
   ("3–8","(tanpa ngomong)","(tanpa tulisan)","Tutup botol menyala berkedip.","A smart bottle cap glowing and blinking as a reminder"),
   ("8–12","Seminggu pakai, minumku jadi lebih teratur.","LEBIH TERATUR ✅","Tangan menuang air ke gelas.","Water poured from a smart bottle into a glass"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Botol di tas.","A smart bottle in a bag"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah dipakai minimal dua minggu, sebut kekurangannya duluan, lalu yang dirasakan dan cocok untuk siapa.",
 psikologi="Di produk kesehatan, kejujuran sangat penting. Review yang tidak berlebihan membuat penonton percaya dan tidak kecewa.",
 cocok="Alat pijat, suplemen, kursi pijat, produk di atas Rp200 ribu",
 hooks=["Sebulan pakai alat pijat ini, jujurnya…","Bukan endorse, aku beli sendiri.","Ada yang nggak aku suka.","Jangan berharap berlebihan dari ini.","Plus minus setelah sebulan."],
 scripts=[
  S("Alat pijat leher","22 detik",[
   ("0–4","Sebulan pakai, aku jujur ya.","SEBULAN, JUJUR","Alat di sofa.","A neck massager on a sofa"),
   ("4–10","Minusnya: level tertinggi terlalu kuat buat aku.","❌ LEVEL TINGGI KUAT","Tombol level.","A finger presses the intensity button"),
   ("10–17","Plusnya: tiap malam sepuluh menit, leher rasanya lebih rileks.","✅ LEBIH RILEKS","Alat di bahu (tanpa wajah).","A neck massager resting on shoulders, no face"),
   ("17–22","Ini alat relaksasi, bukan pengobatan. Keranjang kuning.","CEK KERANJANG 👇","Alat dicas.","A neck massager charging"),
  ]),
  S("Minuman kolagen","22 detik",[
   ("0–4","Sebulan minum kolagen ini. Jujur ya.","SEBULAN MINUM","Sachet kolagen.","Collagen drink sachets on a table"),
   ("4–10","Minusnya: hasilnya nggak instan, dan rasanya agak manis buat aku.","❌ NGGAK INSTAN","Sachet dituang ke air.","A sachet poured into a glass of water"),
   ("10–17","Plusnya: praktis, sudah BPOM, dan aku jadi rajin minum air.","✅ PRAKTIS + BPOM","Nomor BPOM di kemasan.","A finger points at a registration number on a box"),
   ("17–22","Hasil tiap orang beda. Keranjang kuning.","CEK KERANJANG 👇","Kotak kolagen.","A collagen box on a counter"),
  ]),
  S("Alat pijat mata","20 detik",[
   ("0–4","Plus minus alat pijat mata ini.","PLUS MINUS","Alat pijat mata.","An eye massager on a nightstand"),
   ("4–10","Minusnya: agak berat kalau dipakai sambil rebahan miring.","❌ AGAK BERAT","Alat di tangan.","An eye massager held in hands"),
   ("10–16","Plusnya: hangat dan ada musik, enak sebelum tidur.","✅ HANGAT + MUSIK","Alat menyala.","An eye massager with glowing indicator lights"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Alat di kotak.","An eye massager in its box"),
  ]),
 ]),
dict(id="09", name="1 Alat, Banyak Fungsi", sub="Satu barang, banyak kegunaan",
 inti="Tunjukkan beberapa cara pakai alat kesehatan yang jarang orang tahu.",
 psikologi="Makin banyak kegunaan, makin worth it. Orang menyimpan video tips untuk dipakai nanti.",
 cocok="Kompres hangat, massage gun, bola pijat, resistance band",
 hooks=["Bola pijat ini bisa buat 3 bagian tubuh.","Resistance band, 3 gerakan di rumah.","3 cara pakai yang jarang orang tahu.","Simpan video ini.","Satu alat, banyak manfaat."],
 scripts=[
  S("Bola pijat (spiky ball)","20 detik",[
   ("0–3","Bola pijat ini bisa buat tiga bagian tubuh.","1 BOLA = 3 FUNGSI","Bola di tangan.","A spiky massage ball in a hand"),
   ("3–8","Satu: telapak kaki, digelindingkan.","CARA #1","Bola di bawah kaki.","A foot rolling a spiky massage ball"),
   ("8–13","Dua: punggung, bersandar ke dinding.","CARA #2","Punggung menekan bola ke dinding.","A back pressing a massage ball against a wall, no face"),
   ("13–20","Tiga: telapak tangan. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Bola digenggam.","Hands rolling a massage ball between palms"),
  ]),
  S("Resistance band","20 detik",[
   ("0–3","Satu karet ini, tiga gerakan di rumah.","3 GERAKAN DI RUMAH","Resistance band.","A set of resistance bands"),
   ("3–8","Satu: tarik buat lengan.","GERAKAN #1","Tangan menarik band.","Arms stretching a resistance band, no face"),
   ("8–13","Dua: squat buat kaki.","GERAKAN #2","Kaki dengan band.","Legs doing a squat with a resistance band, no face"),
   ("13–20","Tiga: peregangan punggung. Simpan, link di keranjang.","GERAKAN #3 + SIMPAN 👇","Peregangan.","A back stretch using a resistance band, no face"),
  ]),
  S("Kompres hangat-dingin gel","18 detik",[
   ("0–3","Kompres gel ini bisa dingin dan bisa hangat.","DINGIN + HANGAT","Kompres gel.","A reusable gel pack"),
   ("3–8","Satu: dingin dari kulkas, buat bengkak habis terbentur.","CARA #1 ❄️","Kompres dari freezer.","A gel pack taken out of a freezer"),
   ("8–13","Dua: hangat, rendam air panas, buat pegal.","CARA #2 🔥","Kompres direndam air panas.","A gel pack placed into hot water"),
   ("13–18","Tiga: bekal anak tetap dingin. Simpan, link di keranjang.","CARA #3 + SIMPAN 👇","Kompres di kotak bekal.","A gel pack inside a lunch box"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Bandingkan dengan biaya rutin",
 inti="Bandingkan harga alat dengan biaya rutin (tukang pijat, cek di klinik) supaya terasa hemat.",
 psikologi="Biaya rutin terasa besar kalau dijumlah. Alat yang balik modal dalam beberapa kali pakai terasa seperti tabungan.",
 cocok="Alat pijat, tensimeter, kursi pijat, oximeter",
 hooks=["Tukang pijat 100 ribu. Alat ini balik modal 3 kali pakai.","Cek tensi di klinik tiap bulan? Hitung ini.","Aku hitungin biar kamu nggak kaget.","Hemat sejuta setahun.","Jangan bilang mahal sebelum lihat ini."],
 scripts=[
  S("Alat pijat punggung","20 detik",[
   ("0–4","Tukang pijat seratus ribu. Alat ini balik modal tiga kali pakai.","BALIK MODAL 3X 🧮","Kalkulator HP dan alat pijat.","A smartphone calculator next to a back massager"),
   ("4–10","Kalau pijat dua kali sebulan, setahun habis 2,4 juta.","SETAHUN 2,4 JUTA 💸","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Alat ini bisa dipakai tiap hari, sekeluarga.","DIPAKAI SEKELUARGA ✅","Alat di sofa ruang keluarga.","A back massager on a family sofa"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Alat di sofa.","A back massager"),
  ]),
  S("Tensimeter digital","20 detik",[
   ("0–4","Cek tensi di klinik tiap bulan? Hitung ini.","CEK DI KLINIK? 🧮","Tensimeter dan kalkulator.","A blood pressure monitor next to a calculator"),
   ("4–10","Sekali cek plus ongkos jalan bisa lima puluh ribu.","SEKALI ± 50RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Dengan tensimeter di rumah, bisa cek kapan aja. Tetap kontrol ke dokter sesuai jadwal ya.","CEK KAPAN AJA ✅","Tensimeter dipakai.","A blood pressure cuff on an arm"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Tensimeter.","A blood pressure monitor"),
  ]),
  S("Botol infused water","18 detik",[
   ("0–4","Beli minuman manis tiap hari? Hitung ini.","MINUMAN MANIS? 🧋","Gelas boba dan botol infused.","A boba drink next to an infused water bottle"),
   ("4–10","Sepuluh ribu sehari, sebulan tiga ratus ribu.","SEBULAN 300RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–14","Bikin infused water sendiri, segar dan jauh lebih hemat.","SEGAR + HEMAT ✅","Buah masuk ke botol.","Lemon and cucumber slices dropped into an infuser bottle"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol di meja.","An infuser bottle on a desk"),
  ]),
 ]),
]
