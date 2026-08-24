// src/components/MetricsGrid.tsx
import React from 'react';
import { Flame, Activity, Heart, Trophy } from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  const metrics = [
    {
      title: 'Kalori Terbakar',
      value: '485',
      unit: 'kcal',
      icon: Flame,
      color: 'text-[#FF5E00]',
      subtext: '75% dari target 650 kcal',
    },
    {
      title: 'Durasi Aktif',
      value: '42',
      unit: 'menit',
      icon: Activity,
      color: 'text-[#111111]',
      subtext: 'Target harian 60 menit',
    },
    {
      title: 'Detak Jantung Rata-Rata',
      value: '128',
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-600',
      subtext: 'Zona aerobik optimal',
    },
    {
      title: 'Sesi Latihan Minggu Ini',
      value: '5',
      unit: 'sesi',
      icon: Trophy,
      color: 'text-[#FF5E00]',
      subtext: '+2 sesi dibanding minggu lalu',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 border-2 border-[#111111] rounded-none md:rounded-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#707072]">
                {metric.title}
              </span>
              <Icon className={`w-5 h-5 ${metric.color}`} />
            </div>

            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl font-black text-[#111111]">{metric.value}</span>
              <span className="text-xs font-bold text-[#707072] uppercase">{metric.unit}</span>
            </div>

            <p className="text-[11px] font-semibold text-[#707072] mt-2 border-t border-[#E2E8F0] pt-2">
              {metric.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
