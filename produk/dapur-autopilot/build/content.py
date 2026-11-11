# -*- coding: utf-8 -*-
"""Isi produk Dapur Autopilot: 20 pasangan menu, stok, Rencana B."""

DAYS = {
    "Senin":  {"tema": "Hari Ayam",          "warna": "#C99A3B"},
    "Selasa": {"tema": "Hari Telur",         "warna": "#E2B33C"},
    "Rabu":   {"tema": "Hari Ikan & Udang",  "warna": "#4F8A8B"},
    "Kamis":  {"tema": "Hari Daging",        "warna": "#D65A3A"},
    "Jumat":  {"tema": "Jumat Seru",         "warna": "#6E8F5E"},
}

# kategori belanja: P=Protein, S=Sayur & Buah, R=Roti, Susu & Karbo, B=Bumbu & Kering
R = []
def r(minggu, hari, malam, bekal, menit, bahan, langkah_malam, sisihkan, langkah_pagi, tip):
    R.append(dict(minggu=minggu, hari=hari, malam=malam, bekal=bekal, menit=menit,
                  bahan=bahan, malam_steps=langkah_malam, sisihkan=sisihkan,
                  pagi_steps=langkah_pagi, tip=tip, no=len(R) + 1))

# ---------------- MINGGU 1 ----------------
r(1, "Senin", "Ayam Kecap Mentega", "Onigiri Ayam Kecap", 7,
  [("Ayam fillet paha", "600 g", "P"), ("Bawang bombay", "1 buah", "S"),
   ("Bawang putih", "4 siung", "B"), ("Mentega", "2 sdm", "R"),
   ("Kecap manis", "4 sdm", "B"), ("Saus tiram", "1 sdm", "B"), ("Nori", "2 lembar", "B")],
  ["Potong ayam dadu, lumuri garam dan merica.",
   "Tumis bawang putih dan bombay dengan mentega sampai harum.",
   "Masukkan ayam, aduk sampai berubah warna.",
   "Tambah kecap, saus tiram, 50 ml air. Masak sampai saus mengental, ±8 menit."],
  "±100 g ayam + 1 sdm saus, cincang kasar.",
  ["Panaskan ayam di teflon 2 menit.",
   "Aduk dengan 1 centong nasi hangat.",
   "Bentuk segitiga pakai plastik wrap, bungkus nori terpisah."],
  "Nori dibungkus terpisah supaya tetap renyah saat jam makan.")

r(1, "Selasa", "Fuyunghai Saus Tomat", "Sandwich Fuyunghai", 6,
  [("Telur", "6 butir", "P"), ("Wortel", "1 buah", "S"), ("Kol", "1/4 buah", "S"),
   ("Daun bawang", "2 batang", "S"), ("Saus tomat", "5 sdm", "B"),
   ("Maizena", "1 sdm", "B"), ("Roti tawar", "2 lembar", "R")],
  ["Kocok telur + wortel parut + kol iris + daun bawang + garam.",
   "Goreng 1 sendok sayur adonan per lembar sampai kedua sisi kecokelatan.",
   "Saus: tumis bawang putih, saus tomat, 100 ml air, sejumput gula, kentalkan dengan maizena."],
  "1 lembar fuyunghai + 2 sdm saus di wadah kecil.",
  ["Hangatkan fuyunghai di teflon kering 2 menit.",
   "Oles roti dengan saus, isi fuyunghai, tangkup.",
   "Potong jadi 4 segitiga."],
  "Kalau anak tidak suka roti basah, saus dibawa di wadah terpisah untuk dicocol.")

r(1, "Rabu", "Dori Crispy & Timun", "Rice Bowl Dori Mayo", 7,
  [("Fillet dori", "500 g", "P"), ("Tepung bumbu serbaguna", "150 g", "B"),
   ("Jeruk nipis", "1 buah", "S"), ("Timun", "1 buah", "S"), ("Mayones", "secukupnya", "B")],
  ["Potong dori seukuran jari, kucuri jeruk nipis 5 menit.",
   "Celup ke tepung basah lalu tepung kering.",
   "Goreng sampai keemasan. Sajikan dengan timun iris."],
  "3–4 potong dori goreng, belum diberi saus.",
  ["Garingkan lagi di teflon kering / air fryer 3–4 menit.",
   "Tata di atas nasi.",
   "Beri garis mayo + sedikit kecap manis."],
  "Teflon kering (tanpa minyak) bikin tepung renyah lagi, tidak lembek seperti dipanaskan di microwave.")

r(1, "Kamis", "Bola Daging Saus BBQ", "Mie Goreng Bakso", 8,
  [("Daging sapi giling", "500 g", "P"), ("Telur", "1 butir", "P"),
   ("Tepung roti", "4 sdm", "B"), ("Bawang bombay", "1 buah", "S"),
   ("Saus BBQ", "5 sdm", "B"), ("Mie telur", "1 keping", "R"), ("Sawi hijau", "1 ikat", "S")],
  ["Campur daging, telur, tepung roti, bombay cincang, garam. Bulatkan kecil (±25 bola).",
   "Goreng/panggang sampai matang, lalu masak dengan saus BBQ + sedikit air.",
   "Sekalian rebus 1 keping mie, tiriskan, aduk 1 sdt minyak."],
  "5 bola daging + mie rebus + segenggam sawi iris.",
  ["Tumis bawang putih (dari stok) 30 detik.",
   "Masukkan mie, bola daging dibelah dua, sawi.",
   "Beri kecap manis + kecap asin, aduk 3 menit."],
  "Bola daging mentah sisa adonan bisa dibekukan untuk Rencana B.")

r(1, "Jumat", "Tempe Bacem", "Sate Bento Tempe & Telur Puyuh", 6,
  [("Tempe", "2 papan", "P"), ("Gula merah", "50 g", "B"), ("Ketumbar bubuk", "1 sdt", "B"),
   ("Lengkuas", "2 cm", "S"), ("Daun salam", "2 lembar", "B"), ("Telur puyuh", "10 butir", "P")],
  ["Potong tempe, rebus dengan gula merah, ketumbar, lengkuas, salam, garam, air sampai menyusut (±20 menit).",
   "Goreng sebentar sebelum disajikan.",
   "Telur puyuh direbus saat prep Minggu."],
  "4 potong tempe bacem (belum digoreng).",
  ["Potong tempe dadu, goreng 3 menit.",
   "Tusuk selang-seling dengan telur puyuh dan timun.",
   "Masukkan kotak bersama nasi."],
  "Tusukan pendek (tusuk gigi bento) lebih aman untuk anak kecil daripada tusuk sate panjang.")

# ---------------- MINGGU 2 ----------------
r(2, "Senin", "Sup Ayam Jagung", "Nasi Goreng Ayam Jagung", 8,
  [("Ayam dada", "500 g", "P"), ("Jagung manis", "2 tongkol", "S"), ("Wortel", "2 buah", "S"),
   ("Kentang", "2 buah", "S"), ("Seledri", "2 batang", "S"), ("Bawang putih", "4 siung", "B")],
  ["Rebus ayam dengan bawang putih geprek sampai matang, angkat dan suwir.",
   "Masukkan kentang, wortel, jagung pipil ke kaldu, masak sampai empuk.",
   "Kembalikan ayam suwir, beri garam, merica, seledri."],
  "1 mangkuk ayam suwir + jagung + wortel, TANPA kuah.",
  ["Tumis bawang putih, masukkan sisihan 1 menit.",
   "Masukkan 1 centong nasi + 1 telur, aduk.",
   "Bumbui kecap asin sedikit dan garam."],
  "Sisihkan sebelum seledri masuk kalau anak tidak suka daun hijau di nasi.")

r(2, "Selasa", "Semur Telur Kentang", "Kentang Telur Panggang", 7,
  [("Telur", "8 butir", "P"), ("Kentang", "3 buah", "S"), ("Kecap manis", "5 sdm", "B"),
   ("Pala bubuk", "sejumput", "B"), ("Bawang merah", "5 siung", "B")],
  ["Rebus telur, kupas. Potong kentang besar-besar.",
   "Tumis bawang merah-putih, masukkan kecap, pala, 300 ml air.",
   "Masukkan telur dan kentang, masak sampai kuah meresap ±20 menit."],
  "2 telur + 1 kentang + 2 sdm kuah semur.",
  ["Tekan kentang sampai pipih, belah telur.",
   "Panggang di teflon dengan sedikit mentega sampai pinggirnya garing.",
   "Siram 1 sdm kuah, masukkan kotak."],
  "Pinggiran kentang yang garing biasanya bikin anak lupa ini 'semur kemarin'.")

r(2, "Rabu", "Tumis Tuna Jagung", "Roti / Onigiri Tuna Mayo", 5,
  [("Tuna kaleng", "2 kaleng", "P"), ("Jagung pipil", "1 cangkir", "S"),
   ("Bawang bombay", "1/2 buah", "S"), ("Mayones", "3 sdm", "B"), ("Roti tawar", "2 lembar", "R")],
  ["Tiriskan tuna. Tumis bombay sampai layu.",
   "Masukkan tuna + jagung, bumbui garam, merica, sedikit kecap.",
   "Masak 5 menit sampai agak kering."],
  "4 sdm tumis tuna, simpan dingin.",
  ["Campur tuna dingin dengan 1 sdm mayo.",
   "Isi ke roti (atau bentuk onigiri dengan nasi).",
   "Bungkus rapat."],
  "Bekal bermayones sebaiknya dibawa dengan kantong bekal ber-ice pack.")

r(2, "Kamis", "Spaghetti Bolognese", "Makaroni Schotel Teflon", 9,
  [("Daging sapi giling", "300 g", "P"), ("Tomat", "3 buah", "S"), ("Wortel", "1 buah", "S"),
   ("Spaghetti", "400 g", "R"), ("Makaroni", "100 g", "R"), ("Keju cheddar", "1 blok kecil", "R"),
   ("Saus tomat", "4 sdm", "B")],
  ["Tumis bawang putih + bombay, masukkan daging giling sampai berubah warna.",
   "Masukkan tomat cincang, wortel parut, saus tomat, sedikit air. Masak 15 menit.",
   "Rebus spaghetti. Sekalian rebus 100 g makaroni untuk besok."],
  "1 mangkuk saus bolognese + makaroni rebus.",
  ["Campur makaroni + saus + 1 telur kocok + keju parut.",
   "Tuang ke teflon kecil, tutup, api kecil 6 menit.",
   "Potong seperti kue, masukkan kotak."],
  "Wortel parut di saus = sayur yang tidak kelihatan.")

r(2, "Jumat", "Perkedel Tahu Sayur", "Nugget Tahu Bentuk Lucu", 8,
  [("Tahu putih", "2 kotak", "P"), ("Wortel", "1 buah", "S"), ("Daun bawang", "2 batang", "S"),
   ("Telur", "2 butir", "P"), ("Tepung terigu", "3 sdm", "B")],
  ["Hancurkan tahu, peras airnya.",
   "Campur wortel parut, daun bawang, telur, terigu, garam, merica. Buat adonan DOBEL.",
   "Goreng separuh adonan untuk makan malam."],
  "Separuh adonan mentah di wadah tertutup.",
  ["Cetak adonan pakai cetakan kue (bintang, hati).",
   "Goreng 4 menit sampai kecokelatan.",
   "Masukkan kotak masih hangat."],
  "Jumat Seru: anak boleh pilih bentuk cetakannya sendiri malam ini.")

# ---------------- MINGGU 3 ----------------
r(3, "Senin", "Ayam Bakar Madu Teflon", "Wrap Ayam Madu", 6,
  [("Ayam fillet paha", "600 g", "P"), ("Madu", "3 sdm", "B"), ("Kecap manis", "3 sdm", "B"),
   ("Tortilla", "2 lembar", "R"), ("Selada", "1 ikat kecil", "S"), ("Keju slice", "2 lembar", "R")],
  ["Lumuri ayam dengan bawang putih, madu, kecap, garam. Diamkan 15 menit (atau dari marinasi prep Minggu).",
   "Panggang di teflon api sedang 6–7 menit per sisi, oles sisa bumbu."],
  "1 potong ayam bakar utuh.",
  ["Hangatkan ayam, iris tipis.",
   "Hangatkan tortilla 20 detik, isi selada + keju + ayam.",
   "Gulung ketat, potong dua, bungkus kertas roti."],
  "Kertas roti yang dipelintir di ujung bikin wrap tidak terbuka di tas.")

r(3, "Selasa", "Orak-arik Telur Brokoli", "Telur Gulung Brokoli Keju", 7,
  [("Telur", "8 butir", "P"), ("Brokoli", "1 bonggol kecil", "S"), ("Keju parut", "3 sdm", "R")],
  ["Rebus brokoli 2 menit, cincang halus.",
   "Kocok 8 telur dengan garam. Tuang 3/4 untuk orak-arik malam ini dengan sebagian brokoli."],
  "1/4 kocokan telur + brokoli + keju, mentah, wadah tertutup.",
  ["Aduk ulang kocokan telur.",
   "Tuang tipis ke teflon, gulung, tuang lagi, gulung (3 lapis).",
   "Dinginkan 1 menit, potong 5."],
  "Telur mentah yang dikocok tetap aman 1 malam di kulkas asal ditutup rapat.")

r(3, "Rabu", "Udang Saus Mentega", "Nasi Goreng Udang Buncis", 8,
  [("Udang kupas", "400 g", "P"), ("Mentega", "2 sdm", "R"), ("Buncis", "150 g", "S"),
   ("Saus tiram", "2 sdm", "B"), ("Bawang putih", "4 siung", "B")],
  ["Tumis bawang putih dengan mentega.",
   "Masukkan udang dan buncis, beri saus tiram, sedikit air, garam.",
   "Masak 4 menit sampai udang melengkung merah."],
  "6–8 udang + buncis, dipotong kecil.",
  ["Tumis sisihan 1 menit.",
   "Masukkan nasi, kecap asin, sedikit mentega.",
   "Aduk 3 menit."],
  "Udang jangan dimasak lama pagi hari, cukup panas saja supaya tidak alot.")

r(3, "Kamis", "Perkedel Daging Kentang", "Burger Mini Perkedel", 8,
  [("Daging sapi giling", "250 g", "P"), ("Kentang", "4 buah", "S"), ("Telur", "2 butir", "P"),
   ("Roti bun mini", "4 buah", "R"), ("Keju slice", "2 lembar", "R"), ("Tomat", "1 buah", "S")],
  ["Goreng/kukus kentang, haluskan. Campur daging tumis, telur, garam, pala.",
   "Bentuk bulat pipih, goreng."],
  "2 perkedel mentah berbentuk pipih besar.",
  ["Goreng perkedel 4 menit.",
   "Belah roti bun, susun selada + perkedel + keju.",
   "Tusuk tengahnya dengan tusuk bento."],
  "Bentuk pipih sebesar roti bun supaya pas dan tidak berantakan.")

r(3, "Jumat", "Tempe Orek Kering", "Sushi Roll Tempe", 8,
  [("Tempe", "2 papan", "P"), ("Gula merah", "40 g", "B"), ("Nori", "2 lembar", "B"),
   ("Timun", "1 buah", "S"), ("Mayones", "2 sdm", "B")],
  ["Potong tempe korek api, goreng kering.",
   "Tumis bawang, gula merah, kecap, sedikit air; masukkan tempe, aduk sampai karamel.",
   "Pisahkan porsi anak sebelum cabai masuk."],
  "4 sdm tempe orek versi tanpa cabai.",
  ["Hamparkan nasi di atas nori (sisakan 2 cm atas).",
   "Isi tempe orek + timun panjang + garis mayo.",
   "Gulung pakai plastik wrap, potong 6."],
  "Pisau dibasahi air setiap potong supaya roll tidak hancur.")

# ---------------- MINGGU 4 ----------------
r(4, "Senin", "Chicken Katsu", "Katsu Sando", 7,
  [("Ayam dada fillet", "600 g", "P"), ("Tepung panir", "150 g", "B"), ("Telur", "2 butir", "P"),
   ("Kol", "1/4 buah", "S"), ("Roti tawar", "2 lembar", "R"), ("Saus BBQ / tonkatsu", "3 sdm", "B")],
  ["Pipihkan ayam, bumbui garam merica.",
   "Balur terigu → telur → panir, goreng sampai keemasan.",
   "Sajikan dengan kol iris."],
  "1 potong katsu utuh + segenggam kol iris.",
  ["Garingkan katsu di teflon kering / air fryer 4 menit.",
   "Oles roti dengan saus, beri kol, katsu, tangkup.",
   "Tekan sebentar, potong 3 memanjang."],
  "Pinggiran roti boleh dipotong; simpan untuk tepung roti buatan sendiri.")

r(4, "Selasa", "Orak-arik Telur Sosis Sayur", "Lumpia Telur Mini", 9,
  [("Telur", "6 butir", "P"), ("Sosis", "4 batang", "P"), ("Kacang polong & wortel beku", "1 cangkir", "S"),
   ("Kulit lumpia", "1 bungkus kecil", "R")],
  ["Tumis sosis iris + sayur beku.",
   "Masukkan telur kocok, orak-arik sampai matang, beri garam & sedikit kecap."],
  "1 mangkuk kecil orak-arik.",
  ["Isi 1 sdm orak-arik ke kulit lumpia, gulung (4 buah).",
   "Goreng 3–4 menit sampai keemasan.",
   "Tiriskan di tisu, masukkan kotak."],
  "Lumpia bisa digulung malam ini juga, pagi tinggal goreng.")

r(4, "Rabu", "Nugget Ikan Homemade + Sup Bayam", "Nugget Ikan & Nasi Kepal Nori", 6,
  [("Ikan tenggiri / dori giling", "500 g", "P"), ("Wortel", "1 buah", "S"), ("Telur", "2 butir", "P"),
   ("Tepung terigu", "4 sdm", "B"), ("Tepung panir", "100 g", "B"), ("Bayam", "1 ikat", "S")],
  ["(Nugget dibuat saat prep Minggu & dibekukan.) Goreng nugget beku langsung.",
   "Sup bening: rebus air, bawang putih, bayam, jagung, garam."],
  "Ambil 4 nugget beku dari freezer, pindah ke kulkas malam ini.",
  ["Goreng nugget 4 menit.",
   "Bentuk nasi bulat, tempel nori kecil.",
   "Masukkan kotak dengan saus tomat sachet."],
  "Satu adonan nugget = ±40 potong, cukup jadi stok Rencana B 2 minggu.")

r(4, "Kamis", "Mie Kuah Bakso Sapi", "Bakso Tusuk Bakar", 6,
  [("Bakso sapi", "1 bungkus (±25 butir)", "P"), ("Mie telur", "2 keping", "R"),
   ("Sawi hijau", "1 ikat", "S"), ("Daun bawang", "2 batang", "S")],
  ["Didihkan kaldu (bawang putih tumis + air + garam + merica).",
   "Masukkan bakso, mie, sawi. Taburi daun bawang."],
  "5 butir bakso, tanpa kuah.",
  ["Belah bakso jadi dua, tusuk 3–4 per tusuk bento.",
   "Oles kecap manis + saus tomat, bakar di teflon 3 menit.",
   "Masukkan kotak dengan nasi / kentang."],
  "Belah dua bakso: lebih cepat panas dan lebih aman dikunyah anak kecil.")

r(4, "Jumat", "Pizza Roti Teflon (Anak Pilih Topping)", "Pizza Roll", 7,
  [("Roti tawar", "8 lembar", "R"), ("Saus pizza / saus tomat", "6 sdm", "B"),
   ("Keju mozarella", "150 g", "R"), ("Sosis", "4 batang", "P"),
   ("Jagung pipil", "1/2 cangkir", "S"), ("Paprika", "1/2 buah", "S")],
  ["Oles roti dengan saus, beri topping pilihan anak + keju.",
   "Masak di teflon tertutup api kecil sampai keju leleh."],
  "2 lembar roti + topping di wadah terpisah.",
  ["Pipihkan roti pakai gelas.",
   "Oles saus, beri keju + sosis, gulung rapat.",
   "Panggang di teflon 4 menit sambil diputar."],
  "Jumat Seru: tulis topping pilihan anak di papan kulkas, besok mereka tagih sendiri.")


STOK = {
    "Kering & Bumbu": ["Beras", "Kecap manis", "Kecap asin", "Saus tiram", "Saus tomat",
                       "Mayones", "Minyak goreng", "Garam, gula, merica", "Kaldu bubuk",
                       "Tepung terigu", "Maizena", "Tepung panir", "Nori", "Abon"],
    "Kulkas": ["Telur (min. 10 butir)", "Mentega", "Keju slice / cheddar",
               "Bumbu dasar bawang (prep Minggu)", "Bawang putih goreng + minyaknya"],
    "Freezer": ["Roti tawar (beku, tahan 2 minggu)", "Sosis", "Nugget ikan homemade",
                "Jagung & kacang polong beku", "Bola daging mentah (sisa adonan)", "Tortilla"],
    "Rak": ["Mie telur", "Makaroni", "Bawang merah, putih, bombay", "Kentang"],
}

RENCANA_B = [
    ("Nasi Telur Kecap Mentega", "Nasi + telur ceplok + mentega + kecap manis. Aduk saat panas.", "Telur, mentega, kecap"),
    ("Onigiri Abon", "Nasi hangat dicampur abon, bentuk segitiga, bungkus nori.", "Abon, nori"),
    ("Roti Telur Keju", "Celup roti ke telur kocok, goreng, tangkup dengan keju.", "Roti beku, telur, keju"),
    ("Mie Goreng Telur Sayur", "Mie rebus 3 menit, tumis bawang goreng + sayur beku + telur + kecap.", "Mie, sayur beku, telur"),
    ("Makaroni Keju Susu", "Makaroni rebus + mentega + keju + sedikit susu, aduk sampai creamy.", "Makaroni, keju, susu"),
    ("Quesadilla Sosis", "Tortilla isi keju + sosis iris, lipat, panggang teflon 2 menit/sisi.", "Tortilla, keju, sosis"),
    ("Nasi Goreng Mentega Jagung", "Nasi + mentega + jagung beku + kecap asin + telur.", "Jagung beku, mentega, telur"),
    ("Nugget + Nasi Kepal", "Goreng nugget beku, nasi dibentuk bulat + nori.", "Nugget homemade, nori"),
    ("Telur Gulung Sosis", "Dadar tipis dililit di sosis, potong-potong.", "Telur, sosis"),
    ("Roti Pisang Madu Panggang", "Roti isi pisang iris + madu, panggang teflon sampai garing.", "Roti beku, pisang, madu"),
]
