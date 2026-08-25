// src/components/NutritionView.tsx
import React, { useState } from 'react';
import { Utensils, Plus, Apple, Coffee, Moon, X, Save } from 'lucide-react';

export const NutritionView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const meals = [
    { title: 'Sarapan', kcal: 450, time: '07:30 WIB', icon: Coffee, desc: 'Oatmeal dengan pisang & whey protein' },
    { title: 'Makan Siang', kcal: 680, time: '12:30 WIB', icon: Apple, desc: 'Nasi merah, dada ayam panggang & brokoli' },
    { title: 'Makan Malam', kcal: 520, time: '19:00 WIB', icon: Moon, desc: 'Ikan salmon bakar & salad alpukat' },
  ];

  return (
    <div className="pt-0 pb-8 md:pt-6 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header Summary Nutrisi */}
      <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#FF5E00]/10 rounded-2xl flex items-center justify-center text-[#FF5E00] shrink-0">
            <Utensils className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">Target Kalori</h2>
            <p className="text-xs text-[#64748B]">Berdasarkan program pembentukan otot Anda</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center">
          <div>
            <p className="text-2xl font-black text-[#111827]">1,650</p>
            <p className="text-[11px] font-semibold text-[#64748B] uppercase">Dikonsumsi</p>
          </div>
          <div className="h-8 w-[1px] bg-[#E2E8F0]" />
          <div>
            <p className="text-2xl font-black text-[#FF5E00]">2,100</p>
            <p className="text-[11px] font-semibold text-[#64748B] uppercase">Target (kcal)</p>
          </div>
          <div className="h-8 w-[1px] bg-[#E2E8F0]" />
          <div>
            <p className="text-2xl font-black text-green-600">450</p>
            <p className="text-[11px] font-semibold text-[#64748B] uppercase">Sisa</p>
          </div>
        </div>
      </div>

      {/* Log Makanan Harian */}
      <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-base text-[#111827]">Log Makanan Hari Ini</h3>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Makanan</span>
          </button>
        </div>

        <div className="space-y-3">
          {meals.map((meal, idx) => {
            const Icon = meal.icon;
            return (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-lg text-[#111827] shadow-sm border border-[#E2E8F0]">
                    <Icon className="w-5 h-5 text-[#FF5E00]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111827]">{meal.title}</h4>
                    <p className="text-xs font-medium text-[#64748B] max-w-[200px] sm:max-w-md truncate">{meal.desc}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-sm text-[#111827]">{meal.kcal} kcal</span>
                  <p className="text-[10px] font-medium text-[#94A3B8]">{meal.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL POP-UP TAMBAH MAKANAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-[#F1F5F9]">
              <h3 className="font-bold text-lg text-[#111827]">Catat Makanan Baru</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body Modal */}
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Nama Makanan / Menu</label>
                <input 
                  type="text" 
                  placeholder="Cth: Dada Ayam Bakar" 
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Jumlah Kalori</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-4 pr-12 py-3 text-sm font-bold focus:outline-none focus:border-[#FF5E00] transition-all"
                    />
                    <span className="absolute right-4 top-3 text-xs font-bold text-[#94A3B8]">kcal</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Waktu Makan</label>
                  <select className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#FF5E00] appearance-none transition-all">
                    <option>Sarapan</option>
                    <option>Makan Siang</option>
                    <option>Makan Malam</option>
                    <option>Cemilan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-5 bg-[#F8FAFC] border-t border-[#F1F5F9] flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 bg-white border border-[#E2E8F0] text-[#111827] rounded-xl text-sm font-bold hover:bg-[#F1F5F9] transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 bg-[#FF5E00] text-white rounded-xl text-sm font-bold hover:bg-[#E05300] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Log</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionView;
