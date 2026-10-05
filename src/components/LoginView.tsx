// src/components/LoginView.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Loader2, Eye, EyeOff, KeyRound, RefreshCw } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // E1: setelah signUp() berhasil, alih-alih "cek email lalu klik link", user tetap di halaman
  // ini dan masuk ke langkah verifikasi kode OTP (dikirim via Brevo, template Supabase sudah
  // diubah pakai {{ .Token }}). step 'otp' cuma dipakai untuk signup baru — login harian tetap
  // password biasa (sesuai kesepakatan, tidak menyentuh alur signInWithPassword sama sekali).
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown kirim-ulang: cuma pencegah spam-klik di UI, bukan timer yang perlu akurat lintas
  // background seperti timer sesi/rest timer di WorkoutView — jadi decrement per-tick biasa sudah
  // cukup, tidak perlu pola timestamp-based di sini.
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setStep('otp');
        setResendCooldown(30);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Terjadi kesalahan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg('');

    try {
      // PENTING: type di sini HARUS 'email', bukan 'signup' — 'signup' sudah deprecated di
      // verifyOtp() versi supabase-js terbaru (beda dengan resend() di bawah, yang type-nya
      // memang masih 'signup'). Salah pakai type di sini bikin verifikasi selalu gagal.
      const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'email' });
      if (error) throw error;
      if (!data.session) throw new Error('Verifikasi berhasil tapi sesi tidak ditemukan. Coba masuk manual dengan password.');
      onLogin();
    } catch (error: any) {
      setErrorMsg(error.message || 'Kode salah atau sudah kedaluwarsa.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      setResendCooldown(30);
    } catch (error: any) {
      setErrorMsg(error.message || 'Gagal mengirim ulang kode.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToForm = () => {
    setStep('form');
    setOtpCode('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[400px]">

        {/* Header / Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="SyncFit Logo"
            className="w-16 h-16 object-contain mb-3 drop-shadow-sm"
            onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
          />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827] italic leading-none">
            SYNC<span className="text-[#FF5E00]">FIT</span>
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            {step === 'otp' ? 'Satu langkah lagi.' : (isRegister ? 'Mulai perjalanan kebugaranmu.' : 'Selamat datang kembali, Warrior.')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100 text-center">
            {errorMsg}
          </div>
        )}

        {step === 'otp' ? (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FF5E00]/10 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6 text-[#FF5E00]" />
              </div>
              <p className="text-sm font-medium text-[#64748B]">
                Kami kirim kode 6 digit ke<br />
                <span className="font-bold text-[#111827]">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Kode Verifikasi</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  autoFocus
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-center text-2xl font-black font-mono tracking-[0.5em] text-[#111827] focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] transition-all"
                  placeholder="------"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || otpCode.length !== 6}
                className="w-full py-4 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(255,94,0,0.39)] disabled:opacity-70"
              >
                {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>Verifikasi & Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Pengingat spam, sesuai kesepakatan — deliverability ke Gmail/Yahoo tidak 100%
                terjamin tanpa domain sendiri (Brevo single-sender verification). */}
            <p className="mt-5 text-xs text-center text-[#94A3B8]">
              Tidak menerima kode? Cek folder Spam/Promosi email kamu.
            </p>

            <div className="mt-3 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isResending}
                className="text-sm font-semibold text-[#FF5E00] hover:text-[#E05300] transition-colors disabled:text-[#94A3B8] disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim ulang kode'}
              </button>
              <button
                type="button"
                onClick={handleBackToForm}
                className="text-sm font-semibold text-[#64748B] hover:text-[#111827] transition-colors"
              >
                Ganti email
              </button>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Email</label>
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
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Password</label>
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94A3B8] hover:text-[#64748B] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-[#FF5E00] hover:bg-[#E05300] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(255,94,0,0.39)] disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>{isRegister ? 'Daftar Sekarang' : 'Masuk ke Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
                className="text-sm font-semibold text-[#64748B] hover:text-[#111827] transition-colors"
              >
                {isRegister ? 'Sudah punya akun? Masuk di sini.' : 'Belum punya akun? Daftar sekarang.'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginView;
