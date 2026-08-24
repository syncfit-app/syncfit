// src/components/NutritionSummaryCard.tsx
import React from 'react';
import { Utensils } from 'lucide-react';

export const NutritionSummaryCard: React.FC = () => {
  const macros = [
    { label: 'Protein', current: 110, target: 140, color: 'bg-[#FF5E00]' },
    { label: 'Karbo', current: 180, target: 220, color: 'bg-[#111111]' },
    { label: 'Lemak', current: 45, target: 65, color: 'bg-[#707072]' },
  ];

  return (
    <div className="bg-white p-6 border-2 border-[#111111] rounded-none md:rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-[#FF5E00]" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#111111]">
            Asupan Nutrisi
          </h3>
        </div>
        <span className="text-xs font-bold text-[#707072]">Sisa: 450 kcal</span>
      </div>

      <div className="space-y-3">
        {macros.map((macro, idx) => {
          const percentage = Math.min(100, Math.round((macro.current / macro.target) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#111111] uppercase">{macro.label}</span>
                <span className="text-[#707072]">{macro.current}g / {macro.target}g</span>
              </div>
              <div className="w-full bg-[#F5F5F5] h-2 border border-[#E2E8F0]">
                <div 
                  className={`${macro.color} h-full`} 
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
