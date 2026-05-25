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
    parking INTEGER
  )`);

  const stmt = db.prepare("INSERT INTO venues (name, lat, lng, price, practicality, parking) VALUES (?, ?, ?, ?, ?, ?)");
  const seedData = [
    ['Arthama Hotel', -6.1873, 106.8181, 33903500, 5, 9],
    ['Kinanti House', -6.2841, 106.8445, 33503500, 10, 4],
    ['Rumah Kayu Ilir', -6.4025, 106.8013, 36353500, 5, 7],
    ['Masjid Ramlie', -6.1436, 106.8732, 31703500, 4, 8]
  ];
  seedData.forEach(data => stmt.run(data));
  stmt.finalize();
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
  const { name, lat, lng, price, practicality, parking } = req.body;
  db.run(`INSERT INTO venues (name, lat, lng, price, practicality, parking) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, lat, lng, price, practicality, parking],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

app.post('/api/calculate', (req, res) => {
  const weights = req.body.weights; // { price, distRefda, distTiara, practicality, parking }
  
  db.all("SELECT * FROM venues", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // 1. Filter Price > 40M and Calculate Distances
    let processed = rows
      .filter(v => v.price <= 40000000)
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
      parking: Math.max(...processed.map(v => v.parking))
    };

    const ranked = processed.map(v => {
      // Normalization R_ij
      const r = {
        price: mins.price / v.price,
        distRefda: mins.distRefda / v.distRefda,
        distTiara: mins.distTiara / v.distTiara,
        practicality: v.practicality / maxs.practicality,
        parking: v.parking / maxs.parking
      };

      // Final Score V_i
      const score = (r.price * weights.price) +
                    (r.distRefda * weights.distRefda) +
                    (r.distTiara * weights.distTiara) +
                    (r.practicality * weights.practicality) +
                    (r.parking * weights.parking);
      
      return { ...v, score: score.toFixed(4) };
    }).sort((a, b) => b.score - a.score);

    res.json(ranked);
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
