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
import { ProfileView } from './components/ProfileView';
import { Loader2 } from 'lucide-react';

export function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
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
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
      setHasProfile(false);
    }
  };

  useEffect(() => {
    // 1. Cek sesi secara eksplisit saat aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) fetchProfile(session.user.id);
    });

    // 2. Dengarkan perubahan login/logout selanjutnya
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false); // Selalu pastikan loading mati jika ada perubahan status

      if (session) {
        fetchProfile(session.user.id);
      } else {
        setHasProfile(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setAuthLoading(true);
    await supabase.auth.signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#FF5E00] animate-spin" />
        <p className="text-xs font-semibold text-[#64748B]">Menghubungkan ke SyncFit...</p>
      </div>
    );
  }

  // PERUBAHAN DI SINI: Hapus properti onLogin agar tidak bentrok dengan Supabase
  if (!session) {
    return <LoginView />;
  }

  if (hasProfile === false) {
    return <OnboardingView onComplete={() => fetchProfile(session.user.id)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans pb-24 md:pb-12 pt-16 md:pt-20">
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
