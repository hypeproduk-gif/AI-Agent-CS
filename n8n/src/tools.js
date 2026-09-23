// Tool Claude untuk cek ongkir & buat order Scalev (hanya produk yang punya PACKAGES).

function orderTools(product) {
  const packages = Object.keys(PACKAGES[product] || {});
  if (!packages.length) return null;
  const common = {
    paket: { type: 'string', enum: packages, description: 'Paket yang dipilih lead' },
    pembayaran: { type: 'string', enum: ['cod', 'transfer'], description: 'COD atau transfer bank' },
    kecamatan: { type: 'string', description: 'Nama kecamatan tujuan, contoh "Wonokromo"' },
    kota: { type: 'string', description: 'Kota/kabupaten tujuan, contoh "Surabaya"' },
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
          alamat: { type: 'string', description: 'Alamat jalan saja (jalan, nomor, RT/RW, patokan), tanpa kecamatan/kota' },
          kode_pos: { type: 'string', description: 'Kode pos kalau lead menyebutkan' },
        },
        required: ['paket', 'pembayaran', 'kecamatan', 'kota', 'nama', 'alamat'],
      },
    },
  ];
}

const ORDER_RULE =
  "ORDER: Kalau lead mau beli, kumpulkan: paket (B1G1/B2G2), COD atau transfer, nama, alamat jalan, kecamatan, kota. Tanya yang belum ada secara natural, 1-2 hal per balasan. Untuk ongkir, WAJIB pakai tool cek_ongkir, jangan menebak. Pengiriman selalu JNT dari gudang Surabaya. COD kena biaya 3% dari total (produk + ongkir). Sebelum buat_order, kirim ringkasan (paket, nama, alamat lengkap, pembayaran, ongkir, total) dan minta lead konfirmasi. Setelah order berhasil: kalau transfer, kirim link pembayaran dari hasil tool; kalau COD, bilang paket segera diproses dan bayar ke kurir saat diterima.";
