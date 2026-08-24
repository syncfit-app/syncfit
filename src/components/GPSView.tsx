// src/components/GPSView.tsx
import React from 'react';
import { Navigation, Play, Flame, Clock, MapPin, Compass } from 'lucide-react';

export const GPSView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Stat & Live Map Start Card */}
      <div className="bg-[#111827] text-white p-6 md:p-8 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5E00]/20 text-[#FF5E00] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-4 h-4" />
              <span>Real-Time Outdoor Tracking</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Siap untuk <span className="text-[#FF5E00]">Lari Hari Ini?</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-md">
              Aktifkan GPS untuk mencatat rute, kecepatan rata-rata, dan elevasi secara akurat.
            </p>
          </div>

          <button className="px-6 py-3.5 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-xl font-extrabold text-sm flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(255,94,0,0.39)]">
            <Play className="w-4 h-4 fill-white" />
            <span>MULAI AJS / LARI</span>
          </button>
        </div>

        {/* Placeholder Peta Visual */}
        <div className="mt-6 h-48 w-full bg-[#1F2937] rounded-xl border border-gray-700/60 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FF5E00_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="text-center z-10 p-4">
            <MapPin className="w-8 h-8 text-[#FF5E00] mx-auto mb-2 animate-bounce" />
            <p className="text-xs font-semibold text-gray-300">Peta Satelit Siap</p>
            <p className="text-[10px] text-gray-500">Tekan tombol mulai untuk mengaktifkan lokasimu</p>
          </div>
        </div>
      </div>

      {/* Ringkasan Performa GPS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Jarak Bulan Ini', value: '38.4', unit: 'km', icon: Navigation },
          { label: 'Pace Rata-Rata', value: "5'24\"", unit: '/km', icon: Clock },
          { label: 'Kalori Outdoor', value: '2,450', unit: 'kcal', icon: Flame },
          { label: 'Total Elevasi', value: '142', unit: 'm', icon: MapPin },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-[#F1F5F9] shadow-sm">
              <div className="flex items-center justify-between text-[#64748B] mb-2">
                <span className="text-xs font-semibold uppercase">{item.label}</span>
                <Icon className="w-4 h-4 text-[#FF5E00]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#111827]">{item.value}</span>
                <span className="text-xs text-[#64748B]">{item.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GPSView;
