import json, sys, importlib
mods=[importlib.import_module(m) for m in sys.argv[1].split(",")]; out=sys.argv[2]
ALL=[]
for mod in mods:
    ALL.append(dict(niche=mod.NICHE, setting=mod.SETTING, place=mod.PLACE, faceless=mod.FACELESS, amb=mod.AMB,
      defM=mod.DEF_M, defK=mod.DEF_K, ph=mod.PH, tipsBroll=getattr(mod,"TIPS_BROLL",None), cats=mod.CATS, start=mod.START,
      tpl=json.load(open(mod.TPL_FILE)),
      patterns=[dict(id=p["id"], name=p["name"], sub=p["sub"], inti=p["inti"], psi=p["psikologi"], cocok=p["cocok"], hooks=p["hooks"],
        scripts=[dict(produk=s["produk"], durasi=s["durasi"], scenes=[dict(t=a,vo=b,ov=c,br=d,ai=e) for a,b,c,d,e in s["scenes"]]) for s in p["scripts"]])
        for p in mod.PATTERNS]))
page=open("gen_template.html").read().replace("__DATA__", json.dumps(ALL, ensure_ascii=False).replace("</","<\\/"))
open(out,"w").write(page); print("ok", len(ALL))
