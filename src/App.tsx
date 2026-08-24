// src/App.tsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { WorkoutView } from './components/WorkoutView';
import { MetricsGrid } from './components/MetricsGrid';
import { HeroBanner } from './components/HeroBanner';
import { DailyChallengeCard } from './components/DailyChallengeCard';
import { NutritionSummaryCard } from './components/NutritionSummaryCard';
import { GPSView } from './components/GPSView';
import { NutritionView } from './components/NutritionView';
import { ProgressView } from './components/ProgressView';
import { LoginView } from './components/LoginView';
import { OnboardingView } from './components/OnboardingView'; // IMPORT BARU
import { Loader2 } from 'lucide-react';

export function App() {
  const [session, setSession] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null); // STATE BARU
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    // Fungsi untuk cek Sesi dan ketersediaan Profil di Supabase
    const checkSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Cek apakah user id ini sudah ada di tabel profiles
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();
          
        setHasProfile(!!data); // Jika data ada = true, jika kosong = false
      } else {
        setHasProfile(null);
      }
      setLoading(false);
    };

    checkSessionAndProfile();

    // Dengarkan perubahan sesi secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setLoading(true);
      if (session) {
        const { data } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
        setHasProfile(!!data);
      } else {
        setHasProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 1. Tampilan layar pemuatan (Loading State)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#FF5E00] animate-spin" />
        <p className="text-xs font-semibold text-[#64748B]">Menghubungkan ke SyncFit...</p>
      </div>
    );
  }

  // 2. Jika user belum login, tampilkan LoginView
  if (!session) {
    return <LoginView onLogin={() => setLoading(true)} />;
  }

  // 3. Jika user login TAPI belum punya profil, tampilkan OnboardingView
  if (session && hasProfile === false) {
    return <OnboardingView onComplete={() => setHasProfile(true)} />;
  }

  // 4. Jika user sudah login DAN punya profil, tampilkan Aplikasi Utama
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans pb-20 md:pb-12">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <HeroBanner />
              <MetricsGrid />
            </div>
            <div className="space-y-6">
              <DailyChallengeCard />
              <NutritionSummaryCard />
            </div>
          </div>
        )}

        {activeTab === 'workout' && <WorkoutView />}
        {activeTab === 'gps' && <GPSView />}
        {activeTab === 'nutrition' && <NutritionView />}
        {activeTab === 'progress' && <ProgressView />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
