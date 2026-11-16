NICHE = "Ibu & Anak"
SETTING = "warm clean Indonesian family home"
PLACE = "a warm clean Indonesian family living room"
FACELESS = "Only adult hands and the child's hands or feet visible; no faces of adults or children."
AMB = "soft natural home sounds"
DEF_M = "anak rewel dan ibu kerepotan"
DEF_K = "ibu jadi lebih santai"
PH = ["botol susu anti kolik", "bayi sering kembung habis minum susu", "aliran susu pelan, bayi lebih nyaman"]
TPL_FILE = "ibuanak_tpl.json"
TIPS_BROLL = "Rekam pakai HP posisi tegak di ruangan terang. Demi privasi dan keamanan anak, jangan tampilkan wajah anak; cukup tangan, kaki, atau punggungnya. Jangan buat klaim kesehatan. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar."
CATS = [["Semua", None], ["Perlengkapan bayi", ["01","03","05","08"]], ["Mainan & edukasi", ["02","04","09"]],
        ["Perlengkapan makan (MPASI)", ["03","06","07"]], ["Barang di atas Rp150 ribu", ["06","08","10"]]]
START = [
 ("Hari 1","Gaya 02: Anak Langsung Anteng","Paling gampang. Rekam tangan anak asyik main, tanpa wajah."),
 ("Hari 2","Gaya 01: Masalah yang Bikin Kesel","Ceritakan kerepotan sehari-hari, ibu-ibu lain pasti relate."),
 ("Hari 3","Gaya 03: Rutinitas Harian","Rekam rutinitas mandi, makan, atau tidur."),
 ("Hari 4","Gaya 05: Jangan Beli Sebelum Cek Ini","Ajari cara cek label aman (SNI, BPA free)."),
 ("Hari 5","Gaya 09: 1 Barang, Banyak Fungsi","Ajak penonton menyimpan video."),
 ("Hari 6","Gaya 08: Review Jujur","Untuk barang yang sudah dipakai seminggu lebih."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Kesel", sub="Tunjukkan kerepotan, lalu solusinya",
 inti="Mulai dari kerepotan sehari-hari mengurus anak, lalu tunjukkan barang yang membantu.",
 psikologi="Ibu-ibu langsung merasa 'ini aku' saat melihat kerepotan yang sama. Mereka mencari apa pun yang bisa bikin hari lebih ringan.",
 cocok="Botol anti tumpah, alas makan, gendongan, tempat mandi bayi",
 hooks=["Anak numpahin minum terus?","Makan sambil main, rumah jadi kapal pecah?","Gendong bayi bikin pinggang encok?","Mandiin bayi takut licin?","Ibu-ibu, ini yang bikin aku nggak stres lagi."],
 scripts=[
  S("Gelas anti tumpah (training cup)","18 detik",[
   ("0–3","Anak numpahin minum terus?","TUMPAH LAGI? 😩","Gelas biasa tumpah di meja, tangan kecil.","A toddler's small hand knocks over a regular cup, water spilling on a table"),
   ("3–8","Aku ganti ke gelas ini. Dibalik pun nggak tumpah.","DIBALIK NGGAK TUMPAH","Gelas dibalik, tidak menetes.","An adult hand turns a toddler training cup upside down, no drips"),
   ("8–14","Anak bisa belajar minum sendiri, ibu tenang.","BELAJAR MINUM SENDIRI ✅","Tangan kecil memegang gelas dengan dua pegangan.","A toddler's small hands holding a two-handled training cup"),
   ("14–18","Cek keranjang kuning ya.","CEK KERANJANG 👇","Gelas di meja makan anak.","A training cup on a child's high chair tray"),
  ]),
  S("Alas makan silikon dengan suction","18 detik",[
   ("0–3","Makan sambil main, piringnya dilempar?","PIRING DILEMPAR? 🙈","Piring plastik jatuh, makanan berserakan.","A plastic plate falling off a high chair, food scattering on the floor"),
   ("3–8","Alas makan ini nempel kuat di meja.","NEMPEL KUAT","Alas ditekan ke meja, ditarik tidak lepas.","A silicone suction plate pressed onto a tray, a small hand tugs and it stays"),
   ("8–14","Ada sekatnya, gampang dicuci, aman buat microwave.","ADA SEKAT ✅","Alas berisi makanan berwarna.","A silicone divided plate filled with colorful baby food"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Alas di rak piring.","A silicone plate on a dish rack"),
  ]),
  S("Hipseat (gendongan duduk)","20 detik",[
   ("0–3","Gendong anak bikin pinggang encok?","PINGGANG ENCOK? 😣","Tangan memegang pinggang (pinggang saja).","A hand pressing on a lower back, framed at the waist"),
   ("3–8","Pakai hipseat, berat anak tertahan di pinggul, bukan di tangan.","BERAT DI PINGGUL","Hipseat dipasang di pinggang.","A hip seat carrier buckled around a waist"),
   ("8–15","Gendong lama di mal pun lebih ringan.","LEBIH RINGAN ✅","Berjalan menggendong anak (dari belakang, tanpa wajah).","Walking while carrying a toddler on a hip seat, filmed from behind, no faces"),
   ("15–20","Cek keranjang kuning.","CEK KERANJANG 👇","Hipseat di sofa.","A hip seat carrier on a sofa"),
  ]),
 ]),
dict(id="02", name="Anak Langsung Anteng", sub="Tunjukkan hasilnya duluan",
 inti="Detik pertama tampilkan anak yang asyik bermain atau makan dengan lahap, baru tunjukkan barangnya.",
 psikologi="Semua ibu ingin momen tenang. Melihat anak lain anteng bikin penonton penasaran barang apa yang dipakai.",
 cocok="Mainan edukasi, buku sensori, playmat, busy board",
 hooks=["Anak aku anteng 30 menit, ini rahasianya.","Akhirnya bisa ngopi dengan tenang.","Mainan ini bikin anak lupa HP.","Tebak ini mainan apa?","Mainan murah yang bikin anak fokus."],
 scripts=[
  S("Busy board / papan sibuk","18 detik",[
   ("0–3","(tanpa ngomong, suara klik mainan)","ANTENG 30 MENIT 🤫","Tangan kecil asyik membuka kunci dan resleting di papan.","A toddler's small hands busily opening latches and zippers on a busy board"),
   ("3–8","Ini papan sibuk. Isinya resleting, gesper, kunci, saklar.","ISINYA BANYAK","Papan dari dekat.","Close-up of a busy board with zippers, buckles and switches"),
   ("8–14","Sambil main, anak latihan motorik halus.","LATIH MOTORIK ✅","Jari kecil memutar kenop.","Tiny fingers turning a knob on a busy board"),
   ("14–18","Bonus: ibu bisa ngopi dengan tenang. Keranjang kuning.","CEK KERANJANG 👇","Cangkir kopi di samping.","A cup of coffee next to a busy board on the floor"),
  ]),
  S("Buku sensori kain (quiet book)","18 detik",[
   ("0–3","(tanpa ngomong)","LUPA SAMA HP 📵","Tangan kecil membalik halaman buku kain.","A toddler's hands flipping a colorful felt quiet book"),
   ("3–8","Buku kain ini tiap halaman ada aktivitasnya.","TIAP HALAMAN BEDA","Halaman ditempel, dikancing, dicocokkan.","Felt pieces being matched and buttoned on quiet book pages"),
   ("8–14","Nggak bisa sobek, aman digigit, gampang dibawa pergi.","NGGAK BISA SOBEK ✅","Buku dimasukkan ke tas.","A felt quiet book placed into a diaper bag"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Buku di lantai.","A quiet book open on a play mat"),
  ]),
  S("Playmat lipat","18 detik",[
   ("0–3","(tanpa ngomong)","AREA AMAN BUAT MAIN ✨","Kaki kecil berlari di playmat empuk.","A toddler's small feet running on a soft foldable play mat"),
   ("3–8","Playmat ini empuk, jatuh pun aman.","EMPUK, AMAN JATUH","Tangan menekan permukaan empuk.","An adult hand presses into a thick soft play mat"),
   ("8–14","Tumpahan susu tinggal lap, dan bisa dilipat kalau ada tamu.","TINGGAL LAP + BISA DILIPAT ✅","Lap tumpahan, lalu dilipat.","Spilled milk wiped off a play mat, then the mat folded up"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Playmat terlipat.","A folded play mat leaning against a wall"),
  ]),
 ]),
dict(id="03", name="Rutinitas Harian", sub="Tunjukkan urutan kegiatan anak",
 inti="Rekam rutinitas mandi, makan, atau tidur, dengan barang yang dijual sebagai bintangnya.",
 psikologi="Video rutinitas enak ditonton dan memberi ide untuk ibu lain. Barang terlihat dipakai sungguhan, bukan sekadar dipamerkan.",
 cocok="Food maker MPASI, tempat mandi bayi, lampu tidur, botol susu",
 hooks=["Rutinitas MPASI pagi, 15 menit.","Rutinitas tidur yang bikin anak cepat lelap.","Mandiin bayi sendirian, ini caranya.","Pagi ibu bekerja, versi cepat.","Ritual sebelum tidur anak aku."],
 scripts=[
  S("Food maker MPASI (kukus + blender)","20 detik",[
   ("0–4","Rutinitas MPASI pagi, cuma lima belas menit.","MPASI 15 MENIT ⏱️","Sayur dan ayam di talenan.","Fresh carrots, broccoli and chicken on a cutting board"),
   ("4–10","Masukin, kukus di alat ini.","KUKUS DI SINI","Bahan masuk ke alat, uap keluar.","Ingredients placed into a baby food maker, steam rising"),
   ("10–16","Tinggal balik, langsung blender di wadah yang sama. Nggak banyak cucian.","KUKUS + BLENDER ✅","Alat dibalik dan memblender.","The baby food maker flipped to blend steamed food into smooth puree"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Mangkuk bubur di samping alat.","A bowl of smooth baby puree next to a food maker"),
  ]),
  S("Lampu tidur proyektor","18 detik",[
   ("0–4","Ritual sebelum tidur anak aku.","RITUAL TIDUR 🌙","Kamar redup.","A dim cozy child's bedroom at night"),
   ("4–10","Matikan lampu, nyalakan proyektor bintang dan lagu pelan.","BINTANG + LAGU PELAN","Bintang muncul di langit-langit.","Soft star projections appear across a bedroom ceiling"),
   ("10–15","Anak jadi tenang dan lebih cepat ngantuk.","LEBIH TENANG ✅","Tangan kecil memeluk boneka di kasur.","A child's small hand hugging a plush toy in bed under star lights"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Lampu di meja.","A star projector lamp on a nightstand"),
  ]),
  S("Bak mandi bayi lipat","20 detik",[
   ("0–4","Mandiin bayi sendirian? Ini caranya biar aman.","MANDI SENDIRIAN? 🛁","Bak mandi lipat dibuka.","A foldable baby bathtub being opened"),
   ("4–10","Bak ini ada jaring penyangga, bayi nggak merosot.","ADA PENYANGGA","Jaring penyangga dari dekat.","Close-up of a baby support net inside a bathtub"),
   ("10–16","Kedua tangan ibu bebas buat menyabun.","TANGAN BEBAS ✅","Tangan menyabun lembut punggung kecil.","Adult hands gently washing a baby's small back, no faces"),
   ("16–20","Habis mandi dilipat, hemat tempat. Keranjang kuning.","CEK KERANJANG 👇","Bak terlipat tipis.","A folded baby bathtub stored flat"),
  ]),
 ]),
dict(id="04", name="Cerita \"Kayak Aku Banget\"", sub="Ceritakan dari sudut pandang penonton",
 inti="Pilih satu tipe ibu (ibu bekerja, ibu baru, ibu anak dua) dan ceritakan dari sudut pandangnya.",
 psikologi="Penonton membayangkan dirinya di posisi itu. Barang terasa seperti jawaban untuk hari-harinya.",
 cocok="Tas ASI, pompa ASI, stroller, tas popok",
 hooks=["POV: ibu bekerja yang tetap mau kasih ASI.","POV: ibu baru, semua serba bingung.","POV: anak dua, tangan cuma dua.","POV: mudik bawa bayi.","POV: ibu yang selalu lupa bawa barang."],
 scripts=[
  S("Pompa ASI elektrik wireless","20 detik",[
   ("0–4","POV: ibu bekerja yang tetap mau kasih ASI.","POV: IBU BEKERJA 💼","Meja kantor dengan tas ASI.","An office desk with a cooler bag for breast milk"),
   ("4–10","Pompa ini tanpa kabel, masuk ke dalam bra.","TANPA KABEL","Pompa kecil di tangan.","A compact wearable breast pump held in a hand"),
   ("10–16","Bisa sambil kerja di laptop, suaranya pelan.","SAMBIL KERJA ✅","Tangan mengetik di laptop.","Hands typing on a laptop at an office desk"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Pompa di dalam tas.","A wearable breast pump in a pouch"),
  ]),
  S("Tas popok ransel","18 detik",[
   ("0–4","POV: ibu yang selalu lupa bawa barang bayi.","POV: SELALU LUPA 😅","Barang bayi berserakan di kasur.","Baby items scattered on a bed"),
   ("4–10","Tas ini banyak kantongnya, ada kantong termal buat botol.","BANYAK KANTONG","Kantong-kantong tas dibuka.","Hands open the many pockets of a diaper backpack"),
   ("10–14","Semua barang ada tempatnya, nggak ada yang ketinggalan.","SEMUA ADA TEMPATNYA ✅","Barang masuk rapi.","Baby items packed neatly into labeled pockets"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Tas dipakai di punggung.","A diaper backpack worn on a back, no face"),
  ]),
  S("Stroller lipat kabin","20 detik",[
   ("0–4","POV: mudik bawa bayi, barang banyak.","POV: MUDIK BAWA BAYI ✈️","Koper dan barang bayi.","Suitcases and baby gear by a front door"),
   ("4–10","Stroller ini dilipat satu tangan, sekecil ini.","LIPAT SATU TANGAN","Stroller dilipat satu tangan.","A compact stroller folded with one hand"),
   ("10–16","Muat di bagasi kabin pesawat dan bagasi motor.","MUAT DI KABIN ✅","Stroller masuk ke bagasi mobil.","A folded stroller placed into a car trunk"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Stroller terbuka.","An open compact stroller"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang aman untuk anak",
 inti="Ajari cara mengecek keamanan barang anak (BPA free, SNI, ukuran), lalu tunjukkan produkmu yang lolos.",
 psikologi="Keamanan anak adalah hal yang paling dikhawatirkan ibu. Tips cara mengecek membuat kamu dipercaya sebagai sesama ibu yang teliti.",
 cocok="Botol susu, mainan, dot, peralatan makan, kursi makan",
 hooks=["Jangan beli mainan anak sebelum cek label ini.","Botol susu BPA free itu apa?","Kursi makan anak, cek 3 hal ini.","Mainan murah tapi bahaya?","Ibu baru wajib tahu ini."],
 scripts=[
  S("Mainan ber-SNI","20 detik",[
   ("0–4","Jangan beli mainan anak sebelum cek label ini.","CEK LABEL INI ✋","Kotak mainan.","A toy box held in hands"),
   ("4–10","Cari logo SNI dan cek bagian kecil.","CEK SNI + BAGIAN KECIL","Jari menunjuk logo SNI.","A finger points at a safety certification logo on a toy box"),
   ("10–16","Mainan ini ber-SNI, bagiannya besar dan ujungnya tumpul.","LOLOS ✅","Mainan kayu dari dekat.","Close-up of a smooth wooden toy with rounded edges"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Mainan di playmat.","A wooden toy on a play mat"),
  ]),
  S("Botol susu BPA free","20 detik",[
   ("0–4","Botol susu kamu sudah BPA free?","SUDAH BPA FREE?","Botol susu di tangan.","A baby bottle held in a hand"),
   ("4–10","Cek tulisan BPA free di botol, karena botol sering kena air panas.","CEK TULISAN BPA FREE","Tulisan di dasar botol.","Close-up of BPA free text on the base of a bottle"),
   ("10–16","Yang ini juga ada ventilasi anti kembung.","+ ANTI KEMBUNG ✅","Katup ventilasi dari dekat.","Close-up of an anti-colic vent valve on a bottle"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Botol di rak pengering.","Baby bottles on a drying rack"),
  ]),
  S("Kursi makan bayi","20 detik",[
   ("0–4","Kursi makan anak, cek tiga hal ini.","CEK 3 HAL","Kursi makan.","A baby high chair in a dining area"),
   ("4–10","Sabuk pengaman lima titik, kaki kursi lebar, dan meja yang bisa dilepas.","SABUK ✅ KAKI LEBAR ✅ MEJA LEPAS ✅","Sabuk dikunci, meja dilepas.","Hands buckle a five-point harness and remove a high chair tray"),
   ("10–16","Mejanya bisa langsung dicuci di wastafel.","GAMPANG DICUCI","Meja dibilas.","A high chair tray rinsed in a sink"),
   ("16–20","Yang ini lolos semua. Keranjang kuning.","CEK KERANJANG 👇","Kursi makan rapi.","A clean high chair"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan barang anak bermerek mahal dengan produkmu yang fungsinya mirip.",
 psikologi="Kebutuhan anak banyak, jadi ibu senang menemukan yang fungsinya sama tapi lebih hemat.",
 cocok="Stroller, botol, gendongan, mainan, perlengkapan MPASI",
 hooks=["Stroller 8 juta vs 1 juta.","Botol susu impor vs lokal.","Gendongan mahal vs ini.","Anak nggak tahu merek, Bu.","Hemat buat beli kebutuhan lain."],
 scripts=[
  S("Gendongan ergonomis lokal","20 detik",[
   ("0–4","Gendongan dua juta vs dua ratus ribu.","2 JUTA vs 200RB 🤔","Dua gendongan.","Two baby carriers side by side on a bed"),
   ("4–10","Dua-duanya posisi kaki M yang ergonomis.","SAMA-SAMA POSISI M","Ilustrasi posisi kaki dengan boneka.","A baby doll seated in a carrier showing the ergonomic M-position"),
   ("10–16","Bantalan bahunya juga sama-sama tebal.","BANTALAN TEBAL ✅","Bantalan ditekan.","A hand presses padded carrier shoulder straps"),
   ("16–20","Selisihnya bisa buat beli popok sebulan. Keranjang kuning.","HEMAT BUAT POPOK 👇","Gendongan lokal diangkat.","A hand holds up the affordable carrier"),
  ]),
  S("Food container MPASI","18 detik",[
   ("0–4","Wadah MPASI impor vs lokal.","IMPOR vs LOKAL","Dua set wadah.","Two sets of baby food containers"),
   ("4–10","Sama-sama tahan freezer dan microwave, ada tanggalnya juga.","FREEZER + MICROWAVE","Wadah masuk freezer.","Baby food containers placed into a freezer"),
   ("10–14","Yang lokal isinya lebih banyak.","ISI LEBIH BANYAK ✅","Wadah berjejer.","A row of small food containers"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Wadah berisi bubur.","Containers filled with baby puree"),
  ]),
  S("Mainan balok kayu","18 detik",[
   ("0–4","Balok kayu 600 ribu vs 90 ribu.","600RB vs 90RB","Dua set balok.","Two sets of wooden blocks"),
   ("4–10","Kayunya sama-sama halus, catnya aman.","HALUS + CAT AMAN","Jari mengusap balok.","A finger strokes a smooth painted wooden block"),
   ("10–14","Anak tetap senang menyusun.","ANAK TETAP SENANG ✅","Tangan kecil menyusun balok.","A toddler's hands stacking wooden blocks"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Balok di keranjang.","Wooden blocks in a basket"),
  ]),
 ]),
dict(id="07", name="Beres-beres yang Bikin Puas", sub="Dari berantakan jadi rapi",
 inti="Rekam mainan atau perlengkapan anak yang berantakan sampai rapi, hampir tanpa ngomong.",
 psikologi="Rumah dengan anak pasti berantakan. Melihat transformasi jadi rapi memberi rasa lega dan ditonton berulang kali.",
 cocok="Rak mainan, kotak penyimpanan, organizer popok, rak botol",
 hooks=["Mainan berserakan jadi rapi.","Tonton pakai suara 🔊","Beresin lemari baju bayi.","Restock popok paling satisfying.","Kamar anak sebelum dan sesudah."],
 scripts=[
  S("Rak mainan dengan kotak","20 detik",[
   ("0–3","(tanpa ngomong)","KAMAR ANAK AKU 😵","Mainan berserakan di lantai.","Toys scattered all over a playroom floor"),
   ("3–13","(tanpa ngomong, suara mainan dimasukkan)","(tanpa tulisan)","Mainan dimasukkan ke kotak per jenis.","Hands sorting toys into labeled bins on a toy shelf"),
   ("13–17","(tanpa ngomong)","SESUDAHNYA ✨","Rak mainan rapi.","A tidy toy shelf with neat bins"),
   ("17–20","Link di keranjang kuning.","CEK KERANJANG 👇","Tangan kecil mengambil mainan dari kotak.","A toddler's hand picks a toy from a bin"),
  ]),
  S("Organizer lemari baju bayi","20 detik",[
   ("0–3","(tanpa ngomong)","LEMARI BAYI 🫣","Baju bayi bertumpuk.","A messy pile of tiny baby clothes in a drawer"),
   ("3–13","(tanpa ngomong)","(tanpa tulisan)","Baju dilipat kecil dan dimasukkan ke organizer.","Hands folding baby clothes into small rolls and placing them in drawer dividers"),
   ("13–17","(tanpa ngomong)","SESUDAHNYA ✨","Laci rapi.","A neatly organized baby clothes drawer"),
   ("17–20","Link di keranjang kuning.","CEK KERANJANG 👇","Laci ditutup.","The drawer slides shut"),
  ]),
  S("Rak pengering botol","18 detik",[
   ("0–3","(suara botol berjatuhan)","BOTOL BERANTAKAN 😩","Botol dan dot di wastafel.","Baby bottles and teats piled in a sink"),
   ("3–12","(tanpa ngomong)","(tanpa tulisan)","Botol dicuci, dipasang di rak pengering.","Washed baby bottles placed one by one onto a drying rack"),
   ("12–15","(tanpa ngomong)","SESUDAHNYA ✨","Rak penuh botol rapi.","A drying rack neatly filled with bottles"),
   ("15–18","Link di keranjang kuning.","CEK KERANJANG 👇","Rak di dapur.","A bottle drying rack on a counter"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah dipakai beberapa minggu, sebut kekurangannya duluan, baru kelebihannya, lalu cocok untuk siapa.",
 psikologi="Ibu-ibu saling percaya pada pengalaman jujur sesama ibu. Pembeli tahu yang diharapkan, jadi jarang kecewa.",
 cocok="Stroller, pompa ASI, baby monitor, kursi makan",
 hooks=["Sebulan pakai stroller ini, jujurnya…","Bukan endorse, aku beli sendiri.","Ada yang nggak aku suka.","Plus minus pompa ASI ini.","Jangan beli ini kalau…"],
 scripts=[
  S("Baby monitor kamera","22 detik",[
   ("0–4","Sebulan pakai baby monitor ini. Aku jujur ya.","SEBULAN, JUJUR","Kamera di rak kamar.","A baby monitor camera on a nursery shelf"),
   ("4–10","Minusnya: kalau wifi lemot, gambarnya telat beberapa detik.","❌ WIFI LEMOT = TELAT","Layar HP loading.","A phone screen showing a loading video feed"),
   ("10–17","Tapi aku bisa masak sambil lihat anak tidur, dan ada notif kalau ada suara tangis.","✅ BISA SAMBIL MASAK","Tangan memegang HP sambil mengaduk masakan.","A hand holds a phone showing a sleeping baby's crib while stirring a pot"),
   ("17–22","Cocok buat rumah dengan wifi stabil. Keranjang kuning.","COCOK BUAT KAMU? 👇","Kamera di rak.","A baby monitor camera"),
  ]),
  S("Pompa ASI elektrik","20 detik",[
   ("0–4","Plus minus pompa ASI ini setelah sebulan.","PLUS MINUS","Pompa di meja.","An electric breast pump on a table"),
   ("4–10","Minusnya: bagiannya banyak, jadi cucinya agak lama.","❌ CUCINYA AGAK LAMA","Bagian pompa dibongkar.","Breast pump parts disassembled on a drying mat"),
   ("10–16","Tapi hisapannya nyaman dan levelnya bisa diatur.","✅ NYAMAN, BISA DIATUR","Tombol level ditekan.","A finger presses the level button on a pump display"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Botol ASI terisi.","A filled breast milk bottle"),
  ]),
  S("Stroller ringan","20 detik",[
   ("0–4","Dua bulan pakai stroller ini. Ada minusnya.","2 BULAN PAKAI","Stroller di teras.","A lightweight stroller on a porch"),
   ("4–10","Minusnya: rodanya kecil, kurang nyaman di jalan berbatu.","❌ RODA KECIL","Roda dari dekat.","Close-up of small stroller wheels on a bumpy path"),
   ("10–16","Tapi ringan banget dan gampang dilipat buat ke mal.","✅ RINGAN + GAMPANG DILIPAT","Stroller diangkat satu tangan.","A lightweight stroller lifted with one hand"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Stroller terlipat.","A folded stroller"),
  ]),
 ]),
dict(id="09", name="1 Barang, Banyak Fungsi", sub="Satu barang, banyak kegunaan",
 inti="Tunjukkan beberapa cara pakai barang anak yang jarang orang tahu.",
 psikologi="Barang anak cepat tidak terpakai. Barang yang punya banyak fungsi terasa lebih awet dan worth it.",
 cocok="Kain bedong, bantal menyusui, kursi makan, kotak mainan",
 hooks=["Kain bedong ini bisa buat 3 hal.","Jangan buang bantal menyusui, ini fungsinya.","3 cara pakai yang jarang ibu tahu.","Simpan video ini, ibu baru wajib tahu.","Satu barang, dipakai sampai anak besar."],
 scripts=[
  S("Kain bedong muslin","20 detik",[
   ("0–3","Kain bedong ini bisa buat tiga hal.","1 KAIN = 3 FUNGSI","Kain muslin dibentangkan.","A soft muslin swaddle blanket unfolded"),
   ("3–8","Satu: bedong bayi.","CARA #1","Membedong boneka.","Hands swaddling a baby doll in muslin"),
   ("8–13","Dua: penutup menyusui.","CARA #2","Kain menutup bahu (tanpa wajah).","A muslin cloth draped over a shoulder as a nursing cover"),
   ("13–20","Tiga: alas ganti popok. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Kain sebagai alas di kasur.","A muslin cloth spread as a changing mat on a bed"),
  ]),
  S("Bantal menyusui","20 detik",[
   ("0–3","Jangan buang bantal menyusui, ini fungsinya setelah ASI.","JANGAN DIBUANG","Bantal menyusui.","A nursing pillow on a sofa"),
   ("3–8","Satu: bantal menyusui.","CARA #1","Bantal di pangkuan.","A nursing pillow placed around a lap"),
   ("8–13","Dua: latihan tengkurap bayi.","CARA #2","Bantal di lantai dengan mainan.","A nursing pillow on a play mat with toys for tummy time"),
   ("13–20","Tiga: sandaran duduk anak. Simpan, link di keranjang.","CARA #3 + SIMPAN 👇","Bantal sebagai sandaran.","A nursing pillow used as a seat support on a mat"),
  ]),
  S("Kursi makan 3 in 1","20 detik",[
   ("0–3","Kursi ini dipakai dari bayi sampai TK.","BAYI SAMPAI TK","Kursi makan.","A convertible high chair"),
   ("3–8","Satu: kursi makan tinggi.","CARA #1","Mode kursi tinggi.","Convertible chair in high chair mode"),
   ("8–13","Dua: booster di kursi makan dewasa.","CARA #2","Dipasang di kursi dewasa.","The seat strapped onto an adult dining chair as a booster"),
   ("13–20","Tiga: meja kursi belajar. Simpan, link di keranjang.","CARA #3 + SIMPAN 👇","Mode meja dan kursi kecil.","The chair converted into a small kids' table and chair set"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Hitung berapa yang dihemat",
 inti="Bandingkan barang reusable atau tahan lama dengan biaya rutin supaya terasa hemat.",
 psikologi="Pengeluaran anak terasa tidak ada habisnya. Barang yang menghemat biaya rutin terasa seperti tabungan.",
 cocok="Popok kain, food maker, kursi convertible, botol sedotan",
 hooks=["Popok kain hemat 2 juta setahun?","Bikin MPASI sendiri vs beli jadi.","Aku hitungin biar kamu nggak kaget.","Hemat buat dana pendidikan.","Jangan bilang mahal sebelum lihat ini."],
 scripts=[
  S("Popok kain modern (clodi)","20 detik",[
   ("0–4","Popok sekali pakai sebulan berapa? Aku hitungin.","POPOK SEBULAN? 🧮","Popok sekali pakai dan kalkulator.","Disposable diapers next to a smartphone calculator"),
   ("4–10","Sebulan bisa 300 ribu. Setahun 3,6 juta.","SETAHUN 3,6 JUTA 💸","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Popok kain ini dicuci, dipakai sampai anak lulus popok.","DIPAKAI ULANG ✅","Popok kain warna-warni dijemur.","Colorful cloth diapers drying on a line"),
   ("16–20","Bisa dikombinasi dulu. Keranjang kuning.","CEK KERANJANG 👇","Tumpukan popok kain.","A stack of cloth diapers"),
  ]),
  S("Food maker MPASI","20 detik",[
   ("0–4","MPASI beli jadi vs bikin sendiri. Hitungannya gini.","BELI JADI vs BIKIN","Bubur instan dan alat.","Jars of store-bought baby food next to a baby food maker"),
   ("4–10","Bubur jadi sehari 15 ribu, sebulan 450 ribu.","SEBULAN 450RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Bikin sendiri jauh lebih hemat, dan ibu tahu isinya.","LEBIH HEMAT + TAHU ISINYA ✅","Bubur segar dibuat.","Fresh baby puree blended in a food maker"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Alat di dapur.","A baby food maker on a counter"),
  ]),
  S("Botol minum sedotan anak","18 detik",[
   ("0–4","Beli minuman kemasan buat anak tiap hari? Hitung ini.","MINUMAN KEMASAN? 🧃","Kotak minuman di meja.","Juice boxes on a table"),
   ("4–10","Lima ribu sehari, sebulan 150 ribu.","SEBULAN 150RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–14","Bawa botol ini dari rumah, anak tetap senang.","BAWA DARI RUMAH ✅","Botol diisi air.","A kids' straw bottle filled with water"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol di tas sekolah.","A straw bottle in a school bag"),
  ]),
 ]),
]
