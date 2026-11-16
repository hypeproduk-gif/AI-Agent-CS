import json, sys, importlib
mod = importlib.import_module(sys.argv[1]); out = sys.argv[2]
data = dict(niche=mod.NICHE, suffix=mod.AI_SUFFIX, start=mod.START, patterns=[
  dict(id=p["id"], name=p["name"], sub=p["sub"], inti=p["inti"], psi=p["psikologi"], cocok=p["cocok"], hooks=p["hooks"],
       scripts=[dict(produk=s["produk"], durasi=s["durasi"], scenes=[dict(t=a,vo=b,ov=c,br=d,ai=e) for a,b,c,d,e in s["scenes"]]) for s in p["scripts"]])
  for p in mod.PATTERNS])
CATS = [("Semua",None),("Alat potong & kupas",["01","03","09"]),("Alat masak listrik",["02","04","10"]),
        ("Panci, wajan, pisau",["05","06"]),("Wadah & tempat penyimpanan",["07"]),("Barang di atas Rp200 ribu",["06","08","10"])]
tpl = open("gen_template.html").read()
page = tpl.replace("__DATA__", json.dumps(data, ensure_ascii=False).replace("</","<\\/")).replace("__CATS__", json.dumps(CATS, ensure_ascii=False))
open(out,"w").write(page); print("ok")
