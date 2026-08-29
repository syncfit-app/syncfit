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

  // 1. FAKTOR EXP (Base Sets)
  let baseSets = 3;
  if (exp === 'Pemula') baseSets = 2;
  if (exp === 'Mahir') baseSets = 4;

  // 2. FAKTOR PERIODISASI MINGGUAN (Set Multiplier)
  let setMultiplier = 1;
  let rirText = 'RIR 2';

  if (week === 1) {
    setMultiplier = 1;
    rirText = 'RIR 2';
  } else if (week === 2) {
    setMultiplier = 1.25; // Progressive Volume
    rirText = 'RIR 1-2';
  } else if (week === 3) {
    setMultiplier = 1; // High Intensity
    rirText = 'RIR 0-1';
  } else if (week === 4) {
    setMultiplier = 0.6; // Deload Phase
    rirText = 'RIR 3-4';
  }

  const calcSets = Math.max(2, Math.round(baseSets * setMultiplier));

  // 3. FAKTOR GOAL (Reps & Rest)
  let repsText = '8-12 Reps';
  let restText = '90s';

  if (goal === 'Strength') {
    repsText = '4-6 Reps';
    restText = '120s-180s';
  } else if (goal === 'Fat Loss') {
    repsText = '12-15 Reps';
    restText = '45s-60s';
  } else if (goal === 'General Fitness') {
    repsText = '10-12 Reps';
    restText = '60s';
  }

  // Helper Generator Exercise
  const ex = (name: string, note: string, videoUrl: string): GeneratedExercise => ({
    name,
    sets: calcSets,
    reps: repsText,
    rir: rirText,
    rest: restText,
    note,
    videoUrl
  });

  // Library Exercise
  const exercisesDB = {
    squat: ex('Barbell Back Squat', 'Jaga lutut sejajar arah jari kaki.', 'https://www.youtube.com/embed/gcNh17Ckjgg'),
    bench: ex('Barbell Bench Press', 'Turunkan beban terkontrol sampai menyentuh dada.', 'https://www.youtube.com/embed/rT7DgCr-3pg'),
    latPull: ex('Lat Pulldown', 'Tarik beban fokus menggunakan otot punggung.', 'https://www.youtube.com/embed/CAwf7n6Luuc'),
    rdl: ex('Romanian Deadlift', 'Dorong pinggul ke belakang, rasakan stretch hamstring.', 'https://www.youtube.com/embed/JCXUYuzwNrM'),
    ohp: ex('Overhead Press', 'Kencangkan core saat mendorong ke atas.', 'https://www.youtube.com/embed/2yjwXT8jVI0'),
    row: ex('Seated Cable Row', 'Tarik siku rapat ke samping badan.', 'https://www.youtube.com/embed/GZbfZ033f74'),
    incPress: ex('Incline Dumbbell Press', 'Atur sudut bench 30-45 derajat.', 'https://www.youtube.com/embed/8iPEnnVgtCU'),
    pullup: ex('Pull Up', 'Tarik dada mendekati bar.', 'https://www.youtube.com/embed/eGo4IYlbE5g'),
    legPress: ex('Leg Press', 'Jangan lock lutut secara mendadak di atas.', 'https://www.youtube.com/embed/IZxyjW7MPJQ'),
    latRaise: ex('Dumbbell Lateral Raise', 'Fokus pada shoulder samping.', 'https://www.youtube.com/embed/3VcKaXpzqRo'),
    tricep: ex('Tricep Pushdown', 'Kunci siku di samping badan.', 'https://www.youtube.com/embed/2-LAMcpzODU'),
    bicep: ex('Barbell Bicep Curl', 'Isolasi bicep tanpa swing badan.', 'https://www.youtube.com/embed/kwG2ipFRgfo')
  };

  // Rest Day Template
  const restDay = (label: string): DayPlan => ({ dayLabel: label, name: 'Rest Day', type: 'Rest', exercises: [] });

  // 4. GENERATE SPLIT BERDASARKAN HARI (2, 3, 4, 5, 6)
  if (days === 2) {
    return [
      { dayLabel: 'SEN', name: 'Full Body A', type: 'Workout', isToday: true, exercises: [exercisesDB.squat, exercisesDB.bench, exercisesDB.latPull] },
      restDay('SEL'),
      restDay('RAB'),
      { dayLabel: 'KAM', name: 'Full Body B', type: 'Workout', exercises: [exercisesDB.rdl, exercisesDB.ohp, exercisesDB.row] },
      restDay('JUM'),
      restDay('SAB'),
      restDay('MIN')
    ];
  }

  if (days === 3) {
    return [
      { dayLabel: 'SEN', name: 'Push Day', type: 'Workout', isToday: true, exercises: [exercisesDB.bench, exercisesDB.ohp, exercisesDB.tricep] },
      restDay('SEL'),
      { dayLabel: 'RAB', name: 'Pull Day', type: 'Workout', exercises: [exercisesDB.latPull, exercisesDB.row, exercisesDB.bicep] },
      restDay('KAM'),
      { dayLabel: 'JUM', name: 'Legs Day', type: 'Workout', exercises: [exercisesDB.squat, exercisesDB.rdl, exercisesDB.legPress] },
      restDay('SAB'),
      restDay('MIN')
    ];
  }

  if (days === 5) {
    return [
      { dayLabel: 'SEN', name: 'Upper A', type: 'Workout', isToday: true, exercises: [exercisesDB.bench, exercisesDB.pullup, exercisesDB.ohp] },
      { dayLabel: 'SEL', name: 'Lower A', type: 'Workout', exercises: [exercisesDB.squat, exercisesDB.rdl, exercisesDB.legPress] },
      restDay('RAB'),
      { dayLabel: 'KAM', name: 'Push B', type: 'Workout', exercises: [exercisesDB.incPress, exercisesDB.ohp, exercisesDB.latRaise, exercisesDB.tricep] },
      { dayLabel: 'JUM', name: 'Pull B', type: 'Workout', exercises: [exercisesDB.latPull, exercisesDB.row, exercisesDB.bicep] },
      { dayLabel: 'SAB', name: 'Legs B', type: 'Workout', exercises: [exercisesDB.squat, exercisesDB.rdl] },
      restDay('MIN')
    ];
  }

  if (days === 6) {
    return [
      { dayLabel: 'SEN', name: 'Push A', type: 'Workout', isToday: true, exercises: [exercisesDB.bench, exercisesDB.ohp, exercisesDB.tricep] },
      { dayLabel: 'SEL', name: 'Pull A', type: 'Workout', exercises: [exercisesDB.pullup, exercisesDB.row, exercisesDB.bicep] },
      { dayLabel: 'RAB', name: 'Legs A', type: 'Workout', exercises: [exercisesDB.squat, exercisesDB.rdl] },
      { dayLabel: 'KAM', name: 'Push B', type: 'Workout', exercises: [exercisesDB.incPress, exercisesDB.latRaise, exercisesDB.tricep] },
      { dayLabel: 'JUM', name: 'Pull B', type: 'Workout', exercises: [exercisesDB.latPull, exercisesDB.row] },
      { dayLabel: 'SAB', name: 'Legs B', type: 'Workout', exercises: [exercisesDB.legPress, exercisesDB.rdl] },
      restDay('MIN')
    ];
  }

  // Default: 4 Hari Latihan
  return [
    { dayLabel: 'SEN', name: 'Upper A', type: 'Workout', isToday: true, exercises: [exercisesDB.pullup, exercisesDB.bench, exercisesDB.row, exercisesDB.incPress] },
    { dayLabel: 'SEL', name: 'Lower A', type: 'Workout', exercises: [exercisesDB.squat, exercisesDB.rdl, exercisesDB.legPress] },
    restDay('RAB'),
    { dayLabel: 'KAM', name: 'Push Day', type: 'Workout', exercises: [exercisesDB.ohp, exercisesDB.latRaise, exercisesDB.tricep] },
    { dayLabel: 'JUM', name: 'Pull Day', type: 'Workout', exercises: [exercisesDB.latPull, exercisesDB.bicep] },
    restDay('SAB'),
    restDay('MIN')
  ];
};
