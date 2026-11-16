import html, sys, importlib
mod = importlib.import_module(sys.argv[1]); out = sys.argv[2]
e = html.escape
P = mod.PATTERNS
nav = "".join(f'<a href="#bp{p["id"]}"><b>{p["id"]}</b> {e(p["name"])}</a>' for p in P)
secs = []
for p in P:
    hooks = "".join(f"<li>{e(h)}</li>" for h in p["hooks"])
    scr = []
    for i, s in enumerate(p["scripts"], 1):
        rows = "".join(
            f'<tr><td class="t">{e(t)}</td><td>{e(vo)}</td><td class="ov">{e(ov)}</td>'
            f'<td class="v-broll">{e(br)}</td>'
            f'<td class="v-ai"><code>{e(ai + mod.AI_SUFFIX)}</code><button class="cp" type="button">Salin</button></td></tr>'
            for t, vo, ov, br, ai in s["scenes"])
        scr.append(f'''<article class="script"><header><span class="sn">Naskah {p["id"]}.{i}</span>
<h3>{e(s["produk"])}</h3><span class="dur">{e(s["durasi"])} · {len(s["scenes"])} scene</span></header>
<div class="tw"><table><thead><tr><th>Detik</th><th>VO</th><th>Teks overlay</th>
<th class="v-broll">Shot B-roll</th><th class="v-ai">Prompt video AI (per scene)</th></tr></thead><tbody>{rows}</tbody></table></div></article>''')
    secs.append(f'''<section class="bp" id="bp{p["id"]}"><div class="bphead"><span class="num">{p["id"]}</span>
<div><h2>{e(p["name"])}</h2><p class="sub">{e(p["sub"])} · cocok untuk {e(p["cocok"])}</p></div></div>
<div class="grid"><div><h4>Inti pola</h4><p>{e(p["inti"])}</p><h4>Kenapa convert</h4><p>{e(p["psikologi"])}</p></div>
<div><h4>5 hook</h4><ol class="hooks">{hooks}</ol></div></div>{"".join(scr)}</section>''')
start = "".join(f"<tr><td class='t'>{e(a)}</td><td><b>{e(b)}</b></td><td>{e(c)}</td></tr>" for a,b,c in mod.START)
n_s = sum(len(p["scripts"]) for p in P)
page = f'''<title>Blueprint Video Dapur</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Inter:wght@400;600&family=JetBrains+Mono&display=swap">
<style>
/* layout: single reading column; sticky mode switch; wide tables scroll inside their box */
:root{{--bg:#fbfaf7;--fg:#22261f;--muted:#5d6457;--line:#e2e1d8;--accent:#c2410c;--soft:#f1efe6;--on:#fff;
--display:"Bricolage Grotesque",system-ui,sans-serif;--body:Inter,system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#171a16;--fg:#e9eae3;--muted:#a3a99b;--line:#30352d;--accent:#fb923c;--soft:#22261f;--on:#171a16;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#171a16;--fg:#e9eae3;--muted:#a3a99b;--line:#30352d;--accent:#fb923c;--soft:#22261f;--on:#171a16;color-scheme:dark}}
body{{background:var(--bg);color:var(--fg);font:15px/1.6 var(--body);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:32px 64px}}
body::before{{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--bg)}}
main{{max-width:980px;margin:0 auto}}
h1{{font:800 clamp(28px,5vw,44px)/1.1 var(--display);text-wrap:balance;margin:0 0 8px}}
.lede{{color:var(--muted);max-width:65ch;margin:0}}
.stats{{display:flex;flex-wrap:wrap;gap:8px 24px;margin:16px 0 0;font-variant-numeric:tabular-nums}}
.stats b{{font:800 22px var(--display);color:var(--accent)}}
.bar{{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);padding-block:12px;margin-top:24px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:12px;align-items:center}}
.seg{{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:3px}}
.seg button{{font:600 14px var(--body);border:0;background:none;color:var(--fg);padding:7px 16px;border-radius:999px;cursor:pointer}}
.seg button[aria-pressed="true"]{{background:var(--accent);color:var(--on)}}
.seg button:focus-visible,.cp:focus-visible,nav a:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
.mode-note{{font-size:13px;color:var(--muted);flex:1;min-width:220px}}
nav{{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 0}}
nav a{{font-size:13px;color:var(--fg);text-decoration:none;border:1px solid var(--line);border-radius:6px;padding:4px 10px}}
nav a b{{color:var(--accent);font-family:var(--mono);font-weight:400}}
.guide{{margin-top:32px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}}
.guide>div{{background:var(--soft);border-radius:10px;padding:16px;min-width:0}}
.guide h4{{margin-top:0}}
.guide ul{{margin:0;padding-left:18px}}
h4{{font:600 12px var(--body);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:16px 0 4px}}
.bp{{margin-top:64px;scroll-margin-top:80px}}
.bphead{{display:flex;gap:16px;align-items:baseline;border-top:2px solid var(--accent);padding-top:16px}}
.num{{font:800 40px/1 var(--display);color:var(--accent)}}
h2{{font:800 26px/1.2 var(--display);margin:0;text-wrap:balance}}
.sub{{margin:4px 0 0;color:var(--muted);font-size:14px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:8px 32px}}
.grid>div{{min-width:0}} .grid p{{margin:0}}
.hooks{{margin:0;padding-left:20px}} .hooks li{{margin:2px 0}}
.script{{margin-top:28px}}
.script header{{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}}
.sn{{font:13px var(--mono);color:var(--accent)}}
h3{{font:600 18px var(--display);margin:0}}
.dur{{font-size:13px;color:var(--muted)}}
.tw{{overflow-x:auto;margin-top:10px;border:1px solid var(--line);border-radius:8px}}
table{{border-collapse:collapse;width:100%;font-size:14px;min-width:760px}}
th,td{{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid var(--line)}}
th{{background:var(--soft);font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}}
tr:last-child td{{border-bottom:0}}
td.t{{font:13px var(--mono);white-space:nowrap;color:var(--accent);font-variant-numeric:tabular-nums}}
td.ov{{font-weight:600;font-size:13px}}
td.v-ai code{{display:block;font:12.5px/1.55 var(--mono);white-space:pre-wrap;word-break:break-word}}
.cp{{margin-top:6px;font:600 12px var(--body);border:1px solid var(--line);background:var(--bg);color:var(--fg);border-radius:6px;padding:3px 10px;cursor:pointer}}
body.mode-broll .v-ai,body.mode-ai .v-broll{{display:none}}
th.v-broll,th.v-ai{{width:38%}}
.start table{{min-width:520px}}
</style>
<main>
<h1>Blueprint Video Winning: Dapur &amp; Peralatan Masak</h1>
<p class="lede">10 pola video affiliate yang terbukti convert. Setiap pola punya 3 naskah siap pakai dalam dua versi: rekam B-roll sendiri, atau buat full video AI.</p>
<div class="stats"><span><b>{len(P)}</b> pola</span><span><b>{n_s}</b> naskah</span><span><b>{len(P)*5}</b> hook</span><span><b>2</b> versi produksi</span></div>
<div class="bar"><div class="seg" role="group" aria-label="Versi produksi"><button type="button" id="m-broll" data-m="broll" aria-pressed="true">Versi rekam B-roll</button><button type="button" id="m-ai" data-m="ai" aria-pressed="false">Versi video AI</button></div>
<span class="mode-note" id="note"></span></div>
<nav aria-label="Daftar pola">{nav}</nav>
<div class="guide">
<div><h4>Versi rekam B-roll</h4><ul><li>Rekam pakai HP, 9:16, cahaya dari jendela samping.</li><li>Faceless cukup tangan; kuku rapi, tangan bersih.</li><li>Rekam audio dekat produk. Suara kriuk, cesss, dan klik lebih kuat dari musik.</li><li>VO direkam terpisah setelah video dipotong.</li></ul></div>
<div><h4>Versi video AI (Flow / Veo)</h4><ul><li>Satu prompt = satu clip (maks. 8 detik). Gabungkan clip sesuai urutan scene.</li><li>Upload foto produk asli sebagai referensi (Ingredients / Frames to video) agar bentuk produk tidak berubah.</li><li>VO pakai suara sendiri atau TTS; teks overlay ditambahkan di CapCut.</li><li>Jangan pakai AI untuk klaim hasil yang tidak sesuai produk asli.</li></ul></div>
<div class="start"><h4>Mulai dari sini: 7 hari pertama</h4><div class="tw"><table><tbody>{start}</tbody></table></div></div>
</div>
{"".join(secs)}
<section class="bp"><div class="bphead"><div><h2>Aturan emas konten dapur</h2></div></div><ol>
<li>Suara adalah senjata: kriuk, cesss, klik, dan suara blender menahan jempol.</li>
<li>Selalu tunjukkan bukti fisik (tes tisu, tes telur, toples dibalik), jangan cuma klaim.</li>
<li>Teks overlay maks. 6 kata per layar, di sepertiga tengah supaya tidak tertutup tombol aplikasi.</li>
<li>Upload 2 pola berbeda untuk produk yang sama, lalu pertahankan yang menang.</li>
<li>Angka hemat dan klaim harus wajar dan sesuai produk; jangan klaim medis.</li></ol></section>
</main>
<script>
const notes={{broll:"Kolom kanan: arahan shot untuk direkam sendiri pakai HP.",ai:"Kolom kanan: prompt per scene untuk Flow/Veo. Tekan Salin lalu tempel."}};
function setMode(m){{document.body.className="mode-"+m;document.querySelectorAll(".seg button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===m));document.getElementById("note").textContent=notes[m];try{{localStorage.setItem("bpmode",m)}}catch(e){{}}}}
let m0="broll";try{{m0=localStorage.getItem("bpmode")||"broll"}}catch(e){{}}
setMode(m0==="ai"?"ai":"broll");
document.querySelectorAll(".seg button").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.m)));
document.addEventListener("click",ev=>{{const b=ev.target.closest(".cp");if(!b)return;const code=b.previousElementSibling;
const done=()=>{{b.textContent="Tersalin";setTimeout(()=>b.textContent="Salin",1500)}};
const sel=()=>{{const r=document.createRange();r.selectNodeContents(code);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="Teks dipilih"}};
if(navigator.clipboard)navigator.clipboard.writeText(code.textContent).then(done,sel);else sel();}});
</script>'''
open(out, "w").write(page)
print("ok", n_s)
