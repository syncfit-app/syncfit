import React from 'react';
import { Flame, Timer, Compass, Zap } from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  return (
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
  );
};
