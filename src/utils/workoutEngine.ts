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

  // 1. FAKTOR EXP (Base Sets & Total Exercises)
  let baseSets = 3;
  let maxExercises = 7; 
  
  if (exp === 'Pemula') {
    baseSets = 2;
    maxExercises = 6;
  } else if (exp === 'Mahir') {
    baseSets = 4;
    maxExercises = 7;
  } else {
    baseSets = 3;
    maxExercises = 7;
  }

  // 2. FAKTOR PERIODISASI MINGGUAN (Set Multiplier)
  let setMultiplier = 1;
  let rirText = 'RIR 2';

  if (week === 1) {
    setMultiplier = 1;
    rirText = 'RIR 2';
  } else if (week === 2) {
    setMultiplier = 1.25; 
    rirText = 'RIR 1-2';
  } else if (week === 3) {
    setMultiplier = 1; 
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

  // 4. DATABASE GERAKAN LENGKAP (Video Demo Pendek & Langsung Praktek)
  const db = {
    // PUSH (Chest, Shoulders, Triceps)
    bench: ex('Barbell Bench Press', 'Turunkan beban terkontrol sampai dada.', 'https://www.youtube.com/embed/rxD321l2svE'),
    incPress: ex('Incline DB Press', 'Atur sudut bench 30 derajat fokus dada atas.', 'https://www.youtube.com/embed/0GZcgOvU2yY'),
    cableCross: ex('Cable Crossover', 'Fokus pada kontraksi dada saat di tengah.', 'https://www.youtube.com/embed/Iwe6AmxVf7o'),
    pecDeck: ex('Pec Deck Fly', 'Busungkan dada, peras otot dada di puncak gerakan.', 'https://www.youtube.com/embed/eGjt4joGQRE'),
    ohp: ex('Overhead Press', 'Kencangkan core saat mendorong ke atas.', 'https://www.youtube.com/embed/QAQ64BKYg1A'),
    latRaise: ex('Dumbbell Lateral Raise', 'Siku sedikit ditekuk, rasakan bahu samping.', 'https://www.youtube.com/embed/WJm9OqMtlO8'),
    tricepPush: ex('Tricep Pushdown', 'Kunci siku di samping badan.', 'https://www.youtube.com/embed/lxUaDkeU6FA'),
    ohTricep: ex('Overhead Tricep Ext', 'Fokus pada rentang gerak penuh tricep.', 'https://www.youtube.com/embed/_gsNqT0G87o'),
    
    // PULL (Back, Rear Delts, Biceps, Traps)
    pullup: ex('Pull Up / Assisted', 'Tarik dada mendekati bar.', 'https://www.youtube.com/embed/i5g-vwNeJEY'),
    latPull: ex('Lat Pulldown', 'Tarik beban menggunakan otot punggung (lats).', 'https://www.youtube.com/embed/EUIrlJRqRng'),
    bbRow: ex('Barbell Row', 'Tarik siku ke arah pinggul.', 'https://www.youtube.com/embed/axoeDmC0pXQ'),
    dbRow: ex('Single-arm DB Row', 'Jaga punggung rata, tarik beban ke arah pinggang.', 'https://www.youtube.com/embed/dFzNQbqxUfI'),
    facePull: ex('Face Pulls', 'Tarik tali ke arah dahi, buka siku keluar.', 'https://www.youtube.com/embed/V8GlYWRoceA'),
    shrug: ex('Dumbbell Shrug', 'Angkat bahu ke arah telinga, tahan sejenak lalu turun perlahan.', 'https://www.youtube.com/embed/M5G67iXUaEE'),
    bicepCurl: ex('Barbell Bicep Curl', 'Isolasi bicep tanpa mengayunkan punggung.', 'https://www.youtube.com/embed/ykJmrZ5v0Oo'),
    hammerCurl: ex('DB Hammer Curl', 'Genggaman netral untuk brachialis yang tebal.', 'https://www.youtube.com/embed/CFBZ4jN1CMI'),

    // LEGS (Quads, Hamstrings, Glutes, Calves)
    squat: ex('Barbell Back Squat', 'Jaga dada tegak dan lutut sejajar jari kaki.', 'https://www.youtube.com/embed/bEv6CCg2BC8'),
    rdl: ex('Romanian Deadlift', 'Dorong pinggul ke belakang, rasakan stretch di paha belakang.', 'https://www.youtube.com/embed/_oyxCn2iSjU'),
    legPress: ex('Leg Press', 'Jangan lock lutut secara mendadak saat di atas.', 'https://www.youtube.com/embed/GvRgZQl2Zyg'),
    bulgarian: ex('Bulgarian Split Squat', 'Fokus pada kaki depan untuk mendorong.', 'https://www.youtube.com/embed/Yq7E3O8w8iE'),
    legExt: ex('Leg Extension', 'Tahan 1 detik di posisi puncak untuk kontraksi paha depan.', 'https://www.youtube.com/embed/m0FOpMEgero'),
    legCurl: ex('Leg Curl', 'Fokus menekuk lutut menggunakan otot hamstring.', 'https://www.youtube.com/embed/AwzcwOAWbrM'),
    hipThrust: ex('Barbell Hip Thrust', 'Peras otot glutes di puncak gerakan.', 'https://www.youtube.com/embed/LM8XHLYJoYs'),
    calfRaise: ex('Standing Calf Raise', 'Naik hingga menjinjit maksimal, turun perlahan.', 'https://www.youtube.com/embed/gwLzCAfwzcw'),

    // CORE (Hanya untuk Leg Day / Full Body)
    cableCrunch: ex('Cable Crunch', 'Lengkungkan punggung, fokus kontraksi perut.', 'https://www.youtube.com/embed/6B9s6-R-x6A'),
    legRaise: ex('Hanging Leg Raise', 'Gunakan otot perut bawah untuk mengangkat kaki.', 'https://www.youtube.com/embed/hdJ4x0hL9E4')
  };

  // Helper Pembuat Sesi Latihan (Filter max exercises berdasarkan Level)
  const buildSession = (dayLabel: string, name: string, exercisesList: GeneratedExercise[], isToday: boolean = false): DayPlan => {
    return {
      dayLabel,
      name,
      type: 'Workout',
      isToday,
      exercises: exercisesList.slice(0, maxExercises)
    };
  };

  const restDay = (label: string): DayPlan => ({ dayLabel: label, name: 'Rest Day', type: 'Rest', exercises: [] });

  // 5. GENERATE SPLIT BERDASARKAN JUMLAH HARI
  if (days === 2) {
    return [
      buildSession('SEN', 'Full Body A', [db.squat, db.bench, db.latPull, db.rdl, db.latRaise, db.bicepCurl, db.cableCrunch], true),
      restDay('SEL'),
      restDay('RAB'),
      buildSession('KAM', 'Full Body B', [db.legPress, db.ohp, db.bbRow, db.hipThrust, db.incPress, db.tricepPush, db.legRaise]),
      restDay('JUM'),
      restDay('SAB'),
      restDay('MIN')
    ];
  }

  if (days === 3) {
    return [
      buildSession('SEN', 'Push Day', [db.bench, db.ohp, db.incPress, db.cableCross, db.latRaise, db.tricepPush, db.ohTricep], true),
      restDay('SEL'),
      buildSession('RAB', 'Pull Day', [db.pullup, db.bbRow, db.latPull, db.facePull, db.dbRow, db.bicepCurl, db.hammerCurl]),
      restDay('KAM'),
      buildSession('JUM', 'Legs Day', [db.squat, db.rdl, db.legPress, db.legExt, db.legCurl, db.calfRaise, db.cableCrunch]),
      restDay('SAB'),
      restDay('MIN')
    ];
  }

  if (days === 5) {
    return [
      buildSession('SEN', 'Upper A', [db.bench, db.pullup, db.ohp, db.bbRow, db.latRaise, db.bicepCurl, db.tricepPush], true),
      buildSession('SEL', 'Lower A', [db.squat, db.rdl, db.legPress, db.legCurl, db.calfRaise, db.hipThrust, db.cableCrunch]),
      restDay('RAB'),
      buildSession('KAM', 'Push B', [db.incPress, db.ohp, db.cableCross, db.pecDeck, db.latRaise, db.tricepPush, db.ohTricep]),
      buildSession('JUM', 'Pull B', [db.latPull, db.dbRow, db.pullup, db.facePull, db.shrug, db.bicepCurl, db.hammerCurl]),
      buildSession('SAB', 'Legs B', [db.legPress, db.bulgarian, db.legExt, db.legCurl, db.hipThrust, db.calfRaise, db.legRaise]),
      restDay('MIN')
    ];
  }

  if (days === 6) {
    return [
      buildSession('SEN', 'Push A', [db.bench, db.ohp, db.incPress, db.cableCross, db.latRaise, db.tricepPush, db.ohTricep], true),
      buildSession('SEL', 'Pull A', [db.pullup, db.bbRow, db.latPull, db.facePull, db.shrug, db.bicepCurl, db.hammerCurl]),
      buildSession('RAB', 'Legs A', [db.squat, db.rdl, db.legPress, db.legCurl, db.calfRaise, db.hipThrust, db.cableCrunch]),
      buildSession('KAM', 'Push B', [db.incPress, db.latRaise, db.cableCross, db.pecDeck, db.ohp, db.tricepPush, db.ohTricep]),
      buildSession('JUM', 'Pull B', [db.latPull, db.dbRow, db.facePull, db.pullup, db.shrug, db.bicepCurl, db.hammerCurl]),
      buildSession('SAB', 'Legs B', [db.legPress, db.bulgarian, db.legExt, db.legCurl, db.calfRaise, db.hipThrust, db.legRaise]),
      restDay('MIN')
    ];
  }

  // Default: 4 Hari Latihan (Upper / Lower Split)
  return [
    buildSession('SEN', 'Upper A', [db.bench, db.pullup, db.ohp, db.bbRow, db.latRaise, db.bicepCurl, db.tricepPush], true),
    buildSession('SEL', 'Lower A', [db.squat, db.rdl, db.legPress, db.legCurl, db.calfRaise, db.hipThrust, db.cableCrunch]),
    restDay('RAB'),
    buildSession('KAM', 'Upper B', [db.incPress, db.latPull, db.dbRow, db.facePull, db.latRaise, db.hammerCurl, db.ohTricep]),
    buildSession('JUM', 'Lower B', [db.legPress, db.bulgarian, db.legExt, db.legCurl, db.hipThrust, db.calfRaise, db.legRaise]),
    restDay('SAB'),
    restDay('MIN')
  ];
};
