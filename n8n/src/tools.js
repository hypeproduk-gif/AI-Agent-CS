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
  "DATA PENGIRIMAN: setelah lead memilih paket, minta sekaligus dalam 1 pesan berbentuk daftar: nama penerima; alamat lengkap (nama jalan/dusun, nomor rumah, RT/RW, patokan); desa/kelurahan; kecamatan; dan pembayaran COD atau transfer. Kalau ada yang belum lengkap, tanyakan HANYA yang kurang dan sertakan alasannya: 'supaya paket tidak nyasar di ekspedisi dan bisa cepat sampai'. Kalau di desa memang tidak ada nomor rumah/RT/RW, patokan yang jelas + nama dusun sudah cukup. " +
  "ALAMAT: Kalau lead tidak menyebut kecamatan/kota, tentukan dari pengetahuanmu lalu panggil cek_ongkir untuk verifikasi. Hasil tool (alamat_resmi, kode_pos) adalah data resmi. Kalau tool bilang tidak ditemukan/ambigu, tanyakan kecamatannya. Jangan tanya kode pos/provinsi. " +
  "ONGKIR: WAJIB pakai cek_ongkir, jangan menebak. Pengiriman JNT dari gudang Surabaya. COD kena biaya 3% dari total (produk + ongkir). " +
  "KONFIRMASI: setelah semua data lengkap dan cek_ongkir berhasil, kirim ringkasan singkat (paket, nama, alamat lengkap sampai kecamatan/kota, patokan, pembayaran, ongkir, total) lalu tutup dengan 'Kalau sudah sesuai, saya proses ya kak.' Cek kelengkapan data SEBELUM mengirim ringkasan, jangan minta data tambahan setelah lead konfirmasi. Begitu lead setuju (oke/iya/sip/lanjut), langsung panggil buat_order. " +
  "SETELAH ORDER BERHASIL: balas dengan nada tenang: 'Oke kak, data order sudah masuk sistem order toko kami dan sudah saya prioritaskan untuk pengiriman.' Lalu 1-2 kalimat: kurir dan estimasi dari hasil tool; COD -> nominal yang dibayar ke kurir saat paket sampai; transfer -> kirim link pembayaran dari hasil tool. Tutup dengan 1 kalimat cara pakai: oles tipis merata di wajah malam hari, pagi wajib sunscreen. Jangan memakai kata girang seperti 'Yeay' atau 'Mantap'.";
