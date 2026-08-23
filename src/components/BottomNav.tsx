// src/components/BottomNav.tsx
import React from 'react';
import { LayoutDashboard, Dumbbell, Compass, Utensils, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'gps', label: 'GPS', icon: Compass },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'progress', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E2E8F0] px-4 flex items-center justify-around z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#FF5E00]' : 'text-[#707072]'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold uppercase">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
