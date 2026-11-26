#!/usr/bin/env bash
# Salin skill sumber (ugc-flow-app/skills) ke semua aplikasi & paket zip.
set -e
cd "$(dirname "$0")"
SK=ugc-flow-app/skills
cp $SK/*.md ugc-saas/skills/
cp $SK/{prompting,angles,characters}.md ugc-flow-app/dist/ugc-flow-studio/references/
cp $SK/{prompting,angles,characters}.md pov-flow-studio/references/
python3 - <<'PY'
m=open("ugc-flow-app/skills/main.md").read()
def head(p): return open(p).read().split("---\n\n",1)[0]+"---\n\n"
u=head("ugc-flow-app/dist/ugc-flow-studio/SKILL.md")
open("ugc-flow-app/dist/ugc-flow-studio/SKILL.md","w").write(u+m.replace("## Batasan","Referensi: `references/prompting.md` (aturan prompt + kunci produk), `references/angles.md` (15 angle), `references/characters.md` (8 arketipe kreator).\n\n## Batasan",1))
p=head("pov-flow-studio/SKILL.md")
m2=m.replace("# UGC Flow Studio — Alur Produksi","# POV Flow Studio — Alur Produksi").replace("video iklan bergaya kreator (UGC)","video iklan dari sudut pandang Brand Owner, Produk Digital, atau POV Seller")
m2=m2.replace("| Angle iklan | Ya |","| Mode sudut pandang | Ya | Tanyakan: Brand Owner / Produk Digital / POV Seller |\n| Angle iklan | Ya |",1)
m2=m2.replace("## Batasan","Referensi: `references/modes.md` (WAJIB dibaca — aturan tiap mode mengubah siapa di frame, lokasi, cara menampilkan produk, dan dialog), `references/prompting.md`, `references/angles.md`, `references/characters.md`.\n\n## Batasan",1)
open("pov-flow-studio/SKILL.md","w").write(p+m2)
PY
python3 ugc-flow-app/build.py
python3 ugc-prompt-builder/build.py
(cd ugc-flow-app/dist && rm -f *.zip && zip -qr ugc-flow-studio-skill.zip ugc-flow-studio)
T=$(mktemp -d); mkdir $T/pov-flow-studio; cp -r pov-flow-studio/SKILL.md pov-flow-studio/references $T/pov-flow-studio/
rm -f pov-flow-studio/dist/*.zip; (cd $T && zip -qr "$OLDPWD/pov-flow-studio/dist/pov-flow-studio-skill.zip" pov-flow-studio); rm -rf $T
echo "Skill tersinkron."
