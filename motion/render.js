// Render brief JSON -> MP4 9:16 (1080x1920, 30fps) + musik & SFX sintetis.
// Pakai: node motion/render.js motion/briefs/tka-quiz.json [out.mp4]
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

const briefPath = process.argv[2];
if (!briefPath) { console.error('pakai: node motion/render.js <brief.json> [out.mp4]'); process.exit(1); }
const brief = JSON.parse(fs.readFileSync(briefPath, 'utf8'));
const out = process.argv[3] || path.join(path.dirname(briefPath), '..', 'out', path.basename(briefPath, '.json') + '.mp4');
fs.mkdirSync(path.dirname(out), { recursive: true });
const FPS = brief.fps || 30;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'engine.html'));
  await page.evaluate(() => document.fonts.ready);
  const dur = await page.evaluate(b => window.load(b), brief);
  const frames = Math.round(dur * FPS);
  const silent = out.replace(/\.mp4$/, '.noaudio.mp4');
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '18', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < frames; f++) {
    await page.evaluate(t => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % FPS === 0) process.stdout.write(`\r${(f / FPS).toFixed(0)}/${dur}s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();

  // Audio: beat 120bpm + whoosh tiap pergantian scene (bisa diganti file musik via brief.music)
  const cuts = []; let acc = 0; brief.scenes.forEach(s => { cuts.push(acc); acc += s.dur || brief.sceneDur || 8; });
  const whoosh = cuts.map(c => `exp(-pow((t-${c}-0.05)*7,2))`).join('+');
  const expr = `0.5*sin(2*PI*(50+90*exp(-mod(t,0.5)*30))*mod(t,0.5))*exp(-mod(t,0.5)*9)` +
    `+0.06*(random(0)*2-1)*exp(-mod(t+0.25,0.5)*40)` +
    `+0.08*sin(2*PI*220*t)*(0.5+0.5*sin(2*PI*0.125*t))` +
    `+0.35*(random(1)*2-1)*(${whoosh})`;
  const audioIn = brief.music ? ['-stream_loop', '-1', '-i', path.resolve(path.dirname(briefPath), brief.music)]
    : ['-f', 'lavfi', '-i', `aevalsrc='${expr}':s=44100:d=${dur}`];
  const vo = brief.voiceover ? ['-i', path.resolve(path.dirname(briefPath), brief.voiceover)] : [];
  const filt = brief.voiceover ? ['-filter_complex', '[1:a]volume=0.25[m];[m][2:a]amix=inputs=2:duration=first[a]', '-map', '0:v', '-map', '[a]']
    : ['-map', '0:v', '-map', '1:a', '-af', 'volume=0.8'];
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', silent, ...audioIn, ...vo, ...filt, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(dur), out]);
  fs.unlinkSync(silent);
  console.log(`\nselesai: ${out} (${dur}s, ${frames} frame)`);
})();
