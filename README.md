# Pacific Place - situs statis

## Struktur
Semua file berada di root repo: `index.html`, `shop.html`, `dine.html`, `whatson.html`, `offers.html`, `directory.html`, `privilege.html`, `admin.html`, `404.html`, folder `css/`, `js/`, `data/` (dan `img/` yang dibuat otomatis oleh CMS).

## Deploy ke GitHub Pages
1. Upload semua isi folder situs ke root repo (bukan folder pembungkusnya).
2. Settings > Pages > Deploy from a branch > `main` > `/ (root)`.
3. Buka `https://USERNAME.github.io/REPO/`.

## Menjalankan lokal
Double-klik `index.html` jalan memakai `data/data.js` sebagai cadangan. Untuk data terbaru dari JSON: `python -m http.server` lalu buka `http://localhost:8000`.

## CMS
Buka `admin.html` (ikon gembok kecil di footer). PIN ada di `js/admin.js` (konstanta `PIN`). Login memakai GitHub PAT fine-grained dengan izin Contents: Read and write pada repo ini saja. Tekan **Save to Github** setelah mengubah data.

## Catatan
- PIN hanya penghalang tampilan; keamanan sebenarnya ada pada token. Jangan gunakan token berizin luas.
- Perubahan CMS memperbarui file JSON, bukan `data/data.js` (cadangan untuk mode lokal).
