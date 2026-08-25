// src/components/GPSView.tsx
import React, { useState, useEffect } from 'react';
import { MapPin, Play, Flame, Navigation, Clock, Square } from 'lucide-react';

export const GPSView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Efek untuk menjalankan countdown 3, 2, 1, GO
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => {
        setCountdown(null);
        setIsRunning(true); // Mulai status berlari setelah GO! hilang
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleStartRun = () => {
    setCountdown(3);
  };

  const handleStopRun = () => {
    setIsRunning(false);
  };

  return (
    <div className="pt-0 pb-8 md:pt-6 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Layar Hitung Mundur (Fullscreen Overlay) */}
      {countdown !== null && (
        <div className="fixed inset-0 z-[100] bg-[#FF5E00] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <p className="text-white text-8xl md:text-[150px] font-black tracking-tighter animate-bounce">
            {countdown > 0 ? countdown : 'GO!'}
          </p>
          <p className="text-white/80 font-bold tracking-widest mt-4">BERSIAPLAH...</p>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-6 md:p-8 rounded-2xl border shadow-sm transition-colors duration-500 ${isRunning ? 'bg-[#FF5E00] border-[#FF5E00]' : 'bg-[#111111] border-[#E2E8F0]'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${isRunning ? 'bg-white/20 text-white' : 'bg-[#FF5E00]/10 text-[#FF5E00]'}`}>
              <Navigation className="w-3.5 h-3.5" />
              {isRunning ? 'GPS Sedang Merekam' : 'Real-Time Outdoor Tracking'}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase">
              {isRunning ? 'Anda Sedang Lari!' : <>Siap untuk <span className="text-[#FF5E00]">Lari Hari Ini?</span></>}
            </h1>
            <p className={`text-sm mt-2 max-w-sm font-medium ${isRunning ? 'text-white/80' : 'text-gray-400'}`}>
              {isRunning ? 'Terus bergerak, pantang menyerah. Kami mencatat rute Anda.' : 'Aktifkan GPS untuk mencatat rute, kecepatan rata-rata, dan elevasi.'}
            </p>
          </div>
          
          {/* Toggle Tombol Play / Stop */}
          {!isRunning ? (
            <button 
              onClick={handleStartRun}
              className="px-8 py-3.5 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition-all w-full md:w-auto shrink-0 shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>MULAI JOG / LARI</span>
            </button>
          ) : (
            <button 
              onClick={handleStopRun}
              className="px-8 py-3.5 bg-[#111111] hover:bg-[#222222] text-white rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition-all w-full md:w-auto shrink-0 shadow-sm"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>HENTIKAN LARI</span>
            </button>
          )}
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-48 md:h-64 bg-[#F5F5F5] rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#CACACB_1px,transparent_1px)] [background-size:16px_16px]" />
          <MapPin className={`w-8 h-8 mb-2 relative z-10 ${isRunning ? 'text-[#10B981] animate-pulse' : 'text-[#FF5E00] animate-bounce'}`} />
          <p className="text-sm font-bold text-[#111111] relative z-10">
            {isRunning ? 'Merekam Rute...' : 'Peta Satelit Siap'}
          </p>
          <p className="text-xs text-[#64748B] mt-1 relative z-10 font-medium">
            {isRunning ? 'Akurasi GPS: Tinggi (±3 meter)' : 'Tekan tombol mulai untuk mengaktifkan lokasimu'}
          </p>
        </div>
      </div>

      {/* GPS Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Jarak Bulan Ini', value: isRunning ? '38.6' : '38.4', unit: 'km', icon: Navigation, color: 'text-[#FF5E00]' },
          { label: 'Pace Rata-Rata', value: isRunning ? '5\'12"' : '5\'24"', unit: '/km', icon: Clock, color: 'text-[#FF5E00]' },
          { label: 'Kalori Outdoor', value: isRunning ? '2,465' : '2,450', unit: 'kcal', icon: Flame, color: 'text-[#FF5E00]' },
          { label: 'Total Elevasi', value: isRunning ? '145' : '142', unit: 'm', icon: MapPin, color: 'text-[#FF5E00]' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] w-2/3">
                {stat.label}
              </p>
              <stat.icon className={`w-4 h-4 ${stat.color} ${isRunning && idx === 0 ? 'animate-spin-slow' : ''}`} />
            </div>
            <div className="flex items-baseline gap-1">
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
