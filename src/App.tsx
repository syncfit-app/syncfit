// src/App.tsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WorkoutView } from './components/WorkoutView';
import { MetricsGrid } from './components/MetricsGrid';
import { HeroBanner } from './components/HeroBanner';
import { DailyChallengeCard } from './components/DailyChallengeCard';
import { NutritionSummaryCard } from './components/NutritionSummaryCard';
import { GPSView } from './components/GPSView';
import { NutritionView } from './components/NutritionView';
import { ProgressView } from './components/ProgressView';
import { LoginView } from './components/LoginView';
import { OnboardingView } from './components/OnboardingView';
import { ProfileView } from './components/ProfileView'; // Pastikan import ini ada
import { Loader2 } from 'lucide-react';

export function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  
  // Ubah nama state agar spesifik hanya untuk Auth
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
      setHasProfile(true);
    } else {
      setHasProfile(false);
    }
  };

  useEffect(() => {
    const checkSessionAndProfile = async () => {
      // 1. Cek sesi login (Sangat cepat karena dari local storage/browser)
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      // 2. LANGSUNG UNBLOCK UI agar Dashboard bisa langsung render
      setAuthLoading(false); 
      
      // 3. Ambil data profil di background (Lambat karena ke database)
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setHasProfile(null);
      }
    };

    checkSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setHasProfile(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 1. Loading State HANYA untuk Otentikasi (Sangat Singkat)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#FF5E00] animate-spin" />
        <p className="text-xs font-semibold text-[#64748B]">Menghubungkan ke SyncFit...</p>
      </div>
    );
  }

  // 2. Jika belum login
  if (!session) {
    return <LoginView onLogin={() => setAuthLoading(true)} />;
  }

  // 3. Jika login tapi dipastikan belum isi onboarding
  if (hasProfile === false) {
    return <OnboardingView onComplete={() => fetchProfile(session.user.id)} />;
  }

  // 4. Tampilan Utama (Langsung terbuka, data profil menyusul di background)
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans pb-24 md:pb-12 pt-16 md:pt-20">
      {/* Jika profile belum ter-load, Header akan pakai fallback "Warrior" */}
      <Header profile={profile} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <Routes>
          <Route
            path="/"
            element={
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
                <div className="lg:col-span-2 space-y-6">
                  <HeroBanner />
                  <MetricsGrid />
                </div>
                <div className="space-y-6">
                  <DailyChallengeCard />
                  <NutritionSummaryCard />
                </div>
              </div>
            }
          />
          <Route path="/workout" element={<WorkoutView />} />
          <Route path="/gps" element={<GPSView />} />
          <Route path="/nutrition" element={<NutritionView />} />
          <Route path="/progress" element={<ProgressView />} />
          <Route 
            path="/profile" 
            element={<ProfileView profile={profile} onLogout={handleLogout} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;
