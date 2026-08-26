// src/components/WorkoutView.tsx
import React, { useState } from 'react';
import { 
  Dumbbell, Play, Info, Clock, Flame, CheckCircle2,
  Settings2, Calendar, Video, X, Wand2, Zap
} from 'lucide-react';

// Import Engine Logika Kita
import { generateWorkoutPlan, DayPlan, GeneratedExercise, Experience, Goal } from '../utils/workoutEngine';

export const WorkoutView: React.FC = () => {
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  
  // State Konfigurasi Form
  const [formExp, setFormExp] = useState<Experience>('Menengah');
  const [formDays, setFormDays] = useState(4);
  const [formGoal, setFormGoal] = useState<Goal>('Hypertrophy');

  // State Data Program & UI
  const [activePlan, setActivePlan] = useState<DayPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeDemo, setActiveDemo] = useState<GeneratedExercise | null>(null);

  const handleGeneratePlan = () => {
    // Jalankan engine logika yang baru dibuat
    const newPlan = generateWorkoutPlan(formExp, formDays, formGoal);
    setActivePlan(newPlan);
    setHasActivePlan(true);
    setIsConfigModalOpen(false);
    setSelectedDay(0); // Kembali ke hari pertama saat program baru dibuat
  };

  const activeWorkout = activePlan[selectedDay];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 pt-0">
      
      {!hasActivePlan ? (
        /* =========================================
           EMPTY STATE (BELUM ADA PROGRAM)
           ========================================= */
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
          <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-2">
            <Wand2 className="w-12 h-12 text-[#FF5E00]" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-3xl font-black text-[#111827]">Belum Ada Program</h1>
            <p className="text-sm text-slate-500 font-medium">
              SFit akan merancang jadwal mingguan dan repetisi spesifik yang disesuaikan dengan target, pengalaman, dan ketersediaan waktu Anda.
            </p>
          </div>
          <button 
            onClick={() => setIsConfigModalOpen(true)}
            className="bg-[#FF5E00] hover:bg-[#E05300] text-white py-4 px-8 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>Rancang Program Sekarang</span>
          </button>
        </div>
      ) : (
        /* =========================================
           UI LATIHAN AKTIF (SETELAH DI-GENERATE)
           ========================================= */
        <>
          {/* 1. HEADER WORKOUT */}
          <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden border border-slate-800">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#FF5E00]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#FF5E00]/10 border border-[#FF5E00]/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#FF5E00] uppercase tracking-wider">
                    Minggu 1
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

              {/* PERBAIKAN TOMBOL TERPOTONG DI MOBILE */}
              <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button 
                  onClick={() => setIsConfigModalOpen(true)}
                  title="Atur Ulang Program"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-3.5 sm:py-3.5 sm:px-4 rounded-xl font-bold transition-all border border-slate-700 shrink-0"
                >
                  <Settings2 className="w-5 h-5" />
                </button>
                <button 
                  className="flex-1 md:flex-none w-full bg-[#FF5E00] hover:bg-[#E05300] text-white py-3.5 px-4 sm:px-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                >
                  <Play className="w-5 h-5 fill-current shrink-0" />
                  <span className="truncate">Mulai Latihan</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. WEEKLY SPLIT STRIP (STACKED CARDS ANIMATION) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FF5E00]" />
                Weekly Split Plan
              </h3>
              <span className="text-[11px] font-bold text-slate-400">{formDays} Hari Latihan</span>
            </div>

            {/* Container Stacked Card */}
            <div className="flex overflow-x-auto pb-4 pt-2 px-2 -mx-2 hide-scrollbar">
              {activePlan.map((item, index) => {
                const isActive = selectedDay === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`relative transition-all duration-300 ease-out shrink-0 w-[110px] sm:w-[120px] rounded-2xl p-3.5 border flex flex-col text-left
                      ${isActive 
                        ? 'bg-[#111827] text-white border-[#111827] scale-110 shadow-lg shadow-black/20' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}
                      ${index !== 0 ? '-ml-5' : ''} 
                    `}
                    style={{ 
                      zIndex: isActive ? 50 : 10 + index // Dinamis agar kartu aktif menumpuk di depan
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5 w-full">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-[#FF5E00]' : 'text-slate-400'}`}>
                        {item.dayLabel}
                      </span>
                      {item.isToday && (
                        <span className="w-2 h-2 rounded-full bg-[#FF5E00]"></span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm font-bold truncate w-full ${isActive ? 'text-white' : 'text-slate-700'}`}>
                      {item.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. DAFTAR GERAKAN (ATAU REST DAY) */}
          {activeWorkout?.type === 'Rest' ? (
            <div className="bg-white py-12 px-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-[#111827] text-2xl">Rest Day</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Otot Anda tumbuh saat Anda beristirahat, bukan saat berlatih. Pastikan asupan protein tercukupi dan tidur yang berkualitas hari ini.
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
                {activeWorkout?.exercises.map((ex, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex gap-4 hover:border-slate-300 transition-colors">
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-lg">
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-extrabold text-[#111827] text-base leading-tight">{ex.name}</h3>
                        <button
                          onClick={() => setActiveDemo(ex)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-[#FF5E00] text-[#FF5E00] hover:text-white rounded-xl text-[10px] font-extrabold transition-all border border-orange-100 shrink-0 uppercase tracking-wider"
                        >
                          <Video className="w-3.5 h-3.5" /> Demo
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                        <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100">
                          {ex.sets} Sets
                        </span>
                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md border border-emerald-100">
                          {ex.reps} Reps
                        </span>
                        <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {ex.rest}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-slate-500 flex items-start gap-1.5 pt-1">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        {ex.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CARDIO FINISHER (Hanya jika bukan Rest Day & Targetnya cocok) */}
          {activeWorkout?.type !== 'Rest' && ['Fat Loss', 'General Fitness'].includes(formGoal) && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden mt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#FF5E00] flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2">
                      Cardio Finisher
                      <span className="bg-[#111827] text-white text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider">Wajib</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      15 Menit Burpee / Mountain Climber setelah beban.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* =========================================
          MODAL: GENERATE WORKOUT CONFIGURATION
          ========================================= */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#FF5E00]">
                <Wand2 className="w-6 h-6" />
                <h3 className="font-black text-[#111827] text-lg">Konfigurasi Program</h3>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Field: Pengalaman */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pengalaman</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Pemula', 'Menengah', 'Mahir'] as Experience[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFormExp(lvl)}
                      className={`py-2.5 px-1 text-xs font-bold rounded-xl border transition-all ${
                        formExp === lvl ? 'bg-[#FF5E00] text-white border-[#FF5E00] shadow-md shadow-orange-500/20' : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field: Hari Latihan */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Hari per Minggu</label>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 3, 4, 5, 6].map((day) => (
                    <button
                      key={day}
                      onClick={() => setFormDays(day)}
                      className={`py-2.5 px-1 text-sm font-black rounded-xl border transition-all ${
                        formDays === day ? 'bg-[#111827] text-white border-[#111827] shadow-md' : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field: Goal */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Target Utama</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Hypertrophy', 'Strength', 'Fat Loss', 'General Fitness'] as Goal[]).map((gl) => (
                    <button
                      key={gl}
                      onClick={() => setFormGoal(gl)}
                      className={`py-3 px-2 text-xs font-bold rounded-xl border transition-all ${
                        formGoal === gl ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      {gl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              className="w-full bg-[#111827] hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 mt-2"
            >
              Simpan & Rancang Jadwal
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: VIDEO DEMO
          ========================================= */}
      {activeDemo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#FF5E00]">
                <Video className="w-5 h-5" />
                <h3 className="font-extrabold text-[#111827] text-base">{activeDemo.name}</h3>
              </div>
              <button
                onClick={() => setActiveDemo(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center relative">
              <iframe
                className="w-full h-full"
                src={activeDemo.videoUrl}
                title="Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-[#111827]">Instruksi:</strong> {activeDemo.note}
            </p>
          </div>
        </div>
      )}

      {/* CSS Tambahan untuk menyembunyikan scrollbar di Weekly Split container */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
};

export default WorkoutView;
