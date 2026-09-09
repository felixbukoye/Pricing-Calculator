import React from 'react';
import { CalculationResults, PricingConfig } from '../types';
import { formatNaira, formatPercent } from '../utils/formatters';

interface ExecutiveMetricStripProps {
  results: CalculationResults;
  pricing: PricingConfig;
  onSelectTab?: (tabId: string) => void;
}

export const ExecutiveMetricStrip: React.FC<ExecutiveMetricStripProps> = ({
  results,
  pricing: _pricing,
  onSelectTab,
}) => {
  const {
    trueCostPerUnit,
    activeSellingPrice,
    netProfitPerUnit,
    netProfitMargin,
    isBelowTrueCost,
  } = results;

  return (
    <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 shadow-xs mb-5">
      {/* 1. True Cost Per Unit */}
      <button
        type="button"
        onClick={() => onSelectTab?.('6')}
        className={`p-4 text-left transition-colors cursor-pointer hover:bg-slate-50/70 focus:outline-none focus:bg-slate-50`}
      >
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          True Cost / Unit
        </span>
        <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-tight">
          {formatNaira(trueCostPerUnit)}
        </div>
        <span className="text-[11px] text-slate-400 mt-0.5 block">
          Baseline production
        </span>
      </button>

      {/* 2. Selling Price */}
      <button
        type="button"
        onClick={() => onSelectTab?.('7')}
        className={`p-4 text-left transition-colors cursor-pointer hover:bg-slate-50/70 focus:outline-none focus:bg-slate-50`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Selling Price
          </span>
          {isBelowTrueCost && (
            <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
              Below Cost
            </span>
          )}
        </div>
        <div
          className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
            isBelowTrueCost ? 'text-red-600' : 'text-slate-900'
          }`}
        >
          {formatNaira(activeSellingPrice)}
        </div>
        <span className="text-[11px] text-slate-400 mt-0.5 block">
          Customer price
        </span>
      </button>

      {/* 3. Net Profit Per Unit */}
      <button
        type="button"
        onClick={() => onSelectTab?.('8')}
        className={`p-4 text-left transition-colors cursor-pointer hover:bg-slate-50/70 focus:outline-none focus:bg-slate-50`}
      >
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          Net Profit / Unit
        </span>
        <div
          className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
            netProfitPerUnit >= 0 ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {formatNaira(netProfitPerUnit)}
        </div>
        <span className="text-[11px] text-slate-400 mt-0.5 block">
          After all costs & fees
        </span>
      </button>

      {/* 4. Net Margin */}
      <button
        type="button"
        onClick={() => onSelectTab?.('9')}
        className={`p-4 text-left transition-colors cursor-pointer hover:bg-slate-50/70 focus:outline-none focus:bg-slate-50`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Net Margin
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              netProfitMargin >= 0.2
                ? 'bg-emerald-50 text-emerald-700'
                : netProfitMargin > 0
                ? 'bg-amber-50 text-amber-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {netProfitMargin >= 0.2 ? 'Healthy' : netProfitMargin > 0 ? 'Low' : 'Loss'}
          </span>
        </div>
        <div
          className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
            netProfitMargin >= 0.2
              ? 'text-emerald-700'
              : netProfitMargin > 0
              ? 'text-amber-700'
              : 'text-red-600'
          }`}
        >
          {formatPercent(netProfitMargin)}
        </div>
        <span className="text-[11px] text-slate-400 mt-0.5 block">
          Take-home percentage
        </span>
      </button>
    </section>
  );
};
