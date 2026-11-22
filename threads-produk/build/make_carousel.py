import sys; sys.path.insert(0,'build'); from make_lp import page, uri
cov=uri(page('Bank-Hook-Prompt-AI-Threads.pdf',1,0),600)
av='<div class="av">G</div>'
def post(t): return f'<div class="post"><div class="hd">{av}<div><b>ghinaelsha</b> <span class="vf">&#10003;</span><span class="tm"> &middot; 2 jam</span></div></div><div class="tx">{t}</div></div>'
ph=lambda t:f'<span class="ph">[{t}]</span>'
F={
"B1":'<div class="f red"><div class="kick">BUAT YANG SERING BUNTU</div><h1>Udah niat posting,<br>tapi bengong di<br><em>baris pertama?</em></h1><div class="swipe">geser &rarr;</div></div>',
"B2":'<div class="f cream"><h2>Orang memutuskan<br>baca atau scroll<br>cuma dari <em>1 baris</em>.</h2><p class="sub">Di iklan namanya thumbnail.<br>Di Threads namanya hook.</p><div class="swipe dk">geser &rarr;</div></div>',
"B3":f'<div class="f cream"><div class="kick dk">CONTOH HOOK #1</div>{post("Aku doang atau kalian juga "+ph("kebiasaan")+"?")}<p class="sub">Tinggal ganti yang di dalam kurung.</p></div>',
"B4":f'<div class="f cream"><div class="kick dk">CONTOH HOOK #2</div>{post("Kamu nggak butuh "+ph("hal mahal")+" buat "+ph("hasil")+".")}<p class="sub">Ada 50 hook kayak gini, 5 jenis.</p></div>',
"B5":'<div class="f cream"><div class="kick dk">STOKNYA NGGAK HABIS</div><div class="prompt">Buat 5 hook curhat tentang <span class="ph">[niche-mu]</span> yang bikin orang mikir "ini aku banget".</div><div class="arrow">&darr; tempel ke ChatGPT / Claude &rarr; keluar 5 hook baru</div><p class="sub">+ 50 prompt AI buat bikin hook sendiri.</p></div>',
"B6":f'<div class="f red row"><img class="cov" src="{cov}"><div class="col"><h2 class="w">50 hook +<br>50 prompt AI</h2><div class="price">Rp29.000 &middot; PDF</div><div class="cta">Ambil sekarang</div></div></div>',
}
css='''*{box-sizing:border-box}body{margin:0;font-family:"Plus Jakarta Sans",sans-serif}
.f{width:1080px;height:1080px;padding:110px;display:flex;flex-direction:column;justify-content:center;gap:32px;position:relative;overflow:hidden}
.row{flex-direction:row;align-items:center;gap:56px}.col{display:flex;flex-direction:column;gap:26px;position:relative}
.cream{background:#FAF6F1;color:#2B2231}.red{background:#8E2A1C;color:#FAF6F1}
.red:before{content:"";position:absolute;right:-260px;top:320px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,#FF8A5B55,transparent 70%)}
.post{background:#fff;border-radius:26px;padding:36px 40px;color:#111;font-size:38px;line-height:1.45;box-shadow:0 2px 0 #e7e1d8}
.hd{display:flex;gap:18px;align-items:center;margin-bottom:18px;font-size:30px}.av{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#FF8A5B,#8E2A1C);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:30px}
.vf{color:#1D9BF0;font-size:24px}.tm{color:#999}
.kick{font-weight:800;letter-spacing:.12em;font-size:28px;color:#FF8A5B;position:relative}.kick.dk{color:#B23A22}
h1{font-size:84px;line-height:1.06;margin:0;font-weight:800;position:relative}h1 em,h2 em{font-style:normal;color:#FF8A5B}
h2{font-size:72px;line-height:1.1;margin:0;font-weight:800}.cream h2 em{color:#B23A22}
.sub{font-size:34px;color:#76697C;margin:0}.swipe{position:absolute;right:110px;bottom:100px;font-size:30px;font-weight:700;opacity:.85}.swipe.dk{color:#B23A22}
.ph{background:#FFE1D4;color:#8E2A1C;border-radius:8px;padding:0 8px;font-weight:700}
.prompt{background:#fff;border:3px dashed #FF8A5B;border-radius:24px;padding:32px 36px;font-size:36px;line-height:1.45}
.arrow{font-size:30px;font-weight:700;color:#B23A22}
.cov{width:360px;border-radius:16px;box-shadow:0 26px 50px #0006;position:relative}
.w{font-size:64px}.price{font-size:36px;font-weight:700}
.cta{align-self:flex-start;background:#FF8A5B;color:#3a0f07;font-weight:800;font-size:36px;padding:22px 44px;border-radius:99px}'''
open('ads/_f.html','w').write('<html><head><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel=stylesheet><style>'+css+'</style></head><body>'+''.join(f'<div id="{k}">{v}</div>' for k,v in F.items())+'</body></html>')
