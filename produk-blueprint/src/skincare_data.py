NICHE = "Skincare & Bodycare"
SETTING = "bright clean Indonesian bedroom vanity or bathroom"
PLACE = "a bright clean bedroom with a simple vanity table"
FACELESS = "No full face shown; only hands, arms, or extreme close-ups of skin."
AMB = "soft natural room sounds"
DEF_M = "kulit kusam dan kering"
DEF_K = "kulit terasa lebih lembap"
PH = ["sunscreen gel", "kulit berminyak dan kusam pas siang", "ringan, nggak lengket, nggak whitecast"]
TPL_FILE = "skincare_tpl.json"
TIPS_BROLL = "Rekam pakai HP posisi tegak, dekat jendela biar kulit terlihat natural. Nggak perlu tampil wajah: cukup tangan, punggung tangan, lengan, atau pipi dari dekat. Jangan pakai filter supaya hasilnya jujur. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar."
CATS = [["Semua", None], ["Wajah (serum, sunscreen, moisturizer)", ["01","02","03","05","08"]], ["Badan (lotion, scrub, sabun)", ["02","04","07","10"]],
        ["Barang murah di bawah Rp50 ribu", ["06","09","10"]], ["Barang di atas Rp100 ribu", ["05","08","10"]]]
START = [
 ("Hari 1","Gaya 07: Tes Tekstur","Paling gampang. Cukup oles di punggung tangan, rekam dari dekat."),
 ("Hari 2","Gaya 03: Rutinitas Malam","Rekam urutan skincare kamu, nggak perlu tampil wajah."),
 ("Hari 3","Gaya 01: Masalah yang Bikin Insecure","Barang yang sama dengan gaya beda. Lihat mana yang lebih banyak ditonton."),
 ("Hari 4","Gaya 06: Murah vs Mahal","Penonton suka banget cari yang murah tapi bagus."),
 ("Hari 5","Gaya 05: Jangan Beli Sebelum Cek Ini","Ajari cara cek BPOM dan kandungan. Bikin kamu dipercaya."),
 ("Hari 6","Gaya 08: Review Jujur","Untuk barang yang sudah kamu pakai minimal 2 minggu."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Insecure", sub="Tunjukkan masalah kulit, lalu solusinya",
 inti="Mulai dari masalah kulit yang bikin nggak pede, lalu tunjukkan produk dan cara pakainya.",
 psikologi="Penonton yang punya masalah sama langsung merasa 'ini aku'. Kalimat jujur seperti 'bantu' dan 'menurutku' bikin lebih dipercaya daripada janji berlebihan.",
 cocok="Serum, toner, moisturizer, acne patch, sabun muka",
 hooks=["Siapa yang pede-nya hilang gara-gara jerawat?","Muka kusam padahal udah tidur cukup?","Ini yang aku pakai waktu kulitku lagi parah-parahnya.","Kalau kamu juga minder foto tanpa filter, tonton ini.","Jangan pencet jerawatmu sebelum lihat ini."],
 scripts=[
  S("Acne patch / plester jerawat","18 detik",[
   ("0–3","Jerawat muncul pas mau kondangan? Jangan dipencet!","JANGAN DIPENCET ✋","Dari dekat: jari hendak memencet jerawat di pipi (bagian pipi saja).","Extreme close-up of a fingertip about to squeeze a red pimple on a cheek, only cheek skin visible"),
   ("3–8","Aku tempel ini sebelum tidur. Tipis, hampir nggak kelihatan.","TEMPEL SEBELUM TIDUR","Tangan menempel acne patch bening di pipi.","Close-up of fingers placing a small clear acne patch onto cheek skin"),
   ("8–14","Paginya, patch-nya jadi putih. Itu kotorannya ketarik.","PAGINYA JADI PUTIH 😮","Patch dilepas, ditunjukkan ke HP, terlihat putih.","Fingers peel off an acne patch that has turned white and hold it up to the camera"),
   ("14–18","Murah, isinya banyak. Cek keranjang kuning ya.","CEK KERANJANG 👇","Kemasan acne patch di meja rias.","A pack of acne patches on a clean white vanity table, a hand points down"),
  ]),
  S("Serum niacinamide","20 detik",[
   ("0–3","Muka kusam padahal udah tidur cukup?","KUSAM TERUS? 😩","Pipi dari dekat terlihat kusam di cahaya jendela.","Extreme close-up of dull uneven cheek skin in natural window light"),
   ("3–8","Aku rutin pakai serum ini tiap malam, dua tetes aja.","2 TETES TIAP MALAM","Pipet meneteskan serum ke telapak tangan.","A dropper releases two drops of clear serum onto a palm"),
   ("8–15","Teksturnya cair, cepet meresap, nggak lengket. Pagi-pagi kulit terasa lebih cerah.","CEPET MERESAP ✅","Serum ditepuk ke pipi, lalu kulit terlihat segar.","Fingers gently pat serum into cheek skin, then the skin looks fresh and glowing in morning light"),
   ("15–20","Hasil tiap orang beda ya, tapi buat aku ini cocok. Keranjang kuning.","CEK KERANJANG 👇","Botol serum di meja rias.","A serum bottle with dropper on a clean vanity table in soft light"),
  ]),
  S("Sabun muka gentle (pH rendah)","18 detik",[
   ("0–3","Habis cuci muka, kulit ketarik kayak kering?","HABIS CUCI MUKA KETARIK?","Jari menekan pipi, kulit terlihat kering.","Close-up of fingers pressing dry tight cheek skin after washing"),
   ("3–8","Bisa jadi sabunnya terlalu keras buat kulitmu.","SABUNNYA TERLALU KERAS","Sabun busa banyak dibilas.","Close-up of thick harsh foam being rinsed off hands in a sink"),
   ("8–14","Aku ganti ke sabun ini. Busanya lembut, habis bilas kulit tetap lembap.","BUSA LEMBUT, TETAP LEMBAP ✅","Busa lembut di telapak tangan, lalu kulit dibilas.","Soft gentle cleanser foam in palms, then water splashing on cheek skin"),
   ("14–18","Cocok buat kulit sensitif. Cek keranjang kuning.","CEK KERANJANG 👇","Botol sabun muka di wastafel.","A gentle facial cleanser bottle on a clean bathroom sink"),
  ]),
 ]),
dict(id="02", name="Hasil Dulu", sub="Tunjukkan kulit yang glowing duluan",
 inti="Detik pertama langsung tampilkan hasil yang bikin pengen: kulit lembap, glowing, atau halus.",
 psikologi="Orang membeli skincare karena membayangkan hasilnya. Hasil yang ditampilkan duluan bikin berhenti scroll, lalu penonton penasaran apa yang dipakai.",
 cocok="Body lotion, moisturizer, body scrub, lip balm, body oil",
 hooks=["Ini kulit tangan aku. Umur 35.","Halus banget kan? Cuma pakai satu barang.","Tebak, ini pakai apa?","Kulit kering bersisik jadi kayak gini.","Aku nggak nyangka harganya segini."],
 scripts=[
  S("Body lotion","18 detik",[
   ("0–3","(tanpa ngomong, tangan mengusap lengan yang halus)","HALUS BANGET ✨","Gerakan lambat: tangan mengusap lengan yang glowing di cahaya jendela.","Slow motion, a hand glides over a smooth glowing forearm in warm window light"),
   ("3–8","Dulu lengan aku kering banget, sampai bersisik putih.","DULU KERING BERSISIK","Lengan kering dari dekat (bisa pakai video lama).","Extreme close-up of dry flaky arm skin with white scaly patches"),
   ("8–14","Sekarang tiap habis mandi aku pakai ini. Cepet meresap, wangi lembut.","HABIS MANDI, OLES ✅","Lotion dipompa ke tangan, dioles ke lengan.","A hand pumps body lotion and spreads it along a forearm, absorbing quickly"),
   ("14–18","Botolnya gede, awet sebulan lebih. Keranjang kuning ya.","CEK KERANJANG 👇","Botol lotion di meja.","A large body lotion bottle on a bathroom shelf beside a folded towel"),
  ]),
  S("Lip balm berwarna","16 detik",[
   ("0–3","(tanpa ngomong)","BIBIR SEHAT ALAMI 💋","Bibir dari dekat terlihat lembap dan merah alami.","Extreme close-up of soft moisturized lips with a natural rosy tint, only lips visible"),
   ("3–8","Ini cuma lip balm, bukan lipstik. Warnanya natural banget.","CUMA LIP BALM","Lip balm diputar dan dioles ke bibir.","A tinted lip balm stick twisted up and applied to lips"),
   ("8–12","Bibir pecah-pecah jadi lembap, dan bisa dipakai tiap hari.","LEMBAP + WARNA ✅","Bibir dioles, ditekan, terlihat lembap.","Lips pressing together after applying tinted balm, looking hydrated"),
   ("12–16","Murah banget, cek keranjang kuning.","CEK KERANJANG 👇","Lip balm di telapak tangan.","A tinted lip balm resting in an open palm"),
  ]),
  S("Body scrub","18 detik",[
   ("0–3","(suara tangan mengusap kulit yang halus)","SEHALUS INI 🤍","Tangan mengusap lutut atau siku yang halus.","Slow close-up of a hand gliding over a smooth knee"),
   ("3–8","Siku sama lutut aku dulu hitam dan kasar.","DULU KASAR & GELAP","Siku kasar dari dekat.","Extreme close-up of rough darker elbow skin"),
   ("8–14","Seminggu dua kali aku scrub pakai ini. Butirannya halus, nggak bikin perih.","2X SEMINGGU ✅","Scrub diambil dan digosok di siku dengan busa, lalu dibilas.","Fingers scoop body scrub and massage it onto an elbow in the shower, then rinse it off"),
   ("14–18","Wanginya enak banget. Cek keranjang kuning.","CEK KERANJANG 👇","Toples scrub terbuka di kamar mandi.","An open jar of body scrub on a bathroom shelf with water droplets"),
  ]),
 ]),
dict(id="03", name="Rutinitas Malam", sub="Tunjukkan urutan pemakaian",
 inti="Rekam urutan skincare dari langkah pertama sampai terakhir, dengan produk yang dijual sebagai bintangnya.",
 psikologi="Video rutinitas terasa tenang dan enak ditonton sampai habis. Penonton belajar urutan pakai yang benar, jadi merasa dapat ilmu, bukan sekadar dijualin.",
 cocok="Serum, toner, moisturizer, sleeping mask, micellar water",
 hooks=["Rutinitas malam aku yang cuma 3 langkah.","Skincare malam buat ibu yang capek.","Urutan pakai skincare yang benar, biar nggak sia-sia.","5 menit sebelum tidur, ini yang aku pakai.","Skincare malam versi hemat."],
 scripts=[
  S("Sleeping mask","22 detik",[
   ("0–4","Rutinitas malam aku cuma tiga langkah, buat ibu yang udah capek.","CUMA 3 LANGKAH 🌙","Meja rias dengan 3 produk berjejer, lampu temaram.","Three skincare products lined up on a vanity table under warm dim evening light"),
   ("4–9","Satu, cuci muka. Dua, serum.","1. CUCI MUKA 2. SERUM","Tangan membasuh dengan air, lalu menepuk serum.","Hands splash water on cheek skin, then pat in serum drops"),
   ("9–16","Tiga, ini yang paling penting: sleeping mask. Oles tipis, langsung tidur.","3. SLEEPING MASK ✅","Sleeping mask diambil dari toples dan dioles tipis.","Fingers scoop a gel sleeping mask from a jar and spread a thin layer on cheek skin"),
   ("16–22","Bangun tidur kulit terasa kenyal. Cek keranjang kuning.","PAGINYA KENYAL 👇","Pagi hari, jari menekan pipi yang kenyal.","Morning light, a fingertip gently presses plump hydrated cheek skin"),
  ]),
  S("Micellar water","20 detik",[
   ("0–4","Jangan langsung tidur pakai makeup. Ini langkah pertama aku tiap malam.","JANGAN TIDUR PAKAI MAKEUP","Kapas dan botol micellar water di meja.","A bottle of micellar water and cotton pads on a vanity table at night"),
   ("4–10","Tuang ke kapas, tempel sebentar, usap pelan.","TEMPEL, USAP PELAN","Kapas dibasahi micellar water, diusap ke pipi.","A cotton pad soaked with micellar water gently wipes cheek skin"),
   ("10–15","Lihat kotorannya. Padahal aku cuma pakai bedak tipis.","KOTORANNYA KELIHATAN 😳","Kapas kotor ditunjukkan ke HP.","A used cotton pad with visible makeup residue held up to the camera"),
   ("15–20","Nggak perlu digosok keras. Cek keranjang kuning.","CEK KERANJANG 👇","Botol micellar water di meja.","A micellar water bottle on a clean vanity table"),
  ]),
  S("Toner pad","20 detik",[
   ("0–4","Skincare malam versi males: cukup satu lembar ini.","VERSI MALES 😴","Tangan membuka toples toner pad.","A hand opens a jar of soaked toner pads"),
   ("4–10","Ambil satu, usap ke seluruh muka. Langsung segar.","USAP 1 LEMBAR","Toner pad diambil pakai pinset, diusap.","Tweezers pick up a soaked toner pad, then it is swiped across cheek skin"),
   ("10–15","Habis itu tinggal pakai pelembap, selesai.","+ PELEMBAP, SELESAI ✅","Pelembap dioles.","Fingers spread moisturizer on cheek skin"),
   ("15–20","Isinya 70 lembar, awet dua bulan. Keranjang kuning ya.","70 LEMBAR 👇","Toples toner pad di meja.","A jar of toner pads on a vanity table"),
  ]),
 ]),
dict(id="04", name="Cerita \"Kayak Aku Banget\"", sub="Ceritakan dari sudut pandang penonton",
 inti="Pilih satu tipe orang (ibu menyusui, kerja di luar, kulit sawo matang) dan ceritakan dari sudut pandangnya.",
 psikologi="Penonton membayangkan dirinya ada di posisi itu. Produk terasa dibuat untuk dirinya, bukan untuk semua orang.",
 cocok="Sunscreen, body lotion, deodoran, sabun mandi, body mist",
 hooks=["POV: ibu yang naik motor tiap hari antar anak.","POV: kulit sawo matang yang capek sama whitecast.","POV: ibu menyusui yang bingung skincare aman.","POV: kerja di lapangan, panas tiap hari.","POV: tanggal tua tapi pengen wangi seharian."],
 scripts=[
  S("Sunscreen gel","20 detik",[
   ("0–4","POV: ibu yang tiap hari naik motor antar jemput anak.","POV: IBU ANTAR JEMPUT 🛵","Tangan memegang setang motor di bawah terik matahari.","Hands on a scooter handlebar under strong midday sun, Indonesian street"),
   ("4–9","Tangan sama muka makin hari makin gelap.","MAKIN GELAP 😩","Punggung tangan dengan belang bekas sarung tangan.","Close-up of the back of a hand with a visible tan line"),
   ("9–16","Sekarang sebelum berangkat aku pakai sunscreen ini. Ringan, nggak lengket, nggak putih.","RINGAN, NGGAK PUTIH ✅","Sunscreen dioles di punggung tangan, meresap tanpa putih.","Sunscreen gel squeezed onto the back of a hand and blended in with no white cast"),
   ("16–20","Wajib banget buat ibu-ibu. Cek keranjang kuning.","CEK KERANJANG 👇","Tube sunscreen di jok motor.","A sunscreen tube resting on a scooter seat in the sunlight"),
  ]),
  S("Deodoran roll-on","18 detik",[
   ("0–4","POV: kerja seharian, takut ketek bau dan basah.","TAKUT BAU & BASAH 😰","Tangan mengangkat lengan baju, ada noda keringat (bagian ketiak saja).","Close-up of a sweat stain on a shirt underarm area"),
   ("4–9","Aku pakai ini pagi-pagi, sekali oles.","SEKALI OLES PAGI","Roll-on diolesi di ketiak (tertutup baju tanpa lengan).","A roll-on deodorant applied to an underarm, tasteful framing"),
   ("9–14","Sampai sore tetap kering, dan nggak ninggalin noda putih di baju.","KERING SAMPAI SORE ✅","Baju gelap tanpa noda putih.","Close-up of a dark shirt with no white deodorant marks"),
   ("14–18","Murah dan awet. Keranjang kuning ya.","CEK KERANJANG 👇","Roll-on di tas kerja.","A roll-on deodorant inside an open work bag"),
  ]),
  S("Body mist","18 detik",[
   ("0–4","POV: pengen wangi seharian tapi parfum mahal.","PARFUM MAHAL? 💸","Botol parfum mahal dan dompet tipis.","An expensive perfume bottle next to a thin wallet on a table"),
   ("4–9","Aku pakai body mist ini. Semprot di baju sama rambut.","SEMPROT BAJU & RAMBUT","Body mist disemprot ke baju.","A body mist sprayed onto a hanging blouse, fine mist visible in the light"),
   ("9–14","Wanginya lembut, banyak yang nanya pakai apa.","BANYAK YANG NANYA 😍","Botol body mist dari dekat.","Close-up of a pastel body mist bottle in soft window light"),
   ("14–18","Harganya nggak sampai lima puluh ribu. Cek keranjang kuning.","< 50 RIBU 👇","Botol di tas kecil.","A body mist bottle tucked into a small handbag"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang aman",
 inti="Ajari cara mengecek produk (BPOM, kandungan, cocok untuk jenis kulit apa), lalu tunjukkan produkmu yang lolos.",
 psikologi="Orang takut salah beli skincare, apalagi takut produk palsu atau berbahaya. Kamu terlihat seperti teman yang peduli, jadi saranmu dipercaya.",
 cocok="Serum, krim, sunscreen, produk di atas Rp100 ribu",
 hooks=["Jangan beli skincare sebelum cek 3 hal ini.","Cara tahu skincare kamu asli atau palsu.","Kenapa skincare mahal nggak ngefek di kulitmu?","Stop beli krim pemutih instan.","Ini yang harus dicek di kemasan skincare."],
 scripts=[
  S("Moisturizer ber-BPOM","22 detik",[
   ("0–4","Jangan beli skincare sebelum cek tiga hal ini.","CEK 3 HAL INI ✋","Tangan memegang beberapa produk skincare.","Hands holding several skincare products over a table"),
   ("4–10","Satu, nomor BPOM. Cek di website atau aplikasi BPOM.","1. NOMOR BPOM","Jari menunjuk nomor BPOM di kemasan, lalu layar HP.","A finger points to a registration number printed on a skincare box, then to a phone screen"),
   ("10–16","Dua, kandungannya sesuai masalah kulitmu. Tiga, cocok untuk jenis kulitmu.","2. KANDUNGAN 3. JENIS KULIT","Jari menunjuk daftar kandungan.","Close-up of a finger tracing the ingredient list on a skincare box"),
   ("16–22","Yang ini lolos semua. Cek keranjang kuning.","LOLOS SEMUA ✅👇","Moisturizer diangkat ke HP.","A hand holds a moisturizer jar up to the camera"),
  ]),
  S("Sunscreen SPF 50","20 detik",[
   ("0–4","Sunscreen kamu SPF berapa? Jangan asal pilih.","SPF BERAPA? 🤔","Dua tube sunscreen di tangan.","Two sunscreen tubes held in hands, labels toward camera"),
   ("4–10","Buat yang sering di luar, pilih SPF 50 dan ada PA plus-plus.","SPF 50 + PA++","Jari menunjuk tulisan SPF di tube.","A finger points at the SPF label on a sunscreen tube"),
   ("10–16","Pakainya dua ruas jari, dan ulang tiap beberapa jam.","2 RUAS JARI ✅","Sunscreen dituang dua garis di jari.","Sunscreen squeezed in two lines along two fingers"),
   ("16–20","Yang aku pakai yang ini. Keranjang kuning.","CEK KERANJANG 👇","Tube sunscreen di meja.","A sunscreen tube on a sunny windowsill"),
  ]),
  S("Serum vitamin C","20 detik",[
   ("0–4","Serum vitamin C-mu udah oranye?","SERUM BERUBAH WARNA? ⚠️","Botol serum yang warnanya keruh.","A clear serum bottle with darkened orange liquid"),
   ("4–10","Vitamin C gampang rusak kena cahaya. Pilih botol gelap.","PILIH BOTOL GELAP","Botol serum berwarna gelap dari dekat.","A dark amber serum bottle in soft light"),
   ("10–16","Yang ini botolnya gelap, ada pipetnya, dan teksturnya ringan.","✅ BOTOL GELAP ✅ RINGAN","Serum diteteskan ke tangan.","Dropper releasing serum onto the back of a hand"),
   ("16–20","Cek keranjang kuning ya.","CEK KERANJANG 👇","Botol serum di meja rias.","An amber serum bottle on a vanity table"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan produk mahal dengan produkmu yang lebih murah tapi hasil atau teksturnya mirip.",
 psikologi="Produk mahal jadi pembanding, sehingga produkmu terasa sangat worth it. Penonton merasa pintar karena dapat yang mirip dengan harga jauh lebih murah.",
 cocok="Sunscreen, lip product, moisturizer, body lotion, sabun",
 hooks=["Yang 400 ribu vs yang 40 ribu. Bedanya apa?","Aku nemu kembaran skincare mahal.","Jangan buang uang buat yang mahal dulu.","Teksturnya sama persis, harganya beda jauh.","Skincare murah yang bikin malu yang mahal."],
 scripts=[
  S("Moisturizer gel lokal","22 detik",[
   ("0–4","Moisturizer 450 ribu vs yang 45 ribu. Bedanya apa?","450RB vs 45RB 🤔","Dua toples berjejer, harga ditutup kertas.","Two moisturizer jars side by side on a vanity, each with a folded paper card in front"),
   ("4–10","Tekstur yang mahal: gel ringan, cepet meresap.","MAHAL: RINGAN","Gel dioles di punggung tangan kiri.","A light gel moisturizer spread on the back of a hand, absorbing quickly"),
   ("10–16","Yang 45 ribu? Teksturnya mirip banget, sama-sama nggak lengket.","45RB: MIRIP BANGET ✅","Gel kedua dioles di tangan kanan, ditempel tisu, tidak lengket.","A second gel moisturizer on the other hand, a tissue pressed on it lifts off clean"),
   ("16–22","Buat aku, yang ini udah cukup. Cek keranjang kuning.","PALING WORTH IT 👇","Toples murah diangkat ke HP.","A hand holds up an affordable moisturizer jar"),
  ]),
  S("Lip tint","20 detik",[
   ("0–4","Lip tint 300 ribu vs yang 30 ribu.","300RB vs 30RB 💄","Dua lip tint di meja.","Two lip tint bottles side by side on a table"),
   ("4–10","Aku swatch dua-duanya di tangan, terus aku gosok.","SWATCH + GOSOK","Swatch dua lip tint di punggung tangan, digosok jari.","Two lip tint swatches on the back of a hand, then rubbed with a finger"),
   ("10–15","Dua-duanya nggak luntur. Warnanya juga mirip.","SAMA-SAMA AWET ✅","Swatch tetap terlihat setelah digosok.","Close-up of lip tint swatches still vivid after rubbing"),
   ("15–20","Mending beli yang ini, bisa dapat tiga warna. Keranjang kuning.","DAPAT 3 WARNA 👇","Tiga lip tint murah berjejer.","Three affordable lip tints in different shades lined up"),
  ]),
  S("Body serum","20 detik",[
   ("0–4","Body serum mahal vs ini?","MAHAL vs INI","Dua botol body serum.","Two body serum bottles side by side in a bathroom"),
   ("4–10","Kiri yang mahal, kanan yang ini, seminggu.","TES SEMINGGU","Dua lengan berdampingan.","Two forearms side by side, each with a different body serum applied"),
   ("10–15","Hasilnya hampir sama, sama-sama lembap dan halus.","HASIL HAMPIR SAMA ✅","Dua lengan yang sama-sama halus.","Two smooth moisturized forearms side by side in soft light"),
   ("15–20","Selisih harganya bisa buat beli dua botol. Keranjang kuning.","HEMAT 2 BOTOL 👇","Botol murah diangkat.","A hand holds up the affordable body serum bottle"),
  ]),
 ]),
dict(id="07", name="Tes Tekstur", sub="Swatch dari dekat yang enak ditonton",
 inti="Tunjukkan tekstur produk dari dekat: dipompa, dioles, meresap. Hampir tanpa ngomong.",
 psikologi="Tekstur yang lembut dan meresap cepat enak ditonton berulang kali. Penonton bisa 'merasakan' produknya lewat layar sebelum membeli.",
 cocok="Moisturizer, sunscreen, body butter, sabun, scrub",
 hooks=["Tonton pakai suara 🔊","Tekstur paling satisfying minggu ini.","Lihat seberapa cepat meresapnya.","Ini yang bikin aku langsung checkout.","Tekstur kayak mousse."],
 scripts=[
  S("Body butter","16 detik",[
   ("0–3","(tanpa ngomong)","TEKSTURNYA… 🤤","Tutup toples dibuka pelan, permukaan body butter mulus.","Slow reveal as a jar lid lifts off showing a smooth untouched whipped body butter surface"),
   ("3–9","(tanpa ngomong)","(tanpa tulisan)","Jari menyendok body butter, ditekan, dioles di lengan.","Close-up of a finger scooping fluffy whipped body butter and spreading it on a forearm"),
   ("9–13","Lembut kayak mousse, langsung meresap.","MERESAP CEPAT ✅","Lengan terlihat lembap.","A glowing moisturized forearm in warm window light"),
   ("13–16","Cek keranjang kuning.","CEK KERANJANG 👇","Toples di meja.","A jar of body butter on a bathroom shelf"),
  ]),
  S("Sunscreen spray / mist","16 detik",[
   ("0–3","(suara semprotan)","SEMPROT AJA 💨","Semprotan halus di cahaya jendela.","Slow motion fine mist spray glowing in window light"),
   ("3–9","(tanpa ngomong)","(tanpa tulisan)","Semprot ke punggung tangan, lalu diratakan.","Sunscreen mist sprayed onto the back of a hand, then blended with fingers"),
   ("9–13","Bisa ditimpa di atas makeup, nggak bikin luntur.","BISA DI ATAS MAKEUP ✅","Botol dipegang di dekat cermin.","A hand holding a sunscreen mist bottle near a vanity mirror"),
   ("13–16","Cek keranjang kuning.","CEK KERANJANG 👇","Botol di tas.","A sunscreen mist bottle in an open handbag"),
  ]),
  S("Sabun mandi cair (shower gel)","16 detik",[
   ("0–3","(suara busa)","BUSANYA… 🫧","Busa lembut mengembang di spons.","Close-up of rich creamy foam building up on a shower puff"),
   ("3–9","(tanpa ngomong)","(tanpa tulisan)","Shower gel dituang ke spons, diremas, busa banyak.","Shower gel poured onto a bath puff and squeezed into thick foam"),
   ("9–13","Wanginya tahan sampai pagi.","WANGI SAMPAI PAGI ✅","Botol di rak kamar mandi berembun.","A shower gel bottle on a steamy bathroom shelf"),
   ("13–16","Cek keranjang kuning.","CEK KERANJANG 👇","Tangan menunjuk ke bawah.","A hand points down in a clean bathroom"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah pakai beberapa minggu, sebutkan kekurangannya duluan, baru kelebihannya, lalu cocok untuk siapa.",
 psikologi="Saat kamu jujur soal kekurangan, orang lebih percaya. Pembeli sudah tahu apa yang diharapkan, jadi jarang kecewa.",
 cocok="Serum, sunscreen, krim, produk di atas Rp100 ribu",
 hooks=["4 minggu pakai serum ini, ini jujurnya.","Bukan endorse. Aku beli sendiri.","Ada yang nggak aku suka dari produk ini.","Jangan beli ini kalau kulitmu…","Plus minus setelah habis 1 botol."],
 scripts=[
  S("Serum retinol pemula","24 detik",[
   ("0–4","Empat minggu pakai serum retinol ini. Aku jujur ya.","4 MINGGU, JUJUR","Botol serum di meja.","A serum bottle on a vanity table"),
   ("4–10","Minusnya: minggu pertama kulit sempat agak kering dan mengelupas tipis.","❌ AWAL AGAK KERING","Pipi dengan sedikit kulit kering dari dekat.","Extreme close-up of slight dry flaky cheek skin"),
   ("10–17","Tapi setelah itu tekstur kulit terasa lebih halus. Kuncinya pakai malam aja dan wajib sunscreen.","✅ LEBIH HALUS","Jari mengusap pipi yang halus.","Fingertips gliding over smooth cheek skin in morning light"),
   ("17–24","Cocok buat kamu yang mau mulai retinol pelan-pelan. Keranjang kuning.","COCOK BUAT PEMULA 👇","Botol serum dan sunscreen berdampingan.","A serum bottle beside a sunscreen tube on a vanity"),
  ]),
  S("Sunscreen tone-up","22 detik",[
   ("0–4","Ini bukan endorse, aku beli sendiri. Ada yang aku nggak suka.","BELI SENDIRI","Tube sunscreen di tangan.","A tone-up sunscreen tube held in a hand"),
   ("4–10","Minusnya: kalau kebanyakan agak putih. Jadi pakainya tipis-tipis.","❌ KEBANYAKAN = PUTIH","Sunscreen tebal di punggung tangan terlihat putih.","A thick layer of tone-up sunscreen on the back of a hand looking white"),
   ("10–16","Plusnya: kulit langsung terlihat lebih rata, jadi aku nggak perlu bedak.","✅ GANTI BEDAK","Diratakan tipis, kulit terlihat rata.","Sunscreen blended thinly into an even natural finish on skin"),
   ("16–22","Cocok buat yang mau tampil natural. Keranjang kuning.","CEK KERANJANG 👇","Tube di tas.","A sunscreen tube in a makeup pouch"),
  ]),
  S("Krim malam","22 detik",[
   ("0–4","Plus minus krim malam ini setelah habis satu toples.","HABIS 1 TOPLES","Toples kosong di tangan.","An empty cream jar held in a hand"),
   ("4–10","Minusnya: teksturnya agak tebal, kurang cocok buat kulit yang sangat berminyak.","❌ AGAK TEBAL","Krim tebal di jari.","A thick rich cream on a fingertip"),
   ("10–16","Tapi buat kulit kering, ini bikin bangun tidur kulit terasa kenyal.","✅ KULIT KERING JUARA","Pagi hari, kulit pipi terlihat lembap.","Morning light on plump hydrated cheek skin"),
   ("16–22","Kulitmu kering? Ini cocok. Keranjang kuning.","KULIT KERING? 👇","Toples baru di meja.","A new night cream jar on a vanity table"),
  ]),
 ]),
dict(id="09", name="1 Produk, Banyak Fungsi", sub="Satu barang, banyak kegunaan",
 inti="Tunjukkan beberapa cara pakai produk yang jarang orang tahu.",
 psikologi="Makin banyak kegunaannya, makin terasa murah. Orang menyimpan videonya untuk dicoba nanti, dan video yang banyak disimpan lebih sering muncul.",
 cocok="Aloe vera gel, petroleum jelly, minyak zaitun, micellar water, sabun bayi",
 hooks=["Satu barang ini bisa gantiin 3 skincare.","Kamu cuma pakai ini buat satu hal? Sayang banget.","3 cara pakai yang jarang orang tahu.","Simpan video ini, nanti kamu butuh.","Barang murah ini wajib ada di rumah."],
 scripts=[
  S("Aloe vera gel","20 detik",[
   ("0–3","Satu gel ini bisa kamu pakai buat tiga hal.","1 GEL = 3 FUNGSI","Toples aloe vera gel dibuka.","A jar of clear aloe vera gel opened on a table"),
   ("3–8","Satu: pelembap ringan buat kulit berminyak.","CARA #1","Gel dioles di pipi.","Clear aloe gel spread on cheek skin"),
   ("8–13","Dua: menenangkan kulit habis kena matahari.","CARA #2","Gel dioles di lengan yang kemerahan.","Aloe gel applied to a slightly sunburned red forearm"),
   ("13–20","Tiga: merapikan alis. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Sikat alis dengan sedikit gel (alis saja).","A spoolie brush with aloe gel grooming an eyebrow, only brow visible"),
  ]),
  S("Petroleum jelly","20 detik",[
   ("0–3","Barang murah ini wajib ada di rumah. Ini alasannya.","WAJIB ADA DI RUMAH","Toples petroleum jelly kecil.","A small jar of petroleum jelly on a table"),
   ("3–8","Satu: bibir pecah-pecah.","CARA #1","Dioles tipis di bibir.","A fingertip applying petroleum jelly to dry lips"),
   ("8–13","Dua: tumit kering, oles sebelum tidur lalu pakai kaus kaki.","CARA #2","Dioles ke tumit, lalu kaus kaki.","Petroleum jelly rubbed onto a dry heel, then a sock pulled on"),
   ("13–20","Tiga: kutikula kuku. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Dioles ke pinggir kuku.","Petroleum jelly massaged into nail cuticles"),
  ]),
  S("Micellar water","18 detik",[
   ("0–3","Micellar water bukan cuma buat hapus makeup.","BUKAN CUMA HAPUS MAKEUP","Botol micellar water.","A micellar water bottle on a vanity"),
   ("3–8","Satu: bersihin muka pagi-pagi kalau buru-buru.","CARA #1","Kapas diusap ke pipi.","A cotton pad swiped across cheek skin"),
   ("8–13","Dua: rapiin lipstik yang belepotan.","CARA #2","Cotton bud dibasahi, merapikan pinggir bibir.","A damp cotton bud cleaning a smudged lipstick edge"),
   ("13–18","Tiga: bersihin kuas makeup. Simpan videonya, link di keranjang.","CARA #3 + SIMPAN 👇","Kuas digosok di kapas basah.","A makeup brush swirled on a soaked cotton pad, leaving residue"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Hitung harga per pemakaian",
 inti="Ubah harga jadi hitungan harian atau per pemakaian supaya terasa murah.",
 psikologi="Harga Rp150 ribu terasa mahal, tapi 'Rp2.500 per hari' terasa ringan. Hitungan sederhana yang masuk akal bikin orang percaya.",
 cocok="Sunscreen, serum, body lotion ukuran besar, paket bundling",
 hooks=["Skincare ini 150 ribu, tapi per harinya cuma segini.","Lebih murah dari es kopi kamu.","Aku hitungin biar kamu nggak kaget.","Ukuran gede ternyata lebih hemat.","Jangan bilang mahal sebelum lihat hitungan ini."],
 scripts=[
  S("Sunscreen 50ml","20 detik",[
   ("0–4","Sunscreen ini 90 ribu. Mahal? Aku hitungin.","90 RIBU, MAHAL? 🧮","Kalkulator HP dan tube sunscreen.","A smartphone calculator next to a sunscreen tube"),
   ("4–10","Satu tube habis kira-kira dua bulan. Berarti per hari cuma seribu lima ratus.","= RP1.500/HARI","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Lebih murah dari parkir motor, dan kulit terlindungi tiap hari.","< PARKIR MOTOR ✅","Sunscreen dioles di punggung tangan.","Sunscreen blended onto the back of a hand in sunlight"),
   ("16–20","Masih mahal? Cek keranjang kuning.","CEK KERANJANG 👇","Tube di jok motor.","A sunscreen tube on a scooter seat"),
  ]),
  S("Body lotion 400ml","20 detik",[
   ("0–4","Ukuran gede vs ukuran kecil. Mana yang lebih hemat?","GEDE vs KECIL","Dua botol beda ukuran.","A large and a small body lotion bottle side by side"),
   ("4–10","Yang kecil 100ml 25 ribu. Yang gede 400ml 60 ribu.","25RB vs 60RB","Mengetik di kalkulator.","Fingers typing numbers into a smartphone calculator"),
   ("10–16","Kalau beli yang kecil empat kali, jadi 100 ribu. Hemat 40 ribu.","HEMAT 40 RIBU ✅","Empat botol kecil di samping satu botol besar.","Four small lotion bottles lined up next to one large bottle"),
   ("16–20","Mending yang gede. Keranjang kuning.","PILIH YANG GEDE 👇","Botol besar diangkat.","A hand lifts the large body lotion bottle"),
  ]),
  S("Serum 30ml","20 detik",[
   ("0–4","Serum ini 120 ribu, lebih murah dari es kopi kamu.","< ES KOPI? ☕","Es kopi di samping serum.","An iced coffee cup next to a serum bottle on a table"),
   ("4–10","Pakai dua tetes sehari, satu botol habis tiga bulan.","1 BOTOL = 3 BULAN","Dua tetes serum di tangan.","Two drops of serum on a fingertip"),
   ("10–16","Jadi per hari sekitar seribu tiga ratus. Es kopi berapa?","± RP1.300/HARI ✅","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("16–20","Cek keranjang kuning ya.","CEK KERANJANG 👇","Botol serum di meja.","A serum bottle on a vanity table"),
  ]),
 ]),
]
