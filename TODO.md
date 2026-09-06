# TODO.md — Pelacak Progress SyncFit

Status yang dipakai: `Done`, `In Progress`, `Todo`, `Blocked`.
Update tabel ini setiap kali sebuah task berubah status (lihat aturan di `WORKFLOW.md`).

## Fondasi

| ID | Task | Area | Status | Prioritas | Catatan |
|---|---|---|---|---|---|
| A1 | Auth & Profile (login, onboarding, fetch profil) | Auth/Profile | Done | — | Terverifikasi di `LoginView`, `OnboardingView`, `ProfileView` |
| A1b | Fungsionalkan menu di ProfileView (Edit Profil, Settings, dll) | Profile | Todo | Rendah | Saat ini hanya UI dekoratif, belum ada onClick |
| A2 | Program Generator (generate & regenerate) | Program | Done | — | `workoutEngine.ts` + `WorkoutView`, rule-based |

## Prioritas Sekarang: Menyempurnakan Halaman Workout

| ID | Task | Area | Status | Prioritas | Catatan |
|---|---|---|---|---|---|
| B1 | Error handling saat simpan sesi ke `workout_logs`/`exercise_logs` | Workout Page | Done | — | Teruji 4 skenario (normal, offline, retry, refresh saat pending) tanpa duplikat/kehilangan data |
| B2 | Update XP & streak setelah sesi selesai | Workout Page / Gamifikasi | Todo | Tinggi | Kolom ada di DB, logic belum ada sama sekali. Perlu diskusi formula dulu |
| B3 | Kalkulasi kalori lebih akurat (MET per jenis latihan) | Workout Page | Todo | Sedang | Saat ini MET=5.0 tetap untuk semua exercise |
| B4 | Progresi minggu (`current_week`) otomatis/keputusan sadar | Workout Page / Program | Todo | Sedang | Perlu diskusi perilaku yang diinginkan dulu |
| B5 | Rest timer antar-set | Workout Page | Todo | Rendah | Cek dulu apakah dibutuhkan sekarang |

## Backlog (belum prioritas)

| ID | Task | Area | Status | Prioritas | Catatan |
|---|---|---|---|---|---|
| C1 | Hubungkan DashboardView ke data asli | Dashboard | Todo | Rendah | Saat ini 100% mock |
| C2 | Hubungkan grafik & PR di ProgressView ke data asli | Progress | Todo | Rendah | Berat badan sudah asli, sisanya mock |
| C3 | Integrasi fitur nutrisi (`foods`) ke NutritionView | Nutrisi | Todo | Rendah | Saat ini 100% mock |
| C4 | Integrasi `gps_activities` ke GPSView (tracking GPS asli) | GPS/Cardio | Todo | Rendah | Saat ini 100% mock/simulasi |
| C5 | Ikon dumbbell gepeng/distorsi di PNG hasil "Simpan Stiker" | Workout Page / Recap | Todo | Rendah | Bug lama, tidak terkait B1 — html2canvas kemungkinan tidak menghormati object-contain saat render ke canvas |

## Selesai

| ID | Task | Area | Status | Catatan |
|---|---|---|---|---|
| — | Setup repo GitHub, deploy Vercel, database Supabase | Infra | Done | Domain: syncfitpro.vercel.app |
| — | Skema database dasar (`profiles`, `user_programs`, `workout_logs`, `exercise_logs`) | Database | Done | RLS aktif di semua tabel user-data |
| A1 | Auth & Profile | Auth/Profile | Done | Lihat catatan di tabel Fondasi |
| A2 | Program Generator | Program | Done | Lihat catatan di tabel Fondasi |