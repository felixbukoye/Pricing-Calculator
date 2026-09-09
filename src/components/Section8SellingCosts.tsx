import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SellingCostItem, SellingCostType } from '../types';
import { formatNaira, parseNum } from '../utils/formatters';

interface Section8SellingCostsProps {
  sellingCosts: SellingCostItem[];
  activeSellingPrice: number;
  totalSellingCostsPerUnit: number;
  netProfitPerUnit: number;
  netProfitMargin: number;
  onUpdateSellingCost: (id: string, field: keyof SellingCostItem, value: any) => void;
  onAddSellingCost: () => void;
  onRemoveSellingCost: (id: string) => void;
}

export const Section8SellingCosts: React.FC<Section8SellingCostsProps> = ({
  sellingCosts,
  activeSellingPrice,
  totalSellingCostsPerUnit,
  netProfitPerUnit: _netProfitPerUnit,
  netProfitMargin: _netProfitMargin,
  onUpdateSellingCost,
  onAddSellingCost,
  onRemoveSellingCost,
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden mb-5">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
            8
          </span>
          <h2 className="text-sm font-bold text-slate-900">Selling & Gateway Fees</h2>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Total Deductions: <strong className="font-mono text-slate-900 text-sm font-bold">{formatNaira(totalSellingCostsPerUnit)}</strong>
        </span>
      </div>

      <div className="p-5 space-y-2.5">
        {sellingCosts.map((item, index) => {
          const val = parseNum(item.value, 0);
          const calculatedAmount =
            item.type === 'percentage' ? activeSellingPrice * (val / 100) : val;

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl"
            >
              <div className="flex-1">
                <input
                  type="text"
                  id={`selling-cost-name-${item.id}`}
                  value={item.name}
                  onChange={(e) => onUpdateSellingCost(item.id, 'name', e.target.value)}
                  placeholder={
                    index === 0
                      ? 'e.g. Paystack / Flutterwave Fee'
                      : 'Fee description'
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                />
              </div>

              {/* Type Switch (% or Fixed ₦) */}
              <div className="w-28 shrink-0">
                <select
                  id={`selling-cost-type-${item.id}`}
                  value={item.type}
                  onChange={(e) =>
                    onUpdateSellingCost(item.id, 'type', e.target.value as SellingCostType)
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-800"
                >
                  <option value="percentage">% of Price</option>
                  <option value="fixed">Fixed (₦)</option>
                </select>
              </div>

              {/* Fee Value */}
              <div className="w-28 shrink-0 relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  id={`selling-cost-value-${item.id}`}
                  value={item.value}
                  onChange={(e) =>
                    onUpdateSellingCost(
                      item.id,
                      'value',
                      e.target.value === '' ? '' : parseFloat(e.target.value)
                    )
                  }
                  placeholder={item.type === 'percentage' ? '1.5' : '100'}
                  className="w-full pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  {item.type === 'percentage' ? '%' : '₦'}
                </span>
              </div>

              {/* Deducted Amount Per Unit */}
              <div className="w-32 shrink-0 text-right pr-2">
                <span className="font-mono font-bold text-xs text-slate-800">
                  -{formatNaira(calculatedAmount)}
                </span>
              </div>

              {/* Delete Button */}
              {sellingCosts.length > 1 && (
                <button
                  type="button"
                  id={`remove-selling-cost-btn-${item.id}`}
                  onClick={() => onRemoveSellingCost(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer self-end sm:self-auto"
                  title="Remove fee"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          id="add-selling-cost-btn"
          onClick={onAddSellingCost}
          className="text-xs text-slate-600 hover:text-slate-900 font-semibold py-1.5 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Selling Fee</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Deductions per Unit Sold:
        </span>
        <span className="font-mono font-bold text-slate-900 text-sm">
          {formatNaira(totalSellingCostsPerUnit)}
        </span>
      </div>
    </section>
  );
};
