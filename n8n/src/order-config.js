// Konfigurasi Scalev per store. ID diambil dari output workflow "AI Agent CS - Scalev Setup".
// Workflow produksi memakai profil 'prod'; workflow TEST memakai profil 'test' (diganti saat build).

const STORE_PROFILE = 'prod';

const STORES = {
  prod: {
    storeId: 2709, // Filomall Beauty
    storeUniqueId: 'store_WQ9th267cKN4103Qini2iUW5',
    variants: {
      B1G1: { variantId: 8419, variantUniqueId: 'variant_T2ffVOfNELb6rwSTNTf9xw8A' }, // 2 Salep Glowing Filo (139.000)
      B2G2: { variantId: 8421, variantUniqueId: 'variant_EWWpG6ef8GdXo617vHyFEyP6' }, // 4 Salep Glowing Filo (219.000)
    },
    orderNotePrefix: '[TEST AI] ', // hapus (jadi '') kalau bot sudah dianggap final
  },
  test: {
    storeId: 0, // ISI: store_id store tes
    storeUniqueId: 'ISI_STORE_UNIQUE_ID_TES',
    variants: {
      B1G1: { variantId: 0, variantUniqueId: 'ISI_VARIANT_B1G1_TES' },
      B2G2: { variantId: 0, variantUniqueId: 'ISI_VARIANT_B2G2_TES' },
    },
    orderNotePrefix: '[TES BOT] ',
  },
};

const ACTIVE_STORE = STORES[STORE_PROFILE];

const SCALEV = {
  storeId: ACTIVE_STORE.storeId,
  storeUniqueId: ACTIVE_STORE.storeUniqueId,
  orderNotePrefix: ACTIVE_STORE.orderNotePrefix,
  warehouseCity: 'Surabaya', // gudang asal
  providerCode: 'mengantar',
  courierPattern: /j\s*&?\s*t|jnt/i, // JNT (J&T Express)
  codFeeRate: 0.03, // 3% dari (harga produk + ongkir)
  codFeeName: 'Biaya COD 3%',
  duplicateOrderHours: 6, // cegah order dobel dari nomor yang sama
};

// Paket yang bisa di-order lewat bot.
const PACKAGES = {
  SalGlow: {
    B1G1: {
      label: 'SalGlow Beli 1 Gratis 1',
      price: 139000,
      weight: 200, // gram, total paket
      items: [{ ...ACTIVE_STORE.variants.B1G1, qty: 1 }],
    },
    B2G2: {
      label: 'SalGlow Beli 2 Gratis 2',
      price: 219000,
      weight: 400,
      items: [{ ...ACTIVE_STORE.variants.B2G2, qty: 1 }],
    },
  },
};
