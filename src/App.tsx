// src/App.tsx
import { useState } from 'react';
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

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

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
