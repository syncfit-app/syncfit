// src/engine/workoutEngine.ts

export type FitnessGoal = 'strength' | 'hypertrophy' | 'recomp' | 'fat_loss' | 'fitness';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type SessionDuration = 45 | 60 | 75;
export type EquipmentType = 'full_gym' | 'bodyweight';

export type MuscleGroup = 'Chest' | 'Back' | 'Shoulder' | 'Bicep' | 'Tricep' | 'Quad' | 'Hamstring' | 'Calf' | 'Core';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  type: 'compound' | 'isolation';
  minLevel: ExperienceLevel;
  equipment: EquipmentType;
  isAdvancedOnly?: boolean;
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
}

export interface DaySchedule {
  dayNumber: number;
  dayName: string; // Misal: "Hari 1 - Push", "Hari 2 - Pull"
  targetMuscles: MuscleGroup[];
  exercises: ProgramExercise[];
}

// Master Database Exercise Pool
export const EXERCISE_POOL: Exercise[] = [
  // FULL GYM - Chest
  { id: 'bench_press', name: 'Barbell Bench Press', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg' },
  { id: 'incline_db_press', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8' },
  { id: 'dumbbell_fly', name: 'Dumbbell Chest Fly', muscleGroup: 'Chest', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/eozbDDA7E0w' },

  // FULL GYM - Back
  { id: 'barbell_row', name: 'Barbell Bent-Over Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/VKFeB7jy8Mg' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc' },

  // FULL GYM - Shoulder
  { id: 'overhead_press', name: 'Overhead Military Press', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI' },
  { id: 'lateral_raise', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulder', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo' },

  // FULL GYM - Legs
  { id: 'barbell_squat', name: 'Barbell Back Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscleGroup: 'Hamstring', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM' },
  { id: 'leg_extension', name: 'Leg Extension', muscleGroup: 'Quad', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/YyvSfVjQeL0' },
  { id: 'calf_raise', name: 'Standing Calf Raise', muscleGroup: 'Calf', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/-M4-G8p8fmc' },

  // FULL GYM - Arms
  { id: 'bicep_curl', name: 'Barbell Bicep Curl', muscleGroup: 'Bicep', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/kwG2ipFRgfo' },
  { id: 'tricep_pushdown', name: 'Tricep Cable Pushdown', muscleGroup: 'Tricep', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU' },

  // BODYWEIGHT ONLY
  { id: 'push_up', name: 'Standard Push Up', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4' },
  { id: 'decline_pushup', name: 'Decline Push Up', muscleGroup: 'Chest', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/SKPab2YC8BE' },
  { id: 'pull_up', name: 'Pull Up', muscleGroup: 'Back', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
  { id: 'inverted_row', name: 'Inverted Bodyweight Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/hXTc1mDnC5c' },
  { id: 'pike_pushup', name: 'Pike Push Up', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/sposDXWEB0A' },
  { id: 'air_squat', name: 'Air Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U' },
  { id: 'bulgarian_split_squat', name: 'Bodyweight Split Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE' },
  { id: 'bench_dip', name: 'Bench Dip', muscleGroup: 'Tricep', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/0326dy_-CzM' },
  { id: 'plank', name: 'Forearm Plank', muscleGroup: 'Core', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw' },
];

export const CARDIO_POOL: CardioExercise[] = [
  { id: 'jumping_jack', name: 'Jumping Jack', minLevel: 'beginner', videoUrl: 'https://www.youtube.com/embed/iSSAk4XCsRA' },
  { id: 'high_knees', name: 'High Knees', minLevel: 'beginner', videoUrl: 'https://www.youtube.com/embed/oDdkytliOqE' },
  { id: 'mountain_climber', name: 'Mountain Climber', minLevel: 'intermediate', videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM' },
];

export function getAvailableDays(level: ExperienceLevel): number[] {
  if (level === 'beginner') return [2, 3, 4, 5];
  if (level === 'intermediate') return [2, 3, 4, 5, 6];
  return [2, 3, 4, 5, 6, 7];
}

// Pemetaan Split Harian Berdasarkan Jumlah Hari/Minggu
function getSplitMatrix(days: number): { dayName: string; targetMuscles: MuscleGroup[] }[] {
  switch (days) {
    case 2:
      return [
        { dayName: 'Hari 1 - Full Body A', targetMuscles: ['Chest', 'Back', 'Quad', 'Core'] },
        { dayName: 'Hari 2 - Full Body B', targetMuscles: ['Shoulder', 'Hamstring', 'Bicep', 'Tricep'] }
      ];
    case 3:
      return [
        { dayName: 'Hari 1 - Push (Dada/Bahu/Tricep)', targetMuscles: ['Chest', 'Shoulder', 'Tricep'] },
        { dayName: 'Hari 2 - Pull (Punggung/Bicep)', targetMuscles: ['Back', 'Bicep'] },
        { dayName: 'Hari 3 - Legs & Core (Kaki/Perut)', targetMuscles: ['Quad', 'Hamstring', 'Calf', 'Core'] }
      ];
    case 4:
      return [
        { dayName: 'Hari 1 - Upper Body (Tubuh Atas)', targetMuscles: ['Chest', 'Back', 'Shoulder'] },
        { dayName: 'Hari 2 - Lower Body (Tubuh Bawah)', targetMuscles: ['Quad', 'Hamstring', 'Calf'] },
        { dayName: 'Hari 3 - Push & Arms', targetMuscles: ['Chest', 'Shoulder', 'Tricep', 'Bicep'] },
        { dayName: 'Hari 4 - Pull & Core', targetMuscles: ['Back', 'Core'] }
      ];
    case 5:
    default:
      return [
        { dayName: 'Hari 1 - Push Focus', targetMuscles: ['Chest', 'Shoulder', 'Tricep'] },
        { dayName: 'Hari 2 - Pull Focus', targetMuscles: ['Back', 'Bicep'] },
        { dayName: 'Hari 3 - Leg Focus', targetMuscles: ['Quad', 'Hamstring', 'Calf'] },
        { dayName: 'Hari 4 - Upper Body Hypertrophy', targetMuscles: ['Chest', 'Back', 'Shoulder'] },
        { dayName: 'Hari 5 - Lower Body & Core', targetMuscles: ['Quad', 'Hamstring', 'Core'] }
      ];
  }
}

// Formula Progresi Mingguan (W1 -> W4)
function getWeeklyProgression(goal: FitnessGoal, level: ExperienceLevel, isCompound: boolean, week: number) {
  let repRange = isCompound ? '6-10' : '10-15';
  let baseSets = 3;
  let baseRir = 3;

  if (goal === 'strength') {
    repRange = isCompound ? '3-6' : '6-10';
    baseRir = level === 'advanced' ? 1 : 2;
  } else if (goal === 'hypertrophy' || goal === 'recomp') {
    repRange = isCompound ? '6-10' : '10-15';
    baseRir = level === 'advanced' ? 1 : 2;
  } else {
    repRange = isCompound ? '8-12' : '12-15';
    baseRir = 3;
  }

  // Modifikasi berdasar Minggu
  switch (week) {
    case 1: // Pondasi
      return { sets: baseSets, reps: repRange, rir: baseRir };
    case 2: // Volume
      return { sets: baseSets + 1, reps: repRange, rir: baseRir };
    case 3: // Intensitas Peak
      return { sets: baseSets + 1, reps: repRange, rir: Math.max(0, baseRir - 1) };
    case 4: // Deload
      return { sets: 2, reps: repRange, rir: Math.min(4, baseRir + 2) };
    default:
      return { sets: baseSets, reps: repRange, rir: baseRir };
  }
}

// Main Program Generator Engine
export function generateWorkoutPlan(
  goal: FitnessGoal,
  level: ExperienceLevel,
  days: number,
  duration: SessionDuration,
  equipment: EquipmentType,
  selectedWeek: number = 1
) {
  const splits = getSplitMatrix(days);
  const exerciseCapPerDay = duration <= 45 ? 3 : duration === 60 ? 4 : 5;

  // Filter Pool Berdasarkan Peralatan dan Level
  const availablePool = EXERCISE_POOL.filter(ex => {
    if (ex.equipment !== equipment) return false;
    if (ex.isAdvancedOnly && level !== 'advanced') return false;
    return true;
  });

  // Generasi Jadwal Per Hari
  const schedule: DaySchedule[] = splits.map((split, index) => {
    // Cari gerakan yang sesuai dengan kelompok otot hari tersebut
    const matchingExercises = availablePool.filter(ex => split.targetMuscles.includes(ex.muscleGroup));
    
    // Urutkan: Compound di awal, Isolation di akhir (Layer C3)
    const compounds = matchingExercises.filter(ex => ex.type === 'compound');
    const isolations = matchingExercises.filter(ex => ex.type === 'isolation');

    const selected = [...compounds, ...isolations].slice(0, exerciseCapPerDay);

    const formattedExercises: ProgramExercise[] = selected.map(ex => {
      const vol = getWeeklyProgression(goal, level, ex.type === 'compound', selectedWeek);
      return {
        ...ex,
        sets: vol.sets,
        reps: vol.reps,
        rir: vol.rir
      };
    });

    return {
      dayNumber: index + 1,
      dayName: split.dayName,
      targetMuscles: split.targetMuscles,
      exercises: formattedExercises
    };
  });

  const weeks = [
    { weekNumber: 1, label: 'W1: Pondasi', description: 'Volume Baseline & Teknik' },
    { weekNumber: 2, label: 'W2: Volume Peak', description: 'Penambahan Sets (+1 Set)' },
    { weekNumber: 3, label: 'W3: Intensity Peak', description: 'RIR Dekat Failure (-1 RIR)' },
    { weekNumber: 4, label: 'W4: Deload', description: 'Pemulihan Sendi (2 Sets)' }
  ];

  return {
    meta: { goal, level, days, duration, equipment, selectedWeek },
    weeks,
    schedule
  };
}
