// Pengaturan dari web app admin (Data Table "settings", baris key = "config", value = JSON).
// Dimuat di awal tiap Code node; kalau kosong semua default di kode tetap dipakai.

let SETTINGS = {};

function loadSettings(rows) {
  const row = (rows || []).find((r) => r && r.key === 'config');
  try { SETTINGS = row && row.value ? JSON.parse(row.value) : {}; } catch (e) { SETTINGS = {}; }
  const s = SETTINGS;
  if (typeof PACKAGES !== 'undefined' && s.packages) {
    for (const [product, list] of Object.entries(s.packages)) {
      for (const [code, v] of Object.entries(list || {})) {
        const pkg = PACKAGES[product] && PACKAGES[product][code];
        if (pkg && v && Number(v.price) > 0) pkg.price = Number(v.price);
      }
    }
  }
  if (typeof BRANDS !== 'undefined' && s.brand) BRANDS.SalGlow = s.brand;
  if (typeof BLOCKED_PHONES !== 'undefined' && Array.isArray(s.blocked)) {
    s.blocked.map((p) => String(p).replace(/\D/g, '').replace(/^0/, '62')).filter(Boolean)
      .forEach((p) => { if (!BLOCKED_PHONES.includes(p)) BLOCKED_PHONES.push(p); });
  }
  if (typeof FACTS !== 'undefined' && Array.isArray(s.media)) {
    s.media.filter((m) => m && m.url && /\.(jpe?g|png|webp)$/i.test(m.url)).forEach((m) => {
      const f = FACTS[m.product || 'SalGlow'];
      if (f && !f.testimonials.some((t) => t.url === m.url)) f.testimonials.push({ url: m.url, tags: m.tags || [] });
    });
  }
  if (typeof SCALEV !== 'undefined' && s.store && s.store.storeId && s.store.storeUniqueId) {
    SCALEV.storeId = Number(s.store.storeId);
    SCALEV.storeUniqueId = s.store.storeUniqueId;
  }
  return s;
}

// Tambahan system prompt dari pengaturan (lebih prioritas dari teks bawaan).
function settingsPrompt() {
  const s = SETTINGS;
  const parts = [];
  if (s.product_info) parts.push(`INFO PRODUK DARI ADMIN (prioritas): ${s.product_info}`);
  if (s.bonus) parts.push(`BONUS SAAT INI: ${s.bonus}.`);
  if (s.packages && s.packages.SalGlow) {
    const p = s.packages.SalGlow;
    const txt = Object.entries(p).filter(([, v]) => v && v.price).map(([k, v]) => `${k} = Rp${Number(v.price).toLocaleString('id-ID')}`).join(', ');
    if (txt) parts.push(`HARGA TERBARU (pakai ini, abaikan harga lain): ${txt}.`);
  }
  if (s.bank_text) parts.push(`REKENING TRANSFER TERBARU (pakai persis ini, abaikan rekening lain): ${s.bank_text}`);
  if (s.tone_notes) parts.push(`ARAHAN GAYA DARI ADMIN: ${s.tone_notes}`);
  return parts.length ? ' PENGATURAN ADMIN: ' + parts.join(' ') : '';
}

function activeModel() {
  return SETTINGS.model || DEFAULT_MODEL;
}

// Model default: Haiku 5.5 (murah). Haiku 4.5 boleh tool_choice "any"; model baru menolaknya.
const DEFAULT_MODEL = 'claude-haiku-5-5';

function canForceTool(model) {
  return /haiku-4-5/.test(model);
}

function modelParams(model) {
  if (/haiku-4-5/.test(model)) return { max_tokens: 500 };
  // Haiku 5.5: thinking dimatikan (hemat, chat singkat). Sonnet/Opus 5.5: thinking tidak bisa dimatikan, effort rendah.
  if (/haiku-5/.test(model)) return { max_tokens: 1000, thinking: { type: 'disabled' }, output_config: { effort: 'low' } };
  return { max_tokens: 4000, output_config: { effort: 'low' } };
}

// Prompt caching: bagian system yang sama untuk semua lead di-cache; bagian per-lead di blok kedua.
function systemBlocks(staticText, dynamicText) {
  const blocks = [{ type: 'text', text: staticText, cache_control: { type: 'ephemeral' } }];
  if (dynamicText && dynamicText.trim()) blocks.push({ type: 'text', text: dynamicText.trim() });
  return blocks;
}
