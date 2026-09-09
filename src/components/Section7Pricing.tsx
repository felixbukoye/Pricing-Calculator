import React from 'react';
import { Lock } from 'lucide-react';
import { PricingConfig } from '../types';
import { formatNaira, formatPercent } from '../utils/formatters';

interface Section7PricingProps {
  trueCostPerUnit: number;
  pricing: PricingConfig;
  markupScenario: {
    sellingPrice: number;
    profit: number;
    realizedMargin: number;
  };
  marginScenario: {
    sellingPrice: number;
    profit: number;
    realizedMargin: number;
  };
  onUpdatePricing: (field: keyof PricingConfig, value: any) => void;
}

export const Section7Pricing: React.FC<Section7PricingProps> = ({
  trueCostPerUnit,
  pricing,
  markupScenario,
  marginScenario,
  onUpdatePricing,
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden mb-5">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
            7
          </span>
          <h2 className="text-sm font-bold text-slate-900">Pricing Strategy</h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">True Cost:</span>
          <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            {formatNaira(trueCostPerUnit)}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Active Strategy Status Banner */}
        <div className="mb-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 font-medium">Currently Driving Your Price:</span>
            <strong className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              {pricing.selectedMethod === 'markup'
                ? `Method A: Markup (${pricing.desiredMarkupPercent || 0}%)`
                : `Method B: Margin (${pricing.desiredMarginPercent || 0}%)`}
            </strong>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Active Selling Price:</span>
            <span className="font-mono font-black text-sm text-slate-900">
              {formatNaira(
                pricing.selectedMethod === 'markup'
                  ? markupScenario.sellingPrice
                  : marginScenario.sellingPrice
              )}
            </span>
          </div>
        </div>

        {/* Comparison: Markup vs Margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method A: Markup */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              pricing.selectedMethod === 'markup'
                ? 'border-slate-900 bg-slate-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Method A
                </span>
                <h3 className="text-sm font-bold text-slate-900">Markup on Cost</h3>
              </div>

              <button
                type="button"
                id="select-markup-method-btn"
                onClick={() => onUpdatePricing('selectedMethod', 'markup')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  pricing.selectedMethod === 'markup'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {pricing.selectedMethod === 'markup' ? 'Active' : 'Select'}
              </button>
            </div>

            <div className="mb-3">
              <label
                htmlFor="markup-percentage-input"
                className="block text-xs font-semibold text-slate-600 mb-1"
              >
                Desired Markup % (Adds % on top of True Cost)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  id="markup-percentage-input"
                  value={pricing.desiredMarkupPercent ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                    onUpdatePricing('desiredMarkupPercent', val);
                    if (pricing.selectedMethod !== 'markup') {
                      onUpdatePricing('selectedMethod', 'markup');
                    }
                  }}
                  onFocus={() => {
                    if (pricing.selectedMethod !== 'markup') {
                      onUpdatePricing('selectedMethod', 'markup');
                    }
                  }}
                  placeholder="50"
                  className="w-full px-3 py-1.5 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">
                  %
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Selling Price:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatNaira(markupScenario.sellingPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Gross Profit:</span>
                <span className="font-mono font-medium text-emerald-700">
                  {formatNaira(markupScenario.profit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Realized Margin:</span>
                <span className="font-mono font-semibold text-slate-700">
                  {formatPercent(markupScenario.realizedMargin)}
                </span>
              </div>
            </div>
          </div>

          {/* Method B: Target Margin */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              pricing.selectedMethod === 'margin'
                ? 'border-slate-900 bg-slate-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Method B
                </span>
                <h3 className="text-sm font-bold text-slate-900">Profit Margin</h3>
              </div>

              <button
                type="button"
                id="select-margin-method-btn"
                onClick={() => onUpdatePricing('selectedMethod', 'margin')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  pricing.selectedMethod === 'margin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {pricing.selectedMethod === 'margin' ? 'Active' : 'Select'}
              </button>
            </div>

            <div className="mb-3">
              <label
                htmlFor="margin-percentage-input"
                className="block text-xs font-semibold text-slate-600 mb-1"
              >
                Target Margin % (Profit % of Selling Price)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="95"
                  step="any"
                  id="margin-percentage-input"
                  value={pricing.desiredMarginPercent ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                    onUpdatePricing('desiredMarginPercent', val);
                    if (pricing.selectedMethod !== 'margin') {
                      onUpdatePricing('selectedMethod', 'margin');
                    }
                  }}
                  onFocus={() => {
                    if (pricing.selectedMethod !== 'margin') {
                      onUpdatePricing('selectedMethod', 'margin');
                    }
                  }}
                  placeholder="40"
                  className="w-full px-3 py-1.5 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">
                  %
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Selling Price:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatNaira(marginScenario.sellingPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Gross Profit:</span>
                <span className="font-mono font-medium text-emerald-700">
                  {formatNaira(marginScenario.profit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Equivalent Markup:</span>
                <span className="font-mono font-semibold text-slate-700">
                  {trueCostPerUnit > 0
                    ? formatPercent((marginScenario.profit / trueCostPerUnit) * 100)
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
