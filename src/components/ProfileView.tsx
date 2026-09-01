// src/components/ProfileView.tsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, User, Settings, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const ProfileView: React.FC = () => {
  const [profileData, setProfileData] = useState<{
    full_name: string;
    age: number;
    weight_kg: number;
    height_cm: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data profil dari Supabase secara otomatis berdasarkan user yang login
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Ambil data user yang sedang aktif (sama seperti di Onboarding)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('User belum login atau sesi habis.');
          return;
        }

        // Tarik data profil berdasarkan user.id yang dinamis
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, age, weight_kg, height_cm')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setProfileData(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Fungsi Logout yang berfungsi nyata
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const menuItems = [
    { icon: <User className="w-5 h-5 text-slate-600" />, title: 'Edit Profil Pribadi', subtitle: 'Tinggi, berat badan, & target' },
    { icon: <Settings className="w-5 h-5 text-slate-600" />, title: 'Pengaturan Aplikasi', subtitle: 'Tema & preferensi bahasa' },
    { icon: <Bell className="w-5 h-5 text-slate-600" />, title: 'Notifikasi', subtitle: 'Pengingat latihan & makan' },
    { icon: <Shield className="w-5 h-5 text-slate-600" />, title: 'Privasi & Keamanan', subtitle: 'Kata sandi & data akun' },
    { icon: <HelpCircle className="w-5 h-5 text-slate-600" />, title: 'Pusat Bantuan', subtitle: 'FAQ & hubungi dukungan' },
  ];

  return (
    // max-w-lg diubah ke max-w-5xl, ditambah md:grid untuk memisahkan kolom di desktop
    <div className="pt-4 pb-24 px-4 md:px-8 max-w-5xl mx-auto space-y-6 md:space-y-0 md:gap-8 md:grid md:grid-cols-12 font-sans animate-fade-in">
      
      {/* BAGIAN KIRI / ATAS (Profil Utama & Logout) */}
      <div className="md:col-span-4 space-y-6">
        {/* KARTU PROFIL UTAMA (Warna Hitam) */}
        <div className="bg-[#111827] rounded-[2rem] p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-[#FF5E00] rounded-full flex items-center justify-center border-4 border-[#111827] shadow-lg mb-4 mx-auto">
              <span className="text-4xl font-black text-white">
                {isLoading ? '...' : getInitial(profileData?.full_name || '')}
              </span>
            </div>
            
            <span className="bg-white/10 text-slate-300 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm">
              Warrior Member
            </span>
            
            <h2 className="text-2xl font-black text-white mt-4 tracking-tight">
              {isLoading ? 'Memuat...' : profileData?.full_name || 'Pengguna'}
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Bergabung sejak 2026</p>
          </div>
        </div>

        {/* TOMBOL LOGOUT (Dipindah ke bawah kartu hitam pada mode desktop) */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl font-bold transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Keluar Akun
        </button>
      </div>

      {/* BAGIAN KANAN / BAWAH (Statistik & Menu) */}
      <div className="md:col-span-8 space-y-6">
        
        {/* GRID STATISTIK FISIK (Di HP 2 kolom, di Desktop 4 kolom) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Berat</p>
            <p className="text-2xl font-black text-[#111827]">
              {isLoading ? '...' : profileData?.weight_kg || '--'} <span className="text-sm font-bold text-slate-400">kg</span>
            </p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Tinggi</p>
            <p className="text-2xl font-black text-[#111827]">
              {isLoading ? '...' : profileData?.height_cm || '--'} <span className="text-sm font-bold text-slate-400">cm</span>
            </p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Umur</p>
            <p className="text-2xl font-black text-[#111827]">
              {isLoading ? '...' : profileData?.age || '--'} <span className="text-sm font-bold text-slate-400">thn</span>
            </p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center transition-transform hover:-translate-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Latihan</p>
            <p className="text-2xl font-black text-[#111827]">
              18 <span className="text-sm font-bold text-slate-400">sesi</span>
            </p>
          </div>
        </div>

        {/* MENU PENGATURAN */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-slate-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-100 rounded-xl">
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#111827]">{item.title}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default ProfileView;
