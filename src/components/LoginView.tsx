// src/components/LoginView.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk mata
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registrasi berhasil! Silakan cek email Anda atau langsung login jika auto-confirm aktif.');
        setIsRegister(false); // Otomatis kembali ke tab login
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(); // Beri tahu App.tsx bahwa user berhasil login
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Terjadi kesalahan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[400px]">
        
        {/* Header / Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827] mt-2">
            SYNC<span className="text-[#FF5E00]">FIT</span>
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            {isRegister ? 'Mulai perjalanan kebugaranmu.' : 'Selamat datang kembali, Warrior.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Login / Register */}
        <form onSubmit={handleAuth} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] transition-all"
              placeholder="nama@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] transition-all"
                placeholder="••••••••"
              />
              {/* Tombol Toggle Mata */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#64748B] transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(255,94,0,0.39)] disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Daftar Sekarang' : 'Masuk ke Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-sm font-semibold text-[#64748B] hover:text-[#111827] transition-colors"
          >
            {isRegister ? 'Sudah punya akun? Masuk di sini.' : 'Belum punya akun? Daftar sekarang.'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default LoginView;
