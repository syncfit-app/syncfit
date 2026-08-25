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
  const [loading, setLoading] = useState<boolean>(true);

  // Fungsi mengambil profil user
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
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setHasProfile(null);
      }
      setLoading(false);
    };

    checkSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setLoading(true);
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setHasProfile(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#FF5E00] animate-spin" />
        <p className="text-xs font-semibold text-[#64748B]">Menghubungkan ke SyncFit...</p>
      </div>
    );
  }

  // 2. Jika belum login
  if (!session) {
    return <LoginView onLogin={() => setLoading(true)} />;
  }

  // 3. Jika login tapi belum isi onboarding
  if (session && hasProfile === false) {
    return <OnboardingView onComplete={() => fetchProfile(session.user.id)} />;
  }

  // 4. Tampilan Utama dengan Router
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
