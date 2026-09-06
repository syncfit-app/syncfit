# PRD — SyncFit

## 1. Ringkasan
SyncFit adalah aplikasi web kebugaran personal (fitness tracker) yang membantu pengguna membuat program latihan, menjalankannya, dan mencatat progres latihan mereka dari waktu ke waktu.

- **Tagline (dari repo):** "Aplikasi Kebugaran SyncFit 100% Gratis"
- **Live app:** syncfitpro.vercel.app
- **Bahasa:** Bilingual — Indonesia (`id`) & Inggris (`en`), field `locale` di tabel `profiles` (belum ada mekanisme switch bahasa aktif di UI — semua teks saat ini hardcoded Bahasa Indonesia).
- **Stack:** React + Vite + TypeScript + Tailwind CSS, React Router, Supabase (Auth + Postgres + RLS), hosting Vercel.

## 2. Untuk Siapa
Target pengguna: **umum/personal** — siapa saja yang ingin nge-gym atau latihan mandiri, dari pemula sampai yang berpengalaman. Bukan platform coach-client, bukan aplikasi komunitas/tim. Fokusnya satu pengguna mengelola progres latihannya sendiri.

Implikasi desain:
- Tidak perlu fitur sosial (feed, follow, leaderboard antar-user) kecuali diminta eksplisit nanti.
- Tidak perlu role Coach/Admin yang mengelola user lain.
- Onboarding harus cepat dipahami orang awam gym (goal, level pengalaman, hari latihan per minggu).

## 3. Kenapa Dibangun
Banyak aplikasi fitness yang ramai fitur (sosial, marketplace, dsb) sehingga terasa berat untuk kebutuhan dasar: "kasih saya program latihan yang cocok, dan bantu saya mencatat progres." SyncFit menyasar kesederhanaan itu — gratis, personal, langsung ke inti (program + logging).

## 4. Status Fitur Saat Ini (terverifikasi dari source code)

| Fitur | Status | Keterangan |
|---|---|---|
| Autentikasi (`LoginView`) | ✅ Selesai | Signup & login email/password via Supabase Auth |
| Onboarding & Profile (`OnboardingView`, `ProfileView`) | ✅ Selesai (dasar) | Isi profil awal jalan; menu pengaturan di ProfileView belum fungsional (UI saja) |
| Program generator (`workoutEngine.ts` + `WorkoutView`) | ✅ Selesai | Rule-based (bukan AI), generate split berdasarkan experience/hari/goal, periodisasi 4 minggu (W1–W4) |
| Workout logging (`workout_logs`, `exercise_logs`) | ✅ Selesai (fungsional, ada gap kualitas) | Sesi latihan → simpan ke DB berjalan; detail gap ada di `ARCHITECTURE.md` |
| Gamifikasi (XP, streak) | ❌ Belum ada logic sama sekali | Kolom `xp_points`/`streak_count` ada di DB tapi tidak pernah ditulis oleh kode manapun. Semua angka streak di UI adalah data mock |
| Dashboard (`DashboardView`) | ❌ Sepenuhnya mock | Semua data (streak, jadwal hari ini, ringkasan nutrisi) hardcoded, tidak fetch dari DB |
| Progress (`ProgressView`) | 🟡 Sebagian | Berat badan asli dari DB; grafik kalori/durasi, streak, PR (personal record) masih hardcoded |
| Nutrisi (`NutritionView`, tabel `foods`) | ❌ Sepenuhnya mock | UI daftar makanan hardcoded, tidak terhubung ke tabel `foods` |
| GPS Activities (`GPSView`, tabel `gps_activities`) | ❌ Sepenuhnya mock | UI simulasi lari (countdown, dsb) tanpa tracking GPS asli atau simpan ke DB |

## 5. Prioritas Berikutnya
**Menyelesaikan fitur di halaman Workout.** Fondasinya sudah jalan (generate program, logging set, simpan sesi), tapi ada beberapa gap kualitas & fitur yang belum lengkap — daftar detail dan Definition of Done ada di `ARCHITECTURE.md` bagian B.

## 6. Non-Goals (untuk saat ini)
- Fitur sosial/komunitas
- Peran Coach/Admin
- Marketplace / monetisasi
- Native mobile app (fokus web dulu)
- Switch bahasa id/en aktif di UI (belum prioritas meski kolom `locale` sudah ada)

## 7. Metrik Sukses (informal)
Karena ini proyek personal/skala kecil, metrik sukses bersifat kualitatif:
- User bisa generate program dan langsung mulai latihan tanpa bingung.
- Data yang dicatat (set, reps, berat, kalori, durasi) akurat dan tersimpan konsisten, termasuk saat koneksi bermasalah.
- Tidak ada bug yang menghalangi alur inti: profile → generate program → jalankan workout → log tersimpan.
- Angka yang ditampilkan di UI (streak, progress, dsb) mencerminkan data asli, bukan mock.
