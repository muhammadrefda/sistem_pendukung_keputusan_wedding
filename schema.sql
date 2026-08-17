DROP TABLE IF EXISTS venues;
CREATE TABLE venues (
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
);

INSERT INTO venues (name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax) VALUES
('Arthama Hotel', -6.1873, 106.8181, 33903500, 5, 9, 8, 9, 10, 200),
('Kinanti House', -6.2841, 106.8445, 33503500, 10, 4, 7, 6, 8, 200),
('Rumah Kayu Ilir', -6.4025, 106.8013, 36353500, 5, 7, 9, 7, 5, 200),
('Masjid Ramlie', -6.1436, 106.8732, 31703500, 4, 8, 10, 10, 7, 200),
('Rumarasa (Paket Nusantara)', -6.2343, 106.8085, 40000000, 8, 8, 6, 8, 9, 200),
('Rumarasa (Paket Rumarasa)', -6.2343, 106.8085, 30000000, 7, 8, 6, 8, 9, 200),
('Sanggar De Batavia', -6.349414571062471, 106.81107361349365, 68000000, 8, 8, 8, 8, 8, 300),
('Kedai Haji Asari (Akad & Resepsi 2 sesi, perlu konfirmasi ulang)', -6.334112818239587, 106.82822140924058, 27000000, 8, 8, 8, 8, 8, 200),
('Masjid At-Tin (Akad Only)', -6.29750321182259, 106.88447378991626, 3000000, 8, 8, 8, 8, 8, 200);

DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    task TEXT,
    done INTEGER DEFAULT 0
);

INSERT INTO tasks (category, task, done) VALUES
('Administratif (KUA)', 'Surat pengantar nikah dari RT/RW & kelurahan', 0),
('Administratif (KUA)', 'Fotokopi KTP, KK, akta kelahiran kedua calon pengantin', 0),
('Administratif (KUA)', 'Pas foto latar biru 4x6 & 2x3 + softcopy', 0),
('Administratif (KUA)', 'Surat keterangan sehat dari puskesmas/faskes', 0),
('Administratif (KUA)', 'Daftar nikah via SIMKAH / datang ke KUA (min. H-10)', 0),
('Administratif (KUA)', 'Surat rekomendasi nikah KUA (jika akad beda kecamatan)', 0),
('Administratif (KUA)', 'Izin tertulis orang tua/wali (jika di bawah 21 tahun)', 0),
('Administratif (KUA)', 'Ikut Bimbingan Perkawinan (Bimwin/Suscatin) & ambil sertifikat', 0),
('Kesehatan', 'Medical check-up (MCU) pra-nikah', 0),
('Kesehatan', 'Imunisasi TT (tetanus toxoid) calon pengantin wanita', 0),
('Kesehatan', 'Konseling pra-nikah (pre-marriage counseling)', 0),
('Venue & Vendor', 'Survey & booking venue akad', 0),
('Venue & Vendor', 'Survey & booking venue resepsi', 0),
('Venue & Vendor', 'Booking catering', 0),
('Venue & Vendor', 'Booking dekorasi', 0),
('Venue & Vendor', 'Booking fotografer & videografer', 0),
('Venue & Vendor', 'Booking MUA (make-up artist) & busana pengantin', 0),
('Venue & Vendor', 'Booking MC & entertainment/band', 0),
('Venue & Vendor', 'Pesan cetak/desain undangan', 0),
('Venue & Vendor', 'Booking mobil pengantin', 0),
('Venue & Vendor', 'Beli/pesan cincin kawin', 0),
('Tamu & Acara', 'Susun & update daftar tamu undangan', 0),
('Tamu & Acara', 'Cetak & sebar undangan (fisik/digital)', 0),
('Tamu & Acara', 'Susun rundown acara akad & resepsi', 0),
('Tamu & Acara', 'Siapkan seragam keluarga (baju kompak)', 0),
('Tamu & Acara', 'Siapkan souvenir pernikahan', 0),
('Rumah Tangga', 'List & cari kontrakan/rumah tinggal', 0),
('Rumah Tangga', 'List perabotan rumah tangga yang perlu dibeli', 0),
('Rumah Tangga', 'Urus pindah domisili/KTP (jika pindah alamat)', 0),
('Rumah Tangga', 'Update Kartu Keluarga pasca nikah', 0),
('Lainnya', 'Susun & tracking anggaran pernikahan', 0),
('Lainnya', 'Rencana bulan madu (honeymoon)', 0);
