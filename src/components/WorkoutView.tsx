import React, { useState, useEffect } from 'react';
import { Dumbbell, Zap, Play, CheckCircle2, Flame, Save, Video, RefreshCw, X } from 'lucide-react';
import { 
  FitnessGoal, 
  ExperienceLevel, 
  SessionDuration, 
  EquipmentType,
  getAvailableDays, 
  generateWorkoutPlan,
  ProgramExercise
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
  completedExercises: string[]; // List ID gerakan yang diselesaikan
}

export const WorkoutView: React.FC = () => {
  // Input Configurator State
  const [goal, setGoal] = useState<FitnessGoal>('hypertrophy');
  const [level, setLevel] = useState<ExperienceLevel>('intermediate');
  const [days, setDays] = useState<number>(4);
  const [duration, setDuration] = useState<SessionDuration>(60);
  const [equipment, setEquipment] = useState<EquipmentType>('full_gym');
  const [activeWeek, setActiveWeek] = useState<number>(1);

  // Active Video Modal State
  const [selectedVideo, setSelectedVideo] = useState<{ name: string; url: string } | null>(null);

  // Saved Program & Active Progress State
  const [savedProgram, setSavedProgram] = useState<SavedProgram | null>(null);

  // Load Saved Program on Mount
  useEffect(() => {
    const localData = localStorage.getItem('syncfit_active_program');
    if (localData) {
      try {
        setSavedProgram(JSON.parse(localData));
      } catch (e) {
        console.error("Failed loading saved program", e);
      }
    }
  }, []);

  const availableDays = getAvailableDays(level);
  
  // Dynamic Plan Generation per Selected Week
  const plan = generateWorkoutPlan(goal, level, days, duration, equipment, activeWeek);

  const handleLevelChange = (newLevel: ExperienceLevel) => {
    setLevel(newLevel);
    const newDays = getAvailableDays(newLevel);
    if (!newDays.includes(days)) {
      setDays(newDays[0]);
    }
  };

  const handleSaveProgram = () => {
    const newSavedProgram: SavedProgram = {
      savedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      meta: { goal, level, days, duration, equipment },
      completedExercises: []
    };
    localStorage.setItem('syncfit_active_program', JSON.stringify(newSavedProgram));
    setSavedProgram(newSavedProgram);
    alert('Program berhasil disimpan ke profil Anda!');
  };

  const toggleExerciseCompletion = (exerciseId: string) => {
    if (!savedProgram) return;
    const exists = savedProgram.completedExercises.includes(exerciseId);
    const updated = exists
      ? savedProgram.completedExercises.filter(id => id !== exerciseId)
      : [...savedProgram.completedExercises, exerciseId];

    const updatedProgram = { ...savedProgram, completedExercises: updated };
    setSavedProgram(updatedProgram);
    localStorage.setItem('syncfit_active_program', JSON.stringify(updatedProgram));
  };

  const handleResetProgram = () => {
    if (confirm('Apakah Anda yakin ingin menghapus program berjalan ini?')) {
      localStorage.removeItem('syncfit_active_program');
      setSavedProgram(null);
    }
  };

  const progressPercentage = savedProgram 
    ? Math.round((savedProgram.completedExercises.length / plan.exercises.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Banner Program Aktif yang Tersimpan */}
      {savedProgram && (
        <div className="bg-[#111111] text-white p-6 rounded-[20px] border border-[#FF5E00]/30 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FF5E00] text-white rounded-full">
                  PROGRAM AKTIF BERJALAN
                </span>
                <span className="text-xs text-[#707072] font-mono">Disimpan: {savedProgram.savedAt}</span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight mt-1">
                {savedProgram.meta.goal.toUpperCase()} • {savedProgram.meta.equipment === 'full_gym' ? 'FULL GYM' : 'BODYWEIGHT'}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleResetProgram}
                className="px-4 py-2 bg-[#222222] hover:bg-[#333333] text-xs font-bold uppercase rounded-full flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Ganti Program
              </button>
            </div>
          </div>

          {/* Progress Bar Status */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#CACACB]">PROGRES MINGGU INI ({savedProgram.completedExercises.length}/{plan.exercises.length} GERAKAN)</span>
              <span className="text-[#FF5E00] font-bold">{progressPercentage}% SELESAI</span>
            </div>
            <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF5E00] to-[#FF006B] transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Parameter Control Panel */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-[#111111]">
            <Dumbbell className="text-[#FF5E00]" /> CONFIGURATOR PROGRAM DETERMINISTIK
          </h2>
          <button
            onClick={handleSaveProgram}
            className="px-5 py-2.5 bg-gradient-to-r from-[#FF5E00] to-[#FF006B] text-white text-xs font-bold uppercase rounded-full shadow-md hover:opacity-90 flex items-center gap-2 self-start md:self-auto"
          >
            <Save className="w-4 h-4" /> Simpan Program Ini
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Goal Selector */}
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

          {/* Equipment Dropdown */}
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

          {/* Experience Selector */}
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

          {/* Dependent Days Dropdown */}
          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-2">Days / Week</label>
            <select 
              value={days} 
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] p-3 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
            >
              {availableDays.map(d => (
                <option key={d} value={d}>{d} Hari / Minggu</option>
              ))}
            </select>
          </div>

          {/* Session Duration Selector */}
          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-2">Duration / Session</label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value) as SessionDuration)}
              className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] p-3 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
            >
              <option value={45}>45 Menit (3-4 Gerakan)</option>
              <option value={60}>60 Menit (4-5 Gerakan)</option>
              <option value={75}>75+ Menit (5-6 Gerakan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs (W1-W4 Dynamic Progression) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-[#707072]">FASE PROGRESI SIKLUS (KLIK UNTUK VARIASI MINGGUAN)</label>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {plan.weeks.map(w => (
            <button
              key={w.weekNumber}
              onClick={() => setActiveWeek(w.weekNumber)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeWeek === w.weekNumber 
                  ? 'bg-[#111111] text-white shadow-md' 
                  : 'bg-white border border-[#E2E8F0] text-[#707072] hover:bg-[#F5F5F5]'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Exercise Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold uppercase tracking-tight text-[#111111]">
            SUSUNAN GERAKAN — {plan.exercises[0]?.phaseLabel.toUpperCase()}
          </h3>
          <span className="text-xs font-mono text-[#707072]">{plan.meta.totalExercises} GERAKAN RESISTANSI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.exercises.map((ex, idx) => {
            const isCompleted = savedProgram?.completedExercises.includes(ex.id);

            return (
              <div 
                key={ex.id} 
                className={`bg-white rounded-[16px] border p-5 flex gap-4 items-center transition-all ${
                  isCompleted ? 'border-[#FF5E00] bg-[#FF5E00]/5' : 'border-[#E2E8F0]'
                }`}
              >
                {/* Tombol Selesai (Checklist) jika ada program tersimpan */}
                {savedProgram ? (
                  <button 
                    onClick={() => toggleExerciseCompletion(ex.id)}
                    className="shrink-0 transition-transform active:scale-95"
                  >
                    <CheckCircle2 className={`w-8 h-8 ${isCompleted ? 'text-[#FF5E00] fill-[#FF5E00]/20' : 'text-[#CACACB]'}`} />
                  </button>
                ) : (
                  <div className="w-10 h-10 bg-[#111111] text-white rounded-full flex items-center justify-center font-mono font-bold text-base shrink-0">
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

                    {/* Button Video Demo */}
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

      {/* Cardio Finisher Pool (Only rendered for Fat Loss / General Fitness) */}
      {plan.cardioFinishers.length > 0 && (
        <div className="bg-gradient-to-r from-[#FF5E00]/10 to-[#FF006B]/10 rounded-[20px] border border-[#FF5E00]/20 p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#FF5E00] font-bold uppercase text-sm">
            <Flame className="w-5 h-5" /> CARDIO FINISHER CIRCUIT (END OF SESSION)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plan.cardioFinishers.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-[12px] border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111]">
                  <Zap className="w-4 h-4 text-[#FF006B]" /> {c.name}
                </div>
                <button
                  onClick={() => setSelectedVideo({ name: c.name, url: c.videoUrl })}
                  className="text-xs text-[#FF5E00] hover:underline font-semibold flex items-center gap-1"
                >
                  <Video className="w-3 h-3" /> Demo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Demo Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-xl w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
                <Video className="text-[#FF5E00]" /> DEMO TEKNIK: {selectedVideo.name}
              </h3>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="p-1 hover:bg-[#F5F5F5] rounded-full text-[#707072]"
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
