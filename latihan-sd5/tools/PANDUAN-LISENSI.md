# Mengunci nama anak di semua perangkat (gratis, ±10 menit)

1. Buka Google Sheets → buat spreadsheet baru "Lisensi SD5". Baris 1 isi judul: `kode | nama | perangkat | terakhir | blokir`.
2. Menu **Ekstensi → Apps Script**. Hapus isinya, tempel seluruh isi `lisensi-apps-script.gs`, simpan.
3. **Terapkan → Deployment baru → Jenis: Aplikasi web.** Jalankan sebagai: *Saya*. Akses: *Siapa saja*. Klik Terapkan, izinkan akses, salin URL (berakhiran `/exec`).
4. Buka `js/app.js`, isi `const LISENSI_URL = "URL_tadi";`, lalu jalankan `node tools/bundle-scalev.js` dan tempel ulang `dist/latihan-sd5.html` ke Scalev.

Hasilnya:
- Nama anak pertama yang diisi terkunci ke kode itu. Dibuka di HP lain → nama otomatis sama, tidak bisa diganti.
- Maksimal 3 perangkat per kode (ubah `MAKS_PERANGKAT`).
- Blokir kode yang disebar: tulis `YA` di kolom *blokir*.
- Ganti nama atas permintaan pembeli: edit kolom *nama* di sheet.
