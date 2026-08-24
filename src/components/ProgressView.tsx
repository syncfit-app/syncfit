// src/components/ProgressView.tsx
import React from 'react';
import { Trophy, TrendingUp, Scale, Calendar, Award } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const prs = [
    { exercise: 'Bench Press', record: '95 kg', date: '12 Aug 2026' },
    { exercise: 'Barbell Squat', record: '120 kg', date: '05 Aug 2026' },
    { exercise: 'Deadlift', record: '145 kg', date: '28 Jul 2026' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Progress Berat Badan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#FF5E00]/10 rounded-xl text-[#FF5E00]">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#64748B] font-semibold uppercase">Berat Badan Saat Ini</span>
            <p className="text-2xl font-bold text-[#111827]">72.5 <span className="text-xs font-normal text-[#64748B]">kg</span></p>
            <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> -1.2 kg bulan ini
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#64748B] font-semibold uppercase">Konsistensi Latihan</span>
            <p className="text-2xl font-bold text-[#111827]">18 <span className="text-xs font-normal text-[#64748B]">Hari</span></p>
            <span className="text-[11px] text-[#64748B]">Streak aktif bulan ini</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#64748B] font-semibold uppercase">Total Rekor (PR)</span>
            <p className="text-2xl font-bold text-[#111827]">12 <span className="text-xs font-normal text-[#64748B]">Pencapaian</span></p>
            <span className="text-[11px] text-yellow-600 font-medium">Top 5% pengguna</span>
          </div>
        </div>
      </div>

      {/* Rekor Pribadi (Personal Records Grid) */}
      <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#FF5E00]" />
          <h3 className="font-bold text-base text-[#111827]">Rekor Angkatan Pribadi (PR)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {prs.map((pr, idx) => (
            <div key={idx} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]/60">
              <p className="text-xs font-semibold text-[#64748B]">{pr.exercise}</p>
              <p className="text-2xl font-black text-[#111827] my-1">{pr.record}</p>
              <p className="text-[10px] text-[#94A3B8]">Tercapai pada {pr.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;
