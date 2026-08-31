// src/components/WorkoutView.tsx
import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
  Dumbbell, Play, Info, Clock, CheckCircle2,
  Settings2, Calendar, Video, X, Wand2, Zap, Check, Minimize2, Square, Download
} from 'lucide-react';

import { generateWorkoutPlan, DayPlan, GeneratedExercise, Experience, Goal } from '../utils/workoutEngine';

export const WorkoutView: React.FC = () => {
  // 1. STATE KONFIGURASI (Disimpan di localStorage)
  const [formExp, setFormExp] = useState<Experience>(() => (localStorage.getItem('sfit_exp') as Experience) || 'Menengah');
  const [formDays, setFormDays] = useState(() => parseInt(localStorage.getItem('sfit_days') || '4', 10));
  const [formGoal, setFormGoal] = useState<Goal>(() => (localStorage.getItem('sfit_goal') as Goal) || 'Hypertrophy');
  const [selectedWeek, setSelectedWeek] = useState<number>(() => parseInt(localStorage.getItem('sfit_week') || '1', 10));

  // 2. STATE DATA PROGRAM (Disimpan di localStorage)
  const [activePlan, setActivePlan] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem('sfit_workout_plan');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDay, setSelectedDay] = useState(() => {
    const saved = localStorage.getItem('sfit_selected_day');
    return saved ? JSON.parse(saved) : 0;
  });
  const [completedExercises, setCompletedExercises] = useState<Record<number, number[]>>(() => {
    const saved = localStorage.getItem('sfit_completed_exercises');
    return saved ? JSON.parse(saved) : {};
  });

  // 3. STATE TIMER & SESI LATIHAN
  const [isWorkoutActive, setIsWorkoutActive] = useState(() => localStorage.getItem('sfit_is_active') === 'true');
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('sfit_start_time');
    return saved ? parseInt(saved, 10) : null;
  });
  const [isTimerMinimized, setIsTimerMinimized] = useState(() => localStorage.getItem('sfit_timer_minimized') === 'true');
  const [timer, setTimer] = useState(0);

  // Modals
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState<GeneratedExercise | null>(null);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({ duration: 0, calories: 0, date: '' });

  const hasActivePlan = activePlan.length > 0;
  const activeWorkout = activePlan[selectedDay];

  // --- EFEK PENYIMPANAN OTOMATIS KE LOCALSTORAGE ---
  useEffect(() => { localStorage.setItem('sfit_exp', formExp); }, [formExp]);
  useEffect(() => { localStorage.setItem('sfit_days', formDays.toString()); }, [formDays]);
  useEffect(() => { localStorage.setItem('sfit_goal', formGoal); }, [formGoal]);
  useEffect(() => { localStorage.setItem('sfit_week', selectedWeek.toString()); }, [selectedWeek]);
  useEffect(() => { localStorage.setItem('sfit_workout_plan', JSON.stringify(activePlan)); }, [activePlan]);
  useEffect(() => { localStorage.setItem('sfit_selected_day', JSON.stringify(selectedDay)); }, [selectedDay]);
  useEffect(() => { localStorage.setItem('sfit_completed_exercises', JSON.stringify(completedExercises)); }, [completedExercises]);
  useEffect(() => { localStorage.setItem('sfit_is_active', isWorkoutActive.toString()); }, [isWorkoutActive]);
  useEffect(() => { localStorage.setItem('sfit_timer_minimized', isTimerMinimized.toString()); }, [isTimerMinimized]);

  // --- LOGIKA TIMER ANTI-RESET ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isWorkoutActive && sessionStartTime) {
      setTimer(Math.floor((Date.now() - sessionStartTime) / 1000));
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, sessionStartTime]);

  // --- HANDLER FUNCTIONS ---
  const handleGeneratePlan = () => {
    const newPlan = generateWorkoutPlan(formExp, formDays, formGoal, selectedWeek);
    setActivePlan(newPlan);
    setCompletedExercises({}); 
    setIsConfigModalOpen(false);
    setSelectedDay(0);
  };

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
    const newPlan = generateWorkoutPlan(formExp, formDays, formGoal, week);
    setActivePlan(newPlan);
    setCompletedExercises({}); 
    setSelectedDay(0);
  };

  const toggleExerciseCheck = (exerciseIndex: number) => {
    setCompletedExercises((prev) => {
      const dayCompleted = prev[selectedDay] || [];
      const isChecked = dayCompleted.includes(exerciseIndex);
      return {
        ...prev,
        [selectedDay]: isChecked 
          ? dayCompleted.filter(i => i !== exerciseIndex) 
          : [...dayCompleted, exerciseIndex]
      };
    });
  };

  const handleStartSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    localStorage.setItem('sfit_start_time', now.toString());
    setIsWorkoutActive(true);
    setIsTimerMinimized(false);
  };

  const handleEndSession = () => {
    setIsWorkoutActive(false);
    setIsTimerMinimized(false);
    localStorage.removeItem('sfit_is_active');
    localStorage.removeItem('sfit_start_time');
    
    // LOGIKA KALORI BARU (MET)
    const userWeightKg = parseFloat(localStorage.getItem('sfit_user_weight') || '70');
    const MET_VALUE = 5.0; // Estimasi untuk angkat beban
    const calculatedCalories = Math.max(5, Math.round((MET_VALUE * userWeightKg * timer) / 3600));
    
    setWorkoutStats({
      duration: timer,
      calories: calculatedCalories,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date()),
    });
    
    setIsRecapModalOpen(true);
    setSessionStartTime(null);
    setTimer(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const downloadRecapPNG = async () => {
    const element = document.getElementById('strava-sticker-card');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { 
        scale: 3, 
        backgroundColor: null,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById('strava-sticker-card');
          if (clonedEl) {
            clonedEl.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          }
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SyncFit-Recap-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Gagal mendownload rekap", e);
    }
  };

  const textShadowStyle = { textShadow: '0px 2px 10px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,1)' };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 pt-0 relative font-sans">
      
      {!hasActivePlan ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 animate-fade-in">
          <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-2">
            <Wand2 className="w-12 h-12 text-[#FF5E00]" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-3xl font-black text-[#111827]">Belum Ada Program</h1>
            <p className="text-sm text-slate-500 font-medium">
              SyncFit akan merancang jadwal mingguan dan periodisasi progresif yang disesuaikan dengan target Anda.
            </p>
          </div>
          <button 
            onClick={() => setIsConfigModalOpen(true)}
            className="bg-[#FF5E00] hover:bg-[#E05300] text-white py-4 px-8 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-105"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>Rancang Program Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          
          {/* HEADER SECTION */}
          <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden border border-slate-800">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#FF5E00]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#FF5E00]/20 border border-[#FF5E00]/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black text-[#FF5E00] uppercase tracking-wider">
                    Minggu {selectedWeek}: {selectedWeek === 1 ? 'Pondasi' : selectedWeek === 2 ? 'Volume' : selectedWeek === 3 ? 'Intensitas' : 'Deload'}
                  </span>
                  <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {formExp}
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-black leading-tight text-white">
                  {activeWorkout?.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Settings2 className="w-4 h-4 text-[#FF5E00]" />
                    <span>Goal: {formGoal}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-400" />
                    <span>Progression: Terukur</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button 
                  onClick={() => setIsConfigModalOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-3.5 rounded-xl font-bold transition-all border border-slate-700 shrink-0 flex-none"
                >
                  <Settings2 className="w-5 h-5" />
                </button>

                {activeWorkout?.type !== 'Rest' && (
                  <button 
                    onClick={handleStartSession}
                    disabled={isWorkoutActive}
                    className={`w-full md:w-auto py-3.5 px-6 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap ${
                      isWorkoutActive 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                        : 'bg-[#FF5E00] hover:bg-[#E05300] text-white hover:scale-105 shadow-orange-500/20'
                    }`}
                  >
                    {isWorkoutActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                        <span className="truncate">Sesi Berjalan</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current shrink-0" />
                        <span className="truncate">Mulai Latihan</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PERIODISASI MINGGUAN */}
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

          {/* JADWAL HARI */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FF5E00]" />
                Weekly Split Plan
              </h3>
              <span className="text-[11px] font-bold text-slate-400">{formDays} Hari Latihan</span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {activePlan.map((item, index) => {
                const isActive = selectedDay === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`relative flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-300 border
                      ${isActive 
                        ? 'bg-[#111827] text-white border-[#111827] scale-110 shadow-lg shadow-black/20 z-10' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}
                    `}
                  >
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-[#FF5E00]' : 'text-slate-400'}`}>
                      {item.dayLabel}
                    </span>
                    <span className={`text-[9px] sm:text-xs font-bold truncate w-full px-1 text-center mt-0.5 ${isActive ? 'text-white' : 'text-slate-700'}`}>
                      {item.name === 'Rest Day' ? 'Rest' : item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIST LATIHAN */}
          {activeWorkout?.type === 'Rest' ? (
            <div className="bg-white py-12 px-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-[#111827] text-2xl">Rest Day</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Istirahat yang cukup untuk regenerasi jaringan otot.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-extrabold text-[#111827] flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-[#FF5E00]" />
                  Gerakan Utama
                </h2>
                <span className="text-xs font-bold text-slate-400">{activeWorkout?.exercises.length} Latihan</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeWorkout?.exercises.map((ex, idx) => {
                  const isCompleted = (completedExercises[selectedDay] || []).includes(idx);
                  
                  return (
                    <div key={idx} className={`bg-white p-5 rounded-3xl border shadow-sm flex gap-4 transition-all duration-300 ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
                      <button 
                        onClick={() => toggleExerciseCheck(idx)}
                        className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 rotate-[360deg] scale-105' 
                            : 'bg-slate-50 border border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : idx + 1}
                      </button>
                      
                      <div className="flex-1 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-extrabold text-base leading-tight transition-colors ${isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-[#111827]'}`}>
                            {ex.name}
                          </h3>
                          <button
                            onClick={() => setActiveDemo(ex)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-[#FF5E00] text-[#FF5E00] hover:text-white rounded-xl text-[10px] font-extrabold transition-all border border-orange-100 shrink-0 uppercase tracking-wider"
                          >
                            <Video className="w-3.5 h-3.5" /> Demo
                          </button>
                        </div>
                        
                        <div className={`flex flex-wrap gap-2 text-[11px] font-bold ${isCompleted ? 'opacity-60' : ''}`}>
                          <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100">{ex.sets} Sets</span>
                          <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-100">{ex.reps} Reps</span>
                          <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-md border border-purple-100">{ex.rir || 'RIR 2'}</span>
                          <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ex.rest}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FLOAT TIMER SESI AKTIF */}
      {isWorkoutActive && (
        <div className={`fixed transition-all duration-500 ease-in-out ${isTimerMinimized ? 'bottom-28 sm:bottom-6 right-4 sm:right-6 z-[60]' : 'inset-0 z-[100] bg-[#111827]/80 backdrop-blur-sm flex items-center justify-center p-4'}`}>
          {!isTimerMinimized ? (
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl scale-100 animate-fade-in border border-slate-100">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#FF5E00]">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-slate-400 font-bold mb-1 uppercase tracking-widest text-xs">Sesi Latihan Aktif</h3>
              <p className="text-[#111827] font-black text-xl mb-6">{activeWorkout?.name}</p>
              <div className="text-7xl font-black text-[#111827] font-mono tracking-tighter mb-10 tabular-nums">
                {formatTime(timer)}
              </div>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setIsTimerMinimized(true)}
                  className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  <Minimize2 className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleEndSession}
                  className="flex-1 py-4 px-6 rounded-2xl bg-red-500 text-white font-black text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                >
                  <Square className="w-5 h-5 fill-current" /> Akhiri Sesi
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setIsTimerMinimized(false)}
              className="bg-[#111827] border border-slate-700 text-white px-5 py-3.5 rounded-full flex items-center gap-4 shadow-2xl shadow-black/40 cursor-pointer hover:bg-slate-800 transition-all hover:scale-105 group"
            >
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5E00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5E00]"></span>
                </span>
                <span className="font-mono font-bold text-lg tabular-nums tracking-tight">{formatTime(timer)}</span>
              </div>
              <div className="w-px h-6 bg-slate-700"></div>
              <Minimize2 className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors rotate-180" />
            </div>
          )}
        </div>
      )}

      {/* MODAL REKAP STRAVA-STYLE (CENTERED, PERBAIKAN JARAK) */}
      {isRecapModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex flex-col items-center justify-center p-4 overflow-y-auto">
          
          <div 
            id="strava-sticker-card" 
            className="bg-transparent text-white w-full max-w-sm flex flex-col items-center text-center p-6 mb-2"
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            {/* 1. Tipe Latihan */}
            <div className="mb-4">
              <span className="text-white/80 text-[11px] font-black uppercase tracking-widest block mb-0.5" style={textShadowStyle}>
                Workout
              </span>
              <span className="text-white font-black text-3xl tracking-tight block" style={textShadowStyle}>
                {activeWorkout?.name}
              </span>
            </div>

            {/* 2. Durasi Latihan */}
            <div className="mb-4">
              <span className="text-white/80 text-[11px] font-black uppercase tracking-widest block mb-0.5" style={textShadowStyle}>
                Time
              </span>
              <span className="text-white font-black text-4xl tracking-tight block font-mono" style={textShadowStyle}>
                {formatTime(workoutStats.duration)}
              </span>
            </div>

            {/* 3. Estimasi Kalori */}
            <div className="mb-4">
              <span className="text-[#FF5E00] text-[11px] font-black uppercase tracking-widest block mb-0.5" style={textShadowStyle}>
                Calories
              </span>
              <span className="text-white font-black text-3xl tracking-tight block" style={textShadowStyle}>
                {workoutStats.calories} <span className="text-lg font-bold text-white/90">kcal</span>
              </span>
            </div>

            {/* 4. List Gerakan Diselesaikan */}
            {completedExercises[selectedDay] && completedExercises[selectedDay].length > 0 && (
              <div className="w-full flex flex-col items-center mb-3">
                <span className="text-white/70 text-[10px] font-black uppercase tracking-widest block mb-2" style={textShadowStyle}>
                  Exercises Completed
                </span>
                <div className="flex flex-col items-center gap-1.5 w-full px-2">
                  {completedExercises[selectedDay].map(idx => (
                    <span key={idx} className="text-[13.5px] sm:text-sm font-bold text-white text-center leading-tight tracking-wide" style={textShadowStyle}>
                      {activeWorkout?.exercises[idx].name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Ikon Dumbbell (Margin Diperkecil) */}
            <div className="mt-1 mb-1 flex justify-center">
              <img 
                src="/dumbble.png" 
                alt="Dumbbell Icon" 
                className="w-24 h-24 object-contain bg-transparent drop-shadow-md" 
              />
            </div>

            {/* 6. Logo (Margin Diperkecil) */}
            <div className="flex items-center justify-center mt-2 mb-1">
              <span className="font-black text-3xl italic tracking-wider text-white" style={textShadowStyle}>
                SYNC<span className="text-[#FF5E00]">FIT</span>
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-3 w-full max-w-sm px-4">
            <button 
              onClick={() => setIsRecapModalOpen(false)} 
              className="flex-none py-4 px-6 bg-slate-800 hover:bg-slate-700 transition-colors rounded-2xl text-white font-bold"
            >
              Tutup
            </button>
            <button 
              onClick={downloadRecapPNG} 
              className="flex-1 py-4 bg-[#FF5E00] hover:bg-[#E05300] transition-colors rounded-2xl text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Download className="w-5 h-5" /> Simpan Stiker
            </button>
          </div>

        </div>
      )}

      {/* MODAL KONFIGURASI PROGRAM */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#FF5E00]">
                <Wand2 className="w-6 h-6" />
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
                <div className="grid grid-cols-2 gap-2">
                  {(['Hypertrophy', 'Strength', 'Fat Loss', 'General Fitness'] as Goal[]).map((gl) => (
                    <button key={gl} onClick={() => setFormGoal(gl)} className={`py-3 px-2 text-xs font-bold rounded-xl border transition-all ${formGoal === gl ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-500 border-slate-200'}`}>{gl}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleGeneratePlan} className="w-full bg-[#111827] hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 mt-2">
              Simpan & Rancang Jadwal
            </button>
          </div>
        </div>
      )}

      {/* MODAL DEMO VIDEO */}
      {activeDemo && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#FF5E00]">
                <Video className="w-5 h-5" />
                <h3 className="font-extrabold text-[#111827] text-base">{activeDemo.name}</h3>
              </div>
              <button onClick={() => setActiveDemo(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center relative">
              <iframe className="w-full h-full" src={activeDemo.videoUrl} title="Demo Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <p className="text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-[#111827]">Instruksi:</strong> {activeDemo.note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutView;
