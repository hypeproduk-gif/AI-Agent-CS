# AI Agent CS

Bot CS WhatsApp (Wablas → n8n → Claude Haiku 4.5) untuk SalGlow, KarierKit, dan KitJelangNikah.

## Struktur

- `n8n/src/` — kode Code node (prompt produk, susun konteks, olah balasan)
- `n8n/build.js` — gabungkan `src/` jadi `n8n/ai-agent-cs.workflow.json` siap import
- `n8n/lp-attribution.workflow.json` — webhook penerima atribusi dari LP
- `lp/wa-redirect.js` — script LP: capture fbclid/_fbc/_fbp + UTM, buat kode ref, buka wa.me
- `lp/index.html` — contoh LP
- `lp/scalev-embed.html` — script siap tempel ke Custom HTML landing page Scalev
- `n8n/rekap-harian.workflow.json` — rekap harian Telegram 23:55 WIB
- `n8n/scalev-setup.workflow.json` — jalankan manual sekali untuk melihat ID store & varian Scalev
- `n8n/src/order-config.js` — konfigurasi Scalev (store, varian, berat, fee COD)
- `n8n/test/run.js` — tes logika + simulasi workflow penuh dengan HTTP tiruan

```bash
node n8n/test/run.js   # tes + build ulang workflow
```

## Setup di n8n

1. Buat 3 credential **Header Auth**:
   - `Anthropic API` → Name `x-api-key`, Value = API key Anthropic
   - `Wablas` → Name `Authorization`, Value = token Wablas
   - `Scalev` → Name `Authorization`, Value = `Bearer sk_...` (Scalev → Settings → Developers → API Keys)
   - `Scalev Storefront` → Name `X-Scalev-Storefront-Api-Key`, Value = `sfpk_...` (untuk Purchase CAPI)
2. Tambah kolom `handoff`, `ref`, `last_order_id`, `last_order_at`, `first_chat_at`, `last_chat_at` (string)
   di `leads_context`. Buat Data Table `aics_orders` (order_id, phone, paket, method, price, total, ref, created_at). di Data Table `leads_context`.
   Buat Data Table `lp_attribution` dengan kolom: ref, product, fbclid, fbc, fbp, utm_source,
   utm_medium, utm_campaign, utm_content, utm_term, landing_url, referrer, user_agent, client_ip, clicked_at.
3. Import `n8n/ai-agent-cs.workflow.json`, pilih credential di node **Claude** dan **Kirim WhatsApp**, cek credential Telegram.
3a. Import `n8n/scalev-setup.workflow.json`, pilih credential Scalev, klik Execute. Salin `store_id`,
    `store_unique_id`, `variant_id`, `variant_unique_id` SalGlow B1G1/B2G2 ke `n8n/src/order-config.js`
    (plus berat paket), lalu `node n8n/test/run.js` untuk build ulang, dan import ulang workflow utama.
    Pilih credential Scalev di node Scalev Lokasi/Gudang/Kurir/Buat Order.
4. Import `n8n/lp-attribution.workflow.json`, pilih tabel `lp_attribution`, aktifkan.
5. Nonaktifkan workflow lama, aktifkan v2 (path webhook sama).

Jangan pernah commit API key. Simpan hanya di n8n Credentials.

## Riset Produk Mingguan (Shopee × TikTok × Meta Ad Library)

`n8n/product-research.workflow.json` jalan tiap Senin 07:00 WIB: ambil data per keyword lewat Apify,
beri skor potensi convert di Meta (0–100), kirim top 10 ke Telegram.

Skor = permintaan Shopee (terjual/bln) + tren TikTok + bukti iklan Meta yang aktif ≥30 hari
+ harga pas (Rp79–249rb) + pasar tidak dikuasai 1–2 toko − penalti kalau advertiser terlalu padat.

1. Daftar di apify.com, ambil API token. Buat credential **Header Auth** `Apify` →
   Name `Authorization`, Value `Bearer apify_api_...`.
2. Pilih actor Shopee (shopee.co.id) & TikTok Creative Center Top Products di Apify Store, isi ID-nya
   di `ACTORS` (`n8n/build-research.js`) dan sesuaikan `input`-nya dengan schema actor tersebut.
3. Ubah keyword/ambang di `RESEARCH` (`n8n/src/product-research.js`), lalu
   `node n8n/test/research.js` (tes + build ulang).
4. Import workflow, pilih credential Apify di node **Apify Run**, klik **Tes Sekarang**, lalu aktifkan.

Kenapa Apify: API resmi Shopee/TikTok Shop hanya untuk data toko sendiri, dan Ad Library API resmi Meta
hanya memuat iklan politik untuk Indonesia, jadi iklan komersial perlu scraper.

## Ad Library → LP & Konten

`n8n/ad-to-lp.workflow.json`: isi form (keyword, produk, harga, nomor WA, kode ref) → ambil ±100 iklan aktif
di Meta Ad Library (Apify) → pilih iklan pesaing yang paling lama jalan (≥30 hari, digabung per variasi)
→ Claude membedah angle-nya dan menulis LP + 5 naskah iklan + ide gambar → Telegram menerima file
`lp-<kode>.html` dan naskah iklannya.

1. Pakai credential `Apify` dan `Anthropic API` yang sama dengan workflow riset.
   Pemicu lain tanpa form: ketik `/riset pengusir tikus` (opsional `| harga | kode`) di grup Telegram "RISET PRODUK".
2. Import, aktifkan, buka URL **Brief Produk** (Form) lalu isi.
3. Edit LP: ganti `PIXEL_ID`, placeholder foto/testimoni ([ISI TESTIMONI ASLI]); upload bersama
   `lp/wa-redirect.js` (atau tempel ke Custom HTML Scalev). Kode ref di form jadi `window.AICS.product`,
   jadi chat dari LP ini otomatis tercatat atribusinya.
4. Tambahkan kode ref baru ke deteksi produk bot CS kalau produknya baru.

Claude diberi aturan: tidak menyalin copy pesaing, patuh kebijakan iklan Meta, dan tidak mengarang testimoni/angka terjual.
