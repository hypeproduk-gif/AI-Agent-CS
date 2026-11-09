// Matematika Kelas 5 — Kurikulum Merdeka Fase C
(function (G) {
  const C = typeof module !== "undefined" ? require("./core.js") : G.CORE;
  const S = C.S;
  const nama = ["Andi", "Budi", "Citra", "Dewi", "Eka", "Fajar", "Gita", "Hana", "Intan", "Joko", "Kiki", "Lina", "Rafi", "Nadia", "Sari", "Tono"];
  const T = {
    1: [
      (K) => { const d = K.pick([5, 6, 7, 8, 9, 10, 12]); const a = K.int(1, d - 2), b = K.int(1, d - a - 1);
        return K.mk(1, "Pecahan", `Hasil dari ${a}/${d} + ${b}/${d} adalah ...`, K.fr(a + b, d), [`${a + b}/${d + d}`, K.fr(a + b + 1, d), K.fr(Math.abs(a - b) || 1, d), `${a * b}/${d}`], `Penyebut sama, jumlahkan pembilangnya: ${a} + ${b} = ${a + b}. Jadi ${a + b}/${d}${K.fr(a + b, d) !== a + b + "/" + d ? " = " + K.fr(a + b, d) : ""}.`); },
      (K) => { const d = K.pick([3, 4, 5, 6, 8]); const n = K.int(1, d - 1); const img = K.r() < 0.5 ? S.fracCircle(n, d) : S.fracGrid(n, d);
        return K.mk(1, "Pecahan", "Bagian yang diwarnai pada gambar menunjukkan pecahan ...", `${n}/${d}`, [`${d - n}/${d}`, `${n}/${d + 1}`, `${d}/${n}`, `${n + 1}/${d}`], `Ada ${d} bagian sama besar, ${n} bagian diwarnai → ${n}/${d}.`, img); },
      (K) => { const [n, d] = K.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [1, 25], [7, 25], [13, 100], [47, 100]]); const v = n / d;
        return K.mk(1, "Desimal", `Pecahan ${n}/${d} jika diubah ke bentuk desimal adalah ...`, K.num(v), [K.num(v * 10), K.num(v / 10), K.num(n + d / 100), K.num(1 - v)], `${n}/${d} = ${n} : ${d} = ${K.num(v)}.`); },
      (K) => { const p = K.pick([5, 10, 20, 25, 40, 50, 60, 75, 80, 15, 35, 45, 30, 70, 90]);
        return K.mk(1, "Persen", `${p}% jika diubah ke pecahan paling sederhana adalah ...`, K.fr(p, 100), [`${p}/10`, K.fr(p, 1000), K.fr(100 - p, 100), `1/${p}`], `${p}% = ${p}/100 = ${K.fr(p, 100)}.`); },
      (K) => { const p = K.int(5, 30), l = K.int(3, p - 1); const sat = K.pick(["cm", "m"]);
        return K.mk(1, "Keliling", "Keliling persegi panjang pada gambar adalah ...", `${2 * (p + l)} ${sat}`, [`${p * l} ${sat}`, `${p + l} ${sat}`, `${2 * p + l} ${sat}`, `${2 * (p + l) + 2} ${sat}`], `K = 2 × (p + l) = 2 × (${p} + ${l}) = ${2 * (p + l)} ${sat}.`, S.rectLabel(p, l, sat)); },
      (K) => { const s = K.int(3, 25); const sat = K.pick(["cm", "m"]);
        return K.mk(1, "Luas Bangun Datar", "Luas persegi pada gambar adalah ...", `${s * s} ${sat}²`, [`${4 * s} ${sat}²`, `${2 * s} ${sat}²`, `${s * s + s} ${sat}²`, `${(s + 1) * (s + 1)} ${sat}²`], `L = s × s = ${s} × ${s} = ${s * s} ${sat}².`, S.square(s, sat)); },
      (K) => { const n = K.int(100000, 999999); const s = String(n); const i = K.int(0, 5); const names = ["ratus ribuan", "puluh ribuan", "ribuan", "ratusan", "puluhan", "satuan"]; const val = Number(s[i]) * 10 ** (5 - i);
        if (s.indexOf(s[i]) !== i || s[i] === "0") return null;
        return K.mk(1, "Bilangan Cacah", `Pada bilangan ${K.num(n)}, angka ${s[i]} menempati nilai tempat ...`, names[i], names.filter((x) => x !== names[i]).slice(0, 3).concat(names[(i + 3) % 6]), `Angka ${s[i]} bernilai ${K.num(val)}, jadi menempati tempat ${names[i]}.`); },
      (K) => { const n = K.int(10000, 999999); const sat = [1000, 100, 10][K.int(0, 2)]; const r = Math.round(n / sat) * sat; const nm = { 1000: "ribuan", 100: "ratusan", 10: "puluhan" }[sat];
        return K.mk(1, "Pembulatan", `${K.num(n)} dibulatkan ke ${nm} terdekat menjadi ...`, K.num(r), [K.num(r + sat), K.num(r - sat), K.num(Math.floor(n / sat) * sat === r ? r + sat * 2 : Math.floor(n / sat) * sat)], `Lihat angka setelah tempat ${nm}: ≥5 naik, <5 tetap. Hasil ${K.num(r)}.`); },
      (K) => { const c = K.pick([["km", "m", 1000], ["m", "cm", 100], ["kg", "g", 1000], ["L", "mL", 1000], ["jam", "menit", 60], ["menit", "detik", 60], ["hm", "m", 100], ["kg", "ons", 10]]); const x = K.int(2, 15);
        return K.mk(1, "Pengukuran", `${x} ${c[0]} = ... ${c[1]}`, K.num(x * c[2]), [K.num(x * c[2] * 10), K.num(x * c[2] / 10), K.num(x + c[2])], `1 ${c[0]} = ${K.num(c[2])} ${c[1]}, maka ${x} × ${K.num(c[2])} = ${K.num(x * c[2])} ${c[1]}.`); },
      (K) => { const lab = K.sample(["Sen", "Sel", "Rab", "Kam", "Jum"], 4); const vals = lab.map(() => K.int(2, 20)); const mx = Math.max(...vals); if (vals.filter((v) => v === mx).length > 1) return null; const benda = K.pick(["buku terjual", "pengunjung perpustakaan", "botol terkumpul", "siswa piket"]);
        return K.mk(1, "Penyajian Data", `Diagram batang menunjukkan banyak ${benda}. Hari dengan jumlah paling banyak adalah ...`, lab[vals.indexOf(mx)], lab.filter((_, i) => vals[i] !== mx).concat(["Sabtu"]), `Batang tertinggi = ${mx}, yaitu hari ${lab[vals.indexOf(mx)]}.`, S.bars(lab, vals, "Banyak " + benda)); },
      (K) => { const a = K.int(1200, 9800), b = K.int(1100, 8900); const op = K.pick(["+", "−"]); if (op === "−" && b > a) return null; const r = op === "+" ? a + b : a - b;
        return K.mk(1, "Operasi Hitung", `${K.num(a)} ${op} ${K.num(b)} = ...`, K.num(r), K.near(r, 110).map(K.num), `Hitung bersusun: ${K.num(a)} ${op} ${K.num(b)} = ${K.num(r)}.`); },
      (K) => { const a = K.int(12, 99), b = K.int(11, 45);
        return K.mk(1, "Operasi Hitung", `${a} × ${b} = ...`, K.num(a * b), [K.num(a * b + a), K.num(a * b - b), K.num(a * b + 10), K.num(a * (b - 1))], `${a} × ${b} = ${K.num(a * b)}.`); },
    ],
    2: [
      (K) => { const d1 = K.pick([2, 3, 4, 5, 6]), d2 = K.pick([3, 4, 6, 8, 10]); if (d1 === d2) return null; const a = K.int(1, d1 - 1), b = K.int(1, d2 - 1); const L = K.lcm(d1, d2), n = a * (L / d1) + b * (L / d2);
        return K.mk(2, "Pecahan", `Hasil dari ${a}/${d1} + ${b}/${d2} adalah ...`, K.fr(n, L), [`${a + b}/${d1 + d2}`, K.fr(n + 1, L), K.fr(n - 1 || 2, L), `${a + b}/${L}`], `Samakan penyebut (KPK ${d1} dan ${d2} = ${L}): ${a * (L / d1)}/${L} + ${b * (L / d2)}/${L} = ${K.fr(n, L)}.`); },
      (K) => { const d1 = K.pick([2, 3, 4, 5]), d2 = K.pick([4, 6, 8, 10]); const a = K.int(1, d1 - 1), b = K.int(1, d2 - 1); const L = K.lcm(d1, d2), n = a * (L / d1) - b * (L / d2); if (n <= 0) return null;
        return K.mk(2, "Pecahan", `Hasil dari ${a}/${d1} − ${b}/${d2} adalah ...`, K.fr(n, L), [`${Math.abs(a - b)}/${Math.abs(d2 - d1) || 1}`, K.fr(n + 1, L), K.fr(n + 2, L), `${a}/${L}`], `Samakan penyebut ${L}: ${a * (L / d1)}/${L} − ${b * (L / d2)}/${L} = ${K.fr(n, L)}.`); },
      (K) => { const d = K.pick([3, 4, 5, 6, 8]), n = K.int(1, d - 1), k = d * K.int(2, 12);
        return K.mk(2, "Pecahan", `${n}/${d} × ${k} = ...`, K.num((n * k) / d), [K.num(k / d), K.num(n * k), K.num((n * k) / d + n), K.num(k - n)], `${n}/${d} × ${k} = ${n * k}/${d} = ${K.num((n * k) / d)}.`); },
      (K) => { let a = K.int(4, 30), b = K.int(4, 30); if (a === b) return null;
        return K.mk(2, "KPK dan FPB", `KPK dari ${a} dan ${b} adalah ...`, K.lcm(a, b), [a * b === K.lcm(a, b) ? K.lcm(a, b) * 2 : a * b, K.gcd(a, b), K.lcm(a, b) + a, Math.max(a, b)], `Faktorkan, ambil faktor prima pangkat terbesar → KPK = ${K.lcm(a, b)}.`); },
      (K) => { const g = K.int(2, 15), a = g * K.int(2, 9), b = g * K.int(2, 9); if (a === b) return null; const f = K.gcd(a, b);
        return K.mk(2, "KPK dan FPB", `FPB dari ${a} dan ${b} adalah ...`, f, [K.lcm(a, b), f * 2, Math.max(1, f / 2 | 0) === f ? f + 1 : Math.max(1, f / 2 | 0), f + 3], `Faktor persekutuan terbesar ${a} dan ${b} adalah ${f}.`); },
      (K) => { const s = K.int(2, 15); const sat = K.pick(["cm", "dm", "m"]);
        return K.mk(2, "Volume Bangun Ruang", "Volume kubus pada gambar adalah ...", `${K.num(s ** 3)} ${sat}³`, [`${K.num(s * s)} ${sat}³`, `${K.num(6 * s * s)} ${sat}³`, `${K.num(s * 12)} ${sat}³`, `${K.num((s + 1) ** 3)} ${sat}³`], `V = s × s × s = ${s} × ${s} × ${s} = ${K.num(s ** 3)} ${sat}³.`, S.box(s, s, s, sat)); },
      (K) => { const p = K.int(5, 20), l = K.int(2, 10), t = K.int(2, 12); if (p === l) return null;
        return K.mk(2, "Volume Bangun Ruang", "Volume balok pada gambar adalah ...", `${K.num(p * l * t)} cm³`, [`${K.num(p + l + t)} cm³`, `${K.num(2 * (p * l + p * t + l * t))} cm³`, `${K.num(p * l)} cm³`, `${K.num(p * l * t + p)} cm³`], `V = p × l × t = ${p} × ${l} × ${t} = ${K.num(p * l * t)} cm³.`, S.box(p, l, t, "cm")); },
      (K) => { const a = 2 * K.int(3, 20), t = K.int(4, 20);
        return K.mk(2, "Luas Bangun Datar", "Luas segitiga pada gambar adalah ...", `${(a * t) / 2} cm²`, [`${a * t} cm²`, `${a + t} cm²`, `${(a * t) / 2 + t} cm²`, `${2 * (a + t)} cm²`], `L = ½ × a × t = ½ × ${a} × ${t} = ${(a * t) / 2} cm².`, S.triangle(a, t, "cm")); },
      (K) => { const v = K.pick([4, 5, 10, 12, 15, 20, 30, 40, 45, 50, 60, 70, 80]), w = K.int(2, 6); const kend = v <= 15 ? "sepeda" : v <= 50 ? "sepeda motor" : "mobil"; const n = K.pick(nama);
        return K.mk(2, "Kecepatan", `${n} naik ${kend} dengan kecepatan ${v} km/jam selama ${w} jam. Jarak yang ditempuh adalah ...`, `${v * w} km`, [`${v + w} km`, `${v * (w + 1)} km`, `${v * w * 2} km`, `${v * (w - 1)} km`], `Jarak = kecepatan × waktu = ${v} × ${w} = ${v * w} km.`); },
      (K) => { const p = K.pick([10, 15, 20, 25, 30, 40, 50, 60, 75]), x = K.pick([40, 60, 80, 120, 200, 240, 300, 400, 500, 600, 800]); const r = (p * x) / 100; if (r % 1) return null;
        return K.mk(2, "Persen", `${p}% dari ${x} adalah ...`, K.num(r), [K.num(r * 2), K.num(x - r), K.num(p + x), K.num(r + 10)], `${p}/100 × ${x} = ${K.num(r)}.`); },
      (K) => { const n = K.int(4, 6); const v = Array.from({ length: n }, () => K.int(60, 95)); const s = v.reduce((a, b) => a + b, 0); if (s % n) return null;
        return K.mk(2, "Penyajian Data", `Nilai ulangan ${K.pick(nama)}: ${v.join(", ")}. Rata-rata nilainya adalah ...`, s / n, [s / n + 2, s / n - 3, Math.max(...v), s / n + 5], `Rata-rata = jumlah : banyak data = ${s} : ${n} = ${s / n}.`); },
      (K) => { const deg = K.pick([20, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 90, 100, 110, 120, 130, 135, 140, 150, 160]); const jenis = deg < 90 ? "sudut lancip" : deg === 90 ? "sudut siku-siku" : "sudut tumpul";
        return K.mk(2, "Sudut", `Sudut pada gambar besarnya ${deg}°. Sudut tersebut termasuk ...`, jenis, ["sudut lancip", "sudut siku-siku", "sudut tumpul", "sudut lurus"].filter((x) => x !== jenis), `Lancip < 90°, siku-siku = 90°, tumpul antara 90° dan 180°. ${deg}° termasuk ${jenis}.`, S.angle(deg)); },
      (K) => { const a = K.int(15, 160);
        return K.mk(2, "Sudut", `Dua sudut saling berpelurus. Jika salah satunya ${a}°, besar sudut yang lain adalah ...`, `${180 - a}°`, [`${90 - a > 0 ? 90 - a : 360 - a}°`, `${180 + a}°`, `${180 - a + 10}°`, `${a}°`], `Sudut berpelurus jumlahnya 180°: 180° − ${a}° = ${180 - a}°.`); },
    ],
    3: [
      (K) => { const a = K.pick([4, 6, 8, 10, 12, 15]), b = K.pick([6, 9, 10, 12, 18, 20]); if (a === b) return null; const h = K.int(6, 8); const L = K.lcm(a, b); const tot = h * 60 + L; const jam = `${String(Math.floor(tot / 60)).padStart(2, "0")}.${String(tot % 60).padStart(2, "0")}`; if (tot >= 24 * 60) return null;
        return K.mk(3, "KPK dan FPB", `Lampu merah menyala setiap ${a} menit dan lampu hijau setiap ${b} menit. Jika keduanya menyala bersama pukul 0${h}.00, keduanya akan menyala bersama lagi pukul ...`, jam, [`${String(h).padStart(2, "0")}.${String(a * b % 60).padStart(2, "0")}`, `${String(h + Math.floor((a + b) / 60)).padStart(2, "0")}.${String((a + b) % 60).padStart(2, "0")}`, `${String(h + 1).padStart(2, "0")}.00`, `${String(h + Math.floor((L + 10) / 60)).padStart(2, "0")}.${String((L + 10) % 60).padStart(2, "0")}`], `Cari KPK ${a} dan ${b} = ${L} menit. ${String(h).padStart(2, "0")}.00 + ${L} menit = ${jam}.`); },
      (K) => { const g = K.int(3, 12), x = g * K.int(2, 7), y = g * K.int(2, 7); if (x === y) return null; const f = K.gcd(x, y); const [b1, b2] = K.pick([["apel", "jeruk"], ["pensil", "buku"], ["kue", "permen"], ["kelereng merah", "kelereng biru"]]);
        return K.mk(3, "KPK dan FPB", `Ibu punya ${x} ${b1} dan ${y} ${b2}. Semua akan dimasukkan ke kantong dengan isi sama banyak dan jenisnya sama rata. Paling banyak kantong yang dapat dibuat adalah ...`, `${f} kantong`, [`${K.lcm(x, y)} kantong`, `${f * 2} kantong`, `${x + y} kantong`, `${f + 1} kantong`], `Gunakan FPB ${x} dan ${y} = ${f}. Tiap kantong berisi ${x / f} ${b1} dan ${y / f} ${b2}.`); },
      (K) => { const p = K.pick([40, 50, 60, 80, 100]), l = K.pick([20, 25, 30, 40, 50]), t = K.pick([20, 30, 40, 50]); const v = (p * l * t) / 1000;
        return K.mk(3, "Volume Bangun Ruang", `Akuarium berbentuk balok berukuran panjang ${p} cm, lebar ${l} cm, dan tinggi ${t} cm diisi air sampai penuh. Banyak air adalah ... liter.`, K.num(v), [K.num(v * 10), K.num(v / 2), K.num(p + l + t), K.num(v + 5)], `V = ${p} × ${l} × ${t} = ${K.num(p * l * t)} cm³ = ${K.num(v)} dm³ = ${K.num(v)} liter.`, S.box(p, l, t, "cm")); },
      (K) => { const deb = K.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]), w = K.pick([5, 10, 12, 15, 20, 25, 30]);
        return K.mk(3, "Debit", `Sebuah keran mengalirkan air dengan debit ${deb} liter/menit. Dalam ${w} menit, volume air yang keluar adalah ...`, `${deb * w} liter`, [`${deb + w} liter`, `${deb * w * 60} liter`, `${deb * (w + 5)} liter`, `${Math.round((w / deb) * 10) / 10} liter`], `Volume = debit × waktu = ${deb} × ${w} = ${deb * w} liter.`); },
      (K) => { const V = K.pick([60, 90, 120, 150, 180, 240, 300, 360]), w = K.pick([2, 3, 4, 5, 6]); if (V % w) return null;
        return K.mk(3, "Debit", `Bak mandi berisi ${V} liter air dikuras habis dalam ${w} menit. Debit air yang keluar adalah ...`, `${V / w} liter/menit`, [`${V * w} liter/menit`, `${V - w} liter/menit`, `${V / w + 5} liter/menit`, `${V / w * 60} liter/menit`], `Debit = volume : waktu = ${V} : ${w} = ${V / w} liter/menit.`); },
      (K) => { const a = K.int(2, 5), b = K.int(2, 7); if (a === b || K.gcd(a, b) > 1) return null; const k = K.int(3, 12); const [n1, n2] = K.sample(nama, 2); const tot = (a + b) * k;
        return K.mk(3, "Perbandingan", `Perbandingan kelereng ${n1} dan ${n2} adalah ${a} : ${b}. Jika jumlah kelereng mereka ${tot}, banyak kelereng ${n2} adalah ...`, b * k, [a * k, tot - a, b * k + k, tot / 2 % 1 ? b * k - 1 : tot / 2], `Bagian ${n2} = ${b}/${a + b} × ${tot} = ${b * k}.`); },
      (K) => { const sk = K.pick([100000, 200000, 250000, 500000, 1000000, 1500000, 2000000]), cm = K.int(2, 12); const km = (sk * cm) / 100000;
        return K.mk(3, "Skala", `Jarak dua kota pada peta ${cm} cm. Skala peta 1 : ${K.num(sk)}. Jarak sebenarnya adalah ...`, `${K.num(km)} km`, [`${K.num(km * 10)} km`, `${K.num(km / 10)} km`, `${K.num(sk * cm)} km`, `${K.num(km + cm)} km`], `${cm} × ${K.num(sk)} = ${K.num(sk * cm)} cm = ${K.num(km)} km.`); },
      (K) => { const a = K.int(1, 7), b = K.pick([2, 3, 4, 5, 8]), c = K.int(1, 5), d = K.pick([2, 3, 4, 6]); if (a >= b * 2 || c >= d) return null;
        return K.mk(3, "Pecahan", `Hasil dari ${a}/${b} : ${c}/${d} adalah ...`, K.fr(a * d, b * c), [K.fr(a * c, b * d), K.fr(b * c, a * d), K.fr(a * d + 1, b * c), K.fr(a + c, b + d)], `Bagi pecahan = kali kebalikan: ${a}/${b} × ${d}/${c} = ${a * d}/${b * c} = ${K.fr(a * d, b * c)}.`); },
      (K) => { const a = K.int(8, 16), b = K.int(8, 16), c = K.int(2, a - 4), d = K.int(2, b - 4); const L = a * b - c * d;
        return K.mk(3, "Luas Bangun Datar", "Luas bangun gabungan pada gambar adalah ... (satuan cm)", `${L} cm²`, [`${a * b} cm²`, `${2 * (a + b)} cm²`, `${L + c * d * 2} cm²`, `${L - 4} cm²`], `Luas = persegi panjang besar ${a}×${b} = ${a * b} dikurangi potongan ${c}×${d} = ${c * d}. Hasil ${L} cm².`, S.lshape(a, b, c, d, "cm")); },
      (K) => { const h = K.pick([50, 75, 80, 120, 150, 200, 250, 300, 400]) * 1000, p = K.pick([10, 15, 20, 25, 30, 40, 50]); const bayar = h - (h * p) / 100; const brg = K.pick(["sepatu", "tas sekolah", "baju", "sepeda mini", "jam tangan"]);
        return K.mk(3, "Persen", `Harga ${brg} Rp${K.num(h)} mendapat diskon ${p}%. Uang yang harus dibayar adalah ...`, "Rp" + K.num(bayar), ["Rp" + K.num((h * p) / 100), "Rp" + K.num(h - p * 1000), "Rp" + K.num(bayar + 5000), "Rp" + K.num(h)], `Diskon = ${p}% × ${K.num(h)} = ${K.num((h * p) / 100)}. Bayar = ${K.num(h)} − ${K.num((h * p) / 100)} = ${K.num(bayar)}.`); },
      (K) => { const lab = ["Jan", "Feb", "Mar", "Apr", "Mei"]; const vals = lab.map(() => K.int(3, 25)); const i = K.int(0, 4); let j = K.int(0, 4); if (i === j) return null; const tot = vals.reduce((a, b) => a + b, 0); const mode = K.r() < 0.5;
        return mode ? K.mk(3, "Penyajian Data", `Diagram menunjukkan panen jambu (kuintal). Selisih panen bulan ${lab[i]} dan ${lab[j]} adalah ...`, `${Math.abs(vals[i] - vals[j])} kuintal`, [`${vals[i] + vals[j]} kuintal`, `${Math.abs(vals[i] - vals[j]) + 2} kuintal`, `${Math.max(vals[i], vals[j])} kuintal`, `${Math.abs(vals[i] - vals[j]) + 1} kuintal`], `${lab[i]} = ${vals[i]}, ${lab[j]} = ${vals[j]}. Selisih = ${Math.abs(vals[i] - vals[j])}.`, S.bars(lab, vals, "Hasil panen jambu (kuintal)"))
          : K.mk(3, "Penyajian Data", "Diagram menunjukkan panen jambu (kuintal). Jumlah panen selama 5 bulan adalah ...", `${tot} kuintal`, [`${tot + 5} kuintal`, `${tot - 3} kuintal`, `${Math.max(...vals) * 5} kuintal`, `${tot + 10} kuintal`], `${vals.join(" + ")} = ${tot} kuintal.`, S.bars(lab, vals, "Hasil panen jambu (kuintal)")); },
      (K) => { const v = K.pick([30, 40, 45, 50, 60, 75, 80]), jarak = v * K.pick([2, 3, 4, 5]) / K.pick([1, 2]); if (jarak % 1) return null; const w = jarak / v; const berangkat = K.int(6, 10);
        const mins = Math.round(w * 60), tiba = berangkat * 60 + mins; const fmt = (x) => `${String(Math.floor(x / 60)).padStart(2, "0")}.${String(x % 60).padStart(2, "0")}`;
        return K.mk(3, "Kecepatan", `Ayah berangkat pukul ${fmt(berangkat * 60)} menempuh jarak ${jarak} km dengan kecepatan rata-rata ${v} km/jam. Ayah tiba pukul ...`, fmt(tiba), [fmt(tiba + 30), fmt(tiba - 30), fmt(berangkat * 60 + jarak), fmt(tiba + 15)], `Waktu = jarak : kecepatan = ${jarak} : ${v} = ${K.num(w)} jam (${mins} menit). ${fmt(berangkat * 60)} + ${mins} menit = ${fmt(tiba)}.`); },
      (K) => { const s = K.int(3, 12); const V = s ** 3;
        return K.mk(3, "Volume Bangun Ruang", `Sebuah kubus memiliki volume ${K.num(V)} cm³. Panjang rusuk kubus tersebut adalah ...`, `${s} cm`, [`${s + 1} cm`, `${s - 1} cm`, `${s * 2} cm`, `${Math.round(V / 3)} cm`], `Rusuk = ∛${V} = ${s} cm, karena ${s} × ${s} × ${s} = ${V}.`); },
    ],
  };
  const gen = () => C.build("MTK", 1105, T, C.quota);
  if (typeof module !== "undefined") module.exports = gen; else (G.GEN = G.GEN || {}).MTK = gen;
})(typeof window !== "undefined" ? window : globalThis);
