import React from 'react';
import {
  Package,
  Layers,
  Box,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Receipt,
  LayoutDashboard,
  LayoutGrid,
} from 'lucide-react';
import { CalculationResults, PricingConfig } from '../types';
import { formatNaira, formatPercent } from '../utils/formatters';

export type DashboardTabId =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'all';

interface DashboardNavBarProps {
  activeTab: DashboardTabId;
  onSelectTab: (tabId: DashboardTabId) => void;
  results: CalculationResults;
  batchUnits: number | '';
  pricing: PricingConfig;
  productName: string;
}

export const DashboardNavBar: React.FC<DashboardNavBarProps> = ({
  activeTab,
  onSelectTab,
  results,
  batchUnits,
  pricing: _pricing,
  productName: _productName,
}) => {
  const {
    materialCostPerUnit,
    totalPackagingCostPerUnit,
    labourCostPerUnit,
    overheadPerUnit,
    trueCostPerUnit,
    activeSellingPrice,
    totalSellingCostsPerUnit,
    netProfitMargin,
  } = results;

  const navItems = [
    {
      id: '1' as DashboardTabId,
      stepNumber: '1',
      title: 'Batch',
      icon: Package,
      value: `${batchUnits || 1} pcs`,
    },
    {
      id: '2' as DashboardTabId,
      stepNumber: '2',
      title: 'Materials',
      icon: Layers,
      value: formatNaira(materialCostPerUnit),
    },
    {
      id: '3' as DashboardTabId,
      stepNumber: '3',
      title: 'Packaging',
      icon: Box,
      value: formatNaira(totalPackagingCostPerUnit),
    },
    {
      id: '4' as DashboardTabId,
      stepNumber: '4',
      title: 'Labour',
      icon: Clock,
      value: formatNaira(labourCostPerUnit),
    },
    {
      id: '5' as DashboardTabId,
      stepNumber: '5',
      title: 'Overhead',
      icon: Zap,
      value: formatNaira(overheadPerUnit),
    },
    {
      id: '6' as DashboardTabId,
      stepNumber: '6',
      title: 'True Cost',
      icon: Target,
      value: formatNaira(trueCostPerUnit),
      isMilestone: true,
    },
    {
      id: '7' as DashboardTabId,
      stepNumber: '7',
      title: 'Pricing',
      icon: TrendingUp,
      value: formatNaira(activeSellingPrice),
    },
    {
      id: '8' as DashboardTabId,
      stepNumber: '8',
      title: 'Fees',
      icon: Receipt,
      value: formatNaira(totalSellingCostsPerUnit),
    },
    {
      id: '9' as DashboardTabId,
      stepNumber: '9',
      title: 'Summary',
      icon: LayoutDashboard,
      value: formatPercent(netProfitMargin),
      isMilestone: true,
    },
  ];

  return (
    <nav
      id="dashboard-navigation-bar"
      aria-label="Workflow Steps"
      className="bg-white border border-slate-200/90 rounded-2xl shadow-xs mb-5 p-2 overflow-hidden"
    >
      <div className="flex items-center justify-between pb-2 px-2 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workflow Steps
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium text-[11px]">
            {activeTab === 'all' ? 'All Sections' : `Step ${activeTab} of 9`}
          </span>
        </div>

        <button
          type="button"
          id="nav-view-all-btn"
          onClick={() => onSelectTab(activeTab === 'all' ? '1' : 'all')}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{activeTab === 'all' ? 'Show Step View' : 'View All'}</span>
        </button>
      </div>

      {/* Nav Items Row */}
      <div className="pt-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              id={`dashboard-nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 min-w-[96px] py-2 px-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : item.isMilestone
                  ? 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-100/60 text-slate-800'
                  : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-slate-800 text-slate-200'
                      : item.isMilestone
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.stepNumber}
                </span>
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? 'text-slate-300'
                      : item.isMilestone
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                />
              </div>

              <div
                className={`text-xs font-semibold truncate ${
                  isActive ? 'text-white' : 'text-slate-900'
                }`}
              >
                {item.title}
              </div>

              <div
                className={`text-[11px] font-mono font-medium truncate mt-0.5 ${
                  isActive
                    ? 'text-slate-300'
                    : item.isMilestone
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {item.value}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
