/**
 * Server lisensi gratis memakai Google Sheets + Apps Script.
 * Fungsi: 1 kode akses = 1 nama anak (terkunci di semua perangkat), maksimal MAKS_PERANGKAT perangkat.
 * Cara pasang: lihat tools/PANDUAN-LISENSI.md
 */
const MAKS_PERANGKAT = 3;
function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sh = SpreadsheetApp.getActive().getSheets()[0];
    const rows = sh.getDataRange().getValues(); // kolom: kodeHash | nama | perangkat(koma) | waktu | blokir
    let i = rows.findIndex((r) => r[0] === d.kode);
    if (i < 0) { sh.appendRow([d.kode, "", "", new Date(), ""]); i = sh.getLastRow() - 1; rows[i] = [d.kode, "", "", "", ""]; }
    const row = rows[i]; const dev = String(row[2] || "").split(",").filter(String);
    if (String(row[4]).toUpperCase() === "YA") return out({ ok: false, pesan: "Kode ini diblokir karena terindikasi disebarkan. Hubungi penjual." });
    if (dev.indexOf(d.dev) < 0) {
      if (dev.length >= MAKS_PERANGKAT) return out({ ok: false, pesan: "Kode sudah dipakai di " + MAKS_PERANGKAT + " perangkat. Hubungi penjual." });
      dev.push(d.dev); sh.getRange(i + 1, 3).setValue(dev.join(","));
    }
    let nama = row[1];
    if (d.aksi === "kunci" && !nama && d.nama) { nama = String(d.nama).slice(0, 40); sh.getRange(i + 1, 2).setValue(nama); }
    sh.getRange(i + 1, 4).setValue(new Date());
    return out({ ok: true, nama: nama || null });
  } finally { lock.releaseLock(); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
