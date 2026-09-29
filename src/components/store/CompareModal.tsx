import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ArrowLeftRight, Trash2, ShoppingBag, Star, Check } from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    isCompareOpen,
    setIsCompareOpen,
    compareList,
    removeFromCompare,
    clearCompare,
    formatPrice,
    addToCart,
  } = useStore();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              مقارنة المنتجات والمواصفات ({compareList.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                مسح المقارنة
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCompareOpen(false)}
              className="p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6">
          {compareList.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-slate-500">
              <ArrowLeftRight className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
              <p className="text-sm font-bold text-slate-400">لا توجد منتجات للمقارنة</p>
              <p className="text-xs text-slate-500">
                اضغط على زر المقارنة في أي منتج لإضافته ومقارنة الأسعار والمواصفات جنباً إلى جنب.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-3 text-slate-400 font-bold w-32 bg-slate-950/60 rounded-r-2xl">
                      المنتج
                    </th>
                    {compareList.map((product) => (
                      <th
                        key={product.id}
                        className="p-4 bg-slate-950/40 border-r border-slate-800/80 min-w-[200px]"
                      >
                        <div className="space-y-2 text-right">
                          <div className="flex justify-between items-start">
                            <button
                              type="button"
                              onClick={() => removeFromCompare(product.id)}
                              className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-800"
                            />
                          </div>
                          <h4 className="font-bold text-white text-xs line-clamp-2">
                            {product.name}
                          </h4>
                          <div className="text-sm font-black text-amber-400">
                            {formatPrice(product.salePrice || product.basePrice)}
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>أضف للسلة</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {/* Category */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400 bg-slate-950/60">التصنيف</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-white border-r border-slate-800/80">
                        {p.category}
                      </td>
                    ))}
                  </tr>
                  {/* Stock */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400 bg-slate-950/60">حالة التوفر</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 border-r border-slate-800/80">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock > 0
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {p.stock > 0 ? `متوفر (${p.stock} قطعة)` : 'غير متوفر'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Rating */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400 bg-slate-950/60">التقييم</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 border-r border-slate-800/80">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold">{p.rating}</span>
                          <span className="text-slate-500">({p.reviewCount})</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* SKU & Barcode */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400 bg-slate-950/60">الباركود والكود</td>
                    {compareList.map((p) => (
                      <td
                        key={p.id}
                        className="p-3 text-slate-300 font-mono text-[10px] border-r border-slate-800/80"
                      >
                        <div>SKU: {p.sku}</div>
                        <div>Barcode: {p.barcode}</div>
                      </td>
                    ))}
                  </tr>
                  {/* Summary */}
                  <tr>
                    <td className="p-3 font-bold text-slate-400 bg-slate-950/60">نبذة مختصرة</td>
                    {compareList.map((p) => (
                      <td
                        key={p.id}
                        className="p-3 text-slate-300 leading-relaxed border-r border-slate-800/80"
                      >
                        {p.shortDescription}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
