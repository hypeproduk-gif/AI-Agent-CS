// Buat kode akses per produk. Pakai: node tools/buat-kode.js harian 100   |   node tools/buat-kode.js drill 100
// Kode asli -> tools/kode-<produk>.csv (rahasia, tidak di-commit). Hash -> tools/hash-<produk>.json
// Juga membuat 1 kode bersama untuk LMS (tools/kode-lms-<produk>.txt) bila belum ada.
const fs = require("fs"), crypto = require("crypto"), path = require("path");
const produk = process.argv[2], n = +process.argv[3] || 100;
if (!["harian", "drill"].includes(produk)) throw new Error("produk: harian | drill");
const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const part = (k) => Array.from(crypto.randomBytes(k), (b) => A[b % A.length]).join("");
const pre = produk === "drill" ? "UJIAN6" : "SD6";
const hp = path.join(__dirname, `hash-${produk}.json`), cp = path.join(__dirname, `kode-${produk}.csv`), lp = path.join(__dirname, `kode-lms-${produk}.txt`);
const hashes = fs.existsSync(hp) ? JSON.parse(fs.readFileSync(hp)) : [];
const h = (k) => crypto.createHash("sha256").update(k).digest("hex");
const baru = Array.from({ length: n }, () => `${pre}-${part(4)}-${part(4)}`);
baru.forEach((k) => hashes.push(h(k)));
if (!fs.existsSync(lp)) { const lms = (produk === "drill" ? "SIAPUJIAN6-" : "LESRUMAH6-") + part(4); fs.writeFileSync(lp, lms + "\n"); hashes.push(h(lms)); }
fs.writeFileSync(hp, JSON.stringify(hashes));
fs.appendFileSync(cp, baru.join("\n") + "\n");
console.log(`${produk}: +${n} kode, total hash ${hashes.length}. Kode LMS: ${fs.readFileSync(lp, "utf8").trim()}`);
