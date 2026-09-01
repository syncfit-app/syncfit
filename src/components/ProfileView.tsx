// src/components/ProfileView.tsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, User, Settings, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const ProfileView: React.FC = () => {
  // State untuk menyimpan data profil dari database
  const [profileData, setProfileData] = useState<{
    full_name: string;
    age: number;
    weight_kg: number;
    height_cm: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ID pengguna sementara (akan diganti saat sistem Login sudah jadi)
  const userId = "33c01b23-55d0-42d8-8f8b-b586df683696";

  // Mengambil data profil dari Supabase
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, age, weight_kg, height_cm')
          .eq('id', userId)
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

  // Fungsi untuk mengambil inisial nama (contoh: "Coach Surya" -> "C")
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const menuItems = [
    { icon: <User className="w-5 h-5 text-slate-600" />, title: 'Edit Profil Pribadi', subtitle: 'Tinggi, berat badan, & target' },
    { icon: <Settings className="w-5 h-5 text-slate-600" />, title: 'Pengaturan Aplikasi', subtitle: 'Tema & preferensi bahasa' },
    { icon: <Bell className="w-5 h-5 text-slate-600" />, title: 'Notifikasi', subtitle: 'Pengingat latihan & makan' },
    { icon: <Shield className="w-5 h-5 text-slate-600" />, title: 'Privasi & Keamanan', subtitle: 'Kata sandi & data akun' },
    { icon: <HelpCircle className="w-5 h-5 text-slate-600" />, title: 'Pusat Bantuan', subtitle: 'FAQ & hubungi dukungan' },
  ];

  return (
    <div className="pt-4 pb-24 px-4 md:px-8 max-w-lg mx-auto space-y-6 font-sans animate-fade-in">
      
      {/* KARTU PROFIL UTAMA (Warna Hitam) */}
      <div className="bg-[#111827] rounded-[2rem] p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
        
        <div className="relative z-10">
          {/* Avatar Bulat */}
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

      {/* GRID STATISTIK FISIK */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Berat</p>
          <p className="text-2xl font-black text-[#111827]">
            {isLoading ? '...' : profileData?.weight_kg || '--'} <span className="text-sm font-bold text-slate-400">kg</span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Tinggi</p>
          <p className="text-2xl font-black text-[#111827]">
            {isLoading ? '...' : profileData?.height_cm || '--'} <span className="text-sm font-bold text-slate-400">cm</span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Umur</p>
          <p className="text-2xl font-black text-[#111827]">
            {isLoading ? '...' : profileData?.age || '--'} <span className="text-sm font-bold text-slate-400">thn</span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Latihan</p>
          {/* Untuk sementara angka latihan kita set statis karena tabel workout belum tersambung */}
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

      {/* TOMBOL LOGOUT */}
      <button className="w-full flex items-center justify-center gap-2 p-4 mt-6 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl font-bold transition-colors">
        <LogOut className="w-5 h-5" />
        Keluar Akun
      </button>

    </div>
  );
};

export default ProfileView;
