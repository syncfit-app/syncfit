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
      bgIcon: 'bg-[#FF5E00]/10',
      subtext: '75% dari target 650 kcal',
    },
    {
      title: 'Durasi Aktif',
      value: '42',
      unit: 'menit',
      icon: Activity,
      color: 'text-[#111111]',
      bgIcon: 'bg-gray-100',
      subtext: 'Target harian 60 menit',
    },
    {
      title: 'Heart Rate Avg',
      value: '128',
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500',
      bgIcon: 'bg-red-50',
      subtext: 'Zona aerobik optimal',
    },
    {
      title: 'Sesi Latihan',
      value: '5',
      unit: 'sesi',
      icon: Trophy,
      color: 'text-[#FF5E00]',
      bgIcon: 'bg-[#FF5E00]/10',
      subtext: '+2 sesi minggu ini',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                {metric.title}
              </span>
              <div className={`p-2 rounded-xl ${metric.bgIcon}`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold text-[#111827] tracking-tight">{metric.value}</span>
              <span className="text-xs font-medium text-[#64748B]">{metric.unit}</span>
            </div>

            <p className="text-[11px] font-medium text-[#94A3B8] mt-2">
              {metric.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
