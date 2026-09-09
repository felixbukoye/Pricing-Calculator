import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PackagingItem } from '../types';
import { formatNaira, parseNum } from '../utils/formatters';

interface Section3PackagingProps {
  packaging: PackagingItem[];
  totalPackagingCostPerUnit: number;
  onUpdatePackaging: (id: string, field: keyof PackagingItem, value: any) => void;
  onAddPackaging: () => void;
  onRemovePackaging: (id: string) => void;
}

export const Section3Packaging: React.FC<Section3PackagingProps> = ({
  packaging,
  totalPackagingCostPerUnit,
  onUpdatePackaging,
  onAddPackaging,
  onRemovePackaging,
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden mb-5">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
            3
          </span>
          <h2 className="text-sm font-bold text-slate-900">Packaging & Presentation</h2>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Packaging / Unit: <strong className="font-mono text-slate-900 text-sm font-bold">{formatNaira(totalPackagingCostPerUnit)}</strong>
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 font-semibold">Packaging Item</th>
              <th className="px-3 py-3 font-semibold w-28">Qty Bought</th>
              <th className="px-3 py-3 font-semibold w-24">Unit</th>
              <th className="px-3 py-3 font-semibold w-32">Price (₦)</th>
              <th className="px-3 py-3 font-semibold w-28">Qty / Product</th>
              <th className="px-5 py-3 font-semibold w-32 text-right">Cost / Unit (₦)</th>
              <th className="px-3 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {packaging.map((item, index) => {
              const qtyPurchased = parseNum(item.quantityPurchased, 0);
              const price = parseNum(item.purchasePrice, 0);
              const qtyUsed = parseNum(item.quantityUsedPerProduct, 0);
              const costPerUnit = qtyPurchased > 0 ? (price / qtyPurchased) * qtyUsed : 0;

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-2.5">
                    <input
                      type="text"
                      id={`packaging-name-${item.id}`}
                      value={item.name}
                      onChange={(e) => onUpdatePackaging(item.id, 'name', e.target.value)}
                      placeholder={index === 0 ? 'e.g. Glass Jar (250ml)' : 'Packaging item'}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      id={`packaging-qty-purchased-${item.id}`}
                      value={item.quantityPurchased}
                      onChange={(e) =>
                        onUpdatePackaging(
                          item.id,
                          'quantityPurchased',
                          e.target.value === '' ? '' : parseFloat(e.target.value)
                        )
                      }
                      placeholder="1"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="text"
                      id={`packaging-unit-${item.id}`}
                      value={item.unit}
                      onChange={(e) => onUpdatePackaging(item.id, 'unit', e.target.value)}
                      placeholder="pcs, box"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      id={`packaging-purchase-price-${item.id}`}
                      value={item.purchasePrice}
                      onChange={(e) =>
                        onUpdatePackaging(
                          item.id,
                          'purchasePrice',
                          e.target.value === '' ? '' : parseFloat(e.target.value)
                        )
                      }
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      id={`packaging-qty-used-${item.id}`}
                      value={item.quantityUsedPerProduct}
                      onChange={(e) =>
                        onUpdatePackaging(
                          item.id,
                          'quantityUsedPerProduct',
                          e.target.value === '' ? '' : parseFloat(e.target.value)
                        )
                      }
                      placeholder="1"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold"
                    />
                  </td>
                  <td className="px-5 py-2.5 text-right font-mono font-bold text-xs text-slate-900">
                    {formatNaira(costPerUnit)}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {packaging.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemovePackaging(item.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-3">
        {packaging.map((item) => {
          const qtyPurchased = parseNum(item.quantityPurchased, 0);
          const price = parseNum(item.purchasePrice, 0);
          const qtyUsed = parseNum(item.quantityUsedPerProduct, 0);
          const costPerUnit = qtyPurchased > 0 ? (price / qtyPurchased) * qtyUsed : 0;

          return (
            <div
              key={item.id}
              className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onUpdatePackaging(item.id, 'name', e.target.value)}
                  placeholder="Packaging item"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                />
                {packaging.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemovePackaging(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Qty Bought
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantityPurchased}
                    onChange={(e) =>
                      onUpdatePackaging(
                        item.id,
                        'quantityPurchased',
                        e.target.value === '' ? '' : parseFloat(e.target.value)
                      )
                    }
                    placeholder="1"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Unit
                  </span>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => onUpdatePackaging(item.id, 'unit', e.target.value)}
                    placeholder="pcs"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Price (₦)
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.purchasePrice}
                    onChange={(e) =>
                      onUpdatePackaging(
                        item.id,
                        'purchasePrice',
                        e.target.value === '' ? '' : parseFloat(e.target.value)
                      )
                    }
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Qty / Product
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantityUsedPerProduct}
                    onChange={(e) =>
                      onUpdatePackaging(
                        item.id,
                        'quantityUsedPerProduct',
                        e.target.value === '' ? '' : parseFloat(e.target.value)
                      )
                    }
                    placeholder="1"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Cost / Unit:</span>
                <span className="font-mono font-bold text-slate-900">{formatNaira(costPerUnit)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Row Button */}
      <button
        type="button"
        id="add-packaging-btn"
        onClick={onAddPackaging}
        className="w-full py-2.5 text-xs text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Packaging Item</span>
      </button>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Total Packaging Items: {packaging.length}
        </span>
        <span className="text-slate-500 font-medium">
          Packaging / Unit: <strong className="font-mono text-slate-900 text-sm font-bold">{formatNaira(totalPackagingCostPerUnit)}</strong>
        </span>
      </div>
    </section>
  );
};
