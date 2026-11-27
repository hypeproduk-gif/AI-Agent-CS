# Motion Ads — brief JSON → MP4 9:16

```bash
node motion/render.js motion/briefs/tka-quiz.json   # hasil: motion/out/tka-quiz.mp4
```

Satu brief = satu video, 3–5 scene, default 8 detik per scene (`sceneDur` / `dur` per scene).
`style` berlaku untuk semua scene; `type` per scene boleh `cta`/`counter` untuk penutup.

| style | field scene |
|---|---|
| kinetic | `text`, `hl`, `tag` |
| chat | `group`, `messages[{from,text,me,hl}]`, `notif{text}` |
| quiz | `question`, `options[]`, `answer` (index), `explain`, `tag` |
| mitos | `mitos`, `fakta`, `hl`, `tag` |
| counter | `value`, `label`, `prefix`, `suffix`, `bar` (0–100), `sub` |
| cta | `title`, `hl`, `chips[]`, `price`, `button` |

Opsional: `palette` (0–4, kosongkan = ganti warna tiap scene), `watermark`,
`music` (file audio, menggantikan beat sintetis), `voiceover` (file VO, musik otomatis dikecilkan).
Style baru = tambah fungsi `S.<nama>` di `engine.html`.
