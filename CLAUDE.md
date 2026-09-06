# CLAUDE.md — Instruksi untuk AI di Project SyncFit

Dokumen ini adalah konteks wajib dibaca sebelum mengerjakan apapun di project SyncFit. Baca juga `PRD.md`, `ARCHITECTURE.md`, `WORKFLOW.md`, dan `TODO.md` sebelum mulai kerja di sesi manapun.

## Ringkasan Project
- **Nama:** SyncFit (SyncFit Pro)
- **Repo:** GitHub `syncfit-app/syncfit`, branch `main`
- **Hosting:** Vercel — project `syncfit_app`, domain `syncfitpro.vercel.app`
- **Database:** Supabase (Postgres + Auth + RLS), project `syncfit-db`
- **Stack frontend:** React 18 + Vite + TypeScript + Tailwind CSS, routing via `react-router-dom` v7
- **Dependency lain:** `@supabase/supabase-js`, `lucide-react` (ikon), `html2canvas` (export recap sesi jadi gambar)
- **Target user:** individu umum yang ingin latihan/nge-gym secara mandiri (lihat `PRD.md`)

## Struktur Kode (`src/`)
```
src/
├── App.tsx                # Routing + auth gate (session → profile check → onboarding/app)
├── main.tsx
├── index.css
├── lib/
│   └── supabase.ts        # Supabase client (pakai VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
├── utils/
│   └── workoutEngine.ts   # Generator program latihan rule-based (bukan AI)
└── components/
    ├── LoginView.tsx        # ✅ Terhubung Supabase Auth
    ├── OnboardingView.tsx    # ✅ Upsert ke `profiles`
    ├── ProfileView.tsx       # ✅ Fetch `profiles`; menu pengaturan belum fungsional
    ├── WorkoutView.tsx       # ✅ Paling matang — generate plan, logging set, timer, simpan sesi
    ├── ProgressView.tsx      # 🟡 Berat badan asli, sisanya (grafik/streak/PR) mock
    ├── DashboardView.tsx     # ❌ 100% mock, belum ada fetch DB
    ├── NutritionView.tsx     # ❌ 100% mock, tabel `foods` belum dipakai
    ├── GPSView.tsx           # ❌ 100% mock, tabel `gps_activities` belum dipakai
    ├── WeightInputModal.tsx  # ✅ Update `weight_kg` ke `profiles`
    ├── Header.tsx, BottomNav.tsx, HeroBanner.tsx, MetricsGrid.tsx,
    │   DailyChallengeCard.tsx, NutritionSummaryCard.tsx, ExercisePreview.tsx
    │                         # Komponen presentational, dipakai oleh view-view mock di atas
```

**Catatan penting:** jangan berasumsi sebuah fitur "sudah selesai" hanya karena tampil bagus di UI — banyak halaman (`DashboardView`, `ProgressView` sebagian, `NutritionView`, `GPSView`) masih pakai data hardcoded/mock. Selalu cek langsung apakah komponen memanggil `supabase.from(...)` sebelum mengklaim sesuatu "real".

## Skema Database (public schema)
- `profiles` — 1:1 dengan `auth.users`. Berisi data fisik user (`age`, `gender`, `weight_kg`, `height_cm`), `locale`, `xp_points`, `streak_count`. **`xp_points` dan `streak_count` tidak pernah ditulis oleh kode manapun saat ini — masih kolom mati.**
- `user_programs` — 1:1 per user (PK = `user_id`). Berisi `plan_data` (jsonb, array `DayPlan[]` — lihat tipe di `workoutEngine.ts`), `experience`, `days`, `goal`, `current_week` (hanya berubah manual lewat klik tombol minggu di UI, tidak otomatis).
- `workout_logs` — riwayat sesi workout selesai (per baris = 1 sesi). Diisi oleh `WorkoutView.handleEndSession`.
- `exercise_logs` — detail per-set dari tiap exercise (per baris = 1 set yang ditandai `completed`). Diisi oleh `WorkoutView.handleEndSession`.
- `exercises`, `foods`, `gps_activities` — tabel ada di DB tapi **belum dipakai sama sekali** oleh frontend saat ini.

Semua tabel user-data punya `constraint ... foreign KEY (user_id/id) references auth.users (id) on delete CASCADE` dan dilindungi RLS policy. **Jangan pernah query/modify data lintas user** — selalu filter berdasarkan `auth.uid()` di level query atau andalkan RLS.

## Pola Kode yang Sudah Ada (ikuti, jangan duplikasi)
- Query Supabase selalu diawali `const { data: { user } } = await supabase.auth.getUser();` lalu query dengan `.eq('user_id', user.id)` atau `.eq('id', user.id)`.
- State lokal sesi workout (hari terpilih, set logs, timer) disimpan ke `localStorage` dengan prefix `sfit_...` supaya tidak hilang saat refresh — pertahankan pola ini untuk state sejenis, jangan pindah ke solusi lain tanpa alasan kuat.
- `saveProgramToDB` di `WorkoutView.tsx` adalah pola upsert program yang dipakai berulang (generate plan, edit nama hari, edit exercise, dsb) — reuse fungsi ini, jangan bikin fungsi upsert baru yang serupa.
- Styling: Tailwind utility classes langsung di JSX, warna brand utama `#FF5E00` (oranye) dan `#111827` (dark navy), tidak ada file token/theme terpisah — ikuti warna ini untuk konsistensi.

## Aturan Kerja Teknis
1. **Ikuti pola yang sudah ada.** Sebelum menulis komponen/util baru, cek dulu apakah sudah ada yang serupa di `src/`. Jangan duplikasi.
2. **Jangan ubah skema database tanpa izin eksplisit.** Migrasi/`ALTER TABLE` selalu didiskusikan dulu — lihat `WORKFLOW.md`.
3. **Jangan tambah dependency baru** kecuali benar-benar perlu dan sudah dicek tidak ada solusi native/standard library/dependency yang sudah terpasang.
4. **RLS-first.** Jangan bypass RLS dari client dengan service role key di kode frontend.
5. **Konsisten TypeScript.** Tipe data harus merefleksikan skema tabel Supabase — untuk data program pakai tipe `DayPlan`/`GeneratedExercise` dari `workoutEngine.ts`, jangan buat tipe duplikat.
6. **Bahasa & locale.** Saat ini semua teks UI hardcoded Bahasa Indonesia meski kolom `locale` (id/en) sudah ada di DB. Jangan bangun sistem i18n penuh kecuali diminta eksplisit — itu perubahan besar, bukan hal kecil.
7. **Environment variables.** Jangan pernah menaruh secret/API key langsung di kode. Gunakan `.env` yang sudah ada (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), jangan commit `.env` berisi secret asli.
8. **Jangan klaim fitur "selesai" berdasarkan tampilan UI saja** — verifikasi ada pemanggilan Supabase yang nyata sebelum menandai status di `TODO.md`.

## Cara Komunikasi
- Balas dan diskusi dalam **Bahasa Indonesia**, kecuali user minta lain.
- Komentar kode boleh Bahasa Inggris atau Indonesia, ikuti gaya file yang sedang diedit (kode existing banyak pakai komentar Bahasa Indonesia, misal `// STATE CLOUD`).
- Jika ada ambiguitas soal requirement, tanyakan singkat dulu — jangan menebak untuk keputusan yang mahal untuk dibatalkan (skema DB, alur auth, dsb). Untuk keputusan kecil (styling, penamaan variabel), boleh ambil keputusan wajar dan lanjut.

## Referensi Silang
- **Apa yang dibangun & kenapa** → `PRD.md`
- **Rencana implementasi & definition of done tiap bagian** → `ARCHITECTURE.md`
- **Status pengerjaan saat ini** → `TODO.md`
- **Kapan boleh jalan sendiri vs harus izin dulu** → `WORKFLOW.md`
- **Template prompt yang sering dipakai** → `SKILL.md`