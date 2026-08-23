import React from 'react';
import { Utensils, ChevronRight } from 'lucide-react';

interface NutritionSummaryCardProps {
  onViewDetail?: () => void;
}

export const NutritionSummaryCard: React.FC<NutritionSummaryCardProps> = ({ onViewDetail }) => {
  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
          <Utensils className="w-5 h-5 text-[#FF5E00]" /> MAKRONUTRISI
        </h3>
        <button onClick={onViewDetail} className="text-xs font-semibold text-[#FF5E00] flex items-center gap-1 hover:underline">
          DETAIL <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>PROTEIN</span>
            <span className="font-mono">120g / 160g</span>
          </div>
          <div className="h-2 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
            <div className="h-full bg-[#FF006B] rounded-full" style={{ width: '75%' }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>KARBOHIDRAT</span>
            <span className="font-mono">180g / 220g</span>
          </div>
          <div className="h-2 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
            <div className="h-full bg-[#FF5E00] rounded-full" style={{ width: '81%' }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>LEMAK</span>
            <span className="font-mono">45g / 60g</span>
          </div>
          <div className="h-2 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
            <div className="h-full bg-[#0284C7] rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
