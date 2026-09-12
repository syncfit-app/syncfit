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
| D2 | Export/import menu latihan sebagai file (share antar-user) | Workout Page / Program | Todo | 1 (berikutnya) | Perlu desain format file aman (JSON tervalidasi, bukan executable), strip data personal (reps/beban) saat export |
| B2 | Update XP & streak setelah sesi selesai | Workout Page / Gamifikasi | Todo | 2 | Formula disepakati: **+2 XP per set selesai**. Streak berbasis jarak antar-sesi (`expected_gap = ceil(7/days)` hari), bukan kalender minggu — direset kalau jeda antar sesi melebihi itu |
| B3 | Kalkulasi kalori lebih akurat (MET per jenis latihan) | Workout Page | Todo | Belum diurutkan | Saat ini MET=5.0 tetap untuk semua exercise |
| B4 | Progresi minggu (`current_week`) otomatis/keputusan sadar | Workout Page / Program | Todo | Belum diurutkan | Perlu diskusi perilaku yang diinginkan dulu |
| B5 | Rest timer antar-set | Workout Page | Todo | Belum diurutkan | Cek dulu apakah dibutuhkan sekarang |
| B10 | `goal` (Hypertrophy/Strength/Fat Loss/General Fitness) tidak mempengaruhi program yang di-generate | Program / workoutEngine | Todo | Belum diurutkan | Parameter `goal` diterima `generateWorkoutPlan` tapi tidak dipakai sama sekali — reps/sets cuma dipengaruhi `experience` & `week`. Perlu desain rep-range per goal dulu sebelum implementasi |

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