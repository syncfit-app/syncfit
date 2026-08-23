import React from 'react';
import { Dumbbell } from 'lucide-react';

export const ExercisePreview: React.FC = () => {
  return (
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
  );
};
