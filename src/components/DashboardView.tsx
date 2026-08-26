// src/components/DashboardView.tsx
import React from 'react';
import {
  Flame,
  Dumbbell,
  Utensils,
  Zap,
  Clock,
  Activity,
  ChevronRight as ChevronRightIcon,
  Target,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();

  // DATA DUMMY (Sesuai Workout & Meal Logic SFit)
  const mockUser = { streak: 6 };
  const mockWorkout = {
    title: 'Upper Body A',
    week: 'Minggu 2',
    duration: '60 Mins',
    goal: 'Hypertrophy',
  };
  const mockChallenge = {
    title: 'Minum 2 Liter Air Hari Ini',
    reward: '+10 Poin Konsistensi'
  };
  const mockNutrition = {
    calories: { current: 1650, target: 2100 },
    protein: { current: 120, target: 160 },
    carbs: { current: 150, target: 250 },
    fats: { current: 40, target: 60 }
  };

  const calcProgress = (current: number, target: number) => 
    Math.min((current / target) * 100, 100);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-8 pt-0">
      
      {/* GRID UTAMA (RESPONSIF: Mobile 1 Kolom, Desktop 3 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI / UTAMA (2 Kolom di Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Banner Identitas SyncFit (Streak) */}
          <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden flex items-center justify-between border border-slate-800">
            {/* Ambient Background Accent */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#FF5E00]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 z-10 max-w-[65%]">
              <div className="inline-flex items-center gap-1.5 bg-[#FF5E00]/10 border border-[#FF5E00]/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#FF5E00]">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Target Harian</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Progres Konsistensi <br className="hidden sm:block" /> Mingguan Anda
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Pertahankan api streak untuk mencapai target ideal!</p>
            </div>

            {/* Streak Indicator Ring - Posisi Teks Diperbaiki */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center z-10 shrink-0">
              {/* SVG Lingkaran absolut membungkus kontainer */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                <circle cx="50%" cy="50%" r="42%" stroke="#1F2937" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  stroke="#FF5E00"
                  strokeWidth="8"
                  strokeDasharray="260%"
                  strokeDashoffset="60%"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              {/* Teks Streak berada presisi di tengah */}
              <div className="relative flex flex-col items-center justify-center mt-1">
                <div className="flex items-center gap-0.5 text-[#FF5E00]">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  <span className="font-black text-2xl sm:text-3xl text-white leading-none tracking-tight">{mockUser.streak}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">Hari</span>
              </div>
            </div>
          </div>

          {/* Kartu Latihan Utama */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-[#111827] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg">
                Jadwal Hari Ini • {mockWorkout.week}
              </span>
              <button 
                onClick={() => navigate('/workout')}
                className="text-xs font-bold text-[#FF5E00] flex items-center gap-1 hover:underline"
              >
                Lihat Semua Split <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-2xl font-black text-[#111827] mb-2">{mockWorkout.title}</h3>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-6">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Clock className="w-4 h-4 text-slate-700" />
                <span>{mockWorkout.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Activity className="w-4 h-4 text-[#FF5E00]" />
                <span>Goal: {mockWorkout.goal}</span>
              </div>
            </div>

            <button className="w-full bg-[#FF5E00] hover:bg-[#E05300] text-white py-3.5 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
              <Dumbbell className="w-5 h-5" />
              <span>Mulai Sesi Latihan</span>
            </button>
          </div>

          {/* Kartu Tantangan Harian (Daily Challenge) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-500/10 text-[#FF5E00] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Tantangan Harian
              </span>
            </div>
            
            <h3 className="text-xl font-black text-[#111827] mb-1">{mockChallenge.title}</h3>
            <p className="text-xs text-slate-500 font-medium mb-5">{mockChallenge.reward}</p>
            
            <button className="w-full bg-slate-50 hover:bg-emerald-500 hover:text-white border border-slate-100 text-slate-700 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm group">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors" />
              <span>Tandai Selesai</span>
            </button>
          </div>

        </div>

        {/* KOLOM KANAN / SIDEBAR (1 Kolom di Desktop) */}
        <div className="space-y-6">

          {/* Kartu Nutrisi & Makro Lengkap */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#FF5E00]" />
                Nutrisi & Makro
              </h3>
              {/* Shortcut ke Tab Nutrisi */}
              <button 
                onClick={() => navigate('/nutrition')}
                className="text-[11px] font-bold text-white bg-[#111827] hover:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                Buka Nutrisi <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>

            {/* Total Kalori */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-4xl font-black text-[#111827]">{mockNutrition.calories.current}</span>
                  <span className="text-xs font-bold text-slate-400 ml-1">/ {mockNutrition.calories.target} kcal</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div 
                  className="bg-[#111827] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${calcProgress(mockNutrition.calories.current, mockNutrition.calories.target)}%` }}
                />
              </div>
            </div>

            {/* Rincian Makronutrisi (Protein, Carbs, Fats) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500">Protein</span>
                  <span className="text-[#111827]">{mockNutrition.protein.current} / {mockNutrition.protein.target}g</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calcProgress(mockNutrition.protein.current, mockNutrition.protein.target)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500">Karbohidrat</span>
                  <span className="text-[#111827]">{mockNutrition.carbs.current} / {mockNutrition.carbs.target}g</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calcProgress(mockNutrition.carbs.current, mockNutrition.carbs.target)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500">Lemak</span>
                  <span className="text-[#111827]">{mockNutrition.fats.current} / {mockNutrition.fats.target}g</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calcProgress(mockNutrition.fats.current, mockNutrition.fats.target)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
