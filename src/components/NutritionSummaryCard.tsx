// src/components/NutritionSummaryCard.tsx
import React from 'react';
import { Utensils } from 'lucide-react';

export const NutritionSummaryCard: React.FC = () => {
  const macros = [
    { label: 'Protein', current: 110, target: 140, color: 'bg-[#FF5E00]' },
    { label: 'Karbo', current: 180, target: 220, color: 'bg-[#111827]' },
    { label: 'Lemak', current: 45, target: 65, color: 'bg-[#94A3B8]' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FF5E00]/10 rounded-xl">
            <Utensils className="w-5 h-5 text-[#FF5E00]" />
          </div>
          <h3 className="font-bold text-sm text-[#111827]">Asupan Nutrisi</h3>
        </div>
        <span className="text-xs font-semibold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-lg">
          Sisa: 450 kcal
        </span>
      </div>

      <div className="space-y-4">
        {macros.map((macro, idx) => {
          const percentage = Math.min(100, Math.round((macro.current / macro.target) * 100));
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#111827]">{macro.label}</span>
                <span className="text-[#64748B]">
                  <span className="text-[#111827] font-semibold">{macro.current}g</span> / {macro.target}g
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                <div 
                  className={`${macro.color} h-full rounded-full transition-all duration-500 ease-out`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionSummaryCard;
