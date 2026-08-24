// src/components/OnboardingView.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Loader2, User, Activity, Target, LogOut, Utensils } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    weight_kg: '',
    height_cm: '',
    fitness_goal: 'Hypertrophy', // Sudah sesuai standar DB
    activity_level: 'Moderate',  // Diubah ke Moderate (standar DB untuk Aktif)
    diet_type: 'Omnivore',
    food_style: 'Indonesian Everyday',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Sesi tidak ditemukan. Silakan login ulang.');

      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          age: parseInt(formData.age),
          weight_kg: parseFloat(formData.weight_kg),
          height_cm: parseFloat(formData.height_cm),
          fitness_goal: formData.fitness_goal,
          activity_level: formData.activity_level,
          diet_type: formData.diet_type,
          food_style: formData.food_style,
        });

      if (dbError) throw dbError;
      
      onComplete();
      
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal menyimpan profil. Pastikan semua kolom terisi dengan benar.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-[#F1F5F9] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-3xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#111827]">
            Lengkapi <span className="text-[#FF5E00]">Profil Anda</span>
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-2">
            Kami membutuhkan sedikit data untuk mempersonalisasi program SyncFit Anda.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100 flex justify-between items-center break-words">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Baris 1: Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
              <User className="w-4 h-4 text-[#FF5E00]" /> Nama Lengkap
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] transition-all"
              placeholder="Masukkan nama asli / panggilan Anda"
            />
          </div>

          {/* Baris 2: Fisik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Umur (Tahun)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required min="10" max="100"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00]"
                placeholder="Misal: 25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Berat (Kg)</label>
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                required min="30" max="250" step="0.1"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00]"
                placeholder="Misal: 70"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Tinggi (Cm)</label>
              <input
                type="number"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleChange}
                required min="100" max="250"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00]"
                placeholder="Misal: 175"
              />
            </div>
          </div>

          {/* Baris 3: Aktivitas & Tujuan (VALUE TELAH DIPERBAIKI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF5E00]" /> Aktivitas
              </label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00]"
              >
                {/* VALUE menggunakan English (standar DB), label menggunakan Indonesia */}
                <option value="Sedentary">Sedentari (Jarang)</option>
                <option value="Light">Aktif Ringan (1-3x/Mgg)</option>
                <option value="Moderate">Aktif (3-5x/Mgg)</option>
                <option value="Very Active">Sangat Aktif (Atlet)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#FF5E00]" /> Tujuan
              </label>
              <select
                name="fitness_goal"
                value={formData.fitness_goal}
                onChange={handleChange}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00]"
              >
                {/* VALUE diperbaiki menyesuaikan MEAL_TEMPLATE_LOGIC */}
                <option value="Hypertrophy">Otot (Hypertrophy)</option>
                <option value="Fat Loss">Lemak (Fat Loss)</option>
                <option value="Strength">Kekuatan (Strength)</option>
                <option value="Body Recomposition">Re-komposisi Tubuh</option>
                <option value="General Fitness">Pemeliharaan (Maintenance)</option>
              </select>
            </div>
          </div>

          {/* Baris 4: Preferensi Makanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#FF5E00]" /> Diet
              </label>
              <select
                name="diet_type"
                value={formData.diet_type}
                onChange={handleChange}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00]"
              >
                <option value="Omnivore">Omnivora (Bebas)</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#FF5E00]" /> Gaya Makanan
              </label>
              <select
                name="food_style"
                value={formData.food_style}
                onChange={handleChange}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00]"
              >
                <option value="Indonesian Everyday">Harian Indonesia</option>
                <option value="High-Protein Fitness">Tinggi Protein (Fitness)</option>
                <option value="Budget-Friendly">Ramah Kantong (Budget)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(255,94,0,0.39)] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Simpan Profil & Mulai</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 bg-transparent hover:bg-gray-50 text-[#64748B] hover:text-[#111827] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Batalkan & Kembali ke Login</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OnboardingView;
