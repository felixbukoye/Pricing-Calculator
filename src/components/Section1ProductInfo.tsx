import React from 'react';

interface Section1ProductInfoProps {
  productName: string;
  batchUnits: number | '';
  onChangeProductName: (value: string) => void;
  onChangeBatchUnits: (value: number | '') => void;
}

export const Section1ProductInfo: React.FC<Section1ProductInfoProps> = ({
  productName,
  batchUnits,
  onChangeProductName,
  onChangeBatchUnits,
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden mb-5">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
            1
          </span>
          <h2 className="text-sm font-bold text-slate-900">Product & Batch Size</h2>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="product-name-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product-name-input"
              value={productName}
              onChange={(e) => onChangeProductName(e.target.value)}
              placeholder="e.g. Shea Butter Lotion (250ml)"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 font-medium transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="batch-units-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Batch Size (Units)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              id="batch-units-input"
              value={batchUnits}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10));
                onChangeBatchUnits(isNaN(val as number) ? '' : val);
              }}
              placeholder="1"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all text-center sm:text-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
