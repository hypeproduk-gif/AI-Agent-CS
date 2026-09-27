// Event Purchase langsung ke Meta Conversions API (graph.facebook.com/{pixel}/events),
// tidak tergantung domain/store Scalev. Token disimpan di credential n8n "Meta CAPI" (query access_token).

const META_PIXEL_ID = 'ISI_PIXEL_ID'; // ganti dengan Pixel/Dataset ID Meta
const META_API_VERSION = 'v21.0';

function normalizePhone(phone) {
  const d = String(phone || '').replace(/\D/g, '');
  return d.startsWith('0') ? '62' + d.slice(1) : d;
}

// SHA-256 (hex) murni JS: Code node n8n cloud tidak selalu boleh require('crypto').
function sha256(ascii) {
  const bytes = unescape(encodeURIComponent(String(ascii)));
  const K = [];
  const H = [];
  let n = 2;
  for (let found = 0; found < 64; n++) {
    let prime = true;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
    if (!prime) continue;
    if (found < 8) H[found] = (Math.pow(n, 1 / 2) * 4294967296) | 0;
    K[found++] = (Math.pow(n, 1 / 3) * 4294967296) | 0;
  }
  const words = [];
  const bitLen = bytes.length * 8;
  for (let i = 0; i < bytes.length; i++) words[i >> 2] |= bytes.charCodeAt(i) << ((3 - i) % 4) * 8;
  words[bitLen >> 5] |= 0x80 << (24 - bitLen % 32);
  words[(((bitLen + 64) >> 9) << 4) + 15] = bitLen;
  const rotr = (x, r) => (x >>> r) | (x << (32 - r));
  for (let j = 0; j < words.length; j += 16) {
    const w = Array.from({ length: 16 }, (_, i) => words[j + i] | 0);
    const old = H.slice(0);
    for (let i = 0; i < 64; i++) {
      if (i >= 16) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = rotr(w15, 7) ^ rotr(w15, 18) ^ (w15 >>> 3);
        const s1 = rotr(w2, 17) ^ rotr(w2, 19) ^ (w2 >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      const [a, b, c, d, e, f, g, h] = H;
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      H.unshift((t1 + t2) | 0);
      H.length = 8;
      H[4] = (H[4] + t1) | 0;
    }
    for (let i = 0; i < 8; i++) H[i] = (H[i] + old[i]) | 0;
  }
  return H.map((x) => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

const hashed = (v) => (v ? [sha256(String(v).trim().toLowerCase())] : undefined);

function purchaseEvent(order, phone, attribution, now = Date.now()) {
  const a = attribution || {};
  const userData = {
    ph: hashed(normalizePhone(phone)),
    external_id: hashed(normalizePhone(phone)),
    fn: hashed(String(order.name || '').replace(/^\[[^\]]*\]\s*/, '').split(' ')[0]),
    ct: hashed(String(order.city || '').replace(/^(kota|kab\.?|kabupaten)\s+/i, '').replace(/\s+/g, '')),
    st: hashed(String(order.province || '').replace(/\s+/g, '')),
    country: hashed('id'),
    fbc: a.fbc || undefined,
    fbp: a.fbp || undefined,
    client_ip_address: a.client_ip || undefined,
    client_user_agent: a.user_agent || undefined,
  };
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);
  // Dari LP (ada user agent) = website; tanpa data LP = konversi dari chat.
  const fromWeb = Boolean(a.user_agent);
  return {
    data: [{
      event_name: 'Purchase',
      event_time: Math.floor(now / 1000),
      event_id: `${order.orderId}-Purchase`,
      action_source: fromWeb ? 'website' : 'chat',
      ...(fromWeb && a.landing_url ? { event_source_url: a.landing_url } : {}),
      user_data: userData,
      custom_data: {
        value: order.price,
        currency: 'IDR',
        content_type: 'product',
        content_ids: order.variants.map((v) => v.variant_unique_id),
        content_name: order.note,
        num_items: order.variants.reduce((n, v) => n + v.quantity, 0),
      },
    }],
  };
}
