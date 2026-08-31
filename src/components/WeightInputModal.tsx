// src/components/WeightInputModal.tsx
import React, { useState } from 'react';
import { X, Scale } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Path ini sudah sesuai dengan github_2.JPG

interface WeightInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentWeight?: number;
  onSuccess: (newWeight: number) => void;
}

export const WeightInputModal: React.FC<WeightInputModalProps> = ({
  isOpen,
  onClose,
  userId,
  currentWeight,
  onSuccess,
}) => {
  const [weight, setWeight] = useState(currentWeight ? currentWeight.toString() : '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Jika state isOpen false, modal tidak akan dirender
  if (!isOpen) return null;

  const handleSave = async () => {
    const numWeight = parseFloat(weight);
    
    // Validasi input
    if (!weight || isNaN(numWeight) || numWeight <= 0) {
      setError('Masukkan angka berat badan yang valid.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Proses update ke tabel profiles di Supabase
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({ weight_kg: numWeight })
        .eq('id', userId);

      if (supabaseError) throw supabaseError;

      // Jika sukses, panggil fungsi onSuccess dan tutup modal
      onSuccess(numWeight);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative transition-transform transform scale-100">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-xl text-[#FF5E00]">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-black text-lg text-[#111827]">Berat Badan</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal (Input Area) */}
        <div className="p-6 pt-5">
          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Masukkan Berat (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Contoh: 72.5"
            disabled={isLoading}
            className="w-full bg-slate-50 border border-slate-200 text-[#111827] text-3xl font-black rounded-2xl px-5 py-4 focus:outline-none focus:border-[#FF5E00] focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-slate-300 placeholder:font-medium text-center"
          />
          
          {error && (
            <p className="mt-3 text-xs font-bold text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full mt-6 bg-[#FF5E00] hover:bg-[#E05300] text-white font-extrabold text-base py-4 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-orange-500/30"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default WeightInputModal;
