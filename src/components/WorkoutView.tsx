// src/components/WorkoutView.tsx
import React, { useState } from 'react';
import { Dumbbell, RotateCcw, Save, CheckCircle2, Video, ChevronDown, Sparkles } from 'lucide-react';

export const WorkoutView: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  const weeks = [
    { id: 1, title: 'W1: Pondasi', desc: 'Volume Baseline & Teknik' },
    { id: 2, title: 'W2: Volume Peak', desc: 'Penambahan Sets (+1 Set)' },
    { id: 3, title: 'W3: Intensity Peak', desc: 'RIR Dekat Failure (-1 RIR)' },
    { id: 4, title: 'W4: Deload', desc: 'Pemulihan Sendi (2 Sets)' },
  ];

  const days = [
    { id: 1, label: 'Hari 1 - Push Focus' },
    { id: 2, label: 'Hari 2 - Pull Focus' },
    { id: 3, label: 'Hari 3 - Leg Focus' },
    { id: 4, label: 'Hari 4 - Upper Body' },
    { id: 5, label: 'Hari 5 - Lower & Core' },
  ];

  const exercises = [
    { name: 'Barbell Bench Press', target: 'Chest', type: 'Compound', sets: '3 Sets', reps: '6-10 Reps', rir: 'RIR 1', completed: true },
    { name: 'Incline Dumbbell Press', target: 'Chest', type: 'Compound', sets: '3 Sets', reps: '6-10 Reps', rir: 'RIR 1', completed: true },
    { name: 'Standing Overhead Press', target: 'Shoulder', type: 'Compound', sets: '3 Sets', reps: '8-10 Reps', rir: 'RIR 1', completed: false },
    { name: 'Triceps Rope Pushdown', target: 'Tricep', type: 'Isolation', sets: '3 Sets', reps: '10-12 Reps', rir: 'RIR 0', completed: false },
    { name: 'Lateral Raise', target: 'Shoulder', type: 'Isolation', sets: '4 Sets', reps: '12-15 Reps', rir: 'RIR 0', completed: false },
  ];

  return (
    <div className="pt-0 pb-8 md:pt-6 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-4">
      
      {/* Active Program Header Banner */}
      <div className="bg-[#111111] text-white p-6 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF5E00] text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Program Aktif Berjalan
              </span>
              <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/20 uppercase tracking-wider">
                ✓ Cloud Sync
              </span>
            </div>

            <button className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-gray-800 hover:bg-gray-800">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Program</span>
            </button>
          </div>

          <div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
              Hypertrophy <span className="text-[#FF5E00]">• Full Gym</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">Disimpan: 23 Agu 2026</p>
          </div>

          {/* Progress Bar Solid (Tanpa Gradasi) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Hari Ini (W1 - Hari 1)</span>
                <span className="text-[#FF5E00] font-mono">40%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#FF5E00] h-full w-[40%] rounded-full transition-all duration-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Total Siklus 4 Minggu</span>
                <span className="text-gray-400 font-mono">5%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#CACACB] h-full w-[5%] rounded-full transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Configurator Card */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F5] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F5F5F5] rounded-xl">
              <Dumbbell className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#111111]">Konfigurator Latihan</h3>
              <p className="text-xs font-medium text-[#64748B]">Sesuaikan parameter dengan target Anda</p>
            </div>
          </div>
          {/* Tombol Solid (Tanpa Gradasi) */}
          <button className="px-6 py-2.5 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-full text-[13px] font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm">
            <Save className="w-4 h-4" />
            <span>Simpan Program Ini</span>
          </button>
        </div>

        {/* Form Selects */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'FITNESS GOAL', options: ['Hypertrophy (Muscular)', 'Strength Focus', 'Fat Loss'] },
            { label: 'PERALATAN', options: ['Full Gym Equipment', 'Dumbbell Only', 'Bodyweight'] },
            { label: 'EXPERIENCE LEVEL', options: ['Advanced', 'Intermediate', 'Beginner'] },
            { label: 'HARI / MINGGU', options: ['5 Hari / Minggu', '4 Hari / Minggu', '3 Hari / Minggu'] },
            { label: 'DURASI / SESI', options: ['75+ Menit (5 Gerakan)', '60 Menit (4 Gerakan)', '45 Menit (3 Gerakan)'] },
          ].map((field, idx) => (
            <div key={idx} className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                {field.label}
              </label>
              <div className="relative">
                <select className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs font-bold text-[#111111] appearance-none focus:outline-none focus:border-[#FF5E00] cursor-pointer pr-8">
                  {field.options.map((opt, oIdx) => (
                    <option key={oIdx}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Siklus Progresi Mingguan Tabs */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Siklus Progresi Mingguan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {weeks.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWeek(w.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedWeek === w.id
                  ? 'bg-[#111111] border-[#111111] text-white shadow-sm'
                  : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#111111] hover:bg-[#F5F5F5]'
              }`}
            >
              <p className="font-bold text-[13px]">{w.title}</p>
              <p className={`text-[11px] mt-0.5 font-medium ${selectedWeek === w.id ? 'text-gray-400' : 'text-[#64748B]'}`}>
                {w.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Pembagian Jadwal Split Harian */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Pembagian Jadwal Split Harian
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {days.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all border ${
                selectedDay === d.id
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#FFFFFF] text-[#64748B] border-[#E2E8F0] hover:bg-[#F5F5F5] hover:text-[#111111]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Latihan (Exercise Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#111111] uppercase tracking-tight">
              HARI {selectedDay} - PUSH FOCUS
            </h3>
            <p className="text-xs font-medium text-[#64748B]">Target: Chest, Shoulder, Tricep</p>
          </div>
          <span className="text-[10px] font-bold text-[#111111] bg-[#F5F5F5] px-3 py-1.5 rounded-full border border-[#E2E8F0] uppercase tracking-wider">
            5 GERAKAN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((item, idx) => (
            <div
              key={idx}
              className={`bg-[#FFFFFF] p-5 rounded-2xl border transition-all ${
                item.completed
                  ? 'border-[#10B981] bg-[#10B981]/5'
                  : 'border-[#E2E8F0] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-[#10B981] text-white' : 'bg-[#F5F5F5] text-[#CACACB]'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF5E00]/10 text-[#FF5E00]">
                        {item.target}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5F5F5] text-[#64748B]">
                        {item.type}
                      </span>
                    </div>
                    <h4 className="font-bold text-[15px] text-[#111111]">{item.name}</h4>
                  </div>
                </div>

                <button className="text-[#64748B] hover:text-[#111111] p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5 text-xs font-bold">
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">Demo</span>
                </button>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F5] text-[13px] font-bold font-mono">
                <span className="text-[#111111]">{item.sets}</span>
                <span className="text-[#CACACB]">•</span>
                <span className="text-[#111111]">{item.reps}</span>
                <span className="text-[#CACACB]">•</span>
                <span className="text-[#FF5E00] bg-[#FF5E00]/10 px-2 py-0.5 rounded-md text-xs">{item.rir}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutView;
