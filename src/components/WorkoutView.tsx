// src/components/WorkoutView.tsx

import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  CheckCircle2, 
  Save, 
  Video, 
  RefreshCw, 
  X, 
  Calendar, 
  Sparkles,
  Trophy
} from 'lucide-react';
import { 
  FitnessGoal, 
  ExperienceLevel, 
  SessionDuration, 
  EquipmentType,
  getAvailableDays, 
  generateWorkoutPlan
} from '../engine/workoutEngine';

interface SavedProgram {
  savedAt: string;
  meta: {
    goal: FitnessGoal;
    level: ExperienceLevel;
    days: number;
    duration: SessionDuration;
    equipment: EquipmentType;
  };
  completedExercises: string[]; // Format Key: "w1_d1_bench_press"
}

export const WorkoutView: React.FC = () => {
  const [goal, setGoal] = useState<FitnessGoal>('hypertrophy');
  const [level, setLevel] = useState<ExperienceLevel>('intermediate');
  const [days, setDays] = useState<number>(4);
  const [duration, setDuration] = useState<SessionDuration>(60);
  const [equipment, setEquipment] = useState<EquipmentType>('full_gym');
  
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const [selectedVideo, setSelectedVideo] = useState<{ name: string; url: string } | null>(null);
  const [savedProgram, setSavedProgram] = useState<SavedProgram | null>(null);

  useEffect(() => {
    const localData = localStorage.getItem('syncfit_active_program');
    if (localData) {
      try {
        setSavedProgram(JSON.parse(localData));
      } catch (e) {
        console.error("Gagal memuat program tersimpan", e);
      }
    }
  }, []);

  const availableDays = getAvailableDays(level);

  const handleLevelChange = (newLevel: ExperienceLevel) => {
    setLevel(newLevel);
    const newDaysOptions = getAvailableDays(newLevel);
    if (!newDaysOptions.includes(days)) {
      setDays(newDaysOptions[0]);
      setSelectedDayNumber(1);
    }
  };

  const handleDaysChange = (newDays: number) => {
    setDays(newDays);
    if (selectedDayNumber > newDays) {
      setSelectedDayNumber(1);
    }
  };

  const plan = generateWorkoutPlan(goal, level, days, duration, equipment, activeWeek);
  const activeDaySchedule = plan.schedule.find(s => s.dayNumber === selectedDayNumber) || plan.schedule[0];

  const handleSaveProgram = () => {
    const newSavedProgram: SavedProgram = {
      savedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      meta: { goal, level, days, duration, equipment },
      completedExercises: []
    };
    localStorage.setItem('syncfit_active_program', JSON.stringify(newSavedProgram));
    setSavedProgram(newSavedProgram);
    alert('Program berhasil disimpan! Anda sekarang dapat melacak kemajuan di siklus 4 minggu ini.');
  };

  const handleResetProgram = () => {
    if (confirm('Apakah Anda yakin ingin mereset program aktif beserta seluruh riwayat progresnya?')) {
      localStorage.removeItem('syncfit_active_program');
      setSavedProgram(null);
    }
  };

  const toggleExerciseCompletion = (exerciseId: string) => {
    if (!savedProgram) return;

    const key = `w${activeWeek}_d${selectedDayNumber}_${exerciseId}`;
    const exists = savedProgram.completedExercises.includes(key);
    const updated = exists
      ? savedProgram.completedExercises.filter(k => k !== key)
      : [...savedProgram.completedExercises, key];

    const updatedProgram = { ...savedProgram, completedExercises: updated };
    setSavedProgram(updatedProgram);
    localStorage.setItem('syncfit_active_program', JSON.stringify(updatedProgram));
  };

  // Kalkulasi Progres Harian & Progres Total Siklus 4 Minggu
  const totalActiveDayExercises = activeDaySchedule?.exercises.length || 0;
  const completedActiveDayCount = activeDaySchedule?.exercises.filter(ex => 
    savedProgram?.completedExercises.includes(`w${activeWeek}_d${selectedDayNumber}_${ex.id}`)
  ).length || 0;

  const dayProgressPercentage = totalActiveDayExercises > 0 
    ? Math.round((completedActiveDayCount / totalActiveDayExercises) * 100)
    : 0;

  // Total Gerakan dalam 4 Minggu (4 Minggu * Total Gerakan Per Minggu)
  const totalWeeklyExercises = plan.schedule.reduce((acc, d) => acc + d.exercises.length, 0);
  const total4WeekExercises = totalWeeklyExercises * 4;
  const totalCompletedOverall = savedProgram?.completedExercises.length || 0;
  const overallProgressPercentage = total4WeekExercises > 0 
    ? Math.min(100, Math.round((totalCompletedOverall / total4WeekExercises) * 100))
    : 0;

  return (
    <div className="space-y-8">
      {/* 1. SAVED PROGRAM BANNER WITH DUAL PROGRESS INDICATORS */}
      {savedProgram && (
        <div className="bg-[#111111] text-white p-6 rounded-[20px] border border-[#FF5E00]/40 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#FF5E00] text-white rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> PROGRAM AKTIF BERJALAN
                </span>
                <span className="text-xs text-[#707072] font-mono">Disimpan: {savedProgram.savedAt}</span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight mt-1 text-white">
                {savedProgram.meta.goal.replace('_', ' ').toUpperCase()} • {savedProgram.meta.equipment === 'full_gym' ? 'FULL GYM' : 'BODYWEIGHT'}
              </h3>
            </div>

            <button 
              onClick={handleResetProgram}
              className="px-4 py-2 bg-[#222222] hover:bg-[#333333] text-xs font-bold uppercase rounded-full flex items-center gap-1.5 transition-all text-[#CACACB]"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Program
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Progress Hari Ini */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#CACACB]">HARI INI (W{activeWeek} - HARI {selectedDayNumber}): {completedActiveDayCount}/{totalActiveDayExercises} GERAKAN</span>
                <span className="text-[#FF5E00] font-bold">{dayProgressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF5E00] transition-all duration-500" 
                  style={{ width: `${dayProgressPercentage}%` }}
                />
              </div>
            </div>

            {/* Progress Total Program 4 Minggu */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#CACACB] flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-[#FF006B]" /> TOTAL SIKLUS 4 MINGGU: {totalCompletedOverall}/{total4WeekExercises} GERAKAN
                </span>
                <span className="text-[#FF006B] font-bold">{overallProgressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF5E00] to-[#FF006B] transition-all duration-500" 
                  style={{ width: `${overallProgressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONFIGURATOR PANEL */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-[#111111]">
            <Dumbbell className="text-[#FF5E00]" /> CONFIGURATOR PROGRAM DETERMINISTIK
          </h2>
          <button
            onClick={handleSaveProgram}
            className="px-5 py-2.5 bg-gradient-to-r from-[#FF5E00] to-[#FF006B] text-white text-xs font-bold uppercase rounded-full shadow-md hover:opacity-90 flex items-center gap-2 self-start md:self-auto transition-all"
          >
            <Save className="w-4 h-4" /> Simpan Program Ini
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-2">Fitness Goal</label>
            <select 
              value={goal} 
              onChange={(e) => setGoal(e.target.value as FitnessGoal)}
              className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] p-3 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
            >
              <option value="hypertrophy">Hypertrophy (Muscular)</option>
              <option value="strength">Strength (Power)</option>
              <option value="recomp">Body Recomposition</option>
              <option value="fat_loss">Fat Loss</option>
              <option value="fitness">General Fitness</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-2">Peralatan (Equipment)</label>
            <select 
              value={equipment} 
              onChange={(e) => setEquipment(e.target.value as EquipmentType)}
              className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] p-3 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
            >
              <option value="full_gym">Full Gym Equipment</option>
              <option value="bodyweight">Bodyweight Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-2">Experience Level</label>
            <select 
              value={level} 
              onChange={(e) => handleLevelChange(e.target.value as ExperienceLevel)}
              className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] p-3 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-2">Hari / Minggu</label>
            <select 
              value={days} 
              onChange={(e) => handleDaysChange(Number(e.target.value))}
              className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] p-3 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
            >
              {availableDays.map(d => (
                <option key={d} value={d}>{d} Hari / Minggu</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-2">Durasi / Sesi</label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value) as SessionDuration)}
              className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] p-3 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
            >
              <option value={45}>45 Menit (3 Gerakan)</option>
              <option value={60}>60 Menit (4 Gerakan)</option>
              <option value={75}>75+ Menit (5 Gerakan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. WEEKLY PROGRESSION TABS (W1-W4) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#707072]">
          <Calendar className="w-4 h-4 text-[#FF5E00]" /> SIKLUS PROGRESI MINGGUAN (KLIK UNTUK MELIHAT PERUBAHAN PARAMETER)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {plan.weeks.map(w => {
            const isActive = activeWeek === w.weekNumber;
            return (
              <button
                key={w.weekNumber}
                onClick={() => setActiveWeek(w.weekNumber)}
                className={`p-4 rounded-[16px] text-left transition-all border ${
                  isActive 
                    ? 'bg-[#111111] text-white border-[#111111] shadow-md scale-[1.02]' 
                    : 'bg-white text-[#111111] border-[#E2E8F0] hover:bg-[#F5F5F5]'
                }`}
              >
                <div className={`text-xs font-extrabold uppercase ${isActive ? 'text-[#FF5E00]' : 'text-[#707072]'}`}>
                  {w.label}
                </div>
                <div className="text-xs font-medium mt-1 opacity-80">
                  {w.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DAILY SPLIT TABS */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase text-[#707072] block">PEMBAGIAN JADWAL SPLIT HARIAN ({days} HARI/MINGGU)</label>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {plan.schedule.map(s => {
            const isSelected = selectedDayNumber === s.dayNumber;
            return (
              <button
                key={s.dayNumber}
                onClick={() => setSelectedDayNumber(s.dayNumber)}
                className={`px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-[#FF5E00] text-white shadow-md' 
                    : 'bg-white border border-[#E2E8F0] text-[#111111] hover:bg-[#F5F5F5]'
                }`}
              >
                <span>{s.dayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. EXERCISES LIST FOR SELECTED DAY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-[#111111]">
              MENU LATIHAN: {activeDaySchedule?.dayName.toUpperCase()}
            </h3>
            <p className="text-xs text-[#707072] mt-0.5">
              Target Otot: <span className="font-semibold text-[#111111]">{activeDaySchedule?.targetMuscles.join(', ')}</span>
            </p>
          </div>
          <span className="text-xs font-mono text-[#707072]">
            {activeDaySchedule?.exercises.length || 0} GERAKAN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDaySchedule?.exercises.map((ex, idx) => {
            const completionKey = `w${activeWeek}_d${selectedDayNumber}_${ex.id}`;
            const isCompleted = savedProgram?.completedExercises.includes(completionKey);

            return (
              <div 
                key={ex.id} 
                className={`bg-white rounded-[16px] border p-5 flex gap-4 items-center transition-all ${
                  isCompleted ? 'border-[#FF5E00] bg-[#FF5E00]/5' : 'border-[#E2E8F0]'
                }`}
              >
                {savedProgram ? (
                  <button 
                    onClick={() => toggleExerciseCompletion(ex.id)}
                    className="shrink-0 transition-transform active:scale-95"
                    title="Tandai Selesai"
                  >
                    <CheckCircle2 className={`w-8 h-8 ${isCompleted ? 'text-[#FF5E00] fill-[#FF5E00]/20' : 'text-[#CACACB]'}`} />
                  </button>
                ) : (
                  <div className="w-10 h-10 bg-[#111111] text-white rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0">
                    0{idx + 1}
                  </div>
                )}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#FF5E00]/10 text-[#FF5E00] rounded-full">
                        {ex.muscleGroup}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-[#707072]">
                        {ex.equipment === 'bodyweight' ? 'BODYWEIGHT' : ex.type}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedVideo({ name: ex.name, url: ex.videoUrl })}
                      className="text-xs font-semibold text-[#FF5E00] hover:underline flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5" /> Demo
                    </button>
                  </div>

                  <h4 className={`font-bold text-base ${isCompleted ? 'line-through text-[#707072]' : 'text-[#111111]'}`}>
                    {ex.name}
                  </h4>

                  <div className="font-mono text-xs text-[#707072] flex items-center gap-3 pt-1">
                    <span className="font-bold text-[#111111]">{ex.sets} SETS</span>
                    <span>•</span>
                    <span>{ex.reps} REPS</span>
                    <span>•</span>
                    <span className="text-[#FF006B] font-bold">RIR {ex.rir}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. VIDEO DEMO MODAL PLAYER */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-xl w-full p-6 space-y-4 relative shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
                <Video className="text-[#FF5E00]" /> DEMO TEKNIK: {selectedVideo.name}
              </h3>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="p-1 hover:bg-[#F5F5F5] rounded-full text-[#707072] transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="aspect-video w-full rounded-[12px] overflow-hidden bg-black">
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
