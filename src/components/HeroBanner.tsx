// src/components/HeroBanner.tsx
import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="bg-[#111111] text-white p-6 md:p-8 rounded-none md:rounded-xl border-2 border-[#111111] relative overflow-hidden">
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5E00] text-black text-xs font-black uppercase tracking-wider mb-4">
          <Flame className="w-4 h-4 fill-black" />
          <span>Program Harian</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase leading-none mb-3">
          PUSHKAN <span className="text-[#FF5E00]">BATASMU</span>
        </h1>
        
        <p className="text-sm md:text-base text-[#A3A3A3] font-medium mb-6">
          Selesaikan 45 menit latihan Full Body Strength hari ini untuk menjaga rentetan skor harian Anda.
        </p>

        <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5E00] hover:bg-[#E05300] text-black font-extrabold text-xs uppercase tracking-wider transition-all">
          <span>Mulai Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle Background Accent */}
      <div className="absolute right-[-20px] bottom-[-20px] text-[#222222] font-black text-9xl select-none pointer-events-none opacity-40">
        FIT
      </div>
    </div>
  );
};

export default HeroBanner;
