// src/components/WorkoutView.tsx
import React from 'react';
import { 
  Dumbbell, 
  Play, 
  Info, 
  Clock, 
  Flame, 
  CheckCircle2,
  Settings2
} from 'lucide-react';

export const WorkoutView: React.FC = () => {
  // DATA DUMMY (Akan digantikan oleh logika WORKOUT_TEMPLATE_LOGIC.md)
  const mockProgram = {
    splitName: "Upper Body A",
    week: 2,
    experience: "Intermediate",
    goal: "Hypertrophy",
    globalReps: "8-12",
    globalRIR: "1-2"
  };

  const mockExercises = [
    { name: "Barbell Bench Press", sets: 3, reps: "8-12", rest: "90s", note: "Fokus pada rentang gerak penuh" },
    { name: "Incline Dumbbell Row", sets: 3, reps: "10-12", rest: "90s", note: "Tahan kontraksi di puncak" },
    { name: "Overhead Shoulder Press", sets: 3, reps: "10-12", rest: "90s", note: "Jangan melengkungkan punggung" },
  ];

  const hasCardioFinisher = true; // Sesuai logika: True jika Fat Loss/General Fitness

  return (
    // WRAPPER INI SAMA PERSIS DENGAN DASHBOARD AGAR PADDING SERASI
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-8 pt-2">
      
      {/* 1. HEADER WORKOUT */}
      <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#FF5E00]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#FF5E00]/10 border border-[#FF5E00]/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#FF5E00] uppercase tracking-wider">
                Minggu {mockProgram.week}
              </span>
              <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider">
                {mockProgram.experience}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black leading-tight text-white">
              {mockProgram.splitName}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 mt-2">
              <div className="flex items-center gap-1.5">
                <Settings2 className="w-4 h-4 text-[#FF5E00]" />
                <span>Goal: {mockProgram.goal}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Target: {mockProgram.globalReps} Reps | {mockProgram.globalRIR} RIR</span>
              </div>
            </div>
          </div>

          <button className="w-full md:w-auto bg-[#FF5E00] hover:bg-[#E05300] text-white py-3.5 px-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm shrink-0">
            <Play className="w-5 h-5 fill-current" />
            <span>Mulai Latihan</span>
          </button>
        </div>
      </div>

      {/* 2. DAFTAR GERAKAN (EXERCISES) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-extrabold text-[#111827] flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#FF5E00]" />
            Gerakan Utama
          </h2>
          <span className="text-xs font-bold text-slate-400">{mockExercises.length} Latihan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockExercises.map((ex, idx) => (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex gap-4 hover:border-slate-200 transition-colors">
              {/* Nomor Urut */}
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-lg">
                {idx + 1}
              </div>
              
              {/* Detail Gerakan */}
              <div className="flex-1 space-y-2">
                <h3 className="font-extrabold text-[#111827] text-base leading-tight">{ex.name}</h3>
                
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

      {/* 3. CARDIO FINISHER (Kondisional berdasarkan Goal) */}
      {hasCardioFinisher && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden mt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#FF5E00] flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2">
                  Cardio Finisher
                  <span className="bg-[#111827] text-white text-[9px] uppercase px-2 py-0.5 rounded-md">Khusus Fat Loss</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  HIIT / LISS 15-20 Menit untuk memaksimalkan pembakaran kalori.
                </p>
              </div>
            </div>
            
            <button className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Tandai Selesai
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
