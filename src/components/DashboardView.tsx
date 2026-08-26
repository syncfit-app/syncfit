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
  Zap
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  // DATA DUMMY (Akan dihubungkan ke Supabase & Logic SFit)
  const mockUser = { name: 'Coach Surya' };
  const mockStreak = 6;
  const days = [
    { day: 'M', date: '24', isToday: false },
    { day: 'S', date: '25', isToday: false },
    { day: 'S', date: '26', isToday: true },
    { day: 'R', date: '27', isToday: false },
    { day: 'K', date: '28', isToday: false },
    { day: 'J', date: '29', isToday: false },
    { day: 'S', date: '30', isToday: false },
  ];

  return (
    <div className="space-y-5 pb-12 max-w-md mx-auto">
      {/* 1. HEADER (Profil, Menyapa & Notifikasi) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-extrabold text-slate-700">
            {mockUser.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Selamat pagi!</p>
            <h1 className="text-lg font-extrabold text-slate-900">{mockUser.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-slate-600 hover:bg-slate-50">
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-slate-600 hover:bg-slate-50 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* 2. HERO BANNER (Progres Mingguan & Streak Progress Ring) */}
      <div className="bg-[#E2F773] p-5 rounded-[28px] flex items-center justify-between shadow-sm border border-[#D2EB5E]/50 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 mb-1">
            <Zap className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
            <span>Target Harian</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
            Progres Mingguan <br /> Anda
          </h2>
        </div>

        {/* Ring Statistik Streak */}
        <div className="relative w-20 h-20 flex items-center justify-center z-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="32" stroke="#C3E44B" strokeWidth="8" fill="transparent" />
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="#84CC16"
              strokeWidth="8"
              strokeDasharray={200}
              strokeDashoffset={50}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute text-center">
            <span className="block font-black text-slate-900 text-lg leading-none">{mockStreak}</span>
            <span className="text-[10px] font-bold text-slate-700">Hari</span>
          </div>
        </div>
      </div>

      {/* 3. METRIK RAPI (Langkah & Air Minum) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Langkah Kaki</p>
            <p className="text-lg font-black text-slate-900 mt-1">
              5.500 <span className="text-xs font-normal text-slate-400">langkah</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <Footprints className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Air Minum</p>
            <p className="text-lg font-black text-slate-900 mt-1">
              12 <span className="text-xs font-normal text-slate-400">gelas</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-500">
            <Droplets className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. STRIP TANGGAL KALENDER */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Agustus 2026</h3>
          <div className="flex gap-1">
            <button className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((item, idx) => (
            <div
              key={idx}
              className={`py-2 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                item.isToday
                  ? 'bg-[#E2F773] text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-medium mb-1">{item.day}</span>
              <span>{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. KARTU LATIHAN & LOG MAKANAN */}
      <div className="space-y-3">
        {/* Jadwal Latihan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Latihan Hari Ini</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Upper Body A • 60 Mins</p>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold hover:bg-[#E2F773] transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Makan Pagi */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Makan Pagi</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">456 - 512 kcal</p>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold hover:bg-[#E2F773] transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Makan Siang */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Makan Siang</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">550 - 650 kcal</p>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold hover:bg-[#E2F773] transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
