# AI Agent CS

Bot CS WhatsApp (Wablas → n8n → Claude Haiku 4.5) untuk SalGlow, KarierKit, dan KitJelangNikah.

## Struktur

- `n8n/src/` — kode Code node (prompt produk, susun konteks, olah balasan)
- `n8n/build.js` — gabungkan `src/` jadi `n8n/ai-agent-cs.workflow.json` siap import
- `n8n/lp-attribution.workflow.json` — webhook penerima atribusi dari LP
- `lp/wa-redirect.js` — script LP: capture fbclid/_fbc/_fbp + UTM, buat kode ref, buka wa.me
- `lp/index.html` — contoh LP
- `n8n/test/run.js` — tes logika

```bash
node n8n/test/run.js   # tes + build ulang workflow
```

## Setup di n8n

1. Buat 2 credential **Header Auth**:
   - `Anthropic API` → Name `x-api-key`, Value = API key Anthropic
   - `Wablas` → Name `Authorization`, Value = token Wablas
2. Tambah kolom `handoff` dan `ref` (string) di Data Table `leads_context`.
   Buat Data Table `lp_attribution` dengan kolom: ref, product, fbclid, fbc, fbp, utm_source,
   utm_medium, utm_campaign, utm_content, utm_term, landing_url, referrer, user_agent, client_ip, clicked_at.
3. Import `n8n/ai-agent-cs.workflow.json`, pilih credential di node **Claude** dan **Kirim WhatsApp**, cek credential Telegram.
4. Import `n8n/lp-attribution.workflow.json`, pilih tabel `lp_attribution`, aktifkan.
5. Nonaktifkan workflow lama, aktifkan v2 (path webhook sama).

Jangan pernah commit API key. Simpan hanya di n8n Credentials.
