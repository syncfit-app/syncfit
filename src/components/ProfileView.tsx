// src/components/ProfileView.tsx
import React from 'react';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

interface ProfileViewProps {
  profile: any;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onLogout }) => {
  const menuItems = [
    { icon: User, label: 'Edit Profil Pribadi', desc: 'Tinggi, berat badan, & target' },
    { icon: Settings, label: 'Pengaturan Aplikasi', desc: 'Tema & preferensi bahasa' },
    { icon: Bell, label: 'Notifikasi', desc: 'Pengingat latihan & makan' },
    { icon: Shield, label: 'Privasi & Keamanan', desc: 'Kata sandi & data akun' },
    { icon: HelpCircle, label: 'Pusat Bantuan', desc: 'FAQ & hubungi dukungan' },
  ];

  return (
    <div className="pt-0 pb-8 md:pt-6 md:pb-12 px-4 md:px-8 max-w-3xl mx-auto space-y-6">
      
      {/* Kartu Profil Utama */}
      <div className="bg-[#111111] text-white p-6 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-[#FF5E00] rounded-full flex items-center justify-center text-white font-black text-4xl shadow-md shrink-0 border-4 border-[#222222]">
          {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#222222] rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-3 border border-gray-800">
            Warrior Member
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            {profile?.full_name || 'Warrior SyncFit'}
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Bergabung sejak {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Statistik Singkat */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Berat', value: profile?.weight || '--', unit: 'kg' },
          { label: 'Tinggi', value: profile?.height || '--', unit: 'cm' },
          { label: 'Umur', value: profile?.age || '--', unit: 'thn' },
          { label: 'Latihan', value: '18', unit: 'sesi' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">{stat.label}</p>
            <p className="text-xl font-black text-[#111111]">
              {stat.value} <span className="text-xs font-semibold text-[#64748B]">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Menu Navigasi Profil */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button 
              key={idx}
              className={`w-full flex items-center justify-between p-4 hover:bg-[#F5F5F7] transition-colors text-left ${
                idx !== menuItems.length - 1 ? 'border-b border-[#F1F5F9]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#F5F5F7] rounded-xl border border-[#E2E8F0]">
                  <Icon className="w-5 h-5 text-[#111111]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#111111]">{item.label}</h3>
                  <p className="text-xs font-medium text-[#64748B] mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#CACACB]" />
            </button>
          );
        })}
      </div>

      {/* Tombol Logout */}
      <button 
        onClick={onLogout}
        className="w-full bg-white hover:bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-center gap-2 text-red-600 font-bold text-sm transition-colors shadow-sm"
      >
        <LogOut className="w-5 h-5" />
        <span>Keluar dari Akun</span>
      </button>

      <div className="text-center pb-4">
        <p className="text-[10px] font-bold text-[#CACACB] uppercase tracking-wider">SyncFit v1.0.0</p>
      </div>
    </div>
  );
};

export default ProfileView;
