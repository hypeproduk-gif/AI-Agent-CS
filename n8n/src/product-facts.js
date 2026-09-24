// Fakta pendukung kepercayaan per produk. Kosong = bot tidak menyebutnya (tidak mengarang).
// testimonials: URL gambar publik (https) yang bisa diunduh Wablas, sebaiknya sudah diblur nama/nomor pembeli.

const FACTS = {
  SalGlow: {
    bpom: '', // isi nomor notifikasi BPOM kalau sudah terbit, contoh: 'NA18230100123'
    bpomStatus: 'belum', // 'belum' | 'proses' (hanya kalau pengajuan memang sedang berjalan) | '' (tidak dibahas)
    // Kesan pemakaian dari pemilik produk. Bukan klaim lab.
    experience: 'tekstur salepnya lembut, tidak molor dan tidak lengket seperti krim abal-abal, nyaman dipakai, tidak terasa perih atau panas',
    // tags: topik yang terlihat di foto (lihat TESTIMONI_TOPICS). Kosong = testimoni umum.
    testimonials: [
      { url: 'https://i.imgur.com/BCMVnmH.jpeg', tags: [] },
      { url: 'https://i.imgur.com/a1lUd6s.jpeg', tags: [] },
      { url: 'https://i.imgur.com/PKyNbKC.jpeg', tags: [] },
      { url: 'https://i.imgur.com/d6NRNvF.jpeg', tags: [] },
      { url: 'https://i.imgur.com/lpbKfeM.jpeg', tags: [] },
      { url: 'https://i.imgur.com/FJY2uQH.jpeg', tags: [] },
      { url: 'https://i.imgur.com/Dd7RITn.jpeg', tags: [] },
      { url: 'https://i.imgur.com/GnEmksa.jpeg', tags: [] },
      { url: 'https://i.imgur.com/bu6vcTC.jpeg', tags: [] },
      { url: 'https://i.imgur.com/ehgva5g.png', tags: [] },
      { url: 'https://i.imgur.com/oBjgkj6.jpeg', tags: [] },
      { url: 'https://i.imgur.com/xBsHtsu.jpeg', tags: [] },
      { url: 'https://i.imgur.com/RMBAETY.jpeg', tags: [] },
      { url: 'https://i.imgur.com/npyeJR2.jpeg', tags: [] },
      { url: 'https://i.imgur.com/X17RrHj.jpeg', tags: [] },
      { url: 'https://i.imgur.com/x06TLMG.jpeg', tags: [] },
      { url: 'https://i.imgur.com/JCBVQX0.jpeg', tags: [] },
      { url: 'https://i.imgur.com/hsHNEdF.jpeg', tags: [] },
      { url: 'https://i.imgur.com/1MtF63B.jpeg', tags: [] },
      { url: 'https://i.imgur.com/ENKjMB0.jpeg', tags: [] },
      { url: 'https://i.imgur.com/YOCrdlT.jpeg', tags: [] },
      { url: 'https://i.imgur.com/SDlPu5R.jpeg', tags: [] },
      { url: 'https://i.imgur.com/H5YmA0w.jpeg', tags: [] },
      { url: 'https://i.imgur.com/vOdaTLV.jpeg', tags: [] },
      { url: 'https://i.imgur.com/zMF8qSr.jpeg', tags: [] },
    ],
  },
};

const TESTIMONI_TOKEN = '[TESTIMONI]';
const TESTIMONI_PER_SEND = 3;
const TESTIMONI_TOPICS = {
  flek: 'flek hitam / noda gelap',
  bekas_jerawat: 'bekas jerawat',
  jerawat: 'jerawat aktif',
  kusam: 'kulit kusam, belum glowing',
  kering: 'kulit kering',
  penuaan: 'kerutan / tanda penuaan',
  tekstur: 'tekstur salep, rasa nyaman dipakai',
  cepat: 'hasil terlihat dalam hitungan hari',
};

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
    const topics = Object.entries(TESTIMONI_TOPICS).map(([k, v]) => `${k} (${v})`).join(', ');
    parts.push(`TESTIMONI: kamu bisa mengirim foto testimoni asli pembeli. Kalau lead ragu soal hasil, tanya testimoni, atau belum yakin, bilang 'aku kirimin testimoni yang mirip kondisi kakak ya' lalu akhiri balasan dengan token [TESTIMONI:topik] sesuai keluhan lead, contoh [TESTIMONI:flek] atau [TESTIMONI:bekas_jerawat,kusam]. Topik yang tersedia: ${topics}. Kalau keluhan lead belum jelas, pakai ${TESTIMONI_TOKEN} saja. Sistem otomatis mengirim ${TESTIMONI_PER_SEND} foto. Maksimal 1x per percakapan kecuali lead minta lagi.`);
  }
  return parts.join(' ');
}

function shuffle(list, random) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Pilih testimoni: yang label topiknya cocok duluan, sisanya diisi acak.
function pickTestimonials(product, topics = [], count = TESTIMONI_PER_SEND, random = Math.random) {
  const list = ((FACTS[product] || {}).testimonials || []).map((t) => (typeof t === 'string' ? { url: t, tags: [] } : t));
  const wanted = topics.filter((t) => TESTIMONI_TOPICS[t]);
  const matches = shuffle(list.filter((t) => t.tags.some((tag) => wanted.includes(tag))), random);
  const rest = shuffle(list.filter((t) => !matches.includes(t)), random);
  return matches.concat(rest).slice(0, count).map((t) => t.url);
}
