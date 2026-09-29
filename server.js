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
    done INTEGER DEFAULT 0,
    pic TEXT DEFAULT 'Bersama',
    priority TEXT DEFAULT 'Normal',
    notes TEXT DEFAULT ''
  )`);

  const taskStmt = db.prepare("INSERT INTO tasks (category, task, done, pic, priority, notes) VALUES (?, ?, 0, ?, ?, ?)");
  const taskSeed = [
    // Administratif (KUA)
    ['Administratif (KUA)', 'Ajukan cuti kerja untuk pendaftaran ke KUA', 'Refda', 'Urgent', 'KUA buka Senin-Jumat 09.00-17.00 WIB (tutup Sabtu-Minggu). Pastikan tanggal cuti Refda & Tiara klop.'],
    ['Administratif (KUA)', 'Tentukan lokasi akad nikah: KUA Jagakarsa vs KUA Tebet', 'Bersama', 'Urgent', 'Pilihan 1: KUA Jagakarsa, Pilihan 2: KUA Tebet. Cek jadwal penghulu & kelengkapan wilayah domisili.'],
    ['Administratif (KUA)', 'Surat pengantar nikah dari kelurahan (Formulir N1–N4)', 'Bersama', 'Normal', 'Minta surat pengantar RT/RW lalu diproses ke kelurahan domisili masing-masing calon pengantin.'],
    ['Administratif (KUA)', 'Fotokopi & dokumen asli: KTP, KK, Akta Kelahiran', 'Bersama', 'Normal', 'Bawa dokumen asli untuk verifikasi data pencocokan di loket KUA.'],
    ['Administratif (KUA)', 'Surat keterangan sehat & skrining catin faskes/puskesmas', 'Bersama', 'Normal', 'Termasuk cek lab kesehatan pra-nikah dan imunisasi TT bagi calon pengantin wanita.'],
    ['Administratif (KUA)', 'Persetujuan kedua calon pengantin (Formulir N4)', 'Bersama', 'Normal', 'Formulir persetujuan resmi ditandatangani kedua belah pihak calon pengantin.'],
    ['Administratif (KUA)', 'Surat rekomendasi nikah dari KUA kecamatan domisili', 'Bersama', 'Normal', 'Wajib diurus jika lokasi akad dilangsungkan di luar kecamatan domisili pengantin.'],
    ['Administratif (KUA)', 'Pas foto latar biru (2x3 & 4x6 fisik + softcopy)', 'Bersama', 'Normal', 'Pakaian formal rapi, latar belakang warna biru resmi Kemenag.'],
    ['Administratif (KUA)', 'Daftar nikah via SIMKAH / loket KUA (minimal H-10 hari kerja)', 'Bersama', 'Normal', 'Daftar online di simkah.kemenag.go.id lalu konfirmasi fisik berkas ke KUA terkait.'],
    ['Administratif (KUA)', 'Ikut Bimbingan Perkawinan (Bimwin/Suscatin) & sertifikat', 'Bersama', 'Normal', 'Sertifikat bimbingan perkawinan diperlukan untuk pengambilan Buku Nikah.'],

    // Busana & Penampilan
    ['Busana & Penampilan', 'SOLUSI: Baju beskap kekecilan (retur / tukar size / alter penjahit)', 'Refda', 'Urgent', 'Urus tukar size ke seller atau bawa ke penjahit untuk alter ukuran lingkar dada/bahu.'],
    ['Busana & Penampilan', 'Cek kelengkapan seragam sodara (bludru merah, kerudung, bros)', 'Tiara', 'Normal', 'Pastikan semua saudara yang wajib seragam terdata rapi dan set perlengkapannya lengkap.'],
    ['Busana & Penampilan', 'Fitting busana akad & resepsi pengantin (beskap/jas & kebaya)', 'Bersama', 'Normal', 'Jadwalkan fitting final H-14 untuk antisipasi penyesuaian ukuran badan.'],
    ['Busana & Penampilan', 'Seragam keluarga inti (orang tua & besan)', 'Keluarga', 'Normal', 'Warna dan model diselaraskan dengan tema warna utama acara.'],
    ['Busana & Penampilan', 'Booking MUA & Hairdo/Hijabdo pengantin & ibu', 'Tiara', 'Normal', 'Konfirmasi jadwal kedatangan MUA di lokasi makeup/akad pagi hari.'],

    // Undangan & Digital
    ['Undangan & Digital', 'Bikin Undangan Digital custom (web interaktif khusus, bukan template biasa)', 'Refda', 'Urgent', 'Refda handle koding dan desain custom eksklusif agar personal, elegan, dan istimewa.'],
    ['Undangan & Digital', 'Finalisasi denah lokasi & QR Maps untuk undangan fisik', 'Tiara', 'Normal', 'Tiara sudah buat konsep denah, cek keterbacaan rute dan uji coba scan QR Code.'],
    ['Undangan & Digital', 'Pesan cetak undangan fisik & cek proofing mockup', 'Bersama', 'Normal', 'Cek ejaan nama lengkap, nama orang tua, tanggal, dan alamat sebelum cetak massal.'],
    ['Undangan & Digital', 'Susun daftar tamu undangan (VIP, keluarga, rekan kerja, sahabat)', 'Bersama', 'Normal', 'Kelompokkan daftar tamu dan siapkan nomor WhatsApp aktif untuk pengiriman undangan.'],
    ['Undangan & Digital', 'Distribusi undangan fisik & broadcast link undangan digital personal', 'Bersama', 'Normal', 'Sebar bertahap mulai H-30 hingga H-14.'],

    // Videotron & Acara
    ['Videotron & Acara', 'Finishing animasi video pembuka/bumper videotron via AI/Canva', 'Refda', 'Urgent', 'Refda bantu proses rendering dan revisi animasi agar Tiara tidak lelah sendirian.'],
    ['Videotron & Acara', 'Review & finalisasi materi PPT Games interaktif videotron', 'Refda', 'Normal', 'Cek ukuran slide (16:9), animasi transisi, dan keterbacaan teks di layar besar venue.'],
    ['Videotron & Acara', 'Susun playlist lagu wedding & checklist sound system', 'Refda', 'Normal', 'Lagu prosesi kirab/masuk pengantin, sungkeman, dan backsound resepsi.'],
    ['Videotron & Acara', 'Briefing MC & sinkronisasi cue card dengan rundown', 'Bersama', 'Normal', 'Pastikan nama orang tua, susunan sambutan, dan saksi terkonfirmasi rapi.'],

    // Manpower & Panitia
    ['Manpower & Panitia', 'Finalisasi PPT Manpower Tasks (jobdesk detail tiap panitia)', 'Tiara', 'Normal', 'Bagi tugas PIC: penerima tamu, pengawas katering, penjaga mahar/angpao, transportasi.'],
    ['Manpower & Panitia', 'Tentukan & hubungi Saksi Nikah pihak Refda dan Tiara', 'Bersama', 'Normal', 'Pastikan saksi bersedia hadir tepat waktu saat akad dan berkas KTP terlampir.'],
    ['Manpower & Panitia', 'Finalisasi Rundown rinci Akad & Resepsi (durasi per sesi)', 'Bersama', 'Normal', 'Pegangan bersama untuk keluarga, tim pelaksana, dan vendor.'],
    ['Manpower & Panitia', 'Technical meeting / briefing panitia keluarga & vendor (H-7)', 'Bersama', 'Normal', 'Bahas koordinasi teknis, alur flow tamu, pengamanan kado/angpao, dan kontak darurat.'],

    // Perlengkapan & Vendor
    ['Perlengkapan & Vendor', 'Pilih & beli cincin kawin (grafir nama & fitting ukuran)', 'Bersama', 'Normal', 'Pastikan ukuran pas di jari manis dan sertifikat emas tersimpan aman.'],
    ['Perlengkapan & Vendor', 'Siapkan mahar / mas kawin & hias box mahar transparan', 'Bersama', 'Normal', 'Sesuai nominal/wujud yang disepakati kedua belah pihak.'],
    ['Perlengkapan & Vendor', 'Siapkan souvenir pernikahan & kartu ucapan terima kasih', 'Tiara', 'Normal', 'Pesan jumlah souvenir = total estimasi tamu + buffer 15%.'],
    ['Perlengkapan & Vendor', 'Finalisasi vendor katering & jadwal test food lanjutan', 'Bersama', 'Normal', 'Pastikan porsi aman, variasi gubukan seimbang, dan kebersihan terjaga.'],
    ['Perlengkapan & Vendor', 'Finalisasi dekorasi pelaminan, photobooth, & area akad', 'Bersama', 'Normal', 'Selaraskan tema bunga dan pencahayaan dengan busana pengantin.'],
    ['Perlengkapan & Vendor', 'Briefing fotografer & videografer (list wajib foto keluarga)', 'Bersama', 'Normal', 'Buat checklist keluarga besar mana saja yang wajib dipanggil foto bersama.'],
    ['Perlengkapan & Vendor', 'Booking mobil pengantin & armada penjemputan keluarga', 'Refda', 'Normal', 'Pastikan rute dan jadwal standby kendaraan di hari H.'],

    // Rumah Tangga & Pasca Nikah
    ['Rumah Tangga & Pasca Nikah', 'List belanja prioritas perabotan rumah tangga (kasur, lemari, kulkas, dapur)', 'Bersama', 'Normal', 'Kategorikan perabotan esensial hari pertama vs yang bisa dibeli bertahap.'],
    ['Rumah Tangga & Pasca Nikah', 'List & survey kontrakan/rumah tinggal setelah nikah', 'Bersama', 'Normal', 'Pertimbangkan akses lokasi ke kantor Refda, keamanan, dan kenyamanan lingkungan.'],
    ['Rumah Tangga & Pasca Nikah', 'Update Kartu Keluarga (KK) baru & perbarui KTP status kawin', 'Bersama', 'Normal', 'Bawa buku nikah, KK asal, dan formulir permohonan ke kelurahan/Dukcapil.'],
    ['Rumah Tangga & Pasca Nikah', 'Rencana bulan madu / waktu istirahat bersama setelah acara', 'Bersama', 'Normal', 'Quality time dan recovery energi setelah seluruh rangkaian pernikahan selesai.']
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
  const { category, task, pic = 'Bersama', priority = 'Normal', notes = '' } = req.body;
  db.run(`INSERT INTO tasks (category, task, done, pic, priority, notes) VALUES (?, ?, 0, ?, ?, ?)`,
    [category, task, pic, priority, notes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, success: true });
    });
});

app.patch('/api/tasks/:id', (req, res) => {
  const { done, pic, priority, notes } = req.body;
  const updates = [];
  const params = [];
  if (done !== undefined) { updates.push('done = ?'); params.push(done ? 1 : 0); }
  if (pic !== undefined) { updates.push('pic = ?'); params.push(pic); }
  if (priority !== undefined) { updates.push('priority = ?'); params.push(priority); }
  if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }
  params.push(req.params.id);

  if (updates.length === 0) return res.json({ success: true });
  db.run(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, params, function(err) {
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
