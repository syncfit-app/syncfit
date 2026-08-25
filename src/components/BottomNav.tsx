// src/components/BottomNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Map, Utensils, Target } from 'lucide-react'; // Menggunakan ikon Home agar lebih bersih

export const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/workout', label: 'Workout', icon: Dumbbell },
    { path: '/gps', label: 'GPS', icon: Map },
    { path: '/nutrition', label: 'Nutrisi', icon: Utensils },
    { path: '/progress', label: 'Progres', icon: Target },
  ];

  return (
    // Memuat Nav agar melayang (bottom-6) dengan bentuk pil (rounded-full)
    <nav className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
      <div className="bg-white rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#F1F5F9] p-2 flex items-center justify-between">
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative flex-1 flex flex-col items-center justify-center"
          >
            {({ isActive }) => (
              <>
                {/* Desain Kotak Melengkung (Squircle) untuk menu aktif */}
                <div className={`flex flex-col items-center justify-center w-[90%] h-14 rounded-[20px] transition-all duration-300 ease-out ${
                  isActive 
                    ? 'bg-[#FF5E00] text-white shadow-md transform -translate-y-0.5' 
                    : 'text-[#94A3B8] hover:text-[#111827] bg-transparent'
                }`}>
                  <item.icon 
                    className={`transition-all duration-300 ${isActive ? 'w-5 h-5' : 'w-6 h-6'}`} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                  {isActive && (
                    <span className="text-[9px] font-bold mt-1 tracking-wider">
                      {item.label}
                    </span>
                  )}
                </div>

                {/* Indikator Titik (Dot) ala Pinterest di bawah tombol aktif */}
                {isActive && (
                  <div className="absolute -bottom-1.5 w-1 h-1 bg-[#FF5E00] rounded-full shadow-sm" />
                )}
              </>
            )}
          </NavLink>
        ))}

      </div>
    </nav>
  );
};
