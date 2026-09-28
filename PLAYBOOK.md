# AI Agent CS — Playbook (acuan untuk produk baru)

Semua kemampuan hasil pilot **SalGlow** berlaku otomatis untuk produk lain. Aturan umum ada di kode bersama, dan yang berbeda per produk hanya datanya.

## Kemampuan yang otomatis berlaku untuk semua produk
- **Gaya bahasa** (`STYLE_RULES`): CS manusia yang santai tapi pinter. Kadang pakai vokal dobel dan "..", emoji 0–2, beri baris kosong tiap maksimal 3 baris, pilihan pakai penomoran, tidak lebay, tidak pernah mengaku bot, jawab "saya tanyakan ke atasan saya dulu".
- **Alur jualan** (`SALES_RULES`): jawab atau counter keberatan dulu, tawarkan paket hanya saat ada sinyal beli, tanya promo langsung dijawab harga + bonus, setelah paket dipilih langsung minta data, biaya COD tidak disebut sebelum ditanya.
- **Handoff** (`HANDOFF_RULE`): `[INFO_ADMIN]` untuk data yang tidak dimiliki (bot tetap jualan), `[HANDOFF]` untuk kasus medis, komplain, atau nego (bot dijeda 30 menit).
- **Order fisik** (`ORDER_RULE` + `scalev.js`):
  - Format isian data dan tebak kecamatan/kode pos dari kelurahan.
  - Cek ongkir wajib lewat tool, ringkasan wajib sebelum order, revisi cukup konfirmasi bagian yang berubah.
  - Template setelah order untuk COD dan transfer (rekening).
- **Pengaman order**:
  - Order ditolak kalau belum ada ringkasan, atau kalau total di ringkasan beda dengan hitungan sistem.
  - Setelah lead bilang "ok", bot dipaksa memanggil tool.
  - Klaim "order sudah masuk" tanpa order sungguhan diblokir.
  - Dalam 6 jam: kata "ganti/ubah" dianggap revisi, selain itu lead ditanya dulu "ganti atau order baru?".
  - Total COD dibulatkan ke atas ke kelipatan Rp500 supaya sama dengan nilai COD di Mengantar.
- **Scalev**:
  - Lead baru langsung jadi order draft (nama + nomor WA), lalu dilengkapi dengan PATCH.
  - Revisi memakai order yang sama.
  - Status: COD = confirmed, transfer = pending.
  - Notes berisi isi paket + metode + nominal.
- **Testimoni**: token `[TESTIMONI:topik]`, 3 foto yang sesuai keluhan lead.
- **Follow-up**: 1j, 3j, 6j, 12j, 24j, 36j. Isinya menyesuaikan kendala lead (kalau lead diam, kirim 3–4 benefit). Tidak kirim FU jam 21–07.
- **Atribusi & Meta**: kode `#promo` dari LP. Purchase dikirim langsung ke Meta CAPI (data di-hash), hanya untuk COD.
- **Laporan**:
  - Notif Telegram per order.
  - Laporan singkat jam 9, 13, dan 18 (lead, closing, pending + alasan).
  - Rekap 23:55.
  - Batch resi jam 12:00 dan 00:00.

## Data yang perlu disiapkan untuk produk baru
1. **`PRODUCTS[<Produk>]`** di `n8n/src/prompts.js`: deskripsi, kandungan dan manfaat, harga paket, bonus, masalah umum lead, dan counter keberatan.
2. **`PRODUCT_PATTERNS`** di `n8n/src/prepare-context.js`: kata kunci untuk mendeteksi produk. Kalau pakai kode LP, isi juga `REF_PRODUCTS`.
3. **`FACTS[<Produk>]`** di `n8n/src/product-facts.js`: status BPOM (jujur), kesan pemakaian, bukti sosial, dan testimoni (URL + tag).
4. **`PACKAGES[<Produk>]`** di `n8n/src/order-config.js` (khusus produk fisik): label, pcs, harga, berat, dan ID varian dari workflow **Scalev Setup**.
5. **`BRANDS[<Produk>]`** di `n8n/src/order-config.js`: nama toko untuk tanda tangan "CS …".
6. **Contoh nada** (opsional): contoh jawaban dari pemilik, format seperti `TONE_EXAMPLES`.

Setelah itu jalankan `node n8n/build.js` dan `node n8n/test/run.js`, lalu tempel `n8n/ai-agent-cs.workflow.json` ke n8n dan Publish.
