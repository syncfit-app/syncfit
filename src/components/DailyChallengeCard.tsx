import React from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';

export const DailyChallengeCard: React.FC = () => {
  return (
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
  );
};
