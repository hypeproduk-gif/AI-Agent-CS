// Simulator mini n8n: jalankan workflow hasil build dengan HTTP tiruan.
// Cukup untuk node yang dipakai di sini (webhook, filter, dataTable, code, httpRequest, if, telegram).

function evalExpr(expr, ctx) {
  if (typeof expr !== 'string' || !expr.startsWith('=')) return expr;
  const tpl = expr.slice(1);
  const run = (code) => new Function('$json', '$', `return (${code});`)(ctx.$json, ctx.$);
  const whole = tpl.match(/^\{\{([\s\S]*)\}\}$/);
  if (whole && !whole[1].includes('}}')) return run(whole[1]);
  return tpl.replace(/\{\{([\s\S]*?)\}\}/g, (_, code) => {
    const v = run(code);
    return v === undefined || v === null ? '' : String(v);
  });
}

function simulate(workflow, { webhookBody, row, http }) {
  const byName = Object.fromEntries(workflow.nodes.map((n) => [n.name, n]));
  const outputs = {}; // name → [item json]
  const requests = []; // { node, method, url, body }
  const $ = (name) => ({
    first: () => ({ json: outputs[name][0] }),
    item: { json: outputs[name] && outputs[name][0] },
    get isExecuted() { return name in outputs; },
  });

  const queue = [['Webhook', [{ body: webhookBody, headers: {} }]]];
  while (queue.length) {
    const [name, input] = queue.shift();
    const node = byName[name];
    const p = node.parameters;
    const json = input[0];
    const ex = (v) => evalExpr(v, { $json: json, $ });
    let out; let branch = 0;

    switch (node.type) {
      case 'n8n-nodes-base.webhook':
      case 'n8n-nodes-base.telegram':
        out = input;
        if (node.type.endsWith('telegram')) requests.push({ node: name, body: ex(p.text) });
        break;
      case 'n8n-nodes-base.filter':
        out = p.conditions.conditions.every((c) => ex(c.leftValue) !== c.rightValue) ? input : null;
        break;
      case 'n8n-nodes-base.dataTable':
        if (p.operation === 'get') out = [row || {}];
        else {
          const cols = Object.fromEntries(Object.entries(p.columns.value).map(([k, v]) => [k, ex(v)]));
          requests.push({ node: name, body: cols });
          out = [cols];
        }
        break;
      case 'n8n-nodes-base.code': {
        const items = input.map((j) => ({ json: j }));
        const res = new Function('$', '$input', 'items', p.jsCode)($, { first: () => items[0] }, items);
        out = res.length ? res.map((r) => r.json) : null;
        break;
      }
      case 'n8n-nodes-base.if':
        branch = p.conditions.conditions.every((c) => ex(c.leftValue) === true) ? 0 : 1;
        out = input;
        break;
      case 'n8n-nodes-base.httpRequest': {
        const url = ex(p.url);
        const body = p.jsonBody ? JSON.parse(ex(p.jsonBody)) :
          p.bodyParameters ? Object.fromEntries(p.bodyParameters.parameters.map((b) => [b.name, ex(b.value)])) : null;
        requests.push({ node: name, method: p.method || 'GET', url, body });
        out = [http(name, { url, body })];
        break;
      }
      default:
        throw new Error('Node type belum didukung simulator: ' + node.type);
    }
    if (!out) continue;
    outputs[name] = out;
    const conns = (workflow.connections[name] || { main: [] }).main[branch] || [];
    conns.forEach((c) => queue.push([c.node, out]));
  }
  return { outputs, requests };
}

module.exports = { simulate };
