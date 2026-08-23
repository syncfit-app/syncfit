// src/App.tsx
import React, { useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Compass, 
  Utensils, 
  Trophy, 
  Timer, 
  User, 
  CheckCircle2, 
  TrendingUp, 
  Play, 
  ChevronRight,
  Zap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'workout' | 'gps' | 'nutrition' | 'profile'>('home');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] font-sans antialiased selection:bg-[#FF5E00] selection:text-white">
      {/* Top Glassmorphism Navigation Header */}
      <header className="sticky top-0 z-50 h-[60px] bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SyncFit" className="h-8 w-auto object-contain" />
          <span className="font-extrabold text-xl tracking-tight uppercase hidden sm:inline-block">
            SYNC<span className="text-[#FF5E00]">FIT</span>
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`transition-colors hover:text-[#FF5E00] ${activeTab === 'home' ? 'text-[#FF5E00] border-b-2 border-[#FF5E00] py-4' : 'text-[#111111]'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('workout')} 
            className={`transition-colors hover:text-[#FF5E00] ${activeTab === 'workout' ? 'text-[#FF5E00] border-b-2 border-[#FF5E00] py-4' : 'text-[#111111]'}`}
          >
            Workout
          </button>
          <button 
            onClick={() => setActiveTab('gps')} 
            className={`transition-colors hover:text-[#FF5E00] ${activeTab === 'gps' ? 'text-[#FF5E00] border-b-2 border-[#FF5E00] py-4' : 'text-[#111111]'}`}
          >
            GPS Track
          </button>
          <button 
            onClick={() => setActiveTab('nutrition')} 
            className={`transition-colors hover:text-[#FF5E00] ${activeTab === 'nutrition' ? 'text-[#FF5E00] border-b-2 border-[#FF5E00] py-4' : 'text-[#111111]'}`}
          >
            Nutrition
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#F5F5F5] transition-colors" aria-label="Profile">
            <User className="w-5 h-5 text-[#111111]" />
          </button>
        </div>
      </header>

      {/* Main Container - 3 Column Layout on Desktop */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 md:pb-8">
        
        {/* Left Column: Main Feed / Active Dashboard (Col 1-8) */}
        <section className="lg:col-span-8 space-y-8">
          
          {/* Hero Banner - Kinetic Display Typography */}
          <div className="relative overflow-hidden bg-[#111111] text-white p-8 md:p-12 rounded-[20px] flex flex-col justify-between min-h-[260px]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF006B]/30 to-[#FF5E00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 bg-white/10 text-[#FF5E00] backdrop-blur-sm rounded-full">
                DAY 12 • HYPERTROPHY CYCLE
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight leading-[0.95] text-white">
                NO SHORTCUTS.<br />JUST REPETITIONS.
              </h1>
              <p className="text-sm text-[#CACACB] font-normal pt-1">
                Program latihan deterministik hari ini telah disesuaikan dengan target hipertrofi tubuh Anda.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex flex-wrap items-center gap-4">
              <button className="bg-gradient-to-r from-[#FF5E00] to-[#FF006B] text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:opacity-95 transition-all shadow-md active:scale-95 flex items-center gap-2">
                <Play className="w-4 h-4 fill-white" /> MULAI SIKLUS HARI INI
              </button>
              <button className="bg-transparent border border-[#CACACB] text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/10 transition-colors">
                LIHAT PROGRAM
              </button>
            </div>
          </div>

          {/* Metrics Grid - Mono Typography */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[#707072] text-xs font-semibold uppercase">
                <span>Kalori Aktif</span>
                <Flame className="w-4 h-4 text-[#FF5E00]" />
              </div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-[#111111] mt-2">
                640 <span className="text-xs font-sans font-medium text-[#707072]">KCAL</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[#707072] text-xs font-semibold uppercase">
                <span>Total Durasi</span>
                <Timer className="w-4 h-4 text-[#FF5E00]" />
              </div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-[#111111] mt-2">
                48 <span className="text-xs font-sans font-medium text-[#707072]">MIN</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[#707072] text-xs font-semibold uppercase">
                <span>Jarak GPS</span>
                <Compass className="w-4 h-4 text-[#FF5E00]" />
              </div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-[#111111] mt-2">
                5.2 <span className="text-xs font-sans font-medium text-[#707072]">KM</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[20px] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[#707072] text-xs font-semibold uppercase">
                <span>Streak</span>
                <Zap className="w-4 h-4 text-[#FF006B]" />
              </div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-[#111111] mt-2">
                8 <span className="text-xs font-sans font-medium text-[#707072]">HARI</span>
              </div>
            </div>
          </div>

          {/* Exercise Preview Section (Edge-to-Edge Media Card) */}
          <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#FF5E00]" /> SESI LATIHAN UTAMA
              </h2>
              <span className="text-xs font-semibold text-[#707072] uppercase">4 Gerakan • ~45 Menit</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#F5F5F5] rounded-[12px] overflow-hidden group cursor-pointer border border-transparent hover:border-[#CACACB] transition-all">
                <div className="h-40 bg-[#111111] relative overflow-hidden flex items-center justify-center">
                  <span className="text-xs font-mono text-[#707072] uppercase">[ Exercise Demo Asset ]</span>
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-xs font-semibold text-[#FF5E00] uppercase">Dada & Tricep</div>
                  <div className="font-semibold text-base text-[#111111]">Barbell Bench Press</div>
                  <div className="font-mono text-xs text-[#707072]">4 SETS × 8-10 REPS (RIR 2)</div>
                </div>
              </div>

              <div className="bg-[#F5F5F5] rounded-[12px] overflow-hidden group cursor-pointer border border-transparent hover:border-[#CACACB] transition-all">
                <div className="h-40 bg-[#111111] relative overflow-hidden flex items-center justify-center">
                  <span className="text-xs font-mono text-[#707072] uppercase">[ Exercise Demo Asset ]</span>
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-xs font-semibold text-[#FF5E00] uppercase">Bahu Utama</div>
                  <div className="font-semibold text-base text-[#111111]">Overhead Military Press</div>
                  <div className="font-mono text-xs text-[#707072]">3 SETS × 10 REPS (RIR 2)</div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Right Column: Quick Stats, Nutrition & Challenges (Col 9-12) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Daily Challenge Panel */}
          <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FF006B]" /> TANTANGAN HARIAN
              </h3>
              <span className="text-xs font-mono font-semibold text-[#FF006B] bg-[#FF006B]/10 px-2 py-0.5 rounded-full">+150 XP</span>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3 bg-[#F5F5F5] rounded-[12px]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span className="text-xs font-medium">Lakukan 40 Push-Up</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#10B981]">SELESAI</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F5F5] rounded-[12px]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#CACACB]" />
                  <span className="text-xs font-medium">Minum Air 3 Liter</span>
                </div>
                <span className="text-xs font-mono text-[#707072]">2/3 L</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F5F5] rounded-[12px]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#CACACB]" />
                  <span className="text-xs font-medium">Lari / Jalan 3 KM</span>
                </div>
                <span className="text-xs font-mono text-[#707072]">0/3 KM</span>
              </div>
            </div>
          </div>

          {/* Nutrition Summary Panel */}
          <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#FF5E00]" /> MAKRONUTRISI
              </h3>
              <button className="text-xs font-semibold text-[#FF5E00] flex items-center gap-1 hover:underline">
                DETAIL <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>PROTEIN</span>
                  <span className="font-mono">120g / 160g</span>
                </div>
                <div className="h-2 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF006B] rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>KARBOHIDRAT</span>
                  <span className="font-mono">180g / 220g</span>
                </div>
                <div className="h-2 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5E00] rounded-full" style={{ width: '81%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>LEMAK</span>
                  <span className="font-mono">45g / 60g</span>
                </div>
                <div className="h-2 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0284C7] rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>

        </aside>
      </main>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E2E8F0] px-4 flex items-center justify-around z-50">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-[#FF5E00]' : 'text-[#707072]'}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase">Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('workout')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'workout' ? 'text-[#FF5E00]' : 'text-[#707072]'}`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase">Workout</span>
        </button>

        <button 
          onClick={() => setActiveTab('gps')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'gps' ? 'text-[#FF5E00]' : 'text-[#707072]'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase">GPS</span>
        </button>

        <button 
          onClick={() => setActiveTab('nutrition')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'nutrition' ? 'text-[#FF5E00]' : 'text-[#707072]'}`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase">Nutrition</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')} 
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-[#FF5E00]' : 'text-[#707072]'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase">Profile</span>
        </button>
      </div>
    </div>
  );
}
