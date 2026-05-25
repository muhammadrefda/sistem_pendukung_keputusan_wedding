# Wedding Venue SPK (Simple Additive Weighting)

Sistem Pendukung Keputusan (SPK) untuk pemilihan venue pernikahan menggunakan metode SAW.

## Fitur
- Perhitungan Jarak otomatis menggunakan Haversine Formula.
- Bobot kriteria dinamis (slider).
- Filter harga otomatis (> Rp 40.000.000).
- CRUD Venue (tambah data baru secara real-time).
- Responsive UI dengan Tailwind CSS.

## Stack
- Backend: Node.js, Express.js
- Database: SQLite (in-memory)
- Frontend: HTML, Vanilla JS, Tailwind CSS (CDN)

## Cara Jalankan
1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan server:
   ```bash
   node server.js
   ```
3. Buka browser: `http://localhost:3000`

## Author
Muhammad Refda
