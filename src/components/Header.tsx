import React from 'react';
import { RotateCcw, Printer, HelpCircle } from 'lucide-react';
import { BUSINESS_PRESETS } from '../data/presets';
import { BusinessPreset } from '../types';

interface HeaderProps {
  activePresetId: string | null;
  onSelectPreset: (preset: BusinessPreset) => void;
  onReset: () => void;
  onPrint: () => void;
  onToggleGuide: () => void;
  isGuideOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activePresetId,
  onSelectPreset,
  onReset,
  onPrint,
  onToggleGuide,
  isGuideOpen,
}) => {
  return (
    <header className="mb-5 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
      {/* Top row: Title + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
            ₦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Cost &amp; Pricing Calculator
              </h1>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-mono">
                NGN (₦)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Production unit costing &amp; sustainable selling price calculator
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onToggleGuide}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              isGuideOpen
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isGuideOpen ? 'Close Guide' : 'Quick Guide'}</span>
          </button>

          <button
            type="button"
            id="print-summary-header-btn"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
            title="Print or Export PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <button
            type="button"
            id="reset-form-header-btn"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
            title="Reset form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Presets Row: Minimal & Clean */}
      <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Presets:
        </span>
        <div className="flex items-center flex-wrap gap-1.5">
          {BUSINESS_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                id={`preset-btn-${preset.id}`}
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
                }`}
              >
                {preset.name.split(' / ')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
