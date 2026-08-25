// src/components/Header.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
  profile: any;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onLogout }) => {
  const navItems = [
    { path: '/', label: 'DASHBOARD' },
    { path: '/workout', label: 'WORKOUT' },
    { path: '/gps', label: 'GPS TRACK' },
    { path: '/nutrition', label: 'NUTRITION' },
    { path: '/progress', label: 'PROGRESS' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white border-b border-[#F1F5F9] z-50 px-4 md:px-8 flex items-center justify-between shadow-sm">
      {/* KIRI: Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#111827] italic">
          SYNC<span className="text-[#FF5E00]">FIT</span>
        </h1>
      </Link>
      
      {/* TENGAH: Menu Navigasi (Hanya Muncul di Desktop/Tablet) */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `text-xs font-bold tracking-wider transition-all ${
                isActive 
                  ? 'text-[#FF5E00] border-b-2 border-[#FF5E00] py-1' 
                  : 'text-[#64748B] hover:text-[#111827] py-1'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* KANAN: User Profile & Logout (Tampil di Mobile & Desktop) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Username selalu tampil */}
        <span className="text-sm font-bold text-[#111827] max-w-[100px] md:max-w-[150px] truncate">
          {profile?.full_name || 'Warrior'}
        </span>
        
        {/* Tombol Profil (Nantinya akan diganti foto saat fitur upload aktif) */}
        <Link 
          to="/profile" 
          className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-full text-[#64748B] transition-colors"
          title="Lihat Profil"
        >
          <User className="w-4 h-4 md:w-5 md:h-5" />
        </Link>

        {/* Tombol Logout */}
        <button 
          onClick={onLogout} 
          className="p-2 text-[#94A3B8] hover:text-red-500 transition-colors"
          title="Keluar (Logout)"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </header>
  );
};
