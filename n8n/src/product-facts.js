// Fakta pendukung kepercayaan per produk. Kosong = bot tidak menyebutnya (tidak mengarang).
// testimonials: URL gambar publik (https) yang bisa diunduh Wablas, sebaiknya sudah diblur nama/nomor pembeli.

const FACTS = {
  SalGlow: {
    bpom: '', // contoh: 'NA18230100123'
    testimonials: [],
  },
};

const TESTIMONI_TOKEN = '[TESTIMONI]';
const TESTIMONI_PER_SEND = 3;

function factsPrompt(product) {
  const f = FACTS[product] || {};
  const parts = [];
  if (f.bpom) {
    parts.push(`BPOM: terdaftar dengan nomor ${f.bpom}. Kalau lead tanya keamanan/BPOM, sebutkan nomor ini dengan yakin dan bilang bisa dicek sendiri di cekbpom.pom.go.id.`);
  }
  if ((f.testimonials || []).length) {
    parts.push(`TESTIMONI: kamu bisa mengirim foto testimoni asli pembeli. Kalau lead ragu soal hasil, tanya testimoni, atau belum yakin, bilang 'aku kirimin beberapa testimoni ya kak' lalu akhiri balasan dengan token ${TESTIMONI_TOKEN} (sistem otomatis mengirim ${TESTIMONI_PER_SEND} foto). Maksimal 1x per percakapan kecuali lead minta lagi.`);
  }
  return parts.join(' ');
}

// Ambil beberapa testimoni acak untuk dikirim.
function pickTestimonials(product, count = TESTIMONI_PER_SEND, random = Math.random) {
  const list = ((FACTS[product] || {}).testimonials || []).slice();
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, count);
}
