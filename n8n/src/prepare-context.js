// Susun konteks untuk Claude dari payload webhook Wablas + baris leads_context.
// Mengembalikan null kalau bot harus diam (lead sedang ditangani manusia).

const MAX_HISTORY = 20;
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 500;
const HANDOFF_PAUSE_MINUTES = 30; // setelah ini bot aktif lagi otomatis

const PRODUCT_PATTERNS = [
  ['KitJelangNikah', /\b(nikah|menikah|pernikahan|wedding|kit jelang nikah|kitjelangnikah)\b/i],
  ['KarierKit', /\b(cv|karier|karir|lamaran kerja|ats|karierkit)\b/i],
  ['SalGlow', /\b(salglow|salep|glowing|flek|bekas jerawat|filo)\b/i],
];

// Kode ref dari landing page, contoh "KJN-7Q2MX". Prefix menentukan produk.
const REF_PATTERN = /\b(SG|KK|KJN)-([A-Z0-9]{5})\b/;
// Format LP terbaru: "#promo7Q2MX" -> ref PROMO7Q2MX (produk dari konteks/default).
const PROMO_PATTERN = /#PROMO([A-Z0-9]{5})\b/;
const REF_PRODUCTS = { SG: 'SalGlow', KK: 'KarierKit', KJN: 'KitJelangNikah' };

const CLOSING_PATTERNS = [
  /\bcod\b/i,
  /\b(sudah|udah|udh|sdh) (bayar|transfer|tf)\b/i,
  /\b(saya|aku|sy) (ambil|order|pesan|mau order)\b/i,
  /\boke? deal\b/i,
  /^\s*gas+\b/i,
  /\bbukti (transfer|tf)\b/i,
];

const MEDIA_LABELS = {
  image: '[Lead mengirim gambar]',
  video: '[Lead mengirim video]',
  audio: '[Lead mengirim voice note]',
  ptt: '[Lead mengirim voice note]',
  document: '[Lead mengirim dokumen]',
  sticker: '[Lead mengirim stiker]',
};

// Produk yang disebut eksplisit di pesan, atau null kalau tidak ada.
function detectProduct(text) {
  for (const [product, pattern] of PRODUCT_PATTERNS) {
    if (pattern.test(text)) return product;
  }
  return null;
}

function extractRef(text) {
  const upper = String(text || '').toUpperCase();
  const promo = upper.match(PROMO_PATTERN);
  if (promo) return { ref: 'PROMO' + promo[1], product: null };
  const m = upper.match(REF_PATTERN);
  return m ? { ref: m[0], product: REF_PRODUCTS[m[1]] } : null;
}

// Produk aktif: kode ref LP > produk yang disebut di pesan ini > produk tersimpan > default.
function resolveProduct(incoming, storedProduct) {
  const fromRef = extractRef(incoming);
  const mentioned = (fromRef && fromRef.product) || detectProduct(incoming);
  const product = mentioned || storedProduct || DEFAULT_PRODUCT;
  const switchedFrom = storedProduct && mentioned && mentioned !== storedProduct ? storedProduct : null;
  return { product, switchedFrom, ref: fromRef ? fromRef.ref : null };
}

function isClosingMessage(text) {
  return CLOSING_PATTERNS.some((p) => p.test(text));
}

function normalizeIncoming(body) {
  const text = String(body.message || '').trim();
  if (text) return text;
  return MEDIA_LABELS[body.messageType] || '[Lead mengirim pesan non-teks]';
}

function parseHistory(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

// Claude butuh pesan pertama ber-role user dan role yang bergantian.
function trimHistory(history) {
  let trimmed = history.slice(-MAX_HISTORY);
  while (trimmed.length && trimmed[0].role !== 'user') trimmed = trimmed.slice(1);
  const merged = [];
  for (const msg of trimmed) {
    const last = merged[merged.length - 1];
    if (last && last.role === msg.role) last.content += '\n' + msg.content;
    else merged.push({ role: msg.role, content: msg.content });
  }
  return merged;
}

// Order terakhir lead kalau masih dalam jendela anti-dobel.
function recentOrder(row, now = Date.now()) {
  if (!row || !row.last_order_id || !row.last_order_at) return null;
  const age = now - new Date(row.last_order_at).getTime();
  return age >= 0 && age < SCALEV.duplicateOrderHours * 3600000 ? row.last_order_id : null;
}

// Kolom handoff berisi waktu bot dijeda (ISO). 'true' (format lama) = dijeda sampai diubah manual.
function isPaused(row, now = Date.now()) {
  const value = String((row && row.handoff) || '');
  if (value === 'true') return true;
  const at = Date.parse(value);
  return !Number.isNaN(at) && now - at < HANDOFF_PAUSE_MINUTES * 60000;
}

function prepareContext(body, row) {
  const incoming = normalizeIncoming(body);

  // Saat dijeda bot tidak membalas, tapi pesan lead tetap dicatat supaya
  // konteksnya tidak hilang ketika bot aktif lagi.
  if (isPaused(row)) {
    const kept = parseHistory(row.history).concat([{ role: 'user', content: incoming }]);
    return { paused: true, phone: body.phone, history: JSON.stringify(kept.slice(-MAX_HISTORY * 2)) };
  }

  const { product, switchedFrom, ref } = resolveProduct(incoming, row && row.active_product);
  const history = parseHistory(row && row.history);
  history.push({ role: 'user', content: incoming });
  const messages = trimHistory(history);

  const tools = orderTools(product);
  let system = buildSystemPrompt(product);
  if (tools) system += ' ' + ORDER_RULE;
  if (switchedFrom) {
    system += ` KONTEKS: Lead baru saja pindah topik dari ${switchedFrom} ke ${product}. Jawab tentang ${product}; jangan lanjut menawarkan ${switchedFrom} kecuali lead menanyakannya lagi.`;
  }

  return {
    phone: body.phone,
    name: body.pushName || '',
    incoming,
    active_product: product,
    switchedFrom,
    ref: ref || (row && row.ref) || '',
    isClosing: isClosingMessage(incoming),
    lastOrder: recentOrder(row),
    messages,
    requestBody: {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages,
      ...(tools ? { tools } : {}),
    },
  };
}
