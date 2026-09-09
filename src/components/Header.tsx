import React from 'react';
import { RotateCcw, Printer, HelpCircle, User, HardDrive, LogIn, ShieldCheck } from 'lucide-react';
import { BUSINESS_PRESETS } from '../data/presets';
import { BusinessPreset, UserAccountInfo } from '../types';

interface HeaderProps {
  activePresetId: string | null;
  onSelectPreset: (preset: BusinessPreset) => void;
  onReset: () => void;
  onPrint: () => void;
  onToggleGuide: () => void;
  isGuideOpen: boolean;
  currentUser: UserAccountInfo | null;
  onOpenAuth: () => void;
  onOpenAccount: (tab?: 'account' | 'files' | 'calculations' | 'rules') => void;
  projectId: string;
}

export const Header: React.FC<HeaderProps> = ({
  activePresetId,
  onSelectPreset,
  onReset,
  onPrint,
  onToggleGuide,
  isGuideOpen,
  currentUser,
  onOpenAuth,
  onOpenAccount,
  projectId,
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
                Cost & Pricing Calculator
              </h1>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-mono">
                NGN (₦)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Firebase: <span className="font-mono text-slate-700 font-semibold">{projectId}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Auth / User Files trigger */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                id="header-user-account-btn"
                onClick={() => onOpenAccount('account')}
                className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-slate-800 hover:text-emerald-700 transition cursor-pointer"
                title="View account details"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.displayName || currentUser.email}</span>
              </button>

              <button
                type="button"
                id="header-user-files-btn"
                onClick={() => onOpenAccount('files')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
                title="Manage uploaded files & receipts"
              >
                <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                <span>Files</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="header-sign-in-btn"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}

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
