// Validasi bank soal kelas 6: jumlah, level, opsi unik, kunci valid. Jalankan: node check.js
const all = { MTK: require("./js/mtk6.js")(), BIND: require("./js/bind6.js")(), BING: require("./js/bing6.js")(), IPA: require("./js/ipa6.js")() };
let bad = 0;
for (const [m, qs] of Object.entries(all)) {
  const lv = {}, tp = {}; let img = 0;
  for (const q of qs) {
    lv[q.level] = (lv[q.level] || 0) + 1; tp[q.topik] = (tp[q.topik] || 0) + 1; if (q.img) img++;
    if (q.opsi.length !== 4 || new Set(q.opsi).size !== 4 || q.jawab < 0 || /undefined|NaN/.test(q.q + q.opsi.join("") + q.bahas)) { bad++; console.log("BAD", q); }
  }
  console.log(m, qs.length, "soal | level", JSON.stringify(lv), "| bergambar", img, "\n  topik", JSON.stringify(tp));
}
console.log(bad ? `${bad} soal bermasalah` : "Semua soal valid");
process.exit(bad ? 1 : 0);
