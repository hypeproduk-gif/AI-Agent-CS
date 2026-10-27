// Halaman web admin AI Agent CS (disajikan oleh webhook n8n). Semua pengaturan disimpan
// ke Data Table "settings" (key = config). Upload gambar/file ke Data Table "media".

// Password admin TIDAK disimpan di kode: isi di Data Table "settings" baris key = admin_password.
function adminPassword(rows) {
  const r = (rows || []).find((x) => x && x.key === 'admin_password');
  return r && String(r.value || '').trim() ? String(r.value).trim() : null;
}

const MEDIA_TAGS = ['produk', 'flek', 'bekas_jerawat', 'jerawat', 'kusam', 'kering', 'penuaan', 'tekstur', 'cepat', 'file'];

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function loginPage(msg) {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin AI CS</title><style>body{font-family:system-ui,sans-serif;max-width:360px;margin:15vh auto;padding:0 16px}input,button{width:100%;padding:12px;margin-top:8px;font-size:16px;box-sizing:border-box}button{background:#16a34a;color:#fff;border:0;border-radius:8px}</style></head>
<body><h2>Admin AI CS</h2>${msg ? `<p style="color:#b91c1c">${esc(msg)}</p>` : ''}
<form method="get"><input type="password" name="key" placeholder="Password" autofocus><button>Masuk</button></form></body></html>`;
}

function adminPage(config, key) {
  const c = config || {};
  const pk = (c.packages && c.packages.SalGlow) || {};
  const json = JSON.stringify(c).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin AI CS</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--text:#111827;--muted:#6b7280;--line:#e5e7eb;--accent:#16a34a}
@media (prefers-color-scheme:dark){:root{--bg:#0b0f14;--card:#151b23;--text:#e5e7eb;--muted:#9ca3af;--line:#273040}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,sans-serif}
main{max-width:760px;margin:0 auto;padding:16px 16px 96px}
h1{font-size:22px;margin:8px 0 4px}p.sub{color:var(--muted);margin:0 0 16px}
section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:14px}
h2{font-size:16px;margin:0 0 10px}label{display:block;font-size:13px;color:var(--muted);margin:10px 0 4px}
input,select,textarea{width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text);font-size:15px;font-family:inherit}
textarea{min-height:84px}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:end}
.hint{font-size:12px;color:var(--muted);margin-top:4px}
.media{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:10px}
.m{border:1px solid var(--line);border-radius:8px;padding:6px;font-size:12px;word-break:break-all}
.m img{width:100%;height:110px;object-fit:cover;border-radius:6px}
.m button{margin-top:4px;width:100%;padding:6px;border:0;border-radius:6px;background:#fee2e2;color:#991b1b}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.tags label{display:flex;gap:4px;align-items:center;margin:0;color:var(--text)}
.tags input{width:auto}
.bar{position:fixed;left:0;right:0;bottom:0;background:var(--card);border-top:1px solid var(--line);padding:12px 16px;display:flex;gap:10px;justify-content:center}
.bar button{max-width:360px;width:100%;padding:13px;font-size:16px;border:0;border-radius:10px;background:var(--accent);color:#fff}
#status{position:fixed;top:12px;left:50%;transform:translateX(-50%);padding:8px 14px;border-radius:8px;background:#111827;color:#fff;display:none}
</style></head><body><main>
<h1>Pengaturan AI CS</h1><p class="sub">Ubah lalu klik <b>Simpan</b>. Perubahan langsung dipakai AI di chat berikutnya.</p>

<section><h2>Model AI</h2>
<label>Model</label><select id="model">
<option value="">Haiku 4.5 (paling hemat)</option>
<option value="claude-sonnet-5-5">Sonnet 5.5 (lebih pintar, ±2-4x biaya)</option>
<option value="claude-opus-5-5">Opus 5.5 (paling pintar, ±4-8x biaya)</option>
</select></section>

<section><h2>Gaya bahasa</h2>
<label>Arahan gaya tambahan</label><textarea id="tone_notes" placeholder="contoh: selalu sapa dengan nama, jangan pakai emoji, tawarkan paket 4 pcs dulu"></textarea>
<label>Nama toko di tanda tangan CS</label><input id="brand" placeholder="Filomall-Beauty"></section>

<section><h2>Produk SalGlow</h2>
<label>Info produk tambahan / terbaru</label><textarea id="product_info" placeholder="kandungan, manfaat, cara pakai, info promo khusus, dll"></textarea>
<div class="row"><div><label>Harga Beli 1 Gratis 1 (2 pcs)</label><input id="p_B1G1" inputmode="numeric" placeholder="139000"></div>
<div><label>Harga Beli 2 Gratis 2 (4 pcs)</label><input id="p_B2G2" inputmode="numeric" placeholder="219000"></div></div>
<label>Bonus saat ini</label><input id="bonus" placeholder="gratis sunscreen + eyeliner"></section>

<section><h2>Pembayaran</h2>
<label>Rekening transfer (teks yang dikirim ke pembeli)</label><textarea id="bank_text" placeholder="BCA 123... a.n ..."></textarea>
<div class="hint">Kosongkan untuk memakai rekening bawaan.</div></section>

<section><h2>Gambar & file</h2>
<div class="hint">Tag <b>produk</b> = foto produk yang dikirim AI kalau lead minta lihat produk. Tag lain = testimoni sesuai keluhan.</div>
<label>Upload (jpg/png/webp, atau pdf maks 2 MB)</label><input type="file" id="file" accept="image/*,application/pdf" multiple>
<div class="tags" id="newtags"></div>
<div class="media" id="media"></div></section>

<section><h2>Store Scalev</h2>
<div class="row"><div><label>Store ID (angka)</label><input id="store_id" inputmode="numeric" placeholder="99062"></div>
<div><label>Store unique ID</label><input id="store_uid" placeholder="store_..."></div></div>
<div class="hint">Kosongkan untuk memakai store bawaan. Isi kalau pindah store / akun Scalev (ID varian produk harus sama).</div></section>

<section><h2>Nomor diblokir</h2>
<label>Satu nomor per baris (tidak akan dibalas AI)</label><textarea id="blocked" placeholder="6282125784683"></textarea></section>
</main>
<div class="bar"><button id="save">Simpan</button></div><div id="status"></div>
<script>
const KEY = ${JSON.stringify(key)};
const TAGS = ${JSON.stringify(MEDIA_TAGS)};
let cfg = ${json};
cfg.media = cfg.media || [];
const $ = (id) => document.getElementById(id);
const pk = (cfg.packages && cfg.packages.SalGlow) || {};
$('model').value = cfg.model || '';
['tone_notes','brand','product_info','bonus','bank_text'].forEach((k) => { $(k).value = cfg[k] || ''; });
$('p_B1G1').value = (pk.B1G1 && pk.B1G1.price) || '';
$('p_B2G2').value = (pk.B2G2 && pk.B2G2.price) || '';
$('store_id').value = (cfg.store && cfg.store.storeId) || '';
$('store_uid').value = (cfg.store && cfg.store.storeUniqueId) || '';
$('blocked').value = (cfg.blocked || []).join('\\n');
$('newtags').innerHTML = TAGS.map((t) => '<label><input type="checkbox" value="' + t + '">' + t + '</label>').join('');
function toast(t) { const s = $('status'); s.textContent = t; s.style.display = 'block'; clearTimeout(toast.h); toast.h = setTimeout(() => { s.style.display = 'none'; }, 2500); }
function renderMedia() {
  $('media').innerHTML = cfg.media.map((m, i) => '<div class="m">' + (/\\.(jpe?g|png|webp)$/i.test(m.url) ? '<img src="' + m.url + '">' : '📄 ' + (m.name || 'file')) +
    '<div>' + (m.tags || []).join(', ') + '</div><button data-i="' + i + '">Hapus</button></div>').join('');
}
$('media').addEventListener('click', (e) => { const i = e.target.dataset.i; if (i !== undefined) { cfg.media.splice(Number(i), 1); renderMedia(); toast('Dihapus, klik Simpan'); } });
renderMedia();
function shrink(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) return reject(new Error('File lebih dari 2 MB'));
      const r = new FileReader(); r.onload = () => resolve({ mime: file.type, data: String(r.result).split(',')[1], ext: (file.name.split('.').pop() || 'bin').toLowerCase() }); r.onerror = reject; r.readAsDataURL(file); return;
    }
    const img = new Image(); img.onload = () => {
      const max = 1280; const s = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas'); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      resolve({ mime: 'image/jpeg', data: cv.toDataURL('image/jpeg', 0.82).split(',')[1], ext: 'jpg' });
    }; img.onerror = reject; img.src = URL.createObjectURL(file);
  });
}
$('file').addEventListener('change', async (e) => {
  const tags = [...document.querySelectorAll('#newtags input:checked')].map((x) => x.value);
  for (const f of e.target.files) {
    try {
      toast('Upload ' + f.name + '...');
      const s = await shrink(f);
      const res = await fetch(location.pathname.replace(/aics-admin$/, 'aics-admin-upload'), { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: KEY, name: f.name, mime: s.mime, ext: s.ext, data: s.data }) });
      const out = await res.json();
      if (!out.url) throw new Error(out.error || 'gagal');
      cfg.media.push({ url: out.url, name: f.name, tags: tags.length ? tags : ['produk'] });
      renderMedia();
    } catch (err) { toast('Gagal upload: ' + err.message); }
  }
  e.target.value = ''; toast('Upload selesai, klik Simpan');
});
$('save').addEventListener('click', async () => {
  const num = (v) => Number(String(v).replace(/\\D/g, '')) || undefined;
  cfg.model = $('model').value || undefined;
  ['tone_notes','brand','product_info','bonus','bank_text'].forEach((k) => { cfg[k] = $(k).value.trim() || undefined; });
  cfg.packages = { SalGlow: { B1G1: { price: num($('p_B1G1').value) }, B2G2: { price: num($('p_B2G2').value) } } };
  cfg.store = $('store_id').value && $('store_uid').value ? { storeId: num($('store_id').value), storeUniqueId: $('store_uid').value.trim() } : undefined;
  cfg.blocked = $('blocked').value.split(/\\s+/).map((x) => x.trim()).filter(Boolean);
  try {
    const res = await fetch(location.pathname.replace(/aics-admin$/, 'aics-admin-save'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, config: cfg }) });
    const out = await res.json(); toast(out.ok ? 'Tersimpan ✅' : 'Gagal: ' + (out.error || res.status));
  } catch (err) { toast('Gagal: ' + err.message); }
});
</script></body></html>`;
}
