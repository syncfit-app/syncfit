// src/App.tsx
import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { WorkoutView } from './components/WorkoutView';
import { NutritionView } from './components/NutritionView';
import { ProgressView } from './components/ProgressView';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'nutrition' | 'progress'>('dashboard');

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans pb-12">
      {/* Header menangani state Login/Logout & Modal Auth */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'workout' && <WorkoutView />}
        {activeTab === 'nutrition' && <NutritionView />}
        {activeTab === 'progress' && <ProgressView />}
      </main>
    </div>
  );
}
