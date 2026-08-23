// src/engine/workoutEngine.ts

export type FitnessGoal = 'strength' | 'hypertrophy' | 'recomp' | 'fat_loss' | 'fitness';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type SessionDuration = 45 | 60 | 75;

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | 'Shoulder' | 'Bicep' | 'Tricep' | 'Quad' | 'Hamstring' | 'Calf' | 'Core';
  type: 'compound' | 'isolation';
  minLevel: ExperienceLevel;
  isAdvancedOnly?: boolean;
  demoAsset: string;
}

export interface CardioExercise {
  id: string;
  name: string;
  minLevel: ExperienceLevel;
}

// Layer B — Exercise Pool (Deterministik)
export const EXERCISE_POOL: Exercise[] = [
  // Compound
  { id: 'bench_press', name: 'Barbell Bench Press', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', demoAsset: '/assets/bench-press.jpg' },
  { id: 'push_up', name: 'Standard Push Up', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', demoAsset: '/assets/push-up.jpg' },
  { id: 'barbell_row', name: 'Barbell Bent-Over Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', demoAsset: '/assets/barbell-row.jpg' },
  { id: 'pull_up', name: 'Pull Up', muscleGroup: 'Back', type: 'compound', minLevel: 'intermediate', demoAsset: '/assets/pull-up.jpg' },
  { id: 'overhead_press', name: 'Overhead Military Press', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'beginner', demoAsset: '/assets/overhead-press.jpg' },
  { id: 'barbell_squat', name: 'Barbell Back Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', demoAsset: '/assets/squat.jpg' },
  { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'advanced', isAdvancedOnly: true, demoAsset: '/assets/split-squat.jpg' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscleGroup: 'Hamstring', type: 'compound', minLevel: 'beginner', demoAsset: '/assets/rdl.jpg' },
  
  // Isolation
  { id: 'dumbbell_fly', name: 'Dumbbell Chest Fly', muscleGroup: 'Chest', type: 'isolation', minLevel: 'beginner', demoAsset: '/assets/db-fly.jpg' },
  { id: 'lateral_raise', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulder', type: 'isolation', minLevel: 'beginner', demoAsset: '/assets/lateral-raise.jpg' },
  { id: 'bicep_curl', name: 'Barbell Bicep Curl', muscleGroup: 'Bicep', type: 'isolation', minLevel: 'beginner', demoAsset: '/assets/bicep-curl.jpg' },
  { id: 'tricep_pushdown', name: 'Tricep Cable Pushdown', muscleGroup: 'Tricep', type: 'isolation', minLevel: 'beginner', demoAsset: '/assets/tricep-pushdown.jpg' },
  { id: 'calf_raise', name: 'Standing Calf Raise', muscleGroup: 'Calf', type: 'isolation', minLevel: 'beginner', demoAsset: '/assets/calf-raise.jpg' },
  { id: 'plank', name: 'Forearm Plank', muscleGroup: 'Core', type: 'isolation', minLevel: 'beginner', demoAsset: '/assets/plank.jpg' },
];

export const CARDIO_POOL: CardioExercise[] = [
  { id: 'jumping_jack', name: 'Jumping Jack', minLevel: 'beginner' },
  { id: 'high_knees', name: 'High Knees', minLevel: 'beginner' },
  { id: 'mountain_climber', name: 'Mountain Climber', minLevel: 'intermediate' },
  { id: 'jump_squat', name: 'Jump Squat', minLevel: 'intermediate' },
  { id: 'burpee', name: 'Burpee', minLevel: 'advanced' },
];

// Layer A — Dependent Days Option
export function getAvailableDays(level: ExperienceLevel): number[] {
  if (level === 'beginner') return [2, 3, 4, 5]; //[cite: 5]
  if (level === 'intermediate') return [2, 3, 4, 5, 6]; //[cite: 5]
  return [2, 3, 4, 5, 6, 7]; // Advanced[cite: 5]
}

// Layer C1 — Session Cap
function getExerciseCountCap(duration: SessionDuration): { min: number; max: number } {
  if (duration <= 45) return { min: 3, max: 4 }; //[cite: 5]
  if (duration === 60) return { min: 4, max: 5 }; //[cite: 5]
  return { min: 5, max: 6 }; // 75+ min[cite: 5]
}

// Layer D — RIR & Rep Range Tables
function getVolumeAssignment(goal: FitnessGoal, level: ExperienceLevel, isCompound: boolean) {
  let repRange = isCompound ? '6-10' : '10-15';
  let rir = 3;

  if (goal === 'strength') {
    repRange = isCompound ? '3-6' : '6-10';
    rir = level === 'advanced' ? 1 : level === 'intermediate' ? 2 : 3; //[cite: 5]
  } else if (goal === 'hypertrophy' || goal === 'recomp') {
    repRange = isCompound ? '6-10' : '10-15';
    rir = level === 'advanced' ? (isCompound ? 2 : 1) : level === 'intermediate' ? (isCompound ? 3 : 2) : 3; //[cite: 5]
  } else {
    // Fat Loss & General Fitness
    repRange = isCompound ? '8-12' : '12-15'; //[cite: 5]
    rir = level === 'advanced' ? 2 : 3; //[cite: 5]
  }

  return { sets: 3, repRange, rir };
}

// Main Deterministic Plan Generator
export function generateWorkoutPlan(
  goal: FitnessGoal,
  level: ExperienceLevel,
  days: number,
  duration: SessionDuration
) {
  const cap = getExerciseCountCap(duration);
  const eligiblePool = EXERCISE_POOL.filter(ex => {
    if (ex.isAdvancedOnly && level !== 'advanced') return false; // Exclude advanced-only[cite: 5]
    return true;
  });

  // Separation: Compound before Isolation (Layer C3)[cite: 5]
  const compounds = eligiblePool.filter(ex => ex.type === 'compound');
  const isolations = eligiblePool.filter(ex => ex.type === 'isolation');

  const selectedExercises = [
    ...compounds.slice(0, Math.ceil(cap.max / 2)),
    ...isolations.slice(0, Math.floor(cap.max / 2))
  ].slice(0, cap.max);

  const formattedExercises = selectedExercises.map(ex => {
    const vol = getVolumeAssignment(goal, level, ex.type === 'compound');
    return {
      ...ex,
      sets: vol.sets,
      reps: vol.repRange,
      rir: vol.rir
    };
  });

  // Layer C6 — Cardio Finisher for Fat Loss / General Fitness[cite: 5]
  let cardioFinishers: CardioExercise[] = [];
  if (goal === 'fat_loss' || goal === 'fitness') {
    const cardioCount = duration >= 75 ? 3 : 2; //[cite: 5]
    cardioFinishers = CARDIO_POOL.filter(c => c.minLevel !== 'advanced' || level === 'advanced').slice(0, cardioCount);
  }

  // Layer E — 4-Week Progression Structure[cite: 5]
  const weeks = [1, 2, 3, 4].map(w => ({
    weekNumber: w,
    isDeload: w === 4, // W4 Deload[cite: 5]
    label: w === 4 ? 'Week 4 (Deload Recovery)' : `Week ${w}`
  }));

  return {
    meta: { goal, level, days, duration, totalExercises: formattedExercises.length },
    exercises: formattedExercises,
    cardioFinishers,
    weeks
  };
}
