// Inti generator: RNG berbibit (bank soal selalu sama), pembuat soal pilihan ganda, helper SVG.
(function (G) {
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeKit(seed) {
    const r = rng(seed);
    const K = {
      r,
      int: (a, b) => a + Math.floor(r() * (b - a + 1)),
      pick: (arr) => arr[Math.floor(r() * arr.length)],
      shuffle(arr) { const x = arr.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; },
      sample(arr, n) { return K.shuffle(arr).slice(0, n); },
      gcd: (a, b) => (b ? K.gcd(b, a % b) : Math.abs(a)),
      lcm: (a, b) => (a / K.gcd(a, b)) * b,
      fr(n, d) { // pecahan disederhanakan -> string
        const g = K.gcd(n, d); n /= g; d /= g;
        if (d === 1) return String(n);
        if (n > d) { const w = Math.floor(n / d); return w + " " + (n % d) + "/" + d; }
        return n + "/" + d;
      },
      num: (x) => Number(x).toLocaleString("id-ID", { maximumFractionDigits: 3 }),
      // Buat soal PG: jawaban benar + pengecoh -> 4 opsi unik teracak
      mk(level, topik, q, benar, pengecoh, bahas, img) {
        benar = String(benar);
        const seen = new Set([benar]); const d = [];
        for (const p of pengecoh) { const s = String(p); if (!seen.has(s)) { seen.add(s); d.push(s); } if (d.length === 3) break; }
        if (d.length < 3) return null;
        const opsi = K.shuffle([benar, ...d]);
        return { level, topik, q, img: img || null, opsi, jawab: opsi.indexOf(benar), bahas: bahas || "" };
      },
      // Pengecoh angka di sekitar jawaban
      near(x, spread) { const out = []; const s = spread || Math.max(1, Math.round(Math.abs(x) * 0.15)); for (let i = 0; i < 12; i++) { const v = x + K.pick([-1, 1]) * K.int(1, s); if (v !== x && v >= 0) out.push(v); } return out; },
    };
    return K;
  }
  // Kumpulkan soal unik sampai kuota per level terpenuhi
  function build(mapel, seed, templates, quota) {
    const K = makeKit(seed); const out = []; const seen = new Set();
    for (const lv of [1, 2, 3]) {
      const ts = templates[lv]; let got = 0, tries = 0, i = 0;
      const cap = Math.ceil((quota[lv] * 2.5) / ts.length), used = ts.map(() => 0);
      while (got < quota[lv] && tries < quota[lv] * 80) {
        tries++; const ti = i++ % ts.length; const t = ts[ti];
        if (used[ti] >= cap && tries < quota[lv] * 40) continue;
        const s = t(K); if (!s) continue;
        const key = s.q + "|" + (s.img || "") + "|" + s.opsi[s.jawab];
        if (seen.has(key)) continue;
        seen.add(key); used[ti]++; s.level = lv; s.mapel = mapel; out.push(s); got++;
      }
    }
    // Acak dalam level supaya topik bercampur tiap hari
    const res = [];
    for (const lv of [1, 2, 3]) res.push(...K.shuffle(out.filter((x) => x.level === lv)));
    res.forEach((s, i) => (s.id = mapel + "-" + String(i + 1).padStart(4, "0")));
    return res;
  }
  // ---------- SVG ----------
  const S = {
    wrap: (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">${body}</svg>`,
    text: (x, y, t, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || "middle"}" fill="${(o && o.c) || "#222"}" font-size="${(o && o.s) || 14}">${t}</text>`,
    rectLabel(p, l, sat) {
      const W = 220, H = Math.max(60, Math.min(140, Math.round((220 * l) / p)));
      return S.wrap(300, H + 50, `<rect x="40" y="10" width="${W}" height="${H}" fill="#ffe8a3" stroke="#c48a00" stroke-width="2"/>` + S.text(150, H + 32, p + " " + sat) + S.text(270, 10 + H / 2 + 5, l + " " + sat, { a: "start" }));
    },
    square(s, sat) { return S.wrap(240, 180, `<rect x="50" y="15" width="130" height="130" fill="#cfe9ff" stroke="#1a6fb5" stroke-width="2"/>` + S.text(115, 168, s + " " + sat)); },
    triangle(a, t, sat) {
      return S.wrap(280, 190, `<polygon points="30,160 250,160 110,20" fill="#d6f5d6" stroke="#2e8b57" stroke-width="2"/><line x1="110" y1="20" x2="110" y2="160" stroke="#c00" stroke-dasharray="5 4"/><rect x="110" y="150" width="10" height="10" fill="none" stroke="#c00"/>` + S.text(140, 182, "alas = " + a + " " + sat) + S.text(115, 95, "t = " + t + " " + sat, { a: "start", c: "#c00" }));
    },
    box(p, l, t, sat) { // balok/kubus isometrik
      const P = 150, L = 60, T = p === l && l === t ? 110 : 90;
      const x = 30, y = 50;
      return S.wrap(300, 210,
        `<polygon points="${x},${y} ${x + P},${y} ${x + P + L},${y - 35} ${x + L},${y - 35}" fill="#e3d4ff" stroke="#5b3fa8" stroke-width="2"/>` +
        `<polygon points="${x + P},${y} ${x + P + L},${y - 35} ${x + P + L},${y - 35 + T} ${x + P},${y + T}" fill="#c9b3f5" stroke="#5b3fa8" stroke-width="2"/>` +
        `<rect x="${x}" y="${y}" width="${P}" height="${T}" fill="#efe6ff" stroke="#5b3fa8" stroke-width="2"/>` +
        S.text(x + P / 2, y + T + 20, p + " " + sat) + S.text(x + P + L / 2 + 22, y + T - 5, l + " " + sat) + S.text(x - 4, y + T / 2, t + " " + sat, { a: "end" }));
    },
    lshape(a, b, c, d, sat) { // gabungan: persegi panjang a x b dikurangi sudut c x d
      const k = 180 / Math.max(a, b); const A = a * k, B = b * k, C = c * k, D = d * k;
      return S.wrap(300, 240, `<polygon points="40,20 ${40 + A - C},20 ${40 + A - C},${20 + D} ${40 + A},${20 + D} ${40 + A},${20 + B} 40,${20 + B}" fill="#ffd9d9" stroke="#b22" stroke-width="2"/>` +
        S.text(40 + A / 2, 40 + B, a + " " + sat) + S.text(32, 20 + B / 2, b + " " + sat, { a: "end" }) + S.text(40 + (A - C) / 2, 15, a - c + " " + sat) + S.text(48 + A, 20 + D + (B - D) / 2, b - d + " " + sat, { a: "start" }));
    },
    bars(labels, vals, title, unit) {
      const max = Math.max(...vals), W = 60 + labels.length * 55, H = 200;
      let b = S.text(W / 2, 16, title, { s: 13 });
      const top = Math.ceil(max / 5) * 5 || 5;
      for (let i = 0; i <= 5; i++) { const v = (top / 5) * i, y = 170 - (v / top) * 140; b += `<line x1="40" x2="${W - 10}" y1="${y}" y2="${y}" stroke="#ddd"/>` + S.text(34, y + 4, v, { a: "end", s: 11 }); }
      labels.forEach((l, i) => { const h = (vals[i] / top) * 140; b += `<rect x="${52 + i * 55}" y="${170 - h}" width="34" height="${h}" fill="#4f8edc"/>` + S.text(69 + i * 55, 188, l, { s: 11 }); });
      return S.wrap(W, H + 10, b + (unit ? S.text(8, 30, unit, { a: "start", s: 10 }) : ""));
    },
    fracCircle(n, d) {
      let b = ""; const cx = 90, cy = 90, R = 70;
      for (let i = 0; i < d; i++) {
        const a1 = (2 * Math.PI * i) / d - Math.PI / 2, a2 = (2 * Math.PI * (i + 1)) / d - Math.PI / 2;
        const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1), x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
        b += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${d === 1 ? 1 : 0} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${i < n ? "#ff9f43" : "#fff"}" stroke="#333" stroke-width="2"/>`;
      }
      return S.wrap(180, 180, b);
    },
    fracGrid(n, d) {
      const w = Math.min(40, 260 / d); let b = "";
      for (let i = 0; i < d; i++) b += `<rect x="${10 + i * w}" y="10" width="${w}" height="60" fill="${i < n ? "#2ecc71" : "#fff"}" stroke="#333" stroke-width="2"/>`;
      return S.wrap(20 + d * w, 80, b);
    },
    clock(h, m) {
      const ah = ((h % 12) + m / 60) * 30 * (Math.PI / 180), am = m * 6 * (Math.PI / 180);
      let b = `<circle cx="90" cy="90" r="80" fill="#fff" stroke="#333" stroke-width="4"/>`;
      for (let i = 1; i <= 12; i++) { const a = (i * 30 * Math.PI) / 180; b += S.text(90 + 64 * Math.sin(a), 95 - 64 * Math.cos(a), i, { s: 15 }); }
      b += `<line x1="90" y1="90" x2="${(90 + 40 * Math.sin(ah)).toFixed(1)}" y2="${(90 - 40 * Math.cos(ah)).toFixed(1)}" stroke="#222" stroke-width="6" stroke-linecap="round"/>`;
      b += `<line x1="90" y1="90" x2="${(90 + 60 * Math.sin(am)).toFixed(1)}" y2="${(90 - 60 * Math.cos(am)).toFixed(1)}" stroke="#d33" stroke-width="3" stroke-linecap="round"/><circle cx="90" cy="90" r="5"/>`;
      return S.wrap(180, 180, b);
    },
    angle(deg) {
      const a = (deg * Math.PI) / 180, x = 40, y = 130;
      return S.wrap(260, 150, `<line x1="${x}" y1="${y}" x2="${x + 190}" y2="${y}" stroke="#333" stroke-width="3"/><line x1="${x}" y1="${y}" x2="${(x + 150 * Math.cos(a)).toFixed(1)}" y2="${(y - 150 * Math.sin(a)).toFixed(1)}" stroke="#333" stroke-width="3"/><path d="M${x + 30},${y} A30,30 0 0 0 ${(x + 30 * Math.cos(a)).toFixed(1)},${(y - 30 * Math.sin(a)).toFixed(1)}" fill="none" stroke="#d33" stroke-width="2"/>`);
    },
    chain(items) { // rantai makanan dengan panah
      const w = 110; let b = `<defs><marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#2e7d32"/></marker></defs>`;
      items.forEach((it, i) => {
        b += `<rect x="${10 + i * w}" y="20" width="85" height="44" rx="10" fill="#e8f5e9" stroke="#2e7d32"/>` + S.text(52 + i * w, 47, it, { s: 13 });
        if (i < items.length - 1) b += `<line x1="${96 + i * w}" y1="42" x2="${118 + i * w}" y2="42" stroke="#2e7d32" stroke-width="2" marker-end="url(#ar)"/>`;
      });
      return S.wrap(items.length * w, 84, b);
    },
    circuit(type, n) { // rangkaian seri / paralel dengan n lampu
      let b = `<rect x="20" y="70" width="14" height="40" fill="#555"/><rect x="38" y="80" width="6" height="20" fill="#555"/>` + S.text(30, 128, "baterai", { s: 11 });
      const bulb = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#fff59d" stroke="#333" stroke-width="2"/><path d="M${x - 6},${y - 6} L${x + 6},${y + 6} M${x + 6},${y - 6} L${x - 6},${y + 6}" stroke="#333"/>`;
      if (type === "seri") {
        b += `<polyline points="27,70 27,20 280,20 280,160 27,160 27,110" fill="none" stroke="#333" stroke-width="2"/>`;
        for (let i = 0; i < n; i++) b += bulb(90 + i * (170 / n), 20);
      } else {
        b += `<polyline points="27,70 27,20 280,20 M27,110 27,160 280,160" fill="none" stroke="#333" stroke-width="2"/>`;
        for (let i = 0; i < n; i++) { const x = 120 + i * (150 / n); b += `<line x1="${x}" y1="20" x2="${x}" y2="160" stroke="#333" stroke-width="2"/>` + bulb(x, 90); }
      }
      return S.wrap(300, 180, b);
    },
    prep(kind) { // kotak dan bola untuk preposisi
      const box = `<rect x="110" y="70" width="90" height="70" fill="#d7a86e" stroke="#7a4f1d" stroke-width="2"/>`;
      const ball = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="#e74c3c" stroke="#900"/>`;
      const pos = { on: [155, 54], under: [155, 158], "next to": [230, 124], behind: [175, 72], "in front of": [155, 115], in: [155, 105] };
      const [x, y] = pos[kind];
      if (kind === "behind") return S.wrap(300, 180, ball(x, y) + box);
      if (kind === "in") return S.wrap(300, 180, `<rect x="110" y="70" width="90" height="70" fill="#d7a86e" stroke="#7a4f1d" stroke-width="2" fill-opacity="0.45"/>` + ball(x, y));
      return S.wrap(300, 180, box + ball(x, y));
    },
    mirror(kind) {
      const shapes = { datar: `<line x1="40" y1="30" x2="40" y2="150" stroke="#4a90d9" stroke-width="8"/>`, cekung: `<path d="M60,30 Q20,90 60,150" fill="none" stroke="#4a90d9" stroke-width="8"/>`, cembung: `<path d="M30,30 Q70,90 30,150" fill="none" stroke="#4a90d9" stroke-width="8"/>` };
      return S.wrap(180, 180, shapes[kind] + `<line x1="160" y1="60" x2="55" y2="90" stroke="#f39c12" stroke-width="3"/>`);
    },
    emoji(e, label) { return S.wrap(160, 130, `<text x="80" y="85" text-anchor="middle" font-size="72">${e}</text>` + (label ? S.text(80, 120, label) : "")); },
  };
  const api = { rng, makeKit, build, S, quota: { 1: 350, 2: 350, 3: 300 } };
  if (typeof module !== "undefined") module.exports = api; else G.CORE = api;
})(typeof window !== "undefined" ? window : globalThis);
