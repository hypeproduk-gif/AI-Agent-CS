// Tool Claude untuk cek ongkir & buat order Scalev (hanya produk yang punya PACKAGES).

function orderTools(product) {
  const packages = Object.keys(PACKAGES[product] || {});
  if (!packages.length) return null;
  const common = {
    paket: { type: 'string', enum: packages, description: 'Paket yang dipilih lead' },
    pembayaran: { type: 'string', enum: ['cod', 'transfer'], description: 'COD atau transfer bank' },
    kelurahan: { type: 'string', description: 'Desa/kelurahan tujuan kalau lead menyebutkan, contoh "Jagir"' },
    kecamatan: { type: 'string', description: 'Kecamatan tujuan, contoh "Wonokromo". Kalau lead hanya menyebut kelurahan, isi dengan kecamatan tempat kelurahan itu berada' },
    kota: { type: 'string', description: 'Kota/kabupaten tujuan, contoh "Surabaya". Kalau lead tidak menyebut, isi sesuai lokasi kelurahan/kecamatan tersebut' },
    kode_pos: { type: 'string', description: 'Kode pos kalau lead menyebutkan' },
  };
  return [
    {
      name: 'cek_ongkir',
      description: 'Hitung ongkir JNT dari gudang Surabaya dan total bayar (termasuk biaya COD 3% kalau COD). Pakai saat lead tanya ongkir atau sebelum konfirmasi order.',
      input_schema: {
        type: 'object',
        properties: common,
        required: ['paket', 'pembayaran', 'kecamatan', 'kota'],
      },
    },
    {
      name: 'buat_order',
      description: 'Buat order di Scalev. Panggil HANYA SEKALI, setelah lead mengonfirmasi ringkasan order (nama, alamat, paket, pembayaran, total).',
      input_schema: {
        type: 'object',
        properties: {
          ...common,
          nama: { type: 'string', description: 'Nama penerima' },
          alamat: { type: 'string', description: 'Nama jalan/gang/dusun + nomor rumah + RT/RW, contoh "Jl. Jagir Sidomukti Gg. 3 No. 12 RT 02/RW 05"' },
          patokan: { type: 'string', description: 'Patokan/ancer-ancer rumah, contoh "depan masjid Al Ikhlas, pagar hijau"' },
        },
        required: ['paket', 'pembayaran', 'kelurahan', 'kecamatan', 'kota', 'nama', 'alamat', 'patokan'],
      },
    },
  ];
}

const ORDER_RULE =
  "DATA PENGIRIMAN: setelah lead memilih paket, konfirmasi paket + bonus singkat lalu minta data dengan format isian persis seperti ini (1 pesan):\nLengkapi data order dulu ya kak 🙏\n\nNama:\nAlamat lengkap (RT/RW):\nPatokan (jika ada):\nDesa/kelurahan:\nKecamatan:\nPembayaran: COD atau transfer?\n" +
  "Kalau ada yang belum lengkap, tanyakan HANYA yang kurang dan sertakan alasannya: 'supaya paket tidak nyasar di ekspedisi dan bisa cepat sampai'. Kalau di desa memang tidak ada nomor rumah/RT/RW, patokan yang jelas + nama dusun sudah cukup. " +
  "ALAMAT: Kalau lead tidak menyebut kecamatan/kota, tentukan dari pengetahuanmu lalu panggil cek_ongkir untuk verifikasi. Hasil tool (alamat_resmi, kode_pos) adalah data resmi. Kalau tool bilang tidak ditemukan/ambigu, tanyakan kecamatannya. Jangan tanya kode pos/provinsi. " +
  "ONGKIR: WAJIB pakai cek_ongkir, jangan menebak. Pengiriman JNT dari gudang Surabaya. Total COD dari tool sudah termasuk biaya layanan COD; jangan sebut rinciannya kecuali ditanya. " +
  "KONFIRMASI: setelah data lengkap dan cek_ongkir berhasil, kirim ringkasan dengan format:\nBaik kak, berikut ringkasan ordernya ya\n\nPaket: <paket> (+ bonus sunscreen + eyeliner)\nNama:\nAlamat: <alamat, patokan>\nKel: <kelurahan>, Kec: <kecamatan>, <kota>\nPembayaran:\nOngkir:\nTotal bayar:\n\nSudah benar kak? saya proses ya\n" +
  "Cek kelengkapan data SEBELUM mengirim ringkasan, jangan minta data tambahan setelah lead konfirmasi. Begitu lead setuju (oke/iya/sip/lanjut/benar), langsung panggil buat_order. " +
  "SETELAH ORDER BERHASIL (COD), pakai format ini:\nSiap kak.. orderan kakak sudah saya masukkan ke prioritas pengiriman hari ini..\n\nEstimasi <estimasi dari tool>. Nanti bayar langsung ke kurir saat paket sampai *sebesar Rp<total>.*\n\nPastikan HP nya aktif ya.. dan mohon kerjasamanya, misal kakak dihubungi kurir mohon direspon ya, atau misal tidak ada di tempat bisa titipkan uangnya...\n\nKarena kalau paketnya gagal terkirim, saya yang harus bayar ongkir ke ekspedisi 🙏\n\nKita saling amanah ya kak..\nSemoga rezeki kakak selalu diperlancar oleh-Nya, aamiin...\n\nTerima kasih\nCS Filomall-Beauty\n" +
  "SETELAH ORDER BERHASIL (TRANSFER), pakai format ini:\nSiap kak.. orderan kakak sudah saya catat ya, total *Rp<total>*\n\nUntuk transfernya, ke salah satu rekening ini ya ...\n\nBCA 3890171132\nMandiri 1780000592416\nBRI 657301021749531\nBNI 0903702142\n\nSemua Rekening a.n N Hamidah\n\nMohon konfirmasi ya setelah transfer ☺️☺️\n" +
  "Jangan mengarang nomor rekening lain. Kalau lead mengirim bukti transfer/gambar setelah order transfer: ucapkan terima kasih, bilang segera dicek dan paket diprioritaskan, lalu akhiri dengan token [INFO_ADMIN]. " +
  "REVISI ORDER: kalau lead sudah order lalu ingin mengubah (COD <-> transfer, alamat, paket), kirim ringkasan baru dan minta konfirmasi, lalu panggil buat_order lagi dengan data lengkap terbaru. Sistem akan merevisi order yang sama (bukan order baru). Setelah revisi berhasil pakai template sesuai pembayaran barunya.";
