// src/components/WorkoutView.tsx
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';
import { 
  Dumbbell, Play, Info, Clock, CheckCircle2,
  Settings2, Calendar, Video, X, Wand2, Zap, Check, Minimize2, Square, Download,
  Edit2, Save, Trash2, Plus, AlertTriangle, RotateCw, Loader2, GripVertical, Upload, FileWarning
} from 'lucide-react';
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

import { generateWorkoutPlan, DayPlan, GeneratedExercise, Experience, Goal } from '../utils/workoutEngine';

export interface SetDetail {
  weight: string;
  reps: string;
  completed: boolean;
}

// Data 1 sesi latihan yang sudah dihitung, siap dikirim ke DB.
// Disimpan utuh di localStorage saat gagal terkirim, supaya bisa di-retry tanpa hitung ulang / kehilangan data.
interface PendingSession {
  workout_name: string;
  week: number;
  duration_seconds: number;
  calories_burned: number;
  exercises_completed: string[];
  set_logs: {
    exercise_key: string;
    set_number: number;
    reps_achieved: number;
    weight_kg: number;
  }[];
}

const PENDING_SESSION_KEY = 'sfit_pending_session';

// D2: format file export/import program latihan.
const SYNCFIT_FILE_FORMAT = 'syncfit-program';
const SYNCFIT_FILE_VERSION = 1;
const VALID_EXPERIENCES: Experience[] = ['Pemula', 'Menengah', 'Mahir'];
const VALID_GOALS: Goal[] = ['Hypertrophy', 'Strength', 'Fat Loss', 'General Fitness'];

interface SyncFitProgramFile {
  format: string;
  version: number;
  exported_at: string;
  program: {
    experience: Experience;
    days: number;
    goal: string;
    plan_data: Record<string, DayPlan[]>;
  };
}

// Validasi KETAT sebelum data dari file .syncfit dipakai — file ini datang dari luar (bisa dari
// siapa saja), jadi tidak boleh dipercaya begitu saja. Prinsipnya: JSON.parse saja (tidak pernah
// eval/Function), lalu setiap field dicek tipe & isinya satu-satu. Kalau ada yang tidak sesuai,
// field itu ditolak/dikosongkan — bukan bikin seluruh import gagal, kecuali struktur intinya rusak.
// Perhatian khusus di `videoUrl`: field ini dipakai sebagai src <iframe>, jadi HARUS dibatasi cuma
// domain video yang dipercaya (youtube embed) — kalau tidak, file jahat bisa menyisipkan URL
// berbahaya yang jalan begitu user klik "Demo".
const isTrustedVideoUrl = (url: unknown): url is string => {
  if (typeof url !== 'string' || url.trim() === '') return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'www.youtube-nocookie.com') &&
      parsed.pathname.startsWith('/embed/')
    );
  } catch {
    return false;
  }
};

const sanitizeString = (val: unknown, maxLen: number, fallback = ''): string => {
  if (typeof val !== 'string') return fallback;
  return val.slice(0, maxLen);
};

const sanitizeExercise = (raw: unknown): GeneratedExercise | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const name = sanitizeString(r.name, 80);
  if (!name) return null;

  const setsNum = Number(r.sets);
  const sets = Number.isFinite(setsNum) ? Math.min(20, Math.max(1, Math.round(setsNum))) : 3;

  return {
    name,
    sets,
    reps: sanitizeString(r.reps, 20, '10'),
    rir: r.rir ? sanitizeString(r.rir, 20) : undefined,
    rest: sanitizeString(r.rest, 20, '60s'),
    videoUrl: isTrustedVideoUrl(r.videoUrl) ? r.videoUrl : undefined,
    note: r.note ? sanitizeString(r.note, 300) : undefined,
    isStatic: r.isStatic === true,
  };
};

const sanitizeDayPlan = (raw: unknown): DayPlan | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const name = sanitizeString(r.name, 60, 'Hari');
  const type = r.type === 'Rest' ? 'Rest' : 'Workout';
  const exercisesRaw = Array.isArray(r.exercises) ? r.exercises : [];
  const exercises = exercisesRaw.slice(0, 20).map(sanitizeExercise).filter((e): e is GeneratedExercise => e !== null);
  return { name, type, exercises };
};

// Return null kalau filenya memang bukan/rusak format syncfit-program — bukan exception,
// supaya alur pemanggil tinggal cek null tanpa try/catch bertingkat.
const validateSyncFitProgramFile = (raw: unknown): SyncFitProgramFile['program'] | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (r.format !== SYNCFIT_FILE_FORMAT) return null;
  if (typeof r.version !== 'number' || r.version > SYNCFIT_FILE_VERSION) return null;
  if (typeof r.program !== 'object' || r.program === null) return null;

  const p = r.program as Record<string, unknown>;
  const experience: Experience = VALID_EXPERIENCES.includes(p.experience as Experience) ? (p.experience as Experience) : 'Pemula';
  // Goal sekarang teks bebas (bisa custom seperti "Hybrid") — cukup disanitasi (dibatasi panjang),
  // tidak perlu cocok persis salah satu dari 4 goal standar.
  const sanitizedGoal = sanitizeString(p.goal, 40);
  const goal: string = sanitizedGoal.trim() !== '' ? sanitizedGoal : 'General Fitness';
  const daysNum = Number(p.days);
  const days = Number.isFinite(daysNum) ? Math.min(6, Math.max(2, Math.round(daysNum))) : 4;

  if (typeof p.plan_data !== 'object' || p.plan_data === null) return null;

  const planData: Record<string, DayPlan[]> = {};
  for (const week of ['1', '2', '3', '4']) {
    const weekRaw = (p.plan_data as Record<string, unknown>)[week];
    if (!Array.isArray(weekRaw)) return null;
    const sanitizedDays = weekRaw.slice(0, 7).map(sanitizeDayPlan).filter((d): d is DayPlan => d !== null);
    if (sanitizedDays.length === 0) return null;
    planData[week] = sanitizedDays;
  }

  return { experience, days, goal, plan_data: planData };
};

// D1: kartu hari di "Weekly Split Plan" — bisa di-drag DAN jadi target drop sekaligus,
// supaya hari manapun bisa ditukar dengan hari manapun. Pakai @dnd-kit/core karena
// drag & drop bawaan HTML5 tidak berfungsi di layar sentuh (HP).
interface DayTabProps {
  index: number;
  item: DayPlan;
  isActive: boolean;
  onSelect: () => void;
}

const DayTab: React.FC<DayTabProps> = ({ index, item, isActive, onSelect }) => {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({ id: index });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: index });

  return (
    <button
      ref={(node) => { setDragRef(node); setDropRef(node); }}
      {...listeners}
      {...attributes}
      onClick={onSelect}
      className={`relative flex flex-col items-center justify-center py-3 rounded-xl transition-all border touch-none select-none cursor-grab active:cursor-grabbing ${
        isActive ? 'bg-[#111827] text-white border-[#111827] scale-110 shadow-lg z-10' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
      } ${isDragging ? 'opacity-40' : ''} ${isOver ? 'ring-2 ring-[#FF5E00] ring-offset-1' : ''}`}
    >
      <span className={`text-[10px] font-black uppercase ${isActive ? 'text-[#FF5E00]' : 'text-slate-400'}`}>D{index + 1}</span>
      <span className={`text-[10px] sm:text-xs font-bold truncate w-full px-1 text-center mt-0.5 ${isActive ? 'text-white' : 'text-slate-700'}`}>
        {item.name === 'Rest Day' ? 'Rest' : item.name}
      </span>
    </button>
  );
};

export const WorkoutView: React.FC = () => {
  // STATE CLOUD
  const [isLoading, setIsLoading] = useState(true);
  const [formExp, setFormExp] = useState<Experience>('Menengah');
  const [formDays, setFormDays] = useState(4);
  const [formGoal, setFormGoal] = useState<Goal | string>('Hypertrophy');
  const [selectedWeek, setSelectedWeek] = useState(1);
  // D2-lanjutan: plan_data sekarang menyimpan SEMUA 4 minggu sekaligus (bukan cuma minggu aktif),
  // supaya kustomisasi (tukar hari/edit exercise) di 1 minggu TIDAK mempengaruhi minggu lain.
  // "activePlan" di bawah cuma cara pandang (view) ke minggu yang sedang dibuka.
  const [planByWeek, setPlanByWeek] = useState<Record<number, DayPlan[]>>({});
  const activePlan = planByWeek[selectedWeek] || [];
  // B8 lanjutan: waktu terakhir plan_data disimpan (generate/regenerate/edit/tukar hari).
  // Dipakai buat batasi sync cuma ambil sesi yang dicatat SETELAH plan versi ini ada —
  // supaya sesi lama dengan nama hari yang kebetulan sama tidak ikut nyangkut di plan baru.
  const [programUpdatedAt, setProgramUpdatedAt] = useState<string | null>(null);
  // Beda dari programUpdatedAt (berubah tiap kali APAPUN di plan disimpan, termasuk tukar hari) —
  // planResetAt CUMA berubah saat plan benar-benar di-generate ulang dari nol (isi exercise baru,
  // 4 minggu sekaligus). Dipakai sebagai batas bawah pencarian sesi lama di syncPlanProgressFromDB,
  // supaya drag & drop/edit (yang tidak mengubah isi, cuma posisi/1 minggu) tidak ikut menganggap
  // sesi sebelumnya "kadaluarsa".
  const [planResetAt, setPlanResetAt] = useState<string | null>(null);

  // STATE LOKAL
  const [selectedDay, setSelectedDay] = useState(() => {
    const saved = localStorage.getItem('sfit_selected_day');
    return saved ? JSON.parse(saved) : 0;
  });
  // Key sekarang sertakan nomor minggu (`${week}-${day}`) — supaya centang di W1 tidak
  // pernah kebaca sebagai centang di W2-W4, walau hari & indeks exercise-nya sama.
  const [completedExercises, setCompletedExercises] = useState<Record<string, number[]>>(() => {
    const saved = localStorage.getItem('sfit_completed_exercises');
    return saved ? JSON.parse(saved) : {};
  });

  // Key sekarang `${week}-${day}-${exerciseIdx}` dengan alasan yang sama seperti di atas.
  const [exerciseSetLogs, setExerciseSetLogs] = useState<Record<string, SetDetail[]>>(() => {
    const saved = localStorage.getItem('sfit_set_logs');
    return saved ? JSON.parse(saved) : {};
  });

  const [isWorkoutActive, setIsWorkoutActive] = useState(() => localStorage.getItem('sfit_is_active') === 'true');
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('sfit_start_time');
    return saved ? parseInt(saved, 10) : null;
  });
  const [isTimerMinimized, setIsTimerMinimized] = useState(() => localStorage.getItem('sfit_timer_minimized') === 'true');
  const [timer, setTimer] = useState(0);

  // MODALS & FORM
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  // D2: hasil parsing file .syncfit yang sudah lolos validasi, menunggu konfirmasi user
  // sebelum benar-benar dipakai menimpa program (supaya user tidak kaget program lama hilang).
  const [pendingImport, setPendingImport] = useState<{ experience: Experience; days: number; goal: string; plan_data: Record<string, DayPlan[]> } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDemo, setActiveDemo] = useState<GeneratedExercise | null>(null);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({ duration: 0, calories: 0, date: '' });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempDayName, setTempDayName] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState("");
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [exerciseForm, setExerciseForm] = useState<GeneratedExercise>({
    name: '', sets: 3, reps: '10', rir: 'RIR 2', rest: '60s', videoUrl: '', note: ''
  });
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [activeSetExerciseIdx, setActiveSetExerciseIdx] = useState<number | null>(null);
  const [tempSets, setTempSets] = useState<SetDetail[]>([]);

  // B1: status simpan sesi ke server. `pendingSession` != null artinya ada sesi
  // yang sudah selesai secara lokal tapi belum berhasil masuk ke database.
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(() => {
    const saved = localStorage.getItem(PENDING_SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [isSavingSession, setIsSavingSession] = useState(false);

  const hasActivePlan = activePlan.length > 0;
  const activeWorkout = activePlan[selectedDay];

  // Nyimpen `updated_at` plan yang TERAKHIR diketahui device ini, di luar re-render (ref, bukan state)
  // supaya bisa dibandingkan tiap fetchProgram jalan tanpa ikut jadi dependency effect.
  const lastKnownProgramUpdatedAtRef = useRef<string | null>(null);

  // B12: fetchProgram (dipanggil dari listener visibilitychange yang di-setup SEKALI saat mount)
  // butuh tahu status isWorkoutActive TERKINI, bukan nilai beku saat mount — makanya perlu ref,
  // bukan langsung baca state (closure useEffect dependency [] akan selalu lihat nilai lama).
  const isWorkoutActiveRef = useRef(isWorkoutActive);
  useEffect(() => { isWorkoutActiveRef.current = isWorkoutActive; }, [isWorkoutActive]);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsLoading(false); return; }
        const { data } = await supabase.from('user_programs').select('*').eq('user_id', user.id).single();
        if (data) {
          setFormExp(data.experience as Experience);
          setFormDays(data.days);
          setFormGoal(data.goal);
          setSelectedWeek(data.current_week);

          // B9: kalau versi plan yang baru di-fetch BEDA dari yang terakhir device ini tahu,
          // posisi-posisi exercise bisa saja sudah berubah (swap/regenerate/edit — entah dari
          // device ini sendiri atau device lain). Data centang/reps LOKAL yang lama jadi tidak
          // bisa dipercaya lagi (kuncinya berbasis posisi, bukan identitas exercise), jadi
          // dikosongkan dan direkonstruksi ulang dari server lewat syncPlanProgressFromDB
          // (yang sudah akurat berkat workout_log_id).
          // B12: TAPI kalau sesi latihan sedang aktif, JANGAN PERNAH wipe — data lokal yang
          // sedang dikerjakan user adalah satu-satunya sumber kebenaran selama sesi berjalan.
          // `updated_at` sendiri berubah tiap kali user isi reps/beban (lewat saveProgramToDB),
          // jadi kalau tidak di-guard, wipe ini bisa kepicu di tengah sesi cuma karena user
          // pindah app sebentar lalu balik lagi — menghapus progres yang belum sempat diakhiri.
          if (
            lastKnownProgramUpdatedAtRef.current !== null &&
            lastKnownProgramUpdatedAtRef.current !== data.updated_at &&
            !isWorkoutActiveRef.current
          ) {
            setExerciseSetLogs({});
            setCompletedExercises({});
          }
          lastKnownProgramUpdatedAtRef.current = data.updated_at;

          // Migrasi otomatis format lama: dulu plan_data cuma array 7 hari (1 minggu).
          // Kalau ketemu format lama, minggu yang sedang aktif dipertahankan isinya,
          // minggu lain di-generate baru (supaya tetap lengkap 4 minggu tanpa data hilang).
          if (Array.isArray(data.plan_data)) {
            const migrated: Record<number, DayPlan[]> = {};
            for (let w = 1; w <= 4; w++) {
              migrated[w] = w === data.current_week
                ? data.plan_data
                : generateWorkoutPlan(data.experience as Experience, data.days, data.goal as Goal, w);
            }
            setPlanByWeek(migrated);
          } else {
            setPlanByWeek(data.plan_data || {});
          }

          setProgramUpdatedAt(data.updated_at);
          setPlanResetAt(data.plan_reset_at);
        }
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchProgram();

    // 3b: saat tab/app ini kembali aktif (misal user baru saja edit program di device lain,
    // lalu balik ke tab ini), ambil ulang data program tanpa perlu refresh manual.
    // Query-nya sama persis & seringan load awal — cuma dipicu ulang saat tab difokus,
    // bukan polling terus-menerus, jadi tidak membebani kuota Supabase.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchProgram();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 3a: rekonstruksi status "selesai" + reps/beban dari data ASLI server (exercise_logs), bukan
  // cuma dari localStorage device ini. Dibatasi ke minggu yang sedang dibuka (`week`) + sejak plan
  // ini terakhir di-generate ulang (`planResetAt`) — BUKAN dibatasi "hari ini saja". Program
  // mingguan wajar dikerjakan di hari kalender berbeda-beda (Push Day Senin, Pull Day Rabu, dst),
  // jadi centang tidak boleh "reset" cuma karena gonta-ganti tanggal — harus tetap berlaku
  // sepanjang periode plan itu masih aktif.
  const syncPlanProgressFromDB = async (week: number, day: number, plan: DayPlan[], resetAt: string | null) => {
    const dayPlan = plan[day];
    if (!dayPlan || !dayPlan.exercises || dayPlan.exercises.length === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Kalau plan belum pernah tercatat reset-nya (akun lama sebelum migrasi B8), jangan batasi
      // tanggal sama sekali — biarkan epoch 0 supaya semua histori lama tetap valid dicari.
      const cutoff = resetAt ? new Date(resetAt) : new Date(0);

      const { data: latestSession, error: sessionError } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('workout_name', dayPlan.name)
        .eq('week', week)
        .gte('created_at', cutoff.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionError || !latestSession) return;

      const { data: todayLogs, error } = await supabase
        .from('exercise_logs')
        .select('exercise_key, set_number, reps_achieved, weight_kg')
        .eq('workout_log_id', latestSession.id);

      if (error || !todayLogs || todayLogs.length === 0) return;

      setExerciseSetLogs(prev => {
        const updated = { ...prev };
        dayPlan.exercises.forEach((ex, idx) => {
          const serverSets = todayLogs.filter(l => l.exercise_key === ex.name);
          if (serverSets.length === 0) return;

          const key = `${week}-${day}-${idx}`;
          const existing = updated[key] || [];
          const merged: SetDetail[] = Array.from({ length: ex.sets }, (_, i) => existing[i] || { weight: '', reps: '', completed: false });
          serverSets.forEach(s => {
            const i = s.set_number - 1;
            // Data server dianggap pelengkap, bukan penimpa — kalau device ini sendiri
            // sudah punya progres lokal untuk set itu, biarkan (menghindari sesi aktif tertimpa).
            if (i >= 0 && i < merged.length && !merged[i].completed) {
              merged[i] = { weight: String(s.weight_kg), reps: String(s.reps_achieved), completed: true };
            }
          });
          updated[key] = merged;
        });
        return updated;
      });

      setCompletedExercises(prev => {
        const dayKey = `${week}-${day}`;
        const updatedDay = new Set(prev[dayKey] || []);
        dayPlan.exercises.forEach((ex, idx) => {
          const serverSetsCount = todayLogs.filter(l => l.exercise_key === ex.name).length;
          if (serverSetsCount >= ex.sets) updatedDay.add(idx);
        });
        return { ...prev, [dayKey]: Array.from(updatedDay) };
      });
    } catch (e) {
      console.error('Gagal sinkronisasi progres hari ini:', e);
    }
  };

  // B12: sinkronisasi dari server DIMATIKAN TOTAL selama sesi latihan aktif — bukan cuma bagian
  // wipe-nya. Ini prinsip yang lebih aman: selama sesi berjalan, state lokal (exerciseSetLogs,
  // completedExercises) adalah satu-satunya sumber kebenaran, titik. Begitu sesi diakhiri
  // (isWorkoutActive jadi false), sinkronisasi jalan normal lagi dan merefleksikan sesi yang
  // baru saja disimpan dengan benar.
  useEffect(() => {
    if (activePlan.length > 0 && !isWorkoutActive) {
      syncPlanProgressFromDB(selectedWeek, selectedDay, activePlan, planResetAt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, selectedDay, activePlan, planResetAt, isWorkoutActive]);

  // Sekarang selalu menyimpan SELURUH plan 4 minggu (bukan cuma minggu yang sedang dibuka) —
  // supaya minggu lain yang tidak diubah tetap utuh, tidak ikut tertimpa/hilang.
  const saveProgramToDB = async (exp: Experience, days: number, goal: string, week: number, fullPlanByWeek: Record<number, DayPlan[]>, isRegenerate: boolean = false) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const now = new Date().toISOString();
    const payload: Record<string, unknown> = {
      user_id: user.id, experience: exp, days: days, goal: goal, current_week: week, plan_data: fullPlanByWeek, updated_at: now
    };
    // Cuma sertakan plan_reset_at kalau ini benar-benar generate ulang dari nol (isi exercise baru).
    // Kalau tidak disertakan, Supabase upsert TIDAK menimpa nilai lama di kolom ini.
    if (isRegenerate) payload.plan_reset_at = now;

    await supabase.from('user_programs').upsert(payload);
    setProgramUpdatedAt(now);
    if (isRegenerate) setPlanResetAt(now);
    // Device ini sendiri yang barusan bikin perubahan ini — catat di ref juga, supaya
    // fetch berikutnya (misal lewat visibilitychange) tidak salah kira ini "perubahan asing"
    // dari device lain dan tidak perlu ikut menghapus data lokal yang sudah benar.
    lastKnownProgramUpdatedAtRef.current = now;
  };

  // Untuk sekadar pindah tab minggu (BUKAN edit isi) — cuma update current_week,
  // TIDAK menyentuh plan_data/updated_at/plan_reset_at sama sekali. Jadi tidak memicu
  // sinkronisasi lokal dianggap "berubah" di device lain, dan tidak menghapus cache manapun.
  const saveCurrentWeekPreference = async (week: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('user_programs').update({ current_week: week }).eq('user_id', user.id);
  };

  useEffect(() => { localStorage.setItem('sfit_selected_day', JSON.stringify(selectedDay)); }, [selectedDay]);
  useEffect(() => { localStorage.setItem('sfit_completed_exercises', JSON.stringify(completedExercises)); }, [completedExercises]);
  useEffect(() => { localStorage.setItem('sfit_set_logs', JSON.stringify(exerciseSetLogs)); }, [exerciseSetLogs]);
  useEffect(() => { localStorage.setItem('sfit_is_active', isWorkoutActive.toString()); }, [isWorkoutActive]);
  useEffect(() => { localStorage.setItem('sfit_timer_minimized', isTimerMinimized.toString()); }, [isTimerMinimized]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isWorkoutActive && sessionStartTime) {
      setTimer(Math.floor((Date.now() - sessionStartTime) / 1000));
      interval = setInterval(() => { setTimer(Math.floor((Date.now() - sessionStartTime) / 1000)); }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, sessionStartTime]);

  // Generate program = generate SELURUH 4 minggu sekaligus (1 program bulanan yang koheren),
  // bukan cuma minggu yang sedang dibuka. Ini satu-satunya aksi yang benar-benar "mulai dari nol".
  const handleGeneratePlan = async () => {
    const newPlanByWeek: Record<number, DayPlan[]> = {};
    for (let w = 1; w <= 4; w++) {
      newPlanByWeek[w] = generateWorkoutPlan(formExp, formDays, formGoal as Goal, w);
    }
    setPlanByWeek(newPlanByWeek);
    setCompletedExercises({}); setExerciseSetLogs({}); setIsConfigModalOpen(false); setSelectedDay(0); setSelectedWeek(1);
    await saveProgramToDB(formExp, formDays, formGoal as Goal, 1, newPlanByWeek, true);
  };

  // Pindah minggu sekarang MURNI ganti tampilan — setiap minggu sudah punya isinya sendiri
  // (hasil generate awal atau kustomisasi manual), jadi tidak perlu generate ulang / tulis
  // plan_data sama sekali. Cukup catat preferensi "terakhir buka minggu berapa" secara ringan.
  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
    setSelectedDay(0);
    saveCurrentWeekPreference(week);
  };

  // D2: export program (4 minggu penuh) jadi file .syncfit yang bisa dibagikan.
  // Isinya cuma template latihan (nama/sets/reps/rest) — TIDAK PERNAH menyertakan riwayat
  // beban/reps yang sudah dijalani (itu tersimpan terpisah di exercise_logs, tidak pernah
  // disentuh fungsi ini), jadi otomatis "bersih" untuk siapapun yang meng-import-nya.
  const handleExportProgram = () => {
    if (Object.keys(planByWeek).length === 0) return;
    const fileData: SyncFitProgramFile = {
      format: SYNCFIT_FILE_FORMAT,
      version: SYNCFIT_FILE_VERSION,
      exported_at: new Date().toISOString(),
      program: {
        experience: formExp,
        days: formDays,
        goal: formGoal as Goal,
        plan_data: planByWeek,
      },
    };
    const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `syncfit-program-${formGoal.toLowerCase().replace(/\s+/g, '-')}-${dateStr}.syncfit`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Baca file yang dipilih user, JSON.parse (TIDAK PERNAH eval/Function — parser JSON bawaan
  // browser tidak bisa mengeksekusi kode apapun), lalu validasi ketat sebelum ditampilkan
  // sebagai preview konfirmasi. Belum langsung menimpa program apapun di sini.
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // reset input, supaya pilih file yang sama 2x tetap kepicu onChange
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.syncfit')) {
      setImportError('File harus berformat .syncfit');
      return;
    }
    if (file.size > 500 * 1024) {
      setImportError('Ukuran file terlalu besar untuk sebuah program latihan (maks 500KB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        const validated = validateSyncFitProgramFile(raw);
        if (!validated) {
          setImportError('File tidak valid atau bukan format program SyncFit yang dikenali.');
          return;
        }
        setImportError(null);
        setPendingImport(validated);
      } catch {
        setImportError('File rusak atau bukan format JSON yang valid.');
      }
    };
    reader.onerror = () => setImportError('Gagal membaca file.');
    reader.readAsText(file);
  };

  // User sudah lihat preview & konfirmasi — baru sekarang program diterapkan & disimpan.
  // Diperlakukan sama seperti "Generate Program" (reset total, plan_reset_at diperbarui),
  // karena ini memang menimpa seluruh 4 minggu dengan program yang benar-benar baru.
  const handleConfirmImport = async () => {
    if (!pendingImport) return;
    const { experience, days, goal, plan_data } = pendingImport;
    setFormExp(experience); setFormDays(days); setFormGoal(goal);
    setPlanByWeek(plan_data);
    setCompletedExercises({}); setExerciseSetLogs({});
    setIsConfigModalOpen(false); setSelectedDay(0); setSelectedWeek(1);
    setPendingImport(null);
    await saveProgramToDB(experience, days, goal, 1, plan_data, true);
  };

  // D1: sensor drag pakai PointerSensor (nyala di mouse & touch/HP).
  // activationConstraint jarak 8px supaya tap biasa (pilih hari) tidak salah kepicu jadi drag.
  const dayDragSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Tukar 2 hari SEKALIGUS isinya (nama, exercise, dst) DAN data yang sudah tercatat untuk hari itu
  // (completedExercises + exerciseSetLogs) — kalau cuma isi hari yang ditukar tanpa datanya ikut,
  // akan muncul bug yang sama persis seperti B6 (reps/beban nyangkut di slot yang salah).
  // Cuma mempengaruhi MINGGU YANG SEDANG DIBUKA — minggu lain tidak ikut berubah.
  const handleSwapDays = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newWeekPlan = [...activePlan];
    [newWeekPlan[fromIndex], newWeekPlan[toIndex]] = [newWeekPlan[toIndex], newWeekPlan[fromIndex]];
    const newPlanByWeek = { ...planByWeek, [selectedWeek]: newWeekPlan };
    setPlanByWeek(newPlanByWeek);

    setCompletedExercises(prev => {
      const updated = { ...prev };
      const fromKey = `${selectedWeek}-${fromIndex}`;
      const toKey = `${selectedWeek}-${toIndex}`;
      const fromVal = updated[fromKey] || [];
      const toVal = updated[toKey] || [];
      updated[fromKey] = toVal;
      updated[toKey] = fromVal;
      return updated;
    });

    setExerciseSetLogs(prev => {
      const updated: Record<string, SetDetail[]> = { ...prev };
      Object.keys(prev).forEach(key => {
        const [weekStr, dayIdxStr, exIdxStr] = key.split('-');
        if (parseInt(weekStr, 10) !== selectedWeek) return; // minggu lain dibiarkan, tidak disentuh
        const dayIdx = parseInt(dayIdxStr, 10);
        let newDayIdx = dayIdx;
        if (dayIdx === fromIndex) newDayIdx = toIndex;
        else if (dayIdx === toIndex) newDayIdx = fromIndex;
        if (newDayIdx !== dayIdx) {
          delete updated[key];
          updated[`${selectedWeek}-${newDayIdx}-${exIdxStr}`] = prev[key];
        }
      });
      return updated;
    });

    saveProgramToDB(formExp, formDays, formGoal as Goal, selectedWeek, newPlanByWeek);
  };

  const handleDayDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      handleSwapDays(Number(active.id), Number(over.id));
    }
  };

  const handleSaveDayName = async () => {
    if (!tempDayName.trim()) return;
    const updatedPlan = [...activePlan];
    if (updatedPlan[selectedDay]) updatedPlan[selectedDay] = { ...updatedPlan[selectedDay], name: tempDayName };
    const newPlanByWeek = { ...planByWeek, [selectedWeek]: updatedPlan };
    setPlanByWeek(newPlanByWeek); setIsEditingName(false);
    await saveProgramToDB(formExp, formDays, formGoal as Goal, selectedWeek, newPlanByWeek);
  };

  const handleSaveGoal = async () => {
    if (!tempGoal.trim()) return;
    setFormGoal(tempGoal); setIsEditingGoal(false);
    await saveProgramToDB(formExp, formDays, tempGoal, selectedWeek, planByWeek);
  };

  const openAddExercise = () => {
    setExerciseForm({ name: '', sets: 3, reps: '10', rir: 'RIR 2', rest: '60s', videoUrl: '', note: '' });
    setEditingExerciseIndex(null); setIsExerciseModalOpen(true);
  };

  const openEditExercise = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setExerciseForm({ 
      name: activeWorkout.exercises[idx].name || '',
      sets: activeWorkout.exercises[idx].sets || 3,
      reps: activeWorkout.exercises[idx].reps || '10',
      rir: activeWorkout.exercises[idx].rir || 'RIR 2',
      rest: activeWorkout.exercises[idx].rest || '60s',
      videoUrl: activeWorkout.exercises[idx].videoUrl || '',
      note: activeWorkout.exercises[idx].note || '',
      isStatic: activeWorkout.exercises[idx].isStatic
    });
    setEditingExerciseIndex(idx); setIsExerciseModalOpen(true);
  };

  const handleDeleteExercise = async (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Yakin ingin menghapus gerakan ini?')) return;
    const updatedPlan = [...activePlan];
    updatedPlan[selectedDay].exercises.splice(idx, 1);
    setCompletedExercises(prev => {
      const dayKey = `${selectedWeek}-${selectedDay}`;
      const dayCompleted = prev[dayKey] || [];
      return { ...prev, [dayKey]: dayCompleted.filter(i => i !== idx).map(i => i > idx ? i - 1 : i) };
    });
    const newPlanByWeek = { ...planByWeek, [selectedWeek]: updatedPlan };
    setPlanByWeek(newPlanByWeek);
    await saveProgramToDB(formExp, formDays, formGoal as Goal, selectedWeek, newPlanByWeek);
  };

  const handleSaveExercise = async () => {
    if (!exerciseForm.name.trim()) return;
    const updatedPlan = [...activePlan];
    if (editingExerciseIndex !== null) { updatedPlan[selectedDay].exercises[editingExerciseIndex] = exerciseForm; } 
    else { updatedPlan[selectedDay].exercises.push(exerciseForm); }
    const newPlanByWeek = { ...planByWeek, [selectedWeek]: updatedPlan };
    setPlanByWeek(newPlanByWeek); setIsExerciseModalOpen(false);
    await saveProgramToDB(formExp, formDays, formGoal as Goal, selectedWeek, newPlanByWeek);
  };

  const openSetLogModal = (idx: number) => {
    setActiveSetExerciseIdx(idx);
    const logKey = `${selectedWeek}-${selectedDay}-${idx}`;
    const targetExercise = activeWorkout.exercises[idx];
    const existingLogs = exerciseSetLogs[logKey];

    if (existingLogs && existingLogs.length > 0) {
      setTempSets([...existingLogs]);
    } else {
      const defaultSetsCount = targetExercise.sets || 3;
      const initial: SetDetail[] = Array.from({ length: defaultSetsCount }, () => ({
        weight: '',
        reps: '', 
        completed: false
      }));
      setTempSets(initial);
    }
    setIsSetModalOpen(true);
  };

  const handleUpdateSetRow = (setIndex: number, field: keyof SetDetail, value: any) => {
    setTempSets(prev => {
      const updated = [...prev];
      updated[setIndex] = { ...updated[setIndex], [field]: value };
      return updated;
    });
  };

  const handleAddSetRow = () => {
    setTempSets(prev => [...prev, { weight: prev[prev.length - 1]?.weight || '', reps: prev[prev.length - 1]?.reps || '', completed: false }]);
  };

  const handleRemoveSetRow = (idx: number) => {
    if (tempSets.length <= 1) return;
    setTempSets(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveSetLogs = async () => {
    if (activeSetExerciseIdx === null) return;
    const logKey = `${selectedWeek}-${selectedDay}-${activeSetExerciseIdx}`;
    
    setExerciseSetLogs(prev => ({ ...prev, [logKey]: tempSets }));
    
    const updatedPlan = [...activePlan];
    if (updatedPlan[selectedDay] && updatedPlan[selectedDay].exercises[activeSetExerciseIdx]) {
      updatedPlan[selectedDay].exercises[activeSetExerciseIdx].sets = tempSets.length;
    }
    const newPlanByWeek = { ...planByWeek, [selectedWeek]: updatedPlan };
    setPlanByWeek(newPlanByWeek);
    
    await saveProgramToDB(formExp, formDays, formGoal as Goal, selectedWeek, newPlanByWeek);

    const isAllSetsDone = tempSets.length > 0 && tempSets.every(s => s.completed);
    setCompletedExercises(prev => {
      const dayKey = `${selectedWeek}-${selectedDay}`;
      const dayCompleted = prev[dayKey] || [];
      const hasIdx = dayCompleted.includes(activeSetExerciseIdx);
      if (isAllSetsDone && !hasIdx) { return { ...prev, [dayKey]: [...dayCompleted, activeSetExerciseIdx] }; } 
      else if (!isAllSetsDone && hasIdx) { return { ...prev, [dayKey]: dayCompleted.filter(i => i !== activeSetExerciseIdx) }; }
      return prev;
    });
    
    setIsSetModalOpen(false);
  };

  const toggleExerciseCheck = (exerciseIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedExercises((prev) => {
      const dayKey = `${selectedWeek}-${selectedDay}`;
      const dayCompleted = prev[dayKey] || [];
      const isChecked = dayCompleted.includes(exerciseIndex);
      return { ...prev, [dayKey]: isChecked ? dayCompleted.filter(i => i !== exerciseIndex) : [...dayCompleted, exerciseIndex] };
    });
  };

  const handleStartSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    localStorage.setItem('sfit_start_time', now.toString());
    setIsWorkoutActive(true); setIsTimerMinimized(false);
  };

  // Menyusun payload sesi dari state saat ini (durasi berjalan, set yang sudah dicatat, dst).
  // Dipisah dari proses simpan supaya payload yang sama bisa dipakai ulang saat retry.
  const buildSessionPayload = (): PendingSession => {
    const userWeightKg = parseFloat(localStorage.getItem('sfit_user_weight') || '70');
    const MET_VALUE = 5.0;
    const calculatedCalories = Math.max(5, Math.round((MET_VALUE * userWeightKg * timer) / 3600));

    const dayKey = `${selectedWeek}-${selectedDay}`;
    const completedExerciseNames = completedExercises[dayKey]
      ? completedExercises[dayKey].map(idx => activeWorkout?.exercises[idx]?.name).filter((n): n is string => !!n)
      : [];

    const setLogsToInsert: PendingSession['set_logs'] = [];
    Object.keys(exerciseSetLogs).forEach(key => {
      const [weekStr, dayIdxStr, exIdxStr] = key.split('-');
      if (parseInt(weekStr, 10) === selectedWeek && parseInt(dayIdxStr, 10) === selectedDay) {
        const exerciseName = activeWorkout?.exercises[parseInt(exIdxStr, 10)]?.name || 'Unknown Exercise';
        exerciseSetLogs[key].forEach((set, idx) => {
          if (set.completed) {
            setLogsToInsert.push({
              exercise_key: exerciseName,
              set_number: idx + 1,
              reps_achieved: parseInt(set.reps) || 0,
              weight_kg: parseFloat(set.weight) || 0
            });
          }
        });
      }
    });

    return {
      workout_name: activeWorkout?.name || 'Workout Session',
      week: selectedWeek,
      duration_seconds: timer,
      calories_burned: calculatedCalories,
      exercises_completed: completedExerciseNames,
      set_logs: setLogsToInsert,
    };
  };

  // Simpan/hapus payload yang sedang menunggu retry, sekaligus persist ke localStorage
  // supaya tidak hilang kalau user refresh/tutup tab sebelum sempat retry.
  const persistPendingSession = (payload: PendingSession | null) => {
    setPendingSession(payload);
    if (payload) {
      localStorage.setItem(PENDING_SESSION_KEY, JSON.stringify(payload));
    } else {
      localStorage.removeItem(PENDING_SESSION_KEY);
    }
  };

  // Insert ke workout_logs + exercise_logs. Return true/false, tidak pernah throw ke caller.
  const saveSessionToDB = async (payload: PendingSession): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // .select().single() supaya kita dapat balik `id` baris workout_logs yang baru dibuat —
      // dipakai sebagai workout_log_id di exercise_logs, jadi tiap set log jelas terhubung
      // ke sesi spesifik ini (bukan cuma dicocokkan lewat nama exercise + tanggal seperti sebelumnya).
      const { data: workoutLogRow, error: workoutError } = await supabase.from('workout_logs').insert({
        user_id: user.id,
        workout_name: payload.workout_name,
        week: payload.week,
        duration_seconds: payload.duration_seconds,
        calories_burned: payload.calories_burned,
        exercises_completed: payload.exercises_completed,
      }).select('id').single();
      if (workoutError) throw workoutError;

      if (payload.set_logs.length > 0) {
        const { error: setError } = await supabase.from('exercise_logs').insert(
          payload.set_logs.map(s => ({ user_id: user.id, workout_log_id: workoutLogRow.id, ...s }))
        );
        if (setError) throw setError;
      }

      return true;
    } catch (e) {
      console.error('Gagal menyimpan sesi latihan:', e);
      return false;
    }
  };

  const handleEndSession = async () => {
    setIsWorkoutActive(false); setIsTimerMinimized(false);
    localStorage.removeItem('sfit_is_active'); localStorage.removeItem('sfit_start_time');

    const payload = buildSessionPayload();
    setWorkoutStats({ duration: payload.duration_seconds, calories: payload.calories_burned, date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date()) });

    setIsSavingSession(true);
    const success = await saveSessionToDB(payload);
    setIsSavingSession(false);

    if (success) {
      persistPendingSession(null);
      setIsRecapModalOpen(true);
    } else {
      // Jangan tampilkan recap seolah berhasil — simpan payload untuk di-retry,
      // banner peringatan akan muncul di halaman.
      persistPendingSession(payload);
    }

    setSessionStartTime(null); setTimer(0);
  };

  // Dipanggil dari tombol "Coba Simpan Lagi" di banner peringatan.
  const handleRetryPendingSession = async () => {
    if (!pendingSession) return;
    setIsSavingSession(true);
    const success = await saveSessionToDB(pendingSession);
    setIsSavingSession(false);

    if (success) {
      setWorkoutStats({ duration: pendingSession.duration_seconds, calories: pendingSession.calories_burned, date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date()) });
      persistPendingSession(null);
      setIsRecapModalOpen(true);
    }
    // Kalau masih gagal, pendingSession & banner tetap ada — user bisa coba lagi kapan saja.
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const downloadRecapPNG = async () => {
    const element = document.getElementById('syncfit-recap-card');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { 
        scale: 3, backgroundColor: null, useCORS: true, logging: false,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById('syncfit-recap-card');
          if (clonedEl) { clonedEl.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'; }
        }
      });
      const link = document.createElement('a');
      link.download = `SyncFit-Recap-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error(e); }
  };

  // Label fase periodisasi dipakai ulang di recap card, sumbernya sama dengan tombol W1-W4 di atas.


  if (isLoading) return <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4"><div className="w-12 h-12 border-4 border-slate-200 border-t-[#FF5E00] rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 pt-0 relative font-sans">
      {/* BANNER: sesi selesai tapi gagal tersimpan ke server */}
      {pendingSession && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-[#111827] text-sm">Sesi latihan belum tersimpan ke server</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                "{pendingSession.workout_name}" ({formatTime(pendingSession.duration_seconds)}) gagal diunggah, kemungkinan karena koneksi internet. Data latihanmu masih aman tersimpan di perangkat ini.
              </p>
            </div>
          </div>
          <button
            onClick={handleRetryPendingSession}
            disabled={isSavingSession}
            className="shrink-0 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {isSavingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
            Coba Simpan Lagi
          </button>
        </div>
      )}

      {/* D2: input file tersembunyi, dipakai bareng oleh semua tombol "Import" di halaman ini */}
      <input ref={fileInputRef} type="file" accept=".syncfit" onChange={handleFileSelected} className="hidden" />

      {importError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
          <FileWarning className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-bold text-red-700 flex-1">{importError}</p>
          <button onClick={() => setImportError(null)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {!hasActivePlan ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 animate-fade-in">
          <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-2"><img src="/dumbble.png" alt="" className="object-contain" style={{ width: '56px', height: '37px' }} /></div>
          <div className="space-y-2 max-w-md"><h1 className="text-3xl font-black text-[#111827]">Belum Ada Program</h1><p className="text-sm text-slate-500 font-medium">SyncFit akan merancang jadwal mingguan dan periodisasi progresif yang disesuaikan.</p></div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button onClick={() => setIsConfigModalOpen(true)} className="bg-[#FF5E00] hover:bg-[#E05300] text-white py-4 px-8 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-105"><Zap className="w-5 h-5 fill-current" /><span>Rancang Program Sekarang</span></button>
            <button onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-700 border border-slate-200 py-4 px-8 rounded-2xl font-black transition-all flex items-center justify-center gap-2 hover:bg-slate-50"><Upload className="w-5 h-5" /><span>Import dari File</span></button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          {/* HEADER SECTION */}
          <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden border border-slate-800">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#FF5E00]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#FF5E00]/20 border border-[#FF5E00]/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black text-[#FF5E00] uppercase tracking-wider">Minggu {selectedWeek}</span>
                  <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider">{formExp}</span>
                  
                  {/* EDIT GOAL INLINE — input teks bebas, bukan dropdown, biar user bisa isi goal sendiri (misal "Hybrid") */}
                  {isEditingGoal ? (
                    <div className="flex flex-col gap-1.5 bg-slate-800 p-2 rounded-2xl border border-indigo-500/50">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={tempGoal}
                          onChange={(e) => setTempGoal(e.target.value)}
                          maxLength={40}
                          placeholder="Nama goal, misal: Hybrid"
                          className="bg-transparent text-indigo-300 text-xs font-bold rounded-lg px-2 py-0.5 focus:outline-none w-36"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveGoal()}
                        />
                        <button onClick={handleSaveGoal} className="bg-indigo-600 hover:bg-indigo-500 text-white p-1 rounded-full transition-colors shrink-0">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={() => setIsEditingGoal(false)} className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-1 rounded-full transition-colors shrink-0">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 px-1">
                        {VALID_GOALS.map(gl => (
                          <button key={gl} onClick={() => setTempGoal(gl)} className="text-[9px] font-bold text-slate-400 hover:text-indigo-300 bg-slate-900/60 px-2 py-0.5 rounded-full transition-colors">
                            {gl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="bg-indigo-500/20 border border-indigo-500/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      {formGoal}
                      <button 
                        onClick={() => { setTempGoal(formGoal); setIsEditingGoal(true); }}
                        className="hover:text-white transition-colors p-0.5"
                        title="Edit Target Utama"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input type="text" value={tempDayName} onChange={(e) => setTempDayName(e.target.value)} className="bg-slate-800 text-white text-2xl sm:text-3xl font-black rounded-xl px-4 py-2 border border-slate-600 focus:outline-none focus:border-[#FF5E00] w-full max-w-[250px] sm:max-w-sm" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveDayName()} />
                    <button onClick={handleSaveDayName} className="bg-[#FF5E00] text-white p-2.5 rounded-xl"><Save className="w-5 h-5" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group mt-1">
                    <h1 className="text-3xl sm:text-4xl font-black leading-tight text-white">{activeWorkout?.name}</h1>
                    <button onClick={() => { setTempDayName(activeWorkout?.name || ""); setIsEditingName(true); }} className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-slate-800 p-2 rounded-lg hover:text-[#FF5E00] text-slate-400"><Edit2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button onClick={() => setIsConfigModalOpen(true)} className="bg-slate-800 text-slate-200 p-3.5 rounded-xl font-bold border border-slate-700 shrink-0"><Settings2 className="w-5 h-5" /></button>
                <button onClick={handleExportProgram} title="Export program jadi file .syncfit" className="bg-slate-800 text-slate-200 p-3.5 rounded-xl font-bold border border-slate-700 shrink-0"><Download className="w-5 h-5" /></button>
                {activeWorkout?.type !== 'Rest' && (
                  <button onClick={handleStartSession} disabled={isWorkoutActive} className={`w-full md:w-auto py-3.5 px-6 rounded-xl font-black flex items-center justify-center gap-2 ${isWorkoutActive ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-[#FF5E00] text-white hover:scale-105'}`}>
                    {isWorkoutActive ? <><span className="w-2 h-2 rounded-full bg-emerald-50 animate-pulse"></span><span>Sesi Berjalan</span></> : <><Play className="w-5 h-5" /><span>Mulai Latihan</span></>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* WEEK SELECTOR / PERIODISASI MINGGUAN */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF5E00]" />
                Fase Periodisasi
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { w: 1, label: 'W1: Pondasi' },
                { w: 2, label: 'W2: Volume' },
                { w: 3, label: 'W3: Intensitas' },
                { w: 4, label: 'W4: Deload' }
              ].map((item) => (
                <button
                  key={item.w}
                  onClick={() => handleWeekChange(item.w)}
                  className={`py-3 px-2 text-[11px] sm:text-xs font-black rounded-xl border transition-all duration-300 ${
                    selectedWeek === item.w
                      ? 'bg-[#FF5E00] text-white border-[#FF5E00] shadow-md shadow-orange-500/20 scale-[1.02]'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* JADWAL */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2"><Calendar className="w-4 h-4 text-[#FF5E00]" />Weekly Split Plan</h3>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><GripVertical className="w-3 h-3" />Tahan & geser untuk tukar hari</span>
            </div>
            <DndContext sensors={dayDragSensors} onDragEnd={handleDayDragEnd}>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {activePlan.map((item, index) => (
                  <DayTab key={index} index={index} item={item} isActive={selectedDay === index} onSelect={() => setSelectedDay(index)} />
                ))}
              </div>
            </DndContext>
          </div>

          {/* LIST LATIHAN */}
          {activeWorkout?.type === 'Rest' ? (
             <div className="bg-white py-12 px-6 rounded-3xl text-center space-y-3"><div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8" /></div><h3 className="font-extrabold text-[#111827] text-2xl">Rest Day</h3></div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeWorkout?.exercises.map((ex, idx) => {
                  const isCompleted = (completedExercises[`${selectedWeek}-${selectedDay}`] || []).includes(idx);
                  const currentLogs = exerciseSetLogs[`${selectedWeek}-${selectedDay}-${idx}`] || [];
                  const hasLogs = currentLogs.some(s => s.weight || s.completed);

                  return (
                    <div key={idx} onClick={() => openSetLogModal(idx)} className={`relative bg-white p-5 rounded-3xl border shadow-sm flex gap-4 cursor-pointer group hover:shadow-md transition-all ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
                      <button onClick={(e) => toggleExerciseCheck(idx, e)} className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black transition-all ${isCompleted ? 'bg-emerald-500 text-white scale-105' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                        {isCompleted ? <Check className="w-6 h-6" /> : idx + 1}
                      </button>
                      
                      <div className="flex-1 space-y-2.5 pr-8">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-extrabold text-base leading-tight ${isCompleted ? 'text-slate-400 line-through' : 'text-[#111827]'}`}>{ex.name}</h3>
                          {ex.videoUrl && ex.videoUrl.trim() !== '' && (
                            <button onClick={(e) => { e.stopPropagation(); setActiveDemo(ex); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-[#FF5E00] hover:bg-[#FF5E00] hover:text-white transition-all rounded-xl text-[10px] font-extrabold uppercase shrink-0 border border-orange-100">
                              <Video className="w-3.5 h-3.5" /> Demo
                            </button>
                          )}
                        </div>
                        
                        {/* BADGE DETAIL GERAKAN */}
                        <div className={`flex flex-wrap gap-2 text-[11px] font-bold ${isCompleted ? 'opacity-60' : ''}`}>
                          <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100">{ex.sets} Sets</span>
                          <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-100">{ex.reps}</span>
                          <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-md border border-purple-100">{ex.rir || 'RIR 2'}</span>
                          <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md border border-amber-100">Rest {ex.rest || '60s'}</span>
                        </div>

                        {hasLogs && (
                          <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                            {currentLogs.map((s, sIdx) => (
                              <span key={sIdx} className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${s.completed ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                S{sIdx + 1}: {s.weight || '0'}kg × {s.reps || '0'}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => openEditExercise(idx, e)} className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:text-[#FF5E00]"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={(e) => handleDeleteExercise(idx, e)} className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button onClick={openAddExercise} className="w-full mt-4 py-4 border-2 border-dashed border-slate-300 text-slate-500 hover:text-[#FF5E00] hover:border-[#FF5E00] transition-all rounded-3xl font-black flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Tambah Gerakan Manual</button>
            </div>
          )}
        </div>
      )}

      {/* MODAL SET BEBAN & REPS */}
      {isSetModalOpen && activeSetExerciseIdx !== null && activeWorkout?.exercises[activeSetExerciseIdx] && (() => {
        const currentExercise = activeWorkout.exercises[activeSetExerciseIdx];
        const isStaticExercise = currentExercise.isStatic || currentExercise.reps?.toLowerCase().includes('s');

        return (
          <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#FF5E00] uppercase block">Catat Beban & Reps</span>
                  <h3 className="font-black text-[#111827] text-xl">{currentExercise.name}</h3>
                </div>
                <button onClick={() => setIsSetModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center transition-colors hover:bg-slate-200"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-black uppercase text-slate-400 px-1">
                  <span className="col-span-2">Set</span>
                  <span className="col-span-4">Beban (kg)</span>
                  <span className="col-span-4">{isStaticExercise ? 'Durasi (detik)' : 'Reps / Durasi'}</span>
                  <span className="col-span-2 text-center">Done</span>
                </div>
                {tempSets.map((s, idx) => (
                  <div key={idx} className={`grid grid-cols-12 gap-2 items-center p-2 rounded-2xl border ${s.completed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="col-span-2 font-black text-slate-700 text-sm flex items-center"><span className="w-6 h-6 rounded-lg bg-slate-200/60 flex items-center justify-center">{idx + 1}</span></div>
                    <div className="col-span-4"><input type="number" step="0.5" placeholder="kg" value={s.weight} onChange={(e) => handleUpdateSetRow(idx, 'weight', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-[#111827]" /></div>
                    <div className="col-span-4"><input type="text" placeholder={isStaticExercise ? 'detik (mis: 45s)' : 'reps'} value={s.reps} onChange={(e) => handleUpdateSetRow(idx, 'reps', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-[#111827]" /></div>
                    <div className="col-span-2 flex items-center justify-center gap-1">
                      <button onClick={() => handleUpdateSetRow(idx, 'completed', !s.completed)} className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.completed ? 'bg-emerald-500 text-white' : 'bg-white border text-slate-300'}`}><Check className="w-4 h-4" /></button>
                      {tempSets.length > 1 && <button onClick={() => handleRemoveSetRow(idx)} className="text-slate-300 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleAddSetRow} className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500"><Plus className="w-4 h-4 inline" /> Tambah Baris Set</button>
              <button onClick={handleSaveSetLogs} className="w-full bg-[#FF5E00] hover:bg-[#E05300] transition-colors text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-500/20">Simpan Pencatatan</button>
            </div>
          </div>
        );
      })()}

      {/* MODAL EDIT & TAMBAH GERAKAN */}
      {isExerciseModalOpen && (
        <div className="fixed inset-0 bg-[#111827]/80 z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-black text-lg text-[#111827]">{editingExerciseIndex !== null ? 'Edit Gerakan' : 'Tambah Gerakan'}</h3>
              <button onClick={() => setIsExerciseModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nama Gerakan</label>
                <input type="text" value={exerciseForm.name} onChange={(e) => setExerciseForm({...exerciseForm, name: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-[#111827]" placeholder="Contoh: Barbell Bench Press" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Jumlah Set</label>
                  <input type="number" value={exerciseForm.sets} onChange={(e) => setExerciseForm({...exerciseForm, sets: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-[#111827]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Jumlah Reps / Durasi</label>
                  <input type="text" value={exerciseForm.reps} onChange={(e) => setExerciseForm({...exerciseForm, reps: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-[#111827]" placeholder="8-10 / 45s" />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">*Tambahkan "s" (mis: 45s) untuk gerakan statis</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Durasi Rest</label>
                  <input type="text" value={exerciseForm.rest} onChange={(e) => setExerciseForm({...exerciseForm, rest: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-[#111827]" placeholder="60s / 90s" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">RIR (Target)</label>
                  <input type="text" value={exerciseForm.rir || ''} onChange={(e) => setExerciseForm({...exerciseForm, rir: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-[#111827]" placeholder="RIR 1-2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">URL Video Demo (Opsional)</label>
                <input type="text" value={exerciseForm.videoUrl || ''} onChange={(e) => setExerciseForm({...exerciseForm, videoUrl: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-[#111827]" placeholder="https://..." />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Catatan Gerakan (Opsional)</label>
                <input type="text" value={exerciseForm.note || ''} onChange={(e) => setExerciseForm({...exerciseForm, note: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-[#111827]" placeholder="Instruksi / Catatan tambahan..." />
              </div>
            </div>

            <button onClick={handleSaveExercise} className="w-full bg-[#FF5E00] hover:bg-[#E05300] text-white py-4 rounded-2xl font-black transition-colors shadow-lg shadow-orange-500/20">
              Simpan Gerakan
            </button>
          </div>
        </div>
      )}
      
      {/* MODAL CONFIG */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
             <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-[#FF5E00]">
                  <h3 className="font-black text-[#111827] text-lg">Konfigurasi Program</h3>
                </div>
                <button onClick={() => setIsConfigModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                  <X className="w-4 h-4" />
                </button>
             </div>
             
             <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pengalaman</label>
                 <div className="grid grid-cols-3 gap-2">
                   {(['Pemula', 'Menengah', 'Mahir'] as Experience[]).map((lvl) => (
                     <button key={lvl} onClick={() => setFormExp(lvl)} className={`py-2.5 px-1 text-xs font-bold rounded-xl border transition-all ${formExp === lvl ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white text-slate-500 border-slate-200'}`}>{lvl}</button>
                   ))}
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Hari per Minggu</label>
                 <div className="grid grid-cols-5 gap-2">
                   {[2, 3, 4, 5, 6].map((day) => (
                     <button key={day} onClick={() => setFormDays(day)} className={`py-2.5 px-1 text-sm font-black rounded-xl border transition-all ${formDays === day ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white text-slate-500 border-slate-200'}`}>{day}</button>
                   ))}
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Target Utama</label>
                 <input
                   type="text"
                   value={formGoal}
                   onChange={(e) => setFormGoal(e.target.value)}
                   maxLength={40}
                   placeholder="Misal: Strength, atau goal sendiri seperti Hybrid"
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#111827] focus:outline-none focus:border-[#FF5E00]"
                 />
                 <div className="flex flex-wrap gap-1.5 pt-1">
                   {VALID_GOALS.map((gl) => (
                     <button key={gl} onClick={() => setFormGoal(gl)} className={`py-1.5 px-3 text-[11px] font-bold rounded-full border transition-all ${formGoal === gl ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{gl}</button>
                   ))}
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium pt-0.5">Pilih salah satu di atas supaya reps & rest otomatis disesuaikan (Strength/Fat Loss). Goal custom tetap bisa dipakai, cuma tanpa penyesuaian otomatis itu.</p>
               </div>
             </div>

             <button onClick={handleGeneratePlan} className="w-full bg-[#111827] hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 mt-2">
               Simpan & Rancang Jadwal
             </button>
             <button onClick={() => { setIsConfigModalOpen(false); fileInputRef.current?.click(); }} className="w-full bg-white text-slate-600 border border-slate-200 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:bg-slate-50">
               <Upload className="w-4 h-4" /> Atau Import dari File .syncfit
             </button>
          </div>
        </div>
      )}

      {/* D2: MODAL KONFIRMASI IMPORT — preview dulu sebelum menimpa program yang ada */}
      {pendingImport && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 relative shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[#111827] text-lg">Import Program Ini?</h3>
                <p className="text-xs text-slate-500 font-medium">Program yang sedang aktif akan digantikan sepenuhnya.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Pengalaman</span><span className="font-bold text-[#111827]">{pendingImport.experience}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Hari/minggu</span><span className="font-bold text-[#111827]">{pendingImport.days} hari</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Target Utama</span><span className="font-bold text-[#111827]">{pendingImport.goal}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-medium">Cakupan</span><span className="font-bold text-[#111827]">4 minggu (W1-W4)</span></div>
            </div>

            <p className="text-xs text-slate-400 font-medium">Progres/reps/beban yang sudah kamu catat sebelumnya di program lama tidak akan terhapus dari riwayat, tapi tidak akan tersambung ke program baru ini.</p>

            <div className="flex gap-3">
              <button onClick={() => setPendingImport(null)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 transition-colors rounded-2xl text-slate-600 font-black text-sm">
                Batal
              </button>
              <button onClick={handleConfirmImport} className="flex-1 py-3.5 bg-[#FF5E00] hover:bg-[#E05300] transition-colors rounded-2xl text-white font-black text-sm">
                Ya, Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DEMO VIDEO */}
      {activeDemo && (
        <div className="fixed inset-0 bg-[#111827]/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-extrabold text-base">{activeDemo.name}</h3><button onClick={() => setActiveDemo(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><X className="w-4 h-4" /></button></div>
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <iframe className="w-full h-full" src={activeDemo.videoUrl} title="Demo" allowFullScreen />
            </div>
            {activeDemo.note && <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">{activeDemo.note}</p>}
          </div>
        </div>
      )}

      {/* FLOAT TIMER */}
      {isWorkoutActive && (
        <div className={`fixed transition-all duration-500 ease-in-out ${isTimerMinimized ? 'bottom-28 sm:bottom-6 right-4 sm:right-6 z-[60]' : 'inset-0 z-[100] bg-[#111827]/80 backdrop-blur-sm flex items-center justify-center p-4'}`}>
          {!isTimerMinimized ? (
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
              <p className="text-[#111827] font-black text-xl mb-6">{activeWorkout?.name}</p>
              <div className="text-7xl font-black text-[#111827] font-mono mb-10">{formatTime(timer)}</div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setIsTimerMinimized(true)} className="p-4 rounded-2xl bg-slate-100"><Minimize2 className="w-6 h-6" /></button>
                <button onClick={handleEndSession} className="flex-1 py-4 px-6 rounded-2xl bg-red-500 text-white font-black"><Square className="w-5 h-5 inline mr-2" /> Akhiri Sesi</button>
              </div>
            </div>
          ) : (
            <div onClick={() => setIsTimerMinimized(false)} className="bg-[#111827] text-white px-5 py-3.5 rounded-full flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition-all shadow-xl">
              <span className="font-mono font-bold text-lg">{formatTime(timer)}</span>
              <Minimize2 className="w-4 h-4 text-slate-400 rotate-180" />
            </div>
          )}
        </div>
      )}

      {/* RECAP MODAL */}
      {isRecapModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex flex-col items-center justify-center p-4 overflow-y-auto">
          <div 
            id="syncfit-recap-card" 
            className="relative w-full max-w-sm flex flex-col items-center text-center py-10 px-6 mb-2"
            style={{ 
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              textShadow: '0px 2px 8px rgba(0,0,0,0.75), 0px 1px 2px rgba(0,0,0,0.9)'
            }}
          >
            {/* WORKOUT + konteks minggu/goal */}
            <span className="text-white/70 text-sm font-semibold uppercase block" style={{ letterSpacing: '5.5px' }}>Workout</span>
            <span className="text-white/70 text-[11px] font-bold uppercase block mt-1.5" style={{ letterSpacing: '2px' }}>
              Minggu {selectedWeek} · {formGoal}
            </span>

            {/* Nama hari latihan — hero utama */}
            <h2 className="text-white font-extrabold mt-4" style={{ fontSize: '41px', letterSpacing: '-0.7px', lineHeight: 1.05 }}>
              {activeWorkout?.name}
            </h2>

            {/* Kartu kaca tipis: TIME | CALORIES — pakai GRID 2 kolom SAMA LEBAR (bukan flex
                shrink-wrap) supaya divider selalu presis di tengah, tidak peduli "75:30" vs
                "440 kcal" beda panjang teksnya. html2canvas kadang tidak akurat menghitung ulang
                lebar flex saat render ke canvas kalau kolomnya beda lebar konten. */}
            <div 
              className="grid grid-cols-2 mt-10 rounded-2xl w-full max-w-[280px]"
              style={{ padding: '18px 0', background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <div className="flex flex-col items-center border-r border-white/25">
                <span className="text-white/70 text-[10px] font-semibold uppercase" style={{ letterSpacing: '2px' }}>Time</span>
                <span className="text-white font-extrabold mt-1.5" style={{ fontSize: '22px' }}>{formatTime(workoutStats.duration)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white/70 text-[10px] font-semibold uppercase" style={{ letterSpacing: '2px' }}>Calories</span>
                <span className="text-[#FF8C42] font-extrabold mt-1.5" style={{ fontSize: '22px' }}>{workoutStats.calories} kcal</span>
              </div>
            </div>

            {/* Exercises completed */}
            {completedExercises[`${selectedWeek}-${selectedDay}`] && completedExercises[`${selectedWeek}-${selectedDay}`].length > 0 && (
              <div className="mt-9 flex flex-col items-center gap-1.5">
                <span className="text-white/70 text-[11px] font-semibold uppercase" style={{ letterSpacing: '2.7px' }}>Exercises Completed</span>
                {completedExercises[`${selectedWeek}-${selectedDay}`].map(idx => (
                  <span key={idx} className="text-white font-semibold" style={{ fontSize: '18px' }}>
                    {activeWorkout?.exercises[idx]?.name}
                  </span>
                ))}
              </div>
            )}

            {/* Logo SYNCFIT */}
            <div className="mt-14">
              <span className="font-extrabold italic" style={{ fontSize: '26px' }}>
                <span className="text-white not-italic">SYNC</span><span className="text-[#FF5E00]">FIT</span>
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-3 w-full max-w-sm px-4">
            <button onClick={() => setIsRecapModalOpen(false)} className="flex-none py-4 px-6 bg-slate-800 hover:bg-slate-700 transition-colors rounded-2xl text-white font-bold">Tutup</button>
            <button onClick={downloadRecapPNG} className="flex-1 py-4 bg-[#FF5E00] hover:bg-[#E05300] transition-colors rounded-2xl text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
              <Download className="w-5 h-5" /> Simpan Kartu Recap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutView;
