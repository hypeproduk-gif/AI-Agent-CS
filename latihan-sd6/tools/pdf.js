// Buat file PDF siap cetak (produk order bump) untuk kedua versi kelas 6.
// Pakai: node tools/pdf.js  -> pdf/harian/*.pdf dan pdf/drill/*.pdf
const path = require("path"), fs = require("fs");
const { chromium } = require("playwright");
const C = require("../js/core.js"); require("../js/svg6.js");
const BANK = { MTK: require("../js/mtk6.js")(), BIND: require("../js/bind6.js")(), BING: require("../js/bing6.js")(), IPA: require("../js/ipa6.js")() };
const NAMA = { MTK: "Matematika", BIND: "Bahasa Indonesia", BING: "Bahasa Inggris", IPA: "IPA" };
const LV = ["", "Dasar", "Menengah", "HOTS"];
const pool = (m, lv) => BANK[m].filter((q) => q.level === lv);
// sama persis dengan aplikasi
const soalHari = (m, d) => { const lv = d >= 71 ? 3 : d >= 36 ? 2 : 1, mulai = [0, 1, 36, 71][lv]; return pool(m, lv).slice((d - mulai) * 10, (d - mulai) * 10 + 10); };
const paketLevel = (k) => (k <= 14 ? 1 : k <= 28 ? 2 : 3);
const soalPaket = (m, k) => { const lv = paketLevel(k), s = (lv === 1 ? k - 1 : lv === 2 ? k - 15 : k - 29) * 25; return pool(m, lv).slice(s, s + 25); };
const rngPick = (arr, n, seed) => { const r = C.rng(seed), x = arr.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x.slice(0, n); };
const soalSimMix = (n) => Object.keys(BANK).flatMap((k, i) => rngPick(BANK[k], 10, 9000 + n * 13 + i));
const CSS = `@page{size:A4;margin:14mm 13mm 16mm}body{font:11.5pt/1.45 "Segoe UI",Roboto,Arial,sans-serif;color:#111}h1{font-size:22pt;margin:0 0 6px;color:#1e3a8a}h2{font-size:14pt;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:3px;margin:0 0 6px;break-before:page}h2.first{break-before:auto}
.meta{font-size:10pt;color:#555;margin-bottom:8px}.q{break-inside:avoid;margin:7px 0 9px}.q svg{max-height:120px;width:auto;display:block;margin:4px 0}.o{display:grid;grid-template-columns:1fr 1fr;gap:1px 16px;font-size:10.5pt;margin-top:2px}
blockquote{margin:4px 0;padding:4px 8px;background:#f3f4f6;border-left:3px solid #93c5fd;font-size:10.5pt}.k{font-size:10pt}.k p{margin:3px 0}.cover{text-align:center;padding-top:60mm}.cover p{font-size:12pt;color:#444}
.foot{position:fixed;bottom:-10mm;left:0;right:0;text-align:center;font-size:8pt;color:#888}`;
const qhtml = (q, i) => `<div class="q"><b>${i + 1}.</b> ${q.q}${q.img || ""}<div class="o">${q.opsi.map((o, j) => `<span>${"abcd"[j]}. ${o}</span>`).join("")}</div></div>`;
const kunci = (s) => s.map((q, i) => `${i + 1}${"abcd"[q.jawab]}`).join("  ");
const bahas = (s) => s.map((q, i) => `<p><b>${i + 1}. ${"abcd"[q.jawab].toUpperCase()}</b> — ${q.bahas}</p>`).join("");
const doc = (judul, sub, body) => `<html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="cover"><h1>${judul}</h1><p>${sub}</p><p style="margin-top:30mm">Nama: ________________________<br><br>Kelas: 6 &nbsp;&nbsp; Sekolah: ________________</p></div>${body}</body></html>`;
async function main() {
  const out = path.join(__dirname, "..", "pdf"); const b = await chromium.launch();
  const jobs = [];
  for (const m of Object.keys(BANK)) {
    let body = ""; for (let d = 1; d <= 100; d++) { const s = soalHari(m, d); body += `<h2>${NAMA[m]} · Hari ke-${d}</h2><div class="meta">Level ${LV[d >= 71 ? 3 : d >= 36 ? 2 : 1]} · Tanggal: __________ · Nilai: ____</div>${s.map(qhtml).join("")}`; }
    body += `<h2>Kunci Jawaban & Pembahasan</h2><div class="k">${Array.from({ length: 100 }, (_, i) => `<p><b>Hari ${i + 1}:</b> ${kunci(soalHari(m, i + 1))}</p>`).join("")}</div>`;
    jobs.push([`harian/Les di Rumah Kelas 6 - ${NAMA[m]} (100 Hari).pdf`, doc(`Les di Rumah Kelas 6`, `${NAMA[m]} · Lembar Latihan 100 Hari · 1.000 soal + kunci`, body)]);
    let pb = ""; for (let k = 1; k <= 40; k++) { const s = soalPaket(m, k); pb += `<h2>${NAMA[m]} · Paket ${k}</h2><div class="meta">${LV[paketLevel(k)]} · 25 soal · Waktu disarankan 30 menit · Nilai: ____</div>${s.map(qhtml).join("")}`; }
    pb += `<h2>Kunci Jawaban & Pembahasan</h2><div class="k">${Array.from({ length: 40 }, (_, i) => `<p><b>Paket ${i + 1}:</b> ${kunci(soalPaket(m, i + 1))}</p>`).join("")}</div>`;
    jobs.push([`drill/Siap Ujian Kelas 6 - ${NAMA[m]} (40 Paket Drill).pdf`, doc(`Siap Ujian Kelas 6`, `${NAMA[m]} · 40 Paket Drill Bertahap · 1.000 soal + kunci`, pb)]);
  }
  let sb = ""; for (let n = 1; n <= 10; n++) { const s = soalSimMix(n); sb += `<h2>Simulasi Ujian Campuran #${n}</h2><div class="meta">40 soal · 4 mapel · Waktu 60 menit · Mulai: ____ Selesai: ____ · Nilai: ____</div>${s.map(qhtml).join("")}`; }
  sb += Array.from({ length: 10 }, (_, i) => `<h2>Kunci & Pembahasan Simulasi #${i + 1}</h2><div class="k">${bahas(soalSimMix(i + 1))}</div>`).join("");
  jobs.push([`drill/Siap Ujian Kelas 6 - 10 Simulasi Ujian Campuran.pdf`, doc(`Siap Ujian Kelas 6`, `10 Simulasi Ujian Campuran · 400 soal + pembahasan`, sb)]);
  for (const [f, html] of jobs) { const p = await b.newPage(); await p.setContent(html, { waitUntil: "load" }); const fp = path.join(out, f); fs.mkdirSync(path.dirname(fp), { recursive: true }); await p.pdf({ path: fp, format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: `<div style="font-size:7.5px;color:#888;width:100%;text-align:center">© Toolkit Parenting (toolkitparenting.my.id) · Lisensi pribadi 1 keluarga · Dilarang menyebarluaskan (UU No. 28 Th. 2014) · hal. <span class="pageNumber"></span>/<span class="totalPages"></span></div>` }); await p.close(); console.log(f, (fs.statSync(fp).size / 1024 / 1024).toFixed(1) + " MB"); }
  await b.close();
}
main();
