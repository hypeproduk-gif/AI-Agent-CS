// Gabungkan app jadi 1 file HTML untuk Scalev (atau dikirim sebagai file).
// Pakai: node tools/bundle-scalev.js  -> dist/latihan-sd5.html
const fs = require("fs"), path = require("path");
const d = path.join(__dirname, ".."); let h = fs.readFileSync(path.join(d, "index.html"), "utf8");
const hashes = fs.readFileSync(path.join(d, "netlify/functions/codes.json"), "utf8");
h = h.replace('<link rel="manifest" href="manifest.json">', "");
h = h.replace('<script src="js/core.js">', `<script>window.KODE_HASH=${hashes}</script><script src="js/core.js">`);
h = h.replace(/<script src="(js\/[a-z]+\.js)"><\/script>/g, (_, f) => "<script>" + fs.readFileSync(path.join(d, f), "utf8").replace(/<\/script/g, "<\\/script") + "</script>");
h = h.replace(/if \("serviceWorker"[^\n]*/, "");
fs.mkdirSync(path.join(d, "dist"), { recursive: true });
fs.writeFileSync(path.join(d, "dist/latihan-sd5.html"), h);
console.log("dist/latihan-sd5.html", (h.length / 1024).toFixed(0) + " KB");
