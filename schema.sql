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
    done INTEGER DEFAULT 0,
    pic TEXT DEFAULT 'Bersama',
    priority TEXT DEFAULT 'Normal',
    notes TEXT DEFAULT ''
);

INSERT INTO tasks (category, task, done, pic, priority, notes) VALUES
-- Administratif (KUA)
('Administratif (KUA)', 'Ajukan cuti kerja untuk pendaftaran ke KUA', 0, 'Refda', 'Urgent', 'KUA buka Senin-Jumat 09.00-17.00 WIB (tutup Sabtu-Minggu). Pastikan tanggal cuti Refda & Tiara klop.'),
('Administratif (KUA)', 'Tentukan lokasi akad nikah: KUA Jagakarsa vs KUA Tebet', 0, 'Bersama', 'Urgent', 'Pilihan 1: KUA Jagakarsa, Pilihan 2: KUA Tebet. Cek jadwal penghulu & kelengkapan wilayah domisili.'),
('Administratif (KUA)', 'Surat pengantar nikah dari kelurahan (Formulir N1–N4)', 0, 'Bersama', 'Normal', 'Minta surat pengantar RT/RW lalu diproses ke kelurahan domisili masing-masing calon pengantin.'),
('Administratif (KUA)', 'Fotokopi & dokumen asli: KTP, KK, Akta Kelahiran', 0, 'Bersama', 'Normal', 'Bawa dokumen asli untuk verifikasi data pencocokan di loket KUA.'),
('Administratif (KUA)', 'Surat keterangan sehat & skrining catin faskes/puskesmas', 0, 'Bersama', 'Normal', 'Termasuk cek lab kesehatan pra-nikah dan imunisasi TT bagi calon pengantin wanita.'),
('Administratif (KUA)', 'Persetujuan kedua calon pengantin (Formulir N4)', 0, 'Bersama', 'Normal', 'Formulir persetujuan resmi ditandatangani kedua belah pihak calon pengantin.'),
('Administratif (KUA)', 'Surat rekomendasi nikah dari KUA kecamatan domisili', 0, 'Bersama', 'Normal', 'Wajib diurus jika lokasi akad dilangsungkan di luar kecamatan domisili pengantin.'),
('Administratif (KUA)', 'Pas foto latar biru (2x3 & 4x6 fisik + softcopy)', 0, 'Bersama', 'Normal', 'Pakaian formal rapi, latar belakang warna biru resmi Kemenag.'),
('Administratif (KUA)', 'Daftar nikah via SIMKAH / loket KUA (minimal H-10 hari kerja)', 0, 'Bersama', 'Normal', 'Daftar online di simkah.kemenag.go.id lalu konfirmasi fisik berkas ke KUA terkait.'),
('Administratif (KUA)', 'Ikut Bimbingan Perkawinan (Bimwin/Suscatin) & sertifikat', 0, 'Bersama', 'Normal', 'Sertifikat bimbingan perkawinan diperlukan untuk pengambilan Buku Nikah.'),

-- Busana & Penampilan (Attire)
('Busana & Penampilan', 'SOLUSI: Baju beskap kekecilan (retur / tukar size / alter penjahit)', 0, 'Refda', 'Urgent', 'Urus tukar size ke seller atau bawa ke penjahit untuk alter ukuran lingkar dada/bahu.'),
('Busana & Penampilan', 'Cek kelengkapan seragam sodara (bludru merah, kerudung, bros)', 0, 'Tiara', 'Normal', 'Pastikan semua saudara yang wajib seragam terdata rapi dan set perlengkapannya lengkap.'),
('Busana & Penampilan', 'Fitting busana akad & resepsi pengantin (beskap/jas & kebaya)', 0, 'Bersama', 'Normal', 'Jadwalkan fitting final H-14 untuk antisipasi penyesuaian ukuran badan.'),
('Busana & Penampilan', 'Seragam keluarga inti (orang tua & besan)', 0, 'Keluarga', 'Normal', 'Warna dan model diselaraskan dengan tema warna utama acara.'),
('Busana & Penampilan', 'Booking MUA & Hairdo/Hijabdo pengantin & ibu', 0, 'Tiara', 'Normal', 'Konfirmasi jadwal kedatangan MUA di lokasi makeup/akad pagi hari.'),

-- Undangan & Digital
('Undangan & Digital', 'Bikin Undangan Digital custom (web interaktif khusus, bukan template biasa)', 0, 'Refda', 'Urgent', 'Refda handle koding dan desain custom eksklusif agar personal, elegan, dan istimewa.'),
('Undangan & Digital', 'Finalisasi denah lokasi & QR Maps untuk undangan fisik', 0, 'Tiara', 'Normal', 'Tiara sudah buat konsep denah, cek keterbacaan rute dan uji coba scan QR Code.'),
('Undangan & Digital', 'Pesan cetak undangan fisik & cek proofing mockup', 0, 'Bersama', 'Normal', 'Cek ejaan nama lengkap, nama orang tua, tanggal, dan alamat sebelum cetak massal.'),
('Undangan & Digital', 'Susun daftar tamu undangan (VIP, keluarga, rekan kerja, sahabat)', 0, 'Bersama', 'Normal', 'Kelompokkan daftar tamu dan siapkan nomor WhatsApp aktif untuk pengiriman undangan.'),
('Undangan & Digital', 'Distribusi undangan fisik & broadcast link undangan digital personal', 0, 'Bersama', 'Normal', 'Sebar bertahap mulai H-30 hingga H-14.'),

-- Videotron & Acara
('Videotron & Acara', 'Finishing animasi video pembuka/bumper videotron via AI/Canva', 0, 'Refda', 'Urgent', 'Refda bantu proses rendering dan revisi animasi agar Tiara tidak lelah sendirian.'),
('Videotron & Acara', 'Review & finalisasi materi PPT Games interaktif videotron', 0, 'Refda', 'Normal', 'Cek ukuran slide (16:9), animasi transisi, dan keterbacaan teks di layar besar venue.'),
('Videotron & Acara', 'Susun playlist lagu wedding & checklist sound system', 0, 'Refda', 'Normal', 'Lagu prosesi kirab/masuk pengantin, sungkeman, dan backsound resepsi.'),
('Videotron & Acara', 'Briefing MC & sinkronisasi cue card dengan rundown', 0, 'Bersama', 'Normal', 'Pastikan nama orang tua, susunan sambutan, dan saksi terkonfirmasi rapi.'),

-- Manpower & Panitia
('Manpower & Panitia', 'Finalisasi PPT Manpower Tasks (jobdesk detail tiap panitia)', 0, 'Tiara', 'Normal', 'Bagi tugas PIC: penerima tamu, pengawas katering, penjaga mahar/angpao, transportasi.'),
('Manpower & Panitia', 'Tentukan & hubungi Saksi Nikah pihak Refda dan Tiara', 0, 'Bersama', 'Normal', 'Pastikan saksi bersedia hadir tepat waktu saat akad dan berkas KTP terlampir.'),
('Manpower & Panitia', 'Finalisasi Rundown rinci Akad & Resepsi (durasi per sesi)', 0, 'Bersama', 'Normal', 'Pegangan bersama untuk keluarga, tim pelaksana, dan vendor.'),
('Manpower & Panitia', 'Technical meeting / briefing panitia keluarga & vendor (H-7)', 0, 'Bersama', 'Normal', 'Bahas koordinasi teknis, alur flow tamu, pengamanan kado/angpao, dan kontak darurat.'),

-- Perlengkapan & Vendor
('Perlengkapan & Vendor', 'Pilih & beli cincin kawin (grafir nama & fitting ukuran)', 0, 'Bersama', 'Normal', 'Pastikan ukuran pas di jari manis dan sertifikat emas tersimpan aman.'),
('Perlengkapan & Vendor', 'Siapkan mahar / mas kawin & hias box mahar transparan', 0, 'Bersama', 'Normal', 'Sesuai nominal/wujud yang disepakati kedua belah pihak.'),
('Perlengkapan & Vendor', 'Siapkan souvenir pernikahan & kartu ucapan terima kasih', 0, 'Tiara', 'Normal', 'Pesan jumlah souvenir = total estimasi tamu + buffer 15%.'),
('Perlengkapan & Vendor', 'Finalisasi vendor katering & jadwal test food lanjutan', 0, 'Bersama', 'Normal', 'Pastikan porsi aman, variasi gubukan seimbang, dan kebersihan terjaga.'),
('Perlengkapan & Vendor', 'Finalisasi dekorasi pelaminan, photobooth, & area akad', 0, 'Bersama', 'Normal', 'Selaraskan tema bunga dan pencahayaan dengan busana pengantin.'),
('Perlengkapan & Vendor', 'Briefing fotografer & videografer (list wajib foto keluarga)', 0, 'Bersama', 'Normal', 'Buat checklist keluarga besar mana saja yang wajib dipanggil foto bersama.'),
('Perlengkapan & Vendor', 'Booking mobil pengantin & armada penjemputan keluarga', 0, 'Refda', 'Normal', 'Pastikan rute dan jadwal standby kendaraan di hari H.'),

-- Rumah Tangga & Pasca Nikah
('Rumah Tangga & Pasca Nikah', 'List belanja prioritas perabotan rumah tangga (kasur, lemari, kulkas, dapur)', 0, 'Bersama', 'Normal', 'Kategorikan perabotan esensial hari pertama vs yang bisa dibeli bertahap.'),
('Rumah Tangga & Pasca Nikah', 'List & survey kontrakan/rumah tinggal setelah nikah', 0, 'Bersama', 'Normal', 'Pertimbangkan akses lokasi ke kantor Refda, keamanan, dan kenyamanan lingkungan.'),
('Rumah Tangga & Pasca Nikah', 'Update Kartu Keluarga (KK) baru & perbarui KTP status kawin', 0, 'Bersama', 'Normal', 'Bawa buku nikah, KK asal, dan formulir permohonan ke kelurahan/Dukcapil.'),
('Rumah Tangga & Pasca Nikah', 'Rencana bulan madu / waktu istirahat bersama setelah acara', 0, 'Bersama', 'Normal', 'Quality time dan recovery energi setelah seluruh rangkaian pernikahan selesai.');
