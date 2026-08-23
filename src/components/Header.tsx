// src/components/Header.tsx

import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthModal } from './AuthModal';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#FF5E00] to-[#FF006B] bg-clip-text text-transparent">
              SYNCFIT
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {['dashboard', 'workout', 'nutrition', 'progress'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                  activeTab === tab ? 'bg-[#111111] text-white' : 'text-[#707072] hover:bg-[#F5F5F5]'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#111111] hidden md:inline truncate max-w-[120px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-[#E2E8F0] hover:bg-[#F5F5F5] text-xs font-bold uppercase rounded-full flex items-center gap-1.5 text-red-500 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
