// Gabungkan aplikasi kelas 6 jadi 1 file HTML untuk Scalev, untuk kedua versi.
// Pakai: node tools/bundle.js  -> dist/les-di-rumah-kelas6.html dan dist/siap-ujian-kelas6.html
const fs = require("fs"), path = require("path");
const d = path.join(__dirname, "..");
const base = fs.readFileSync(path.join(d, "index.html"), "utf8");
for (const [mode, nama, out] of [["harian", "Les di Rumah Kelas 6", "les-di-rumah-kelas6.html"], ["drill", "Siap Ujian Kelas 6", "siap-ujian-kelas6.html"]]) {
  const hp = path.join(__dirname, `hash-${mode}.json`);
  const hashes = fs.existsSync(hp) ? fs.readFileSync(hp, "utf8") : "[]";
  let h = base.replace(/__PRODUK__/g, nama);
  h = h.replace('<script src="js/core.js">', `<script>window.MODE=${JSON.stringify(mode)};window.KODE_HASH=${hashes}</script><script src="js/core.js">`);
  h = h.replace(/<script src="(js\/[a-z0-9]+\.js)"><\/script>/g, (_, f) => "<script>" + fs.readFileSync(path.join(d, f), "utf8").replace(/<\/script/g, "<\\/script") + "</script>");
  fs.mkdirSync(path.join(d, "dist"), { recursive: true });
  fs.writeFileSync(path.join(d, "dist", out), h);
  console.log(out, (h.length / 1024).toFixed(0) + " KB");
}
