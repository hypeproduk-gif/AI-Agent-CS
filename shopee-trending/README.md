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
