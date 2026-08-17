const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:'); // Use :memory: for easy testing or 'wedding.db' for persistence

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Coordinates
const HOME_REFDA = { lat: -6.346833, lng: 106.814806 };
const HOME_TIARA = { lat: -6.295991, lng: 106.863323 };

// Initialize DB
db.serialize(() => {
  db.run(`CREATE TABLE venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    lat REAL,
    lng REAL,
    price REAL,
    practicality INTEGER,
    parking INTEGER,
    capacity INTEGER,
    worship INTEGER,
    accessibility INTEGER,
    pax INTEGER
  )`);

  const stmt = db.prepare("INSERT INTO venues (name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const seedData = [
    ['Arthama Hotel', -6.1873, 106.8181, 33903500, 5, 9, 8, 9, 10, 200],
    ['Kinanti House', -6.2841, 106.8445, 33503500, 10, 4, 7, 6, 8, 200],
    ['Rumah Kayu Ilir', -6.4025, 106.8013, 36353500, 5, 7, 9, 7, 5, 200],
    ['Masjid Ramlie', -6.1436, 106.8732, 31703500, 4, 8, 10, 10, 7, 200],
    ['Rumarasa (Paket Nusantara)', -6.2343, 106.8085, 40000000, 8, 8, 6, 8, 9, 200],
    ['Rumarasa (Paket Rumarasa)', -6.2343, 106.8085, 30000000, 7, 8, 6, 8, 9, 200],
    ['Sanggar De Batavia', -6.349414571062471, 106.81107361349365, 68000000, 8, 8, 8, 8, 8, 300],
    ['Kedai Haji Asari (Akad & Resepsi 2 sesi, perlu konfirmasi ulang)', -6.334112818239587, 106.82822140924058, 27000000, 8, 8, 8, 8, 8, 200],
    ['Masjid At-Tin (Akad Only)', -6.29750321182259, 106.88447378991626, 3000000, 8, 8, 8, 8, 8, 200]
  ];
  seedData.forEach(data => stmt.run(data));
  stmt.finalize();

  db.run(`CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    task TEXT,
    done INTEGER DEFAULT 0
  )`);

  const taskStmt = db.prepare("INSERT INTO tasks (category, task, done) VALUES (?, ?, 0)");
  const taskSeed = [
    ['Administratif (KUA)', 'Surat pengantar nikah dari RT/RW & kelurahan'],
    ['Administratif (KUA)', 'Fotokopi KTP, KK, akta kelahiran kedua calon pengantin'],
    ['Administratif (KUA)', 'Pas foto latar biru 4x6 & 2x3 + softcopy'],
    ['Administratif (KUA)', 'Surat keterangan sehat dari puskesmas/faskes'],
    ['Administratif (KUA)', 'Daftar nikah via SIMKAH / datang ke KUA (min. H-10)'],
    ['Administratif (KUA)', 'Surat rekomendasi nikah KUA (jika akad beda kecamatan)'],
    ['Administratif (KUA)', 'Izin tertulis orang tua/wali (jika di bawah 21 tahun)'],
    ['Administratif (KUA)', 'Ikut Bimbingan Perkawinan (Bimwin/Suscatin) & ambil sertifikat'],
    ['Kesehatan', 'Medical check-up (MCU) pra-nikah'],
    ['Kesehatan', 'Imunisasi TT (tetanus toxoid) calon pengantin wanita'],
    ['Kesehatan', 'Konseling pra-nikah (pre-marriage counseling)'],
    ['Venue & Vendor', 'Survey & booking venue akad'],
    ['Venue & Vendor', 'Survey & booking venue resepsi'],
    ['Venue & Vendor', 'Booking catering'],
    ['Venue & Vendor', 'Booking dekorasi'],
    ['Venue & Vendor', 'Booking fotografer & videografer'],
    ['Venue & Vendor', 'Booking MUA (make-up artist) & busana pengantin'],
    ['Venue & Vendor', 'Booking MC & entertainment/band'],
    ['Venue & Vendor', 'Pesan cetak/desain undangan'],
    ['Venue & Vendor', 'Booking mobil pengantin'],
    ['Venue & Vendor', 'Beli/pesan cincin kawin'],
    ['Tamu & Acara', 'Susun & update daftar tamu undangan'],
    ['Tamu & Acara', 'Cetak & sebar undangan (fisik/digital)'],
    ['Tamu & Acara', 'Susun rundown acara akad & resepsi'],
    ['Tamu & Acara', 'Siapkan seragam keluarga (baju kompak)'],
    ['Tamu & Acara', 'Siapkan souvenir pernikahan'],
    ['Rumah Tangga', 'List & cari kontrakan/rumah tinggal'],
    ['Rumah Tangga', 'List perabotan rumah tangga yang perlu dibeli'],
    ['Rumah Tangga', 'Urus pindah domisili/KTP (jika pindah alamat)'],
    ['Rumah Tangga', 'Update Kartu Keluarga pasca nikah'],
    ['Lainnya', 'Susun & tracking anggaran pernikahan'],
    ['Lainnya', 'Rencana bulan madu (honeymoon)']
  ];
  taskSeed.forEach(data => taskStmt.run(data));
  taskStmt.finalize();
});

// Haversine Formula
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Routes
app.get('/api/venues', (req, res) => {
  db.all("SELECT * FROM venues", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/venues', (req, res) => {
  const { name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax } = req.body;
  db.run(`INSERT INTO venues (name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

app.put('/api/venues/:id', (req, res) => {
  const { name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax } = req.body;
  db.run(`UPDATE venues SET name=?, lat=?, lng=?, price=?, practicality=?, parking=?, capacity=?, worship=?, accessibility=?, pax=? WHERE id=?`,
    [name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

app.delete('/api/venues/:id', (req, res) => {
  db.run(`DELETE FROM venues WHERE id=?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/calculate', (req, res) => {
  const weights = req.body.weights; // { price, distRefda, distTiara, practicality, parking, capacity, worship, accessibility }
  
  db.all("SELECT * FROM venues", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // 1. Filter Price > 40M and Calculate Distances
    let processed = rows
      .filter(v => v.price <= 70000000)
      .map(v => ({
        ...v,
        distRefda: haversine(v.lat, v.lng, HOME_REFDA.lat, HOME_REFDA.lng),
        distTiara: haversine(v.lat, v.lng, HOME_TIARA.lat, HOME_TIARA.lng)
      }));

    if (processed.length === 0) return res.json([]);

    // 2. Normalization
    const mins = {
      price: Math.min(...processed.map(v => v.price)),
      distRefda: Math.min(...processed.map(v => v.distRefda)),
      distTiara: Math.min(...processed.map(v => v.distTiara))
    };
    const maxs = {
      practicality: Math.max(...processed.map(v => v.practicality)),
      parking: Math.max(...processed.map(v => v.parking)),
      capacity: Math.max(...processed.map(v => v.capacity)),
      worship: Math.max(...processed.map(v => v.worship)),
      accessibility: Math.max(...processed.map(v => v.accessibility)),
      pax: Math.max(...processed.map(v => v.pax))
    };

    const ranked = processed.map(v => {
      // Normalization R_ij
      const r = {
        price: mins.price / v.price,
        distRefda: mins.distRefda / v.distRefda,
        distTiara: mins.distTiara / v.distTiara,
        practicality: v.practicality / maxs.practicality,
        parking: v.parking / maxs.parking,
        capacity: v.capacity / maxs.capacity,
        worship: v.worship / maxs.worship,
        accessibility: v.accessibility / maxs.accessibility,
        pax: v.pax / maxs.pax
      };

      // Final Score V_i
      const score = (r.price * weights.price) +
                    (r.distRefda * weights.distRefda) +
                    (r.distTiara * weights.distTiara) +
                    (r.practicality * weights.practicality) +
                    (r.parking * weights.parking) +
                    (r.capacity * weights.capacity) +
                    (r.worship * weights.worship) +
                    (r.accessibility * weights.accessibility) +
                    (r.pax * (weights.pax || 0));
      
      return { ...v, score: score.toFixed(4) };
    }).sort((a, b) => b.score - a.score);

    res.json(ranked);
  });
});

app.post('/api/resolve-maps', async (req, res) => {
  const { mapsUrl } = req.body;
  try {
    const response = await fetch(mapsUrl, { redirect: "follow", method: "HEAD" });
    res.json({ finalUrl: response.url });
  } catch (e) {
    res.status(400).json({ error: "Failed to resolve URL" });
  }
});

app.get('/api/tasks', (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY category, id", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { category, task } = req.body;
  db.run(`INSERT INTO tasks (category, task, done) VALUES (?, ?, 0)`,
    [category, task],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

app.patch('/api/tasks/:id', (req, res) => {
  const { done } = req.body;
  db.run(`UPDATE tasks SET done = ? WHERE id = ?`, [done ? 1 : 0, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
