// Konfigurasi Scalev. Isi nilai "ISI_..." pakai output workflow "AI Agent CS - Scalev Setup".

const SCALEV = {
  storeId: 0, // integer, dari stores[].id
  storeUniqueId: 'ISI_STORE_UNIQUE_ID', // dari stores[].unique_id
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
      items: [{ variantId: 0, variantUniqueId: 'ISI_VARIANT_UNIQUE_ID_B1G1', qty: 1 }],
    },
    B2G2: {
      label: 'SalGlow Beli 2 Gratis 2',
      price: 219000,
      weight: 400,
      items: [{ variantId: 0, variantUniqueId: 'ISI_VARIANT_UNIQUE_ID_B2G2', qty: 1 }],
    },
  },
};
