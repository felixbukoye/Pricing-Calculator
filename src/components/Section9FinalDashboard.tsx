import React, { useState } from 'react';
import {
  AlertTriangle,
  Printer,
  Copy,
  Check,
  Percent,
  ShieldCheck,
  CloudUpload,
  Loader2,
} from 'lucide-react';
import { CalculationResults, PricingConfig } from '../types';
import { formatNaira, formatPercent } from '../utils/formatters';

interface Section9FinalDashboardProps {
  productName: string;
  results: CalculationResults;
  pricing: PricingConfig;
  testDiscountPercent: number | '';
  onChangeDiscount: (value: number | '') => void;
  onPrint: () => void;
  onSaveToCloud?: () => void;
  isSavingToCloud?: boolean;
}

export const Section9FinalDashboard: React.FC<Section9FinalDashboardProps> = ({
  productName,
  results,
  pricing,
  testDiscountPercent,
  onChangeDiscount,
  onPrint,
  onSaveToCloud,
  isSavingToCloud,
}) => {
  const [copied, setCopied] = useState(false);

  const {
    trueCostPerUnit,
    activeSellingPrice,
    netProfitPerUnit,
    netProfitMargin,
    activeGrossProfit,
    activeGrossMargin,
    totalSellingCostsPerUnit,
    minimumViablePrice,
    isBelowTrueCost,
    isBelowMinimumViablePrice,
    discountPercent,
    discountedPrice,
    profitAfterDiscount,
    marginAfterDiscount,
    isDiscountBelowTrueCost,
  } = results;

  const copySummaryToClipboard = () => {
    const summaryText = `📦 PRICING BREAKDOWN: ${productName || 'Product'}
------------------------------------
• True Cost / Unit: ${formatNaira(trueCostPerUnit)}
• Selling Price: ${formatNaira(activeSellingPrice)}
• Selling Fees: ${formatNaira(totalSellingCostsPerUnit)}
• Net Profit: ${formatNaira(netProfitPerUnit)} (${formatPercent(netProfitMargin)} Margin)
• Minimum Viable Price: ${formatNaira(minimumViablePrice)}
${
  discountPercent > 0
    ? `\n🏷️ DISCOUNT (${discountPercent}% OFF):
• Discounted Price: ${formatNaira(discountedPrice)}
• Profit After Discount: ${formatNaira(profitAfterDiscount)} (${formatPercent(marginAfterDiscount)} Margin)`
    : ''
}
------------------------------------
Calculated with Cost & Pricing Calculator (₦)`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4">
      {/* Loss Alert Banner */}
      {isBelowTrueCost && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="text-xs">
            <strong>Selling price is below True Cost ({formatNaira(trueCostPerUnit)}).</strong>{' '}
            You lose {formatNaira(Math.abs(activeGrossProfit))} on every unit sold.
          </div>
        </div>
      )}

      {/* Fee Warning Banner */}
      {!isBelowTrueCost && isBelowMinimumViablePrice && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <strong>Price does not cover selling fees.</strong> Minimum viable price to break even after fees is {formatNaira(minimumViablePrice)}.
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
              9
            </span>
            <h2 className="text-sm font-bold text-slate-900">Executive Summary</h2>
          </div>

          <div className="flex items-center gap-2">
            {onSaveToCloud && (
              <button
                type="button"
                id="save-calculation-cloud-btn"
                onClick={onSaveToCloud}
                disabled={isSavingToCloud}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                title="Save calculation to your account in Firebase"
              >
                {isSavingToCloud ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CloudUpload className="w-3.5 h-3.5" />
                )}
                <span>Save to Cloud</span>
              </button>
            )}
            <button
              type="button"
              id="copy-summary-btn"
              onClick={copySummaryToClipboard}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              id="print-summary-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* True Cost */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                True Cost
              </span>
              <div className="text-xl font-black font-mono text-slate-900 tracking-tight">
                {formatNaira(trueCostPerUnit)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Production baseline</span>
            </div>

            {/* Selling Price */}
            <div
              className={`p-3.5 rounded-xl border ${
                isBelowTrueCost
                  ? 'border-red-200 bg-red-50/40 text-red-950'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Selling Price
              </span>
              <div
                className={`text-xl font-black font-mono tracking-tight ${
                  isBelowTrueCost ? 'text-red-600' : 'text-slate-900'
                }`}
              >
                {formatNaira(activeSellingPrice)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {pricing.selectedMethod === 'markup' ? 'Markup rule' : 'Margin rule'}
              </span>
            </div>

            {/* Net Profit */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Net Profit / Unit
              </span>
              <div
                className={`text-xl font-black font-mono tracking-tight ${
                  netProfitPerUnit >= 0 ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {formatNaira(netProfitPerUnit)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Gross: {formatNaira(activeGrossProfit)}
              </span>
            </div>

            {/* Net Margin */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Net Margin
              </span>
              <div
                className={`text-xl font-black font-mono tracking-tight ${
                  netProfitMargin >= 0.2
                    ? 'text-emerald-700'
                    : netProfitMargin > 0
                    ? 'text-amber-700'
                    : 'text-red-600'
                }`}
              >
                {formatPercent(netProfitMargin)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Gross: {formatPercent(activeGrossMargin)}
              </span>
            </div>
          </div>

          {/* Discount Simulator */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Percent className="w-3.5 h-3.5 text-slate-500" />
                <span>Discount Simulator</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Promo Discount:</span>
                <div className="w-20 relative">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    step="any"
                    id="test-discount-input"
                    value={testDiscountPercent}
                    onChange={(e) =>
                      onChangeDiscount(e.target.value === '' ? '' : parseFloat(e.target.value))
                    }
                    placeholder="10"
                    className="w-full pl-2.5 pr-6 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 text-right focus:outline-none focus:border-slate-800"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">
                    %
                  </span>
                </div>
              </div>
            </div>

            {isDiscountBelowTrueCost && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                ⚠️ Discounted price ({formatNaira(discountedPrice)}) is below True Cost ({formatNaira(trueCostPerUnit)}).
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Discounted Price
                </span>
                <span
                  className={`text-sm font-bold font-mono ${
                    isDiscountBelowTrueCost ? 'text-red-600' : 'text-slate-900'
                  }`}
                >
                  {formatNaira(discountedPrice)}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Profit After Promo
                </span>
                <span
                  className={`text-sm font-bold font-mono ${
                    profitAfterDiscount >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {formatNaira(profitAfterDiscount)}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Margin After Promo
                </span>
                <span
                  className={`text-sm font-bold font-mono ${
                    marginAfterDiscount >= 0.15
                      ? 'text-emerald-700'
                      : marginAfterDiscount > 0
                      ? 'text-amber-700'
                      : 'text-red-600'
                  }`}
                >
                  {formatPercent(marginAfterDiscount)}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Floor Indicator */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-slate-600">
                Minimum Break-Even Price (covering production + fees):
              </span>
              <strong className="font-mono text-slate-900 font-bold">
                {formatNaira(minimumViablePrice)}
              </strong>
            </div>

            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isBelowTrueCost
                  ? 'bg-red-100 text-red-800'
                  : isBelowMinimumViablePrice
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isBelowTrueCost
                ? 'Loss'
                : isBelowMinimumViablePrice
                ? 'High Risk'
                : 'Sustainable'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
