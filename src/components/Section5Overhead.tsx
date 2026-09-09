import React from 'react';
import { Plus, Trash2, ListPlus, Calculator } from 'lucide-react';
import { OverheadConfig, OverheadExpenseItem } from '../types';
import { formatNaira, parseNum } from '../utils/formatters';

interface Section5OverheadProps {
  overhead: OverheadConfig;
  totalMonthlyOverhead: number;
  overheadPerUnit: number;
  onUpdateOverhead: (field: keyof OverheadConfig, value: any) => void;
  onAddOverheadItem: () => void;
  onUpdateOverheadItem: (id: string, field: keyof OverheadExpenseItem, value: any) => void;
  onRemoveOverheadItem: (id: string) => void;
}

export const Section5Overhead: React.FC<Section5OverheadProps> = ({
  overhead,
  totalMonthlyOverhead,
  overheadPerUnit,
  onUpdateOverhead,
  onAddOverheadItem,
  onUpdateOverheadItem,
  onRemoveOverheadItem,
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden mb-5">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
            5
          </span>
          <h2 className="text-sm font-bold text-slate-900">Overhead & Operating Expenses</h2>
        </div>

        {/* Toggle Mode */}
        <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 shrink-0 text-xs">
          <button
            type="button"
            id="overhead-itemized-toggle"
            onClick={() => onUpdateOverhead('mode', 'itemized')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              overhead.mode === 'itemized'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <ListPlus className="w-3.5 h-3.5 text-slate-600" />
            <span>Itemized</span>
          </button>
          <button
            type="button"
            id="overhead-single-toggle"
            onClick={() => onUpdateOverhead('mode', 'single')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              overhead.mode === 'single'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-slate-600" />
            <span>Lump Sum</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Production Volume Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div>
            <label
              htmlFor="expected-monthly-units-input"
              className="block text-xs font-bold text-slate-800"
            >
              Monthly Production Volume (Units / Month)
            </label>
            <span className="text-[11px] text-slate-500">
              Total units produced per month to distribute overhead across
            </span>
          </div>

          <div className="w-full sm:w-40 shrink-0">
            <input
              type="number"
              min="1"
              step="1"
              id="expected-monthly-units-input"
              value={overhead.expectedMonthlyUnits}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10));
                onUpdateOverhead('expectedMonthlyUnits', isNaN(val as number) ? '' : val);
              }}
              placeholder="100"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>
        </div>

        {overhead.mode === 'itemized' ? (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700">Monthly Operating Expenses</div>
            <div className="space-y-2">
              {overhead.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    id={`overhead-name-${item.id}`}
                    value={item.name}
                    onChange={(e) => onUpdateOverheadItem(item.id, 'name', e.target.value)}
                    placeholder={index === 0 ? 'e.g. Generator Fuel, Rent, Data' : 'Expense item'}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-slate-800"
                  />
                  <div className="w-36 shrink-0">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      id={`overhead-amount-${item.id}`}
                      value={item.amount ?? ''}
                      onChange={(e) =>
                        onUpdateOverheadItem(
                          item.id,
                          'amount',
                          e.target.value === '' ? '' : parseFloat(e.target.value)
                        )
                      }
                      placeholder="₦0.00"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  {overhead.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveOverheadItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              id="add-overhead-btn"
              onClick={onAddOverheadItem}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold py-1.5 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
          </div>
        ) : (
          <div className="max-w-md">
            <label
              htmlFor="lump-sum-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Total Monthly Overhead (₦)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              id="lump-sum-input"
              value={overhead.singleMonthlyAmount ?? ''}
              onChange={(e) =>
                onUpdateOverhead(
                  'singleMonthlyAmount',
                  e.target.value === '' ? '' : parseFloat(e.target.value)
                )
              }
              placeholder="e.g. 50000"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Total Monthly: <strong className="font-mono text-slate-800">{formatNaira(totalMonthlyOverhead)}</strong>
        </span>
        <span className="text-slate-500 font-medium">
          Overhead / Unit: <strong className="font-mono text-slate-900 text-sm font-bold">{formatNaira(overheadPerUnit)}</strong>
        </span>
      </div>
    </section>
  );
};
