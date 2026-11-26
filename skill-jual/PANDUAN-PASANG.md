# UGC Flow Studio — Panduan Pasang & Pakai

Skill ini membuat Claude bisa menyusun paket produksi iklan video UGC untuk Google Flow: prompt gambar kreator, shot list, prompt Flow per shot, briefing Agent mode, dan skrip voiceover.

## Yang kamu butuhkan
- Akun Claude yang mendukung fitur **Skills** (cek di Settings → Capabilities).
- Akun Google Flow untuk membuat videonya.

## Cara pasang (sekali saja)
1. Buka claude.ai, lalu masuk ke **Settings → Capabilities → Skills**.
2. Klik **Upload skill**, lalu pilih file `ugc-flow-studio-skill.zip`. Jangan di-extract dulu.
3. Pastikan skill **UGC Flow Studio** dalam keadaan aktif.

## Cara pakai
1. Buka chat baru di Claude.
2. Lampirkan foto produk. Boleh beberapa sisi: depan, samping, detail. Kalau punya foto model, lampirkan juga.
3. Ketik perintah, contohnya:

> Buatkan iklan UGC Google Flow untuk produk ini. Nama produk: Kacamata Anti Radiasi. Angle: before/after. Durasi 8 detik, 3 shot.

4. Claude akan memberi 5 bagian:
   - **Prompt gambar kreator**: tempel ke ChatGPT atau Nano Banana bersama foto model. Simpan hasilnya sebagai `creator.png`.
   - **Shot list**: naskah per adegan untuk dicek dulu.
   - **Prompt Flow per shot**: tempel satu per satu di Flow, dengan `creator.png` dan foto produk sebagai ingredient.
   - **Briefing Agent mode**: untuk membuat semua shot sekaligus kalau Agent mode di Flow aktif.
   - **Skrip voiceover**: untuk dibuat suaranya di ElevenLabs.
5. Minta revisi di chat yang sama, misalnya "buat dialog shot 2 lebih santai".

## Pilihan angle (23)
Testimonial · Mobil/On-the-Go · Unboxing · Lifestyle Demo · Problem-Solution · GRWM · Day in the Life · Car Talking Head · Reply to Comment · Before/After · Mirror Try-On · POV · Storytime · Walk and Talk · Podcast Clip · 3 Alasan · Mitos vs Fakta · Dulu vs Sekarang · Jangan Beli Dulu · Tips/Edukasi · Review dari Ulasan · Hot Take · Rekomendasi Kado

Kalau belum tahu mau angle apa, cukup tulis "pilihkan angle yang paling cocok".

## Contoh perintah lain
- "Pakai angle Mitos vs Fakta, kreator hijaber kantoran, ringkas jadi 3 shot."
- "Aku sudah punya foto kreator sendiri, lewati prompt gambar."
- "Buat 3 versi hook berbeda untuk shot 1."

## Tips hasil terbaik
- Foto produk yang jelas dan terang. Beri nama file sesuai sisinya, misalnya `kacamata-depan.jpg`.
- Jaga produk besar di frame dan gerakannya sederhana supaya bentuk produk tidak berubah.
- Kalau satu shot keluar bahasa Inggris, generate ulang shot itu saja.
