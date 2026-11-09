/**
 * Server lisensi gratis memakai Google Sheets + Apps Script.
 * Fungsi: 1 kode akses = 1 nama anak (terkunci di semua perangkat), maksimal MAKS_PERANGKAT perangkat.
 * Cara pasang: lihat tools/PANDUAN-LISENSI.md
 */
const MAKS_PERANGKAT = 3;
// ====== Kirim kode otomatis saat pesanan Scalev lunas (webhook) ======
// Sheet "Kode": kolom A kode | B status | C email | D nama | E no.pesanan | F waktu
const LINK_APP = "https://toolkitparenting.my.id/lesdirumah5-akses";
function cari(o, kunci) { // cari nilai pertama dengan nama field yang cocok, di mana pun di JSON
  if (!o || typeof o !== "object") return null;
  for (const k in o) { if (kunci.test(k) && o[k] && typeof o[k] !== "object") return String(o[k]); }
  for (const k in o) { const v = cari(o[k], kunci); if (v) return v; }
  return null;
}
function pesananScalev(d) {
  const status = (cari(d, /^(status|payment_status|order_status|event)$/i) || "").toLowerCase();
  if (status && !/(paid|lunas|settle|success|complete|confirmed)/.test(status)) return out({ ok: true, skip: status });
  const email = cari(d, /email/i), nama = cari(d, /^(name|nama|customer_name|full_?name)$/i) || "Bapak/Ibu", order = cari(d, /^(order_?id|order_?number|invoice|id)$/i) || email;
  if (!email) return out({ ok: false, pesan: "email tidak ditemukan" });
  const sh = SpreadsheetApp.getActive().getSheetByName("Kode"); const rows = sh.getDataRange().getValues();
  const ada = rows.findIndex((r) => String(r[4]) === String(order)); if (ada > 0) return out({ ok: true, dobel: true });
  const i = rows.findIndex((r, n) => n > 0 && r[0] && !r[1]); if (i < 0) { MailApp.sendEmail(Session.getEffectiveUser().getEmail(), "KODE AKSES HABIS", "Tambah kode baru di sheet Kode. Pesanan: " + order + " " + email); return out({ ok: false, pesan: "kode habis" }); }
  const kode = rows[i][0];
  sh.getRange(i + 1, 2, 1, 5).setValues([["terkirim", email, nama, order, new Date()]]);
  MailApp.sendEmail({ to: email, name: "Toolkit Parenting", subject: "Kode Akses Les di Rumah Kelas 5",
    htmlBody: `Halo ${nama},<br><br>Terima kasih sudah membeli <b>Les di Rumah Kelas 5</b> 🙏<br><br>🔗 Buka: <a href="${LINK_APP}">${LINK_APP}</a><br>🔑 Kode akses: <b style="font-size:18px">${kode}</b><br><br>Masukkan kode, isi <b>nama ANAK</b>, lalu mulai belajar.<br>Kode ini khusus untuk keluarga Anda, mohon tidak dibagikan.<br><br>Salam,<br>Toolkit Parenting` });
  return out({ ok: true });
}
function doPost(e) {
  const d0 = JSON.parse(e.postData.contents);
  if (!d0.aksi) return pesananScalev(d0);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sh = SpreadsheetApp.getActive().getSheetByName("Lisensi");
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
