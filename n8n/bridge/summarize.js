// Ringkas quote LI.FI + guard biaya.
const p = $('Parse Perintah').first().json;
const q = $json;
const est = q.estimate || {};
const usd = (arr) => (arr || []).reduce((s, x) => s + Number(x.amountUSD || 0), 0);
const fee = usd(est.feeCosts), gas = usd(est.gasCosts);
const inUsd = Number(est.fromAmountUSD || 0), outUsd = Number(est.toAmountUSD || 0);
const lossPct = inUsd ? ((inUsd - outUsd) / inUsd) * 100 : 100;
const dec = q.action?.toToken?.decimals ?? 18;
const recv = Number(est.toAmount || 0) / 10 ** dec;
const recvMin = Number(est.toAmountMin || 0) / 10 ** dec;
const pass = lossPct <= p.maxFeePct;
const msg = [
  `🌉 *Quote Bridge*`,
  `${p.amount} ${p.token} (${p.fromName}) → ${p.toToken} (${p.toName})`,
  `Rute: ${q.toolDetails?.name || q.tool}`,
  `Terima: ~${recv.toFixed(6)} (min ${recvMin.toFixed(6)})`,
  `Fee: $${fee.toFixed(2)} | Gas: $${gas.toFixed(2)}`,
  `Total potongan: ${lossPct.toFixed(2)}% (batas ${p.maxFeePct}%)`,
  `Estimasi: ${Math.round((est.executionDuration || 0) / 60)} menit`,
].join('\n');
return [{ json: { ...p, pass, lossPct, msg, tool: q.tool, approvalAddress: est.approvalAddress,
  fromTokenAddress: q.action?.fromToken?.address, transactionRequest: q.transactionRequest } }];
