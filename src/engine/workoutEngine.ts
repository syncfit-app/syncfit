// src/engine/workoutEngine.ts

export type FitnessGoal = 'strength' | 'hypertrophy' | 'recomp' | 'fat_loss' | 'fitness';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type SessionDuration = 45 | 60 | 75;
export type EquipmentType = 'full_gym' | 'bodyweight';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | 'Shoulder' | 'Bicep' | 'Tricep' | 'Quad' | 'Hamstring' | 'Calf' | 'Core';
  type: 'compound' | 'isolation';
  minLevel: ExperienceLevel;
  equipment: EquipmentType;
  isAdvancedOnly?: boolean;
  demoAsset: string;
  videoUrl: string;
}

export interface CardioExercise {
  id: string;
  name: string;
  minLevel: ExperienceLevel;
  videoUrl: string;
}

export interface ProgramExercise extends Exercise {
  sets: number;
  reps: string;
  rir: number;
  phaseLabel: string;
}

// Exercise Pool Terintegrasi dengan Filter Peralatan & Video Demo
export const EXERCISE_POOL: Exercise[] = [
  // FULL GYM - Compound
  { id: 'bench_press', name: 'Barbell Bench Press', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/bench-press.jpg', videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg' },
  { id: 'barbell_row', name: 'Barbell Bent-Over Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/barbell-row.jpg', videoUrl: 'https://www.youtube.com/embed/VKFeB7jy8Mg' },
  { id: 'overhead_press', name: 'Overhead Military Press', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/overhead-press.jpg', videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI' },
  { id: 'barbell_squat', name: 'Barbell Back Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/squat.jpg', videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscleGroup: 'Hamstring', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/rdl.jpg', videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM' },
  
  // FULL GYM - Isolation
  { id: 'dumbbell_fly', name: 'Dumbbell Chest Fly', muscleGroup: 'Chest', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/db-fly.jpg', videoUrl: 'https://www.youtube.com/embed/eozbDDA7E0w' },
  { id: 'lateral_raise', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulder', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/lateral-raise.jpg', videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo' },
  { id: 'bicep_curl', name: 'Barbell Bicep Curl', muscleGroup: 'Bicep', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/bicep-curl.jpg', videoUrl: 'https://www.youtube.com/embed/kwG2ipFRgfo' },
  { id: 'tricep_pushdown', name: 'Tricep Cable Pushdown', muscleGroup: 'Tricep', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/tricep-pushdown.jpg', videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU' },
  { id: 'calf_raise', name: 'Standing Calf Raise', muscleGroup: 'Calf', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', demoAsset: '/assets/calf-raise.jpg', videoUrl: 'https://www.youtube.com/embed/-M4-G8p8fmc' },

  // BODYWEIGHT ONLY - Compound
  { id: 'push_up', name: 'Standard Push Up', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', demoAsset: '/assets/push-up.jpg', videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4' },
  { id: 'pull_up', name: 'Pull Up', muscleGroup: 'Back', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', demoAsset: '/assets/pull-up.jpg', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
  { id: 'inverted_row', name: 'Inverted Bodyweight Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', demoAsset: '/assets/inverted-row.jpg', videoUrl: 'https://www.youtube.com/embed/hXTc1mDnC5c' },
  { id: 'pike_pushup', name: 'Pike Push Up', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', demoAsset: '/assets/pike-pushup.jpg', videoUrl: 'https://www.youtube.com/embed/sposDXWEB0A' },
  { id: 'bodyweight_squat', name: 'Air Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', demoAsset: '/assets/air-squat.jpg', videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U' },
  { id: 'bulgarian_split_squat', name: 'Bodyweight Split Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'advanced', equipment: 'bodyweight', isAdvancedOnly: true, demoAsset: '/assets/split-squat.jpg', videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE' },

  // BODYWEIGHT ONLY - Isolation
  { id: 'bench_dip', name: 'Bench Dip', muscleGroup: 'Tricep', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', demoAsset: '/assets/bench-dip.jpg', videoUrl: 'https://www.youtube.com/embed/0326dy_-CzM' },
  { id: 'plank', name: 'Forearm Plank', muscleGroup: 'Core', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', demoAsset: '/assets/plank.jpg', videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw' },
];

export const CARDIO_POOL: CardioExercise[] = [
  { id: 'jumping_jack', name: 'Jumping Jack', minLevel: 'beginner', videoUrl: 'https://www.youtube.com/embed/iSSAk4XCsRA' },
  { id: 'high_knees', name: 'High Knees', minLevel: 'beginner', videoUrl: 'https://www.youtube.com/embed/oDdkytliOqE' },
  { id: 'mountain_climber', name: 'Mountain Climber', minLevel: 'intermediate', videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM' },
  { id: 'jump_squat', name: 'Jump Squat', minLevel: 'intermediate', videoUrl: 'https://www.youtube.com/embed/CVaEhXotLVE' },
  { id: 'burpee', name: 'Burpee', minLevel: 'advanced', videoUrl: 'https://www.youtube.com/embed/auBLPXO8F6U' },
];

export function getAvailableDays(level: ExperienceLevel): number[] {
  if (level === 'beginner') return [2, 3, 4, 5];[cite: 4]
  if (level === 'intermediate') return [2, 3, 4, 5, 6];[cite: 4]
  return [2, 3, 4, 5, 6, 7];[cite: 4]
}

function getExerciseCountCap(duration: SessionDuration): { min: number; max: number } {
  if (duration <= 45) return { min: 3, max: 4 };
  if (duration === 60) return { min: 4, max: 5 };
  return { min: 5, max: 6 };
}

function getBaseVolumeAssignment(goal: FitnessGoal, level: ExperienceLevel, isCompound: boolean) {
  let repRange = isCompound ? '6-10' : '10-15';
  let rir = 3;

  if (goal === 'strength') {
    repRange = isCompound ? '3-6' : '6-10';
    rir = level === 'advanced' ? 1 : level === 'intermediate' ? 2 : 3;[cite: 4]
  } else if (goal === 'hypertrophy' || goal === 'recomp') {
    repRange = isCompound ? '6-10' : '10-15';
    rir = level === 'advanced' ? (isCompound ? 2 : 1) : level === 'intermediate' ? (isCompound ? 3 : 2) : 3;[cite: 4]
  } else {
    repRange = isCompound ? '8-12' : '12-15';[cite: 4]
    rir = level === 'advanced' ? 2 : 3;[cite: 4]
  }

  return { baseSets: 3, repRange, baseRir: rir };
}

// Logika Progresi Dinamis Minggu 1 s.d. 4 (Layer E)
export function calculateWeekProgression(baseSets: number, repRange: string, baseRir: number, week: number) {
  switch (week) {
    case 1:
      // Minggu 1: Pondasi (Sesuai baseline)
      return { sets: baseSets, reps: repRange, rir: baseRir, phaseLabel: 'Minggu 1 (Pondasi)' };
    case 2:
      // Minggu 2: Tambah Volume (+1 Set)
      return { sets: baseSets + 1, reps: repRange, rir: baseRir, phaseLabel: 'Minggu 2 (Peningkatan Volume)' };
    case 3:
      // Minggu 3: Puncak Intensitas (RIR diturunkan 1 step mendekati failure)
      return { sets: baseSets + 1, reps: repRange, rir: Math.max(0, baseRir - 1), phaseLabel: 'Minggu 3 (Puncak Intensitas)' };
    case 4:
      // Minggu 4: Deload (Sets diturunkan ke 2, RIR dinaikkan untuk pemulihan)
      return { sets: 2, reps: repRange, rir: Math.min(4, baseRir + 2), phaseLabel: 'Minggu 4 (Deload & Pemulihan)' };
    default:
      return { sets: baseSets, reps: repRange, rir: baseRir, phaseLabel: `Minggu ${week}` };
  }
}

export function generateWorkoutPlan(
  goal: FitnessGoal,
  level: ExperienceLevel,
  days: number,
  duration: SessionDuration,
  equipment: EquipmentType,
  selectedWeek: number = 1
) {
  const cap = getExerciseCountCap(duration);

  // Filter Pool berdasarkan Peralatan (Bodyweight vs Full Gym) & Level
  const eligiblePool = EXERCISE_POOL.filter(ex => {
    if (ex.equipment !== equipment) return false;
    if (ex.isAdvancedOnly && level !== 'advanced') return false;[cite: 4]
    return true;
  });

  const compounds = eligiblePool.filter(ex => ex.type === 'compound');
  const isolations = eligiblePool.filter(ex => ex.type === 'isolation');

  const selectedExercises = [
    ...compounds.slice(0, Math.ceil(cap.max / 2)),
    ...isolations.slice(0, Math.floor(cap.max / 2))
  ].slice(0, cap.max);

  // Menghitung Parameter Dinamis sesuai Minggu yang Dipilih
  const formattedExercises: ProgramExercise[] = selectedExercises.map(ex => {
    const base = getBaseVolumeAssignment(goal, level, ex.type === 'compound');
    const weekProg = calculateWeekProgression(base.baseSets, base.repRange, base.baseRir, selectedWeek);

    return {
      ...ex,
      sets: weekProg.sets,
      reps: weekProg.reps,
      rir: weekProg.rir,
      phaseLabel: weekProg.phaseLabel
    };
  });

  let cardioFinishers: CardioExercise[] = [];
  if (goal === 'fat_loss' || goal === 'fitness') {
    const cardioCount = duration >= 75 ? 3 : 2;[cite: 4]
    cardioFinishers = CARDIO_POOL.filter(c => c.minLevel !== 'advanced' || level === 'advanced').slice(0, cardioCount);
  }

  const weeks = [
    { weekNumber: 1, label: 'W1: Pondasi', phase: 'Pondasi' },
    { weekNumber: 2, label: 'W2: Volume Peak', phase: 'Volume' },
    { weekNumber: 3, label: 'W3: Intensity Peak', phase: 'Intensitas' },
    { weekNumber: 4, label: 'W4: Deload Recovery', phase: 'Deload' }
  ];

  return {
    meta: { goal, level, days, duration, equipment, selectedWeek, totalExercises: formattedExercises.length },
    exercises: formattedExercises,
    cardioFinishers,
    weeks
  };
}
