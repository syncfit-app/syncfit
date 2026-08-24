// src/components/HeroBanner.tsx
import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#1A1A1A] rounded-3xl p-8 relative overflow-hidden shadow-lg border border-gray-800/50">
      <div className="relative z-10 w-full md:w-2/3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF5E00]/10 rounded-full mb-4 border border-[#FF5E00]/20">
          <Flame className="w-4 h-4 text-[#FF5E00]" />
          <span className="text-xs font-bold text-[#FF5E00] uppercase tracking-wider">
            Program Harian
          </span>
        </div>
        
        {/* Teks diubah menjadi kapital semua sesuai permintaan */}
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight uppercase">
          PUSHKAN <span className="text-[#FF5E00]">BATASMU</span>
        </h2>
        
        <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed max-w-md">
          Selesaikan 45 menit latihan Full Body Strength hari ini untuk menjaga rentetan skor harian Anda.
        </p>
        <button className="bg-[#FF5E00] hover:bg-[#E05300] text-white px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(255,94,0,0.39)]">
          Mulai Sekarang
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Dekorasi Background */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
        <h1 className="text-[12rem] font-black text-white leading-none tracking-tighter">FIT</h1>
      </div>
    </div>
  );
};
