// src/components/DailyChallengeCard.tsx
import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

export const DailyChallengeCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FF5E00]/10 rounded-xl">
            <Target className="w-5 h-5 text-[#FF5E00]" />
          </div>
          <h3 className="font-bold text-sm text-[#111827]">Tantangan Harian</h3>
        </div>
        <span className="text-[10px] font-bold bg-[#F1F5F9] text-[#475569] px-2.5 py-1 rounded-full uppercase tracking-wide">
          Hari 5
        </span>
      </div>

      <div className="space-y-5">
        <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]/60">
          <p className="text-sm font-semibold text-[#111827]">100 Push-Up Breakdown</p>
          <p className="text-xs text-[#64748B] mt-1">Bagi menjadi 4 set x 25 repetisi</p>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-2">
            <span className="text-[#64748B]">Progres</span>
            <span className="text-[#111827] font-semibold">75 / 100 Reps</span>
          </div>
          <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#FF5E00] h-full w-[75%] rounded-full transition-all duration-500 ease-out" />
          </div>
        </div>

        <button className="w-full py-3 bg-[#111827] hover:bg-[#1F2937] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#FF5E00]" />
          <span>Tandai Selesai</span>
        </button>
      </div>
    </div>
  );
};

export default DailyChallengeCard;
