// src/components/ProgressView.tsx
import React, { useState } from 'react';
import { Trophy, TrendingUp, Scale, Calendar, Award, Flame, Activity } from 'lucide-react';

interface ChartPoint {
  label: string;
  calories: number;
  duration: number;
}

const weeklyData: ChartPoint[] = [
  { label: 'Sen', calories: 250, duration: 45 },
  { label: 'Sel', calories: 420, duration: 60 },
  { label: 'Rab', calories: 150, duration: 30 },
  { label: 'Kam', calories: 580, duration: 90 },
  { label: 'Jum', calories: 320, duration: 50 },
  { label: 'Sab', calories: 650, duration: 100 },
  { label: 'Min', calories: 0, duration: 0 },
];

const monthlyData: ChartPoint[] = [
  { label: 'W1', calories: 1200, duration: 180 },
  { label: 'W2', calories: 2100, duration: 320 },
  { label: 'W3', calories: 1800, duration: 270 },
  { label: 'W4', calories: 2400, duration: 350 },
];

export const ProgressView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const prs = [
    { exercise: 'Bench Press', record: '95 kg', date: '12 Aug 2026' },
    { exercise: 'Barbell Squat', record: '120 kg', date: '05 Aug 2026' },
    { exercise: 'Deadlift', record: '145 kg', date: '28 Jul 2026' },
  ];

  const chartData = timeRange === 'Weekly' ? weeklyData : monthlyData;
  const maxCalories = Math.max(...chartData.map((d) => d.calories), 1);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingTop = 20;
  const paddingBottom = 40;

  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingTop - paddingBottom;

  // Koordinat Poin Grafik
  const points = chartData.map((d, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * usableWidth;
    const y = svgHeight - paddingBottom - (d.calories / maxCalories) * usableHeight;
    return { x, y, ...d };
  });

  // Membuat Smooth Bezier Curve Path
  const createSmoothPath = (pts: typeof points) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const cpX = (current.x + next.x) / 2;
      path += ` C ${cpX},${current.y} ${cpX},${next.y} ${next.x},${next.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${svgHeight - paddingBottom} L ${points[0].x},${svgHeight - paddingBottom} Z`;

  return (
    <div className="pt-0 pb-20 md:pt-6 md:pb-12 px-4 md:px-8 max-w-5xl mx-auto space-y-6 font-sans animate-fade-in">
      
      {/* KARTU STATISTIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* GRAFIK PURE SVG WORKING PROGRESS */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-black text-xl text-[#111827]">Working Progress</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Kalori terbakar berdasarkan sesi latihan</p>
          </div>
          
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value as 'Weekly' | 'Monthly');
                setHoveredIndex(null);
              }}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-100 text-[#FF5E00] font-extrabold text-xs py-2 pl-4 pr-8 rounded-xl outline-none cursor-pointer transition-colors"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#FF5E00]">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* CONTAINER SVG */}
        <div className="w-full relative">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5E00" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FF5E00" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.5, 1].map((ratio, idx) => {
              const y = svgHeight - paddingBottom - ratio * usableHeight;
              return (
                <line 
                  key={idx} 
                  x1={paddingX} 
                  y1={y} 
                  x2={svgWidth - paddingX} 
                  y2={y} 
                  stroke="#f1f5f9" 
                  strokeDasharray="4 4" 
                  strokeWidth="1" 
                />
              );
            })}

            {/* Gradient Area Fill */}
            <path d={areaPath} fill="url(#orangeGradient)" />

            {/* Smooth Curve Line */}
            <path d={linePath} fill="none" stroke="#FF5E00" strokeWidth="4" strokeLinecap="round" />

            {/* Interactive Points & Labels */}
            {points.map((pt, i) => (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                {/* Vertical Hover Line */}
                {hoveredIndex === i && (
                  <line 
                    x1={pt.x} 
                    y1={paddingTop} 
                    x2={pt.x} 
                    y2={svgHeight - paddingBottom} 
                    stroke="#FF5E00" 
                    strokeOpacity="0.3" 
                    strokeDasharray="3 3" 
                    strokeWidth="2" 
                  />
                )}

                {/* Outer Ring on Hover */}
                {hoveredIndex === i && (
                  <circle cx={pt.x} cy={pt.y} r="8" fill="#FF5E00" fillOpacity="0.2" />
                )}

                {/* Point Marker */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={hoveredIndex === i ? '6' : '4'} 
                  fill="#FF5E00" 
                  stroke="#FFFFFF" 
                  strokeWidth="2.5" 
                  className="transition-all duration-200"
                />

                {/* X-Axis Label */}
                <text 
                  x={pt.x} 
                  y={svgHeight - 12} 
                  textAnchor="middle" 
                  fill="#94a3b8" 
                  fontSize="12" 
                  fontWeight="700"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Hover Tooltip Popup */}
          {hoveredIndex !== null && (
            <div 
              className="absolute bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-1 pointer-events-none transition-all z-20"
              style={{
                left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
                top: `${(points[hoveredIndex].y / svgHeight) * 100 - 30}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <p className="text-xs font-bold text-slate-400">{points[hoveredIndex].label}</p>
              <p className="text-xs font-black text-[#FF5E00] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {points[hoveredIndex].calories} kcal
              </p>
              <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> {points[hoveredIndex].duration} menit
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REKOR PRIBADI */}
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
