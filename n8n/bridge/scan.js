// Scanner arbitrase lintas chain via LI.FI.
// Tahap 1: harga token per chain (murah, 1 call per token/chain) → cari selisih > ARB_MIN_SPREAD_PCT.
// Tahap 2: kandidat teratas disimulasi penuh: USDC@A → token@B (swap+bridge), lalu token@B → USDC@B.
//          Profit dihitung dari toAmountMin (worst-case slippage) dikurangi gas kedua leg.
const env = $env;
const CHAINS = { eth: 1, op: 10, bsc: 56, polygon: 137, base: 8453, arb: 42161, avax: 43114, linea: 59144, scroll: 534352 };
const chains = (env.ARB_CHAINS || 'arb,base,op,polygon,bsc').split(',').map((s) => s.trim());
const tokens = (env.ARB_TOKENS || 'ETH,WBTC,LINK,UNI,AAVE').split(',').map((s) => s.trim().toUpperCase());
const capital = Number(env.ARB_CAPITAL_USD || 1000);
const minSpread = Number(env.ARB_MIN_SPREAD_PCT || 0.5);
const minProfit = Number(env.ARB_MIN_PROFIT_USD || 5);
const maxSim = Number(env.ARB_MAX_SIMULATIONS || 6);
const wallet = env.BRIDGE_WALLET_ADDRESS;
const headers = env.LIFI_API_KEY ? { 'x-lifi-api-key': env.LIFI_API_KEY } : {};
const get = (url, qs) => this.helpers.httpRequest({ url: 'https://li.quest/v1/' + url, qs, headers, json: true }).catch(() => null);
const usd = (arr) => (arr || []).reduce((s, x) => s + Number(x.amountUSD || 0), 0);

// Tahap 1: harga
const price = {};
await Promise.all(chains.flatMap((c) => [...tokens, 'USDC'].map(async (t) => {
  const r = await get('token', { chain: CHAINS[c], token: t });
  if (r && Number(r.priceUSD) > 0) price[`${t}@${c}`] = r;
})));
const cands = [];
for (const t of tokens) for (const a of chains) for (const b of chains) {
  const pa = price[`${t}@${a}`], pb = price[`${t}@${b}`];
  if (a === b || !pa || !pb || !price[`USDC@${a}`] || !price[`USDC@${b}`]) continue;
  const spread = (Number(pb.priceUSD) / Number(pa.priceUSD) - 1) * 100; // beli murah di A, jual mahal di B
  if (spread >= minSpread) cands.push({ t, a, b, spread, pa: Number(pa.priceUSD), pb: Number(pb.priceUSD) });
}
cands.sort((x, y) => y.spread - x.spread);

// Tahap 2: simulasi penuh
const out = [];
for (const c of cands.slice(0, maxSim)) {
  const usdcA = price[`USDC@${c.a}`];
  const fromAmount = BigInt(Math.round(capital * 1e6)) * 10n ** BigInt(usdcA.decimals) / 1000000n;
  const q1 = await get('quote', { fromChain: CHAINS[c.a], toChain: CHAINS[c.b], fromToken: 'USDC', toToken: c.t,
    fromAmount: fromAmount.toString(), fromAddress: wallet, slippage: 0.005, order: 'CHEAPEST' });
  if (!q1?.estimate) continue;
  const q2 = await get('quote', { fromChain: CHAINS[c.b], toChain: CHAINS[c.b], fromToken: c.t, toToken: 'USDC',
    fromAmount: q1.estimate.toAmountMin, fromAddress: wallet, slippage: 0.005 });
  if (!q2?.estimate) continue;
  const outUsdc = Number(q2.estimate.toAmountMin) / 10 ** q2.action.toToken.decimals;
  const gas = usd(q1.estimate.gasCosts) + usd(q2.estimate.gasCosts);
  const profit = outUsdc - capital - gas;
  out.push({ ...c, profit, pct: (profit / capital) * 100, gas, outUsdc, via: q1.toolDetails?.name || q1.tool,
    mins: Math.round(((q1.estimate.executionDuration || 0) + (q2.estimate.executionDuration || 0)) / 60) });
}

// Anti-spam: peluang yang sama tidak dikirim ulang dalam 30 menit
const seen = $getWorkflowStaticData('global');
const now = Date.now();
const fresh = out.filter((o) => o.profit >= minProfit).sort((x, y) => y.profit - x.profit).filter((o) => {
  const k = `${o.t}:${o.a}:${o.b}`;
  if (seen[k] && now - seen[k] < 30 * 60e3) return false;
  seen[k] = now; return true;
});
if (!fresh.length) return [];
const lines = fresh.map((o) => [
  `*${o.t}* ${o.a} → ${o.b}  (selisih harga ${o.spread.toFixed(2)}%)`,
  `Harga: $${o.pa.toFixed(4)} vs $${o.pb.toFixed(4)} | via ${o.via} | ~${o.mins} mnt`,
  `Modal $${capital} → $${o.outUsdc.toFixed(2)} (min), gas $${o.gas.toFixed(2)}`,
  `Profit bersih worst-case: *$${o.profit.toFixed(2)}* (${o.pct.toFixed(2)}%)`,
  `\`/arb ${o.t} ${o.a} ${o.b} ${capital}\``,
].join('\n'));
return [{ json: { chatId: env.BRIDGE_ALLOWED_CHAT_ID, text: `💰 *Peluang Arbitrase Bridge*\n\n${lines.join('\n\n')}\n\n_Profit dicek ulang saat eksekusi._` } }];
