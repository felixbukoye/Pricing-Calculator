import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DashboardTabId } from './DashboardNavBar';

interface DashboardStepFooterProps {
  currentTab: DashboardTabId;
  onSelectTab: (tabId: DashboardTabId) => void;
}

const STEP_METADATA: Record<
  string,
  { name: string; prev: DashboardTabId | null; next: DashboardTabId | null }
> = {
  '1': { name: 'Batch', prev: null, next: '2' },
  '2': { name: 'Materials', prev: '1', next: '3' },
  '3': { name: 'Packaging', prev: '2', next: '4' },
  '4': { name: 'Labour', prev: '3', next: '5' },
  '5': { name: 'Overhead', prev: '4', next: '6' },
  '6': { name: 'True Cost', prev: '5', next: '7' },
  '7': { name: 'Pricing', prev: '6', next: '8' },
  '8': { name: 'Fees', prev: '7', next: '9' },
  '9': { name: 'Summary', prev: '8', next: null },
};

export const DashboardStepFooter: React.FC<DashboardStepFooterProps> = ({
  currentTab,
  onSelectTab,
}) => {
  if (currentTab === 'all') return null;

  const currentStepNum = parseInt(currentTab, 10);
  const meta = STEP_METADATA[currentTab];
  if (!meta) return null;

  return (
    <div className="mt-5 p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex items-center justify-between gap-3 text-xs">
      <div>
        {meta.prev ? (
          <button
            type="button"
            id="dashboard-step-prev-btn"
            onClick={() => onSelectTab(meta.prev!)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        ) : (
          <span className="text-slate-400 font-medium px-2">Step 1 of 9</span>
        )}
      </div>

      <div className="text-slate-400 font-medium hidden sm:block">
        Step {currentStepNum} of 9
      </div>

      <div>
        {meta.next ? (
          <button
            type="button"
            id="dashboard-step-next-btn"
            onClick={() => onSelectTab(meta.next!)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('1')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            <span>Back to Step 1</span>
          </button>
        )}
      </div>
    </div>
  );
};
