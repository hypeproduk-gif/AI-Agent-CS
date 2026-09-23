// Susun konteks untuk Claude dari payload webhook Wablas + baris leads_context.
// Mengembalikan null kalau bot harus diam (lead sedang ditangani manusia).

const MAX_HISTORY = 20;
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 500;

const PRODUCT_PATTERNS = [
  ['KitJelangNikah', /\b(nikah|menikah|pernikahan|wedding)\b/i],
  ['KarierKit', /\b(cv|karier|karir|lamaran kerja|ats)\b/i],
];

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

function detectProduct(text) {
  for (const [product, pattern] of PRODUCT_PATTERNS) {
    if (pattern.test(text)) return product;
  }
  return DEFAULT_PRODUCT;
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

function prepareContext(body, row) {
  if (row && String(row.handoff) === 'true') return null;

  const incoming = normalizeIncoming(body);
  const product = (row && row.active_product) || detectProduct(incoming);
  const history = parseHistory(row && row.history);
  history.push({ role: 'user', content: incoming });
  const messages = trimHistory(history);

  return {
    phone: body.phone,
    name: body.pushName || '',
    incoming,
    active_product: product,
    isClosing: isClosingMessage(incoming),
    messages,
    requestBody: {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(product),
      messages,
    },
  };
}
