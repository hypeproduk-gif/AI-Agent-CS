// Memori data pelanggan (nama, alamat, dll) supaya bot tidak menanyakan ulang. Berlaku 30 hari.

const MEMORY_DAYS = 30;
const PROFILE_FIELDS = ['nama', 'alamat', 'patokan', 'kelurahan', 'kecamatan', 'kota', 'kode_pos', 'pembayaran', 'paket'];

function parseProfile(raw) {
  try { const p = JSON.parse(raw || '{}'); return p && typeof p === 'object' ? p : {}; } catch (e) { return {}; }
}

function isFresh(iso, now = Date.now()) {
  const t = Date.parse(iso);
  return !Number.isNaN(t) && now - t < MEMORY_DAYS * 86400000;
}

// Gabungkan data dari input tool (cek_ongkir/buat_order) ke profil lama.
function mergeProfile(profile, input, now = Date.now()) {
  const out = { ...(profile || {}) };
  let changed = false;
  PROFILE_FIELDS.forEach((k) => {
    const v = input && input[k];
    if (v !== undefined && v !== null && String(v).trim() && out[k] !== v) { out[k] = String(v).trim(); changed = true; }
  });
  if (changed) out.updated_at = new Date(now).toISOString();
  return out;
}

function profilePrompt(profile) {
  const known = PROFILE_FIELDS.filter((k) => profile && profile[k]).map((k) => `${k}: ${profile[k]}`);
  if (!known.length) return '';
  return ` DATA PELANGGAN TERSIMPAN (dari chat sebelumnya): ${known.join('; ')}. PAKAI data ini, JANGAN menanyakan ulang. Saat lead mau order lagi, cukup konfirmasi singkat 'Dikirim ke alamat yang sama ya kak?' dan tanyakan hanya data yang belum ada atau yang berubah.`;
}
