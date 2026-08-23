import React from 'react';
import { Play } from 'lucide-react';

interface HeroBannerProps {
  onStartWorkout: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onStartWorkout }) => {
  return (
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
        <button 
          onClick={onStartWorkout}
          className="bg-gradient-to-r from-[#FF5E00] to-[#FF006B] text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:opacity-95 transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" /> MULAI SIKLUS HARI INI
        </button>
        <button className="bg-transparent border border-[#CACACB] text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/10 transition-colors">
          LIHAT PROGRAM
        </button>
      </div>
    </div>
  );
};
