import json,pathlib
d=pathlib.Path(__file__).parent
s="\n\n".join(f"##### FILE: {n}.md\n"+(d/"skills"/f"{n}.md").read_text() for n in ["main","prompting","angles","characters"])
s=s.replace("`","'").replace("${","$ {")
(d/"index.html").write_text((d/"template.html").read_text().replace("__SKILL__",json.dumps(s,ensure_ascii=False).replace("</","<\\/")))
