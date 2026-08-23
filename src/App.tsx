// src/App.tsx

import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogIn, LogOut, LayoutDashboard, Dumbbell, Utensils, TrendingUp } from 'lucide-react';
import { supabase } from './lib/supabase';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { WorkoutView } from './components/WorkoutView';
import { NutritionView } from './components/NutritionView';
import { ProgressView } from './components/ProgressView';
import { User } from '@supabase/supabase-js';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'nutrition' | 'progress'>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Ambil sesi pengguna saat pertama kali komponen di-mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Berlangganan (subscribe) pada perubahan status autentikasi real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans pb-12">
      {/* NAVIGATION HEADER */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* BRAND LOGO */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#FF5E00] to-[#FF006B] bg-clip-text text-transparent">
              SYNCFIT
            </span>
          </div>

          {/* TAB NAVIGATION */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-[#111111] text-white' : 'text-[#707072] hover:bg-[#F5F5F5]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('workout')}
              className={`px-3 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'workout' ? 'bg-[#111111] text-white' : 'text-[#707072] hover:bg-[#F5F5F5]'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Workout</span>
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-3 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'nutrition' ? 'bg-[#111111] text-white' : 'text-[#707072] hover:bg-[#F5F5F5]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nutrition</span>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'progress' ? 'bg-[#111111] text-white' : 'text-[#707072] hover:bg-[#F5F5F5]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Progress</span>
            </button>
          </nav>

          {/* AUTH STATUS / BUTTONS */}
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#111111] hidden md:inline truncate max-w-[140px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 border border-[#E2E8F0] hover:bg-[#F5F5F5] text-xs font-bold uppercase rounded-full flex items-center gap-1.5 transition-all"
                  title="Keluar Akun"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#FF5E00] to-[#FF006B] text-white text-xs font-bold uppercase rounded-full shadow-md hover:opacity-90 flex items-center gap-1.5 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN VIEW ROUTING */}
      <main className="max-w-6xl mx-auto px-4 pt-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'workout' && <WorkoutView />}
        {activeTab === 'nutrition' && <NutritionView />}
        {activeTab === 'progress' && <ProgressView />}
      </main>

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
