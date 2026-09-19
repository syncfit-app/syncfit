# TODO.md — Pelacak Progress SyncFit

Status yang dipakai: `Done`, `In Progress`, `Todo`, `Blocked`.
Update tabel ini setiap kali sebuah task berubah status (lihat aturan di `WORKFLOW.md`).

## Fondasi

| ID | Task | Area | Status | Prioritas | Catatan |
|---|---|---|---|---|---|
| A1 | Auth & Profile (login, onboarding, fetch profil) | Auth/Profile | Done | — | Terverifikasi di `LoginView`, `OnboardingView`, `ProfileView` |
| A1b | Fungsionalkan menu di ProfileView (Edit Profil, Settings, dll) | Profile | Todo | Rendah | Saat ini hanya UI dekoratif, belum ada onClick |
| A2 | Program Generator (generate & regenerate) | Program | Done | — | `workoutEngine.ts` + `WorkoutView`, rule-based |

## Prioritas Sekarang: Halaman Workout (urutan sesuai kesepakatan)

| ID | Task | Area | Status | Urutan | Catatan |
|---|---|---|---|---|---|
| B3 | Kalkulasi kalori lebih akurat (MET per jenis latihan) | Workout Page | Todo | 1 (berikutnya) | Saat ini MET=5.0 tetap untuk semua exercise |
| B4 | Progresi minggu (`current_week`) otomatis pindah sendiri vs manual selamanya | Workout Page / Program | Todo | Belum diurutkan | Beda dari B11 — ini soal APAKAH `current_week` harus otomatis maju (misal setelah semua hari di minggu itu selesai), bukan soal independensi data antar minggu (itu sudah beres di B11). Perlu diskusi perilaku yang diinginkan dulu |
| B5 | Rest timer antar-set | Workout Page | Todo | Belum diurutkan | Cek dulu apakah dibutuhkan sekarang |

## Backlog (belum prioritas)

| ID | Task | Area | Status | Prioritas | Catatan |
|---|---|---|---|---|---|
| C1 | Hubungkan DashboardView ke data asli | Dashboard | Todo | Rendah | Saat ini 100% mock |
| C2 | Hubungkan grafik & PR di ProgressView ke data asli | Progress | Todo | Rendah | Berat badan sudah asli, sisanya mock |
| C3 | Integrasi fitur nutrisi (`foods`) ke NutritionView | Nutrisi | Todo | Rendah | Saat ini 100% mock |
| C4 | Integrasi `gps_activities` ke GPSView (tracking GPS asli) | GPS/Cardio | Todo | Rendah | Saat ini 100% mock/simulasi |
| C6 | Aktifkan RLS di tabel `exercises`, `foods`, `gps_activities` | Database / Security | Todo | **Wajib sebelum C1-C4** | Ditemukan lewat Supabase security advisor — 3 tabel ini publik tanpa RLS sama sekali. Belum masalah karena belum dipakai frontend, tapi harus dibereskan sebelum diintegrasikan |

## Selesai

| ID | Task | Area | Status | Catatan |
|---|---|---|---|---|
| — | Setup repo GitHub, deploy Vercel, database Supabase | Infra | Done | Domain: syncfitpro.vercel.app |
| — | Skema database dasar (`profiles`, `user_programs`, `workout_logs`, `exercise_logs`) | Database | Done | RLS aktif di semua tabel user-data |
| A1 | Auth & Profile | Auth/Profile | Done | Lihat catatan di tabel Fondasi |
| A2 | Program Generator | Program | Done | Lihat catatan di tabel Fondasi |
| B1 | Error handling saat simpan sesi ke `workout_logs`/`exercise_logs` | Workout Page | Done | Teruji 4 skenario (normal, offline, retry, refresh saat pending) tanpa duplikat/kehilangan data |
| C5 | Ikon dumbbell gepeng/distorsi di PNG hasil "Simpan Stiker" | Workout Page / Recap | Done | Root cause: rasio kotak gambar (96x96) tidak sama dengan rasio asli file (1536x1024). Diperbaiki jadi 96x64 |
| B6 | Bug: data reps/beban lama kebawa saat generate ulang plan/minggu | Workout Page | Done | Root cause: `exerciseSetLogs` tidak direset saat regenerate (cuma `completedExercises` yang direset). Ditemukan user saat testing B1 |
| B7 | Sync lintas device: centang exercise & edit program tidak konsisten antar-device | Workout Page / Program | Done | 2 perbaikan: (1) rekonstruksi status dari `exercise_logs` hari ini saat ganti hari/buka halaman, (2) refetch `user_programs` otomatis saat tab kembali aktif (`visibilitychange`). Teruji di 2 browser berbeda |
| B8 | Bug: sync B7 salah tangkap data lama/tidak terkait (matching cuma pakai nama exercise) | Workout Page | Done | Root cause: `exercise_logs` tidak ada penanda sesi asal. Fix: tambah kolom `workout_log_id` (migrasi DB, sudah dijalankan) + `syncTodayProgressFromDB` sekarang scope ke 1 sesi spesifik via FK, bukan tebak nama+tanggal |
| D1 | Tukar posisi hari (swap) di Weekly Split Plan | Workout Page / Program | Done | Drag & drop pakai `@dnd-kit/core` (jalan di mouse & touch/HP). Data reps/beban ikut dipindah bareng isi hari, tidak nyangkut seperti bug B6 |
| B9 | Bug: drag & drop hari bikin data reps/beban nyangkut di device lain / hilang di device asal | Workout Page / Program | Done | 2 perbaikan: (1) device lain bersihkan cache lokal saat versi plan berubah (deteksi via `updated_at`), (2) tambah kolom `plan_reset_at` (migrasi DB) supaya cuma generate ulang beneran yang meng-invalidasi sesi lama — drag & drop/edit tetap mempertahankan histori |
| B10 | `goal` (Hypertrophy/Strength/Fat Loss/General Fitness) tidak mempengaruhi program yang di-generate | Program / workoutEngine | Done | Strength: reps -3 & rest +30s. Fat Loss: reps +4 & rest -20s. Hypertrophy/General Fitness: baseline dibiarkan. Tergabung benar dengan periodisasi mingguan W1-W4 |
| B11 | Kustomisasi (tukar hari/edit exercise) & centang di 1 minggu bocor ke minggu lain | Workout Page / Program | Done | Refactor besar: `plan_data` diubah dari 1 array 7-hari jadi objek 4 minggu independen (`{"1":[...],"2":[...],"3":[...],"4":[...]}`). Migrasi otomatis dari format lama. Tambah kolom `workout_logs.week` supaya sinkronisasi centang/reps tidak bocor antar minggu. Generate Program sekarang isi 4 minggu sekaligus (1 bulan koheren); pindah minggu jadi murni ganti tampilan tanpa tulis DB |
| D2 | Export/import menu latihan sebagai file (share antar-user) | Workout Page / Program | Done | Format `.syncfit` (JSON). Validasi ketat saat import: `JSON.parse` saja (tidak pernah eval), tiap field dicek tipe/panjang, `videoUrl` dibatasi domain youtube embed saja (titik XSS paling kritis karena dipakai sebagai src iframe). Diuji 7 skenario termasuk 3 percobaan serangan |
| — | Goal (Target Utama) diubah dari pilihan tetap jadi input teks bebas | Program / workoutEngine | Done | User bisa isi goal custom (misal "Hybrid"), 4 goal standar tetap ada sebagai tombol saran cepat. Pencocokan goal di `applyPeriodization` (B10) dibuat case-insensitive. Import (D2) mempertahankan goal custom apa adanya |
| — | Redesign kartu recap (Simpan Kartu Recap) | Workout Page / Recap | Done | Background transparan (siap ditempel di foto sosmed), drop shadow di teks untuk keterbacaan, kartu kaca statistik TIME/CALORIES pakai grid 2 kolom sama lebar (bukan flex, supaya presisi di html2canvas), exercise ditampilkan sebagai list, id element diganti dari `strava-sticker-card` (peninggalan lama) jadi `syncfit-recap-card` |
| B12 | Bug kritis: centang/reps hilang saat sesi aktif dipindah-app lalu balik | Workout Page | Done | Root cause: mekanisme "bersihkan cache saat versi plan berubah" (dari B9) tidak sadar sesi sedang aktif — `updated_at` berubah tiap isi reps (lewat saveProgramToDB), lalu visibilitychange menganggapnya "perubahan asing" dan wipe data yang belum sempat diakhiri. Fix: selama `isWorkoutActive`, TIDAK ADA mekanisme sync/wipe otomatis apapun yang boleh jalan — state lokal jadi satu-satunya sumber kebenaran sampai sesi diakhiri |
| B13 | Bug: centang tidak sinkron lintas device kalau hari yang berbeda diselesaikan di TANGGAL KALENDER berbeda | Workout Page / Program | Done | Root cause: sync (`syncTodayProgressFromDB`, sekarang di-rename `syncPlanProgressFromDB`) membatasi pencarian sesi ke "hari ini saja" (`startOfToday`) — padahal program mingguan wajar dikerjakan di hari kalender berbeda-beda. Fix: batas bawah pencarian sekarang cuma `planResetAt` (sejak plan terakhir generate ulang), bukan tanggal hari ini |
| B2 | Update XP & streak setelah sesi selesai | Workout Page / Gamifikasi | Done | +2 XP per set selesai. Streak berbasis jarak antar-sesi (`ceil(7/days)` + buffer pengalaman: Pemula +2 hari, Menengah +1, Mahir +0), bukan kalender minggu. Ditulis ke `profiles.xp_points`/`streak_count`, ditampilkan di recap (badge "+X XP · streak") dan disambungkan ke `DashboardView.tsx` & `ProgressView.tsx` (ganti data mock). Emoji diganti ikon `Flame` (lucide-react) sesuai preferensi — hindari emoji di seluruh app |