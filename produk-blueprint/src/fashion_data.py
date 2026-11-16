NICHE = "Fashion Wanita & Hijab"
SETTING = "bright Indonesian bedroom with a full-length mirror"
PLACE = "a bright bedroom in front of a full-length mirror"
FACELESS = "Face not shown; frame from the neck down, or show fabric, hands and details in close-up."
AMB = "soft natural room sounds"
DEF_M = "baju cepat kusut dan gerah"
DEF_K = "adem dan jatuhnya bagus"
PH = ["gamis rayon", "gerah dan kusut kalau dipakai seharian", "adem, nggak nerawang, busui friendly"]
TPL_FILE = "fashion_tpl.json"
TIPS_BROLL = "Rekam di depan cermin atau HP ditaruh di penyangga, dekat jendela biar warna kain asli kelihatan. Kalau nggak mau tampil wajah, rekam dari leher ke bawah. Ambil gambar dari dekat untuk tekstur kain, jahitan, dan detail. Gabungkan di CapCut, rekam suaramu, lalu tambahkan tulisan di layar."
CATS = [["Semua", None], ["Gamis & dress", ["02","04","05","08"]], ["Hijab", ["01","03","07","09"]],
        ["Atasan, bawahan, outer", ["02","06","09"]], ["Tas & aksesoris", ["06","07","10"]]]
START = [
 ("Hari 1","Gaya 02: Hasil Dulu (Try-on)","Paling gampang. Pakai bajunya, berputar di depan cermin."),
 ("Hari 2","Gaya 07: Tes Bahan","Rekam kain dari dekat: diterawang, diremas, ditarik."),
 ("Hari 3","Gaya 03: Tutorial Cepat","Cara pakai hijab atau mix and match dalam 30 detik."),
 ("Hari 4","Gaya 09: 1 Baju Banyak Gaya","Satu barang dipadukan jadi 3 tampilan."),
 ("Hari 5","Gaya 05: Jangan Beli Sebelum Cek Ini","Ajari cara cek ukuran dan bahan."),
 ("Hari 6","Gaya 08: Review Jujur","Sebut kekurangannya dulu biar dipercaya."),
 ("Hari 7","Lihat hasilnya","Pilih 2 video yang paling banyak ditonton, lalu buat ulang dengan kalimat pembuka yang lain."),
]
S = lambda produk, durasi, scenes: dict(produk=produk, durasi=durasi, scenes=scenes)
PATTERNS = [
dict(id="01", name="Masalah yang Bikin Kesel", sub="Tunjukkan masalah, lalu solusinya",
 inti="Mulai dari masalah berpakaian yang sering terjadi (hijab mencong, gerah, nerawang), lalu tunjukkan produknya.",
 psikologi="Masalah kecil sehari-hari bikin penonton langsung merasa 'ini aku'. Solusi yang langsung terlihat di layar bikin mereka ingin punya.",
 cocok="Hijab instan, inner, ciput, bergo, manset",
 hooks=["Hijab mencong terus padahal udah dipeniti?","Gerah banget pakai hijab pas siang?","Ciput kamu bikin pusing?","Hijab licin, melorot terus?","Rambut keluar-keluar dari hijab?"],
 scripts=[
  S("Hijab instan pet antem","18 detik",[
   ("0–3","Hijab mencong terus padahal udah dipeniti?","MENCONG TERUS? 😩","Hijab segi empat miring dan berantakan (leher ke bawah).","A crooked messy square hijab drape, framed from the chin down"),
   ("3–8","Aku ganti ke hijab instan ini. Ada pet-nya, tinggal pakai.","TINGGAL PAKAI","Hijab instan dipakai satu gerakan.","Hands slip on an instant hijab with a stiff front brim in one motion"),
   ("8–14","Bentuknya rapi seharian, nggak perlu jarum.","RAPI TANPA JARUM ✅","Hijab rapi saat bergerak, menunduk, naik motor.","An instant hijab staying neat while the wearer bends and moves, chin down framing"),
   ("14–18","Warnanya banyak. Cek keranjang kuning.","CEK KERANJANG 👇","Tumpukan hijab warna-warni.","A neat stack of instant hijabs in many colors"),
  ]),
  S("Inner ciput rajut anti pusing","18 detik",[
   ("0–3","Ciput kamu bikin pusing?","CIPUT BIKIN PUSING? 🤕","Bekas karet ciput merah di dahi (dahi saja).","Close-up of a red elastic mark on a forehead"),
   ("3–8","Ciput ini rajut, melarnya pas, nggak nekan kepala.","RAJUT, NGGAK NEKAN","Ciput ditarik melar.","Hands stretch a knitted hijab inner cap"),
   ("8–14","Seharian dipakai, nggak ada bekas merah.","NGGAK ADA BEKAS ✅","Ciput dilepas, dahi bersih.","An inner cap removed revealing no marks"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Ciput berbagai warna.","Knitted inner caps in several colors laid out"),
  ]),
  S("Hijab voal anti licin","18 detik",[
   ("0–3","Hijab licin, melorot terus?","MELOROT TERUS? 😤","Hijab licin bergeser dari bahu.","A slippery satin scarf sliding off a shoulder"),
   ("3–8","Coba bahan voal ini. Teksturnya sedikit kasar jadi gampang dibentuk.","GAMPANG DIBENTUK","Kain voal diremas dari dekat.","Close-up of hands crumpling voile fabric showing texture"),
   ("8–14","Sekali bentuk, tahan seharian. Dan nggak nerawang.","TAHAN SEHARIAN ✅","Kain diterawang ke jendela, tidak tembus.","Voile fabric held up to a window, not see-through"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Hijab terlipat rapi.","A neatly folded voile hijab"),
  ]),
 ]),
dict(id="02", name="Hasil Dulu (Try-on)", sub="Pakai dulu, baru jelaskan",
 inti="Detik pertama langsung tampilkan bajunya sudah dipakai dan terlihat bagus, baru jelaskan detailnya.",
 psikologi="Orang membeli baju karena membayangkan dirinya memakainya. Try-on menunjukkan jatuhnya kain di badan asli, sesuatu yang tidak terlihat di foto toko.",
 cocok="Gamis, dress, tunik, kulot, outer",
 hooks=["Gamis 100 ribuan tapi kelihatan mahal.","Ini baju kondangan aku minggu ini.","Badan berisi? Ini jatuhnya.","Try-on gamis paling adem.","Tinggi 150 cm pakai ini."],
 scripts=[
  S("Gamis rayon polos","18 detik",[
   ("0–3","(tanpa ngomong, berputar pelan)","KELIHATAN MAHAL ✨","Berputar pelan memakai gamis, kain mengembang (leher ke bawah).","Slow motion twirl in a flowing plain rayon maxi dress, framed from the neck down"),
   ("3–8","Gamis ini harganya seratus ribuan. Bahannya rayon, adem banget.","RAYON ADEM","Kain dari dekat, tangan mengusap.","Close-up of soft rayon fabric being stroked by a hand"),
   ("8–14","Busui friendly, ada saku, dan tingginya pas buat 150 sampai 165 cm.","BUSUI ✅ SAKU ✅","Tunjukkan resleting depan dan saku.","Hands show a front zipper and a side pocket on a maxi dress"),
   ("14–18","Warnanya ada delapan. Cek keranjang kuning.","CEK KERANJANG 👇","Gamis di gantungan.","Several maxi dresses in different colors on hangers"),
  ]),
  S("Kulot plisket","16 detik",[
   ("0–3","(tanpa ngomong, berjalan ke kamera)","KAKI KELIHATAN JENJANG 👗","Berjalan memakai kulot plisket (pinggang ke bawah).","Walking toward the camera in pleated wide-leg culottes, waist down"),
   ("3–8","Kulot plisket ini pinggangnya karet, enak buat ibu-ibu.","PINGGANG KARET","Pinggang karet ditarik.","Hands stretch an elastic waistband"),
   ("8–12","Nggak perlu disetrika, lipitannya tetap rapi.","NGGAK PERLU SETRIKA ✅","Kulot diremas lalu kembali rapi.","Pleated fabric crumpled in hands then falling back into neat pleats"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Kulot terlipat.","Folded pleated culottes"),
  ]),
  S("Outer cardigan rajut","16 detik",[
   ("0–3","(tanpa ngomong, memakai outer)","1 OUTER, LANGSUNG RAPI ✨","Outer dipakai di atas kaus polos (leher ke bawah).","Slipping a knit cardigan over a plain top, neck down"),
   ("3–8","Pakai baju rumahan pun langsung kelihatan rapi.","BAJU RUMAHAN JADI RAPI","Sebelum dan sesudah memakai outer.","Side by side before and after adding a knit cardigan over a plain outfit"),
   ("8–12","Rajutannya tebal tapi nggak gerah.","TEBAL, NGGAK GERAH ✅","Rajutan dari dekat.","Close-up of soft knit texture"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Outer di gantungan.","A knit cardigan on a hanger"),
  ]),
 ]),
dict(id="03", name="Tutorial Cepat", sub="Cara pakai dalam 30 detik",
 inti="Ajari cara memakai atau memadukan produk dengan cepat dan gampang ditiru.",
 psikologi="Tutorial memberi manfaat langsung, jadi orang menyimpan dan membagikan videonya. Penonton yang bisa meniru merasa butuh barangnya.",
 cocok="Hijab segi empat, pashmina, bros, ciput, belt",
 hooks=["Tutorial hijab 10 detik buat ibu buru-buru.","Pashmina tanpa jarum, bisa?","Cara pakai hijab biar muka kelihatan tirus.","Gaya hijab buat kondangan, 30 detik.","Hijab segi empat buat pemula."],
 scripts=[
  S("Pashmina ceruty","20 detik",[
   ("0–4","Pashmina tanpa jarum? Bisa banget.","TANPA JARUM 🙅‍♀️","Pashmina di tangan.","A ceruty pashmina scarf draped over hands"),
   ("4–10","Sampirkan, sisi panjang lilit ke belakang, terus ke depan.","LILIT KE BELAKANG","Langkah melilit (dagu ke bawah).","Hands wrapping a long scarf around the back and to the front, chin down"),
   ("10–16","Selipkan ujungnya. Selesai, rapi tanpa jarum.","SELIPKAN, SELESAI ✅","Ujung diselipkan, hasil rapi.","Hands tuck the scarf end in, neat drape"),
   ("16–20","Bahan ceruty, gampang dibentuk. Keranjang kuning.","CEK KERANJANG 👇","Pashmina terlipat.","Folded pashmina scarves in pastel colors"),
  ]),
  S("Hijab segi empat paris","18 detik",[
   ("0–4","Hijab segi empat buat pemula, cuma tiga langkah.","CUMA 3 LANGKAH","Hijab segi empat dilipat segitiga.","A square hijab folded into a triangle"),
   ("4–10","Lipat segitiga, sematkan di dagu, sampirkan satu sisi.","LIPAT, SEMAT, SAMPIR","Langkah memakai (dagu ke bawah).","Hands pin a triangle-folded hijab under the chin and drape one side"),
   ("10–15","Hasilnya rapi dan nggak gerah.","RAPI ✅","Hasil akhir dari samping.","A neat finished square hijab drape, chin down"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Tumpukan hijab.","A stack of square hijabs"),
  ]),
  S("Bros hijab magnet","16 detik",[
   ("0–4","Nggak suka jarum? Pakai ini.","NGGAK SUKA JARUM?","Bros magnet di telapak tangan.","A magnetic hijab brooch in an open palm"),
   ("4–10","Tempel dari dalam dan luar, langsung nempel kuat.","TEMPEL, NEMPEL ✅","Bros dipasang di hijab.","Hands attach a magnetic brooch onto hijab fabric"),
   ("10–13","Kain nggak bolong.","KAIN NGGAK BOLONG","Kain dari dekat tanpa lubang.","Close-up of fabric with no pin holes"),
   ("13–16","Cek keranjang kuning.","CEK KERANJANG 👇","Set bros.","A set of magnetic brooches"),
  ]),
 ]),
dict(id="04", name="Cerita \"Kayak Aku Banget\"", sub="Ceritakan dari sudut pandang penonton",
 inti="Pilih satu tipe orang (ibu menyusui, badan berisi, tinggi 150) dan ceritakan dari sudut pandangnya.",
 psikologi="Penonton dengan bentuk badan atau kebutuhan yang sama merasa produk ini dibuat untuknya.",
 cocok="Gamis busui, dress big size, celana, baju tidur",
 hooks=["POV: ibu menyusui yang susah cari gamis.","POV: badan berisi, takut kelihatan gemuk.","POV: tinggi 150, gamis selalu kepanjangan.","POV: kerja kantoran tapi pengen syar'i.","POV: daster tapi bisa buat ke warung."],
 scripts=[
  S("Gamis busui resleting depan","20 detik",[
   ("0–4","POV: ibu menyusui yang susah cari gamis.","POV: IBU MENYUSUI 🤱","Gamis biasa tanpa bukaan depan.","A plain dress with no front opening on a hanger"),
   ("4–10","Gamis ini resleting depannya tersembunyi.","RESLETING TERSEMBUNYI","Resleting dibuka sedikit dari dekat.","Close-up of a hidden front zipper being opened slightly"),
   ("10–16","Mau menyusui di luar juga tetap tertutup dan nyaman.","TETAP TERTUTUP ✅","Berjalan memakai gamis (leher ke bawah).","Walking in a flowing nursing-friendly maxi dress, neck down"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Gamis di gantungan.","A nursing-friendly maxi dress on a hanger"),
  ]),
  S("Dress big size","18 detik",[
   ("0–4","POV: badan berisi, takut kelihatan gemuk.","POV: BADAN BERISI","Berdiri di depan cermin (leher ke bawah).","Standing in front of a mirror in a loose outfit, neck down"),
   ("4–10","Dress ini potongan A, jatuh lurus, nggak nempel ke perut.","POTONGAN A, NGGAK NEMPEL","Dress dipakai, berputar pelan.","Slow turn in an A-line maxi dress that flows away from the body"),
   ("10–15","Ukurannya sampai XXXL.","SAMPAI XXXL ✅","Label ukuran dari dekat.","Close-up of a size label"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Dress di gantungan.","An A-line maxi dress on a hanger"),
  ]),
  S("Daster rayon kancing depan","18 detik",[
   ("0–4","POV: pakai daster tapi mau ke warung juga pede.","DASTER TAPI PEDE 😎","Berjalan ke pintu memakai daster (leher ke bawah).","Walking toward a front door in a modest rayon house dress, neck down"),
   ("4–10","Motifnya kalem, panjangnya sampai mata kaki.","MOTIF KALEM, PANJANG","Motif kain dari dekat.","Close-up of a calm floral rayon print"),
   ("10–15","Adem, kancing depan, busui friendly.","ADEM + BUSUI ✅","Kancing depan dari dekat.","Close-up of front buttons"),
   ("15–18","Cek keranjang kuning.","CEK KERANJANG 👇","Daster terlipat.","Folded rayon house dresses"),
  ]),
 ]),
dict(id="05", name="Jangan Beli Sebelum Cek Ini", sub="Ajari cara memilih yang benar",
 inti="Ajari cara cek ukuran, bahan, dan jahitan sebelum beli online, lalu tunjukkan produkmu yang lolos.",
 psikologi="Salah ukuran adalah ketakutan terbesar beli baju online. Tips cara mengukur bikin kamu dipercaya dan mengurangi retur.",
 cocok="Gamis, celana, dress, gamis set, mukena",
 hooks=["Jangan beli gamis online sebelum ukur ini.","Kenapa baju online kamu selalu kekecilan?","Cara tahu bahan nerawang dari foto.","3 hal yang dicek sebelum checkout baju.","Stop retur baju online."],
 scripts=[
  S("Gamis set khimar","22 detik",[
   ("0–4","Jangan beli gamis online sebelum ukur ini.","UKUR DULU ✋","Meteran baju di tangan.","A tailor's measuring tape in hands"),
   ("4–10","Ukur lingkar dada baju yang paling pas di badanmu, tambah sedikit biar longgar.","UKUR BAJU YANG PAS","Meteran di bagian dada baju yang dibentangkan.","A measuring tape laid across the chest of a flat garment"),
   ("10–16","Bandingkan sama tabel ukuran. Gamis ini tabelnya lengkap sampai panjang badan.","CEK TABEL UKURAN ✅","Layar HP menunjukkan tabel ukuran.","A phone screen showing a size chart, finger pointing"),
   ("16–22","Cek keranjang kuning, ukurannya lengkap.","CEK KERANJANG 👇","Gamis set di gantungan.","A matching maxi dress and long hijab set on a hanger"),
  ]),
  S("Celana kulot linen","20 detik",[
   ("0–4","Cara tahu bahan celana nerawang atau nggak.","NERAWANG ATAU NGGAK?","Celana diangkat ke jendela.","Wide-leg trousers held up toward a bright window"),
   ("4–10","Terawang ke cahaya. Kalau jari kelihatan jelas, berarti tipis.","TERAWANG KE CAHAYA","Tangan di balik kain.","A hand behind fabric held to the light"),
   ("10–16","Yang ini bahan linen tebal, jari nggak kelihatan.","NGGAK NERAWANG ✅","Tangan di balik kain tidak terlihat.","A hand behind thick linen fabric is not visible"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Celana terlipat.","Folded linen trousers"),
  ]),
  S("Mukena travel","20 detik",[
   ("0–4","Jangan beli mukena travel sebelum cek ini.","CEK INI DULU ✋","Mukena dalam kantong kecil.","A travel prayer garment folded in a small pouch"),
   ("4–10","Bahannya harus adem dan nggak gampang kusut, karena dilipat terus.","ADEM + ANTI KUSUT","Mukena diremas lalu dikibaskan.","Fabric crumpled then shaken out smooth"),
   ("10–16","Yang ini bisa dilipat sekecil ini dan tetap rapi.","LIPAT KECIL, TETAP RAPI ✅","Mukena dilipat ke kantong.","Hands fold a prayer garment into a compact pouch"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Kantong di tas.","A compact pouch placed in a handbag"),
  ]),
 ]),
dict(id="06", name="Murah vs Mahal", sub="Bandingkan 2–3 harga",
 inti="Bandingkan barang branded atau butik dengan produkmu yang tampilannya mirip tapi lebih murah.",
 psikologi="Barang mahal jadi pembanding, sehingga produkmu terasa sangat worth it. Penonton senang merasa belanja dengan pintar.",
 cocok="Tas, sepatu, hijab premium, outer, jam tangan",
 hooks=["Tas 2 juta vs 150 ribu. Bedanya apa?","Hijab butik vs hijab ini.","Kelihatan mahal, padahal…","Jangan beli yang mahal dulu sebelum lihat ini.","Kembaran tas branded."],
 scripts=[
  S("Tas selempang kulit sintetis","20 detik",[
   ("0–4","Tas dua juta vs 150 ribu. Bedanya apa?","2 JUTA vs 150RB 👜","Dua tas berdampingan.","Two shoulder bags side by side on a bed"),
   ("4–10","Jahitan dua-duanya rapi, resletingnya sama-sama lancar.","JAHITAN SAMA RAPI","Jahitan dan resleting dari dekat.","Close-up of neat stitching and a smooth zipper"),
   ("10–16","Isinya muat HP, dompet, dan botol minum.","MUAT BANYAK ✅","Tas diisi barang.","Hands put a phone, wallet and water bottle into a bag"),
   ("16–20","Bedanya cuma di merek. Keranjang kuning.","PALING WORTH IT 👇","Tas dipakai (leher ke bawah).","A shoulder bag worn crossbody, neck down"),
  ]),
  S("Hijab premium jahit tepi","18 detik",[
   ("0–4","Hijab butik 300 ribu vs yang 50 ribu.","300RB vs 50RB","Dua hijab terlipat.","Two folded hijabs side by side"),
   ("4–10","Tepinya sama-sama dijahit rapi, nggak ada benang keluar.","TEPI SAMA RAPI","Tepi kain dari dekat.","Close-up of neatly finished hijab edges"),
   ("10–14","Bahannya juga sama-sama tebal dan jatuh.","SAMA-SAMA JATUH ✅","Kain dikibaskan.","Hijab fabric shaken and falling softly"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Hijab warna-warni.","Hijabs in several colors"),
  ]),
  S("Sepatu flat shoes","18 detik",[
   ("0–4","Flat shoes branded vs yang ini.","BRANDED vs INI","Dua pasang sepatu.","Two pairs of flat shoes side by side"),
   ("4–10","Solnya sama-sama empuk dan nggak licin.","SOL EMPUK ✅","Sol ditekan jari.","A thumb presses a cushioned shoe insole"),
   ("10–14","Dipakai jalan seharian, kaki nggak lecet.","NGGAK LECET","Berjalan memakai sepatu (kaki saja).","Feet walking in comfortable flat shoes"),
   ("14–18","Cek keranjang kuning.","CEK KERANJANG 👇","Sepatu di kotak.","Flat shoes in a box"),
  ]),
 ]),
dict(id="07", name="Tes Bahan", sub="Bukti kain dari dekat",
 inti="Uji bahan langsung di depan kamera: diterawang, diremas, ditarik, disiram air.",
 psikologi="Pembeli online tidak bisa memegang kain. Tes langsung menggantikan rasa memegang, dan itu bukti yang paling dipercaya.",
 cocok="Hijab, gamis, mukena, kaus kaki, manset",
 hooks=["Aku remas, kusut nggak?","Tes terawang paling jujur.","Disiram air, tembus nggak?","Ditarik kenceng, melar nggak?","Bahan paling adem yang pernah aku pakai."],
 scripts=[
  S("Hijab jersey premium","16 detik",[
   ("0–3","Aku remas, kusut nggak?","DIREMAS, KUSUT? 🤔","Kain jersey dari dekat.","Close-up of soft jersey hijab fabric"),
   ("3–8","(tanpa ngomong)","(tanpa tulisan)","Kain diremas kuat lalu dilepas.","Hands crumple jersey fabric tightly then let go"),
   ("8–12","Langsung rapi lagi, nggak perlu disetrika.","NGGAK PERLU SETRIKA ✅","Kain kembali halus.","Fabric smoothing back out with no wrinkles"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Hijab terlipat.","Folded jersey hijabs"),
  ]),
  S("Manset tangan","16 detik",[
   ("0–3","Ditarik kenceng, melar nggak?","DITARIK KENCENG 💪","Manset di tangan.","A sleeve cover held in hands"),
   ("3–8","(tanpa ngomong)","(tanpa tulisan)","Manset ditarik lebar.","Hands stretch a sleeve cover wide"),
   ("8–12","Balik ke bentuk semula, nggak kendor.","NGGAK KENDOR ✅","Manset kembali ke ukuran awal.","The sleeve cover snaps back to its original shape"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Manset berbagai warna.","Sleeve covers in several colors"),
  ]),
  S("Mukena katun","16 detik",[
   ("0–3","Tes terawang paling jujur.","TES TERAWANG 🔦","Kain mukena di depan jendela.","Prayer garment fabric held in front of a bright window"),
   ("3–8","(tanpa ngomong)","(tanpa tulisan)","Tangan di balik kain.","A hand moving behind the fabric against the light"),
   ("8–12","Tangan nggak kelihatan. Aman buat salat.","NGGAK NERAWANG ✅","Kain tetap menutup.","The fabric fully hides the hand"),
   ("12–16","Cek keranjang kuning.","CEK KERANJANG 👇","Mukena terlipat.","A folded prayer garment"),
  ]),
 ]),
dict(id="08", name="Review Jujur", sub="Sebut kurangnya dulu biar dipercaya",
 inti="Sudah dipakai dan dicuci beberapa kali, sebut kekurangannya duluan, lalu kelebihannya dan cocok untuk siapa.",
 psikologi="Kejujuran bikin penonton percaya. Pembeli tahu apa yang diharapkan, jadi lebih jarang retur.",
 cocok="Gamis, dress, tas, sepatu, produk di atas Rp150 ribu",
 hooks=["Udah dicuci 5 kali, gimana hasilnya?","Jujur, ada yang nggak aku suka.","Bukan endorse, aku beli sendiri.","Plus minus gamis viral ini.","Jangan beli ini kalau tinggimu…"],
 scripts=[
  S("Gamis viral","22 detik",[
   ("0–4","Gamis viral ini udah aku cuci lima kali. Jujurnya gini.","DICUCI 5X, JUJUR","Gamis di gantungan.","A maxi dress on a hanger"),
   ("4–10","Minusnya: warnanya sedikit pudar, jadi jangan dijemur langsung kena matahari.","❌ AGAK PUDAR","Kain dari dekat.","Close-up of slightly faded fabric color"),
   ("10–17","Plusnya: jahitannya tetap kuat, nggak berbulu, dan tetap adem.","✅ JAHITAN KUAT ✅ ADEM","Jahitan dari dekat.","Close-up of strong intact seams"),
   ("17–22","Overall worth it. Keranjang kuning.","WORTH IT 👇","Berputar memakai gamis (leher ke bawah).","A gentle twirl in the maxi dress, neck down"),
  ]),
  S("Tas tote kanvas","20 detik",[
   ("0–4","Sebulan pakai tas ini buat kerja. Ada minusnya.","SEBULAN PAKAI","Tas di meja.","A canvas tote bag on a table"),
   ("4–10","Minusnya: nggak ada sekat dalam, jadi barang campur.","❌ NGGAK ADA SEKAT","Bagian dalam tas.","The open interior of a tote bag with no compartments"),
   ("10–16","Tapi muat laptop, kuat, dan gampang dicuci.","✅ MUAT LAPTOP ✅ KUAT","Laptop masuk ke tas.","A laptop slid into a canvas tote bag"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Tas dipakai di bahu.","A tote bag worn on a shoulder, neck down"),
  ]),
  S("Sepatu slip on","20 detik",[
   ("0–4","Plus minus sepatu ini setelah dua minggu.","2 MINGGU PAKAI","Sepatu di lantai.","Slip-on shoes on a floor"),
   ("4–10","Minusnya: ukurannya agak kecil, naikkan satu nomor.","❌ NAIK 1 NOMOR","Label ukuran.","Close-up of a shoe size label"),
   ("10–16","Plusnya: ringan dan empuk buat jalan jauh.","✅ RINGAN ✅ EMPUK","Berjalan (kaki saja).","Feet walking comfortably in slip-on shoes"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Sepatu di kotak.","Slip-on shoes in a box"),
  ]),
 ]),
dict(id="09", name="1 Baju, Banyak Gaya", sub="Satu barang dipadukan jadi beberapa tampilan",
 inti="Tunjukkan satu barang dipakai dengan 3 cara atau 3 padanan berbeda.",
 psikologi="Satu barang yang bisa dipakai banyak gaya terasa sangat hemat. Penonton menyimpan videonya sebagai inspirasi.",
 cocok="Outer, pashmina, rok, celana, tunik",
 hooks=["1 outer, 3 gaya.","Satu rok, seminggu nggak kelihatan sama.","Pashmina ini bisa jadi 3 gaya.","Hemat baju: mix and match cara ini.","Simpan buat inspirasi OOTD."],
 scripts=[
  S("Outer linen","20 detik",[
   ("0–3","Satu outer, tiga gaya.","1 OUTER = 3 GAYA","Outer di gantungan.","A linen outer on a hanger"),
   ("3–8","Satu: ke kantor, pakai celana bahan.","GAYA #1 💼","Outfit kantor (leher ke bawah).","An office outfit with a linen outer and trousers, neck down"),
   ("8–13","Dua: santai, pakai kaus dan rok plisket.","GAYA #2 ☕","Outfit santai.","A casual outfit with a linen outer, t-shirt and pleated skirt, neck down"),
   ("13–20","Tiga: kondangan, dikasih belt. Simpan videonya, link di keranjang.","GAYA #3 + SIMPAN 👇","Outfit dengan belt.","A linen outer cinched with a belt over a dress, neck down"),
  ]),
  S("Rok plisket","20 detik",[
   ("0–3","Satu rok, tiga gaya.","1 ROK = 3 GAYA","Rok plisket.","A pleated skirt on a hanger"),
   ("3–8","Satu: sama kemeja.","GAYA #1","Rok dengan kemeja.","A pleated skirt with a tucked shirt, neck down"),
   ("8–13","Dua: sama kaus oversize.","GAYA #2","Rok dengan kaus.","A pleated skirt with an oversized tee, neck down"),
   ("13–20","Tiga: sama sweater. Simpan videonya, link di keranjang.","GAYA #3 + SIMPAN 👇","Rok dengan sweater.","A pleated skirt with a knit sweater, neck down"),
  ]),
  S("Pashmina inner","20 detik",[
   ("0–3","Pashmina ini bisa jadi tiga gaya.","3 GAYA","Pashmina di tangan.","A pashmina scarf in hands"),
   ("3–8","Satu: simpel buat sehari-hari.","GAYA #1","Gaya simpel (dagu ke bawah).","A simple everyday scarf drape, chin down"),
   ("8–13","Dua: dililit buat ke kantor.","GAYA #2","Gaya lilit.","A wrapped scarf style, chin down"),
   ("13–20","Tiga: menjuntai buat kondangan. Simpan, link di keranjang.","GAYA #3 + SIMPAN 👇","Gaya menjuntai.","A long elegant draped scarf style, chin down"),
  ]),
 ]),
dict(id="10", name="Hitung-hitungan Hemat", sub="Hitung harga per pemakaian",
 inti="Hitung harga per pemakaian atau bandingkan dengan biaya lain supaya harga terasa ringan.",
 psikologi="Harga baju terasa mahal sampai dibagi jumlah pemakaian. Hitungan sederhana bikin belanja terasa masuk akal.",
 cocok="Tas, sepatu, hijab paket isi banyak, gamis",
 hooks=["Tas 200 ribu, dipakai tiap hari setahun.","Beli paket isi 5 lebih hemat?","Aku hitungin harga per pakai.","Jangan bilang mahal sebelum lihat ini.","Hemat ongkir: beli paket."],
 scripts=[
  S("Paket hijab isi 5","20 detik",[
   ("0–4","Beli hijab satuan vs paket isi lima. Mana lebih hemat?","SATUAN vs PAKET 🧮","Lima hijab dan kalkulator.","Five hijabs next to a smartphone calculator"),
   ("4–10","Satuan 35 ribu, kali lima jadi 175. Paket cuma 125.","HEMAT 50 RIBU","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Ongkirnya juga sekali. Warnanya cukup buat seminggu.","1X ONGKIR ✅","Lima hijab dibentangkan.","Five hijabs in different colors fanned out"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Paket hijab.","A bundle of hijabs tied with ribbon"),
  ]),
  S("Tas kerja","20 detik",[
   ("0–4","Tas ini 200 ribu. Mahal? Aku hitungin.","200 RIBU, MAHAL?","Tas dan kalkulator.","A work bag next to a smartphone calculator"),
   ("4–10","Dipakai kerja tiap hari, setahun sekitar 250 kali.","± 250X SETAHUN","Mengetik di kalkulator.","Fingers typing on a smartphone calculator"),
   ("10–16","Berarti cuma delapan ratus rupiah sekali pakai.","RP800 SEKALI PAKAI ✅","Tas dipakai berangkat kerja.","A work bag carried out the door, neck down"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Tas di meja kerja.","A work bag on an office desk"),
  ]),
  S("Gamis 2 in 1 (bisa dibalik)","20 detik",[
   ("0–4","Gamis ini harga satu, dapat dua.","HARGA 1, DAPAT 2","Gamis di gantungan.","A reversible dress on a hanger"),
   ("4–10","Bisa dibalik, sisi satunya warna beda.","BISA DIBALIK","Gamis dibalik.","Hands turn a reversible dress inside out showing another color"),
   ("10–16","Jadi kayak punya dua baju, hemat setengah.","HEMAT SETENGAH ✅","Dua sisi berdampingan.","Both sides of the reversible dress laid out side by side"),
   ("16–20","Cek keranjang kuning.","CEK KERANJANG 👇","Gamis terlipat.","A folded reversible dress"),
  ]),
 ]),
]
