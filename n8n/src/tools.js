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
  "ORDER: Kalau lead mau beli, kumpulkan: paket (B1G1/B2G2), COD atau transfer, nama penerima, alamat lengkap (jalan/gang/dusun + nomor rumah + RT/RW), desa/kelurahan, patokan/ancer-ancer rumah. Minta sekaligus dalam 1 pesan dengan format singkat, lalu tanyakan hanya yang masih kurang. " +
  "ALAMAT: Kalau lead hanya menyebut desa/kelurahan, JANGAN tanya kecamatan/kota/provinsi/kode pos; tentukan sendiri kecamatan & kota dari pengetahuanmu, lalu panggil cek_ongkir untuk verifikasi. Hasil tool (alamat_resmi, kode_pos) adalah data resmi: pakai itu di ringkasan dan minta lead konfirmasi ('Kel. X masuk Kec. Y, Kota Z, Provinsi, kode pos N ya kak?'). Kalau tool bilang tidak ditemukan/ambigu, baru tanya kecamatannya. " +
  "Untuk ongkir, WAJIB pakai tool cek_ongkir, jangan menebak. Pengiriman selalu JNT dari gudang Surabaya. COD kena biaya 3% dari total (produk + ongkir). Sebelum buat_order, kirim ringkasan rapi (paket, nama, alamat lengkap sampai provinsi & kode pos, patokan, pembayaran, ongkir, total) dan minta lead konfirmasi. buat_order hanya boleh dipanggil kalau alamat, nomor/RT, kelurahan, dan patokan sudah lengkap DAN lead sudah konfirmasi ringkasan. Setelah order berhasil: kalau transfer, kirim link pembayaran dari hasil tool; kalau COD, bilang paket segera diproses dan bayar ke kurir saat diterima.";
