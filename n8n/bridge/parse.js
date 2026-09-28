// Parse perintah Telegram: /bridge <jumlah> <token> <chainAsal> <chainTujuan> [tokenTujuan]
// contoh: /bridge 100 USDC arb base
const CHAINS = { eth: 1, op: 10, bsc: 56, polygon: 137, base: 8453, arb: 42161, avax: 43114, linea: 59144, scroll: 534352 };
const DECIMALS = { USDC: 6, USDT: 6, ETH: 18, WETH: 18, DAI: 18, WBTC: 8 };
const text = ($json.message?.text || '').trim();
const [cmd, amount, token, from, to, toToken] = text.split(/\s+/);
const err = (m) => [{ json: { ok: false, chatId: $json.message.chat.id, error: m } }];
if (String($json.message?.chat?.id) !== String($env.BRIDGE_ALLOWED_CHAT_ID)) return err('Chat tidak diizinkan');
if (cmd === '/arb') { // /arb <token> <chainAsal> <chainTujuan> [modalUSD]
  const [, tk, a, b, cap] = text.split(/\s+/);
  if (!CHAINS[a] || !CHAINS[b] || a === b) return err('Format: /arb <token> <chainAsal> <chainTujuan> [modalUSD]');
  return [{ json: { ok: true, mode: 'arb', chatId: $json.message.chat.id, token: (tk || '').toUpperCase(),
    fromChain: CHAINS[a], toChain: CHAINS[b], capital: Number(cap || $env.ARB_CAPITAL_USD || 1000),
    minProfit: Number($env.ARB_MIN_PROFIT_USD || 5) } }];
}
if (cmd !== '/bridge') return err('Perintah: /bridge <jumlah> <token> <chainAsal> <chainTujuan> [tokenTujuan] atau /arb <token> <chainAsal> <chainTujuan> [modalUSD]');
const t = (token || '').toUpperCase();
if (!CHAINS[from] || !CHAINS[to]) return err('Chain tidak dikenal. Pilihan: ' + Object.keys(CHAINS).join(', '));
if (!DECIMALS[t]) return err('Token tidak dikenal. Pilihan: ' + Object.keys(DECIMALS).join(', '));
const n = Number(amount);
if (!(n > 0)) return err('Jumlah tidak valid');
const [i, f = ''] = amount.split('.');
const fromAmount = BigInt(i + f.padEnd(DECIMALS[t], '0').slice(0, DECIMALS[t])).toString();
return [{ json: {
  ok: true, mode: 'bridge', chatId: $json.message.chat.id, amount: n, token: t,
  fromChain: CHAINS[from], toChain: CHAINS[to], fromName: from, toName: to,
  toToken: (toToken || t).toUpperCase(), fromAmount,
  wallet: $env.BRIDGE_WALLET_ADDRESS,
  maxFeePct: Number($env.BRIDGE_MAX_FEE_PCT || 1.5),
} }];
