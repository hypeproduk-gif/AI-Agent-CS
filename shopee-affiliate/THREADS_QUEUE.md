# Antrean Threads (autopost) — ringkasan untuk sesi/room lain

Kode: repo `hypeproduk-gif/AI-Agent-CS`, branch `claude/elegant-planck-q6rv18`, folder `shopee-affiliate/`.
Jalan di VPS IDCloudHost (`ssh filo@103.55.38.134`, folder `~/AI-Agent-CS/shopee-affiliate`, service `autopost-web`).
Web: `http://103.55.38.134:8090/threads` (Basic Auth, password = `APP_PASSWORD` di `.env`).

## Cara kerja
- Antrean disimpan di `output/threads_queue.json`. Scheduler di `app.py` memposting 1 item tiap jam di `THREADS_TIMES` (WIB).
- Item dengan `reply` = postingan jualan: setelah tayang, akun membalas postingannya sendiri dengan `reply` (berisi link).
- Item tanpa `reply` = obrolan. Scheduler selang-seling jualan/obrolan dan menyebar item dari kiriman (`batch`) yang sama.
- Foto opsional per item (`image`, file di `PUBLIC_DIR=/opt/n8n/media`, disajikan via `PUBLIC_BASE_URL=https://n8n.filodigital.my.id/media`).
- Item yang tayang > `THREADS_KEEP_DAYS` (default 3) hari dihapus otomatis. Token Threads diperpanjang otomatis tiap 7 hari.
- Tombol jeda: file `output/threads_paused`.

## Format tempel (halaman web)
```
Teks postingan 1 ...
KOMENTAR: Teks balasan + https://link
---
Teks postingan obrolan (tanpa KOMENTAR)
```
Satu kali tempel = satu kiriman (mis. 3 variasi 1 produk).

## API (Basic Auth, username bebas)
```bash
# lihat antrean
curl -u x:PASSWORD http://103.55.38.134:8090/api/threads
# tambah 1 kiriman
curl -u x:PASSWORD -H 'Content-Type: application/json' http://103.55.38.134:8090/api/threads \
  -d '{"posts":[{"text":"Postingan jualan","reply":"Cek di sini: https://lp.contoh.com"},{"text":"Obrolan tanpa link"}]}'
```

## Deploy perubahan kode
Di VPS: `cd ~/AI-Agent-CS && git pull && sudo systemctl restart autopost-web`

## Status terakhir
- Postingan terakhir gagal dengan `API access blocked` (OAuthException code 200, subcode 5258005) dari Meta. Jadwal sebaiknya dijeda, tunggu ~24 jam, tes 1 postingan, lalu mulai lagi dengan 3–4 postingan/hari.
- Akun Threads akan dialihkan dari affiliate Shopee ke jualan produk digital sendiri: konten harus dari sudut pandang pembuat/edukasi, bukan testimoni palsu.
