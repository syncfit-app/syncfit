// src/components/DailyChallengeCard.tsx
import React from 'react';
import { Target, CheckCircle } from 'lucide-react';

export const DailyChallengeCard: React.FC = () => {
  return (
    <div className="bg-white p-6 border-2 border-[#111111] rounded-none md:rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#FF5E00]" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#111111]">
            Tantangan Harian
          </h3>
        </div>
        <span className="text-xs font-black bg-[#111111] text-white px-2 py-0.5 uppercase">
          Hari Ke-5
        </span>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-[#F5F5F5] border border-[#E2E8F0]">
          <p className="text-xs font-bold text-[#111111] uppercase">100 Push-Up Breakdown</p>
          <p className="text-[11px] text-[#707072] mt-0.5">Bagi menjadi 4 set x 25 repetisi</p>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-[#707072] uppercase">Progres</span>
            <span className="text-[#111111]">75 / 100 Reps</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-3 border border-[#111111]">
            <div className="bg-[#FF5E00] h-full w-[75%]" />
          </div>
        </div>

        <button className="w-full py-2.5 bg-[#111111] hover:bg-[#222222] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#FF5E00]" />
          <span>Tandai Selesai</span>
        </button>
      </div>
    </div>
  );
};

export default DailyChallengeCard;
