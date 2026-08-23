import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MetricsGrid } from './components/MetricsGrid';
import { ExercisePreview } from './components/ExercisePreview';
import { DailyChallengeCard } from './components/DailyChallengeCard';
import { NutritionSummaryCard } from './components/NutritionSummaryCard';
import { BottomNav } from './components/BottomNav';
import { Dumbbell, Compass, Utensils, User as UserIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'workout' | 'gps' | 'nutrition' | 'profile'>('home');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] font-sans antialiased selection:bg-[#FF5E00] selection:text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">
        {/* TAB: DASHBOARD / HOME */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 space-y-8">
              <HeroBanner onStartWorkout={() => setActiveTab('workout')} />
              <MetricsGrid />
              <ExercisePreview />
            </section>
            <aside className="lg:col-span-4 space-y-6">
              <DailyChallengeCard />
              <NutritionSummaryCard onViewDetail={() => setActiveTab('nutrition')} />
            </aside>
          </div>
        )}

        {/* TAB: WORKOUT ENGINE PLACEHOLDER */}
        {activeTab === 'workout' && (
          <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] space-y-4">
            <h2 className="text-2xl font-extrabold uppercase flex items-center gap-2">
              <Dumbbell className="text-[#FF5E00]" /> WORKOUT ENGINE
            </h2>
            <p className="text-[#707072] text-sm">
              Sistem Generator Latihan Deterministik (Tanpa AI) berbasis Aturan Split & Exercise Pool.
            </p>
          </div>
        )}

        {/* TAB: GPS TRACKER PLACEHOLDER */}
        {activeTab === 'gps' && (
          <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] space-y-4">
            <h2 className="text-2xl font-extrabold uppercase flex items-center gap-2">
              <Compass className="text-[#FF5E00]" /> GPS OUTDOOR TRACKER
            </h2>
            <p className="text-[#707072] text-sm">
              Pencatat Aktivitas Lari & Bersepeda Real-Time dengan Haversine Formula & METs Calorie Calculation.
            </p>
          </div>
        )}

        {/* TAB: NUTRITION PLACEHOLDER */}
        {activeTab === 'nutrition' && (
          <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] space-y-4">
            <h2 className="text-2xl font-extrabold uppercase flex items-center gap-2">
              <Utensils className="text-[#FF5E00]" /> MEAL PLAN ENGINE
            </h2>
            <p className="text-[#707072] text-sm">
              Kalkulator Kalori Mifflin-St Jeor & Basis Data Makanan Indonesia.
            </p>
          </div>
        )}

        {/* TAB: PROFILE PLACEHOLDER */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] space-y-4">
            <h2 className="text-2xl font-extrabold uppercase flex items-center gap-2">
              <UserIcon className="text-[#FF5E00]" /> PROFIL & PENGATURAN
            </h2>
            <p className="text-[#707072] text-sm">
              Pengaturan Bahasa (Bilingual System i18n), Target Personal, dan Riwayat Aktivitas.
            </p>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
