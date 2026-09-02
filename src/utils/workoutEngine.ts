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
}

export interface DayPlan {
  name: string;
  type: 'Workout' | 'Rest';
  exercises: GeneratedExercise[];
}

// Database Gerakan (Termasuk Core Statis)
const EXERCISE_DB: Record<string, GeneratedExercise[]> = {
  Push: [
    { name: 'Barbell Bench Press', sets: 3, reps: '8-10', rir: 'RIR 1-2', rest: '90s', videoUrl: 'https://www.youtube.com/embed/rxD321l2svE', note: 'Turunkan beban perlahan sampai dada, dorong kuat.' },
    { name: 'Overhead Press', sets: 3, reps: '8-10', rir: 'RIR 1-2', rest: '90s', videoUrl: 'https://www.youtube.com/embed/QAQ64hK4Xxs', note: 'Jaga core tetap kencang, jangan melengkungkan punggung berlebih.' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rir: 'RIR 1', rest: '60s', videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8', note: 'Sudut bangku 30-45 derajat.' }
  ],
  Pull: [
    { name: 'Barbell Row', sets: 3, reps: '8-10', rir: 'RIR 1-2', rest: '90s', videoUrl: 'https://www.youtube.com/embed/9efgcAjQe7E', note: 'Tarik bar ke arah pusar, jepit belikat di puncak gerakan.' },
    { name: 'Lat Pulldown', sets: 3, reps: '10-12', rir: 'RIR 1', rest: '60s', videoUrl: 'https://www.youtube.com/embed/JGeYUNf4eEM', note: 'Tarik menggunakan siku, bukan telapak tangan.' },
    { name: 'Face Pulls', sets: 3, reps: '12-15', rir: 'RIR 1', rest: '60s', videoUrl: '', note: 'Fokus pada otot bahu belakang.' }
  ],
  Legs: [
    { name: 'Squat', sets: 3, reps: '6-8', rir: 'RIR 1-2', rest: '120s', videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8', note: 'Turun sampai sejajar lutut atau lebih dalam jika fleksibilitas mengizinkan.' },
    { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rir: 'RIR 1-2', rest: '90s', videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM', note: 'Dorong pinggul ke belakang, rasakan tarikan di paha belakang.' },
    { name: 'Calf Raises', sets: 3, reps: '15-20', rir: 'RIR 0-1', rest: '60s', videoUrl: '', note: 'Tahan 1 detik di puncak regangan.' }
  ],
  Core: [
    { name: 'Plank', sets: 3, reps: '60s', rir: 'To Failure', rest: '60s', videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw', note: 'Jaga tubuh lurus seperti papan, kencangkan perut dan glutes.' },
    { name: 'Side Plank', sets: 3, reps: '45s', rir: 'To Failure', rest: '60s', videoUrl: '', note: 'Lakukan untuk kedua sisi kiri dan kanan.' },
    { name: 'Bicycle Crunches', sets: 3, reps: '20 Reps', rir: 'RIR 1', rest: '60s', videoUrl: '', note: 'Putar bahu, bukan leher. Pertemukan siku ke lutut berlawanan.' }
  ]
};

export const generateWorkoutPlan = (exp: Experience, days: number, goal: Goal, week: number = 1): DayPlan[] => {
  const plan: DayPlan[] = [];
  
  // Penyesuaian intensitas berdasarkan minggu (Periodisasi)
  let setsModifier = week === 2 ? 1 : (week === 4 ? -1 : 0);
  
  const applyPeriodization = (exercises: GeneratedExercise[]): GeneratedExercise[] => {
    return exercises.map(ex => ({
      ...ex,
      sets: Math.max(1, ex.sets + setsModifier)
    }));
  };

  // Contoh template sederhana: Push, Pull, Legs, Core
  if (days >= 4) {
    plan.push({ name: 'Push Day', type: 'Workout', exercises: applyPeriodization(EXERCISE_DB.Push) });
    plan.push({ name: 'Pull Day', type: 'Workout', exercises: applyPeriodization(EXERCISE_DB.Pull) });
    plan.push({ name: 'Leg Day', type: 'Workout', exercises: applyPeriodization(EXERCISE_DB.Legs) });
    plan.push({ name: 'Core & Abs Day', type: 'Workout', exercises: applyPeriodization(EXERCISE_DB.Core) });
  } else {
    // Template 3 Hari (Full Body)
    plan.push({ name: 'Full Body A', type: 'Workout', exercises: applyPeriodization([...EXERCISE_DB.Push.slice(0,2), ...EXERCISE_DB.Legs.slice(0,1)]) });
    plan.push({ name: 'Full Body B', type: 'Workout', exercises: applyPeriodization([...EXERCISE_DB.Pull.slice(0,2), ...EXERCISE_DB.Core.slice(0,1)]) });
    plan.push({ name: 'Full Body C', type: 'Workout', exercises: applyPeriodization([...EXERCISE_DB.Legs.slice(0,2), ...EXERCISE_DB.Push.slice(2,3)]) });
  }

  // Isi sisa hari dengan Rest Day
  while (plan.length < 7) {
    plan.push({ name: 'Rest Day', type: 'Rest', exercises: [] });
  }

  return plan;
};
