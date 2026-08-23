import React from 'react';
import { Flame, Dumbbell, Activity, Compass, Utensils, CheckCircle2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] font-sans antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="SyncFit Logo" 
              className="h-9 w-auto object-contain" 
            />
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">
              Sync<span className="text-[#FF5E00]">Fit</span>
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF5E00]/10 to-[#FF006B]/10 text-[#FF5E00] border border-[#FF5E00]/20">
            100% Gratis & Unlocked
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#FF5E00] to-[#FF006B] flex items-center justify-center text-white shadow-lg shadow-[#FF5E00]/20">
            <Flame className="w-6 h-6 stroke-[2.5]" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#0F172A]">Selamat Datang di SyncFit!</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sistem kebugaran deterministik & pelacak aktivitas outdoor siap digunakan.
            </p>
          </div>

          <button className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF5E00] to-[#FF006B] text-white font-semibold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Mulai Program Latihan
          </button>
        </div>

        {/* Quick Feature Grid Preview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
            <Activity className="w-5 h-5 text-[#FF5E00]" />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workout</div>
            <div className="text-sm font-semibold text-slate-800">Determinis Plan</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
            <Compass className="w-5 h-5 text-[#FF006B]" />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">GPS Track</div>
            <div className="text-sm font-semibold text-slate-800">Run & Ride</div>
          </div>
        </div>
      </main>
    </div>
  );
}
