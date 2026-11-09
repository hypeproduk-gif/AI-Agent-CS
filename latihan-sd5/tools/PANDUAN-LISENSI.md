# Kirim kode akses OTOMATIS — tanpa langganan WhatsApp (gratis)

Pembeli menerima kode lewat **email** dari Gmail Anda, otomatis ±5 menit setelah bayar.

## A. Google Sheets
1. Buat spreadsheet "Les di Rumah 5" **memakai akun Gmail yang menerima notifikasi pesanan dari Scalev**.
2. Tab pertama beri nama **Kode**. Baris 1: `kode | status | email | nama | pesanan | waktu`. Tempel isi `kode-akses.csv` mulai sel A2.
3. Tab kedua beri nama **Lisensi**. Baris 1: `kode | nama | perangkat | terakhir | blokir`.

## B. Script
1. **Ekstensi → Apps Script**, hapus isinya, tempel `lisensi-apps-script.gs`, simpan.
2. Pilih fungsi **pasangPemicu** di toolbar → **Jalankan** → izinkan akses (Gmail, Sheets, kirim email). Selesai: script mengecek Gmail tiap 5 menit.
3. (Untuk kunci nama anak) **Terapkan → Deployment baru → Aplikasi web**, akses *Siapa saja*, salin URL `/exec`, kirim ke Claude.

## C. Scalev
Pastikan notifikasi **pesanan lunas** dikirim ke email Anda (Pengaturan → Notifikasi). Tidak perlu webhook atau WhatsApp berbayar.

## D. Tes
Buat 1 pesanan percobaan sampai lunas, tunggu 5 menit. Sheet **Kode** berubah "terkirim" dan email kode masuk ke pembeli.
Kalau tidak jalan: kirim screenshot/teks email notifikasi Scalev ke Claude untuk disesuaikan. Email yang gagal dibaca akan diberi **bintang** di Gmail untuk dicek manual.

Batas Gmail gratis ±100 email/hari.
