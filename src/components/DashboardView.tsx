// Potongan Kartu Latihan di DashboardView
<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
  <div className="flex items-center justify-between mb-4">
    <span className="bg-[#111827] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg">
      Jadwal Hari Ini • {mockWorkout.week}
    </span>
  </div>

  <h3 className="text-2xl font-black text-[#111827] mb-2">{mockWorkout.title}</h3>

  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-6">
    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
      <Clock className="w-4 h-4 text-slate-700" />
      <span>{mockWorkout.duration}</span>
    </div>
    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
      <Activity className="w-4 h-4 text-[#FF5E00]" />
      <span>Goal: {mockWorkout.goal}</span>
    </div>
  </div>

  {/* Tombol ini berfungsi penuh sebagai navigasi langsung ke Tab Workout */}
  <button 
    onClick={() => navigate('/workout')}
    className="w-full bg-[#FF5E00] hover:bg-[#E05300] text-white py-3.5 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
  >
    <Dumbbell className="w-5 h-5" />
    <span>Mulai Sesi Latihan</span>
  </button>
</div>
