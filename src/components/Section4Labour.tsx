import React from 'react';
import { Clock, Banknote } from 'lucide-react';
import { LabourConfig } from '../types';
import { formatNaira, parseNum } from '../utils/formatters';

interface Section4LabourProps {
  labour: LabourConfig;
  batchUnits: number | '';
  totalLabourCostBatch: number;
  labourCostPerUnit: number;
  onUpdateLabour: (field: keyof LabourConfig, value: any) => void;
}

export const Section4Labour: React.FC<Section4LabourProps> = ({
  labour,
  batchUnits: _batchUnits,
  totalLabourCostBatch,
  labourCostPerUnit,
  onUpdateLabour,
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden mb-5">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
            4
          </span>
          <h2 className="text-sm font-bold text-slate-900">Labour & Production Time</h2>
        </div>

        {/* Toggle Mode */}
        <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 shrink-0 text-xs">
          <button
            type="button"
            id="labour-time-based-toggle"
            onClick={() => onUpdateLabour('type', 'time-based')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              labour.type === 'time-based'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>Time-based</span>
          </button>
          <button
            type="button"
            id="labour-fixed-toggle"
            onClick={() => onUpdateLabour('type', 'fixed')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              labour.type === 'fixed'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Banknote className="w-3.5 h-3.5 text-slate-600" />
            <span>Fixed / Unit</span>
          </button>
        </div>
      </div>

      <div className="p-5">
        {labour.type === 'time-based' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="hours-spent-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Hours Spent on Batch
              </label>
              <input
                type="number"
                min="0"
                step="any"
                id="hours-spent-input"
                value={labour.hoursSpent}
                onChange={(e) =>
                  onUpdateLabour(
                    'hoursSpent',
                    e.target.value === '' ? '' : parseFloat(e.target.value)
                  )
                }
                placeholder="e.g. 4"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label
                htmlFor="hourly-rate-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Hourly Rate (₦ / hour)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                id="hourly-rate-input"
                value={labour.hourlyRate}
                onChange={(e) =>
                  onUpdateLabour(
                    'hourlyRate',
                    e.target.value === '' ? '' : parseFloat(e.target.value)
                  )
                }
                placeholder="e.g. 1500"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Batch Labour Total
              </label>
              <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900">
                {formatNaira(totalLabourCostBatch)}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md">
            <label
              htmlFor="fixed-cost-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Fixed Labour Cost Per Unit (₦)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              id="fixed-cost-input"
              value={labour.fixedCostPerUnit}
              onChange={(e) =>
                onUpdateLabour(
                  'fixedCostPerUnit',
                  e.target.value === '' ? '' : parseFloat(e.target.value)
                )
              }
              placeholder="e.g. 500"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Labour Mode: <strong className="text-slate-800">{labour.type === 'time-based' ? 'Time-based' : 'Fixed per unit'}</strong>
        </span>
        <span className="text-slate-500 font-medium">
          Labour / Unit: <strong className="font-mono text-slate-900 text-sm font-bold">{formatNaira(labourCostPerUnit)}</strong>
        </span>
      </div>
    </section>
  );
};
