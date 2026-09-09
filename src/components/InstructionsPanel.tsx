import React from 'react';
import { ChevronUp } from 'lucide-react';

interface InstructionsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const InstructionsPanel: React.FC<InstructionsPanelProps> = ({ isOpen, onToggle }) => {
  if (!isOpen) return null;

  const steps = [
    { num: '1', title: 'Product & Batch', desc: 'Set your item name and the number of units produced in one run.' },
    { num: '2', title: 'Materials', desc: 'List supplies bought, purchase cost, and quantity used for this batch.' },
    { num: '3', title: 'Packaging', desc: 'Add boxes, jars, labels, and wrapping costs per finished unit.' },
    { num: '4', title: 'Labour', desc: 'Value production time by hourly rate or a fixed rate per unit.' },
    { num: '5', title: 'Overhead', desc: 'Allocate recurring business expenses (power, rent, internet) per unit.' },
    { num: '6', title: 'True Cost', desc: 'Review your total baseline cost before applying any markup or profit.' },
    { num: '7', title: 'Pricing Strategy', desc: 'Choose target markup % or desired profit margin %.' },
    { num: '8', title: 'Selling Fees', desc: 'Factor in payment gateway fees, marketplace commissions, and shipping.' },
    { num: '9', title: 'Summary & Simulator', desc: 'Check your net margin and simulate discounts before launching promotions.' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-5 transition-all">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Workflow Guide</h2>
          <p className="text-xs text-slate-500">9-step framework from raw material to sustainable selling price</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1"
        >
          <span>Hide</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((s) => (
          <div key={s.num} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {s.num}
              </span>
              <span className="text-xs font-bold text-slate-800">{s.title}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pl-7">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
