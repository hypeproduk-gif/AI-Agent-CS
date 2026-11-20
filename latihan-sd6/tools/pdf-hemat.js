// PDF order bump versi hemat: 32 paket drill (320 soal) + 3 simulasi campuran, dengan kunci & pembahasan.
// Pakai: node tools/pdf-hemat.js -> pdf/hemat/*.pdf
globalThis.QUOTA = { 1: 30, 2: 30, 3: 20 };
const path = require("path"), fs = require("fs");
const { chromium } = require("playwright");
const C = require("../js/core.js"); require("../js/svg6.js");
const BANK = { MTK: require("../js/mtk6.js")(), BIND: require("../js/bind6.js")(), BING: require("../js/bing6.js")(), IPA: require("../js/ipa6.js")() };
const NAMA = { MTK: "Matematika", BIND: "Bahasa Indonesia", BING: "Bahasa Inggris", IPA: "IPA" }, LV = ["", "Dasar", "Menengah", "HOTS"], MULAI = [0, 1, 4, 7];
const lvP = (k) => (k >= 7 ? 3 : k >= 4 ? 2 : 1);
const soalPaket = (m, k) => { const lv = lvP(k), s = (k - MULAI[lv]) * 10; return BANK[m].filter((q) => q.level === lv).slice(s, s + 10); };
const rngPick = (arr, n, seed) => { const r = C.rng(seed), x = arr.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x.slice(0, n); };
const soalSim = (n) => Object.keys(BANK).flatMap((k, i) => rngPick(BANK[k], 10, 9000 + n * 13 + i));
const CSS = `@page{size:A4;margin:14mm 13mm 16mm}body{font:11.5pt/1.45 "Segoe UI",Roboto,Arial,sans-serif;color:#111}h1{font-size:24pt;margin:0 0 6px;color:#1e3a8a}h2{font-size:14pt;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:3px;margin:0 0 6px;break-before:page}
.meta{font-size:10pt;color:#555;margin-bottom:8px}.q{break-inside:avoid;margin:7px 0 9px}.q svg{max-height:120px;width:auto;display:block;margin:4px 0}.o{display:grid;grid-template-columns:1fr 1fr;gap:1px 16px;font-size:10.5pt;margin-top:2px}
blockquote{margin:4px 0;padding:4px 8px;background:#f3f4f6;border-left:3px solid #93c5fd;font-size:10.5pt}.k{font-size:10pt}.k p{margin:3px 0}.cover{text-align:center;padding-top:55mm}.cover p{font-size:12pt;color:#444}`;
const qh = (q, i) => `<div class="q"><b>${i + 1}.</b> ${q.q}${q.img || ""}<div class="o">${q.opsi.map((o, j) => `<span>${"abcd"[j]}. ${o}</span>`).join("")}</div></div>`;
const bahas = (s) => s.map((q, i) => `<p><b>${i + 1}. ${"abcd"[q.jawab].toUpperCase()}</b> — ${q.bahas}</p>`).join("");
(async () => {
  let body = "", kunci = "";
  for (const m of Object.keys(BANK)) for (let k = 1; k <= 8; k++) { const s = soalPaket(m, k); body += `<h2>${NAMA[m]} · Paket ${k}</h2><div class="meta">${LV[lvP(k)]} · 10 soal · ±12 menit · Tanggal: ______ · Nilai: ____</div>${s.map(qh).join("")}`; kunci += `<h2>Pembahasan ${NAMA[m]} · Paket ${k}</h2><div class="k">${bahas(s)}</div>`; }
  for (let n = 1; n <= 3; n++) { const s = soalSim(n); body += `<h2>Simulasi Ujian Campuran #${n}</h2><div class="meta">40 soal · 4 mapel · 60 menit · Mulai: ____ Selesai: ____ · Nilai: ____</div>${s.map(qh).join("")}`; kunci += `<h2>Pembahasan Simulasi #${n}</h2><div class="k">${bahas(s)}</div>`; }
  const html = `<html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="cover"><h1>Siap Ujian Kelas 6</h1><p>Versi Cetak · 32 Paket Drill (320 soal) + 3 Simulasi Ujian<br>Matematika · B. Indonesia · B. Inggris · IPA<br>Kunci & pembahasan lengkap</p><p style="margin-top:30mm">Nama: ________________________<br><br>Sekolah: ________________</p></div>${body}${kunci}</body></html>`;
  const b = await chromium.launch(), p = await b.newPage(); await p.setContent(html, { waitUntil: "load" });
  const fp = path.join(__dirname, "..", "pdf", "hemat", "Siap Ujian Kelas 6 - Versi Cetak (320 Soal + Pembahasan).pdf"); fs.mkdirSync(path.dirname(fp), { recursive: true });
  await p.pdf({ path: fp, format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: `<div style="font-size:7.5px;color:#888;width:100%;text-align:center">© Toolkit Parenting (toolkitparenting.my.id) · Lisensi pribadi 1 keluarga · Dilarang menyebarluaskan (UU No. 28 Th. 2014) · hal. <span class="pageNumber"></span>/<span class="totalPages"></span></div>` });
  await b.close(); console.log(fp, (fs.statSync(fp).size / 1024).toFixed(0) + " KB");
})();
