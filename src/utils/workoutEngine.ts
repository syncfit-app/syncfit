// src/utils/workoutEngine.ts

export type Goal = 'Hypertrophy' | 'Strength' | 'Fat Loss' | 'General Fitness';
export type Experience = 'Pemula' | 'Menengah' | 'Mahir';

export interface GeneratedExercise {
  name: string;
  sets: number;
  reps: string;
  rir: string; // Detail RIR ditambahkan
  rest: string;
  note: string;
  videoUrl: string;
  isCompound: boolean;
}

export interface DayPlan {
  dayLabel: string;
  name: string;
  type: 'Workout' | 'Rest';
  isToday: boolean;
  exercises: GeneratedExercise[];
}

// ==========================================
// KATEGORI GERAKAN (STRICT PPL)
// ==========================================
const EXERCISES = {
  Push: [
    { name: "Barbell Bench Press", isCompound: true, note: "Fokus pada rentang gerak penuh." },
    { name: "Overhead Press", isCompound: true, note: "Jangan melengkungkan punggung berlebih." },
    { name: "Incline Dumbbell Press", isCompound: true, note: "Dorong beban lurus ke atas." },
    { name: "Dips", isCompound: true, note: "Condongkan badan sedikit ke depan." },
    { name: "Lateral Raise", isCompound: false, note: "Angkat ke samping, siku sedikit ditekuk." },
    { name: "Tricep Pushdown", isCompound: false, note: "Kunci siku di samping rusuk." },
    { name: "Skullcrusher", isCompound: false, note: "Turunkan beban ke arah dahi." }
  ],
  Pull: [
    { name: "Pull Up", isCompound: true, note: "Tarik siku ke bawah pinggang." },
    { name: "Barbell Row", isCompound: true, note: "Jaga punggung lurus sejajar lantai." },
    { name: "Lat Pulldown", isCompound: true, note: "Tarik palang ke dada atas." },
    { name: "Seated Cable Row", isCompound: true, note: "Tarik ke perut, remas belikat." },
    { name: "Face Pull", isCompound: false, note: "Tarik ke arah dahi untuk bahu belakang." },
    { name: "Barbell Bicep Curl", isCompound: false, note: "Jangan mengayunkan badan." },
    { name: "Hammer Curl", isCompound: false, note: "Genggaman netral untuk brachialis." }
  ],
  Legs: [
    { name: "Barbell Squat", isCompound: true, note: "Turun hingga paha sejajar lantai." },
    { name: "Romanian Deadlift", isCompound: true, note: "Dorong pinggul ke belakang." },
    { name: "Leg Press", isCompound: true, note: "Jangan kunci lutut di puncak gerakan." },
    { name: "Bulgarian Split Squat", isCompound: true, note: "Jaga dada tetap tegak." },
    { name: "Leg Extension", isCompound: false, note: "Tahan 1 detik di puncak kontraksi." },
    { name: "Seated Leg Curl", isCompound: false, note: "Fokus pada kontraksi hamstring." },
    { name: "Standing Calf Raise", isCompound: false, note: "Fokus peregangan di bawah." }
  ]
};

// ==========================================
// LOGIKA VOLUME, RIR, & INTENSITAS (PT LOGIC)
// ==========================================
const getRIR = (goal: Goal, exp: Experience, isCompound: boolean): string => {
  if (exp === 'Pemula') return 'RIR 3'; // Pemula butuh buffer aman
  if (goal === 'Strength') return isCompound ? 'RIR 1-2' : 'RIR 2';
  if (goal === 'Hypertrophy') return exp === 'Mahir' ? 'RIR 0-1' : 'RIR 1-2';
  return 'RIR 2';
};

const getVolumeConfig = (goal: Goal, isCompound: boolean) => {
  switch (goal) {
    case 'Strength': return { reps: isCompound ? '3-6' : '6-10', rest: '120s' };
    case 'Fat Loss': return { reps: isCompound ? '8-12' : '12-15', rest: '60s' };
    default: return { reps: isCompound ? '6-10' : '10-15', rest: '90s' };
  }
};

const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// ==========================================
// GENERATOR PROGRAM
// ==========================================
export const generateWorkoutPlan = (
  exp: Experience, 
  days: number, 
  goal: Goal
): DayPlan[] => {
  const plan: DayPlan[] = [];
  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  
  // Penyesuaian jumlah gerakan per sesi berdasarkan pengalaman
  const exerciseCount = exp === 'Pemula' ? 4 : exp === 'Menengah' ? 5 : 6;
  
  let splitPattern: string[] = [];
  if (days === 2) splitPattern = ['Full Body', 'Rest', 'Rest', 'Full Body', 'Rest', 'Rest', 'Rest'];
  else if (days === 3) splitPattern = ['Full Body', 'Rest', 'Full Body', 'Rest', 'Full Body', 'Rest', 'Rest'];
  else if (days === 4) splitPattern = ['Upper A', 'Lower A', 'Rest', 'Upper B', 'Lower B', 'Rest', 'Rest'];
  else if (days === 5) splitPattern = ['Upper A', 'Lower A', 'Rest', 'Push', 'Pull', 'Legs', 'Rest'];
  else splitPattern = ['Push', 'Pull', 'Legs', 'Rest', 'Push', 'Pull', 'Legs'];

  const getExercisesForSplit = (splitName: string): GeneratedExercise[] => {
    let rawPool: any[] = [];
    
    // Klasifikasi ketat agar Push != Pull, dan Lower == Legs
    if (splitName.includes('Push')) {
      rawPool = [...EXERCISES.Push];
    } else if (splitName.includes('Pull')) {
      rawPool = [...EXERCISES.Pull];
    } else if (splitName.includes('Upper')) {
      // Upper mengambil kombinasi seimbang Push & Pull
      const halfCount = Math.ceil(exerciseCount / 2);
      rawPool = [
        ...shuffleArray(EXERCISES.Push).slice(0, halfCount),
        ...shuffleArray(EXERCISES.Pull).slice(0, exerciseCount - halfCount)
      ];
    } else if (splitName.includes('Lower') || splitName.includes('Legs')) {
      rawPool = [...EXERCISES.Legs];
    } else { // Full Body
      rawPool = [
        ...shuffleArray(EXERCISES.Push).slice(0, 2),
        ...shuffleArray(EXERCISES.Pull).slice(0, 2),
        ...shuffleArray(EXERCISES.Legs).slice(0, 2)
      ];
    }

    let shuffled = shuffleArray(rawPool);
    // Compound selalu diutamakan di awal sesi
    shuffled.sort((a, b) => (a.isCompound === b.isCompound ? 0 : a.isCompound ? -1 : 1));
    const selectedExercises = shuffled.slice(0, exerciseCount);

    return selectedExercises.map(ex => {
      const config = getVolumeConfig(goal, ex.isCompound);
      return {
        name: ex.name,
        isCompound: ex.isCompound,
        sets: 3,
        reps: config.reps,
        rir: getRIR(goal, exp, ex.isCompound),
        rest: config.rest,
        note: ex.note,
        videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg" // Placeholder demo
      };
    });
  };

  splitPattern.forEach((splitName, idx) => {
    const isRest = splitName === 'Rest';
    plan.push({
      dayLabel: weekDays[idx],
      name: isRest ? 'Rest Day' : splitName,
      type: isRest ? 'Rest' : 'Workout',
      isToday: idx === 0, // Sen selalu aktif di awal (bisa diubah nanti di UI)
      exercises: isRest ? [] : getExercisesForSplit(splitName)
    });
  });

  return plan;
};
