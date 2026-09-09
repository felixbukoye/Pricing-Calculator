import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CalculationResults } from '../types';
import { formatNaira, formatPercent } from '../utils/formatters';

interface StickySummaryBarProps {
  productName: string;
  results: CalculationResults;
  onScrollToTop: () => void;
  onScrollToPricing: () => void;
}

export const StickySummaryBar: React.FC<StickySummaryBarProps> = ({
  productName,
  results,
  onScrollToPricing,
}) => {
  const {
    trueCostPerUnit,
    activeSellingPrice,
    netProfitPerUnit,
    netProfitMargin,
    isBelowTrueCost,
  } = results;

  return (
    <aside
      aria-label="Summary Bar"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/80 shadow-xs px-4 py-2 transition-all"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs">
        {/* Left: Product Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-bold text-slate-900 truncate max-w-xs block">
            {productName || 'Untitled Product'}
          </span>

          {isBelowTrueCost && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold text-[10px]">
              <AlertTriangle className="w-3 h-3" />
              <span>Below Cost</span>
            </span>
          )}
        </div>

        {/* Right: Numbers */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="hidden sm:block text-right">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Cost</span>
            <span className="font-mono font-bold text-slate-700">
              {formatNaira(trueCostPerUnit)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Price</span>
            <span
              className={`font-mono font-bold ${
                isBelowTrueCost ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {formatNaira(activeSellingPrice)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Net Profit</span>
            <span
              className={`font-mono font-bold ${
                netProfitPerUnit >= 0 ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {formatNaira(netProfitPerUnit)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Margin</span>
            <span
              className={`font-mono font-bold ${
                netProfitMargin >= 0.2
                  ? 'text-emerald-700'
                  : netProfitMargin > 0
                  ? 'text-amber-700'
                  : 'text-red-600'
              }`}
            >
              {formatPercent(netProfitMargin)}
            </span>
          </div>

          <button
            type="button"
            onClick={onScrollToPricing}
            className="hidden md:inline-flex px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Adjust Price
          </button>
        </div>
      </div>
    </aside>
  );
};
