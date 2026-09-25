// Ad Library → LP & konten: pilih iklan pesaing yang paling lama jalan (winner),
// minta Claude membedah angle-nya, lalu render LP WhatsApp + naskah iklan.
// Butuh normAd/toTime dari product-research.js (digabung saat build).

const LP_MODEL = 'claude-sonnet-5';
const PROVEN_DAYS = 30;
const WINNER_LIMIT = 8;
const LIST_LIMIT = 15;

// Nama produk & URL LP pesaing dari snapshot iklan.
function adProduct(it) {
  const s = it.snapshot || {};
  const card = (s.cards || [])[0] || {};
  const name = s.title || card.title || s.link_description || card.link_description || it.ad_creative_link_title || '';
  return String(name).split(' | ')[0].replace(/\{\{.*?\}\}/g, '').trim().slice(0, 100);
}

function adLandingUrl(it) {
  const s = it.snapshot || {};
  const card = (s.cards || []).find((c) => c.link_url) || {};
  return s.link_url || card.link_url || it.link_url || '';
}

function adBody(it) {
  const s = it.snapshot || {};
  const cards = (s.cards || []).map((c) => c.body || c.title || '').filter(Boolean);
  const body = (s.body && (s.body.text || s.body)) || it.ad_creative_body || it.body || cards[0] || '';
  return String(typeof body === 'string' ? body : '').trim();
}

// items: output actor Ad Library. Satu "creative" bisa punya banyak duplikat → gabung per page+teks.
// Tebakan tujuan/optimasi iklan. Ad Library TIDAK membuka objective/optimasi asli,
// jadi disimpulkan dari tombol CTA, link tujuan, dan format iklan.
function adGoal(it) {
  const s = it.snapshot || {};
  const cta = String(s.cta_type || s.ctaType || it.cta_type || '').toUpperCase();
  const link = String(adLandingUrl(it)).toLowerCase();
  const fmt = String(s.display_format || s.displayFormat || '').toUpperCase();
  if (/WHATSAPP/.test(cta) || /wa\.me|api\.whatsapp|whatsapp\.com/.test(link)) return 'Pesan WhatsApp (optimasi percakapan)';
  if (/MESSAGE_PAGE|MESSENGER/.test(cta) || /m\.me\//.test(link)) return 'Pesan Messenger (optimasi percakapan)';
  if (/INSTAGRAM_MESSAGE/.test(cta) || /ig\.me\//.test(link)) return 'DM Instagram (optimasi percakapan)';
  if (fmt === 'DPA' || (fmt === 'DCO' && /SHOP_NOW/.test(cta))) return 'Katalog (Advantage+ penjualan katalog)';
  if (/SIGN_UP|APPLY_NOW|GET_QUOTE|SUBSCRIBE/.test(cta) && (!link || /facebook\.com|fb\.com/.test(link))) return 'Formulir prospek (optimasi leads)';
  if (/INSTALL|PLAY_GAME|USE_APP/.test(cta)) return 'Install aplikasi';
  if (/shopee|tokopedia|tiktok\.com|lazada/.test(link)) return 'Marketplace (kemungkinan traffic/penjualan marketplace)';
  if (/SHOP_NOW|ORDER_NOW|BUY_NOW|GET_OFFER/.test(cta)) return 'Website (kemungkinan optimasi penjualan/purchase)';
  if (link) return 'Website (' + (cta ? cta.toLowerCase().replace(/_/g, ' ') : 'traffic/penjualan') + ')';
  return cta ? cta.toLowerCase().replace(/_/g, ' ') : '-';
}

const RISING_DAYS = 7;
const RISING_MIN_NEW = 3;

// Pemenang baru: produk yang iklannya belum 30 hari tapi advertiser menambah banyak iklan dalam 7 hari terakhir.
function pickRising(items, now = Date.now(), limit = 8) {
  const groups = new Map();
  for (const it of items || []) {
    const ad = normAd(it);
    if (!Number.isFinite(ad.start) || !ad.active) continue;
    const product = adProduct(it);
    const key = (ad.page + '|' + (product || adBody(it).slice(0, 60))).toLowerCase();
    const age = (now - ad.start) / 864e5;
    const g = groups.get(key) || { page: ad.page, product, url: ad.url, lpUrl: '', goal: '', ads: 0, fresh: 0, oldest: 0, variants: 0 };
    g.ads += 1;
    g.variants += Number(it.collation_count || it.collationCount || 1);
    if (age <= RISING_DAYS) g.fresh += 1;
    if (age > g.oldest) { g.oldest = age; g.url = ad.url; }
    g.lpUrl = g.lpUrl || adLandingUrl(it);
    g.goal = g.goal || adGoal(it);
    groups.set(key, g);
  }
  return [...groups.values()]
    .filter((g) => g.oldest < PROVEN_DAYS && (g.fresh >= RISING_MIN_NEW || g.variants >= 5))
    .map((g) => ({ ...g, oldest: Math.round(g.oldest) }))
    .sort((a, b) => b.fresh - a.fresh || b.variants - a.variants)
    .slice(0, limit);
}

function pickWinners(items, now = Date.now(), limit = WINNER_LIMIT) {
  const groups = new Map();
  for (const it of items || []) {
    const ad = normAd(it);
    const body = adBody(it) || adProduct(it);
    if (!body || !Number.isFinite(ad.start)) continue;
    const key = ad.page + '|' + body.slice(0, 120).toLowerCase();
    const days = ((Number.isFinite(ad.stop) ? ad.stop : now) - ad.start) / 864e5;
    const variants = Number(it.collation_count || it.collationCount || 1);
    const g = groups.get(key);
    if (!g) groups.set(key, { page: ad.page, body, title: ad.title, url: ad.url, days, variants, product: adProduct(it), lpUrl: adLandingUrl(it), goal: adGoal(it) });
    else {
      g.days = Math.max(g.days, days); g.variants += variants;
      g.product = g.product || adProduct(it); g.lpUrl = g.lpUrl || adLandingUrl(it);
    }
  }
  const all = [...groups.values()].map((g) => ({ ...g, days: Math.round(g.days) }));
  const proven = all.filter((g) => g.days >= PROVEN_DAYS);
  const pool = proven.length ? proven : all;
  return {
    proven: proven.length,
    winners: pool.sort((a, b) => b.days - a.days || b.variants - a.variants).slice(0, limit),
    rising: pickRising(items, now),
  };
}

const LP_SYSTEM = `Kamu direct-response copywriter untuk iklan Meta di Indonesia (jualan COD via WhatsApp).
Tugas: bedah iklan pesaing yang sudah lama jalan (tanda profit), lalu buat LP dan naskah iklan BARU yang lebih kuat.
Aturan:
- Jangan menyalin kalimat pesaing; ambil pola angle, masalah, dan penawarannya saja.
- Patuh kebijakan iklan Meta: tanpa klaim medis/penyembuhan, tanpa before-after tubuh, tanpa menyindir kekurangan fisik pembaca ("kamu gendut?"), tanpa janji hasil pasti.
- Jangan mengarang testimoni, jumlah terjual, rating, atau sertifikasi. Kalau perlu bukti sosial, tulis placeholder [ISI TESTIMONI ASLI].
- Bahasa santai, kalimat pendek, cocok dibaca di HP.
- Balas HANYA JSON valid sesuai skema, tanpa teks lain.`;

const LP_SCHEMA = `{
  "product": "nama produk singkat",
  "angle": "angle utama dalam 1 kalimat",
  "insights": ["pola yang bikin iklan pesaing bertahan (3-5 poin)"],
  "lp": {
    "headline": "", "subheadline": "",
    "problems": ["3 masalah yang dirasakan target"],
    "solution": "1 paragraf pendek",
    "benefits": ["5 manfaat konkret"],
    "how_to_use": ["3 langkah"],
    "offer": { "title": "", "price_text": "", "bonus": "" },
    "faq": [{ "q": "", "a": "" }],
    "cta": "teks tombol", "urgency": "1 kalimat"
  },
  "ads": [{ "angle": "", "hook": "3 detik pertama", "script": "naskah video 20-30 detik per adegan", "visual": "arahan shot", "primary_text": "", "headline": "" }],
  "image_prompts": ["3 ide foto/gambar iklan statis"]
}`;

// brief: { keyword, product, price, wa, code }
function lpRequest(brief, picked) {
  const ads = picked.winners.map((w, i) =>
    `#${i + 1} ${w.page} — jalan ${w.days} hari, ${w.variants} variasi\n${w.title ? 'Judul: ' + w.title + '\n' : ''}${w.body.slice(0, 1200)}`,
  ).join('\n\n');
  const user = `Keyword: ${brief.keyword}
Produk saya: ${brief.product || '(sama dengan produk di iklan pesaing)'}
Harga jual saya: ${brief.price || '(tentukan saran harga)'}
${picked.proven ? `${picked.proven} iklan sudah jalan ≥${PROVEN_DAYS} hari.` : 'Belum ada iklan ≥30 hari; ini iklan yang paling lama.'}

Iklan pesaing:
${ads}

Buat 5 naskah iklan dengan angle berbeda. Skema JSON:
${LP_SCHEMA}`;
  return { model: LP_MODEL, max_tokens: 8000, system: LP_SYSTEM, messages: [{ role: 'user', content: user }] };
}

function parseLpReply(res) {
  const text = ((res && res.content) || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('Claude tidak membalas JSON: ' + text.slice(0, 200));
  return JSON.parse(m[0]);
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const list = (arr, tag = 'li') => (arr || []).map((x) => `<${tag}>${esc(x)}</${tag}>`).join('');

function renderLp(copy, brief) {
  const lp = copy.lp || {};
  const offer = lp.offer || {};
  const wa = String(brief.wa || '').replace(/\D/g, '').replace(/^0/, '62');
  const waText = encodeURIComponent(`Halo kak, mau pesan ${copy.product || brief.keyword}`);
  const cta = `<a class="cta" href="https://wa.me/${wa}?text=${waText}">${esc(lp.cta || 'Pesan via WhatsApp')}</a>`;
  const faq = (lp.faq || []).map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(copy.product || brief.keyword)}</title>
<!-- Meta Pixel: ganti PIXEL_ID -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','PIXEL_ID');fbq('track','PageView');
</script>
<style>
:root{--ink:#1a1a1a;--muted:#555;--bg:#fff;--soft:#f5f5f0;--accent:#e4572e;--wa:#25d366}
*{box-sizing:border-box}body{margin:0;font:16px/1.55 system-ui,-apple-system,sans-serif;color:var(--ink);background:var(--bg)}
main{max-width:480px;margin:0 auto;padding:0 16px 96px}
section{padding:28px 0;border-bottom:1px solid #eee}
h1{font-size:28px;line-height:1.2;margin:28px 0 8px}h2{font-size:21px;margin:0 0 12px}
.sub{color:var(--muted);font-size:17px}.img{background:var(--soft);border-radius:12px;aspect-ratio:1;display:grid;place-items:center;color:#999;margin:16px 0;text-align:center;padding:16px}
ul{padding-left:20px}li{margin:6px 0}.benefits li::marker{content:"✓  ";color:var(--wa)}
.offer{background:var(--soft);border-radius:12px;padding:20px;text-align:center}.price{font-size:26px;font-weight:700;color:var(--accent)}
.urgency{color:var(--accent);font-weight:600}
details{border:1px solid #eee;border-radius:8px;padding:12px;margin:8px 0}summary{font-weight:600;cursor:pointer}
.cta{display:block;text-align:center;background:var(--wa);color:#fff;padding:16px;border-radius:12px;font-weight:700;text-decoration:none;font-size:18px}
.sticky{position:fixed;left:0;right:0;bottom:0;padding:12px 16px;background:rgba(255,255,255,.95);box-shadow:0 -2px 12px rgba(0,0,0,.08)}
.sticky .cta{max-width:448px;margin:0 auto}
</style>
</head>
<body>
<main>
<section>
<h1>${esc(lp.headline)}</h1>
<p class="sub">${esc(lp.subheadline)}</p>
<div class="img">[FOTO/VIDEO PRODUK DIPAKAI]</div>
${cta}
</section>
<section><h2>Pernah ngalamin ini?</h2><ul>${list(lp.problems)}</ul></section>
<section><h2>Solusinya</h2><p>${esc(lp.solution)}</p><div class="img">[FOTO DEMO / HASIL]</div></section>
<section><h2>Kenapa pilih ini</h2><ul class="benefits">${list(lp.benefits)}</ul></section>
<section><h2>Cara pakai</h2><ol>${list(lp.how_to_use)}</ol></section>
<section><h2>Kata pembeli</h2><div class="img">[ISI TESTIMONI ASLI — screenshot chat/ulasan]</div></section>
<section class="offer-wrap">
<div class="offer">
<h2>${esc(offer.title)}</h2>
<div class="price">${esc(offer.price_text || brief.price)}</div>
${offer.bonus ? `<p>${esc(offer.bonus)}</p>` : ''}
<p>Bisa COD — bayar di rumah</p>
<p class="urgency">${esc(lp.urgency)}</p>
${cta}
</div>
</section>
<section><h2>Pertanyaan</h2>${faq}</section>
</main>
<div class="sticky">${cta}</div>
<script>window.AICS = { product: '${esc(brief.code || 'LP')}' };</script>
<script src="wa-redirect.js"></script>
</body>
</html>
`;
}

function contentReport(copy, brief, picked) {
  const L = [`🎯 ${copy.product || brief.keyword} — angle: ${copy.angle || '-'}`, ''];
  L.push(`Iklan pesaing: ${picked.winners.length} dibedah, ${picked.proven} jalan ≥${PROVEN_DAYS} hari`);
  for (const w of picked.winners.slice(0, 3)) L.push(`• ${w.page} (${w.days} hari) ${w.url}`);
  L.push('', 'Kenapa mereka bertahan:');
  for (const s of copy.insights || []) L.push('• ' + s);
  (copy.ads || []).forEach((a, i) => {
    L.push('', `— IKLAN ${i + 1}: ${a.angle}`, `Hook: ${a.hook}`, `Naskah: ${a.script}`, `Visual: ${a.visual}`,
      `Primary text: ${a.primary_text}`, `Headline: ${a.headline}`);
  });
  if ((copy.image_prompts || []).length) {
    L.push('', 'Ide gambar statis:');
    for (const p of copy.image_prompts) L.push('• ' + p);
  }
  return L.join('\n');
}

// Telegram maksimal 4096 karakter per pesan.
function chunkText(text, size = 3900) {
  const out = [];
  let buf = '';
  for (const line of text.split('\n')) {
    if ((buf + '\n' + line).length > size && buf) { out.push(buf); buf = ''; }
    buf = buf ? buf + '\n' + line : line.slice(0, size);
  }
  if (buf) out.push(buf);
  return out;
}

// Perintah Telegram: "/riset pengusir tikus | Rp99.000 3 pcs | PT"
// (harga & kode opsional). Balikan null kalau bukan perintah riset.
const DEFAULT_WA = '6285180108370';
const DEFAULT_LIMIT = 50;
const ALLOWED_CHATS = ['-5440720207']; // grup RISET PRODUK; hanya grup ini yang boleh memicu (biaya Apify/Claude)

function parseRisetCommand(text) {
  const m = String(text || '').trim().match(/^\/?riset(?:@\w+)?\s+(.+)$/i);
  if (!m) return null;
  const parts = m[1].split('|').map((s) => s.trim());
  const keyword = parts.shift();
  if (!keyword) return null;
  // Angka = jumlah iklan yang diambil (biaya Apify per iklan). Default 50, batas 10–200.
  const n = parts.find((p) => /^\d+$/.test(p));
  const limit = n ? Math.min(200, Math.max(10, Number(n))) : DEFAULT_LIMIT;
  const [price = '', code = ''] = parts.filter((p) => p !== n);
  const auto = keyword.split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 4);
  return { keyword, product: '', price, wa: DEFAULT_WA, code: (code || auto).toUpperCase(), limit };
}

// Daftar iklan winning untuk Telegram (tanpa Claude).
function winnerList(picked, brief) {
  const L = [`🏆 Iklan winning "${brief.keyword}" — ${picked.proven} iklan jalan ≥${PROVEN_DAYS} hari` +
    (picked.proven ? '' : ' (belum ada; ini yang paling lama)'), ''];
  picked.winners.forEach((w, i) => {
    L.push(`${i + 1}. ${w.product || '(nama produk tidak ada di iklan)'}`);
    L.push(`   ${w.page} · ${w.days} hari · ${w.variants} variasi`);
    L.push(`   Tujuan: ${w.goal || '-'}`);
    L.push(`   Iklan: ${w.url}`);
    L.push(`   LP: ${w.lpUrl || '-'}`);
    L.push('');
  });
  const rising = picked.rising || [];
  if (rising.length) {
    L.push(`🚀 Pemenang baru (belum ${PROVEN_DAYS} hari, iklan terus ditambah):`, '');
    rising.forEach((r, i) => {
      L.push(`${i + 1}. ${r.product || '(nama produk tidak ada di iklan)'}`);
      L.push(`   ${r.page} · ${r.ads} iklan aktif, ${r.fresh} baru dalam ${RISING_DAYS} hari · tertua ${r.oldest} hari`);
      L.push(`   Tujuan: ${r.goal || '-'}`);
      L.push(`   Iklan: ${r.url}`);
      L.push(`   LP: ${r.lpUrl || '-'}`);
      L.push('');
    });
  }
  const names = [...new Set([...picked.winners, ...rising].map((w) => w.product).filter(Boolean))];
  if (names.length) {
    L.push('📦 Produk:');
    for (const n of names) L.push('• ' + n);
  }
  return L.join('\n').trim();
}

// URL Ad Library untuk brief: keyword biasa, atau semua iklan satu halaman
// ("page 535195099685688", ID angka saja, atau link facebook.com/<halaman>).
function adLibraryUrl(brief, country = 'ID') {
  const base = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}`;
  const kw = String(brief.keyword || '').trim();
  const id = (kw.match(/^(?:page[:\s]+)?(\d{6,})$/i) || kw.match(/view_all_page_id=(\d+)/) || [])[1];
  if (id) return { url: `${base}&view_all_page_id=${id}&search_type=page`, mode: 'page' };
  if (/^https?:\/\/(www\.|m\.)?facebook\.com\//i.test(kw)) return { url: kw, mode: 'page' };
  return { url: `${base}&q=${encodeURIComponent(kw)}&search_type=keyword_unordered`, mode: 'keyword' };
}
