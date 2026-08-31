// src/components/ProgressView.tsx
import React, { useState } from 'react';
import { Trophy, TrendingUp, Scale, Calendar, Award, Activity, Flame } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

// Mock Data untuk Grafik Working Progress (Kalori Terbakar)
const weeklyData = [
  { day: 'Sen', calories: 250, duration: 45 },
  { day: 'Sel', calories: 420, duration: 60 },
  { day: 'Rab', calories: 150, duration: 30 },
  { day: 'Kam', calories: 580, duration: 90 },
  { day: 'Jum', calories: 320, duration: 50 },
  { day: 'Sab', calories: 650, duration: 100 },
  { day: 'Min', calories: 0, duration: 0 },
];

const monthlyData = [
  { day: 'W1', calories: 1200, duration: 180 },
  { day: 'W2', calories: 2100, duration: 320 },
  { day: 'W3', calories: 1800, duration: 270 },
  { day: 'W4', calories: 2400, duration: 350 },
];

// Custom Tooltip agar desainnya bersih seperti referensi UI
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-1 outline-none">
        <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-black text-[#FF5E00] flex items-center gap-1">
          <Flame className="w-4 h-4" /> {payload[0].value} kcal
        </p>
        <p className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <Activity className="w-4 h-4" /> {payload[0].payload.duration} menit
        </p>
      </div>
    );
  }
  return null;
};

export const ProgressView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'Weekly' | 'Monthly'>('Weekly');

  const prs = [
    { exercise: 'Bench Press', record: '95 kg', date: '12 Aug 2026' },
    { exercise: 'Barbell Squat', record: '120 kg', date: '05 Aug 2026' },
    { exercise: 'Deadlift', record: '145 kg', date: '28 Jul 2026' },
  ];

  const chartData = timeRange === 'Weekly' ? weeklyData : monthlyData;

  // Mencari nilai tertinggi untuk menaruh garis vertikal (opsional, seperti di referensi)
  const maxCalorieIndex = chartData.reduce((maxIdx, current, idx, arr) => 
    current.calories > arr[maxIdx].calories ? idx : maxIdx, 0);

  return (
    <div className="pt-0 pb-20 md:pt-6 md:pb-12 px-4 md:px-8 max-w-5xl mx-auto space-y-6 font-sans animate-fade-in">
      
      {/* KARTU STATISTIK UTAMA (Style Clean & Soft Shadow) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Berat Badan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-orange-50 rounded-2xl text-[#FF5E00]">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Berat Badan</span>
            <p className="text-3xl font-black text-[#111827] tracking-tight mt-1">72.5 <span className="text-sm font-bold text-slate-400">kg</span></p>
            <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" /> -1.2 kg bulan ini
            </span>
          </div>
        </div>

        {/* Card 2: Konsistensi */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-500">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Konsistensi</span>
            <p className="text-3xl font-black text-[#111827] tracking-tight mt-1">18 <span className="text-sm font-bold text-slate-400">Hari</span></p>
            <span className="text-[11px] text-slate-500 font-bold mt-1 block">Streak aktif bulan ini</span>
          </div>
        </div>

        {/* Card 3: Rekor */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-500">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">Pencapaian (PR)</span>
            <p className="text-3xl font-black text-[#111827] tracking-tight mt-1">12 <span className="text-sm font-bold text-slate-400">Rekor</span></p>
            <span className="text-[11px] text-yellow-600 font-bold mt-1 block bg-yellow-50 w-fit px-2 py-0.5 rounded-md">Top 5% pengguna</span>
          </div>
        </div>
      </div>

      {/* GRAFIK: WORKING PROGRESS (Mengikuti Referensi UI) */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-xl text-[#111827]">Working Progress</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Kalori terbakar berdasarkan sesi latihan</p>
          </div>
          
          {/* Custom Select mirip referensi */}
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'Weekly' | 'Monthly')}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-100 text-[#FF5E00] font-extrabold text-xs py-2 pl-4 pr-8 rounded-xl outline-none cursor-pointer transition-colors"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#FF5E00]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Recharts Area */}
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5E00" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FF5E00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} 
                dy={15} 
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} 
                dx={-10}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF5E00', strokeWidth: 1, strokeDasharray: '4 4' }} />
              
              {/* Garis penunjuk nilai tertinggi (opsional, memberikan efek analitik mendalam) */}
              <ReferenceLine x={chartData[maxCalorieIndex].day} stroke="#FF5E00" strokeOpacity={0.2} strokeDasharray="3 3" />
              
              <Area 
                type="monotone" 
                dataKey="calories" 
                stroke="#FF5E00" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorCalories)" 
                activeDot={{ r: 6, fill: '#FF5E00', stroke: '#fff', strokeWidth: 3 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REKOR PRIBADI (PERSONAL RECORDS GRID) */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-orange-50 rounded-xl">
            <Award className="w-5 h-5 text-[#FF5E00]" />
          </div>
          <h3 className="font-black text-xl text-[#111827]">Rekor Angkatan Terkini</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {prs.map((pr, idx) => (
            <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-slate-200 transition-colors shadow-sm">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{pr.exercise}</p>
              <p className="text-3xl font-black text-[#111827] my-2 tracking-tight">{pr.record}</p>
              <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {pr.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;
