import datetime

# Event 1: Ke KUA Tebet (4 Nov 2026)
dt_kua_start = "20261104T020000Z"  # 09:00 WIB = 02:00 UTC
dt_kua_end   = "20261104T040000Z"  # 11:00 WIB = 04:00 UTC

# Event 2: Hari H Akad & Resepsi (22 Nov 2026)
dt_wedding_start = "20261122T010000Z" # 08:00 WIB = 01:00 UTC (standby/jemput penghulu 08.40, akad 09.00)
dt_wedding_end   = "20261122T060000Z" # 13:00 WIB = 06:00 UTC

ics_content = """BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Refda & Tiara Wedding//ID
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:kua-tebet-20261104@wedding-refda-tiara
DTSTAMP:20261018T150000Z
DTSTART:20261104T020000Z
DTEND:20261104T043000Z
SUMMARY:KUA Tebet: Pemeriksaan Nikah & Penyerahan Berkas Susulan
DESCRIPTION:Agenda KUA Tebet untuk pemeriksaan nikah Refda & Tiara.\\n\\nBerkas yang wajib dibawa:\\n1. Fotokopi KTP Ibu Refda\\n2. Fotokopi KTP Bapak Refda (tentatif)\\n3. Materai 10.000 (2 lembar)\\n4. Fotokopi Kartu Keluarga (KK) Mas Ari\\n\\nCatatan: Datang tepat waktu bersama Tiara & Wali jika diperlukan.
LOCATION:KUA Kecamatan Tebet, Jl. Tebet Timur Dalam XI No.1, Jakarta Selatan
STATUS:CONFIRMED
ORGANIZER;CN=Muhammad Refda:mailto:muhammadrefda@gmail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=Tiara Ayu:mailto:tiaraayu991@gmail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=Umi Kalsum Tiara Ayu:mailto:uktiaraayu@gmail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=Muhammad Refda:mailto:muhammadrefda@gmail.com
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Reminder: Besok jadwal ke KUA Tebet! Siapkan berkas KTP Ibu, KTP Bapak, Materai 2, dan KK Mas Ari.
END:VALARM
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Reminder: 2 jam lagi jadwal ke KUA Tebet!
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:wedding-day-20261122@wedding-refda-tiara
DTSTAMP:20261018T150000Z
DTSTART:20261122T010000Z
DTEND:20261122T060000Z
SUMMARY:Akad Nikah & Resepsi: Refda & Tiara
DESCRIPTION:Rundown Acara:\\n- 08.40 WIB: Jemput Penghulu di KUA Tebet\\n- 09.00 WIB: Akad Nikah Dimulai\\n- 10.00 - 12.30 WIB: Resepsi Pernikahan, Foto Bersama, Ramah Tamah & Games Shoot Us\\n\\nLokasi: Lume Coffee / Venue Tebet, Jakarta Selatan.
LOCATION:Tebet, Jakarta Selatan
STATUS:CONFIRMED
ORGANIZER;CN=Muhammad Refda:mailto:muhammadrefda@gmail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=Tiara Ayu:mailto:tiaraayu991@gmail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=Umi Kalsum Tiara Ayu:mailto:uktiaraayu@gmail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=Muhammad Refda:mailto:muhammadrefda@gmail.com
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Reminder: Besok Hari H Pernikahan Refda & Tiara!
END:VALARM
END:VEVENT
END:VCALENDAR
"""

with open("public/wedding-events.ics", "w") as f:
    f.write(ics_content.strip())

print("ICS file created successfully at public/wedding-events.ics")
