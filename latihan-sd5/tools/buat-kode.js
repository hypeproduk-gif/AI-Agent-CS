// Buat N kode akses baru. Pakai: node tools/buat-kode.js 100
// Kode asli disimpan ke tools/kode-akses.csv (JANGAN di-commit/dibagikan), hash ke netlify/functions/codes.json
const fs = require("fs"), crypto = require("crypto"), path = require("path");
const n = +process.argv[2] || 50, A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const part = () => Array.from(crypto.randomBytes(4), (b) => A[b % A.length]).join("");
const hp = path.join(__dirname, "../netlify/functions/codes.json"), cp = path.join(__dirname, "kode-akses.csv");
const hashes = fs.existsSync(hp) ? JSON.parse(fs.readFileSync(hp)) : [];
const baru = Array.from({ length: n }, () => `SD5-${part()}-${part()}`);
for (const k of baru) hashes.push(crypto.createHash("sha256").update(k).digest("hex"));
fs.writeFileSync(hp, JSON.stringify(hashes));
fs.appendFileSync(cp, baru.join("\n") + "\n");
console.log(`${n} kode dibuat. Total aktif: ${hashes.length}. Daftar kode: ${cp}`);
