import React from 'react';
import { Lock } from 'lucide-react';
import { formatNaira, formatPercent } from '../utils/formatters';

interface Section6TrueCostSummaryProps {
  materialCostPerUnit: number;
  totalPackagingCostPerUnit: number;
  labourCostPerUnit: number;
  overheadPerUnit: number;
  trueCostPerUnit: number;
  productName: string;
}

export const Section6TrueCostSummary: React.FC<Section6TrueCostSummaryProps> = ({
  materialCostPerUnit,
  totalPackagingCostPerUnit,
  labourCostPerUnit,
  overheadPerUnit,
  trueCostPerUnit,
  productName: _productName,
}) => {
  const safeTotal = trueCostPerUnit > 0 ? trueCostPerUnit : 1;
  const matPct = (materialCostPerUnit / safeTotal) * 100;
  const pkgPct = (totalPackagingCostPerUnit / safeTotal) * 100;
  const labPct = (labourCostPerUnit / safeTotal) * 100;
  const ovhPct = (overheadPerUnit / safeTotal) * 100;

  return (
    <section className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm mb-5 border border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center text-xs font-black">
            6
          </span>
          <div>
            <h2 className="text-base font-bold text-white">True Cost Breakdown</h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Auto-calculated Baseline</span>
        </div>
      </div>

      {/* 4 Cost Pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Materials</span>
            <span className="font-mono text-slate-300 font-semibold">{matPct.toFixed(0)}%</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {formatNaira(materialCostPerUnit)}
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Packaging</span>
            <span className="font-mono text-slate-300 font-semibold">{pkgPct.toFixed(0)}%</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {formatNaira(totalPackagingCostPerUnit)}
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Labour</span>
            <span className="font-mono text-slate-300 font-semibold">{labPct.toFixed(0)}%</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {formatNaira(labourCostPerUnit)}
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Overhead</span>
            <span className="font-mono text-slate-300 font-semibold">{ovhPct.toFixed(0)}%</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {formatNaira(overheadPerUnit)}
          </div>
        </div>
      </div>

      {/* Total Baseline Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 block">Total True Cost Per Unit</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">
            {formatNaira(trueCostPerUnit)}
          </span>
        </div>

        <div className="text-xs text-slate-400 sm:text-right">
          Absolute production baseline. Any sale below this price is loss-making.
        </div>
      </div>
    </section>
  );
};
