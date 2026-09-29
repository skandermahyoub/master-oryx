import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { ProductItem, ProductCategory, ProductVariant } from '../../../types/store';
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  Upload,
  ScanBarcode,
  ShoppingBag,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const { storeConfig, updateStoreConfig, formatPrice } = useStore();
  const [products, setProducts] = useState<ProductItem[]>(storeConfig.products || []);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const categories = storeConfig.categories || [];

  const handleSaveAll = (updatedProducts: ProductItem[]) => {
    setProducts(updatedProducts);
    updateStoreConfig({ products: updatedProducts });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleStartAdd = () => {
    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: 'منتج ذكي جديد',
      slug: `product-${Date.now()}`,
      category: categories[0]?.id || 'general',
      tags: ['جديد'],
      shortDescription: 'نبذة موجزة عن المنتج ومميزاته الرئيسية...',
      fullDescription: 'الوصف الكامل للمنتج والمواصفات الفنية بالتفصيل...',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      basePrice: 50000,
      costPrice: 38000,
      salePrice: 45000,
      currency: storeConfig.defaultCurrency || 'YER',
      stock: 10,
      isFeatured: true,
      badge: 'جديد',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      ],
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      specs: [
        { label: 'الضمان', value: 'ضمان معتمد لمدة عام' },
        { label: 'بلد المنشأ', value: 'أصلي معتمد' },
      ],
    };
    setEditingProduct(newProd);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const updated = products.filter((p) => p.id !== id);
      handleSaveAll(updated);
    }
  };

  const handleSaveProduct = (prod: ProductItem) => {
    let updated: ProductItem[];
    if (isAdding) {
      updated = [prod, ...products];
    } else {
      updated = products.map((p) => (p.id === prod.id ? prod : p));
    }
    handleSaveAll(updated);
    setEditingProduct(null);
    setIsAdding(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, prod: ProductItem) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg = event.target.result as string;
          setEditingProduct({
            ...prod,
            images: [newImg, ...prod.images],
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>مدير المنتجات والمخزون والباركود ({products.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            إدارة الأسعار، تكلفة الشراء، كميات المخزون، والباركود للمبيعات والكاشير
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold text-center">
          تم حفظ المنتجات بنجاح وتحديث المتجر!
        </div>
      )}

      {/* Edit / Add Modal Form */}
      {editingProduct && (
        <div className="p-6 bg-slate-950 border border-amber-500/40 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-black text-amber-400">
              {isAdding ? 'إضافة منتج جديد' : `تعديل: ${editingProduct.name}`}
            </h4>
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsAdding(false);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300">اسم المنتج *</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">التصنيف *</label>
              <select
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">سعر البيع الأساسي *</label>
              <input
                type="number"
                value={editingProduct.basePrice}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">سعر الخصم / العرض (اختياري)</label>
              <input
                type="number"
                value={editingProduct.salePrice || ''}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    salePrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="اتركه فارغاً إذا لم يوجد خصم"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">
                سعر التكلفة (لحساب أرباح الكاشير)
              </label>
              <input
                type="number"
                value={editingProduct.costPrice || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">كمية المخزون *</label>
              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">الباركود (Barcode) *</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={editingProduct.barcode}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, barcode: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() =>
                    setEditingProduct({
                      ...editingProduct,
                      barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
                    })
                  }
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 rounded-xl whitespace-nowrap cursor-pointer"
                >
                  توليد باركود
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">كود الصنف (SKU) *</label>
              <input
                type="text"
                value={editingProduct.sku}
                onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300">معرض صور المنتج:</label>
            <div className="flex flex-wrap items-center gap-3">
              {editingProduct.images.map((img, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden relative border border-slate-700 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        images: editingProduct.images.filter((_, idx) => idx !== i),
                      })
                    }
                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label className="w-16 h-16 rounded-xl border border-dashed border-slate-700 hover:border-amber-500 bg-slate-900 flex flex-col items-center justify-center text-slate-400 hover:text-amber-400 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-[9px] mt-1">رفع صورة</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, editingProduct)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-300">نبذة موجزة:</label>
              <input
                type="text"
                value={editingProduct.shortDescription}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">الوصف التفصيلي:</label>
              <textarea
                rows={3}
                value={editingProduct.fullDescription}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, fullDescription: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsAdding(false);
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => handleSaveProduct(editingProduct)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ بيانات المنتج</span>
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="p-3.5 font-bold">الصورة</th>
                <th className="p-3.5 font-bold">اسم المنتج</th>
                <th className="p-3.5 font-bold">الباركود / SKU</th>
                <th className="p-3.5 font-bold">سعر البيع</th>
                <th className="p-3.5 font-bold">التكلفة</th>
                <th className="p-3.5 font-bold">المخزون</th>
                <th className="p-3.5 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white max-w-xs truncate">{p.name}</div>
                    <span className="text-[10px] text-slate-500">{p.category}</span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-300">
                    <div className="text-amber-400 font-bold">{p.barcode}</div>
                    <div className="text-slate-500">{p.sku}</div>
                  </td>
                  <td className="p-3 font-black text-amber-400">
                    {formatPrice(p.salePrice || p.basePrice)}
                    {p.salePrice && (
                      <span className="block text-[10px] text-slate-500 line-through">
                        {formatPrice(p.basePrice)}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-400 font-mono">
                    {p.costPrice ? formatPrice(p.costPrice) : 'غير محدد'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        p.stock > 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} قطعة` : 'نفذ'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(p);
                          setIsAdding(false);
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                        title="تعديل"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-2 bg-slate-900 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
