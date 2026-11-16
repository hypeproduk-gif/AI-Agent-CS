// Ringkasan materi kelas 6 (Kurikulum Merdeka Fase C) + pengulangan untuk ujian akhir SD
(function (G) {
  const S = G.CORE.S;
  G.MATERI = {
    MTK: [
      ["Bilangan Bulat", `${S.numline(-5, 5, null)}<p>Bilangan di kiri nol negatif, di kanan nol positif. Makin ke kanan makin besar: −5 &lt; −2 &lt; 0 &lt; 3.</p><p><b>Penjumlahan/pengurangan:</b> a − (−b) = a + b. Contoh: 4 − (−3) = 7; −6 + 2 = −4.</p><p><b>Perkalian/pembagian tanda:</b> (+)(+) = +, (−)(−) = +, (+)(−) = −. Contoh: −4 × 3 = −12; −12 : (−3) = 4.</p><p>Soal cerita suhu: naik = tambah, turun = kurang.</p>`],
      ["Operasi Hitung Campuran", `<p>Urutan: <b>kurung → pangkat/akar → kali/bagi (kiri ke kanan) → tambah/kurang (kiri ke kanan)</b>.</p><p>Contoh: 20 − 3 × 4 + 2² = 20 − 12 + 4 = 12.</p>`],
      ["Pangkat dan Akar", `<p>Pangkat dua: 7² = 7 × 7 = 49. Akar kuadrat: √49 = 7.</p><p>Pangkat tiga: 4³ = 4 × 4 × 4 = 64. Akar pangkat tiga: ∛64 = 4.</p><p>Hafalkan: 1², 2², … 25² dan 1³ … 10³.</p>`],
      ["Pecahan, Desimal, Persen", `<p>Pecahan campuran → pecahan biasa: 2 ¾ = (2 × 4 + 3)/4 = 11/4.</p><p>Penjumlahan beda penyebut: samakan penyebut (KPK). Perkalian: pembilang × pembilang, penyebut × penyebut. Pembagian: kali kebalikan.</p><p>Persen: ¾ = 75%. <b>Untung</b> = harga jual − harga beli; harga jual = beli + untung%.</p>`],
      ["KPK dan FPB (Soal Cerita)", `<p><b>KPK</b> untuk “bersamaan lagi”, “setiap … hari/menit”. <b>FPB</b> untuk “dibagi sama banyak”, “paling banyak kelompok/kantong”.</p><p>Cara: pohon faktor. 12 = 2² × 3, 18 = 2 × 3² → KPK = 36, FPB = 6.</p>`],
      ["Perbandingan dan Skala", `<p>Bagian A = a/(a+b) × jumlah. Jika yang diketahui <b>selisih</b>: 1 bagian = selisih : (b − a).</p><p>Jarak sebenarnya = jarak peta × penyebut skala.</p>`],
      ["Kecepatan dan Debit", `<p>Jarak = kecepatan × waktu. Waktu berpapasan = jarak : (v₁ + v₂).</p><p>Debit = volume : waktu. 1 dm³ = 1 liter, 1.000 cm³ = 1 liter.</p>`],
      ["Lingkaran", `${S.circle(7, "r", "cm")}<p>d = 2 × r. π = 22/7 (jika r kelipatan 7) atau 3,14.</p><p><b>Keliling</b> = π × d = 2 × π × r. <b>Luas</b> = π × r × r.</p><p>Contoh: r = 7 cm → K = 44 cm, L = 154 cm². Jarak roda berputar n kali = n × keliling.</p>`],
      ["Volume dan Luas Permukaan Bangun Ruang", `${S.cylinder(7, 10, "cm")}<p>Kubus: V = s³, Lp = 6 × s². Balok: V = p × l × t, Lp = 2(pl + pt + lt).</p><p>Prisma: V = luas alas × tinggi. Tabung: V = π × r² × t.</p>`],
      ["Koordinat Kartesius", `${S.cartesius(3, -2, "A")}<p>Titik ditulis (x, y): x = mendatar (kanan +, kiri −), y = tegak (atas +, bawah −). Titik A = (3, −2).</p><p>Pergeseran: ke kanan x bertambah, ke bawah y berkurang.</p>`],
      ["Statistika", `${S.pie(["A", "B", "C", "D"], [40, 30, 20, 10], "Contoh diagram lingkaran")}<p><b>Mean</b> (rata-rata) = jumlah data : banyak data. <b>Median</b> = nilai tengah setelah data diurutkan. <b>Modus</b> = nilai paling sering muncul.</p><p>Diagram lingkaran: banyak = persen × total.</p>`],
    ],
    BIND: [
      ["Ide Pokok, Simpulan, Judul", `<p><b>Ide pokok</b> = gagasan utama paragraf. <b>Simpulan</b> = ringkasan isi seluruh teks dalam satu kalimat. <b>Judul</b> mewakili ide pokok, singkat, menarik.</p>`],
      ["Informasi dalam Teks (5W + 1H)", `<p>Apa, siapa, kapan, di mana, mengapa, bagaimana. Jawaban dicari langsung di teks. Untuk soal “TIDAK sesuai”, cek satu per satu pilihan dengan isi teks.</p>`],
      ["Konjungsi (Kata Hubung)", `<p><b>Sebab:</b> karena, sebab. <b>Akibat:</b> sehingga, maka. <b>Tujuan:</b> agar, supaya. <b>Pertentangan:</b> tetapi, namun, meskipun. <b>Waktu:</b> sebelum, sesudah, sementara. <b>Pilihan:</b> atau. <b>Penambahan:</b> dan.</p>`],
      ["Kalimat Efektif", `<p>Hemat kata dan tidak bermakna ganda. Hindari: “para siswa-siswa” → <b>para siswa</b>; “naik ke atas” → <b>naik</b>; “sangat … sekali” → pilih salah satu; “sejak dari” → <b>sejak</b>.</p>`],
      ["Kalimat Langsung dan Tidak Langsung", `<p>Langsung: Ibu berkata, “Saya akan ke pasar.” Tidak langsung: Ibu berkata <b>bahwa dia</b> akan ke pasar. Tanda petik hilang, kata ganti disesuaikan (saya → dia).</p>`],
      ["Jenis Teks: Pidato, Iklan, Slogan, Poster, Pengumuman", `<p><b>Pidato:</b> salam pembuka, isi, penutup. <b>Iklan:</b> membujuk membeli. <b>Slogan:</b> pendek, mudah diingat. <b>Poster:</b> gambar + tulisan singkat. <b>Pengumuman:</b> pemberitahuan untuk banyak orang.</p>`],
      ["Surat Resmi", `<p>Bagian: kop surat, nomor, tanggal, perihal, alamat tujuan, salam pembuka, isi, salam penutup, tanda tangan dan nama terang. Bahasa baku dan sopan.</p>`],
      ["Puisi", `<p><b>Tema</b> = gagasan pokok puisi. <b>Rima</b> = persamaan bunyi akhir baris (a-a-a-a, a-b-a-b). <b>Majas:</b> metafora (ibu pelita hidupku), personifikasi (burung bernyanyi), hiperbola (berlebihan), simile (seperti/bagai).</p>`],
      ["Kata Baku, Sinonim, Antonim, Imbuhan", `<p>Kata baku: praktik, apotek, izin, risiko, silakan. Sinonim: cermat = teliti. Antonim: dermawan × kikir.</p><p>Imbuhan me-: s → ny (menyapu), t → n (menulis), p → m (memukul), k → ng (mengirim).</p>`],
      ["Huruf Kapital", `<p>Dipakai pada awal kalimat, nama orang, nama kota/negara, nama hari dan bulan, nama lembaga, judul.</p>`],
    ],
    BING: [
      ["Simple Past Tense", `<p>Kejadian lampau: Subject + verb 2. Kata kunci: yesterday, last week, ago.</p><p>Regular: play → played, study → studied. Irregular: go → went, eat → ate, buy → bought, see → saw.</p><p>Negatif: did not + verb 1 (I did not go). Tanya: Did + subject + verb 1? (Did you go?)</p>`],
      ["Future Tense", `<p>Will + verb 1: I will visit grandma tomorrow. Be going to + verb 1 untuk rencana: She is going to swim next week.</p>`],
      ["Comparison", `<p>Comparative (2 benda): tall → taller than; beautiful → more beautiful than. Superlative (lebih dari 2): the tallest, the most beautiful. Khusus: good → better → best, bad → worse → worst.</p>`],
      ["Health Problems", `<p>headache (sakit kepala), toothache (sakit gigi), stomachache (sakit perut), fever (demam), cough (batuk), cold (pilek).</p><p>Saran: You should take a rest / go to the dentist / drink warm water.</p>`],
      ["Countries and Nationalities", `<p>Japan – Japanese – Tokyo; Thailand – Thai – Bangkok; England – English – London; France – French – Paris; Korea – Korean – Seoul.</p>`],
      ["Directions", `<p>turn left (belok kiri), turn right (belok kanan), go straight (lurus), cross the road (menyeberang), next to (di samping), across from (di seberang).</p>`],
      ["Shapes, Hobbies, Shopping", `<p>circle, square, triangle, rectangle, star, oval. Hobbies: swimming, reading, drawing, gardening.</p><p>How much is it? It is twenty thousand rupiahs (Rp20.000).</p>`],
    ],
    IPA: [
      ["Tata Surya", `${S.planets(null)}<p>Matahari pusat tata surya. Urutan planet: Merkurius, Venus, Bumi, Mars, Yupiter, Saturnus, Uranus, Neptunus. Yupiter terbesar, Merkurius terdekat, Saturnus bercincin, Mars planet merah.</p>`],
      ["Rotasi, Revolusi, Gerhana", `${S.eclipse("matahari")}<p><b>Rotasi</b> (±24 jam): siang-malam, perbedaan waktu WIB-WITA-WIT. <b>Revolusi</b> (365¼ hari): pergantian musim, tahun kabisat setiap 4 tahun.</p><p><b>Gerhana Matahari:</b> Bulan di antara Matahari dan Bumi. <b>Gerhana Bulan:</b> Bumi di antara Matahari dan Bulan.</p>`],
      ["Perkembangbiakan Makhluk Hidup", `<p><b>Tumbuhan vegetatif alami:</b> umbi (kentang), umbi lapis (bawang), tunas (pisang), geragih (stroberi), rizoma (jahe), tunas daun (cocor bebek). <b>Buatan:</b> stek, cangkok, okulasi, merunduk. <b>Generatif:</b> penyerbukan → biji.</p><p><b>Hewan:</b> ovipar (bertelur), vivipar (melahirkan), ovovivipar (hiu, kadal), membelah diri (amoeba), fragmentasi (planaria).</p><p><b>Metamorfosis sempurna:</b> telur → larva → pupa → dewasa (kupu-kupu). <b>Tidak sempurna:</b> telur → nimfa → dewasa (belalang).</p>`],
      ["Pubertas", `<p>Masa peralihan anak ke dewasa (±10–15 tahun). Laki-laki: suara membesar, jakun, kumis. Perempuan: menstruasi, pinggul membesar. Jaga kebersihan dan makan bergizi.</p>`],
      ["Perubahan Wujud Benda", `<p>Mencair (padat → cair), membeku (cair → padat), menguap (cair → gas), mengembun (gas → cair), menyublim (padat → gas, kapur barus), mengkristal (gas → padat).</p><p>Menyerap panas: mencair, menguap, menyublim. Melepas panas: membeku, mengembun, mengkristal.</p>`],
      ["Pesawat Sederhana dan Gaya", `${S.lever(1)}<p>Tuas golongan 1: titik tumpu di tengah (gunting). Golongan 2: beban di tengah (gerobak). Golongan 3: kuasa di tengah (sekop, pinset).</p><p>Katrol (timba sumur), bidang miring (tangga, sekrup), roda berporos (setir). Gaya gravitasi, gaya gesek (ban beralur, pelumas).</p>`],
      ["Listrik dan Energi", `<p>Listrik statis (penggaris digosok, petir), listrik dinamis (arus mengalir). Penangkal petir mengalirkan muatan ke tanah.</p><p>Energi terbarukan: matahari, angin, air, panas bumi. Tidak terbarukan: minyak bumi, batu bara.</p>`],
      ["Pelestarian Lingkungan", `<p>Pemanasan global akibat gas rumah kaca (karbon dioksida). Dampak: es kutub mencair, permukaan laut naik. Solusi: reboisasi, hemat listrik, naik sepeda/angkutan umum.</p>`],
      ["Pengulangan Kelas 4–5", `<p>Organ: jantung (memompa darah), paru-paru (pertukaran gas), usus halus (menyerap sari makanan), ginjal (menyaring darah).</p><p>Sifat cahaya: merambat lurus, dipantulkan, dibiaskan, diuraikan, menembus benda bening. Konduktor: logam; isolator: karet, plastik, kayu.</p>`],
    ],
  };
})(window);
