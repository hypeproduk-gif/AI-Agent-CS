// Langkah-langkah tool Scalev: lokasi → gudang → kurir JNT → total → order.
// Setiap fungsi murni; request HTTP-nya dilakukan node n8n di antaranya.

function paymentMethod(pembayaran) {
  return pembayaran === 'cod' ? 'cod' : 'bank_transfer';
}

function rupiah(n) {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

function normalize(s) {
  return String(s || '').toLowerCase().replace(/^(kec\.?|kecamatan|kab\.?|kabupaten|kota)\s+/g, '').trim();
}

// Syarat alamat order: jalan + nomor/RT, kelurahan, patokan.
function missingAddressParts(input) {
  const missing = [];
  const alamat = String(input.alamat || '').trim();
  if (alamat.length < 6) missing.push('nama jalan/gang/dusun');
  // Di desa sering tidak ada nomor/RT: nama dusun/dukuh + patokan sudah cukup.
  if (!/\d/.test(alamat) && !/\b(dusun|dsn|dukuh|dk|kampung|kp|lingkungan|lingk)\b\.?/i.test(alamat)) {
    missing.push('nomor rumah atau RT/RW (kalau tidak ada, sebutkan nama dusun)');
  }
  if (String(input.kelurahan || '').trim().length < 3) missing.push('desa/kelurahan');
  if (String(input.patokan || '').trim().length < 3) missing.push('patokan/ancer-ancer rumah');
  if (String(input.nama || '').trim().length < 2) missing.push('nama penerima');
  return missing;
}

// Mulai tool: validasi input + paket.
function startTool(toolUse, ctx) {
  const input = toolUse.input || {};
  const pkg = (PACKAGES[ctx.active_product] || {})[input.paket];
  const base = { toolUseId: toolUse.id, tool: toolUse.name, input, phone: ctx.phone };
  if (!pkg) return { ...base, ok: false, error: `Paket "${input.paket}" tidak tersedia untuk ${ctx.active_product}.` };
  if (toolUse.name === 'buat_order') {
    const missing = missingAddressParts(input);
    if (missing.length) {
      return { ...base, ok: false, error: `Alamat belum lengkap: ${missing.join(', ')}. Minta lead melengkapi dulu, JANGAN buat order.` };
    }
  }
  if (toolUse.name === 'buat_order' && ctx.lastOrder) {
    return { ...base, ok: false, error: `Lead ini sudah punya order ${ctx.lastOrder} dalam ${SCALEV.duplicateOrderHours} jam terakhir. Jangan buat order baru; minta tim CS membantu kalau lead mau mengubah order. [HANDOFF]` };
  }
  return { ...base, ok: true, pkg, search: normalize(input.kecamatan) };
}

// Pilih lokasi dari GET /v3/locations?search=<kecamatan>.
function pickLocation(state, response) {
  if (!state.ok) return state;
  const list = (response && response.data) || [];
  const city = normalize(state.input.kota);
  const matches = city ? list.filter((l) => normalize(l.city_name).includes(city)) : list;
  if (matches.length === 1 || (matches.length > 1 && matches.every((m) => m.id === matches[0].id))) {
    return { ...state, location: matches[0] };
  }
  if (!matches.length) {
    return { ...state, ok: false, error: `Kecamatan "${state.input.kecamatan}, ${state.input.kota}" tidak ditemukan. Minta lead cek ejaan kecamatan & kota.` };
  }
  const options = matches.slice(0, 5).map((m) => m.display).join('; ');
  return { ...state, ok: false, error: `Ada beberapa lokasi cocok: ${options}. Tanyakan ke lead yang mana.` };
}

// Kode pos dari GET /v3/locations/{id}/postal-codes. Bentuk item belum pasti, jadi dibaca longgar.
function postalOptions(response) {
  return ((response && response.data) || []).map((item) => {
    if (typeof item === 'string' || typeof item === 'number') return { code: String(item), area: '' };
    const code = item.postal_code || item.code || item.zip_code || item.kode_pos || '';
    const area = item.urban || item.village || item.kelurahan || item.name || item.area || '';
    return { code: String(code), area: String(area) };
  }).filter((o) => /^\d{5}$/.test(o.code));
}

function pickPostalCode(state, response) {
  if (!state.ok) return state;
  const options = postalOptions(response);
  const given = String(state.input.kode_pos || '').trim();
  const kel = normalize(state.input.kelurahan).replace(/^(kel\.?|kelurahan|desa|ds\.?)\s+/, '');
  const byArea = kel ? options.filter((o) => o.area && normalize(o.area).includes(kel)) : [];
  const uniqueCodes = [...new Set(options.map((o) => o.code))];
  let postal = '';
  if (given && (!options.length || uniqueCodes.includes(given))) postal = given;
  else if (byArea.length) postal = byArea[0].code;
  else if (uniqueCodes.length === 1) postal = uniqueCodes[0];
  return { ...state, postal, postalOptions: postal ? [] : options.slice(0, 10) };
}

function warehouseRequest(state) {
  return {
    store_id: SCALEV.storeId,
    destination_id: state.location.id,
    variants: state.pkg.items.map((i) => ({ variant_id: i.variantId, qty: i.qty })),
  };
}

// Pilih gudang Surabaya dari POST /v3/shipping-costs/search-warehouse.
function pickWarehouse(state, response) {
  if (!state.ok) return state;
  const list = ((response && response.data) || []).map((d) => d.warehouse).filter(Boolean);
  const city = normalize(SCALEV.warehouseCity);
  const wh = list.find((w) => normalize((w.warehouse_address || {}).city).includes(city)) || list[0];
  if (!wh) return { ...state, ok: false, error: 'Gudang tidak ditemukan untuk paket ini. [HANDOFF]', internal: response };
  return { ...state, warehouse: { id: wh.id, uniqueId: wh.unique_id, name: wh.name } };
}

function courierRequest(state) {
  return {
    store_id: SCALEV.storeId,
    warehouse_id: state.warehouse.id,
    location_id: state.location.id,
    payment_method: paymentMethod(state.input.pembayaran),
    weight: state.pkg.weight,
    ...(state.postal ? { postal_code: state.postal } : {}),
  };
}

// Pilih layanan JNT via Mengantar (termurah), hitung total.
function pickCourier(state, response) {
  if (!state.ok) return state;
  const isCod = state.input.pembayaran === 'cod';
  const services = ((response && response.data) || []).filter((s) => {
    const cs = s.courier_service || {};
    const courier = cs.courier || {};
    return s.shipment_provider_code === SCALEV.providerCode &&
      SCALEV.courierPattern.test(`${courier.code} ${courier.name} ${cs.name}`) &&
      (!isCod || s.is_cod);
  }).sort((a, b) => a.cost - b.cost);

  if (!services.length) {
    const why = isCod ? 'JNT COD tidak tersedia ke lokasi ini. Tawarkan transfer.' : 'JNT tidak tersedia ke lokasi ini. [HANDOFF]';
    // Untuk admin: kurir apa saja yang sebenarnya dikembalikan Scalev.
    const available = ((response && response.data) || []).map((s) => {
      const cs = s.courier_service || {};
      return `${(cs.courier || {}).name} ${cs.name} via ${s.shipment_provider_code || '-'}${s.is_cod ? ' (COD)' : ''}`;
    });
    return { ...state, ok: false, error: why, kurir_tersedia: available };
  }
  const svc = services[0];
  const price = state.pkg.price;
  const shipping = svc.cost;
  const codFee = isCod ? Math.ceil((price + shipping) * SCALEV.codFeeRate) : 0;
  return {
    ...state,
    courier: { id: svc.courier_service.id, name: `${svc.courier_service.courier.name} ${svc.courier_service.name}`, etd: svc.etd },
    totals: { price, shipping, codFee, total: price + shipping + codFee },
  };
}

// Hanya membuat order. Bot sengaja TIDAK memanggil generate-awb / Request Pickup:
// pickup ditangani langganan pickup sendiri di Mengantar.
function orderRequest(state, ctx) {
  const i = state.input;
  const body = {
    store_unique_id: SCALEV.storeUniqueId,
    customer_name: `${SCALEV.namePrefix || ''}${i.nama}`,
    customer_phone: state.phone,
    address: `${i.alamat}, ${i.kelurahan}${i.patokan ? ` (Patokan: ${i.patokan})` : ''}`,
    location_id: state.location.id,
    warehouse_unique_id: state.warehouse.uniqueId,
    courier_service_id: state.courier.id,
    shipping_cost: state.totals.shipping,
    shipment_provider_code: SCALEV.providerCode,
    payment_method: paymentMethod(i.pembayaran),
    ordervariants: state.pkg.items.map((it) => ({ variant_unique_id: it.variantUniqueId, quantity: it.qty })),
    notes: state.pkg.note || state.pkg.label,
    metadata: { source: 'ai-agent-cs', ref: ctx.ref || '' },
  };
  if (state.postal) body.postal_code = state.postal;
  if (state.totals.codFee) {
    body.other_income = state.totals.codFee;
    body.other_income_name = SCALEV.codFeeName;
  }
  return body;
}

// Susun tool_result untuk Claude + data ringkas untuk notif & penyimpanan.
function toolResult(state, orderResponse) {
  let content;
  let order = null;
  if (!state.ok) {
    content = { ok: false, error: state.error };
  } else {
    const t = state.totals;
    content = {
      ok: true,
      paket: state.pkg.label,
      alamat_resmi: `${state.input.kelurahan ? state.input.kelurahan + ', ' : ''}${state.location.display}`,
      kode_pos: state.postal || null,
      pilihan_kode_pos: state.postal ? undefined : (state.postalOptions || []).map((o) => (o.area ? `${o.code} (${o.area})` : o.code)),
      kurir: state.courier.name,
      estimasi: state.courier.etd,
      harga_produk: rupiah(t.price),
      ongkir: rupiah(t.shipping),
      biaya_cod: t.codFee ? rupiah(t.codFee) : null,
      total: rupiah(t.total),
    };
    if (state.tool === 'buat_order') {
      if (orderResponse && orderResponse.order_id) {
        order = {
          id: orderResponse.id,
          orderId: orderResponse.order_id,
          total: t.total,
          price: t.price,
          shipping: t.shipping,
          codFee: t.codFee,
          method: state.input.pembayaran,
          paket: state.input.paket,
          note: state.pkg.note || state.pkg.label,
          variants: state.pkg.items.map((it) => ({ variant_unique_id: it.variantUniqueId, quantity: it.qty })),
          name: state.input.nama,
          city: state.location.city_name || '',
          province: state.location.province_name || '',
        };
        content.order_id = orderResponse.order_id;
        if (state.input.pembayaran !== 'cod') content.link_pembayaran = orderResponse.public_order_url || orderResponse.payment_url;
      } else {
        const msg = (orderResponse && (orderResponse.message || (orderResponse.error && orderResponse.error.message))) || 'gagal';
        content = { ok: false, error: `Order gagal dibuat (${msg}). Bilang tim CS akan bantu proses. [HANDOFF]` };
      }
    }
  }
  return {
    block: { type: 'tool_result', tool_use_id: state.toolUseId, content: JSON.stringify(content), is_error: !content.ok },
    order,
  };
}
