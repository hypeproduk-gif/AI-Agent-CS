// Evaluasi status LI.FI dan hitung percobaan polling.
const prev = $('Siapkan Polling').first().json;
const s = $json.status || 'PENDING';
const attempt = ($runIndex || 0) + 1;
return [{ json: { ...prev, status: s, substatus: $json.substatus, attempt,
  receiving: $json.receiving?.txHash, done: s === 'DONE' || s === 'FAILED' || s === 'INVALID' || attempt >= 60 } }];
