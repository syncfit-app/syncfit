# ARCHITECTURE.md — SyncFit

## 1. Gambaran Arsitektur

```
[Browser] --React/Vite SPA--> [Vercel (hosting statis + build)]
                                        |
                                        v
                          [Supabase: Auth + Postgres + RLS]
```

- **Frontend:** React 18 + TypeScript, di-build dengan Vite, styling Tailwind CSS, routing `react-router-dom`. Di-deploy otomatis ke Vercel setiap push ke `main`.
- **Backend:** Tidak ada backend custom — semua logic bisnis di client, akses data langsung ke Supabase (Auth + Postgres), dilindungi RLS.
- **State lokal sesi latihan:** disimpan di `localStorage` (prefix `sfit_...`) agar tahan refresh, baru ditulis ke Supabase saat sesi berakhir.

## 2. Model Data (referensi)

| Tabel | Relasi | Fungsi | Status pemakaian di kode |
|---|---|---|---|
| `profiles` | 1:1 `auth.users` | Data fisik & preferensi user, XP, streak | Dipakai untuk data fisik; `xp_points`/`streak_count` **tidak pernah ditulis** |
| `user_programs` | 1:1 `auth.users` (PK=`user_id`) | Program aktif user saat ini (`plan_data` jsonb) | Aktif dipakai (`WorkoutView`) |
| `workout_logs` | N:1 `auth.users` | Ringkasan tiap sesi latihan selesai | Aktif ditulis saat sesi selesai |
| `exercise_logs` | N:1 `auth.users` | Detail per-set tiap exercise | Aktif ditulis saat sesi selesai (hanya set yang `completed`) |
| `exercises`, `foods`, `gps_activities` | — | Referensi/fitur tambahan | **Belum dipakai sama sekali** oleh frontend |

Catatan: `user_programs` hanya menyimpan **satu program aktif** per user (PK di `user_id`, bukan tabel riwayat program). Kalau ke depan butuh riwayat multi-program, itu perubahan skema — didiskusikan dulu.

## 3. Cara Kerja Halaman Workout Saat Ini (`WorkoutView.tsx`, terverifikasi dari kode)

1. **Load program** — `useEffect` fetch `user_programs` by `user_id`, isi `activePlan` dari `plan_data`.
2. **Generate/regenerate program** — modal konfigurasi (experience, hari, goal) memanggil `generateWorkoutPlan()` dari `workoutEngine.ts` (rule-based, bukan AI), lalu `saveProgramToDB()` upsert ke `user_programs`.
3. **Pilih hari & minggu** — `selectedDay` (localStorage) memilih hari dari `activePlan`; tombol W1–W4 memanggil `handleWeekChange()` yang **generate ulang plan** untuk minggu itu (bukan menyimpan riwayat, minggu >4 tidak didukung).
4. **Edit manual** — user bisa edit nama hari, target goal, tambah/edit/hapus exercise manual — semua lewat `saveProgramToDB()`.
5. **Mulai sesi** — `handleStartSession()` mencatat `sessionStartTime`, timer jalan tiap detik.
6. **Catat set** — modal per-exercise (`openSetLogModal`) input weight & reps per set, disimpan ke `exerciseSetLogs` (localStorage), exercise ditandai selesai otomatis kalau semua set `completed`.
7. **Akhiri sesi** — `handleEndSession()`:
   - Hitung kalori: `MET_VALUE = 5.0` tetap untuk semua jenis latihan, formula `(MET * berat_kg * durasi_detik) / 3600`.
   - Insert 1 row ke `workout_logs`.
   - Insert N row ke `exercise_logs` (satu per set yang `completed`).
   - Tampilkan modal recap, bisa didownload sebagai PNG (`html2canvas`).
   - **Tidak ada penanganan error ke user** — kalau insert gagal, cuma `console.error`, data sesi hilang dari state tanpa pemberitahuan.
   - **Tidak menyentuh `profiles.xp_points`/`streak_count`** sama sekali.

## 4. Breakdown Pekerjaan

Setiap task punya **Definition of Done (DoD)**. Status sinkron dengan `TODO.md`.

### A. Fondasi (sudah terverifikasi dari kode — status realistis)

**A1. Auth & Profile** — ✅ **Selesai** (terverifikasi: `LoginView`, `OnboardingView`, `ProfileView` semua terhubung Supabase dengan benar).
- Sisa gap kecil (bukan blocker): menu di `ProfileView` ("Edit Profil Pribadi", "Pengaturan Aplikasi", dst) belum ada `onClick` — hanya dekorasi.

**A2. Program Generator** — ✅ **Selesai** (generate & regenerate jalan, upsert benar karena PK di `user_id`).
- Keterbatasan yang perlu didiskusikan (bukan bug, tapi desain terbatas): periodisasi hardcoded cuma 4 minggu, tidak ada logic setelah minggu ke-4.

### B. Prioritas Sekarang — Menyempurnakan Halaman Workout

Fondasi sudah jalan (lihat §3). Berikut gap konkret yang perlu dikerjakan, diurutkan dari yang paling berdampak ke pengalaman inti:

**B1. Error handling saat simpan sesi**
- Masalah: kalau `supabase.from('workout_logs').insert(...)` atau insert `exercise_logs` gagal (network putus dll), user tidak tahu dan data hilang.
- DoD:
  - [ ] Kalau insert gagal, user diberi notifikasi jelas (bukan cuma console.error).
  - [ ] Data sesi (durasi, set logs) tidak langsung dihapus dari state/localStorage sampai konfirmasi tersimpan sukses ke DB.
  - [ ] Ada cara retry tanpa user kehilangan data yang sudah dicatat.

**B2. Update XP & streak setelah sesi selesai**
- Masalah: kolom ada di `profiles` tapi tidak pernah ditulis. Semua streak di UI adalah mock.
- DoD:
  - [ ] Definisikan formula XP sederhana (misal: XP tetap per sesi selesai, atau berbasis durasi/jumlah set — didiskusikan dulu sebelum implementasi, bukan diputuskan sepihak oleh AI).
  - [ ] Definisikan aturan streak: naik kalau sesi hari ini melanjutkan hari kalender sebelumnya, reset kalau terlewat.
  - [ ] `handleEndSession` update `profiles.xp_points` dan `profiles.streak_count` setelah insert log berhasil.
  - [ ] `DashboardView` dan `ProgressView` menampilkan streak **asli** dari `profiles`, bukan mock lagi (minimal ganti angka statis ini, tanpa perlu redesign UI-nya).

**B3. Kalkulasi kalori yang lebih akurat**
- Masalah: `MET_VALUE = 5.0` tetap untuk semua jenis latihan (compound heavy squat vs plank dihitung sama).
- DoD:
  - [ ] MET value dibedakan minimal per tipe (misal: berbasis intensitas RIR atau kategori Push/Pull/Legs/Core dari `workoutEngine.ts`) — tetap sederhana, jangan bikin sistem kalkulasi kalori yang rumit.
  - [ ] Formula & sumber MET didokumentasikan singkat di kode (komentar) supaya jelas asal angkanya.

**B4. Progresi minggu**
- Masalah: `current_week` hanya berubah manual klik tombol, periodisasi cuma sampai W4.
- DoD:
  - [ ] Diskusikan dulu perilaku yang diinginkan: apakah W4 (deload) lalu balik ke W1 otomatis, atau user pilih manual selamanya (kalau memang begitu, cukup didokumentasikan sebagai keputusan sadar, bukan gap).
  - [ ] Kalau ada logic otomatis, `current_week` di DB update sesuai keputusan itu.

**B5. Rest timer antar-set (opsional, cek prioritas user dulu)**
- DoD:
  - [ ] Ada timer countdown antar-set sesuai field `rest` tiap exercise (misal `60s`, `90s`) — cek dulu ke user apakah ini benar dibutuhkan sekarang atau nice-to-have.

### C. Berikutnya (belum prioritas, dicatat agar tidak lupa)
- Hubungkan `DashboardView` ke data asli (jadwal hari ini dari `user_programs`, bukan mock).
- Hubungkan `ProgressView` grafik & PR ke data asli dari `exercise_logs`/`workout_logs`.
- Integrasi `foods` (nutrisi) ke `NutritionView`.
- Integrasi `gps_activities` ke `GPSView` (tracking GPS asli).
- Fungsionalkan menu di `ProfileView` (edit profil, settings, dst).

## 5. Prinsip Desain Teknis
- Ikuti prinsip **YAGNI** — jangan bangun infrastruktur (state management kompleks, abstraksi generic) untuk kebutuhan yang belum ada.
- Reuse fungsi/komponen yang sudah ada (`saveProgramToDB`, tipe dari `workoutEngine.ts`) sebelum bikin baru.
- Query Supabase seminimal mungkin per halaman — hindari N+1 request.
