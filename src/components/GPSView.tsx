// src/components/GPSView.tsx
import React from 'react';
import { MapPin, Play, Activity, Flame, Navigation, Clock } from 'lucide-react';

export const GPSView: React.FC = () => {
  return (
    <div className="pt-20 pb-24 md:pt-24 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6 bg-[#F8F9FA] min-h-screen">
      {/* Header Banner - Nike Black Aesthetic */}
      <div className="bg-[#111111] p-6 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF5E00]/10 text-[#FF5E00] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Navigation className="w-3.5 h-3.5" />
              Real-Time Outdoor Tracking
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase">
              Siap untuk <span className="text-[#FF5E00]">Lari Hari Ini?</span>
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-sm font-medium">
              Aktifkan GPS untuk mencatat rute, kecepatan rata-rata, dan elevasi secara akurat.
            </p>
          </div>
          
          {/* Primary CTA Gradient Pill */}
          <button className="px-8 py-3.5 bg-gradient-to-r from-[#FF5E00] to-[#FF006B] hover:opacity-90 text-white rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition-all w-full md:w-auto shrink-0">
            <Play className="w-4 h-4 fill-current" />
            <span>MULAI JOG / LARI</span>
          </button>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-48 md:h-64 bg-[#F5F5F5] rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#CACACB_1px,transparent_1px)] [background-size:16px_16px]" />
          <MapPin className="w-8 h-8 text-[#FF5E00] mb-2 animate-bounce relative z-10" />
          <p className="text-sm font-bold text-[#111111] relative z-10">Peta Satelit Siap</p>
          <p className="text-xs text-[#64748B] mt-1 relative z-10 font-medium">Tekan tombol mulai untuk mengaktifkan lokasimu</p>
        </div>
      </div>

      {/* GPS Stats Grid - Flat Elevation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Jarak Bulan Ini', value: '38.4', unit: 'km', icon: Navigation, color: 'text-[#FF5E00]' },
          { label: 'Pace Rata-Rata', value: '5\'24"', unit: '/km', icon: Clock, color: 'text-[#FF5E00]' },
          { label: 'Kalori Outdoor', value: '2,450', unit: 'kcal', icon: Flame, color: 'text-[#FF5E00]' },
          { label: 'Total Elevasi', value: '142', unit: 'm', icon: MapPin, color: 'text-[#FF5E00]' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] w-2/3">
                {stat.label}
              </p>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-1">
              {/* Font Mono untuk metrik angka */}
              <span className="text-2xl font-bold text-[#111111] tracking-tight font-mono">{stat.value}</span>
              <span className="text-xs font-semibold text-[#64748B]">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GPSView;
