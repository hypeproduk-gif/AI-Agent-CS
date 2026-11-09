# Les di Rumah Kelas 5

Web app (PWA) latihan soal harian pengganti les bulanan: **4.000 soal** (1.000 per mapel) Matematika, Bahasa Indonesia, Bahasa Inggris, IPA — Kurikulum Merdeka Fase C kelas 5.

- **100 hari × 10 soal × 4 mapel.** Level naik 2 kali: hari 1–35 Level 1 (350 soal/mapel), 36–70 Level 2 (350), 71–100 Level 3 / HOTS (300).
- Gambar (diagram batang, bangun datar/ruang, pecahan, jam, sudut, rantai makanan, rangkaian listrik, cermin, preposisi, gambar kosakata) dibuat otomatis sebagai SVG.
- Setiap soal punya pembahasan. Fitur: streak, rapor per topik, ulang soal salah, cetak lembar soal + kunci, offline (service worker).
- Bank soal dibangkitkan dari generator berbibit (`js/*.js`) sehingga selalu sama di setiap perangkat.

Jalankan: buka `index.html` di browser, atau hosting statis (GitHub Pages/Netlify) agar bisa di-install di HP.
Validasi bank soal: `node check.js`.
