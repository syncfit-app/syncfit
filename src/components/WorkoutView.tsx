import React, { useState } from 'react';
import { Dumbbell, Zap, Play, CheckCircle2, Flame } from 'lucide-react';
import { 
  FitnessGoal, 
  ExperienceLevel, 
  SessionDuration, 
  getAvailableDays, 
  generateWorkoutPlan 
} from '../engine/workoutEngine';

export const WorkoutView: React.FC = () => {
  const [goal, setGoal] = useState<FitnessGoal>('hypertrophy');
  const [level, setLevel] = useState<ExperienceLevel>('intermediate');
  const [days, setDays] = useState<number>(4);
  const [duration, setDuration] = useState<SessionDuration>(60);
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const availableDays = getAvailableDays(level);
  const plan = generateWorkoutPlan(goal, level, days, duration);

  const handleLevelChange = (newLevel: ExperienceLevel) => {
    setLevel(newLevel);
    const newDays = getAvailableDays(newLevel);
    if (!newDays.includes(days)) {
      setDays(newDays[0]); // Reset to first valid option[cite: 5]
    }
  };

  return (
    <div className="space-y-8">
      {/* Parameter Control Panel */}
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-6">
        <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-[#111111]">
          <Dumbbell className="text-[#FF5E00]" /> CONFIGURATOR PROGRAM DETERMINISTIK
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Week Selector Tabs (W1-W4 Progression) */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {plan.weeks.map(w => (
          <button
            key={w.weekNumber}
            onClick={() => setActiveWeek(w.weekNumber)}
            className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeWeek === w.weekNumber 
                ? 'bg-[#111111] text-white' 
                : 'bg-white border border-[#E2E8F0] text-[#707072] hover:bg-[#F5F5F5]'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Generated Exercise Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold uppercase tracking-tight text-[#111111]">
            SUSUNAN GERAKAN SIKLUS (MINGGU {activeWeek})
          </h3>
          <span className="text-xs font-mono text-[#707072]">{plan.meta.totalExercises} GERAKAN RESISTANSI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.exercises.map((ex, idx) => (
            <div key={ex.id} className="bg-white rounded-[16px] border border-[#E2E8F0] p-5 flex gap-4 items-center">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center font-mono font-bold text-lg shrink-0">
                0{idx + 1}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#FF5E00]/10 text-[#FF5E00] rounded-full">
                    {ex.muscleGroup}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#707072]">
                    {ex.type}
                  </span>
                </div>
                <h4 className="font-bold text-base text-[#111111]">{ex.name}</h4>
                <div className="font-mono text-xs text-[#707072] flex items-center gap-3 pt-1">
                  <span>{ex.sets} SETS</span>
                  <span>•</span>
                  <span>{ex.reps} REPS</span>
                  <span>•</span>
                  <span className="text-[#FF006B] font-semibold">RIR {ex.rir}</span>
                </div>
              </div>
            </div>
          ))}
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
              <div key={c.id} className="bg-white p-4 rounded-[12px] border border-[#E2E8F0] font-bold text-sm text-[#111111] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF006B]" /> {c.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
