# UGC Flow Studio — versi jual (backend)

Web app berbayar: pembeli memasukkan **kode lisensi**, lalu generate paket produksi iklan UGC Google Flow. API key Anthropic dan isi skill disimpan di server, jadi pembeli tidak pernah melihatnya.

## Cara kerja

1. Pembeli membeli paket di toko kamu (Lynk.id, Shopee, Tokopedia, WhatsApp, dan lain-lain).
2. Kamu membuat kode lisensi di halaman admin `/admin.html`, lalu mengirimkannya ke pembeli.
3. Pembeli membuka web app, memasukkan kode, lalu generate. Setiap generate memotong 1 kredit.
4. Kalau generate gagal, kredit dikembalikan otomatis.

## Fitur

- Lisensi dengan jumlah kredit dan masa aktif opsional
- Admin: buat kode (bisa banyak sekaligus), tambah kredit, nonaktifkan, dan lihat pemakaian token 30 hari
- Prompt skill hanya ada di server (`skills/`, `prompt-template.txt`)
- Batas harian per kode lisensi: 20 generate per hari (reset 00.00 WIB), bisa diubah lewat `DAILY_LIMIT`
- Prompt caching untuk menekan biaya input API
- Rate limit: 5 generate per menit per IP
- Database SQLite satu file, tanpa server database terpisah

## Menjalankan di komputer

```bash
cp .env.example .env     # isi ANTHROPIC_API_KEY dan ADMIN_TOKEN
npm install
npm start
```

Buka `http://localhost:3000` (app pembeli) dan `http://localhost:3000/admin.html` (admin).

## Deploy ke Railway (disarankan)

1. Push folder ini ke repo GitHub.
2. Di railway.app, pilih **New Project → Deploy from GitHub repo**. Kalau folder ini bukan root repo, atur Root Directory ke `ugc-saas`.
3. Di **Variables**, isi:
   - `ANTHROPIC_API_KEY`
   - `ADMIN_TOKEN` (string acak minimal 16 karakter)
   - `MODEL=claude-sonnet-5-5`
   - `DAILY_LIMIT=20`
   - `DB_PATH=/data/app.db`
4. Tambahkan **Volume** dengan mount path `/data`. Tanpa volume, data lisensi hilang setiap kali deploy ulang.
5. Di **Settings → Networking**, klik Generate Domain. Kamu bisa juga memakai domain sendiri.

Render, Fly.io, atau VPS juga bisa dipakai, karena Dockerfile sudah tersedia. Syaratnya ada disk permanen untuk `/data`.

Vercel dan Netlify tidak cocok karena keduanya tidak menyimpan file SQLite.

## Menghitung harga

Lihat token di halaman admin, lalu hitung biaya per generate berdasarkan harga model di anthropic.com/pricing. Satu generate kira-kira memakai 10 ribu token input (isi skill) dan 2–4 ribu token output. Tetapkan harga per kredit beberapa kali lipat dari biaya itu.

Contoh paket:

| Paket | Kredit | Masa aktif |
|-------|--------|-----------|
| Starter | 20 | 30 hari |
| Pro | 100 | 90 hari |
| Bisnis | 300 | 1 tahun |

## Keamanan

- Jangan pernah commit `.env`. File ini sudah masuk `.gitignore`.
- Ganti `ADMIN_TOKEN` kalau token itu pernah terbagikan.
- Batasi pemakaian di console.anthropic.com (Spend limits) supaya tagihan tidak melonjak.
- Backup `/data/app.db` secara berkala.

## Mengubah isi skill

Edit file di `skills/*.md` atau `prompt-template.txt`, lalu deploy ulang. Data lisensi tetap aman karena tersimpan di volume.
