// src/components/HeroBanner.tsx
import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] text-white p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-[10px] font-bold uppercase tracking-wider mb-5 border border-white/10">
          <Flame className="w-3.5 h-3.5 text-[#FF5E00]" />
          <span>Program Harian</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          Pushkan <span className="text-[#FF5E00]">Batasmu</span>
        </h1>
        
        <p className="text-sm md:text-base text-[#9CA3AF] mb-8 leading-relaxed max-w-md">
          Selesaikan 45 menit latihan Full Body Strength hari ini untuk menjaga rentetan skor harian Anda.
        </p>

        <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_0_rgba(255,94,0,0.39)]">
          <span>Mulai Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modern Background Accent */}
      <div className="absolute right-[-10%] bottom-[-20%] text-white/5 font-black text-[150px] md:text-[200px] select-none pointer-events-none leading-none tracking-tighter">
        FIT
      </div>
      
      {/* Subtle Glow */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-[#FF5E00]/10 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
};

export default HeroBanner;
