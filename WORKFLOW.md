# WORKFLOW.md — Aturan Main Kerja Sama

## 1. Kapan AI Boleh Jalan Sendiri (tanpa tanya dulu)
- Menulis/mengubah kode UI (komponen, styling) yang **tidak** mengubah struktur data atau alur logic inti.
- Memperbaiki bug yang jelas akar masalahnya dan scope-nya kecil.
- Refactor kecil yang tidak mengubah behavior (rename variabel, pecah fungsi panjang, dsb).
- Menulis/update dokumentasi (`TODO.md`, komentar kode).
- Menjalankan perintah baca-saja (cek file, cek log, cek struktur project).

## 2. Kapan AI Harus Minta Izin Dulu
- **Perubahan skema database** apapun (`ALTER TABLE`, tabel baru, kolom baru, ubah constraint/RLS policy).
- **Menambah dependency baru** (npm package baru) — jelaskan dulu kenapa perlu dan alternatif yang sudah dicoba.
- **Perubahan yang berpotensi menghapus/menimpa data** (migrasi data, bulk update/delete).
- **Perubahan arsitektur** yang mempengaruhi banyak bagian (misal ganti state management, ganti struktur routing).
- **Push langsung ke `main` / trigger deploy production** — kecuali sudah disepakati alur kerjanya jelas boleh langsung (saat ini repo bekerja langsung di `main`, jadi hati-hati terutama untuk perubahan berisiko).
- Kapan pun ada 2+ pendekatan valid dengan trade-off signifikan — presentasikan opsi dulu (lihat template #5 di `SKILL.md`), jangan pilih sepihak untuk keputusan besar.

## 3. Definisi "Selesai" untuk Sebuah Fitur/Task
Sebuah task baru dianggap **Done** kalau:
1. Memenuhi semua checklist **Definition of Done** yang tercantum di `ARCHITECTURE.md` untuk task tersebut.
2. Sudah dicoba manual (minimal happy path) dan tidak ada error di console/browser.
3. Tidak merusak fitur lain yang sebelumnya sudah jalan (regresi).
4. `TODO.md` sudah diupdate status-nya jadi `Done`.

Kalau ada bagian dari DoD yang belum terpenuhi tapi fitur "kelihatan jalan", status tetap `In Progress`, bukan `Done` — jangan menandai selesai secara prematur.

**Verifikasi kode, bukan tampilan.** Beberapa halaman di SyncFit tampil meyakinkan di UI (angka streak, grafik progres, daftar makanan) padahal datanya hardcoded/mock. Sebelum menandai status apapun di `TODO.md`, cek langsung di kode apakah komponen tersebut benar-benar memanggil Supabase (`supabase.from(...)`) atau masih pakai data statis.

## 4. Alur Kerja per Sesi
1. AI membaca `CLAUDE.md`, `TODO.md`, dan bagian relevan `ARCHITECTURE.md` di awal sesi kerja.
2. Konfirmasi task yang akan dikerjakan (kalau tidak eksplisit disebutkan user, tanya task ID mana dari `TODO.md`).
3. Kerjakan, ikuti prinsip **YAGNI/simplicity** — solusi paling sederhana yang benar, sesuai `CLAUDE.md`.
4. Setelah selesai satu task, update `TODO.md`, laporkan ringkas apa yang berubah.
5. Kalau menemukan hal di luar scope task (bug lain, ide fitur), catat sebagai item baru di `TODO.md` bagian Backlog — jangan langsung dikerjakan tanpa persetujuan.

## 5. Git & Deploy
- Commit message singkat, jelas, deskriptif (ikuti pola yang sudah ada di histori repo, misal `feat: ...`, `fix: ...`, `chore: ...`).
- Karena repo saat ini bekerja langsung di branch `main` dan auto-deploy ke Vercel production, **perubahan berisiko sebaiknya diuji dulu secara lokal** sebelum push, terutama yang menyentuh alur database/auth.

## 6. Eskalasi / Kalau Ragu
Kalau AI tidak yakin sebuah perubahan masuk kategori "boleh jalan sendiri" atau "harus izin dulu" — default-nya **tanya dulu**. Lebih baik nanya dan ternyata tidak perlu, daripada eksekusi hal yang seharusnya dikonfirmasi dulu.