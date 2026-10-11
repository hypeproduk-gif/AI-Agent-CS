# Shopee Trending — Agent Affiliate

Tiap hari ambil produk dari **Shopee Affiliate Open API**, simpan snapshot, lalu ranking produk trending **1 hari / 3 hari / 7 hari** + urutan paling *worth it* dibuat konten affiliate. Hasil dikirim ke Telegram (opsional + ide hook/angle dari Claude).

## Cara hitung
- Shopee hanya kasih **total terjual kumulatif**, jadi penjualan per periode = selisih snapshot hari ini vs N hari lalu. Hari pertama belum ada pembanding → ranking pakai total terjual; data 7d akurat setelah 7 hari jalan.
- **Skor worth it (0–100)**: potensi komisi pasar periode itu (terjual × harga × % komisi) 45%, momentum penjualan/hari 25%, komisi per order 15%, rating 10%, harga ramah impuls (≤Rp150rb) 5%.
- "Penghasilan affiliator" orang lain tidak tersedia di API mana pun; yang dipakai adalah estimasi potensi komisi di atas.

## Setup
1. Daftar Open API di affiliate.shopee.co.id → Open API → dapat **App ID** & **Secret**.
2. Repo → Settings → Secrets: `SHOPEE_APP_ID`, `SHOPEE_SECRET`, opsional `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ANTHROPIC_API_KEY`.
   Variable opsional `SHOPEE_KEYWORDS` (mis. `skincare,dapur,hijab`) untuk fokus niche.
3. GitHub Actions `Shopee Trending Harian` jalan otomatis 07:07 WIB (atau Run workflow manual). Snapshot di-commit ke `data/`.

Lokal:
```bash
SHOPEE_APP_ID=... SHOPEE_SECRET=... node shopee-trending/index.js
node shopee-trending/index.js --report   # laporan dari snapshot saja
node shopee-trending/test.js
```
Laporan lengkap (JSON) tersimpan di `data/latest-report.json`.

## Mode Bookmarklet (tanpa Open API)
1. n8n → Import `n8n/shopee-trending.workflow.json` → **Activate**. Salin Production URL webhook `Terima Halaman`.
2. `node shopee-trending/build-n8n.js <URL webhook>` → isi `shopee-trending/bookmarklet.txt` jadi URL bookmark.
3. Chrome → buat bookmark baru → Name `Shopee Trending`, URL = isi `bookmarklet.txt`.
4. Tiap hari: buka **Penawaran Produk** (urutkan terlaris/komisi), scroll biar produk termuat, klik bookmark → laporan masuk Telegram.

Snapshot disimpan di static data workflow (30 hari). Angka terjual di dasbor sering dibulatkan ("1RB+"), jadi tren produk kecil kurang presisi.
