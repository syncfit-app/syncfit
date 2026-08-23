// src/App.tsx
import { useState } from 'react';
import Header from './components/Header';
import { WorkoutView } from './components/WorkoutView';
import { MetricsGrid } from './components/MetricsGrid';
import { HeroBanner } from './components/HeroBanner';
import { DailyChallengeCard } from './components/DailyChallengeCard';
import { NutritionSummaryCard } from './components/NutritionSummaryCard';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans pb-12">
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

        {activeTab === 'nutrition' && (
          <div className="p-8 bg-white rounded-2xl border border-[#E2E8F0] text-center">
            <h2 className="text-xl font-bold">Menu Nutrisi</h2>
            <p className="text-sm text-[#707072] mt-2">Halaman manajemen nutrisi harian Anda.</p>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="p-8 bg-white rounded-2xl border border-[#E2E8F0] text-center">
            <h2 className="text-xl font-bold">Progres Latihan</h2>
            <p className="text-sm text-[#707072] mt-2">Pantau grafik perkembangan fisik Anda di sini.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
