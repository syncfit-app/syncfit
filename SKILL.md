# SKILL.md — Pola Prompt SyncFit

Kumpulan template prompt yang sering dipakai supaya tidak perlu ditulis ulang tiap sesi. Salin, isi bagian `[...]`, lalu kirim.

## 1. Melanjutkan pekerjaan dari sesi sebelumnya
```
Lanjutkan pengembangan SyncFit. Baca CLAUDE.md, ARCHITECTURE.md, TODO.md dulu.
Kerjakan task [ID task, misal B2] sesuai DoD di ARCHITECTURE.md.
Setelah selesai, update status di TODO.md.
```

## 2. Menambah fitur baru
```
Tambahkan fitur: [deskripsi fitur].
Sebelum mulai:
1. Cek apakah ini memang perlu ditambahkan sekarang (relevan dengan prioritas di TODO.md?).
2. Cek apakah sudah ada komponen/pola serupa di codebase yang bisa dipakai ulang.
3. Verifikasi dulu status fitur terkait di kode nyata (jangan percaya tampilan UI saja — cek apakah komponennya benar-benar memanggil Supabase atau masih data mock).
4. Kalau butuh perubahan skema database, tanya dulu sebelum eksekusi.
Setelah desain jelas, baru implementasi.
```

## 3. Fix bug
```
Ada bug: [deskripsi bug, langkah reproduksi, error message kalau ada].
Tolong:
1. Cari akar masalahnya dulu, jangan langsung tempel fix.
2. Jelaskan singkat penyebabnya.
3. Perbaiki dengan perubahan seminimal mungkin.
4. Sebutkan kalau ada bug lain yang terlihat sekalian saat investigasi (tapi jangan diperbaiki tanpa izin kalau di luar scope).
```

## 4. Review sebelum commit/deploy
```
Review perubahan yang baru dibuat sebelum saya commit/push.
Cek:
- Apakah menyentuh skema database atau RLS policy? Kalau iya, jelaskan risikonya.
- Apakah menambah dependency baru? Kalau iya, kenapa perlu.
- Apakah konsisten dengan pola/komponen yang sudah ada?
- Apakah ada kemungkinan pecah di fitur lain?
```

## 5. Diskusi keputusan sebelum eksekusi (untuk keputusan besar)
```
Sebelum implementasi [nama fitur/perubahan besar], saya mau diskusi dulu:
- Opsi pendekatan apa saja yang masuk akal?
- Trade-off tiap opsi?
- Rekomendasi kamu apa dan kenapa?
Jangan eksekusi kode dulu, cukup diskusi.
```

## 6. Update dokumentasi
```
Setelah [fitur/perubahan] selesai dan sudah saya cek jalan dengan baik:
- Update status terkait di TODO.md.
- Kalau ada perubahan arsitektur/keputusan teknis penting, catat juga di ARCHITECTURE.md.
```

## 7. Cek status project
```
Ringkas status project SyncFit saat ini berdasarkan TODO.md: apa yang sudah selesai, sedang dikerjakan, dan prioritas berikutnya apa.
```

## 8. Audit kode vs dokumentasi
```
Cek ulang [nama halaman/fitur] di kode nyata (src/...), bandingkan dengan status di TODO.md/ARCHITECTURE.md.
Kalau ada perbedaan (misal dokumen bilang "Done" tapi kode masih mock, atau sebaliknya), laporkan dan update dokumennya.
```