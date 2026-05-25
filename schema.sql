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
    accessibility INTEGER
);

INSERT INTO venues (name, lat, lng, price, practicality, parking, capacity, worship, accessibility) VALUES 
('Arthama Hotel', -6.1873, 106.8181, 33903500, 5, 9, 8, 9, 10),
('Kinanti House', -6.2841, 106.8445, 33503500, 10, 4, 7, 6, 8),
('Rumah Kayu Ilir', -6.4025, 106.8013, 36353500, 5, 7, 9, 7, 5),
('Masjid Ramlie', -6.1436, 106.8732, 31703500, 4, 8, 10, 10, 7),
('Rumarasa (Paket Nusantara)', -6.2343, 106.8085, 40000000, 8, 8, 6, 8, 9),
('Rumarasa (Paket Rumarasa)', -6.2343, 106.8085, 30000000, 7, 8, 6, 8, 9);
