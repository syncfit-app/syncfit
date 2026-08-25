// src/components/BottomNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Map, Utensils, Target } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/', label: 'HOME', icon: LayoutDashboard },
    { path: '/workout', label: 'WORKOUT', icon: Dumbbell },
    { path: '/gps', label: 'GPS', icon: Map },
    { path: '/nutrition', label: 'NUTRITION', icon: Utensils },
    { path: '/progress', label: 'PROGRESS', icon: Target },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-50 md:hidden shadow-[0_-4px_20px_rgb(0,0,0,0.03)] pb-safe">
      <div className="flex items-center justify-between px-2 h-[72px]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all ${
                isActive ? 'text-[#FF5E00]' : 'text-[#94A3B8] hover:text-[#64748B]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
