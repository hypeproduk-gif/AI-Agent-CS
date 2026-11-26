import re,json,pathlib
d=pathlib.Path(__file__).parent; sk=d.parent/"ugc-flow-app"/"skills"
main=(sk/"main.md").read_text(); pr=(sk/"prompting.md").read_text()
ang=(sk/"angles.md").read_text(); ch=(sk/"characters.md").read_text()
clean=lambda s:re.sub(r'\n-{3,}\s*$','',s.strip()).strip()
angles=[clean(s) for s in re.split(r'\n(?=## \d+\. )',ang)[1:]]
parts=ch.split("\n## Menyesuaikan"); chars=[clean(s) for s in re.split(r'\n(?=## [A-H]\. )',parts[0])[1:]]
data={"main":main,"prompting":pr,"angles":angles,"chars":chars,"chHead":parts[0].split("\n## A. ")[0],"chAdj":"## Menyesuaikan"+parts[1]}
assert len(angles)==23 and len(chars)==8
js=json.dumps(data,ensure_ascii=False).replace("</","<\\/").replace("`","\\u0060")
page=(d/"template.html").read_text().replace("__DATA__",js)
(d/"artifact.html").write_text(page)
(d/"index.html").write_text('<!doctype html>\n<html lang="id">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n'+page+'\n</body>\n</html>\n')
