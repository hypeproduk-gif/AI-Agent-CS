// Bookmarklet: baca kartu produk di halaman Penawaran Produk dasbor Shopee Affiliate, kirim ke n8n.
// Ganti WEBHOOK lalu jalankan `node shopee-trending/build-n8n.js <WEBHOOK>` untuk mendapat versi siap pasang.
(() => {
  const WEBHOOK = '__WEBHOOK__';
  // Kartu = elemen terkecil yang memuat teks "komisi" + harga "Rp".
  const all = [...document.querySelectorAll('body *')].filter((el) => {
    const t = el.innerText || '';
    return t.length < 800 && /komisi/i.test(t) && /Rp/.test(t);
  });
  const cards = all.filter((el) => !all.some((o) => o !== el && el.contains(o)));
  const seen = new Set();
  const out = [];
  for (const el of cards) {
    let box = el;
    for (let i = 0; i < 4 && box && !box.querySelector('a[href],img'); i++) box = box.parentElement;
    const a = (box || el).querySelector('a[href]');
    const img = (box || el).querySelector('img');
    const t = (box || el).innerText.replace(/\s+\n/g, '\n').trim();
    if (seen.has(t)) continue;
    seen.add(t);
    out.push({ t, h: a ? a.href : '', img: img ? img.src : '' });
  }
  if (!out.length) return alert('Produk tidak ketemu. Buka halaman Penawaran Produk dan tunggu daftar produk muncul.');
  fetch(WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ url: location.href, cards: out.slice(0, 150) }) })
    .then(() => alert(`Terkirim ${out.length} produk. Laporan masuk Telegram ±1 menit lagi.`))
    .catch((e) => alert('Gagal kirim: ' + e));
})();
