NICHE = "Hobi & Gaya Hidup"
SETTING = "bright Indonesian home, porch or garden"
PLACE = "a bright Indonesian home porch with plants"
FACELESS = "Only hands, feet or the body from the neck down visible, no face."
AMB = "natural ambient sounds"
DEF_M = "hobi jadi ribet dan berantakan"
DEF_K = "hobi jadi lebih praktis dan seru"
PH = ["tempat makan kucing otomatis", "lupa kasih makan kucing kalau pergi seharian", "makan terjadwal, bisa diatur dari HP"]
TPL_FILE = "hobi_tpl.json"
TIPS_BROLL = "Rekam di tempat hobinya: teras, taman, garasi, atau tempat olahraga, dengan cahaya alami. Cukup tangan, kaki, atau leher ke bawah. Kalau ada hewan peliharaan, mereka bintang utamanya. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar."
CATS = [["Semua", None], ["Hewan peliharaan", ["01","02","07","10"]], ["Olahraga & outdoor", ["03","04","06","08"]],
        ["Motor & otomotif", ["01","05","09"]], ["Tanaman & berkebun", ["02","07","09"]]]
START = [
 ("Hari 1","Gaya 02: Hasil Dulu","Paling gampang. Rekam hewan peliharaan atau tanaman yang kelihatan bagus."),
 ("Hari 2","Gaya 01: Masalah yang Bikin Kesel","Ceritakan kerepotan hobimu."),
 ("Hari 3","Gaya 07: Bikin Puas Ditonton","Rekam proses yang enak ditonton, hampir tanpa ngomong."),
 ("Hari 4","Gaya 04: Cerita \"Kayak Aku Banget\"","Cerita sesama pecinta hobi yang sama."),
 ("Hari 5","Gaya 09: 1 Alat, Banyak Fungsi","Ajak penonton menyimpan video."),
 ("Hari 6","Gaya 08: Review Jujur","Komunitas hobi sangat menghargai review jujur."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Kesel", sub="Tunjukkan masalah, lalu solusinya",
 inti="Mulai dari kerepotan hobi sehari-hari (bau pasir kucing, helm bau, motor kotor), lalu tunjukkan produknya.",
 psikologi="Pecinta hobi sangat mengenali kerepotan hobinya. Masalah yang sama membuat mereka langsung menonton solusinya.",
 cocok="Pasir kucing, pembersih helm, cover motor, sarung tangan",
 hooks=["Rumah bau pasir kucing?","Helm bau apek?","Motor kotor lagi habis hujan?","Anabul suka ngacak-ngacak?","Pecinta kucing wajib tahu ini."],
 scripts=[
  S("Pasir kucing tofu","18 detik",[
   ("0–3","Rumah bau pasir kucing?","RUMAH BAU? 🙀","Bak pasir lama yang kotor.","Close-up of a dirty clumpy cat litter box"),
   ("3–8","Pasir biasa debunya banyak dan baunya nempel.","DEBU + BAU NEMPEL","Debu beterbangan saat pasir dituang.","Dusty clay litter being poured, dust clouding up"),
   ("8–14","Pasir tofu ini menggumpal cepat, minim debu, dan bisa dibuang ke kloset.","MINIM DEBU, BISA DIBUANG ✅","Pasir tofu dituang, gumpalan diangkat.","Tofu cat litter poured without dust, then a clump scooped out easily"),
   ("14–18","Anabul juga suka. Cek keranjang kuning.","CEK KERANJANG 👇","Kucing masuk bak pasir.","A cat stepping into a clean litter box"),
  ]),
  S("Spray pembersih helm","18 detik",[
   ("0–3","Helm bau apek?","HELM BAU APEK? 🤢","Bagian dalam helm kusam.","Close-up of the worn inner padding of a motorcycle helmet"),
   ("3–8","Busa helm jarang dicuci, apalagi tiap hari kena keringat.","KENA KERINGAT TIAP HARI","Helm di jok motor.","A helmet resting on a scooter seat"),
   ("8–14","Semprot ini ke busa helm, diamkan sebentar. Bau hilang, wangi segar.","SEMPROT, WANGI ✅","Spray disemprot ke dalam helm.","A cleaning spray misted into a helmet's inner padding"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol spray di samping helm.","A spray bottle next to a helmet"),
  ]),
  S("Cover motor anti air","18 detik",[
   ("0–3","Motor kotor lagi habis hujan?","KOTOR HABIS HUJAN? 🌧️","Motor basah penuh cipratan lumpur.","A scooter covered in rain spots and mud splashes"),
   ("3–8","Parkir di luar, jok jadi basah dan panas kalau siang.","JOK BASAH & PANAS","Tangan menyentuh jok basah.","A hand touching a wet scooter seat"),
   ("8–14","Pakai cover ini, tahan air dan nggak tembus panas.","TAHAN AIR + PANAS ✅","Cover dipasang, air disiram.","A waterproof cover pulled over a scooter, water poured off it"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Cover dilipat di bagasi.","A folded motorcycle cover in a storage compartment"),
  ]),
 ]),
dict(id="02", name="Hasil Dulu", sub="Tunjukkan hasilnya duluan",
 inti="Detik pertama tampilkan hasil yang bikin pengen: hewan lucu, tanaman subur, motor mengilap.",
 psikologi="Komunitas hobi senang melihat hasil yang indah. Hasil yang ditampilkan duluan bikin penasaran rahasianya.",
 cocok="Vitamin tanaman, sampo hewan, wax motor, lampu tanaman",
 hooks=["Bulu kucing aku sekarang kayak gini.","Tanaman aku jadi subur banget.","Motor kinclong kayak baru keluar dealer.","Tebak pakai apa?","Rahasianya cuma satu."],
 scripts=[
  S("Sampo kucing","16 detik",[
   ("0–3","(tanpa ngomong, kucing berbulu lembut)","BULUNYA LEMBUT BANGET 🐱","Tangan mengelus bulu kucing yang lembut.","A hand stroking a cat's soft fluffy shiny fur"),
   ("3–8","Ini habis mandi pakai sampo kucing ini.","HABIS MANDI PAKAI INI","Botol sampo di samping bak.","A cat shampoo bottle next to a small tub"),
   ("8–12","Wangi, nggak bikin gatal, dan bulu nggak kusut.","WANGI, NGGAK KUSUT ✅","Sisir meluncur di bulu.","A comb gliding smoothly through cat fur"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Kucing duduk tenang.","A clean cat sitting calmly on a sofa"),
  ]),
  S("Pupuk cair tanaman","16 detik",[
   ("0–3","(tanpa ngomong)","SUBUR BANGET 🌿","Daun hijau segar mengilap.","Close-up of lush glossy green leaves in sunlight"),
   ("3–8","Dulu daunnya kuning-kuning. Sekarang aku kasih pupuk cair ini seminggu sekali.","SEMINGGU SEKALI","Pupuk dicampur ke penyiram.","Liquid fertilizer measured into a watering can"),
   ("8–12","Tinggal campur air, siram.","CAMPUR, SIRAM ✅","Tanaman disiram.","A watering can pouring onto potted plants"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Pot-pot subur di teras.","A row of healthy potted plants on a porch"),
  ]),
  S("Wax motor","16 detik",[
   ("0–3","(tanpa ngomong)","KINCLONG KAYAK BARU ✨","Body motor mengilap memantulkan cahaya.","Close-up of a glossy scooter body reflecting light"),
   ("3–8","Ini cuma pakai wax semprot ini.","CUMA PAKAI INI","Wax disemprot ke body.","Spray wax misted onto a scooter panel"),
   ("8–12","Semprot, lap pakai microfiber. Lima menit.","5 MENIT ✅","Lap mengilapkan body.","A microfiber cloth buffing a scooter panel to a shine"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Botol wax di jok.","A wax spray bottle on a scooter seat"),
  ]),
 ]),
dict(id="03", name="Rutinitas Hobi", sub="Tunjukkan kegiatan harian",
 inti="Rekam rutinitas hobi (olahraga pagi, merawat tanaman, mengurus anabul) dengan produk sebagai bagiannya.",
 psikologi="Rutinitas yang menenangkan enak ditonton dan memotivasi. Produk terlihat dipakai sungguhan.",
 cocok="Matras yoga, botol minum olahraga, gunting tanaman, sisir hewan",
 hooks=["Rutinitas pagi 15 menit sebelum kerja.","Me time aku di teras tiap sore.","Mengurus anabul tiap pagi.","Olahraga di rumah tanpa gym.","Kebiasaan kecil yang bikin hari lebih tenang."],
 scripts=[
  S("Matras yoga tebal","20 detik",[
   ("0–4","Olahraga di rumah lima belas menit, tanpa gym.","TANPA GYM 🧘‍♀️","Matras digelar di ruang tamu.","A yoga mat unrolled on a living room floor in morning light"),
   ("4–10","Matras ini tebal, lutut nggak sakit, dan nggak licin.","TEBAL + NGGAK LICIN","Lutut di matras, tangan menekan.","A knee resting on a thick yoga mat, hand pressing into it"),
   ("10–16","Habis olahraga, gulung dan simpan di pojok.","GULUNG, SIMPAN ✅","Matras digulung.","A yoga mat rolled up and strapped"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Matras bersandar.","A rolled yoga mat leaning against a wall"),
  ]),
  S("Gunting tanaman","18 detik",[
   ("0–4","Me time aku di teras tiap sore.","ME TIME DI TERAS 🌱","Teras penuh tanaman sore hari.","A porch full of potted plants in late afternoon light"),
   ("4–10","Rapiin daun kering pakai gunting ini, tajam dan ringan.","TAJAM + RINGAN","Gunting memotong daun kering.","Pruning shears snipping a dry leaf"),
   ("10–14","Tanaman jadi rapi dan tumbuh tunas baru.","TANAMAN RAPI ✅","Tanaman rapi.","A neatly pruned plant"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Gunting di meja.","Pruning shears on a garden table"),
  ]),
  S("Sisir bulu hewan (deshedding)","18 detik",[
   ("0–4","Mengurus anabul tiap pagi.","URUS ANABUL ☀️","Kucing di pangkuan.","A cat lying on a lap, no face of the owner"),
   ("4–10","Sisir ini ngangkat bulu rontok, jadi nggak nyebar di rumah.","BULU RONTOK TERANGKAT","Sisir mengangkat bulu.","A deshedding comb lifting loose fur from a cat"),
   ("10–14","Tinggal tekan tombol, bulunya lepas.","TEKAN, LEPAS ✅","Tombol ditekan, bulu terlepas.","A button pressed releasing fur from the comb"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Sisir dan gumpalan bulu.","A comb next to a pile of loose fur"),
  ]),
 ]),
dict(id="04", name="Cerita \"Kayak Aku Banget\"", sub="Ceritakan dari sudut pandang penonton",
 inti="Pilih satu tipe pecinta hobi (pemilik kucing yang kerja, anak kos pecinta tanaman, biker harian) dan ceritakan dari sudut pandangnya.",
 psikologi="Komunitas hobi punya identitas kuat. Cerita sesama penghobi terasa seperti teman yang merekomendasikan.",
 cocok="Tempat makan otomatis, tenda, helm, tas sepeda",
 hooks=["POV: punya kucing tapi kerja seharian.","POV: biker harian yang kehujanan terus.","POV: pengen kemah tapi nggak punya alat.","POV: anak kos pengen punya tanaman.","POV: baru mulai lari pagi."],
 scripts=[
  S("Tempat makan kucing otomatis","20 detik",[
   ("0–4","POV: punya kucing, tapi kerja seharian.","POV: KERJA SEHARIAN 🐾","Kucing menunggu di depan pintu.","A cat waiting by a front door"),
   ("4–10","Aku pasang tempat makan otomatis ini, jadwalnya diatur dari HP.","ATUR DARI HP","Jadwal diatur di aplikasi.","A phone app setting a feeding schedule"),
   ("10–16","Jam makan, makanannya keluar sendiri. Anabul tetap kenyang.","KELUAR SENDIRI ✅","Makanan keluar, kucing makan.","Dry food dispensing into a bowl and a cat eating"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Alat di sudut ruangan.","An automatic pet feeder in a room corner"),
  ]),
  S("Jas hujan setelan","18 detik",[
   ("0–4","POV: biker harian yang kehujanan terus.","POV: BIKER HARIAN 🏍️","Hujan deras di jalan.","Heavy rain on a city street"),
   ("4–10","Jas hujan setelan ini tebal, ada lapisan anti rembes di jahitan.","ANTI REMBES","Jahitan dari dekat.","Close-up of taped seams on a rain jacket"),
   ("10–14","Sampai kantor baju tetap kering.","BAJU TETAP KERING ✅","Jas dilepas, baju kering.","A rain jacket removed revealing a dry shirt, neck down"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Jas dilipat di jok.","A folded raincoat under a scooter seat"),
  ]),
  S("Tenda camping 4 orang","20 detik",[
   ("0–4","POV: pengen kemah bareng keluarga, tapi takut ribet.","POV: TAKUT RIBET ⛺","Barang camping berserakan.","Camping gear scattered on grass"),
   ("4–10","Tenda ini otomatis, tinggal buka, berdiri sendiri.","BERDIRI SENDIRI","Tenda dibuka dan mengembang.","A pop-up tent springing open on grass"),
   ("10–16","Muat empat orang, dan tahan hujan.","MUAT 4 + TAHAN HUJAN ✅","Bagian dalam tenda.","The roomy inside of a family tent"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Tenda di bumi perkemahan.","A tent at a campsite at dusk"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang aman",
 inti="Ajari cara memilih produk hobi yang aman (helm SNI, makanan hewan sesuai umur, pot berlubang), lalu tunjukkan produkmu yang lolos.",
 psikologi="Pecinta hobi ingin yang terbaik untuk hobinya. Tips memilih membuat kamu terlihat berpengalaman dan dipercaya.",
 cocok="Helm, makanan hewan, sepatu lari, pot tanaman",
 hooks=["Jangan beli helm sebelum cek ini.","Makanan kucing kamu sesuai umur?","Kenapa tanamanmu busuk akarnya?","Sepatu lari murah bikin cedera?","3 hal yang dicek sebelum beli."],
 scripts=[
  S("Helm SNI","20 detik",[
   ("0–4","Jangan beli helm sebelum cek ini.","CEK DULU ✋","Beberapa helm.","Several helmets on a shelf"),
   ("4–10","Wajib ada label SNI, dan busanya tebal.","SNI + BUSA TEBAL","Label SNI dan busa.","Close-up of a safety certification label and thick helmet padding"),
   ("10–16","Kacanya jernih, nggak bikin pandangan bengkok.","KACA JERNIH ✅","Melihat lewat kaca helm.","View through a clear helmet visor"),
   ("16–20","Helm ini lolos semua. Keranjang kuning.","CEK KERANJANG 👇","Helm diangkat.","A hand holds up a helmet"),
  ]),
  S("Makanan kucing kitten","20 detik",[
   ("0–4","Makanan kucing kamu sesuai umurnya?","SESUAI UMUR? 🐱","Anak kucing.","A small kitten on a rug"),
   ("4–10","Anak kucing butuh makanan khusus kitten, butirannya kecil.","BUTIRAN KECIL","Butiran kecil di telapak.","Small kibble pieces in a palm"),
   ("10–16","Yang ini khusus kitten, kemasannya ada zip biar awet.","KHUSUS KITTEN ✅","Kemasan zip dibuka.","A kitten food pouch with a resealable zip"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Anak kucing makan.","A kitten eating from a bowl"),
  ]),
  S("Pot tanaman berlubang","18 detik",[
   ("0–4","Kenapa akar tanamanmu busuk?","AKAR BUSUK? 🥀","Akar coklat busuk.","Brown rotting roots held in a hand"),
   ("4–10","Biasanya karena potnya nggak ada lubang, airnya menggenang.","AIR MENGGENANG","Pot tanpa lubang.","A pot with no drainage hole holding water"),
   ("10–14","Pot ini ada lubang dan piring tatakan.","ADA LUBANG ✅","Air mengalir keluar dari lubang.","Water draining out of a pot's holes into a saucer"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Set pot.","A set of pots with saucers"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan alat hobi bermerek mahal dengan produkmu yang fungsinya mirip.",
 psikologi="Hobi bisa jadi mahal. Penghobi senang menemukan alat yang fungsinya sama dengan harga masuk akal.",
 cocok="Sepatu lari, matras, alat pancing, lampu camping",
 hooks=["Sepatu lari 2 juta vs 300 ribu.","Alat pancing mahal vs ini.","Fungsinya sama, harganya beda jauh.","Pemula nggak perlu yang mahal.","Kembaran alat mahal."],
 scripts=[
  S("Sepatu lari","20 detik",[
   ("0–4","Sepatu lari dua juta vs tiga ratus ribu. Buat pemula perlu yang mahal?","2 JUTA vs 300RB 🏃","Dua sepatu lari.","Two pairs of running shoes side by side"),
   ("4–10","Aku pakai lari lima kilo dua-duanya.","TES LARI 5 KM","Kaki berlari di jalan.","Feet running on a road in running shoes"),
   ("10–16","Buat pemula, yang murah sudah empuk dan ringan.","PEMULA CUKUP ✅","Sol ditekan.","A thumb presses a cushioned running shoe sole"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Sepatu di lantai.","Running shoes on a floor"),
  ]),
  S("Lampu camping LED","18 detik",[
   ("0–4","Lampu camping branded vs lokal.","BRANDED vs LOKAL","Dua lampu.","Two camping lanterns side by side"),
   ("4–10","Terangnya hampir sama, dan sama-sama bisa dicas.","TERANG SAMA + BISA DICAS","Dua lampu menyala malam.","Two camping lanterns glowing at night"),
   ("10–14","Yang lokal bisa jadi powerbank juga.","BONUS POWERBANK ✅","HP dicas dari lampu.","A phone charging from a camping lantern"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Lampu di tenda.","A lantern hanging in a tent"),
  ]),
  S("Joran pancing set pemula","18 detik",[
   ("0–4","Joran sejuta vs set pemula dua ratus ribu.","1 JUTA vs 200RB 🎣","Dua joran.","Two fishing rods side by side"),
   ("4–10","Buat mancing di kolam, set ini sudah lengkap sama reel dan senarnya.","SUDAH LENGKAP","Isi set dibuka.","A beginner fishing kit with reel and line laid out"),
   ("10–14","Ringan dan gampang dipakai.","RINGAN ✅","Joran dilempar.","A fishing rod casting over a pond"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Set di tas.","A fishing kit in its bag"),
  ]),
 ]),
dict(id="07", name="Bikin Puas Ditonton", sub="Proses yang enak ditonton",
 inti="Rekam proses yang menenangkan atau memuaskan (mencuci motor, menanam, memandikan hewan), hampir tanpa ngomong.",
 psikologi="Video yang memuaskan ditonton berulang dan sering muncul di beranda. Penonton ikut merasa tenang.",
 cocok="Sabun cuci motor, pot, sprayer, mainan hewan",
 hooks=["Cuci motor paling satisfying.","Tonton pakai suara 🔊","Repotting tanaman.","Kucingku main sama mainan baru.","Ini bikin aku tenang."],
 scripts=[
  S("Sabun cuci motor salju (snow wash)","18 detik",[
   ("0–3","(suara semprotan busa)","CUCI MOTOR SATISFYING 🫧","Busa tebal menutupi motor.","Thick white snow foam covering a scooter"),
   ("3–11","(tanpa ngomong)","(tanpa tulisan)","Busa dibilas, kotoran luruh.","Foam rinsed off a scooter, dirt washing away"),
   ("11–15","Bersih tanpa digosok keras.","TANPA DIGOSOK ✅","Motor bersih mengilap.","A clean shiny scooter dripping water"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Botol sabun.","A snow foam bottle by a bucket"),
  ]),
  S("Sprayer tanaman","18 detik",[
   ("0–3","(suara semprotan halus)","SEGARNYA… 🌿","Embun halus di daun.","Fine mist settling on green leaves"),
   ("3–11","(tanpa ngomong)","(tanpa tulisan)","Sprayer dipompa dan disemprot ke tanaman.","Hands pumping a garden sprayer and misting plants"),
   ("11–15","Semprotannya halus, bisa diatur.","BISA DIATUR ✅","Nozzle diputar.","A hand twists a sprayer nozzle"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Sprayer di teras.","A garden sprayer on a porch"),
  ]),
  S("Mainan kucing interaktif","16 detik",[
   ("0–3","(suara mainan berputar)","KUCINGKU LANGSUNG HEBOH 😹","Kucing mengejar bulu yang berputar.","A cat chasing a spinning feather toy"),
   ("3–10","(tanpa ngomong)","(tanpa tulisan)","Kucing melompat dan mencakar mainan.","A cat pouncing and swatting at an interactive toy"),
   ("10–13","Mainnya sendiri, aku bisa kerja.","MAIN SENDIRI ✅","Kucing asyik main.","A cat happily playing alone"),
   ("13–16","Cek keranjang kuning.","CEK KERANJANG 👇","Mainan di lantai.","An interactive cat toy on the floor"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah dipakai beberapa minggu, sebut kekurangannya duluan, lalu kelebihannya dan cocok untuk siapa.",
 psikologi="Komunitas hobi saling bertanya sebelum membeli. Review jujur dianggap paling berharga.",
 cocok="Tenda, sepeda lipat, alat pancing, kandang, produk di atas Rp200 ribu",
 hooks=["Sebulan pakai, jujurnya…","Bukan endorse, aku beli sendiri.","Ada yang nggak aku suka.","Plus minus buat pemula.","Jangan beli ini kalau kamu…"],
 scripts=[
  S("Sepeda lipat","22 detik",[
   ("0–4","Sebulan pakai sepeda lipat ini. Aku jujur ya.","SEBULAN, JUJUR","Sepeda lipat terparkir.","A folding bike parked on a sidewalk"),
   ("4–10","Minusnya: kurang nyaman buat tanjakan curam.","❌ TANJAKAN BERAT","Sepeda di tanjakan.","A folding bike on a steep slope, legs only"),
   ("10–17","Plusnya: dilipat kecil, masuk mobil dan KRL, enak buat jalan santai.","✅ LIPAT KECIL","Sepeda dilipat.","A folding bike being folded compactly"),
   ("17–22","Cocok buat santai di kota. Keranjang kuning.","COCOK BUAT KAMU? 👇","Sepeda dilipat di bagasi.","A folded bike in a car trunk"),
  ]),
  S("Kandang kucing tingkat","20 detik",[
   ("0–4","Plus minus kandang kucing ini.","PLUS MINUS","Kandang di ruangan.","A multi-level cat cage in a room"),
   ("4–10","Minusnya: merakitnya butuh waktu sejam.","❌ RAKIT 1 JAM","Bagian kandang di lantai.","Cage parts laid on a floor"),
   ("10–16","Plusnya: kuat, ada tiga tingkat, dan rodanya bisa dikunci.","✅ KUAT + 3 TINGKAT","Kucing naik tingkat.","A cat climbing levels in a cage"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Kandang dengan kucing.","A cage with a relaxed cat inside"),
  ]),
  S("Smartwatch olahraga","20 detik",[
   ("0–4","Dua bulan pakai jam olahraga ini.","2 BULAN PAKAI","Jam di pergelangan.","A sports watch on a wrist"),
   ("4–10","Minusnya: GPS-nya agak lama nyambung.","❌ GPS LAMBAT","Layar mencari sinyal.","A watch screen searching for GPS"),
   ("10–16","Plusnya: baterai seminggu dan ada catatan lari.","✅ BATERAI SEMINGGU","Layar hasil lari.","A watch displaying a running summary"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Jam di kotak.","A sports watch in its box"),
  ]),
 ]),
dict(id="09", name="1 Alat, Banyak Fungsi", sub="Satu barang, banyak kegunaan",
 inti="Tunjukkan beberapa fungsi alat hobi yang jarang orang tahu.",
 psikologi="Alat serbaguna terasa lebih worth it. Tips tersembunyi mendorong penonton menyimpan video.",
 cocok="Pisau lipat, tas, lampu senter, botol semprot, rak",
 hooks=["Satu alat ini wajib dibawa ke mana-mana.","3 fungsi yang jarang orang tahu.","Simpan video ini.","Gantiin 3 alat sekaligus.","Biker wajib punya."],
 scripts=[
  S("Senter LED multifungsi","20 detik",[
   ("0–3","Senter ini wajib ada di motor.","WAJIB DI MOTOR 🔦","Senter di tangan.","A compact LED flashlight in a hand"),
   ("3–8","Satu: senter terang buat malam.","CARA #1","Sorot terang di jalan gelap.","A bright flashlight beam on a dark road"),
   ("8–13","Dua: lampu darurat merah kedip.","CARA #2","Lampu merah berkedip.","A flashlight blinking red as a warning light"),
   ("13–20","Tiga: powerbank darurat. Simpan, link di keranjang.","CARA #3 + SIMPAN 👇","HP dicas.","A phone charging from a flashlight power bank"),
  ]),
  S("Tas pinggang (waist bag)","20 detik",[
   ("0–3","Tas kecil ini bisa buat tiga kegiatan.","3 KEGIATAN","Tas pinggang.","A small waist bag"),
   ("3–8","Satu: lari pagi, muat HP dan kunci.","CARA #1 🏃","Dipakai berlari.","A waist bag worn while running, waist only"),
   ("8–13","Dua: naik motor, dompet aman di depan.","CARA #2 🏍️","Dipakai menyilang.","A waist bag worn crossbody on a scooter, neck down"),
   ("13–20","Tiga: jalan-jalan. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Dipakai jalan.","A waist bag worn while walking, neck down"),
  ]),
  S("Rak tanaman susun","20 detik",[
   ("0–3","Rak ini nggak cuma buat tanaman.","BUKAN CUMA TANAMAN","Rak susun kosong.","An empty tiered plant stand"),
   ("3–8","Satu: rak tanaman di teras.","CARA #1 🌿","Rak berisi pot.","A tiered stand filled with potted plants"),
   ("8–13","Dua: rak sepatu.","CARA #2","Rak berisi sepatu.","A tiered stand holding shoes"),
   ("13–20","Tiga: rak buku anak. Simpan, link di keranjang.","CARA #3 + SIMPAN 👇","Rak berisi buku.","A tiered stand holding children's books"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Bandingkan dengan biaya rutin",
 inti="Bandingkan harga barang dengan biaya rutin (grooming hewan, cuci motor, sewa alat) supaya terasa hemat.",
 psikologi="Biaya hobi yang rutin terasa besar kalau dijumlah. Alat yang balik modal cepat terasa sebagai investasi.",
 cocok="Alat grooming hewan, kit cuci motor, tenda, pasir kucing ukuran besar",
 hooks=["Grooming kucing 100 ribu. Alat ini balik modal 2 kali.","Cuci motor tiap minggu? Hitung ini.","Sewa tenda vs beli.","Aku hitungin biar nggak kaget.","Hemat sejuta setahun."],
 scripts=[
  S("Alat grooming hewan (clipper)","20 detik",[
   ("0–4","Grooming kucing seratus ribu. Alat ini balik modal dua kali pakai.","BALIK MODAL 2X 🧮","Alat dan kalkulator.","A pet grooming clipper next to a smartphone calculator"),
   ("4–10","Grooming sebulan sekali, setahun 1,2 juta.","SETAHUN 1,2 JUTA","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Suaranya pelan, anabul nggak takut.","SUARA PELAN ✅","Bulu kucing dirapikan.","A quiet clipper gently trimming cat fur"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Alat di meja.","A pet clipper kit"),
  ]),
  S("Kit cuci motor","20 detik",[
   ("0–4","Cuci motor seminggu sekali? Hitung ini.","CUCI TIAP MINGGU? 🧮","Kit cuci motor dan kalkulator.","A motorcycle wash kit next to a calculator"),
   ("4–10","Lima belas ribu seminggu, setahun 780 ribu.","SETAHUN 780RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Kit ini cukup buat berbulan-bulan, sekalian quality time.","BERBULAN-BULAN ✅","Motor dicuci di rumah.","A scooter washed at home with foam"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Kit dalam ember.","A wash kit in a bucket"),
  ]),
  S("Tenda camping","20 detik",[
   ("0–4","Sewa tenda vs beli. Mana lebih hemat?","SEWA vs BELI 🧮","Tenda dan kalkulator.","A packed tent next to a calculator"),
   ("4–10","Sewa sekali seratus ribu. Kemah empat kali setahun, 400 ribu.","SETAHUN 400RB","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Tenda ini setahun udah balik modal, dan bebas mau kemah kapan aja.","BALIK MODAL SETAHUN ✅","Tenda berdiri.","A tent pitched at a campsite"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Tenda dikemas.","A tent packed in its bag"),
  ]),
 ]),
]
