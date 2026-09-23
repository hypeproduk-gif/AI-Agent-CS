/*
 * LP → WhatsApp dengan capture atribusi Meta (fbclid / _fbc / _fbp).
 *
 * Pasang di LP mana pun:
 *   <script>
 *     window.AICS = {
 *       product: 'KJN',                  // SG | KK | KJN
 *       waNumber: '6285180108370',
 *       message: 'Halo kak, mau info Kit Jelang Nikah',
 *       endpoint: 'https://hypeproduk.app.n8n.cloud/webhook/lp-attribution',
 *       pixelEvent: 'Contact',           // opsional, butuh Meta Pixel terpasang
 *     };
 *   </script>
 *   <script src="wa-redirect.js"></script>
 *   <a href="#" data-wa-cta>Chat via WhatsApp</a>
 *
 * Alur: klik CTA → buat kode ref (mis. KJN-7Q2MX) → kirim atribusi ke n8n →
 * buka wa.me dengan kode ref di pesan. Bot CS membaca kode itu untuk
 * mengunci produk dan menyambungkan chat ke data iklan.
 */
(function () {
  var cfg = window.AICS || {};
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
    if (!cfg.endpoint) return;
    var body = JSON.stringify(payload);
    if (navigator.sendBeacon && navigator.sendBeacon(cfg.endpoint, new Blob([body], { type: 'text/plain' }))) return;
    fetch(cfg.endpoint, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' });
  }

  function onClick(e) {
    e.preventDefault();
    var saved = readStored();
    var ref = (cfg.product || 'SG') + '-' + randomCode(5);
    var payload = {
      ref: ref,
      product: cfg.product || 'SG',
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
    };
    send(payload);

    if (window.fbq && cfg.pixelEvent) {
      window.fbq('track', cfg.pixelEvent, { content_name: cfg.product }, { eventID: ref });
    }

    var text = (cfg.message || 'Halo kak, mau info') + ' (kode: ' + ref + ')';
    var url = 'https://wa.me/' + cfg.waNumber + '?text=' + encodeURIComponent(text);
    setTimeout(function () { location.href = url; }, 150);
  }

  captureParams();
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-wa-cta]');
    if (el) onClick(e);
  });
})();
