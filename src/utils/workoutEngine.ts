// src/utils/workoutEngine.ts

export type Goal = 'Hypertrophy' | 'Strength' | 'Fat Loss' | 'General Fitness';
export type Experience = 'Pemula' | 'Menengah' | 'Mahir';

export interface GeneratedExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  note: string;
  videoUrl: string;
}

export interface DayPlan {
  dayLabel: string;
  name: string;
  type: 'Workout' | 'Rest';
  isToday: boolean;
  exercises: GeneratedExercise[];
}

// ==========================================
// LAYER B: EXERCISE POOL (Diperluas)
// ==========================================
const EXERCISE_POOL = {
  Chest: [
    { name: "Barbell Bench Press", isCompound: true, note: "Fokus pada rentang gerak penuh." },
    { name: "Incline Dumbbell Press", isCompound: true, note: "Dorong beban lurus ke atas." },
    { name: "Cable Crossover", isCompound: false, note: "Fokus pada kontraksi di dada tengah." },
    { name: "Push Up", isCompound: true, note: "Jaga core tetap aktif." },
    { name: "Dips", isCompound: true, note: "Condongkan badan ke depan untuk target dada." }
  ],
  Back: [
    { name: "Pull Up", isCompound: true, note: "Tarik siku ke bawah pinggang." },
    { name: "Lat Pulldown", isCompound: true, note: "Tarik palang ke dada atas." },
    { name: "Barbell Row", isCompound: true, note: "Jaga punggung lurus sejajar lantai." },
    { name: "Seated Cable Row", isCompound: true, note: "Tarik ke perut, remas belikat." },
    { name: "Face Pull", isCompound: false, note: "Tarik ke arah dahi untuk bahu belakang." }
  ],
  Legs: [
    { name: "Barbell Squat", isCompound: true, note: "Turun hingga paha sejajar lantai." },
    { name: "Leg Press", isCompound: true, note: "Jangan kunci lutut di puncak gerakan." },
    { name: "Romanian Deadlift", isCompound: true, note: "Dorong pinggul ke belakang." },
    { name: "Leg Extension", isCompound: false, note: "Tahan 1 detik di puncak kontraksi." },
    { name: "Standing Calf Raise", isCompound: false, note: "Fokus peregangan di bawah." }
  ],
  Shoulder: [
    { name: "Overhead Press", isCompound: true, note: "Jangan melengkungkan punggung berlebih." },
    { name: "Lateral Raise", isCompound: false, note: "Angkat ke samping, siku sedikit ditekuk." },
    { name: "Front Raise", isCompound: false, note: "Gunakan beban ringan untuk kontrol." }
  ],
  Arms: [
    { name: "Barbell Bicep Curl", isCompound: false, note: "Jangan mengayunkan badan." },
    { name: "Hammer Curl", isCompound: false, note: "Genggaman netral." },
    { name: "Tricep Pushdown", isCompound: false, note: "Kunci siku di samping rusuk." },
    { name: "Skullcrusher", isCompound: false, note: "Turunkan beban ke arah dahi." }
  ],
  Cardio: [
    { name: "Burpee", isCompound: true, note: "Lakukan secepat mungkin dengan form baik." },
    { name: "Mountain Climber", isCompound: true, note: "Jaga pinggul tetap rendah." },
    { name: "Jumping Jack", isCompound: true, note: "Pemanasan seluruh tubuh." }
  ]
};

// ==========================================
// LAYER D: INTENSITAS & VOLUME (RIR & Reps)
// ==========================================
const getVolumeConfig = (goal: Goal, isCompound: boolean) => {
  switch (goal) {
    case 'Strength': return { reps: isCompound ? '3-6' : '6-10', rest: '120s' };
    case 'Fat Loss': return { reps: isCompound ? '8-12' : '12-15', rest: '60s' };
    default: return { reps: isCompound ? '6-10' : '10-15', rest: '90s' }; // Hypertrophy/Gen Fit
  }
};

// ==========================================
// LAYER A & C: ALGORITMA GENERATOR PROGRAM
// ==========================================
export const generateWorkoutPlan = (
  exp: Experience, 
  days: number, 
  goal: Goal
): DayPlan[] => {
  const plan: DayPlan[] = [];
  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  
  // Tentukan Pola Split
  let splitPattern: string[] = [];
  if (days === 2) splitPattern = ['Full Body', 'Rest', 'Rest', 'Full Body', 'Rest', 'Rest', 'Rest'];
  else if (days === 3) splitPattern = ['Full Body', 'Rest', 'Full Body', 'Rest', 'Full Body', 'Rest', 'Rest'];
  else if (days === 4) splitPattern = ['Upper A', 'Lower A', 'Rest', 'Upper B', 'Lower B', 'Rest', 'Rest'];
  else if (days === 5) splitPattern = ['Upper A', 'Lower A', 'Rest', 'Push', 'Pull', 'Legs', 'Rest'];
  else splitPattern = ['Push', 'Pull', 'Legs', 'Rest', 'Push', 'Pull', 'Legs']; // 6 Days

  const getExercisesForSplit = (splitName: string): GeneratedExercise[] => {
    let targetMuscles: string[] = [];
    if (splitName.includes('Upper') || splitName === 'Push' || splitName === 'Pull') {
      targetMuscles = ['Chest', 'Back', 'Shoulder', 'Arms'];
    } else if (splitName.includes('Lower') || splitName === 'Legs') {
      targetMuscles = ['Legs', 'Legs', 'Legs']; // Bobot lebih banyak di kaki
    } else {
      targetMuscles = ['Chest', 'Back', 'Legs', 'Shoulder']; // Full body
    }

    const exercises: GeneratedExercise[] = [];
    targetMuscles.forEach(muscle => {
      const pool = EXERCISE_POOL[muscle as keyof typeof EXERCISE_POOL];
      // Ambil 2 gerakan acak dari otot target (simulasi logika Layer C)
      const selected = [pool[0], pool[1]]; 
      
      selected.forEach(ex => {
        const config = getVolumeConfig(goal, ex.isCompound);
        exercises.push({
          name: ex.name,
          sets: 3,
          reps: config.reps,
          rest: config.rest,
          note: ex.note,
          videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg"
        });
      });
    });

    return exercises;
  };

  splitPattern.forEach((splitName, idx) => {
    const isRest = splitName === 'Rest';
    plan.push({
      dayLabel: weekDays[idx],
      name: isRest ? 'Rest Day' : splitName,
      type: isRest ? 'Rest' : 'Workout',
      isToday: idx === 0,
      exercises: isRest ? [] : getExercisesForSplit(splitName)
    });
  });

  return plan;
};
