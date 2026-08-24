// src/components/NutritionView.tsx
import React from 'react';
import { Utensils, Plus, Flame, Apple, Coffee, Moon } from 'lucide-react';

export const NutritionView: React.FC = () => {
  const meals = [
    { title: 'Sarapan', kcal: 450, time: '07:30 WIB', icon: Coffee, desc: 'Oatmeal dengan pisang & whey protein' },
    { title: 'Makan Siang', kcal: 680, time: '12:30 WIB', icon: Apple, desc: 'Nasi merah, dada ayam panggang & brokoli' },
    { title: 'Makan Malam', kcal: 520, time: '19:00 WIB', icon: Moon, desc: 'Ikan salmon bakar & salad alpukat' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Summary Nutrisi */}
      <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#FF5E00]/10 rounded-2xl flex items-center justify-center text-[#FF5E00]">
            <Utensils className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">Target Kalori Harian</h2>
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
          <button className="px-3 py-1.5 bg-[#111827] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1F2937]">
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
                    <h4 className="font-semibold text-sm text-[#111827]">{meal.title}</h4>
                    <p className="text-xs text-[#64748B]">{meal.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-[#111827]">{meal.kcal} kcal</span>
                  <p className="text-[10px] text-[#94A3B8]">{meal.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NutritionView;
