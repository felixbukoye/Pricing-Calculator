import React from 'react';
import { CalculationResults, MaterialItem, PackagingItem, OverheadConfig, LabourConfig, PricingConfig, SellingCostItem } from '../types';
import { formatNaira, formatPercent, parseNum } from '../utils/formatters';

interface PrintSummarySheetProps {
  productName: string;
  batchUnits: number | '';
  materials: MaterialItem[];
  packaging: PackagingItem[];
  labour: LabourConfig;
  overhead: OverheadConfig;
  pricing: PricingConfig;
  sellingCosts: SellingCostItem[];
  results: CalculationResults;
}

export const PrintSummarySheet: React.FC<PrintSummarySheetProps> = ({
  productName,
  batchUnits,
  materials,
  packaging,
  labour,
  overhead,
  pricing,
  sellingCosts,
  results,
}) => {
  return (
    <div className="hidden print:block text-stone-900 bg-white p-6 max-w-4xl mx-auto text-xs">
      <div className="border-b-2 border-stone-800 pb-4 mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">Product Costing & Pricing Report</h1>
          <p className="text-sm font-semibold text-stone-700 mt-1">Product: {productName || 'Untitled Product'}</p>
        </div>
        <div className="text-right text-stone-500">
          <p>Currency: Nigerian Naira (₦)</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-4 gap-3 p-3 bg-stone-100 rounded-lg mb-6 border border-stone-300 text-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Batch Size</span>
          <span className="text-sm font-bold">{batchUnits || 1} units</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">True Cost / Unit</span>
          <span className="text-sm font-bold text-stone-900">{formatNaira(results.trueCostPerUnit)}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Selling Price</span>
          <span className="text-sm font-bold text-emerald-800">{formatNaira(results.activeSellingPrice)}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Net Profit / Unit</span>
          <span className="text-sm font-bold text-emerald-800">
            {formatNaira(results.netProfitPerUnit)} ({formatPercent(results.netProfitMargin)})
          </span>
        </div>
      </div>

      {/* 4 Pillars Table */}
      <h2 className="font-bold text-stone-800 mb-2 uppercase text-[11px] border-b pb-1">1. True Cost Breakdown Per Unit</h2>
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="bg-stone-50 text-left border-b border-stone-300">
            <th className="py-1 px-2">Cost Category</th>
            <th className="py-1 px-2">Details</th>
            <th className="py-1 px-2 text-right">Cost Per Unit</th>
            <th className="py-1 px-2 text-right">Share (%)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          <tr>
            <td className="py-1 px-2 font-semibold">Raw Materials / Items</td>
            <td className="py-1 px-2 text-stone-600">{materials.length} material lines entered</td>
            <td className="py-1 px-2 text-right font-medium">{formatNaira(results.materialCostPerUnit)}</td>
            <td className="py-1 px-2 text-right">
              {formatPercent(results.trueCostPerUnit > 0 ? results.materialCostPerUnit / results.trueCostPerUnit : 0)}
            </td>
          </tr>
          <tr>
            <td className="py-1 px-2 font-semibold">Packaging & Presentation</td>
            <td className="py-1 px-2 text-stone-600">{packaging.length} packaging lines</td>
            <td className="py-1 px-2 text-right font-medium">{formatNaira(results.totalPackagingCostPerUnit)}</td>
            <td className="py-1 px-2 text-right">
              {formatPercent(results.trueCostPerUnit > 0 ? results.totalPackagingCostPerUnit / results.trueCostPerUnit : 0)}
            </td>
          </tr>
          <tr>
            <td className="py-1 px-2 font-semibold">Labour</td>
            <td className="py-1 px-2 text-stone-600">
              {labour.type === 'time-based'
                ? `${labour.hoursSpent || 0} hrs @ ${formatNaira(parseNum(labour.hourlyRate, 0), false)}/hr`
                : 'Fixed flat rate'}
            </td>
            <td className="py-1 px-2 text-right font-medium">{formatNaira(results.labourCostPerUnit)}</td>
            <td className="py-1 px-2 text-right">
              {formatPercent(results.trueCostPerUnit > 0 ? results.labourCostPerUnit / results.trueCostPerUnit : 0)}
            </td>
          </tr>
          <tr>
            <td className="py-1 px-2 font-semibold">Overhead Allocation</td>
            <td className="py-1 px-2 text-stone-600">{formatNaira(results.totalMonthlyOverhead)} / {overhead.expectedMonthlyUnits || 1} units monthly</td>
            <td className="py-1 px-2 text-right font-medium">{formatNaira(results.overheadPerUnit)}</td>
            <td className="py-1 px-2 text-right">
              {formatPercent(results.trueCostPerUnit > 0 ? results.overheadPerUnit / results.trueCostPerUnit : 0)}
            </td>
          </tr>
          <tr className="bg-stone-100 font-bold border-t-2 border-stone-800">
            <td className="py-1 px-2" colSpan={2}>TRUE PRODUCTION COST PER UNIT</td>
            <td className="py-1 px-2 text-right text-stone-900">{formatNaira(results.trueCostPerUnit)}</td>
            <td className="py-1 px-2 text-right">100.0%</td>
          </tr>
        </tbody>
      </table>

      {/* Pricing Analysis Table */}
      <h2 className="font-bold text-stone-800 mb-2 uppercase text-[11px] border-b pb-1">2. Pricing & Profit Analysis</h2>
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-stone-50 text-left border-b border-stone-300">
            <th className="py-1 px-2">Metric</th>
            <th className="py-1 px-2 text-right">Markup Method ({pricing.desiredMarkupPercent || 0}%)</th>
            <th className="py-1 px-2 text-right">Margin Method ({pricing.desiredMarginPercent || 0}%)</th>
            <th className="py-1 px-2 text-right font-bold">Active Chosen Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          <tr>
            <td className="py-1 px-2 font-semibold">Selling Price</td>
            <td className="py-1 px-2 text-right">{formatNaira(results.markupScenario.sellingPrice)}</td>
            <td className="py-1 px-2 text-right">{formatNaira(results.marginScenario.sellingPrice)}</td>
            <td className="py-1 px-2 text-right font-bold text-emerald-800">{formatNaira(results.activeSellingPrice)}</td>
          </tr>
          <tr>
            <td className="py-1 px-2 font-semibold">Gross Profit</td>
            <td className="py-1 px-2 text-right">{formatNaira(results.markupScenario.profit)}</td>
            <td className="py-1 px-2 text-right">{formatNaira(results.marginScenario.profit)}</td>
            <td className="py-1 px-2 text-right font-medium">{formatNaira(results.activeGrossProfit)}</td>
          </tr>
          <tr>
            <td className="py-1 px-2 font-semibold">Realized Margin</td>
            <td className="py-1 px-2 text-right">{formatPercent(results.markupScenario.realizedMargin)}</td>
            <td className="py-1 px-2 text-right">{formatPercent(results.marginScenario.realizedMargin)}</td>
            <td className="py-1 px-2 text-right font-medium">{formatPercent(results.activeGrossMargin)}</td>
          </tr>
          <tr>
            <td className="py-1 px-2 font-semibold">Selling & Transaction Fees</td>
            <td className="py-1 px-2 text-right" colSpan={2}>Payment fees & delivery subsidy</td>
            <td className="py-1 px-2 text-right text-stone-700">-{formatNaira(results.totalSellingCostsPerUnit)}</td>
          </tr>
          <tr className="bg-stone-100 font-bold border-t-2 border-stone-800">
            <td className="py-1 px-2" colSpan={3}>NET TAKE-HOME PROFIT PER UNIT</td>
            <td className="py-1 px-2 text-right text-emerald-900">{formatNaira(results.netProfitPerUnit)}</td>
          </tr>
        </tbody>
      </table>

      <div className="border-t border-stone-300 pt-3 text-[10px] text-stone-500 flex justify-between">
        <span>Minimum Viable Price to Break Even: <strong>{formatNaira(results.minimumViablePrice)}</strong></span>
        <span>Generated with Product Cost & Selling Price Calculator (₦ Edition)</span>
      </div>
    </div>
  );
};
