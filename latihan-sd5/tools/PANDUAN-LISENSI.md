# Kirim kode akses OTOMATIS + kunci nama anak (gratis, ±15 menit)

## A. Siapkan Google Sheets
1. Buat spreadsheet baru "Les di Rumah 5".
2. Tab pertama ganti nama **Kode**. Baris 1: `kode | status | email | nama | pesanan | waktu`. Tempel isi `kode-akses.csv` mulai A2.
3. Tambah tab kedua bernama **Lisensi**. Baris 1: `kode | nama | perangkat | terakhir | blokir`.

## B. Pasang script
1. Menu **Ekstensi → Apps Script**, hapus isinya, tempel seluruh `lisensi-apps-script.gs`, simpan.
2. **Terapkan → Deployment baru → Aplikasi web**. Jalankan sebagai: *Saya*. Akses: *Siapa saja*. Izinkan akses (termasuk kirim email). Salin URL `/exec`.

## C. Sambungkan ke Scalev
1. Di Scalev: menu **Integrasi / Webhook** (atau pengaturan produk/toko → Webhook).
2. Tambah webhook, URL = URL `/exec` tadi, event = **pesanan dibayar / order paid**.
3. Tes dengan 1 pesanan percobaan. Cek sheet **Kode**: baris kode berubah jadi "terkirim" dan email masuk ke pembeli.

## D. Aktifkan kunci nama
Kirim URL `/exec` ke Claude untuk dipasang di aplikasi (`LISENSI_URL`), lalu tempel ulang file aplikasi ke Scalev.

Catatan: kuota kirim Gmail gratis ±100 email/hari. Kalau kode habis, script mengirim email peringatan ke Anda.
