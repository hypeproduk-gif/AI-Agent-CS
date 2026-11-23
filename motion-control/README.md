# Motion Control AI

Upload **video referensi gerakan** + **foto model** + **foto produk** (fashion/aksesoris/apa pun) → aplikasi membuat video AI: model memakai produk, bergerak persis seperti video referensi.

## Alur
1. Foto model + produk digabung dengan AI image edit (`fal-ai/nano-banana/edit`) → model memakai/memegang produk.
2. Gambar hasil + video referensi dikirim ke Kling Motion Control (`fal-ai/kling-video/v2.6/standard/motion-control`) → video final.

## Jalankan
1. Buat API key di https://fal.ai/dashboard/keys (berbayar per generate).
2. ```
   cd motion-control
   npm install
   FAL_KEY=xxx npm start
   ```
3. Buka http://localhost:3000

Ganti model lewat env `IMAGE_MODEL` / `MOTION_MODEL` (mis. `.../v2.6/pro/motion-control` untuk kualitas lebih tinggi).

Tips: video referensi 3–30 detik, satu orang, seluruh badan terlihat; foto model menghadap depan, full body.
