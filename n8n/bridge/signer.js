// Signer lokal untuk workflow bridge. Private key TIDAK disimpan di n8n.
// Jalankan: npm i ethers && PRIVATE_KEY=0x... SIGNER_SECRET=... RPC_<chainId>=https://... node signer.js
// Endpoint (header x-signer-secret):
//   POST /execute  body { chainId, approvalAddress, fromTokenAddress, fromAmount, transactionRequest }
//   POST /arb      body { token, fromChain, toChain, capital, minProfit, callbackUrl, chatId }  → 202, progres dikirim ke callbackUrl
const http = require('http');
const { ethers } = require('ethers');

const PORT = process.env.PORT || 8787;
const SECRET = process.env.SIGNER_SECRET;
const MAX_AMOUNT = BigInt(process.env.MAX_FROM_AMOUNT || '0'); // 0 = tanpa batas (unit terkecil token)
if (!process.env.PRIVATE_KEY || !SECRET) throw new Error('PRIVATE_KEY dan SIGNER_SECRET wajib diisi');

const wallet = (chainId) => {
  const rpc = process.env[`RPC_${chainId}`];
  if (!rpc) throw new Error(`RPC_${chainId} belum diset`);
  return new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(rpc));
};
const ERC20 = ['function allowance(address,address) view returns (uint256)', 'function approve(address,uint256) returns (bool)'];

async function execute({ chainId, approvalAddress, fromTokenAddress, fromAmount, transactionRequest: tx }) {
  if (MAX_AMOUNT > 0n && BigInt(fromAmount) > MAX_AMOUNT) throw new Error('Melebihi MAX_FROM_AMOUNT');
  const w = wallet(chainId);
  if (Number(tx.chainId) !== Number(chainId)) throw new Error('chainId transaksi tidak cocok');
  const native = !fromTokenAddress || /^0x0{40}$|^0xe{40}$/i.test(fromTokenAddress);
  if (!native && approvalAddress) {
    const token = new ethers.Contract(fromTokenAddress, ERC20, w);
    if ((await token.allowance(w.address, approvalAddress)) < BigInt(fromAmount)) {
      await (await token.approve(approvalAddress, fromAmount)).wait();
    }
  }
  const sent = await w.sendTransaction({ to: tx.to, data: tx.data, value: tx.value, gasLimit: tx.gasLimit });
  await sent.wait();
  return { txHash: sent.hash, from: w.address };
}

// ---------- Arbitrase: USDC@A → token@B (bridge) → USDC@B ----------
const LIFI = 'https://li.quest/v1/';
const lifiHeaders = process.env.LIFI_API_KEY ? { 'x-lifi-api-key': process.env.LIFI_API_KEY } : {};
const lifi = async (path, qs) => {
  const r = await fetch(LIFI + path + '?' + new URLSearchParams(qs), { headers: lifiHeaders });
  const j = await r.json();
  if (!r.ok) throw new Error(`LI.FI ${path}: ${j.message || r.status}`);
  return j;
};
const gasUsd = (q) => (q.estimate.gasCosts || []).reduce((s, x) => s + Number(x.amountUSD || 0), 0);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SLIPPAGE = process.env.ARB_SLIPPAGE || '0.005';

let busy = false;
async function arb({ token, fromChain, toChain, capital, minProfit, callbackUrl, chatId }) {
  const say = (text) => fetch(callbackUrl, { method: 'POST', headers: { 'content-type': 'application/json', 'x-signer-secret': SECRET },
    body: JSON.stringify({ chatId, text }) }).catch(() => {});
  try {
    const address = wallet(fromChain).address;
    wallet(toChain);
    const usdcA = await lifi('token', { chain: fromChain, token: 'USDC' });
    const fromAmount = (BigInt(Math.round(capital * 1e6)) * 10n ** BigInt(usdcA.decimals) / 1000000n).toString();
    if (MAX_AMOUNT > 0n && BigInt(fromAmount) > MAX_AMOUNT) throw new Error('Melebihi MAX_FROM_AMOUNT');

    // 1. Simulasi ulang kedua leg sebelum eksekusi (worst-case)
    const q1 = await lifi('quote', { fromChain, toChain, fromToken: 'USDC', toToken: token, fromAmount, fromAddress: address, slippage: SLIPPAGE, order: 'CHEAPEST' });
    const q2sim = await lifi('quote', { fromChain: toChain, toChain, fromToken: token, toToken: 'USDC', fromAmount: q1.estimate.toAmountMin, fromAddress: address, slippage: SLIPPAGE });
    const out1 = Number(q2sim.estimate.toAmountMin) / 10 ** q2sim.action.toToken.decimals;
    const profit1 = out1 - capital - gasUsd(q1) - gasUsd(q2sim);
    if (profit1 < minProfit) return say(`🛑 Arb ${token} dibatalkan sebelum eksekusi: profit worst-case sekarang $${profit1.toFixed(2)} (< $${minProfit}). Dana aman, tidak ada tx.`);
    await say(`▶️ Arb ${token}: profit worst-case $${profit1.toFixed(2)}. Leg 1 (bridge via ${q1.tool}) dikirim…`);

    // 2. Leg 1: swap + bridge
    const { txHash } = await execute({ chainId: fromChain, approvalAddress: q1.estimate.approvalAddress,
      fromTokenAddress: q1.action.fromToken.address, fromAmount, transactionRequest: q1.transactionRequest });
    await say(`🚀 Leg 1 tx: \`${txHash}\``);
    let st;
    for (let i = 0; i < 90; i++) { // maks ~45 menit
      await sleep(30000);
      st = await lifi('status', { txHash, bridge: q1.tool, fromChain, toChain }).catch(() => ({ status: 'PENDING' }));
      if (['DONE', 'FAILED', 'INVALID'].includes(st.status)) break;
    }
    if (st.status !== 'DONE' || st.substatus !== 'COMPLETED')
      return say(`⚠️ Leg 1 berakhir ${st.status}/${st.substatus || '-'}. Cek wallet manual (dana bisa di-refund / berupa token lain). Leg 2 tidak dijalankan.`);
    const received = st.receiving.amount;
    const gas1 = Number(st.sending?.gasAmountUSD || gasUsd(q1));

    // 3. Leg 2: jual token di chain tujuan, HANYA jika tetap untung
    const q2 = await lifi('quote', { fromChain: toChain, toChain, fromToken: token, toToken: 'USDC', fromAmount: received, fromAddress: address, slippage: SLIPPAGE });
    const out2 = Number(q2.estimate.toAmountMin) / 10 ** q2.action.toToken.decimals;
    const profit2 = out2 - capital - gas1 - gasUsd(q2);
    if (profit2 < 0)
      return say(`⏸ Leg 1 selesai, tapi menjual sekarang rugi $${(-profit2).toFixed(2)}. Token ${token} DITAHAN di chain tujuan — jual manual saat harga pulih.`);
    const r2 = await execute({ chainId: toChain, approvalAddress: q2.estimate.approvalAddress,
      fromTokenAddress: q2.action.fromToken.address, fromAmount: received, transactionRequest: q2.transactionRequest });
    await say(`✅ Arb ${token} selesai. Leg 2 tx: \`${r2.txHash}\`\nModal $${capital} → min $${out2.toFixed(2)} USDC\nProfit bersih (min): *$${profit2.toFixed(2)}*`);
  } catch (e) {
    await say(`❌ Arb ${token} error: ${e.shortMessage || e.message}`);
  }
}

http.createServer((req, res) => {
  const reply = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (req.method !== 'POST' || !['/execute', '/arb'].includes(req.url)) return reply(404, { error: 'not found' });
  if (req.headers['x-signer-secret'] !== SECRET) return reply(401, { error: 'unauthorized' });
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', async () => {
    try {
      const body = JSON.parse(raw);
      if (req.url === '/arb') {
        if (busy) return reply(409, { error: 'Masih ada arb yang berjalan' });
        busy = true; arb(body).finally(() => { busy = false; });
        return reply(202, { accepted: true });
      }
      reply(200, await execute(body));
    }
    catch (e) { reply(500, { error: e.shortMessage || e.message }); }
  });
}).listen(PORT, () => console.log(`signer listening on :${PORT}`));
