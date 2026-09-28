// Signer lokal untuk workflow bridge. Private key TIDAK disimpan di n8n.
// Jalankan: npm i ethers && PRIVATE_KEY=0x... SIGNER_SECRET=... RPC_<chainId>=https://... node signer.js
// Endpoint: POST /execute  header x-signer-secret, body { chainId, approvalAddress, fromTokenAddress, fromAmount, transactionRequest }
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
  if (fromTokenAddress && fromTokenAddress !== ethers.ZeroAddress && approvalAddress) {
    const token = new ethers.Contract(fromTokenAddress, ERC20, w);
    if ((await token.allowance(w.address, approvalAddress)) < BigInt(fromAmount)) {
      await (await token.approve(approvalAddress, fromAmount)).wait();
    }
  }
  const sent = await w.sendTransaction({ to: tx.to, data: tx.data, value: tx.value, gasLimit: tx.gasLimit });
  await sent.wait();
  return { txHash: sent.hash, from: w.address };
}

http.createServer((req, res) => {
  const reply = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (req.method !== 'POST' || req.url !== '/execute') return reply(404, { error: 'not found' });
  if (req.headers['x-signer-secret'] !== SECRET) return reply(401, { error: 'unauthorized' });
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', async () => {
    try { reply(200, await execute(JSON.parse(raw))); }
    catch (e) { reply(500, { error: e.shortMessage || e.message }); }
  });
}).listen(PORT, () => console.log(`signer listening on :${PORT}`));
