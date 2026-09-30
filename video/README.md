# Video Storyboard → Video Konsisten

Automasi: gambar referensi / storyboard → keyframe konsisten → klip image-to-video → 1 video final.

## Kenapa konsisten
1. **Referensi dikunci** — setiap keyframe dibuat dari gambar referensi yang sama (karakter, produk) + `character_lock` + `style` + `seed` tetap.
2. **Video dari keyframe** (image-to-video), bukan text-to-video — wajah/produk mengikuti keyframe.
3. **Sambungan antar shot** — `continue_from_previous: true` memakai frame terakhir shot sebelumnya sebagai frame awal; `--tail` memakai keyframe shot berikutnya sebagai frame akhir.
4. **Review bertahap + cache** — cek keyframe dulu, hapus yang meleset, jalankan ulang; hanya yang hilang yang dibuat.

## Pakai
```bash
pip install -r video/requirements.txt      # + ffmpeg
export FAL_KEY=...                          # fal.ai
# taruh gambar di video/refs/, salin & edit storyboard.example.yaml
python video/pipeline.py video/storyboard.example.yaml --dry-run
python video/pipeline.py video/storyboard.example.yaml --keyframes-only   # review out/<project>/*_key.png
python video/pipeline.py video/storyboard.example.yaml --tail              # animasi + gabung → final.mp4
```
Ganti model lewat env: `IMAGE_MODEL` (default `fal-ai/nano-banana/edit`), `VIDEO_MODEL` (default `fal-ai/kling-video/v2.1/pro/image-to-video`).
