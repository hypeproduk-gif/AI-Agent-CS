// Fakta pendukung kepercayaan per produk. Kosong = bot tidak menyebutnya (tidak mengarang).
// testimonials: URL gambar publik (https) yang bisa diunduh Wablas, sebaiknya sudah diblur nama/nomor pembeli.

const FACTS = {
  SalGlow: {
    bpom: '', // isi nomor notifikasi BPOM kalau sudah terbit, contoh: 'NA18230100123'
    bpomStatus: 'belum', // 'belum' | 'proses' (hanya kalau pengajuan memang sedang berjalan) | '' (tidak dibahas)
    // Kesan pemakaian dari pemilik produk. Bukan klaim lab.
    experience: 'tekstur salepnya lembut, tidak molor dan tidak lengket seperti krim abal-abal, nyaman dipakai, tidak terasa perih atau panas',
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
  } else if (f.bpomStatus) {
    const status = f.bpomStatus === 'proses' ? 'sedang dalam proses pendaftaran BPOM' : 'belum terdaftar BPOM';
    parts.push(`BPOM: produk ini ${status}. Kalau lead tanya BPOM, jawab JUJUR dengan kalimat itu, jangan mengelak, jangan bilang sudah terdaftar, jangan mengarang nomor/sertifikat. Setelah itu boleh ceritakan kesan pemakaian dan tawarkan testimoni kalau ada, lalu hormati keputusan lead.`);
  }
  if (f.experience) {
    parts.push(`KESAN PEMAKAIAN (boleh disampaikan sebagai pengalaman pemakaian, bukan hasil uji lab): ${f.experience}. JANGAN klaim 'bebas merkuri', 'aman untuk semua kulit', 'aman untuk kulit sensitif', atau 'sudah uji lab'.`);
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
