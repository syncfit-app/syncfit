// src/components/DashboardView.tsx
import React from 'react';
import { Flame, Dumbbell, Utensils, ChevronRight, Activity, Clock } from 'lucide-react';

export const DashboardView: React.FC = () => {
  // DATA DUMMY STATIS (Sesuai dengan Workout & Meal Template Logic)
  const mockUser = { name: 'Warrior', streak: 5 };
  const mockWorkout = {
    title: 'Upper Body A',
    week: 'Minggu 2',
    duration: '60 Menit',
    goal: 'Hypertrophy',
    status: 'pending' // 'pending' atau 'completed'
  };
  const mockNutrition = {
    calories: { current: 1650, target: 2100 },
    protein: { current: 120, target: 160 }, // dalam gram
    carbs: { current: 150, target: 250 },   // dalam gram
    fats: { current: 40, target: 60 }       // dalam gram
  };

  // Fungsi bantuan untuk menghitung persentase progress bar
  const calcProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. SECTION WELCOME & STREAK */}
      <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111827]">Halo, {mockUser.name}!</h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">Siap untuk menghancurkan target hari ini?</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#FF5E00]/10 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-1 text-[#FF5E00]">
            <Flame className="w-5 h-5 fill-current" />
            <span className="font-black text-xl">{mockUser.streak}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5E00]">Hari Streak</span>
        </div>
      </div>

      {/* 2. SECTION WORKOUT HARI INI */}
      <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute -right-10 -top-10 text-[#F8FAFC]">
          <Dumbbell className="w-48 h-48 transform rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
              Jadwal Latihan
            </span>
            <span className="text-xs font-bold text-[#64748B]">{mockWorkout.week}</span>
          </div>
          
          <h2 className="text-3xl font-black text-[#111827] mb-2">{mockWorkout.title}</h2>
          
          <div className="flex items-center gap-4 text-sm font-semibold text-[#64748B] mb-6">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{mockWorkout.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>{mockWorkout.goal}</span>
            </div>
          </div>

          <button className="w-full sm:w-auto bg-[#FF5E00] hover:bg-[#E05300] text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Dumbbell className="w-5 h-5" />
            <span>Mulai Latihan</span>
          </button>
        </div>
      </div>

      {/* 3. SECTION RINGKASAN NUTRISI (Dengan Makro) */}
      <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#111827] text-lg flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#FF5E00]" />
            Nutrisi Harian
          </h3>
          <button className="text-xs font-bold text-[#FF5E00] flex items-center hover:underline">
            Detail <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Kalori Utama */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-black text-[#111827]">{mockNutrition.calories.current}</span>
              <span className="text-sm font-bold text-[#64748B] ml-1">/ {mockNutrition.calories.target} kcal</span>
            </div>
          </div>
          <div className="w-full bg-[#F1F5F9] rounded-full h-3">
            <div 
              className="bg-[#111111] h-3 rounded-full transition-all duration-500"
              style={{ width: `${calcProgress(mockNutrition.calories.current, mockNutrition.calories.target)}%` }}
            />
          </div>
        </div>

        {/* Makronutrisi (Protein, Carbs, Fats) */}
        <div className="grid grid-cols-3 gap-4">
          {/* Protein */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#64748B]">Protein</span>
              <span className="text-[#111827]">{mockNutrition.protein.current}g</span>
            </div>
            <div className="w-full bg-[#F1F5F9] rounded-full h-2">
              <div 
                className="bg-[#3B82F6] h-2 rounded-full transition-all duration-500"
                style={{ width: `${calcProgress(mockNutrition.protein.current, mockNutrition.protein.target)}%` }}
              />
            </div>
          </div>
          {/* Karbohidrat */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#64748B]">Karbo</span>
              <span className="text-[#111827]">{mockNutrition.carbs.current}g</span>
            </div>
            <div className="w-full bg-[#F1F5F9] rounded-full h-2">
              <div 
                className="bg-[#10B981] h-2 rounded-full transition-all duration-500"
                style={{ width: `${calcProgress(mockNutrition.carbs.current, mockNutrition.carbs.target)}%` }}
              />
            </div>
          </div>
          {/* Lemak */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#64748B]">Lemak</span>
              <span className="text-[#111827]">{mockNutrition.fats.current}g</span>
            </div>
            <div className="w-full bg-[#F1F5F9] rounded-full h-2">
              <div 
                className="bg-[#F59E0B] h-2 rounded-full transition-all duration-500"
                style={{ width: `${calcProgress(mockNutrition.fats.current, mockNutrition.fats.target)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
