# Flow UGC Studio

Web app satu halaman yang menggabungkan skill `flow-ugc-ads` + referensi `angles`, `characters`, `prompting` dan memakai Claude API untuk menghasilkan paket produksi iklan UGC Google Flow.

- Buka `index.html` di browser, isi API key Anthropic, upload foto produk, pilih angle & kreator, klik Generate.
- Output: prompt kreator, shot list, prompt Flow bertag aset, briefing Agent mode, skrip voiceover — bisa di-copy per bagian atau download `.md`.
- Edit skill di `skills/*.md` atau UI di `template.html`, lalu jalankan `python3 build.py` untuk membangun ulang `index.html`.
