-- 1. Tandai tugas administratif yang sudah selesai
UPDATE tasks SET done = 1, notes = 'Selesai: Rekomendasi KUA Jagakarsa & Pasar Rebo terbit, sudah didaftarkan ke KUA Tebet' WHERE id IN (1, 2, 3, 4, 5, 7, 8, 9);

-- 2. Update status fitting baju
UPDATE tasks SET done = 1, notes = 'Selesai fitting baju hari ini (18 Okt 2026). Tinggal ambil saat jadwal final.' WHERE task LIKE '%Fitting busana%';

-- 3. Masukkan tugas penting tanggal 4 November 2026 ke KUA Tebet
INSERT INTO tasks (category, task, done, pic, priority, notes) VALUES
('Administratif (KUA)', 'KUA Tebet (4 Nov 2026): Bawa berkas fisik susulan & pemeriksaan nikah', 0, 'Bersama', 'Urgent', 'Jadwal 4 Nov 2026 ke KUA Tebet. Bawa: 1. FC KTP Ibu Refda, 2. FC KTP Bapak Refda (tentatif), 3. Materai 10.000 (2 buah), 4. FC KK Mas Ari.'),
('Manpower & Panitia', 'Jemput Penghulu di KUA Tebet (Hari H jam 08.40 WIB)', 0, 'Refda', 'Urgent', 'Penghulu KUA Tebet dijemput tepat jam 08.40 WIB untuk persiapan akad nikah jam 09.00 WIB.');

