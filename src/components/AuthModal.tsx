// src/components/AuthModal.tsx

import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });

        if (error) throw error;

        if (data.user) {
          // Buat entri profil awal
          await supabase.from('profiles').insert([
            { id: data.user.id, email, full_name: fullName }
          ]);
        }
        alert('Pendaftaran berhasil! Silakan periksa email untuk verifikasi atau gunakan akun untuk login.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat otentikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-8 relative shadow-2xl space-y-6">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 hover:bg-[#F5F5F5] rounded-full text-[#707072] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E2E8F0] pb-2 gap-4">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`text-sm font-extrabold uppercase tracking-wider pb-2 border-b-2 transition-all ${
              mode === 'login' 
                ? 'border-[#FF5E00] text-[#FF5E00]' 
                : 'border-transparent text-[#707072] hover:text-[#111111]'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`text-sm font-extrabold uppercase tracking-wider pb-2 border-b-2 transition-all ${
              mode === 'signup' 
                ? 'border-[#FF5E00] text-[#FF5E00]' 
                : 'border-transparent text-[#707072] hover:text-[#111111]'
            }`}
          >
            Daftar (Sign Up)
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-[12px] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold uppercase text-[#707072] block mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#707072] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] py-3 pl-10 pr-4 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-1.5">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#707072] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] py-3 pl-10 pr-4 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#707072] block mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#707072] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F5F5F5] border border-[#E2E8F0] rounded-[12px] py-3 pl-10 pr-4 text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF5E00]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#FF5E00] to-[#FF006B] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" /> Masuk Akun
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Buat Akun Baru
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
