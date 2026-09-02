// src/utils/workoutEngine.ts

export type Experience = 'Pemula' | 'Menengah' | 'Mahir';
export type Goal = 'Hypertrophy' | 'Strength' | 'Fat Loss' | 'General Fitness';

export interface GeneratedExercise {
  name: string;
  sets: number;
  reps: string;
  rir?: string;
  rest: string;
  videoUrl?: string;
  note?: string;
  isStatic?: boolean; // Menandakan gerakan berbasis durasi (waktu)
}

export interface DayPlan {
  name: string;
  type: 'Workout' | 'Rest';
  exercises: GeneratedExercise[];
}

// Database Gerakan Utama
const EXERCISE_DB: Record<string, GeneratedExercise[]> = {
  Push: [
    { name: 'Barbell Bench Press', sets: 3, reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/embed/rxD321l2svE', note: 'Turunkan beban perlahan sampai dada, dorong kuat.' },
    { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/embed/QAQ64hK4Xxs', note: 'Jaga core tetap kencang, jangan melengkungkan punggung berlebih.' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8', note: 'Sudut bangku 30-45 derajat.' },
    { name: 'Push-Ups', sets: 3, reps: '10-15', rest: '60s', videoUrl: '', note: 'Jaga tubuh lurus dari kepala hingga tumit.' },
    { name: 'Dips', sets: 3, reps: '8-12', rest: '90s', videoUrl: '', note: 'Condongkan badan ke depan untuk fokus dada.' },
    { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '60s', videoUrl: '', note: 'Angkat beban ke samping tidak lebih tinggi dari bahu.' },
    { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '60s', videoUrl: '', note: 'Kunci siku di samping badan.' },
    { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', rest: '60s', videoUrl: '', note: 'Fokus pada regangan tricep (long head).' }
  ],
  Pull: [
    { name: 'Barbell Row', sets: 3, reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/embed/9efgcAjQe7E', note: 'Tarik bar ke arah pusar, jepit belikat di puncak gerakan.' },
    { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/embed/JGeYUNf4eEM', note: 'Tarik menggunakan siku, bukan telapak tangan.' },
    { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '60s', videoUrl: '', note: 'Fokus pada otot bahu belakang.' },
    { name: 'Pull-Ups', sets: 3, reps: '6-10', rest: '90s', videoUrl: '', note: 'Tarik tubuh hingga dagu melewati bar.' },
    { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '60s', videoUrl: '', note: 'Tarik ke arah perut bawah, jaga punggung tegak.' },
    { name: 'Bicep Curls', sets: 3, reps: '10-15', rest: '60s', videoUrl: '', note: 'Kunci siku di samping, fokus pada kontraksi bicep.' },
    { name: 'Hammer Curls', sets: 3, reps: '10-15', rest: '60s', videoUrl: '', note: 'Gunakan grip netral.' },
    { name: 'Dumbbell Shrugs', sets: 3, reps: '12-15', rest: '60s', videoUrl: '', note: 'Angkat bahu ke arah telinga, tahan di puncak.' }
  ],
  Legs: [
    { name: 'Squat', sets: 3, reps: '6-8', rest: '120s', videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8', note: 'Turun sampai sejajar lutut atau lebih dalam.' },
    { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM', note: 'Dorong pinggul ke belakang, rasakan tarikan paha belakang.' },
    { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90s', videoUrl: '', note: 'Jangan kunci lutut sepenuhnya saat beban di atas.' },
    { name: 'Walking Lunges', sets: 3, reps: '10-12', rest: '90s', videoUrl: '', note: 'Jaga torso tegak, lutut belakang mendekati lantai.' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '8-10', rest: '90s', videoUrl: '', note: 'Gunakan bangku untuk kaki belakang.' },
    { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '60s', videoUrl: '', note: 'Fokus kontraksi paha depan.' },
    { name: 'Leg Curls', sets: 3, reps: '10-15', rest: '60s', videoUrl: '', note: 'Tarik tumit ke arah glutes dengan kontrol.' },
    { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '60s', videoUrl: '', note: 'Tahan 1 detik di puncak regangan.' }
  ],
  Core: [
    { name: 'Plank', sets: 3, reps: '45s', rest: '60s', videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw', note: 'Jaga tubuh lurus, kencangkan perut dan glutes.', isStatic: true },
    { name: 'Side Plank', sets: 3, reps: '30s', rest: '60s', videoUrl: '', note: 'Lakukan untuk kedua sisi bergantian.', isStatic: true },
    { name: 'Bicycle Crunches', sets: 3, reps: '20', rest: '60s', videoUrl: '', note: 'Putar bahu, bukan leher. Siku ke lutut berlawanan.' },
    { name: 'Wall Sit', sets: 3, reps: '45s', rest: '60s', videoUrl: '', note: 'Punggung rata di dinding, lutut 90 derajat.', isStatic: true },
    { name: 'Hanging Leg Raises', sets: 3, reps: '10-15', rest: '60s', videoUrl: '', note: 'Angkat kaki lurus ke depan menggunakan perut bawah.' },
    { name: 'Russian Twists', sets: 3, reps: '20', rest: '60s', videoUrl: '', note: 'Putar dari pinggang.' },
    { name: 'Ab Wheel Rollouts', sets: 3, reps: '8-12', rest: '90s', videoUrl: '', note: 'Jaga punggung tidak melengkung saat maju.' },
    { name: 'Crunches', sets: 3, reps: '15-20', rest: '60s', videoUrl: '', note: 'Fokus kontraksi perut atas.' }
  ]
};

// Helper untuk menyusun Kombinasi Upper, Lower, dan Full Body secara seimbang
const getUpperPool = (alt: boolean = false): GeneratedExercise[] => {
  const push = alt ? [...EXERCISE_DB.Push].reverse() : EXERCISE_DB.Push;
  const pull = alt ? [...EXERCISE_DB.Pull].reverse() : EXERCISE_DB.Pull;
  return [
    push[0], pull[0], push[1], pull[1], 
    push[2], pull[2], push[5], pull[5], 
    push[6], pull[6]
  ].filter(Boolean);
};

const getLowerPool = (alt: boolean = false): GeneratedExercise[] => {
  const legs = alt ? [...EXERCISE_DB.Legs].reverse() : EXERCISE_DB.Legs;
  const core = alt ? [...EXERCISE_DB.Core].reverse() : EXERCISE_DB.Core;
  return [
    legs[0], legs[1], legs[2], legs[3], 
    legs[4], legs[5], legs[7], core[0], 
    core[1], core[2]
  ].filter(Boolean);
};

const getFullBodyPool = (variant: 'A' | 'B' | 'C'): GeneratedExercise[] => {
  if (variant === 'A') {
    return [EXERCISE_DB.Legs[0], EXERCISE_DB.Push[0], EXERCISE_DB.Pull[0], EXERCISE_DB.Legs[1], EXERCISE_DB.Push[1], EXERCISE_DB.Pull[2], EXERCISE_DB.Core[0], EXERCISE_DB.Push[5]];
  } else if (variant === 'B') {
    return [EXERCISE_DB.Legs[2], EXERCISE_DB.Pull[1], EXERCISE_DB.Push[2], EXERCISE_DB.Legs[3], EXERCISE_DB.Pull[3], EXERCISE_DB.Push[3], EXERCISE_DB.Core[2], EXERCISE_DB.Pull[5]];
  } else {
    return [EXERCISE_DB.Legs[4], EXERCISE_DB.Push[1], EXERCISE_DB.Pull[4], EXERCISE_DB.Legs[5], EXERCISE_DB.Push[4], EXERCISE_DB.Pull[1], EXERCISE_DB.Core[1], EXERCISE_DB.Push[6]];
  }
};

export const generateWorkoutPlan = (exp: Experience, days: number, goal: Goal, week: number = 1): DayPlan[] => {
  const plan: DayPlan[] = [];
  
  // 1. Menentukan Jumlah Gerakan berdasarkan Pengalaman
  let exerciseCount = 5; 
  if (exp === 'Menengah') exerciseCount = 6; 
  else if (exp === 'Mahir') exerciseCount = 8; 

  // 2. Menentukan Baseline RIR berdasarkan Pengalaman
  const getBaselineRIR = (experience: Experience, isStatic: boolean = false): string => {
    if (isStatic) return 'To Failure / Sesuai Durasi';
    if (experience === 'Pemula') return 'RIR 2-3';
    if (experience === 'Menengah') return 'RIR 1-2';
    return 'RIR 0-1'; 
  };

  // 3. Fungsi Apply Periodisasi (W1 - W4)
  const applyPeriodization = (exercises: GeneratedExercise[]): GeneratedExercise[] => {
    return exercises.map(ex => {
      let currentSets = ex.sets;
      let currentReps = ex.reps;
      let currentRir = getBaselineRIR(exp, ex.isStatic);

      if (week === 2) {
        currentSets += 1;
      } else if (week === 3) {
        if (ex.isStatic) {
          currentReps = currentReps.replace(/(\d+)/g, (match) => (parseInt(match) + 15).toString());
        } else {
          currentReps = currentReps.replace(/(\d+)/g, (match) => (parseInt(match) + 2).toString());
        }
      } else if (week === 4) {
        currentSets = Math.max(1, currentSets - 1);
        
        if (ex.isStatic) {
          currentReps = currentReps.replace(/(\d+)/g, (match) => Math.max(15, parseInt(match) - 15).toString());
        } else {
          currentReps = currentReps.replace(/(\d+)/g, (match) => Math.max(1, parseInt(match) - 2).toString());
        }

        if (!ex.isStatic) {
          if (exp === 'Pemula') currentRir = 'RIR 4';
          else if (exp === 'Menengah') currentRir = 'RIR 3';
          else if (exp === 'Mahir') currentRir = 'RIR 2';
        }
      }

      return {
        ...ex,
        sets: currentSets,
        reps: currentReps,
        rir: currentRir
      };
    });
  };

  const getExercises = (pool: GeneratedExercise[], count: number) => pool.slice(0, count);
  const getRestDay = (): DayPlan => ({ name: 'Rest Day', type: 'Rest', exercises: [] });

  // 4. Pembagian Menu Latihan dengan Distribusi Rest Day yang Proporsional
  if (days === 1) {
    plan.push({ name: 'Full Body Day', type: 'Workout', exercises: applyPeriodization(getExercises(getFullBodyPool('A'), exerciseCount)) });
    plan.push(getRestDay(), getRestDay(), getRestDay(), getRestDay(), getRestDay(), getRestDay());
  } else if (days === 2) {
    plan.push({ name: 'Upper Body', type: 'Workout', exercises: applyPeriodization(getExercises(getUpperPool(), exerciseCount)) });
    plan.push(getRestDay(), getRestDay());
    plan.push({ name: 'Lower Body', type: 'Workout', exercises: applyPeriodization(getExercises(getLowerPool(), exerciseCount)) });
    plan.push(getRestDay(), getRestDay(), getRestDay());
  } else if (days === 3) {
    plan.push({ name: 'Full Body A', type: 'Workout', exercises: applyPeriodization(getExercises(getFullBodyPool('A'), exerciseCount)) });
    plan.push(getRestDay());
    plan.push({ name: 'Full Body B', type: 'Workout', exercises: applyPeriodization(getExercises(getFullBodyPool('B'), exerciseCount)) });
    plan.push(getRestDay());
    plan.push({ name: 'Full Body C', type: 'Workout', exercises: applyPeriodization(getExercises(getFullBodyPool('C'), exerciseCount)) });
    plan.push(getRestDay(), getRestDay());
  } else if (days === 4) {
    plan.push({ name: 'Upper Body A', type: 'Workout', exercises: applyPeriodization(getExercises(getUpperPool(), exerciseCount)) });
    plan.push({ name: 'Lower Body A', type: 'Workout', exercises: applyPeriodization(getExercises(getLowerPool(), exerciseCount)) });
    plan.push(getRestDay());
    plan.push({ name: 'Upper Body B', type: 'Workout', exercises: applyPeriodization(getExercises(getUpperPool(true), exerciseCount)) });
    plan.push({ name: 'Lower Body B', type: 'Workout', exercises: applyPeriodization(getExercises(getLowerPool(true), exerciseCount)) });
    plan.push(getRestDay(), getRestDay());
  } else if (days === 5) {
    plan.push({ name: 'Push Day', type: 'Workout', exercises: applyPeriodization(getExercises(EXERCISE_DB.Push, exerciseCount)) });
    plan.push({ name: 'Pull Day', type: 'Workout', exercises: applyPeriodization(getExercises(EXERCISE_DB.Pull, exerciseCount)) });
    plan.push({ name: 'Leg Day', type: 'Workout', exercises: applyPeriodization(getExercises(EXERCISE_DB.Legs, exerciseCount)) });
    plan.push(getRestDay()); // Jeda rest day ditengah
    plan.push({ name: 'Upper Body', type: 'Workout', exercises: applyPeriodization(getExercises(getUpperPool(), exerciseCount)) });
    plan.push({ name: 'Lower Body', type: 'Workout', exercises: applyPeriodization(getExercises(getLowerPool(), exerciseCount)) });
    plan.push(getRestDay());
  } else if (days >= 6) {
    plan.push({ name: 'Push Day A', type: 'Workout', exercises: applyPeriodization(getExercises(EXERCISE_DB.Push, exerciseCount)) });
    plan.push({ name: 'Pull Day A', type: 'Workout', exercises: applyPeriodization(getExercises(EXERCISE_DB.Pull, exerciseCount)) });
    plan.push({ name: 'Leg Day A', type: 'Workout', exercises: applyPeriodization(getExercises(EXERCISE_DB.Legs, exerciseCount)) });
    plan.push({ name: 'Push Day B', type: 'Workout', exercises: applyPeriodization(getExercises([...EXERCISE_DB.Push].reverse(), exerciseCount)) });
    plan.push({ name: 'Pull Day B', type: 'Workout', exercises: applyPeriodization(getExercises([...EXERCISE_DB.Pull].reverse(), exerciseCount)) });
    plan.push({ name: 'Leg Day B', type: 'Workout', exercises: applyPeriodization(getExercises([...EXERCISE_DB.Legs].reverse(), exerciseCount)) });
    plan.push(getRestDay());
  }

  // Pengaman: Jika karena suatu alasan array kurang dari 7 hari, akan diisi dengan Rest Day
  while (plan.length < 7) {
    plan.push(getRestDay());
  }

  return plan;
};
