/*
 * LP → WhatsApp dengan capture atribusi Meta (fbclid / _fbc / _fbp).
 *
 * Cara pakai di Scalev (atau LP lain):
 *   1. Tombol WhatsApp cukup diberi link wa.me biasa, contoh:
 *      https://wa.me/6285180108370?text=Halo%20kak%2C%20mau%20tanya%20salep%20glowing%20filo
 *   2. Tempel script ini (custom code / HTML) di halaman yang sama:
 *      <script>window.AICS = { product: 'SG' };</script>
 *      <script src="https://cdn.jsdelivr.net/gh/.../wa-redirect.js"></script>  (atau isi script langsung)
 *
 * Saat tombol diklik, script:
 *   - menempelkan kode unik di akhir pesan WA (mis. #promo7Q2MX),
 *   - mengirim fbclid/_fbc/_fbp/UTM/IP (dicatat server)/user agent ke n8n (webhook lp-attribution),
 *   - lalu membuka WhatsApp seperti biasa.
 * Kalau script gagal dimuat, link wa.me tetap jalan normal (hanya tanpa atribusi).
 * Pixel InitiateCheckout tetap ditangani Scalev; script ini tidak menembak pixel kecuali pixelEvent diisi.
 */
(function () {
  var cfg = window.AICS || {};
  var PRODUCT = cfg.product || 'SG';
  var ENDPOINT = cfg.endpoint || 'https://hypeproduk.app.n8n.cloud/webhook/lp-attribution';
  var PARAMS = ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var STORE_KEY = 'aics_attr';
  var DAY = 86400000;

  function getCookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }

  function setCookie(name, value, days) {
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; max-age=' + days * 86400 + '; path=/; SameSite=Lax';
  }

  function randomCode(len) {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    var buf = new Uint32Array(len);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < len; i++) out += chars[buf[i] % chars.length];
    return out;
  }

  function readStored() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }

  function store(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  // Simpan parameter URL saat halaman dibuka (first-touch dipertahankan 7 hari).
  function captureParams() {
    var q = new URLSearchParams(location.search);
    var saved = readStored();
    if (saved.ts && Date.now() - saved.ts > 7 * DAY) saved = {};
    PARAMS.forEach(function (k) {
      var v = q.get(k);
      if (v && !saved[k]) saved[k] = v;
    });
    if (!saved.ts) saved.ts = Date.now();
    if (saved.fbclid && !saved.fbc) saved.fbc = 'fb.1.' + Date.now() + '.' + saved.fbclid;
    store(saved);

    // Format _fbc sesuai Meta: fb.1.<timestamp ms>.<fbclid>
    if (q.get('fbclid') && !getCookie('_fbc')) {
      setCookie('_fbc', 'fb.1.' + Date.now() + '.' + q.get('fbclid'), 90);
    }
    return saved;
  }

  function send(payload) {
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return;
    } catch (e) {}
    try { fetch(ENDPOINT, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' }); } catch (e) {}
  }

  // Ambil nomor & pesan dari link WhatsApp (wa.me atau api.whatsapp.com).
  function parseWaLink(href) {
    try {
      var u = new URL(href, location.href);
      var host = u.hostname.replace(/^www\./, '');
      if (host === 'wa.me') return { phone: u.pathname.replace(/\D/g, ''), text: u.searchParams.get('text') || '' };
      if (/(^|\.)whatsapp\.com$/.test(host)) return { phone: (u.searchParams.get('phone') || '').replace(/\D/g, ''), text: u.searchParams.get('text') || '' };
    } catch (e) {}
    return null;
  }

  function buildWaUrl(phone, text) {
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
  }

  function handle(e, el, wa) {
    e.preventDefault();
    var saved = readStored();
    var code = randomCode(5);
    var ref = 'PROMO' + code; // tampil di pesan sebagai #promo<kode>
    send({
      ref: ref,
      product: PRODUCT,
      fbclid: saved.fbclid || '',
      fbc: getCookie('_fbc') || saved.fbc || '',
      fbp: getCookie('_fbp'),
      utm_source: saved.utm_source || '',
      utm_medium: saved.utm_medium || '',
      utm_campaign: saved.utm_campaign || '',
      utm_content: saved.utm_content || '',
      utm_term: saved.utm_term || '',
      landing_url: location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      clicked_at: new Date().toISOString(),
    });

    if (window.fbq && cfg.pixelEvent) {
      window.fbq('track', cfg.pixelEvent, { content_name: PRODUCT }, { eventID: ref });
    }

    var phone = (wa && wa.phone) || cfg.waNumber;
    var text = ((wa && wa.text) || cfg.message || 'Halo kak') + ' #promo' + code;
    var url = buildWaUrl(phone, text);
    var newTab = el.getAttribute('target') === '_blank';
    setTimeout(function () {
      if (newTab) window.open(url, '_blank'); else location.href = url;
    }, 250);
  }

  captureParams();
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a[href], [data-wa-cta]');
    if (!el) return;
    var wa = el.hasAttribute('href') ? parseWaLink(el.getAttribute('href')) : null;
    if (wa && wa.phone) handle(e, el, wa);
    else if (el.hasAttribute('data-wa-cta') && cfg.waNumber) handle(e, el, null);
  }, true);
})();
