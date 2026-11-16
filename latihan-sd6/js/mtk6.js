// Matematika Kelas 6 — Kurikulum Merdeka Fase C (kelas 6) + pengulangan materi ujian SD
(function (G) {
  const C = typeof module !== "undefined" ? require("./core.js") : G.CORE;
  if (typeof module !== "undefined") require("./svg6.js");
  const S = C.S;
  const nama = ["Andi", "Bima", "Citra", "Dina", "Eka", "Fajar", "Gita", "Hana", "Indra", "Joni", "Kirana", "Laras", "Raka", "Nadia", "Sinta", "Tegar"];
  const sg = (n) => (n < 0 ? "−" + Math.abs(n) : String(n));
  const pr = (n) => (n < 0 ? "(" + sg(n) + ")" : String(n));
  const T = {
    1: [
      (K) => { const a = K.int(-20, 20), b = K.int(-20, 20); if (!a || !b) return null; const op = K.pick(["+", "−"]); const r = op === "+" ? a + b : a - b;
        return K.mk(1, "Bilangan Bulat", `Hasil dari ${sg(a)} ${op} ${pr(b)} adalah ...`, sg(r), [sg(-r), sg(op === "+" ? a - b : a + b), sg(r + K.pick([1, -1, 2])), sg(Math.abs(a) + Math.abs(b))], `${sg(a)} ${op} ${pr(b)} = ${sg(r)}. Ingat: mengurangi bilangan negatif sama dengan menambah.`); },
      (K) => { const a = K.int(-6, 5), m = a + K.int(1, 4) - 1; if (m > 6 || m < a) return null; const lo = Math.min(a, -6 + K.int(0, 1)), hi = lo + 10;
        if (m < lo || m > hi) return null;
        return K.mk(1, "Bilangan Bulat", "Bilangan yang ditunjukkan tanda tanya pada garis bilangan adalah ...", sg(m), [sg(-m || 1), sg(m + 1), sg(m - 1), sg(m + 2)], `Hitung dari angka 0 ke titik merah. Titik itu menunjukkan ${sg(m)}.`, S.numline(lo, hi, m)); },
      (K) => { const t1 = K.int(-8, 10), d = K.int(3, 15); const naik = K.r() < 0.5; const t2 = naik ? t1 + d : t1 - d; const kota = K.pick(["Dieng", "Puncak Jaya", "Bandung", "Lembang", "Malang"]);
        return K.mk(1, "Bilangan Bulat", `Suhu di ${kota} pagi hari ${sg(t1)}°C. Siang harinya suhu ${naik ? "naik" : "turun"} ${d}°C. Suhu siang hari adalah ...`, sg(t2) + "°C", [sg(naik ? t1 - d : t1 + d) + "°C", sg(-t2) + "°C", sg(t2 + 2) + "°C", d + "°C"], `${sg(t1)} ${naik ? "+" : "−"} ${d} = ${sg(t2)}°C.`); },
      (K) => { const a = K.int(2, 9), b = K.int(2, 9), c = K.int(10, 40), d = K.int(2, 6); const r = c + a * b - d;
        return K.mk(1, "Operasi Hitung Campuran", `${c} + ${a} × ${b} − ${d} = ...`, r, [(c + a) * b - d, c + a * (b - d), r + d * 2, r - 1], `Kerjakan perkalian dulu: ${a} × ${b} = ${a * b}. Lalu ${c} + ${a * b} − ${d} = ${r}.`); },
      (K) => { const n = K.int(2, 25); const t = K.r() < 0.5;
        return t ? K.mk(1, "Pangkat dan Akar", `${n}² = ...`, n * n, [n * 2, n * n + n, (n + 1) * (n + 1), n * 10], `${n}² = ${n} × ${n} = ${n * n}.`) : K.mk(1, "Pangkat dan Akar", `√${n * n} = ...`, n, [n + 1, n - 1 || n + 2, n * 2, (n * n) / 2 | 0], `Karena ${n} × ${n} = ${n * n}, maka √${n * n} = ${n}.`); },
      (K) => { const n = K.int(2, 12); const t = K.r() < 0.5;
        return t ? K.mk(1, "Pangkat dan Akar", `${n}³ = ...`, n ** 3, [n * 3, n * n, (n + 1) ** 3, n ** 3 + n], `${n}³ = ${n} × ${n} × ${n} = ${n ** 3}.`) : K.mk(1, "Pangkat dan Akar", `∛${n ** 3} = ...`, n, [n + 1, n - 1 || n + 2, n * 3, n * n], `Karena ${n} × ${n} × ${n} = ${n ** 3}, maka ∛${n ** 3} = ${n}.`); },
      (K) => { const r = K.pick([7, 14, 21, 28, 35]); const d = 2 * r; const kind = K.pick(["r", "d"]);
        return K.mk(1, "Lingkaran", `Keliling lingkaran pada gambar adalah ... (π = 22/7)`, `${(2 * 22 * r) / 7} cm`, [`${(22 * r * r) / 7} cm`, `${(22 * r) / 7} cm`, `${(2 * 22 * r) / 7 + 7} cm`, `${4 * r} cm`], `K = π × d = 22/7 × ${d} = ${(2 * 22 * r) / 7} cm.`, S.circle(kind === "r" ? r : d, kind, "cm")); },
      (K) => { const a = K.int(2, 15), b = K.int(2, 15), c = K.int(2, 12);
        return K.mk(1, "Volume Bangun Ruang", `Volume balok dengan panjang ${a} cm, lebar ${b} cm, dan tinggi ${c} cm adalah ...`, `${a * b * c} cm³`, [`${a + b + c} cm³`, `${2 * (a * b + a * c + b * c)} cm³`, `${a * b} cm³`, `${a * b * c + a} cm³`], `V = p × l × t = ${a} × ${b} × ${c} = ${a * b * c} cm³.`); },
      (K) => { const x = K.int(-5, 5), y = K.int(-5, 5); if (!x || !y) return null; const L = K.pick(["A", "B", "P", "Q", "K"]);
        return K.mk(1, "Koordinat", `Koordinat titik ${L} pada gambar adalah ...`, `(${sg(x)}, ${sg(y)})`, [`(${sg(y)}, ${sg(x)})`, `(${sg(-x)}, ${sg(y)})`, `(${sg(x)}, ${sg(-y)})`, `(${sg(-x)}, ${sg(-y)})`], `Baca sumbu x dulu (mendatar) = ${sg(x)}, lalu sumbu y (tegak) = ${sg(y)}.`, S.cartesius(x, y, L)); },
      (K) => { const n = K.int(5, 7); const v = Array.from({ length: n }, () => K.int(5, 10)); const cnt = {}; v.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); const mx = Math.max(...Object.values(cnt)); const mods = Object.keys(cnt).filter((k) => cnt[k] === mx); if (mods.length > 1 || mx < 2) return null;
        return K.mk(1, "Statistika", `Nilai ulangan ${K.pick(nama)}: ${v.join(", ")}. Modus data tersebut adalah ...`, mods[0], [...new Set(v.filter((x) => String(x) !== mods[0]).map(String))].concat(["10", "9", "6"]), `Modus = nilai yang paling sering muncul, yaitu ${mods[0]} (muncul ${mx} kali).`); },
      (K) => { const [n, d] = K.pick([[1, 4], [3, 4], [2, 5], [3, 5], [1, 8], [3, 8], [7, 20], [9, 25], [1, 2]]); const p = (n / d) * 100;
        return K.mk(1, "Pecahan, Desimal, Persen", `Pecahan ${n}/${d} jika diubah ke persen adalah ...`, K.num(p) + "%", [K.num(p / 10) + "%", K.num(n * 10) + "%", K.num(100 - p) + "%", K.num(p + 5) + "%"], `${n}/${d} × 100% = ${K.num(p)}%.`); },
      (K) => { const a = K.int(1, 9) + K.int(1, 9) / 10, b = K.int(1, 9) + K.int(1, 99) / 100; const op = K.pick(["+", "−"]); if (op === "−" && b > a) return null; const r = Math.round((op === "+" ? a + b : a - b) * 100) / 100;
        return K.mk(1, "Pecahan, Desimal, Persen", `${K.num(a)} ${op} ${K.num(b)} = ...`, K.num(r), [K.num(r + 0.1), K.num(r - 0.01), K.num(r * 10), K.num(op === "+" ? Math.abs(a - b) : a + b)], `Sejajarkan koma: ${K.num(a)} ${op} ${K.num(b)} = ${K.num(r)}.`); },
    ],
    2: [
      (K) => { const a = K.int(-12, -2), b = K.int(2, 9); const op = K.pick(["×", ":"]); const r = op === "×" ? a * b : a; const x = op === "×" ? a : a * b;
        return K.mk(2, "Bilangan Bulat", `${sg(x)} ${op} ${b} = ...`, sg(op === "×" ? a * b : a), [sg(-(op === "×" ? a * b : a)), sg((op === "×" ? a * b : a) + b), sg(x + b), sg(Math.abs(x) * 2)], `Negatif ${op === "×" ? "dikali" : "dibagi"} positif hasilnya negatif: ${sg(x)} ${op} ${b} = ${sg(op === "×" ? a * b : a)}.`); },
      (K) => { const a = K.int(2, 12), b = K.int(2, 8), c = K.int(2, 6), d = K.int(10, 60); const r = d - a * b + c * c;
        return K.mk(2, "Operasi Hitung Campuran", `${d} − ${a} × ${b} + ${c}² = ...`, sg(r), [sg((d - a) * b + c * c), sg(d - a * b + c * 2), sg(r + c), sg(r - 2)], `Pangkat dulu: ${c}² = ${c * c}. Perkalian: ${a} × ${b} = ${a * b}. Lalu ${d} − ${a * b} + ${c * c} = ${sg(r)}.`); },
      (K) => { const w1 = K.int(1, 4), n1 = K.int(1, 3), d1 = 4, w2 = K.int(1, 3), n2 = 1, d2 = 2; const tn = (w1 * d1 + n1) * 1 * 1, L = 4; const t = (w1 * 4 + n1) + (w2 * 2 + n2) * 2;
        return K.mk(2, "Pecahan", `${w1} ${n1}/4 + ${w2} ${n2}/2 = ...`, K.fr(t, L), [K.fr(t - 1, L), K.fr(t + 2, L), `${w1 + w2} ${n1 + n2}/6`, K.fr(t, 2)], `Ubah ke pecahan biasa: ${w1 * 4 + n1}/4 + ${w2 * 2 + n2}/2 = ${w1 * 4 + n1}/4 + ${(w2 * 2 + n2) * 2}/4 = ${t}/4 = ${K.fr(t, L)}.`); },
      (K) => { const a = K.int(2, 9), b = K.pick([2, 3, 4, 5]), c = K.int(1, 9), d = K.pick([3, 4, 5, 6]); if (a % b === 0 || c % d === 0) return null;
        return K.mk(2, "Pecahan", `${a}/${b} × ${c}/${d} = ...`, K.fr(a * c, b * d), [K.fr(a + c, b + d), K.fr(a * d, b * c), K.fr(a * c + 1, b * d), K.fr(a * c, b + d)], `Kalikan pembilang dan penyebut: ${a * c}/${b * d} = ${K.fr(a * c, b * d)}.`); },
      (K) => { const r = K.pick([7, 14, 21, 28]); const L = (22 * r * r) / 7; const kind = K.pick(["r", "d"]);
        return K.mk(2, "Lingkaran", `Luas lingkaran pada gambar adalah ... (π = 22/7)`, `${K.num(L)} cm²`, [`${K.num((2 * 22 * r) / 7)} cm²`, `${K.num(L * 2)} cm²`, `${K.num((22 * 4 * r * r) / 7)} cm²`, `${K.num(L / 2)} cm²`], `${kind === "d" ? `r = d : 2 = ${r} cm. ` : ""}L = π × r × r = 22/7 × ${r} × ${r} = ${K.num(L)} cm².`, S.circle(kind === "r" ? r : 2 * r, kind, "cm")); },
      (K) => { const r = K.pick([10, 20, 5, 15, 30]); const L = 3.14 * r * r;
        return K.mk(2, "Lingkaran", `Sebuah taman berbentuk lingkaran berjari-jari ${r} m. Luas taman adalah ... (π = 3,14)`, `${K.num(L)} m²`, [`${K.num(2 * 3.14 * r)} m²`, `${K.num(L * 2)} m²`, `${K.num(3.14 * r)} m²`, `${K.num(L + r)} m²`], `L = 3,14 × ${r} × ${r} = ${K.num(L)} m².`); },
      (K) => { const s = K.int(2, 15);
        return K.mk(2, "Luas Permukaan", `Luas permukaan kubus dengan panjang rusuk ${s} cm adalah ...`, `${6 * s * s} cm²`, [`${s ** 3} cm²`, `${4 * s * s} cm²`, `${12 * s} cm²`, `${6 * s} cm²`], `Lp kubus = 6 × s × s = 6 × ${s} × ${s} = ${6 * s * s} cm².`); },
      (K) => { const p = K.int(4, 15), l = K.int(2, 10), t = K.int(2, 10); if (p === l) return null;
        return K.mk(2, "Luas Permukaan", `Luas permukaan balok berukuran ${p} cm × ${l} cm × ${t} cm adalah ...`, `${2 * (p * l + p * t + l * t)} cm²`, [`${p * l * t} cm²`, `${p * l + p * t + l * t} cm²`, `${2 * (p + l + t)} cm²`, `${2 * (p * l + p * t)} cm²`], `Lp = 2 × (pl + pt + lt) = 2 × (${p * l} + ${p * t} + ${l * t}) = ${2 * (p * l + p * t + l * t)} cm².`); },
      (K) => { const r = K.pick([7, 14]), t = K.int(5, 20); const V = (22 * r * r * t) / 7;
        return K.mk(2, "Volume Bangun Ruang", "Volume tabung pada gambar adalah ... (π = 22/7)", `${K.num(V)} cm³`, [`${K.num((22 * r * r) / 7)} cm³`, `${K.num((2 * 22 * r * t) / 7)} cm³`, `${K.num(V * 2)} cm³`, `${K.num(V / 2)} cm³`], `V = π × r × r × t = 22/7 × ${r} × ${r} × ${t} = ${K.num(V)} cm³.`, S.cylinder(r, t, "cm")); },
      (K) => { const a = 2 * K.int(2, 8), ts = K.int(3, 12), t = K.int(5, 20); const V = (a * ts * t) / 2;
        return K.mk(2, "Volume Bangun Ruang", "Volume prisma segitiga pada gambar adalah ...", `${K.num(V)} cm³`, [`${K.num(a * ts * t)} cm³`, `${K.num((a * ts) / 2)} cm³`, `${K.num(a + ts + t)} cm³`, `${K.num(V + t)} cm³`], `V = luas alas × tinggi = (½ × ${a} × ${ts}) × ${t} = ${(a * ts) / 2} × ${t} = ${K.num(V)} cm³.`, S.prism(a, ts, t, "cm")); },
      (K) => { const n = K.pick([5, 7]); let v = Array.from({ length: n }, () => K.int(55, 95)); const so = v.slice().sort((a, b) => a - b); const med = so[(n - 1) / 2];
        return K.mk(2, "Statistika", `Data tinggi badan (cm) beberapa siswa: ${v.map((x) => x + 80).join(", ")}. Median data tersebut adalah ...`, String(med + 80), [String(so[0] + 80), String(so[n - 1] + 80), String(Math.round(v.reduce((a, b) => a + b) / n) + 80 + 1), String(v[(n - 1) / 2] + 80 === med + 80 ? med + 82 : v[(n - 1) / 2] + 80)], `Urutkan data: ${so.map((x) => x + 80).join(", ")}. Nilai tengahnya ${med + 80}.`); },
      (K) => { const lab = K.sample(["Sepak bola", "Renang", "Bulu tangkis", "Basket", "Voli"], 4); const pct = K.pick([[40, 30, 20, 10], [50, 25, 15, 10], [35, 30, 25, 10], [45, 25, 20, 10]]); const N = K.pick([40, 60, 80, 120, 200]); const i = K.int(0, 3); const r = (pct[i] * N) / 100; if (r % 1) return null;
        return K.mk(2, "Statistika", `Diagram lingkaran menunjukkan olahraga kesukaan ${N} siswa. Banyak siswa yang menyukai ${lab[i]} adalah ...`, `${r} siswa`, [`${pct[i]} siswa`, `${r + 4} siswa`, `${(pct[(i + 1) % 4] * N) / 100} siswa`, `${N - r} siswa`], `${pct[i]}% × ${N} = ${r} siswa.`, S.pie(lab, pct, "Olahraga kesukaan siswa")); },
      (K) => { const v = K.pick([40, 50, 60, 72, 80]), w = K.pick([1.5, 2, 2.5, 3, 4]); const s = v * w; if (s % 1) return null;
        return K.mk(2, "Kecepatan dan Debit", `Bus melaju dengan kecepatan ${v} km/jam selama ${K.num(w)} jam. Jarak yang ditempuh adalah ...`, `${K.num(s)} km`, [`${K.num(v + w)} km`, `${K.num(v / w)} km`, `${K.num(s + v)} km`, `${K.num(s - 10)} km`], `Jarak = ${v} × ${K.num(w)} = ${K.num(s)} km.`); },
    ],
    3: [
      (K) => { const [a, b] = K.sample([6, 8, 9, 10, 12, 15, 18, 20], 2); const L = K.lcm(a, b); const [x, y] = K.sample(nama, 2);
        return K.mk(3, "KPK dan FPB", `${x} berenang setiap ${a} hari dan ${y} setiap ${b} hari. Hari ini mereka berenang bersama. Mereka akan berenang bersama lagi ... hari lagi.`, L, [a * b === L ? L * 2 : a * b, K.gcd(a, b), a + b, L + a], `KPK ${a} dan ${b} = ${L}, jadi ${L} hari lagi.`); },
      (K) => { const g = K.int(4, 12), a = g * K.int(2, 6), b = g * K.int(2, 6), c = g * K.int(2, 6); if (a === b || b === c || a === c) return null; const f = K.gcd(K.gcd(a, b), c);
        return K.mk(3, "KPK dan FPB", `Bu Guru punya ${a} pensil, ${b} buku, dan ${c} penghapus untuk dibagikan sama banyak ke beberapa kelompok tanpa sisa. Paling banyak kelompok yang dapat dibentuk adalah ...`, `${f} kelompok`, [`${f * 2} kelompok`, `${K.lcm(a, b)} kelompok`, `${(a + b + c) / f | 0} kelompok`, `${f + 1} kelompok`], `FPB ${a}, ${b}, dan ${c} = ${f}.`); },
      (K) => { const r = K.pick([7, 14, 21]), n = K.pick([10, 20, 50, 100]); const kel = (2 * 22 * r) / 7; const tot = (kel * n) / 100;
        return K.mk(3, "Lingkaran", `Roda sepeda berjari-jari ${r} cm berputar ${n} kali. Jarak yang ditempuh adalah ... m. (π = 22/7)`, K.num(tot), [K.num(tot * 2), K.num(tot / 2), K.num(((22 * r * r) / 7) * n / 100), K.num(tot + 10)], `Keliling roda = 2 × 22/7 × ${r} = ${kel} cm. Jarak = ${kel} × ${n} = ${K.num(kel * n)} cm = ${K.num(tot)} m.`); },
      (K) => { const r = K.pick([7, 14]), t = K.pick([10, 20, 30, 50]); const V = (22 * r * r * t) / 7 / 1000;
        return K.mk(3, "Volume Bangun Ruang", `Tandon air berbentuk tabung berjari-jari ${r} dm dan tinggi ${t} dm diisi penuh. Banyak air adalah ... liter. (π = 22/7)`, K.num(V * 1000), [K.num(V * 100), K.num(V * 2000), K.num((2 * 22 * r * t) / 7), K.num(V * 1000 + 100)], `V = 22/7 × ${r} × ${r} × ${t} = ${K.num(V * 1000)} dm³ = ${K.num(V * 1000)} liter.`, S.cylinder(r, t, "dm")); },
      (K) => { const s = K.int(5, 20), t = K.int(2, s - 1);
        return K.mk(3, "Volume Bangun Ruang", `Bak mandi berbentuk kubus dengan rusuk ${s} dm berisi air setinggi ${t} dm. Air yang harus ditambahkan agar penuh adalah ... liter.`, s * s * (s - t), [s * s * t, s ** 3, s * (s - t), s * s * (s - t) + s], `Kekurangan air = ${s} × ${s} × (${s} − ${t}) = ${s * s * (s - t)} dm³ = ${s * s * (s - t)} liter.`); },
      (K) => { const p = K.pick([40, 50, 60, 80]), l = K.pick([20, 30, 40]), t = K.pick([25, 30, 40, 50]), deb = K.pick([2, 4, 5, 6, 8, 10]); const V = (p * l * t) / 1000; const w = V / deb; if (w % 1) return null;
        return K.mk(3, "Kecepatan dan Debit", `Akuarium ${p} cm × ${l} cm × ${t} cm diisi air dari keran berdebit ${deb} liter/menit. Akuarium penuh dalam ... menit.`, w, [V, w * 2, w + deb, deb * V], `V = ${p} × ${l} × ${t} = ${p * l * t} cm³ = ${K.num(V)} liter. Waktu = ${K.num(V)} : ${deb} = ${w} menit.`); },
      (K) => { const v1 = K.pick([40, 50, 60]), v2 = K.pick([30, 40, 50, 70]), J = (v1 + v2) * K.pick([1, 2, 3]); const w = J / (v1 + v2); const jam = K.int(6, 9);
        return K.mk(3, "Kecepatan dan Debit", `Jarak kota A dan B ${J} km. Pukul 0${jam}.00 Ayah berangkat dari A ke B dengan kecepatan ${v1} km/jam, dan Paman dari B ke A dengan kecepatan ${v2} km/jam. Mereka berpapasan pukul ...`, `${String(jam + w).padStart(2, "0")}.00`, [`${String(jam + w + 1).padStart(2, "0")}.00`, `${String(jam + w).padStart(2, "0")}.30`, `${String(jam + 1).padStart(2, "0")}.00`, `${String(jam + w + 2).padStart(2, "0")}.00`], `Waktu papasan = jarak : (v1 + v2) = ${J} : ${v1 + v2} = ${w} jam. ${String(jam).padStart(2, "0")}.00 + ${w} jam = ${String(jam + w).padStart(2, "0")}.00.`); },
      (K) => { const a = K.int(2, 5), b = K.int(2, 6); if (a === b || K.gcd(a, b) > 1) return null; const k = K.int(4, 15); const sel = Math.abs(a - b) * k; const [x, y] = K.sample(nama, 2);
        return K.mk(3, "Perbandingan dan Skala", `Perbandingan uang ${x} dan ${y} = ${a} : ${b}. Selisih uang mereka Rp${K.num(sel * 1000)}. Uang ${y} adalah ...`, "Rp" + K.num(b * k * 1000), ["Rp" + K.num(a * k * 1000), "Rp" + K.num((a + b) * k * 1000), "Rp" + K.num(sel * 1000), "Rp" + K.num(b * k * 1000 + 5000)], `1 bagian = ${K.num(sel * 1000)} : ${Math.abs(a - b)} = ${K.num(k * 1000)}. Uang ${y} = ${b} × ${K.num(k * 1000)} = ${K.num(b * k * 1000)}.`); },
      (K) => { const v = [K.int(6, 9), K.int(6, 9), K.int(6, 9), K.int(6, 9)]; const tgt = K.int(7, 8); const x = tgt * 5 - v.reduce((a, b) => a + b, 0); if (x < 5 || x > 10) return null;
        return K.mk(3, "Statistika", `Nilai 4 kali ulangan Sinta: ${v.join(", ")}. Agar rata-rata 5 kali ulangan menjadi ${tgt}, nilai ulangan kelima harus ...`, x, [x + 1, x - 1, tgt, x + 2], `Jumlah 5 nilai = ${tgt} × 5 = ${tgt * 5}. Nilai kelima = ${tgt * 5} − ${v.reduce((a, b) => a + b, 0)} = ${x}.`); },
      (K) => { const h = K.pick([150, 200, 250, 300, 400, 500]) * 1000, u = K.pick([10, 15, 20, 25]); const j = h + (h * u) / 100; const brg = K.pick(["sepeda", "rak buku", "tas", "sepatu"]);
        return K.mk(3, "Pecahan, Desimal, Persen", `Pak Budi membeli ${brg} seharga Rp${K.num(h)} lalu menjualnya dengan untung ${u}%. Harga jualnya adalah ...`, "Rp" + K.num(j), ["Rp" + K.num(h - (h * u) / 100), "Rp" + K.num((h * u) / 100), "Rp" + K.num(h + u * 1000), "Rp" + K.num(j + 10000)], `Untung = ${u}% × ${K.num(h)} = ${K.num((h * u) / 100)}. Harga jual = ${K.num(h)} + ${K.num((h * u) / 100)} = ${K.num(j)}.`); },
      (K) => { const x = K.int(-4, 4), y = K.int(-4, 4), dx = K.int(1, 3), dy = K.int(1, 3); if (!x || !y) return null; const nx = x + dx, ny = y - dy;
        return K.mk(3, "Koordinat", `Titik P pada gambar digeser ${dx} satuan ke kanan dan ${dy} satuan ke bawah. Koordinat bayangannya adalah ...`, `(${sg(nx)}, ${sg(ny)})`, [`(${sg(x - dx)}, ${sg(y + dy)})`, `(${sg(x + dx)}, ${sg(y + dy)})`, `(${sg(x - dx)}, ${sg(y - dy)})`, `(${sg(ny)}, ${sg(nx)})`], `Ke kanan: x + ${dx} = ${sg(nx)}. Ke bawah: y − ${dy} = ${sg(ny)}.`, S.cartesius(x, y, "P")); },
      (K) => { const a = K.int(-15, -3), b = K.int(2, 8), c = K.int(-6, -2);
        return K.mk(3, "Bilangan Bulat", `Hasil dari ${sg(a)} × ${b} : ${pr(c)} ... (dibulatkan jika perlu) adalah ...`.replace(" ... (dibulatkan jika perlu)", ""), sg(Math.round((a * b) / c)), [sg(-Math.round((a * b) / c)), sg(a * b), sg(Math.round(a / c) * b + 1), sg(Math.round((a * b) / c) + 2)], `${sg(a)} × ${b} = ${sg(a * b)}. ${sg(a * b)} : ${pr(c)} = ${sg((a * b) / c)} (negatif : negatif = positif).`) ; },
    ],
  };
  // buang soal bilangan bulat yang hasil baginya tidak bulat
  const t3 = T[3][T[3].length - 1]; T[3][T[3].length - 1] = (K) => { const s = t3(K); return s && !/\./.test(s.bahas.split("=").pop()) ? s : null; };
  const gen = () => C.build("MTK", 6105, T, C.quota);
  if (typeof module !== "undefined") module.exports = gen; else (G.GEN = G.GEN || {}).MTK = gen;
})(typeof window !== "undefined" ? window : globalThis);
