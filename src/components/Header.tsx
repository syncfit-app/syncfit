// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, LogIn } from 'lucide-react';
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

  // Ambil username / nama dari metadata akun, fallback ke prefix email sebelum @
  const username = user
    ? user.user_metadata?.full_name || user.email?.split('@')[0]
    : '';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workout', label: 'Workout' },
    { id: 'gps', label: 'GPS Track' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'progress', label: 'Progress' },
  ];

  return (
    <>
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LOGO ASLI (Ikon F + Teks SYNCFIT Oranye Solid) */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-6 h-6 bg-[#FF5E00] flex items-center justify-center rounded-sm">
              <span className="text-white font-black text-xs italic tracking-tighter">F</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#FF5E00]">
              SYNCFIT
            </span>
          </div>

          {/* NAVIGASI MINIMALIS NIKE STYLE */}
          <nav className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive ? 'text-[#FF5E00]' : 'text-[#707072] hover:text-[#111111]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5E00]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* AREA AUTH & PROFIL */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Username */}
                <span className="text-xs font-bold text-[#111111] capitalize hidden sm:inline">
                  {username}
                </span>

                {/* Tombol Profil */}
                <button 
                  className="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#E2E8F0] flex items-center justify-center text-[#111111] hover:bg-[#EAEAEA] transition-all"
                  title="Profil"
                >
                  <UserIcon className="w-4 h-4" />
                </button>

                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#707072] hover:text-red-500 transition-colors"
                  title="Keluar Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Tombol Profil (Tamu) */}
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#E2E8F0] flex items-center justify-center text-[#111111] hover:bg-[#EAEAEA] transition-all"
                  title="Login / Register"
                >
                  <UserIcon className="w-4 h-4" />
                </button>

                {/* Tombol Login Solid Nike Style */}
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase rounded-full shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </div>
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

export default Header;
