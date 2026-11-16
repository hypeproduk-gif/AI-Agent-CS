// Tambahan gambar SVG untuk materi kelas 6.
(function (G) {
  const C = typeof module !== "undefined" ? require("./core.js") : G.CORE;
  const S = C.S;
  Object.assign(S, {
    circle(val, kind, sat) { // kind: "r" (jari-jari) atau "d" (diameter)
      const line = kind === "r" ? `<line x1="110" y1="100" x2="190" y2="100" stroke="#c00" stroke-width="2"/>` : `<line x1="30" y1="100" x2="190" y2="100" stroke="#c00" stroke-width="2"/>`;
      return S.wrap(240, 210, `<circle cx="110" cy="100" r="80" fill="#e0f2fe" stroke="#0369a1" stroke-width="2"/><circle cx="110" cy="100" r="3"/>${line}` + S.text(kind === "r" ? 150 : 110, 92, (kind === "r" ? "r = " : "d = ") + val + " " + sat, { c: "#c00" }));
    },
    cylinder(r, t, sat) {
      return S.wrap(240, 230, `<ellipse cx="110" cy="190" rx="70" ry="18" fill="#fde68a" stroke="#b45309" stroke-width="2"/><rect x="40" y="40" width="140" height="150" fill="#fef3c7" stroke="none"/><line x1="40" y1="40" x2="40" y2="190" stroke="#b45309" stroke-width="2"/><line x1="180" y1="40" x2="180" y2="190" stroke="#b45309" stroke-width="2"/><ellipse cx="110" cy="40" rx="70" ry="18" fill="#fde68a" stroke="#b45309" stroke-width="2"/><line x1="110" y1="40" x2="180" y2="40" stroke="#c00" stroke-width="2"/>` + S.text(146, 33, "r = " + r + " " + sat, { c: "#c00", s: 13 }) + S.text(196, 120, "t = " + t + " " + sat, { a: "start", s: 13 }));
    },
    prism(a, ts, t, sat) { // prisma segitiga siku-siku: alas segitiga a, tinggi segitiga ts, tinggi prisma t
      return S.wrap(300, 220, `<polygon points="30,180 130,180 30,90" fill="#dcfce7" stroke="#15803d" stroke-width="2"/><polygon points="130,180 250,140 150,50 30,90" fill="#bbf7d0" stroke="#15803d" stroke-width="2" fill-opacity=".6"/><line x1="30" y1="90" x2="150" y2="50" stroke="#15803d" stroke-width="2"/><line x1="130" y1="180" x2="250" y2="140" stroke="#15803d" stroke-width="2"/><line x1="150" y1="50" x2="250" y2="140" stroke="#15803d" stroke-width="2"/>` + S.text(80, 200, "a = " + a + " " + sat, { s: 13 }) + S.text(22, 140, ts + " " + sat, { a: "end", s: 13 }) + S.text(205, 175, "t = " + t + " " + sat, { s: 13 }));
    },
    cartesius(x, y, label) {
      const k = 18, cx = 130, cy = 120; let b = "";
      for (let i = -6; i <= 6; i++) { b += `<line x1="${cx + i * k}" y1="12" x2="${cx + i * k}" y2="228" stroke="#eee"/><line x1="22" y1="${cy + i * k}" x2="238" y2="${cy + i * k}" stroke="#eee"/>`; if (i) b += S.text(cx + i * k, cy + 14, i, { s: 9 }) + S.text(cx - 8, cy - i * k + 3, i, { s: 9 }); }
      b += `<line x1="22" y1="${cy}" x2="238" y2="${cy}" stroke="#333" stroke-width="2"/><line x1="${cx}" y1="12" x2="${cx}" y2="228" stroke="#333" stroke-width="2"/>` + S.text(234, cy - 6, "x", { s: 12 }) + S.text(cx + 8, 20, "y", { s: 12 });
      b += `<circle cx="${cx + x * k}" cy="${cy - y * k}" r="6" fill="#dc2626"/>` + S.text(cx + x * k + 10, cy - y * k - 8, label, { a: "start", c: "#dc2626", s: 14 });
      return S.wrap(260, 240, b);
    },
    pie(labels, vals, title) {
      const tot = vals.reduce((a, b) => a + b, 0), col = ["#60a5fa", "#f59e0b", "#34d399", "#f472b6", "#a78bfa"]; let a0 = -Math.PI / 2, b = S.text(130, 16, title, { s: 12 });
      vals.forEach((v, i) => { const a1 = a0 + (2 * Math.PI * v) / tot, cx = 90, cy = 110, R = 72; const large = a1 - a0 > Math.PI ? 1 : 0;
        b += `<path d="M${cx},${cy} L${(cx + R * Math.cos(a0)).toFixed(1)},${(cy + R * Math.sin(a0)).toFixed(1)} A${R},${R} 0 ${large} 1 ${(cx + R * Math.cos(a1)).toFixed(1)},${(cy + R * Math.sin(a1)).toFixed(1)} Z" fill="${col[i]}" stroke="#fff" stroke-width="2"/>`;
        b += `<rect x="180" y="${40 + i * 22}" width="12" height="12" fill="${col[i]}"/>` + S.text(198, 50 + i * 22, `${labels[i]} ${Math.round((v / tot) * 100)}%`, { a: "start", s: 12 }); a0 = a1; });
      return S.wrap(300, 200, b);
    },
    numline(a, b, mark) { // garis bilangan dari a..b, titik di mark
      const n = b - a, w = 260 / n; let s = `<line x1="15" y1="40" x2="285" y2="40" stroke="#333" stroke-width="2"/>`;
      for (let i = 0; i <= n; i++) { const x = 20 + i * w; s += `<line x1="${x}" y1="34" x2="${x}" y2="46" stroke="#333"/>` + S.text(x, 64, a + i, { s: 11 }); }
      if (mark != null) s += `<circle cx="${20 + (mark - a) * w}" cy="40" r="7" fill="#dc2626"/>` + S.text(20 + (mark - a) * w, 22, "?", { c: "#dc2626", s: 15 });
      return S.wrap(300, 75, s);
    },
    planets(highlight) {
      const P = [["Merkurius", 6, "#a8a29e"], ["Venus", 9, "#fbbf24"], ["Bumi", 10, "#3b82f6"], ["Mars", 7, "#ef4444"], ["Yupiter", 20, "#d97706"], ["Saturnus", 17, "#eab308"], ["Uranus", 13, "#67e8f9"], ["Neptunus", 13, "#6366f1"]];
      let b = `<rect width="420" height="120" fill="#0f172a"/><circle cx="-30" cy="60" r="60" fill="#facc15"/>`; let x = 50;
      P.forEach(([n, r, c], i) => { x += i ? P[i - 1][1] + r + 14 : 0; b += `<circle cx="${x}" cy="60" r="${r}" fill="${c}"/>`; if (i === highlight) b += `<circle cx="${x}" cy="60" r="${r + 5}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/>` + S.text(x, 108, "?", { c: "#fff", s: 16 }); });
      return S.wrap(420, 120, b);
    },
    lever(kind) { // tuas jenis 1/2/3: T=titik tumpu, B=beban, K=kuasa
      const pos = { 1: ["B", "T", "K"], 2: ["T", "B", "K"], 3: ["T", "K", "B"] }[kind]; const xs = [50, 150, 250];
      let b = `<line x1="30" y1="80" x2="270" y2="80" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>`;
      pos.forEach((p, i) => { if (p === "T") b += `<polygon points="${xs[i] - 18},120 ${xs[i] + 18},120 ${xs[i]},86" fill="#64748b"/>` + S.text(xs[i], 138, "titik tumpu", { s: 11 });
        if (p === "B") b += `<rect x="${xs[i] - 18}" y="44" width="36" height="34" fill="#f59e0b" stroke="#92400e"/>` + S.text(xs[i], 36, "beban", { s: 11 });
        if (p === "K") b += `<line x1="${xs[i]}" y1="20" x2="${xs[i]}" y2="72" stroke="#dc2626" stroke-width="3"/><polygon points="${xs[i] - 7},64 ${xs[i] + 7},64 ${xs[i]},76" fill="#dc2626"/>` + S.text(xs[i], 14, "kuasa", { s: 11, c: "#dc2626" }); });
      return S.wrap(300, 150, b);
    },
    eclipse(kind) { // matahari - bumi - bulan
      const order = kind === "bulan" ? [["Matahari", 22, "#facc15"], ["Bumi", 14, "#3b82f6"], ["Bulan", 8, "#cbd5e1"]] : [["Matahari", 22, "#facc15"], ["Bulan", 8, "#cbd5e1"], ["Bumi", 14, "#3b82f6"]];
      let b = `<rect width="320" height="110" fill="#0f172a"/>`; order.forEach(([n, r, c], i) => { const x = 50 + i * 110; b += `<circle cx="${x}" cy="50" r="${r}" fill="${c}"/>` + S.text(x, 96, n, { c: "#fff", s: 12 }); });
      return S.wrap(320, 110, b);
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
