// src/components/DashboardView.tsx
import React from 'react';
import {
  Bell,
  Calendar as CalendarIcon,
  Footprints,
  Droplets,
  Plus,
  ChevronLeft,
  ChevronRight,
  Flame,
  Dumbbell,
  Utensils,
  Zap,
  Clock,
  Activity,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  // DATA DUMMY (Sesuai Workout & Meal Logic SFit)
  const mockUser = { name: 'Coach Surya', streak: 6 };
  const mockWorkout = {
    title: 'Upper Body A',
    week: 'Minggu 2',
    duration: '60 Mins',
    goal: 'Hypertrophy',
  };
  const mockNutrition = {
    calories: { current: 1650, target: 2100 },
    protein: { current: 120, target: 160 },
    carbs: { current: 150, target: 250 },
    fats: { current: 40, target: 60 }
  };

  const days = [
    { day: 'M', date: '24', isToday: false },
    { day: 'S', date: '25', isToday: false },
    { day: 'S', date: '26', isToday: true },
    { day: 'R', date: '27', isToday: false },
    { day: 'K', date: '28', isToday: false },
    { day: 'J', date: '29', isToday: false },
    { day: 'S', date: '30', isToday: false },
  ];

  const calcProgress = (current: number, target: number) => 
    Math.min((current / target) * 100, 100);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* 1. HEADER UTAMA (Profil, Menyapa & Notifikasi) */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#111827] text-white overflow-hidden border-2 border-[#FF5E00] shadow-sm flex items-center justify-center font-extrabold text-lg">
            {mockUser.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Selamat pagi,</p>
            <h1 className="text-xl font-extrabold text-[#111827]">{mockUser.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-slate-600 hover:bg-slate-100 transition-colors">
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-slate-600 hover:bg-slate-100 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#FF5E00] rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* 2. GRID UTAMA (RESPONSIF: Mobile 1 Kolom, Desktop 3 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI / UTAMA (2 Kolom di Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Banner Identitas SyncFit */}
          <div className="bg-[#111827] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden flex items-center justify-between border border-slate-800">
            {/* Ambient Background Accent */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#FF5E00]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 z-10">
              <div className="inline-flex items-center gap-1.5 bg-[#FF5E00]/10 border border-[#FF5E00]/30 px-3 py-1 rounded-full text-xs font-bold text-[#FF5E00]">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Target Harian</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Progres Konsistensi <br className="hidden sm:block" /> Mingguan Anda
              </h2>
              <p className="text-xs text-slate-400 font-medium">Pertahankan api streak untuk mencapai target ideal!</p>
            </div>

            {/* Streak Indicator Ring */}
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center z-10 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="#1F2937" strokeWidth="8" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#FF5E00"
                  strokeWidth="8"
                  strokeDasharray={240}
                  strokeDashoffset={60}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <div className="flex items-center gap-0.5 text-[#FF5E00]">
                  <Flame className="w-4 h-4 fill-current" />
                  <span className="font-black text-xl text-white leading-none">{mockUser.streak}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">Hari</span>
              </div>
            </div>
          </div>

          {/* Kartu Latihan Utama (Workout Logic Integration) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-[#111827] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg">
                Jadwal Hari Ini • {mockWorkout.week}
              </span>
              <span className="text-xs font-bold text-[#FF5E00] flex items-center gap-1 cursor-pointer hover:underline">
                Lihat Semua Split <ChevronRightIcon className="w-4 h-4" />
              </span>
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

          {/* Sesi Catatan Makanan */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-[#111827] text-base px-1">Log Makanan Hari Ini</h3>
            
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#111827] text-sm">Makan Pagi</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">456 - 512 kcal • Porsi Rekomendasi</p>
                </div>
              </div>
              <button className="w-9 h-9 rounded-full bg-slate-100 text-[#111827] flex items-center justify-center font-bold hover:bg-[#FF5E00] hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-[#FF5E00] flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#111827] text-sm">Makan Siang</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">550 - 650 kcal • Porsi Rekomendasi</p>
                </div>
              </div>
              <button className="w-9 h-9 rounded-full bg-slate-100 text-[#111827] flex items-center justify-center font-bold hover:bg-[#FF5E00] hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN / SIDEBAR (1 Kolom di Desktop) */}
        <div className="space-y-6">

          {/* Kartu Nutrisi & Makro Lengkap (Meal Logic Integration) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#FF5E00]" />
                Nutrisi & Makro
              </h3>
              <span className="text-xs font-bold text-slate-400">Target Harian</span>
            </div>

            {/* Total Kalori */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-3xl font-black text-[#111827]">{mockNutrition.calories.current}</span>
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
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
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
                <div className="flex justify-between text-xs font-bold mb-1">
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
                <div className="flex justify-between text-xs font-bold mb-1">
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

          {/* Tracker Langkah & Air Minum */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-[#FF5E00] flex items-center justify-center">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Langkah Kaki</p>
                <p className="text-base font-black text-[#111827]">5.500 <span className="text-[10px] font-normal text-slate-400">steps</span></p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Air Minum</p>
                <p className="text-base font-black text-[#111827]">12 <span className="text-[10px] font-normal text-slate-400">gelas</span></p>
              </div>
            </div>
          </div>

          {/* Kalender Strip */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#111827] text-sm">Agustus 2026</h3>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((item, idx) => (
                <div
                  key={idx}
                  className={`py-2 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    item.isToday
                      ? 'bg-[#FF5E00] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-[10px] font-medium mb-1 ${item.isToday ? 'text-white/80' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                  <span>{item.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
