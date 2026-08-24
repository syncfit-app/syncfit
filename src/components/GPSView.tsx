// src/components/GPSView.tsx
import React from 'react';
import { MapPin, Play, Activity, Flame, Navigation, Clock } from 'lucide-react';

export const GPSView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#111827] to-[#1A1A1A] p-6 md:p-8 rounded-2xl shadow-lg border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF5E00]/20 text-[#FF5E00] rounded-full text-xs font-bold uppercase tracking-wider border border-[#FF5E00]/30 mb-3">
              <Navigation className="w-3.5 h-3.5" />
              Real-Time Outdoor Tracking
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Siap untuk <span className="text-[#FF5E00]">Lari Hari Ini?</span>
            </h1>
            <p className="text-xs text-gray-400 mt-2 max-w-sm">
              Aktifkan GPS untuk mencatat rute, kecepatan rata-rata, dan elevasi secara akurat.
            </p>
          </div>
          
          {/* Perbaikan Typo di sini */}
          <button className="px-6 py-3 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(255,94,0,0.39)] w-full md:w-auto">
            <Play className="w-4 h-4 fill-current" />
            <span>MULAI JOG / LARI</span>
          </button>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-48 md:h-64 bg-[#1F2937] rounded-xl border border-gray-700/50 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4B5563_1px,transparent_1px)] [background-size:16px_16px]" />
          <MapPin className="w-8 h-8 text-[#FF5E00] mb-2 animate-bounce relative z-10" />
          <p className="text-sm font-semibold text-white relative z-10">Peta Satelit Siap</p>
          <p className="text-xs text-gray-400 mt-1 relative z-10">Tekan tombol mulai untuk mengaktifkan lokasimu</p>
        </div>
      </div>

      {/* GPS Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Jarak Bulan Ini', value: '38.4', unit: 'km', icon: Navigation, color: 'text-[#FF5E00]' },
          { label: 'Pace Rata-Rata', value: '5\'24"', unit: '/km', icon: Clock, color: 'text-[#FF5E00]' },
          { label: 'Kalori Outdoor', value: '2,450', unit: 'kcal', icon: Flame, color: 'text-[#FF5E00]' },
          { label: 'Total Elevasi', value: '142', unit: 'm', icon: MapPin, color: 'text-[#FF5E00]' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-[#F1F5F9] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] w-2/3">
                {stat.label}
              </p>
              <stat.icon className={`w-4 h-4 ${stat.color} opacity-80`} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#111827] tracking-tight">{stat.value}</span>
              <span className="text-xs font-semibold text-[#64748B]">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
