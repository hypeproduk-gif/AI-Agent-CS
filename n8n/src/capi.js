// Event Purchase ke Meta lewat relay Conversion API Scalev
// (POST /v3/stores/{store}/public/analytics/meta/events, header X-Scalev-Storefront-Api-Key).

function normalizePhone(phone) {
  const d = String(phone || '').replace(/\D/g, '');
  return d.startsWith('0') ? '62' + d.slice(1) : d;
}

function purchaseEvent(order, phone, attribution) {
  const a = attribution || {};
  const userData = {
    country: 'id',
    ph: normalizePhone(phone),
    external_id: normalizePhone(phone),
    fn: String(order.name || '').replace(/^\[[^\]]*\]\s*/, '').split(' ')[0].toLowerCase() || undefined,
    ct: String(order.city || '').replace(/^(kota|kab\.?|kabupaten)\s+/i, '').toLowerCase() || undefined,
    st: String(order.province || '').toLowerCase() || undefined,
    fbc: a.fbc || undefined,
    fbp: a.fbp || undefined,
    client_ip_address: a.client_ip || undefined,
    client_user_agent: a.user_agent || undefined,
  };
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);
  return {
    event_source_url: a.landing_url || undefined,
    user_data: userData,
    events: [{
      event_id: `${order.orderId}-Purchase`,
      event_name: 'Purchase',
      parameters: {
        value: order.price,
        currency: 'IDR',
        content_type: 'product',
        content_ids: order.variants.map((v) => v.variant_unique_id),
        content_name: order.note,
        num_items: order.variants.reduce((n, v) => n + v.quantity, 0),
      },
    }],
    variants: order.variants,
  };
}
