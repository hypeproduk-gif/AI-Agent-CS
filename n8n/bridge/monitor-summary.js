// Ringkasan harian mode pantau: statistik selisih harga & profit simulasi, lalu reset.
const st = $getWorkflowStaticData('global');
const s = st.stats;
if (!s || !s.scans) return [{ json: { chatId: $env.BRIDGE_ALLOWED_CHAT_ID, text: '📊 Pantau arb: belum ada data scan.' } }];
const rows = Object.entries(s.pairs).sort((a, b) => b[1].maxProfit - a[1].maxProfit).slice(0, 10).map(([k, p]) =>
  `${k}: selisih rata2 ${(p.sumSpread / p.n).toFixed(2)}% (maks ${p.maxSpread.toFixed(2)}%), profit sim maks $${p.maxProfit.toFixed(2)}, untung ${p.win}/${p.sims}x`);
const text = [`📊 *Ringkasan Pantau Arb* (${s.scans} scan, modal $${s.capital})`,
  `Simulasi untung: ${s.win}/${s.sims}`, '', ...rows].join('\n');
st.stats = null;
return [{ json: { chatId: $env.BRIDGE_ALLOWED_CHAT_ID, text } }];
