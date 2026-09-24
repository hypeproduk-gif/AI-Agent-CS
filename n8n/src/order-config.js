// Konfigurasi Scalev. ID diambil dari output workflow "AI Agent CS - Scalev Setup".

const SCALEV = {
  storeId: 2709, // Filomall Beauty
  storeUniqueId: 'store_WQ9th267cKN4103Qini2iUW5',
  warehouseCity: 'Surabaya', // gudang asal
  providerCode: 'mengantar',
  courierPattern: /j\s*&?\s*t|jnt/i, // JNT (J&T Express)
  codFeeRate: 0.03, // 3% dari (harga produk + ongkir)
  codFeeName: 'Biaya COD 3%',
  duplicateOrderHours: 6, // cegah order dobel dari nomor yang sama
};

// Paket yang bisa di-order lewat bot. variantId = integer, variantUniqueId = string "variant_...".
const PACKAGES = {
  SalGlow: {
    B1G1: {
      label: 'SalGlow Beli 1 Gratis 1',
      price: 139000,
      weight: 200, // gram, total paket
      items: [{ variantId: 8419, variantUniqueId: 'variant_T2ffVOfNELb6rwSTNTf9xw8A', qty: 1 }], // 2 Salep Glowing Filo (139.000)
    },
    B2G2: {
      label: 'SalGlow Beli 2 Gratis 2',
      price: 219000,
      weight: 400,
      items: [{ variantId: 8421, variantUniqueId: 'variant_EWWpG6ef8GdXo617vHyFEyP6', qty: 1 }], // 4 Salep Glowing Filo (219.000)
    },
  },
};
