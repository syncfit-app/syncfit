import React from 'react';
import { User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 h-[60px] bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
        <img src="/logo.png" alt="SyncFit" className="h-8 w-auto object-contain" />
        <span className="font-extrabold text-xl tracking-tight uppercase hidden sm:inline-block">
          SYNC<span className="text-[#FF5E00]">FIT</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
        {[
          { id: 'home', label: 'Dashboard' },
          { id: 'workout', label: 'Workout' },
          { id: 'gps', label: 'GPS Track' },
          { id: 'nutrition', label: 'Nutrition' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`transition-colors hover:text-[#FF5E00] ${
              activeTab === tab.id ? 'text-[#FF5E00] border-b-2 border-[#FF5E00] py-4' : 'text-[#111111]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`p-2 rounded-full hover:bg-[#F5F5F5] transition-colors ${activeTab === 'profile' ? 'bg-[#F5F5F5] text-[#FF5E00]' : ''}`}
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
