// src/utils/workoutEngine.ts

export type Experience = 'Pemula' | 'Menengah' | 'Mahir';
export type Goal = 'Hypertrophy' | 'Strength' | 'Fat Loss' | 'General Fitness';

export interface GeneratedExercise {
  name: string;
  sets: number;
  reps: string;
  rir: string;
  rest: string;
  note: string;
  videoUrl: string;
}

export interface DayPlan {
  dayLabel: string;
  name: string;
  type: 'Workout' | 'Rest';
  isToday?: boolean;
  exercises: GeneratedExercise[];
}

export const generateWorkoutPlan = (
  exp: Experience,
  days: number,
  goal: Goal,
  week: number = 1
): DayPlan[] => {

  // FAKTOR PERIODISASI MINGGUAN
  let setMultiplier = 1;
  let rirText = 'RIR 2';

  if (week === 1) {
    setMultiplier = 1; // Base sets (Pondasi)
    rirText = 'RIR 2';
  } else if (week === 2) {
    setMultiplier = 1.33; // Progressive Volume (+1 set)
    rirText = 'RIR 1-2';
  } else if (week === 3) {
    setMultiplier = 1; // High Intensity
    rirText = 'RIR 0-1';
  } else if (week === 4) {
    setMultiplier = 0.66; // Deload Phase (-50% volume)
    rirText = 'RIR 3-4';
  }

  const adjustSets = (baseSets: number) => Math.max(2, Math.round(baseSets * setMultiplier));

  // Template Split Berdasarkan Jumlah Hari
  if (days === 2) {
    return [
      {
        dayLabel: 'SEN',
        name: 'Full Body A',
        type: 'Workout',
        isToday: true,
        exercises: [
          { name: 'Barbell Squat', sets: adjustSets(3), reps: '6-10 Reps', rir: rirText, rest: '120s', note: 'Jaga punggung tetap lurus.', videoUrl: 'https://www.youtube.com/embed/gcNh17Ckjgg' },
          { name: 'Barbell Bench Press', sets: adjustSets(3), reps: '6-10 Reps', rir: rirText, rest: '90s', note: 'Turunkan beban terkontrol.', videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg' },
          { name: 'Lat Pulldown', sets: adjustSets(3), reps: '8-12 Reps', rir: rirText, rest: '90s', note: 'Tarik ke arah dada atas.', videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc' }
        ]
      },
      { dayLabel: 'SEL', name: 'Rest Day', type: 'Rest', exercises: [] },
      { dayLabel: 'RAB', name: 'Rest Day', type: 'Rest', exercises: [] },
      {
        dayLabel: 'KAM',
        name: 'Full Body B',
        type: 'Workout',
        exercises: [
          { name: 'Romanian Deadlift', sets: adjustSets(3), reps: '8-12 Reps', rir: rirText, rest: '120s', note: 'Enghip hinge dengan benar.', videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM' },
          { name: 'Overhead Press', sets: adjustSets(3), reps: '6-10 Reps', rir: rirText, rest: '90s', note: 'Kencangkan core dan glutes.', videoUrl: 'https://www.youtube.com/embed/2yjwXT8jVI0' },
          { name: 'Barbell Row', sets: adjustSets(3), reps: '8-12 Reps', rir: rirText, rest: '90s', note: 'Tarik ke arah perut bawah.', videoUrl: 'https://www.youtube.com/embed/G8l_8chR5BE' }
        ]
      },
      { dayLabel: 'JUM', name: 'Rest Day', type: 'Rest', exercises: [] },
      { dayLabel: 'SAB', name: 'Rest Day', type: 'Rest', exercises: [] },
      { dayLabel: 'MIN', name: 'Rest Day', type: 'Rest', exercises: [] }
    ];
  }

  // Default Split 4 Hari (Upper / Lower / Push / Pull / Legs)
  return [
    {
      dayLabel: 'SEN',
      name: 'Upper A',
      type: 'Workout',
      isToday: true,
      exercises: [
        { name: 'Pull Up', sets: adjustSets(3), reps: '6-10 Reps', rir: rirText, rest: '90s', note: 'Tarik siku ke bawah pinggang.', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
        { name: 'Barbell Bench Press', sets: adjustSets(3), reps: '6-10 Reps', rir: rirText, rest: '90s', note: 'Fokus pada rentang gerak penuh.', videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg' },
        { name: 'Seated Cable Row', sets: adjustSets(3), reps: '8-12 Reps', rir: rirText, rest: '90s', note: 'Busungkan dada saat menarik.', videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74' },
        { name: 'Incline Dumbbell Press', sets: adjustSets(3), reps: '8-12 Reps', rir: rirText, rest: '90s', note: 'Sudut bench 30-45 derajat.', videoUrl: 'https://www.youtube.com/embed/8iPEnnVgtCU' }
      ]
    },
    {
      dayLabel: 'SEL',
      name: 'Lower A',
      type: 'Workout',
      exercises: [
        { name: 'Barbell Back Squat', sets: adjustSets(3), reps: '6-10 Reps', rir: rirText, rest: '120s', note: 'Jaga lutut agar tidak collapse ke dalam.', videoUrl: 'https://www.youtube.com/embed/gcNh17Ckjgg' },
        { name: 'Romanian Deadlift', sets: adjustSets(3), reps: '8-12 Reps', rir: rirText, rest: '120s', note: 'Rasakan stretch pada hamstring.', videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM' },
        { name: 'Leg Press', sets: adjustSets(3), reps: '10-15 Reps', rir: rirText, rest: '90s', note: 'Posisi kaki di tengah platform.', videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ' }
      ]
    },
    { dayLabel: 'RAB', name: 'Rest Day', type: 'Rest', exercises: [] },
    {
      dayLabel: 'KAM',
      name: 'Push Day',
      type: 'Workout',
      exercises: [
        { name: 'Overhead Press', sets: adjustSets(3), reps: '6-10 Reps', rir: rirText, rest: '90s', note: 'Dorong lurus ke atas.', videoUrl: 'https://www.youtube.com/embed/2yjwXT8jVI0' },
        { name: 'Dumbbell Lateral Raise', sets: adjustSets(3), reps: '12-15 Reps', rir: rirText, rest: '60s', note: 'Kontrol beban saat turun.', videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo' },
        { name: 'Tricep Pushdown', sets: adjustSets(3), reps: '10-15 Reps', rir: rirText, rest: '60s', note: 'Kunci siku di samping badan.', videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU' }
      ]
    },
    {
      dayLabel: 'JUM',
      name: 'Pull Day',
      type: 'Workout',
      exercises: [
        { name: 'Lat Pulldown', sets: adjustSets(3), reps: '8-12 Reps', rir: rirText, rest: '90s', note: 'Tarik ke arah dada atas.', videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc' },
        { name: 'Barbell Bicep Curl', sets: adjustSets(3), reps: '10-15 Reps', rir: rirText, rest: '60s', note: 'Isolasi otot bicep secara penuh.', videoUrl: 'https://www.youtube.com/embed/kwG2ipFRgfo' }
      ]
    },
    { dayLabel: 'SAB', name: 'Rest Day', type: 'Rest', exercises: [] },
    { dayLabel: 'MIN', name: 'Rest Day', type: 'Rest', exercises: [] }
  ];
};
