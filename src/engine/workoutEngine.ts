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

export interface ProgramExercise extends Exercise {
  sets: number;
  reps: string;
  rir: number;
}

export interface DaySchedule {
  dayNumber: number;
  dayName: string;
  targetMuscles: MuscleGroup[];
  exercises: ProgramExercise[];
}

// Master Database Pool Terorganisir (Diperluas untuk memenuhi target durasi 75+ menit)
export const EXERCISE_POOL: Exercise[] = [
  // --- FULL GYM: CHEST ---
  { id: 'bench_press', name: 'Barbell Bench Press', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg' },
  { id: 'incline_db_press', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8' },
  { id: 'dumbbell_fly', name: 'Dumbbell Chest Fly', muscleGroup: 'Chest', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/eozbDDA7E0w' },
  { id: 'cable_crossover', name: 'Cable Chest Crossover', muscleGroup: 'Chest', type: 'isolation', minLevel: 'intermediate', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/taI4XduLpTk' },
  { id: 'chest_dips_gym', name: 'Weighted Chest Dips', muscleGroup: 'Chest', type: 'compound', minLevel: 'intermediate', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As' },

  // --- FULL GYM: BACK ---
  { id: 'barbell_row', name: 'Barbell Bent-Over Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/VKFeB7jy8Mg' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc' },
  { id: 'seated_cable_row', name: 'Seated Cable Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74' },
  { id: 'single_arm_db_row', name: 'Single-Arm Dumbbell Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/pYcpY20QaE8' },
  { id: 'face_pull', name: 'Cable Face Pull', muscleGroup: 'Back', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/0Po47vvj9g4' },
  { id: 'tbar_row', name: 'T-Bar Row', muscleGroup: 'Back', type: 'compound', minLevel: 'intermediate', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/j3Igk5nyZE4' },

  // --- FULL GYM: SHOULDER ---
  { id: 'overhead_press', name: 'Overhead Military Press', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI' },
  { id: 'lateral_raise', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulder', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo' },
  { id: 'arnold_press', name: 'Arnold Dumbbell Press', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'intermediate', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/6Z15_WdXmVw' },
  { id: 'reverse_fly', name: 'Rear Delt Cable Fly', muscleGroup: 'Shoulder', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/lPt0GqwaqE8' },

  // --- FULL GYM: LEGS (QUAD, HAMSTRING, CALF) ---
  { id: 'barbell_squat', name: 'Barbell Back Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8' },
  { id: 'leg_press', name: 'Leg Press Machine', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ' },
  { id: 'romanian_deadlift', name: 'Barbell Romanian Deadlift', muscleGroup: 'Hamstring', type: 'compound', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM' },
  { id: 'lying_leg_curl', name: 'Lying Leg Curl Machine', muscleGroup: 'Hamstring', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/1Tq3QdYUuHs' },
  { id: 'leg_extension', name: 'Leg Extension Machine', muscleGroup: 'Quad', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/YyvSfVjQeL0' },
  { id: 'db_walking_lunge', name: 'Dumbbell Walking Lunge', muscleGroup: 'Quad', type: 'compound', minLevel: 'intermediate', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/D7KaRcUTQeE' },
  { id: 'calf_raise', name: 'Standing Calf Raise', muscleGroup: 'Calf', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/-M4-G8p8fmc' },

  // --- FULL GYM: ARMS & CORE ---
  { id: 'bicep_curl', name: 'Barbell Bicep Curl', muscleGroup: 'Bicep', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/kwG2ipFRgfo' },
  { id: 'db_hammer_curl', name: 'Dumbbell Hammer Curl', muscleGroup: 'Bicep', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4' },
  { id: 'preacher_curl', name: 'EZ-Bar Preacher Curl', muscleGroup: 'Bicep', type: 'isolation', minLevel: 'intermediate', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/fIWP-FRFNU0' },
  { id: 'tricep_pushdown', name: 'Tricep Cable Pushdown', muscleGroup: 'Tricep', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU' },
  { id: 'skull_crusher', name: 'EZ-Bar Skull Crusher', muscleGroup: 'Tricep', type: 'isolation', minLevel: 'intermediate', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM' },
  { id: 'cable_woodchopper', name: 'Cable Woodchopper', muscleGroup: 'Core', type: 'isolation', minLevel: 'beginner', equipment: 'full_gym', videoUrl: 'https://www.youtube.com/embed/pZapBMrjP4g' },

  // --- BODYWEIGHT ONLY: CHEST ---
  { id: 'push_up', name: 'Standard Push Up', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4' },
  { id: 'decline_pushup', name: 'Decline Feet-Elevated Push Up', muscleGroup: 'Chest', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/SKPab2YC8BE' },
  { id: 'incline_pushup', name: 'Incline Hands-Elevated Push Up', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/Z0bR_H_j50w' },
  { id: 'wide_pushup', name: 'Wide Grip Push Up', muscleGroup: 'Chest', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/rr6e1JM0L34' },

  // --- BODYWEIGHT ONLY: BACK ---
  { id: 'pull_up', name: 'Wide Pull Up', muscleGroup: 'Back', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
  { id: 'chin_up', name: 'Underhand Chin Up', muscleGroup: 'Back', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/b-ZTIs4B4p8' },
  { id: 'inverted_row', name: 'Inverted Bodyweight Row', muscleGroup: 'Back', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/hXTc1mDnC5c' },
  { id: 'superman_hold', name: 'Superman Back Extension', muscleGroup: 'Back', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/cc6UVRS7PW4' },
  { id: 'scapular_pullup', name: 'Scapular Pull Up', muscleGroup: 'Back', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/6eS-rRwb_a8' },

  // --- BODYWEIGHT ONLY: SHOULDER ---
  { id: 'pike_pushup', name: 'Pike Push Up', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/sposDXWEB0A' },
  { id: 'decline_pike_pushup', name: 'Feet Elevated Pike Push Up', muscleGroup: 'Shoulder', type: 'compound', minLevel: 'advanced', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/C8UeIsjRInE' },
  { id: 'arm_circles', name: 'Bodyweight Arm Circles', muscleGroup: 'Shoulder', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/140RTu1L28A' },

  // --- BODYWEIGHT ONLY: LEGS ---
  { id: 'air_squat', name: 'Bodyweight Air Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U' },
  { id: 'bulgarian_split_squat', name: 'Bodyweight Bulgarian Split Squat', muscleGroup: 'Quad', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE' },
  { id: 'bw_lunges', name: 'Alternating Bodyweight Lunges', muscleGroup: 'Quad', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/L8fvypPrzzs' },
  { id: 'glute_bridge', name: 'Single-Leg Glute Bridge', muscleGroup: 'Hamstring', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/W_598_vP-A0' },
  { id: 'single_leg_rdl_bw', name: 'Bodyweight Single-Leg RDL', muscleGroup: 'Hamstring', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/p3_Y8S1zR-E' },
  { id: 'bw_calf_raise', name: 'Single-Leg Standing Calf Raise', muscleGroup: 'Calf', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/bL_A35oX_4s' },

  // --- BODYWEIGHT ONLY: ARMS & CORE ---
  { id: 'diamond_pushup', name: 'Diamond Push Up (Tricep)', muscleGroup: 'Tricep', type: 'compound', minLevel: 'intermediate', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/J0DnG1_S92I' },
  { id: 'bench_dip', name: 'Bench Dip', muscleGroup: 'Tricep', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/0326dy_-CzM' },
  { id: 'bw_bicep_chinup', name: 'Chin Up Isometric Hold (Bicep)', muscleGroup: 'Bicep', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
  { id: 'plank', name: 'Forearm Plank', muscleGroup: 'Core', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw' },
  { id: 'leg_raise', name: 'Lying Leg Raise', muscleGroup: 'Core', type: 'isolation', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/JB2oyawG9KI' },
  { id: 'mountain_climbers', name: 'Mountain Climber Core', muscleGroup: 'Core', type: 'compound', minLevel: 'beginner', equipment: 'bodyweight', videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM' },
];

export function getAvailableDays(level: ExperienceLevel): number[] {
  if (level === 'beginner') return [2, 3, 4, 5];
  if (level === 'intermediate') return [2, 3, 4, 5, 6];
  return [2, 3, 4, 5, 6, 7];
}

// Pemetaan Matrix Split Harian Lengkap (Termasuk 6 & 7 Hari)
function getSplitMatrix(days: number): { dayName: string; targetMuscles: MuscleGroup[] }[] {
  switch (days) {
    case 2:
      return [
        { dayName: 'Hari 1 - Full Body A', targetMuscles: ['Chest', 'Back', 'Quad', 'Core'] },
        { dayName: 'Hari 2 - Full Body B', targetMuscles: ['Shoulder', 'Hamstring', 'Bicep', 'Tricep'] }
      ];
    case 3:
      return [
        { dayName: 'Hari 1 - Push Focus', targetMuscles: ['Chest', 'Shoulder', 'Tricep'] },
        { dayName: 'Hari 2 - Pull Focus', targetMuscles: ['Back', 'Bicep'] },
        { dayName: 'Hari 3 - Leg & Core', targetMuscles: ['Quad', 'Hamstring', 'Calf', 'Core'] }
      ];
    case 4:
      return [
        { dayName: 'Hari 1 - Upper Body A', targetMuscles: ['Chest', 'Back', 'Shoulder'] },
        { dayName: 'Hari 2 - Lower Body A', targetMuscles: ['Quad', 'Hamstring', 'Calf'] },
        { dayName: 'Hari 3 - Upper Body B', targetMuscles: ['Chest', 'Back', 'Bicep', 'Tricep'] },
        { dayName: 'Hari 4 - Lower Body & Core', targetMuscles: ['Quad', 'Hamstring', 'Core'] }
      ];
    case 5:
      return [
        { dayName: 'Hari 1 - Push Focus', targetMuscles: ['Chest', 'Shoulder', 'Tricep'] },
        { dayName: 'Hari 2 - Pull Focus', targetMuscles: ['Back', 'Bicep'] },
        { dayName: 'Hari 3 - Leg Focus', targetMuscles: ['Quad', 'Hamstring', 'Calf'] },
        { dayName: 'Hari 4 - Upper Body Hypertrophy', targetMuscles: ['Chest', 'Back', 'Shoulder', 'Bicep'] },
        { dayName: 'Hari 5 - Lower Body & Core', targetMuscles: ['Quad', 'Hamstring', 'Calf', 'Core'] }
      ];
    case 6:
      return [
        { dayName: 'Hari 1 - Push A (Dada/Bahu/Tricep)', targetMuscles: ['Chest', 'Shoulder', 'Tricep'] },
        { dayName: 'Hari 2 - Pull A (Punggung/Bicep)', targetMuscles: ['Back', 'Bicep'] },
        { dayName: 'Hari 3 - Leg A (Paha/Betis)', targetMuscles: ['Quad', 'Hamstring', 'Calf'] },
        { dayName: 'Hari 4 - Push B (Bahu/Dada Focus)', targetMuscles: ['Shoulder', 'Chest', 'Tricep'] },
        { dayName: 'Hari 5 - Pull B (Punggung/Bicep Focus)', targetMuscles: ['Back', 'Bicep'] },
        { dayName: 'Hari 6 - Leg B & Core (Kaki/Perut)', targetMuscles: ['Quad', 'Hamstring', 'Calf', 'Core'] }
      ];
    case 7:
    default:
      return [
        { dayName: 'Hari 1 - Push Focus', targetMuscles: ['Chest', 'Shoulder', 'Tricep'] },
        { dayName: 'Hari 2 - Pull Focus', targetMuscles: ['Back', 'Bicep'] },
        { dayName: 'Hari 3 - Leg Focus', targetMuscles: ['Quad', 'Hamstring', 'Calf'] },
        { dayName: 'Hari 4 - Upper Body', targetMuscles: ['Chest', 'Back', 'Shoulder'] },
        { dayName: 'Hari 5 - Lower Body', targetMuscles: ['Quad', 'Hamstring', 'Calf'] },
        { dayName: 'Hari 6 - Arms & Shoulders Focus', targetMuscles: ['Shoulder', 'Bicep', 'Tricep'] },
        { dayName: 'Hari 7 - Core & Conditioning', targetMuscles: ['Core', 'Quad', 'Back'] }
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

  switch (week) {
    case 1:
      return { sets: baseSets, reps: repRange, rir: baseRir };
    case 2:
      return { sets: baseSets + 1, reps: repRange, rir: baseRir };
    case 3:
      return { sets: baseSets + 1, reps: repRange, rir: Math.max(0, baseRir - 1) };
    case 4:
      return { sets: 2, reps: repRange, rir: Math.min(4, baseRir + 2) };
    default:
      return { sets: baseSets, reps: repRange, rir: baseRir };
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
  const splits = getSplitMatrix(days);
  const exerciseCapPerDay = duration <= 45 ? 3 : duration === 60 ? 4 : 5;

  const availablePool = EXERCISE_POOL.filter(ex => {
    if (ex.equipment !== equipment) return false;
    if (ex.isAdvancedOnly && level !== 'advanced') return false;
    return true;
  });

  const schedule: DaySchedule[] = splits.map((split, index) => {
    let matchingExercises = availablePool.filter(ex => split.targetMuscles.includes(ex.muscleGroup));
    
    // Fallback jika gerakan target kurang dari cap durasi
    if (matchingExercises.length < exerciseCapPerDay) {
      const remainingPool = availablePool.filter(ex => !matchingExercises.includes(ex));
      matchingExercises = [...matchingExercises, ...remainingPool];
    }

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
