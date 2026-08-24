// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [userName, setUserName] = useState('Warrior');

  useEffect(() => {
    const fetchUserProfile = async () => {
      // 1. Dapatkan user yang sedang login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 2. Tarik data full_name dari tabel profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (data && data.full_name) {
          setUserName(data.full_name);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Refresh untuk kembali ke halaman login
  };

  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'workout', label: 'WORKOUT' },
    { id: 'gps', label: 'GPS TRACK' },
    { id: 'nutrition', label: 'NUTRITION' },
    { id: 'progress', label: 'PROGRESS' },
  ];

  return (
    <header className="bg-white border-b border-[#F1F5F9] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <img src="/logo.png" alt="SyncFit Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-xl font-black tracking-tight uppercase text-[#111827] hidden sm:block">
            SYNC<span className="text-[#FF5E00]">FIT</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-[#FF5E00] bg-[#FF5E00]/10'
                  : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-[#111827] hidden sm:block">{userName}</span>
            <div className="w-8 h-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-[#64748B]" />
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-[#64748B] hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
